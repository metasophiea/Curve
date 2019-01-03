var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var workspace = __canvasElements[__canvasElements_count];
        workspace.library = new function(){};
        workspace.library.math = new function(){
            this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
            this.distanceBetweenTwoPoints = function(a, b){ return Math.pow(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2),0.5) };
            this.seconds2time = function(seconds){
                var result = {h:0, m:0, s:0};
                
                result.h = Math.floor(seconds/3600);
                seconds = seconds - result.h*3600;
            
                result.m = Math.floor(seconds/60);
                seconds = seconds - result.m*60;
            
                result.s = seconds;
            
                return result;
            };
            this.largestValueFound = function(array){
                return array.reduce(function(max,current){
                    return Math.abs(max) > Math.abs(current) ? max : current;
                });
            };
            this.smallestValueFound = function(array){
                return array.reduce(function(min,current){
                    return Math.abs(min) < Math.abs(current) ? min : current;
                });
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
            this.polar2cartesian = function(angle,distance){
                return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
            };
            this.cartesianAngleAdjust = function(x,y,angle){
                var polar = this.cartesian2polar( x, y );
                polar.ang += angle;
                return this.polar2cartesian( polar.ang, polar.dis );
            };
            this.boundingBoxFromPoints = function(points){
                if(points.length == 0){
                    return { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
                }
            
                var left = points[0].x; var right = points[0].x;
                var top = points[0].y;  var bottom = points[0].y;
            
                for(var a = 1; a < points.length; a++){
                    if( points[a].x < left ){ left = points[a].x; }
                    else if(points[a].x > right){ right = points[a].x; }
            
                    if( points[a].y < top ){ top = points[a].y; }
                    else if(points[a].y > bottom){ bottom = points[a].y; }
                }
            
                return {
                    topLeft:{x:left,y:top},
                    bottomRight:{x:right,y:bottom}
                };
            };
            this.pointsOfRect = function(x,y,width,height,angle=0,anchor={x:0,y:0}){
                var corners = {};
                var offsetX = anchor.x*width;
                var offsetY = anchor.y*height;
            
                var polar = this.cartesian2polar( offsetX, offsetY );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.tl = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX-width, offsetY );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.tr = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX-width, offsetY-height );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.br = { x:(x - point.x), y:(y - point.y) };
            
                var polar = this.cartesian2polar( offsetX, offsetY-height );
                var point = this.polar2cartesian( polar.ang-angle, polar.dis );
                corners.bl = { x:(x - point.x), y:(y - point.y) };
            
                return [
                    corners.tl,
                    corners.tr, 
                    corners.br, 
                    corners.bl, 
                ];
            };
            this.pointsOfCircle = function(x,y,r,pointCount=3){
                var output = [];
                for(var a = 0; a < pointCount; a++){
                    output.push({
                        x: x + r*Math.sin(2*Math.PI*(a/pointCount)),
                        y: y + r*Math.cos(2*Math.PI*(a/pointCount)),
                    });
                }
                return output;
            };
            this.pointsOfText = function(text, x, y, angle, size, font, alignment, baseline){
                //requires that the font size be in 'pt'
            
                //determine text width
                    var width = 0;
                    var cnv = document.createElement('canvas');
                    var context = cnv.getContext('2d');
            
                    context.font = font;
                    context.textAlign = alignment;
                    context.textBaseline = baseline;
            
                    var d = context.measureText(text);
                    width = d.width/size;
            
                //determine text height
                    var height = -font.split('pt')[0].split(' ').pop();
                    if(isNaN(height)){ height = -7.5; }
                    height = height/size;
            
                //generate points
                    var points = [{x:x, y:y}, {x:x+width, y:y}, {x:x+width, y:y-height}, {x:x, y:y-height}];
            
                //adjust for alignment and baseline
                    var leftPush = { start:0, end:0, center:width/2, left:width, right:width };
                    var downPush = { alphabetic:height, top:0, hanging:0, middle:height/2, ideographic:0, bottom:height };
                    for(var a = 0; a < points.length; a++){
                        points[a] = { x:points[a].x-leftPush[alignment], y:points[a].y+downPush[baseline] };
                    }
                
                //adjust for angle
                    for(var a = 0; a < points.length; a++){
                        points[a] = this.cartesianAngleAdjust(points[a].x-x,points[a].y-y,angle);
                        points[a].x += x;
                        points[a].y += y;
                    }
            
                return points;
            };
            this.relativeDistance = function(realLength, start,end, d, allowOverflow=false){
                var mux = (d - start)/(end - start);
                if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
                return mux*realLength;
            };
            this.lineCorrecter = function(points, maxheight, maxwidth){
                //this function detects line points that would exceed the view area, then replaces them with clipped points
                //(only corrects points that exceed the y limits. Those that exceed the X limits are simply dropped)
            
                if( points.x1 < 0 || points.x2 < 0 ){ return; }
                if( points.x1 > maxwidth || points.x2 > maxwidth ){ return; }
            
                if( points.y1 < 0 && points.y2 < 0 ){ return; }
                if( points.y1 > maxheight && points.y2 > maxheight ){ return; }
            
                var slope = (points.y2 - points.y1)/(points.x2 - points.x1);
            
                if( points.y1 < 0 ){ points.x1 = (0 - points.y1 + slope*points.x1)/slope; points.y1 = 0; }
                else if( points.y2 < 0 ){ points.x2 = (0 - points.y2 + slope*points.x2)/slope; points.y2 = 0; }
                if( points.y1 > maxheight ){ points.x1 = (maxheight - points.y1 + slope*points.x1)/slope; points.y1 = maxheight; }
                else if( points.y2 > maxheight ){ points.x2 = (maxheight - points.y2 + slope*points.x2)/slope; points.y2 = maxheight; }
            
                return points;
            };
            this.normalizeStretchArray = function(array){
                //discover the largest number
                    var biggestIndex = array.reduce( function(oldIndex, currentValue, index, array){ return currentValue > array[oldIndex] ? index : oldIndex; }, 0);
            
                //devide everything by this largest number, making everything a ratio of this value 
                    var dux = Math.abs(array[biggestIndex]);
                    array = array.map(x => x / dux);
            
                //stretch the other side of the array to meet 0 or 1
                    if(array[0] == 0 && array[array.length-1] == 1){return array;}
                    var pertinentValue = array[0] != 0 ? array[0] : array[array.length-1];
                    array = array.map(x => (x-pertinentValue)/(1-pertinentValue) );
            
                return array;
            };
            this.curvePoint = new function(){
                this.linear = function(x=0.5, start=0, end=1){
                    return x *(end-start)+start;
                };
                this.sin = function(x=0.5, start=0, end=1){
                    return Math.sin(Math.PI/2*x) *(end-start)+start;
                };
                this.cos = function(x=0.5, start=0, end=1){
                    return (1-Math.cos(Math.PI/2*x)) *(end-start)+start;
                };
                this.s = function(x=0.5, start=0, end=1, sharpness=8){
                    var temp = workspace.library.math.normalizeStretchArray([
                        1/( 1 + Math.exp(-sharpness*(0-0.5)) ),
                        1/( 1 + Math.exp(-sharpness*(x-0.5)) ),
                        1/( 1 + Math.exp(-sharpness*(1-0.5)) ),
                    ]);
                    return temp[1] *(end-start)+start;
                };
                this.exponential = function(x=0.5, start=0, end=1, sharpness=2){
                    var temp = workspace.library.math.normalizeStretchArray([
                        (Math.exp(sharpness*0)-1)/(Math.E-1),
                        (Math.exp(sharpness*x)-1)/(Math.E-1),
                        (Math.exp(sharpness*1)-1)/(Math.E-1),
                    ]);
                    return temp[1] *(end-start)+start;
                };
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
                    if(sharpness == 0){sharpness = 1/1000000;}
            
                    var curve = [];
                    for(var a = 0; a < stepCount; a++){
                        curve.push(
                            1/( 1 + Math.exp(-sharpness*((a/stepCount)-0.5)) )
                        );
                    }
            
                    var outputArray = workspace.library.math.normalizeStretchArray(curve);
            
                    var mux = end-start;
                    for(var a = 0 ; a < outputArray.length; a++){
                        outputArray[a] = outputArray[a]*mux + start;
                    }
            
                    return outputArray;
                };
                this.exponential = function(stepCount=2, start=0, end=1, sharpness=2){
                    var stepCount = stepCount-1;
                    var outputArray = [];
                    
                    for(var a = 0; a <= stepCount; a++){
                        outputArray.push( (Math.exp(sharpness*(a/stepCount))-1)/(Math.E-1) ); // Math.E == Math.exp(1)
                    }
            
                    outputArray = system.utility.math.normalizeStretchArray(outputArray);
            
                    var mux = end-start;
                    for(var a = 0 ; a < outputArray.length; a++){
                        outputArray[a] = outputArray[a]*mux + start;
                    }
            
                    return outputArray;
                };
            };
            this.detectOverlap = new function(){
                this.boundingBoxes = function(a, b){
                    return !(
                        (a.bottomRight.y < b.topLeft.y) ||
                        (a.topLeft.y > b.bottomRight.y) ||
                        (a.bottomRight.x < b.topLeft.x) ||
                        (a.topLeft.x > b.bottomRight.x)   
                );};
                this.pointWithinBoundingBox = function(point,box){
                    return !(
                        point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
                        point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
                    );
                };
                this.pointWithinPoly = function(point,points){
                    var inside = false;
                    for(var a = 0, b = points.length - 1; a < points.length; b = a++) {
                        if(
                            ((points[a].y > point.y) != (points[b].y > point.y)) && 
                            (point.x < ((((points[b].x-points[a].x)*(point.y-points[a].y)) / (points[b].y-points[a].y)) + points[a].x))
                        ){inside = !inside;}
                    }
                    return inside;
                };
                this.lineSegments = function(segment1, segment2){
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
                this.overlappingPolygons = function(points_a,points_b){
                    //a point from A is in B
                        for(var a = 0; a < points_a.length; a++){
                            if(this.pointWithinPoly(points_a[a],points_b)){ return true; }
                        }
            
                    //a point from B is in A
                        for(var a = 0; a < points_b.length; a++){
                            if(this.pointWithinPoly(points_b[a],points_a)){ return true; }
                        }
            
                    //side intersection
                        var a_indexing = Array.apply(null, {length: points_a.length}).map(Number.call, Number).concat([0]);
                        var b_indexing = Array.apply(null, {length: points_b.length}).map(Number.call, Number).concat([0]);
            
                        for(var a = 0; a < a_indexing.length-1; a++){
                            for(var b = 0; b < b_indexing.length-1; b++){
                                var tmp = this.lineSegments( 
                                    [ points_a[a_indexing[a]], points_a[a_indexing[a+1]] ],
                                    [ points_b[b_indexing[b]], points_b[b_indexing[b+1]] ]
                                );
                                if( tmp != null && tmp.inSeg1 && tmp.inSeg2 ){return true;}
                            }
                        }
            
                    return false;
                };
            };

        };
        workspace.library.structure = new function(){
            this.functionListRunner = function(list){
                //function builder for working with the 'functionList' format
            
                return function(event,data){
                    //run through function list, and activate functions where necessary
                        for(var a = 0; a < list.length; a++){
                            var shouldRun = true;
            
                            //determine if the requirements of this function are met
                                for(var b = 0; b < list[a].requiredKeys.length; b++){
                                    shouldRun = true;
                                    for(var c = 0; c < list[a].requiredKeys[b].length; c++){
                                        shouldRun = shouldRun && workspace.system.keyboard.pressedKeys[ list[a].requiredKeys[b][c] ];
                                        if(!shouldRun){break;} //(one is already not a match, so save time and just skip to the next one)
                                    }
                                    if(shouldRun){ break; } //one of the collections worked, so save time and skip the rest
                                }
            
                            //if requirements were met, run the function
            	            if(shouldRun){  
                                //if the function returns 'false', continue with the list; otherwise stop here
                    	            if( list[a].function(event,data) ){ break; }
                            }
                        }
                }
            };
            
            this.signalRegistry = function(rightLimit=-1,bottomLimit=-1,signalLengthLimit=-1){
                var signals = [];
                var selectedSignals = [];
                var events = [];
                var events_byID = [];
                var events_byPosition = {};
                var positions = [];
            
                this.__dump = function(){
                    console.log('---- signalRegistry dump ----');
            
                    console.log('\tsignals');
                    for(var a = 0; a < signals.length; a++){ 
                        console.log( '\t\t', a, ' ' + JSON.stringify(signals[a]) );
                    }
            
                    console.log('\tselectedSignals');
                    for(var a = 0; a < tselectedSignals.length; a++){ 
                        console.log( '\t\t', a, ' ' + JSON.stringify(tselectedSignals[a]) );
                    }
            
                    console.log('\tevents');
                    for(var a = 0; a < events.length; a++){ 
                        console.log( '\t\t', a, ' ' + JSON.stringify(events[a]) );
                    }
            
                    console.log('\tevents_byID');
                    for(var a = 0; a < events_byID.length; a++){ 
                        console.log( '\t\t', a, ' ' + JSON.stringify(events_byID[a]) );
                    }
            
                    console.log('\tevents_byPosition');
                    var keys = Object.keys(events_byPosition);
                    for(var a = 0; a < keys.length; a++){ 
                        console.log( '\t\t', keys[a], ' ' + JSON.stringify(events_byPosition[keys[a]]) );
                    }
            
                    console.log('\tpositions');
                    for(var a = 0; a < positions.length; a++){ 
                        console.log( '\t\t', a, ' ' + JSON.stringify(positions[a]) );
                    }
                };
            
                this.export = function(){
                    return JSON.parse(JSON.stringify(
                        {
                            signals:            signals,
                            selectedSignals:    selectedSignals,
                            events:             events,
                            events_byID:        events_byID,
                            events_byPosition:  events_byPosition,
                            positions:          positions,
                        }
                    ));
                };
                this.import = function(data){
                    signals =             JSON.parse(JSON.stringify(data.signals));
                    selectedSignals =     JSON.parse(JSON.stringify(data.selectedSignals));
                    events =            JSON.parse(JSON.stringify(data.events));
                    events_byID =       JSON.parse(JSON.stringify(data.events_byID));
                    events_byPosition = JSON.parse(JSON.stringify(data.events_byPosition));
                    positions =         JSON.parse(JSON.stringify(data.positions));
                };
            
                this.getAllSignals = function(){ return JSON.parse(JSON.stringify(signals)); };
                this.getAllEvents = function(){ return JSON.parse(JSON.stringify(events)); };
                this.getSignal = function(id){
                    if( signals[id] == undefined ){return;}
                    return JSON.parse(JSON.stringify(signals[id]));
                };
                this.eventsBetween = function(start,end){
                    //depending on whether theres an end position or not; get all the events positions that 
                    //lie on the start positions, or get all the events that how positions which lie between
                    //the start and end positions
                    var eventNumbers = end == undefined ? 
                        Array.from(new Set(positions.filter(function(a){return a == start;}))) : 
                        Array.from(new Set(positions.filter(function(a){return a >= start && a < end;}))) ;
            
                    //for each position, convert the number to a string, and gather the associated event number arrays
                    //then, for each array, get each event and place that into the output array
                    var compiledEvents = [];
                    for(var a = 0; a < eventNumbers.length; a++){
                        eventNumbers[a] = events_byPosition[String(eventNumbers[a])];
                        for(var b = 0; b < eventNumbers[a].length; b++){
                            compiledEvents.push(events[eventNumbers[a][b]]);
                        }
                    }
            
                    //sort array by position (soonest first)
                    return compiledEvents.sort(function(a, b){
                        if(a.position < b.position) return -1;
                        if(a.position > b.position) return 1;
                        return 0;
                    });
                };
                this.add = function(data,forceID){
                    //clean up data
                        if(data == undefined || !('line' in data) || !('position' in data) || !('length' in data)){return;}
                        if(!('strength' in data)){data.strength = 1;}
                    //check for and correct disallowed data
                        if(data.line < 0){data.line = 0;}
                        if(data.length < 0){data.length = 0;}
                        if(data.position < 0){data.position = 0;}
                        if(data.strength < 0){data.strength = 0;}
            
                        if(bottomLimit > -1 && (data.line > bottomLimit-1)){data.line = bottomLimit-1;}
                        if(signalLengthLimit > -1 && (data.length > signalLengthLimit)){data.length = signalLengthLimit;}
                        if(rightLimit > -1 && (data.position > rightLimit) ){data.position = rightLimit-data.length;}
                        if(rightLimit > -1 && (data.position+data.length > rightLimit)){ data.length = rightLimit-data.position; }
                        if(rightLimit > -1 && (data.position+data.length > rightLimit)){data.position = rightLimit-data.length;}
                        if(data.strength > 1){data.strength = 1;}
            
                    //generate signal ID
                        var newID = 0;
                        if(forceID == undefined){
                            while(signals[newID] != undefined){newID++;}
                        }else{newID = forceID;}
            
                    //add signal to storage
                        signals[newID] = JSON.parse(JSON.stringify(data));
            
                    //generate event data
                        var newEvents = [
                            {signalID:newID, line:data.line, position:data.position,               strength:data.strength},
                            {signalID:newID, line:data.line, position:(data.position+data.length), strength:0}
                        ];
            
                    //add event data to storage
                        var eventLocation = 0;
                        //start event
                            while(events[eventLocation] != undefined){eventLocation++;}
                            events[eventLocation] = newEvents[0];
                            events_byID[newID] = [eventLocation];
                            if( events_byPosition[newEvents[0].position] == undefined ){
                                events_byPosition[newEvents[0].position] = [eventLocation];
                            }else{
                                events_byPosition[newEvents[0].position].push(eventLocation);
                            }
                            positions.push(newEvents[0].position);
                        //end event
                            while(events[eventLocation] != undefined){eventLocation++;}
                            events[eventLocation] = newEvents[1];
                            events_byID[newID] = events_byID[newID].concat(eventLocation);
                            if( events_byPosition[newEvents[1].position] == undefined ){
                                events_byPosition[newEvents[1].position] = [eventLocation];
                            }else{
                                events_byPosition[newEvents[1].position].push(eventLocation);
                            }
                            positions.push(newEvents[1].position);
            
                    return newID;
                };
                this.remove = function(id){
                    if( signals[id] == undefined ){return;}
            
                    delete signals[id];
            
                    for(var a = 0; a < events_byID[id].length; a++){
                        var tmp = events_byID[id][a];
                        events_byPosition[events[tmp].position].splice( events_byPosition[events[tmp].position].indexOf(tmp) ,1);
                        positions.splice(positions.indexOf(events[tmp].position),1);
                        if( events_byPosition[events[tmp].position].length == 0 ){delete events_byPosition[events[tmp].position];}
                        delete events[tmp];
                    }
            
                    delete events_byID[id];
                };
                this.update = function(id,data){
                    //clean input
                        if(data == undefined){return;}
                        if(!('line' in data)){data.line = signals[id].line;}
            
                        //Special cases where either by movement or lengthening, the signal stretches further than the rightLimit
                        //will allow. In these cases the signal either has to be clipped, or prevented from moving further to the
                        //right. In the case where a signal is being lengthened and moved to the right; the system should opt to
                        //clip it's length
                        //Obviously, if there's no right limit don't bother
                        if(rightLimit > -1){
                            if('position' in data && 'length' in data){//clip length
                                if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                            }else{
                                if('position' in data){//prevent movement
                                    if(signals[id].length+data.position >= rightLimit){ data.position = rightLimit - signals[id].length; }
                                }else{ data.position = signals[id].position; }
                                if('length' in data){//clip length
                                    if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                                }else{ data.length = signals[id].length; }
                            }
                        }
            
                        if(!('strength' in data)){data.strength = signals[id].strength;}
                    
                    this.remove(id);
                    this.add(data,id);
                };
                this.reset = function(){
                    signals = [];
                    selectedSignals = [];
                    events = [];
                    events_byID = [];
                    events_byPosition = {};
                    positions = [];
                };
            };
        };
        workspace.library.audio = new function(){
            //master context
                this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            
            
            
                
            
            
                
            //utility functions
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
                                var array = workspace.library.math.curveGenerator.s(10);
                                for(var a = 0; a < array.length; a++){
                                    array[a] = audioParam.value + array[a]*mux;
                                }
                                audioParam.setValueCurveAtTime(new Float32Array(array), context.currentTime, time);
                            break;
                            case 'instant': default:
                                audioParam.setTargetAtTime(target, context.currentTime, 0.001);
                            break;
                        }
                    }catch(e){
                        console.log('could not change param (possibly due to an overlap, or bad target value)');
                        console.log('audioParam:',audioParam,'target:',target,'time:',time,'curve:',curve,'cancelScheduledValues:',cancelScheduledValues);
                        console.log(e);
                    }
                };
                this.loadAudioFile = function(callback,type='file',url=''){
                    switch(type){
                        case 'url': 
                            var request = new XMLHttpRequest();
                            request.open('GET', url, true);
                            request.responseType = 'arraybuffer';
                            request.onload = function(){
                                workspace.library.audio.context.decodeAudioData(this.response, function(data){
                                    callback({
                                        buffer:data,
                                        name:(url.split('/')).pop(),
                                        duration:data.duration,
                                    });
                                }, function(e){console.warn("Error with decoding audio data" + e.err);});
                            }
                            request.send();
                        break;
                        case 'file': default:
                            var inputObject = document.createElement('input');
                            inputObject.type = 'file';
                            inputObject.onchange = function(){
                                var file = this.files[0];
                                var fileReader = new FileReader();
                                fileReader.readAsArrayBuffer(file);
                                fileReader.onload = function(data){
                                    workspace.library.audio.context.decodeAudioData(data.target.result, function(buffer){
                                        callback({
                                            buffer:buffer,
                                            name:file.name,
                                            duration:buffer.duration,
                                        });
                                    });
                                    inputObject.remove();
                                }
                            };
                            document.body.appendChild(inputObject);
                            inputObject.click();
                        break;
                    }
                };
                this.waveformSegment = function(audioBuffer, bounds={start:0,end:1}, resolution=10000){
                    var waveform = audioBuffer.getChannelData(0);
                    // var channelCount = audioBuffer.numberOfChannels;
                
                    bounds.start = bounds.start ? bounds.start : 0;
                    bounds.end = bounds.end ? bounds.end : 1;
                    var start = audioBuffer.length*bounds.start;
                    var end = audioBuffer.length*bounds.end;
                    var step = (end - start)/resolution;
                
                    var outputArray = [];
                    for(var a = start; a < end; a+=Math.round(step)){
                        outputArray.push( 
                            workspace.library.math.largestValueFound(
                                waveform.slice(a, a+Math.round(step))
                            )
                        );
                    }
                
                    return outputArray;
                };
                this.loadBuffer = function(context, data, destination, onended){
                    var temp = context.createBufferSource();
                    temp.buffer = data;
                    temp.connect(destination);
                    temp.onended = onended;
                    return temp;
                };
                
            
            
            
            
            
            
            
            //destination
                this.destination = this.context.createGain();
                this.destination.connect(this.context.destination);
                this.destination._gain = 1;
                this.destination.masterGain = function(value){
                    if(value == undefined){return this.destination._gain;}
                    this._gain = value;
                    workspace.library.audio.changeAudioParam(workspace.library.audio.context, this.gain, this._gain, 0.01, 'instant', true);
                };
            
            
            
            
            
            
            
            
            //conversion
                //frequencies index
                    this.names_frequencies_split = {
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
                        this.names_frequencies = {};
                        var octaves = Object.entries(this.names_frequencies_split);
                        for(var a = 0; a < octaves.length; a++){
                            var names = Object.entries(this.names_frequencies_split[a]);
                            for(var b = 0; b < names.length; b++){
                                this.names_frequencies[ octaves[a][0]+names[b][0] ] = names[b][1];
                            }
                        }
                    //generate backward index
                    // eg. {... 261.6:'4C', 277.2:'4C#' ...}
                        this.frequencies_names = {};
                        var temp = Object.entries(this.names_frequencies);
                        for(var a = 0; a < temp.length; a++){ this.frequencies_names[temp[a][1]] = temp[a][0]; }
            
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
                        this.midinumbers_names = {};
                        for(var a = 0; a < temp.length; a++){
                            this.midinumbers_names[a+24] = temp[a];
                        }
                    //generate backward index
                        this.names_midinumbers = {};
                        var temp = Object.entries(this.midinumbers_names);
                        for(var a = 0; a < temp.length; a++){ 
                            this.names_midinumbers[temp[a][1]] = parseInt(temp[a][0]);
                        }
            
                //lead functions
                    this.num2name = function(num){ return this.midinumbers_names[num]; };
                    this.num2freq = function(num){ return this.names_frequencies[this.midinumbers_names[num]]; };
            
                    this.name2num = function(name){ return this.names_midinumbers[name]; };
                    this.name2freq = function(name){ return this.names_frequencies[name]; };
            
                    this.freq2num = function(freq){ return this.names_midinumbers[this.frequencies_names[freq]]; };
                    this.freq2name = function(freq){ return this.frequencies_names[freq]; };
        };
        workspace.library.misc = new function(){
            this.blendColours = function(rgba_1,rgba_2,ratio){
                //extract
                    function extract(rgba){
                        rgba = rgba.split(',');
                        rgba[0] = rgba[0].replace('rgba(', '');
                        rgba[3] = rgba[3].replace(')', '');
                        return rgba.map(function(a){return parseFloat(a);})
                    }
                    rgba_1 = extract(rgba_1);
                    rgba_2 = extract(rgba_2);
            
                //blend
                    var rgba_out = [];
                    for(var a = 0; a < rgba_1.length; a++){
                        rgba_out[a] = (1-ratio)*rgba_1[a] + ratio*rgba_2[a];
                    }
            
                //pack
                    return 'rgba('+rgba_out[0]+','+rgba_out[1]+','+rgba_out[2]+','+rgba_out[3]+')';            
            };
            this.multiBlendColours = function(rgbaList,ratio){
                //special cases
                    if(ratio == 0){return rgbaList[0];}
                    if(ratio == 1){return rgbaList[rgbaList.length-1];}
                //calculate the start colour and ratio(represented by as "colourIndex.ratio"), then blend
                    var p = ratio*(rgbaList.length-1);
                    return workspace.library.misc.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
            };
            this.padString = function(string,length,padding=' '){
                if(padding.length<1){return string;}
                string = ''+string;
            
                while(string.length < length){
                    string = padding + string;
                }
            
                return string;
            };
            this.compressString = function(string){return workspace.library.thirdparty.lzString.compress(string);};
            this.decompressString = function(string){return workspace.library.thirdparty.lzString.decompress(string);};
            this.serialize = function(data,compress=true){
                function getType(obj){
                    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
                }
            
                var data = JSON.stringify(data, function(key, value){
            
                    //preserve types that JSON.stringify can't handle as "unique types"
                    switch(getType(value)){
                        case 'function':
                            return {__uniqueType:'function', __value:value.toString(), __name:value.name};
                        case 'arraybuffer': 
                            return {__uniqueType:'arraybuffer', __value:btoa(String.fromCharCode(new Uint8Array(value)))}
                        case 'audiobuffer':
                            var channelData = [];
                            for(var a = 0; a < value.numberOfChannels; a++){
                                channelData.push( Array.from(value.getChannelData(a)) );
                            }
            
                            return {
                                __uniqueType:'audiobuffer', 
                                __channelData:channelData, 
                                __sampleRate:value.sampleRate,
                                __numberOfChannels:value.numberOfChannels,
                                __length:value.length
                            };
                        break;
                        default: return value;
                    }
            
                });
            
                if(compress){ data = workspace.library.misc.compressString(data); }
                return data;
            };
            this.unserialize = function(data,compressed=true){
                if(data === undefined){return undefined;}
            
                if(compressed){ data = workspace.library.misc.decompressString(data); }
            
                return JSON.parse(data, function(key, value){
            
                    //recover unique types
                    if(typeof value == 'object' && value != null && '__uniqueType' in value){
                        switch(value.__uniqueType){
                            case 'function':
                                var functionHead = value.__value.substring(0,value.__value.indexOf('{'));
                                functionHead = functionHead.substring(functionHead.indexOf('(')+1, functionHead.lastIndexOf(')'));
                                var functionBody = value.__value.substring(value.__value.indexOf('{')+1, value.__value.lastIndexOf('}'));
            
                                value = Function(functionHead,functionBody);
                            break;
                            case 'arraybuffer':
                                value = atob(value.__value);
                                for(var a = 0; a < value.length; a++){ value[a] = value[a].charCodeAt(0); }
                                value = new ArrayBuffer(value);
                            break;
                            case 'audiobuffer':
                                var audioBuffer = workspace.library.audio.context.createBuffer(value.__numberOfChannels, value.__length, value.__sampleRate);
            
                                for(var a = 0; a < audioBuffer.numberOfChannels; a++){
                                    workingBuffer = audioBuffer.getChannelData(a);
                                    for(var i = 0; i < audioBuffer.length; i++){
                                        workingBuffer[i] = value.__channelData[a][i];
                                    }
                                }
            
                                value = audioBuffer;
                            break;
                            default: value = value.__value;
                        }
                    }
            
                    return value;
                });
            };
            this.openFile = function(callback,readAsType='readAsBinaryString'){
                var i = document.createElement('input');
                i.type = 'file';
                i.onchange = function(){
                    var f = new FileReader();
                    switch(readAsType){
                        case 'readAsArrayBuffer':           f.readAsArrayBuffer(this.files[0]);  break;
                        case 'readAsBinaryString': default: f.readAsBinaryString(this.files[0]); break;
                    }
                    f.onloadend = function(){ 
                        if(callback){callback(f.result);}
                    }
                };
                i.click();
            };
            this.printFile = function(filename,data){
                var a = document.createElement('a');
                a.href = URL.createObjectURL(new Blob([data]));
                a.download = filename;
                a.click();
            };
        };
        workspace.library.thirdparty = new function(){
            this.lzString = (function(){
                // Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
                // This work is free. You can redistribute it and/or modify it
                // under the terms of the WTFPL, Version 2
                // For more information see LICENSE.txt or http://www.wtfpl.net/
                //
                // For more information, the home page:
                // http://pieroxy.net/blog/pages/lz-string/testing.html
                //
                // LZ-based compression algorithm, version 1.4.4
                //
                // Modified by Metasophiea <metasophiea@gmail.com>
                var f = String.fromCharCode;
                var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
                var baseReverseDic = {};
                
                function getBaseValue(alphabet, character) {
                    if(!baseReverseDic[alphabet]){
                        baseReverseDic[alphabet] = {};
                        for(var i = 0 ; i < alphabet.length; i++){
                            baseReverseDic[alphabet][alphabet.charAt(i)] = i;
                        }
                    }	
                    return baseReverseDic[alphabet][character];
                }
                
                var LZString = {
                    //compress into a string that is URI encoded
                    compress: function (input) {
                        if(input == null){return "";}
                        return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
                    },
                    
                    //decompress from an output of compress which was URI encoded
                    decompress:function (input) {
                        if(input == null){return "";}
                        if(input == ""){return null;}
                        input = input.replace(/ /g, "+");
                        return LZString._decompress(input.length, 32, function(index){ return getBaseValue(keyStrUriSafe, input.charAt(index)); });
                    },
                    
                    _compress: function(uncompressed, bitsPerChar, getCharFromInt){
                        if (uncompressed == null) return "";
                        var i, value,
                            context_dictionary= {},
                            context_dictionaryToCreate= {},
                            context_c="",
                            context_wc="",
                            context_w="",
                            context_enlargeIn= 2, // Compensate for the first entry which should not count
                            context_dictSize= 3,
                            context_numBits= 2,
                            context_data=[],
                            context_data_val=0,
                            context_data_position=0,
                            ii;
                    
                        for (ii = 0; ii < uncompressed.length; ii += 1) {
                        context_c = uncompressed.charAt(ii);
                        if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
                            context_dictionary[context_c] = context_dictSize++;
                            context_dictionaryToCreate[context_c] = true;
                        }
                    
                        context_wc = context_w + context_c;
                        if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
                            context_w = context_wc;
                        } else {
                            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
                            if (context_w.charCodeAt(0)<256) {
                                for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                }
                                value = context_w.charCodeAt(0);
                                for (i=0 ; i<8 ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                                }
                            } else {
                                value = 1;
                                for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position ==bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = 0;
                                }
                                value = context_w.charCodeAt(0);
                                for (i=0 ; i<16 ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                                }
                            }
                            context_enlargeIn--;
                            if (context_enlargeIn == 0) {
                                context_enlargeIn = Math.pow(2, context_numBits);
                                context_numBits++;
                            }
                            delete context_dictionaryToCreate[context_w];
                            } else {
                            value = context_dictionary[context_w];
                            for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                                } else {
                                context_data_position++;
                                }
                                value = value >> 1;
                            }
                    
                    
                            }
                            context_enlargeIn--;
                            if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                            }
                            // Add wc to the dictionary.
                            context_dictionary[context_wc] = context_dictSize++;
                            context_w = String(context_c);
                        }
                        }
                    
                        // Output the code for w.
                        if (context_w !== "") {
                        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
                            if (context_w.charCodeAt(0)<256) {
                            for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                                } else {
                                context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i=0 ; i<8 ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                                } else {
                                context_data_position++;
                                }
                                value = value >> 1;
                            }
                            } else {
                            value = 1;
                            for (i=0 ; i<context_numBits ; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                                } else {
                                context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i=0 ; i<16 ; i++) {
                                context_data_val = (context_data_val << 1) | (value&1);
                                if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                                } else {
                                context_data_position++;
                                }
                                value = value >> 1;
                            }
                            }
                            context_enlargeIn--;
                            if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                            }
                            delete context_dictionaryToCreate[context_w];
                        } else {
                            value = context_dictionary[context_w];
                            for (i=0 ; i<context_numBits ; i++) {
                            context_data_val = (context_data_val << 1) | (value&1);
                            if (context_data_position == bitsPerChar-1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                            }
                    
                    
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        }
                    
                        // Mark the end of the stream
                        value = 2;
                        for (i=0 ; i<context_numBits ; i++) {
                        context_data_val = (context_data_val << 1) | (value&1);
                        if (context_data_position == bitsPerChar-1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                        }
                    
                        // Flush the last char
                        while (true) {
                        context_data_val = (context_data_val << 1);
                        if (context_data_position == bitsPerChar-1) {
                            context_data.push(getCharFromInt(context_data_val));
                            break;
                        }
                        else context_data_position++;
                        }
                        return context_data.join('');
                    },
                    
                    _decompress: function(length, resetValue, getNextValue){
                        var dictionary = [],
                            next,
                            enlargeIn = 4,
                            dictSize = 4,
                            numBits = 3,
                            entry = "",
                            result = [],
                            i,
                            w,
                            bits, resb, maxpower, power,
                            c,
                            data = {val:getNextValue(0), position:resetValue, index:1};
                    
                        for (i = 0; i < 3; i += 1) {
                        dictionary[i] = i;
                        }
                    
                        bits = 0;
                        maxpower = Math.pow(2,2);
                        power=1;
                        while (power!=maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb>0 ? 1 : 0) * power;
                        power <<= 1;
                        }
                    
                        switch (next = bits) {
                        case 0:
                            bits = 0;
                            maxpower = Math.pow(2,8);
                            power=1;
                            while (power!=maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                                }
                                bits |= (resb>0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                            c = f(bits);
                            break;
                        case 1:
                            bits = 0;
                            maxpower = Math.pow(2,16);
                            power=1;
                            while (power!=maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                                }
                                bits |= (resb>0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                            c = f(bits);
                            break;
                        case 2:
                            return "";
                        }
                        dictionary[3] = c;
                        w = c;
                        result.push(c);
                        while (true) {
                        if (data.index > length) {
                            return "";
                        }
                    
                        bits = 0;
                        maxpower = Math.pow(2,numBits);
                        power=1;
                        while (power!=maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                            }
                            bits |= (resb>0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                    
                        switch (c = bits) {
                            case 0:
                            bits = 0;
                            maxpower = Math.pow(2,8);
                            power=1;
                            while (power!=maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                                }
                                bits |= (resb>0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                    
                            dictionary[dictSize++] = f(bits);
                            c = dictSize-1;
                            enlargeIn--;
                            break;
                            case 1:
                            bits = 0;
                            maxpower = Math.pow(2,16);
                            power=1;
                            while (power!=maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                                }
                                bits |= (resb>0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                            dictionary[dictSize++] = f(bits);
                            c = dictSize-1;
                            enlargeIn--;
                            break;
                            case 2:
                            return result.join('');
                        }
                    
                        if (enlargeIn == 0) {
                            enlargeIn = Math.pow(2, numBits);
                            numBits++;
                        }
                    
                        if (dictionary[c]) {
                            entry = dictionary[c];
                        } else {
                            if (c === dictSize) {
                            entry = w + w.charAt(0);
                            } else {
                            return null;
                            }
                        }
                        result.push(entry);
                    
                        // Add w+entry[0] to the dictionary.
                        dictionary[dictSize++] = w + entry.charAt(0);
                        enlargeIn--;
                    
                        w = entry;
                    
                        if (enlargeIn == 0) {
                            enlargeIn = Math.pow(2, numBits);
                            numBits++;
                        }
                    
                        }
                    }
                };
                return LZString;
            })();
        };
        workspace.core = new function(){
            var core = new function(){
                var core = this;
                
                var adapter = new function(){
                    this.length = function(l){
                        return l*core.viewport.scale();
                    };
                    this.windowPoint2workspacePoint = function(x,y){
                        var position = core.viewport.position();
                        var scale = core.viewport.scale() / window.devicePixelRatio;
                        var angle = core.viewport.angle();
                
                        x = (x/scale) - position.x;
                        y = (y/scale) - position.y;
                
                        return workspace.library.math.cartesianAngleAdjust(x,y,-angle);
                    };
                    this.workspacePoint2windowPoint = function(x,y){
                        var position = core.viewport.position();
                        var scale = core.viewport.scale();
                        var angle = core.viewport.angle();
                
                        var point = workspace.library.math.cartesianAngleAdjust(x,y,angle);
                
                        return {
                            x: (point.x+position.x) * scale,
                            y: (point.y+position.y) * scale
                        };
                    };
                };
                var shapes = new function(){
                    this.polygon = function(){
                    
                        this.type = 'polygon';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.points = [];
                    
                        this.style = {
                            fill:'rgba(100,255,255,1)',
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            lineJoin:'round',
                            miterLimit:2,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:20,
                            shadowOffset:{x:20, y:20},
                        };
                    
                        
                        this.parameter = {};
                        this.parameter.points = function(shape){ return function(a){if(a==undefined){return shape.points;} shape.points = a; shape.computeExtremities();} }(this);
                    
                    
                    
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = this.points.map(function(point){
                                    point = workspace.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    points: this.points.map( function(a){
                                        a = workspace.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
                                        return { x:a.x+offset.x, y:a.y+offset.y };
                                    } ),
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.points = shapeValue.points.map( function(a){ return adapter.workspacePoint2windowPoint(a.x, a.y); } );
                                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //clipping
                                if(isClipper){
                                    var region = new Path2D();
                                    region.moveTo(shapeValue.points[0].x,shapeValue.points[0].y);
                                    for(var a = 1; a < shapeValue.points.length; a++){
                                        region.lineTo(shapeValue.points[a].x,shapeValue.points[a].y);
                                    }
                                    context.clip(region);
                                    return;
                                }
                    
                            //paint this shape as requested
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.lineJoin = this.style.lineJoin;
                                context.miterLimit = this.style.miterLimit;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
                                context.beginPath(); 
                                context.moveTo(shapeValue.points[0].x,shapeValue.points[0].y);
                                for(var a = 1; a < shapeValue.points.length; a++){
                                    context.lineTo(shapeValue.points[a].x,shapeValue.points[a].y);
                                }
                                context.closePath(); 
                    
                                context.fill(); 
                                context.stroke();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    
                    };
                    this.circle = function(){
                    
                        this.type = 'circle';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.r = 2;
                    
                        this.style = {
                            fill:'rgba(255,100,255,1)',
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:2,
                            shadowOffset:{x:1, y:1},
                        };
                    
                        
                        this.parameter = {};
                        this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities();} }(this);
                        this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities();} }(this);
                        this.parameter.r = function(shape){ return function(a){if(a==undefined){return shape.r;} shape.r = a; shape.computeExtremities();} }(this);
                    
                    
                    
                    
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                    origin:{},
                                };
                    
                            //calculate origin
                                point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                this.extremities.origin = {
                                    x: this.x + offset.x,
                                    y: this.y + offset.y,
                                };
                    
                            //calculate points
                                this.extremities.points = workspace.library.math.pointsOfCircle(this.x, this.y, this.r, 10);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = workspace.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            var circleCentre = {
                                x: shape.x + shape.extremities.origin.x,
                                y: shape.y + shape.extremities.origin.y,
                            };
                    
                            return workspace.library.math.distanceBetweenTwoPoints( {x:x,y:y},circleCentre ) <= shape.r;
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                            if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    radius:this.r,
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.location = adapter.workspacePoint2windowPoint(shapeValue.location.x,shapeValue.location.y);
                                shapeValue.radius = adapter.length(shapeValue.radius);
                                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //clipping
                                if(isClipper){
                                    var region = new Path2D();
                                    region.arc(shapeValue.location.x,shapeValue.location.y, shapeValue.radius, 0, 2 * Math.PI, false);
                                    context.clip(region);
                                    return;
                                }
                                
                            //paint this shape as requested
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
                            //actual render
                                context.beginPath();
                                context.arc(shapeValue.location.x,shapeValue.location.y, shapeValue.radius, 0, 2 * Math.PI, false);
                                context.closePath(); 
                                context.fill();
                                context.stroke();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                    
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.origin.x,this.extremities.origin.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    };
                    this.canvas = function(){
                    
                        this.type = 'canvas';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.angle = 0;
                        this.anchor = {x:0,y:0};
                        this.width = 10;
                        this.height = 10;
                    
                        var canvasObject = {
                            isChanged:true, 
                            element:document.createElement('canvas'),
                            resolution:1,
                        };
                        canvasObject.context = canvasObject.element.getContext('2d',{ alpha: false });
                        canvasObject.element.setAttribute('width',this.width*canvasObject.resolution);
                        canvasObject.element.setAttribute('height',this.height*canvasObject.resolution);
                    
                    
                        this.parameter = {};
                        this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities();} }(this);
                        this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities();} }(this);
                        this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities();} }(this);
                        this.parameter.anchor = function(shape){ return function(a){if(a==undefined){return shape.anchor;} shape.anchor = a; shape.computeExtremities();} }(this);
                        this.parameter.width = function(shape){ return function(a){if(a==undefined){return shape.width;} shape.width = a; shape.computeExtremities(); canvasObject.element.setAttribute('width',shape.width*canvasObject.resolution); } }(this);
                        this.parameter.height = function(shape){ return function(a){if(a==undefined){return shape.height;} shape.height = a; shape.computeExtremities(); canvasObject.element.setAttribute('height',shape.height*canvasObject.resolution); } }(this);
                    
                    
                    
                    
                        this.resolution = function(a){
                            if(a == undefined){return canvasObject.resolution;}
                            canvasObject.resolution = a;
                            canvasObject.element.setAttribute('width',this.width*canvasObject.resolution);
                            canvasObject.element.setAttribute('height',this.height*canvasObject.resolution); 
                            canvasObject.isChanged = true;
                        };
                        this._ = canvasObject.context;
                        this.$ = function(a){return a*canvasObject.resolution;};
                    
                    
                    
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = workspace.library.math.pointsOfRect(this.x, this.y, this.width, this.height, -this.angle, this.anchor);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = workspace.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                    
                    
                    
                        
                        this.render = function(context,offset={x:0,y:0,a:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    angle:(this.angle+offset.a),
                                    width: this.width,
                                    height: this.height,
                                };
                            
                            //adapt values
                                shapeValue.location = adapter.workspacePoint2windowPoint( (shapeValue.location.x - this.anchor.x*shapeValue.width), (shapeValue.location.y - this.anchor.y*shapeValue.height) );              
                                shapeValue.width = adapter.length(shapeValue.width);
                                shapeValue.height = adapter.length(shapeValue.height);
                    
                            //post adaptation calculations
                                shapeValue.location = workspace.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                    
                            //actual render
                                context.save();
                                context.rotate( shapeValue.angle );
                                context.drawImage( canvasObject.element, shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
                                context.restore();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        }
                    };
                    this.image = function(){
                    
                        this.type = 'image';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.angle = 0;
                        this.anchor = {x:0,y:0};
                        this.width = 10;
                        this.height = 10;
                    
                        this.url = '';
                        var imageObject = {};
                    
                        this.style = {
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:2,
                            shadowOffset:{x:1, y:1},
                        };
                    
                        
                        this.parameter = {};
                        this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities();} }(this);
                        this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities();} }(this);
                        this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities();} }(this);
                        this.parameter.anchor = function(shape){ return function(a){if(a==undefined){return shape.anchor;} shape.anchor = a; shape.computeExtremities();} }(this);
                        this.parameter.width = function(shape){ return function(a){if(a==undefined){return shape.width;} shape.width = a; shape.computeExtremities();} }(this);
                        this.parameter.height = function(shape){ return function(a){if(a==undefined){return shape.height;} shape.height = a; shape.computeExtremities();} }(this);
                    
                    
                        
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = workspace.library.math.pointsOfRect(this.x, this.y, this.width, this.height, -this.angle, this.anchor);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = workspace.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    angle:(this.angle+offset.a),
                                    width: this.width,
                                    height: this.height,
                                    // lineWidth: this.style.lineWidth,
                                    // shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.location = adapter.workspacePoint2windowPoint( (shapeValue.location.x - this.anchor.x*shapeValue.width), (shapeValue.location.y - this.anchor.y*shapeValue.height) );              
                                shapeValue.width = adapter.length(shapeValue.width);
                                shapeValue.height = adapter.length(shapeValue.height);
                                // shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                // shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                // shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                // shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //post adaptation calculations
                                shapeValue.location = workspace.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                    
                            //if this image url is not cached; cache it
                                if( !imageObject.hasOwnProperty(this.url) ){
                                    imageObject[this.url] = new Image(); 
                                    imageObject[this.url].src = this.url;
                                }
                    
                            //actual render
                                // context.shadowColor = this.style.shadowColour;
                                // context.shadowBlur = shapeValue.shadowBlur;
                                // context.shadowOffsetX = shapeValue.shadowOffset.x;
                                // context.shadowOffsetY = shapeValue.shadowOffset.y;
                                context.save();
                                context.rotate( shapeValue.angle );
                                context.drawImage( imageObject[this.url], shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
                                context.restore();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        }
                    
                    };
                    this.path = function(){
                    
                        this.type = 'path';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.points = [];
                    
                        this.style = {
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            lineCap:'butt',
                            lineJoin:'miter',
                            miterLimit:2,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:20,
                            shadowOffset:{x:20, y:20},
                        };
                    
                        
                        this.parameter = {};
                        this.parameter.points = function(shape){ 
                            return function(a){
                                if(a==undefined){
                                    return shape.points;
                                } 
                                shape.points = a; 
                                shape.computeExtremities();
                            } 
                        }(this);
                    
                    
                        
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = this.points.map(function(point){
                                    point = workspace.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //determine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    points: this.points.map( function(a){
                                        a = workspace.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
                                        return { x:a.x+offset.x, y:a.y+offset.y };
                                    } ),
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.points = shapeValue.points.map( function(a){ return adapter.workspacePoint2windowPoint(a.x, a.y); } );
                                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //paint this shape as requested
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.lineCap = this.style.lineCap;
                                context.lineJoin = this.style.lineJoin;
                                context.miterLimit = this.style.miterLimit;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
                                context.beginPath(); 
                                context.moveTo(shapeValue.points[0].x,shapeValue.points[0].y);
                                for(var a = 1; a < shapeValue.points.length; a++){
                                    context.lineTo(shapeValue.points[a].x,shapeValue.points[a].y);
                                }
                    
                                context.stroke();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //bounding box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    };
                    this.rectangle = function(){
                    
                        this.type = 'rectangle';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.angle = 0;
                        this.anchor = {x:0,y:0};
                        this.width = 10;
                        this.height = 10;
                    
                        this.style = {
                            fill:'rgba(255,100,255,1)',
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:2,
                            shadowOffset:{x:1, y:1},
                        };
                    
                        
                        this.parameter = {};
                        this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities();} }(this);
                        this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities();} }(this);
                        this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities();} }(this);
                        this.parameter.anchor = function(shape){ return function(a){if(a==undefined){return shape.anchor;} shape.anchor = a; shape.computeExtremities();} }(this);
                        this.parameter.width = function(shape){ return function(a){if(a==undefined){return shape.width;} shape.width = a; shape.computeExtremities();} }(this);
                        this.parameter.height = function(shape){ return function(a){if(a==undefined){return shape.height;} shape.height = a; shape.computeExtremities();} }(this);
                    
                    
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.getOffset = function(){return gatherParentOffset(this);};
                        this.computeExtremities = function(offset,deepCompute){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = workspace.library.math.pointsOfRect(this.x, this.y, this.width, this.height, -this.angle, this.anchor);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = workspace.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //determine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    angle:(this.angle+offset.a),
                                    width: this.width,
                                    height: this.height,
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                if(!static){
                                    shapeValue.location = adapter.workspacePoint2windowPoint( (shapeValue.location.x - this.anchor.x*shapeValue.width), (shapeValue.location.y - this.anchor.y*shapeValue.height) );              
                                    shapeValue.width = adapter.length(shapeValue.width);
                                    shapeValue.height = adapter.length(shapeValue.height);
                                    shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                    shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                    shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                    shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                                }
                    
                            //post adaptation calculations
                                shapeValue.location = workspace.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                                
                            //clipping
                                if(isClipper){
                                    context.rotate( shapeValue.angle );
                                    var region = new Path2D();
                                    region.rect(shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height);
                                    context.clip(region);
                                    context.rotate( -shapeValue.angle );
                                    return;
                                }
                    
                            //actual render
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                                
                                context.save();
                                context.rotate( shapeValue.angle );
                                context.fillRect( shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
                                context.strokeRect( shapeValue.location.x, shapeValue.location.y, shapeValue.width, shapeValue.height );
                                context.restore();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        }
                    };
                    this.group = function(){
                    
                        this.type = 'group';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.clipActive = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.angle = 0;
                        this.children = [];
                        this.clippingStencil;
                    
                    
                        this.parameter = {};
                        this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities(undefined,true);} }(this);
                        this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities(undefined,true);} }(this);
                        this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities(undefined,true);} }(this);
                    
                    
                    
                        function checkElementIsValid(group,element){
                            if(element == undefined){return group.getAddress()+' >> no element provided';}
                    
                            //check for name
                                if(element.name == undefined || element.name == ''){return group.getAddress()+' >> element has no name'}
                        
                            //check that the name is not already taken in this grouping
                                for(var a = 0; a < group.children.length; a++){
                                    if( group.children[a].name == element.name ){ 
                                        return 'element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+group.name+'"'); 
                                    }
                                }
                        }
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        this.clip = function(bool){
                            if(bool == undefined){return this.clipActive;}
                            this.clipActive = (this.clippingStencil == undefined) ? false : bool;
                    
                            //computation of extremities
                                this.computeExtremities();
                        };
                        this.stencil = function(shape){
                            if(shape == undefined){return this.clippingStencil;}
                            this.clippingStencil = shape;
                    
                            //computation of extremities
                                this.computeExtremities();
                        };
                        this.prepend = function(element){
                            //check that the element is valid
                                var temp = checkElementIsValid(this,element);
                                if(temp != undefined){console.error('element invalid:',temp); return;}
                    
                            //actually add the element
                                this.children.unshift(element);
                    
                            //inform element of who it's parent is
                                element.parent = this;
                    
                            //computation of extremities
                                element.computeExtremities(undefined,true);
                        };
                        this.append = function(element){
                            //check that the element is valid
                                var temp = checkElementIsValid(this, element);
                                if(temp != undefined){console.error('element invalid:',temp); return;}
                    
                            //actually add the element
                                this.children.push(element);
                    
                            //inform element of who it's parent is
                                element.parent = this;
                    
                            //computation of extremities
                                element.computeExtremities(undefined,true);
                        };
                        this.remove = function(element){
                            //check that an element was provided
                                if(element == undefined){return;}
                    
                            //get index of element (if this element isn't in the group, just bail)
                                var index = this.children.indexOf(element);
                                if(index < 0){return;}
                    
                            //actual removal
                                this.children.splice(index, 1);
                    
                            //computation of extremities
                                this.computeExtremities();
                        };
                        this.clear = function(){
                            //empty out children
                                this.children = [];
                    
                            //computation of extremities
                                this.computeExtremities();
                        };
                        this.contains = function(element){
                            for(var a = 0; a < this.children.length; a++){
                                if(this.children[a] == element){return true;}
                            }
                    
                            return false;
                        };
                        this.getChildByName = function(name){
                            for(var a = 0; a < this.children.length; a++){
                                if( this.children[a].name == name ){ return this.children[a]; }
                            }
                        };
                        this.getElementsWithName = function(name){
                            var result = [];
                            for(var a = 0; a < this.children.length; a++){
                                if( this.children[a].name == name ){
                                    result.push(this.children[a]);
                                }
                                if( this.children[a].type == 'group' ){
                                    var list = this.children[a].getElementsWithName(name);
                                    for(var b = 0; b < list.length; b++){ result.push( list[b] ); } //because concat doesn't work
                                }
                            }
                            return result;
                        };
                    
                        this.getOffset = function(){return gatherParentOffset(this);};
                        this.computeExtremities = function(offset,deepCompute=false){
                            //root calculation element
                                var rootCalculationElement = offset == undefined;
                    
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //if 'deepCompute' is set, recalculate the extremities for all children
                                if(deepCompute){
                                    //calculate offset to be sent down to this group's children
                                        var combinedOffset = { x: offset.x, y: offset.y, a: offset.a + this.angle };
                                        var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                            combinedOffset.x += point.x;
                                            combinedOffset.y += point.y;
                    
                                    //request deep calculation from all children
                                        for(var a = 0; a < this.children.length; a++){
                                            this.children[a].computeExtremities(combinedOffset,true);
                                        }
                                }
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                //assuming clipping is turned off
                                    if(!this.clipActive){
                                        //the points for a group, is just the four corners of the bounding box, calculated using
                                        //the bounding boxes of all the children
                                        //  -> this method needs to be trashed <-
                                            var temp = [];
                                            for(var a = 0; a < this.children.length; a++){
                                                temp.push(this.children[a].extremities.boundingBox.topLeft);
                                                temp.push(this.children[a].extremities.boundingBox.bottomRight);
                                            }
                                            temp = workspace.library.math.boundingBoxFromPoints( temp );
                                            this.extremities.points = [
                                                { x: temp.topLeft.x,     y: temp.topLeft.y,     },
                                                { x: temp.bottomRight.x, y: temp.topLeft.y,     },
                                                { x: temp.bottomRight.x, y: temp.bottomRight.y, },
                                                { x: temp.topLeft.x,     y: temp.bottomRight.y, },
                                            ];
                                //assuming clipping is turned on
                                    }else{
                                        //the points for this group are the same as the stencil shape's
                                            var combinedOffset = { x: offset.x, y: offset.y, a: offset.a + this.angle };
                                            var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                                combinedOffset.x += point.x;
                                                combinedOffset.y += point.y;
                                            this.clippingStencil.computeExtremities(combinedOffset);
                                            this.extremities.points = this.clippingStencil.extremities.points;
                                    }
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined && rootCalculationElement){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if(this.clipActive){ return this.clippingStencil.isPointWithin(x,y); }
                    
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                        this.getElementUnderPoint = function(x,y,static=false,getList=false){
                            //go through the children in reverse order, discovering if
                            //  the object is not ignored and,
                            //  the point is within their bounding box
                            //if so; if it's a group, follow the 'getElementUnderPoint' function down
                            //if it's not, return that shape
                            //otherwise, carry onto the next shape
                    
                            var returnList = [];
                    
                            for(var a = this.children.length-1; a >= 0; a--){
                                //if child shape is static (or any of its parents), use adjusted x and y values for 'isPointWithin' judgement
                                    var point = (this.children[a].static || static) ? adapter.workspacePoint2windowPoint(x,y) : {x:x,y:y};
                    
                                    if( !this.children[a].ignored && this.children[a].isPointWithin(point.x,point.y) ){
                                        if( this.children[a].type == 'group' ){
                                            var temp = this.children[a].getElementUnderPoint(x,y,(this.children[a].static || static),getList);
                                            if(temp != undefined){
                                                if(getList){ returnList = returnList.concat(temp); }
                                                else{ return temp; }
                                            }
                                        }else{
                                            if(getList){ returnList.push(this.children[a]); }
                                            else{ return this.children[a]; }
                                        }
                                    }
                            }
                    
                            if(getList){return returnList;}
                        };
                    
                        function shouldRender(shape){
                            //if this shape is static, always render
                                if(shape.static){return true;}
                    
                            //if any of this shape's children are static, render the group (and let the individuals decide to render themselves or not)
                                for(var a = 0; a < shape.children.length; a++){ if(shape.children[a].static){return true;} }
                    
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                var packagedOffset = {
                                    a: offset.a + this.angle,
                                    x: offset.x + point.x,
                                    y: offset.y + point.y,
                                };
                    
                    
                            //draw clipping (if active)
                                if(this.clipActive || isClipper){
                                    context.save();
                                    this.clippingStencil.render( context, Object.assign({},packagedOffset), (static||this.clippingStencil.static), (isClipper||this.clipActive) );
                                }
                    
                            //cycle through all children, activating their render functions
                                for(var a = 0; a < this.children.length; a++){
                                    var item = this.children[a];
                                    item.render( context, Object.assign({},packagedOffset), (static||item.static) );
                                }
                    
                            //undo the clipping (only if there was clipping, ofcourse)
                                if(this.clipActive){ context.restore(); }
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //boudning box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    };
                    this.text = function(){
                    
                        this.type = 'text';
                    
                        this.name = '';
                        this.ignored = false;
                        this.static = false;
                        this.parent = undefined;
                        this.dotFrame = false;
                        this.extremities = {
                            points:[],
                            boundingBox:{},
                        };
                    
                        this.x = 0;
                        this.y = 0;
                        this.text = 'curve';
                        this.angle = 0;
                        this.size = 1;
                    
                        this.style = {
                            font:'30pt Arial',
                            align:'start',                  // start/end/center/left/right 
                            baseline:'alphabetic',          // alphabetic/top/hanging/middle/ideographic/bottom
                            fill:'rgba(255,100,100,1)',
                            stroke:'rgba(0,0,0,0)',
                            lineWidth:1,
                            shadowColour:'rgba(0,0,0,0)',
                            shadowBlur:2,
                            shadowOffset:{x:20, y:20},
                        };
                    
                        
                        this.parameter = {};
                        this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities();} }(this);
                        this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities();} }(this);
                        this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities();} }(this);
                        this.parameter.size = function(shape){ return function(a){if(a==undefined){return shape.size;} shape.size = a; shape.computeExtremities();} }(this);
                    
                    
                    
                    
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
                        this.computeExtremities = function(offset){
                            //discover if this shape should be static
                                var isStatic = this.static;
                                var tmp = this;
                                while((tmp = tmp.parent) != undefined && !isStatic){
                                    isStatic = isStatic || tmp.static;
                                }
                                this.static = isStatic;
                    
                            //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                            //in which case; gather the offset of all parents. Otherwise just use what was provided
                                offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                            //reset variables
                                this.extremities = {
                                    points:[],
                                    boundingBox:{},
                                };
                    
                            //calculate points
                                this.extremities.points = workspace.library.math.pointsOfText( this.text, this.x, this.y, this.angle, 1/this.size, this.style.font, this.style.align, this.style.baseline );
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = workspace.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = workspace.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return workspace.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                        }
                        this.isPointWithin = function(x,y){
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                    
                        function shouldRender(shape){ 
                            //if this shape is static, always render
                                if(shape.static){return true;}
                                
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return workspace.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            // //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                            //     if(!shouldRender(this)){return;}
                            // getting the bounding box of text is too faulty. For now, text is always  //
                            // rendered. Group's still de-render however, and are using the faulty text //
                            // bouding box values to calculate their extremities; so one should use     //
                            // backings of other shapes to maintain rendering consistancy.              //
                    
                            //adjust offset for parent's angle
                                var point = workspace.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    location:{
                                        x:(this.x+offset.x),
                                        y:(this.y+offset.y)
                                    },
                                    size: this.size,
                                    angle:(this.angle+offset.a),
                                    lineWidth: this.style.lineWidth,
                                    shadowBlur: this.style.shadowBlur,
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                if(!static){
                                    shapeValue.location = adapter.workspacePoint2windowPoint( shapeValue.location.x, shapeValue.location.y );   
                            
                                    shapeValue.size = adapter.length(shapeValue.size);
                                    shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                    shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                    shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                                }
                    
                            //post adaptation calculations
                                shapeValue.location = workspace.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                    
                            //clipping
                                if(isClipper){
                                    console.warn('no clipping available for text shape');
                                    return;
                                }
                    
                            //actual render
                                context.font = this.style.font;
                                context.textAlign = this.style.align;
                                context.textBaseline = this.style.baseline;
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
                                context.save();
                                context.rotate( shapeValue.angle );
                                context.scale(shapeValue.size,shapeValue.size);
                                context.fillText( this.text, shapeValue.location.x/shapeValue.size, shapeValue.location.y/shapeValue.size );
                                context.shadowColor = 'rgba(0,0,0,0)'; //to stop stroke shadows drawing over the fill text (an uncreative solution)
                                context.strokeText( this.text, shapeValue.location.x/shapeValue.size, shapeValue.location.y/shapeValue.size );
                                context.restore();
                    
                            //if dotFrame is set, draw in dots fot the points and bounding box extremities
                                if(this.dotFrame){
                                    //points
                                        for(var a = 0; a < this.extremities.points.length; a++){
                                            var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                                            core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                                        }
                                    //bounding box
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                                        core.render.drawDot( temp.x, temp.y );
                                        var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                                        core.render.drawDot( temp.x, temp.y );
                                }
                        };
                    };
                }
                function gatherParentOffset(element){
                    var offset = {x:0,y:0,a:0};
                        //gather x, y, and angle data from this element up
                            var offsetList = [];
                            var temp = element;
                            while((temp=temp.parent) != undefined){
                                offsetList.unshift( {x:temp.x, y:temp.y, a:temp.angle} );
                            }
                
                        //calculate them together into an offset
                            offset = { 
                                x: offsetList[0]!=undefined ? offsetList[0].x : 0,
                                y: offsetList[0]!=undefined ? offsetList[0].y : 0,
                                a: offsetList[0]!=undefined ? offsetList[0].a : 0,
                            };
                            for(var a = 1; a < offsetList.length; a++){
                                var point = workspace.library.math.cartesianAngleAdjust(offsetList[a].x,offsetList[a].y,offsetList[a-1].a);
                                offset.a += offsetList[a].a;
                                offset.x += point.x;
                                offset.y += point.y;
                            }
                
                    return offset;
                }
                
                
                
                
                
                this.arrangement = new function(){
                    var design = new shapes.group;
                    design.name = 'root';
                
                    this.createElement = function(type){ return new shapes[type]; };
                    this.clear = function(){ design.clear(); };
                    this.get = function(){return design;};
                    this.set = function(arrangement){design = arrangement;};
                    this.prepend = function(element){ design.prepend(element); };
                    this.append = function(element){ design.append(element); };
                    this.remove = function(element){ design.remove(element); };
                    this.getElementUnderPoint = function(x,y,static=false,getList=false){ return design.getElementUnderPoint(x,y,static,getList); };
                    this.getElementsWithName = function(name){ return design.getElementsWithName(name); };
                };
                this.viewport = new function(){
                    var pageData = {
                        defaultSize:{width:640, height:480},
                        width:0, height:0,
                        windowWidth:0, windowHeight:0,
                    };
                    var state = {
                        position:{x:0,y:0},
                        scale:window.devicePixelRatio,
                        angle:0,
                        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
                        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
                    };
                    var mouseData = { 
                        x:undefined, 
                        y:undefined, 
                        stopScrollActive:false,
                    };
                    var allowKeyboardInput = true;
                
                    function adjustCanvasSize(){
                        var changesMade = false;
                
                        function dimensionAdjust(direction){
                            var Direction = direction.charAt(0).toUpperCase() + direction.slice(1)
                
                            var attribute = workspace.getAttribute('workspace'+Direction);
                            if( pageData[direction] != attribute || pageData['window'+Direction] != window['inner'+Direction] ){
                                //save values for future reference
                                    pageData[direction] = attribute;
                                    pageData['window'+Direction] = window['inner'+Direction];
                
                                //adjust canvas dimension based on the size requirement set out in the workspace attribute
                                    if(attribute == undefined){
                                        workspace[direction] = pageData.defaultSize[direction] * window.devicePixelRatio;
                                        workspace.style[direction] = pageData.defaultSize[direction] + "px";
                                    }else if( attribute.indexOf('%') == (attribute.length-1) ){
                                        var parentSize = workspace.parentElement['offset'+Direction]
                                        var percent = parseFloat(attribute.slice(0,(attribute.length-1))) / 100;
                                        workspace[direction] = parentSize * percent * window.devicePixelRatio;
                                        workspace.style[direction] = parentSize * percent + "px";
                                    }else{
                                        workspace[direction] = attribute * window.devicePixelRatio;
                                        workspace.style[direction] = attribute;
                                    }
                
                                changesMade = true;
                            }
                        }
                
                        dimensionAdjust('width');
                        dimensionAdjust('height');
                
                        if(changesMade){ calculateViewportExtremities(); }
                    }
                    function calculateViewportExtremities(){
                        //for each corner of the viewport; find out where they lie on the workspace
                            state.points.tl = adapter.windowPoint2workspacePoint(0,0);
                            state.points.tr = adapter.windowPoint2workspacePoint(workspace.width,0);
                            state.points.bl = adapter.windowPoint2workspacePoint(0,workspace.height);
                            state.points.br = adapter.windowPoint2workspacePoint(workspace.width,workspace.height);
                        
                        //calculate a bounding box for the viewport from these points
                            state.boundingBox = workspace.library.math.boundingBoxFromPoints([state.points.tl, state.points.tr, state.points.br, state.points.bl]);
                    }
                
                    this.position = function(x,y){
                        if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
                        state.position.x = x;
                        state.position.y = y;
                        calculateViewportExtremities();
                    };
                    this.scale = function(s){
                        if(s == undefined){return state.scale;}
                        state.scale = s == 0 ? window.devicePixelRatio : s;
                        calculateViewportExtremities();
                    };
                    this.angle = function(a){
                        if(a == undefined){return state.angle;}
                        state.angle = a;
                        calculateViewportExtremities();
                    };
                    this.windowPoint2workspacePoint = function(x,y){ return adapter.windowPoint2workspacePoint(x,y); };
                
                    this.refresh = function(){
                        adjustCanvasSize();
                        calculateViewportExtremities();
                        this.allowKeyboardInput(allowKeyboardInput);
                    };
                    this.getBoundingBox = function(){return state.boundingBox;};
                    this.mousePosition = function(x,y){
                        if(x == undefined || y == undefined){return {x:mouseData.x, y:mouseData.y};}
                        mouseData.x = x;
                        mouseData.y = y;
                    };
                    this.stopMouseScroll = function(bool){
                        if(bool == undefined){return mouseData.stopScrollActive;}
                        mouseData.stopScrollActive = bool;
                
                        //just incase; make sure that scrolling is allowed again when 'stopMouseScroll' is turned off
                        if(!bool){ document.body.style.overflow = ''; }
                    };
                    this.allowKeyboardInput = function(bool){
                        if(bool == undefined){return allowKeyboardInput;}
                        allowKeyboardInput = bool;
                
                        if(allowKeyboardInput){workspace.setAttribute('tabIndex',1);}else{workspace.removeAttribute('tabIndex');}
                    };
                    this.cursor = function(type){
                        //cursor types: https://www.w3schools.com/csSref/tryit.asp?filename=trycss_cursor
                        if(type == undefined){return document.body.style.cursor;}
                        document.body.style.cursor = type;
                    };
                };
                this.render = new function(){
                    var context = workspace.getContext('2d', { alpha: false });
                    var animationRequestId = undefined;
                
                    function clearFrame(){
                        context.fillStyle = 'rgb(255,255,255)';
                        context.fillRect(0, 0, workspace.width, workspace.height);
                    }
                    function renderFrame(noClear=false){
                        //clear the canvas
                            if(!noClear){ clearFrame(); }
                
                        //activate root groups render function
                            core.arrangement.get().render(context);
                    }
                    function animate(timestamp){
                        animationRequestId = requestAnimationFrame(animate);
                
                        //attempt to render frame, if there is a failure; stop animation loop and report the error
                            var error = undefined;
                            try{
                                renderFrame();
                            }catch(error){
                                core.render.active(false);
                                console.error('major animation error');
                                console.error(error);
                            }
                
                        //perform stats collection
                            core.stats.collect(timestamp);
                    }
                
                    this.drawDot = function(x,y,r=2,colour='rgba(150,150,255,1)'){
                        context.fillStyle = colour;
                        context.beginPath();
                        context.arc(x,y, r, 0, 2*Math.PI, false);
                        context.closePath(); 
                        context.fill();
                    };
                
                    this.frame = function(noClear=false){renderFrame(noClear);};
                    this.active = function(bool){
                        if(bool == undefined){return animationRequestId!=undefined;}
                
                        if(bool){
                            if(animationRequestId != undefined){return;}
                            animate();
                        }else{
                            if(animationRequestId == undefined){return;}
                            cancelAnimationFrame(animationRequestId);
                            animationRequestId = undefined;
                        }
                    };
                };
                this.stats = new function(){
                    var active = false;
                    var average = 30;
                    var lastTimestamp = 0;
                
                    var framesPerSecond = {
                        compute:function(timestamp){
                            this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
                            if( this.frameTimeArray.length >= average){ this.frameTimeArray.shift(); }
                
                            this.rate = workspace.library.math.averageArray( this.frameTimeArray );
                
                            lastTimestamp = timestamp;
                        },
                        counter:0,
                        frameTimeArray:[],
                        rate:0,
                    };
                    var shapeCount = {
                        recursiveCount:function(item){
                            if(item == undefined){
                                this.counts = {
                                    total:0, 
                                    canvas:0,    circle:0,
                                    group:0,     image:0,
                                    path:0,      polygon:0,
                                    rectangle:0, text:0,
                                };
                                item = workspace.core.arrangement.get();
                            }
                
                            this.counts.total++;
                            switch(item.type){
                                case 'canvas':    this.counts.canvas++;    break;
                                case 'circle':    this.counts.circle++;    break;
                                case 'group':     this.counts.group++;     break;
                                case 'image':     this.counts.image++;     break;
                                case 'path':      this.counts.path++;      break;
                                case 'polygon':   this.counts.polygon++;   break;
                                case 'rectangle': this.counts.rectangle++; break;
                                case 'text':      this.counts.text++;      break;
                            }
                
                            if(item.children != undefined){
                                for(var a = 0; a < item.children.length; a++){
                                    this.recursiveCount( item.children[a] );
                                }
                            }
                        },
                        recursivePrint:function(item,spacing=''){
                            if(item == undefined){item = workspace.core.arrangement.get()}
                
                            console.log( spacing + item.name );
                
                            if(item.children != undefined){
                                for(var a = 0; a < item.children.length; a++){
                                    this.recursivePrint( item.children[a], spacing+'- ' );
                                }
                            }
                        },
                        counts:{
                            total:0, 
                            canvas:0,    circle:0,
                            group:0,     image:0,
                            path:0,      polygon:0,
                            rectangle:0, text:0,
                        }
                    };
                
                    this.collect = function(timestamp){
                        //if stats are turned off, just bail
                            if(!active){return;}
                
                        framesPerSecond.compute(timestamp);
                    };
                    this.active = function(bool){if(bool==undefined){return active;} active=bool;};
                    this.getReport = function(){
                        shapeCount.recursiveCount();
                        return {
                            framesPerSecond: framesPerSecond.rate,
                            shapeCount: shapeCount.counts,
                        };
                    };
                };
                this.callback = new function(){
                    var callbacks = [
                        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
                        'onkeydown', 'onkeyup',
                        'touchstart', 'touchmove', 'touchend', 'touchenter', 'touchleave', 'touchcancel',
                    ];
                
                    for(var a = 0; a < callbacks.length; a++){
                        //interface
                            this[callbacks[a]] = function(x,y,event){};
                
                        //attachment to canvas
                            var lastPoint = {x:0,y:0};
                            function getRelevantShape(x,y,callback){
                                //find the frontmost shape under this point
                                    var shape = core.arrangement.getElementUnderPoint(x,y);
                
                                //if the shape found doesn't have an appropriate callback, get the list of all shapes that 
                                //this point touches, and find the one that does (in order of front to back)
                                //if none is found, just return the frontmost shape
                                    if(shape != undefined && shape[callback] == undefined){
                                        var shapeList = core.arrangement.getElementUnderPoint(x,y,undefined,true);
                                        for(var a = 0; a < shapeList.length; a++){
                                            if( shapeList[a][callback] != undefined ){ shape = shapeList[a]; break; }
                                        }
                                    }
                
                                return shape;
                            }
                
                            //default
                                workspace[callbacks[a]] = function(callback){
                                    return function(event){
                                        //if core doesn't have this callback set up, just bail
                                            if( !core.callback[callback] ){return;}
                
                                        //convert the point
                                            var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                
                                        //get the shape under this point that has this callback (if no shape
                                        //meeting that criteria is found, just return the frontmost shape)
                                            var shape = getRelevantShape(p.x,p.y,callback);
                                    
                                        //activate core's callback, providing the converted point, original event, and shape
                                            core.callback[callback](p.x,p.y,event,shape);
                                    }
                                }(callbacks[a]);
                
                            //special cases
                                workspace.onmouseover = function(event){
                                    var callback = 'onmouseover';
                
                                    //if appropriate, remove the window scrollbars
                                        if(core.viewport.stopMouseScroll()){ document.body.style.overflow = 'hidden'; }
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                
                                    //convert the point
                                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                
                                    //get the shape under this point that has this callback (if no shape
                                    //meeting that criteria is found, just return the frontmost shape)
                                        var shape = getRelevantShape(p.x,p.y,callback);
                                
                                    //activate core's callback, providing the converted point, original event, and shape
                                        core.callback[callback](p.x,p.y,event,shape);
                                };
                                workspace.onmouseout = function(event){
                                    var callback = 'onmouseout';
                
                                    //if appropriate, replace the window scrollbars
                                        if(core.viewport.stopMouseScroll()){ document.body.style.overflow = ''; }
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                
                                    //convert the point
                                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                
                                    //get the shape under this point that has this callback (if no shape
                                    //meeting that criteria is found, just return the frontmost shape)
                                        var shape = getRelevantShape(p.x,p.y,callback);
                                
                                    //activate core's callback, providing the converted point, original event, and shape
                                        core.callback[callback](p.x,p.y,event,shape);
                                };
                                workspace.onmousemove = function(event){
                                    var callback = 'onmousemove';
                
                                    //convert the point
                                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                
                                    //update the stored mouse position (used in keydown callbacks)
                                        core.viewport.mousePosition(p.x,p.y);
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                
                                    //get the shapes under this point that have the callbacks "onmouseleave",
                                    //"onmouseenter" and "onmousemove" However; use the 'lastPoint' for "onmouseleave"
                                    //(as usual - for each callback - if no shape meeting that criteria is found,
                                    //just return the frontmost shape)
                                        var shape_mouseleave = getRelevantShape(lastPoint.x,lastPoint.y,'onmouseleave');
                                        var shape_mouseenter = getRelevantShape(p.x,p.y,'onmouseenter');
                                        var shape_mousemove = getRelevantShape(p.x,p.y,callback);
                                    
                                    //activate core's callbacks, providing the converted point, original event, and appropriate shape
                                    //(only activate the "onmouseenter" and "onmouseleave" callbacks, if the shapes found for them
                                    //are not the same)
                                        if( shape_mouseleave != shape_mouseenter ){
                                            core.callback['onmouseleave'](p.x,p.y,event,shape_mouseleave);
                                            core.callback['onmouseenter'](p.x,p.y,event,shape_mouseenter);
                                        }
                                        core.callback[callback](p.x,p.y,event,shape_mousemove);
                
                                    //update lastPoint data with the new point
                                        lastPoint = {x:p.x,y:p.y};
                                };
                
                                workspace.onkeydown = function(event){
                                    var callback = 'onkeydown';
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                
                                    //gather the last (converted) mouse point
                                        var p = core.viewport.mousePosition();
                
                                    //get the shape under this point that has this callback (if no shape
                                    //meeting that criteria is found, just return the frontmost shape)
                                        var shape = getRelevantShape(p.x,p.y,callback);
                                
                                    //activate core's callback, providing the converted point, original event, and shape
                                        core.callback[callback](p.x,p.y,event,shape);
                                };
                                workspace.onkeyup = function(event){
                                    var callback = 'onkeyup';
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                
                                    //gather the last (converted) mouse point
                                        var p = core.viewport.mousePosition();
                
                                    //get the shape under this point that has this callback (if no shape
                                    //meeting that criteria is found, just return the frontmost shape)
                                        var shape = getRelevantShape(p.x,p.y,callback);
                                
                                    //activate core's callback, providing the converted point, original event, and shape
                                        core.callback[callback](p.x,p.y,event,shape);
                                };
                
                    }
                };
                
                //initial viewport setup
                    core.viewport.refresh();
                    core.arrangement.clear();
            };
            var surface = this;
            
            this.arrangement = new function(){
                this.get = function(){return core.arrangement.get();};
                this.set = function(arrangement){return core.arrangement.set(arrangement);};
                this.createElement = function(type){return core.arrangement.createElement(type);};
                this.append = function(element){return core.arrangement.append(element);};
                this.prepend = function(element){return core.arrangement.prepend(element);};
                this.remove = function(element){return core.arrangement.remove(element);};
                this.getElementUnderPoint = function(x,y){return core.arrangement.getElementUnderPoint(x,y);};
                this.getElementsWithName = function(name){ return core.arrangement.getElementsWithName(name); };
                
                this.forceRefresh = function(element){return core.arrangement.forceRefresh(element);};
            };
            this.viewport = new function(){
                this.position = function(x,y){return core.viewport.position(x,y);};
                this.scale = function(s){return core.viewport.scale(s);};
                this.angle = function(a){return core.viewport.angle(a);};
                this.windowPoint2workspacePoint = function(x,y){ return core.viewport.windowPoint2workspacePoint(x,y); };
                this.refresh = function(){ core.viewport.refresh(); };
                this.mousePosition = function(){ return core.viewport.mousePosition();  };
                this.stopMouseScroll = function(bool){ return core.viewport.stopMouseScroll(bool); };
                this.allowKeyboardInput = function(bool){ return core.viewport.allowKeyboardInput(bool); };
                this.cursor = function(type){return core.viewport.cursor(type);};
            };
            this.render = new function(){
                this.frame = function(noClear=false){return core.render.frame(noClear);};
                this.active = function(bool){return core.render.active(bool);};
            };
            this.stats = new function(){
                this.active = function(bool){return core.stats.active(bool);};
                this.getReport = function(){return core.stats.getReport();};
            };
            this.callback = new function(){
                this.onmousedown = function(x,y,event,shape){};
                core.callback.onmousedown = function(surface){
                    return function(x,y,event,shape){ surface.onmousedown(x,y,event,shape); };
                }(this);
                this.onmouseup = function(x,y,event,shape){};
                core.callback.onmouseup = function(surface){
                    return function(x,y,event,shape){ surface.onmouseup(x,y,event,shape); };
                }(this);
                this.onmousemove = function(x,y,event,shape){};
                core.callback.onmousemove = function(surface){
                    return function(x,y,event,shape){ surface.onmousemove(x,y,event,shape); };
                }(this);
                this.onmouseenter = function(x,y,event,shape){};
                core.callback.onmouseenter = function(surface){
                    return function(x,y,event,shape){ surface.onmouseenter(x,y,event,shape); };
                }(this);
                this.onmouseleave = function(x,y,event,shape){};
                core.callback.onmouseleave = function(surface){
                    return function(x,y,event,shape){ surface.onmouseleave(x,y,event,shape); };
                }(this);
                this.onwheel = function(x,y,event,shape){};
                core.callback.onwheel = function(surface){
                    return function(x,y,event,shape){ surface.onwheel(x,y,event,shape); };
                }(this);
                this.onclick = function(x,y,event,shape){};
                core.callback.onclick = function(surface){
                    return function(x,y,event,shape){ surface.onclick(x,y,event,shape); };
                }(this);
                this.ondblclick = function(x,y,event,shape){};
                core.callback.ondblclick = function(surface){
                    return function(x,y,event,shape){ surface.ondblclick(x,y,event,shape); };
                }(this);
            
            
                this.onkeydown = function(x,y,event,shape){};
                core.callback.onkeydown = function(surface){
                    return function(x,y,event,shape){ surface.onkeydown(x,y,event,shape); };
                }(this);
                this.onkeyup = function(x,y,event,shape){};
                core.callback.onkeyup = function(surface){
                    return function(x,y,event,shape){ surface.onkeyup(x,y,event,shape); };
                }(this);
            
            
                this.touchstart = function(x,y,event){};
                core.callback.touchstart = function(surface){
                    return function(x,y,event,shape){ surface.touchstart(x,y,event); };
                }(this);
                this.touchmove = function(x,y,event){};
                core.callback.touchmove = function(surface){
                    return function(x,y,event,shape){ surface.touchmove(x,y,event); };
                }(this);
                this.touchend = function(x,y,event){};
                core.callback.touchend = function(surface){
                    return function(x,y,event,shape){ surface.touchend(x,y,event); };
                }(this);
                this.touchenter = function(x,y,event){};
                core.callback.touchenter = function(surface){
                    return function(x,y,event,shape){ surface.touchenter(x,y,event); };
                }(this);
                this.touchleave = function(x,y,event){};
                core.callback.touchleave = function(surface){
                    return function(x,y,event,shape){ surface.touchleave(x,y,event); };
                }(this);
                this.touchcancel = function(x,y,event){};
                core.callback.touchcancel = function(surface){
                    return function(x,y,event,shape){ surface.touchcancel(x,y,event); };
                }(this);
            };
        };
    }
}
