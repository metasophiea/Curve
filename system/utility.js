// utility
//    workspace
//        currentPosition                 ()
//        gotoPosition                    (x,y,z,r)
//        getPane                         (element)
//        getGlobal                       (element)
//        objectUnderPoint                (x,y) (browser position)
//        pointConverter
//            browser2workspace           (x,y)
//            workspace2browser           (x,y)
//        dotMaker                        (x,y,text,r=0,style='fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;')
//        getGlobalScale                  (element)
//        getViewportDimensions           ()
//    
//    element
//        getTransform                    (element)
//        getCumulativeTransform          (element)
//        setTransform                    (element, transform:{x:0, y:0, s:1, r:0})
//        setTransform_XYonly             (element, x, y)
//        setStyle                        (element, style)
//        setRotation                     (element, rotation)
//        getBoundingBox                  (element)
//        makeUnselectable                (element)
//    
//    object
//        requestInteraction              (x,y,type) (browser position)
//        disconnectEverything            (object)
//        generateSelectionArea           (points:[{x:0,y:0},...], object)
//    
//    audio
//        changeAudioParam                (audioParam,target,time,curve,cancelScheduledValues=true)
//    
//    math
//        averageArray                    (array)
//        polar2cartesian                 (angle,distance)
//        cartesian2polar                 (x,y)
//        boundingBoxFromPoints           (points:[{x:0,y:0},...])
//        intersectionOfTwoLineSegments   (segment1:{{x:0,y:0},{x:0,y:0}}, segment2:{{x:0,y:0},{x:0,y:0}})
//        detectOverlap                   (poly_a:[{x:0,y:0},...], poly_b:[{x:0,y:0},...], box_a:[{x:0,y:0},{x:0,y:0}]=null, box_b:[{x:0,y:0},{x:0,y:0}]=null)
//        curveGenerator
//            linear                      (stepCount, start=0, end=1)
//            sin                         (stepCount, start=0, end=1)
//            cos                         (stepCount, start=0, end=1)
//            s                           (stepCount, start=0, end=1, sharpness=8)
//            exponential                 (stepCount, start=0, end=1)
//    
//    experimental
//         elementMaker                   (type,name,data)
//         objectBuilder                  (creatorMethod,design)

