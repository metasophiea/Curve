// (function(){
    var __svgElements = document.getElementsByTagName('svg');
    for(var __svgElements_count = 0; __svgElements_count < __svgElements.length; __svgElements_count++){
        if( __svgElements[__svgElements_count].hasAttribute('workspace') ){
            var __globals = {};
            __globals.svgElement = __svgElements[__svgElements_count];

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
            //        seconds2time                    (seconds)
            //        padString                       (string,length)
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
                    this.seconds2time = function(seconds){
                        var result = {h:0, m:0, s:0};
                        
                        result.h = Math.floor(seconds/3600);
                        seconds = seconds - result.h*3600;
            
                        result.m = Math.floor(seconds/60);
                        seconds = seconds - result.m*60;
            
                        result.s = seconds;
            
                        return result;
                    };
                    this.padString = function(string,length,padding=' '){
                        if(padding.length<1){return string;}
                        string = ''+string;
            
                        while(string.length < length){
                            string = padding + string;
                        }
            
                        return string;
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
            __globals.panes = {'global':null, 'background':null, 'middleground':null, 'foreground':null, 'menu':null};
            
            if( __globals.svgElement.children ){
                //go through SVG and see if the 'global', 'background', 'middleground', 'foreground' and 'menu' elements have already been made
                for(var a = 0; a < __globals.svgElement.children.length; a++){
                    if( __globals.svgElement.children[a].hasAttribute('pane') ){
                        switch(__globals.svgElement.children[a].getAttribute('pane')){
                            case 'global': __globals.panes.workspace = __globals.svgElement.children[a]; break;
                            case 'background': __globals.panes.background = __globals.svgElement.children[a]; break;
                            case 'middleground': __globals.panes.middleground = __globals.svgElement.children[a]; break;
                            case 'foreground': __globals.panes.foreground = __globals.svgElement.children[a]; break;
                            case 'menu': __globals.panes.menu = __globals.svgElement.children[a]; break;
                        }
                    }
                }
            
                //if the 'background', 'middleground' or 'menu' elements were not made, create them
                if(__globals.panes.workspace == null){ 
                    __globals.panes.workspace = document.createElementNS('http://www.w3.org/2000/svg','g');
                    __globals.panes.workspace.setAttribute('pane','workspace');
                }
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
            
            
            //setup globals
            if(!__globals.panes.workspace.style.transform){ __globals.panes.workspace.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
            __globals.panes.workspace.setAttribute('global',true);
            if(!__globals.panes.menu.style.transform){ __globals.panes.menu.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
            __globals.panes.menu.setAttribute('global',true);
            
            //clear out svg element
            __globals.svgElement.innerHTML = '';
            
            //add __globals.panes to svg element
            __globals.svgElement.append(__globals.panes.workspace);
            __globals.panes.workspace.append(__globals.panes.background);
            __globals.panes.workspace.append(__globals.panes.middleground);
            __globals.panes.workspace.append(__globals.panes.foreground);
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
                                    //     var position = __globals.utility.element.getTransform(__globals.panes.workspace);
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
                                    var globalScale = __globals.utility.workspace.getGlobalScale(__globals.selection.selectedObjects[a]);
            
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
                    //menu
                    //workspace
                    if(__globals.utility.object.requestInteraction(event.x,event.y,'onmousemove','workspace')){
                        for(var a = 0; a < __globals.mouseInteraction.onmousemove_functionList.length; a++){
                            var shouldRun = true;
                            for(var b = 0; b < __globals.mouseInteraction.onmousemove_functionList[a].specialKeys.length; b++){
                                shouldRun = shouldRun && event[__globals.mouseInteraction.onmousemove_functionList[a].specialKeys[b]];
                                if(!shouldRun){break;}
                            }
                            if(shouldRun){ __globals.mouseInteraction.onmousemove_functionList[a].function(event); break; }
                        }
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
                    //menu
                    //workspace
                    if(!__globals.utility.object.requestInteraction(event.x,event.y,'onmousedown','workspace') || event.button != 0){return;}
                    for(var a = 0; a < __globals.mouseInteraction.onmousedown_functionList.length; a++){
                        var shouldRun = true;
                        for(var b = 0; b < __globals.mouseInteraction.onmousedown_functionList[a].specialKeys.length; b++){
                            shouldRun = shouldRun && event[__globals.mouseInteraction.onmousedown_functionList[a].specialKeys[b]];
                            if(!shouldRun){break;}
                        }
                        if(shouldRun){ __globals.mouseInteraction.onmousedown_functionList[a].function(event,__globals.panes.workspace); break; }
                    }
                };
            
                //group selection
                __globals.mouseInteraction.onmousedown_functionList.push(
                    {
                        'specialKeys':['shiftKey'],
                        'function':function(event,globalPane){
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
                                        globalPane.removeAttribute('oldPosition');
                                        globalPane.removeAttribute('clickPosition');
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
                        'function':function(event,globalPane){
                            __globals.selection.deselectEverything();
                            __globals.svgElement.temp_oldPosition = __globals.utility.element.getTransform(globalPane);
                            __globals.panes.workspace.setAttribute('clickPosition','['+event.x +','+ event.y+']');
            
                            __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
                            __globals.svgElement.onmousemove = function(event){
                                var position = {};
                                    position.x = __globals.svgElement.temp_oldPosition.x;
                                    position.y = __globals.svgElement.temp_oldPosition.y;
                                    position.s = __globals.svgElement.temp_oldPosition.s;
                                    position.r = __globals.svgElement.temp_oldPosition.r;
                                var clickPosition = JSON.parse(globalPane.getAttribute('clickPosition'));
                                position.x = position.x-(clickPosition[0]-event.x);
                                position.y = position.y-(clickPosition[1]-event.y);
                                __globals.utility.element.setTransform(globalPane, position);
                            };
            
                            __globals.svgElement.onmouseup = function(){
                                this.onmousemove = __globals.svgElement.onmousemove_old;
                                delete __globals.svgElement.onmousemove_old;
                                globalPane.removeAttribute('oldPosition');
                                globalPane.removeAttribute('clickPosition');
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
                    //menu
                    //workspace
                    if(__globals.utility.object.requestInteraction(event.x,event.y,'onwheel','workspace')){
                        for(var a = 0; a < __globals.mouseInteraction.onwheel_functionList.length; a++){
                            var shouldRun = true;
                            for(var b = 0; b < __globals.mouseInteraction.onwheel_functionList[a].specialKeys.length; b++){
                                shouldRun = shouldRun && event[__globals.mouseInteraction.onwheel_functionList[a].specialKeys[b]];
                                if(!shouldRun){break;}
                            }
                            if(shouldRun){ __globals.mouseInteraction.onwheel_functionList[a].function(event); break; }
                        }
                    }
                };
            
                __globals.mouseInteraction.onwheel_functionList.push(
                    {
                        'specialKeys':[],
                        'function':function(event){
                            var zoomLimits = {'max':10, 'min':0.1};
                            var position = __globals.utility.element.getTransform(__globals.panes.workspace);
            
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
            
                            __globals.utility.element.setTransform(__globals.panes.workspace, position);
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
            
                    if( 
                        (event.ctrlKey  && desiredKeys.control && ( desiredKeys.control=='all' || (Array.isArray(desiredKeys.control) && desiredKeys.control.includes(event.key)) )) ||
                        (event.shiftKey && desiredKeys.shift   && ( desiredKeys.shift=='all'   || (Array.isArray(desiredKeys.shift)   && desiredKeys.shift.includes(event.key))   )) ||
                        (event.metaKey  && desiredKeys.meta    && ( desiredKeys.meta=='all'    || (Array.isArray(desiredKeys.meta)    && desiredKeys.meta.includes(event.key))    )) ||
                        (event.altKey   && desiredKeys.alt     && ( desiredKeys.alt=='all'     || (Array.isArray(desiredKeys.alt)     && desiredKeys.alt.includes(event.key))     )) ||
                        (                  desiredKeys.none    && ( desiredKeys.none=='all'    || (Array.isArray(desiredKeys.none)    && desiredKeys.none.includes(event.key))    ))
                    ){
                        connectionObject[type](event.key,modifiers);
                        return true;
                    }
            
                    return false;
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
                    if(!__globals.utility.object.requestInteraction(temp[0],temp[1],'onkeydown','workspace')){
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
                    if(!__globals.utility.object.requestInteraction(temp[0],temp[1],'onkeyup','workspace')){
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
                    this.path = function(id=null, path=[], lineType='L', style='fill:rgba(0,0,0,0);'){
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
                        x, y, angle=0,
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
                            var y_graphingDistance = realHeight * (viewbox.h-y)/viewboxDistance
                            return !isNaN(y_graphingDistance) ? y_graphingDistance : 0;
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
                            // this.horizontalMarkings([0.75,0.5,0.25,0,-0.25,-0.5,-0.75,1,1.25,1.5,1.75,-1.75]);
                            this.horizontalMarkings([0.75,0,-0.25,-2,-1,1]);
                            this.verticalMarkings([0,1,2,3,4,5,6,7,8,9,10]);
                            this.viewbox({'l':-2,'h':4});
                            this.drawBackground();
                            this.draw([0,-2,1,-1,2]);
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
                        backingStyle='fill:rgb(10,10,10)',
                        levelStyles=['fill:rgb(250,250,250)','fill:rgb(200,200,200)']
                    ){
                        var values = Array.apply(null, Array(levelStyles.length)).map(Number.prototype.valueOf,0);
                    
                        // elements
                            var object = parts.basic.g(id, x, y);
                    
                            //level layers are layered from back forward, so backing must go on last
                            var levels = [];
                            for(var a = 0; a < levelStyles.length; a++){
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
                            var level = parts.display.level('mainlevel',0,0,angle,width,height,backingStyle,levelStyles);
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
                            object.import = function(data){
                                for(var x = 0; x < xCount; x++){
                                    for(var y = 0; y < yCount; y++){
                                        this.set(x,y,data[x][y]);
                                    }
                                }
                                render();
                            };
                            object.export = function(){ return pixelValues; }
                            object.setAll = function(value){
                                for(var x = 0; x < xCount; x++){
                                    for(var y = 0; y < yCount; y++){
                                        this.set(x,y,value);
                                    }
                                }
                            }
                    
                            object.test = function(){
                                this.setAll([1,1,1]);
                                this.set(1,1,[1,0.5,0.5]);
                                this.set(2,2,[0.5,1,0.5]);
                                this.set(3,3,[0.5,0.5,1]);
                                this.set(4,4,[1,0.5,1]);
                                render();
                            };
                    
                        return object;
                    };
                    this.readout_sixteenSegmentDisplay = function(
                        id='readout_sixteenSegmentDisplay',
                        x, y, width, height, count,
                        backgroundStyle='fill:rgb(0,0,0)',
                        glowStyle='fill:rgb(200,200,200)',
                        dimStyle='fill:rgb(20,20,20)'
                    ){
                        //values
                            var text = '';
                            var displayInterval = null;
                    
                        //elements
                            //main
                                var object = parts.basic.g(id, x, y);
                    
                            //display units
                                var units = [];
                                for(var a = 0; a < count; a++){
                                    var temp = parts.display.sixteenSegmentDisplay(
                                        a, 
                                        (width/count)*a, 0, width/count, height, 
                                        backgroundStyle, glowStyle, dimStyle
                                    );
                                    object.append( temp );
                                    units.push(temp);
                                }
                    
                        //methods
                            object.test = function(){
                                this.text('Look at all the text I\'ve got here! 1234567890 \\/<>()[]{}*!?"#_,.');
                                this.print('r2lSweep');
                            };
                    
                            object.text = function(a){
                                if(a==null){return text;}
                                text = a;
                            };
                    
                            object.print = function(style){
                                clearInterval(displayInterval);
                                switch(style){
                                    case 'smart':
                                        if(text.length > units.length){this.print('r2lSweep');}
                                        else{this.print('regular')}
                                    break;
                                    case 'r2lSweep':
                                        var displayIntervalTime = 100;
                                        var displayStage = 0;
                    
                                        displayInterval = setInterval(function(){
                                            for(var a = units.length-1; a >= 0; a--){
                                                units[a].enterCharacter(text[displayStage-((units.length-1)-a)]);
                                            }
                    
                                            displayStage++;if(displayStage > units.length+text.length-1){displayStage=0;}
                                        },displayIntervalTime);
                                    break;
                                    case 'regular': default:
                                        for(var a = 0; a < units.length; a++){
                                            units[a].enterCharacter(text[a]);
                                        }
                                    break;
                                }
                            };
                    
                    
                    
                    
                        return object;
                    };
                    this.sevenSegmentDisplay = function(
                        id='sevenSegmentDisplay',
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
                    this.sixteenSegmentDisplay = function(
                        id='sixteenSegmentDisplay',
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
                                            {x:division*0.5+margin,         y:division*0.5+margin},  //center
                                            {x:division*1.0+margin,         y:division*0.0+margin},  //top
                                            {x:division*0.0+margin,         y:division*1.0+margin},  //left
                                            {x:division*1.0+margin,         y:division*1.0+margin},  //inner point
                                            {x:division*1.75+margin,        y:division*1.0+margin},  //inner point right
                                            {x:division*1.0+margin,         y:division*1.75+margin}, //inner point down
                                        ],
                                        center:[
                                            {x:width/2,                     y:division*0.5+margin}, //central point
                                            {x:width/2-division*0.5,        y:division*1.0+margin}, //lower left
                                            {x:width/2+division*0.5,        y:division*1.0+margin}, //lower right
                                            {x:width/2-division*0.5,        y:division*0.0+margin}, //upper left
                                            {x:width/2+division*0.5,        y:division*0.0+margin}, //upper right
                                        ],
                                        right:[
                                            {x:width-division*0.5-margin,   y:division*0.5+margin},  //center
                                            {x:width-division*1.0-margin,   y:division*0.0+margin},  //top
                                            {x:width-division*0.0-margin,   y:division*1.0+margin},  //right
                                            {x:width-division*1.0-margin,   y:division*1.0+margin},  //inner point
                                            {x:width-division*1.0-margin,   y:division*1.75+margin}, //inner point down
                                            {x:width-division*1.75-margin,  y:division*1.0+margin},  //inner point left
                                        ]
                                    },
                                    middle:{
                                        left:[
                                            {x:division*0.0+margin,         y:height*0.5-division*0.5}, //top left
                                            {x:division*1.0+margin,         y:height*0.5-division*0.5}, //top right
                                            {x:division*0.5+margin,         y:height*0.5-division*0.0}, //center
                                            {x:division*0.0+margin,         y:height*0.5+division*0.5}, //bottom left
                                            {x:division*1.0+margin,         y:height*0.5+division*0.5}, //bottom right
                                        ],
                                        center:[
                                            {x:width/2,                     y:height/2},                //central point
                                            {x:width/2-division*0.5,        y:division*0.5+height/2},   //lower left
                                            {x:width/2-division*0.25,       y:division*1.25+height/2},  //lower left down
                                            {x:width/2-division*1.0,        y:division*0.5+height/2},   //lower left left
                                            {x:width/2+division*0.5,        y:division*0.5+height/2},   //lower right
                                            {x:width/2+division*0.5,        y:division*1.75+height/2},  //lower right down
                                            {x:width/2+division*1.0,        y:division*0.5+height/2},   //lower right right
                                            {x:width/2-division*0.5,        y:-division*0.5+height/2},  //upper left
                                            {x:width/2-division*0.25,       y:-division*1.25+height/2}, //upper left up
                                            {x:width/2-division*1.0,        y:-division*0.25+height/2}, //upper left left
                                            {x:width/2+division*0.5,        y:-division*0.5+height/2},  //upper right
                                            {x:width/2+division*0.5,        y:-division*1.75+height/2}, //upper right up
                                            {x:width/2+division*1.0,        y:-division*0.25+height/2}, //upper right right
                                        ],
                                        right:[
                                            {x:width-division*1.0-margin,   y:height*0.5-division*0.5}, //top left
                                            {x:width-division*0.0-margin,   y:height*0.5-division*0.5}, //top right
                                            {x:width-division*0.5-margin,   y:height*0.5-division*0.0}, //center
                                            {x:width-division*1.0-margin,   y:height*0.5+division*0.5}, //bottom left
                                            {x:width-division*0.0-margin,   y:height*0.5+division*0.5}  //bottom right
                                        ]
                                    },
                                    bottom: {
                                        left:[
                                            {x:division*0.5+margin,         y:height-division*0.5-margin}, //center
                                            {x:division*0.0+margin,         y:height-division*1.0-margin}, //left
                                            {x:division*1.0+margin,         y:height-division*0.0-margin}, //bottom
                                            {x:division*1.0+margin,         y:height-division*1.0-margin}, //inner point
                                            {x:division*1.0+margin,         y:height-division*1.75-margin},//inner point up
                                            {x:division*1.75+margin,        y:height-division*1.0-margin}, //inner point right
                                        ],
                                        center:[
                                            {x:width/2-division*0.5,        y:height-division*1.0-margin}, //upper left
                                            {x:width/2+division*0.5,        y:height-division*1.0-margin}, //upper right
                                            {x:width/2,                     y:height-division*0.5-margin}, //central point
                                            {x:width/2-division*0.5,        y:height-division*0.0-margin}, //lower left
                                            {x:width/2+division*0.5,        y:height-division*0.0-margin}, //lower right
                                        ],
                                        right:[
                                            {x:width-division*0.5-margin,   y:height-division*0.5-margin}, //center
                                            {x:width-division*0.0-margin,   y:height-division*1.0-margin}, //right
                                            {x:width-division*1.0-margin,   y:height-division*0.0-margin}, //bottom
                                            {x:width-division*1.0-margin,   y:height-division*1.0-margin}, //inner point
                                            {x:width-division*1.0-margin,   y:height-division*1.75-margin},//inner point up
                                            {x:width-division*1.75-margin,  y:height-division*1.0-margin}, //inner point left
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
                    
                    
                    
                            // var keys = Object.keys(shapes.segments.points);
                            // for(var a = 0; a < keys.length; a++){
                            //     var subkeys = Object.keys(shapes.segments.points[keys[a]]);
                            //     for(var b = 0; b < subkeys.length; b++){
                            //         for(var c = 0; c < shapes.segments.points[keys[a]][subkeys[b]].length; c++){
                            //             object.appendChild(__globals.utility.workspace.dotMaker(
                            //                 shapes.segments.points[keys[a]][subkeys[b]][c].x, shapes.segments.points[keys[a]][subkeys[b]][c].y, undefined, 0.25
                            //             ));
                            //         }
                            //     }
                            // }
                    
                    
                            //segments
                                var segments = [];
                                var points = [
                                    [
                                        shapes.segments.points.top.left[1],
                                        shapes.segments.points.top.left[0],
                                        shapes.segments.points.top.left[3],
                                        shapes.segments.points.top.center[1],
                                        shapes.segments.points.top.center[0],
                                        shapes.segments.points.top.center[3],
                                    ],
                                    [
                                        shapes.segments.points.top.center[4],
                                        shapes.segments.points.top.center[0],
                                        shapes.segments.points.top.center[2],
                                        shapes.segments.points.top.right[3],
                                        shapes.segments.points.top.right[0],
                                        shapes.segments.points.top.right[1],
                                    ],
                    
                                    [
                                        shapes.segments.points.top.left[0],
                                        shapes.segments.points.top.left[2],
                                        shapes.segments.points.middle.left[0],
                                        shapes.segments.points.middle.left[2],
                                        shapes.segments.points.middle.left[1],
                                        shapes.segments.points.top.left[3],
                                    ],
                                    [
                                        shapes.segments.points.top.left[4],
                                        shapes.segments.points.top.left[3],
                                        shapes.segments.points.top.left[5],
                                        shapes.segments.points.middle.center[9],
                                        shapes.segments.points.middle.center[7],
                                        shapes.segments.points.middle.center[8],
                                    ],
                                    [
                                        shapes.segments.points.top.center[0],
                                        shapes.segments.points.top.center[1],
                                        shapes.segments.points.middle.center[7],
                                        shapes.segments.points.middle.center[0],
                                        shapes.segments.points.middle.center[10],
                                        shapes.segments.points.top.center[2],
                                    ],
                                    [
                                        shapes.segments.points.top.right[4],
                                        shapes.segments.points.top.right[3],
                                        shapes.segments.points.top.right[5],
                                        shapes.segments.points.middle.center[11],
                                        shapes.segments.points.middle.center[10],
                                        shapes.segments.points.middle.center[12],
                                    ],
                                    [
                                        shapes.segments.points.top.right[0],
                                        shapes.segments.points.top.right[2],
                                        shapes.segments.points.middle.right[1],
                                        shapes.segments.points.middle.right[2],
                                        shapes.segments.points.middle.right[0],
                                        shapes.segments.points.top.right[3],
                                    ],
                    
                                    [
                                        shapes.segments.points.middle.left[4],
                                        shapes.segments.points.middle.left[2],
                                        shapes.segments.points.middle.left[1],
                                        shapes.segments.points.middle.center[7],
                                        shapes.segments.points.middle.center[0],
                                        shapes.segments.points.middle.center[1],
                                    ],
                                    [
                                        shapes.segments.points.middle.right[3],
                                        shapes.segments.points.middle.right[2],
                                        shapes.segments.points.middle.right[0],
                                        shapes.segments.points.middle.center[10],
                                        shapes.segments.points.middle.center[0],
                                        shapes.segments.points.middle.center[4],
                                    ],
                    
                                    [
                                        shapes.segments.points.bottom.left[0],
                                        shapes.segments.points.bottom.left[1],
                                        shapes.segments.points.middle.left[3],
                                        shapes.segments.points.middle.left[2],
                                        shapes.segments.points.middle.left[4],
                                        shapes.segments.points.bottom.left[3],
                                    ],
                                    [
                                        shapes.segments.points.bottom.left[4],
                                        shapes.segments.points.bottom.left[3],
                                        shapes.segments.points.bottom.left[5],
                                        shapes.segments.points.middle.center[2],
                                        shapes.segments.points.middle.center[1],
                                        shapes.segments.points.middle.center[3],
                                    ],
                                    [
                                        shapes.segments.points.bottom.center[0],
                                        shapes.segments.points.bottom.center[2],
                                        shapes.segments.points.bottom.center[1],
                                        shapes.segments.points.middle.center[4],
                                        shapes.segments.points.middle.center[0],
                                        shapes.segments.points.middle.center[1],
                                    ],
                                    [
                                        shapes.segments.points.bottom.right[4],
                                        shapes.segments.points.bottom.right[3],
                                        shapes.segments.points.bottom.right[5],
                                        shapes.segments.points.middle.center[5],
                                        shapes.segments.points.middle.center[4],
                                        shapes.segments.points.middle.center[6],
                                    ],
                                    [
                                        shapes.segments.points.bottom.right[3],
                                        shapes.segments.points.middle.right[3],
                                        shapes.segments.points.middle.right[2],
                                        shapes.segments.points.middle.right[4],
                                        shapes.segments.points.bottom.right[1],
                                        shapes.segments.points.bottom.right[0],
                                    ],
                    
                                    [
                                        shapes.segments.points.bottom.left[2],
                                        shapes.segments.points.bottom.left[0],
                                        shapes.segments.points.bottom.left[3],
                                        shapes.segments.points.bottom.center[0],
                                        shapes.segments.points.bottom.center[2],
                                        shapes.segments.points.bottom.center[3],
                                    ],
                                    [
                                        shapes.segments.points.bottom.right[2],
                                        shapes.segments.points.bottom.right[0],
                                        shapes.segments.points.bottom.right[3],
                                        shapes.segments.points.bottom.center[1],
                                        shapes.segments.points.bottom.center[2],
                                        shapes.segments.points.bottom.center[4],
                                    ],
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
                                    case '!': 
                                        stamp = [
                                               1,1,
                                            0,1,1,1,0,
                                               0,0,
                                            0,0,0,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case '?': 
                                        stamp = [
                                               1,1,
                                            0,0,0,0,1,
                                               0,1,
                                            0,0,0,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case '.': 
                                        stamp = [
                                               0,0,
                                            0,0,0,0,0,
                                               0,0,
                                            0,0,0,0,0,
                                               1,0,
                                        ]; 
                                    break;
                                    case ',': 
                                        stamp = [
                                               0,0,
                                            0,0,0,0,0,
                                               0,0,
                                            0,0,1,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '\'': 
                                        stamp = [
                                               0,0,
                                            1,0,0,0,0,
                                               0,0,
                                            0,0,0,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case ':':
                                        stamp = [
                                               0,0,
                                            0,1,0,1,0,
                                               0,0,
                                            0,1,0,1,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '"': 
                                        stamp = [
                                               0,0,
                                            1,0,1,0,0,
                                               0,0,
                                            0,0,0,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '_': 
                                        stamp = [
                                               0,0,
                                            0,0,0,0,0,
                                               0,0,
                                            0,0,0,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case '-': 
                                        stamp = [
                                               0,0,
                                            0,0,0,0,0,
                                               1,1,
                                            0,0,0,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '\\': 
                                        stamp = [
                                               0,0,
                                            0,1,0,0,0,
                                               0,0,
                                            0,0,0,1,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '/': 
                                        stamp = [
                                               0,0,
                                            0,0,0,1,0,
                                               0,0,
                                            0,1,0,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '*': 
                                        stamp = [
                                               0,0,
                                            0,1,1,1,0,
                                               1,1,
                                            0,1,1,1,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '#': 
                                        stamp = [
                                               1,1,
                                            1,0,1,0,1,
                                               1,1,
                                            1,0,1,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case '<': 
                                    stamp = [
                                           0,0,
                                        0,0,0,1,0,
                                           0,0,
                                        0,0,0,1,0,
                                           0,0,
                                    ]; 
                                    break;
                                    case '>': 
                                        stamp = [
                                               0,0,
                                            0,1,0,0,0,
                                               0,0,
                                            0,1,0,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '(': 
                                    stamp = [
                                           0,1,
                                        0,0,1,0,0,
                                           0,0,
                                        0,0,1,0,0,
                                           0,1,
                                    ]; 
                                    break;
                                    case ')': 
                                        stamp = [
                                               1,0,
                                            0,0,1,0,0,
                                               0,0,
                                            0,0,1,0,0,
                                               1,0,
                                        ]; 
                                    break;
                                    case '[': 
                                    stamp = [
                                           1,1,
                                        1,0,0,0,0,
                                           0,0,
                                        1,0,0,0,0,
                                           1,1,
                                    ]; 
                                    break;
                                    case ']': 
                                        stamp = [
                                               1,1,
                                            0,0,0,0,1,
                                               0,0,
                                            0,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case '{': 
                                    stamp = [
                                           1,1,
                                        0,1,0,0,0,
                                           1,0,
                                        0,1,0,0,0,
                                           1,1,
                                    ]; 
                                    break;
                                    case '}': 
                                        stamp = [
                                               1,1,
                                            0,0,0,1,0,
                                               0,1,
                                            0,0,0,1,0,
                                               1,1,
                                        ]; 
                                    break;
                    
                                    case '0': 
                                        stamp = [
                                               1,1,
                                            1,0,0,1,1,
                                               0,0,
                                            1,1,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case '1': 
                                        stamp = [
                                               1,0,
                                            0,0,1,0,0,
                                               0,0,
                                            0,0,1,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case '2': 
                                        stamp = [
                                               1,1,
                                            0,0,0,0,1,
                                               0,1,
                                            0,1,0,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case '3': 
                                        stamp = [
                                               1,1,
                                            0,0,0,0,1,
                                               1,1,
                                            0,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case '4': 
                                        stamp = [
                                               0,0,
                                            1,0,0,0,1,
                                               1,1,
                                            0,0,0,0,1,
                                               0,0,
                                        ]; 
                                    break;
                                    case '5': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,0,
                                               1,1,
                                            0,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case '6': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,0,
                                               1,1,
                                            1,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case '7': 
                                        stamp = [
                                               1,1,
                                            0,0,0,1,0,
                                               0,0,
                                            0,1,0,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case '8': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,1,
                                               1,1,
                                            1,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case '9': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,1,
                                               1,1,
                                            0,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                    
                                    case 'a': case 'A': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,1,
                                               1,1,
                                            1,0,0,0,1,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'b': case 'B': 
                                        stamp = [
                                               1,1,
                                            0,0,1,0,1,
                                               0,1,
                                            0,0,1,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'c': case 'C': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,0,
                                               0,0,
                                            1,0,0,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'd': case 'D': 
                                        stamp = [
                                               1,1,
                                            0,0,1,0,1,
                                               0,0,
                                            0,0,1,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'e': case 'E': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,0,
                                               1,1,
                                            1,0,0,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'f': case 'F': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,0,
                                               1,1,
                                            1,0,0,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'g': case 'G': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,0,
                                               0,1,
                                            1,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'h': case 'H': 
                                        stamp = [
                                               0,0,
                                            1,0,0,0,1,
                                               1,1,
                                            1,0,0,0,1,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'i': case 'I': 
                                        stamp = [
                                               1,1,
                                            0,0,1,0,0,
                                               0,0,
                                            0,0,1,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'j': case 'J': 
                                        stamp = [
                                               1,1,
                                            0,0,1,0,0,
                                               0,0,
                                            0,0,1,0,0,
                                               1,0,
                                        ]; 
                                    break;
                                    case 'k': case 'K': 
                                        stamp = [
                                               0,0,
                                            1,0,0,1,0,
                                               1,0,
                                            1,0,0,1,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'l': case 'L': 
                                        stamp = [
                                               0,0,
                                            1,0,0,0,0,
                                               0,0,
                                            1,0,0,0,0,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'm': case 'M': 
                                        stamp = [
                                               0,0,
                                            1,1,0,1,1,
                                               0,0,
                                            1,0,0,0,1,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'n': case 'N': 
                                        stamp = [
                                               0,0,
                                            1,1,0,0,1,
                                               0,0,
                                            1,0,0,1,1,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'o': case 'O': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,1,
                                               0,0,
                                            1,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'p': case 'P': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,1,
                                               1,1,
                                            1,0,0,0,0,
                                               0,0,
                                        ];
                                    break;
                                    case 'q': case 'Q': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,1,
                                               0,0,
                                            1,0,0,1,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'r': case 'R': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,1,
                                               1,1,
                                            1,0,0,1,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case 's': case 'S': 
                                        stamp = [
                                               1,1,
                                            1,0,0,0,0,
                                               1,1,
                                            0,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case 't': case 'T': 
                                        stamp = [
                                               1,1,
                                            0,0,1,0,0,
                                               0,0,
                                            0,0,1,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'u': case 'U': 
                                        stamp = [
                                               0,0,
                                            1,0,0,0,1,
                                               0,0,
                                            1,0,0,0,1,
                                               1,1,
                                        ]; 
                                    break;
                                    case 'v': case 'V': 
                                        stamp = [
                                               0,0,
                                            1,0,0,1,0,
                                               0,0,
                                            1,1,0,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'w': case 'W': 
                                        stamp = [
                                               0,0,
                                            1,0,0,0,1,
                                               0,0,
                                            1,1,0,1,1,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'x': case 'X': 
                                        stamp = [
                                               0,0,
                                            0,1,0,1,0,
                                               0,0,
                                            0,1,0,1,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'y': case 'Y': 
                                        stamp = [
                                               0,0,
                                            0,1,0,1,0,
                                               0,0,
                                            0,0,1,0,0,
                                               0,0,
                                        ]; 
                                    break;
                                    case 'z': case 'Z': 
                                        stamp = [
                                               1,1,
                                            0,0,0,1,0,
                                               0,0,
                                            0,1,0,0,0,
                                               1,1,
                                        ]; 
                                    break;
                    
                                    case 'all': stamp = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]; break;
                                    default:
                                        stamp = [
                                               0,0,
                                            0,0,0,0,0,
                                               0,0,
                                            0,0,0,0,0,
                                               0,0,
                                        ];
                                    break;
                                }
                    
                                for(var a = 0; a < stamp.length; a++){
                                    this.set(a, stamp[a]==1);
                                }
                            };
                    
                            object.test = function(){
                                this.clear();
                                // for(var a = 0; a < segments.length; a++){
                                //     this.set(a,true);
                                // }
                    
                                var a = 0;
                                setInterval(function(that){
                                    that.enterCharacter(['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'][a++]);
                                    if(a>36){a=0;}
                                },500,this);
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
                        glowStyle = 'fill:rgba(220,200,220,1)',
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
                        object.click = function(glow=false){ 
                            this.onclick(); this.onmousedown(); 
                            if(glow){rect.glow();}
                            else{rect.onmousedown();} 
                            setTimeout(function(that){rect.onmouseup();that.onmouseup();},250,this);
                        };
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
                    
                            if(update&&this.onchange){ this.onchange(value); }
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
                        object.onchange = function(){};
                    
                    
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
                                var outerArc = parts.basic.path(id='arc', path=arcPath, 'Q', outerArcStyle);
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
                                if(update&&this.onchange){ this.onchange(value); }
                                if(update&&!live&&this.onrelease){ this.onrelease(value); }
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
                            object.onchange = function(){};
                            object.onrelease = function(){};
                    
                    
                        //mouse interaction
                            object.ondblclick = function(){ this.set(0.5); };
                            object.onwheel = function(event){
                                var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
                                var globalScale = __globals.utility.workspace.getGlobalScale(object);
                    
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
                                    var divider = __globals.utility.workspace.getGlobalScale(object);
                    
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
                                var needleWidth = r/5;
                                var needleLength = r;
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
                                if(update&&this.onchange){ this.onchange(a); }
                                if(update&&!live&&this.onrelease){ this.onrelease(value); }
                            };
                            object._get = function(){ return this._value; };
                            object._set = function(value){
                                value = (value>1 ? 1 : value);
                                value = (value<0 ? 0 : value);
                    
                                this._value = value;
                                this.children['needle'].rotation(startAngle + maxAngle*value);
                            };object._set(0);
                      
                    
                        //callback
                            object.onchange = function(){};
                            object.onrelease = function(){};
                    
                        
                        //mouse interaction
                            object.ondblclick = function(){ this.select( Math.floor(optionCount/2) ); /*this._set(0.5);*/ };
                            object.onwheel = function(event){
                                var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
                                var globalScale = __globals.utility.workspace.getGlobalScale(object);
                    
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
                                    var divider = __globals.utility.workspace.getGlobalScale(object);
                    
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
                            if(this.onkeydown){this.onkeydown();}
                        };
                        object.release = function(){ 
                            if( this.state%2 == 0 ){return;} //key not pressed 
                            this.activateState(object.state-1); 
                            if(this.onkeyup){this.onkeyup();}
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
                                temp.onchange = function(){ if(object.onchange){object.onchange(object.get());} };
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
                        object.onchange = function(){};
                    
                    
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
                            temp.onchange = function(){ object.onchange(object.get()); };
                            temp.onrelease = function(){ object.onrelease(object.get()); };
                            object.appendChild(temp);
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
                    
                                if(update&&this.onchange){ this.onchange(a); }
                            };
                            object.smoothSet = function(a,time,curve,update=true){
                                for(var b = 0; b < a.length; b++){
                                    this.slide(b).smoothSet(a[b],time,curve,false);
                                }
                                for(var b = a.length; b < count; b++){
                                    this.slide(b).smoothSet(1/2,time,curve,false);
                                }
                    
                                if(update&&this.onchange){ setTimeout(function(){this.onchange(a);},time); }
                                if(update&&!live&&this.onrelease){ setTimeout(function(){this.onrelease(a);},time); }
                            };
                            object.setAll = function(a, live=false, update=true){
                                this.set( Array.apply(null, Array(count)).map(Number.prototype.valueOf,a) );
                            };
                            object.smoothSetAll = function(a, time, curve, update=true){
                                this.smoothSet( Array.apply(null, Array(count)).map(Number.prototype.valueOf,a), time, curve, update );
                            };
                        
                        //callback
                            object.onchange = function(){};
                            object.onrelease = function(){};
                    
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
                            temp.onchange = function(){ object.onchange(object.get()); };
                            temp.onrelease = function(){ object.onrelease(object.get()); };
                            object.appendChild(temp);
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
                    
                                if(update&&this.onchange){ this.onchange(a); }
                                if(update&&!live&&this.onrelease){ this.onrelease(a); }
                            };
                            object.smoothSet = function(a,time,curve,update=true){
                                for(var b = 0; b < a.length; b++){
                                    this.slide(b).smoothSet(a[b],time,curve,false);
                                }
                                for(var b = a.length; b < count; b++){
                                    this.slide(b).smoothSet(1/2,time,curve,false);
                                }
                    
                                if(update&&this.onchange){ setTimeout(function(){this.onchange(a);},time); }
                                if(update&&!live&&this.onrelease){ setTimeout(function(){this.onrelease(a);},time); }
                            };
                            object.setAll = function(a, live=false, update=true){
                                this.set( Array.apply(null, Array(count)).map(Number.prototype.valueOf,a) );
                            };
                            object.smoothSetAll = function(a, time, curve, update=true){
                                this.smoothSet( Array.apply(null, Array(count)).map(Number.prototype.valueOf,a), time, curve, update );
                            };
                    
                        //callback
                            object.onchange = function(){};
                            object.onrelease = function(){};
                    
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
                                'handleSize':0.9,
                                grasped:false,
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
                            if(object._data.grasped){return;}
                            this._set(value,live,update);
                        };
                        object._set = function(value, live=false, update=true){
                            value = (value>1 ? 1 : value);
                            value = (value<0 ? 0 : value);
                    
                            this._value = value;
                            if(update&&this.onchange){ this.onchange(value); }
                            if(update&&!live&&this.onrelease){ this.onrelease(value); }
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
                        object.onchange = function(){};
                        object.onrelease = function(){};
                    
                        
                        //mouse interaction
                        object.ondblclick = function(){ this.set(0.5); };
                        object.onwheel = function(event){
                            var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
                            var globalScale = __globals.utility.workspace.getGlobalScale(object);
                    
                            this._set( this.get() + move/(10*globalScale) );
                        }; 
                        object.onmousedown = function(event){
                            object._data.grasped = true;
                            __globals.svgElement.tempRef = this;
                            __globals.svgElement.tempRef._data.initialValue = this.get();
                            __globals.svgElement.tempRef._data.initialX = event.x;
                            __globals.svgElement.tempRef._data.mux = __globals.svgElement.tempRef._data.w*__globals.svgElement.tempRef._data.handleSize;
                            __globals.svgElement.onmousemove = function(event){
                                var mux = __globals.svgElement.tempRef._data.mux;
                                var value = __globals.svgElement.tempRef._data.initialValue;
                                var numerator = __globals.svgElement.tempRef._data.initialX-event.x;
                                var divider = __globals.utility.workspace.getGlobalScale(object);
                    
                                __globals.svgElement.tempRef._set( value - numerator/(divider*mux), true );
                            };
                            __globals.svgElement.onmouseup = function(){
                                object._data.grasped = false;
                                __globals.svgElement.tempRef._set( __globals.svgElement.tempRef.get(), false );
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
                            if(update&&this.onchange){ this.onchange(value); }
                            if(update&&!live&&this.onrelease){ this.onrelease(value); }
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
                        object.onchange = function(){};
                        object.onrelease = function(){};
                        
                    
                        //mouse interaction
                        object.ondblclick = function(){ this.set(0.5); };
                        object.onwheel = function(event){
                            var move = __globals.mouseInteraction.wheelInterpreter( event.deltaY );
                            var globalScale = __globals.utility.workspace.getGlobalScale(object);
                    
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
                                var divider = __globals.utility.workspace.getGlobalScale(object);
                    
                                __globals.svgElement.tempRef.set( value - numerator/(divider*mux), true );
                            };
                            __globals.svgElement.onmouseup = function(){
                                __globals.svgElement.tempRef.set( __globals.svgElement.tempRef.get(), false );
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
                    this.synthesizer_1 = function(
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
                    this.synthesizer2 = function(
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
                                            that=null; 
                                            delete that;
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
                            if(object.foreignNode.receive){object.foreignNode.receive(address, data);}
                    
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
            var objects = new function(){
                this.audio_duplicator = function(x,y){
                    var style = {
                        background:'fill:rgba(200,200,200,1);pointer-events:none;',
                        markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
                    };
                    var design = {
                        type:'audio_duplicator',
                        x:x, y:y,
                        base:{
                            points:[{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
                        },
                        elements:[
                            {type:'connectionNode_audio', name:'input', data:{
                                type:0, x:45, y:5, width:20, height:20
                            }},
                            {type:'connectionNode_audio', name:'output_1', data:{
                                type:1, x:-10, y:5, width:20, height:20
                            }},
                            {type:'connectionNode_audio', name:'output_2', data:{
                                type:1, x:-10, y:30, width:20, height:20
                            }},
                
                            {type:'path', name:'backing', data:{
                                path:[{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
                                style:style.background
                            }},
                
                            {type:'path', name:'upperArrow', data:{
                                path:[{x:10, y:11}, {x:2.5,y:16},{x:10, y:21}],
                                style:style.markings,
                            }},
                            {type:'path', name:'lowerArrow', data:{
                                path:[{x:10, y:36},{x:2.5,y:41}, {x:10, y:46}],
                                style:style.markings,
                            }},
                            {type:'rect', name:'topHorizontal', data:{
                                x:5, y:15, width:45, height:2, 
                                style:style.markings,
                            }},
                            {type:'rect', name:'vertical', data:{
                                x:27.5, y:15, width:2, height:25.5, 
                                style:style.markings,
                            }},
                            {type:'rect', name:'bottomHorizontal', data:{
                                x:5, y:40, width:24.5, height:2, 
                                style:style.markings,
                            }},
                        ]
                    };
                
                    //main object
                        var obj = __globals.utility.experimental.objectBuilder(objects.audio_duplicator,design);
                
                    //circuitry
                        design.connectionNode_audio.input.out().connect( design.connectionNode_audio.output_1.in() );
                        design.connectionNode_audio.input.out().connect( design.connectionNode_audio.output_2.in() );
                    
                    return obj;
                };
                this.audio_scope = function(x,y){
                    var attributes = {
                        framerateLimits: {min:1, max:30}
                    };
                    var style = {
                        background:'fill:rgba(200,200,200,1);pointer-events:none;',
                        text:'fill:rgba(0,0,0,1); font-size:5px; font-family:Courier New; pointer-events: none;'
                    };
                    var design = {
                        type:'audio_scope',
                        x:x, y:y,
                        base:{
                            points:[{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}],
                        },
                        elements:[
                            {type:'connectionNode_audio', name:'input', data:{
                                type:0, x:195, y:5, width:10, height:20
                            }},
                            {type:'path', name:'backing', data:{
                                path:[{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}],
                                style:style.background
                            }},
                
                            {type:'grapher_audioScope', name:'waveport', data:{
                                x:5, y:5, width:150, height:100
                            }},
                            {type:'key_rect', name:'holdKey', data:{
                                x:160, y:5, width:30, height:20,
                                style:{
                                    off:'fill:rgba(175,175,175,1)', press:'fill:rgba(220,220,220,1)', pressAndGlow:'fill:rgba(150,150,150,1)'
                                },
                                onkeydown:function(){design.grapher_audioScope.waveport.stop();},
                                onkeyup:function(){design.grapher_audioScope.waveport.start();},
                            }},
                
                            {type:'text', name:'framerate_name', data:{x: 155+6.5, y: 30+40, text: 'framerate', style: style.text}},
                            {type:'text', name:'framerate_1',    data:{x: 155+4,   y: 30+34, text: '1',         style: style.text}},
                            {type:'text', name:'framerate_15',   data:{x: 155+17,  y: 30+2,  text: '15',        style: style.text}},
                            {type:'text', name:'framerate_30',   data:{x: 155+33,  y: 30+34, text: '30',        style: style.text}},
                            {type:'dial_continuous', name:'framerate', data:{
                                x:175, y:50, r:12,
                                style:{
                                    handle:'fill:rgba(220,220,220,1)', slot:'fill:rgba(50,50,50,1)',
                                    needle:'fill:rgba(250,150,250,1)', outerArc:'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
                                },
                                onchange:function(a){
                                    design.grapher_audioScope.waveport.refreshRate(
                                        attributes.framerateLimits.min + Math.floor((attributes.framerateLimits.max - attributes.framerateLimits.min)*a)
                                    );
                                }
                            }},
                        ]
                    };
                
                    //main object
                        var obj = __globals.utility.experimental.objectBuilder(objects.audio_scope,design);
                    
                    //circuitry
                        design.connectionNode_audio.input.out().connect(design.grapher_audioScope.waveport.getNode());
                
                    //setup
                        design.grapher_audioScope.waveport.start();
                        design.dial_continuous.framerate.set(1);
                
                    return obj;
                };
                this.audio_sink = function(x,y){
                    var style = {
                        background:'fill:rgba(200,200,200,1)',
                        level:{
                            backing:'fill:rgb(10,10,10)', 
                            levels:['fill:rgb(250,250,250);','fill:rgb(200,200,200);'],
                            marking:'fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
                        },
                    };
                    var design = {
                        type:'audio_sink',
                        x:x, y:y,
                        base:{
                            points:[{x:0,y:0},{x:100,y:0},{x:100,y:55},{x:0,y:55}], 
                            style:style.background
                        },
                        elements:[
                            {type:'connectionNode_audio', name:'right', data:{
                                type:0, x:90, y:5, width:20, height:20
                            }},
                            {type:'connectionNode_audio', name:'left', data:{
                                type:0, x:90, y:30, width:20, height:20
                            }},
                            {type:'audio_meter_level', name:'right', data:{
                                x:10, y:5, width:5, height:45, 
                                style:{backing:style.backing, levels:style.levels, markings:style.markings},
                            }},
                            {type:'audio_meter_level', name:'left', data:{
                                x:5, y:5, width:5, height:45,
                                style:{backing:style.backing, levels:style.levels, markings:style.markings},
                            }},
                        ],
                    };
                 
                    //main object
                        var obj = __globals.utility.experimental.objectBuilder(objects.audio_sink,design);
                
                    //circuitry
                        var flow = {
                            destination:null,
                            pan_left:null, pan_right:null,
                        };
                        //destination
                            flow._destination = __globals.audio.context.destination;
                        //pan left/right
                            flow.pan_left = __globals.audio.context.createStereoPanner();
                                flow.pan_left.pan.setValueAtTime(1, __globals.audio.context.currentTime);
                                flow.pan_left.connect(flow._destination);
                            flow.pan_right = __globals.audio.context.createStereoPanner();
                                flow.pan_right.pan.setValueAtTime(-1, __globals.audio.context.currentTime);
                                flow.pan_right.connect(flow._destination);
                        //audio connections
                            //inputs to meters
                                design.connectionNode_audio.left.out().connect(design.audio_meter_level.left.audioIn());
                                design.connectionNode_audio.right.out().connect(design.audio_meter_level.right.audioIn());
                            //inputs to panning nodes
                                design.connectionNode_audio.left.out().connect(flow.pan_left);
                                design.connectionNode_audio.right.out().connect(flow.pan_right);
                            //panning nodes to output 
                                design.audio_meter_level.left.start();
                                design.audio_meter_level.right.start();
                
                    return obj;
                };
                this.basicSynthesizer = function(x,y){
                    var attributes = {
                        detuneLimits: {min:-100, max:100}
                    };
                    var style = {
                        background:'fill:rgba(200,200,200,1);pointer-events:none;',
                        h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
                        h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
                
                        dial:{
                            handle: 'fill:rgba(220,220,220,1)',
                            slot: 'fill:rgba(50,50,50,1)',
                            needle: 'fill:rgba(250,150,150,1)',
                            outerArc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                        }
                    };
                    var design = {
                        type:'basicSynthesizer',
                        x:x, y:y,
                        base:{
                            points:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90}], 
                        },
                        elements:[
                            {type:'connectionNode_audio', name:'audioOut', data: {
                                type: 1, x: -15, y: 5, width: 30, height: 30
                            }},
                            {type:'connectionNode_data', name:'gain', data:{
                                x: 12.5, y: -7.5, width: 15, height: 15,
                                receive: function(address,data){
                                    switch(address){
                                        case '%': obj.dial.continuous.gain.set(data); break;
                                        case '%t': 
                                            obj.__synthesizer.gain(data.target,data.time,data.curve);
                                            design.dial_continuous.gain.smoothSet(data.target,data.time,data.curve,false);
                                        break;
                                        default: break;
                                    }
                                }
                            }},
                            {type:'connectionNode_data', name:'attack', data:{
                                x: 52.5, y: -7.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != '%'){return;}
                                    design.dial_continuous.attack.set(data);
                                } 
                            }},
                            {type:'connectionNode_data', name:'release', data:{
                                x: 92.5, y: -7.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != '%'){return;}
                                    design.dial_continuous.release.set(data);
                                } 
                            }},
                            {type:'connectionNode_data', name:'detune', data:{
                                x: 132.5, y: -7.5, width: 15, height: 15,
                                receive: function(address,data){ 
                                    switch(address){
                                        case '%': design.dial_continuous.detune.set(data); break;
                                        case '%t': 
                                            obj.__synthesizer.detune((data.target*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min),data.time,data.curve);
                                            design.dial_continuous.detune.smoothSet(data.target,data.time,data.curve,false);
                                        break;
                                        default: break;
                                    }
                                }
                            }},
                            {type:'connectionNode_data', name:'octave', data:{
                                x: 170.5, y: -7.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != 'discrete'){return;}
                                    design.dial_discrete.octave.select(data);
                                } 
                            }},
                            {type:'connectionNode_data', name:'waveType', data:{
                                x: 210.5, y: -7.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != 'discrete'){return;}
                                    design.dial_discrete.waveType.select(data);
                                }
                            }},
                            {type:'connectionNode_data', name:'periodicWave', data:{
                                x: 232.5, y: 12.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != 'periodicWave'){return;}
                                    obj.__synthesizer.periodicWave(data);
                                }
                            }},
                            {type:'connectionNode_data', name:'midiNote', data:{
                                x: 217.5, y: 37.5, width: 30, height: 30, angle:Math.PI/4,
                                receive: function(address,data){
                                    if(address != 'midiNumber'){return;}
                                    obj.__synthesizer.perform(data);
                                }
                            }},
                            {type:'connectionNode_data', name:'gainWobblePeriod', data:{
                                x: 22.5, y: 82.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != '%'){return;}
                                    design.dial_continuous.gainWobblePeriod.set(data);
                                }
                            }},
                            {type:'connectionNode_data', name:'gainWobbleDepth', data:{
                                x: 57.5, y: 82.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != '%'){return;}
                                    design.dial_continuous.gainWobbleDepth.set(data);
                                }
                            }},
                            {type:'connectionNode_data', name:'detuneWobblePeriod', data:{
                                x: 107.5, y: 82.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != '%'){return;}
                                    design.dial_continuous.detuneWobblePeriod.set(data);
                                }
                            }},
                            {type:'connectionNode_data', name:'detuneWobbleDepth', data:{
                                x: 142.5, y: 82.5, width: 15, height: 15,
                                receive: function(address,data){
                                    if(address != '%'){return;}
                                    design.dial_continuous.detuneWobbleDepth.set(data);
                                }
                            }},
                
                
                            {type:'path', name:'backing', data:{
                                path:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90}],
                                style:style.background
                            }},
                            {type:'rect', name:'periodicWaveType', data:{
                                x: 230, y: 21.75, angle: 0,
                                width: 10, height: 2.5,
                                style:style.dial.slot,
                            }},
                            //gain dial
                                {type:'text', name:'gain_gain', data:{x: 11,   y: 43, text: 'gain', style: style.h1}},
                                {type:'text', name:'gain_0',    data:{x: 7,    y: 37, text: '0',    style: style.h2}},
                                {type:'text', name:'gain_1/2',  data:{x: 16.5, y: 7,  text: '1/2',  style: style.h2}},
                                {type:'text', name:'gain_1',    data:{x: 30,   y: 37, text: '1',    style: style.h2}},
                            //attack dial
                                {type:'text', name:'attack_gain', data:{x: 47,   y: 43, text: 'attack', style: style.h1}},
                                {type:'text', name:'attack_0',    data:{x: 47,   y: 37, text: '0',      style: style.h2}},
                                {type:'text', name:'attack_5',    data:{x: 58.5, y: 7,  text: '5',      style: style.h2}},
                                {type:'text', name:'attack_10',   data:{x: 70,   y: 37, text: '10',     style: style.h2}},
                            //release dial
                                {type:'text', name:'release_gain', data:{x: 85,   y: 43, text: 'release', style: style.h1}},
                                {type:'text', name:'release_0',    data:{x: 85,   y: 37, text: '0',       style: style.h2}},
                                {type:'text', name:'release_5',    data:{x: 98.5, y: 7,  text: '5',       style: style.h2}},
                                {type:'text', name:'release_10',   data:{x: 110,  y: 37, text: '10',      style: style.h2}},
                            //detune dial
                                {type:'text', name:'detune_gain', data:{x: 127,   y: 43, text: 'detune', style: style.h1}},
                                {type:'text', name:'detune_-100', data:{x: 122,   y: 37, text: '-100',   style: style.h2}},
                                {type:'text', name:'detune_0',    data:{x: 138.5, y: 7,  text: '0',      style: style.h2}},
                                {type:'text', name:'detune_100',  data:{x: 150,   y: 37, text: '100',    style: style.h2}},
                            //octave dial
                                {type:'text', name:'octave_gain', data:{x: 167,    y: 43, text: 'octave', style: style.h1}},
                                {type:'text', name:'octave_-3',   data:{x: 164,    y: 35, text: '-3',     style: style.h2}},
                                {type:'text', name:'octave_-2',   data:{x: 160,    y: 24, text: '-2',     style: style.h2}},
                                {type:'text', name:'octave_-1',   data:{x: 164,    y: 13, text: '-1',     style: style.h2}},
                                {type:'text', name:'octave_0',    data:{x: 178.75, y: 8,  text: '0',      style: style.h2}},
                                {type:'text', name:'octave_1',    data:{x: 190,    y: 13, text: '1',      style: style.h2}},
                                {type:'text', name:'octave_2',    data:{x: 195,    y: 24, text: '2',      style: style.h2}},
                                {type:'text', name:'octave_3',    data:{x: 190,    y: 35, text: '3',      style: style.h2}},
                            //waveType dial
                                {type:'text', name:'waveType_gain', data:{x: 211, y: 43, text: 'wave', style: style.h1}},
                                {type:'text', name:'waveType_sin',  data:{x: 202, y: 35, text: 'sin',  style: style.h2}},
                                {type:'text', name:'waveType_tri',  data:{x: 199, y: 21, text: 'tri',  style: style.h2}},
                                {type:'text', name:'waveType_squ',  data:{x: 210, y: 9,  text: 'squ',  style: style.h2}},
                                {type:'text', name:'waveType_saw',  data:{x: 227, y: 10, text: 'saw',  style: style.h2}},
                            //gainWobblePeriod dial
                                {type:'text', name:'gainWobble', data:{x: 13, y: 70, angle: -Math.PI/2,text: 'gain', style: style.h2}}, 
                                {type:'text', name:'gainWobblePeriod_gain', data:{x: 21,   y: 84,      text: 'rate', style: style.h1}},
                                {type:'text', name:'gainWobblePeriod_0',    data:{x: 16,   y: 77,      text: '0',    style: style.h2}},
                                {type:'text', name:'gainWobblePeriod_50',   data:{x: 27.5, y: 49,      text: '50',   style: style.h2}},
                                {type:'text', name:'gainWobblePeriod_100',  data:{x: 42,   y: 77,      text: '100',  style: style.h2}},
                            //gainWobbleDepth dial
                                {type:'text', name:'gainWobbleDepth_gain', data:{x: 54, y: 84, text: 'depth', style: style.h1}},
                                {type:'text', name:'gainWobbleDepth_0',    data:{x: 51, y: 77, text: '0',     style: style.h2}},
                                {type:'text', name:'gainWobbleDepth_50',   data:{x: 61, y: 49, text: '1/2',   style: style.h2}},
                                {type:'text', name:'gainWobbleDepth_100',  data:{x: 77, y: 77, text: '1',     style: style.h2}},
                            //detuneWobblePeriod dial
                                {type:'text', name:'detuneWobble', data:{x: 98, y: 70, angle: -Math.PI/2, text: 'detune', style: style.h2}},    
                                {type:'text', name:'detuneWobblePeriod_gain', data:{x: 105,   y: 84,      text: 'rate',   style: style.h1}},
                                {type:'text', name:'detuneWobblePeriod_0',    data:{x: 100,   y: 77,      text: '0',      style: style.h2}},
                                {type:'text', name:'detuneWobblePeriod_50',   data:{x: 111.5, y: 49,      text: '50',     style: style.h2}},
                                {type:'text', name:'detuneWobblePeriod_100',  data:{x: 126,   y: 77,      text: '100',    style: style.h2}},
                            //detuneWobbleDepth dial
                                {type:'text', name:'detuneWobbleDepth_gain', data:{x: 140,   y: 84, text: 'depth', style: style.h1}},
                                {type:'text', name:'detuneWobbleDepth_0',    data:{x: 135,   y: 77, text: '0',     style: style.h2}},
                                {type:'text', name:'detuneWobbleDepth_50',   data:{x: 145.5, y: 49, text: '1/2',   style: style.h2}},
                                {type:'text', name:'detuneWobbleDepth_100',  data:{x: 161,   y: 77, text: '1',     style: style.h2}},
                
                            {type:'button_rect', name:'panicButton', data: {
                                x:197.5, y: 47.5, width:20, height:20, angle: Math.PI/4,
                                style:{
                                    up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                                    down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                                }, 
                            }},   
                
                            {type:'dial_continuous',name:'gain',data:{
                                x: 20, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                onchange: function(value){ obj.__synthesizer.gain( value ); }
                            }},
                            {type:'dial_continuous',name:'attack',data:{
                                x: 60, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                onchange: function(value){ obj.__synthesizer.attack( value ); }
                            }},
                            {type:'dial_continuous',name:'release',data:{
                                x: 100, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                onchange: function(value){ obj.__synthesizer.release( value ); }
                            }},
                            {type:'dial_continuous',name:'detune',data:{
                                x: 140, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                onchange: function(value){ obj.__synthesizer.detune( value*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min ); }
                            }},
                            {type:'dial_discrete',name:'octave',data:{
                                x: 180, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, optionCount: 7,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                                onchange: function(value){ obj.__synthesizer.octave(value-3); }
                            }},
                            {type:'dial_discrete',name:'waveType',data:{
                                x: 220, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: (5*Math.PI)/4,  optionCount: 5,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                                onchange: function(value){ obj.__synthesizer.waveType(['sine','triangle','square','sawtooth','custom'][value]); }
                            }},
                            {type:'dial_continuous',name:'gainWobblePeriod',data:{
                                x: 30, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                onchange: function(value){ obj.__synthesizer.gainWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
                            }},
                            {type:'dial_continuous',name:'gainWobbleDepth',data:{
                                x: 65, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                onchange: function(value){ obj.__synthesizer.gainWobbleDepth(value); },
                            }},
                            {type:'dial_continuous',name:'detuneWobblePeriod',data:{
                                x: 114, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                onchange: function(value){ obj.__synthesizer.detuneWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
                            }},
                            {type:'dial_continuous',name:'detuneWobbleDepth',data:{
                                x: 149, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                onchange: function(value){ obj.__synthesizer.detuneWobbleDepth(value*100); }
                            }},
                        ]
                    };
                
                    //main object
                        var obj = __globals.utility.experimental.objectBuilder(objects.basicSynthesizer,design);
                
                    //circuitry
                        obj.__synthesizer = new parts.audio.synthesizer2(__globals.audio.context);
                        obj.__synthesizer.out().connect( design.connectionNode_audio.audioOut.in() );
                
                    //setup
                        design.dial_continuous.gain.set(0.5);
                        design.dial_continuous.detune.set(0.5);
                        design.dial_discrete.octave.select(3);
                
                    return obj;
                };
                this.testObject = function(x,y,debug=false){
                    var style = {
                        background: 'fill:rgba(255,100,255,0.75); stroke:none;',
                        h1: 'fill:rgba(0,0,0,1); font-size:14px; font-family:Courier New;',
                        text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',
                
                        markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                
                        handle: 'fill:rgba(200,200,200,1)',
                        backing: 'fill:rgba(150,150,150,1)',
                        slot: 'fill:rgba(50,50,50,1)',
                        needle: 'fill:rgba(250,150,150,1)',
                
                        glow:'fill:rgba(240,240,240,1)',
                        dim:'fill:rgba(80,80,80,1)',
                
                        level:{
                            backing: 'fill:rgb(10,10,10)', 
                            levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)'],
                            marking:'fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
                        },
                
                        grapher:{
                            middleground:'stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;', 
                            background:'stroke:rgba(0,100,0,1); stroke-width:0.25;',
                            backgroundText:'fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
                            backing:'fill:rgba(50,50,50,1)'
                        },
                    };
                    var design = {
                        type: 'testObject2',
                        x: x, y: y,
                        base: {
                            points:[{x:0,y:0},{x:335,y:0},{x:335,y:285},{x:0,y:285}], 
                            style:style.background
                        },
                        elements:[
                            {type:'slide_vertical',name:'slide_vertical',data:{
                                x:5, y:40, width: 10, height: 120, 
                                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                                onchange:function(data){design.connectionNode_data.externalData_1.send('slide_vertical',data);}, 
                                onrelease:function(){console.log('slide_vertical onrelease');}
                            }},
                            {type:'slide_horizontal',name:'slide_horizontal',data:{
                                x:5, y:165, width: 115, height: 10, 
                                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                                onchange:function(data){design.connectionNode_data.externalData_1.send('slide_horizontal',data);}, 
                                onrelease:function(){console.log('slide_horizontal onrelease');}
                            }},
                            {type:'slidePanel_vertical',name:'slidePanel_vertical',data:{
                                x:20, y:40, width: 100, height: 120, count: 10, 
                                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                                onchange:function(){/*console.log('slidePanel_vertical onchange');*/}, 
                                onrelease:function(){/*console.log('slidePanel_vertical onrelease');*/}
                            }},
                            {type:'slidePanel_horizontal',name:'slidePanel_horizontal',data:{
                                x:5, y:180, width: 115, height: 100, count: 10,
                                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                                onchange:function(){/*console.log('slide_horizontalPanel onchange');*/}, 
                                onrelease:function(){/*console.log('slide_horizontalPanel onrelease');*/}
                            }},
                            {type:'dial_continuous',name:'dial_continuous',data:{
                                x: 70, y: 22.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, 
                                style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.markings},
                                onchange:function(){console.log('dial_continuous onchange');},
                                onrelease:function(){console.log('dial_continuous onrelease');}
                            }},
                            {type:'dial_discrete',name:'dial_discrete',data:{
                                x: 105, y: 22.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, optionCount: 8,
                                style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.markings}, 
                                onchange:function(){console.log('dial_discrete onchange');},
                                onrelease:function(){console.log('dial_discrete onrelease');}
                            }},
                            {type:'button_rect',name:'button_rect',data:{
                                x:220, y: 5, width:20, height:20, 
                                style:{
                                    up:'fill:rgba(200,200,200,1)', hover:'fill:rgba(220,220,220,1)', 
                                    down:'fill:rgba(180,180,180,1)', glow:'fill:rgba(220,200,220,1)'
                                }, 
                                onclick:function(){design.connectionNode_data.externalData_1.send('button_rect');}
                            }},
                            {type:'checkbox_rect', name:'checkbox_rect', data:{
                                x:245, y: 5, width:20, height:20, angle:0, 
                                style:{
                                    check:'fill:rgba(150,150,150,1)', backing:'fill:rgba(200,200,200,1)', 
                                    checkGlow:'fill:rgba(220,220,220,1)', backingGlow:'fill:rgba(220,220,220,1)'
                                }, 
                                onchange:function(){design.connectionNode_data.externalData_1.send('checkbox_rect', design.checkbox.checkbox_rect.get());}
                            }},
                            {type:'key_rect', name:'key_rect', data:{
                                x:270, y:5, width:20, height:20, angle:0, 
                                style:{
                                    off:'fill:rgba(200,200,200,1)', press:'fill:rgba(180,180,180,1)', 
                                    glow:'fill:rgba(220,200,220,1)', pressAndGlow:'fill:rgba(200,190,200,1)'
                                }, 
                                onkeydown:function(){design.connectionNode_data.externalData_1.send('key_rect',true);}, 
                                onkeyup:function(){design.connectionNode_data.externalData_1.send('key_rect',false);}
                            }},
                            {type:'rastorgrid', name:'rastorgrid', data:{
                                x:230, y:135, width:100, height:100, xCount:4, yCount:4, 
                                style:{
                                    backing:'fill:rgba(200,200,200,1)', check:'fill:rgba(150,150,150,1)',
                                    backingGlow:'fill:rgba(220,220,220,1)', checkGlow:'fill:rgba(220,220,220,1)'
                                }, 
                                onchange:function(){design.connectionNode_data.externalData_1.send('rastorgrid', design.rastorgrid.rastorgrid.get());}
                            }},
                            {type:'glowbox', name:'globox', data:{
                                x:120, y:5, width: 10, height:10, angle:0, 
                                style:{glow:'fill:rgba(240,240,240,1)', dim:'fill:rgba(80,80,80,1)'}
                            }},
                            {type:'label', name:'label', data:{
                                x:125, y:20, text:'_mainObject', style:style.h1, angle:0
                            }},
                            {type:'level', name:'level', data:{
                                x: 125, y:240, angle:0, width: 10, height:40, 
                                style:{backing: 'fill:rgb(10,10,10)', levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)']}
                            }},
                            {type:'meter_level', name:'meter_level', data:{
                                x: 137.5, y:240, angle:0, width: 10, height:40, markings:[0.125,0.25,0.375,0.5,0.625,0.75,0.875],
                                style:{backing:style.backing, levels:style.levels, markings:style.markings},
                                }},
                            {type:'audio_meter_level', name:'audio_meter_level', data:{
                                x: 150, y:240, angle:0, width: 10, height:40, markings:[0.125,0.25,0.375,0.5,0.625,0.75,0.875], 
                                style:{backing:style.backing, levels:style.levels, markings:style.markings},
                            }},
                            {type:'sevenSegmentDisplay', name:'sevenSegmentDisplay', data:{
                                x: 162.5, y: 240, angle:0, width:10, height:20, 
                                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                            }},
                            {type:'sixteenSegmentDisplay', name:'sixteenSegmentDisplay', data:{
                                x: 175, y: 240, angle:0, width:10, height:20, 
                                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                            }},
                            {type:'readout_sixteenSegmentDisplay', name:'readout_sixteenSegmentDisplay', data:{
                                x: 187.5, y: 240, angle:0, width:100, height:20, count:10, 
                                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                            }},
                            {type:'rastorDisplay', name:'rastorDisplay', data:{
                                x: 162.5, y: 262.5, angle:0, width:20, height:20, xCount:8, yCount:8, xGappage:0.1, yGappage:0.1
                            }},
                            {type:'grapher', name:'grapher', data:{
                                x:125, y:30, width:100, height:100,
                                style:{
                                    middleground:style.grapher.middleground, background:style.grapher.background, 
                                    backgroundText:style.grapher.backgroundText, backing:style.grapher.backing
                                }
                            }},
                            {type:'grapher_periodicWave', name:'grapher_periodicWave', data:{
                                x:125, y:135, width:100, height:100,
                                style:{
                                    middleground:style.grapher.middleground, background:style.grapher.background, 
                                    backgroundText:style.grapher.backgroundText, backing:style.grapher.backing
                                }
                            }},
                            {type:'connectionNode_audio', name:'internalAudio_1', data: {
                                type: 1, x: 230, y: 65, width: 30, height: 30
                            }},
                            {type:'connectionNode_audio', name:'internalAudio_2', data:{
                                type: 0, x: 300, y: 65, width: 30, height: 30
                            }},
                            {type:'connectionNode_data', name:'internalData_1', data:{
                                x: 230, y: 30, width: 30, height: 30
                            }},
                            {type:'connectionNode_data', name:'internalData_2', data:{
                                x: 300, y: 30, width: 30, height: 30
                            }},
                            {type:'connectionNode_data', name:'externalData_1', data:{
                                x: 230, y: 100, width: 30, height: 30, 
                                receive:function(address, data){
                                    switch(address){
                                        case 'slide_vertical':        design.slide_vertical.slide_vertical.set(data,true,false);               break;
                                        case 'slide_horizontal':      design.slide_horizontal.slide_horizontal.set(data,true,false);           break;
                                        case 'slidePanel_vertical':   design.slidePanel_vertical.slidePanel_vertical.set(data,true,false);     break;
                                        case 'slide_horizontalPanel': design.slidePanel_horizontal.slidePanel_horizontal.set(data,true,false); break;
                                        case 'dial_continuous':       design.dial_continuous.dial_continuous.set(data,true,false);             break;
                                        case 'dial_discrete':         design.dial_discrete.dial_discrete.select(data,true,false);              break;
                                        case 'button_rect': 
                                            design.grapher_periodicWave.grapher_periodicWave.reset(); 
                                            design.dial_continuous.dial_continuous.smoothSet(1,1,'s',false); 
                                            design.slide_vertical.slide_vertical.smoothSet(1,1,'linear',false); 
                                            design.slidePanel_horizontal.slidePanel_horizontal.smoothSet(1,1,'sin',false); 
                                            design.slidePanel_vertical.slidePanel_vertical.smoothSetAll(1,1,'cos',false); 
                                            design.slidePanel_horizontal.slidePanel_horizontal.smoothSetAll(1,1,'exponential',false);
                                        break;
                                        case 'checkbox_rect': design.checkbox_rect.checkbox_rect.set(data,false); break;
                                        case 'key_rect': 
                                            if(data){
                                                design.key_rect.key_rect.glow();design.glowbox.glowbox.on();
                                            }else{
                                                design.key_rect.key_rect.dim();design.glowbox.glowbox.off();
                                            }
                                        break;
                                        case 'rastorgrid': design.rastorgrid.rastorgrid.set(data,false); break;
                                    }
                                }, 
                            }},
                        ]
                    };
                 
                    //main object
                        var obj = __globals.utility.experimental.objectBuilder(objects.testObject,design);
                
                    //setup
                        setTimeout(function(){
                            for(var a = 0; a < 10; a++){ design.slidePanel_vertical.slidePanel_vertical.slide(a).set( 1-1/(a+1)  ); }
                            for(var a = 0; a < 10; a++){ design.slidePanel_horizontal.slidePanel_horizontal.slide(a).set( 1-1/(a+1)  ); }
                
                            setInterval(function(){
                                design.sevenSegmentDisplay.sevenSegmentDisplay.enterCharacter( ''+Math.round(Math.random()*9) ); 
                                design.sixteenSegmentDisplay.sixteenSegmentDisplay.enterCharacter(
                                    '0123456789abcdefghijklmnopqrstuvwxyz'.split('')[Math.round(Math.random()*35)]
                                ); 
                            },500);
                            design.readout_sixteenSegmentDisplay.readout_sixteenSegmentDisplay.test();
                            design.rastorDisplay.rastorDisplay.test();
                
                            design.grapher.grapher._test();
                
                            design.grapher_periodicWave.grapher_periodicWave.waveElement('sin',1,1);
                            design.grapher_periodicWave.grapher_periodicWave.draw();
                
                            design.level.level.set(0.5,0);
                            design.level.level.set(0.75,1);
                
                            setInterval(function(){ design.meter_level.meter_level.set( Math.random() ); },1000);
                
                            design.connectionNode_audio.internalAudio_1.connectTo(design.connectionNode_audio.internalAudio_2);
                            design.connectionNode_data.internalData_1.connectTo(design.connectionNode_data.internalData_2);
                        },1);
                
                    return obj;
                }
            };
            __globals.audio.context.resume().then(function(){
                __globals.panes.menu.innerHTML = '';
                clearTimeout(timeout);
            },function(){
                console.warn('I\'m not sure what to do now..I guess we just sit here in silence');
            });
            
            
            var timeout = setTimeout(function(){
                var viewportDimensions = __globals.utility.workspace.getViewportDimensions();
            
                //blocking screen
                    __globals.panes.menu.append(parts.basic.rect(null, 0, 0, viewportDimensions.width, viewportDimensions.height, 0, 'fill:rgba(255,255,255,0.9)'));
                //explanation text
                    var text = __globals.utility.experimental.elementMaker('text','explanation',{
                        x:10, y:30, 
                        text:'because of the \'no autoplay\' feature in browsers; this site needs you to allow it to produce sound',
                        style:'fill:rgba(0,0,0,1); font-size:15px; font-family:Courier New; pointer-events:none;'
                    });
                    __globals.panes.menu.append(text);
                    var textDimensions = text.getBBox();
                    __globals.utility.element.setTransform(text, {
                        x:(viewportDimensions.width-textDimensions.width)/2,
                        y:((viewportDimensions.height-textDimensions.height)/2)-30,
                        s:1, r:0
                    });
                //activation button
                    __globals.panes.menu.append(__globals.utility.experimental.elementMaker('button_rect','audioOn',{
                        x:(viewportDimensions.width-100)/2, y:(viewportDimensions.height-50)/2,
                        width:100, height:50,
                        onclick:function(){
                            __globals.audio.context.resume();
                            __globals.panes.menu.innerHTML = '';
                        }
                    }));
                //button text
                    __globals.panes.menu.append(__globals.utility.experimental.elementMaker('text','explanation',{
                        x:(viewportDimensions.width/2)-22.5, y:(viewportDimensions.height/2)+5, 
                        text:'allow',
                        style:'fill:rgba(0,0,0,1); font-size:15px; font-family:Courier New; pointer-events:none;'
                    }));
            },1);
            
            parts.audio.audioFilePlayer = function(
                context,
            ){
                var values = {
                    itself:this,
                    currentTrack:0,
                    loopActive:false,
                    loopBounds:{start:0,end:1},
                    startedAt:-1,
                    needlePosition:0.0,
                    loaded:false,
                    playing:false,
                };
            
                //flow chain
                    var flow = {
                        track:{},
                        bufferSource:null,
                        channelSplitter:{},
                        leftOut:{}, rightOut:{}
                    };
            
            
                //channelSplitter
                    flow.channelSplitter = context.createChannelSplitter(2);
            
                //leftOut
                    flow.leftOut.gain = 1;
                    flow.leftOut.node = context.createGain();
                    flow.leftOut.node.gain.setTargetAtTime(flow.leftOut.gain, context.currentTime, 0);
                    flow.channelSplitter.connect(flow.leftOut.node, 0);
                //rightOut
                    flow.rightOut.gain = 1;
                    flow.rightOut.node = context.createGain();
                    flow.rightOut.node.gain.setTargetAtTime(flow.rightOut.gain, context.currentTime, 0);
                    flow.channelSplitter.connect(flow.rightOut.node, 1);
            
                //output node
                    this.out_left  = function(){return flow.leftOut.node;}
                    this.out_right = function(){return flow.rightOut.node;}
            
                    function loadBuffer(data){
                        flow.bufferSource = context.createBufferSource();
                        flow.bufferSource.buffer = data;
                        flow.bufferSource.connect(flow.channelSplitter);
                        flow.bufferSource.onended = function(a){values.itself.pause();};
                    }
                    function reset(){
                        values.needlePosition = 0;
                        values.playing = false;
                    }
            
                //controls
                    this.load_url = function(url, callback){
                        values.loaded = false;
                        var request = new XMLHttpRequest();
                            request.open('GET', url, true);
                            request.responseType = 'arraybuffer';
                            request.onload = function(){
                                values.itself.stop();
                                context.decodeAudioData(this.response, function(data){
                                    flow.track = {
                                        buffer:data,
                                        name:(url.split('/')).pop(),
                                        duration:buffer.duration,
                                    };
                                    values.loaded = true;
                                    reset();
                                    if(callback){callback({name:url});}
                                }, function(e){console.warn("Error with decoding audio data" + e.err);});
                            }
                            request.send();
                    };
                    this.load_file = function(callback){
                        values.loaded = false;
                        var inputObject = document.createElement('input');
                        inputObject.type = 'file';
                        inputObject.onchange = function(){
                            var file = this.files[0];
                            var fileReader = new FileReader();
                            fileReader.readAsArrayBuffer(file);
                            fileReader.onload = function(data){
                                values.itself.stop();
                                __globals.audio.context.decodeAudioData(data.target.result, function(buffer){
                                    var source = __globals.audio.context.createBufferSource();
                                    flow.track = {
                                        buffer:buffer,
                                        name:file.name,
                                        duration:buffer.duration,
                                    };
                                    values.loaded = true;
                                    reset();
                                    if(callback){callback(file);}
                                });
                            }
                            this.parentElement.removeChild(this);
                        };
                        document.body.appendChild(inputObject);
                        inputObject.click();
                    };
            
                    this.loopActive = function(bool=false){
                        values.loopActive = bool;
                        flow.bufferSource.loop = values.loopActive;
                    };
                    this.loopBounds = function(data={start:0,end:1}){
                        if(data==null||data==undefined){return data;}
                        if(data.start!=null && data.start!=undefined){values.loopBounds.start=data.start}
                        if(data.end!=null && data.end!=undefined){values.loopBounds.end=data.end}
                        flow.bufferSource.loopStart = values.loopBounds.start;
                        flow.bufferSource.loopEnd = values.loopBounds.end;
                    };
            
                    this.play = function(){
                        if(values.startedAt!=-1 || !values.loaded){return;}
                        loadBuffer(flow.track.buffer);
                        flow.bufferSource.start(0,values.needlePosition);
            
                        flow.bufferSource.loop = values.loopActive;
                        flow.bufferSource.loopStart = values.loopBounds.start;
                        flow.bufferSource.loopEnd = values.loopBounds.end;
            
                        values.startedAt = context.currentTime-values.needlePosition;
                        values.playing = true;
                    };
                    this.pause = function(callback){
                        if(values.startedAt==-1){return;}
                        flow.bufferSource.stop(0);
                        if(callback){flow.bufferSource.onended = function(){callback();};}
                        flow.bufferSource = undefined;
                        values.needlePosition = context.currentTime-values.startedAt;
                        values.startedAt = -1;
                        values.playing = false;
                    };
                    this.stop = function(){
                        this.pause();
                        values.needlePosition = 0;
                    };
                    this.jumpTo_time = function(seconds){
                        if(values.startedAt==-1){
                            values.needlePosition = seconds;
                            return;
                        }
            
                        var callback = function(){ values.needlePosition = seconds; };
                        if(values.playing){
                            callback = function(){
                                values.needlePosition = seconds;
                                values.itself.play();
                            };
                        }
            
                        this.pause(callback);
                    };
                    this.jumpTo_percentage = function(percent){
                        percent = (percent>1 ? 1 : percent);
                        percent = (percent<0 ? 0 : percent);
                        this.jumpTo_time(this.duration()*percent);
                    };
            
                    this.duration = function(){
                        if(!values.loaded){return -1;}
                        return flow.track.duration;
                    };
                    this.getCurrentTime = function(){
                        if(!values.loaded){return -1;}
                        if(values.startedAt == -1){ return values.needlePosition; }
                        return context.currentTime-values.startedAt;
                    };
                    this.title = function(){
                        return flow.track.name;
                    };
                    this.viewWaveformSegment = function(track,start=0,end=1){
                        return [0,1,-1,0];
                    };
            };
            objects.testAudioObject = function(x,y,debug=false){
                var style = {
                    background:'fill:rgba(200,200,200,1)',
                };
                var design = {
                    type: 'testAudioObject',
                    x: x, y: y,
                    base: {
                        points:[{x:0,y:0},{x:220,y:0},{x:220,y:52.5},{x:0,y:52.5}], 
                        style:style.background
                    },
                    elements:[
                        {type:'connectionNode_audio', name:'outRight', data: {
                            type: 1, x: -10, y: 5, width: 10, height: 20
                        }},
                        {type:'connectionNode_audio', name:'outLeft', data: {
                            type: 1, x: -10, y: 27.5, width: 10, height: 20
                        }},
                        {type:'readout_sixteenSegmentDisplay', name:'trackNameReadout', data:{
                            x: 30, y: 5, angle:0, width:100, height:20, count:10, 
                            style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                        }},
                        {type:'readout_sixteenSegmentDisplay', name:'time', data:{
                            x: 135, y: 5, angle:0, width:80, height:20, count:8, 
                            style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                        }},
            
                        {type:'slide_horizontal',name:'scrubber',data:{
                            x:45, y:30, width: 170, height: 20,
                            style:{handle:'fill:rgb(220,220,220);'}, 
                            onchange:function(data){}, 
                            onrelease:function(data){
                                obj.__audioFilePlayer.jumpTo_percentage(data);
                            }
                        }},
            
                        {type:'button_rect',name:'play',data:{
                            x:5, y: 30, width:10, height:20, 
                            style:{
                                up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', 
                                down:'fill:rgba(150,170,150,1)', glow:'fill:rgba(220,220,220,1)'
                            }, 
                            onclick:function(){obj.__audioFilePlayer.play();}
                        }},
                        {type:'button_rect',name:'pause',data:{
                            x:17.5, y: 30, width:10, height:20, 
                            style:{
                                up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                                down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                            }, 
                            onclick:function(){obj.__audioFilePlayer.pause();}
                        }},
                        {type:'button_rect',name:'stop',data:{
                            x:30, y: 30, width:10, height:20, 
                            style:{
                                up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', 
                                down:'fill:rgba(170,150,150,1)', glow:'fill:rgba(240,200,220,1)'
                            }, 
                            onclick:function(){obj.__audioFilePlayer.stop();}
                        }},
                        {type:'button_rect', name:'loadFile', data: {
                            x:5, y: 5, width:20, height:20,
                            style:{
                                up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                                down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                            },
                            onclick: function(){
                                obj.__audioFilePlayer.load_file(function(data){
                                    design.readout_sixteenSegmentDisplay.trackNameReadout.text(obj.__audioFilePlayer.title());
                                    design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');
                                });
                            }
                        }},   
            
            
                    ]
                };
            
                //main object
                    var obj = __globals.utility.experimental.objectBuilder(objects.testAudioObject,design);
            
                //circuitry
                    obj.__audioFilePlayer = new parts.audio.audioFilePlayer(__globals.audio.context);
                    obj.__audioFilePlayer.out_right().connect( design.connectionNode_audio.outRight.in() );
                    obj.__audioFilePlayer.out_left().connect( design.connectionNode_audio.outLeft.in() );
                    setInterval(function(){
                        //check if there's a track at all
                            if( -1==obj.__audioFilePlayer.getCurrentTime() ){return;}
            
                        //time readout
                            var time = __globals.utility.math.seconds2time( Math.round(obj.__audioFilePlayer.getCurrentTime()));
            
                            design.readout_sixteenSegmentDisplay.time.text(
                                __globals.utility.math.padString(time.h,2,'0')+':'+
                                __globals.utility.math.padString(time.m,2,'0')+':'+
                                __globals.utility.math.padString(time.s,2,'0')
                            );
                            design.readout_sixteenSegmentDisplay.time.print();
            
                        //scrubber
                            var progress = obj.__audioFilePlayer.getCurrentTime()/obj.__audioFilePlayer.duration();
                            if( !isNaN(progress) ){
                                design.slide_horizontal.scrubber.set(progress,true);
                            }
                    },100);
            
                //setup
                    design.readout_sixteenSegmentDisplay.trackNameReadout.text('    --');
                    design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');
            
                return obj;
            };
            /**/
            
            
            
            //create objects
                var audioScope_1 = objects.audio_scope(50,10);
                __globals.panes.middleground.append( audioScope_1 );
                var audioScope_2 = objects.audio_scope(50,130);
                __globals.panes.middleground.append( audioScope_2 );
            
                var audioDuplicator_1 = objects.audio_duplicator(300,30);
                __globals.panes.middleground.append( audioDuplicator_1 );
                var audioDuplicator_2 = objects.audio_duplicator(300,130);
                __globals.panes.middleground.append( audioDuplicator_2 );
            
                var testAudioObject_1 = objects.testAudioObject(400,50);
                __globals.panes.middleground.append( testAudioObject_1 );
            
                var audioSink_1 = objects.audio_sink(150, 275);
                __globals.panes.middleground.append( audioSink_1 );
            
            //do connections
                testAudioObject_1.io.outRight.connectTo( audioDuplicator_1.io.input );
                testAudioObject_1.io.outLeft.connectTo( audioDuplicator_2.io.input );
            
                audioDuplicator_1.io.output_1.connectTo( audioScope_1.io.input );
                audioDuplicator_2.io.output_1.connectTo( audioScope_2.io.input );;
            
                audioDuplicator_1.io.output_2.connectTo( audioSink_1.io.right );
                audioDuplicator_2.io.output_2.connectTo( audioSink_1.io.left );
            
            //viewport position
                __globals.utility.workspace.gotoPosition(-301.538, 23.8348, 2.24189, 0);


        }
    }
// })();
