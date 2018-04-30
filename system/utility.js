__globals.utility = new function(){
    this.workspace = new function(){
        this.currentPosition = function(){
            return __globals.utility.element.getTransform(__globals.panes.global);
        };
        this.gotoPosition = function(x,y,z,r){
            __globals.utility.element.setTransform(__globals.panes.global, {x:x,y:y,s:z,r:r});
        };
        this.getPane = function(element){
            while( !element.getAttribute('pane') ){ element = element.parentElement; }
            return element;
        };
        this.objectUnderPoint = function(x,y){
            var temp = document.elementFromPoint(x,y);
            if(temp.hasAttribute('workspace')){return null;}
    
            while(!temp.parentElement.hasAttribute('pane')){ 
                temp = temp.parentElement;
            }
    
            return temp;
        };
        this.pointConverter = new function(){
            this.browser2workspace = function(x,y){
                var globalTransform = __globals.utility.element.getTransform(__globals.panes.global);
                return {'x':(x-globalTransform.x)/globalTransform.s, 'y':(y-globalTransform.y)/globalTransform.s};
            };
            this.workspace2browser = function(x,y){
                var globalTransform = __globals.utility.element.getTransform(__globals.panes.global);
                return {'x':(x*globalTransform.s)+globalTransform.x, 'y':(y*globalTransform.s)+globalTransform.y};
            };
        };
        this.dotMaker = function(x,y,text,r=0,style='fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;'){
            var dot = parts.basic.circle(null, x, y, r, 0, style);
            var textElement = parts.basic.text(null, x+r, y, text, 0, style);
            __globals.panes.foreground.appendChild(dot);
            __globals.panes.foreground.appendChild(textElement);
        };
    };
    this.element = new function(){
        this.getTransform = function(element){
            var pattern = /[-+]?[0-9]*\.?[0-9]+/g;
            var result = element.style.transform.match( pattern ).map(Number);
    
            if(result.length < 4){ result[3] = 0; }

            return {x:result[0],y:result[1],s:result[2],r:result[3]};
        };
        this.getCumulativeTransform = function(element){
            data = this.getTransform(element);
            while( !element.parentElement.getAttribute('pane') ){
                element = element.parentElement;
                var newData = this.getTransform(element);
                data.x += newData.x;
                data.y += newData.y;
            }
            return data;
        };
        this.setTransform = function(element, transform){
            element.style.transform = 'translate('+transform.x+'px, '+transform.y+'px) scale('+transform.s+') rotate(' +transform.r+ 'rad)';
        };
        this.setTransform_XYonly = function(element, x, y){
            var transformData = this.getTransform(element);
            if(x!=null){transformData.x = x;}
            if(y!=null){transformData.y = y;}
            this.setTransform( element, transformData );
        };
        this.setStyle = function(element, style){
            var transform = this.getTransform(element); 
            element.style = style;
            this.setTransform(element, transform);
        };
        this.setRotation = function(element, rotation){
            var pattern = /rotate\(([-+]?[0-9]*\.?[0-9]+)/;
            element.style.transform = element.style.transform.replace( pattern, 'rotate('+rotation );
        };
        this.getBoundingBox = function(element){
            var tempG = document.createElementNS('http://www.w3.org/2000/svg','g');
            __globals.panes.global.append(tempG);
    
            element = element.cloneNode(true);
            tempG.append(element);
            var temp = element.getBBox();
            tempG.remove();
            
            return temp;
        };
        this.makeUnselectable = function(element){
            element.style['-webkit-user-select'] = 'none';
            element.style['-moz-user-select'] = 'none';
            element.style['-ms-user-select'] = 'none';
            element.style['user-select'] = 'none';
        };
    };
    this.object = new function(){
        this.requestInteraction = function(x,y,type){
            if(!x || !y){return true;}
            var temp = document.elementFromPoint(x,y);
    
            if(temp.hasAttribute('workspace')){return true;}
            while(!temp.hasAttribute('pane')){ 
                if(temp[type] || temp.hasAttribute(type)){return false;}
                temp = temp.parentElement;
            }
            
            return true;
        };
        this.disconnectEverything = function(object){
            console.warn('you\'re using this?');
            // var keys = Object.keys(object.io);
            // for(var a = 0; a < keys.length; a++){
            //     object.io[keys[a]].disconnect();
            // }
        };
        this.generateSelectionArea = function(points, object){
            object.selectionArea = {};
            object.selectionArea.box = [];
            object.selectionArea.points = [];
            object.updateSelectionArea = function(){
                //the main shape we want to use
                object.selectionArea.points = [];
                points.forEach(function(item){
                    object.selectionArea.points.push( {x:item.x, y:item.y} );
                });
                object.selectionArea.box = __globals.utility.math.boundingBoxFromPoints(object.selectionArea.points);

                //adjusting it for the object's position in space
                temp = __globals.utility.element.getTransform(object);
                object.selectionArea.box.forEach(function(element) {
                    element.x += temp.x;
                    element.y += temp.y;
                });
                object.selectionArea.points.forEach(function(element) {
                    element.x += temp.x;
                    element.y += temp.y;
                });
            };

            object.updateSelectionArea();
        };
    };
    this.math = new function(){
        this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        this.polar2cartesian = function(angle,distance){
            return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
        };
        this.cartesian2polar = function(x,y){
            var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;
    
            if(x === 0 ){
                if(y === 0){ang = 0;}
                else if(y > 0){ang = 0.5*Math.PI;}
                else{ang = 1.5*Math.PI;}
            }
            else if(y === 0 ){
                if(x >= 0){ang = 0;}else{ang = Math.PI;}
            }
            else if(x >= 0){ ang = Math.atan(y/x); }
            else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }
    
            return {'dis':dis,'ang':ang};
        };
        this.boundingBoxFromPoints = function(points){
            var left = points[0].x; var right = points[0].x;
            var top = points[0].y;  var bottom = points[0].y;
    
            for(var a = 1; a < points.length; a++){
                if( points[a].x < left ){ left = points[a].x; }
                else if(points[a].x > right){ right = points[a].x; }
    
                if( points[a].y < top ){ top = points[a].y; }
                else if(points[a].y > bottom){ bottom = points[a].y; }
            }
    
            return [{x:left,y:top},{x:right,y:bottom}];
        };
        this.intersectionOfTwoLineSegments = function(segment1, segment2){
            var denominator = (segment2[1].y-segment2[0].y)*(segment1[1].x-segment1[0].x) - (segment2[1].x-segment2[0].x)*(segment1[1].y-segment1[0].y);
            if(denominator == 0){return null;}
    
            var u1 = ((segment2[1].x-segment2[0].x)*(segment1[0].y-segment2[0].y) - (segment2[1].y-segment2[0].y)*(segment1[0].x-segment2[0].x))/denominator;
            var u2 = ((segment1[1].x-segment1[0].x)*(segment1[0].y-segment2[0].y) - (segment1[1].y-segment1[0].y)*(segment1[0].x-segment2[0].x))/denominator;;
            return {
                'x':      (segment1[0].x + u1*(segment1[1].x-segment1[0].x)),
                'y':      (segment1[0].y + u1*(segment1[1].y-segment1[0].y)),
                'inSeg1': (u1 >= 0 && u1 <= 1),
                'inSeg2': (u2 >= 0 && u2 <= 1)
            };
        };
        this.detectOverlap = function(poly_a, poly_b, box_a, box_b){
            // Quick Judgement with bounding boxes
            // (when bounding boxes are provided)
            if(box_a && box_b){
                // clearly separate shapes
                if(
                    (
                        (box_a[0].x < box_b[0].x && box_a[0].x < box_b[1].x) ||
                        (box_a[1].x > box_b[0].x && box_a[1].x > box_b[1].x) ||
                        (box_a[0].y < box_b[0].y && box_a[0].y < box_b[1].y) ||
                        (box_a[1].y > box_b[0].y && box_a[1].y > box_b[1].y) 
                    )
                ){console.log('clearly separate shapes');return false;}
            }
    
            // Detailed Judgement
                function distToSegmentSquared(p, a, b){
                    function distanceBetweenTwoPoints(a, b){ return Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) }
    
                    var lineLength = distanceBetweenTwoPoints(a, b);               //get length of line segment
                    if (lineLength == 0){return distanceBetweenTwoPoints(p, a);}   //if line segment length is zero, just return the distance between a line point and the point
                    
                    var t = ((p.x-a.x) * (b.x-a.x) + (p.y-a.y) * (b.y-a.y)) / lineLength;
                    t = Math.max(0, Math.min(1, t));
                    return distanceBetweenTwoPoints(p, { 'x': a.x + t*(b.x-a.x), 'y': a.y + t*(b.y-a.y) });
                }
                function sideOfLineSegment(p, a, b){
                    //get side that the point is on ('true' is 'inside')
                    return ((b.x-a.x)*(p.y-a.y) - (p.x-a.x)*(b.y-a.y))>0;
                }
    
    
                //a point from A is in B
                // run through each point of poly 'A' and each side of poly 'B'
                // for each point in A, find the closest side of B and determine what side that point is on
                // if any point of A is inside B, declare an overlap
                var poly_b_clone = Object.assign([], poly_b); //because of referencing 
                poly_b_clone.push(poly_b[0]);
                for(var b = 0; b < poly_a.length; b++){
                    var tempSmallestDistance = {'dis':Number.MAX_SAFE_INTEGER,'side':false};
                    for(var a = 0; a < poly_b_clone.length-1; a++){
                        var linePoint_1 = {'x':poly_b_clone[a].x,'y':poly_b_clone[a].y};
                        var linePoint_2 = {'x':poly_b_clone[a+1].x,'y':poly_b_clone[a+1].y};
                        var point = {'x':poly_a[b].x,'y':poly_a[b].y};
                            //reformat data into line-segment points and the point of interest
    
                        var dis = distToSegmentSquared(point,linePoint_1,linePoint_2);
                            if(dis==0){console.log('oh hay, collision - AinB');return true; }
                            //get distance from point to line segment
                            //if zero, it's a collision and we can end early
    
                        if( tempSmallestDistance.dis > dis ){ 
                            //if this distance is the smallest found in this round, save the distance and side
                            tempSmallestDistance.dis = dis; 
                            tempSmallestDistance.side = sideOfLineSegment(point, linePoint_1, linePoint_2);
                        }
                    }
                    if( tempSmallestDistance.side ){console.log('a point from A is in B');return true;}
                }
                //a point from B is in A
                // same as above, but the other way around
                var poly_a_clone = Object.assign([], poly_a); //because of referencing 
                poly_a_clone.push(poly_a[0]);
                for(var b = 0; b < poly_b.length; b++){
                    var tempSmallestDistance = {'dis':Number.MAX_SAFE_INTEGER,'side':false};
                    for(var a = 0; a < poly_a_clone.length-1; a++){
                        var linePoint_1 = {'x':poly_a_clone[a].x,'y':poly_a_clone[a].y};
                        var linePoint_2 = {'x':poly_a_clone[a+1].x,'y':poly_a_clone[a+1].y};
                        var point = {'x':poly_a[b].x,'y':poly_a[b].y};
                            //reformat data into line-segment points and the point of interest
    
                        var dis = distToSegmentSquared(point,linePoint_1,linePoint_2);
                            if(dis==0){console.log('oh hay, collision - BinA');return true; }
                            //get distance from point to line segment
                            //if zero, it's a collision and we can end early
    
                        if( tempSmallestDistance.dis > dis ){ 
                            //if this distance is the smallest found in this round, save the distance and side
                            tempSmallestDistance.dis = dis; 
                            tempSmallestDistance.side = sideOfLineSegment(point, linePoint_1, linePoint_2);
                            testTemp = point;
                            testTempA = linePoint_1;
                            testTempB = linePoint_2;
                        }
                    }
                    if( tempSmallestDistance.side ){console.log('a point from B is in A');return true;}
                }
    
                //side intersection
                // compare each side of each poly to every other side, looking for lines that
                // cross each other. If a crossing is found at any point; return true
                    for(var a = 0; a < poly_a_clone.length-1; a++){
                        for(var b = 0; b < poly_b_clone.length-1; b++){
                            var data = this.intersectionOfTwoLineSegments(poly_a_clone, poly_b_clone);
                            if(!data){continue;}
                            if(data.inSeg1 && data.inSeg2){console.log('point intersection at ' + data.x + ' ' + data.y);return true;}
                        }
                    }
    
            return false;
        };
        this.curveGenerator = new function(){
            this.linear = function(stepCount=2, start=0, end=1){
                stepCount = Math.abs(stepCount)-1; var outputArray = [0];
                for(var a = 1; a < stepCount; a++){ 
                    outputArray.push(a/stepCount);
                }
                outputArray.push(1); 

                var mux = end-start;
                for(var a = 0 ; a < outputArray.length; a++){
                    outputArray[a] = outputArray[a]*mux + start;
                }

                return outputArray;
            };
            this.sin = function(stepCount=2, start=0, end=1){
                stepCount = Math.abs(stepCount) -1;
                var outputArray = [0];
                for(var a = 1; a < stepCount; a++){ 
                    outputArray.push(
                        Math.sin( Math.PI/2*(a/stepCount) )
                    );
                }
                outputArray.push(1); 

                var mux = end-start;
                for(var a = 0 ; a < outputArray.length; a++){
                    outputArray[a] = outputArray[a]*mux + start;
                }

                return outputArray;		
            };
            this.cos = function(stepCount=2, start=0, end=1){
                stepCount = Math.abs(stepCount) -1;
                var outputArray = [0];
                for(var a = 1; a < stepCount; a++){ 
                    outputArray.push(
                        1 - Math.cos( Math.PI/2*(a/stepCount) )
                    );
                }
                outputArray.push(1); 

                var mux = end-start;
                for(var a = 0 ; a < outputArray.length; a++){
                    outputArray[a] = outputArray[a]*mux + start;
                }

                return outputArray;	
            };
            this.s = function(stepCount=2, start=0, end=1, sharpness=8){
                var curve = [];
                for(var a = 0; a < stepCount; a++){
                    curve.push(
                        1/( 1 + Math.exp(-sharpness*((a/stepCount)-0.5)) )
                    );
                }
    
                //normalize curve
                function normalizeStretchArray(array){
                    var biggestIndex = 0;
                    for(var a = 1; a < array.length; a++){
                        if( Math.abs(array[a]) > Math.abs(array[biggestIndex]) ){
                            biggestIndex = a;
                        }
                    }
        
                    var mux = Math.abs(1/array[biggestIndex]);
        
                    for(var a = 0; a < array.length; a++){
                        array[a] = array[a]*mux;
                    }
    
                    //stretching
                    if(array[0] == 0 && array[array.length-1] == 1){return array;}
                    else if( array[0] != 0 ){
                        var pertinentValue = array[0];
                        for(var a = 0; a < array.length; a++){
                            array[a] = array[a] - pertinentValue*(1-a/(array.length-1));
                        }
                    }
                    else{
                        var pertinentValue = array[array.length-1];
                        for(var a = 0; a < array.length; a++){
                            array[a] = array[a] - pertinentValue*(a/(array.length-1));
                        }
                    }
    
                    return array;
                }

                var outputArray = normalizeStretchArray(curve);
    
                var mux = end-start;
                for(var a = 0 ; a < outputArray.length; a++){
                    outputArray[a] = outputArray[a]*mux + start;
                }

                return outputArray;
            };
            this.exponential = function(stepCount=2, start=0, end=1){
                var stepCount = stepCount-1;
                var outputArray = [];
                
                for(var a = 0; a <= stepCount; a++){
                    outputArray.push( (Math.exp(a/stepCount)-1)/(Math.E-1) ); // Math.E == Math.exp(1)
                }

                var mux = end-start;
                for(var a = 0 ; a < outputArray.length; a++){
                    outputArray[a] = outputArray[a]*mux + start;
                }
    
                return outputArray;
            };
        };
    };
};