__globals.utility = new function(){
    this.workspace = new function(){
        this.currentPosition = function(){
            return __globals.utility.element.getTransform(__globals.panes.workspace);
        };
        this.gotoPosition = function(x,y,z,r){
            __globals.utility.element.setTransform(__globals.panes.workspace, {x:x,y:y,s:z,r:r});
        };
        this.getPane = function(element){
            while( !element.getAttribute('pane') ){ element = element.parentElement; }
            return element;
        };
        this.getGlobal = function(element){
            while( !element.getAttribute('global') ){ element = element.parentElement; }
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
                var globalTransform = __globals.utility.element.getTransform(__globals.panes.workspace);
                return {'x':(x-globalTransform.x)/globalTransform.s, 'y':(y-globalTransform.y)/globalTransform.s};
            };
            this.workspace2browser = function(x,y){
                var globalTransform = __globals.utility.element.getTransform(__globals.panes.workspace);
                return {'x':(x*globalTransform.s)+globalTransform.x, 'y':(y*globalTransform.s)+globalTransform.y};
            };
        };
        this.dotMaker = function(x,y,text,r=0,style='fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;'){
            var g = parts.basic.g(null, x, y);
            var dot = parts.basic.circle(null, 0, 0, r, 0, style);
            var textElement = parts.basic.text(null, r, 0, text, 0, style);
            g.appendChild(dot);
            g.appendChild(textElement);
            return g;
        };
        this.getGlobalScale = function(element){
            return __globals.utility.element.getTransform(__globals.utility.workspace.getGlobal(element)).s
        };
        this.getViewportDimensions = function(){
            return {width:__globals.svgElement.width.baseVal.value, height:__globals.svgElement.height.baseVal.value};
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
            __globals.panes.workspace.append(tempG);
    
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
        this.requestInteraction = function(x,y,type,globalName){
            if(!x || !y){return true;}
            var temp = document.elementFromPoint(x,y);
    
            if(temp.hasAttribute('workspace')){return true;}
            while(!temp.hasAttribute('global')){
                if(temp[type] || temp.hasAttribute(type)){return false;}
                temp = temp.parentElement;
            }
            
            return temp.getAttribute('pane')==globalName;
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
    this.audio = new function(){
        this.changeAudioParam = function(context,audioParam,target,time,curve,cancelScheduledValues=true){
            if(target==null){return audioParam.value;}

            if(cancelScheduledValues){ audioParam.cancelScheduledValues(context.currentTime); }

            try{
                switch(curve){
                    case 'linear': 
                        audioParam.linearRampToValueAtTime(target, context.currentTime+time);
                    break;
                    case 'exponential':
                        console.warn('2018-4-18 - changeAudioParam:exponential doesn\'t work on chrome');
                        if(target == 0){target = 1/10000;}
                        audioParam.exponentialRampToValueAtTime(target, context.currentTime+time);
                    break;
                    case 's':
                        var mux = target - audioParam.value;
                        var array = __globals.utility.math.curveGenerator.s(10);
                        for(var a = 0; a < array.length; a++){
                            array[a] = audioParam.value + array[a]*mux;
                        }
                        audioParam.setValueCurveAtTime(new Float32Array(array), context.currentTime, time);
                    break;
                    case 'instant': default:
                        audioParam.setTargetAtTime(target, context.currentTime, 0.001);
                    break;
                }
            }catch(e){console.log('could not change param (probably due to an overlap)');console.log(e);}
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
    this.experimental = new function(){
        this.elementMaker = function(type,name,data){
            if(!data.style){data.style={};}

            switch(type){
                default: console.warn('Unknown element: '+ type); return null; break;

                //basic
                    case 'rect': return parts.basic.rect(name, data.x, data.y, data.width, data.height, data.angle, data.style); break;
                    case 'path': return parts.basic.path(name, data.path, data.lineType, data.style); break;
                    case 'text': return parts.basic.text(name, data.x, data.y, data.text, data.angle, data.style); break;
                
                //display
                    case 'label': return parts.display.label(name, data.x, data.y, data.text, data.style, data.angle); break;
                    case 'level': return parts.display.level(name, data.x, data.y, data.angle, data.width, data.height, data.style.backing, data.style.level); break;
                    case 'meter_level': return parts.display.meter_level(name, data.x, data.y, data.angle, data.width, data.height, data.markings, data.style.backing, data.style.levels, data.style.marking); break;
                    case 'audio_meter_level': return parts.display.audio_meter_level(name, data.x, data.y, data.angle, data.width, data.height, data.markings, data.style.backing, data.style.levels, data.style.marking); break;
                    case 'sevenSegmentDisplay': return parts.display.sevenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.style.background, data.style.glow, data.style.dim); break;
                    case 'sixteenSegmentDisplay': return parts.display.sixteenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.style.background, data.style.glow, data.style.dime); break;
                    case 'readout_sixteenSegmentDisplay': return parts.display.readout_sixteenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.count, data.style.background, data.style.glow, data.style.dime); break;
                    case 'rastorDisplay': return parts.display.rastorDisplay(name, data.x, data.y, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage); break;
                    case 'glowbox_rect': return parts.display.glowbox_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim); break;
                    case 'grapher': return parts.display.grapher(name, data.x, data.y, data.width, data.height, data.style.middleground, data.style.background, data.style.backgroundText, data.style.backing); break;
                    case 'grapher_periodicWave': return parts.display.grapher_periodicWave(name, data.x, data.y, data.width, data.height, data.style.middleground, data.style.background, data.style.backgroundText, data.style.backing); break;
                    case 'grapher_audioScope': return parts.display.grapher_audioScope(name, data.x, data.y, data.width, data.height, data.style.middleground, data.style.background, data.style.backgroundText, data.style.backing); break;

                //control
                    case 'button_rect': 
                        var temp = parts.control.button_rect(name, data.x, data.y, data.width, data.height, data.angle ,data.style.up, data.style.hover, data.style.down, data.style.glow);
                        temp.onmouseup =    data.onmouseup    ? data.onmouseup    : temp.onmouseup   ;
                        temp.onmousedown =  data.onmousedown  ? data.onmousedown  : temp.onmousedown ;
                        temp.onmouseenter = data.onmouseenter ? data.onmouseenter : temp.onmouseenter;
                        temp.onmouseleave = data.onmouseleave ? data.onmouseleave : temp.onmouseleave;
                        temp.onmousemove =  data.onmousemove  ? data.onmousemove  : temp.onmousemove ;
                        temp.onclick =      data.onclick      ? data.onclick      : temp.onclick     ;
                        temp.ondblclick =   data.ondblclick   ? data.ondblclick   : temp.ondblclick  ;
                        return temp;
                    break;
                    case 'checkbox_rect':
                        var temp = parts.control.checkbox_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow);
                        temp.onchange = data.onchange ? data.onchange : temp.onchange;
                        return temp;
                    break;
                    case 'key_rect':
                        var temp = parts.control.key_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.off, data.style.press, data.style.glow, data.style.pressAndGlow);
                        temp.onkeyup =   data.onkeyup   ? data.onkeyup   : temp.onkeyup;
                        temp.onkeydown = data.onkeydown ? data.onkeydown : temp.onkeydown;
                        return temp;
                    break;
                    case 'slide_vertical':
                        var temp = parts.control.slide_vertical(name, data.x, data.y, data.width, data.height, data.style.handle, data.style.backing, data.style.slot);
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'slide_horizontal':
                        var temp = parts.control.slide_horizontal(name, data.x, data.y, data.width, data.height, data.style.handle, data.style.backing, data.style.slot);
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'slidePanel_vertical':
                        var temp = parts.control.slidePanel_vertical(name, data.x, data.y, data.width, data.height, data.count, data.style.handle, data.style.backing, data.style.slot);
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'slidePanel_horizontal':
                        var temp = parts.control.slidePanel_horizontal(name, data.x, data.y, data.width, data.height, data.count, data.style.handle, data.style.backing, data.style.slot);
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'dial_continuous': 
                        var temp = parts.control.dial_continuous(
                            name,
                            data.x, data.y, data.r,
                            data.startAngle, data.maxAngle,
                            data.style.handle, data.style.slot, data.style.needle,
                            data.arcDistance, data.style.outerArc
                        );
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'dial_discrete':
                        var temp = parts.control.dial_discrete(
                            name,
                            data.x, data.y, data.r,
                            data.optionCount,
                            data.startAngle, data.maxAngle,
                            data.style.handle, data.style.slot, data.style.needle,
                            data.arcDistance, data.style.outerArc
                        );
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'rastorgrid':
                        var temp = parts.control.rastorgrid(
                            name,
                            data.x, data.y, data.width, data.height,
                            data.xCount, data.yCount,
                            data.style.backing,
                            data.style.check,
                            data.style.backingGlow,
                            data.style.checkGlow
                        );
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        return temp;
                    break;

                //dynamic
                    case 'connectionNode_audio': return parts.dynamic.connectionNode_audio(name, data.type, data.x, data.y, data.width, data.height, __globals.audio.context); break;
                    case 'connectionNode_data': 
                        var temp = parts.dynamic.connectionNode_data(name, data.x, data.y, data.width, data.height, data.angle);
                        temp.receive = data.receive;
                        temp.give = data.give;
                        return temp;
                    break;
            }
        }; 
        this.objectBuilder = function(creatorMethod,design){
            //main
                var obj = parts.basic.g(design.type, design.x, design.y);

            //generate selection area
                __globals.utility.object.generateSelectionArea(design.base.points, obj);
            //backing
                design.base = parts.basic.path(null, design.base.points, 'L', design.base.style);
                obj.append(design.base);
            //declare grapple
                __globals.mouseInteraction.declareObjectGrapple(design.base, obj, creatorMethod);

            //generate elements
                if(design.elements){
                    for(var a = 0; a < design.elements.length; a++){
                        if(!design[design.elements[a].type]){design[design.elements[a].type]={};}
                        if(design.elements[a].name in design[design.elements[a].type]){console.warn('error: element with the name "'+design.elements[a].name+'" already exists. Element:',design.elements[a],'will not be added');continue;}
                        design[design.elements[a].type][design.elements[a].name] = __globals.utility.experimental.elementMaker(design.elements[a].type,design.elements[a].name,design.elements[a].data);
                        obj.append(design[design.elements[a].type][design.elements[a].name]);
                    }
                }

            //io setup
                obj.io = {};
                if(design.connectionNode_audio){
                    var keys = Object.keys(design.connectionNode_audio);
                    for(var a = 0; a < keys.length; a++){
                        if(keys[a] in obj.io){console.warn('error: connection node with the name "'+keys[a]+'" already exists in the .io group. Node ',design.connectionNode_data[keys[a]],' will not be added');continue;}
                        obj.io[keys[a]] = design.connectionNode_audio[keys[a]];
                    }
                }
                if(design.connectionNode_data){
                    var keys = Object.keys(design.connectionNode_data);
                    for(var a = 0; a < keys.length; a++){
                        if(keys[a] in obj.io){console.warn('error: connection node with the name "'+keys[a]+'" already exists in the .io group. Node ',design.connectionNode_data[keys[a]],' will not be added');continue;}
                        obj.io[keys[a]] = design.connectionNode_data[keys[a]];
                    }
                }

            return obj;
        };
    };
};