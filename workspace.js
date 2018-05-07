// (function(){
    var __svgElements = document.getElementsByTagName('svg');
    for(var __svgElements_count = 0; __svgElements_count < __svgElements.length; __svgElements_count++){
        if( __svgElements[__svgElements_count].hasAttribute('workspace') ){
            var __globals = {};
            __globals.svgElement = __svgElements[__svgElements_count];

// utility
// workspace
//     currentPosition                 ()
//     gotoPosition                    (x,y,z,r)
//     getPane                         (element)
//     objectUnderPoint                (x,y) (browser position)
//     pointConverter
//         browser2workspace           (x,y)
//         workspace2browser           (x,y)
//     dotMaker                        (x,y,text,r=0,style='fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;')
//
// element
//     getTransform                    (element)
//     getCumulativeTransform          (element)
//     setTransform                    (element, transform:{x:0, y:0, s:1, r:0})
//     setTransform_XYonly             (element, x, y)
//     setStyle                        (element, style)
//     setRotation                     (element, rotation)
//     getBoundingBox                  (element)
//     makeUnselectable                (element)
//
// object
//     requestInteraction              (x,y,type) (browser position)
//     disconnectEverything            (object)
//     generateSelectionArea           (points:[{x:0,y:0},...], object)
//
// audio
//     changeAudioParam                (audioParam,target,time,curve,cancelScheduledValues=true)
//
// math
//     averageArray                    (array)
//     polar2cartesian                 (angle,distance)
//     cartesian2polar                 (x,y)
//     boundingBoxFromPoints           (points:[{x:0,y:0},...])
//     detectOverlap                   (poly_a:[{x:0,y:0},...], poly_b:[{x:0,y:0},...], box_a:[{x:0,y:0},{x:0,y:0}]=null, box_b:[{x:0,y:0},{x:0,y:0}]=null)
//     curveGenerator
//         linear                      (stepCount, start=0, end=1)
//         sin                         (stepCount, start=0, end=1)
//         cos                         (stepCount, start=0, end=1)
//         s                           (stepCount, start=0, end=1, sharpness=8)
//         exponential                 (stepCount, start=0, end=1)

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
};
__globals.panes = {'global':null, 'background':null, 'middleground':null, 'foreground':null, 'menu':null};

if( __globals.svgElement.children ){
    //go through SVG and see if the 'global', 'background', 'middleground', 'foreground' and 'menu' elements have already been made
    for(var a = 0; a < __globals.svgElement.children.length; a++){
        if( __globals.svgElement.children[a].hasAttribute('pane') ){
            switch(__globals.svgElement.children[a].getAttribute('pane')){
                case 'global': __globals.panes.global = __globals.svgElement.children[a]; break;
                case 'background': __globals.panes.background = __globals.svgElement.children[a]; break;
                case 'middleground': __globals.panes.middleground = __globals.svgElement.children[a]; break;
                case 'foreground': __globals.panes.foreground = __globals.svgElement.children[a]; break;
                case 'menu': __globals.panes.menu = __globals.svgElement.children[a]; break;
            }
        }
    }

    //if the 'background', 'middleground' or 'menu' elements were not made, create them
    if(__globals.panes.global == null){ __globals.panes.global = document.createElementNS('http://www.w3.org/2000/svg','g'); }
    if(__globals.panes.background == null){ 
        __globals.panes.background = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.background.setAttribute('pane','background');
    }
    if(__globals.panes.middleground == null){ 
        __globals.panes.middleground = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.middleground.setAttribute('pane','middleground');
    }
    if(__globals.panes.foreground == null){ 
        __globals.panes.foreground = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.foreground.setAttribute('pane','foreground');
    }
    if(__globals.panes.menu == null){ 
        __globals.panes.menu = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.menu.setAttribute('pane','menu'); 
    }
}

//make panes unselectable
__globals.utility.element.makeUnselectable(__globals.panes.background );
__globals.utility.element.makeUnselectable(__globals.panes.middleground );
__globals.utility.element.makeUnselectable(__globals.panes.foreground );


//setup global
if(!__globals.panes.global.style.transform){ __globals.panes.global.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
__globals.panes.global.setAttribute('global',true);

//clear out svg element
__globals.svgElement.innerHTML = '';

//add __globals.panes to svg element
__globals.svgElement.append(__globals.panes.global);
__globals.panes.global.append(__globals.panes.background);
__globals.panes.global.append(__globals.panes.middleground);
__globals.panes.global.append(__globals.panes.foreground);
__globals.svgElement.append(__globals.panes.menu);
//setup selected objects spaces and functionality
__globals.selection = new function(){
    this.selectedObjects = [];
    this.lastSelectedObject = null;
    this.clipboard = [];
        // pane                 -   the pane the object came from
        // objectConstructor    -   the creation function of the object
        // originalsPosition    -   the X and Y of the original object
        // data                 -   the exported data from the original object
        // connections          -   an array of where to connect what
        //                              originPort
        //                              destinationPort
        //                              indexOfDestinationObject



    this.deselectEverything = function(except=[]){
        var newList = [];

        for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
            if( except.includes(__globals.selection.selectedObjects[a]) ){
                newList.push(__globals.selection.selectedObjects[a]);
            }else{
                if(__globals.selection.selectedObjects[a].onDeselect){__globals.selection.selectedObjects[a].onDeselect();}
            }
        }
        __globals.selection.selectedObjects = newList;
    };
    this.selectObject = function(object){
        if(object.onSelect){object.onSelect();}
        __globals.selection.selectedObjects.push(object);
        __globals.selection.lastSelectedObject = object;
    };
    this.deselectObject = function(object){
        __globals.selection.selectedObjects.splice(__globals.selection.selectedObjects.indexOf(object),1);
        object.onDeselect();
    };



    this.cut = function(){
        this.copy();
        this.delete();
    };
    this.copy = function(){
        this.clipboard = [];

        for( var a = 0; a < this.selectedObjects.length; a++){
            var newEntry = [];   

            //pane
                newEntry.push( __globals.utility.workspace.getPane(this.selectedObjects[a]) );

            //objectConstructor
                //if the object doesn't have a constructor, don't bother with any of this
                // in-fact; deselect it altogether and move on to the next object
                if( !this.selectedObjects[a].creatorMethod ){
                    __globals.selection.deselectObject(this.selectedObjects[a]);
                    a--; continue;
                }
                newEntry.push( this.selectedObjects[a].creatorMethod );

            //originalsPosition
                newEntry.push( __globals.utility.element.getTransform(this.selectedObjects[a]) );

            //data
                if( this.selectedObjects[a].exportData ){
                    newEntry.push( this.selectedObjects[a].exportData() );
                }else{ newEntry.push( null ); }

            //connections
                if(this.selectedObjects[a].io){
                    var connections = [];
                    var keys = Object.keys(this.selectedObjects[a].io);
                    for(var b = 0; b < keys.length; b++){
                        var conn = [];

                        //originPort
                            conn.push(keys[b]);

                        //destinationPort and indexOfDestinationObject
                            if(!this.selectedObjects[a].io[keys[b]].foreignNode){ continue;}
                            
                            var destinationPorts = Object.keys(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement.io);
                            for(var c = 0; c < destinationPorts.length; c++){
                                if(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement.io[destinationPorts[c]] === this.selectedObjects[a].io[keys[b]].foreignNode){
                                    conn.push(destinationPorts[c]);
                                    conn.push(this.selectedObjects.indexOf(this.selectedObjects[a].io[keys[b]].foreignNode.parentElement));
                                    break;
                                }
                            }

                        if( conn[2] >= 0 ){ connections.push(conn); }
                    }
                    newEntry.push(connections);
                }

            this.clipboard.push(newEntry);
        }
    };
    this.paste = function(position=null){
        //if clipboard is empty, don't bother
            if(this.clipboard.length == 0){return;}

        //deselect everything
            this.deselectEverything();

        //position manipulation
        // if position is not set to 'duplicate', calculate new positions for the objects
            if(position != 'duplicate'){
                // collect all positions
                    var points = [];
                    this.clipboard.forEach( element => points.push(element[2]) );
                //get the bounding box of this selection, and then the top left point of that
                    var topLeft = __globals.utility.math.boundingBoxFromPoints(points)[0];
                //subtract this point from each position
                // then add on the mouses's position, or the provided position
                    if(!position){
                        // //use viewport for position (functional, but unused)
                        //     var position = __globals.utility.element.getTransform(__globals.panes.global);
                        //     position = {x:-position.x/position.s, y:-position.y/position.s};

                        //use mouse position
                            var position = __globals.utility.workspace.pointConverter.browser2workspace(__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]);
                    }
                    this.clipboard.forEach( function(element){
                        console.log(element)
                        element[2].x += position.x - topLeft.x;
                        element[2].y += position.y - topLeft.y;
                    } );
            }

        //object printing
        this.clipboard.forEach(function(item){
            // pane              = item[0]
            // objectConstructor = item[1]
            // originalsPosition = item[2]
            // data              = item[3]
            // connections       = item[4]

            //create the object with its new position
                var obj = item[1](item[2].x,item[2].y);
                if(obj.importData){obj.importData(item[3]);}

            //add the object to the pane and select it
                item[0].appendChild(obj);
                __globals.selection.selectObject(obj);

            //go through its connections, and attempt to connect them to everything they should be connected to
            // (don't worry if a object isn't avalable yet, just skip that one. Things will work out in the end)
                if(item[4]){
                    item[4].forEach(function(conn){
                        // originPort                  = conn[0]
                        // destinationPort             = conn[1]
                        // indexOfDestinationObject    = conn[2]
                        if( conn[2] < __globals.selection.selectedObjects.length ){
                            obj.io[conn[0]].connectTo( __globals.selection.selectedObjects[conn[2]].io[conn[1]] );
                        }
                    });
                }
        });
    };
    this.duplicate = function(){
        this.copy();
        this.paste('duplicate');
        this.clipboard = [];
    };
    this.delete = function(){
        while(this.selectedObjects.length > 0){
            //run the object's onDelete method
                if(this.selectedObjects[0].onDelete){this.selectedObjects[0].onDelete();}

            //run disconnect on every connection node of this object
                var keys = Object.keys(this.selectedObjects[0].io);
                for( var a = 0; a < keys.length; a++){
                    //account for node arrays
                    if( Array.isArray(this.selectedObjects[0].io[keys[a]]) ){
                        for(var c = 0; c < this.selectedObjects[0].io[keys[a]].length; c++){
                            this.selectedObjects[0].io[keys[a]][c].disconnect();
                        }
                    }else{ this.selectedObjects[0].io[keys[a]].disconnect(); }
                }

            //remove the object from the pane it's in and then from the selected objects list
                __globals.utility.workspace.getPane(this.selectedObjects[0]).removeChild(this.selectedObjects[0]);
                this.selectedObjects.shift();
        }
        this.lastSelectedObject = null;
    };

};
// utility functions
    __globals.mouseInteraction = {};
    __globals.mouseInteraction.currentPosition = [];
    __globals.mouseInteraction.wheelInterpreter = function(y){
        return y/100;
        // return y > 0 ? 1 : -1;
    };















// grapple functions
    __globals.mouseInteraction.objectGrapple_functionList = {};
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown = [];
    __globals.mouseInteraction.objectGrapple_functionList.onmouseup = [];
    __globals.mouseInteraction.declareObjectGrapple = function(grapple, target, creatorMethod){
        if(!creatorMethod){console.error('"declareObjectGrapple" requires a creatorMethod');return;}

        grapple.target = target ? target : grapple;
        grapple.target.creatorMethod = creatorMethod;
        grapple.target.grapple = grapple;
        grapple.target.style.transform = grapple.target.style.transform ? grapple.target.style.transform : 'translate(0px,0px) scale(1) rotate(0rad)';

        grapple.onmousedown = function(event){
            if(event.button != 0){return;}
            __globals.svgElement.temp_onmousedown_originalObject = this.target;

            for(var a = 0; a < __globals.mouseInteraction.objectGrapple_functionList.onmousedown.length; a++){
                var shouldRun = true;
                for(var b = 0; b < __globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[__globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ __globals.mouseInteraction.objectGrapple_functionList.onmousedown[a].function(event); break; }
            }
        };
        grapple.onmouseup = function(event){
            __globals.svgElement.temp_onmouseup_originalObject = this.target;

            for(var a = 0; a < __globals.mouseInteraction.objectGrapple_functionList.onmouseup.length; a++){
                var shouldRun = true;
                for(var b = 0; b < __globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].specialKeys.length; b++){
                    shouldRun = shouldRun && event[__globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].specialKeys[b]];
                    if(!shouldRun){break;}
                }
                if(shouldRun){ __globals.mouseInteraction.objectGrapple_functionList.onmouseup[a].function(event); break; }
            }
        };
    };

    //duplication
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':['altKey'],
            'function':function(event){
                // if mousedown occurs over an object that isn't selected; select it
                if( !__globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmousedown_originalObject) ){
                    __globals.selection.selectObject(__globals.svgElement.temp_onmousedown_originalObject);
                }

                //perform duplication
                __globals.selection.duplicate();

                //start moving the first object in the object list
                // (the movement code will handle moving the rest)
                __globals.selection.selectedObjects[0].grapple.onmousedown(
                    {
                        'x':event.x, 'y':event.y,
                        'button':0
                    }
                );

            }
        }
    );
    //general moving
    __globals.mouseInteraction.objectGrapple_functionList.onmousedown.push(
        {
            'specialKeys':[],
            'function':function(event){
                // if mousedown occurs over an object that isn't selected
                //  and if the shift key is not pressed
                //   deselect everything
                //  now, select the object we're working on is not selected
                if( !__globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmousedown_originalObject) ){
                    if(!event.shiftKey){ __globals.selection.deselectEverything(); }
                    __globals.selection.selectObject(__globals.svgElement.temp_onmousedown_originalObject);
                }

                // collect together information on the click position and the selected object's positions
                __globals.svgElement.temp_oldClickPosition = [event.x,event.y];
                __globals.svgElement.temp_oldObjectPositions = [];
                for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
                    __globals.svgElement.temp_oldObjectPositions.push( __globals.utility.element.getTransform(__globals.selection.selectedObjects[a]) );
                }

                // perform the move for all selected objects
                __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                __globals.svgElement.onmousemove = function(event){
                    for(var a = 0; a < __globals.selection.selectedObjects.length; a++){
                        var clickPosition = __globals.svgElement.temp_oldClickPosition;
                        var position = {};
                            position.x = __globals.svgElement.temp_oldObjectPositions[a].x;
                            position.y = __globals.svgElement.temp_oldObjectPositions[a].y;
                            position.s = __globals.svgElement.temp_oldObjectPositions[a].s;
                            position.r = __globals.svgElement.temp_oldObjectPositions[a].r;
                        var globalScale = __globals.utility.element.getTransform(__globals.panes.global).s;

                        position.x = (position.x-(clickPosition[0]-event.x)/globalScale);
                        position.y = (position.y-(clickPosition[1]-event.y)/globalScale);

                        __globals.utility.element.setTransform(__globals.selection.selectedObjects[a], position);

                        //perform all redraws and updates for object
                        if( __globals.selection.selectedObjects[a].onMove ){__globals.selection.selectedObjects[a].onMove();}
                        if( __globals.selection.selectedObjects[a].updateSelectionArea ){__globals.selection.selectedObjects[a].updateSelectionArea();}
                        if( __globals.selection.selectedObjects[a].io ){
                            var keys = Object.keys( __globals.selection.selectedObjects[a].io );
                            for(var b = 0; b < keys.length; b++){ 
                                //account for node arrays
                                if( Array.isArray(__globals.selection.selectedObjects[a].io[keys[b]]) ){
                                    for(var c = 0; c < __globals.selection.selectedObjects[a].io[keys[b]].length; c++){
                                        __globals.selection.selectedObjects[a].io[keys[b]][c].redraw();
                                    }
                                }else{  __globals.selection.selectedObjects[a].io[keys[b]].redraw(); }
                            }
                        }
                    }
                };

                // clean-up code
                __globals.svgElement.onmouseup = function(){
                    this.onmousemove = null;
                    delete __globals.svgElement.tempElements;
                    this.onmousemove = __globals.svgElement.onmousemove_old;
                    delete this.temp_onmousedown_originalObject;
                    delete this.temp_oldClickPosition;
                    delete this.temp_oldObjectPositions;
                    delete this.onmouseleave;
                    delete this.onmouseup;
                };
            
                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);
            }
        }
    );
    //selection
    __globals.mouseInteraction.objectGrapple_functionList.onmouseup.push(
        {
            'specialKeys':[],
            'function':function(event){

                //if mouse-up occurs over an object that is selected
                // and if the shift key is pressed
                // and if the object we're working on is not the most recently selected
                //  deselect the object we're working on
                // now set the most recently selected reference to null
                if( __globals.selection.selectedObjects.includes(__globals.svgElement.temp_onmouseup_originalObject) ){
                    if( event.shiftKey && (__globals.selection.lastSelectedObject != __globals.svgElement.temp_onmouseup_originalObject) ){
                        __globals.selection.deselectObject(__globals.svgElement.temp_onmouseup_originalObject);
                    }
                    __globals.selection.lastSelectedObject = null;
                }

            }
        }
    );










// onmousemove functions
    __globals.mouseInteraction.onmousemove_functionList = [];
    __globals.svgElement.onmousemove = function(event){
        if(!__globals.utility.object.requestInteraction(event.x,event.y,'onmousemove')){return;}
        for(var a = 0; a < __globals.mouseInteraction.onmousemove_functionList.length; a++){
            var shouldRun = true;
            for(var b = 0; b < __globals.mouseInteraction.onmousemove_functionList[a].specialKeys.length; b++){
                shouldRun = shouldRun && event[__globals.mouseInteraction.onmousemove_functionList[a].specialKeys[b]];
                if(!shouldRun){break;}
            }
            if(shouldRun){ __globals.mouseInteraction.onmousemove_functionList[a].function(event); break; }
        }
    };

    // register position
    __globals.mouseInteraction.onmousemove_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                __globals.mouseInteraction.currentPosition = [event.x, event.y];
            }
        }
    );








// onmousedown functions
    __globals.mouseInteraction.onmousedown_functionList = [];
    __globals.svgElement.onmousedown = function(event){
        if(!__globals.utility.object.requestInteraction(event.x,event.y,'onmousedown') || event.button != 0){return;}
        for(var a = 0; a < __globals.mouseInteraction.onmousedown_functionList.length; a++){
            var shouldRun = true;
            for(var b = 0; b < __globals.mouseInteraction.onmousedown_functionList[a].specialKeys.length; b++){
                shouldRun = shouldRun && event[__globals.mouseInteraction.onmousedown_functionList[a].specialKeys[b]];
                if(!shouldRun){break;}
            }
            if(shouldRun){ __globals.mouseInteraction.onmousedown_functionList[a].function(event); break; }
        }
    };

    //group selection
    __globals.mouseInteraction.onmousedown_functionList.push(
        {
            'specialKeys':['shiftKey'],
            'function':function(event){
                    //setup
                    __globals.svgElement.tempData = {};
                    __globals.svgElement.tempElements = [];
                    __globals.svgElement.tempData.start = {'x':event.x, 'y':event.y};

                    //create 'selection box' graphic and add it to the menu pane
                    __globals.svgElement.tempElements.push(
                        parts.basic.path(
                            null, 
                            [
                                __globals.svgElement.tempData.start,
                                __globals.svgElement.tempData.start,
                                __globals.svgElement.tempData.start,
                                __globals.svgElement.tempData.start
                            ], 
                            'L', 'fill:rgba(120,120,255,0.25)'
                        )
                    );
                    for(var a = 0; a < __globals.svgElement.tempElements.length; a++){ __globals.panes.menu.append(__globals.svgElement.tempElements[a]); }

                    //adjust selection box when the mouse moves
                    __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                    __globals.svgElement.onmousemove = function(event){
                        __globals.svgElement.tempData.end = {'x':event.x, 'y':event.y};

                        __globals.svgElement.tempElements[0].path(
                            [
                                {x:__globals.svgElement.tempData.start.x, y:__globals.svgElement.tempData.start.y},
                                {x:__globals.svgElement.tempData.end.x,   y:__globals.svgElement.tempData.start.y},
                                {x:__globals.svgElement.tempData.end.x,   y:__globals.svgElement.tempData.end.y},
                                {x:__globals.svgElement.tempData.start.x, y:__globals.svgElement.tempData.end.y}
                            ]
                        );
                        
                    };

                    //when the mouse is raised; 
                    //  find the objects that are selected
                    //  tell them they are selected (tell the rest they aren't)
                    //  add the selected to the 'selected objects list'
                    __globals.svgElement.onmouseup = function(){
                        //set up
                            __globals.selection.deselectEverything();
                            var start = __globals.utility.workspace.pointConverter.browser2workspace(__globals.svgElement.tempData.start.x,__globals.svgElement.tempData.start.y);
                            var end = __globals.utility.workspace.pointConverter.browser2workspace(__globals.svgElement.tempData.end.x,__globals.svgElement.tempData.end.y);
                            var selectionArea = {};
                        
                        //create selection box (correcting negative values along the way)
                            selectionArea.box = [{},{}];
                            if(start.x > end.x){ selectionArea.box[0].x = start.x; selectionArea.box[1].x = end.x; }
                            else{ selectionArea.box[0].x = end.x; selectionArea.box[1].x = start.x; }
                            if(start.y > end.y){ selectionArea.box[0].y = start.y; selectionArea.box[1].y = end.y; }
                            else{ selectionArea.box[0].y = end.y; selectionArea.box[1].y = start.y; }
                            //create poly of this box with clockwise wind
                            if( Math.sign(start.x-end.x) != Math.sign(start.y-end.y) ){
                                selectionArea.points = [start, {x:start.x, y:end.y}, end, {x:end.x, y:start.y}];
                            }else{ 
                                selectionArea.points = [start, {x:end.x, y:start.y}, end, {x:start.x, y:end.y}];
                            };
                            
                        //run though all middleground objects to see if they are selected in this box
                        //  tell them they are selected (or not) and add the selected to the selected list
                            var objects = __globals.panes.middleground.children;
                            for(var a = 0; a < objects.length; a++){
                                if(objects[a].selectionArea){
                                    if(__globals.utility.math.detectOverlap(selectionArea.points, objects[a].selectionArea.points, selectionArea.box, objects[a].selectionArea.box)){
                                        __globals.selection.selectObject(objects[a]);
                                    }
                                }
                            }

                        //delete all temporary elements and attributes
                            delete __globals.svgElement.tempData;
                            for(var a = 0; a < __globals.svgElement.tempElements.length; a++){
                                __globals.panes.menu.removeChild( __globals.svgElement.tempElements[a] ); 
                                __globals.svgElement.tempElements[a] = null;
                            }
                            delete __globals.svgElement.tempElements;
                            this.onmousemove = __globals.svgElement.onmousemove_old;
                            delete __globals.svgElement.onmousemove_old;
                            this.onmouseleave = null;
                            __globals.panes.global.removeAttribute('oldPosition');
                            __globals.panes.global.removeAttribute('clickPosition');
                            this.onmouseleave = null;
                            this.onmouseup = null;
                    };

                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);
            }
        }
    );

    //panning 
    __globals.mouseInteraction.onmousedown_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                __globals.selection.deselectEverything();
                __globals.svgElement.temp_oldPosition = __globals.utility.element.getTransform(__globals.panes.global);
                __globals.panes.global.setAttribute('clickPosition','['+event.x +','+ event.y+']');

                __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                __globals.svgElement.onmousemove = function(event){
                    var position = {};
                        position.x = __globals.svgElement.temp_oldPosition.x;
                        position.y = __globals.svgElement.temp_oldPosition.y;
                        position.s = __globals.svgElement.temp_oldPosition.s;
                        position.r = __globals.svgElement.temp_oldPosition.r;
                    var clickPosition = JSON.parse(__globals.panes.global.getAttribute('clickPosition'));
                    position.x = position.x-(clickPosition[0]-event.x);
                    position.y = position.y-(clickPosition[1]-event.y);
                    __globals.utility.element.setTransform(__globals.panes.global, position);
                };

                __globals.svgElement.onmouseup = function(){
                    this.onmousemove = __globals.svgElement.onmousemove_old;
                    delete __globals.svgElement.onmousemove_old;
                    __globals.panes.global.removeAttribute('oldPosition');
                    __globals.panes.global.removeAttribute('clickPosition');
                    this.onmouseleave = null;
                    this.onmouseup = null;
                };

                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;

                __globals.svgElement.onmousemove(event);

            }
        }
    );







