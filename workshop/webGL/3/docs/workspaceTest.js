// (function() {
    const __canvasPrefix = 'workspace';
    var __canvasElements = document.getElementsByTagName('canvas');
    for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
        if( __canvasElements[__canvasElements_count].hasAttribute(__canvasPrefix) ){
            var _canvas_ = __canvasElements[__canvasElements_count];
            
            // -- Only one test per time -- //
            _canvas_.library = new function(){
                var library = this;
                
                this.math = new function(){
                    this.cartesianAngleAdjust = function(x,y,angle){
                        function cartesian2polar(x,y){
                            var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;
                        
                            if(x === 0){
                                if(y === 0){ang = 0;}
                                else if(y > 0){ang = 0.5*Math.PI;}
                                else{ang = 1.5*Math.PI;}
                            }
                            else if(y === 0){
                                if(x >= 0){ang = 0;}else{ang = Math.PI;}
                            }
                            else if(x >= 0){ ang = Math.atan(y/x); }
                            else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }
                        
                            return {'dis':dis,'ang':ang};
                        };
                        function polar2cartesian(angle,distance){
                            return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
                        };
                    
                        if(angle == 0 || angle%(Math.PI*2) == 0){ return {x:x,y:y}; }
                        var polar = cartesian2polar( x, y );
                        polar.ang += angle;
                        return polar2cartesian( polar.ang, polar.dis );
                    };
                    this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
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
                    this.detectOverlap = new function(){
                        this.boundingBoxes = function(a, b){
                            return !(
                                (a.bottomRight.y < b.topLeft.y) ||
                                (a.topLeft.y > b.bottomRight.y) ||
                                (a.bottomRight.x < b.topLeft.x) ||
                                (a.topLeft.x > b.bottomRight.x) );
                        };
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
                        this.overlappingPolygonWithPolygons = function(poly,polys){ 
                            for(var a = 0; a < polys.length; a++){
                                if(this.boundingBoxes(poly.boundingBox, polys[a].boundingBox)){
                                    if(this.overlappingPolygons(poly.points, polys[a].points)){
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };
                    };
                    this.getIndexOfSequence = function(array,sequence){
                        var index = 0;
                        for(index = 0; index < array.length; index++){
                            if( array[index] == sequence[0] ){
                    
                                var match = true;
                                for(var a = 1; a < sequence.length; a++){
                                    if( array[index+a] != sequence[a] ){
                                        match = false;
                                        break;
                                    }
                                }
                                if(match){return index;}
                    
                            }
                        }
                    
                        return undefined;
                    };
                    this.getDifferenceOfArrays = function(array_a,array_b){
                        var out_a = []; var out_b = [];
                    
                        for(var a = 0; a < array_a.length; a++){
                            if(array_b.indexOf(array_a[a]) == -1){ out_a.push(array_a[a]); }
                        }
                    
                        for(var b = 0; b < array_b.length; b++){
                            if(array_a.indexOf(array_b[b]) == -1){ out_b.push(array_b[b]); }
                        }
                    
                        return {a:out_a,b:out_b};
                    };
                    this.getAngleOfTwoPoints = function(point_1,point_2){
                        var xDelta = point_2.x - point_1.x;
                        var yDelta = point_2.y - point_1.y;
                        var angle = Math.atan( yDelta/xDelta );
                    
                        if(xDelta < 0){ angle = Math.PI + angle; }
                        else if(yDelta < 0){ angle = Math.PI*2 + angle; }
                    
                        return angle;
                    };
                    this.pathToPolygonGenerator = function(path,thickness){
                        var jointData = [];
                    
                        //parse path
                            for(var a = 0; a < path.length/2; a++){
                                jointData.push({ point:{ x:path[a*2], y:path[a*2 +1] } });
                            }
                        //calculate egment angles, joing angles, wing angles and wing widths; then generate wing points
                            var outputPoints = [];
                            for(var a = 0; a < jointData.length; a++){
                                var item = jointData[a];
                    
                                //calculate segment angles
                                    if( a != jointData.length-1 ){
                                        var tmp = _canvas_.library.math.getAngleOfTwoPoints( jointData[a].point, jointData[a+1].point );
                                        if(jointData[a] != undefined){jointData[a].departAngle = tmp;}
                                        if(jointData[a+1] != undefined){jointData[a+1].implimentAngle = tmp;}
                                    }
                    
                                //joing angles
                                    var joiningAngle = item.departAngle == undefined || item.implimentAngle == undefined ? Math.PI : item.departAngle - item.implimentAngle + Math.PI;
                    
                                //angle
                                    var segmentAngle = item.implimentAngle != undefined ? item.implimentAngle : item.departAngle;
                                    var wingAngle = segmentAngle + joiningAngle/2;
                    
                                //width
                                    var div = a == 0 || a == jointData.length-1 ? 1 : Math.sin(joiningAngle/2);
                                    var wingWidth = thickness / div;
                    
                                //wing points
                                    var plus =  _canvas_.library.math.cartesianAngleAdjust(0,  wingWidth, Math.PI/2 + wingAngle);
                                    var minus = _canvas_.library.math.cartesianAngleAdjust(0, -wingWidth, Math.PI/2 + wingAngle);
                                    outputPoints.push( plus.x+ item.point.x, plus.y+ item.point.y );
                                    outputPoints.push( minus.x+item.point.x, minus.y+item.point.y );
                            }
                    
                        return outputPoints;
                    };
                    this.loopedPathToPolygonGenerator = function(path,thickness){
                        var joinPoint = [ (path[0]+path[2])/2, (path[1]+path[3])/2 ];
                        var loopingPath = [];
                    
                        loopingPath = loopingPath.concat(joinPoint);
                        for(var a = 2; a < path.length; a+=2){
                            loopingPath = loopingPath.concat( [path[a], path[a+1]] );
                        }
                        loopingPath = loopingPath.concat( [path[0], path[1]] );
                        loopingPath = loopingPath.concat(joinPoint);
                    
                        return this.pathToPolygonGenerator(loopingPath,thickness);
                    };
                    this.relativeDistance = function(realLength, start,end, d, allowOverflow=false){
                        var mux = (d - start)/(end - start);
                        if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
                        return mux*realLength;
                    };
                    this.blendColours = function(rgba_1,rgba_2,ratio){
                        return {
                            r: (1-ratio)*rgba_1.r + ratio*rgba_2.r,
                            g: (1-ratio)*rgba_1.g + ratio*rgba_2.g,
                            b: (1-ratio)*rgba_1.b + ratio*rgba_2.b,
                            a: (1-ratio)*rgba_1.a + ratio*rgba_2.a,
                        };           
                    };
                    this.multiBlendColours = function(rgbaList,ratio){
                        //special cases
                            if(ratio == 0){return rgbaList[0];}
                            if(ratio == 1){return rgbaList[rgbaList.length-1];}
                        //calculate the start colour and ratio(represented by as "colourIndex.ratio"), then blend
                            var p = ratio*(rgbaList.length-1);
                            return library.math.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
                    };
                };
                this.gsls = new function(){
                    this.geometry = `
                        #define PI 3.141592653589793
                    
                        vec2 cartesian2polar(vec2 xy){
                            float dis = pow(pow(xy.x,2.0)+pow(xy.y,2.0),0.5);
                            float ang = 0.0;
                    
                            if(xy.x == 0.0){
                                if(xy.y == 0.0){ang = 0.0;}
                                else if(xy.y > 0.0){ang = 0.5*PI;}
                                else{ang = 1.5*PI;}
                            }
                            else if(xy.y == 0.0){
                                if(xy.x >= 0.0){ang = 0.0;}else{ang = PI;}
                            }
                            else if(xy.x >= 0.0){ ang = atan(xy.y/xy.x); }
                            else{ /*if(xy.x < 0.0)*/ ang = atan(xy.y/xy.x) + PI; }
                    
                            return vec2(ang,dis);
                        }
                        vec2 polar2cartesian(vec2 ad){
                            return vec2( ad[1]*cos(ad[0]), ad[1]*sin(ad[0]) );
                        }
                        vec2 cartesianAngleAdjust(vec2 xy, float angle){
                            if(angle == 0.0 || mod(angle,PI*2.0) == 0.0){ return xy; }
                    
                            vec2 polar = cartesian2polar( xy );
                            polar[0] += angle;
                            return polar2cartesian( polar );
                        }
                    `;
                };
                this.structure = new function(){
                    this.functionListRunner = function(list,activeKeys){
                        //function builder for working with the 'functionList' format
                    
                        return function(event,data){
                            //run through function list, and activate functions where necessary
                                for(var a = 0; a < list.length; a++){
                                    var shouldRun = true;
                    
                                    //determine if the requirements of this function are met
                                        for(var b = 0; b < list[a].requiredKeys.length; b++){
                                            shouldRun = true;
                                            for(var c = 0; c < list[a].requiredKeys[b].length; c++){
                                                shouldRun = shouldRun && activeKeys[ list[a].requiredKeys[b][c] ];
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
                this.audio = new function(){
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
                                        var array = library.math.curveGenerator.s(10);
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
                                        library.audio.context.decodeAudioData(this.response, function(data){
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
                                            library.audio.context.decodeAudioData(data.target.result, function(buffer){
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
                                    library.math.largestValueFound(
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
                            library.audio.changeAudioParam(library.audio.context, this.gain, this._gain, 0.01, 'instant', true);
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
                // this.misc = new function(){
                // };
                this.thirdparty = new function(){
                    this.earcut = function(points){
                        var outputPoints = [];
                        earcut(points).forEach(function(a){ outputPoints = outputPoints.concat([ points[(a*2)],points[(a*2)+1] ]); });
                        return outputPoints;
                    
                        //https://github.com/mapbox/earcut
                        function earcut(data, holeIndices, dim) {
                    
                            dim = dim || 2;
                    
                            var hasHoles = holeIndices && holeIndices.length,
                                outerLen = hasHoles ? holeIndices[0] * dim : data.length,
                                outerNode = linkedList(data, 0, outerLen, dim, true),
                                triangles = [];
                    
                            if (!outerNode || outerNode.next === outerNode.prev) return triangles;
                    
                            var minX, minY, maxX, maxY, x, y, invSize;
                    
                            if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
                    
                            // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
                            if (data.length > 80 * dim) {
                                minX = maxX = data[0];
                                minY = maxY = data[1];
                    
                                for (var i = dim; i < outerLen; i += dim) {
                                    x = data[i];
                                    y = data[i + 1];
                                    if (x < minX) minX = x;
                                    if (y < minY) minY = y;
                                    if (x > maxX) maxX = x;
                                    if (y > maxY) maxY = y;
                                }
                    
                                // minX, minY and invSize are later used to transform coords into integers for z-order calculation
                                invSize = Math.max(maxX - minX, maxY - minY);
                                invSize = invSize !== 0 ? 1 / invSize : 0;
                            }
                    
                            earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
                    
                            return triangles;
                        }
                    
                        // create a circular doubly linked list from polygon points in the specified winding order
                        function linkedList(data, start, end, dim, clockwise) {
                            var i, last;
                    
                            if (clockwise === (signedArea(data, start, end, dim) > 0)) {
                                for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
                            } else {
                                for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
                            }
                    
                            if (last && equals(last, last.next)) {
                                removeNode(last);
                                last = last.next;
                            }
                    
                            return last;
                        }
                    
                        // eliminate colinear or duplicate points
                        function filterPoints(start, end) {
                            if (!start) return start;
                            if (!end) end = start;
                    
                            var p = start,
                                again;
                            do {
                                again = false;
                    
                                if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
                                    removeNode(p);
                                    p = end = p.prev;
                                    if (p === p.next) break;
                                    again = true;
                    
                                } else {
                                    p = p.next;
                                }
                            } while (again || p !== end);
                    
                            return end;
                        }
                    
                        // main ear slicing loop which triangulates a polygon (given as a linked list)
                        function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
                            if (!ear) return;
                    
                            // interlink polygon nodes in z-order
                            if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
                    
                            var stop = ear,
                                prev, next;
                    
                            // iterate through ears, slicing them one by one
                            while (ear.prev !== ear.next) {
                                prev = ear.prev;
                                next = ear.next;
                    
                                if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
                                    // cut off the triangle
                                    triangles.push(prev.i / dim);
                                    triangles.push(ear.i / dim);
                                    triangles.push(next.i / dim);
                    
                                    removeNode(ear);
                    
                                    // skipping the next vertex leads to less sliver triangles
                                    ear = next.next;
                                    stop = next.next;
                    
                                    continue;
                                }
                    
                                ear = next;
                    
                                // if we looped through the whole remaining polygon and can't find any more ears
                                if (ear === stop) {
                                    // try filtering points and slicing again
                                    if (!pass) {
                                        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
                    
                                    // if this didn't work, try curing all small self-intersections locally
                                    } else if (pass === 1) {
                                        ear = cureLocalIntersections(ear, triangles, dim);
                                        earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
                    
                                    // as a last resort, try splitting the remaining polygon into two
                                    } else if (pass === 2) {
                                        splitEarcut(ear, triangles, dim, minX, minY, invSize);
                                    }
                    
                                    break;
                                }
                            }
                        }
                    
                        // check whether a polygon node forms a valid ear with adjacent nodes
                        function isEar(ear) {
                            var a = ear.prev,
                                b = ear,
                                c = ear.next;
                    
                            if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
                    
                            // now make sure we don't have other points inside the potential ear
                            var p = ear.next.next;
                    
                            while (p !== ear.prev) {
                                if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                                    area(p.prev, p, p.next) >= 0) return false;
                                p = p.next;
                            }
                    
                            return true;
                        }
                    
                        function isEarHashed(ear, minX, minY, invSize) {
                            var a = ear.prev,
                                b = ear,
                                c = ear.next;
                    
                            if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
                    
                            // triangle bbox; min & max are calculated like this for speed
                            var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
                                minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
                                maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
                                maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);
                    
                            // z-order range for the current triangle bbox;
                            var minZ = zOrder(minTX, minTY, minX, minY, invSize),
                                maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
                    
                            var p = ear.prevZ,
                                n = ear.nextZ;
                    
                            // look for points inside the triangle in both directions
                            while (p && p.z >= minZ && n && n.z <= maxZ) {
                                if (p !== ear.prev && p !== ear.next &&
                                    pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                                    area(p.prev, p, p.next) >= 0) return false;
                                p = p.prevZ;
                    
                                if (n !== ear.prev && n !== ear.next &&
                                    pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                                    area(n.prev, n, n.next) >= 0) return false;
                                n = n.nextZ;
                            }
                    
                            // look for remaining points in decreasing z-order
                            while (p && p.z >= minZ) {
                                if (p !== ear.prev && p !== ear.next &&
                                    pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                                    area(p.prev, p, p.next) >= 0) return false;
                                p = p.prevZ;
                            }
                    
                            // look for remaining points in increasing z-order
                            while (n && n.z <= maxZ) {
                                if (n !== ear.prev && n !== ear.next &&
                                    pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                                    area(n.prev, n, n.next) >= 0) return false;
                                n = n.nextZ;
                            }
                    
                            return true;
                        }
                    
                        // go through all polygon nodes and cure small local self-intersections
                        function cureLocalIntersections(start, triangles, dim) {
                            var p = start;
                            do {
                                var a = p.prev,
                                    b = p.next.next;
                    
                                if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
                    
                                    triangles.push(a.i / dim);
                                    triangles.push(p.i / dim);
                                    triangles.push(b.i / dim);
                    
                                    // remove two nodes involved
                                    removeNode(p);
                                    removeNode(p.next);
                    
                                    p = start = b;
                                }
                                p = p.next;
                            } while (p !== start);
                    
                            return p;
                        }
                    
                        // try splitting polygon into two and triangulate them independently
                        function splitEarcut(start, triangles, dim, minX, minY, invSize) {
                            // look for a valid diagonal that divides the polygon into two
                            var a = start;
                            do {
                                var b = a.next.next;
                                while (b !== a.prev) {
                                    if (a.i !== b.i && isValidDiagonal(a, b)) {
                                        // split the polygon in two by the diagonal
                                        var c = splitPolygon(a, b);
                    
                                        // filter colinear points around the cuts
                                        a = filterPoints(a, a.next);
                                        c = filterPoints(c, c.next);
                    
                                        // run earcut on each half
                                        earcutLinked(a, triangles, dim, minX, minY, invSize);
                                        earcutLinked(c, triangles, dim, minX, minY, invSize);
                                        return;
                                    }
                                    b = b.next;
                                }
                                a = a.next;
                            } while (a !== start);
                        }
                    
                        // link every hole into the outer loop, producing a single-ring polygon without holes
                        function eliminateHoles(data, holeIndices, outerNode, dim) {
                            var queue = [],
                                i, len, start, end, list;
                    
                            for (i = 0, len = holeIndices.length; i < len; i++) {
                                start = holeIndices[i] * dim;
                                end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                                list = linkedList(data, start, end, dim, false);
                                if (list === list.next) list.steiner = true;
                                queue.push(getLeftmost(list));
                            }
                    
                            queue.sort(compareX);
                    
                            // process holes from left to right
                            for (i = 0; i < queue.length; i++) {
                                eliminateHole(queue[i], outerNode);
                                outerNode = filterPoints(outerNode, outerNode.next);
                            }
                    
                            return outerNode;
                        }
                    
                        function compareX(a, b) {
                            return a.x - b.x;
                        }
                    
                        // find a bridge between vertices that connects hole with an outer ring and and link it
                        function eliminateHole(hole, outerNode) {
                            outerNode = findHoleBridge(hole, outerNode);
                            if (outerNode) {
                                var b = splitPolygon(outerNode, hole);
                                filterPoints(b, b.next);
                            }
                        }
                    
                        // David Eberly's algorithm for finding a bridge between hole and outer polygon
                        function findHoleBridge(hole, outerNode) {
                            var p = outerNode,
                                hx = hole.x,
                                hy = hole.y,
                                qx = -Infinity,
                                m;
                    
                            // find a segment intersected by a ray from the hole's leftmost point to the left;
                            // segment's endpoint with lesser x will be potential connection point
                            do {
                                if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
                                    var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                                    if (x <= hx && x > qx) {
                                        qx = x;
                                        if (x === hx) {
                                            if (hy === p.y) return p;
                                            if (hy === p.next.y) return p.next;
                                        }
                                        m = p.x < p.next.x ? p : p.next;
                                    }
                                }
                                p = p.next;
                            } while (p !== outerNode);
                    
                            if (!m) return null;
                    
                            if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint
                    
                            // look for points inside the triangle of hole point, segment intersection and endpoint;
                            // if there are no points found, we have a valid connection;
                            // otherwise choose the point of the minimum angle with the ray as connection point
                    
                            var stop = m,
                                mx = m.x,
                                my = m.y,
                                tanMin = Infinity,
                                tan;
                    
                            p = m.next;
                    
                            while (p !== stop) {
                                if (hx >= p.x && p.x >= mx && hx !== p.x &&
                                        pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
                    
                                    tan = Math.abs(hy - p.y) / (hx - p.x); // tangential
                    
                                    if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                                        m = p;
                                        tanMin = tan;
                                    }
                                }
                    
                                p = p.next;
                            }
                    
                            return m;
                        }
                    
                        // interlink polygon nodes in z-order
                        function indexCurve(start, minX, minY, invSize) {
                            var p = start;
                            do {
                                if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
                                p.prevZ = p.prev;
                                p.nextZ = p.next;
                                p = p.next;
                            } while (p !== start);
                    
                            p.prevZ.nextZ = null;
                            p.prevZ = null;
                    
                            sortLinked(p);
                        }
                    
                        // Simon Tatham's linked list merge sort algorithm
                        // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
                        function sortLinked(list) {
                            var i, p, q, e, tail, numMerges, pSize, qSize,
                                inSize = 1;
                    
                            do {
                                p = list;
                                list = null;
                                tail = null;
                                numMerges = 0;
                    
                                while (p) {
                                    numMerges++;
                                    q = p;
                                    pSize = 0;
                                    for (i = 0; i < inSize; i++) {
                                        pSize++;
                                        q = q.nextZ;
                                        if (!q) break;
                                    }
                                    qSize = inSize;
                    
                                    while (pSize > 0 || (qSize > 0 && q)) {
                    
                                        if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                                            e = p;
                                            p = p.nextZ;
                                            pSize--;
                                        } else {
                                            e = q;
                                            q = q.nextZ;
                                            qSize--;
                                        }
                    
                                        if (tail) tail.nextZ = e;
                                        else list = e;
                    
                                        e.prevZ = tail;
                                        tail = e;
                                    }
                    
                                    p = q;
                                }
                    
                                tail.nextZ = null;
                                inSize *= 2;
                    
                            } while (numMerges > 1);
                    
                            return list;
                        }
                    
                        // z-order of a point given coords and inverse of the longer side of data bbox
                        function zOrder(x, y, minX, minY, invSize) {
                            // coords are transformed into non-negative 15-bit integer range
                            x = 32767 * (x - minX) * invSize;
                            y = 32767 * (y - minY) * invSize;
                    
                            x = (x | (x << 8)) & 0x00FF00FF;
                            x = (x | (x << 4)) & 0x0F0F0F0F;
                            x = (x | (x << 2)) & 0x33333333;
                            x = (x | (x << 1)) & 0x55555555;
                    
                            y = (y | (y << 8)) & 0x00FF00FF;
                            y = (y | (y << 4)) & 0x0F0F0F0F;
                            y = (y | (y << 2)) & 0x33333333;
                            y = (y | (y << 1)) & 0x55555555;
                    
                            return x | (y << 1);
                        }
                    
                        // find the leftmost node of a polygon ring
                        function getLeftmost(start) {
                            var p = start,
                                leftmost = start;
                            do {
                                if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
                                p = p.next;
                            } while (p !== start);
                    
                            return leftmost;
                        }
                    
                        // check if a point lies within a convex triangle
                        function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
                            return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
                                (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
                                (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
                        }
                    
                        // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
                        function isValidDiagonal(a, b) {
                            return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
                                locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
                        }
                    
                        // signed area of a triangle
                        function area(p, q, r) {
                            return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
                        }
                    
                        // check if two points are equal
                        function equals(p1, p2) {
                            return p1.x === p2.x && p1.y === p2.y;
                        }
                    
                        // check if two segments intersect
                        function intersects(p1, q1, p2, q2) {
                            if ((equals(p1, p2) && equals(q1, q2)) ||
                                (equals(p1, q2) && equals(p2, q1))) return true;
                            return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
                                area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
                        }
                    
                        // check if a polygon diagonal intersects any polygon segments
                        function intersectsPolygon(a, b) {
                            var p = a;
                            do {
                                if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                                        intersects(p, p.next, a, b)) return true;
                                p = p.next;
                            } while (p !== a);
                    
                            return false;
                        }
                    
                        // check if a polygon diagonal is locally inside the polygon
                        function locallyInside(a, b) {
                            return area(a.prev, a, a.next) < 0 ?
                                area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
                                area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
                        }
                    
                        // check if the middle point of a polygon diagonal is inside the polygon
                        function middleInside(a, b) {
                            var p = a,
                                inside = false,
                                px = (a.x + b.x) / 2,
                                py = (a.y + b.y) / 2;
                            do {
                                if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                                        (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
                                    inside = !inside;
                                p = p.next;
                            } while (p !== a);
                    
                            return inside;
                        }
                    
                        // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
                        // if one belongs to the outer ring and another to a hole, it merges it into a single ring
                        function splitPolygon(a, b) {
                            var a2 = new Node(a.i, a.x, a.y),
                                b2 = new Node(b.i, b.x, b.y),
                                an = a.next,
                                bp = b.prev;
                    
                            a.next = b;
                            b.prev = a;
                    
                            a2.next = an;
                            an.prev = a2;
                    
                            b2.next = a2;
                            a2.prev = b2;
                    
                            bp.next = b2;
                            b2.prev = bp;
                    
                            return b2;
                        }
                    
                        // create a node and optionally link it with previous one (in a circular doubly linked list)
                        function insertNode(i, x, y, last) {
                            var p = new Node(i, x, y);
                    
                            if (!last) {
                                p.prev = p;
                                p.next = p;
                    
                            } else {
                                p.next = last.next;
                                p.prev = last;
                                last.next.prev = p;
                                last.next = p;
                            }
                            return p;
                        }
                    
                        function removeNode(p) {
                            p.next.prev = p.prev;
                            p.prev.next = p.next;
                    
                            if (p.prevZ) p.prevZ.nextZ = p.nextZ;
                            if (p.nextZ) p.nextZ.prevZ = p.prevZ;
                        }
                    
                        function Node(i, x, y) {
                            // vertex index in coordinates array
                            this.i = i;
                    
                            // vertex coordinates
                            this.x = x;
                            this.y = y;
                    
                            // previous and next vertex nodes in a polygon ring
                            this.prev = null;
                            this.next = null;
                    
                            // z-order curve value
                            this.z = null;
                    
                            // previous and next nodes in z-order
                            this.prevZ = null;
                            this.nextZ = null;
                    
                            // indicates whether this is a steiner point
                            this.steiner = false;
                        }
                    
                        // return a percentage difference between the polygon area and its triangulation area;
                        // used to verify correctness of triangulation
                        earcut.deviation = function (data, holeIndices, dim, triangles) {
                            var hasHoles = holeIndices && holeIndices.length;
                            var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
                    
                            var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
                            if (hasHoles) {
                                for (var i = 0, len = holeIndices.length; i < len; i++) {
                                    var start = holeIndices[i] * dim;
                                    var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                                    polygonArea -= Math.abs(signedArea(data, start, end, dim));
                                }
                            }
                    
                            var trianglesArea = 0;
                            for (i = 0; i < triangles.length; i += 3) {
                                var a = triangles[i] * dim;
                                var b = triangles[i + 1] * dim;
                                var c = triangles[i + 2] * dim;
                                trianglesArea += Math.abs(
                                    (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                                    (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
                            }
                    
                            return polygonArea === 0 && trianglesArea === 0 ? 0 :
                                Math.abs((trianglesArea - polygonArea) / polygonArea);
                        };
                    
                        function signedArea(data, start, end, dim) {
                            var sum = 0;
                            for (var i = start, j = end - dim; i < end; i += dim) {
                                sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
                                j = i;
                            }
                            return sum;
                        }
                    
                        // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
                        earcut.flatten = function (data) {
                            var dim = data[0][0].length,
                                result = {vertices: [], holes: [], dimensions: dim},
                                holeIndex = 0;
                    
                            for (var i = 0; i < data.length; i++) {
                                for (var j = 0; j < data[i].length; j++) {
                                    for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
                                }
                                if (i > 0) {
                                    holeIndex += data[i - 1].length;
                                    result.holes.push(holeIndex);
                                }
                            }
                            return result;
                        };
                    };
                };
            };
            _canvas_.core = new function(){
                var core = this;
                
                _canvas_.setAttribute('tabIndex',1);
                
                this.shape = new function(){
                    this.library = new function(){
                        this.canvas = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'canvas'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{}, isChanged:true };
                                    this.ignored = false;
                        
                                //attributes pertinent to extremity calculation
                                    var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                                    var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                                    var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                                    var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                                    var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                                    var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                                    var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
                        
                                //subCanvas
                                    var subCanvas = { object:document.createElement('canvas'), context:undefined, resolution:1, isChanged:true };
                                    subCanvas.context = subCanvas.object.getContext('2d');
                        
                                    function updateDimentions(){
                                        subCanvas.object.setAttribute('width',width*subCanvas.resolution);
                                        subCanvas.object.setAttribute('height',height*subCanvas.resolution);
                                        subCanvas.isChanged = true;
                                    }
                                    updateDimentions();
                        
                                    this._ = subCanvas.context;
                                    this.$ = function(a){return a*subCanvas.resolution;};
                                    this.resolution = function(a){
                                        if(a == undefined){return subCanvas.resolution;}
                                        subCanvas.resolution = a;
                                        updateDimentions();
                                    };
                                    this.requestUpdate = function(){ subCanvas.isChanged = true; };
                        
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering
                                var points = [
                                    0,0,
                                    1,0,
                                    1,1,
                                    0,1,
                                ];
                                var vertexShaderSource = `
                                    //constants
                                        attribute vec2 point;
                        
                                    //variables
                                        struct location{
                                            vec2 xy;
                                            float scale;
                                            float angle;
                                        };
                                        uniform location adjust;
                        
                                        uniform vec2 resolution;
                                        uniform vec2 dimensions;
                                        uniform vec2 anchor;
                        
                                    //vertex/fragment shader transfer variables
                                        varying vec2 textureCoordinates;
                        
                                    void main(){
                                        //transfer point to fragment shader
                                            textureCoordinates = point;
                        
                                        //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                                        //(including scale adjust)
                                            vec2 P = point * dimensions * adjust.scale;
                                            P = vec2( P.x - dimensions.x*anchor.x, P.y - dimensions.y*anchor.y );
                                            P = vec2( 
                                                P.x*cos(adjust.angle) + P.y*sin(adjust.angle), 
                                                P.y*cos(adjust.angle) - P.x*sin(adjust.angle)
                                            );
                                            P += adjust.xy;
                        
                                        //convert from unit space to clipspace
                                            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                    }
                                `;
                                var fragmentShaderSource = `  
                                    precision mediump float;
                        
                                    uniform sampler2D textureImage;
                                    varying vec2 textureCoordinates;
                                                                                                
                                    void main(){
                                        gl_FragColor = texture2D(textureImage, textureCoordinates);
                                    }
                                `;
                                var pointBuffer;
                                var pointAttributeLocation;
                                var uniformLocations;
                                var subCanvasTexture;
                                function updateGLAttributes(context,adjust){
                                    //buffers
                                        //points
                                            if(pointBuffer == undefined){
                                                pointAttributeLocation = context.getAttribLocation(program, "point");
                                                pointBuffer = context.createBuffer();
                                                context.enableVertexAttribArray(pointAttributeLocation);
                                                context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                                context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                            }else{
                                                context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                                context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            }
                        
                                        //texture
                                            if(subCanvas.isChanged){
                                                subCanvas.isChanged = false;
                                                subCanvasTexture = context.createTexture();
                                                context.bindTexture(context.TEXTURE_2D, subCanvasTexture);
                                                context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE );
                                                context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE );
                                                context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST );
                                                context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST );
                                                context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, subCanvas.object);
                                            }else{
                                                context.bindTexture(context.TEXTURE_2D, subCanvasTexture);
                                            }
                        
                                    //uniforms
                                        if( uniformLocations == undefined ){
                                            uniformLocations = {
                                                "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                                "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                                "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                                "resolution": context.getUniformLocation(program, "resolution"),
                                                "dimensions": context.getUniformLocation(program, "dimensions"),
                                                "anchor": context.getUniformLocation(program, "anchor"),
                                            };
                                        }
                        
                                        context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                                        context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                                        context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                        context.uniform2f(uniformLocations["dimensions"], width, height);
                                        context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                                }
                                var program;
                                function activateGLRender(context,adjust){
                                    if(program == undefined){ program = core.render.produceProgram('canvas', vertexShaderSource, fragmentShaderSource); }
                                    
                                    context.useProgram(program);
                                    updateGLAttributes(context,adjust);
                                    context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                                }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjusted = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            var P = {
                                                x: adjusted.scale * width * (points[a] - anchor.x), 
                                                y: adjusted.scale * height * (points[a+1] - anchor.y), 
                                            };
                        
                                            self.extremities.points.push({ 
                                                x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                                                y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                                            });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                                    
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                };
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                                    //combine offset with shape's position, angle and scale to produce adjust value for render
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjust = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                    //activate shape render code
                                        activateGLRender(context,adjust);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                        this.circle = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'circle'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{} };
                                    this.ignored = false;
                                    this.colour = {r:1,g:0,b:0,a:1};
                        
                                //attributes pertinent to extremity calculation
                                    var x = 0;          this.x =      function(a){ if(a==undefined){return x;}      x = a;      computeExtremities(); };
                                    var y = 0;          this.y =      function(a){ if(a==undefined){return y;}      y = a;      computeExtremities(); };
                                    var angle = 0;      this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  computeExtremities(); };
                                    var radius = 10;    this.radius = function(a){ if(a==undefined){return radius;} radius = a; computeExtremities(); };
                                    var scale = 1;      this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  computeExtremities(); };
                                    var detail = 25;    this.detail = function(a){ 
                                                            if(a==undefined){return detail;} detail = a;
                        
                                                            points = [];
                                                            for(var a = 0; a < detail; a++){
                                                                points.push(
                                                                    Math.sin( 2*Math.PI * (a/detail) ),
                                                                    Math.cos( 2*Math.PI * (a/detail) )
                                                                );
                                                            }
                        
                                                            computeExtremities();
                        
                                                            pointsChanged = true;
                                                        };
                                    
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering functions
                                var points = []; 
                                var pointsChanged = true;
                                this.detail(detail);
                                var vertexShaderSource = 
                                    _canvas_.library.gsls.geometry + `
                                    //constants
                                        attribute vec2 point;
                        
                                    //variables
                                        struct location{
                                            vec2 xy;
                                            float scale;
                                            float angle;
                                        };
                                        uniform location adjust;
                        
                                        uniform vec2 resolution;
                                        uniform float radius;
                                        uniform vec2 anchor;
                        
                                    void main(){
                                        //adjust points by radius and xy offset
                                            vec2 P = cartesianAngleAdjust(point*radius*adjust.scale, -adjust.angle) + adjust.xy;
                        
                                        //convert from unit space to clipspace
                                            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                    }
                                `;
                            var fragmentShaderSource = `  
                                precision mediump float;
                                uniform vec4 colour;
                                                                                            
                                void main(){
                                    gl_FragColor = colour;
                                }
                            `;
                            var pointBuffer;
                            var pointAttributeLocation;
                            var uniformLocations;
                            function updateGLAttributes(context,adjust){
                                //buffers
                                    //points
                                        if(pointBuffer == undefined || pointsChanged){
                                            pointAttributeLocation = context.getAttribLocation(program, "point");
                                            pointBuffer = context.createBuffer();
                                            context.enableVertexAttribArray(pointAttributeLocation);
                                            context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                            context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                            pointsChanged = false;
                                        }else{
                                            context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                            context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                        }
                        
                                //uniforms
                                    if( uniformLocations == undefined ){
                                        uniformLocations = {
                                            "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                            "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                            "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                            "resolution": context.getUniformLocation(program, "resolution"),
                                            "radius": context.getUniformLocation(program, "radius"),
                                            "colour": context.getUniformLocation(program, "colour"),
                                        };
                                    }
                        
                                    context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                                    context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                                    context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                                    context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                    context.uniform1f(uniformLocations["radius"], radius);
                                    context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                            }
                            var program;
                            function activateGLRender(context,adjust){
                                if(program == undefined){ program = core.render.produceProgram('circle', vertexShaderSource, fragmentShaderSource); }
                        
                                context.useProgram(program);
                                updateGLAttributes(context,adjust);
                                context.drawArrays(context.TRIANGLE_FAN, 0, points.length/2);
                            }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjust = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -offset.angle,
                                        };
                        
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            self.extremities.points.push({
                                                x: (points[a]   * radius * adjust.scale) + adjust.x,
                                                y: (points[a+1] * radius * adjust.scale) + adjust.y,
                                            });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                                    
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                };
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){            
                                    //combine offset with shape's position, angle and scale to produce adjust value for render
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjust = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                    //activate shape render code
                                        activateGLRender(context,adjust);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                        this.group = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'group'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
                                    this.ignored = false;
                                    this.heedCamera = false;
                                
                                //attributes pertinent to extremity calculation
                                    var x = 0;     this.x =     function(a){ if(a==undefined){return x;}     x = a;     computeExtremities(); };
                                    var y = 0;     this.y =     function(a){ if(a==undefined){return y;}     y = a;     computeExtremities(); };
                                    var angle = 0; this.angle = function(a){ if(a==undefined){return angle;} angle = a; computeExtremities(); };
                                    var scale = 1; this.scale = function(a){ if(a==undefined){return scale;} scale = a; computeExtremities(); };
                        
                            //addressing
                                this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };
                        
                            //group functions
                                function getChildByName(name){ return children.find(a => a.name == name); }
                                function checkForName(name){ return getChildByName(name) != undefined; }
                                function isValidShape(shape){
                                    if( shape == undefined ){ return false; }
                                    if( shape.name.length == 0 ){
                                        console.warn('group error: shape with no name being inserted into group "'+self.getAddress()+'", therefore; the shape will not be added');
                                        return false;
                                    }
                                    if( checkForName(shape.name) ){
                                        console.warn('group error: shape with name "'+shape.name+'" already exists in group "'+self.getAddress()+'", therefore; the shape will not be added');
                                        return false;
                                    }
                        
                                    return true;
                                }
                        
                                var children = [];
                                this.children = function(){return children;};
                                this.getChildByName = getChildByName;
                                this.contains = function(child){
                                    for(var a = 0; a < children.length; a++){
                                        if(children[a] === child){return true;}
                                    }
                                    return false;
                                };
                                this.append = function(shape){
                                    if( !isValidShape(shape) ){ return; }
                        
                                    children.push(shape); 
                                    shape.parent = this;
                                    augmentExtremities_addChild(shape); 
                                };
                                this.prepend = function(shape){
                                    if( !isValidShape(shape) ){ return; }
                        
                                    children.unshift(shape); 
                                    shape.parent = this;
                                    augmentExtremities_addChild(shape);
                                };
                                this.remove = function(shape){ augmentExtremities_removeChild(shape); children.splice(children.indexOf(shape), 1); };
                                this.clear = function(){ children = []; };
                                this.getElementsUnderPoint = function(x,y){
                                    var returnList = [];
                        
                                    for(var a = children.length-1; a >= 0; a--){
                                        var item = children[a];
                        
                                        if(item.ignored){continue;}
                        
                                        if( _canvas_.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, item.extremities.boundingBox ) ){
                                            if( item.getType() == 'group' ){
                                                returnList = returnList.concat( item.getElementsUnderPoint(x,y) );
                                            }else{
                                                if( _canvas_.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, item.extremities.points ) ){
                                                    returnList = returnList.concat( item );
                                                }
                                            }
                                        }
                                    }
                        
                                    return returnList;
                                };
                                this.getElementsUnderArea = function(points){
                                    var returnList = [];
                                    children.forEach(function(item){
                                        if(item.ignored){return;}
                        
                                        if( _canvas_.library.math.detectOverlap.boundingBoxes( _canvas_.library.math.boundingBoxFromPoints(points), item.extremities.boundingBox ) ){
                                            if( item.getType() == 'group' ){
                                                returnList = returnList.concat( item.getElementUnderArea(points) );
                                            }else{
                                                if( _canvas_.library.math.detectOverlap.overlappingPolygons(points, item.extremities.points) ){
                                                    returnList = returnList.concat( item );
                                                }
                                            }
                                        }
                                    });
                        
                                    return returnList;
                                };
                                this.getTree = function(){
                                    var result = {name:this.name,type:type,children:[]};
                        
                                    children.forEach(function(a){
                                        if(a.getType() == 'group'){
                                            result.children.push( a.getTree() );
                                        }else{
                                            result.children.push({ type:a.getType(), name:a.name });
                                        }
                                    });
                        
                                    return result;
                                };
                        
                            //clipping
                                var clipping = { stencil:undefined, active:false };
                                this.stencil = function(shape){
                                    if(shape == undefined){return this.clipping.stencil;}
                                    clipping.stencil = shape;
                                    clipping.stencil.parent = this;
                                    computeExtremities();
                                };
                                this.clipActive = function(bool){
                                    if(bool == undefined){return clipping.active;}
                                    clipping.active = bool;
                                    computeExtremities();
                                };
                        
                            //extremities
                                function augmentExtremities_addChild(newShape){
                                    //if we're in clipping mode, no addition of a shape can effect the extremities 
                                        if(clipping.active && clipping.stencil != undefined){return;}
                                    //get offset from parent
                                        var offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                                    //combine offset with group's position, angle and scale to produce new offset for chilren
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var newOffset = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: offset.angle + angle,
                                        };
                                    //run computeExtremities on new child
                                        newShape.computeExtremities(false,newOffset);
                                    //add points to points list
                                        self.extremities.points = self.extremities.points.concat( newShape.extremities.points );
                                    //recalculate bounding box
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                                    //inform parent of change
                                        if(self.parent){self.parent.computeExtremities();}
                                }
                                function augmentExtremities_removeChild(departingShape){
                                    //if we're in clipping mode, no removal of a shape can effect the extremities 
                                        if(clipping.active && clipping.stencil != undefined){return;}
                                    //get offset from parent
                                        var offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                                    //combine offset with group's position, angle and scale to produce new offset for chilren
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var newOffset = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: offset.angle + angle,
                                        };
                                    //run computeExtremities on departing child
                                        departingShape.computeExtremities(false,newOffset);
                                    //remove matching points from points list
                                        var index = _canvas_.library.math.getIndexOfSequence(self.extremities.points,departingShape.extremities.points);
                                        if(index == undefined){console.error("core:: group shape: departing shape points not found");}
                                        self.extremities.points.splice(index, index+departingShape.extremities.points.length);
                                    //recalculate bounding box
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                                    //inform parent of change
                                        if(self.parent){self.parent.computeExtremities();}
                                }
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //combine offset with group's position, angle and scale to produce new offset for chilren
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var newOffset = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: offset.angle + angle,
                                        };
                        
                                    //run computeExtremities on all children
                                        children.forEach(a => a.computeExtremities(false,newOffset));
                                    
                                    //run computeExtremities on stencil (if applicable)
                                        if( clipping.stencil != undefined ){ clipping.stencil.computeExtremities(false,newOffset); }
                        
                                    //if clipping is active and possible, the extremities of this group are limited to those of the clipping shape
                                    //otherwise, gather extremities from children and calculate extremities here
                                        self.extremities.points = [];
                                        if(clipping.active && clipping.stencil != undefined){
                                            self.extremities.points = self.extremities.points.concat(clipping.stencil.extremities.points);
                                        }else{ 
                                            children.forEach(a => self.extremities.points = self.extremities.points.concat(a.extremities.points));
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                        
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                this.computeExtremities = computeExtremities;
                                this.getOffset = function(){
                                    if(this.parent){
                                        var offset = this.parent.getOffset();
                        
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjust = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale * scale,
                                            angle: offset.angle + angle,
                                        };
                        
                                        return adjust;
                                    }else{
                                        return {x:x ,y:y ,scale:scale ,angle:angle};
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    // self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y,2,{r:0,g:0,b:1,a:1}) );
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                };
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                                    //combine offset with group's position, angle and scale to produce new offset for children
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var newOffset = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: offset.angle + angle,
                                        };
                        
                                    //activate clipping (if requested, and is possible)
                                        if(clipping.active && clipping.stencil != undefined){
                                            //active stencil drawing mode
                                                context.enable(context.STENCIL_TEST);
                                                context.colorMask(false,false,false,false);
                                                context.stencilFunc(context.ALWAYS,1,0xFF);
                                                context.stencilOp(context.KEEP,context.KEEP,context.REPLACE);
                                                context.stencilMask(0xFF);
                                            //draw stencil
                                                clipping.stencil.render(context,newOffset);
                                            //reactive regular rendering
                                                context.colorMask(true,true,true,true);
                                                context.stencilFunc(context.EQUAL,1,0xFF);
                                                context.stencilMask(0x00);
                                        }
                                    
                                    //render children
                                        children.forEach(function(a){
                                            if(
                                                _canvas_.library.math.detectOverlap.boundingBoxes(
                                                    clipping.active ? self.extremities.boundingBox : core.viewport.getBoundingBox(),
                                                    a.extremities.boundingBox
                                                )
                                            ){ a.render(context,newOffset); }
                                        });
                        
                                    //disactivate clipping
                                        if(clipping.active){ context.disable(context.STENCIL_TEST); }
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                }
                        };
                        this.image = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'image'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{}, isChanged:true };
                                    this.ignored = false;
                        
                                //attributes pertinent to extremity calculation
                                    var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      this.extremities.isChanged = true; this.computeExtremities(); };
                                    var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      this.extremities.isChanged = true; this.computeExtremities(); };
                                    var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                                    var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; this.extremities.isChanged = true; this.computeExtremities(); };
                                    var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                                    var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; this.extremities.isChanged = true; this.computeExtremities(); };
                                    var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                        
                                //image data
                                    var image = { object:undefined, url:'', isLoaded:false, isChanged:true, defaultURL:'http://0.0.0.0:8000/testImages/noimageimage.png' };
                                    this.imageURL = function(a){
                                        if(a==undefined){return image.url;}
                                        image.url = a;
                        
                                        if(image.url === ''){ image.url = image.defaultURL; }
                        
                                        image.object = new Image();
                                        image.object.src = image.url;
                                        image.isLoaded = false; image.object.onload = function(){ image.isLoaded = true; image.isChanged = true; };
                                    };
                                    this.imageURL('');
                        
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering
                                var points = [
                                    0,0,
                                    1,0,
                                    1,1,
                                    0,1,
                                ];
                                var vertexShaderSource = `
                                    //constants
                                        attribute vec2 point;
                        
                                    //variables
                                        struct location{
                                            vec2 xy;
                                            float scale;
                                            float angle;
                                        };
                                        uniform location adjust;
                        
                                        uniform vec2 resolution;
                                        uniform vec2 dimensions;
                                        uniform vec2 anchor;
                        
                                    //vertex/fragment shader transfer variables
                                        varying vec2 textureCoordinates;
                        
                                    void main(){
                                        //transfer point to fragment shader
                                            textureCoordinates = point;
                        
                                        //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                                            vec2 P = dimensions * adjust.scale * (point - anchor);
                                            P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;
                        
                                        //convert from unit space to clipspace
                                            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                    }
                                `;
                                var fragmentShaderSource = `  
                                    precision mediump float;
                        
                                    uniform sampler2D textureImage;
                                    varying vec2 textureCoordinates;
                                                                                                
                                    void main(){
                                        gl_FragColor = texture2D(textureImage, textureCoordinates);
                                    }
                                `;
                                var pointBuffer;
                                var pointAttributeLocation;
                                var uniformLocations;
                                var imageTexture;
                                function updateGLAttributes(context,adjust){
                                    //buffers
                                        //points
                                            if(pointBuffer == undefined){
                                                pointAttributeLocation = context.getAttribLocation(program, "point");
                                                pointBuffer = context.createBuffer();
                                                context.enableVertexAttribArray(pointAttributeLocation);
                                                context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                                context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                            }else{
                                                context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                                                context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            }
                        
                                        //texture
                                            if(image.isChanged){
                                                image.isChanged = false;
                                                imageTexture = context.createTexture();
                                                context.bindTexture(context.TEXTURE_2D, imageTexture);
                                                context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE );
                                                context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE );
                                                context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST );
                                                context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST );
                                                context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image.object);
                                            }else{
                                                context.bindTexture(context.TEXTURE_2D, imageTexture);
                                            }
                        
                                    //uniforms
                                        if( uniformLocations == undefined ){
                                            uniformLocations = {
                                                "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                                "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                                "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                                "resolution": context.getUniformLocation(program, "resolution"),
                                                "dimensions": context.getUniformLocation(program, "dimensions"),
                                                "anchor": context.getUniformLocation(program, "anchor"),
                                            };
                                        }
                        
                                        context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                                        context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                                        context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                        context.uniform2f(uniformLocations["dimensions"], width, height);
                                        context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                                }
                                var program;
                                function activateGLRender(context,adjust){
                                    if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                                    
                                    if(!image.isLoaded){return;} //do not render, if the image has not yet been loaded
                        
                                    context.useProgram(program);
                                    updateGLAttributes(context,adjust);
                                    context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                                }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjusted = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            var P = {
                                                x: adjusted.scale * width * (points[a] - anchor.x), 
                                                y: adjusted.scale * height * (points[a+1] - anchor.y), 
                                            };
                        
                                            self.extremities.points.push({ 
                                                x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                                                y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                                            });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                                    
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                };
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                                    //combine offset with shape's position, angle and scale to produce adjust value for render
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjust = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                    //activate shape render code
                                        activateGLRender(context,adjust);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                        this.loopedPath = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'loopedPath'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{}, isChanged:true };
                                    this.ignored = false;
                                    this.colour = {r:0,g:0,b:0,a:1};
                        
                                //attributes pertinent to extremity calculation
                                    var scale = 1; this.scale = function(a){ if(a==undefined){return scale;}  scale = a; this.extremities.isChanged=true; this.computeExtremities(); };
                                    var points = []; var pointsChanged = true; 
                                    function lineGenerator(){ points = _canvas_.library.math.loopedPathToPolygonGenerator( path, thickness ); }
                                    var path = [];      this.points =  function(a){ if(a==undefined){return path;} path = a; lineGenerator(); this.extremities.isChanged=true; this.computeExtremities(); pointsChanged = true; };
                                    var thickness = 1;  this.thickness = function(a){ if(a==undefined){return thickness;} thickness = a/2; lineGenerator(); this.extremities.isChanged=true; this.computeExtremities(); pointsChanged = true; };
                                    
                                    this.pointsAsXYArray = function(a){
                                        if(a==undefined){
                                            var output = [];
                                            for(var a = 0; a < path.length; a+=2){ output.push({ x:path[a], y:path[a+1] }); }
                                            return output;
                                        }
                        
                                        var array = [];
                                        a.forEach(a => array = array.concat([a.x,a.y]));
                                        this.points(array);
                                    };
                                    
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering functions
                                var vertexShaderSource = 
                                    _canvas_.library.gsls.geometry + `
                                        //variables
                                            struct location{
                                                vec2 xy;
                                                float scale;
                                                float angle;
                                            };
                                            uniform location offset;
                        
                                            attribute vec2 point;
                                            uniform vec2 resolution;
                        
                                        void main(){    
                                            //adjust point by offset
                                                vec2 P = cartesianAngleAdjust(point*offset.scale, offset.angle) + offset.xy;
                        
                                            //convert from unit space to clipspace
                                                gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                        }
                                    `;
                                var fragmentShaderSource = `  
                                    precision mediump float;
                                    uniform vec4 colour;
                                                                                                
                                    void main(){
                                        gl_FragColor = colour;
                                    }
                                `;
                                var point = { buffer:undefined, attributeLocation:undefined };
                                var uniformLocations;
                                function updateGLAttributes(context,offset){
                                    //buffers
                                        //points
                                            if(point.buffer == undefined || pointsChanged){
                                                point.attributeLocation = context.getAttribLocation(program, "point");
                                                point.buffer = context.createBuffer();
                                                context.enableVertexAttribArray(point.attributeLocation);
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                                pointsChanged = false;
                                            }else{
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            }
                        
                                    //uniforms
                                        if( uniformLocations == undefined ){
                                            uniformLocations = {
                                                "offset.xy": context.getUniformLocation(program, "offset.xy"),
                                                "offset.scale": context.getUniformLocation(program, "offset.scale"),
                                                "offset.angle": context.getUniformLocation(program, "offset.angle"),
                                                "resolution": context.getUniformLocation(program, "resolution"),
                                                "colour": context.getUniformLocation(program, "colour"),
                                            };
                                        }
                        
                                        context.uniform2f(uniformLocations["offset.xy"], offset.x, offset.y);
                                        context.uniform1f(uniformLocations["offset.scale"], offset.scale);
                                        context.uniform1f(uniformLocations["offset.angle"], offset.angle);
                                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                        context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                                }
                                var program;
                                function activateGLRender(context,adjust){
                                    if(program == undefined){ program = core.render.produceProgram('polygon', vertexShaderSource, fragmentShaderSource); }
                        
                                    context.useProgram(program);
                                    updateGLAttributes(context,adjust);
                                    context.drawArrays(context.TRIANGLE_STRIP, 0, points.length/2);
                                }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            var P = _canvas_.library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                                            self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                        
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                }
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                                    //activate shape render code
                                        activateGLRender(context,offset);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                        this.path = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'path'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{}, isChanged:true };
                                    this.ignored = false;
                                    this.colour = {r:0,g:0,b:0,a:1};
                        
                                //attributes pertinent to extremity calculation
                                    var scale = 1; this.scale = function(a){ if(a==undefined){return scale;}  scale = a; this.extremities.isChanged=true; this.computeExtremities(); };
                                    var points = []; var pointsChanged = true; 
                                    function lineGenerator(){ points = _canvas_.library.math.pathToPolygonGenerator( path, thickness ); }
                                    var path = [];      this.points =  function(a){ if(a==undefined){return path;} path = a; lineGenerator(); this.extremities.isChanged=true; this.computeExtremities(); pointsChanged = true; };
                                    var thickness = 1;  this.thickness = function(a){ if(a==undefined){return thickness;} thickness = a; lineGenerator(); this.extremities.isChanged=true; this.computeExtremities(); pointsChanged = true; };
                                    
                                    this.pointsAsXYArray = function(a){
                                        if(a==undefined){
                                            var output = [];
                                            for(var a = 0; a < path.length; a+=2){ output.push({ x:path[a], y:path[a+1] }); }
                                            return output;
                                        }
                        
                                        var array = [];
                                        a.forEach(a => array = array.concat([a.x,a.y]));
                                        this.points(array);
                                    };
                                    
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering functions
                                var vertexShaderSource = 
                                    _canvas_.library.gsls.geometry + `
                                        //variables
                                            struct location{
                                                vec2 xy;
                                                float scale;
                                                float angle;
                                            };
                                            uniform location offset;
                        
                                            attribute vec2 point;
                                            uniform vec2 resolution;
                        
                                        void main(){    
                                            //adjust point by offset
                                                vec2 P = cartesianAngleAdjust(point*offset.scale, offset.angle) + offset.xy;
                        
                                            //convert from unit space to clipspace
                                                gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                        }
                                    `;
                                var fragmentShaderSource = `  
                                    precision mediump float;
                                    uniform vec4 colour;
                                                                                                
                                    void main(){
                                        gl_FragColor = colour;
                                    }
                                `;
                                var point = { buffer:undefined, attributeLocation:undefined };
                                var uniformLocations;
                                function updateGLAttributes(context,offset){
                                    //buffers
                                        //points
                                            if(point.buffer == undefined || pointsChanged){
                                                point.attributeLocation = context.getAttribLocation(program, "point");
                                                point.buffer = context.createBuffer();
                                                context.enableVertexAttribArray(point.attributeLocation);
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                            }else{
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            }
                        
                                    //uniforms
                                        if( uniformLocations == undefined ){
                                            uniformLocations = {
                                                "offset.xy": context.getUniformLocation(program, "offset.xy"),
                                                "offset.scale": context.getUniformLocation(program, "offset.scale"),
                                                "offset.angle": context.getUniformLocation(program, "offset.angle"),
                                                "resolution": context.getUniformLocation(program, "resolution"),
                                                "colour": context.getUniformLocation(program, "colour"),
                                            };
                                        }
                        
                                        context.uniform2f(uniformLocations["offset.xy"], offset.x, offset.y);
                                        context.uniform1f(uniformLocations["offset.scale"], offset.scale);
                                        context.uniform1f(uniformLocations["offset.angle"], offset.angle);
                                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                        context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                                }
                                var program;
                                function activateGLRender(context,adjust){
                                    if(program == undefined){ program = core.render.produceProgram('polygon', vertexShaderSource, fragmentShaderSource); }
                        
                                    context.useProgram(program);
                                    updateGLAttributes(context,adjust);
                                    context.drawArrays(context.TRIANGLE_STRIP, 0, points.length/2);
                                }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            var P = _canvas_.library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                                            self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                        
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                }
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                                    //activate shape render code
                                        activateGLRender(context,offset);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                        // this.polygon = function(){
                        //     var self = this;
                        
                        //     //attributes 
                        //         //protected attributes
                        //             const type = 'polygon'; this.getType = function(){return type;}
                        
                        //         //simple attributes
                        //             this.name = '';
                        //             this.parent = undefined;
                        //             this.dotFrame = false;
                        //             this.extremities = { points:[], boundingBox:{}, isChanged:true };
                        //             this.ignored = false;
                        //             this.colour = {r:1,g:0,b:0,a:1};
                        
                        //         //attributes pertinent to extremity calculation
                        //             var pointsChanged = true;
                        //             var points = []; this.points = function(a){ if(a==undefined){return points;} points = a; this.extremities.isChanged = true; computeExtremities(); pointsChanged = true; };
                        //             var scale = 1;   this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; computeExtremities(); };
                        
                        //             this.pointsAsXYArray = function(a){
                        //                 if(a==undefined){
                        //                     var output = [];
                        //                     for(var a = 0; a < points.length; a+=2){ output.push({ x:points[a], y:points[a+1] }); }
                        //                     return points;
                        //                 }
                        
                        //                 var array = [];
                        //                 a.forEach(a => array = array.concat([a.x,a.y]));
                        //                 this.points(array);
                        //             };
                            
                        //     //addressing
                        //         this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                        //     //webGL rendering functions
                        //         var vertexShaderSource = 
                        //             _canvas_.library.gsls.geometry + `
                        //             //variables
                        //                 struct location{
                        //                     vec2 xy;
                        //                     float scale;
                        //                     float angle;
                        //                 };
                        //                 uniform location offset;
                            
                        //                 attribute vec2 point;
                        //                 uniform vec2 resolution;
                            
                        //             void main(){    
                        //                 //adjust point by offset
                        //                     vec2 P = cartesianAngleAdjust(point*offset.scale, offset.angle) + offset.xy;
                            
                        //                 //convert from unit space to clipspace
                        //                     gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                        //             }
                        //         `;
                        //         var fragmentShaderSource = `  
                        //             precision mediump float;
                        //             uniform vec4 colour;
                                                                                                
                        //             void main(){
                        //                 gl_FragColor = colour;
                        //             }
                        //         `;
                        //         var point = { buffer:undefined, attributeLocation:undefined };
                        //         var uniformLocations;
                        //         function updateGLAttributes(context,offset){
                        //             //buffers
                        //                 //points
                        //                     if(point.buffer == undefined || pointsChanged){
                        //                         point.attributeLocation = context.getAttribLocation(program, "point");
                        //                         point.buffer = context.createBuffer();
                        //                         context.enableVertexAttribArray(point.attributeLocation);
                        //                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        //                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        //                         context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                        //                         pointsChanged = false;
                        //                     }else{
                        //                         context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        //                         context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        //                     }
                        
                        //             //uniforms
                        //                 if( uniformLocations == undefined ){
                        //                     uniformLocations = {
                        //                         "offset.xy": context.getUniformLocation(program, "offset.xy"),
                        //                         "offset.scale": context.getUniformLocation(program, "offset.scale"),
                        //                         "offset.angle": context.getUniformLocation(program, "offset.angle"),
                        //                         "resolution": context.getUniformLocation(program, "resolution"),
                        //                         "colour": context.getUniformLocation(program, "colour"),
                        //                     };
                        //                 }
                        
                        //                 context.uniform2f(uniformLocations["offset.xy"], offset.x, offset.y);
                        //                 context.uniform1f(uniformLocations["offset.scale"], offset.scale);
                        //                 context.uniform1f(uniformLocations["offset.angle"], offset.angle);
                        //                 context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                        //                 context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                        //         }
                        //         var program;
                        //         function activateGLRender(context,adjust){
                        //             if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                            
                        //             context.useProgram(program);
                        //             updateGLAttributes(context,adjust);
                        
                        //             context.drawArrays(context.TRIANGLE_STRIP, 0, points.length/2);
                        //         }
                        
                        //     //extremities
                        //         function computeExtremities(informParent=true,offset){
                        //             //get offset from parent
                        //                 if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                        //             //calculate points based on the offset
                        //                 self.extremities.points = [];
                        //                 for(var a = 0; a < points.length; a+=2){
                        //                     var P = _canvas_.library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                        //                     self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
                        //                 }
                        //                 self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                        
                        //             //if told to do so, inform parent (if there is one) that extremities have changed
                        //                 if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                        //         }
                        //         var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                        //         this.computeExtremities = function(informParent,offset){
                        //             if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                        //             if(
                        //                 this.extremities.isChanged ||
                        //                 oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                        //             ){
                        //                 computeExtremities(informParent,offset);
                        //                 this.extremities.isChanged = false;
                        //                 oldOffset.x = offset.x;
                        //                 oldOffset.y = offset.y;
                        //                 oldOffset.scale = offset.scale;
                        //                 oldOffset.angle = offset.angle;
                        //             }
                        //         };
                        
                        //     //lead render
                        //         function drawDotFrame(){
                        //             self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                        //             var tl = self.extremities.boundingBox.topLeft;
                        //             var br = self.extremities.boundingBox.bottomRight;
                        //             core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                        //             core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                        //         }
                        //         this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){            
                        //             //activate shape render code
                        //                 activateGLRender(context,offset);
                        
                        //             //if requested; draw dot frame
                        //                 if(self.dotFrame){drawDotFrame();}
                        //         };
                        // };
                        
                        this.polygon = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'polygon'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{}, isChanged:true };
                                    this.ignored = false;
                                    this.colour = {r:1,g:0,b:0,a:1};
                        
                                //attributes pertinent to extremity calculation
                                    var pointsChanged = true;
                                    var points = []; this.points = function(a){ if(a==undefined){return points;} points = a; this.extremities.isChanged = true; computeExtremities(); pointsChanged = true; };
                                    var scale = 1;   this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; computeExtremities(); };
                        
                                    this.pointsAsXYArray = function(a){
                                        if(a==undefined){
                                            var output = [];
                                            for(var a = 0; a < points.length; a+=2){ output.push({ x:points[a], y:points[a+1] }); }
                                            return points;
                                        }
                        
                                        var array = [];
                                        a.forEach(a => array = array.concat([a.x,a.y]));
                                        this.points(array);
                                    };
                            
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering functions
                                var vertexShaderSource = 
                                    _canvas_.library.gsls.geometry + `
                                    //variables
                                        struct location{
                                            vec2 xy;
                                            float scale;
                                            float angle;
                                        };
                                        uniform location offset;
                            
                                        attribute vec2 point;
                                        uniform vec2 resolution;
                            
                                    void main(){    
                                        //adjust point by offset
                                            vec2 P = cartesianAngleAdjust(point*offset.scale, offset.angle) + offset.xy;
                            
                                        //convert from unit space to clipspace
                                            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                    }
                                `;
                                var fragmentShaderSource = `  
                                    precision mediump float;
                                    uniform vec4 colour;
                                                                                                
                                    void main(){
                                        gl_FragColor = colour;
                                    }
                                `;
                                var point = { buffer:undefined, attributeLocation:undefined };
                                var drawingPoints = [];
                                var uniformLocations;
                                function updateGLAttributes(context,offset){
                                    //buffers
                                        //points
                                            if(point.buffer == undefined || pointsChanged){
                                                point.attributeLocation = context.getAttribLocation(program, "point");
                                                point.buffer = context.createBuffer();
                                                context.enableVertexAttribArray(point.attributeLocation);
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(drawingPoints = _canvas_.library.thirdparty.earcut(points)), context.STATIC_DRAW);
                                                pointsChanged = false;
                                            }else{
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            }
                        
                                    //uniforms
                                        if( uniformLocations == undefined ){
                                            uniformLocations = {
                                                "offset.xy": context.getUniformLocation(program, "offset.xy"),
                                                "offset.scale": context.getUniformLocation(program, "offset.scale"),
                                                "offset.angle": context.getUniformLocation(program, "offset.angle"),
                                                "resolution": context.getUniformLocation(program, "resolution"),
                                                "colour": context.getUniformLocation(program, "colour"),
                                            };
                                        }
                        
                                        context.uniform2f(uniformLocations["offset.xy"], offset.x, offset.y);
                                        context.uniform1f(uniformLocations["offset.scale"], offset.scale);
                                        context.uniform1f(uniformLocations["offset.angle"], offset.angle);
                                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                        context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                                }
                                var program;
                                function activateGLRender(context,adjust){
                                    if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                            
                                    context.useProgram(program);
                                    updateGLAttributes(context,adjust);
                        
                                    context.drawArrays(context.TRIANGLES, 0, drawingPoints.length/2);
                                }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            var P = _canvas_.library.math.cartesianAngleAdjust(points[a]*offset.scale,points[a+1]*offset.scale, offset.angle);
                                            self.extremities.points.push({ x: P.x+offset.x, y: P.y+offset.y });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                        
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                }
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){            
                                    //activate shape render code
                                        activateGLRender(context,offset);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                        this.rectangle = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'rectangle'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{}, isChanged:true };
                                    this.ignored = false;
                                    this.colour = {r:1,g:0,b:0,a:1};
                        
                                //attributes pertinent to extremity calculation
                                    var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      this.extremities.isChanged = true; this.computeExtremities(); };
                                    var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      this.extremities.isChanged = true; this.computeExtremities(); };
                                    var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                                    var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; this.extremities.isChanged = true; this.computeExtremities(); };
                                    var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                                    var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; this.extremities.isChanged = true; this.computeExtremities(); };
                                    var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; this.computeExtremities(); };
                        
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering functions
                                var points = [
                                    0,0,
                                    1,0,
                                    1,1,
                                    0,1,
                                ];
                                var vertexShaderSource = `
                                    //constants
                                        attribute vec2 point;
                        
                                    //variables
                                        struct location{
                                            vec2 xy;
                                            float scale;
                                            float angle;
                                        };
                                        uniform location adjust;
                        
                                        uniform vec2 resolution;
                                        uniform vec2 dimensions;
                                        uniform vec2 anchor;
                        
                                    void main(){
                                        //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                                            vec2 P = dimensions * adjust.scale * (point - anchor);
                                            P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;
                        
                                        //convert from unit space to clipspace
                                            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                    }
                                `;
                                var fragmentShaderSource = `  
                                    precision mediump float;
                                    uniform vec4 colour;
                                                                                                
                                    void main(){
                                        gl_FragColor = colour;
                                    }
                                `;
                                var point = { buffer:undefined, attributeLocation:undefined };
                                var uniformLocations;
                                function updateGLAttributes(context,adjust){
                                    //buffers
                                        //points
                                            if(point.buffer == undefined){
                                                point.attributeLocation = context.getAttribLocation(program, "point");
                                                point.buffer = context.createBuffer();
                                                context.enableVertexAttribArray(point.attributeLocation);
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                            }else{
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            }
                                    
                                    //uniforms
                                        if( uniformLocations == undefined ){
                                            uniformLocations = {
                                                "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                                "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                                "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                                "resolution": context.getUniformLocation(program, "resolution"),
                                                "dimensions": context.getUniformLocation(program, "dimensions"),
                                                "anchor": context.getUniformLocation(program, "anchor"),
                                                "colour": context.getUniformLocation(program, "colour"),
                                            };
                                        }
                        
                                        context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                                        context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                                        context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                        context.uniform2f(uniformLocations["dimensions"], width, height);
                                        context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                                        context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                                }
                                var program;
                                function activateGLRender(context,adjust){
                                    if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                            
                                    context.useProgram(program);
                                    updateGLAttributes(context,adjust);
                                    context.drawArrays(context.TRIANGLE_FAN, 0, 4);
                                }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjusted = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            var P = {
                                                x: adjusted.scale * width * (points[a] - anchor.x), 
                                                y: adjusted.scale * height * (points[a+1] - anchor.y), 
                                            };
                        
                                            self.extremities.points.push({ 
                                                x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                                                y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                                            });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                                    
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                };
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                                    //combine offset with shape's position, angle and scale to produce adjust value for render
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjust = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                    //activate shape render code
                                        activateGLRender(context,adjust);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                        this.rectangleWithOutline = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'rectangleWithOutline'; this.getType = function(){return type;}
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{}, isChanged:true };
                                    this.ignored = false;
                                    this.colour = {r:1,g:0,b:0,a:1};
                                    this.lineColour = {r:0,g:0,b:0,a:0};
                        
                                //attributes pertinent to extremity calculation
                                    var x = 0;              this.x =         function(a){ if(a==undefined){return x;}         x = a;         this.extremities.isChanged = true; this.computeExtremities(); };
                                    var y = 0;              this.y =         function(a){ if(a==undefined){return y;}         y = a;         this.extremities.isChanged = true; this.computeExtremities(); };
                                    var angle = 0;          this.angle =     function(a){ if(a==undefined){return angle;}     angle = a;     this.extremities.isChanged = true; this.computeExtremities(); };
                                    var anchor = {x:0,y:0}; this.anchor =    function(a){ if(a==undefined){return anchor;}    anchor = a;    this.extremities.isChanged = true; this.computeExtremities(); };
                                    var width = 10;         this.width =     function(a){ if(a==undefined){return width;}     width = a;     this.extremities.isChanged = true; this.computeExtremities(); };
                                    var height = 10;        this.height =    function(a){ if(a==undefined){return height;}    height = a;    this.extremities.isChanged = true; this.computeExtremities(); };
                                    var scale = 1;          this.scale =     function(a){ if(a==undefined){return scale;}     scale = a;     this.extremities.isChanged = true; this.computeExtremities(); };
                                    var thickness = 0;      this.thickness = function(a){ if(a==undefined){return thickness;} thickness = a; this.extremities.isChanged = true; this.computeExtremities(); };
                        
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering functions
                                var points = [
                                    0,0,
                                    1,0,
                                    1,1,
                                    0,0,
                                    1,1,
                                    0,1,
                        
                                    0,0,
                                    1,0,
                                    1,1,
                                    0,0,
                                    1,1,
                                    0,1,
                        
                                    0,0,
                                    1,0,
                                    1,1,
                                    0,0,
                                    1,1,
                                    0,1,
                        
                                    0,0,
                                    1,0,
                                    1,1,
                                    0,0,
                                    1,1,
                                    0,1,
                        
                                    0,0,
                                    1,0,
                                    1,1,
                                    0,0,
                                    1,1,
                                    0,1,
                                ];
                                var vertexShaderSource = `
                                    //index
                                        attribute lowp float index;
                                        
                                    //constants
                                        attribute vec2 point;
                        
                                    //variables
                                        struct location{
                                            vec2 xy;
                                            float scale;
                                            float angle;
                                        };
                                        uniform location adjust;
                        
                                        uniform vec2 resolution;
                                        uniform vec2 dimensions;
                                        uniform float thickness;
                                        uniform vec2 anchor;
                        
                                        uniform vec4 colour;
                                        uniform vec4 lineColour;
                                    
                                    //varyings
                                        varying vec4 activeColour;
                        
                                    void main(){
                                        //create triangle
                                            vec2 P = vec2(0,0);
                        
                                            if(index < 6.0){ //body
                                                P = dimensions * (point * adjust.scale - anchor);
                                            }else if(index < 12.0){ //outline: top
                                                P = vec2( dimensions.x + thickness, thickness ) * ((point - vec2(0.0,0.5)) * adjust.scale - anchor) - vec2(thickness/2.0,0.0)*adjust.scale;
                                            }else if(index < 18.0){ //outline: bottom
                                                P = vec2( dimensions.x + thickness, thickness ) * ((point - vec2(0.0,-dimensions.y/thickness + 0.5)) * adjust.scale - anchor) - vec2(thickness/2.0,0.0)*adjust.scale;;
                                            }else if(index < 24.0){ //outline: left
                                                P = vec2( thickness, dimensions.y - thickness ) * ((point - vec2(0.5,0.0)) * adjust.scale - anchor) + vec2(0.0,thickness/2.0)*adjust.scale;
                                            }else if(index < 30.0){ //outline: right
                                                P = vec2( thickness, dimensions.y - thickness ) * ((point - vec2(-dimensions.x/thickness + 0.5,0.0)) * adjust.scale - anchor) + vec2(0.0,thickness/2.0)*adjust.scale;
                                            }
                                            
                                            //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                                                P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;
                        
                                        //select colour
                                            activeColour = index < 6.0 ? colour : lineColour;
                        
                                        //convert from unit space to clipspace
                                            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                    }
                                `;
                                var fragmentShaderSource = `  
                                    precision mediump float;
                                    varying vec4 activeColour;
                                                                                                
                                    void main(){
                                        gl_FragColor = activeColour;
                                    }
                                `;
                        
                                var index = { buffer:undefined, attributeLocation:undefined };
                                var point = { buffer:undefined, attributeLocation:undefined };
                                var uniformLocations;
                                function updateGLAttributes(context,adjust){
                                    //index
                                        if(index.buffer == undefined){
                                            index.attributeLocation = context.getAttribLocation(program, "index");
                                            index.buffer = context.createBuffer();
                                            context.enableVertexAttribArray(index.attributeLocation);
                                            context.bindBuffer(context.ARRAY_BUFFER, index.buffer); 
                                            context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                                            context.bufferData(context.ARRAY_BUFFER, new Float32Array(Array.apply(null, {length:points.length/2}).map(Number.call, Number)), context.STATIC_DRAW);
                                        }else{
                                            context.bindBuffer(context.ARRAY_BUFFER, index.buffer);
                                            context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                                        }
                        
                                    //buffers
                                        //points
                                            if(point.buffer == undefined){
                                                point.attributeLocation = context.getAttribLocation(program, "point");
                                                point.buffer = context.createBuffer();
                                                context.enableVertexAttribArray(point.attributeLocation);
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                            }else{
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            }
                                    
                                    //uniforms
                                        if( uniformLocations == undefined ){
                                            uniformLocations = {
                                                "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                                "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                                "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                                "resolution": context.getUniformLocation(program, "resolution"),
                                                "dimensions": context.getUniformLocation(program, "dimensions"),
                                                "thickness": context.getUniformLocation(program, "thickness"),
                                                "anchor": context.getUniformLocation(program, "anchor"),
                                                "colour": context.getUniformLocation(program, "colour"),
                                                "lineColour": context.getUniformLocation(program, "lineColour"),
                                            };
                                        }
                        
                                        context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                                        context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                                        context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                        context.uniform2f(uniformLocations["dimensions"], width, height);
                                        context.uniform1f(uniformLocations["thickness"], thickness);
                                        context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                                        context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                                        context.uniform4f(uniformLocations["lineColour"], self.lineColour.r, self.lineColour.g, self.lineColour.b, self.lineColour.a);
                                }
                                var program;
                                function activateGLRender(context,adjust){
                                    if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                            
                                    context.useProgram(program);
                                    updateGLAttributes(context,adjust);
                                    context.drawArrays(context.TRIANGLES, 0, points.length/2);
                                }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjusted = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            var P = {
                                                x: adjusted.scale * width * (points[a] - anchor.x), 
                                                y: adjusted.scale * height * (points[a+1] - anchor.y), 
                                            };
                        
                                            self.extremities.points.push({ 
                                                x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                                                y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                                            });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                                    
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                };
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                                    //combine offset with shape's position, angle and scale to produce adjust value for render
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjust = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                    //activate shape render code
                                        activateGLRender(context,adjust);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                        this.character = function(){
                            var self = this;
                        
                            //attributes 
                                //protected attributes
                                    const type = 'character'; this.getType = function(){return type;}
                                    const vectorLibrary = {
                                        '':[
                                            0,0,
                                            1,0,
                                            1,1,
                                
                                            0,0,
                                            1,1,
                                            0,1,
                                        ],
                                        A:_canvas_.library.thirdparty.earcut([ 0,1, 0.4,0, 0.6,0, 1,1, 0.8,1, 0.5,0.2, 0.4,0.5, 0.65,0.5, 0.7,0.7, 0.3,0.7, 0.2,1 ]),
                                        B:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.8, 0.7,0.8, 0.8,0.7, 0.8,0.6, 0.7,0.5, 0.2,0.5, 0.2,0.3, 0.7,0.3, 0.7,0.2, 0.2,0.2, 0.2,0, 0.8,0, 0.9,0.1, 0.9,0.3, 0.8,0.4, 1,0.6, 1,0.8, 0.8,1, 0,1 ]),
                                        C:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.8,0, 1,0.2, 0.8,0.3, 0.7,0.2, 0.4,0.2, 0.2,0.4, 0.2,0.6, 0.4,0.8, 0.7,0.8, 0.8,0.7, 1,0.8, 0.8,1, 0.3,1, 0,0.7, 0,0.3 ]),
                                        D:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.8, 0.7,0.8, 0.8,0.7, 0.8,0.3, 0.7,0.2, 0.2,0.2, 0.2,0, 0.8,0, 1,0.2, 1,0.8, 0.8,1, 0,1 ]),
                                        E:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.2,0.2, 0.2,0.4, 1,0.4, 1,0.6, 0.2,0.6, 0.2,0.8, 1,0.8, 1,1, 0,1 ]),
                                        F:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.2,0.2, 0.2,0.4, 1,0.4, 1,0.6, 0.2,0.6, 0.2,1, 0,1 ]),
                                        G:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.8,0, 1,0.2, 0.8,0.3, 0.7,0.2, 0.4,0.2, 0.2,0.4, 0.2,0.6, 0.4,0.8, 0.8,0.8, 0.8,0.6, 1,0.6, 1,1, 0.3,1, 0,0.7, 0,0.3 ]),
                                        H:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.4, 0.8,0.4, 0.8,0, 1,0, 1,1, 0.8,1, 0.8,0.6, 0.2,0.6, 0.2,1, 0,1 ]),
                                        I:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.6,0.2, 0.6,0.8, 1,0.8, 1,1, 0,1, 0,0.8, 0.4,0.8, 0.4,0.2, 0,0.2 ]),
                                        J:_canvas_.library.thirdparty.earcut([ 0,0, 1,0, 1,0.2, 0.6,0.2, 0.6,0.8, 0.4,1, 0,1, 0,0.8, 0.3,0.8, 0.4,0.7, 0.4,0.2, 0,0.2 ]),
                                        K:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.3, 1,0, 1,0.2, 0.5,0.4, 1,1, 0.75,1, 0.3,0.45, 0.2,0.5, 0.2,1, 0,1, ]),
                                        L:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.2,0.8, 1,0.8, 1,1, 0,1 ]),
                                        M:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.5,0.4, 0.8,0, 1,0, 1,1, 0.8,1, 0.8,0.3, 0.5,0.7, 0.2,0.3, 0.2,1, 0,1 ]),
                                        N:_canvas_.library.thirdparty.earcut([ 0,0, 0.2,0, 0.8,0.7, 0.8,0, 1,0, 1,1, 0.8,1, 0.2,0.3, 0.2,1, 0,1 ]),
                                        O:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.7,0, 1,0.3, 1,0.7, 0.7,1, 0.3,1, 0,0.7, 0,0.3, 0.3,0, 0.4,0.2, 0.2,0.4, 0.2,0.6, 0.4,0.8, 0.6,0.8, 0.8,0.6, 0.8,0.4, 0.6,0.2, 0.4,0.2 ]),
                                        P:_canvas_.library.thirdparty.earcut([ 0,0, 0.8,0, 1,0.2, 1,0.4, 0.8,0.6, 0.2,0.6, 0.2,0.4, 0.7,0.4, 0.8,0.3, 0.7,0.2, 0.2,0.2, 0.2,1, 0,1 ]),
                                        Q:_canvas_.library.thirdparty.earcut([ 0.3,0, 0.7,0, 1,0.3, 1,0.7, 0.95,0.75, 1,0.8, 1,1, 0.8,1, 0.5,0.7, 0.5,0.5, 0.7,0.5, 0.8,0.6, 0.8,0.4, 0.6,0.2, 0.4,0.2, 0.2,0.4, 0.2,0.6, 0.4,0.8, 0.6,0.8, 0.75,0.95, 0.7,1, 0.3,1, 0,0.7, 0,0.3 ]),
                                        R:_canvas_.library.thirdparty.earcut([ 0,0, 0.8,0, 1,0.2, 1,0.4, 0.8,0.6, 0.6,0.6, 1,1, 0.75,1, 0.35,0.6, 0.2,0.6, 0.2,0.4, 0.7,0.4, 0.8,0.3, 0.7,0.2, 0.2,0.2, 0.2,1, 0,1 ]),
                                        S:_canvas_.library.thirdparty.earcut([ 0.2,0, 0.8,0, 1,0.2, 1,0.3, 0.8,0.3, 0.7,0.2, 0.3,0.2, 0.2,0.3, 0.3,0.4, 0.8,0.4, 1,0.6, 1,0.8, 0.8,1, 0.2,1, 0,0.8, 0,0.7, 0.2,0.7, 0.3,0.8, 0.7,0.8, 0.8,0.7, 0.7,0.6, 0.2,0.6, 0,0.4, 0,0.2 ]),
                                    };
                        
                                //simple attributes
                                    this.name = '';
                                    this.parent = undefined;
                                    this.dotFrame = false;
                                    this.extremities = { points:[], boundingBox:{}, isChanged:true };
                                    this.ignored = false;
                                    this.colour = {r:1,g:0,b:0,a:1};
                        
                                //attributes pertinent to extremity calculation
                                    var x = 0;              this.x =         function(a){ if(a==undefined){return x;}         x = a;         this.extremities.isChanged = true; this.computeExtremities(); };
                                    var y = 0;              this.y =         function(a){ if(a==undefined){return y;}         y = a;         this.extremities.isChanged = true; this.computeExtremities(); };
                                    var angle = 0;          this.angle =     function(a){ if(a==undefined){return angle;}     angle = a;     this.extremities.isChanged = true; this.computeExtremities(); };
                                    var anchor = {x:0,y:0}; this.anchor =    function(a){ if(a==undefined){return anchor;}    anchor = a;    this.extremities.isChanged = true; this.computeExtremities(); };
                                    var width = 10;         this.width =     function(a){ if(a==undefined){return width;}     width = a;     this.extremities.isChanged = true; this.computeExtremities(); };
                                    var height = 10;        this.height =    function(a){ if(a==undefined){return height;}    height = a;    this.extremities.isChanged = true; this.computeExtremities(); };
                                    var scale = 1;          this.scale =     function(a){ if(a==undefined){return scale;}     scale = a;     this.extremities.isChanged = true; this.computeExtremities(); };
                                    var character = '';     
                                    this.character = function(a){ 
                                        if(a==undefined){return character;} 
                                        character = a; 
                        
                                        points = vectorLibrary[a];
                        
                                        this.extremities.isChanged = true; 
                                        this.computeExtremities(); 
                                    }; setTimeout(function(){ self.character(character);},1);
                        
                            //addressing
                                this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };
                        
                            //webGL rendering functions
                                var points = [
                                    0,0,
                                    1,0,
                                    1,1,
                        
                                    0,0,
                                    1,1,
                                    0,1,
                                ];
                                var vertexShaderSource = `
                                    //constants
                                        attribute vec2 point;
                        
                                    //variables
                                        struct location{
                                            vec2 xy;
                                            float scale;
                                            float angle;
                                        };
                                        uniform location adjust;
                        
                                        uniform vec2 resolution;
                                        uniform vec2 dimensions;
                                        uniform vec2 anchor;
                        
                                    void main(){
                                        //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                                            vec2 P = dimensions * adjust.scale * (point - anchor);
                                            P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;
                        
                                        //convert from unit space to clipspace
                                            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
                                    }
                                `;
                                var fragmentShaderSource = `  
                                    precision mediump float;
                                    uniform vec4 colour;
                                                                                                
                                    void main(){
                                        gl_FragColor = colour;
                                    }
                                `;
                                var point = { buffer:undefined, attributeLocation:undefined };
                                var uniformLocations;
                                function updateGLAttributes(context,adjust){
                                    //buffers
                                        //points
                                            if(point.buffer == undefined){
                                                point.attributeLocation = context.getAttribLocation(program, "point");
                                                point.buffer = context.createBuffer();
                                                context.enableVertexAttribArray(point.attributeLocation);
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                                            }else{
                                                context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                                                context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                                            }
                                    
                                    //uniforms
                                        if( uniformLocations == undefined ){
                                            uniformLocations = {
                                                "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                                                "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                                                "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                                                "resolution": context.getUniformLocation(program, "resolution"),
                                                "dimensions": context.getUniformLocation(program, "dimensions"),
                                                "anchor": context.getUniformLocation(program, "anchor"),
                                                "colour": context.getUniformLocation(program, "colour"),
                                            };
                                        }
                        
                                        context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                                        context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                                        context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                                        context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                                        context.uniform2f(uniformLocations["dimensions"], width, height);
                                        context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                                        context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                                }
                                var program;
                                function activateGLRender(context,adjust){
                                    if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
                            
                                    context.useProgram(program);
                                    updateGLAttributes(context,adjust);
                                    context.drawArrays(context.TRIANGLES, 0, points.length/2);
                                }
                        
                            //extremities
                                function computeExtremities(informParent=true,offset){
                                    //get offset from parent
                                        if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    //calculate points based on the offset
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjusted = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                        self.extremities.points = [];
                                        for(var a = 0; a < points.length; a+=2){
                                            var P = {
                                                x: adjusted.scale * width * (points[a] - anchor.x), 
                                                y: adjusted.scale * height * (points[a+1] - anchor.y), 
                                            };
                        
                                            self.extremities.points.push({ 
                                                x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                                                y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                                            });
                                        }
                                        self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
                                    
                                    //if told to do so, inform parent (if there is one) that extremities have changed
                                        if(informParent){ if(self.parent){self.parent.computeExtremities();} }
                                }
                                var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
                                this.computeExtremities = function(informParent,offset){
                                    if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
                        
                                    if(
                                        this.extremities.isChanged ||
                                        oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
                                    ){
                                        computeExtremities(informParent,offset);
                                        this.extremities.isChanged = false;
                                        oldOffset.x = offset.x;
                                        oldOffset.y = offset.y;
                                        oldOffset.scale = offset.scale;
                                        oldOffset.angle = offset.angle;
                                    }
                                };
                        
                            //lead render
                                function drawDotFrame(){
                                    self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
                        
                                    var tl = self.extremities.boundingBox.topLeft;
                                    var br = self.extremities.boundingBox.bottomRight;
                                    core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
                                    core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
                                };
                                this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
                                    //combine offset with shape's position, angle and scale to produce adjust value for render
                                        var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                                        var adjust = { 
                                            x: point.x*offset.scale + offset.x,
                                            y: point.y*offset.scale + offset.y,
                                            scale: offset.scale*scale,
                                            angle: -(offset.angle + angle),
                                        };
                        
                                    //activate shape render code
                                        activateGLRender(context,adjust);
                        
                                    //if requested; draw dot frame
                                        if(self.dotFrame){drawDotFrame();}
                                };
                        };
                    };
                
                    this.checkShape = function(name,shape){
                        var tmp = new shape();
                
                        if(name == undefined || shape == undefined){ return 'shape or name missing'; }
                        if(tmp.getType() != name){ return 'internal type ('+tmp.getType()+') does not match key ('+name+')';  }
                
                        return '';
                    };
                    this.checkShapes = function(list){
                        for(item in list){
                            var response = this.checkShape(item, list[item]);
                            if(response.length != 0){ console.error('core.shapes error:', item, '::', response); }
                        }
                    };
                
                    this.create = function(type){ 
                        try{ return new this.library[type](); }
                        catch(e){
                            console.warn('the shape type: "'+type+'" could not be found');
                            console.error(e);
                        }
                    };
                };
                this.shape.checkShapes(this.shape.library);
                
                this.arrangement = new function(){
                    var design = core.shape.create('group');
                
                    this.new = function(){ design = core.shape.create('group'); };
                    this.get = function(){ return design; };
                    this.set = function(arrangement){ design = arrangement; };
                    this.prepend = function(element){ design.prepend(element); };
                    this.append = function(element){ design.append(element); };
                    this.remove = function(element){ design.remove(element); };
                    this.clear = function(){ design.clear(); };
                
                    this.getElementByAddress = function(address){
                        var route = address.split('/'); route.shift();
                
                        var currentObject = design;
                        route.forEach(function(a){
                            currentObject = currentObject.getChildByName(a);
                        });
                
                        return currentObject;
                    };
                    this.getElementsUnderPoint = function(x,y){ return design.getElementsUnderPoint(x,y); };
                    this.getElementsUnderArea = function(points){ return design.getElementsUnderArea(points); };
                    this.getTree = function(){ return design.getTree(); };
                    this.printTree = function(mode='address'){ //modes: tabular / address
                        function recursivePrint(grouping,prefix=''){
                            grouping.children.forEach(function(a){
                                if(mode == 'tabular'){
                                    console.log(prefix+'- \t'+a.type +': '+ a.name);
                                    if(a.type == 'group'){ recursivePrint(a, prefix+'-\t') }
                                }else if(mode == 'address'){
                                    console.log(prefix+'/'+a.type +':'+ a.name);
                                    if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                                }
                            });
                        }
                
                        recursivePrint(this.getTree(), '');
                    };
                };
                this.render = new function(){
                    var pageData = {
                        defaultSize:{width:640, height:480},
                        windowWidth:0, windowHeight:0,
                        selectedWidth:0, selectedHeight:0,
                        width:0, height:0,
                    };
                    var context = _canvas_.getContext("webgl", {alpha:false, preserveDrawingBuffer:true, stencil:true });
                    var animationRequestId = undefined;
                    var clearColour = {r:1,g:1,b:1,a:1};
                
                    //webGL setup
                        context.enable(context.BLEND);
                        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
                
                    //webGL program production
                        var storedPrograms = {};
                        this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource){
                            function compileProgram(vertexShaderSource, fragmentShaderSource){
                                function createShader(type, source){
                                    var shader = context.createShader(type);
                                    context.shaderSource(shader, source);
                                    context.compileShader(shader);
                                    var success = context.getShaderParameter(shader, context.COMPILE_STATUS);
                                    if(success){ return shader; }
                            
                                    console.error('major error in core\'s "'+ type +'" shader creation');
                                    console.error(context.getShaderInfoLog(shader));
                                    context.deleteShader(shader);
                                }
                    
                                var program = context.createProgram();
                                context.attachShader(program, createShader(context.VERTEX_SHADER,vertexShaderSource) );
                                context.attachShader(program, createShader(context.FRAGMENT_SHADER,fragmentShaderSource) );
                                context.linkProgram(program);
                                var success = context.getProgramParameter(program, context.LINK_STATUS);
                                if(success){ return program; }
                            
                                console.error('major error in core\'s program creation');
                                console.error(context.getProgramInfoLog(program));
                                context.deleteProgram(program);
                            };
                
                            if( !(name in storedPrograms) ){
                                storedPrograms[name] = compileProgram(vertexShaderSource, fragmentShaderSource);
                                context.useProgram(storedPrograms[name]);
                            }
                
                            return storedPrograms[name];
                        }
                    
                    //canvas and webGL context adjustment
                        this.clearColour = function(colour){
                            if(colour == undefined){ return clearColour; }
                            clearColour = colour;
                            context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
                        };
                        this.adjustCanvasSize = function(){
                            var changesMade = false;
                            var canvasElement = context.canvas;
                
                            function dimensionAdjust(direction){
                                var Direction = direction.charAt(0).toUpperCase() + direction.slice(1)
                    
                                var attribute = canvasElement.getAttribute(__canvasPrefix+'Element'+Direction);
                                if( pageData['selected'+Direction] != attribute || pageData['window'+Direction] != window['inner'+Direction] ){
                                    //save values for future reference
                                        pageData['selected'+Direction] = attribute;
                                        pageData['window'+Direction] = window['inner'+Direction];
                    
                                    //adjust canvas dimension based on the size requirement set out in the canvasElement attribute
                                        var size = {css:0, element:0};
                                        if(attribute == undefined){
                                            size.element = pageData.defaultSize[direction] * window.devicePixelRatio;
                                            size.css = pageData.defaultSize[direction];
                                        }else if( attribute.indexOf('%') == (attribute.length-1) ){
                                            var parentSize = canvasElement.parentElement['offset'+Direction]
                                            var percent = parseFloat(attribute.slice(0,(attribute.length-1))) / 100;
                                            size.element = parentSize * percent * window.devicePixelRatio;
                                            size.css = parentSize * percent;
                                        }else{
                                            size.element = attribute * window.devicePixelRatio;
                                            size.css = attribute;
                                        }
                
                                        pageData[direction] = size.css;
                                        canvasElement[direction] = size.element;
                                        canvasElement.style[direction] = size.css + "px";
                    
                                    changesMade = true;
                                }
                            }
                    
                            dimensionAdjust('height');
                            dimensionAdjust('width');
                
                            return changesMade;
                        };
                        this.refreshCoordinates = function(){
                            var w = context.canvas.width;
                            var h = context.canvas.height;
                            var m = window.devicePixelRatio;
                
                            var x, y, width, height = 0;
                            if(window.devicePixelRatio == 1){
                                x = 0;
                                y = 0;
                                width = w;
                                height = h;
                            }else{
                                x = 0;
                                y = -h;
                                width = w*2;
                                height = h*2;
                            }
                
                            context.viewport( x, y, width, height );
                        };
                        this.refresh = function(){
                            this.clearColour(clearColour);
                            this.adjustCanvasSize();
                            this.refreshCoordinates();
                        };this.refresh();
                
                    //actual render
                        function renderFrame(){
                            context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
                            core.arrangement.get().render(context);
                        }
                        function animate(timestamp){
                            animationRequestId = requestAnimationFrame(animate);
                    
                            //attempt to render frame, if there is a failure; stop animation loop and report the error
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
                
                    //misc
                        this.getCanvasDimensions = function(){ return {width:pageData.width, height:pageData.height}; };
                        this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
                            var dot = core.shape.create('circle');
                            dot.x(x); dot.y(y);
                            dot.colour = colour;
                            dot.radius(r);
                            dot.dotFrame = false;
                            dot.render(context);
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
                
                            this.rate = _canvas_.library.math.averageArray( this.frameTimeArray );
                
                            lastTimestamp = timestamp;
                        },
                        counter:0,
                        frameTimeArray:[],
                        rate:0,
                    };
                
                    this.collect = function(timestamp){
                        //if stats are turned off, just bail
                            if(!active){return;}
                
                        framesPerSecond.compute(timestamp);
                    };
                    this.active = function(bool){if(bool==undefined){return active;} active=bool;};
                    this.getReport = function(){
                        return {
                            framesPerSecond: framesPerSecond.rate,
                        };
                    };
                };
                
                this.viewport = new function(){
                    var state = {
                        position:{x:0,y:0},
                        scale:1,
                        angle:0,
                    };
                    var viewbox = {
                        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
                        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
                    };
                
                    //adapter
                        this.adapter = new function(){
                            this.windowPoint2workspacePoint = function(x,y){
                                var position = core.viewport.position();
                                var scale = core.viewport.scale();
                                var angle = core.viewport.angle();
                
                                var tmp = {x:x, y:y};
                                tmp.x = (tmp.x - position.x)/scale;
                                tmp.y = (tmp.y - position.y)/scale;
                                tmp = _canvas_.library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);
                
                                return tmp;
                            };
                            // this.workspacePoint2windowPoint = function(x,y){
                            //     var position = core.viewport.position();
                            //     var scale = core.viewport.scale();
                            //     var angle = core.viewport.angle();
                
                            //     var point = _canvas_.library.math.cartesianAngleAdjust(x,y,angle);
                
                            //     return {
                            //         x: (point.x+position.x) * scale,
                            //         y: (point.y+position.y) * scale
                            //     };
                            // };
                        };
                
                    //camera position
                        this.position = function(x,y){
                            if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
                            state.position.x = x;
                            state.position.y = y;
                
                            core.arrangement.get().children().forEach(function(item){
                                if(item.heedCamera){ item.x(state.position.x); item.y(state.position.y); }
                            });
                
                            calculateViewportExtremities();
                        };
                        this.scale = function(s){
                            if(s == undefined){return state.scale;}
                            state.scale = s <= 0 ? 1 : s;
                            core.arrangement.get().children().forEach(function(item){
                                if(item.heedCamera){ item.scale(state.scale); }
                            });
                            calculateViewportExtremities();
                        };
                        this.angle = function(a){
                            if(a == undefined){return state.angle;}
                            state.angle = a;
                            core.arrangement.get().children().forEach(function(item){
                                if(item.heedCamera){ item.angle(state.angle); }
                            });
                            calculateViewportExtremities();
                        };
                
                    //mouse interaction
                        this.getElementUnderCanvasPoint = function(x,y){
                            var xy = this.adapter.windowPoint2canvasPoint(x,y);
                            return core.arrangement.getElementUnderPoint(xy.x,xy.y);
                        };
                        this.getElementsUnderCanvasArea = function(points){
                            return core.arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2canvasPoint(a.x,a.y)));
                        };
                
                    //misc
                        function calculateViewportExtremities(){
                            var canvasDimensions = core.render.getCanvasDimensions();
                
                            //for each corner of the viewport; find out where they lie on the canvas
                                viewbox.points.tl = {x:0, y:0};
                                viewbox.points.tr = {x:canvasDimensions.width, y:0};
                                viewbox.points.bl = {x:0, y:canvasDimensions.height};
                                viewbox.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
                            //calculate a bounding box for the viewport from these points
                                viewbox.boundingBox = _canvas_.library.math.boundingBoxFromPoints([viewbox.points.tl, viewbox.points.tr, viewbox.points.br, viewbox.points.bl]);
                        }
                        this.calculateViewportExtremities = calculateViewportExtremities;
                        this.refresh = function(){
                            this.calculateViewportExtremities();
                        };
                        this.getBoundingBox = function(){ return viewbox.boundingBox; };
                        this.cursor = function(type){
                            //cursor types: https://www.w3schools.com/csSref/tryit.asp?filename=trycss_cursor
                            if(type == undefined){return document.body.style.cursor;}
                            document.body.style.cursor = type;
                        };
                };
                this.viewport.refresh();
                
                this.callback = new function(){
                    var callbacks = [
                        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
                        'onkeydown', 'onkeyup',
                    ];
                    var mouseposition = {x:undefined,y:undefined};
                
                    //default
                        for(var a = 0; a < callbacks.length; a++){
                            _canvas_[callbacks[a]] = function(callback){
                                return function(event){
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                            
                                    //get the shapes under this point that have this callback, in order of front to back
                                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a[callback]!=undefined);
                            
                                    //activate core's callback, providing the point, original event, and shapes
                                        core.callback[callback]( event.x, event.y, event, shapes );
                                }
                            }(callbacks[a]);
                        }
                
                    //special cases
                        //onmousemove / onmouseenter / onmouseleave
                            var shapeMouseoverList = [];
                            _canvas_.onmousemove = function(event){
                                //update the stored mouse position
                                    mouseposition = {x:event.x,y:event.y};
                
                                //check for onmouseenter / onmouseleave
                                    //get all shapes under point that have onmouseenter or onmouseleave callbacks
                                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a.onmouseenter!=undefined || a.onmouseleave!=undefined);
                                    //go through this list, comparing to the shape transition list
                                        //shapes only on shapes list; run onmouseenter and add to shapeMouseoverList
                                        //shapes only on shapeMouseoverList; run onmouseleave and remove from shapeMouseoverList
                                        var diff = _canvas_.library.math.getDifferenceOfArrays(shapeMouseoverList,shapes);
                                        diff.b.forEach(function(a){
                                            if(a.onmouseenter){a.onmouseenter( event.x, event.y, event, shapes );}
                                            shapeMouseoverList.push(a);
                                        });
                                        diff.a.forEach(function(a){
                                            if(a.onmouseleave){a.onmouseleave( event.x, event.y, event, shapes );}
                                            shapeMouseoverList.splice(shapeMouseoverList.indexOf(a),1);
                                        });
                
                                //perform regular onmousemove actions
                                    var callback = 'onmousemove';
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                            
                                    //get the shapes under this point that have this callback, in order of front to back
                                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a[callback]!=undefined);
                            
                                    //activate core's callback, providing the point, original event, and shapes
                                        core.callback[callback]( event.x, event.y, event, shapes );
                            };
                
                        //onkeydown / onkeyup
                            var tmp = ['onkeydown', 'onkeyup'];
                            for(var a = 0; a < tmp.length; a++){
                                _canvas_[tmp[a]] = function(callback){
                                    return function(event){
                                        //if core doesn't have this callback set up, just bail
                                            if( !core.callback[callback] ){return;}
                                    
                                        //get the shapes under this point that have this callback, in order of front to back
                                            var shapes = core.arrangement.getElementsUnderPoint(mouseposition.x,mouseposition.y).filter(a => a[callback]!=undefined);
                
                                        //activate core's callback, providing the point, original event, and shapes
                                            core.callback[callback]( mouseposition.x, mouseposition.y, event, shapes );
                                    }
                                }(tmp[a]);
                            }
                
                        //onmousedown / onmouseup / onclick
                            var shapeMouseclickList = [];
                            _canvas_.onclick = function(){};
                            _canvas_.onmousedown = function(event){
                                //save current shapes for use in the onmouseup callback
                                    shapeMouseclickList = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a.onclick!=undefined);
                
                                //perform regular onmousedown actions
                                    var callback = 'onmousedown';
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                            
                                    //get the shapes under this point that have this callback, in order of front to back
                                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a[callback]!=undefined);
                            
                                    //activate core's callback, providing the point, original event, and shapes
                                        core.callback[callback]( event.x, event.y, event, shapes );
                            };
                            _canvas_.onmouseup = function(event){
                                //for the shapes under the mouse that are also on the shapeMouseclickList, activate their "onclick" callback
                                    var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a.onclick!=undefined);
                                    shapes.forEach(function(a){ if( shapeMouseclickList.includes(a) ){ a.onclick(event.x, event.y, event, shapes); } });
                
                                //perform regular onmouseup actions
                                    var callback = 'onmouseup';
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                            
                                    //get the shapes under this point that have this callback, in order of front to back
                                        var shapes = core.arrangement.getElementsUnderPoint(event.x,event.y).filter(a => a[callback]!=undefined);
                            
                                    //activate core's callback, providing the point, original event, and shapes
                                        core.callback[callback]( event.x, event.y, event, shapes );
                            };
                };
            };
            
            // _canvas_.core.render.active(true);
            
            var tmp = _canvas_.core.shape.create('rectangle');
                tmp.name = 'rectangle_1';
                tmp.x(10); tmp.y(10);
                tmp.width(60);
                tmp.height(60);
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                _canvas_.core.arrangement.append(tmp);
            
            var tmp = _canvas_.core.shape.create('rectangleWithOutline');
                tmp.name = 'rectangleWithOutline_1';
                tmp.x(10); tmp.y(80);
                tmp.width(60);
                tmp.height(60);
                tmp.thickness(5);
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                tmp.lineColour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                _canvas_.core.arrangement.append(tmp);
            
            var tmp = _canvas_.core.shape.create('polygon');
                tmp.name = 'polygon_1';
                tmp.points([
                    80+0,  10+0,
                    80+30, 10+10,
                    80+60, 10+0,
                    80+60, 10+60,
                    80+0,  10+60,
                ]);
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
                _canvas_.core.arrangement.append(tmp);
            
            var tmp = _canvas_.core.shape.create('path');
                tmp.name = 'path_1';
                tmp.points([
                    150+0,  10+00,
                    150+0,  10+60,
                    150+30, 10+10,
                    150+60, 10+60,
                    150+60, 10+0,
                ]);
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                _canvas_.core.arrangement.append(tmp);
            
            var tmp = _canvas_.core.shape.create('loopedPath');
                tmp.name = 'loopedPath_1';
                tmp.points([
                    150+0,  80+00,
                    150+0,  80+60,
                    150+30, 80+10,
                    150+60, 80+60,
                    150+60, 80+0,
                ]);
                tmp.thickness(5);
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                _canvas_.core.arrangement.append(tmp);
                
            var tmp = _canvas_.core.shape.create('circle');
                tmp.name = 'circle_1';
                tmp.x(250); tmp.y(40);
                tmp.radius(30)
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                _canvas_.core.arrangement.append(tmp);
            
            var tmp = _canvas_.core.shape.create('image');
                tmp.name = 'image_1';
                tmp.x(290); tmp.y(10);
                tmp.width(60);
                tmp.height(60);
                _canvas_.core.arrangement.append(tmp);
            
            var tmp = _canvas_.core.shape.create('canvas');
                tmp.name = 'canvas_1';
                tmp.x(360); tmp.y(10);
                tmp.width(60);
                tmp.height(60);
                _canvas_.core.arrangement.append(tmp);
                    tmp.resolution(5);
                    tmp._.fillStyle = 'rgb(0,0,0)';
                    tmp._.fillRect(tmp.$(5),tmp.$(5),tmp.$(160),tmp.$(160));
                    tmp._.fillStyle = 'rgba(255,0,255,0.75)';
                    tmp._.fillRect(tmp.$(0),tmp.$(0),tmp.$(20),tmp.$(20));
            
            var characters = [
                {char:'A', x:10+60*0, y:150+60*0},
                {char:'B', x:10+60*1, y:150+60*0},
                {char:'C', x:10+60*2, y:150+60*0},
                {char:'D', x:10+60*3, y:150+60*0},
                {char:'E', x:10+60*4, y:150+60*0},
                {char:'F', x:10+60*5, y:150+60*0},
                {char:'G', x:10+60*6, y:150+60*0},
                {char:'H', x:10+60*7, y:150+60*0},
                {char:'I', x:10+60*0, y:150+60*1},
                {char:'J', x:10+60*1, y:150+60*1},
                {char:'K', x:10+60*2, y:150+60*1},
                {char:'L', x:10+60*3, y:150+60*1},
                {char:'M', x:10+60*4, y:150+60*1},
                {char:'N', x:10+60*5, y:150+60*1},
                {char:'O', x:10+60*6, y:150+60*1},
                {char:'P', x:10+60*7, y:150+60*1},
                {char:'Q', x:10+60*0, y:150+60*2},
                {char:'R', x:10+60*1, y:150+60*2},
                {char:'S', x:10+60*2, y:150+60*2},
                // {char:'T', x:10+60*3, y:150+60*2},
                // {char:'U', x:10+60*4, y:150+60*2},
                // {char:'V', x:10+60*5, y:150+60*2},
                // {char:'W', x:10+60*6, y:150+60*2},
                // {char:'H', x:10+60*7, y:150+60*2},
                // {char:'Y', x:10+60*0, y:150+60*3},
                // {char:'Z', x:10+60*1, y:150+60*3},
            ];
            for(var a = 0; a < characters.length; a++){
                var tmp = _canvas_.core.shape.create('character');
                    tmp.name = 'character_'+a;
                    tmp.x(characters[a].x); tmp.y(characters[a].y);
                    tmp.width(60);
                    tmp.height(60);
                    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                    tmp.character(characters[a].char);
                    _canvas_.core.arrangement.append(tmp);
            }
            
            
            _canvas_.core.render.frame();


        }
    }
// })();