// onwheel functions
    __globals.mouseInteraction.onwheel_functionList = [];
    __globals.svgElement.onwheel = function(event){
        if(!__globals.utility.object.requestInteraction(event.x,event.y,'onwheel')){return;}
        for(var a = 0; a < __globals.mouseInteraction.onwheel_functionList.length; a++){
            var shouldRun = true;
            for(var b = 0; b < __globals.mouseInteraction.onwheel_functionList[a].specialKeys.length; b++){
                shouldRun = shouldRun && event[__globals.mouseInteraction.onwheel_functionList[a].specialKeys[b]];
                if(!shouldRun){break;}
            }
            if(shouldRun){ __globals.mouseInteraction.onwheel_functionList[a].function(event); break; }
        }
    };

    __globals.mouseInteraction.onwheel_functionList.push(
        {
            'specialKeys':[],
            'function':function(event){
                var zoomLimits = {'max':10, 'min':0.1};
                var position = __globals.utility.element.getTransform(__globals.panes.global);

                var XPosition = (event.x - position.x)/position.s;
                var YPosition = (event.y - position.y)/position.s;
                    var oldPixX = position.s * ( XPosition + position.x/position.s);
                    var oldPixY = position.s * ( YPosition + position.y/position.s);
                        // var mux = 1.25; position.s = position.s * ( event.deltaY < 0 ? 1*mux : 1/mux );
                        position.s -= position.s*__globals.mouseInteraction.wheelInterpreter(event.deltaY);
                        if( position.s > zoomLimits.max ){position.s = zoomLimits.max;}
                        if( position.s < zoomLimits.min ){position.s = zoomLimits.min;}
                    var newPixX = position.s * ( XPosition + position.x/position.s);
                    var newPixY = position.s * ( YPosition + position.y/position.s);
                position.x = position.x - ( newPixX - oldPixX );
                position.y = position.y - ( newPixY - oldPixY );

                __globals.utility.element.setTransform(__globals.panes.global, position);
            }
        }
    );
__globals.keyboardInteraction = {};
__globals.keyboardInteraction.pressedKeys = {};

// keycapture
__globals.keyboardInteraction.declareKeycaptureObject = function(object,desiredKeys={none:[],shift:[],control:[],meta:[],alt:[]}){
    var connectionObject = new function(){
        this.keyPress = function(key,modifiers={}){};
        this.keyRelease = function(key,modifiers={}){};
    };

    //connectionObject function runners
    //if for any reason the object using the connectionObject isn't interested in the
    //key, return 'false' otherwise return 'true'
    function keyProcessor(type,event){
        if(!connectionObject[type]){return false;}

        modifiers = {
            shift:event.shiftKey,
            control:event.ctrlKey,
            meta:event.metaKey,
            alt:event.altKey
        };
    
        if(event.ctrlKey  && ( !desiredKeys.control || !desiredKeys.control.includes(event.key) ) ){return false;}
        if(event.metaKey  && ( !desiredKeys.meta    || !desiredKeys.meta.includes(event.key)    ) ){return false;}
        if(event.shiftKey && ( !desiredKeys.shift   || !desiredKeys.shift.includes(event.key)   ) ){return false;}
        if(event.altKey   && ( !desiredKeys.alt     || !desiredKeys.alt.includes(event.key)     ) ){return false;}
        if(!desiredKeys.none.includes(event.key)){return false;}

        connectionObject[type](event.key,modifiers);
        return true;
    }
    object.onkeydown = function(event){ return keyProcessor('keyPress',event); };
    object.onkeyup = function(event){ return keyProcessor('keyRelease',event); };

    return connectionObject;
};



// onkeydown functions
    __globals.keyboardInteraction.onkeydown_functionList = {};
    document.onkeydown = function(event){
        //if key is already pressed, don't press it again
        if(__globals.keyboardInteraction.pressedKeys[event.code]){return;}
        __globals.keyboardInteraction.pressedKeys[event.code] = true;

        //discover what the mouse is pointing at; if it's pointing at something that can accept
        //keyboard input, direct the keyboard input to it. If the object doesn't care about this
        //key or if input is not accepted; use the global functions
        var temp = [__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]];
        if(!__globals.utility.object.requestInteraction(temp[0],temp[1],'onkeydown')){
            if(__globals.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeydown(event)){ return; }
        }

        //global function
        if( __globals.keyboardInteraction.onkeydown_functionList[event.key] ){
            __globals.keyboardInteraction.onkeydown_functionList[event.key](event);
        }
    };

    __globals.keyboardInteraction.onkeydown_functionList.Delete = function(event){
        console.log('delete!');
        __globals.selection.delete();
    };
    __globals.keyboardInteraction.onkeydown_functionList.Backspace = function(event){
        console.log('backspace!');
        __globals.keyboardInteraction.onkeydown_functionList.Delete(event);
    };
    __globals.keyboardInteraction.onkeydown_functionList.x = function(event){
        if(!event.ctrlKey){return;}
        console.log('cut!');
        __globals.selection.cut();
    };
    __globals.keyboardInteraction.onkeydown_functionList.c = function(event){
        if(!event.ctrlKey){return;}
        console.log('copy!');
        __globals.selection.copy();
    };
    __globals.keyboardInteraction.onkeydown_functionList.b = function(event){
        if(!event.ctrlKey){return;}
        console.log('duplicate!');
        __globals.selection.duplicate();
    };
    __globals.keyboardInteraction.onkeydown_functionList.v = function(event){
        if(!event.ctrlKey){return;}
        console.log('paste!');
        __globals.selection.paste();
    };



// onkeyup functions
    __globals.keyboardInteraction.onkeyup_functionList = {};
    document.onkeyup = function(event){
        //if key isn't pressed, don't release it
        if(!__globals.keyboardInteraction.pressedKeys[event.code]){return;}
        delete __globals.keyboardInteraction.pressedKeys[event.code];

        //discover what the mouse is pointing at; if it's pointing at something that can accept
        //keyboard input, direct the keyboard input to it. If the object doesn't care about this
        //key or if input is not accepted; use the global functions
        var temp = [__globals.mouseInteraction.currentPosition[0], __globals.mouseInteraction.currentPosition[1]];
        if(!__globals.utility.object.requestInteraction(temp[0],temp[1],'onkeyup')){
            if(__globals.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeyup(event)){ return; }
        }
                            
        //global function
        if( __globals.keyboardInteraction.onkeyup_functionList[event.key] ){
            __globals.keyboardInteraction.onkeyup_functionList[event.key](event);
        }
    };
__globals.audio = {};
__globals.audio.context = new (window.AudioContext || window.webkitAudioContext)();

__globals.audio.names_frequencies_split = {
    0:{ 'C':16.35, 'C#':17.32, 'D':18.35, 'D#':19.45, 'E':20.60, 'F':21.83, 'F#':23.12, 'G':24.50, 'G#':25.96, 'A':27.50, 'A#':29.14, 'B':30.87  },
    1:{ 'C':32.70, 'C#':34.65, 'D':36.71, 'D#':38.89, 'E':41.20, 'F':43.65, 'F#':46.25, 'G':49.00, 'G#':51.91, 'A':55.00, 'A#':58.27, 'B':61.74, },    
    2:{ 'C':65.41, 'C#':69.30, 'D':73.42, 'D#':77.78, 'E':82.41, 'F':87.31, 'F#':92.50, 'G':98.00, 'G#':103.8, 'A':110.0, 'A#':116.5, 'B':123.5, },
    3:{ 'C':130.8, 'C#':138.6, 'D':146.8, 'D#':155.6, 'E':164.8, 'F':174.6, 'F#':185.0, 'G':196.0, 'G#':207.7, 'A':220.0, 'A#':233.1, 'B':246.9, },    
    4:{ 'C':261.6, 'C#':277.2, 'D':293.7, 'D#':311.1, 'E':329.6, 'F':349.2, 'F#':370.0, 'G':392.0, 'G#':415.3, 'A':440.0, 'A#':466.2, 'B':493.9, },
    5:{ 'C':523.3, 'C#':554.4, 'D':587.3, 'D#':622.3, 'E':659.3, 'F':698.5, 'F#':740.0, 'G':784.0, 'G#':830.6, 'A':880.0, 'A#':932.3, 'B':987.8, },    
    6:{ 'C':1047,  'C#':1109,  'D':1175,  'D#':1245,  'E':1319,  'F':1397,  'F#':1480,  'G':1568,  'G#':1661,  'A':1760,  'A#':1865,  'B':1976,  },
    7:{ 'C':2093,  'C#':2217,  'D':2349,  'D#':2489,  'E':2637,  'F':2794,  'F#':2960,  'G':3136,  'G#':3322,  'A':3520,  'A#':3729,  'B':3951,  },    
    8:{ 'C':4186,  'C#':4435,  'D':4699,  'D#':4978,  'E':5274,  'F':5588,  'F#':5920,  'G':6272,  'G#':6645,  'A':7040,  'A#':7459,  'B':7902   }, 
};
//generate forward index
// eg. {... '4C':261.6, '4C#':277.2 ...}
__globals.audio.names_frequencies = {};
var octaves = Object.entries(__globals.audio.names_frequencies_split);
for(var a = 0; a < octaves.length; a++){
    var names = Object.entries(__globals.audio.names_frequencies_split[a]);
    for(var b = 0; b < names.length; b++){
        __globals.audio.names_frequencies[ octaves[a][0]+names[b][0] ] = names[b][1];
    }
}
//generate backward index
// eg. {... 261.6:'4C', 277.2:'4C#' ...}
__globals.audio.frequencies_names = {};
var temp = Object.entries(__globals.audio.names_frequencies);
for(var a = 0; a < temp.length; a++){ __globals.audio.frequencies_names[temp[a][1]] = temp[a][0]; }

__globals.audio.getFreq = function(name){ return __globals.audio.names_frequencies[name]; };
__globals.audio.getName = function(freq){ return __globals.audio.frequencies_names[freq]; };


//generate midi notes index
var temp = [
    '0C', '0C#', '0D', '0D#', '0E', '0F', '0F#', '0G', '0G#', '0A', '0A#', '0B',
    '1C', '1C#', '1D', '1D#', '1E', '1F', '1F#', '1G', '1G#', '1A', '1A#', '1B',
    '2C', '2C#', '2D', '2D#', '2E', '2F', '2F#', '2G', '2G#', '2A', '2A#', '2B',
    '3C', '3C#', '3D', '3D#', '3E', '3F', '3F#', '3G', '3G#', '3A', '3A#', '3B',
    '4C', '4C#', '4D', '4D#', '4E', '4F', '4F#', '4G', '4G#', '4A', '4A#', '4B',
    '5C', '5C#', '5D', '5D#', '5E', '5F', '5F#', '5G', '5G#', '5A', '5A#', '5B',
    '6C', '6C#', '6D', '6D#', '6E', '6F', '6F#', '6G', '6G#', '6A', '6A#', '6B',
    '7C', '7C#', '7D', '7D#', '7E', '7F', '7F#', '7G', '7G#', '7A', '7A#', '7B',
    '8C', '8C#', '8D', '8D#', '8E', '8F', '8F#', '8G', '8G#', '8A', '8A#', '8B',
];
//generate forward index
__globals.audio.midinumbers_names = {};
for(var a = 0; a < temp.length; a++){
    __globals.audio.midinumbers_names[a+24] = temp[a];
}
//generate backward index
__globals.audio.names_midinumbers = {};
var temp = Object.entries(__globals.audio.midinumbers_names);
for(var a = 0; a < temp.length; a++){ 
    __globals.audio.names_midinumbers[temp[a][1]] = parseInt(temp[a][0]);
}




__globals.audio.noteName_frequency = function(name, offsetOctave=0){
    return __globals.audio.names_frequencies[(parseInt(name.chatAt(0))+offsetOctave) + name.slice(1)];
};
__globals.audio.midiNumber_frequency = function(number, offsetOctave=0){
    return __globals.audio.names_frequencies[__globals.audio.midinumbers_names[number+offsetOctave*12]];
};


var parts = new function(){
    this.basic = new function(){
this.circle = function(id=null, x=0, y=0, r=0, angle=0, style='fill:rgba(255,100,255,0.75)'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','circle');
    element.id = id;
    element.setAttribute('r',r);
    element.style = 'transform: translate('+x+'px,'+y+'px) scale(1); rotate('+angle+'rad);' + style;

    return element;
};
this.g = function(id=null, x=0, y=0){
    var element = document.createElementNS('http://www.w3.org/2000/svg','g');
        element.id = id;
        element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate(0rad)';

    return element;
};
this.line = function(id=null, x1=0, y1=0, x2=10, y2=10, style='stroke:rgb(255,0,0); stroke-width:1'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','line');
    element.id = id;
    element.setAttribute('x1',x1);
    element.setAttribute('y1',y1);
    element.setAttribute('x2',x2);
    element.setAttribute('y2',y2);
    element.setAttribute('style',style);

    return element;
};
this.path = function(id=null, path=[], lineType='L', style='fill:none; stroke:rgb(255,0,0); stroke-width:1;'){
    // uppercase: absolute, lowercase: relative
    // M = moveto
    // L = lineto
    // H = horizontal lineto
    // V = vertical lineto
    // C = curveto
    // S = smooth curveto
    // Q = quadratic Bézier curve
    // T = smooth quadratic Bézier curveto
    // A = elliptical Arc
    // Z = closepath
    var element = document.createElementNS('http://www.w3.org/2000/svg','path');
    element.id = id;
    element.style = 'transform: translate('+0+'px,'+0+'px) scale(1) rotate('+0+'rad);' + style;

    element._installPath = function(path){
        var d = 'M ' + path[0].x + ' ' + path[0].y + ' ' + lineType;
        for(var a = 1; a < path.length; a++){
            d += ' ' + path[a].x + ' ' + path[a].y
        }
        this.setAttribute('d',d);
    };

    element._path = path;
    element._installPath(path);

    element.path = function(a){
        if(a==null){return this._path;}
        this._path = a;
        this._installPath(a);
    };

    return element;
};
this.rect = function(id=null, x=0, y=0, width=0, height=0, angle=0, style='fill:rgba(255,100,255,0.75)'){
    var element = document.createElementNS('http://www.w3.org/2000/svg','rect');
    element.id = id;
    element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+angle+'rad);' + style;
    element.setAttribute('height',height);
    element.setAttribute('width',width);

    element.rotation = function(a){
        if(a==null){return __globals.utility.element.getTransform(this).r;}
        __globals.utility.element.setRotation(this, a);
    };

    return element;
};
this.text = function(id=null, x=0, y=0, text='', angle=0, style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;', scale=1){
    var element = document.createElementNS('http://www.w3.org/2000/svg','text');
        element.id = null;
        element.style = 'transform: translate('+x+'px,'+y+'px) scale('+scale+') rotate('+angle+'rad);' + style;
        element.innerHTML = text;

    return element;
};
    }
    this.modifier = new function(){
// this.makeUnselectable = function(element){
//     element.style['-webkit-user-select'] = 'none';
//     element.style['-moz-user-select'] = 'none';
//     element.style['-ms-user-select'] = 'none';
//     element.style['user-select'] = 'none';
// };
    }
    this.display = new function(){
this.audio_meter_level = function(
    id='audio_meter_level',
    x, y, angle,
    width, height,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle='fill:rgb(10,10,10)',
    levelStyles=['fill:rgba(250,250,250,1);','fill:rgb(100,100,100);'],
    markingStyle='fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
){
    //elements
        var object = parts.display.meter_level('mainlevel',x,y,angle,width,height,markings,backingStyle,levelStyles,markingStyle);
            
    //circuitry
        var converter = parts.audio.audio2percentage()
            converter.newValue = function(val){object.set( val );};

    //audio connections
        object.audioIn = function(){ return converter.audioIn(); }

    //methods
        object.start = function(){ converter.start(); };
        object.stop = function(){ converter.stop(); };

    //setup
        object.set(0)

    return object;
};
this.glowbox_rect = function(
    id='glowbox_rect',
    x, y, width, height, angle=0,
    glowStyle = 'fill:rgba(240,240,240,1)',
    dimStyle = 'fill:rgba(80,80,80,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, dimStyle);
        object.appendChild(rect);

    //methods
    object.on = function(){
        __globals.utility.element.setStyle(rect,glowStyle);
    };
    object.off = function(){
        __globals.utility.element.setStyle(rect,dimStyle);
    };

    return object;
};
this.grapher = function(
    id='grapher',
    x, y, width, height,
    middlegroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._data = {};
        object._data.width = width,
        object._data.height = height,
        object._data.viewbox = {'l':-1,'h':1};
        object._data.horizontalMarkings = [0.75,0.5,0.25,0,-0.25,-0.5,-0.75];
        object._data.verticalMarkings = [0.75,0.5,0.25,0,-0.25,-0.5,-0.75];
        object._data.styles = {
            'middleground':middlegroundStyle, 
            'background':backgroundStyle, 
            'backgroundText':backgroundTextStyle,
            'backing':backingStyle
        };

    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    var background = parts.basic.g('background', 0, 0);
        object.appendChild(background);
    var middleground = parts.basic.g('middleground', 0, 0);
        object.appendChild(middleground);


    //internal methods
    object._pointConverter = function(realHeight, viewbox, y){
        var viewboxDistance = Math.abs( viewbox.h - viewbox.l );
        var y_graphingDistance = realHeight * (-(viewbox.l + y )/viewboxDistance)
        return y_graphingDistance;
    };
    object._lineCorrecter = function(points, maxheight){
        if( points.y1 < 0 && points.y2 < 0 ){ return; }
        if( points.y1 > maxheight && points.y2 > maxheight ){ return; }

        var slope = (points.y2 - points.y1)/(points.x2 - points.x1);

        if( points.y1 < 0 ){ points.x1 = (0 - points.y1 + slope*points.x1)/slope; points.y1 = 0; }
        else if( points.y2 < 0 ){ points.x2 = (0 - points.y2 + slope*points.x2)/slope; points.y2 = 0; }
        if( points.y1 > maxheight ){ points.x1 = (maxheight - points.y1 + slope*points.x1)/slope; points.y1 = maxheight; }
        else if( points.y2 > maxheight ){ points.x2 = (maxheight - points.y2 + slope*points.x2)/slope; points.y2 = maxheight; }

        return points;
    };
    object._test = function(){
        this.horizontalMarkings([0.75,0.5,0.25,0,-0.25,-0.5,-0.75,1,1.25,1.5,1.75,-1.75]);
        this.verticalMarkings([0,1,2,3,4,5,6,7,8,9,10]);
        this.viewbox({'l':-2,'h':2});
        this.drawBackground();
        this.draw([-2,1,-1,2]);
    };
    

    //methods
    object.viewbox = function(a){
        if(a==null){return object._data.viewbox;}
        object._data.viewbox = a;
    };
    object.horizontalMarkings = function(a){
        if(a==null){return object._data.horizontalMarkings;}
        object._data.horizontalMarkings = a;
    };
    object.verticalMarkings = function(a){
        if(a==null){return object._data.verticalMarkings;}
        object._data.verticalMarkings = a;
    };
    object.drawBackground = function(){
        this.children['background'].innerHTML = '';

        //horizontal lines
        for(var a = 0; a < this._data.horizontalMarkings.length; a++){
            this.children['background'].append(
                parts.basic.line(
                    null,
                    0,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a] ),
                    this._data.width,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a] ),
                    this._data.styles.background
                )
            );
            this.children['background'].append(
                parts.basic.text(
                    null,
                    0.5,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a]-0.075 ),
                    this._data.horizontalMarkings[a],
                    0,
                    this._data.styles.backgroundText,
                    0.1
                )
            );
        }

        //vertical lines
        for(var a = 0; a < this._data.verticalMarkings.length; a++){
            this.children['background'].append(
                parts.basic.line(
                    null,
                    a*(this._data.width/this._data.verticalMarkings.length),
                    0,
                    a*(this._data.width/this._data.verticalMarkings.length),
                    this._data.height,
                    this._data.styles.background
                )
            );
            this.children['background'].append(
                parts.basic.text(
                    null,
                    a*(this._data.width/this._data.verticalMarkings.length) + 0.5,
                    this._pointConverter(this._data.height, this._data.viewbox, -0.075),
                    this._data.verticalMarkings[a],
                    0,
                    this._data.styles.backgroundText,
                    0.1
                )
            );
        }

        //(the vertical line on the right)
        this.children['background'].append( parts.basic.line( null, this._data.width, 0, this._data.width, this._data.height, this._data.styles.background ) );
    };
    object.draw = function(Y, X=null){
        this.children['middleground'].innerHTML = '';

        for(var a = 0; a < Y.length-1; a++){
            var points = this._lineCorrecter({
                'x1': (a+0)*(this._data.width/(Y.length-1)),
                'x2': (a+1)*(this._data.width/(Y.length-1)),
                'y1': this._pointConverter(this._data.height, this._data.viewbox, Y[a+0]),
                'y2': this._pointConverter(this._data.height, this._data.viewbox, Y[a+1])
            }, this._data.height);

            if(points){
                this.children['middleground'].append(
                    parts.basic.line(
                        null,
                        points.x1, points.y1,
                        points.x2, points.y2,
                        this._data.styles.middleground
                    )
                );
            }
        }
    };


    return object;
};
this.grapher_audioScope = function(
    id='grapher_audioScope',
    x, y, width, height,
    middlegroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    //attributes
        var attributes = {
            analyser:{
                analyserNode: __globals.audio.context.createAnalyser(),
                timeDomainDataArray: null,
                frequencyData: null,
                refreshRate: 30,
                scopeRefreshInterval: null,
                returnedValueLimits: {min:0, max: 256, halfdiff:128},
            },
            graph:{
                resolution: 256
            }
        };
        attributes.analyser.analyserNode.fftSize = attributes.graph.resolution;
        attributes.analyser.timeDomainDataArray = new Uint8Array(attributes.analyser.analyserNode.fftSize);
        attributes.analyser.frequencyData = new Uint8Array(attributes.analyser.analyserNode.fftSize);

    //elements 
        var object = parts.basic.g(id, x, y);
            object._data = {};
            object._data.wave = {'sin':[],'cos':[]};
            object._data.resolution = 500;

        //scope
        var grapher = parts.display.grapher(null, 0, 0, width, height, middlegroundStyle, backgroundStyle, backgroundTextStyle, backingStyle);
            object.append(grapher);
            
    //methods
        object.start = function(){
            if(attributes.analyser.scopeRefreshInterval == null){
                attributes.analyser.scopeRefreshInterval = setInterval(function(){render();},1000/attributes.analyser.refreshRate);
            }
        };
        object.stop = function(){
            clearInterval(attributes.analyser.scopeRefreshInterval);
            attributes.analyser.scopeRefreshInterval = null;
        };
        object.getNode = function(){return attributes.analyser.analyserNode;};
        object.resolution = function(res=null){
            if(res==null){return attributes.graph.resolution;}
            attributes.graph.resolution = res;
            this.stop();
            this.start();
        };
        object.refreshRate = function(a){
            if(a==null){return attributes.analyser.refreshRate;}
            attributes.analyser.refreshRate = a;
            this.stop();
            this.start();
        };

    //internal functions
        function render(){
            var numbers = [];
            attributes.analyser.analyserNode.getByteTimeDomainData(attributes.analyser.timeDomainDataArray);
            for(var a = 0; a < attributes.analyser.timeDomainDataArray.length; a++){
                numbers.push(
                    attributes.analyser.timeDomainDataArray[a]/attributes.analyser.returnedValueLimits.halfdiff - 1
                );
            }
            grapher.draw(numbers);
        }
        function setBackground(){
            grapher.viewbox( {'l':-1.1,'h':1.1} );
            grapher.horizontalMarkings([1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1]);
            grapher.verticalMarkings([0,0.25,0.5,0.75]);
            grapher.drawBackground();
        };

    //setup
        setBackground();

    return object;
};
this.grapher_periodicWave = function(
    id='grapher_periodicWave',
    x, y, width, height,
    middlegroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    //elements 
    var object = parts.basic.g(id, x, y);
        object._data = {};
        object._data.wave = {'sin':[],'cos':[]};
        object._data.resolution = 500;

    var grapher = parts.display.grapher(null, 0, 0, width, height, middlegroundStyle, backgroundStyle, backgroundTextStyle, backingStyle);
        object.append(grapher);


    //methods
    object.wave = function(a=null,type=null){
        if(a==null){
            while(this._data.wave.sin.length < this._data.wave.cos.length){ this._data.wave.sin.push(0); }
            while(this._data.wave.sin.length > this._data.wave.cos.length){ this._data.wave.cos.push(0); }
            for(var a = 0; a < this._data.wave['sin'].length; a++){
                if( !this._data.wave['sin'][a] ){ this._data.wave['sin'][a] = 0; }
                if( !this._data.wave['cos'][a] ){ this._data.wave['cos'][a] = 0; }
            }
            return this._data.wave;
        }

        if(type==null){
            this._data.wave = a;
        }
        switch(type){
            case 'sin': this._data.wave.sin = a; break;
            case 'cos': this._data.wave.cos = a; break;
            default: break;
        }
    }
    object.waveElement = function(type, mux, a){
        if(a==null){return this._data.wave[type][mux];}
        this._data.wave[type][mux] = a;
    }
    object.resolution = function(a=null){
        if(a==null){return this._data.resolution;}
        this._data.resolution = a;
    }
    object.updateBackground = function(){
        grapher.viewbox( {'l':-1.1,'h':1.1} );
        grapher.horizontalMarkings([1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1]);
        grapher.verticalMarkings([0,'1/4','1/2','3/4']);
        grapher.drawBackground();
    };
    object.draw = function(){
        var data = [];
        var temp = 0;
        for(var a = 0; a <= this._data.resolution; a++){
            temp = 0;
            for(var b = 0; b < this._data.wave['sin'].length; b++){
                if(!this._data.wave['sin'][b]){this._data.wave['sin'][b]=0;} // cover missing elements
                temp += Math.sin(b*(2*Math.PI*(a/this._data.resolution)))*this._data.wave['sin'][b]; 
            }
            for(var b = 0; b < this._data.wave['cos'].length; b++){
                if(!this._data.wave['cos'][b]){this._data.wave['cos'][b]=0;} // cover missing elements
                temp += Math.cos(b*(2*Math.PI*(a/this._data.resolution)) )*this._data.wave['cos'][b]; 
            }
            data.push(temp);
        }

        grapher.draw( data );
    }
    object.reset = function(){
        this.wave({'sin':[],'cos':[]});
        this.resolution(500);
        this.updateBackground();
        this.draw();
    }


    object.reset();
    return object;
};
// var grapher2 = parts.display.grapher(null, width/2, 0, width/2, height, middlegroundStyle, backgroundStyle, backgroundTextStyle, backingStyle);
//     object.append(grapher2);

// function setBackground(){
//     // grapher2.viewbox( {'l':-1.1,'h':1.1} );
//     // grapher2.horizontalMarkings([1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1]);
//     // grapher2.verticalMarkings([0,0.25,0.5,0.75]);
//     // grapher2.drawBackground();
// }
this.label = function(
    id='label',
    x, y, text,
    style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;',
    angle=0
){
    //elements 
    var object = parts.basic.g(id, x, y);
    var textElement = parts.basic.text(null, 0, 0, text, angle, style);
        object.appendChild(textElement);


    //methods
    object.text = function(a=null){
        if(a==null){return textElement.innerHTML;}
        textElement.innerHTML = a;
    }

    return object;
};
this.level = function(
    id='level',
    x, y, angle,
    width, height,
    layerCount=1,
    backingStyle='fill:rgb(10,10,10)',
    levelStyles=['fill:rgb(250,250,250)','fill:rgb(200,200,200)']
){
    var values = Array.apply(null, Array(layerCount)).map(Number.prototype.valueOf,0);

    // elements
        var object = parts.basic.g(id, x, y);

        //level layers are layered from back forward, so backing must go on last
        var levels = [];
        for(var a = 0; a < layerCount; a++){
            var tempStyle = levelStyles[a]!=undefined ? levelStyles[a] : levelStyles[0];
            var temp = parts.basic.rect(
                'movingRect_'+a,
                (-height*Math.sin(angle) + width*Math.cos(angle)).toFixed(10),
                (height*Math.cos(angle) + width*Math.sin(angle)).toFixed(10),
                width,
                0,
                angle+Math.PI,
                tempStyle
            );
            levels.push(temp);
            object.prepend(temp);
        }

        var backing = parts.basic.rect('backing', 0, 0, width, height, angle, backingStyle);
            object.prepend(backing);

    //methods
        object.set = function(a, layer=0){
            if(a==null){return value;}

            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            value = a;

            levels[layer].height.baseVal.valueInSpecifiedUnits = height*value;
        };
        object.getLevelStyle = function(levelLayer){
            return levels[levelLayer].style;
        };

    return object;
};
this.meter_level = function(
    id='meter_level',
    x, y, angle,
    width, height,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle='fill:rgb(10,10,10)',
    levelStyles=['fill:rgba(250,250,250,1);','fill:rgb(100,100,100);'],
    markingStyle='fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
){
    //values
        var coolDown = 0;
        var mostRecentSetting = 0;

    //elements
        var object = parts.basic.g(id, x, y);

    //level
        levelStyles[0] += 'transition: height 0s;';
        levelStyles[1] += 'transition: height 0.01s;';
        var level = parts.display.level('mainlevel',0,0,angle,width,height,2,backingStyle,levelStyles);
        object.append(level);

    //markings
        function makeMark(y){
            var markThickness = 0.2;
            var path = [{x:width,y:y-markThickness/2},{x:width-width/4, y:y-markThickness/2},{x:width-width/4, y:y+markThickness/2},{x:width,y:y+markThickness/2}];  
            return parts.basic.path(null, path, 'L', markingStyle);
        }
        function insertText(y,text){
            return parts.display.label(null, 0, y+0.3, text, markingStyle);
        }

        for(var a = 0; a < markings.length; a++){
            object.append(makeMark(height*(1-markings[a])));
            object.append(insertText(height*(1-markings[a]),markings[a]));
        }

    //update intervals
        setInterval(function(){        
            level.set(mostRecentSetting,0);

            if(coolDown>0){coolDown-=0.0025;}
            level.set(coolDown,1);

            if(mostRecentSetting > coolDown){coolDown = mostRecentSetting;}
        },1000/30);

    //methods
        object.set = function(a){
            mostRecentSetting = a;
            mostRecentSetting_slow = a;
        };

    return object;
};
this.rastorDisplay = function(
    id='rastorDisplay',
    x, y, width, height,
    xCount, yCount, xGappage=1, yGappage=1
){
    //elements
        //main
        var object = parts.basic.g(id, x, y);

        //backing
        var rect = parts.basic.rect(null, 0, 0, width, height, 0, 'fill:rgb(0,0,0)');
            object.appendChild(rect);

        //pixels
            var pixels = [];
            var pixelValues = [];
            var pixWidth = width/xCount;
            var pixHeight = height/yCount;

            for(var x = 0; x < xCount; x++){
                var temp_pixels = [];
                var temp_pixelValues = [];
                for(var y = 0; y < yCount; y++){
                    var rect = parts.basic.rect(null, (x*pixWidth)+xGappage/2, (y*pixHeight)+yGappage/2, pixWidth-xGappage, pixHeight-yGappage, 0, 'fill:rgb(0,0,0)');
                        temp_pixels.push(rect);
                        temp_pixelValues.push([0,0,0]);
                        object.appendChild(rect);
                }
                pixels.push(temp_pixels);
                pixelValues.push(temp_pixelValues);
            }

    //inner workings
        function render(){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    __globals.utility.element.setStyle(pixels[x][y], 'fill:rgb('+255*pixelValues[x][y][0]+','+255*pixelValues[x][y][1]+','+255*pixelValues[x][y][2]+')' );
                }
            }
        }
        
    //methods
        object.get = function(x,y){ return pixelValues[x][y]; };
        object.set = function(x,y,state){ pixelValues[x][y] = state; render() };
        object.reverseLoad = function(data){
        for(var y = 0; y < yCount; y++){
            for(var x = 0; x < xCount; x++){
                    this.set(x,y,data[y][x]);
                }
            }
            render();
        };
        object.load = function(data){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    this.set(x,y,data[x][y]);
                }
            }
            render();
        };
        object.unload = function(){ return pixelValues; }
        object.setAll = function(value){
            for(var x = 0; x < xCount; x++){
                for(var y = 0; y < yCount; y++){
                    this.set(x,y,value);
                }
            }
        }

        object.test = function(){
            this.setAll([1,1,1]);
            render();
        };

    return object;
};
this.segmentDisplay = function(
    id='segmentDisplay',
    x, y, width, height,
    backgroundStyle='fill:rgb(0,0,0)',
    glowStyle='fill:rgb(200,200,200)',
    dimStyle='fill:rgb(20,20,20)'
){
    var margin = width/8;
    var division = width/8;
    var shapes = {
        segments:{
            points: {
                top:{
                    left:[
                        {x:division*1.0+margin,         y:division*1.0+margin},
                        {x:division*0.5+margin,         y:division*0.5+margin},
                        {x:division*1.0+margin,         y:division*0.0+margin},
                        {x:division*0.0+margin,         y:division*1.0+margin},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:division*0.0+margin},
                        {x:width-division*0.5-margin,   y:division*0.5+margin},
                        {x:width-division*1.0-margin,   y:division*1.0+margin},
                        {x:width-division*0.0-margin,   y:division*1.0+margin}
                    ]
                },
                middle: {
                    left:[
                        {x:division*1.0+margin,         y:height*0.5-division*1.0+margin*0.5},
                        {x:division*0.5+margin,         y:height*0.5-division*0.5+margin*0.5},
                        {x:division*1.0+margin,         y:height*0.5-division*0.0+margin*0.5},
                        {x:division*0.0+margin,         y:height*0.5-division*1.0+margin*0.5},
                        {x:division*0.0+margin,         y:height*0.5-division*0.0+margin*0.5},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:height*0.5-division*0.0+margin*0.5},
                        {x:width-division*0.5-margin,   y:height*0.5-division*0.5+margin*0.5},
                        {x:width-division*1.0-margin,   y:height*0.5-division*1.0+margin*0.5},
                        {x:width-division*0.0-margin,   y:height*0.5-division*1.0+margin*0.5},
                        {x:width-division*0.0-margin,   y:height*0.5-division*0.0+margin*0.5}
                    ]
                },
                bottom: {
                    left:[
                        {x:division*1.0+margin,         y:height-division*1.0-margin},
                        {x:division*0.5+margin,         y:height-division*0.5-margin},
                        {x:division*1.0+margin,         y:height-division*0.0-margin},
                        {x:division*0.0+margin,         y:height-division*1.0-margin},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:height-division*0.0-margin},
                        {x:width-division*0.5-margin,   y:height-division*0.5-margin},
                        {x:width-division*1.0-margin,   y:height-division*1.0-margin},
                        {x:width-division*0.0-margin,   y:height-division*1.0-margin}
                    ]
                }
            }
        }
    };

    //elements
        //main
        var object = parts.basic.g(id, x, y);

        //backing
        var rect = parts.basic.rect(null, 0, 0, width, height, 0, backgroundStyle);
            object.appendChild(rect);

        //segments
            var segments = [];
            var points = [
                [
                    shapes.segments.points.top.left[0],
                    shapes.segments.points.top.right[2],
                    shapes.segments.points.top.right[1],
                    shapes.segments.points.top.right[0],
                    shapes.segments.points.top.left[2],
                    shapes.segments.points.top.left[1],
                ],
                [
                    shapes.segments.points.top.left[1],
                    shapes.segments.points.top.left[3],
                    shapes.segments.points.middle.left[3],
                    shapes.segments.points.middle.left[1],
                    shapes.segments.points.middle.left[0],
                    shapes.segments.points.top.left[0],  
                ],
                [
                    shapes.segments.points.top.right[1],  
                    shapes.segments.points.top.right[3],  
                    shapes.segments.points.middle.right[3],
                    shapes.segments.points.middle.right[1],
                    shapes.segments.points.middle.right[2],
                    shapes.segments.points.top.right[2],  
                ],
                [
                    shapes.segments.points.middle.left[0], 
                    shapes.segments.points.middle.right[2],
                    shapes.segments.points.middle.right[1],
                    shapes.segments.points.middle.right[0],
                    shapes.segments.points.middle.left[2], 
                    shapes.segments.points.middle.left[1], 
                ],
                [
                    shapes.segments.points.middle.left[1],
                    shapes.segments.points.middle.left[4],
                    shapes.segments.points.bottom.left[3],
                    shapes.segments.points.bottom.left[1],
                    shapes.segments.points.bottom.left[0],
                    shapes.segments.points.middle.left[2],
                ],
                [
                    shapes.segments.points.middle.right[1],
                    shapes.segments.points.middle.right[4],
                    shapes.segments.points.bottom.right[3],
                    shapes.segments.points.bottom.right[1],
                    shapes.segments.points.bottom.right[2],
                    shapes.segments.points.middle.right[0],
                ],
                [
                    shapes.segments.points.bottom.left[0],
                    shapes.segments.points.bottom.right[2],
                    shapes.segments.points.bottom.right[1],
                    shapes.segments.points.bottom.right[0],
                    shapes.segments.points.bottom.left[2],
                    shapes.segments.points.bottom.left[1],
                ]
            ];
            for(var a = 0; a < points.length; a++){
                var temp = {
                    segment: parts.basic.path(null, points[a], 'L', dimStyle),
                    state: false
                };
                segments.push( temp );
                object.append( temp.segment );
            }


    //methods
        object.set = function(segment,state){
            segments[segment].state = state;
            if(state){ __globals.utility.element.setStyle(segments[segment].segment,glowStyle); }
            else{ __globals.utility.element.setStyle(segments[segment].segment,dimStyle); }
        };
        object.get = function(segment){ return segments[segment].state; };
        object.clear = function(){
            for(var a = 0; a < segments.length; a++){
                this.set(a,false);
            }
        };

        object.enterCharacter = function(char){
            var stamp = [];
            switch(char){
                case '0': stamp = [1,1,1,0,1,1,1]; break;
                case '1': stamp = [0,0,1,0,0,1,0]; break;
                case '2': stamp = [1,0,1,1,1,0,1]; break;
                case '3': stamp = [1,0,1,1,0,1,1]; break;
                case '4': stamp = [0,1,1,1,0,1,0]; break;
                case '5': stamp = [1,1,0,1,0,1,1]; break;
                case '6': stamp = [1,1,0,1,1,1,1]; break;
                case '7': stamp = [1,0,1,0,0,1,0]; break;
                case '8': stamp = [1,1,1,1,1,1,1]; break;
                case '9': stamp = [1,1,1,1,0,1,1]; break;
                default:  stamp = [0,0,0,0,0,0,0]; break;
            }

            for(var a = 0; a < stamp.length; a++){
                this.set(a, stamp[a]==1);
            }
        };

        object.test = function(){
            this.clear();
            this.enterCharacter('9');
        };

    return object;
};
    }
    this.control = new function(){
this.button_rect = function(
    id='button_rect',
    x, y, width, height, angle=0,
    upStyle = 'fill:rgba(200,200,200,1)',
    hoverStyle = 'fill:rgba(220,220,220,1)',
    downStyle = 'fill:rgba(180,180,180,1)',
    glowStyle = 'fill:rgba(220,200,220,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, upStyle);
        object.appendChild(rect);

    //interactivity
    rect.onmouseenter = function(){ __globals.utility.element.setStyle(this, hoverStyle); };
    rect.onmouseleave = function(){ __globals.utility.element.setStyle(this, upStyle);    };
    rect.onmousedown =  function(){ __globals.utility.element.setStyle(this, downStyle);  };
    rect.onmouseup =    function(){ this.onmouseleave();                          };
    rect.glow =         function(){ __globals.utility.element.setStyle(this, glowStyle) };

    //callbacks
    object.onmouseup =    function(){ /*console.log('mouseup');    */ };
    object.onmousedown =  function(){ /*console.log('mousedown');  */ };
    object.onmouseenter = function(){ /*console.log('mouseenter'); */ };
    object.onmouseleave = function(){ /*console.log('mouseleave'); */ };
    object.onmousemove =  function(){ /*console.log('mousemove');  */ };
    object.onclick =      function(){ /*console.log('click');      */ };
    object.ondblclick =   function(){ /*console.log('doubleclick');*/ };

    //methods
    object.click = function(glow=false){ this.onclick(); this.onmousedown(); if(glow){rect.glow();}else{rect.onmousedown();} setTimeout(function(){rect.onmouseup();this.onmouseup();},250); };
    object.hover = function(){ this.onmouseenter(); rect.onmouseenter(); };
    object.unhover = function(){this.onmouseleave(); rect.onmouseleave();};

    return object;
};
this.checkbox_rect = function(
    id='checkbox_rect',
    x, y, width, height, angle=0,
    checkStyle = 'fill:rgba(150,150,150,1)',
    backingStyle = 'fill:rgba(200,200,200,1)',
    checkGlowStyle = 'fill:rgba(220,220,220,1)',
    backingGlowStyle = 'fill:rgba(220,220,220,1)',
){
    // elements 
    var object = parts.basic.g(id, x, y);
        object._checked = false;
        object.styles = {
            'check':checkStyle,
            'uncheck':'fill:rgba(0,0,0,0)',
            'backing':backingStyle
        };

    var rect = parts.basic.rect(null, 0, 0, width, height, angle, backingStyle);
        object.appendChild(rect);
    var checkrect = parts.basic.rect(null, width*0.1, height*0.1, width*0.8, height*0.8, angle, object.styles.uncheck);
        object.appendChild(checkrect);


    function updateGraphics(){
        if(object._checked){ __globals.utility.element.setStyle(checkrect,object.styles.check); }
        else{ __globals.utility.element.setStyle(checkrect,object.styles.uncheck); }
        __globals.utility.element.setStyle(rect,object.styles.backing);
    }

    //methods
    object.get = function(){ return object._checked; };
    object.set = function(value, update=true){
        object._checked = value;
        
        updateGraphics();

        if(update&&this.onChange){ this.onChange(value); }
    };
    object.light = function(state){
        if(state){
            object.styles.check = checkGlowStyle;
            object.styles.backing = backingGlowStyle;
        }else{
            object.styles.check = checkStyle;
            object.styles.backing = backingStyle;
        }
        updateGraphics();
    };


    //callback
    object.onChange = function(){};


    //mouse interaction
    object.onclick = function(event){
        object.set(!object.get());
    };


    return object;
};
this.dial_continuous = function(
    id='dial_continuous',
    x, y, r,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
    handleStyle = 'fill:rgba(200,200,200,1)',
    slotStyle = 'fill:rgba(50,50,50,1)',
    needleStyle = 'fill:rgba(250,100,100,1)',
    arcDistance=1.35,
    outerArcStyle='fill:none; stroke:none;',
){
    // elements
        var object = parts.basic.g(id, x, y);
            object._value = 0;
            object._data = {
                'mux':r*4
            };

        //arc
            var points = 5;
            var pushDistance = 1.11;
            var arcPath = [];
            for(var a = 0; a < points; a++){
                var temp = __globals.utility.math.polar2cartesian(startAngle+a*(maxAngle/points),r*arcDistance);
                arcPath.push( temp );
                var temp = __globals.utility.math.polar2cartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
                arcPath.push( temp );
            }
            var temp = __globals.utility.math.polar2cartesian(startAngle+maxAngle,r*arcDistance);
            arcPath.push( temp );
            var outerArc = parts.basic.path(id=null, path=arcPath, 'Q', outerArcStyle);
            object.appendChild(outerArc);

        //slot
            var slot = parts.basic.circle(null, 0, 0, r*1.1, 0, slotStyle);
                object.appendChild(slot);

        //handle
            var handle = parts.basic.circle(null, 0, 0, r, 0, handleStyle);
                object.appendChild(handle);

        //needle
            var needleWidth = r/5;
            var needleLength = r;
            var needle = parts.basic.rect('needle', 0, 0, needleLength, needleWidth, 0, needleStyle);
                needle.x.baseVal.valueInSpecifiedUnits = needleLength/3;
                needle.y.baseVal.valueInSpecifiedUnits = -needleWidth/2;
                object.appendChild(needle);


    // methods
        object.get = function(){ return this._value; };
        object.set = function(value, live=false, update=true){
            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);

            this._value = value;
            if(update&&this.onChange){ this.onChange(value); }
            if(update&&!live&&this.onRelease){ this.onRelease(value); }
            this.children['needle'].rotation(startAngle + maxAngle*value);
        };object.set(0);
        object.smoothSet = function(target,time,curve,update=true){
            var start = this.get();
            var mux = target-start;
            var stepsPerSecond = Math.round(Math.abs(mux)*100);
            var totalSteps = stepsPerSecond*time;

            var steps = [1];
            switch(curve){
                case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
                case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
                case 'sin': steps = __globals.utility.math.curveGenerator.sin(totalSteps); break;
                case 'cos': steps = __globals.utility.math.curveGenerator.cos(totalSteps); break;
                case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps); break;
                case 'instant': default: break;
            }

            if(steps.length == 0){return;}

            if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
            object.smoothSet.interval = setInterval(function(){
                object.set( (start+(steps.shift()*mux)),true,update );
                if(steps.length == 0){clearInterval(object.smoothSet.interval);}
            },1000/stepsPerSecond);
        };
        

    //callback
        object.onChange = function(){};
        object.onRelease = function(){};


    //mouse interaction
        object.ondblclick = function(){ this.set(0.5); };
        object.onwheel = function(event){
            var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
            var globalScale = __globals.utility.element.getTransform(__globals.panes.global).s;

            this.set( this.get() - move/(10*globalScale) );
        };
        object.onmousedown = function(event){
            __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
            __globals.svgElement.onmouseleave_old = __globals.svgElement.onmouseleave;
            __globals.svgElement.onmouseup_old = __globals.svgElement.onmouseup;

            __globals.svgElement.tempRef = this;
            __globals.svgElement.tempRef._data.initialValue = this.get();
            __globals.svgElement.tempRef._data.initialY = event.y;
            __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.mux;
            __globals.svgElement.onmousemove = function(event){
                var mux = __globals.svgElement.tempRef._data.mux;
                var value = __globals.svgElement.tempRef._data.initialValue;
                var numerator = event.y-__globals.svgElement.tempRef._data.initialY;
                var divider = __globals.utility.element.getTransform(__globals.panes.global).s;

                __globals.svgElement.tempRef.set( value - numerator/(divider*mux), true );
            };
            __globals.svgElement.onmouseup = function(){
                this.tempRef.set(this.tempRef.get(),false);
                delete this.tempRef;

                __globals.svgElement.onmousemove = __globals.svgElement.onmousemove_old;
                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseleave_old;
                __globals.svgElement.onmouseup = __globals.svgElement.onmouseup_old;

                __globals.svgElement.onmousemove_old = null;
                __globals.svgElement.onmouseleave_old = null;
                __globals.svgElement.onmouseup_old = null;
            };
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
            __globals.svgElement.onmousemove(event);
        };


    return object;
};
this.dial_discrete = function(
    id='dial_discrete',
    x, y, r,
    optionCount=5,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
    handleStyle = 'fill:rgba(200,200,200,1)',
    slotStyle = 'fill:rgba(50,50,50,1)',
    needleStyle = 'fill:rgba(250,100,100,1)',
    arcDistance=1.35,
    outerArcStyle='fill:none; stroke:none;',
){
    // elements
    var object = parts.basic.g(id, x, y);
        object._value = 0;
        object._selection = 0;
        object._data = { 
            'optionCount':optionCount,
            'mux':r*4
        };

        //arc
        var points = 5;
        var pushDistance = 1.11;
        var arcPath = [];
        for(var a = 0; a < points; a++){
            var temp = __globals.utility.math.polar2cartesian(startAngle+a*(maxAngle/points),r*arcDistance);
            arcPath.push( temp );
            var temp = __globals.utility.math.polar2cartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
            arcPath.push( temp );
        }
        var temp = __globals.utility.math.polar2cartesian(startAngle+maxAngle,r*arcDistance);
        arcPath.push( temp );
        var outerArc = parts.basic.path(id=null, path=arcPath, 'Q', outerArcStyle);
        object.appendChild(outerArc);

        //slot
        var slot = parts.basic.circle(null, 0, 0, r*1.1, 0, slotStyle);
            object.appendChild(slot);

        //handle
        var handle = parts.basic.circle(null, 0, 0, r, 0, handleStyle);
            object.appendChild(handle);

        //needle
        var needleWidth = 2.5;
        var needleLength = 12;
        var needle = parts.basic.rect('needle', 0, 0, needleLength, needleWidth, 0, needleStyle);
            needle.x.baseVal.valueInSpecifiedUnits = needleLength/3;
            needle.y.baseVal.valueInSpecifiedUnits = -needleWidth/2;
            object.appendChild(needle);


    //methods
    object.select = function(a=null, live=true, update=true){
        if(a==null){return this._selection;}

        a = (a>this._data.optionCount-1 ? this._data.optionCount-1 : a);
        a = (a<0 ? 0 : a);

        if(this._selection == a){/*nothings changed*/return;}

        this._selection = a;
        this._set( a/(this._data.optionCount-1) );
        if(update&&this.onChange){ this.onChange(a); }
        if(update&&!live&&this.onRelease){ this.onRelease(value); }
    };
    object._get = function(){ return this._value; };
    object._set = function(value){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        this.children['needle'].rotation(startAngle + maxAngle*value);
    };object._set(0);
  

    //callback
    object.onChange = function(){};
    object.onRelease = function(){};

    
    //mouse interaction
    object.ondblclick = function(){ this.select( Math.floor(optionCount/2) ); /*this._set(0.5);*/ };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.element.getTransform(__globals.panes.global).s;

        if(!object.onwheel.acc){object.onwheel.acc=0;}
        object.onwheel.acc += move/globalScale;
        if( Math.abs(object.onwheel.acc) >= 1 ){
            this.select( this.select()-1*Math.sign(object.onwheel.acc) );
            object.onwheel.acc = 0;
        }
    };
    object.onmousedown = function(event){
        __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
        __globals.svgElement.onmouseleave_old = __globals.svgElement.onmouseleave;
        __globals.svgElement.onmouseup_old = __globals.svgElement.onmouseup;

        __globals.svgElement.tempRef = this;
        __globals.svgElement.tempRef._data.initialValue = this._get();
        __globals.svgElement.tempRef._data.initialY = event.y;
        __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.mux;
        __globals.svgElement.onmousemove = function(event){
            var mux = __globals.svgElement.tempRef._data.mux;
            var value = __globals.svgElement.tempRef._data.initialValue;
            var numerator = event.y-__globals.svgElement.tempRef._data.initialY;
            var divider = __globals.utility.element.getTransform(__globals.panes.global).s;

            __globals.svgElement.tempRef.select(
                Math.round(
                    (__globals.svgElement.tempRef._data.optionCount-1)*(value - numerator/(divider*mux))
                ) 
            );
        };
        __globals.svgElement.onmouseup = function(){
            this.tempRef.select(this.tempRef.select(),false);
            this.tempRef = null;
            
            __globals.svgElement.onmousemove = __globals.svgElement.onmousemove_old;
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseleave_old;
            __globals.svgElement.onmouseup = __globals.svgElement.onmouseup_old;

            __globals.svgElement.onmousemove_old = null;
            __globals.svgElement.onmouseleave_old = null;
            __globals.svgElement.onmouseup_old = null;
        };
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        __globals.svgElement.onmousemove(event);
    };


  return object;
};
this.key_rect = function(
    id='key_rect',
    x, y, width, height, angle=0,
    style_off = 'fill:rgba(200,200,200,1)',
    style_press = 'fill:rgba(180,180,180,1)',
    style_glow = 'fill:rgba(220,200,220,1)',
    style_pressAndGlow = 'fill:rgba(200,190,200,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, style_off);
        object.appendChild(rect);

    //state
    object.state = 0;
    object.activateState = function(state){
        // 0 - off
        // 1 - pressed
        // 2 - glowing
        // 3 - pressed and glowing
        switch(state){
            case 0: __globals.utility.element.setStyle(rect, style_off); break;
            case 1: __globals.utility.element.setStyle(rect, style_press); break;
            case 2: __globals.utility.element.setStyle(rect, style_glow); break;
            case 3: __globals.utility.element.setStyle(rect, style_pressAndGlow); break;
            default: /*console.error('Unknown state reached:', state);*/ return; break;
        }
        object.state = state;
    };

    //interactivity
    rect.onmousedown =  function(){ object.press();   };
    rect.onmouseup =    function(){ object.release(); };
    rect.onmouseleave = function(){ object.release(); };
    rect.onmouseenter = function(event){ if(event.buttons == 1){object.press();} };

    //callbacks
    object.onkeyup =    function(){ /*console.log('mouseup');    */ };
    object.onkeydown =  function(){ /*console.log('mousedown');  */ };

    //methods;
    object.press =   function(){
        if( this.state%2 != 0 ){return;} //key already pressed 
        this.activateState(this.state+1);
        this.onkeydown();
    };
    object.release = function(){ 
        if( this.state%2 == 0 ){return;} //key not pressed 
        this.activateState(object.state-1); 
        this.onkeyup();
    };
    object.glow = function(){ this.activateState(this.state+2); };
    object.dim  = function(){ this.activateState(this.state-2); };

    return object;
};
this.rastorgrid = function(
    id='rastorgrid', 
    x, y, width, height,
    xcount, ycount,
    backingStyle = 'fill:rgba(200,200,200,1)',
    checkStyle = 'fill:rgba(150,150,150,1)',
    backingGlowStyle = 'fill:rgba(220,220,220,1)',
    checkGlowStyle = 'fill:rgba(220,220,220,1)',
){
    // elements
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);

    for(var y = 0; y < ycount; y++){
        for(var x = 0; x < xcount; x++){
            var temp = parts.control.checkbox_rect(y+'_'+x, x*(width/xcount), y*(height/ycount), width/xcount, height/ycount, 0, checkStyle, backingStyle, checkGlowStyle, backingGlowStyle);
            object.appendChild(temp);
            temp.onChange = function(){ object.onChange(object.get()); };
        }
    }


    //methods
    object.box = function(x,y){ return object.children[y+'_'+x]; };
    object.get = function(){
        var outputArray = [];

        for(var y = 0; y < ycount; y++){
            var temp = [];
            for(var x = 0; x < xcount; x++){
                temp.push(this.box(x,y).get());
            }
            outputArray.push(temp);
        }

        return outputArray;
    };
    object.set = function(value, update=true){
        for(var y = 0; y < ycount; y++){
            for(var x = 0; x < xcount; x++){
                object.box(x,y).set(value[y][x],false);
            }
        }
    };
    object.clear = function(){
        for(var y = 0; y < ycount; y++){
            for(var x = 0; x < xcount; x++){
                object.box(x,y).set(false,false);
            }
        }
    };
    object.light = function(x,y,state){
        object.box(x,y).light(state);
    };


    //callback
    object.onChange = function(){};


    return object;
};
this.slidePanel_horizontal = function(
    id='slidePanel_horizontal', 
    x, y, width, height,
    count,
    handleStyle = 'fill:rgba(180,180,180,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    // elements
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    for(var a = 0; a < count; a++){
        var temp = parts.control.slide_horizontal( id+'_'+a, 0, a*(height/count), width, height/count, handleStyle, backingStyle, slotStyle );
        object.appendChild(temp);
        temp.onChange = function(){ object.onChange(object.get()); };
    }


    //methods
        object.slide = function(index){ return object.children[object.id+'_'+index]; };
        object.get = function(){
            var outputArray = [];
            for(var b = 0; b < count; b++){
                outputArray.push(this.slide(b).get());
            }
            return outputArray;
        };
        object.set = function(a, live=false, update=true){
            for(var b = 0; b < count; b++){
                this.slide(b).set(a[b],false);
            }

            if(update&&this.onChange){ this.onChange(a); }
        };
        object.smoothSet = function(a,time,curve,update=true){
            for(var b = 0; b < a.length; b++){
                this.slide(b).smoothSet(a[b],time,curve,false);
            }
            for(var b = a.length; b < count; b++){
                this.slide(b).smoothSet(1/2,time,curve,false);
            }

            if(update&&this.onChange){ setTimeout(function(){this.onChange(a);},time); }
            if(update&&!live&&this.onRelease){ setTimeout(function(){this.onRelease(a);},time); }
        };
        object.setAll = function(a, live=false, update=true){
            this.set( Array.apply(null, Array(count)).map(Number.prototype.valueOf,a) );
        };
        object.smoothSetAll = function(a, time, curve, update=true){
            this.smoothSet( Array.apply(null, Array(count)).map(Number.prototype.valueOf,a), time, curve, update );
        };
    
    //callback
        object.onChange = function(){};
        object.onRelease = function(){};

    return object;
};
this.slidePanel_vertical = function(
    id='slidePanel_vertical', 
    x, y, width, height,
    count,
    handleStyle = 'fill:rgba(180,180,180,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    // elements
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    for(var a = 0; a < count; a++){
        var temp = parts.control.slide_vertical( id+'_'+a, a*(width/count), 0, width/count, height, handleStyle, backingStyle, slotStyle );
        object.appendChild(temp);
        temp.onChange = function(){ object.onChange(object.get()); };
    }


    //methods
        object.slide = function(index){ return object.children[object.id+'_'+index]; };
        object.get = function(){
            var outputArray = [];
            for(var b = 0; b < count; b++){
                outputArray.push(this.slide(b).get());
            }
            return outputArray;
        };
        object.set = function(a, live=false, update=true){
            for(var b = 0; b < a.length; b++){
                this.slide(b).set(a[b],live,false);
            }
            for(var b = a.length; b < count; b++){
                this.slide(b).set(1/2,live,false);
            }

            if(update&&this.onChange){ this.onChange(a); }
            if(update&&!live&&this.onRelease){ this.onRelease(a); }
        };
        object.smoothSet = function(a,time,curve,update=true){
            for(var b = 0; b < a.length; b++){
                this.slide(b).smoothSet(a[b],time,curve,false);
            }
            for(var b = a.length; b < count; b++){
                this.slide(b).smoothSet(1/2,time,curve,false);
            }

            if(update&&this.onChange){ setTimeout(function(){this.onChange(a);},time); }
            if(update&&!live&&this.onRelease){ setTimeout(function(){this.onRelease(a);},time); }
        };
        object.setAll = function(a, live=false, update=true){
            this.set( Array.apply(null, Array(count)).map(Number.prototype.valueOf,a) );
        };
        object.smoothSetAll = function(a, time, curve, update=true){
            this.smoothSet( Array.apply(null, Array(count)).map(Number.prototype.valueOf,a), time, curve, update );
        };

    //callback
        object.onChange = function(){};
        object.onRelease = function(){};

    return object;
};
this.slide_horizontal = function(
    id='slide_horizontal', 
    x, y, width, height,
    handleStyle = 'fill:rgba(200,200,200,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._value = 0;
        object._data = {
            'w':width,
            'handleSize':0.9
        };
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    var slot = parts.basic.rect(null, width*0.05, height*0.45, width*0.9, height*0.1, 0, slotStyle);
        object.appendChild(slot);
    var handle = parts.basic.rect('handle', 0, 0, width*0.1, height, 0, handleStyle);
        object.appendChild(handle);


    //methods
    object.get = function(){ return this._value; };
    object.set = function(value, live=false, update=true){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        if(update&&this.onChange){ this.onChange(value); }
        if(update&&!live&&this.onRelease){ this.onRelease(value); }
        this.children['handle'].x.baseVal.valueInSpecifiedUnits = value*this._data.w*this._data.handleSize;
    };
    object.smoothSet = function(target,time,curve,update=true){
        var start = this.get();
        var mux = target-start;
        var stepsPerSecond = Math.round(Math.abs(mux)*100);
        var totalSteps = stepsPerSecond*time;

        var steps = [1];
        switch(curve){
            case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
            case 'sin': steps = __globals.utility.math.curveGenerator.sin(totalSteps); break;
            case 'cos': steps = __globals.utility.math.curveGenerator.cos(totalSteps); break;
            case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
            case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps); break;
            case 'instant': default: break;
        }

        if(steps.length == 0){return;}

        if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
        object.smoothSet.interval = setInterval(function(){
            object.set( (start+(steps.shift()*mux)),true,update );
            if(steps.length == 0){clearInterval(object.smoothSet.interval);}
        },1000/stepsPerSecond);
    };


    //callback
    object.onChange = function(){};
    object.onRelease = function(){};

    
    //mouse interaction
    object.ondblclick = function(){ this.set(0.5); };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.element.getTransform(__globals.panes.global).s;

        this.set( this.get() + move/(10*globalScale) );
    }; 
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.tempRef._data.initialValue = this.get();
        __globals.svgElement.tempRef._data.initialX = event.x;
        __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.w*__globals.svgElement.tempRef._data.handleSize;
        __globals.svgElement.onmousemove = function(event){
            var mux = __globals.svgElement.tempRef._data.mux;
            var value = __globals.svgElement.tempRef._data.initialValue;
            var numerator = __globals.svgElement.tempRef._data.initialX-event.x;
            var divider = __globals.utility.element.getTransform(__globals.panes.global).s;

            __globals.svgElement.tempRef.set( value - numerator/(divider*mux) );
        };
        __globals.svgElement.onmouseup = function(){
            this.tempRef = null;
            this.onmousemove = null;
            this.onmouseleave = null;
            this.onmouseup = null;
        };
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        __globals.svgElement.onmousemove(event);
    };

    return object;
};
this.slide_vertical = function(
    id='slide_vertical', 
    x, y, width, height,
    handleStyle = 'fill:rgba(200,200,200,1)',
    backingStyle = 'fill:rgba(150,150,150,1)',
    slotStyle = 'fill:rgba(50,50,50,1)'
){
    // elements
    var object = parts.basic.g(id, x, y);
        object._value = 0;
        object._data = {
            'h':height,
            'handleSize':0.9
        };
    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    var slot = parts.basic.rect(null, width*0.45, height*0.05, width*0.1, height*0.9, 0, slotStyle);
        object.appendChild(slot);
    var handle = parts.basic.rect('handle', 0, 0, width, height*0.1, 0, handleStyle);
        object.appendChild(handle);


    //methods
    object.get = function(){ return this._value; };
    object.set = function(value, live=false, update=true){
        value = (value>1 ? 1 : value);
        value = (value<0 ? 0 : value);

        this._value = value;
        if(update&&this.onChange){ this.onChange(value); }
        if(update&&!live&&this.onRelease){ this.onRelease(value); }
        this.children['handle'].y.baseVal.valueInSpecifiedUnits = value*this._data.h*this._data.handleSize;
    };
    object.smoothSet = function(target,time,curve,update=true){
        var start = this.get();
        var mux = target-start;
        var stepsPerSecond = Math.round(Math.abs(mux)*100);
        var totalSteps = stepsPerSecond*time;

        var steps = [1];
        switch(curve){
            case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
            case 'sin': steps = __globals.utility.math.curveGenerator.sin(totalSteps); break;
            case 'cos': steps = __globals.utility.math.curveGenerator.cos(totalSteps); break;
            case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
            case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps); break;
            case 'instant': default: break;
        }

        if(steps.length == 0){return;}

        if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
        object.smoothSet.interval = setInterval(function(){
            object.set( (start+(steps.shift()*mux)),true,update );
            if(steps.length == 0){clearInterval(object.smoothSet.interval);}
        },1000/stepsPerSecond);
    };

    
    //callback
    object.onChange = function(){};
    object.onRelease = function(){};
    

    //mouse interaction
    object.ondblclick = function(){ this.set(0.5); };
    object.onwheel = function(event){
        var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
        var globalScale = __globals.utility.element.getTransform(__globals.panes.global).s;

        this.set( this.get() + move/(10*globalScale) );
    }; 
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.tempRef._data.initialValue = this.get();
        __globals.svgElement.tempRef._data.initialY = event.y;
        __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.h*__globals.svgElement.tempRef._data.handleSize;
        __globals.svgElement.onmousemove = function(event){
            var mux = __globals.svgElement.tempRef._data.mux;
            var value = __globals.svgElement.tempRef._data.initialValue;
            var numerator = __globals.svgElement.tempRef._data.initialY-event.y;
            var divider = __globals.utility.element.getTransform(__globals.panes.global).s;

            __globals.svgElement.tempRef.set( value - numerator/(divider*mux) );
        };
        __globals.svgElement.onmouseup = function(){
            this.tempRef = null;
            this.onmousemove = null;
            this.onmouseleave = null;
            this.onmouseup = null;
        };
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        __globals.svgElement.onmousemove(event);
    };

    return object;
};
    }
    this.audio = new function(){
this.audio2percentage = function(){
    return new function(){
        var analyser = {
            timeDomainDataArray: null,
            frequencyData: null,
            refreshRate: 30,
            refreshInterval: null,
            returnedValueLimits: {min:0, max: 256, halfdiff:128},
            resolution: 128
        };
        analyser.analyserNode = __globals.audio.context.createAnalyser();
        analyser.analyserNode.fftSize = analyser.resolution;
        analyser.timeDomainDataArray = new Uint8Array(analyser.analyserNode.fftSize);
        analyser.frequencyData = new Uint8Array(analyser.analyserNode.fftSize);

        this.__render = function(){
                analyser.analyserNode.getByteTimeDomainData(analyser.timeDomainDataArray);

                var numbers = [];
                for(var a = 0; a < analyser.timeDomainDataArray.length; a++){
                    numbers.push(
                        analyser.timeDomainDataArray[a]/analyser.returnedValueLimits.halfdiff - 1
                    );
                }

                var val = 0;
                numbers.forEach(function(item){ if(Math.abs(item) > val){val = Math.abs(item);} });

                this.newValue(val);
        }

        //audio connections
            this.audioIn = function(){return analyser.analyserNode;};

        //methods
            this.start = function(){
                analyser.refreshInterval = setInterval( function(that){ that.__render(); }, 1000/30, this );
            };
            this.stop = function(){
                clearInterval(analyser.refreshInterval);
            };

        //callbacks
            this.newValue = function(a){};
    };
};
this.synthesizer_basic = function(
    context,
    waveType='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, 
    attack={time:0.01, curve:'linear'}, release={time:0.05, curve:'linear'},
    detune=0, octave=0
){
    //components
        var mainOut = context.createGain();
            mainOut.gain.setTargetAtTime(gain, context.currentTime, 0);

    //live oscillators
        var liveOscillators = {};

    //options
        this.waveType = function(a){if(a==null){return waveType;}waveType=a;};
        this.periodicWave = function(a){if(a==null){return periodicWave;}periodicWave=a;};
        this.gain = function(target,time,curve){
            return changeAudioParam(mainOut.gain,target,time,curve);
        };
        this.attack = function(time,curve){
            if(time==null&&curve==null){return attack;}
            attack.time = time ? time : attack.time;
            attack.curve = curve ? curve : attack.curve;
        };
        this.release = function(time,curve){
            if(time==null&&curve==null){return release;}
            release.time = time ? time : release.time;
            release.curve = curve ? curve : release.curve;
        };
        this.octave = function(a){if(a==null){return octave;}octave=a;};
        this.detune = function(target,time,curve){
            if(a==null){return detune;}

            //change stored value for any new oscillators that are made
                var start = detune;
                var mux = target-start;
                var stepsPerSecond = Math.round(Math.abs(mux));
                var totalSteps = stepsPerSecond*time;

                var steps = [1];
                switch(curve){
                    case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
                    case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
                    case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps,8); break;
                    case 'instant': default: break;
                }
                
                if(steps.length != 0){
                    var interval = setInterval(function(){
                        detune = start+(steps.shift()*mux);
                        if(steps.length == 0){clearInterval(interval);}
                    },1000/stepsPerSecond);
                }

            //instruct liveOscillators to adjust their values
                var OSCs = Object.keys(liveOscillators);
                for(var b = 0; b < OSCs.length; b++){ 
                    liveOscillators[OSCs[b]].detune(target,time,curve);
                }
        };

    //output node
        this.out = function(){return mainOut;}

    //oscillator generator
        function makeOSC(
            context, connection, midiNumber,
            type, periodicWave, 
            gain, attack, release,
            detune, octave
        ){
            return new function(){
                this.generator = context.createOscillator();
                    if(type == 'custom'){ 
                        this.generator.setPeriodicWave( 
                            // context.createPeriodicWave(new Float32Array(periodicWave.sin),new Float32Array(periodicWave.cos))
                            context.createPeriodicWave(new Float32Array(periodicWave.cos),new Float32Array(periodicWave.sin))
                        ); 
                    }else{ this.generator.type = type; }
                    this.generator.frequency.setTargetAtTime(__globals.audio.midiNumber_frequency(midiNumber,octave), context.currentTime, 0);
                    this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
                    this.generator.start(0);

                this.gain = context.createGain();
                    this.generator.connect(this.gain);
                    this.gain.gain.setTargetAtTime(0, context.currentTime, 0);
                    changeAudioParam(this.gain.gain, gain, attack.time, attack.curve, false);
                    this.gain.connect(connection);

                this.detune = function(target,time,curve){
                    changeAudioParam(this.generator.detune,target,time,curve);
                };
                this.changeVelocity = function(a){
                    changeAudioParam(this.gain.gain,a,attack.time,attack.curve);
                };
                this.stop = function(){
                    changeAudioParam(this.gain.gain,0,release.time,release.curve, false);
                    setTimeout(function(that){
                        that.gain.disconnect(); 
                        that.generator.stop(); 
                        that.generator.disconnect(); 
                        that.gain=null; 
                        that.generator=null; 
                    }, release.time*1000, this);
                };
            };
        }

    //methods
        this.perform = function(note){
            if( !liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
            else if( !liveOscillators[note.num] ){ 
                //create new tone
                liveOscillators[note.num] = makeOSC(context, mainOut, note.num, waveType, periodicWave, note.velocity, attack, release, detune, octave); 
            }
            else if( note.velocity == 0 ){ 
                //stop and destroy tone
                liveOscillators[note.num].stop();
                delete liveOscillators[note.num];
            }
            else{
                //adjust tone
                liveOscillators[note.num].changeVelocity(note.velocity);
            }
        };
        this.panic = function(){
            var OSCs = Object.keys(liveOscillators);
            for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
        };

    //functions
        function changeAudioParam(audioParam,target,time,curve,cancelScheduledValues=true){
            if(target==null){return audioParam.value;}

            if(cancelScheduledValues){
                audioParam.cancelScheduledValues(context.currentTime);
            }
            
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
        }
};
    }
    this.dynamic = new function(){
this.cable = function(
    id=null, 
    x1=0, y1=0, x2=0, y2=0,
    style='fill:none; stroke:rgb(255,0,0); stroke-width:4;',
    activeStyle='fill:none; stroke:rgb(255,100,100); stroke-width:4;'
){
    //elements
    var object = parts.basic.g(id, x1, y1)
        object.points = [{x:x1,y:y1},{x:x2,y:y2}];
        object.styles = {
            'normal':style,
            'active':activeStyle
        };
    var line = parts.basic.path(null, path=object.points, 'L', style);
        object.appendChild(line);


    //methods
    object.activate = function(){ line.style = this.styles.active; };
    object.disactivate = function(){ line.style = this.styles.normal; };
    object.draw = function(x1, y1, x2, y2){
        this.points = [{x:x1,y:y1},{x:x2,y:y2}];
        line.path(this.points);
    };
    object.redraw = function(x1=null,y1=null,x2=null,y2=null){
        x1 = (x1!=null ? x1 : this.x1); y1 = (y1 ? y1 : this.y1);
        x2 = (x2!=null ? x2 : this.x2); y2 = (y2 ? y2 : this.y2);
        this.draw(x1, y1, x2, y2);
    };


    return object;
};
this.connectionNode_audio = function(
    id='connectionNode_audio', type=0, //input = 0, output = 1
    x, y, width, height, audioContext,
    style='fill:rgba(255, 220, 220,1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._type = 'audio';
        object._cable = null;
        object._cableStyle = 'fill:none; stroke:rgb(242, 119, 84); stroke-width:4;';
        object._cableActiveStyle = 'fill:none; stroke:rgb(242, 161, 138); stroke-width:4;';
        object._boundary = {'width':width, 'height':height};
        object._audioNode = audioContext.createAnalyser();
        object._portType = type; if(type!=0&&type!=1){type=0;}
    var rect = parts.basic.rect('tab', 0, 0, width, height, 0, style);
        object.appendChild(rect);


    //network functions
    object.onConnect = function(){};
    object.onDisconnect = function(){};


    //internal connections
    object.out = function(){return this._audioNode;};
    object.in = function(){return this._audioNode;};

    
    //connecting and disconnecting
    object.connectTo = function(foreignObject){
        if( !foreignObject._type ){return;}
        else if( foreignObject._type != this._type ){ /*console.log('error: selected destination is not the same type as this node');*/ return; }
        else if( foreignObject._portType == this._portType ){ /*console.log('error: cannot connect', (this._portType==0?'input':'output'), 'node to', (foreignObject._portType==0?'input':'output'), 'node');*/ return; }
        else if( foreignObject == this ){ /*console.log('error: cannot connect node to itself');*/ return; }
        else if( foreignObject == this.foreignNode ){ /*console.log('error: attempting to make existing connection');*/ return; }

        this.disconnect();

        this.foreignNode = foreignObject;
        if(this._portType == 1){ this._audioNode.connect(this.foreignNode._audioNode); }
        this.foreignNode._receiveConnection(this);
        this._add_cable();

        this.onConnect();
    };
    object._receiveConnection = function(foreignObject){
        this.disconnect();

        this.foreignNode = foreignObject;
        if(this._portType == 1){ this._audioNode.connect(this.foreignNode._audioNode); }

        this.onConnect();
    };
    object.disconnect = function(){
        if( !this.foreignNode ){return;}

        this._remove_cable();
        this.foreignNode._receiveDisconnection();
        if(this._portType == 1){ this._audioNode.disconnect(this.foreignNode._audioNode); }
        this.foreignNode = null;

        this.onDisconnect();
    };
    object._receiveDisconnection = function(){
        if(this._portType == 1){ this._audioNode.disconnect(this.foreignNode._audioNode); }
        this.foreignNode = null;
        this.onDisconnect();
    };


    //mouse interface
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.onmouseup = function(event){
            var destination = document.elementFromPoint(event.x, event.y).parentElement;
            __globals.svgElement.tempRef.connectTo(destination);
            __globals.svgElement.tempRef = null;
            this.onmouseup = null;
        };
    };
    object.ondblclick = function(){
        this.disconnect();
    };


    //cabling
    object._add_cable = function(){
        this._cable = parts.dynamic.cable(null, 0, 0, 0, 0, this._cableStyle, this._cableActiveStyle);
        this.foreignNode._receive_cable(this._cable);
        __globals.utility.workspace.getPane(this).appendChild(this._cable); // <-- should probably make prepend
        this.draw();
    };
    object._receive_cable = function(_cable){
        this._cable = _cable;
    };
    object._remove_cable = function(){
        __globals.utility.workspace.getPane(this).removeChild(this._cable);
        this.foreignNode._lose_cable();
        this._cable = null;
    };
    object._lose_cable = function(){
        this._cable = null;
    };
    object.draw = function(){
        if( !object._cable ){return;}
        
        var t1 = __globals.utility.element.getCumulativeTransform(this);
        var t2 = __globals.utility.element.getCumulativeTransform(this.foreignNode);

        this._cable.draw( 
            t1.x + this._boundary.width/2, 
            t1.y + this._boundary.height/2, 
            t2.x + this.foreignNode._boundary.width/2, 
            t2.y + this.foreignNode._boundary.height/2
        );
    };
    object.redraw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.element.getCumulativeTransform(this);
        var t2 = __globals.utility.element.getCumulativeTransform(this.foreignNode);

        this._cable.redraw( 
            t1.x + this._boundary.width/2, 
            t1.y + this._boundary.height/2, 
            t2.x + this.foreignNode._boundary.width/2, 
            t2.y + this.foreignNode._boundary.height/2
        );
    };


    return object;
};
this.connectionNode_data = function(
    id='connectionNode_data',
    x, y, width, height, rotation=0,
    style='fill:rgba(220, 244, 255,1)',
    glowStyle='fill:rgba(244, 244, 255, 1)'
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._type = 'data';
        object._rotation = rotation;
        object._cable = null;
        object._cableStyle = 'fill:none; stroke:rgb(84, 146, 247); stroke-width:4;';
        object._cableActiveStyle = 'fill:none; stroke:rgb(123, 168, 242); stroke-width:4;';
        object._boundary = {'width':width, 'height':height};
    var rect = parts.basic.rect('tab', 0, 0, width, height, rotation, style);
        object.appendChild(rect);


    //network functions
    object.send = function(address, data=null){
        object.activate();
        setTimeout(function(){
            if(!object){return;} 
            object.disactivate();
            if(object._cable){
                object._cable.disactivate();
                object.foreignNode.disactivate();
            }
        },100);

        if(!object.foreignNode){ /*console.log('send::error: node unconnected');*/ return; }
        object.foreignNode.receive(address, data);

        object._cable.activate();
        object.foreignNode.activate();
    };
    object.receive = function(address, data=null){};
    object.request = function(address){
        if(!this.foreignNode){ /*console.log('request::error: node unconnected');*/ return; }
        return this.foreignNode.give(address);
    };
    object.give = function(address){};
    object.onConnect = function(){};
    object.onDisconnect = function(){};


    //graphical
    object.activate = function(){ __globals.utility.element.setStyle(rect, glowStyle); };
    object.disactivate = function(){ __globals.utility.element.setStyle(rect, style); };


    //connecting and disconnecting
    object.connectTo = function(foreignObject){
        if( !foreignObject._type ){return;}
        else if( foreignObject._type != this._type ){ /*console.log('error: selected destination is not the same type as this node');*/ return; }
        else if( foreignObject == this ){ /*console.log('error: cannot connect node to itself');*/ return; }
        else if( foreignObject == this.foreignNode ){ /*console.log('error: attempting to make existing connection');*/ return; }

        this.disconnect();

        this.foreignNode = foreignObject;
        this.foreignNode._receiveConnection(this);
        this._add_cable();

        this.onConnect();
        this.foreignNode.onConnect();
    };
    object._receiveConnection = function(foreignObject){
        this.disconnect();

        this.foreignNode = foreignObject;
    };
    object.disconnect = function(){
        if( !this.foreignNode ){return;}

        this._remove_cable();
        this.foreignNode._receiveDisconnection();
        this.foreignNode = null;

        this.onDisconnect();
    };
    object._receiveDisconnection = function(){
        this.foreignNode = null;
        this.onDisconnect();
    };


    //mouse interface
    object.onmousedown = function(event){
        __globals.svgElement.tempRef = this;
        __globals.svgElement.onmouseup = function(event){
            var destination = document.elementFromPoint(event.x, event.y).parentElement;
            __globals.svgElement.tempRef.connectTo(destination);
            __globals.svgElement.tempRef = null;
            this.onmouseup = null;
        };
    };
    object.ondblclick = function(){
        this.disconnect();
    };


    //cabling
    object._add_cable = function(){
        this._cable = parts.dynamic.cable(null, 0, 0, 0, 0, this._cableStyle, this._cableActiveStyle);
        this.foreignNode._receive_cable(this._cable);
        __globals.utility.workspace.getPane(this).appendChild(this._cable); // <-- should probably make prepend
        this.draw();
    };
    object._receive_cable = function(_cable){
        this._cable = _cable;
    };
    object._remove_cable = function(){
        __globals.utility.workspace.getPane(this).removeChild(this._cable);
        this.foreignNode._lose_cable();
        this._cable = null;
    };
    object._lose_cable = function(){
        this._cable = null;
    };
    object.draw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.element.getCumulativeTransform(this);
        var t2 = __globals.utility.element.getCumulativeTransform(this.foreignNode);
        var center_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
        var center_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};

        if(this._rotation != 0){
            var temp = __globals.utility.math.cartesian2polar(center_local.x,center_local.y);
            temp.ang += this._rotation;
            center_local = __globals.utility.math.polar2cartesian(temp.ang,temp.dis);
        }

        if(this.foreignNode._rotation != 0){
            var temp = __globals.utility.math.cartesian2polar(center_foreign.x,center_foreign.y);
            temp.ang += this.foreignNode._rotation;
            center_foreign = __globals.utility.math.polar2cartesian(temp.ang,temp.dis);
        }

        this._cable.draw( 
            t1.x + center_local.x,
            t1.y + center_local.y, 
            t2.x + center_foreign.x,
            t2.y + center_foreign.y
        );
    };
    object.redraw = function(){
        if( !object._cable ){return;}

        var t1 = __globals.utility.element.getCumulativeTransform(this);
        var t2 = __globals.utility.element.getCumulativeTransform(this.foreignNode);
        var center_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
        var center_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};

        if(this._rotation != 0){
            var temp = __globals.utility.math.cartesian2polar(center_local.x,center_local.y);
            temp.ang += this._rotation;
            center_local = __globals.utility.math.polar2cartesian(temp.ang,temp.dis);
        }

        if(this.foreignNode._rotation != 0){
            var temp = __globals.utility.math.cartesian2polar(center_foreign.x,center_foreign.y);
            temp.ang += this.foreignNode._rotation;
            center_foreign = __globals.utility.math.polar2cartesian(temp.ang,temp.dis);
        }

        this._cable.draw( 
            t1.x + center_local.x,
            t1.y + center_local.y, 
            t2.x + center_foreign.x,
            t2.y + center_foreign.y
        );
    };


    return object;
};
    }
};
            
__globals.objects = {};
__globals.objects.make_audioDuplicator = function(x,y){
    //set numbers
    var type = 'audioDuplicator';
    var shape = {
        base: [{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
        littleConnector: { width: 20, height: 20 },
        connection_audio_in:{x:55-20/2, y:20*0.25, width:20, height:20},
        connection_audio_out_1:{x:-(20/2), y:20*0.25, width:20, height:20},
        connection_audio_out_2:{x:-(20/2), y:20*1.5, width:20, height:20},
        markings:{
            rect:[
                //flow lines
                {x:(20/4), y:(20*0.25 + 20/2), width:45, height:2, angle:0}, //top horizontal
                {x:(55*0.5), y:(20*0.25 + 20/2), width:2, height:25.5, angle:0}, //vertical
                {x:(20/4), y:(20*1.5  + 20/2), width:24.5, height:2, angle:0} //bottom horizontal
            ],
            path:[
                [{x:10, y:(20*0 + 20/2)+1},   {x:2.5,y:(20*0.25 + 20/2)+1},{x:10, y:(20*0.5 + 20/2)+1}], //upper arrow
                [{x:10, y:(20*1.25 + 20/2)+1},{x:2.5,y:(20*1.5 + 20/2)+1}, {x:10, y:(20*1.75 + 20/2)+1}] //lower arrow
            ]
        }
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
    };


    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //markings
            for(var a = 0; a < shape.markings.rect.length; a++){
                _mainObject.append(parts.basic.rect(null, shape.markings.rect[a].x,shape.markings.rect[a].y,shape.markings.rect[a].width,shape.markings.rect[a].height,shape.markings.rect[a].angle, style.markings));
            }
            for(var a = 0; a < shape.markings.path.length; a++){
                _mainObject.append(parts.basic.path(null, shape.markings.path[a], 'L', style.markings));
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in = parts.dynamic.connectionNode_audio('_mainObject.io.in', 0, shape.connection_audio_in.x, shape.connection_audio_in.y, shape.connection_audio_in.width, shape.connection_audio_in.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.in);
        _mainObject.io.out_1 = parts.dynamic.connectionNode_audio('_mainObject.io.out_1', 1, shape.connection_audio_out_1.x, shape.connection_audio_out_1.y, shape.connection_audio_out_1.width, shape.connection_audio_out_1.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.out_1);
        _mainObject.io.out_2 = parts.dynamic.connectionNode_audio('_mainObject.io.out_2', 1, shape.connection_audio_out_2.x, shape.connection_audio_out_2.y, shape.connection_audio_out_2.width, shape.connection_audio_out_2.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.out_2);
    
        _mainObject.io.in.out().connect(_mainObject.io.out_1.in());
        _mainObject.io.in.out().connect(_mainObject.io.out_2.in());

    return _mainObject;
};
__globals.objects.make_audioScope = function(x,y){
    //set numbers
        var type = 'audioScope';
        var attributes = {
            framerateLimits: {min:1, max:30}
        };
        var shape = {
            base: [{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}],
            connector: { width: 20, height: 20 },
            graph: {x:5, y:5, width:150, height:100},
            holdKey: {x: 160, y: 5, width: 30, height: 20},
            dial: {x: 155, y: 30},
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:5px; font-family:Courier New; pointer-events: none;',
            button: {
                up: 'fill:rgba(175,175,175,1)',
                hover: 'fill:rgba(220,220,220,1)',
                down: 'fill:rgba(150,150,150,1)'
            },
            dial: {
                handle: 'fill:rgba(220,220,220,1)',
                slot: 'fill:rgba(50,50,50,1)',
                needle: 'fill:rgba(250,150,250,1)',
                markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
            }
        };

    //main
        var _mainObject = parts.basic.g(type, x, y);
            _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);
        //generate selection area
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //waveport
        var graph = parts.display.grapher_audioScope(null, shape.graph.x, shape.graph.y, shape.graph.width, shape.graph.height);
            _mainObject.append(graph);
            graph.start();

        //hold key
        var holdKey = parts.control.key_rect(null, shape.holdKey.x, shape.holdKey.y, shape.holdKey.width, shape.holdKey.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(holdKey);
            holdKey.onkeydown = function(){graph.stop();};
            holdKey.onkeyup =   function(){graph.start();};

        //framerate dial
            _mainObject.append(parts.display.label(null, shape.dial.x+6.5,  shape.dial.y+40, 'framerate', style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+6,    shape.dial.y+34, '1',        style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+16.5, shape.dial.y+4,  '15',       style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+30,   shape.dial.y+34, '30',       style.text));
            var dial_framerate = parts.control.dial_continuous(
                'dial_framerate', shape.dial.x+20, shape.dial.y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_framerate);
            dial_framerate.onChange = function(a){
                graph.refreshRate(
                    attributes.framerateLimits.min + Math.floor((attributes.framerateLimits.max - attributes.framerateLimits.min)*a)
                );
            };
            dial_framerate.set(1);

    //connection nodes
        _mainObject.io = {};
        _mainObject.io.audioIn = parts.dynamic.connectionNode_audio('_mainObject.io.audioIn', 0, shape.base[2].x-shape.connector.width*0.5, shape.connector.height*0.5, shape.connector.width, shape.connector.height, __globals.audio.context);
            _mainObject.prepend(_mainObject.io.audioIn);
            _mainObject.io.audioIn.out().connect(graph.getNode());
            
    return _mainObject;
}
__globals.objects.make_audioSink = function(x,y){
    //set numbers
        var type = 'audioSink';
        var shape = {};
            shape.base = [{x:0,y:0},{x:100,y:0},{x:100,y:55},{x:0,y:55}];
            shape.connector = { width: 20, height: 20 };
            shape.connections = {};
                shape.connections.audio = [];
                    shape.connections.audio.push(
                        {
                            name: type+'.io.audio.in:right',
                            type: 0,
                            x:shape.base[2].x-shape.connector.width/2, 
                            y:shape.connector.height*0.25, 
                            width:shape.connector.width, 
                            height:shape.connector.height
                        },
                        {
                            name: type+'.io.audio.in:left',
                            type: 0,
                            x:shape.base[2].x-shape.connector.width/2, 
                            y:shape.base[2].y-shape.connector.height*1.25, 
                            width:shape.connector.width, 
                            height:shape.connector.height
                        }
                    );
        
        var style = {
            background: 'fill:rgba(200,200,200,1)',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'
        };

    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //circuitry
        //audio destination
            _mainObject._destination = __globals.audio.context.destination;
        //panning nodes
            var pan_right = __globals.audio.context.createStereoPanner();
                pan_right.pan.setValueAtTime(1, __globals.audio.context.currentTime);
                pan_right.connect(_mainObject._destination);
            var pan_left  = __globals.audio.context.createStereoPanner();
                pan_left.pan.setValueAtTime(-1, __globals.audio.context.currentTime);
                pan_left.connect(_mainObject._destination);

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);
   
        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //levels
            var audioMeter_right = parts.display.audio_meter_level('audioMeter_right', 10, 5, 0, 5, 45);
            _mainObject.append(audioMeter_right);
            audioMeter_right.start();
            var audioMeter_left = parts.display.audio_meter_level('audioMeter_left', 5, 5, 0, 5, 45);
            _mainObject.append(audioMeter_left);
            audioMeter_left.start();

    //connection nodes
        _mainObject.io = {};

        //audio
            shape.connections.audio.forEach(function(data){
                _mainObject.io[data.name] = parts.dynamic.connectionNode_audio(data.name, data.type, data.x, data.y, data.width, data.height, __globals.audio.context);
                _mainObject.prepend(_mainObject.io[data.name]);
            });

            _mainObject.io['audioSink.io.audio.in:right'].out().connect(audioMeter_right.audioIn());
            _mainObject.io['audioSink.io.audio.in:right'].out().connect(pan_right);
            _mainObject.io['audioSink.io.audio.in:left'].out().connect(audioMeter_left.audioIn());
            _mainObject.io['audioSink.io.audio.in:left'].out().connect(pan_left);

    return _mainObject;
};
__globals.objects.make_basicSynth2 = function(x,y){
    //set numbers
    var type = 'basicSynth2';
    var attributes = {
        detuneLimits: {min:-100, max:100}
    };
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
        h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
        text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',

        markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',

        handle: 'fill:rgba(220,220,220,1)',
        slot: 'fill:rgba(50,50,50,1)',
        needle: 'fill:rgba(250,150,150,1)'
    };
    var shape = {
        base: [{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90}],
        markings:{
            rect:{
                periodicWaveType: {
                    x: 230, y: 21.75, angle: 0,
                    width: 10, height: 2.5,
                    style: style.slot
                }
            },
            text:{
                gainWobble: {
                    x: 10, y: 70, angle: -Math.PI/2,
                    text: 'gain',
                    style: style.h2
                },
                detuneWobble: {
                    x: 95, y: 70, angle: -Math.PI/2,
                    text: 'detune',
                    style: style.h2
                }
            },
        },
        connector: {
            audio:{
                audioOut:{ type: 1, x: -15, y: 5, width: 30, height: 30 },
            },
            data:{
                gain:    { x: 12.5+(40*0), y: -7.5, width: 15, height: 15, receive: function(address,data){
                    switch(address){
                        case '%': _mainObject.dial.continuous.gain.set(data); break;
                        case '%t': 
                            _mainObject.__synthesizer.gain(data.target,data.time,data.curve);
                            _mainObject.dial.continuous.gain.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }},
                attack:  { x: 12.5+(40*1), y: -7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.attack.set(data); } },
                release: { x: 12.5+(40*2), y: -7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.release.set(data); } },
                detune:  { x: 12.5+(40*3), y: -7.5, width: 15, height: 15, receive: function(address,data){ 
                    switch(address){
                        case '%': _mainObject.dial.continuous.detune.set(data); break;
                        case '%t': 
                            _mainObject.__synthesizer.detune((data.target*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min),data.time,data.curve);
                            _mainObject.dial.continuous.detune.smoothSet(data.target,data.time,data.curve,false);
                        break;
                        default: break;
                    }
                }},
                octave:  { x: 12.5+(40*4), y: -7.5, width: 15, height: 15, receive: function(address,data){ if(address != 'discrete'){return;} _mainObject.dial.discrete.octave.select(data); } },
                waveType:{ x: 12.5+(40*5), y: -7.5, width: 15, height: 15, receive: function(address,data){ if(address != 'discrete'){return;} _mainObject.dial.discrete.waveType.select(data); } },
                periodicWave:{ x: 232.5, y: 12.5, width: 15, height: 15, receive: function(address,data){ if(address != 'periodicWave'){return;} _mainObject.__synthesizer.periodicWave(data); } },
                midiNote:{ x: 217.5, y: 37.5, width: 30, height: 30, angle: Math.PI/4, receive: function(address,data){  if(address != 'midiNumber'){return;} _mainObject.__synthesizer.perform(data); } },
                gainWobblePeriod:{ x: 12.5+(40*0), y: 90-7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.gainWobblePeriod.set(data); } },
                gainWobbleDepth:{ x: 12.5+(40*1), y: 90-7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.gainWobbleDepth.set(data); } },
                detuneWobblePeriod:{ x: 12.5+(40*2), y: 90-7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.detuneWobblePeriod.set(data); } },
                detuneWobbleDepth:{ x: 12.5+(40*3), y: 90-7.5, width: 15, height: 15, receive: function(address,data){ if(address != '%'){return;} _mainObject.dial.continuous.detuneWobbleDepth.set(data); } },
            }
        },
        button:{
            panicButton:{
                x: 197.5, y: 47.5,
                width: 20, height: 20,
                angle: Math.PI/4,
                upStyle: 'fill:rgba(175,175,175,1)',
                hoverStyle: 'fill:rgba(220,220,220,1)',
                downStyle: 'fill:rgba(150,150,150,1)',
                glowStyle: 'fill:rgba(220,200,220,1)',
                onclick: function(){_mainObject.__synthesizer.panic();}
            }
        },
        dial:{
            gain:{
                type: 'continuous',
                x: (40*0)+20, y: (3)+20, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*0)+11,   y: (3)+40, text: 'gain', style: style.h1 },
                    { name: null, x: (40*0)+7,    y: (3)+34, text: '0',    style: style.h2 },
                    { name: null, x: (40*0)+16.5, y: (3)+5,  text: '1/2',  style: style.h2 },
                    { name: null, x: (40*0)+30,   y: (3)+34, text: '1',    style: style.h2 },
                ],
                onChange: function(value){ _mainObject.__synthesizer.gain( value ); },
            },
            attack:{
                type: 'continuous',
                x: (40*1)+20, y: 3+20, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*1)+7,    y: (3)+40, text: 'attack', style: style.h1 },
                    { name: null, x: (40*1)+7,    y: (3)+34, text: '0',      style: style.h2 },
                    { name: null, x: (40*1)+18.5, y: (3)+4,  text: '5',      style: style.h2 },
                    { name: null, x: (40*1)+30,   y: (3)+34, text: '10',     style: style.h2 },
                ],
                onChange: function(value){ _mainObject.__synthesizer.attack( value ); },
            },
            release:{
                type: 'continuous',
                x: (40*2)+20, y: 3+20, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*2)+5,    y: (3)+40, text: 'release', style: style.h1 },
                    { name: null, x: (40*2)+5,    y: (3)+34, text: '0',       style: style.h2 },
                    { name: null, x: (40*2)+18.5, y: (3)+4,  text: '5',       style: style.h2 },
                    { name: null, x: (40*2)+30,   y: (3)+34, text: '10',      style: style.h2 },
                ],
                onChange: function(value){ _mainObject.__synthesizer.release( value ); },
            },
            detune:{
                type: 'continuous',
                x: (40*3)+20, y: 3+20, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: (40*3)+7,     y: (3)+40, text: 'detune', style: style.h1 },
                    { name: null, x: (40*3)+2,     y: (3)+34, text: '-100',   style: style.h2 },
                    { name: null, x: (40*3)+18.75, y: (3)+4,  text: '0',      style: style.h2 },
                    { name: null, x: (40*3)+28,    y: (3)+34, text: '100',    style: style.h2 },
                ],
                onChange: function(value){ _mainObject.__synthesizer.detune( value*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min ); },
            },
            octave:{
                type: 'discrete',
                x: (40*4)+20, y: 3+20, r: 12,
                optionCount: 7,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: undefined,
                labels:[
                    { name: null, x: (40*4)+7,     y: (3)+40, text: 'octave', style: style.h1 },
                    { name: null, x: (40*4)+4,     y: (3)+32, text: '-3',     style: style.h2 },
                    { name: null, x: (40*4)+0,     y: (3)+21, text: '-2',     style: style.h2 },
                    { name: null, x: (40*4)+4,     y: (3)+10, text: '-1',     style: style.h2 },
                    { name: null, x: (40*4)+18.75, y: (3)+5,  text: '0',      style: style.h2 },
                    { name: null, x: (40*4)+30,    y: (3)+10, text: '1',      style: style.h2 },
                    { name: null, x: (40*4)+35,    y: (3)+21, text: '2',      style: style.h2 },
                    { name: null, x: (40*4)+30,    y: (3)+32, text: '3',      style: style.h2 },
                ],
                onChange: function(value){ _mainObject.__synthesizer.octave(value-3); },
            },
            waveType:{
                type: 'discrete',
                x: (40*5)+20, y: 3+20, r: 12,
                optionCount: 5,
                startAngle: (3*Math.PI)/4, maxAngle: (5*Math.PI)/4,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: undefined,
                labels:[
                    { name: null, x: (40*5)+11, y: (3)+40, text: 'wave', style: style.h1 },
                    { name: null, x: (40*5)+0,  y: (3)+32, text: 'sine', style: style.h2 },
                    { name: null, x: (40*5)-1,  y: (3)+18, text: 'tri',  style: style.h2 },
                    { name: null, x: (40*5)+10, y: (3)+6,  text: 'squ',  style: style.h2 },
                    { name: null, x: (40*5)+27, y: (3)+7,  text: 'saw',  style: style.h2 },
                ],
                onChange: function(value){ _mainObject.__synthesizer.waveType(['sine','triangle','square','sawtooth','custom'][value]); },
            },
            gainWobblePeriod: {
                type: 'continuous',
                x: 10+(40*0)+20, y: 3+62, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: 10+(40*0)+11, y: (3+42)+40, text: 'rate', style: style.h1 },
                    { name: null, x: 10+(40*0)+6,  y: (3+42)+34, text: '0',    style: style.h2 },
                    { name: null, x: 10+(40*0)+18, y: (3+42)+4,  text: '50',   style: style.h2 },
                    { name: null, x: 10+(40*0)+30, y: (3+42)+34, text: '100',  style: style.h2 },
                ],
                onChange: function(value){ _mainObject.__synthesizer.gainWobblePeriod( (1-value)<0.01?0.011:(1-value) ); },
            },
            gainWobbleDepth: {
                type: 'continuous',
                x: 5+(40*1)+20, y: 3+62, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: 5+(40*1)+9,  y: (3+42)+40, text: 'depth', style: style.h1 },
                    { name: null, x: 5+(40*1)+5,  y: (3+42)+34, text: '0',     style: style.h2 },
                    { name: null, x: 5+(40*1)+16, y: (3+42)+4,  text: '1/2',   style: style.h2 },
                    { name: null, x: 5+(40*1)+32, y: (3+42)+34, text: '1',     style: style.h2 },
                ],
                onChange: function(value){_mainObject.__synthesizer.gainWobbleDepth(value);},
            },
            detuneWobblePeriod: {
                type: 'continuous',
                x: 14+(40*2)+20, y: 3+62, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: 14+(40*2)+11, y: (3+42)+40, text: 'rate', style: style.h1 },
                    { name: null, x: 14+(40*2)+6,  y: (3+42)+34, text: '0',    style: style.h2 },
                    { name: null, x: 14+(40*2)+18, y: (3+42)+4,  text: '50',   style: style.h2 },
                    { name: null, x: 14+(40*2)+30, y: (3+42)+34, text: '100',  style: style.h2 },
                ],
                onChange: function(value){ _mainObject.__synthesizer.detuneWobblePeriod( (1-value)<0.01?0.011:(1-value) ); },
            },
            detuneWobbleDepth: {
                type: 'continuous',
                x: 9+(40*3)+20, y: 3+62, r: 12,
                startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                handleStyle: style.handle,
                slotStyle: style.slot,
                needleStyle: style.needle,
                arcDistance: 1.2,
                outerArcStyle: style.markings,
                labels:[
                    { name: null, x: 9+(40*3)+9,  y: (3+42)+40, text: 'depth', style: style.h1 },
                    { name: null, x: 9+(40*3)+5,  y: (3+42)+34, text: '0',     style: style.h2 },
                    { name: null, x: 9+(40*3)+16, y: (3+42)+4,  text: '1/2',   style: style.h2 },
                    { name: null, x: 9+(40*3)+32, y: (3+42)+34, text: '1',     style: style.h2 },
                ],
                onChange: function(value){_mainObject.__synthesizer.detuneWobbleDepth(value*100);},
            }
        }
    };

    //main
        var _mainObject = parts.basic.g(type, x, y);
            _mainObject._type = type;

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //markings
            //text
                var keys = Object.keys( shape.markings.text );
                for(var a = 0; a < keys.length; a++){
                    var data = shape.markings.text[keys[a]];
                    _mainObject.append(parts.display.label(keys[a], data.x, data.y, data.text, data.style, data.angle));
                }
            //rect
                var keys = Object.keys( shape.markings.rect );
                for(var a = 0; a < keys.length; a++){
                    var data = shape.markings.rect[keys[a]];
                    _mainObject.append(parts.basic.rect(keys[a], data.x, data.y, data.width, data.height, data.angle, data.style));
                }

        //buttons
            _mainObject.button = {};

            var keys = Object.keys( shape.button );
            for(var a = 0; a < keys.length; a++){
                var data = shape.button[keys[a]];
                var temp = parts.control.button_rect(
                    keys[a], 
                    data.x, data.y, 
                    data.width, data.height, 
                    data.angle, 
                    data.upStyle, data.hoverStyle, data.downStyle, data.glowStyle
                );
                temp.onclick = data.onclick;
                _mainObject.button[keys[a]] = temp;
                _mainObject.append(temp);
            }

        //dials
            _mainObject.dial = {continuous:{}, discrete:{}};

            var keys = Object.keys(shape.dial);
            for(var a = 0; a < keys.length; a++){
                var data = shape.dial[keys[a]];
                var labelKeys = Object.keys(data.labels);
                for(var b = 0; b < labelKeys.length; b++){
                    var label = data.labels[labelKeys[b]];
                    _mainObject.append(parts.display.label(labelKeys[b], label.x, label.y, label.text, label.style));
                }

                if(data.type == 'continuous'){
                    var dial = parts.control.dial_continuous(
                        keys[a],
                        data.x, data.y, data.r,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.continuous[keys[a]] = dial;
                }
                else if(data.type == 'discrete'){
                    var dial = parts.control.dial_discrete(
                        keys[a],
                        data.x, data.y, data.r,
                        data.optionCount,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.discrete[keys[a]] = dial;
                }else{console.error('unknow dial type: "'+ data.type + '"'); var dial = null;}

                dial.onChange = data.onChange;
                dial.onRelease = data.onRelease;
                _mainObject.append(dial);
            }


        //connection nodes
            _mainObject.io = {};

            var keys = Object.keys(shape.connector.audio);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.audio[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_audio( keys[a], data.type, data.x, data.y, data.width, data.height, __globals.audio.context );
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

            var keys = Object.keys(shape.connector.data);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.data[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_data( keys[a], data.x, data.y, data.width, data.height, data.angle);
                _mainObject.io[keys[a]].receive = data.receive;
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

    //circuitry
        _mainObject.__synthesizer = new parts.audio.synthesizer2(__globals.audio.context);
        _mainObject.__synthesizer.out().connect( _mainObject.io.audioOut.in() );

    //setup
        _mainObject.dial.continuous.gain.set(0.5);
        _mainObject.dial.continuous.detune.set(0.5);
        _mainObject.dial.discrete.octave.select(3);

    return _mainObject;
};
__globals.objects.make_dataDuplicator = function(x,y){
    //set numbers
    var type = 'dataDuplicator';
    var shape = {
        base: [{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
        littleConnector: { width: 20, height: 20 },
        markings:{
            rect:[
                //flow lines
                {x:(20/4), y:(20*0.25 + 20/2), width:45, height:2, angle:0}, //top horizontal
                {x:(55*0.5), y:(20*0.25 + 20/2), width:2, height:25, angle:0}, //vertical
                {x:(55*0.5), y:(20*1.5  + 20/2), width:22.5, height:2, angle:0} //bottom horizontal
            ],
            path:[
                [{x:(55-10), y:(20*0 + 20/2)+1},{x:(55-2.5),y:(20*0.25 + 20/2)+1},{x:(55-10), y:(20*0.5 + 20/2)+1}], //upper arrow
                [{x:(55-10), y:(20*1.25 + 20/2)+1},{x:(55-2.5),y:(20*1.5 + 20/2)+1},{x:(55-10), y:(20*1.75 + 20/2)+1}] //lower arrow
            ]
        }
    };
    var style = {        
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        markings: 'fill:rgba(150,150,150,1)',
    };


    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //markings
            for(var a = 0; a < shape.markings.rect.length; a++){
                _mainObject.append(parts.basic.rect(null, shape.markings.rect[a].x,shape.markings.rect[a].y,shape.markings.rect[a].width,shape.markings.rect[a].height,shape.markings.rect[a].angle, style.markings));
            }
            for(var a = 0; a < shape.markings.path.length; a++){
                _mainObject.append(parts.basic.path(null, shape.markings.path[a], 'L', style.markings));
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.in = parts.dynamic.connectionNode_data('_mainObject.io.in', -shape.littleConnector.width/2, shape.littleConnector.height*0.25, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.in);
            _mainObject.io.in.receive = function(address,data){
                _mainObject.io.out_1.send(address,data);
                _mainObject.io.out_2.send(address,data);
            };
        _mainObject.io.out_1 = parts.dynamic.connectionNode_data('_mainObject.io.out_1', shape.base[2].x-shape.littleConnector.width/2, shape.littleConnector.height*0.25, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.out_1);
        _mainObject.io.out_2 = parts.dynamic.connectionNode_data('_mainObject.io.out_2', shape.base[2].x-shape.littleConnector.width/2, shape.littleConnector.height*1.5, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.out_2);
    

    return _mainObject;
};

//Operation Instructions
//  Data signals that are sent into the in port, are duplicated and sent out the two out ports
//  Note: they are not sent out at the same time; signals are produced from the 1st out port
//        first and then the 2nd port. 
__globals.objects.make_launchpad = function(x,y){
    //set numbers
        var type = 'launchpad';
        var variables = {
            pageCount: 10,
            currentPage: 0,
            pages: [],
        };
        var attributes = {
            notes: ['5C', '4B', '4A', '4G', '4F', '4E', '4D', '4C'],
            stage: 0,
            prevStage: 0
        };
        var shape = {
            base: [{x:0,y:0},{x:150,y:0},{x:150,y:120},{x:0,y:120}],
            connector: { width: 30, height: 30 },
            littleConnector: { width: 20, height: 20 },
            grid: {x: 10, y: 10, width: 100, height: 100, xCount: 8, yCount: 8},
            manualPulse: {x: 115, y: 10, width: 30, height: 20},
            nextPage: {x: 115, y: 35, width: 15, height: 10},
            prevPage: {x: 115, y: 45, width: 15, height: 10},
            dial: {x: 110, y: 70},
            pageNumberReadout: {x: 131, y: 35, width: 14, height: 20}
        };
        var style = {        
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            grid: {
                backingStyle: 'fill:rgba(200,175,200,1)',
                checkStyle: 'fill:rgba(150,125,150,1)',
                backingGlowStyle: 'fill:rgba(225,175,225,1)',
                checkGlowStyle:'fill:rgba(200,125,200,1)'
            },
            button: {
                up: 'fill:rgba(175,175,175,1)',
                hover: 'fill:rgba(220,220,220,1)',
                down: 'fill:rgba(150,150,150,1)'
            },
            dial: {
                handle: 'fill:rgba(220,220,220,1)',
                slot: 'fill:rgba(50,50,50,1)',
                needle: 'fill:rgba(250,150,250,1)',
                markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
            }
        };
    
    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    var desiredKeys = {};
        desiredKeys.none = [' '];
    var keycaptureObj = __globals.keyboardInteraction.declareKeycaptureObject(_mainObject,desiredKeys);
        keycaptureObj.keyPress = function(key){
            switch(key){
                case ' ': manualPulse.onclick(); break;
                case 'ArrowUp': nextPage.onclick(); break;
                case 'ArrowDown': prevPage.onclick(); break;
            }
        };

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //grid
        var rastorgrid = parts.control.rastorgrid('rastorgrid', shape.grid.x, shape.grid.y, shape.grid.width, shape.grid.height, shape.grid.xCount, shape.grid.yCount, style.grid.backingStyle, style.grid.checkStyle, style.grid.backingGlowStyle, style.grid.checkGlowStyle);
            _mainObject.append(rastorgrid);

        //velocity dial
            _mainObject.append(parts.display.label(null, shape.dial.x+10,   shape.dial.y+40, 'velocity',  style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+7,    shape.dial.y+34, '0',         style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+16.5, shape.dial.y+4,  '1/2',       style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+30,   shape.dial.y+34, '1',         style.text));
            var dial_velocity = parts.control.dial_continuous(
                'dial_velocity', shape.dial.x+20, shape.dial.y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_velocity);

        //manual pulse
            var manualPulse = parts.control.button_rect('manualPulse', shape.manualPulse.x, shape.manualPulse.y, shape.manualPulse.width, shape.manualPulse.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(manualPulse);
            manualPulse.onclick = function(){ progress(); }

        //page turners
            var nextPage = parts.control.button_rect('nextPage', shape.nextPage.x, shape.nextPage.y, shape.nextPage.width, shape.nextPage.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(nextPage);
                nextPage.onclick = function(){ setPage(variables.currentPage+1); }
            var prevPage = parts.control.button_rect('prevPage', shape.prevPage.x, shape.prevPage.y, shape.prevPage.width, shape.prevPage.height, 0, style.button.up, style.button.hover, style.button.down);
                _mainObject.append(prevPage);
                prevPage.onclick = function(){ setPage(variables.currentPage-1); }
            var pageNumberReadout = parts.display.segmentDisplay(null, shape.pageNumberReadout.x, shape.pageNumberReadout.y, shape.pageNumberReadout.width, shape.pageNumberReadout.height);
                _mainObject.append(pageNumberReadout);

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2].y-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
            _mainObject.prepend(_mainObject.io.out);
        _mainObject.io.pulseIn = parts.dynamic.connectionNode_data('_mainObject.io.pulseIn', shape.base[2].x-shape.littleConnector.width/2, shape.littleConnector.height*0.5, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.pulseIn);
            _mainObject.io.pulseIn.receive = function(address,data){if(address!='pulse'){return;} progress(); };
        _mainObject.io.pageSelect = parts.dynamic.connectionNode_data('_mainObject.io.pageSelect', shape.base[2].x-shape.littleConnector.width/2, shape.littleConnector.height*1.75, shape.littleConnector.width, shape.littleConnector.height);
            _mainObject.prepend(_mainObject.io.pageSelect);
            _mainObject.io.pageSelect.receive = function(address,data){if(address!='discrete'){return;}setPage(data);};
    
    //internal workings
        function setPage(pageNumber){
            pageNumber = pageNumber<0 ? variables.pageCount-1 : pageNumber;
            pageNumber = pageNumber>variables.pageCount-1 ? 0 : pageNumber;

            //save the current page to memory only if we're not switching to the same page
            if(pageNumber != variables.currentPage){ variables.pages[variables.currentPage] = rastorgrid.get(); }

            if( variables.pages[pageNumber] ){ rastorgrid.set(variables.pages[pageNumber]); }
            else{ rastorgrid.clear();  }

            pageNumberReadout.enterCharacter(''+pageNumber);

            variables.currentPage = pageNumber;
        }
        function progress(){
            for(var a = 0; a < shape.grid.yCount; a++){
                rastorgrid.light(attributes.prevStage,a,false);
                _mainObject.io.out.send('midiNumber',{'num':__globals.audio.names_midinumbers[attributes.notes[a]], 'velocity':0});
            }

            for(var a = 0; a < shape.grid.yCount; a++){
                rastorgrid.light(attributes.stage,a,true);
                if( rastorgrid.box(attributes.stage,a).get() ){ _mainObject.io.out.send('midiNumber',{'num':__globals.audio.names_midinumbers[attributes.notes[a]], 'velocity':dial_velocity.get()}); }
            }

            attributes.prevStage = attributes.stage; 
            attributes.stage++;
            if(attributes.stage>=attributes.notes.length){attributes.stage=0;}
        }

    //import/export
        _mainObject.importData = function(data){
            variables.pages = data.pages;
            variables.currentPage = data.currentPage;
            dial_velocity.set(data.velocityDial);
            setPage(variables.currentPage);
        };
        _mainObject.exportData = function(){
            //push current page
            variables.pages[variables.currentPage] = rastorgrid.get();

            return {
                pages: variables.pages,
                currentPage: variables.currentPage,
                velocityDial: dial_velocity.get()
            };
        };

    //setup
        dial_velocity.set(0.5)
        setPage(0);

    return _mainObject;
};
__globals.objects.make_periodicWaveMaker = function(x,y){
    //set numbers
        var type = 'periodicWaveMaker';
        var attributes = {
            factors: 16
        };
        var shape = {
            base: [{x:0,y:0},{x:250,y:0},{x:250,y:110},{x:0,y:110}],
            connector: { width: 20, height: 20 },
            graph: {x:5, y:5, width:100, height:100},
            slidePanel_sin: {x:110, y:5, width: 100, height:47.5, count: attributes.factors},
            slidePanel_cos: {x:110, y:57.5, width: 100, height:47.5, count: attributes.factors},
            resetButton: {x: 215, y: 5, width: 30, height: 20},
            randomButton: {x: 215, y: 30, width: 30, height: 20},
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            button: {
                up: 'fill:rgba(175,175,175,1)',
                hover: 'fill:rgba(220,220,220,1)',
                down: 'fill:rgba(150,150,150,1)'
            },
        };

    //main
        var _mainObject = parts.basic.g(type, x, y);
            _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //waveport
        var graph = parts.display.grapher_periodicWave(null, shape.graph.x, shape.graph.y, shape.graph.width, shape.graph.height);
            _mainObject.append(graph);

        //sliders
        var slidePanel_sin = parts.control.slidePanel_vertical(null, shape.slidePanel_sin.x, shape.slidePanel_sin.y, shape.slidePanel_sin.width, shape.slidePanel_sin.height, shape.slidePanel_sin.count);
            _mainObject.append(slidePanel_sin);
        var slidePanel_cos = parts.control.slidePanel_vertical(null, shape.slidePanel_cos.x, shape.slidePanel_cos.y, shape.slidePanel_cos.width, shape.slidePanel_cos.height, shape.slidePanel_cos.count);
            _mainObject.append(slidePanel_cos);

        //resetButton
        var resetButton = parts.control.button_rect('resetButton', shape.resetButton.x, shape.resetButton.y, shape.resetButton.width, shape.resetButton.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(resetButton);
            resetButton.onclick = function(){ reset(); sendWave(); }

        //randomButton
        var randomButton = parts.control.button_rect('randomButton', shape.randomButton.x, shape.randomButton.y, shape.randomButton.width, shape.randomButton.height, 0, style.button.up, style.button.hover, style.button.down);
            _mainObject.append(randomButton);
            randomButton.onclick = function(){ randomSettings(4); }

    //connection nodes
    _mainObject.io = {};

    _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2].y-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
        _mainObject.prepend(_mainObject.io.out);
        _mainObject.io.out.onConnect = function(){sendWave();};

    //internal workings
        function sendWave(){
            _mainObject.io.out.send('periodicWave', graph.wave());
        }
        function reset(){
            slidePanel_sin.setAll(0.5);
            slidePanel_cos.setAll(0.5);
        }

        slidePanel_sin.onChange = function(wave){
            //adjust values
            var newWave = []
            for(var a = 0; a < wave.length; a++){
                newWave[a] = 1 - wave[a]*2;
            }

            //prepend that pesky leading value
            newWave.unshift(0);

            //push the wave to the graph
            graph.wave(newWave,'sin');
            graph.draw();

            //send the wave data out
            sendWave();
        };

        slidePanel_cos.onChange = function(wave){
            //adjust values
            var newWave = [];
            for(var a = 0; a < wave.length; a++){
                newWave[a] = 1 - wave[a]*2;
            }

            //prepend that pesky leading value
            newWave.unshift(0);

            //push the wave to the graph
            graph.wave(newWave,'cos');
            graph.draw();

            //send the wave data out
            sendWave();
        };

        function normalizeArray(array){
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

            return array;
        }
        function randomSettings(depth){
            //input checking
            depth = depth > attributes.factors? attributes.factors : depth;

            //generate random value arrays
            var sinArray = [];
            var cosArray = [];
            for(var a = 0; a < depth; a++){
                sinArray.push(Math.random()*2-1);
                cosArray.push(Math.random()*2-1);
            }

            //normalize arrays
            sinArray = normalizeArray(sinArray);
            cosArray = normalizeArray(cosArray);

            for(var a = 0; a < depth; a++){ 
                //attempt to keep the waves within the viewport
                sinArray[a] = sinArray[a]/depth;
                cosArray[a] = cosArray[a]/depth;

                //push these setting to the sliders
                sinArray[a] = sinArray[a]/2 + 0.5;
                cosArray[a] = cosArray[a]/2 + 0.5;
            }

            //push to sliders (which will push to the graph)
            slidePanel_sin.set(sinArray);
            slidePanel_cos.set(cosArray);
        }
        _mainObject.random = function(depth){
            randomSettings(depth);
        };
        
    //setup
        reset();
            
    return _mainObject;
};
__globals.objects.make_pulseClock = function(x,y){
    //set numbers
        var type = 'pulseClock';
        var attributes = {
            tempoLimits: {low:60, high:240},
            interval: null
        };
        var shape = {
            base: [{x:0,y:0},{x:90,y:0},{x:90,y:40},{x:0,y:40}],
            connector: { width: 20, height: 20 },
            readoutBacking :{x:45, y: 7.5, width: 12.5*3, height: 25},
            readouts: [
                {x: 45,   y: 7.5, width: 12.5, height: 25},
                {x: 57.5, y: 7.5, width: 12.5, height: 25},
                {x: 70,   y: 7.5, width: 12.5, height: 25},
            ],
            dial: {x: 0, y: 2}
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            dial: {
                handle: 'fill:rgba(220,220,220,1)',
                slot: 'fill:rgba(50,50,50,1)',
                needle: 'fill:rgba(150,150,250,1)',
                markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
            },
            readout: 'fill:rgba(0,0,0,1); font-size:12px; font-family:Courier New;',
            readoutBacking: 'fill:rgba(0,0,0,1);'
        };

    //main
        var _mainObject = parts.basic.g(type, x, y);
            _mainObject._type = type;

    //elements
        //backing
        var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
        __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //tempo dial
            _mainObject.append(parts.display.label(null, shape.dial.x+7,    shape.dial.y+34, '60',        style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+16.5, shape.dial.y+4,  '150',       style.text));
            _mainObject.append(parts.display.label(null, shape.dial.x+30,   shape.dial.y+34, '240',       style.text));
            var dial_tempo = parts.control.dial_continuous(
                'dial_tempo', shape.dial.x+20, shape.dial.y+20, 12,
                (3*Math.PI)/4, 1.5*Math.PI,
                style.dial.handle, style.dial.slot, style.dial.needle, 1.2, style.dial.markings
            );
            _mainObject.append(dial_tempo);
            dial_tempo.ondblclick = function(){ this.set(1/3); };
            dial_tempo.onChange = function(data){
                data = attributes.tempoLimits.low + (attributes.tempoLimits.high-attributes.tempoLimits.low)*data;
                data = Math.round(data);
                setReadout(data);
            };
            dial_tempo.onRelease = function(data){
                data = attributes.tempoLimits.low + (attributes.tempoLimits.high-attributes.tempoLimits.low)*data;
                data = Math.round(data);
                setReadout(data);
                startClock(data);
            };

        //tempo readout
            _mainObject.append( parts.basic.rect(null, shape.readoutBacking.x, shape.readoutBacking.y, shape.readoutBacking.width, shape.readoutBacking.height, 0, style.readoutBacking) );

            var segmentDisplays = [];
            for(var a = 0; a < shape.readouts.length; a++){
                var temp = parts.display.segmentDisplay(null, shape.readouts[a].x, shape.readouts[a].y, shape.readouts[a].width, shape.readouts[a].height);
                    _mainObject.append(temp);
                    segmentDisplays.push(temp);
            }

    //connection nodes
        _mainObject.io = {};

        _mainObject.io.out = parts.dynamic.connectionNode_data('_mainObject.io.out', -shape.connector.width/2, shape.base[2].y-shape.connector.height*1.5, shape.connector.width, shape.connector.height);
            _mainObject.prepend(_mainObject.io.out);

    //internal workings
        function setReadout(num){
            num = ''+num;
            while(num.length < 3){ num = '0'+num;}
            for(var a = 0; a < num.length; a++){ segmentDisplays[a].enterCharacter(num[a]); }
        }
    
        function startClock(tempo){
            if(attributes.interval){
                clearInterval(attributes.interval);
            }

            attributes.interval = setInterval(function(){
                _mainObject.io.out.send('pulse');
            },1000*(60/tempo));
        }

    //setup
        dial_tempo.set(1/3);
            
    return _mainObject;
};
function makeUniversalReadout(x,y){

    //elements
        //main
            var _mainObject = parts.basic.g('universalReadout', x, y);

            var backing = parts.basic.rect(null, 0, 0, 75, 55, 0, 'fill:rgba(200,200,200,1)');
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, makeUniversalReadout);

            _mainObject.append(parts.display.label(null, 10, 30, 'universal','fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'));
            _mainObject.append(parts.display.label(null, 10, 40, 'readout','fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'));

        // connection ports
            _mainObject.io = {};
            _mainObject.io.in = parts.dynamic.connectionNode_data('io.in',75/2-30/2,-30/2,30,30);
                _mainObject.append(_mainObject.io.in);
                _mainObject.io.in.receive = function(address,data){
                    console.log(address,data);
                };

        //generate selection area        
            _mainObject.selectionArea = {};
            _mainObject.selectionArea.box = [];
            _mainObject.selectionArea.points = [];
            _mainObject.updateSelectionArea = function(){
                //the main shape we want to use
                var temp = __globals.utility.element.getBoundingBox(backing);
                _mainObject.selectionArea.points = [
                    [temp.x,temp.y],
                    [temp.x+temp.width,temp.y],
                    [temp.x+temp.width,temp.y+temp.height],
                    [temp.x,temp.y+temp.height]
                ];
                _mainObject.selectionArea.box = __globals.utility.math.boundingBoxFromPoints(_mainObject.selectionArea.points);

                //adjusting it for the object's position in space
                temp = __globals.utility.element.getTransform(_mainObject);
                _mainObject.selectionArea.box.forEach(function(element) {
                    element[0] += temp[0];
                    element[1] += temp[1];
                });
                _mainObject.selectionArea.points.forEach(function(element) {
                    element[0] += temp[0];
                    element[1] += temp[1];
                });

            };
            _mainObject.updateSelectionArea();
        
    return _mainObject;
}
__globals.objects.make_synthTester = function(x,y, synth){
    //set numbers
    var type = 'synthTester';
    var attributes = {};
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;'
    };
    var shape = {
        base: [{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:200,y:80},{x:0,y:80}],
        connector: {
            audio:{
                audioOut:{ type: 1, x: -15, y: 5, width: 30, height: 30 },
            },
            data:{
                midiNote:{ x: 217.5, y: 37.5, width: 30, height: 30, angle: Math.PI/4, receive: function(address,data){  if(address != 'midiNumber'){return;} _mainObject.__synthesizer.perform(data); } },
            }
        }
    };

    //main
        var _mainObject = parts.basic.g(type, x, y);
            _mainObject._type = type;

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
                _mainObject.append(backing);
                __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

    //connection nodes
        _mainObject.io = {};

        var keys = Object.keys(shape.connector.audio);
        for(var a = 0; a < keys.length; a++){
            var data = shape.connector.audio[keys[a]];
            _mainObject.io[keys[a]] = parts.dynamic.connectionNode_audio( keys[a], data.type, data.x, data.y, data.width, data.height, __globals.audio.context );
            _mainObject.prepend(_mainObject.io[keys[a]]);
        }

        var keys = Object.keys(shape.connector.data);
        for(var a = 0; a < keys.length; a++){
            var data = shape.connector.data[keys[a]];
            _mainObject.io[keys[a]] = parts.dynamic.connectionNode_data( keys[a], data.x, data.y, data.width, data.height, data.angle);
            _mainObject.io[keys[a]].receive = data.receive;
            _mainObject.prepend(_mainObject.io[keys[a]]);
        }

    //circuitry
        _mainObject.__synthesizer = new synth(__globals.audio.context);
        _mainObject.__synthesizer.out().connect( _mainObject.io.audioOut.in() );

    return _mainObject;
};
parts.audio.distortionUnit = function(
    context,
){
    //flow chain
    var flow = {
        inAggregator: {},
        distortionNode: {},
        outAggregator: {},
    };

    //inAggregator
        flow.inAggregator.gain = 0;
        flow.inAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

    //distortionNode
        flow.distortionNode.distortionAmount = 0;
        flow.distortionNode.oversample = 'none'; //'none', '2x', '4x'
        flow.distortionNode.resolution = 100;
        function makeDistortionNode(){
            flow.inAggregator.node.disconnect();
            if(flow.distortionNode.node){flow.distortionNode.node.disconnect();}
            
            flow.distortionNode.node = context.createWaveShaper();
                flow.distortionNode.curve = new Float32Array(__globals.utility.math.curveGenerator.s(flow.distortionNode.resolution,-1,1,flow.distortionNode.distortionAmount));
                flow.distortionNode.node.curve = flow.distortionNode.curve;
                flow.distortionNode.node.oversample = flow.distortionNode.oversample;
                
            flow.inAggregator.node.connect(flow.distortionNode.node);
            flow.distortionNode.node.connect(flow.outAggregator.node);
        }

    //outAggregator
        flow.outAggregator.gain = 0;
        flow.outAggregator.node = context.createGain();    
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


    //input/output node
        this.in = function(){return flow.inAggregator.node;}
        this.out = function(){return flow.outAggregator.node;}

    //controls
        this.inGain = function(a){
            if(a==null){return flow.inAggregator.gain;}
            flow.inAggregator.gain=a;
            __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, a, 0.01, 'instant', true);
        };
        this.outGain = function(a){
            if(a==null){return flow.outAggregator.gain;}
            flow.outAggregator.gain=a;
            __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, a, 0.01, 'instant', true);
        };
        this.distortionAmount = function(a){
            if(a==null){return flow.distortionNode.distortionAmount;}
            flow.distortionNode.distortionAmount=a;
            makeDistortionNode();
        };
        this.oversample = function(a){
            if(a==null){return flow.distortionNode.oversample;}
            flow.distortionNode.oversample=a;
            makeDistortionNode();
        };
        this.resolution = function(a){
            if(a==null){return flow.distortionNode.resolution;}
            flow.distortionNode.resolution = a>=2?a:2;
            makeDistortionNode();
        };

    //setup
        makeDistortionNode();
};
parts.audio.reverbUnit = function(
    context,
){
    //flow chain
        var flow = {
            inAggregator: {},
            reverbGain: {}, bypassGain: {},
            reverbNode: {},
            outAggregator: {},
        };

    //inAggregator
        flow.inAggregator.gain = 1;
        flow.inAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

    //reverbGain / bypassGain
        flow.reverbGain.gain = 0.5;
        flow.bypassGain.gain = 0.5;
        flow.reverbGain.node = context.createGain();
        flow.bypassGain.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.reverbGain.node.gain, flow.reverbGain.gain, 0.01, 'instant', true);
        __globals.utility.audio.changeAudioParam(context,flow.bypassGain.node.gain, flow.bypassGain.gain, 0.01, 'instant', true);

    //reverbNode
        flow.reverbNode.impulseResponseRepoURL = 'http://metasophiea.com/lib/audio/impulseResponse/';
        flow.reverbNode.selectedReverbType = 'Musikvereinsaal.wav';
        flow.reverbNode.node = context.createConvolver();

        function setReverbType(repoURL,type,callback){
            var ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open('GET', repoURL+type, true);
            ajaxRequest.responseType = 'arraybuffer';
            ajaxRequest.onload = function(){
                context.decodeAudioData(ajaxRequest.response, function(buffer) {flow.reverbNode.node.buffer = buffer;}, function(e){"Error with decoding audio data" + e.err});
                if(callback){callback();}  
            };
            ajaxRequest.send();
        }
        function getReverbTypeList(repoURL,callback=null){
            var ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open('GET', repoURL+'available2.list', true);
            ajaxRequest.onload = function() {
                var list = ajaxRequest.response.split('\n'); var temp = '';
                
                list[list.length-1] = list[list.length-1].split(''); 
                list[list.length-1].pop();
                list[list.length-1] = list[list.length-1].join('');		

                list.splice(-1,1);
                
                if(callback == null){console.log(list);}
                else{callback(list);}
            }
            ajaxRequest.send();
        }	

    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();    
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);

    //do connections
        flow.inAggregator.node.connect(flow.reverbGain.node);
        flow.inAggregator.node.connect(flow.bypassGain.node);
        flow.reverbGain.node.connect(flow.reverbNode.node);
        flow.bypassGain.node.connect(flow.outAggregator.node);
        flow.reverbNode.node.connect(flow.outAggregator.node);

    //input/output node
        this.in = function(){return flow.inAggregator.node;}
        this.out = function(){return flow.outAggregator.node;}
    
    //controls
        this.getTypes = function(callback){ getReverbTypeList(flow.reverbNode.impulseResponseRepoURL, callback); };
        this.type = function(name,callback){
            if(name==null){return flow.reverbNode.selectedReverbType;}
            flow.reverbNode.selectedReverbType = name;
            setReverbType(flow.reverbNode.impulseResponseRepoURL, flow.reverbNode.selectedReverbType, callback);
        };
        this.outGain = function(a){
            if(a==null){return flow.outAggregator.gain;}
            flow.outAggregator.gain=a;
            __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, a, 0.01, 'instant', true);
        };
        this.wetdry = function(a){
            if(a==null){return flow.reverbGain.gain;}
            flow.reverbGain.gain=a;
            flow.bypassGain.gain=1-a;
            __globals.utility.audio.changeAudioParam(context,flow.reverbGain.node.gain, flow.reverbGain.gain, 0.01, 'instant', true);
            __globals.utility.audio.changeAudioParam(context,flow.bypassGain.node.gain, flow.bypassGain.gain, 0.01, 'instant', true);
        };

    //setup
        setReverbType(flow.reverbNode.impulseResponseRepoURL,flow.reverbNode.selectedReverbType);
        
};
parts.audio.synthesizer2 = function(
    context,
    waveType='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, gainWobbleDepth=0, gainWobblePeriod=0, gainWobbleMin=0.01, gainWobbleMax=1,
    attack={time:0.01, curve:'linear'}, release={time:0.05, curve:'linear'},
    octave=0,
    detune=0, detuneWobbleDepth=0, detuneWobblePeriod=0, detuneWobbleMin=0.01, detuneWobbleMax=1
){
    //flow chain
        var flow = {
            OSCmaker:{},
            liveOscillators: {},
            wobbler_detune: {},
            aggregator: {},
            wobbler_gain: {},
            mainOut: {}
        };


        flow.OSCmaker.waveType = waveType;
        flow.OSCmaker.periodicWave = periodicWave;
        flow.OSCmaker.attack = attack;
        flow.OSCmaker.release = release;
        flow.OSCmaker.octave  = octave;
        flow.OSCmaker.detune  = detune;
        flow.OSCmaker.func = function(
            context, connection, midiNumber,
            type, periodicWave, 
            gain, attack, release,
            detune, octave
        ){
            return new function(){
                this.generator = context.createOscillator();
                    if(type == 'custom'){ 
                        this.generator.setPeriodicWave(
                            context.createPeriodicWave(new Float32Array(periodicWave.cos),new Float32Array(periodicWave.sin))
                        ); 
                    }else{ this.generator.type = type; }
                    this.generator.frequency.setTargetAtTime(__globals.audio.midiNumber_frequency(midiNumber,octave), context.currentTime, 0);
                    this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
                    this.generator.start(0);

                this.gain = context.createGain();
                    this.generator.connect(this.gain);
                    this.gain.gain.setTargetAtTime(0, context.currentTime, 0);
                    __globals.utility.audio.changeAudioParam(context,this.gain.gain, gain, attack.time, attack.curve, false);
                    this.gain.connect(connection);

                this.detune = function(target,time,curve){
                    __globals.utility.audio.changeAudioParam(context,this.generator.detune,target,time,curve);
                };
                this.stop = function(){
                    __globals.utility.audio.changeAudioParam(context,this.gain.gain,0,release.time,release.curve, false);
                    setTimeout(function(that){
                        that.gain.disconnect(); 
                        that.generator.stop(); 
                        that.generator.disconnect(); 
                        that.gain=null; 
                        that.generator=null; 
                    }, release.time*1000, this);
                };
            };
        };


        flow.wobbler_detune.depth = detuneWobbleDepth;
        flow.wobbler_detune.period = detuneWobblePeriod;
        flow.wobbler_detune.phase = true;
        flow.wobbler_detune.wave = 's';
        flow.wobbler_detune.interval = null;
        flow.wobbler_detune.start = function(){
            if(flow.wobbler_detune.period < detuneWobbleMin || flow.wobbler_detune.period >= detuneWobbleMax){ return; }
            flow.wobbler_detune.interval = setInterval(function(){
                var OSCs = Object.keys(flow.liveOscillators);
                if(flow.wobbler_detune.phase){
                    for(var b = 0; b < OSCs.length; b++){ 
                        flow.liveOscillators[OSCs[b]].detune(flow.wobbler_detune.depth,0.9*flow.wobbler_detune.period,flow.wobbler_detune.wave);
                    }
                }else{
                    for(var b = 0; b < OSCs.length; b++){ 
                        flow.liveOscillators[OSCs[b]].detune(-flow.wobbler_detune.depth,0.9*flow.wobbler_detune.period,flow.wobbler_detune.wave);
                    }
                }
                flow.wobbler_detune.phase = !flow.wobbler_detune.phase;
            }, 1000*flow.wobbler_detune.period);
        };
        flow.wobbler_detune.stop = function(){clearInterval(flow.wobbler_detune.interval);};


        flow.aggregator.node = context.createGain();    
        flow.aggregator.node.gain.setTargetAtTime(1, context.currentTime, 0);


        flow.wobbler_gain.depth = gainWobbleDepth;
        flow.wobbler_gain.period = gainWobblePeriod;
        flow.wobbler_gain.phase = true;
        flow.wobbler_gain.wave = 's';
        flow.wobbler_gain.interval = null;
        flow.wobbler_gain.start = function(){
            if(flow.wobbler_gain.period < gainWobbleMin || flow.wobbler_gain.period >= gainWobbleMax){
                __globals.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.01, flow.wobbler_gain.wave );
                return;
            }
            flow.wobbler_gain.interval = setInterval(function(){
                if(flow.wobbler_gain.phase){ __globals.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
                else{                        __globals.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1-flow.wobbler_gain.depth,  0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
                flow.wobbler_gain.phase = !flow.wobbler_gain.phase;
            }, 1000*flow.wobbler_gain.period);
        };
        flow.wobbler_gain.stop = function(){clearInterval(flow.wobbler_gain.interval);};
        flow.wobbler_gain.node = context.createGain();
        flow.wobbler_gain.node.gain.setTargetAtTime(1, context.currentTime, 0);
        flow.aggregator.node.connect(flow.wobbler_gain.node);

        
        flow.mainOut.gain = gain;
        flow.mainOut.node = context.createGain();
        flow.mainOut.node.gain.setTargetAtTime(gain, context.currentTime, 0);
        flow.wobbler_gain.node.connect(flow.mainOut.node);

    //output node
        this.out = function(){return flow.mainOut.node;}

    //controls
        this.perform = function(note){
            if( !flow.liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
            else if( !flow.liveOscillators[note.num] ){ 
                //create new tone
                flow.liveOscillators[note.num] = flow.OSCmaker.func(
                    context, 
                    flow.aggregator.node, 
                    note.num, 
                    flow.OSCmaker.waveType, 
                    flow.OSCmaker.periodicWave, 
                    note.velocity, 
                    flow.OSCmaker.attack, 
                    flow.OSCmaker.release, 
                    flow.OSCmaker.detune, 
                    flow.OSCmaker.octave
                );
            }
            else if( note.velocity == 0 ){ 
                //stop and destroy tone
                flow.liveOscillators[note.num].stop();
                delete flow.liveOscillators[note.num];
            }
            else{
                //adjust tone
                flow.liveOscillators[note.num].osc.changeVelocity(note.velocity);
            }
        };
        this.panic = function(){
            var OSCs = Object.keys(flow.liveOscillators);
            for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
        };
        this.waveType = function(a){if(a==null){return flow.OSCmaker.waveType;}flow.OSCmaker.waveType=a;};
        this.periodicWave = function(a){if(a==null){return flow.OSCmaker.periodicWave;}flow.OSCmaker.periodicWave=a;};
        this.gain = function(target,time,curve){ return __globals.utility.audio.changeAudioParam(context,flow.mainOut.node.gain,target,time,curve); };
        this.attack = function(time,curve){
            if(time==null&&curve==null){return flow.OSCmaker.attack;}
            flow.OSCmaker.attack.time = time ? time : flow.OSCmaker.attack.time;
            flow.OSCmaker.attack.curve = curve ? curve : flow.OSCmaker.attack.curve;
        };
        this.release = function(time,curve){
            if(time==null&&curve==null){return flow.OSCmaker.release;}
            flow.OSCmaker.release.time = time ? time : flow.OSCmaker.release.time;
            flow.OSCmaker.release.curve = curve ? curve : flow.OSCmaker.release.curve;
        };
        this.octave = function(a){if(a==null){return flow.OSCmaker.octave;}flow.OSCmaker.octave=a;};
        this.detune = function(target,time,curve){
            if(a==null){return flow.OSCmaker.detune;}

            //change stored value for any new oscillators that are made
                var start = flow.OSCmaker.detune;
                var mux = target-start;
                var stepsPerSecond = Math.round(Math.abs(mux));
                var totalSteps = stepsPerSecond*time;

                var steps = [1];
                switch(curve){
                    case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
                    case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
                    case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps,8); break;
                    case 'instant': default: break;
                }
                
                if(steps.length != 0){
                    var interval = setInterval(function(){
                        flow.OSCmaker.detune = start+(steps.shift()*mux);
                        if(steps.length == 0){clearInterval(interval);}
                    },1000/stepsPerSecond);
                }

            //instruct liveOscillators to adjust their values
                var OSCs = Object.keys(flow.liveOscillators);
                for(var b = 0; b < OSCs.length; b++){ 
                    flow.liveOscillators[OSCs[b]].detune(target,time,curve);
                }
        };
        this.gainWobbleDepth = function(value){
            if(value==null){return flow.wobbler_gain.depth; }
            flow.wobbler_gain.depth = value;
            flow.wobbler_gain.stop();
            flow.wobbler_gain.start();
        };
        this.gainWobblePeriod = function(value){
            if(value==null){return flow.wobbler_gain.period; }
            flow.wobbler_gain.period = value;
            flow.wobbler_gain.stop();
            flow.wobbler_gain.start();
        };
        this.detuneWobbleDepth = function(value){
            if(value==null){return flow.wobbler_detune.depth; }
            flow.wobbler_detune.depth = value;
            flow.wobbler_detune.stop();
            flow.wobbler_detune.start();
        };
        this.detuneWobblePeriod = function(value){
            if(value==null){return flow.wobbler_detune.period; }
            flow.wobbler_detune.period = value;
            flow.wobbler_detune.stop();
            flow.wobbler_detune.start();
        };
};
parts.audio.filterUnit = function(
    context
){
    //flow chain
        var flow = {
            inAggregator: {},
            filterNode: {},
            outAggregator: {},
        };

    //inAggregator
        flow.inAggregator.gain = 1;
        flow.inAggregator.node = context.createGain();
        __globals.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);

    //filterNode
        flow.filterNode.node = context.createBiquadFilter();
	    flow.filterNode.node.type = "highpass";
        flow.filterNode.node.frequency.value = 1000;
        flow.filterNode.node.gain.value = 0.1;
        flow.filterNode.node.Q.value = 10000;


    //outAggregator
        flow.outAggregator.gain = 1;
        flow.outAggregator.node = context.createGain();    
        __globals.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);


    //do connections
        flow.inAggregator.node.connect(flow.filterNode.node);
        flow.filterNode.node.connect(flow.outAggregator.node);

    //input/output node
        this.in = function(){return flow.inAggregator.node;}
        this.out = function(){return flow.outAggregator.node;}
};
__globals.objects.make_distortionUnit = function(x,y){
    //set numbers
        var type = 'distortionUnit';
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
    
            markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
    
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)'
        };
        var shape = {};
            shape.width = 102.5;
            shape.height = 95;
            shape.base = [
                {x:0,y:0+10},
                {x:0+10,y:0},

                {x:shape.width/3,y:0},
                {x:shape.width*0.45,y:10},
                {x:shape.width*0.55,y:10},
                {x:2*(shape.width/3),y:0},

                {x:shape.width-10,y:0},
                {x:shape.width,y:0+10},

                {x:shape.width,y:shape.height-10},
                {x:shape.width-10,y:shape.height},

                {x:2*(shape.width/3),y:shape.height},
                {x:shape.width*0.55,y:shape.height-10},
                {x:shape.width*0.45,y:shape.height-10},
                {x:shape.width/3,y:shape.height},

                {x:0+10,y:shape.height},
                {x:0,y:shape.height-10}
            ];
            shape.connector = {
                audio: {
                    audioIn: { type: 0, x: 105-10, y: 95*0.7-5, width: 20, height: 20 },
                    audioOut: { type: 1, x: -10, y: 95*0.7-5, width: 20, height: 20 },
                },
                data: {}
            };
            shape.dial = {
                outGain:{
                    type: 'continuous',
                    x: (40*0)+20, y: (50)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40*0)+13,   y: (50)+40, text: 'out', style: style.h1 },
                        { name: null, x: (40*0)+7,    y: (50)+34, text: '0',   style: style.h2 },
                        { name: null, x: (40*0)+16.5, y: (50)+4,  text: '1/2', style: style.h2 },
                        { name: null, x: (40*0)+30,   y: (50)+34, text: '1',   style: style.h2 },
                    ],
                    onChange: function(value){ _mainObject.__unit.outGain( value ); },
                },
                distortionAmount:{
                    type: 'continuous',
                    x: (40*0)+20, y: (3)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40*0)+11,   y: (3)+40, text: 'dist', style: style.h1 },
                        { name: null, x: (40*0)+7,    y: (3)+34, text: '0',    style: style.h2 },
                        { name: null, x: (40*0)+17.5, y: (3)+4,  text: '50',   style: style.h2 },
                        { name: null, x: (40*0)+30,   y: (3)+34, text: '100',  style: style.h2 },
                    ],
                    onChange: function(value){ _mainObject.__unit.distortionAmount(value*100); },
                },
                resolution:{
                    type: 'continuous',
                    x: (40*1)-10+20, y: (30)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40*1)-10+13,   y: (30)+40, text: 'res', style: style.h1 },
                        { name: null, x: (40*1)-10+7,    y: (30)+34, text: '2',   style: style.h2 },
                        { name: null, x: (40*1)-10+16.5, y: (30)+4,  text: '500', style: style.h2 },
                        { name: null, x: (40*1)-10+29,   y: (30)+34, text: '1000',style: style.h2 },
                    ],
                    onChange: function(value){ _mainObject.__unit.resolution( Math.round(value*1000) ); },
                },
                overSample:{
                    type: 'discrete',
                    x: (40*2)-18+20, y: 3+20, r: 12,
                    optionCount: 3,
                    startAngle: (1.25*Math.PI), maxAngle: 0.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: undefined,
                    labels:[
                        { name: null, x: (40*2)-18+3,     y: (3)+40, text: 'overSamp', style: style.h1 },
                        { name: null, x: (40*2)-18+2,     y: (3)+10, text: 'none',     style: style.h2 },
                        { name: null, x: (40*2)-18+17.75, y: (3)+5,  text: '2x',       style: style.h2 },
                        { name: null, x: (40*2)-18+30,    y: (3)+10, text: '4x',       style: style.h2 },
                    ],
                    onChange: function(value){ _mainObject.__unit.oversample( ['none','2x','4x'][value] ); },
                },
                inGain:{
                    type: 'continuous',
                    x: (40*2)-18+20, y: (50)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (40*2)-18+15,    y: (50)+40, text: 'in', style: style.h1 },
                        { name: null, x: (40*2)-18+7,     y: (50)+34, text: '0',  style: style.h2 },
                        { name: null, x: (40*2)-18+18.75, y: (50)+4,  text: '1',  style: style.h2 },
                        { name: null, x: (40*2)-18+30,    y: (50)+34, text: '2',  style: style.h2 },
                    ],
                    onChange: function(value){ _mainObject.__unit.inGain( 2*value ); },
                },
            };

    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);
   
        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //dials
            _mainObject.dial = {continuous:{}, discrete:{}};

            var keys = Object.keys(shape.dial);
            for(var a = 0; a < keys.length; a++){
                var data = shape.dial[keys[a]];
                var labelKeys = Object.keys(data.labels);
                for(var b = 0; b < labelKeys.length; b++){
                    var label = data.labels[labelKeys[b]];
                    _mainObject.append(parts.display.label(labelKeys[b], label.x, label.y, label.text, label.style));
                }

                if(data.type == 'continuous'){
                    var dial = parts.control.dial_continuous(
                        keys[a],
                        data.x, data.y, data.r,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.continuous[keys[a]] = dial;
                }
                else if(data.type == 'discrete'){
                    var dial = parts.control.dial_discrete(
                        keys[a],
                        data.x, data.y, data.r,
                        data.optionCount,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.discrete[keys[a]] = dial;
                }else{console.error('unknow dial type: "'+ data.type + '"'); var dial = null;}

                dial.onChange = data.onChange;
                dial.onRelease = data.onRelease;
                _mainObject.append(dial);
            }

        //connection nodes
            _mainObject.io = {};

            var keys = Object.keys(shape.connector.audio);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.audio[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_audio( keys[a], data.type, data.x, data.y, data.width, data.height, __globals.audio.context );
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

            var keys = Object.keys(shape.connector.data);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.data[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_data( keys[a], data.x, data.y, data.width, data.height, data.angle);
                _mainObject.io[keys[a]].receive = data.receive;
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

    //circuitry
        _mainObject.__unit = new parts.audio.distortionUnit(__globals.audio.context);
        _mainObject.io.audioIn.out().connect( _mainObject.__unit.in() );
        _mainObject.__unit.out().connect( _mainObject.io.audioOut.in() );

    //setup
        _mainObject.dial.continuous.resolution.set(0.5);
        _mainObject.dial.continuous.inGain.set(0.5);
        _mainObject.dial.continuous.outGain.set(1);

    return _mainObject;
};
__globals.objects.make_reverbUnit = function(x,y){
    //set numbers
        var type = 'reverbUnit';
        var attributes = {
            reverbType: 0,
            availableTypes: []
        };
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
    
            markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
    
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)'
        };
        var shape = {};
            shape.width = 102.5;
            shape.height = 50;
            shape.base = [
                {x:0,y:0+10},
                {x:shape.width/2,y:0},
                {x:shape.width,y:0+10},

                {x:shape.width,y:shape.height-10},
                {x:shape.width/2,y:shape.height},
                {x:0,y:shape.height-10},
            ];
            shape.readouts = {
                ones: {
                    x: 50,   y: 12.5, 
                    width: 12.5, height: 25,
                    element: null
                },
                tens:{
                    x: 37.5,   y: 12.5, 
                    width: 12.5, height: 25,
                    element: null
                }
            };
            shape.button = {
                raiseByOne:{
                    x: 51, y: 6,
                    width: 10.25, height: 5,
                    angle: 0,
                    upStyle: 'fill:rgba(175,175,175,1)',
                    hoverStyle: 'fill:rgba(220,220,220,1)',
                    downStyle: 'fill:rgba(150,150,150,1)',
                    glowStyle: 'fill:rgba(220,200,220,1)',
                    onclick: function(){ incReverbType(); }
                },
                raiseByTen:{
                    x: 38.75, y: 6,
                    width: 10.25, height: 5,
                    angle: 0,
                    upStyle: 'fill:rgba(175,175,175,1)',
                    hoverStyle: 'fill:rgba(220,220,220,1)',
                    downStyle: 'fill:rgba(150,150,150,1)',
                    glowStyle: 'fill:rgba(220,200,220,1)',
                    onclick: function(){ inc10ReverbType(); }
                },
                lowerByOne:{
                    x: 51, y: 39,
                    width: 10.25, height: 5,
                    angle: 0,
                    upStyle: 'fill:rgba(175,175,175,1)',
                    hoverStyle: 'fill:rgba(220,220,220,1)',
                    downStyle: 'fill:rgba(150,150,150,1)',
                    glowStyle: 'fill:rgba(220,200,220,1)',
                    onclick: function(){ decReverbType(); }
                },
                lowerByTen:{
                    x: 38.75, y: 39,
                    width: 10.25, height: 5,
                    angle: 0,
                    upStyle: 'fill:rgba(175,175,175,1)',
                    hoverStyle: 'fill:rgba(220,220,220,1)',
                    downStyle: 'fill:rgba(150,150,150,1)',
                    glowStyle: 'fill:rgba(220,200,220,1)',
                    onclick: function(){ dec10ReverbType(); }
                },
            };
            shape.connector = {
                audio: {
                    audioIn: { type: 0, x: 105-10, y: 30*0.7-5, width: 20, height: 20 },
                    audioOut: { type: 1, x: -10, y: 30*0.7-5, width: 20, height: 20 },
                },
                data: {}
            };
            shape.dial = {
                outGain:{
                    type: 'continuous',
                    x: 20, y: (5)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: 7,    y: (5)+34, text: '0',   style: style.h2 },
                        { name: null, x: 16.5, y: (5)+5,  text: '1/2', style: style.h2 },
                        { name: null, x: 30,   y: (5)+34, text: '1',   style: style.h2 },
                    ],
                    onChange: function(value){ _mainObject.__unit.outGain( value ); },
                },
                wetdry:{
                    type: 'continuous',
                    x: (62.5)+20, y: (5)+20, r: 12,
                    startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                    handleStyle: style.handle,
                    slotStyle: style.slot,
                    needleStyle: style.needle,
                    arcDistance: 1.2,
                    outerArcStyle: style.markings,
                    labels:[
                        { name: null, x: (62.5)+4,    y: (5)+34, text: 'dry',   style: style.h2 },
                        { name: null, x: (62.5)+30,   y: (5)+34, text: 'wet',   style: style.h2 },
                    ],
                    onChange: function(value){ _mainObject.__unit.wetdry( value ); },
                }
            };

    //main
        var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //readout
            var keys = Object.keys(shape.readouts);
            for(var a = 0; a < keys.length; a++){
                data = shape.readouts[keys[a]];
                data.element = parts.display.segmentDisplay(keys[a], data.x, data.y, data.width, data.height);
                _mainObject.append(data.element);
            }

        //buttons
            var keys = Object.keys( shape.button );
            for(var a = 0; a < keys.length; a++){
                var data = shape.button[keys[a]];
                var temp = parts.control.button_rect(
                    keys[a], 
                    data.x, data.y, 
                    data.width, data.height, 
                    data.angle, 
                    data.upStyle, data.hoverStyle, data.downStyle, data.glowStyle
                );
                temp.onclick = data.onclick;
                _mainObject.append(temp);
            }

        //dials
            _mainObject.dial = {continuous:{}, discrete:{}};

            var keys = Object.keys(shape.dial);
            for(var a = 0; a < keys.length; a++){
                var data = shape.dial[keys[a]];
                var labelKeys = Object.keys(data.labels);
                for(var b = 0; b < labelKeys.length; b++){
                    var label = data.labels[labelKeys[b]];
                    _mainObject.append(parts.display.label(labelKeys[b], label.x, label.y, label.text, label.style));
                }

                if(data.type == 'continuous'){
                    var dial = parts.control.dial_continuous(
                        keys[a],
                        data.x, data.y, data.r,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.continuous[keys[a]] = dial;
                }
                else if(data.type == 'discrete'){
                    var dial = parts.control.dial_discrete(
                        keys[a],
                        data.x, data.y, data.r,
                        data.optionCount,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.discrete[keys[a]] = dial;
                }else{console.error('unknow dial type: "'+ data.type + '"'); var dial = null;}

                dial.onChange = data.onChange;
                dial.onRelease = data.onRelease;
                _mainObject.append(dial);
            }

        //connection nodes
            _mainObject.io = {};

            var keys = Object.keys(shape.connector.audio);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.audio[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_audio( keys[a], data.type, data.x, data.y, data.width, data.height, __globals.audio.context );
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

            var keys = Object.keys(shape.connector.data);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.data[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_data( keys[a], data.x, data.y, data.width, data.height, data.angle);
                _mainObject.io[keys[a]].receive = data.receive;
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

    //circuitry
        _mainObject.__unit = new parts.audio.reverbUnit(__globals.audio.context);
        _mainObject.io.audioIn.out().connect( _mainObject.__unit.in() );
        _mainObject.__unit.out().connect( _mainObject.io.audioOut.in() );
        _mainObject.__unit.getTypes( function(a){attributes.availableTypes = a;} );

        function setReadout(num){
            num = ("0" + num).slice(-2);

            shape.readouts.ones.element.enterCharacter(num[1]);
            shape.readouts.tens.element.enterCharacter(num[0]);
        }
        function setReverbType(a){
            if( attributes.availableTypes.length == 0 ){ console.log('broken or not yet'); return;}

            if( a >= attributes.availableTypes.length ){a = attributes.availableTypes.length-1;}
            else if( a < 0 ){a = 0;}

            attributes.reverbType = a;
            _mainObject.__unit.type( attributes.availableTypes[a], function(){setReadout(attributes.reverbType);});
        }
        function incReverbType(){ setReverbType(attributes.reverbType+1); }
        function decReverbType(){ setReverbType(attributes.reverbType-1); }
        function inc10ReverbType(){ setReverbType(attributes.reverbType+10); }
        function dec10ReverbType(){ setReverbType(attributes.reverbType-10); }

    //setup
        _mainObject.dial.continuous.outGain.set(1/2);
        _mainObject.dial.continuous.wetdry.set(1/2);
        setTimeout(function(){setReverbType(0);},1000);

    return _mainObject;
};
__globals.objects.make_filterUnit = function(x,y){
    //set numbers
        var type = 'filterUnit';
        var attributes = {};
        var style = {
            background: 'fill:rgba(200,200,200,1); stroke:none;',
            h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
    
            markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
    
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)'
        };
        var shape = {};
            shape.width = 102.5;
            shape.height = 50;
            shape.base = [
                {x:0,y:0+10},
                {x:shape.width/2,y:0},
                {x:shape.width,y:0+10},

                {x:shape.width,y:shape.height-10},
                {x:shape.width/2,y:shape.height},
                {x:0,y:shape.height-10},
            ];
            shape.readouts = {};
            shape.button = {};
            shape.connector = {
                audio: {
                    audioIn: { type: 0, x: 105-10, y: 30*0.7-5, width: 20, height: 20 },
                    audioOut: { type: 1, x: -10, y: 30*0.7-5, width: 20, height: 20 },
                },
                data: {}
            };
            shape.dial = {};

    //main
        var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);

        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

        //readout
            var keys = Object.keys(shape.readouts);
            for(var a = 0; a < keys.length; a++){
                data = shape.readouts[keys[a]];
                data.element = parts.display.segmentDisplay(keys[a], data.x, data.y, data.width, data.height);
                _mainObject.append(data.element);
            }

        //buttons
            var keys = Object.keys( shape.button );
            for(var a = 0; a < keys.length; a++){
                var data = shape.button[keys[a]];
                var temp = parts.control.button_rect(
                    keys[a], 
                    data.x, data.y, 
                    data.width, data.height, 
                    data.angle, 
                    data.upStyle, data.hoverStyle, data.downStyle, data.glowStyle
                );
                temp.onclick = data.onclick;
                _mainObject.append(temp);
            }

        //dials
            _mainObject.dial = {continuous:{}, discrete:{}};

            var keys = Object.keys(shape.dial);
            for(var a = 0; a < keys.length; a++){
                var data = shape.dial[keys[a]];
                var labelKeys = Object.keys(data.labels);
                for(var b = 0; b < labelKeys.length; b++){
                    var label = data.labels[labelKeys[b]];
                    _mainObject.append(parts.display.label(labelKeys[b], label.x, label.y, label.text, label.style));
                }

                if(data.type == 'continuous'){
                    var dial = parts.control.dial_continuous(
                        keys[a],
                        data.x, data.y, data.r,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.continuous[keys[a]] = dial;
                }
                else if(data.type == 'discrete'){
                    var dial = parts.control.dial_discrete(
                        keys[a],
                        data.x, data.y, data.r,
                        data.optionCount,
                        data.startAngle, data.maxAngle,
                        data.handleStyle, data.slotStyle, data.needleStyle,
                        data.arcDistance, data.outerArcStyle
                    );
                    _mainObject.dial.discrete[keys[a]] = dial;
                }else{console.error('unknow dial type: "'+ data.type + '"'); var dial = null;}

                dial.onChange = data.onChange;
                dial.onRelease = data.onRelease;
                _mainObject.append(dial);
            }

        //connection nodes
            _mainObject.io = {};

            var keys = Object.keys(shape.connector.audio);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.audio[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_audio( keys[a], data.type, data.x, data.y, data.width, data.height, __globals.audio.context );
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

            var keys = Object.keys(shape.connector.data);
            for(var a = 0; a < keys.length; a++){
                var data = shape.connector.data[keys[a]];
                _mainObject.io[keys[a]] = parts.dynamic.connectionNode_data( keys[a], data.x, data.y, data.width, data.height, data.angle);
                _mainObject.io[keys[a]].receive = data.receive;
                _mainObject.prepend(_mainObject.io[keys[a]]);
            }

        //circuitry
            _mainObject.__unit = new parts.audio.filterUnit(__globals.audio.context);
            _mainObject.io.audioIn.out().connect( _mainObject.__unit.in() );
            _mainObject.__unit.out().connect( _mainObject.io.audioOut.in() );


        //setup

        return _mainObject;
}

//audio effect units
    var distortionUnit_1 = __globals.objects.make_distortionUnit(310, 35);
    __globals.panes.middleground.append( distortionUnit_1 );
    var reverbUnit_1 = __globals.objects.make_reverbUnit(185, 40);
    __globals.panes.middleground.append( reverbUnit_1 );
    var filterUnit_1 = __globals.objects.make_filterUnit(40, 35);
    __globals.panes.middleground.append( filterUnit_1 );

//add objects
    var audioSink_1 = __globals.objects.make_audioSink(-300,-35);
    __globals.panes.middleground.append( audioSink_1 );

    var audioDuplicator_1 = __globals.objects.make_audioDuplicator(-50,25);
    __globals.panes.middleground.append( audioDuplicator_1 );
    var audioDuplicator_2 = __globals.objects.make_audioDuplicator(-150,-35);
    __globals.panes.middleground.append( audioDuplicator_2 );

    var launchpad_1 = __globals.objects.make_launchpad(750,25);
    __globals.panes.middleground.append( launchpad_1 );

    var basicSynth2_1 = __globals.objects.make_basicSynth2(450,25);
    __globals.panes.middleground.append( basicSynth2_1 );

    var pulseClock_1 = __globals.objects.make_pulseClock(950,25);
    __globals.panes.middleground.append( pulseClock_1 );

    var periodicWaveMaker_1 = __globals.objects.make_periodicWaveMaker(750,-100);
    __globals.panes.middleground.append( periodicWaveMaker_1 );

    var audioScope_1 = __globals.objects.make_audioScope(-295,80);
    __globals.panes.middleground.append( audioScope_1 );

    var universalReadout_1 = makeUniversalReadout(850,200);
    __globals.panes.middleground.append( universalReadout_1 );

//do connections
    periodicWaveMaker_1.io.out.connectTo(basicSynth2_1.io.periodicWave);
    pulseClock_1.io.out.connectTo(launchpad_1.io.pulseIn);
    launchpad_1.io.out.connectTo(basicSynth2_1.io.midiNote);

    basicSynth2_1.io.audioOut.connectTo(distortionUnit_1.io.audioIn);
    distortionUnit_1.io.audioOut.connectTo(reverbUnit_1.io.audioIn);
    reverbUnit_1.io.audioOut.connectTo(filterUnit_1.io.audioIn);
    filterUnit_1.io.audioOut.connectTo(audioDuplicator_1.io.in);

    audioDuplicator_1.io.out_1.connectTo(audioDuplicator_2.io.in);
    audioDuplicator_1.io.out_2.connectTo(audioScope_1.io.audioIn);
    audioDuplicator_2.io.out_1.connectTo(audioSink_1.io['audioSink.io.audio.in:right']);
    audioDuplicator_2.io.out_2.connectTo(audioSink_1.io['audioSink.io.audio.in:left']);

//additional setting up
    launchpad_1.importData({
        pages: 
        [
            [
                [false, false, false, false, false, false, false, false],
                [false, false, true,  false, false, false, false, false],
                [false, false, false, false, true,  false, true,  false],
                [true,  false, true,  false, false, false, false, true ],
                [false, false, false, false, false, false, true,  false],
                [false, false, false, true,  false, false, false, false],
                [false, false, false, false, true,  false, false, false],
                [true,  false, false, false, false, false, false, false]
            ]
        ],
        currentPage: 0,
        velocityDial: 1/2
    });
    pulseClock_1.children.dial_tempo.set(0.22)

//viewport adjust
    // __globals.utility.workspace.gotoPosition(317, 111, 1, 0);
    __globals.utility.workspace.gotoPosition(167.589, -95.771, 4.33547, 0);
        }
    }

// })();
