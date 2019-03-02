(function() {
    const __canvasPrefix = 'workspace';
    var __canvasElements = document.getElementsByTagName('canvas');
    for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
        if( __canvasElements[__canvasElements_count].hasAttribute(__canvasPrefix) ){
            var _canvas_ = __canvasElements[__canvasElements_count];
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
                                    var image = { object:undefined, url:'', isLoaded:false, isChanged:true };
                                    this.imageURL = function(a){
                                        if(a==undefined){return image.url;}
                                        image.url = a;
                        
                                        image.object = new Image();
                                        image.object.src = image.url;
                                        image.isLoaded = false; image.object.onload = function(){ image.isLoaded = true; image.isChanged = true; };
                                    };
                        
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
                                        if(index == undefined){console.error("group shape: departing shape points not found");}
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
            _canvas_.system = new function(){};
            _canvas_.system.mouse = new function(){
                //setup
                    this.tmp = {};
                    this.functionList = {};
                    this.functionList.onmousedown = [];
                    this.functionList.onmousemove = [];
                    this.functionList.onmouseup = [];
                    this.functionList.onmouseleave = [];
                    this.functionList.onmouseenter = [];
                    this.functionList.onwheel = [];
                    this.functionList.onclick = [];
                    this.functionList.ondblclick = [];
                
                //utility functions
                    this.mouseInteractionHandler = function(moveCode, stopCode){
                        //save the old listener functions of the canvas
                            _canvas_.system.mouse.tmp.onmousemove_old = _canvas_.onmousemove;
                            _canvas_.system.mouse.tmp.onmouseleave_old = _canvas_.onmouseleave;
                            _canvas_.system.mouse.tmp.onmouseup_old = _canvas_.onmouseup;
                
                        //replace listener code
                            //movement code
                                _canvas_.onmousemove = function(event){ if(moveCode!=undefined){moveCode(event);} };
                            //stopping code
                                _canvas_.onmouseup = function(event){
                                    if(stopCode != undefined){ stopCode(event); }
                                    _canvas_.onmousemove = _canvas_.system.mouse.tmp.onmousemove_old;
                                    _canvas_.onmouseleave = _canvas_.system.mouse.tmp.onmouseleave_old;
                                    _canvas_.onmouseup = _canvas_.system.mouse.tmp.onmouseup_old;
                                };
                                _canvas_.onmouseleave = _canvas_.onmouseup;
                    };
                
                //connect callbacks to mouse function lists
                    [ 'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick' ].forEach(function(callback){
                        _canvas_.core.callback[callback] = function(x,y,event,shapes){ 
                            if(shapes.length > 0){ shapes[0][callback](x,y,event,shapes); }
                            else{ _canvas_.library.structure.functionListRunner( _canvas_.system.mouse.functionList[callback], _canvas_.system.keyboard.pressedKeys )({x:x,y:y,event:event}); }
                        }
                    });
            };
            _canvas_.system.keyboard = new function(){
                //setup
                    this.pressedKeys = {
                        control:false,
                        alt:false,
                        meta:false,
                    };
                    this.functionList = {};
                    this.functionList.onkeydown = [];
                    this.functionList.onkeyup = [];
                
                //utility functions
                    function customKeyInterpreter(event,press){
                        var pressedKeys = _canvas_.system.keyboard.pressedKeys;
                        if(event.code == 'ControlLeft' || event.code == 'ControlRight'){  pressedKeys.control = press; }
                        else if(event.code == 'AltLeft' || event.code == 'AltRight'){     pressedKeys.alt = press;     }
                        else if(event.code == 'MetaLeft' || event.code == 'MetaRight'){   pressedKeys.meta = press;    }
                        else if(event.code == 'ShiftLeft' || event.code == 'ShiftRight'){ pressedKeys.shift = press;   }
                
                        //adjustment for mac keyboards
                            if( window.navigator.platform.indexOf('Mac') != -1 ){
                                pressedKeys.option = pressedKeys.alt;
                                pressedKeys.command = pressedKeys.meta;
                            }
                    }
                    this.releaseAll = function(){
                        for(var a = 0; a < this.pressedKeys.length; a++){
                            this.releaseKey(this.pressedKeys[a]);
                        }
                    };
                    this.releaseKey = function(code){
                        _canvas_.onkeyup( new KeyboardEvent('keyup',{code:code}) );
                    }
                
                //connect callbacks to keyboard function lists
                    _canvas_.core.callback.onkeydown = function(x,y,event,shapes){
                        //if key is already pressed, don't press it again
                            if(_canvas_.system.keyboard.pressedKeys[event.code]){ return; }
                            _canvas_.system.keyboard.pressedKeys[event.code] = true;
                            customKeyInterpreter(event,true);
                        
                        //perform action
                            if(shapes.length > 0){ shapes[0].onkeydown(x,y,event,shapes); }
                            else{ _canvas_.library.structure.functionListRunner( _canvas_.system.keyboard.functionList.onkeydown, _canvas_.system.keyboard.pressedKeys )({x:x,y:y,event:event}); }
                    };
                
                    _canvas_.core.callback.onkeyup = function(x,y,event,shapes){
                        //if key isn't pressed, don't release it
                            if(!_canvas_.system.keyboard.pressedKeys[event.code]){return;}
                            delete _canvas_.system.keyboard.pressedKeys[event.code];
                            customKeyInterpreter(event,false);
                        
                        //perform action
                            if(shapes.length > 0){ shapes[0].onkeyup(x,y,event,shapes); }
                            else{ _canvas_.library.structure.functionListRunner( _canvas_.system.keyboard.functionList.onkeyup, _canvas_.system.keyboard.pressedKeys )({x:x,y:y,event:event}); }
                    };
            };
            
            //add main panes to arrangement
            _canvas_.system.pane = {};
            
            //background
                _canvas_.system.pane.background = _canvas_.core.shape.create('group');
                _canvas_.system.pane.background.name = 'background'
                _canvas_.system.pane.background.ignored = true;
                _canvas_.core.arrangement.append( _canvas_.system.pane.background );
            
            //middleground
                _canvas_.system.pane.middleground = _canvas_.core.shape.create('group');
                _canvas_.system.pane.middleground.name = 'middleground'
                _canvas_.system.pane.middleground.heedCamera = true;
                _canvas_.core.arrangement.append( _canvas_.system.pane.middleground );
            
                    //back
                        _canvas_.system.pane.middleground.back = _canvas_.core.shape.create('group');
                        _canvas_.system.pane.middleground.back.name = 'back'
                        _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground.back );
            
                    //middle
                        _canvas_.system.pane.middleground.middle = _canvas_.core.shape.create('group');
                        _canvas_.system.pane.middleground.middle.name = 'middle'
                        _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground.middle );
            
                    //front
                        _canvas_.system.pane.middleground.front = _canvas_.core.shape.create('group');
                        _canvas_.system.pane.middleground.front.name = 'front'
                        _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground.front );
            
            //foreground
                _canvas_.system.pane.foreground = _canvas_.core.shape.create('group');
                _canvas_.system.pane.foreground.name = 'foreground'
                _canvas_.core.arrangement.append( _canvas_.system.pane.foreground );
            
            
                
            //shortcuts
                _canvas_.system.pane.b = _canvas_.system.pane.background;
                _canvas_.system.pane.mb = _canvas_.system.pane.middleground.back;
                _canvas_.system.pane.mm = _canvas_.system.pane.middleground.middle;
                _canvas_.system.pane.mf = _canvas_.system.pane.middleground.front;
                _canvas_.system.pane.f = _canvas_.system.pane.foreground;
            
            //utility
                _canvas_.system.pane.getMiddlegroundPane = function(element){
                    var tmp = element;
                    do{
                        if(tmp == _canvas_.system.pane.mb){return _canvas_.system.pane.mb;}
                        else if(tmp == _canvas_.system.pane.mm){return _canvas_.system.pane.mm;}
                        else if(tmp == _canvas_.system.pane.mf){return _canvas_.system.pane.mf;}
                    }while((tmp=tmp.parent) != undefined);
                };

            _canvas_.interface = new function(){
                var interface = this;
            
                this.circuit = new function(){
                    this.recorder = function(context){
                    
                        //state
                            var state = {
                                recordedChunks: [],
                                recordingStartTime: -1,
                                recordingLength: 0,
                            };
                    
                        //flow
                            //flow chain
                                var flow = {
                                    leftIn:{}, rightIn:{},
                                    recordingNode:{},
                                    leftOut:{}, rightOut:{},
                                };
                    
                            //leftIn
                                flow.leftIn.node = context.createAnalyser();
                            //rightIn
                                flow.rightIn.node = context.createAnalyser();
                    
                            //recordingNode
                                flow.recordingNode.audioDest = new MediaStreamAudioDestinationNode(context);
                                flow.recordingNode.node = new MediaRecorder(flow.recordingNode.audioDest.stream, {mimeType : 'audio/webm'});
                    
                                flow.recordingNode.node.onstart = function(){};
                                flow.recordingNode.node.ondataavailable = function(e){
                                    state.recordedChunks.push(e.data);
                                };
                                flow.recordingNode.node.onpause = function(){};
                                flow.recordingNode.node.onresume = function(){};
                                flow.recordingNode.node.onerror = function(error){console.log(error);};
                                flow.recordingNode.node.onstop = function(){};
                    
                                flow.leftIn.node.connect(flow.recordingNode.audioDest);
                                flow.rightIn.node.connect(flow.recordingNode.audioDest);
                    
                            //leftOut
                                flow.leftOut.node = context.createAnalyser();
                                flow.leftIn.node.connect(flow.leftOut.node);
                            //rightIn
                                flow.rightOut.node = context.createAnalyser();
                                flow.rightIn.node.connect(flow.rightOut.node);
                    
                    
                        //internal functions
                            function getRecordingLength(){
                                switch(flow.recordingNode.node.state){
                                    case 'inactive': case 'paused':
                                        return state.recordingLength;
                                    break;
                                    case 'recording':
                                        return context.currentTime - state.recordingStartTime;
                                    break;
                                }            
                            }
                    
                        //controls
                            this.clear =  function(){
                                this.stop();
                                state.recordedChunks = [];
                                state.recordingStartTime = -1;
                                state.recordingLength = 0;
                            };
                            this.start =  function(){
                                this.clear();
                                flow.recordingNode.node.start();
                                state.recordingStartTime = context.currentTime;
                            };
                            this.pause =  function(){
                                if(this.state() == 'inactive'){return;}
                                state.recordingLength = getRecordingLength();
                                flow.recordingNode.node.pause();
                            };
                            this.resume = function(){
                                flow.recordingNode.node.resume();
                                state.recordingStartTime = context.currentTime - state.recordingLength;
                            };
                            this.stop =   function(){
                                if(this.state() == 'inactive'){return;}
                                state.recordingLength = getRecordingLength();
                                flow.recordingNode.node.stop();
                            };
                            this.export = function(){
                                return new Blob(state.recordedChunks, { type: 'audio/ogg; codecs=opus' });
                            };
                            this.save = function(filename='output'){
                                var a = document.createElement('a');
                                a.href = URL.createObjectURL(this.export());
                                a.download = filename+'.ogg';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            };
                    
                            this.state = function(){return flow.recordingNode.node.state;};
                            this.recordingTime = function(){
                                return getRecordingLength();
                            };
                            this.getTrack = function(){return this.export(); };
                    
                        //io
                            this.in_left  =  function(){return flow.leftIn.node;};
                            this.in_right =  function(){return flow.rightIn.node;};
                            this.out_left  = function(){return flow.leftOut.node;};
                            this.out_right = function(){return flow.rightOut.node;};
                    };

                    this.audioIn = function(
                        context, setupConnect=true
                    ){
                        //flow chain
                            var flow = {
                                audioDevice: null,
                                outAggregator: {}
                            };
                    
                        //outAggregator
                            flow.outAggregator.gain = 1;
                            flow.outAggregator.node = context.createGain();
                            _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain);
                    
                    
                        //output node
                            this.out = function(){return flow.outAggregator.node;}
                    
                        //methods
                            this.listDevices = function(callback){
                                navigator.mediaDevices.enumerateDevices().then(
                                    function(devices){
                                        callback(devices.filter((d) => d.kind === 'audioinput'));
                                    }
                                );
                            };
                            this.selectDevice = function(deviceId){
                                var promise = navigator.mediaDevices.getUserMedia({audio: { deviceId: deviceId}});
                                promise.then(
                                    function(source){
                                        audioDevice = source;
                                        _canvas_.library.audio.context.createMediaStreamSource(source).connect(flow.outAggregator.node);                    
                                    },
                                    function(error){
                                        console.warn('could not find audio input device: "' + deviceId + '"');
                                        console.warn('\terror:',error);
                                    }
                                );
                            };
                            this.gain = function(a){
                                if(a==null){return flow.outAggregator.gain;}
                                flow.outAggregator.gain = a;
                                _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain,a);
                            };
                    
                        //setup
                            if(setupConnect){this.selectDevice('default');}
                    };
                    this.looper = function(context){
                        //state
                            var state = {
                                itself:this,
                                fileLoaded:false,
                                rate:1,
                                loop:{active:true, start:0, end:1,timeout:null},
                            };
                    
                        //flow
                            //chain
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
                    
                                
                        //controls
                            this.load = function(type,callback,url=''){
                                state.fileLoaded = false;
                                _canvas_.library.audio.loadAudioFile(
                                    function(data){
                                        state.itself.stop();
                                        flow.track = data;
                                        state.fileLoaded = true;
                                        state.needlePosition = 0.0;
                                        callback(data);
                                    },
                                type,url);
                            };
                            this.start = function(){
                                //check if we should play at all (the file must be loaded)
                                    if(!state.fileLoaded){return;}
                                //stop any previous buffers, load buffer, enter settings and start from zero
                                    if(flow.bufferSource){
                                        flow.bufferSource.onended = function(){};
                                        flow.bufferSource.stop(0);
                                    }
                                    flow.bufferSource = _canvas_.library.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter);
                                    flow.bufferSource.playbackRate.value = state.rate;
                                    flow.bufferSource.loop = state.loop.active;
                                    flow.bufferSource.loopStart = state.loop.start*this.duration();
                                    flow.bufferSource.loopEnd = state.loop.end*this.duration();
                                    flow.bufferSource.start(0,0);
                                    flow.bufferSource.onended = function(){flow.bufferSource = null;};
                            };
                            this.stop = function(){
                                if(!state.fileLoaded || !flow.bufferSource){return;}
                                flow.bufferSource.stop(0);
                                flow.bufferSource = undefined;
                            };
                            this.rate = function(){
                                state.rate = value;
                            };
                    
                        //info
                            this.duration = function(){
                                if(!state.fileLoaded){return -1;}
                                return flow.track.duration;
                            };
                            this.title = function(){
                                if(!state.fileLoaded){return '';}
                                return flow.track.name;
                            };
                            this.waveformSegment = function(data={start:0,end:1}){
                                if(data==undefined){return [];}
                                if(!state.fileLoaded){return [];}
                                return _canvas_.library.audio.waveformSegment(flow.track.buffer,data);
                            };
                            this.loop = function(bool=false){
                                if(data==undefined){return data;}
                                state.loop.active = bool;
                            };
                            this.loopBounds = function(data={start:0,end:1}){
                                if(data==undefined){return data;}
                    
                                state.loop.start = data.start!=undefined ? data.start : state.loop.start;
                                state.loop.end   = data.end!=undefined ? data.end : state.loop.end;
                            };
                    };

                    this.oneShot_single = function(context){
                        //state
                            var state = {
                                itself:this,
                                fileLoaded:false,
                                rate:1,
                            };
                    
                        //flow
                            //chain
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
                    
                                
                        //controls
                            this.load = function(type,callback,url=''){
                                state.fileLoaded = false;
                                _canvas_.library.audio.loadAudioFile(
                                    function(data){
                                        state.itself.stop();
                                        flow.track = data;
                                        state.fileLoaded = true;
                                        state.needlePosition = 0.0;
                                        callback(data);
                                    },
                                type,url);
                            };
                            this.fire = function(){
                                //check if we should play at all (the file must be loaded)
                                    if(!state.fileLoaded){return;}
                                //stop any previous buffers, load buffer, enter settings and start from zero
                                    if(flow.bufferSource){
                                        flow.bufferSource.onended = function(){};
                                        flow.bufferSource.stop(0);
                                    }
                                    flow.bufferSource = _canvas_.library.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter);
                                    flow.bufferSource.playbackRate.value = state.rate;
                                    flow.bufferSource.start(0,0);
                                    flow.bufferSource.onended = function(){flow.bufferSource = null;};
                            };
                            this.stop = function(){
                                if(!state.fileLoaded){return;}
                                flow.bufferSource.stop(0);
                                flow.bufferSource = undefined;
                            };
                            this.rate = function(){
                                state.rate = value;
                            };
                    
                        //info
                            this.duration = function(){
                                if(!state.fileLoaded){return -1;}
                                return flow.track.duration;
                            };
                            this.title = function(){
                                if(!state.fileLoaded){return '';}
                                return flow.track.name;
                            };
                            this.waveformSegment = function(data={start:0,end:1}){
                                if(data==undefined){return [];}
                                if(!state.fileLoaded){return [];}
                                return _canvas_.library.audio.waveformSegment(flow.track.buffer,data);
                            };
                    };

                    this.oneShot_multi = function(context){
                        //state
                            var state = {
                                itself:this,
                                fileLoaded:false,
                                rate:1,
                            };
                    
                        //flow
                            //chain
                            var flow = {
                                track:{},
                                bufferSource:null,
                                bufferSourceArray:[],
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
                                this.audioOut = function(channel){
                                    switch(channel){
                                        case 'r': return flow.rightOut.node; break;
                                        case 'l': return flow.leftOut.node; break;
                                        default: console.error('"part.circuit.alpha.oneShot_multi.audioOut" unknown channel "'+channel+'"'); break;
                                    }
                                };
                                this.out_left  = function(){return this.audioOut('l');}
                                this.out_right = function(){return this.audioOut('r');}
                    
                    
                    
                    
                    
                    
                    
                    
                        //loading/unloading
                            this.loadRaw = function(data){
                                if(Object.keys(data).length === 0){return;}
                                flow.track = data;
                                state.fileLoaded = true;
                                state.needlePosition = 0.0;
                            };
                            this.load = function(type,callback,url){
                                state.fileLoaded = false;
                                _canvas_.library.audio.loadAudioFile(
                                    function(data){
                                        state.itself.loadRaw(data);
                                        if(callback != undefined){ callback(data); }
                                    },
                                type,url);
                            };
                            this.unloadRaw = function(){
                                return flow.track;
                            };
                    
                        //control
                            //play
                                this.fire = function(start=0,duration){
                                    //check if we should play at all (the file must be loaded)
                                        if(!state.fileLoaded){return;}
                                    //load buffer, add onend code, enter rate setting, start and add to the array
                                        var temp = _canvas_.library.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter, function(){
                                            flow.bufferSourceArray.splice(flow.bufferSourceArray.indexOf(this),1);
                                        });
                                        temp.playbackRate.value = state.rate;
                                        temp.start(0,start*state.rate,duration*state.rate);
                                        flow.bufferSourceArray.push(temp);
                                };
                                this.panic = function(){
                                    while(flow.bufferSourceArray.length > 0){
                                        flow.bufferSourceArray.shift().stop(0);
                                    }
                                };
                            //options
                                this.rate = function(value){ 
                                    if(value == undefined){return state.rate;}
                                    if(value == 0){value = 1/1000000;}
                                    state.rate = value;
                                };
                    
                        //info
                            this.duration = function(){
                                if(!state.fileLoaded){return -1;}
                                return flow.track.duration / state.rate;
                            };
                            this.title = function(){
                                if(!state.fileLoaded){return '';}
                                return flow.track.name;
                            };
                            this.waveformSegment = function(data={start:0,end:1}){
                                if(data==undefined){return [];}
                                if(!state.fileLoaded){return [];}
                                return _canvas_.library.audio.waveformSegment(flow.track.buffer,data);
                            };
                    };
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
                            analyser.analyserNode = _canvas_.library.audio.context.createAnalyser();
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
                    this.reverbUnit = function(
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
                            _canvas_.library.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);
                    
                        //reverbGain / bypassGain
                            flow.reverbGain.gain = 0.5;
                            flow.bypassGain.gain = 0.5;
                            flow.reverbGain.node = context.createGain();
                            flow.bypassGain.node = context.createGain();
                            _canvas_.library.audio.changeAudioParam(context,flow.reverbGain.node.gain, flow.reverbGain.gain, 0.01, 'instant', true);
                            _canvas_.library.audio.changeAudioParam(context,flow.bypassGain.node.gain, flow.bypassGain.gain, 0.01, 'instant', true);
                    
                        //reverbNode
                            flow.reverbNode.impulseResponseRepoURL = 'https://metasophiea.com/lib/audio/impulseResponse/';
                            flow.reverbNode.selectedReverbType = 'Musikvereinsaal.wav';
                            flow.reverbNode.node = context.createConvolver();
                    
                            function setReverbType(repoURL,type,callback){
                                var ajaxRequest = new XMLHttpRequest();
                                ajaxRequest.open('GET', repoURL+type, true);
                                ajaxRequest.responseType = 'arraybuffer';
                                ajaxRequest.onload = function(){
                                    //undo connections
                                        flow.reverbNode.node.disconnect();
                                    //create new convolver
                                        flow.reverbNode.node = context.createConvolver();
                                    //redo connections
                                        flow.reverbGain.node.connect(flow.reverbNode.node);
                                        flow.reverbNode.node.connect(flow.outAggregator.node);
                                    //load in new buffer
                                        context.decodeAudioData(ajaxRequest.response, function(buffer){flow.reverbNode.node.buffer = buffer;}, function(e){console.warn("Error with decoding audio data" + e.err);});
                                    //run any callbacks
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
                            _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                    
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
                                _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, a, 0.01, 'instant', true);
                            };
                            this.wetdry = function(a){
                                if(a==null){return flow.reverbGain.gain;}
                                flow.reverbGain.gain=a;
                                flow.bypassGain.gain=1-a;
                                _canvas_.library.audio.changeAudioParam(context,flow.reverbGain.node.gain, flow.reverbGain.gain, 0.01, 'instant', true);
                                _canvas_.library.audio.changeAudioParam(context,flow.bypassGain.node.gain, flow.bypassGain.gain, 0.01, 'instant', true);
                            };
                    
                        //setup
                            setReverbType(flow.reverbNode.impulseResponseRepoURL,flow.reverbNode.selectedReverbType);
                    };

                    this.multibandFilter = function(
                        context, bandcount, frames=false
                    ){
                        //saved values
                            var saved = {
                                settings:[], //{Q, gain, frequency, fresh(bool)}
                                responses:[], //{magResponse, phaseResponse, frequencyArray}
                            };
                    
                        //flow chain
                            var flow = {
                                inAggregator: {},
                                filterNodes: [],
                                gainNodes: [],
                                outAggregator: {},
                            };
                    
                            //inAggregator
                                flow.inAggregator.gain = 1;
                                flow.inAggregator.node = context.createGain();
                                _canvas_.library.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);
                    
                            //filterNodes
                                function makeGenericFilter(type){
                                    var temp = { frequency:110, Q:0.1, node:context.createBiquadFilter() };
                                    temp.node.type = type;
                                    _canvas_.library.audio.changeAudioParam(context, temp.node.frequency,110,0.01,'instant',true);
                                    _canvas_.library.audio.changeAudioParam(context, temp.node.Q,0.1,0.01,'instant',true);
                                    return temp;
                                }
                    
                                if(frames){
                                    if(bandcount < 2){bandcount = 2;}
                                    //lowpass
                                        flow.filterNodes.push(makeGenericFilter('lowpass'));
                                    //bands
                                        for(var a = 1; a < bandcount-1; a++){ flow.filterNodes.push(makeGenericFilter('bandpass')); }
                                    //highpass
                                        flow.filterNodes.push(makeGenericFilter('highpass'));
                                }else{
                                    //bands
                                        for(var a = 0; a < bandcount; a++){ flow.filterNodes.push(makeGenericFilter('bandpass')); }
                                }
                    
                            //gainNodes
                                for(var a = 0; a < bandcount; a++){
                                    var temp = { gain:1, node:context.createGain() };
                                    _canvas_.library.audio.changeAudioParam(context, temp.node.gain, temp.gain, 0.01, 'instant', true);
                                    flow.gainNodes.push(temp);
                                    saved.settings[a] = { Q:0.1, gain:1, frequency:110, fresh:true };
                                }
                    
                            //outAggregator
                                flow.outAggregator.gain = 1;
                                flow.outAggregator.node = context.createGain();
                                _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                    
                    
                        //do connections
                            for(var a = 0; a < bandcount; a++){
                                flow.inAggregator.node.connect(flow.filterNodes[a].node);
                                flow.filterNodes[a].node.connect(flow.gainNodes[a].node);
                                flow.gainNodes[a].node.connect(flow.outAggregator.node);
                            }
                    
                    
                        //input/output node
                            this.in = function(){return flow.inAggregator.node;}
                            this.out = function(){return flow.outAggregator.node;}
                    
                    
                        //controls
                            this.masterGain = function(value){
                                if(value == undefined){return flow.outAggregator.gain;}
                                flow.outAggregator.gain = value;
                                _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                            };
                            this.gain = function(band,value){
                                if(value == undefined){return flow.gainNodes[band].gain;}
                                flow.gainNodes[band].gain = value;
                                _canvas_.library.audio.changeAudioParam(context, flow.gainNodes[band].node.gain, flow.gainNodes[band].gain, 0.01, 'instant', true);
                    
                                saved.settings[band].gain = value;
                                saved.settings[band].fresh = true;
                            };
                            this.frequency = function(band,value){
                                if(value == undefined){return flow.filterNodes[band].frequency;}
                                flow.filterNodes[band].frequency = value;
                                _canvas_.library.audio.changeAudioParam(context, flow.filterNodes[band].node.frequency,flow.filterNodes[band].frequency,0.01,'instant',true);
                    
                                saved.settings[band].frequency = value;
                                saved.settings[band].fresh = true;
                            };
                            this.Q = function(band,value){
                                if(value == undefined){return flow.filterNodes[band].Q;}
                                flow.filterNodes[band].Q = value;
                                _canvas_.library.audio.changeAudioParam(context, flow.filterNodes[band].node.Q,flow.filterNodes[band].Q,0.01,'instant',true);
                    
                                saved.settings[band].Q = value;
                                saved.settings[band].fresh = true;
                            };
                        
                            this.measureFrequencyResponse = function(band, frequencyArray){
                                //if band is undefined, gather the response for all bands
                                    if(band == undefined){ return Array(bandcount).fill(0).map((a,i) => this.measureFrequencyResponse(i,frequencyArray)); }
                    
                                //if band hasn't had it's setttings changed since last time, just return the last values (multiplied by the master gain)
                                    if(!saved.settings[band].fresh){
                                        return [ saved.responses[band].magResponse.map(a => a*flow.outAggregator.gain), saved.responses[band].requencyArray ];
                                    }
                    
                                //do full calculation of band, save and return
                                    var Float32_frequencyArray = new Float32Array(frequencyArray);
                                    var magResponseOutput = new Float32Array(Float32_frequencyArray.length);
                                    var phaseResponseOutput = new Float32Array(Float32_frequencyArray.length);
                                    flow.filterNodes[band].node.getFrequencyResponse(Float32_frequencyArray,magResponseOutput,phaseResponseOutput);
                    
                                    saved.responses[band] = {
                                        magResponse:magResponseOutput.map(a => a*flow.gainNodes[band].gain), 
                                        phaseResponse:phaseResponseOutput, 
                                        frequencyArray:frequencyArray,
                                    };
                                    saved.settings[band].fresh = false;
                                    return [magResponseOutput.map(a => a*flow.gainNodes[band].gain*flow.outAggregator.gain),frequencyArray];
                            };
                    };
                    this.distortionUnit = function(
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
                            _canvas_.library.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);
                    
                        //distortionNode
                            flow.distortionNode.distortionAmount = 0;
                            flow.distortionNode.oversample = 'none'; //'none', '2x', '4x'
                            flow.distortionNode.resolution = 100;
                            function makeDistortionNode(){
                                flow.inAggregator.node.disconnect();
                                if(flow.distortionNode.node){flow.distortionNode.node.disconnect();}
                                
                                flow.distortionNode.node = context.createWaveShaper();
                                    flow.distortionNode.curve = new Float32Array(_canvas_.library.math.curveGenerator.s(flow.distortionNode.resolution,-1,1,flow.distortionNode.distortionAmount));
                                    flow.distortionNode.node.curve = flow.distortionNode.curve;
                                    flow.distortionNode.node.oversample = flow.distortionNode.oversample;
                                    
                                flow.inAggregator.node.connect(flow.distortionNode.node);
                                flow.distortionNode.node.connect(flow.outAggregator.node);
                            }
                    
                        //outAggregator
                            flow.outAggregator.gain = 0;
                            flow.outAggregator.node = context.createGain();    
                            _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                    
                    
                        //input/output node
                            this.in = function(){return flow.inAggregator.node;}
                            this.out = function(){return flow.outAggregator.node;}
                    
                        //controls
                            this.inGain = function(a){
                                if(a==null){return flow.inAggregator.gain;}
                                flow.inAggregator.gain=a;
                                _canvas_.library.audio.changeAudioParam(context,flow.inAggregator.node.gain, a, 0.01, 'instant', true);
                            };
                            this.outGain = function(a){
                                if(a==null){return flow.outAggregator.gain;}
                                flow.outAggregator.gain=a;
                                _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, a, 0.01, 'instant', true);
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
                    this.player = function(context){
                        //state
                            var state = {
                                itself:this,
                                fileLoaded:false,
                                playing:false,
                                playhead:{ position:0, lastSightingTime:0 },
                                loop:{ active:false, start:0, end:1, timeout:null},
                                rate:1,
                            };
                    
                        //flow
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
                    
                    
                        //internal functions
                            function playheadCompute(){
                                //this code is used to update the playhead position as well as to calculate when the loop end will occur, 
                                //and thus when the playhead should jump to the start of the loop. The actual looping of the audio is 
                                //done by the system, so this process is done solely to update the playhead position data.
                                //  Using the playhead's current position and play rate; the length of time before the playhead is 
                                //scheduled to reach the end bound of the loop is calculated and given to a timeout. When this timeout 
                                //occurs; the playhead will jump to the start bound and the process is run again to calculate the new 
                                //length of time before the playhead reaches the end bound.
                                //  The playhead cannot move beyond the end bound, thus any negative time calculated will be set to
                                //zero, and the playhead will instantly jump back to the start bound (this is to mirror the operation of
                                //the underlying audio system)
                    
                                clearInterval(state.loop.timeout);
                                
                                //update playhead position data
                                state.playhead.position = state.itself.currentTime();
                                state.playhead.lastSightingTime = context.currentTime;
                    
                                //obviously, if the loop isn't active or the file isn't playing, don't do any of the work
                                if(!state.loop.active || !state.playing){return;}
                    
                                //calculate time until the timeout should be called
                                var timeUntil = state.loop.end - state.itself.currentTime();
                                if(timeUntil < 0){timeUntil = 0;}
                    
                                //the callback (which performs the jump to the start of the loop, and recomputes)
                                state.loop.timeout = setTimeout(function(){
                                    state.itself.jumpTo(state.loop.start,false);
                                    playheadCompute();
                                }, (timeUntil*1000)/state.rate);
                            }
                            function jumpToTime(value){
                                //check if we should jump at all
                                //(file must be loaded)
                                    if(!state.fileLoaded){return;}
                                //if playback is stopped; only adjust the playhead position
                                    if( !state.playing ){
                                        state.playhead.position = value;
                                        state.playhead.lastSightingTime = context.currentTime;
                                        return;
                                    }
                    
                                //if loop is enabled, and the desired value is beyond the loop's end boundry,
                                //set the value to the start value
                                    if(state.loop.active && value > state.loop.end){value = state.loop.start;}
                    
                                //stop playback, with a callback that will change the playhead position
                                //and then restart playback
                                    state.itself.stop(function(){
                                        state.playhead.position = value;
                                        state.playhead.lastSightingTime = context.currentTime;
                                        state.itself.start();
                                    });
                            }
                        
                        //controls
                            this.unloadRaw = function(){
                                return flow.track;
                            };
                            this.loadRaw = function(data,callback){
                                if(Object.keys(data).length === 0){return;}
                                state.itself.stop();
                                flow.track = data;
                                state.fileLoaded = true;
                                state.playhead.position = 0;
                                callback(data);
                            };
                            this.load = function(type,callback,url=''){
                                state.fileLoaded = false;
                                _canvas_.library.audio.loadAudioFile(
                                    function(data){
                                        state.itself.stop();
                                        flow.track = data;
                                        state.fileLoaded = true;
                                        state.playhead.position = 0;
                                        callback(data);
                                    },
                                type,url);
                            };
                            this.start = function(){
                                //check if we should play at all
                                //(player must be stopped and file must be loaded)
                                    if(state.playing || !state.fileLoaded){return;}
                                //load buffer, enter settings and start from playhead position
                                    flow.bufferSource = _canvas_.library.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter, function(a){state.itself.stop();});
                                    flow.bufferSource.loop = state.loop.active;
                                    flow.bufferSource.loopStart = state.loop.start;
                                    flow.bufferSource.loopEnd = state.loop.end;
                                    flow.bufferSource.playbackRate.value = state.rate;
                                    flow.bufferSource.start(0,state.playhead.position);
                                //log the starting time, play state
                                    state.playhead.lastSightingTime = context.currentTime;
                                    state.playing = true;
                                    playheadCompute();
                            };
                            this.stop = function(callback){
                                //check if we should stop at all (player must be playing)
                                    if( !state.playing ){return;}
                                //replace the onended callback (if we get one)
                                //(this callback will be replaced when 'play' is run again)
                                    if(callback){flow.bufferSource.onended = function(){callback();};}
                                //actually stop the buffer and destroy it
                                    flow.bufferSource.stop(0);
                                    flow.bufferSource = undefined;
                                //log playhead position, play state and run playheadCompute
                                    playheadCompute();
                                    state.playing = false;
                            };
                            this.jumpTo = function(value=0,percent=true){
                                if(percent){
                                    value = (value>1 ? 1 : value);
                                    value = (value<0 ? 0 : value);
                                    jumpToTime(this.duration()*value);
                                }else{jumpToTime(value);}
                                playheadCompute();
                            };
                            this.loop = function(data={active:false,start:0,end:1},percent=true){
                                if(data == undefined){return state.loop;}
                    
                                if(data.active != undefined){
                                    state.loop.active = data.active;
                                    if(flow.bufferSource){flow.bufferSource.loop = data.active;}
                                }
                    
                                if( data.start!=undefined || data.end!=undefined){
                                    var mux = percent ? this.duration() : 1;
                                    state.loop.start = data.start!=undefined ? data.start*mux : state.loop.start;
                                    state.loop.end   = data.end!=undefined ?   data.end*mux :   state.loop.end;
                                    if(flow.bufferSource){
                                        flow.bufferSource.loopStart = state.loop.start;
                                        flow.bufferSource.loopEnd = state.loop.end;
                                    }
                                }
                    
                                playheadCompute();
                            };
                            this.rate = function(value=1){
                                state.rate = value;
                                if(flow.bufferSource){flow.bufferSource.playbackRate.value = value;}
                                playheadCompute();
                            };
                    
                        //info
                            this.isLoaded = function(){return state.fileLoaded;};
                            this.duration = function(){return !state.fileLoaded ? -1 : flow.track.duration;};
                            this.title = function(){return !state.fileLoaded ? '' : flow.track.name;};
                            this.currentTime = function(){
                                //check if file is loaded
                                    if(!state.fileLoaded){return -1;}
                                //if playback is stopped, return the playhead position, 
                                    if(!state.playing){return state.playhead.position;}
                                //otherwise, calculate the current position
                                    return state.playhead.position + state.rate*(context.currentTime - state.playhead.lastSightingTime);
                            };
                            this.progress = function(){return this.currentTime()/this.duration()};
                            this.waveformSegment = function(data={start:0,end:1},resolution){
                                if(data==undefined || !state.fileLoaded){return [];}
                                return _canvas_.library.audio.waveformSegment(flow.track.buffer, data, resolution);
                            };
                    };

                    this.channelMultiplier = function(
                        context, outputCount=2
                    ){
                        //flow
                            //flow chain
                                var flow = {
                                    in: {},
                                    outs:[],
                                    out_0: {}, out_1: {},
                                };
                            
                            //in
                                flow.in.gain = 1;
                                flow.in.node = context.createGain();    
                                _canvas_.library.audio.changeAudioParam(context,flow.in.node.gain, flow.in.gain, 0.01, 'instant', true);
                    
                            //outs
                                for(var a = 0; a < outputCount; a++){
                                    var temp = { gain:0.5, node:context.createGain() };
                                    _canvas_.library.audio.changeAudioParam(context,temp.node.gain, temp.gain, 0.01, 'instant', true);
                                    flow.outs.push(temp);
                                    flow.in.node.connect(temp.node);
                                }
                    
                        //input/output node
                            this.in = function(){return flow.in.node;}
                            this.out = function(a){return flow.outs[a].node;}
                    
                        //controls
                            this.inGain = function(a){
                                if(a == undefined){return flow.in.gain;}
                                flow.in.gain = a;
                                _canvas_.library.audio.changeAudioParam(context,flow.in.node.gain, flow.in.gain, 0.01, 'instant', true);
                            };
                            this.outGain = function(a,value){
                                if(value == undefined){ return flow.outs[a].gain; }
                                flow.outs[a].gain = value;
                                _canvas_.library.audio.changeAudioParam(context,flow.outs[a].node.gain, flow.outs[a].gain, 0.01, 'instant', true);
                            };
                    };
                        
                    this.filterUnit = function(
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
                            _canvas_.library.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);
                    
                        //filterNode
                            flow.filterNode.node = context.createBiquadFilter();
                    	    flow.filterNode.node.type = "lowpass";
                            _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.frequency,110,0.01,'instant',true);
                            _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.gain,1,0.01,'instant',true);
                            _canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.Q,0.1,0.01,'instant',true);
                    
                        //outAggregator
                            flow.outAggregator.gain = 1;
                            flow.outAggregator.node = context.createGain();
                            _canvas_.library.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                    
                    
                        //do connections
                            flow.inAggregator.node.connect(flow.filterNode.node);
                            flow.filterNode.node.connect(flow.outAggregator.node);
                    
                        //input/output node
                            this.in = function(){return flow.inAggregator.node;}
                            this.out = function(){return flow.outAggregator.node;}
                    
                        //methods
                            this.type = function(type){flow.filterNode.node.type = type;};
                            this.frequency = function(value){_canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.frequency,value,0.01,'instant',true);};
                            this.gain = function(value){_canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.gain,value,0.01,'instant',true);};
                            this.Q = function(value){_canvas_.library.audio.changeAudioParam(context, flow.filterNode.node.Q,value,0.01,'instant',true);};
                            this.measureFrequencyResponse = function(start,end,step){
                                var frequencyArray = [];
                                for(var a = start; a < end; a += step){frequencyArray.push(a);}
                            
                                return this.measureFrequencyResponse_values(frequencyArray);
                            };
                            this.measureFrequencyResponse_values = function(frequencyArray){
                                var Float32_frequencyArray = new Float32Array(frequencyArray);
                                var magResponseOutput = new Float32Array(Float32_frequencyArray.length);
                                var phaseResponseOutput = new Float32Array(Float32_frequencyArray.length);
                            
                                flow.filterNode.node.getFrequencyResponse(Float32_frequencyArray,magResponseOutput,phaseResponseOutput);
                                return [magResponseOutput,frequencyArray];
                            };
                    };

                    this.synthesizer = function(
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
                                context, connection, midinumber,
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
                                        this.generator.frequency.setTargetAtTime(_canvas_.library.audio.num2freq(midinumber+12*octave), context.currentTime, 0);
                                        this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
                                        this.generator.start(0);
                    
                                    this.gain = context.createGain();
                                        this.generator.connect(this.gain);
                                        this.gain.gain.setTargetAtTime(0, context.currentTime, 0);
                                        _canvas_.library.audio.changeAudioParam(context,this.gain.gain, gain, attack.time, attack.curve, false);
                                        this.gain.connect(connection);
                    
                                    this.detune = function(target,time,curve){
                                        _canvas_.library.audio.changeAudioParam(context,this.generator.detune,target,time,curve);
                                    };
                                    this.changeVelocity = function(a){
                                        _canvas_.library.audio.changeAudioParam(context,this.gain.gain,a,attack.time,attack.curve);
                                    };
                                    this.stop = function(){
                                        _canvas_.library.audio.changeAudioParam(context,this.gain.gain,0,release.time,release.curve, false);
                                        setTimeout(function(that){
                                            that.gain.disconnect(); 
                                            that.generator.stop(); 
                                            that.generator.disconnect(); 
                                            that.gain=null; 
                                            that.generator=null; 
                                            that=null;
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
                                    _canvas_.library.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.01, flow.wobbler_gain.wave );
                                    return;
                                }
                                flow.wobbler_gain.interval = setInterval(function(){
                                    if(flow.wobbler_gain.phase){ _canvas_.library.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
                                    else{                        _canvas_.library.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1-flow.wobbler_gain.depth,  0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
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
                                    flow.liveOscillators[note.num].changeVelocity(note.velocity);
                                }
                            };
                            this.panic = function(){
                                var OSCs = Object.keys(flow.liveOscillators);
                                for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
                            };
                            this.waveType = function(a){if(a==null){return flow.OSCmaker.waveType;}flow.OSCmaker.waveType=a;};
                            this.periodicWave = function(a){if(a==null){return flow.OSCmaker.periodicWave;}flow.OSCmaker.periodicWave=a;};
                            this.gain = function(target,time,curve){ return _canvas_.library.audio.changeAudioParam(context,flow.mainOut.node.gain,target,time,curve); };
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
                                if(target==null){return flow.OSCmaker.detune;}
                    
                                //change stored value for any new oscillators that are made
                                    var start = flow.OSCmaker.detune;
                                    var mux = target-start;
                                    var stepsPerSecond = Math.round(Math.abs(mux));
                                    var totalSteps = stepsPerSecond*time;
                    
                                    var steps = [1];
                                    switch(curve){
                                        case 'linear': steps = system.utility.math.curveGenerator.linear(totalSteps); break;
                                        case 'exponential': steps = system.utility.math.curveGenerator.exponential(totalSteps); break;
                                        case 's': steps = system.utility.math.curveGenerator.s(totalSteps,8); break;
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

                };
                this.part = new function(){
                    var interfacePart = this;
                    
                    this.collection = new function(){
                        this.basic = new function(){
                            this.polygon = function( name=null, points=[], ignored=false, colour={r:1,g:0,b:1,a:1}, pointsAsXYArray=[] ){
                                var temp = _canvas_.core.shape.create('polygon');
                                temp.name = name;
                                temp.ignored = ignored;
                                temp.colour = colour;
                                
                                if(points.length != 0){ temp.points(points); }
                                else{ temp.pointsAsXYArray(pointsAsXYArray); }
                                return temp;
                            }
                            this.rectangleWithOutline = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, colour={r:1,g:0,b:1,a:1}, thickness=0, lineColour={r:0,g:0,b:0,a:0} ){
                                var temp = _canvas_.core.shape.create('rectangleWithOutline');
                                temp.name = name;
                                temp.ignored = ignored;
                                temp.colour = colour;
                                temp.lineColour = lineColour;
                                
                                temp.x(x); 
                                temp.y(y);
                                temp.width(width); 
                                temp.height(height);
                                temp.angle(angle);
                                temp.anchor(anchor);
                                temp.thickness(thickness);
                                return temp;
                            };
                            this.circle = function( name=null, x=0, y=0, angle=0, radius=10, ignored=false, colour={r:1,g:0,b:1,a:1} ){
                                var temp = _canvas_.core.shape.create('circle');
                                temp.name = name;
                                temp.ignored = ignored;
                                temp.colour = colour;
                                
                                temp.x(x);
                                temp.y(y);
                                temp.angle(angle);
                                temp.radius(radius);
                                return temp;
                            };
                            this.canvas = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, resolution=1 ){
                                var temp = _canvas_.core.shape.create('canvas');
                                temp.name = name;
                                temp.ignored = ignored;
                                
                                temp.x(x); 
                                temp.y(y);
                                temp.width(width); 
                                temp.height(height);
                                temp.angle(angle);
                                temp.anchor(anchor);
                                temp.resolution(resolution);
                                return temp;
                            };
                            this.image = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, url='' ){
                                var temp = _canvas_.core.shape.create('image');
                                temp.name = name;
                                temp.ignored = ignored;
                                
                                temp.x(x); 
                                temp.y(y);
                                temp.width(width); 
                                temp.height(height);
                                temp.angle(angle);
                                temp.anchor(anchor);
                                temp.imageURL(url);
                                return temp;
                            };
                            this.loopedPath = function( name=null, points=[], thickness=1, ignored=false, colour={r:0,g:0,b:0,a:1}, pointsAsXYArray=[] ){
                                var temp = _canvas_.core.shape.create('loopedPath');
                                temp.name = name;
                                temp.ignored = ignored;
                                temp.colour = colour;
                                
                                if(points.length != 0){ temp.points(points); }
                                else{ temp.pointsAsXYArray(pointsAsXYArray); }
                                temp.thickness(thickness); 
                                return temp;
                            }
                            this.path = function( name=null, points=[], thickness=1, ignored=false, colour={r:0,g:0,b:0,a:1}, pointsAsXYArray=[] ){
                                var temp = _canvas_.core.shape.create('path');
                                temp.name = name;
                                temp.ignored = ignored;
                                temp.colour = colour;
                                
                                if(points.length != 0){ temp.points(points); }
                                else{ temp.pointsAsXYArray(pointsAsXYArray); }
                                temp.thickness(thickness); 
                                return temp;
                            }
                            this.rectangle = function( name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, colour={r:1,g:0,b:1,a:1} ){
                                var temp = _canvas_.core.shape.create('rectangle');
                                temp.name = name;
                                temp.ignored = ignored;
                                temp.colour = colour;
                                
                                temp.x(x); 
                                temp.y(y);
                                temp.width(width); 
                                temp.height(height);
                                temp.angle(angle);
                                temp.anchor(anchor);
                                return temp;
                            };
                            this.group = function( name=null, x=0, y=0, angle=0, ignored=false ){
                                var temp = _canvas_.core.shape.create('group');
                                temp.name = name;
                                temp.ignored = ignored;
                                
                                temp.x(x); 
                                temp.y(y);
                                temp.angle(angle);
                                return temp;
                            }
                        };
                        this.control = new function(){
                            this.slidePanel_image = function(
                                name='slidePanel_image', 
                                x, y, width=80, height=95, angle=0, interactable=true,
                                handleHeight=0.1, count=8, startValue=0, resetValue=0.5,
                            
                                handleURL, backingURL, slotURL, overlayURL,
                            
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //slides
                                        for(var a = 0; a < count; a++){
                                            var temp = interfacePart.builder(
                                                'slide_image', 'slide_'+a, {
                                                    x:a*(width/count), y:0,
                                                    width:width/count, height:height, interactable:interactable, handleHeight:handleHeight,
                                                    value:startValue, resetValue:resetValue,
                                                    handleURL:handleURL, backingURL:backingURL, slotURL:slotURL,
                                                    onchange:function(value){ if(!object.onchange){return;} object.onchange(this.id,value); },
                                                    onrelease:function(value){ if(!object.onrelease){return;} object.onrelease(this.id,value); },
                                                }
                                            );
                                            temp.__calculationAngle = angle;
                                            object.append(temp);
                                        }
                                    //overlay
                                        if(overlayURL != undefined){
                                            var overlay = interfacePart.builder('image','overlay',{width:width, height:height, url:overlayURL});
                                            object.append(overlay);
                                        }
                            
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                            
                                        for(var a = 0; a < count; a++){
                                            object.children[a].interactable(bool);
                                        }
                                    };
                            
                                return object;
                            };
                            this.rangeslide_image = function(
                                name='rangeslide_image', 
                                x, y, width=10, height=95, angle=0, interactable=true,
                                handleHeight=0.1, spanWidth=0.75, values={start:0,end:1}, resetValues={start:-1,end:-1},
                            
                                handleURL, backingURL, slotURL,
                                invisibleHandleStyle = {r:1,g:0,b:0,a:0},
                                spanURL,
                            
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //default to non-image version if image links are missing
                                    if(handleURL == undefined || backingURL == undefined || slotURL == undefined || spanURL == undefined){
                                        return this.rangeslide(
                                            name, x, y, width, height, angle, interactable,
                                            handleHeight, spanWidth, values, resetValues,
                                            undefined, undefined, undefined, invisibleHandleStyle, undefined,
                                            onchange, onrelease,
                                        );
                                    }
                            
                            
                            
                                var grappled = false;
                                var handleNames = ['start','end'];
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing and slot group
                                        var backingAndSlot = interfacePart.builder('group','backingAndSlotGroup');
                                        object.append(backingAndSlot);
                                        //backing
                                            var backing = interfacePart.builder('image','backing',{width:width, height:height, url:backingURL});
                                            backingAndSlot.append(backing);
                                        //slot
                                            var slot = interfacePart.builder('image','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), url:slotURL});
                                            backingAndSlot.append(slot);
                                        //backing and slot cover
                                            var backingAndSlotCover = interfacePart.builder('rectangle','backingAndSlotCover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                            backingAndSlot.append(backingAndSlotCover);
                            
                                    //span
                                        var span = interfacePart.builder('image','span',{x:width*((1-spanWidth)/2), y:height*handleHeight, width:width*spanWidth, height:height - 2*height*handleHeight, url:slotURL});
                                        object.append(span);
                            
                                    //handles
                                        var handles = {}
                                        for(var a = 0; a < handleNames.length; a++){
                                            //grouping
                                                handles[handleNames[a]] = interfacePart.builder('group','handle_'+a,{})
                                                object.append(handles[handleNames[a]]);
                                            //handle
                                                var handle = interfacePart.builder('image','handle',{width:width, height:height*handleHeight, url:handleURL});
                                                handles[handleNames[a]].append(handle);
                                            //invisible handle
                                                var invisibleHandleHeight = height*handleHeight + height*0.01;
                                                var invisibleHandle = interfacePart.builder('rectangle','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, colour:invisibleHandleStyle});
                                                handles[handleNames[a]].append(invisibleHandle);
                                        }
                            
                                    //cover
                                        var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        object.append(cover);
                            
                                        
                            
                            
                                //graphical adjust
                                    function set(a,handle,update=true){
                                        a = (a>1 ? 1 : a);
                                        a = (a<0 ? 0 : a);
                            
                                        //make sure the handle order is maintained
                                        //if necessary, one handle should push the other, though not past the ends
                                            switch(handle){
                                                default: console.error('unknown handle to adjust'); break;
                                                case 'start':
                                                    //don't allow start slide to encrouch on end slider's space
                                                        if( a / (1-(handleHeight/(1-handleHeight))) >= 1 ){ a = 1-(handleHeight/(1-handleHeight)); }
                            
                                                    //if start slide bumps up against end slide; move end slide accordingly
                                                        var start_rightEdge = a + (1-a)*handleHeight;
                                                        var end_leftEdge = values.end - (values.end)*handleHeight;
                                                        if( start_rightEdge >= end_leftEdge ){
                                                            values.end = start_rightEdge/(1-handleHeight);
                                                        }
                                                break;
                                                case 'end':
                                                    //don't allow end slide to encrouch on start slider's space
                                                        if( a / (handleHeight/(1-handleHeight)) <= 1 ){ a = handleHeight/(1-handleHeight); }
                            
                                                    //if end slide bumps up against start slide; move start slide accordingly
                                                        var start_rightEdge= values.start + (1-values.start)*handleHeight;
                                                        var end_leftEdge = a - (a)*handleHeight;
                                                        if( start_rightEdge >= end_leftEdge ){
                                                            values.start = (end_leftEdge - handleHeight)/(1-handleHeight);
                                                        }
                                                break;
                                            }
                            
                                        //fill in data
                                            values[handle] = a;
                            
                                        //adjust y positions
                                            handles.start.y( values.start*height*(1-handleHeight) );
                                            handles.end.y( values.end*height*(1-handleHeight) );
                            
                                        //adjust span height (with a little bit of padding so the span is under the handles a little)
                                            span.y( height*(handleHeight + values.start - handleHeight*(values.start + 0.1)) );
                                            span.height( height*( values.end - values.start + handleHeight*(values.start - values.end - 1 + 0.2) ) );
                            
                                        if(update && object.onchange){object.onchange(values);}
                                    }
                                    function pan(a){
                                        var diff = values.end - values.start;
                            
                                        var newPositions = [ a, a+diff ];
                                        if(newPositions[0] <= 0){
                                            newPositions[1] = newPositions[1] - newPositions[0];
                                            newPositions[0] = 0;
                                        }
                                        else if(newPositions[1] >= 1){
                                            newPositions[0] = newPositions[0] - (newPositions[1]-1);
                                            newPositions[1] = 1;
                                        }
                            
                                        set( newPositions[0],'start' );
                                        set( newPositions[1],'end' );
                                    }
                            
                            
                            
                            
                                //methods
                                    object.get = function(){return values;};
                                    object.set = function(values,update){
                                        if(grappled){return;}
                                        if(values.start != undefined){set(values.start,'start',update);}
                                        if(values.end != undefined){set(values.end,'end',update);}
                                    };
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                            
                            
                                    
                                //interaction
                                    function getPositionWithinFromMouse(x,y){
                                        //calculate the distance the click is from the top of the slider (accounting for angle)
                                            var offset = backingAndSlot.getOffset();
                                            var delta = {
                                                x: x - (backingAndSlot.x()     + offset.x),
                                                y: y - (backingAndSlot.y()     + offset.y),
                                                a: 0 - (backingAndSlot.angle() + offset.angle),
                                            };
                            
                                        return _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / backingAndSlotCover.height();
                                    }
                            
                                    //background click
                                        //to stop clicks passing through the span
                                            span.onmousedown = function(){};
                                            span.onclick = function(){};
                            
                                        backingAndSlotCover.onmousedown = function(x,y,event){};//to stop unit selection
                                        backingAndSlotCover.onclick = function(x,y,event){
                                            if(!interactable){return;}
                                            if(grappled){return;}
                            
                                            //calculate the distance the click is from the top of the slider (accounting for angle)
                                                var d = getPositionWithinFromMouse(x,y);
                            
                                            //use the distance to calculate the correct value to set the slide to
                                            //taking into account the slide handle's size also
                                                var value = d + 0.5*handleHeight*((2*d)-1);
                            
                                            //whichever handle is closer; move that handle to the mouse's position
                                                Math.abs(values.start-value) < Math.abs(values.end-value) ? set(value,'start') : set(value,'end');
                                        };
                            
                                    //double-click reset
                                        cover.ondblclick = function(){
                                            if(!interactable){return;}
                                            if(resetValues.start<0 || resetValues.end<0){return;}
                                            if(grappled){return;}
                            
                                            set(resetValues.start,'start');
                                            set(resetValues.end,'end');
                                            object.onrelease(values);
                                        };
                            
                                    //span panning - expand/shrink
                                        cover.onwheel = function(){
                                            if(!interactable){return;}
                                            if(grappled){return;}
                            
                                            var move = event.deltaY/100;
                                            var globalScale = _canvas_.core.viewport.scale();
                                            var val = move/(10*globalScale);
                            
                                            set(values.start-val,'start');
                                            set(values.end+val,'end');
                                        };
                            
                                    //span panning - drag
                                        span.onmousedown = function(x,y,event){
                                            if(!interactable){return;}
                                            grappled = true;
                            
                                            var initialValue = values.start;
                                            var initialPosition = getPositionWithinFromMouse(x,y);
                            
                                            _canvas_.system.mouse.mouseInteractionHandler(
                                                function(event){
                                                    var livePosition = getPositionWithinFromMouse(event.x,event.y);
                                                    pan( initialValue+(livePosition-initialPosition) )
                                                    object.onchange(values);
                                                },
                                                function(event){
                                                    object.onrelease(values);
                                                    grappled = false;
                                                }
                                            );
                                        };
                            
                                    //handle movement
                                        for(var a = 0; a < handleNames.length; a++){
                                            handles[handleNames[a]].children()[1].onmousedown = (function(a){
                                                return function(x,y,event){
                                                    if(!interactable){return;}
                                                    grappled = true;
                                        
                                                    var initialValue = values[handleNames[a]];
                                                    var initialPosition = getPositionWithinFromMouse(x,y);
                                                    
                                                    _canvas_.system.mouse.mouseInteractionHandler(
                                                        function(event){
                                                            var livePosition = getPositionWithinFromMouse(event.x,event.y);
                                                            set( initialValue+(livePosition-initialPosition)/(1-handleHeight), handleNames[a] );
                                                            object.onchange(values);
                                                        },
                                                        function(event){
                                                            object.onrelease(values);
                                                            grappled = false;
                                                        }
                                                    );
                                                }
                                            })(a);
                                        }
                              
                            
                            
                            
                                //callbacks
                                    object.onchange = onchange;
                                    object.onrelease = onrelease;  
                            
                                //setup
                                    set(0,'start');
                                    set(1,'end');
                            
                                return object;
                            };
                            this.slide = function(
                                name='slide', 
                                x, y, width=10, height=95, angle=0, interactable=true,
                                handleHeight=0.1, value=0, resetValue=-1,
                                handleStyle = {r:0.78,g:0.78,b:0.78,a:1},
                                backingStyle = {r:0.58,g:0.58,b:0.58,a:1},
                                slotStyle = {r:0.2,g:0.2,b:0.2,a:1},
                                invisibleHandleStyle = {r:1,g:0,b:0,a:0},
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing and slot group
                                        var backingAndSlot = interfacePart.builder('group','backingAndSlotGroup');
                                        object.append(backingAndSlot);
                                        //backing
                                            var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, colour:backingStyle});
                                            backingAndSlot.append(backing);
                                        //slot
                                            var slot = interfacePart.builder('rectangle','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), colour:slotStyle});
                                            backingAndSlot.append(slot);
                                        //backing and slot cover
                                            var backingAndSlotCover = interfacePart.builder('rectangle','backingAndSlotCover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                            backingAndSlot.append(backingAndSlotCover);
                                    //handle
                                        var handle = interfacePart.builder('rectangle','handle',{width:width, height:height*handleHeight, colour:handleStyle});
                                        object.append(handle);
                                    //invisible handle
                                        var invisibleHandle = interfacePart.builder('rectangle','invisibleHandle',{y:-( height*0.01 )/2, width:width, height: height*(handleHeight+0.01) + handleHeight, colour:invisibleHandleStyle});
                                        object.append(invisibleHandle);
                                    //cover
                                        var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        object.append(cover);
                            
                            
                            
                            
                                //graphical adjust
                                    function set(a,update=true){
                                        a = (a>1 ? 1 : a);
                                        a = (a<0 ? 0 : a);
                            
                                        if(update && object.onchange != undefined){object.onchange(a);}
                                        
                                        value = a;
                                        handle.y( a*height*(1-handleHeight) );
                                        invisibleHandle.y( handle.y() - ( height*0.01 )/2 );
                            
                                        handle.computeExtremities();
                                        invisibleHandle.computeExtremities();
                                    }
                                    object.__calculationAngle = angle;
                                    function currentMousePosition(event){
                                        return event.y*Math.cos(object.__calculationAngle) - event.x*Math.sin(object.__calculationAngle);
                                    }
                            
                            
                            
                            
                                //methods
                                    var grappled = false;
                            
                                    object.set = function(value,update){
                                        if(grappled){return;}
                                        set(value,update);
                                    };
                                    object.get = function(){return value;};
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                            
                            
                            
                                //interaction
                                    cover.ondblclick = function(){
                                        if(!interactable){return;}
                                        if(resetValue<0){return;}
                                        if(grappled){return;}
                            
                                        set(resetValue);
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    cover.onwheel = function(){
                                        if(!interactable){return;}
                                        if(grappled){return;}
                            
                                        var move = event.deltaY/100;
                                        var globalScale = _canvas_.core.viewport.scale();
                                        set( value + move/(10*globalScale) );
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    backingAndSlotCover.onmousedown = function(x,y,event){};//to stop unit selection
                                    backingAndSlotCover.onclick = function(x,y,event){
                                        if(!interactable){return;}
                                        if(grappled){return;}
                            
                                        //calculate the distance the click is from the top of the slider (accounting for angle)
                                            var offset = backingAndSlot.getOffset();
                                            var delta = {
                                                x: x - (backingAndSlot.x()     + offset.x),
                                                y: y - (backingAndSlot.y()     + offset.y),
                                                a: 0 - (backingAndSlot.angle() + offset.angle),
                                            };
                                            var d = _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / backingAndSlotCover.height();
                            
                                        //use the distance to calculate the correct value to set the slide to
                                        //taking into account the slide handle's size also
                                            var value = d + 0.5*handleHeight*((2*d)-1);
                            
                                        set(value);
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    invisibleHandle.onmousedown = function(x,y,event){
                                        if(!interactable){return;}
                                        grappled = true;
                            
                                        var initialValue = value;
                                        var initialY = currentMousePosition(event);
                                        var mux = height - height*handleHeight;
                            
                                        _canvas_.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var numerator = initialY-currentMousePosition(event);
                                                var divider = _canvas_.core.viewport.scale();
                                                set( initialValue - (numerator/(divider*mux) ) );
                                            },
                                            function(event){
                                                var numerator = initialY-currentMousePosition(event);
                                                var divider = _canvas_.core.viewport.scale();
                                                object.onrelease(initialValue - (numerator/(divider*mux) ) );
                                                grappled = false;
                                            }
                                        );
                                    };
                            
                            
                            
                                //setup
                                    set(value);
                            
                                //callbacks
                                    object.onchange = onchange; 
                                    object.onrelease = onrelease;
                            
                                return object;
                            };
                            this.slidePanel = function(
                                name='slidePanel', 
                                x, y, width=80, height=95, angle=0, interactable=true,
                                handleHeight=0.1, count=8, startValue=0, resetValue=0.5,
                                handleStyle = {r:0.78,g:0.78,b:0.78,a:1},
                                backingStyle = {r:0.58,g:0.58,b:0.58,a:1},
                                slotStyle = {r:0.2,g:0.2,b:0.2,a:1},
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //slides
                                        for(var a = 0; a < count; a++){
                                            var temp = interfacePart.builder(
                                                'slide', 'slide_'+a, {
                                                    x:a*(width/count), y:0,
                                                    width:width/count, height:height, interactable:interactable, handleHeight:handleHeight,
                                                    value:startValue, resetValue:resetValue,
                                                    style:{handle:handleStyle, backing:backingStyle, slot:slotStyle},
                                                    onchange:function(value){ if(!object.onchange){return;} object.onchange(this.id,value); },
                                                    onrelease:function(value){ if(!object.onrelease){return;} object.onrelease(this.id,value); },
                                                }
                                            );
                                            temp.__calculationAngle = angle;
                                            object.append(temp);
                                        }
                            
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                            
                                        for(var a = 0; a < count; a++){
                                            object.children[a].interactable(bool);
                                        }
                                    };
                            
                                return object;
                            };
                            this.slide_image = function(
                                name='slide_image', 
                                x, y, width=10, height=95, angle=0, interactable=true,
                                handleHeight=0.1, value=0, resetValue=-1,
                                
                                handleURL, backingURL, slotURL,
                            
                                invisibleHandleStyle = {r:1,g:0,b:0,a:0},
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //default to non-image version if image links are missing
                                    if(handleURL == undefined || backingURL == undefined || slotURL == undefined){
                                        return this.slide(
                                            name, x, y, width, height, angle, interactable,
                                            handleHeight, value, resetValue,
                                            handleURL, backingURL, slotURL, invisibleHandleStyle,
                                            onchange, onrelease,
                                        );
                                    }
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing and slot group
                                        var backingAndSlot = interfacePart.builder('group','backingAndSlotGroup');
                                        object.append(backingAndSlot);
                                        //backing
                                            var backing = interfacePart.builder('image','backing',{width:width, height:height, url:backingURL});
                                            backingAndSlot.append(backing);
                                        //slot
                                            var slot = interfacePart.builder('image','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), url:slotURL});
                                            backingAndSlot.append(slot);
                                        //backing and slot cover
                                            var backingAndSlotCover = interfacePart.builder('rectangle','backingAndSlotCover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                            backingAndSlot.append(backingAndSlotCover);
                                    //handle
                                        var handle = interfacePart.builder('image','handle',{width:width, height:height*handleHeight, url:handleURL});
                                        object.append(handle);
                                    //invisible handle
                                        var invisibleHandle = interfacePart.builder('rectangle','invisibleHandle',{y:-( height*0.01 )/2, width:width, height:height*(handleHeight+0.01) + handleHeight, colour:invisibleHandleStyle});
                                        object.append(invisibleHandle);
                                    //cover
                                        var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        object.append(cover);
                            
                            
                            
                            
                                //graphical adjust
                                    function set(a,update=true){
                                        a = (a>1 ? 1 : a);
                                        a = (a<0 ? 0 : a);
                            
                                        if(update && object.onchange != undefined){object.onchange(a);}
                                        
                                        value = a;
                                        handle.y( a*height*(1-handleHeight) );
                                        invisibleHandle.y( handle.y() - ( height*0.01 )/2 );
                            
                                        handle.computeExtremities();
                                        invisibleHandle.computeExtremities();
                                    }
                                    object.__calculationAngle = angle;
                                    function currentMousePosition(event){
                                        return event.y*Math.cos(object.__calculationAngle) - event.x*Math.sin(object.__calculationAngle);
                                    }
                            
                            
                            
                            
                                //methods
                                    var grappled = false;
                            
                                    object.set = function(value,update){
                                        if(grappled){return;}
                                        set(value,update);
                                    };
                                    object.get = function(){return value;};
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                            
                            
                            
                                //interaction
                                    cover.ondblclick = function(){
                                        if(!interactable){return;}
                                        if(resetValue<0){return;}
                                        if(grappled){return;}
                            
                                        set(resetValue);
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    cover.onwheel = function(){
                                        if(!interactable){return;}
                                        if(grappled){return;}
                            
                                        var move = event.deltaY/100;
                                        var globalScale = _canvas_.core.viewport.scale();
                                        set( value + move/(10*globalScale) );
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    backingAndSlotCover.onmousedown = function(x,y,event){};//to stop unit selection
                                    backingAndSlotCover.onclick = function(x,y,event){
                                        if(!interactable){return;}
                                        if(grappled){return;}
                            
                                        //calculate the distance the click is from the top of the slider (accounting for angle)
                                            var offset = backingAndSlot.getOffset();
                                            var delta = {
                                                x: x - (backingAndSlot.x()     + offset.x),
                                                y: y - (backingAndSlot.y()     + offset.y),
                                                a: 0 - (backingAndSlot.angle() + offset.angle),
                                            };
                                            var d = _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / backingAndSlotCover.height();
                            
                                        //use the distance to calculate the correct value to set the slide to
                                        //taking into account the slide handle's size also
                                            var value = d + 0.5*handleHeight*((2*d)-1);
                            
                                        set(value);
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    invisibleHandle.onmousedown = function(x,y,event){
                                        if(!interactable){return;}
                                        grappled = true;
                            
                                        var initialValue = value;
                                        var initialY = currentMousePosition(event);
                                        var mux = height - height*handleHeight;
                            
                                        _canvas_.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var numerator = initialY-currentMousePosition(event);
                                                var divider = _canvas_.core.viewport.scale();
                                                set( initialValue - (numerator/(divider*mux) * window.devicePixelRatio) );
                                            },
                                            function(event){
                                                var numerator = initialY-currentMousePosition(event);
                                                var divider = _canvas_.core.viewport.scale();
                                                object.onrelease(initialValue - (numerator/(divider*mux) * window.devicePixelRatio) );
                                                grappled = false;
                                            }
                                        );
                                    };
                            
                            
                            
                                //setup
                                    set(value);
                            
                                //callbacks
                                    object.onchange = onchange; 
                                    object.onrelease = onrelease;
                            
                                return object;
                            };
                            this.rangeslide = function(
                                name='rangeslide', 
                                x, y, width=10, height=95, angle=0, interactable=true,
                                handleHeight=0.1, spanWidth=0.75, values={start:0,end:1}, resetValues={start:-1,end:-1},
                                handleStyle = {r:0.78,g:0.78,b:0.78,a:1},
                                backingStyle = {r:0.58,g:0.58,b:0.58,a:1},
                                slotStyle = {r:0.2,g:0.2,b:0.2,a:1},
                                invisibleHandleStyle = {r:1,g:0,b:0,a:0},
                                spanStyle={r:0.78,g:0,b:0.78,a:0.5},
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                var grappled = false;
                                var handleNames = ['start','end'];
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing and slot group
                                        var backingAndSlot = interfacePart.builder('group','backingAndSlotGroup');
                                        object.append(backingAndSlot);
                                        //backing
                                            var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, colour:backingStyle});
                                            backingAndSlot.append(backing);
                                        //slot
                                            var slot = interfacePart.builder('rectangle','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), colour:slotStyle});
                                            backingAndSlot.append(slot);
                                        //backing and slot cover
                                            var backingAndSlotCover = interfacePart.builder('rectangle','backingAndSlotCover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                            backingAndSlot.append(backingAndSlotCover);
                            
                                    //span
                                        var span = interfacePart.builder('rectangle','span',{x:width*((1-spanWidth)/2), y:height*handleHeight, width:width*spanWidth, height:height - 2*height*handleHeight, colour:spanStyle });
                                        object.append(span);
                            
                                    //handles
                                        var handles = {}
                                        for(var a = 0; a < handleNames.length; a++){
                                            //grouping
                                                handles[handleNames[a]] = interfacePart.builder('group','handle_'+a,{})
                                                object.append(handles[handleNames[a]]);
                                            //handle
                                                var handle = interfacePart.builder('rectangle','handle',{width:width,height:height*handleHeight, colour:handleStyle});
                                                handles[handleNames[a]].append(handle);
                                            //invisible handle
                                                var invisibleHandleHeight = height*handleHeight + height*0.01;
                                                var invisibleHandle = interfacePart.builder('rectangle','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, colour:invisibleHandleStyle});
                                                handles[handleNames[a]].append(invisibleHandle);
                                        }
                            
                                    //cover
                                        var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        object.append(cover);
                            
                            
                            
                            
                                //graphical adjust
                                    function set(a,handle,update=true){
                                        a = (a>1 ? 1 : a);
                                        a = (a<0 ? 0 : a);
                            
                                        //make sure the handle order is maintained
                                        //if necessary, one handle should push the other, though not past the ends
                                            switch(handle){
                                                default: console.error('unknown handle to adjust'); break;
                                                case 'start':
                                                    //don't allow start slide to encrouch on end slider's space
                                                        if( a / (1-(handleHeight/(1-handleHeight))) >= 1 ){ a = 1-(handleHeight/(1-handleHeight)); }
                            
                                                    //if start slide bumps up against end slide; move end slide accordingly
                                                        var start_rightEdge = a + (1-a)*handleHeight;
                                                        var end_leftEdge = values.end - (values.end)*handleHeight;
                                                        if( start_rightEdge >= end_leftEdge ){
                                                            values.end = start_rightEdge/(1-handleHeight);
                                                        }
                                                break;
                                                case 'end':
                                                    //don't allow end slide to encrouch on start slider's space
                                                        if( a / (handleHeight/(1-handleHeight)) <= 1 ){ a = handleHeight/(1-handleHeight); }
                            
                                                    //if end slide bumps up against start slide; move start slide accordingly
                                                        var start_rightEdge= values.start + (1-values.start)*handleHeight;
                                                        var end_leftEdge = a - (a)*handleHeight;
                                                        if( start_rightEdge >= end_leftEdge ){
                                                            values.start = (end_leftEdge - handleHeight)/(1-handleHeight);
                                                        }
                                                break;
                                            }
                            
                                        //fill in data
                                            values[handle] = a;
                            
                                        //adjust y positions
                                            handles.start.y( values.start*height*(1-handleHeight) );
                                            handles.end.y( values.end*height*(1-handleHeight) );
                            
                                        //adjust span height (with a little bit of padding so the span is under the handles a little)
                                            span.y( height*(handleHeight + values.start - handleHeight*(values.start + 0.1)) );
                                            span.height( height*( values.end - values.start + handleHeight*(values.start - values.end - 1 + 0.2) ) );
                            
                                        if(update && object.onchange){object.onchange(values);}
                                    }
                                    function pan(a){
                                        var diff = values.end - values.start;
                            
                                        var newPositions = [ a, a+diff ];
                                        if(newPositions[0] <= 0){
                                            newPositions[1] = newPositions[1] - newPositions[0];
                                            newPositions[0] = 0;
                                        }
                                        else if(newPositions[1] >= 1){
                                            newPositions[0] = newPositions[0] - (newPositions[1]-1);
                                            newPositions[1] = 1;
                                        }
                            
                                        set( newPositions[0],'start' );
                                        set( newPositions[1],'end' );
                                    }
                            
                            
                            
                            
                                //methods
                                    object.get = function(){return values;};
                                    object.set = function(values,update){
                                        if(grappled){return;}
                                        if(values.start != undefined){set(values.start,'start',update);}
                                        if(values.end != undefined){set(values.end,'end',update);}
                                    };
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                            
                            
                                    
                                //interaction
                                    function getPositionWithinFromMouse(x,y){
                                        //calculate the distance the click is from the top of the slider (accounting for angle)
                                            var offset = backingAndSlot.getOffset();
                                            var delta = {
                                                x: x - (backingAndSlot.x()     + offset.x),
                                                y: y - (backingAndSlot.y()     + offset.y),
                                                a: 0 - (backingAndSlot.angle() + offset.angle),
                                            };
                            
                                        return _canvas_.library.math.cartesianAngleAdjust( delta.x/offset.scale, delta.y/offset.scale, delta.a ).y / backingAndSlotCover.height();
                                    }
                            
                                    //background click
                                        //to stop clicks passing through the span
                                            span.onmousedown = function(){};
                                            span.onclick = function(){};
                                            
                                        backingAndSlotCover.onmousedown = function(x,y,event){};//to stop unit selection
                                        backingAndSlotCover.onclick = function(x,y,event){
                                            if(!interactable){return;}
                                            if(grappled){return;}
                            
                                            //calculate the distance the click is from the top of the slider (accounting for angle)
                                                var d = getPositionWithinFromMouse(x,y);
                            
                                            //use the distance to calculate the correct value to set the slide to
                                            //taking into account the slide handle's size also
                                                var value = d + 0.5*handleHeight*((2*d)-1);
                            
                                            //whichever handle is closer; move that handle to the mouse's position
                                                Math.abs(values.start-value) < Math.abs(values.end-value) ? set(value,'start') : set(value,'end');
                                        };
                            
                                    //double-click reset
                                        cover.ondblclick = function(){
                                            if(!interactable){return;}
                                            if(resetValues.start<0 || resetValues.end<0){return;}
                                            if(grappled){return;}
                            
                                            set(resetValues.start,'start');
                                            set(resetValues.end,'end');
                                            object.onrelease(values);
                                        };
                            
                                    //span panning - expand/shrink
                                        cover.onwheel = function(){
                                            if(!interactable){return;}
                                            if(grappled){return;}
                            
                                            var move = event.deltaY/100;
                                            var globalScale = _canvas_.core.viewport.scale();
                                            var val = move/(10*globalScale);
                            
                                            set(values.start-val,'start');
                                            set(values.end+val,'end');
                                        };
                            
                                    //span panning - drag
                                        span.onmousedown = function(x,y,event){
                                            if(!interactable){return;}
                                            grappled = true;
                            
                                            var initialValue = values.start;
                                            var initialPosition = getPositionWithinFromMouse(x,y);
                            
                                            _canvas_.system.mouse.mouseInteractionHandler(
                                                function(event){
                                                    var livePosition = getPositionWithinFromMouse(event.x,event.y);
                                                    pan( initialValue+(livePosition-initialPosition) )
                                                    object.onchange(values);
                                                },
                                                function(event){
                                                    object.onrelease(values);
                                                    grappled = false;
                                                }
                                            );
                                        };
                            
                                    //handle movement
                                        for(var a = 0; a < handleNames.length; a++){
                                            handles[handleNames[a]].children()[1].onmousedown = (function(a){
                                                return function(x,y,event){
                                                    if(!interactable){return;}
                                                    grappled = true;
                                        
                                                    var initialValue = values[handleNames[a]];
                                                    var initialPosition = getPositionWithinFromMouse(x,y);
                                                    
                                                    _canvas_.system.mouse.mouseInteractionHandler(
                                                        function(event){
                                                            var livePosition = getPositionWithinFromMouse(event.x,event.y);
                                                            set( initialValue + (livePosition-initialPosition)/(1-handleHeight), handleNames[a] );
                                                            object.onchange(values);
                                                        },
                                                        function(event){
                                                            object.onrelease(values);
                                                            grappled = false;
                                                        }
                                                    );
                                                }
                                            })(a);
                                        }
                              
                            
                            
                            
                                //callbacks
                                    object.onchange = onchange;
                                    object.onrelease = onrelease;  
                            
                                //setup
                                    set(0,'start');
                                    set(1,'end');
                            
                                return object;
                            };
                            this.checkbox_rectangle = function(
                                name='checkbox_rectangle',
                                x, y, width=20, height=20, angle=0, interactable=true,
                                checkStyle = {r:0.58,g:0.58,b:0.58,a:1},
                                backingStyle = {r:0.78,g:0.78,b:0.78,a:1},
                                checkGlowStyle = {r:0.86,g:0.86,b:0.86,a:1},
                                backingGlowStyle = {r:0.86,g:0.86,b:0.86,a:1},
                                onchange = function(){},
                            ){
                                //adding on the specific shapes
                                    //main
                                        var subject = interfacePart.builder('group',name+'subGroup');
                                    //backing
                                        var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, colour:backingStyle});
                                        subject.append(backing);
                                    //check
                                        var checkrect = interfacePart.builder('rectangle','checkrect',{x:width*0.1,y:height*0.1,width:width*0.8,height:height*0.8, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(checkrect);
                                    //cover
                                        subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(subject.cover);
                            
                                //generic checkbox part
                                    var object = interfacePart.builder(
                                        'checkbox_', name, {
                                            x:x, y:y, angle:angle, interactable:interactable,
                                            onchange:onchange,
                                            subject:subject,
                                        }
                                    );
                            
                                //graphical state adjust
                                    object.updateGraphics = function(state){
                                        if(state.glowing){
                                            backing.colour = backingGlowStyle;
                                            checkrect.colour = state.checked ? checkGlowStyle : {r:0,g:0,b:0,a:0};
                                        }else{
                                            backing.colour = backingStyle;
                                            checkrect.colour = state.checked ? checkStyle : {r:0,g:0,b:0,a:0};
                                        }
                                    };
                                    object.updateGraphics({checked:false,glowing:false});
                            
                                return object;
                            };
                            this.checkbox_image = function(
                                name='checkbox_image',
                                x, y, width=20, height=20, angle=0, interactable=true,
                                uncheckURL, checkURL, checkGlowURL, backingGlowURL,
                                onchange = function(){},
                            ){
                                //adding on the specific shapes
                                    //main
                                        var subject = interfacePart.builder('group',name+'subGroup',{});
                                    //backing
                                        var backing = interfacePart.builder('image','backing',{width:width, height:height, url:uncheckURL});
                                        subject.append(backing);
                                    //cover
                                        subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
                                        subject.append(subject.cover);
                            
                                //generic checkbox part
                                    var object = interfacePart.builder(
                                        'checkbox_', name, {
                                            x:x, y:y, angle:angle, interactable:interactable,
                                            onchange:onchange,
                                            subject:subject,
                                        }
                                    );
                            
                                //graphical state adjust
                                    object.updateGraphics = function(state){ 
                                        if(state.glowing){
                                            backing.url = state.checked ? checkGlowURL : uncheckGlowURL;
                                        }else{
                                            backing.url = state.checked ? checkURL : uncheckURL;
                                        }
                                    };
                                    object.updateGraphics({checked:false,glowing:false});
                            
                                return object;
                            };
                            this.checkbox_ = function(
                                name='checkbox_',
                                x, y, angle=0, interactable=true,
                            
                                onchange = function(){},
                            
                                subject
                            ){
                                if(subject == undefined){console.warn('checkbox_ : No subject provided');}
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //subject
                                        object.append(subject);
                            
                                //state
                                    var state = {
                                        checked:false,
                                        glowing:false,
                                    };
                            
                                //methods
                                    object.get = function(){ return state.checked; };
                                    object.set = function(value, update=true){
                                        state.checked = value;
                                        
                                        object.updateGraphics(state);
                                
                                        if(update&&this.onchange){ this.onchange(value); }
                                    };
                                    object.light = function(state){
                                        if(state == undefined){ return state.glowing; }
                            
                                        state.glowing = state;
                            
                                        object.updateGraphics(state);
                                    };
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                                //interactivity
                                    subject.cover.onclick = function(event){
                                        if(!interactable){return;}
                                        object.set(!object.get());
                                    };
                                    subject.cover.onmousedown = function(){};
                            
                                //callbacks
                                    object.onchange = onchange;
                            
                                return object;
                            };
                            this.checkbox_polygon = function(
                                name='checkbox_polygon',
                                x, y, 
                                outterPoints=[{x:0,y:4},{x:4,y:0}, {x:16,y:0},{x:20,y:4}, {x:20,y:16},{x:16,y:20},{x:4,y:20},{x:0,y:16}],
                                innerPoints=[ {x:2,y:4},{x:4,y:2}, {x:16,y:2},{x:18,y:4}, {x:18,y:16},{x:16,y:18}, {x:4,y:18},{x:2,y:16}],
                                angle=0, interactable=true,
                                checkStyle = {r:0.58,g:0.58,b:0.58,a:1},
                                backingStyle = {r:0.78,g:0.78,b:0.78,a:1},
                                checkGlowStyle = {r:0.86,g:0.86,b:0.86,a:1},
                                backingGlowStyle = {r:0.86,g:0.86,b:0.86,a:1},
                                onchange = function(){},
                            ){
                                //adding on the specific shapes
                                    //main
                                        var subject = interfacePart.builder('group',name+'subGroup',{});
                                    //backing
                                        var backing = interfacePart.builder('polygon','backing',{pointsAsXYArray:outterPoints, colour:backingStyle});
                                        subject.append(backing);
                                    //check
                                        var checkpoly = interfacePart.builder('polygon','checkpoly',{pointsAsXYArray:innerPoints, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(checkpoly);
                                    //cover
                                        subject.cover = interfacePart.builder('polygon','cover',{pointsAsXYArray:outterPoints, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(subject.cover);
                            
                                //generic checkbox part
                                    var object = interfacePart.builder(
                                        'checkbox_', name, {
                                            x:x, y:y, angle:angle, interactable:interactable,
                                            onchange:onchange,
                                            subject:subject,
                                        }
                                    );
                            
                                //graphical state adjust
                                    object.updateGraphics = function(state){
                                        if(state.glowing){
                                            backing.colour = backingGlowStyle;
                                            checkpoly.colour = state.checked ? checkGlowStyle : {r:0,g:0,b:0,a:0};
                                        }else{
                                            backing.colour = backingStyle;
                                            checkpoly.colour = state.checked ? checkStyle : {r:0,g:0,b:0,a:0};
                                        }
                                    };
                                    object.updateGraphics({checked:false,glowing:false});
                            
                                return object;
                            };
                            this.checkbox_circle = function(
                                name='checkbox_circle',
                                x, y, radius=10, angle=0, interactable=true,
                                checkStyle = {r:0.58,g:0.58,b:0.58,a:1},
                                backingStyle = {r:0.78,g:0.78,b:0.78,a:1},
                                checkGlowStyle = {r:0.86,g:0.86,b:0.86,a:1},
                                backingGlowStyle = {r:0.86,g:0.86,b:0.86,a:1},
                                onchange = function(){},
                            ){
                                //adding on the specific shapes
                                    //main
                                        var subject = interfacePart.builder('group',name+'subGroup');
                                    //backing
                                        var backing = interfacePart.builder('circle','backing',{radius:radius, colour:backingStyle});
                                        subject.append(backing);
                                    //check
                                        var checkcirc = interfacePart.builder('circle','checkcirc',{radius:radius*0.8, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(checkcirc);
                                    //cover
                                        subject.cover = interfacePart.builder('circle','cover',{radius:radius, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(subject.cover);
                            
                                //generic checkbox part
                                    var object = interfacePart.builder(
                                        'checkbox_', name, {
                                            x:x, y:y, angle:angle, interactable:interactable,
                                            onchange:onchange,
                                            subject:subject,
                                        }
                                    );
                            
                                //graphical state adjust
                                    object.updateGraphics = function(state){
                                        if(state.glowing){
                                            backing.colour = backingGlowStyle;
                                            checkcirc.colour = state.checked ? checkGlowStyle : {r:0,g:0,b:0,a:0};
                                        }else{
                                            backing.colour = backingStyle;
                                            checkcirc.colour = state.checked ? checkStyle : {r:0,g:0,b:0,a:0};
                                        }
                                    };
                                    object.updateGraphics({checked:false,glowing:false});
                            
                                return object;
                            };
                            this.dial_continuous_image = function(
                                name='dial_continuous_image',
                                x, y, radius=15, angle=0, interactable=true,
                                value=0, resetValue=-1,
                                startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
                            
                                handleURL, slotURL, needleURL,
                                
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //default to non-image version if image links are missing
                                    if(handleURL == undefined || slotURL == undefined || needleURL == undefined){
                                        return this.dial_continuous(
                                            name, x, y, radius, angle, interactable, value, resetValue, startAngle, maxAngle,
                                            undefined, undefined, undefined,
                                            onchange, onrelease
                                        );
                                    }
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    
                                    //slot
                                        var slot = interfacePart.builder('image','slot',{width:2.2*radius, height:2.2*radius, anchor:{x:0.5,y:0.5}, url:slotURL});
                                        object.append(slot);
                            
                                    //handle
                                        var handle = interfacePart.builder('image','handle',{width:2*radius, height:2*radius, anchor:{x:0.5,y:0.5}, url:handleURL});
                                        object.append(handle);
                            
                                    //needle group
                                        var needleGroup = interfacePart.builder('group','needleGroup',{ignored:true});
                                        object.append(needleGroup);
                            
                                        //needle
                                            var needleWidth = radius/5;
                                            var needleLength = radius;
                                            var needle = interfacePart.builder('image','needle',{x:needleLength/3, y:-needleWidth/2, height:needleWidth, width:needleLength, url:needleURL});
                                                needleGroup.append(needle);
                            
                            
                            
                            
                                //graphical adjust
                                    function set(a,update=true){
                                        a = (a>1 ? 1 : a);
                                        a = (a<0 ? 0 : a);
                            
                                        if(update && object.onchange != undefined){object.onchange(a);}
                            
                                        value = a;
                                        needleGroup.angle(startAngle + maxAngle*value);
                                        handle.angle(startAngle + maxAngle*value);
                                    }
                            
                            
                            
                            
                                //methods
                                    var grappled = false;
                            
                                    object.set = function(value,update){
                                        if(grappled){return;}
                                        set(value,update);
                                    };
                                    object.get = function(){return value;};
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                            
                            
                            
                                //interaction
                                    var turningSpeed = radius*4;
                                    
                                    handle.ondblclick = function(){
                                        if(!interactable){return;}
                                        if(resetValue<0){return;}
                                        if(grappled){return;}
                                        
                                        set(resetValue); 
                            
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    handle.onwheel = function(x,y,event){
                                        if(!interactable){return;}
                                        if(grappled){return;}
                                        
                                        var move = event.deltaY/100;
                                        var globalScale = _canvas_.core.viewport.scale();
                                        set( value - move/(10*globalScale) );
                            
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    handle.onmousedown = function(x,y,event){
                                        if(!interactable){return;}
                                        var initialValue = value;
                                        var initialY = event.y;
                            
                                        grappled = true;
                                        _canvas_.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var value = initialValue;
                                                var numerator = event.y - initialY;
                                                var divider = _canvas_.core.viewport.scale();
                                                set( value - (numerator/(divider*turningSpeed) * window.devicePixelRatio), true );
                                            },
                                            function(event){
                                                grappled = false;
                                                if(object.onrelease != undefined){object.onrelease(value);}
                                            }
                                        );
                                    };
                            
                            
                            
                            
                                //callbacks
                                    object.onchange = onchange; 
                                    object.onrelease = onrelease;
                            
                                //setup
                                    set(value);
                            
                                return object;
                            };
                            this.dial_continuous = function(
                                name='dial_continuous',
                                x, y, radius=15, angle=0, interactable=true,
                                value=0, resetValue=-1,
                                startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
                            
                                handleStyle = {r:200/255, g:200/255, b:200/255, a:1},
                                slotStyle =   {r:50/255,  g:50/255,  b:50/255,  a:1},
                                needleStyle = {r:250/255, g:100/255, b:100/255, a:1},
                            
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    
                                    //slot
                                        var slot = interfacePart.builder('circle','slot',{radius:radius*1.1, colour:slotStyle});
                                        object.append(slot);
                            
                                    //handle
                                        var handle = interfacePart.builder('circle','handle',{radius:radius, colour:handleStyle});
                                        object.append(handle);
                            
                                    //needle group
                                        var needleGroup = interfacePart.builder('group','needleGroup',{ignored:true});
                                        object.append(needleGroup);
                            
                                        //needle
                                            var needleWidth = radius/5;
                                            var needleLength = radius;
                                            var needle = interfacePart.builder('rectangle','needle',{x:needleLength/3, y:-needleWidth/2, height:needleWidth, width:needleLength, colour:needleStyle});
                                            needleGroup.append(needle);
                            
                            
                            
                            
                                //graphical adjust
                                    function set(a,update=true){
                                        a = (a>1 ? 1 : a);
                                        a = (a<0 ? 0 : a);
                            
                                        if(update && object.onchange != undefined){object.onchange(a);}
                            
                                        value = a;
                                        needleGroup.angle(startAngle + maxAngle*value);
                                    }
                            
                            
                            
                            
                                //methods
                                    var grappled = false;
                            
                                    object.set = function(value,update){
                                        if(grappled){return;}
                                        set(value,update);
                                    };
                                    object.get = function(){return value;};
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                            
                            
                            
                                //interaction
                                    var turningSpeed = radius*4;
                                    
                                    handle.ondblclick = function(){
                                        if(!interactable){return;}
                                        if(resetValue<0){return;}
                                        if(grappled){return;}
                                        
                                        set(resetValue); 
                            
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    handle.onwheel = function(x,y,event){
                                        if(!interactable){return;}
                                        if(grappled){return;}
                                        
                                        var move = event.deltaY/100;
                                        var globalScale = _canvas_.core.viewport.scale();
                                        set( value - move/(10*globalScale) );
                            
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    handle.onmousedown = function(x,y,event){
                                        if(!interactable){return;}
                                        var initialValue = value;
                                        var initialY = event.y;
                            
                                        grappled = true;
                                        _canvas_.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var value = initialValue;
                                                var numerator = event.y - initialY;
                                                var divider = _canvas_.core.viewport.scale();
                                                set( value - (numerator/(divider*turningSpeed) * window.devicePixelRatio), true );
                                            },
                                            function(event){
                                                grappled = false;
                                                if(object.onrelease != undefined){object.onrelease(value);}
                                            }
                                        );
                                    };
                            
                            
                            
                            
                                //callbacks
                                    object.onchange = onchange; 
                                    object.onrelease = onrelease;
                            
                                //setup
                                    set(value);
                            
                                return object;
                            };
                            this.dial_discrete_image = function(
                                name='dial_discrete_image',
                                x, y, radius=15, angle=0, interactable=true,
                                value=0, resetValue=0, optionCount=5,
                                startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
                            
                                handleURL, slotURL, needleURL,
                            
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    
                                    //dial
                                        var dial = interfacePart.builder('dial_continuous_image',name,{
                                            x:0, y:0, radius:radius, angle:0, interactable:interactable,
                                            startAngle:startAngle, maxAngle:maxAngle,
                                            handleURL:handleURL, slotURL:slotURL, needleURL:needleURL,
                                        });
                                        //clean out built-in interaction
                                        dial.getChildByName('handle').ondblclick = undefined;
                                        dial.getChildByName('handle').onwheel = undefined;
                                        dial.getChildByName('handle').onmousedown = undefined;
                            
                                        object.append(dial);
                                    
                            
                            
                            
                            
                            
                                //graphical adjust
                                    function set(a,update=true){ 
                                        a = (a>(optionCount-1) ? (optionCount-1) : a);
                                        a = (a<0 ? 0 : a);
                            
                                        if(update && object.onchange != undefined){object.onchange(a);}
                            
                                        a = Math.round(a);
                                        value = a;
                                        dial.set( value/(optionCount-1) );
                                    };
                            
                            
                            
                            
                                //methods
                                    var grappled = false;
                            
                                    object.set = function(value,update){
                                        if(grappled){return;}
                                        set(value,update);
                                    };
                                    object.get = function(){return value;};
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                            
                            
                            
                                //interaction
                                    var acc = 0;
                            
                                    dial.getChildByName('handle').ondblclick = function(){
                                        if(!interactable){return;}
                                        if(resetValue<0){return;}
                                        if(grappled){return;}
                                        
                                        set(resetValue);
                            
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    dial.getChildByName('handle').onwheel = function(x,y,event){
                                        if(!interactable){return;}
                                        if(grappled){return;}
                            
                                        var move = event.deltaY/100;
                            
                                        acc += move;
                                        if( Math.abs(acc) >= 1 ){
                                            set( value -1*Math.sign(acc) );
                                            acc = 0;
                                            if(object.onrelease != undefined){object.onrelease(value);}
                                        }
                                    };
                                    dial.getChildByName('handle').onmousedown = function(x,y,event){
                                        if(!interactable){return;}
                                        var initialValue = value;
                                        var initialY = event.y;
                            
                                        grappled = true;
                                        _canvas_.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var diff = Math.round( (event.y - initialY)/25 );
                                                set( initialValue - diff );
                                                if(object.onchange != undefined){object.onchange(value);}
                                            },
                                            function(event){
                                                grappled = false;
                                                if(object.onrelease != undefined){object.onrelease(value);}
                                            }
                                        );
                                    };
                            
                            
                            
                            
                                //callbacks
                                    object.onchange = onchange; 
                                    object.onrelease = onrelease;
                            
                                //setup
                                    set(value);
                            
                                return object;
                            };
                            this.dial_discrete = function(
                                name='dial_discrete',
                                x, y, radius=15, angle=0, interactable=true,
                                value=0, resetValue=0, optionCount=5,
                                startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
                            
                                handleStyle = {r:200/255, g:200/255, b:200/255, a:1},
                                slotStyle =   {r:50/255,  g:50/255,  b:50/255,  a:1},
                                needleStyle = {r:250/255, g:100/255, b:100/255, a:1},
                            
                                onchange=function(){},
                                onrelease=function(){},
                            ){
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    
                                    //dial
                                        var dial = interfacePart.builder('dial_continuous',name,{
                                            x:0, y:0, radius:radius, angle:0, interactable:interactable,
                                            startAngle:startAngle, maxAngle:maxAngle,
                                            style:{ handle:handleStyle, slot:slotStyle, needle:needleStyle }
                                        });
                                        //clean out built-in interaction
                                        dial.getChildByName('handle').ondblclick = undefined;
                                        dial.getChildByName('handle').onwheel = undefined;
                                        dial.getChildByName('handle').onmousedown = undefined;
                            
                                        object.append(dial);
                                    
                            
                            
                            
                            
                            
                                //graphical adjust
                                    function set(a,update=true){ 
                                        a = (a>(optionCount-1) ? (optionCount-1) : a);
                                        a = (a<0 ? 0 : a);
                            
                                        if(update && object.onchange != undefined){object.onchange(a);}
                            
                                        a = Math.round(a);
                                        value = a;
                                        dial.set( value/(optionCount-1) );
                                    };
                            
                            
                            
                            
                                //methods
                                    var grappled = false;
                            
                                    object.set = function(value,update){
                                        if(grappled){return;}
                                        set(value,update);
                                    };
                                    object.get = function(){return value;};
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                            
                            
                            
                            
                                //interaction
                                    var acc = 0;
                            
                                    dial.getChildByName('handle').ondblclick = function(){
                                        if(!interactable){return;}
                                        if(resetValue<0){return;}
                                        if(grappled){return;}
                                        
                                        set(resetValue);
                            
                                        if(object.onrelease != undefined){object.onrelease(value);}
                                    };
                                    dial.getChildByName('handle').onwheel = function(x,y,event){
                                        if(!interactable){return;}
                                        if(grappled){return;}
                            
                                        var move = event.deltaY/100;
                            
                                        acc += move;
                                        if( Math.abs(acc) >= 1 ){
                                            set( value -1*Math.sign(acc) );
                                            acc = 0;
                                            if(object.onrelease != undefined){object.onrelease(value);}
                                        }
                                    };
                                    dial.getChildByName('handle').onmousedown = function(x,y,event){
                                        if(!interactable){return;}
                                        var initialValue = value;
                                        var initialY = event.y;
                            
                                        grappled = true;
                                        _canvas_.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var diff = Math.round( (event.y - initialY)/25 );
                                                set( initialValue - diff );
                                                if(object.onchange != undefined){object.onchange(value);}
                                            },
                                            function(event){
                                                grappled = false;
                                                if(object.onrelease != undefined){object.onrelease(value);}
                                            }
                                        );
                                    };
                            
                            
                            
                            
                                //callbacks
                                    object.onchange = onchange; 
                                    object.onrelease = onrelease;
                            
                                //setup
                                    set(value);
                            
                                return object;
                            };
                            this.button_circle = function(
                                name='button_circle',
                                x, y, radius=15,  angle=0, interactable=true,
                                text_centre='',
                                
                                active=true, hoverable=true, selectable=false, pressable=true,
                            
                                text_font = '5pt Arial',
                                text_textBaseline = 'alphabetic',
                                text_colour = {r:0/255,g:0/255,b:0/255,a:1},
                            
                                backing__off__colour=                            {r:180/255,g:180/255,b:180/255,a:1},
                                backing__off__lineColour=                        {r:0/255,g:0/255,b:0/255,a:0},
                                backing__off__lineThickness=                     0,
                                backing__up__colour=                             {r:200/255,g:200/255,b:200/255,a:1},
                                backing__up__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
                                backing__up__lineThickness=                      0,
                                backing__press__colour=                          {r:230/255,g:230/255,b:230/255,a:1},
                                backing__press__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
                                backing__press__lineThickness=                   0,
                                backing__select__colour=                         {r:200/255,g:200/255,b:200/255,a:1},
                                backing__select__lineColour=                     {r:120/255,g:120/255,b:120/255,a:1},
                                backing__select__lineThickness=                  0.75,
                                backing__select_press__colour=                   {r:230/255,g:230/255,b:230/255,a:1},
                                backing__select_press__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
                                backing__select_press__lineThickness=            0.75,
                                backing__glow__colour=                           {r:220/255,g:220/255,b:220/255,a:1},
                                backing__glow__lineColour=                       {r:0/255,g:0/255,b:0/255,a:0},
                                backing__glow__lineThickness=                    0,
                                backing__glow_press__colour=                     {r:250/255,g:250/255,b:250/255,a:1},
                                backing__glow_press__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
                                backing__glow_press__lineThickness=              0,
                                backing__glow_select__colour=                    {r:220/255,g:220/255,b:220/255,a:1},
                                backing__glow_select__lineColour=                {r:120/255,g:120/255,b:120/255,a:1},
                                backing__glow_select__lineThickness=             0.75,
                                backing__glow_select_press__colour=              {r:250/255,g:250/255,b:250/255,a:1},
                                backing__glow_select_press__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
                                backing__glow_select_press__lineThickness=       0.75,
                                backing__hover__colour=                          {r:220/255,g:220/255,b:220/255,a:1},
                                backing__hover__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover__lineThickness=                   0,
                                backing__hover_press__colour=                    {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_press__lineColour=                {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_press__lineThickness=             0,
                                backing__hover_select__colour=                   {r:220/255,g:220/255,b:220/255,a:1},
                                backing__hover_select__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_select__lineThickness=            0.75,
                                backing__hover_select_press__colour=             {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_select_press__lineColour=         {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_select_press__lineThickness=      0.75,
                                backing__hover_glow__colour=                     {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_glow__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_glow__lineThickness=              0,
                                backing__hover_glow_press__colour=               {r:250/255,g:250/255,b:250/255,a:1},
                                backing__hover_glow_press__lineColour=           {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_glow_press__lineThickness=        0,
                                backing__hover_glow_select__colour=              {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_glow_select__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_glow_select__lineThickness=       0.75,
                                backing__hover_glow_select_press__colour=        {r:250/255,g:250/255,b:250/255,a:1},
                                backing__hover_glow_select_press__lineColour=    {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_glow_select_press__lineThickness= 0.75,
                            
                                onenter = function(event){},
                                onleave = function(event){},
                                onpress = function(event){},
                                ondblpress = function(event){},
                                onrelease = function(event){},
                                onselect = function(event){},
                                ondeselect = function(event){},
                            ){
                                //adding on the specific shapes
                                    //main
                                        var subject = interfacePart.builder('group',name+'subGroup',{});
                                    //backing
                                        var backing = interfacePart.builder('circle','backing',{radius:radius, colour:backing__off__colour});
                                        subject.append(backing);
                                    //outline
                                        var outline = interfacePart.builder('path','outline',{ points:[0,radius, radius,0, 0,-radius, -radius,0, 0,radius], thickness:backing__off__lineThickness, colour:backing__off__lineColour, });
                                        subject.append(outline);
                                    // //text
                                    //     var text_centre = interfacePart.builder('text','centre', {
                                    //         text:text_centre, 
                                    //         style:{
                                    //             font:text_font,
                                    //             testBaseline:text_textBaseline,
                                    //             fill:text_fill,
                                    //             stroke:text_stroke,
                                    //             lineWidth:text_lineWidth,
                                    //             textAlign:'center',
                                    //             textBaseline:'middle',
                                    //         }
                                    //     });
                                    //     subject.append(text_centre);
                                    //cover
                                        subject.cover = interfacePart.builder('circle','cover',{radius:radius, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(subject.cover);
                            
                                //generic button part
                                    var object = interfacePart.builder(
                                        'button_', name, {
                                            x:x, y:y, angle:angle, interactable:interactable,
                                            active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                            
                                            onenter:onenter,
                                            onleave:onleave,
                                            onpress:onpress,
                                            ondblpress:ondblpress,
                                            onrelease:onrelease,
                                            onselect:onselect,
                                            ondeselect:ondeselect,
                            
                                            subject:subject,
                                        }
                                    );
                            
                                //graphical state adjust
                                    object.activateGraphicalState = function(state){
                                        if(!active){ 
                                            backing.colour = backing__off__colour;
                                            outline.colour = backing__off__lineColour;
                                            outline.thickness( backing__off__lineThickness );
                                            return;
                                        }
                            
                                        var styles = [
                                            { colour:backing__up__colour,                      lineColour:backing__up__lineColour,                      lineThickness:backing__up__lineThickness                      },
                                            { colour:backing__press__colour,                   lineColour:backing__press__lineColour,                   lineThickness:backing__press__lineThickness                   },
                                            { colour:backing__select__colour,                  lineColour:backing__select__lineColour,                  lineThickness:backing__select__lineThickness                  },
                                            { colour:backing__select_press__colour,            lineColour:backing__select_press__lineColour,            lineThickness:backing__select_press__lineThickness            },
                                            { colour:backing__glow__colour,                    lineColour:backing__glow__lineColour,                    lineThickness:backing__glow__lineThickness                    },
                                            { colour:backing__glow_press__colour,              lineColour:backing__glow_press__lineColour,              lineThickness:backing__glow_press__lineThickness              },
                                            { colour:backing__glow_select__colour,             lineColour:backing__glow_select__lineColour,             lineThickness:backing__glow_select__lineThickness             },
                                            { colour:backing__glow_select_press__colour,       lineColour:backing__glow_select_press__lineColour,       lineThickness:backing__glow_select_press__lineThickness       },
                                            { colour:backing__hover__colour,                   lineColour:backing__hover__lineColour,                   lineThickness:backing__hover__lineThickness                   },
                                            { colour:backing__hover_press__colour,             lineColour:backing__hover_press__lineColour,             lineThickness:backing__hover_press__lineThickness             },
                                            { colour:backing__hover_select__colour,            lineColour:backing__hover_select__lineColour,            lineThickness:backing__hover_select__lineThickness            },
                                            { colour:backing__hover_select_press__colour,      lineColour:backing__hover_select_press__lineColour,      lineThickness:backing__hover_select_press__lineThickness      },
                                            { colour:backing__hover_glow__colour,              lineColour:backing__hover_glow__lineColour,              lineThickness:backing__hover_glow__lineThickness              },
                                            { colour:backing__hover_glow_press__colour,        lineColour:backing__hover_glow_press__lineColour,        lineThickness:backing__hover_glow_press__lineThickness        },
                                            { colour:backing__hover_glow_select__colour,       lineColour:backing__hover_glow_select__lineColour,       lineThickness:backing__hover_glow_select__lineThickness       },
                                            { colour:backing__hover_glow_select_press__colour, lineColour:backing__hover_glow_select_press__lineColour, lineThickness:backing__hover_glow_select_press__lineThickness },
                                        ];
                            
                                        if(!hoverable && state.hovering ){ state.hovering = false; }
                                        if(!selectable && state.selected ){ state.selected = false; }
                            
                                        var i = state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1;
                                        backing.colour = styles[i].colour;
                                        outline.colour = styles[i].lineColour;
                                        outline.thickness( styles[i].lineThickness );
                                    };
                                    object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });
                            
                                return object;
                            };
                            this.button_rectangle = function(
                                name='button_rectangle',
                                x, y, width=30, height=20, angle=0, interactable=true,
                                text_centre='', text_left='', text_right='',
                                textVerticalOffsetMux=0.5, textHorizontalOffsetMux=0.05,
                                
                                active=true, hoverable=true, selectable=!false, pressable=true,
                            
                                text_font = '5pt Arial',
                                text_textBaseline = 'alphabetic',
                                text_colour = {r:0/255,g:0/255,b:0/255,a:1},
                            
                                backing__off__colour=                            {r:180/255,g:180/255,b:180/255,a:1},
                                backing__off__lineColour=                        {r:0/255,g:0/255,b:0/255,a:0},
                                backing__off__lineThickness=                     0,
                                backing__up__colour=                             {r:200/255,g:200/255,b:200/255,a:1},
                                backing__up__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
                                backing__up__lineThickness=                      0,
                                backing__press__colour=                          {r:230/255,g:230/255,b:230/255,a:1},
                                backing__press__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
                                backing__press__lineThickness=                   0,
                                backing__select__colour=                         {r:200/255,g:200/255,b:200/255,a:1},
                                backing__select__lineColour=                     {r:120/255,g:120/255,b:120/255,a:1},
                                backing__select__lineThickness=                  0.75,
                                backing__select_press__colour=                   {r:230/255,g:230/255,b:230/255,a:1},
                                backing__select_press__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
                                backing__select_press__lineThickness=            0.75,
                                backing__glow__colour=                           {r:220/255,g:220/255,b:220/255,a:1},
                                backing__glow__lineColour=                       {r:0/255,g:0/255,b:0/255,a:0},
                                backing__glow__lineThickness=                    0,
                                backing__glow_press__colour=                     {r:250/255,g:250/255,b:250/255,a:1},
                                backing__glow_press__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
                                backing__glow_press__lineThickness=              0,
                                backing__glow_select__colour=                    {r:220/255,g:220/255,b:220/255,a:1},
                                backing__glow_select__lineColour=                {r:120/255,g:120/255,b:120/255,a:1},
                                backing__glow_select__lineThickness=             0.75,
                                backing__glow_select_press__colour=              {r:250/255,g:250/255,b:250/255,a:1},
                                backing__glow_select_press__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
                                backing__glow_select_press__lineThickness=       0.75,
                                backing__hover__colour=                          {r:220/255,g:220/255,b:220/255,a:1},
                                backing__hover__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover__lineThickness=                   0,
                                backing__hover_press__colour=                    {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_press__lineColour=                {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_press__lineThickness=             0,
                                backing__hover_select__colour=                   {r:220/255,g:220/255,b:220/255,a:1},
                                backing__hover_select__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_select__lineThickness=            0.75,
                                backing__hover_select_press__colour=             {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_select_press__lineColour=         {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_select_press__lineThickness=      0.75,
                                backing__hover_glow__colour=                     {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_glow__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_glow__lineThickness=              0,
                                backing__hover_glow_press__colour=               {r:250/255,g:250/255,b:250/255,a:1},
                                backing__hover_glow_press__lineColour=           {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_glow_press__lineThickness=        0,
                                backing__hover_glow_select__colour=              {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_glow_select__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_glow_select__lineThickness=       0.75,
                                backing__hover_glow_select_press__colour=        {r:250/255,g:250/255,b:250/255,a:1},
                                backing__hover_glow_select_press__lineColour=    {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_glow_select_press__lineThickness= 0.75,
                            
                                onenter = function(event){},
                                onleave = function(event){},
                                onpress = function(event){},
                                ondblpress = function(event){},
                                onrelease = function(event){},
                                onselect = function(event){},
                                ondeselect = function(event){},
                            ){
                                //adding on the specific shapes
                                    //main
                                        var subject = interfacePart.builder('group',name+'subGroup');
                                    //backing
                                        var backing = interfacePart.builder('rectangleWithOutline','backing',{width:width, height:height, colour:backing__off__colour, thickness:5 });
                                        subject.append(backing);
                                    // //text
                                    //     var text_centre = interfacePart.builder('text','centre', {
                                    //         x:width/2, 
                                    //         y:height*textVerticalOffsetMux, 
                                    //         text:text_centre, 
                                    //         style:{
                                    //             font:text_font,
                                    //             testBaseline:text_textBaseline,
                                    //             fill:text_fill,
                                    //             stroke:text_stroke,
                                    //             lineWidth:text_lineWidth,
                                    //             textAlign:'center',
                                    //             textBaseline:'middle',
                                    //         }
                                    //     });
                                    //     subject.append(text_centre);
                                    //     var text_left = interfacePart.builder('text','left',     {
                                    //         x:width*textHorizontalOffsetMux, 
                                    //         y:height*textVerticalOffsetMux, 
                                    //         text:text_left, 
                                    //         style:{
                                    //             font:text_font,
                                    //             testBaseline:text_textBaseline,
                                    //             fill:text_fill,
                                    //             stroke:text_stroke,
                                    //             lineWidth:text_lineWidth,
                                    //             textAlign:'left',
                                    //             textBaseline:'middle',
                                    //         }
                                    //     });
                                    //     subject.append(text_left);
                                    //     var text_right = interfacePart.builder('text','right',   {
                                    //         x:width-(width*textHorizontalOffsetMux), 
                                    //         y:height*textVerticalOffsetMux, 
                                    //         text:text_right, 
                                    //         style:{
                                    //             font:text_font,
                                    //             testBaseline:text_textBaseline,
                                    //             fill:text_fill,
                                    //             stroke:text_stroke,
                                    //             lineWidth:text_lineWidth,
                                    //             textAlign:'right',
                                    //             textBaseline:'middle',
                                    //         }
                                    //     });
                                    //     subject.append(text_right);
                                    //cover
                                        subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0} });
                                        subject.append(subject.cover);
                            
                                //generic button part
                                    var object = interfacePart.builder(
                                        'button_', name, {
                                            x:x, y:y, angle:angle, interactable:interactable,
                                            active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                            
                                            onenter:onenter,
                                            onleave:onleave,
                                            onpress:onpress,
                                            ondblpress:ondblpress,
                                            onrelease:onrelease,
                                            onselect:onselect,
                                            ondeselect:ondeselect,
                            
                                            subject:subject,
                                        }
                                    );
                            
                                //graphical state adjust
                                    object.activateGraphicalState = function(state){
                                        if(!active){ 
                                            backing.colour = backing__off__colour;
                                            backing.lineColour = backing__off__lineColour;
                                            backing.thickness( backing__off__lineThickness );
                                            return;
                                        }
                            
                                        var styles = [
                                            { colour:backing__up__colour,                      lineColour:backing__up__lineColour,                      lineThickness:backing__up__lineThickness                      },
                                            { colour:backing__press__colour,                   lineColour:backing__press__lineColour,                   lineThickness:backing__press__lineThickness                   },
                                            { colour:backing__select__colour,                  lineColour:backing__select__lineColour,                  lineThickness:backing__select__lineThickness                  },
                                            { colour:backing__select_press__colour,            lineColour:backing__select_press__lineColour,            lineThickness:backing__select_press__lineThickness            },
                                            { colour:backing__glow__colour,                    lineColour:backing__glow__lineColour,                    lineThickness:backing__glow__lineThickness                    },
                                            { colour:backing__glow_press__colour,              lineColour:backing__glow_press__lineColour,              lineThickness:backing__glow_press__lineThickness              },
                                            { colour:backing__glow_select__colour,             lineColour:backing__glow_select__lineColour,             lineThickness:backing__glow_select__lineThickness             },
                                            { colour:backing__glow_select_press__colour,       lineColour:backing__glow_select_press__lineColour,       lineThickness:backing__glow_select_press__lineThickness       },
                                            { colour:backing__hover__colour,                   lineColour:backing__hover__lineColour,                   lineThickness:backing__hover__lineThickness                   },
                                            { colour:backing__hover_press__colour,             lineColour:backing__hover_press__lineColour,             lineThickness:backing__hover_press__lineThickness             },
                                            { colour:backing__hover_select__colour,            lineColour:backing__hover_select__lineColour,            lineThickness:backing__hover_select__lineThickness            },
                                            { colour:backing__hover_select_press__colour,      lineColour:backing__hover_select_press__lineColour,      lineThickness:backing__hover_select_press__lineThickness      },
                                            { colour:backing__hover_glow__colour,              lineColour:backing__hover_glow__lineColour,              lineThickness:backing__hover_glow__lineThickness              },
                                            { colour:backing__hover_glow_press__colour,        lineColour:backing__hover_glow_press__lineColour,        lineThickness:backing__hover_glow_press__lineThickness        },
                                            { colour:backing__hover_glow_select__colour,       lineColour:backing__hover_glow_select__lineColour,       lineThickness:backing__hover_glow_select__lineThickness       },
                                            { colour:backing__hover_glow_select_press__colour, lineColour:backing__hover_glow_select_press__lineColour, lineThickness:backing__hover_glow_select_press__lineThickness },
                                        ];
                            
                                        if(!hoverable && state.hovering ){ state.hovering = false; }
                                        if(!selectable && state.selected ){ state.selected = false; }
                            
                                        var i = state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1;
                                        backing.colour = styles[i].colour;
                                        backing.lineColour = styles[i].lineColour;
                                        backing.thickness( styles[i].lineThickness );
                                    };
                                    object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });
                            
                                return object;
                            };
                            this.button_ = function(
                                name='',
                                x, y, angle=0, interactable=true,
                                active=true, hoverable=true, selectable=false, pressable=true,
                            
                                onenter = function(event){},
                                onleave = function(event){},
                                onpress = function(event){},
                                ondblpress = function(event){},
                                onrelease = function(event){},
                                onselect = function(event){},
                                ondeselect = function(event){},
                            
                                subject
                            ){
                                if(subject == undefined){console.warn('button_ : No subject provided');}
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //subject
                                        object.append(subject);
                            
                                //state
                                    object.state = {
                                        hovering:false,
                                        glowing:false,
                                        selected:false,
                                        pressed:false,
                                    };
                            
                                //control
                                    object.press = function(event){
                                        if(!active){return;}
                            
                                        if( pressable ){
                                            if(this.state.pressed){return;}
                                            this.state.pressed = true;
                                            if(this.onpress){this.onpress(this, event);}
                                        }
                                        
                                        this.select( !this.select(), event );
                            
                                        object.activateGraphicalState(object.state);
                                    };
                                    object.release = function(event){
                                        if(!active || !pressable){return;}
                            
                                        if(!this.state.pressed){return;}
                                        this.state.pressed = false;
                                        object.activateGraphicalState(object.state);
                                        if(this.onrelease){this.onrelease(this, event);}
                                    };
                                    object.active = function(bool){ if(bool == undefined){return active;} active = bool; object.activateGraphicalState(object.state); };
                                    object.glow = function(bool){   if(bool == undefined){return this.state.glowing;}  this.state.glowing = bool;  object.activateGraphicalState(object.state); };
                                    object.select = function(bool,event,callback=true){ 
                                        if(!active){return;}
                            
                                        if(bool == undefined){return this.state.selected;}
                                        if(!selectable){return;}
                                        if(this.state.selected == bool){return;}
                                        this.state.selected = bool; object.activateGraphicalState(object.state);
                                        if(callback){ if( this.state.selected ){ this.onselect(this,event); }else{ this.ondeselect(this,event); } }
                                    };
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                    };
                                    object.forceMouseLeave = function(){
                                        object.state.hovering = false; 
                                        object.release('forced'); 
                                        object.activateGraphicalState(object.state); 
                                        if(object.onleave){object.onleave('forced');}
                                    };
                            
                            
                            
                            
                                //interactivity
                                    subject.cover.onmouseenter = function(x,y,event){
                                        object.state.hovering = true;  
                                        object.activateGraphicalState(object.state);
                                        if(object.onenter){object.onenter(event);}
                                        if(event.buttons == 1){subject.cover.onmousedown(event);} 
                                    };
                                    subject.cover.onmouseleave = function(x,y,event){ 
                                        object.state.hovering = false; 
                                        object.release(event); 
                                        object.activateGraphicalState(object.state); 
                                        if(object.onleave){object.onleave(event);}
                                    };
                                    subject.cover.onmouseup = function(x,y,event){   if(!interactable){return;} object.release(event); };
                                    subject.cover.onmousedown = function(x,y,event){ if(!interactable){return;} object.press(event); };
                                    subject.cover.ondblclick = function(x,y,event){ if(!active){return;} if(!interactable){return;} if(object.ondblpress){object.ondblpress(event);} };
                                    
                            
                            
                            
                                //callbacks
                                    object.onenter = onenter;
                                    object.onleave = onleave;
                                    object.onpress = onpress;
                                    object.ondblpress = ondblpress;
                                    object.onrelease = onrelease;
                                    object.onselect = onselect;
                                    object.ondeselect = ondeselect;
                            
                                return object;
                            };
                            this.button_polygon = function(
                                name='button_polygon',
                                x, y, points=[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}], angle=0, interactable=true,
                                text_centre='',
                                
                                active=true, hoverable=true, selectable=false, pressable=true,
                            
                                text_font = '5pt Arial',
                                text_textBaseline = 'alphabetic',
                                text_colour = {r:0/255,g:0/255,b:0/255,a:1},
                            
                                backing__off__colour=                            {r:180/255,g:180/255,b:180/255,a:1},
                                backing__off__lineColour=                        {r:0/255,g:0/255,b:0/255,a:0},
                                backing__off__lineThickness=                     0,
                                backing__up__colour=                             {r:200/255,g:200/255,b:200/255,a:1},
                                backing__up__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
                                backing__up__lineThickness=                      0,
                                backing__press__colour=                          {r:230/255,g:230/255,b:230/255,a:1},
                                backing__press__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
                                backing__press__lineThickness=                   0,
                                backing__select__colour=                         {r:200/255,g:200/255,b:200/255,a:1},
                                backing__select__lineColour=                     {r:120/255,g:120/255,b:120/255,a:1},
                                backing__select__lineThickness=                  0.75,
                                backing__select_press__colour=                   {r:230/255,g:230/255,b:230/255,a:1},
                                backing__select_press__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
                                backing__select_press__lineThickness=            0.75,
                                backing__glow__colour=                           {r:220/255,g:220/255,b:220/255,a:1},
                                backing__glow__lineColour=                       {r:0/255,g:0/255,b:0/255,a:0},
                                backing__glow__lineThickness=                    0,
                                backing__glow_press__colour=                     {r:250/255,g:250/255,b:250/255,a:1},
                                backing__glow_press__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
                                backing__glow_press__lineThickness=              0,
                                backing__glow_select__colour=                    {r:220/255,g:220/255,b:220/255,a:1},
                                backing__glow_select__lineColour=                {r:120/255,g:120/255,b:120/255,a:1},
                                backing__glow_select__lineThickness=             0.75,
                                backing__glow_select_press__colour=              {r:250/255,g:250/255,b:250/255,a:1},
                                backing__glow_select_press__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
                                backing__glow_select_press__lineThickness=       0.75,
                                backing__hover__colour=                          {r:220/255,g:220/255,b:220/255,a:1},
                                backing__hover__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover__lineThickness=                   0,
                                backing__hover_press__colour=                    {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_press__lineColour=                {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_press__lineThickness=             0,
                                backing__hover_select__colour=                   {r:220/255,g:220/255,b:220/255,a:1},
                                backing__hover_select__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_select__lineThickness=            0.75,
                                backing__hover_select_press__colour=             {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_select_press__lineColour=         {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_select_press__lineThickness=      0.75,
                                backing__hover_glow__colour=                     {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_glow__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_glow__lineThickness=              0,
                                backing__hover_glow_press__colour=               {r:250/255,g:250/255,b:250/255,a:1},
                                backing__hover_glow_press__lineColour=           {r:0/255,g:0/255,b:0/255,a:0},
                                backing__hover_glow_press__lineThickness=        0,
                                backing__hover_glow_select__colour=              {r:240/255,g:240/255,b:240/255,a:1},
                                backing__hover_glow_select__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_glow_select__lineThickness=       0.75,
                                backing__hover_glow_select_press__colour=        {r:250/255,g:250/255,b:250/255,a:1},
                                backing__hover_glow_select_press__lineColour=    {r:120/255,g:120/255,b:120/255,a:1},
                                backing__hover_glow_select_press__lineThickness= 0.75,
                            
                                onenter = function(event){},
                                onleave = function(event){},
                                onpress = function(event){},
                                ondblpress = function(event){},
                                onrelease = function(event){},
                                onselect = function(event){},
                                ondeselect = function(event){},
                            ){
                                //adding on the specific shapes
                                    //main
                                        var subject = interfacePart.builder('group',name+'subGroup');
                                    //backing
                                        var backing = interfacePart.builder('polygon','backing',{pointsAsXYArray:points, colour:backing__off__colour});
                                        subject.append(backing);
                                    //outline
                                        var outline = interfacePart.builder('path','outline',{ pointsAsXYArray:points.concat([points[0],points[1]]), thickness:backing__off__lineThickness, colour:backing__off__lineColour, });
                                        subject.append(outline);
                                    // //text
                                    //      var avgPoint = workspace.library.math.averagePoint(points);
                                    //      var text_centre = interfacePart.builder('text','centre', {
                                    //         x:avgPoint.x, y:avgPoint.y,
                                    //         text:text_centre, 
                                    //         style:{
                                    //             font:text_font,
                                    //             testBaseline:text_textBaseline,
                                    //             fill:text_fill,
                                    //             stroke:text_stroke,
                                    //             lineWidth:text_lineWidth,
                                    //             textAlign:'center',
                                    //             textBaseline:'middle',
                                    //         }
                                    //     });
                                    //     subject.append(text_centre);
                                    //cover
                                        subject.cover = interfacePart.builder('polygon','cover',{pointsAsXYArray:points, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(subject.cover);
                            
                                //generic button part
                                    var object = interfacePart.builder(
                                        'button_', name, {
                                            x:x, y:y, angle:angle, interactable:interactable,
                                            active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                            
                                            onenter:onenter,
                                            onleave:onleave,
                                            onpress:onpress,
                                            ondblpress:ondblpress,
                                            onrelease:onrelease,
                                            onselect:onselect,
                                            ondeselect:ondeselect,
                            
                                            subject:subject,
                                        }
                                    );
                            
                                //graphical state adjust
                                    object.activateGraphicalState = function(state){
                                        if(!active){ 
                                            backing.colour = backing__off__colour;
                                            outline.colour = backing__off__lineColour;
                                            outline.thickness( backing__off__lineThickness );
                                            return;
                                        }
                            
                                        var styles = [
                                            { colour:backing__up__colour,                      lineColour:backing__up__lineColour,                      lineThickness:backing__up__lineThickness                      },
                                            { colour:backing__press__colour,                   lineColour:backing__press__lineColour,                   lineThickness:backing__press__lineThickness                   },
                                            { colour:backing__select__colour,                  lineColour:backing__select__lineColour,                  lineThickness:backing__select__lineThickness                  },
                                            { colour:backing__select_press__colour,            lineColour:backing__select_press__lineColour,            lineThickness:backing__select_press__lineThickness            },
                                            { colour:backing__glow__colour,                    lineColour:backing__glow__lineColour,                    lineThickness:backing__glow__lineThickness                    },
                                            { colour:backing__glow_press__colour,              lineColour:backing__glow_press__lineColour,              lineThickness:backing__glow_press__lineThickness              },
                                            { colour:backing__glow_select__colour,             lineColour:backing__glow_select__lineColour,             lineThickness:backing__glow_select__lineThickness             },
                                            { colour:backing__glow_select_press__colour,       lineColour:backing__glow_select_press__lineColour,       lineThickness:backing__glow_select_press__lineThickness       },
                                            { colour:backing__hover__colour,                   lineColour:backing__hover__lineColour,                   lineThickness:backing__hover__lineThickness                   },
                                            { colour:backing__hover_press__colour,             lineColour:backing__hover_press__lineColour,             lineThickness:backing__hover_press__lineThickness             },
                                            { colour:backing__hover_select__colour,            lineColour:backing__hover_select__lineColour,            lineThickness:backing__hover_select__lineThickness            },
                                            { colour:backing__hover_select_press__colour,      lineColour:backing__hover_select_press__lineColour,      lineThickness:backing__hover_select_press__lineThickness      },
                                            { colour:backing__hover_glow__colour,              lineColour:backing__hover_glow__lineColour,              lineThickness:backing__hover_glow__lineThickness              },
                                            { colour:backing__hover_glow_press__colour,        lineColour:backing__hover_glow_press__lineColour,        lineThickness:backing__hover_glow_press__lineThickness        },
                                            { colour:backing__hover_glow_select__colour,       lineColour:backing__hover_glow_select__lineColour,       lineThickness:backing__hover_glow_select__lineThickness       },
                                            { colour:backing__hover_glow_select_press__colour, lineColour:backing__hover_glow_select_press__lineColour, lineThickness:backing__hover_glow_select_press__lineThickness },
                                        ];
                            
                                        if(!hoverable && state.hovering ){ state.hovering = false; }
                                        if(!selectable && state.selected ){ state.selected = false; }
                            
                                        var i = state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1;
                                        backing.colour = styles[i].colour;
                                        outline.colour = styles[i].lineColour;
                                        outline.thickness( styles[i].lineThickness );
                                    };
                                    object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });
                            
                                return object;
                            };
                            this.button_image = function(
                                name='button_image',
                                x, y, width=30, height=20, angle=0, interactable=true,
                                
                                active=true, hoverable=true, selectable=false, pressable=true,
                            
                                backingURL__off,
                                backingURL__up,
                                backingURL__press,
                                backingURL__select,
                                backingURL__select_press,
                                backingURL__glow,
                                backingURL__glow_press,
                                backingURL__glow_select,
                                backingURL__glow_select_press,
                                backingURL__hover,
                                backingURL__hover_press,
                                backingURL__hover_select,
                                backingURL__hover_select_press,
                                backingURL__hover_glow,
                                backingURL__hover_glow_press,
                                backingURL__hover_glow_select,
                                backingURL__hover_glow_select_press,
                            
                                onenter = function(event){},
                                onleave = function(event){},
                                onpress = function(event){},
                                ondblpress = function(event){},
                                onrelease = function(event){},
                                onselect = function(event){},
                                ondeselect = function(event){},
                            ){
                                //default to non-image version if image links are missing
                                    if(
                                        backingURL__off == undefined ||                backingURL__up == undefined ||                   backingURL__press == undefined || 
                                        backingURL__select == undefined ||             backingURL__select_press == undefined ||         backingURL__glow == undefined || 
                                        backingURL__glow_press == undefined ||         backingURL__glow_select == undefined ||          backingURL__glow_select_press == undefined || 
                                        backingURL__hover == undefined ||              backingURL__hover_press == undefined ||          backingURL__hover_select == undefined ||
                                        backingURL__hover_select_press == undefined || backingURL__hover_glow == undefined ||           backingURL__hover_glow_press == undefined || 
                                        backingURL__hover_glow_select == undefined ||  backingURL__hover_glow_select_press == undefined
                                    ){
                                        return this.button_rectangle(
                                            name, x, y, width, height, angle, interactable,
                                            undefined, undefined, undefined, undefined, undefined,
                                            active, hoverable, selectable, pressable,
                                            undefined, undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
                                            undefined, undefined, undefined, undefined, undefined, undefined,
                                            onenter, onleave, onpress, ondblpress, onrelease, onselect, ondeselect
                                        );
                                    }
                            
                            
                                //adding on the specific shapes
                                    //main
                                        var subject = interfacePart.builder('group',name+'subGroup',{});
                                    //backing
                                        var backing = interfacePart.builder('image','backing',{width:width, height:height, url:backingURL__off});
                                        subject.append(backing);
                                    //cover
                                        subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        subject.append(subject.cover);
                            
                                //generic button part
                                    var object = interfacePart.builder(
                                        'button_', name, {
                                            x:x, y:y, angle:angle, interactable:interactable,
                                            active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                            
                                            onenter:onenter,
                                            onleave:onleave,
                                            onpress:onpress,
                                            ondblpress:ondblpress,
                                            onrelease:onrelease,
                                            onselect:onselect,
                                            ondeselect:ondeselect,
                            
                                            subject:subject,
                                        }
                                    );
                            
                                //graphical state adjust
                                    object.activateGraphicalState = function(state){
                                        if(!active){ 
                                            backing.imageURL(backingURL__off);
                                            return;
                                        }
                            
                                        if(!hoverable && state.hovering ){ state.hovering = false; }
                                        if(!selectable && state.selected ){ state.selected = false; }
                            
                                        backing.imageURL([
                                            backingURL__up,                     
                                            backingURL__press,                  
                                            backingURL__select,                 
                                            backingURL__select_press,           
                                            backingURL__glow,                   
                                            backingURL__glow_press,             
                                            backingURL__glow_select,            
                                            backingURL__glow_select_press,      
                                            backingURL__hover,                  
                                            backingURL__hover_press,            
                                            backingURL__hover_select,           
                                            backingURL__hover_select_press,     
                                            backingURL__hover_glow,             
                                            backingURL__hover_glow_press,       
                                            backingURL__hover_glow_select,      
                                            backingURL__hover_glow_select_press,
                                        ][ state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1 ]);
                                    };
                                    object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });
                            
                                return object;
                            };
                            this.list_image = function(
                                name='list_image', 
                                x, y, width=50, height=100, angle=0, interactable=true,
                                list=[],
                            
                                itemTextVerticalOffsetMux=0.5, itemTextHorizontalOffsetMux=0.05,
                                active=true, multiSelect=true, hoverable=true, selectable=!false, pressable=true,
                            
                                itemHeightMux=0.1, itemWidthMux=0.95, itemSpacingMux=0.01, 
                                breakHeightMux=0.0025, breakWidthMux=0.9, 
                                spacingHeightMux=0.005,
                                backingURL, breakURL,
                            
                                itemURL__off,
                                itemURL__up,
                                itemURL__press,
                                itemURL__select,
                                itemURL__select_press,
                                itemURL__glow,
                                itemURL__glow_press,
                                itemURL__glow_select,
                                itemURL__glow_select_press,
                                itemURL__hover,
                                itemURL__hover_press,
                                itemURL__hover_select,
                                itemURL__hover_select_press,
                                itemURL__hover_glow,
                                itemURL__hover_glow_press,
                                itemURL__hover_glow_select,
                                itemURL__hover_glow_select_press,
                            
                                onenter=function(){},
                                onleave=function(){},
                                onpress=function(){},
                                ondblpress=function(){},
                                onrelease=function(){},
                                onselection=function(){},
                                onpositionchange=function(){},
                            ){
                                //state
                                    var itemArray = [];
                                    var selectedItems = [];
                                    var lastNonShiftClicked = 0;
                                    var position = 0;
                                    var calculatedListHeight;
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing
                                        var backing = interfacePart.builder('image','backing',{width:width, height:height, url:backingURL});
                                        object.append(backing);
                                    //item collection
                                        var itemCollection = interfacePart.builder('group','itemCollection');
                                        object.append(itemCollection);
                                        function refreshList(){
                                            //clean out all values
                                                itemArray = [];
                                                itemCollection.clear();
                                                selectedItems = [];
                                                position = 0;
                                                lastNonShiftClicked = 0;
                            
                                            //populate list
                                                var accumulativeHeight = 0;
                                                for(var a = 0; a < list.length; a++){
                                                    if( list[a] == 'space' ){
                                                        var temp = interfacePart.builder( 'rectangle', ''+a, {
                                                            x:0, y:accumulativeHeight,
                                                            width:width, height:height*spacingHeightMux,
                                                            colour:{r:0,g:0,b:0,a:0}
                                                        });
                            
                                                        accumulativeHeight += height*(spacingHeightMux+itemSpacingMux);
                                                        itemCollection.append( temp );
                                                    }else if( list[a] == 'break'){
                                                        var temp = interfacePart.builder('image',''+a,{
                                                            x:width*(1-breakWidthMux)*0.5, y:accumulativeHeight,
                                                            width:width*breakWidthMux, height:height*breakHeightMux,
                                                            url:breakURL
                                                        });
                            
                                                        accumulativeHeight += height*(breakHeightMux+itemSpacingMux);
                                                        itemCollection.append( temp );
                                                    }else{
                                                        var temp = interfacePart.builder( 'button_image', ''+a, {
                                                            x:width*(1-itemWidthMux)*0.5, y:accumulativeHeight,
                                                            width:width*itemWidthMux, height:height*itemHeightMux, interactable:interactable,
                            
                                                            active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                            
                                                            backingURL__off:                     itemURL__off,
                                                            backingURL__up:                      itemURL__up,
                                                            backingURL__press:                   itemURL__press,
                                                            backingURL__select:                  itemURL__select,
                                                            backingURL__select_press:            itemURL__select_press,
                                                            backingURL__glow:                    itemURL__glow,
                                                            backingURL__glow_press:              itemURL__glow_press,
                                                            backingURL__glow_select:             itemURL__glow_select,
                                                            backingURL__glow_select_press:       itemURL__glow_select_press,
                                                            backingURL__hover:                   itemURL__hover,
                                                            backingURL__hover_press:             itemURL__hover_press,
                                                            backingURL__hover_select:            itemURL__hover_select,
                                                            backingURL__hover_select_press:      itemURL__hover_select_press,
                                                            backingURL__hover_glow:              itemURL__hover_glow,
                                                            backingURL__hover_glow_press:        itemURL__hover_glow_press,
                                                            backingURL__hover_glow_select:       itemURL__hover_glow_select,
                                                            backingURL__hover_glow_select_press: itemURL__hover_glow_select_press,
                                                        });
                            
                                                        temp.onenter = function(a){ return function(){ object.onenter(a); } }(a);
                                                        temp.onleave = function(a){ return function(){ object.onleave(a); } }(a);
                                                        temp.onpress = function(a){ return function(){ object.onpress(a); } }(a);
                                                        temp.ondblpress = function(a){ return function(){ object.ondblpress(a); } }(a);
                                                        temp.onrelease = function(a){
                                                            return function(){
                                                                if( list[a].function ){ list[a].function(); }
                                                                object.onrelease(a);
                                                            }
                                                        }(a);
                                                        temp.onselect = function(a){ return function(obj,event){ object.select(a,true,event,false); } }(a);
                                                        temp.ondeselect = function(a){ return function(obj,event){ object.select(a,false,event,false); } }(a);
                            
                                                        accumulativeHeight += height*(itemHeightMux+itemSpacingMux);
                                                        itemCollection.append( temp );
                                                        itemArray.push( temp );
                                                    }
                                                }
                            
                                            return accumulativeHeight - height*itemSpacingMux;
                                        }
                                        calculatedListHeight = refreshList();
                                    //cover
                                        var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        object.append(cover);
                                    //stencil
                                        var stencil = interfacePart.builder('rectangle','stencil',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        object.stencil(stencil);
                                        object.clipActive(true);
                            
                            
                                //interaction
                                    cover.onwheel = function(x,y,event){
                                        if(!interactable){return;}
                                        var move = event.deltaY/100;
                                        object.position( object.position() + move/10 );
                                        for(var a = 0; a < itemArray.length; a++){
                                            itemArray[a].forceMouseLeave();
                                        }
                                    };
                                
                                //controls
                                    object.position = function(a,update=true){
                                        if(a == undefined){return position;}
                                        a = a < 0 ? 0 : a;
                                        a = a > 1 ? 1 : a;
                                        position = a;
                            
                                        if( calculatedListHeight < height ){return;}
                                        var movementSpace = calculatedListHeight - height;
                                        itemCollection.y( -a*movementSpace );
                                        
                                        if(update&&this.onpositionchange){this.onpositionchange(a);}
                                    };
                                    object.select = function(a,state,event,update=true){
                                        if(!selectable){return;}
                            
                                        //where multi selection is not allowed
                                            if(!multiSelect){
                                                //where we want to select an item, which is not already selected
                                                    if(state && !selectedItems.includes(a) ){
                                                        //deselect all other items
                                                            while( selectedItems.length > 0 ){
                                                                itemCollection.children[ selectedItems[0] ].select(false,undefined,false);
                                                                selectedItems.shift();
                                                            }
                            
                                                        //select current item
                                                            selectedItems.push(a);
                            
                                                //where we want to deselect an item that is selected
                                                    }else if(!state && selectedItems.includes(a)){
                                                        selectedItems = [];
                                                    }
                            
                                            //do not update the item itself, in the case that it was the item that sent this command
                                            //(which would cause a little loop)
                                                if(update){ itemCollection.children[a].select(true,undefined,false); }
                            
                                        //where multi selection is allowed
                                            }else{
                                                //wherer range-selection is to be done
                                                    if( event != undefined && event.shiftKey ){
                                                        //gather top and bottom item
                                                        //(first gather the range positions overall, then compute those positions to indexes on the itemArray)
                                                            var min = Math.min(lastNonShiftClicked, a);
                                                            var max = Math.max(lastNonShiftClicked, a);
                                                            for(var b = 0; b < itemArray.length; b++){
                                                                if( itemArray[b].name == ''+min ){min = b;}
                                                                if( itemArray[b].name == ''+max ){max = b;}
                                                            }
                            
                                                        //deselect all outside the range
                                                            selectedItems = [];
                                                            for(var b = 0; b < itemArray.length; b++){
                                                                if( b > max || b < min ){
                                                                    if( itemArray[b].select() ){
                                                                        itemArray[b].select(false,undefined,false);
                                                                    }
                                                                }
                                                            }
                            
                                                        //select those within the range (that aren't already selected)
                                                            for(var b = min; b <= max; b++){
                                                                if( !itemArray[b].select() ){
                                                                    itemArray[b].select(true,undefined,false);
                                                                    selectedItems.push(b);
                                                                }
                                                            }
                                                //where range-selection is not to be done
                                                    }else{
                                                        if(update){ itemArray[a].select(state); }
                                                        if(state && !selectedItems.includes(a) ){ selectedItems.push(a); }
                                                        else if(!state && selectedItems.includes(a)){ selectedItems.splice( selectedItems.indexOf(a), 1 ); }
                                                        lastNonShiftClicked = a;
                                                    }
                                            }
                            
                                        object.onselection(selectedItems);
                                    };
                                    object.add = function(item){
                                        list.push(item);
                                        calculatedListHeight = refreshList();
                                    };
                                    object.remove = function(a){
                                        list.splice(a,1);
                                        calculatedListHeight = refreshList();
                                    };
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                        refreshList();
                                    };
                            
                                //callbacks
                                    object.onenter = onenter;
                                    object.onleave = onleave;
                                    object.onpress = onpress;
                                    object.ondblpress = ondblpress;
                                    object.onrelease = onrelease;
                                    object.onselection = onselection;
                                    object.onpositionchange = onpositionchange;
                                    
                                return object;
                            };
                            this.list = function(
                                name='list', 
                                x, y, width=50, height=100, angle=0, interactable=true,
                                list=[],
                            
                                itemTextVerticalOffsetMux=0.5, itemTextHorizontalOffsetMux=0.05,
                                active=true, multiSelect=true, hoverable=true, selectable=!false, pressable=true,
                            
                                itemHeightMux=0.1, itemWidthMux=0.95, itemSpacingMux=0.01, 
                                breakHeightMux=0.0025, breakWidthMux=0.9, 
                                spacingHeightMux=0.005,
                                backing_style={r:230/255,g:230/255,b:230/255,a:1}, break_style={r:195/255,g:195/255,b:195/255,a:1},
                            
                                text_font = '5pt Arial',
                                text_textBaseline = 'alphabetic',
                                text_colour = {r:0/255,g:0/255,b:0/255,a:1},
                            
                                item__off__colour=                            {r:180/255,g:180/255,b:180/255,a:1},
                                item__off__lineColour=                        {r:0/255,g:0/255,b:0/255,a:0},
                                item__off__lineThickness=                     0,
                                item__up__colour=                             {r:200/255,g:200/255,b:200/255,a:1},
                                item__up__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
                                item__up__lineThickness=                      0,
                                item__press__colour=                          {r:230/255,g:230/255,b:230/255,a:1},
                                item__press__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
                                item__press__lineThickness=                   0,
                                item__select__colour=                         {r:200/255,g:200/255,b:200/255,a:1},
                                item__select__lineColour=                     {r:120/255,g:120/255,b:120/255,a:1},
                                item__select__lineThickness=                  0.75,
                                item__select_press__colour=                   {r:230/255,g:230/255,b:230/255,a:1},
                                item__select_press__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
                                item__select_press__lineThickness=            0.75,
                                item__glow__colour=                           {r:220/255,g:220/255,b:220/255,a:1},
                                item__glow__lineColour=                       {r:0/255,g:0/255,b:0/255,a:0},
                                item__glow__lineThickness=                    0,
                                item__glow_press__colour=                     {r:250/255,g:250/255,b:250/255,a:1},
                                item__glow_press__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
                                item__glow_press__lineThickness=              0,
                                item__glow_select__colour=                    {r:220/255,g:220/255,b:220/255,a:1},
                                item__glow_select__lineColour=                {r:120/255,g:120/255,b:120/255,a:1},
                                item__glow_select__lineThickness=             0.75,
                                item__glow_select_press__colour=              {r:250/255,g:250/255,b:250/255,a:1},
                                item__glow_select_press__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
                                item__glow_select_press__lineThickness=       0.75,
                                item__hover__colour=                          {r:220/255,g:220/255,b:220/255,a:1},
                                item__hover__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
                                item__hover__lineThickness=                   0,
                                item__hover_press__colour=                    {r:240/255,g:240/255,b:240/255,a:1},
                                item__hover_press__lineColour=                {r:0/255,g:0/255,b:0/255,a:0},
                                item__hover_press__lineThickness=             0,
                                item__hover_select__colour=                   {r:220/255,g:220/255,b:220/255,a:1},
                                item__hover_select__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
                                item__hover_select__lineThickness=            0.75,
                                item__hover_select_press__colour=             {r:240/255,g:240/255,b:240/255,a:1},
                                item__hover_select_press__lineColour=         {r:120/255,g:120/255,b:120/255,a:1},
                                item__hover_select_press__lineThickness=      0.75,
                                item__hover_glow__colour=                     {r:240/255,g:240/255,b:240/255,a:1},
                                item__hover_glow__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
                                item__hover_glow__lineThickness=              0,
                                item__hover_glow_press__colour=               {r:250/255,g:250/255,b:250/255,a:1},
                                item__hover_glow_press__lineColour=           {r:0/255,g:0/255,b:0/255,a:0},
                                item__hover_glow_press__lineThickness=        0,
                                item__hover_glow_select__colour=              {r:240/255,g:240/255,b:240/255,a:1},
                                item__hover_glow_select__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
                                item__hover_glow_select__lineThickness=       0.75,
                                item__hover_glow_select_press__colour=        {r:250/255,g:250/255,b:250/255,a:1},
                                item__hover_glow_select_press__lineColour=    {r:120/255,g:120/255,b:120/255,a:1},
                                item__hover_glow_select_press__lineThickness= 0.75,
                            
                                onenter=function(){},
                                onleave=function(){},
                                onpress=function(){},
                                ondblpress=function(){},
                                onrelease=function(){},
                                onselection=function(){},
                                onpositionchange=function(){},
                            ){
                                //state
                                    var itemArray = [];
                                    var selectedItems = [];
                                    var lastNonShiftClicked = 0;
                                    var position = 0;
                                    var calculatedListHeight;
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing
                                        var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, colour:backing_style});
                                        object.append(backing);
                                    //item collection
                                        var itemCollection = interfacePart.builder('group','itemCollection');
                                        object.append(itemCollection);
                                        function refreshList(){
                                            //clean out all values
                                                itemArray = [];
                                                itemCollection.clear();
                                                selectedItems = [];
                                                position = 0;
                                                lastNonShiftClicked = 0;
                            
                                            //populate list
                                                var accumulativeHeight = 0;
                                                for(var a = 0; a < list.length; a++){
                                                    if( list[a] == 'space' ){
                                                        var temp = interfacePart.builder( 'rectangle', ''+a, {
                                                            x:0, y:accumulativeHeight,
                                                            width:width, height:height*spacingHeightMux,
                                                            colour:{r:1,g:0,b:0,a:0},
                                                        });
                            
                                                        accumulativeHeight += height*(spacingHeightMux+itemSpacingMux);
                                                        itemCollection.append( temp );
                                                    }else if( list[a] == 'break'){
                                                        var temp = interfacePart.builder( 'rectangle', ''+a, {
                                                            x:width*(1-breakWidthMux)*0.5, y:accumulativeHeight,
                                                            width:width*breakWidthMux, height:height*breakHeightMux,
                                                            colour:break_style
                                                        });
                            
                                                        accumulativeHeight += height*(breakHeightMux+itemSpacingMux);
                                                        itemCollection.append( temp );
                                                    }else{
                                                        var temp = interfacePart.builder( 'button_rectangle', ''+a, {
                                                            x:width*(1-itemWidthMux)*0.5, y:accumulativeHeight,
                                                            width:width*itemWidthMux, height:height*itemHeightMux, interactable:interactable,
                                                            text_left: list[a].text_left,
                                                            text_centre: (list[a].text?list[a].text:list[a].text_centre),
                                                            text_right: list[a].text_right,
                            
                                                            textVerticalOffset: itemTextVerticalOffsetMux, textHorizontalOffsetMux: itemTextHorizontalOffsetMux,
                                                            active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                            
                                                            style:{
                                                                text_font:text_font,
                                                                text_textBaseline:text_textBaseline,
                                                                text_colour:text_colour,
                            
                                                                background__off__colour:                            item__off__colour,
                                                                background__off__lineColour:                        item__off__lineColour,
                                                                background__off__lineThickness:                     item__off__lineThickness,
                                                                background__up__colour:                             item__up__colour,
                                                                background__up__lineColour:                         item__up__lineColour,
                                                                background__up__lineThickness:                      item__up__lineThickness,
                                                                background__press__colour:                          item__press__colour,
                                                                background__press__lineColour:                      item__press__lineColour,
                                                                background__press__lineThickness:                   item__press__lineThickness,
                                                                background__select__colour:                         item__select__colour,
                                                                background__select__lineColour:                     item__select__lineColour,
                                                                background__select__lineThickness:                  item__select__lineThickness,
                                                                background__select_press__colour:                   item__select_press__colour,
                                                                background__select_press__lineColour:               item__select_press__lineColour,
                                                                background__select_press__lineThickness:            item__select_press__lineThickness,
                                                                background__glow__colour:                           item__glow__colour,
                                                                background__glow__lineColour:                       item__glow__lineColour,
                                                                background__glow__lineThickness:                    item__glow__lineThickness,
                                                                background__glow_press__colour:                     item__glow_press__colour,
                                                                background__glow_press__lineColour:                 item__glow_press__lineColour,
                                                                background__glow_press__lineThickness:              item__glow_press__lineThickness,
                                                                background__glow_select__colour:                    item__glow_select__colour,
                                                                background__glow_select__lineColour:                item__glow_select__lineColour,
                                                                background__glow_select__lineThickness:             item__glow_select__lineThickness,
                                                                background__glow_select_press__colour:              item__glow_select_press__colour,
                                                                background__glow_select_press__lineColour:          item__glow_select_press__lineColour,
                                                                background__glow_select_press__lineThickness:       item__glow_select_press__lineThickness,
                                                                background__hover__colour:                          item__hover__colour,
                                                                background__hover__lineColour:                      item__hover__lineColour,
                                                                background__hover__lineThickness:                   item__hover__lineThickness,
                                                                background__hover_press__colour:                    item__hover_press__colour,
                                                                background__hover_press__lineColour:                item__hover_press__lineColour,
                                                                background__hover_press__lineThickness:             item__hover_press__lineThickness,
                                                                background__hover_select__colour:                   item__hover_select__colour,
                                                                background__hover_select__lineColour:               item__hover_select__lineColour,
                                                                background__hover_select__lineThickness:            item__hover_select__lineThickness,
                                                                background__hover_select_press__colour:             item__hover_select_press__colour,
                                                                background__hover_select_press__lineColour:         item__hover_select_press__lineColour,
                                                                background__hover_select_press__lineThickness:      item__hover_select_press__lineThickness,
                                                                background__hover_glow__colour:                     item__hover_glow__colour,
                                                                background__hover_glow__lineColour:                 item__hover_glow__lineColour,
                                                                background__hover_glow__lineThickness:              item__hover_glow__lineThickness,
                                                                background__hover_glow_press__colour:               item__hover_glow_press__colour,
                                                                background__hover_glow_press__lineColour:           item__hover_glow_press__lineColour,
                                                                background__hover_glow_press__lineThickness:        item__hover_glow_press__lineThickness,
                                                                background__hover_glow_select__colour:              item__hover_glow_select__colour,
                                                                background__hover_glow_select__lineColour:          item__hover_glow_select__lineColour,
                                                                background__hover_glow_select__lineThickness:       item__hover_glow_select__lineThickness,
                                                                background__hover_glow_select_press__colour:        item__hover_glow_select_press__colour,
                                                                background__hover_glow_select_press__lineColour:    item__hover_glow_select_press__lineColour,
                                                                background__hover_glow_select_press__lineThickness: item__hover_glow_select_press__lineThickness,
                                                            }
                                                        });
                            
                                                        temp.onenter = function(a){ return function(){ object.onenter(a); } }(a);
                                                        temp.onleave = function(a){ return function(){ object.onleave(a); } }(a);
                                                        temp.onpress = function(a){ return function(){ object.onpress(a); } }(a);
                                                        temp.ondblpress = function(a){ return function(){ object.ondblpress(a); } }(a);
                                                        temp.onrelease = function(a){
                                                            return function(){
                                                                if( list[a].function ){ list[a].function(); }
                                                                object.onrelease(a);
                                                            }
                                                        }(a);
                                                        temp.onselect = function(a){ return function(obj,event){ object.select(a,true,event,false); } }(a);
                                                        temp.ondeselect = function(a){ return function(obj,event){ object.select(a,false,event,false); } }(a);
                            
                                                        accumulativeHeight += height*(itemHeightMux+itemSpacingMux);
                                                        itemCollection.append( temp );
                                                        itemArray.push( temp );
                                                    }
                                                }
                            
                                            return accumulativeHeight - height*itemSpacingMux;
                                        }
                                        calculatedListHeight = refreshList();
                                    //cover
                                        var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0}});
                                        object.append(cover);
                                    //stencil
                                        var stencil = interfacePart.builder('rectangle','stencil',{width:width, height:height});
                                        object.stencil(stencil);
                                        object.clipActive(true);
                            
                            
                                //interaction
                                    cover.onwheel = function(x,y,event){
                                        if(!interactable){return;}
                                        var move = event.deltaY/100;
                                        object.position( object.position() + move/10 );
                                        for(var a = 0; a < itemArray.length; a++){
                                            itemArray[a].forceMouseLeave();
                                        }
                                    };
                                
                                //controls
                                    object.position = function(a,update=true){
                                        if(a == undefined){return position;}
                                        a = a < 0 ? 0 : a;
                                        a = a > 1 ? 1 : a;
                                        position = a;
                            
                                        if( calculatedListHeight < height ){return;}
                                        var movementSpace = calculatedListHeight - height;
                                        itemCollection.y( -a*movementSpace );
                                        
                                        if(update&&this.onpositionchange){this.onpositionchange(a);}
                                    };
                                    object.select = function(a,state,event,update=true){
                                        if(!selectable){return;}
                            
                                        //where multi selection is not allowed
                                            if(!multiSelect){
                                                //where we want to select an item, which is not already selected
                                                    if(state && !selectedItems.includes(a) ){
                                                        //deselect all other items
                                                            while( selectedItems.length > 0 ){
                                                                itemCollection.children[ selectedItems[0] ].select(false,undefined,false);
                                                                selectedItems.shift();
                                                            }
                            
                                                        //select current item
                                                            selectedItems.push(a);
                            
                                                //where we want to deselect an item that is selected
                                                    }else if(!state && selectedItems.includes(a)){
                                                        selectedItems = [];
                                                    }
                            
                                            //do not update the item itself, in the case that it was the item that sent this command
                                            //(which would cause a little loop)
                                                if(update){ itemCollection.children[a].select(true,undefined,false); }
                            
                                        //where multi selection is allowed
                                            }else{
                                                //wherer range-selection is to be done
                                                    if( event != undefined && event.shiftKey ){
                                                        //gather top and bottom item
                                                        //(first gather the range positions overall, then compute those positions to indexes on the itemArray)
                                                            var min = Math.min(lastNonShiftClicked, a);
                                                            var max = Math.max(lastNonShiftClicked, a);
                                                            for(var b = 0; b < itemArray.length; b++){
                                                                if( itemArray[b].name == ''+min ){min = b;}
                                                                if( itemArray[b].name == ''+max ){max = b;}
                                                            }
                            
                                                        //deselect all outside the range
                                                            selectedItems = [];
                                                            for(var b = 0; b < itemArray.length; b++){
                                                                if( b > max || b < min ){
                                                                    if( itemArray[b].select() ){
                                                                        itemArray[b].select(false,undefined,false);
                                                                    }
                                                                }
                                                            }
                            
                                                        //select those within the range (that aren't already selected)
                                                            for(var b = min; b <= max; b++){
                                                                if( !itemArray[b].select() ){
                                                                    itemArray[b].select(true,undefined,false);
                                                                    selectedItems.push(b);
                                                                }
                                                            }
                                                //where range-selection is not to be done
                                                    }else{
                                                        if(update){ itemArray[a].select(state); }
                                                        if(state && !selectedItems.includes(a) ){ selectedItems.push(a); }
                                                        else if(!state && selectedItems.includes(a)){ selectedItems.splice( selectedItems.indexOf(a), 1 ); }
                                                        lastNonShiftClicked = a;
                                                    }
                                            }
                            
                                        object.onselection(selectedItems);
                                    };
                                    object.add = function(item){
                                        list.push(item);
                                        calculatedListHeight = refreshList();
                                    };
                                    object.remove = function(a){
                                        list.splice(a,1);
                                        calculatedListHeight = refreshList();
                                    };
                                    object.interactable = function(bool){
                                        if(bool==undefined){return interactable;}
                                        interactable = bool;
                                        refreshList();
                                    };
                            
                                //callbacks
                                    object.onenter = onenter;
                                    object.onleave = onleave;
                                    object.onpress = onpress;
                                    object.ondblpress = ondblpress;
                                    object.onrelease = onrelease;
                                    object.onselection = onselection;
                                    object.onpositionchange = onpositionchange;
                                    
                                return object;
                            };
                        };
                        this.display = new function(){
                            this.grapher_audioScope = function(
                                name='grapher_audioScope',
                                x, y, width=120, height=60, angle=0,
                            
                                foregroundStyle={colour:{r:0,g:1,b:0,a:1}, thickness:0.5},
                                foregroundTextStyle={fill:{r:0.39,g:1,b:0.39,a:1}, size:0.75, font:'Helvetica'},
                            
                                backgroundStyle_colour={r:0,g:0.39,b:0,a:1},
                                backgroundStyle_thickness=0.25,
                                backgroundTextStyle_fill={r:0,g:0.59,b:0,a:1},
                                backgroundTextStyle_size=0.1,
                                backgroundTextStyle_font='Helvetica',
                            
                                backingStyle={r:0.2,g:0.2,b:0.2,a:1},
                            ){
                                //attributes
                                    var attributes = {
                                        analyser:{
                                            analyserNode: _canvas_.library.audio.context.createAnalyser(),
                                            timeDomainDataArray: null,
                                            frequencyData: null,
                                            refreshRate: 10,
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
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //grapher
                                        var grapher = interfacePart.builder('grapher',name,{
                                            x:0, y:0, width:width, height:height,
                                            foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                                            backgroundStyle_colour:backgroundStyle_colour, 
                                            backgroundStyle_thickness:backgroundStyle_thickness,
                                            backgroundTextStyle_fill:backgroundTextStyle_fill, 
                                            backgroundTextStyle_size:backgroundTextStyle_size,
                                            backgroundTextStyle_font:backgroundTextStyle_font,
                                            backingStyle:backingStyle,
                                        });
                                        object.append(grapher);
                            
                                //utility functions
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
                                        grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:false});
                                        grapher.verticalMarkings({points:[-0.25,-0.5,-0.75,0,0.25,0.5,0.75],printText:false});
                                        grapher.drawBackground();
                                    };
                            
                                //controls
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
                            
                                //setup
                                    setBackground();
                            
                                return object;
                            };
                            this.sevenSegmentDisplay = function(
                                name='sevenSegmentDisplay',
                                x, y, width=20, height=30, angle=0,
                                backgroundStyle={r:0,g:0,b:0,a:1},
                                glowStyle={r:0.78,g:0.78,b:0.78,a:1},
                                dimStyle={r:0.1,g:0.1,b:0.1,a:1},
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
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                            
                                    //backing
                                        var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, colour:backgroundStyle });
                                            object.append(rect);
                            
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
                                                segment: interfacePart.builder('polygon','segment_'+a,{pointsAsXYArray:points[a], colour:dimStyle}),
                                                state: false
                                            };
                                            segments.push( temp );
                                            object.append( temp.segment );
                                        }
                            
                                //methods
                                    object.set = function(segment,state){
                                        segments[segment].state = state;
                                        if(state){ segments[segment].segment.colour = glowStyle; }
                                        else{ segments[segment].segment.colour = dimStyle; }
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
                                            case 0: case '0': stamp = [1,1,1,0,1,1,1]; break;
                                            case 1: case '1': stamp = [0,0,1,0,0,1,0]; break;
                                            case 2: case '2': stamp = [1,0,1,1,1,0,1]; break;
                                            case 3: case '3': stamp = [1,0,1,1,0,1,1]; break;
                                            case 4: case '4': stamp = [0,1,1,1,0,1,0]; break;
                                            case 5: case '5': stamp = [1,1,0,1,0,1,1]; break;
                                            case 6: case '6': stamp = [1,1,0,1,1,1,1]; break;
                                            case 7: case '7': stamp = [1,0,1,0,0,1,0]; break;
                                            case 8: case '8': stamp = [1,1,1,1,1,1,1]; break;
                                            case 9: case '9': stamp = [1,1,1,1,0,1,1]; break;
                                            default: stamp = [0,0,0,0,0,0,0]; break;
                                        }
                            
                                        for(var a = 0; a < stamp.length; a++){
                                            this.set(a, stamp[a]==1);
                                        }
                                    };
                            
                                return object;
                            };
                            this.sixteenSegmentDisplay = function(
                                name='sixteenSegmentDisplay',
                                x, y, width=20, height=30, angle=0,
                                backgroundStyle={r:0,g:0,b:0,a:1},
                                glowStyle={r:0.78,g:0.78,b:0.78,a:1},
                                dimStyle={r:0.1,g:0.1,b:0.1,a:1},
                            ){
                                var margin = width/8;
                                var division = width/8;
                                var shapes = {
                                    segments:{
                                        points: {
                                            top:{
                                                left:[
                                                    {x:division*0.5+margin,         y:division*0.5+margin},  //centre
                                                    {x:division*1.0+margin,         y:division*0.0+margin},  //top
                                                    {x:division*0.0+margin,         y:division*1.0+margin},  //left
                                                    {x:division*1.0+margin,         y:division*1.0+margin},  //inner point
                                                    {x:division*1.75+margin,        y:division*1.0+margin},  //inner point right
                                                    {x:division*1.0+margin,         y:division*1.75+margin}, //inner point down
                                                ],
                                                centre:[
                                                    {x:width/2,                     y:division*0.5+margin}, //central point
                                                    {x:width/2-division*0.5,        y:division*1.0+margin}, //lower left
                                                    {x:width/2+division*0.5,        y:division*1.0+margin}, //lower right
                                                    {x:width/2-division*0.5,        y:division*0.0+margin}, //upper left
                                                    {x:width/2+division*0.5,        y:division*0.0+margin}, //upper right
                                                ],
                                                right:[
                                                    {x:width-division*0.5-margin,   y:division*0.5+margin},  //centre
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
                                                    {x:division*0.5+margin,         y:height*0.5-division*0.0}, //centre
                                                    {x:division*0.0+margin,         y:height*0.5+division*0.5}, //bottom left
                                                    {x:division*1.0+margin,         y:height*0.5+division*0.5}, //bottom right
                                                ],
                                                centre:[
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
                                                    {x:width-division*0.5-margin,   y:height*0.5-division*0.0}, //centre
                                                    {x:width-division*1.0-margin,   y:height*0.5+division*0.5}, //bottom left
                                                    {x:width-division*0.0-margin,   y:height*0.5+division*0.5}  //bottom right
                                                ]
                                            },
                                            bottom: {
                                                left:[
                                                    {x:division*0.5+margin,         y:height-division*0.5-margin}, //centre
                                                    {x:division*0.0+margin,         y:height-division*1.0-margin}, //left
                                                    {x:division*1.0+margin,         y:height-division*0.0-margin}, //bottom
                                                    {x:division*1.0+margin,         y:height-division*1.0-margin}, //inner point
                                                    {x:division*1.0+margin,         y:height-division*1.75-margin},//inner point up
                                                    {x:division*1.75+margin,        y:height-division*1.0-margin}, //inner point right
                                                ],
                                                centre:[
                                                    {x:width/2-division*0.5,        y:height-division*1.0-margin}, //upper left
                                                    {x:width/2+division*0.5,        y:height-division*1.0-margin}, //upper right
                                                    {x:width/2,                     y:height-division*0.5-margin}, //central point
                                                    {x:width/2-division*0.5,        y:height-division*0.0-margin}, //lower left
                                                    {x:width/2+division*0.5,        y:height-division*0.0-margin}, //lower right
                                                ],
                                                right:[
                                                    {x:width-division*0.5-margin,   y:height-division*0.5-margin}, //centre
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
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                            
                                    //backing
                                        var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, colour:backgroundStyle });
                                            object.append(rect);
                            
                            
                                    //segments
                                        var segments = [];
                                        var points = [
                                            [
                                                shapes.segments.points.top.left[1],
                                                shapes.segments.points.top.left[0],
                                                shapes.segments.points.top.left[3],
                                                shapes.segments.points.top.centre[1],
                                                shapes.segments.points.top.centre[0],
                                                shapes.segments.points.top.centre[3],
                                            ],
                                            [
                                                shapes.segments.points.top.centre[4],
                                                shapes.segments.points.top.centre[0],
                                                shapes.segments.points.top.centre[2],
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
                                                shapes.segments.points.middle.centre[9],
                                                shapes.segments.points.middle.centre[7],
                                                shapes.segments.points.middle.centre[8],
                                            ],
                                            [
                                                shapes.segments.points.top.centre[0],
                                                shapes.segments.points.top.centre[1],
                                                shapes.segments.points.middle.centre[7],
                                                shapes.segments.points.middle.centre[0],
                                                shapes.segments.points.middle.centre[10],
                                                shapes.segments.points.top.centre[2],
                                            ],
                                            [
                                                shapes.segments.points.top.right[4],
                                                shapes.segments.points.top.right[3],
                                                shapes.segments.points.top.right[5],
                                                shapes.segments.points.middle.centre[11],
                                                shapes.segments.points.middle.centre[10],
                                                shapes.segments.points.middle.centre[12],
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
                                                shapes.segments.points.middle.centre[7],
                                                shapes.segments.points.middle.centre[0],
                                                shapes.segments.points.middle.centre[1],
                                            ],
                                            [
                                                shapes.segments.points.middle.right[3],
                                                shapes.segments.points.middle.right[2],
                                                shapes.segments.points.middle.right[0],
                                                shapes.segments.points.middle.centre[10],
                                                shapes.segments.points.middle.centre[0],
                                                shapes.segments.points.middle.centre[4],
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
                                                shapes.segments.points.middle.centre[2],
                                                shapes.segments.points.middle.centre[1],
                                                shapes.segments.points.middle.centre[3],
                                            ],
                                            [
                                                shapes.segments.points.bottom.centre[0],
                                                shapes.segments.points.bottom.centre[2],
                                                shapes.segments.points.bottom.centre[1],
                                                shapes.segments.points.middle.centre[4],
                                                shapes.segments.points.middle.centre[0],
                                                shapes.segments.points.middle.centre[1],
                                            ],
                                            [
                                                shapes.segments.points.bottom.right[4],
                                                shapes.segments.points.bottom.right[3],
                                                shapes.segments.points.bottom.right[5],
                                                shapes.segments.points.middle.centre[5],
                                                shapes.segments.points.middle.centre[4],
                                                shapes.segments.points.middle.centre[6],
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
                                                shapes.segments.points.bottom.centre[0],
                                                shapes.segments.points.bottom.centre[2],
                                                shapes.segments.points.bottom.centre[3],
                                            ],
                                            [
                                                shapes.segments.points.bottom.right[2],
                                                shapes.segments.points.bottom.right[0],
                                                shapes.segments.points.bottom.right[3],
                                                shapes.segments.points.bottom.centre[1],
                                                shapes.segments.points.bottom.centre[2],
                                                shapes.segments.points.bottom.centre[4],
                                            ],
                                        ];
                                        for(var a = 0; a < points.length; a++){
                                            var temp = {
                                                segment: interfacePart.builder('polygon','segment_'+a,{pointsAsXYArray:points[a], colour:dimStyle}),
                                                state: false
                                            };
                                            segments.push( temp );
                                            object.append( temp.segment );
                                        }
                            
                            
                                //methods
                                    object.set = function(segment,state){
                                        segments[segment].state = state;
                                        if(state){ segments[segment].segment.colour = glowStyle; }
                                        else{ segments[segment].segment.colour = dimStyle; }
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
                            
                                            case '0': case 0: 
                                                stamp = [
                                                    1,1,
                                                    1,0,0,1,1,
                                                    0,0,
                                                    1,1,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '1': case 1:
                                                stamp = [
                                                    1,0,
                                                    0,0,1,0,0,
                                                    0,0,
                                                    0,0,1,0,0,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '2': case 2:
                                                stamp = [
                                                    1,1,
                                                    0,0,0,0,1,
                                                    0,1,
                                                    0,1,0,0,0,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '3': case 3:
                                                stamp = [
                                                    1,1,
                                                    0,0,0,0,1,
                                                    1,1,
                                                    0,0,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '4': case 4:
                                                stamp = [
                                                    0,0,
                                                    1,0,0,0,1,
                                                    1,1,
                                                    0,0,0,0,1,
                                                    0,0,
                                                ]; 
                                            break;
                                            case '5': case 5:
                                                stamp = [
                                                    1,1,
                                                    1,0,0,0,0,
                                                    1,1,
                                                    0,0,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '6': case 6:
                                                stamp = [
                                                    1,1,
                                                    1,0,0,0,0,
                                                    1,1,
                                                    1,0,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '7': case 7:
                                                stamp = [
                                                    1,1,
                                                    0,0,0,1,0,
                                                    0,0,
                                                    0,1,0,0,0,
                                                    0,0,
                                                ]; 
                                            break;
                                            case '8': case 8:
                                                stamp = [
                                                    1,1,
                                                    1,0,0,0,1,
                                                    1,1,
                                                    1,0,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '9': case 9:
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
                            
                            
                                return object;      
                            };
                            this.rastorDisplay = function(
                                name='rastorDisplay',
                                x, y, angle=0, width=60, height=60,
                                xCount=8, yCount=8, xGappage=0.1, yGappage=0.1,
                                backing={r:0.2,g:0.2,b:0.2,a:1}, defaultPixelValue={r:0,g:0,b:0,a:1},
                            ){
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing
                                        var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, colour:backing });
                                        object.append(rect);
                                    //pixels
                                        var pixelGroup = interfacePart.builder('group','pixels');
                                        object.append(pixelGroup);
                            
                                        var pixels = [];
                                        var pixelValues = [];
                                        var pixWidth = width/xCount;
                                        var pixHeight = height/yCount;
                            
                                        for(var x = 0; x < xCount; x++){
                                            var temp_pixels = [];
                                            var temp_pixelValues = [];
                                            for(var y = 0; y < yCount; y++){
                                                var rect = interfacePart.builder('rectangle',x+'_'+y,{ 
                                                    x:(x*pixWidth)+xGappage/2,  y:(y*pixHeight)+yGappage/2, 
                                                    width:pixWidth-xGappage,    height:pixHeight-yGappage,
                                                    colour:defaultPixelValue,
                                                });
                                                    
                                                temp_pixels.push(rect);
                                                temp_pixelValues.push([0,0,0]);
                                                pixelGroup.append(rect);
                                            }
                                            pixels.push(temp_pixels);
                                            pixelValues.push(temp_pixelValues);
                                        }
                            
                                //graphical update
                                    function render(){
                                        for(var x = 0; x < xCount; x++){
                                            for(var y = 0; y < yCount; y++){
                                                pixels[x][y].colour = {r:pixelValues[x][y][0],g:pixelValues[x][y][1],b:pixelValues[x][y][2],a:1};
                                            }
                                        }
                                    }
                            
                                //control
                                    object.get = function(x,y){ return pixelValues[x][y]; };
                                    object.set = function(x,y,state){ pixelValues[x][y] = state; render(); };
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
                            this.glowbox_rect = function(
                                name='glowbox_rect',
                                x, y, width=30, height=30, angle=0,
                                glowStyle = {r:0.95,g:0.91,b:0.55,a:1},
                                dimStyle = {r:0.31,g:0.31,b:0.31,a:1},
                            ){
                                //elements 
                                    var object = interfacePart.builder('group',name,{x:x, y:y});
                                    var rect = interfacePart.builder('rectangle','light',{ width:width, height:height, angle:angle, colour:dimStyle });
                                        object.append(rect);
                            
                                //methods
                                    object.on = function(){
                                        rect.colour = glowStyle;
                                    };
                                    object.off = function(){
                                        rect.colour = dimStyle;
                                    };
                            
                                return object;
                            };
                            this.audio_meter_level = function(
                                name='audio_meter_level',
                                x, y, angle=0,
                                width=20, height=60,
                                markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],
                            
                                backingStyle={r:0.04,g:0.04,b:0.04,a:1},
                                levelStyles=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.39,g:0.39,b:0.39,a:1}],
                                markingStyle_fill={r:0.86,g:0.86,b:0.86,a:1},
                                markingStyle_font='1pt Courier New',
                            ){
                                //elements
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //meter
                                        var meter = interfacePart.builder('meter_level','meter',{
                                            width:width, height:height, markings:markings,
                                            style:{
                                                backing:backingStyle,
                                                levels:levelStyles,
                                                markingStyle_fill:markingStyle_fill,
                                                markingStyle_font:markingStyle_font,
                                            },
                                        });
                                        object.append(meter);
                            
                                //circuitry
                                    var converter = interface.circuit.audio2percentage()
                                    converter.newValue = function(val){meter.set( val );};
                            
                                //audio connections
                                    object.audioIn = function(){ return converter.audioIn(); }
                            
                                //methods
                                    object.start = function(){ converter.start(); };
                                    object.stop = function(){ converter.stop(); };
                            
                                return object;
                            };
                            this.grapher_static = function(
                                name='grapher_static',
                                x, y, width=120, height=60, angle=0, resolution=5,
                            
                                foregroundStyles=[
                                    {colour:'rgba(0,255,0,1)', thickness:0.5},
                                    {colour:'rgba(255,255,0,1)', thickness:0.5},
                                    {colour:'rgba(0,255,255,1)', thickness:0.5,},
                                ],
                                foregroundTextStyles=[
                                    {colour:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
                                    {colour:'rgba(255,255,100,1)', size:0.75, font:'Helvetica'},
                                    {colour:'rgba(100,255,255,1)', size:0.75, font:'Helvetica'},
                                ],
                            
                                backgroundStyle_colour='rgba(0,100,0,1)',
                                backgroundStyle_thickness=0.25,
                                backgroundTextStyle_colour='rgba(0,150,0,1)',
                                backgroundTextStyle_size='7.5pt',
                                backgroundTextStyle_font='Helvetica',
                            
                                backingStyle='rgba(50,50,50,1)',
                            ){
                                var viewbox = {'bottom':-1,'top':1,'left':-1,'right':1};
                                var horizontalMarkings = { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
                                var verticalMarkings =   { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
                                var foregroundElementsGroup = [];
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //canvas
                                        var canvas = interfacePart.builder('canvas','backing',{ width:width, height:height, resolution:resolution });
                                        object.append(canvas);
                            
                                //graphics
                                    function clear(){
                                        canvas._.fillStyle = backingStyle;
                                        canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
                                    };
                                    function drawBackground(){
                                        //horizontal lines
                                            //calculate the x value for all parts of this section
                                                var x = _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, horizontalMarkings.mappedPosition );
                            
                                            //add all horizontal markings
                                                for(var a = 0; a < horizontalMarkings.points.length; a++){
                                                    //check if we should draw this line at all
                                                        if( !(horizontalMarkings.points[a] < viewbox.top || horizontalMarkings.points[a] > viewbox.bottom) ){ continue; }
                                    
                                                    //calculate the y value for this section
                                                        var y = height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);
                            
                                                    //add line and text to group
                                                        //lines
                                                            canvas._.fillStyle = backgroundStyle_colour;
                                                            canvas._.fillRect(0,canvas.$(y),canvas.$(width),canvas.$(backgroundStyle_thickness));
                            
                                                        //text
                                                            if( horizontalMarkings.printText ){
                                                                canvas._.fillStyle = backgroundTextStyle_colour;
                                                                canvas._.font = backgroundTextStyle_size+' '+backgroundTextStyle_font;
                                                                canvas._.fillText(
                                                                    (horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                                                    canvas.$(x+horizontalMarkings.textPositionOffset.x),
                                                                    canvas.$(y+horizontalMarkings.textPositionOffset.y),
                                                                );
                                                            }
                                                }
                            
                                        //vertical lines
                                            //calculate the y value for all parts of this section
                                                var y = height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, verticalMarkings.mappedPosition );
                            
                                            //add all vertical markings
                                                for(var a = 0; a < verticalMarkings.points.length; a++){
                                                    //check if we should draw this line at all
                                                        if( verticalMarkings.points[a] < viewbox.left || verticalMarkings.points[a] > viewbox.right ){ continue; }
                            
                                                    //calculate the x value for this section
                                                        var x = _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);
                            
                                                    //add line and text to group
                                                        //lines
                                                            canvas._.fillStyle = backgroundStyle_colour;
                                                            canvas._.fillRect(canvas.$(x),0,canvas.$(backgroundStyle_thickness),canvas.$(height));
                                                    
                                                        //text
                                                            if( verticalMarkings.printText ){
                                                                canvas._.fillStyle = backgroundTextStyle_colour;
                                                                canvas._.font = backgroundTextStyle_size+' '+backgroundTextStyle_font;
                                                                canvas._.fillText(
                                                                    (verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                                                    canvas.$(x+verticalMarkings.textPositionOffset.x),
                                                                    canvas.$(y+verticalMarkings.textPositionOffset.y),
                                                                );
                                                            }
                                                }
                            
                                        canvas.requestUpdate();
                                    }
                                    function drawForeground(y,x,layer=0){
                            
                                        //if both data sets of a layer are being set to undefined; set the whole layer to undefined
                                        //otherwise, just update the layer's data sets
                                            if(y == undefined && x == undefined){ foregroundElementsGroup[layer] = undefined; }
                                            else{ foregroundElementsGroup[layer] = {x:x, y:y}; }
                            
                                        //input check
                                            if( foregroundElementsGroup[layer] != undefined && foregroundElementsGroup[layer].y == undefined ){
                                                console.warn('grapher_static error',name,'attempting to add line with no y component');
                                                console.warn('x:',foregroundElementsGroup[layer].x);
                                                console.warn('y:',foregroundElementsGroup[layer].y);
                                                return;
                                            }
                            
                                        //draw layers
                                            for(var L = 0; L < foregroundElementsGroup.length; L++){
                                                if(foregroundElementsGroup[L] == undefined){continue;}
                            
                                                var layer = foregroundElementsGroup[L];
                            
                                                //draw path
                                                    canvas._.strokeStyle = foregroundStyles[L].colour;
                                                    canvas._.lineWidth = canvas.$(foregroundStyles[L].thickness);
                                                    canvas._.lineJoin = foregroundStyles[L].lineJoin;
                                                    canvas._.lineCap = foregroundStyles[L].lineJoin;
                                                    canvas._.beginPath();
                            
                                                    if( layer.y != undefined && layer.x == undefined ){ //auto x print
                                                        canvas._.moveTo( 0, canvas.$( height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[0], true) ) );
                                                        for(var a = 1; a < layer.y.length; a++){ 
                                                            canvas._.lineTo(
                                                                canvas.$(a*(width/(layer.y.length-1))),
                                                                canvas.$(height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true)),
                                                            );
                                                        }
                                                    }else if( layer.y.length == layer.x.length ){ //straight print
                                                        for(var a = 0; a < layer.y.length; a++){ 
                                                            canvas._.moveTo( 
                                                                canvas.$(          _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[0], true) ),
                                                                canvas.$( height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[0], true) )
                                                            );
                                                            for(var a = 1; a < layer.y.length; a++){ 
                                                                canvas._.lineTo(
                                                                    canvas.$(          _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[a], true) ),
                                                                    canvas.$( height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true) ),
                                                                );
                                                            }
                                                        }
                                                    }else{console.error('grapher_static::'+name,':layers are of different length:',layer.y,layer.x);}
                            
                                                    canvas._.stroke();
                                            }
                                                
                                        canvas.requestUpdate();
                                    }
                            
                                //controls
                                    object.resolution = function(a){return canvas.resolution(a);};
                                    object.viewbox = function(a){
                                        if(a==null){return viewbox;}
                                        if( a.bottom != undefined ){viewbox.bottom = a.bottom;}
                                        if( a.top != undefined ){viewbox.top = a.top;}
                                        if( a.left != undefined ){viewbox.left = a.left;}
                                        if( a.right != undefined ){viewbox.right = a.right;}
                                    };
                                    object.horizontalMarkings = function(a){
                                        if(a==null){return horizontalMarkings;}
                                        if( a.points != undefined ){horizontalMarkings.points = a.points;}
                                        if( a.printingValues != undefined ){horizontalMarkings.printingValues = a.printingValues;}
                                        if( a.textPositionOffset != undefined ){horizontalMarkings.textPositionOffset = a.textPositionOffset;}
                                        if( a.printText != undefined ){horizontalMarkings.printText = a.printText;}
                                    };
                                    object.verticalMarkings = function(a){
                                        if(a==null){return verticalMarkings;}
                                        if( a.points != undefined ){verticalMarkings.points = a.points;}
                                        if( a.printingValues != undefined ){verticalMarkings.printingValues = a.printingValues;}
                                        if( a.textPositionOffset != undefined ){verticalMarkings.textPositionOffset = a.textPositionOffset;}
                                        if( a.printText != undefined ){verticalMarkings.printText = a.printText;}
                                    };
                                    object.drawBackground = function(){ clear(); drawBackground(); };
                                    object.drawForeground = function(y,x,layer=0){ drawForeground(y,x,layer); };
                                    object.draw = function(y,x,layer=0){ clear(); drawBackground(); drawForeground(y,x,layer); };
                            
                                return object;
                            };
                            this.grapher_periodicWave_static = function(
                                name='grapher_periodicWave_static',
                                x, y, width=120, height=60, angle=0,
                            
                                foregroundStyle={colour:'rgba(0,255,0,1)', thickness:0.5},
                                foregroundTextStyle={fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
                            
                                backgroundStyle_colour='rgba(0,100,0,1)',
                                backgroundStyle_thickness=0.25,
                                backgroundTextStyle_fill='rgba(0,150,0,1)',
                                backgroundTextStyle_size=0.1,
                                backgroundTextStyle_font='Helvetica',
                            
                                backingStyle='rgba(50,50,50,1)',
                            ){
                                var wave = {'sin':[],'cos':[]};
                                var resolution = 100;
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //grapher
                                        var grapher = interfacePart.builder('grapher_static',name,{
                                            x:0, y:0, width:width, height:height,
                                            foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                                            backgroundStyle_colour:backgroundStyle_colour, 
                                            backgroundStyle_thickness:backgroundStyle_thickness,
                                            backgroundTextStyle_fill:backgroundTextStyle_fill, 
                                            backgroundTextStyle_size:backgroundTextStyle_size,
                                            backgroundTextStyle_font:backgroundTextStyle_font,
                                            backingStyle:backingStyle,
                                        });
                                        object.append(grapher);
                            
                                //controls
                                    object.wave = function(a=null,type=null){
                                        if(a==null){
                                            while(wave.sin.length < wave.cos.length){ wave.sin.push(0); }
                                            while(wave.sin.length > wave.cos.length){ wave.cos.push(0); }
                                            for(var a = 0; a < wave['sin'].length; a++){
                                                if( !wave['sin'][a] ){ wave['sin'][a] = 0; }
                                                if( !wave['cos'][a] ){ wave['cos'][a] = 0; }
                                            }
                                            return wave;
                                        }
                            
                                        if(type==null){
                                            wave = a;
                                        }
                                        switch(type){
                                            case 'sin': wave.sin = a; break;
                                            case 'cos': wave.cos = a; break;
                                            default: break;
                                        }
                                    };
                                    object.waveElement = function(type, mux, a){
                                        if(a==null){return wave[type][mux];}
                                        wave[type][mux] = a;
                                    };
                                    object.resolution = function(a=null){
                                        if(a==null){return resolution;}
                                        resolution = a;
                                    };
                                    object.updateBackground = function(){
                                        grapher.viewbox( {bottom:-1.1,top:1.1, left:0} );
                                        grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:true});
                                        grapher.verticalMarkings({points:[0,1/4,1/2,3/4],printText:true});
                                        grapher.drawBackground();
                                    };
                                    object.draw = function(){
                                        var data = [];
                                        var temp = 0;
                                        for(var a = 0; a <= resolution; a++){
                                            temp = 0;
                                            for(var b = 0; b < wave['sin'].length; b++){
                                                if(!wave['sin'][b]){wave['sin'][b]=0;} // cover missing elements
                                                temp += Math.sin(b*(2*Math.PI*(a/resolution)))*wave['sin'][b]; 
                                            }
                                            for(var b = 0; b < wave['cos'].length; b++){
                                                if(!wave['cos'][b]){wave['cos'][b]=0;} // cover missing elements
                                                temp += Math.cos(b*(2*Math.PI*(a/resolution)) )*wave['cos'][b]; 
                                            }
                                            data.push(temp);
                                        }
                                
                                        grapher.draw( data );
                                    };
                                    object.reset = function(){
                                        this.wave({'sin':[],'cos':[]});
                                        this.resolution(100);
                                        this.updateBackground();
                                    };
                                    
                                return object;
                            };
                            this.grapher = function(
                                name='grapher',
                                x, y, width=120, height=60, angle=0,
                            
                                foregroundStyles=[
                                    {colour:{r:0,g:1,b:0,a:1}, thickness:0.25},
                                    {colour:{r:1,g:1,b:0,a:1}, thickness:0.25},
                                    {colour:{r:0,g:1,b:1,a:1}, thickness:0.25},
                                ],
                                foregroundTextStyles=[
                                    {colour:{r:0.39,g:1,b:0.39,a:1}, size:0.75, font:'Helvetica'},
                                    {colour:{r:1,g:1,b:0.39,a:1}, size:0.75, font:'Helvetica'},
                                    {colour:{r:0.39,g:1,b:1,a:1}, size:0.75, font:'Helvetica'},
                                ],
                            
                                backgroundStyle_colour={r:0,g:0.39,b:0,a:1},
                                backgroundStyle_thickness=0.25,
                                backgroundTextStyle_colour={r:0,g:0.59,b:0,a:1},
                                backgroundTextStyle_size=0.75,
                                backgroundTextStyle_font='Helvetica',
                            
                                backingStyle={r:0.2,g:0.2,b:0.2,a:1},
                            ){
                                var viewbox = {'bottom':-1,'top':1,'left':-1,'right':1};
                                var horizontalMarkings = { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
                                var verticalMarkings =   { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
                                var foregroundElementsGroup = [];
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing
                                        var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, colour:backingStyle });
                                        object.append(rect);
                                    //background group
                                        var backgroundGroup = interfacePart.builder( 'group', 'background' );
                                        object.append(backgroundGroup);
                                    //foreground group
                                        var foregroundGroup = interfacePart.builder( 'group', 'foreground' );
                                        object.append(foregroundGroup);
                                    //stencil
                                        var stencil = interfacePart.builder('rectangle','stencil',{width:width, height:height});
                                        object.stencil(stencil);
                                        object.clipActive(true);
                            
                                //graphics
                                    function drawBackground(){
                                        backgroundGroup.clear();
                            
                                        //horizontal lines
                                            //calculate the x value for all parts of this section
                                                var x = _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, horizontalMarkings.mappedPosition );
                            
                                            //add all horizontal markings
                                                for(var a = 0; a < horizontalMarkings.points.length; a++){
                                                    //check if we should draw this line at all
                                                        if( !(horizontalMarkings.points[a] < viewbox.top || horizontalMarkings.points[a] > viewbox.bottom) ){ continue; }
                                    
                                                    //calculate the y value for this section
                                                        var y = height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);
                            
                                                    //add line and text to group
                                                        //lines
                                                            var path = interfacePart.builder( 'rectangle', 'horizontal_line_'+a, {x:0,y:y,width:width,height:backgroundStyle_thickness,colour:backgroundStyle_colour} );
                                                            backgroundGroup.append(path);
                                                        // //text
                                                        //     if( horizontalMarkings.printText ){
                                                        //         var text = interfacePart.builder( 'text', 'horizontal_text_'+a, {
                                                        //             x:x+horizontalMarkings.textPositionOffset.x, y:y+horizontalMarkings.textPositionOffset.y,
                                                        //             text:(horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                                        //             style:{
                                                        //                 fill:backgroundTextStyle_fill,
                                                        //                 font:backgroundTextStyle_font
                                                        //             }
                                                        //         } );
                                                        //         backgroundGroup.append(text);
                                                        //     }
                                                }
                            
                                        //vertical lines
                                            //calculate the y value for all parts of this section
                                                var y = height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, verticalMarkings.mappedPosition );
                            
                                            //add all vertical markings
                                                for(var a = 0; a < verticalMarkings.points.length; a++){
                                                    //check if we should draw this line at all
                                                        if( verticalMarkings.points[a] < viewbox.left || verticalMarkings.points[a] > viewbox.right ){ continue; }
                            
                                                    //calculate the x value for this section
                                                        var x = _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);
                            
                                                    //add line and text to group
                                                        //lines
                                                            var path = interfacePart.builder( 'rectangle', 'vertical_line_'+a, {x:x,y:0,width:backgroundStyle_thickness,height:height,colour:backgroundStyle_colour} );
                                                            backgroundGroup.append(path);
                                                    
                                                        // //text
                                                        //     if( verticalMarkings.printText ){
                                                        //         var text = interfacePart.builder( 'text', 'vertical_text_'+a, {
                                                        //             x:x+verticalMarkings.textPositionOffset.x, y:y+verticalMarkings.textPositionOffset.y,
                                                        //             text:(verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                                        //             style:{
                                                        //                 fill:backgroundTextStyle_fill,
                                                        //                 font:backgroundTextStyle_font
                                                        //             }
                                                        //         } );
                                                        //         backgroundGroup.append(text);
                                                        //     }
                                                }
                                    }
                                    function drawForeground(y,x,layer=0){
                                        foregroundGroup.clear();
                            
                                        //if both data sets of a layer are being set to undefined; set the whole layer to undefined
                                        //otherwise, just update the layer's data sets
                                            if(y == undefined && x == undefined){ foregroundElementsGroup[layer] = undefined; }
                                            else{ foregroundElementsGroup[layer] = {x:x, y:y}; }
                            
                                        //input check
                                            if( foregroundElementsGroup[layer] != undefined && foregroundElementsGroup[layer].y == undefined ){
                                                console.warn('grapher error',name,'attempting to add line with no y component');
                                                console.warn('x:',foregroundElementsGroup[layer].x);
                                                console.warn('y:',foregroundElementsGroup[layer].y);
                                                return;
                                            }
                            
                                        //draw layers
                                            for(var L = 0; L < foregroundElementsGroup.length; L++){
                                                if(foregroundElementsGroup[L] == undefined){continue;}
                            
                                                var layer = foregroundElementsGroup[L];
                                                var points = [];
                            
                                                //generate path points
                                                    if( layer.y != undefined && layer.x == undefined ){ //auto x print
                                                        for(var a = 0; a < layer.y.length; a++){ 
                                                            points.push( {
                                                                x: a*(width/(layer.y.length-1)), 
                                                                y: height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true),
                                                            } );
                                                        }
                                                    }else if( layer.y.length == layer.x.length ){ //straight print
                                                        for(var a = 0; a < layer.y.length; a++){ 
                                                            points.push( {
                                                                x:          _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[a], true), 
                                                                y: height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true),
                                                            } );
                                                        }
                                                    }else{console.error('grapher::'+name,':layers are of different length:',layer.y,layer.x);}
                            
                                                //create path shape and add it to the group
                                                    foregroundGroup.append(
                                                        interfacePart.builder( 'path', 'layer_'+L, { 
                                                            pointsAsXYArray:points, 
                                                            colour:foregroundStyles[L].colour,
                                                            thickness:foregroundStyles[L].thickness,
                                                        })
                                                    );
                                            }
                                    }
                            
                                //controls
                                    object.viewbox = function(a){
                                        if(a==null){return viewbox;}
                                        if( a.bottom != undefined ){viewbox.bottom = a.bottom;}
                                        if( a.top != undefined ){viewbox.top = a.top;}
                                        if( a.left != undefined ){viewbox.left = a.left;}
                                        if( a.right != undefined ){viewbox.right = a.right;}
                                    };
                                    object.horizontalMarkings = function(a){
                                        if(a==null){return horizontalMarkings;}
                                        if( a.points != undefined ){horizontalMarkings.points = a.points;}
                                        if( a.printingValues != undefined ){horizontalMarkings.printingValues = a.printingValues;}
                                        if( a.textPositionOffset != undefined ){horizontalMarkings.textPositionOffset = a.textPositionOffset;}
                                        if( a.printText != undefined ){horizontalMarkings.printText = a.printText;}
                                    };
                                    object.verticalMarkings = function(a){
                                        if(a==null){return verticalMarkings;}
                                        if( a.points != undefined ){verticalMarkings.points = a.points;}
                                        if( a.printingValues != undefined ){verticalMarkings.printingValues = a.printingValues;}
                                        if( a.textPositionOffset != undefined ){verticalMarkings.textPositionOffset = a.textPositionOffset;}
                                        if( a.printText != undefined ){verticalMarkings.printText = a.printText;}
                                    };
                                    object.drawBackground = function(){ drawBackground(); };
                                    object.drawForeground = function(y,x,layer=0){ drawForeground(y,x,layer); };
                                    object.draw = function(y,x,layer=0){ drawBackground(); drawForeground(y,x,layer); };
                            
                                return object;
                            };
                            this.meter_level = function(
                                name='meter_level',
                                x, y, angle=0,
                                width=20, height=60,
                                markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],
                            
                                backingStyle={r:0.04,g:0.04,b:0.04,a:1},
                                levelStyles=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.39,g:0.39,b:0.39,a:1}],
                                markingStyle_fill={r:0.86,g:0.86,b:0.86,a:1},
                                markingStyle_font='1pt Courier New',
                            ){
                            
                                //elements
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //level
                                        var level = interfacePart.builder('level','level',{
                                            width:width, height:height,
                                            style:{
                                                backing:backingStyle,
                                                levels:levelStyles,
                                            },
                                        });
                                        object.append(level);
                            
                                    //markings
                                        var marks = interfacePart.builder('group','markings');
                                            object.append(marks);
                            
                                        function makeMark(y){
                                            var markThickness = 0.2;
                                            var path = [{x:width,y:y-markThickness/2},{x:width-width/4, y:y-markThickness/2},{x:width-width/4, y:y+markThickness/2},{x:width,y:y+markThickness/2}];  
                                            return interfacePart.builder('polygon', 'mark_'+y, {pointsAsXYArray:path, colour:markingStyle_fill});
                                        }
                                        // function insertText(y,text){
                                        //     // return interfacePart.builder('text', 'text_'+text, {x:0.5, y:y+0.3, text:text, style:{fill:markingStyle_fill,font:markingStyle_font}});
                                        // }
                            
                                        for(var a = 0; a < markings.length; a++){
                                            marks.append( makeMark(height*(1-markings[a])) );
                                            // marks.append( insertText(height*(1-markings[a]),markings[a]) );
                                        }
                            
                            
                            
                            
                                //update intervals
                                    var framesPerSecond = 15;
                                    var coolDownSpeed = ( 3/4 )/10;
                            
                                    var coolDownSub = coolDownSpeed/framesPerSecond;
                            
                                    var coolDown = 0;
                                    var mostRecentSetting = 0;
                                    setInterval(function(){        
                                        level.layer(mostRecentSetting,0);
                            
                                        if(coolDown>0){coolDown-=coolDownSub;}
                                        level.layer(coolDown,1);
                            
                                        if(mostRecentSetting > coolDown){coolDown = mostRecentSetting;}
                                    },1000/framesPerSecond);
                            
                            
                            
                            
                                //method
                                    object.set = function(a){
                                        mostRecentSetting = a;
                                    };
                            
                                return object;
                            };
                            this.sevenSegmentDisplay_static = function(
                                name='sevenSegmentDisplay_static',
                                x, y, width=20, height=30, angle=0, resolution=5, 
                                backgroundStyle='rgba(0,0,0)',
                                glowStyle='rgb(200,200,200)',
                                dimStyle='rgb(20,20,20)',
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
                                var stamp = [0,0,0,0,0,0,0];
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //canvas
                                        var canvas = interfacePart.builder('canvas','subcanvas',{ width:width, height:height, resolution:resolution });
                                        object.append(canvas);
                            
                                //graphics
                                    function clear(){
                                        canvas._.fillStyle = backgroundStyle;
                                        canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
                                        canvas.requestUpdate();
                                    };
                                    function drawChar(){
                                        //draw segments in 
                                            for(var a = 0; a < points.length; a++){
                                                canvas._.beginPath(); 
                                                canvas._.moveTo(canvas.$(points[a][0].x),canvas.$(points[a][0].y));
                                                for(var b = 1; b < points[a].length; b++){
                                                    canvas._.lineTo(canvas.$(points[a][b].x),canvas.$(points[a][b].y));
                                                }
                                                canvas._.closePath(); 
                                                canvas._.fillStyle = stamp[a] == 0 ? dimStyle : glowStyle;
                                                canvas._.fill(); 
                                            }
                                            canvas.requestUpdate();
                                    }
                            
                                //methods
                                    object.set = function(segment,state){
                                        stamp[segment].state = state;
                                        drawChar();
                                    };
                                    object.get = function(segment){ return stamp[segment].state; };
                                    object.clear = function(){
                                        for(var a = 0; a < stamp.length; a++){
                                            this.set(a,false);
                                        }
                                    };
                            
                                    object.enterCharacter = function(char){
                                        //generate stamp
                                            switch(char){
                                                case 0: case '0': stamp = [1,1,1,0,1,1,1]; break;
                                                case 1: case '1': stamp = [0,0,1,0,0,1,0]; break;
                                                case 2: case '2': stamp = [1,0,1,1,1,0,1]; break;
                                                case 3: case '3': stamp = [1,0,1,1,0,1,1]; break;
                                                case 4: case '4': stamp = [0,1,1,1,0,1,0]; break;
                                                case 5: case '5': stamp = [1,1,0,1,0,1,1]; break;
                                                case 6: case '6': stamp = [1,1,0,1,1,1,1]; break;
                                                case 7: case '7': stamp = [1,0,1,0,0,1,0]; break;
                                                case 8: case '8': stamp = [1,1,1,1,1,1,1]; break;
                                                case 9: case '9': stamp = [1,1,1,1,0,1,1]; break;
                                                default: stamp = [0,0,0,0,0,0,0]; break;
                                            }
                            
                                        clear();
                                        drawChar();
                                    };
                            
                                //setup
                                    clear();
                                    drawChar();
                            
                                return object;
                            };
                            this.grapher_periodicWave = function(
                                name='grapher_periodicWave',
                                x, y, width=120, height=60, angle=0,
                            
                                foregroundStyle={colour:{r:0,g:1,b:0,a:1}, thickness:0.5},
                                foregroundTextStyle={fill:{r:0.39,g:1,b:0.39,a:1}, size:0.75, font:'Helvetica'},
                            
                                backgroundStyle_colour={r:0,g:0.39,b:0,a:1},
                                backgroundStyle_thickness=0.25,
                                backgroundTextStyle_fill={r:0,g:0.59,b:0,a:1},
                                backgroundTextStyle_size=0.1,
                                backgroundTextStyle_font='Helvetica',
                            
                                backingStyle={r:0.2,g:0.2,b:0.2,a:1},
                            ){
                                var wave = {'sin':[],'cos':[]};
                                var resolution = 100;
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //grapher
                                        var grapher = interfacePart.builder('grapher',name,{
                                            x:0, y:0, width:width, height:height,
                                            foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                                            backgroundStyle_colour:backgroundStyle_colour, 
                                            backgroundStyle_thickness:backgroundStyle_thickness,
                                            backgroundTextStyle_fill:backgroundTextStyle_fill, 
                                            backgroundTextStyle_size:backgroundTextStyle_size,
                                            backgroundTextStyle_font:backgroundTextStyle_font,
                                            backingStyle:backingStyle,
                                        });
                                        object.append(grapher);
                            
                                //controls
                                    object.wave = function(a=null,type=null){
                                        if(a==null){
                                            while(wave.sin.length < wave.cos.length){ wave.sin.push(0); }
                                            while(wave.sin.length > wave.cos.length){ wave.cos.push(0); }
                                            for(var a = 0; a < wave['sin'].length; a++){
                                                if( !wave['sin'][a] ){ wave['sin'][a] = 0; }
                                                if( !wave['cos'][a] ){ wave['cos'][a] = 0; }
                                            }
                                            return wave;
                                        }
                            
                                        if(type==null){
                                            wave = a;
                                        }
                                        switch(type){
                                            case 'sin': wave.sin = a; break;
                                            case 'cos': wave.cos = a; break;
                                            default: break;
                                        }
                                    };
                                    object.waveElement = function(type, mux, a){
                                        if(a==null){return wave[type][mux];}
                                        wave[type][mux] = a;
                                    };
                                    object.resolution = function(a=null){
                                        if(a==null){return resolution;}
                                        resolution = a;
                                    };
                                    object.updateBackground = function(){
                                        grapher.viewbox( {bottom:-1.1,top:1.1, left:0} );
                                        grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:true});
                                        grapher.verticalMarkings({points:[0,1/4,1/2,3/4],printText:true});
                                        grapher.drawBackground();
                                    };
                                    object.draw = function(){
                                        var data = [];
                                        var temp = 0;
                                        for(var a = 0; a <= resolution; a++){
                                            temp = 0;
                                            for(var b = 0; b < wave['sin'].length; b++){
                                                if(!wave['sin'][b]){wave['sin'][b]=0;} // cover missing elements
                                                temp += Math.sin(b*(2*Math.PI*(a/resolution)))*wave['sin'][b]; 
                                            }
                                            for(var b = 0; b < wave['cos'].length; b++){
                                                if(!wave['cos'][b]){wave['cos'][b]=0;} // cover missing elements
                                                temp += Math.cos(b*(2*Math.PI*(a/resolution)) )*wave['cos'][b]; 
                                            }
                                            data.push(temp);
                                        }
                                
                                        grapher.draw( data );
                                    };
                                    object.reset = function(){
                                        this.wave({'sin':[],'cos':[]});
                                        this.resolution(100);
                                        this.updateBackground();
                                    };
                                    
                                return object;
                            };
                            this.sixteenSegmentDisplay_static = function(
                                name='sixteenSegmentDisplay_static',
                                x, y, width=20, height=30, angle=0, resolution=5, 
                                backgroundStyle='rgb(0,0,0)',
                                glowStyle='rgb(200,200,200)',
                                dimStyle='rgb(20,20,20)',
                            ){
                                var margin = width/8;
                                var division = width/8;
                                var shapes = {
                                    segments:{
                                        points: {
                                            top:{
                                                left:[
                                                    {x:division*0.5+margin,         y:division*0.5+margin},  //centre
                                                    {x:division*1.0+margin,         y:division*0.0+margin},  //top
                                                    {x:division*0.0+margin,         y:division*1.0+margin},  //left
                                                    {x:division*1.0+margin,         y:division*1.0+margin},  //inner point
                                                    {x:division*1.75+margin,        y:division*1.0+margin},  //inner point right
                                                    {x:division*1.0+margin,         y:division*1.75+margin}, //inner point down
                                                ],
                                                centre:[
                                                    {x:width/2,                     y:division*0.5+margin}, //central point
                                                    {x:width/2-division*0.5,        y:division*1.0+margin}, //lower left
                                                    {x:width/2+division*0.5,        y:division*1.0+margin}, //lower right
                                                    {x:width/2-division*0.5,        y:division*0.0+margin}, //upper left
                                                    {x:width/2+division*0.5,        y:division*0.0+margin}, //upper right
                                                ],
                                                right:[
                                                    {x:width-division*0.5-margin,   y:division*0.5+margin},  //centre
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
                                                    {x:division*0.5+margin,         y:height*0.5-division*0.0}, //centre
                                                    {x:division*0.0+margin,         y:height*0.5+division*0.5}, //bottom left
                                                    {x:division*1.0+margin,         y:height*0.5+division*0.5}, //bottom right
                                                ],
                                                centre:[
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
                                                    {x:width-division*0.5-margin,   y:height*0.5-division*0.0}, //centre
                                                    {x:width-division*1.0-margin,   y:height*0.5+division*0.5}, //bottom left
                                                    {x:width-division*0.0-margin,   y:height*0.5+division*0.5}  //bottom right
                                                ]
                                            },
                                            bottom: {
                                                left:[
                                                    {x:division*0.5+margin,         y:height-division*0.5-margin}, //centre
                                                    {x:division*0.0+margin,         y:height-division*1.0-margin}, //left
                                                    {x:division*1.0+margin,         y:height-division*0.0-margin}, //bottom
                                                    {x:division*1.0+margin,         y:height-division*1.0-margin}, //inner point
                                                    {x:division*1.0+margin,         y:height-division*1.75-margin},//inner point up
                                                    {x:division*1.75+margin,        y:height-division*1.0-margin}, //inner point right
                                                ],
                                                centre:[
                                                    {x:width/2-division*0.5,        y:height-division*1.0-margin}, //upper left
                                                    {x:width/2+division*0.5,        y:height-division*1.0-margin}, //upper right
                                                    {x:width/2,                     y:height-division*0.5-margin}, //central point
                                                    {x:width/2-division*0.5,        y:height-division*0.0-margin}, //lower left
                                                    {x:width/2+division*0.5,        y:height-division*0.0-margin}, //lower right
                                                ],
                                                right:[
                                                    {x:width-division*0.5-margin,   y:height-division*0.5-margin}, //centre
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
                                var points = [
                                    [
                                        shapes.segments.points.top.left[1],
                                        shapes.segments.points.top.left[0],
                                        shapes.segments.points.top.left[3],
                                        shapes.segments.points.top.centre[1],
                                        shapes.segments.points.top.centre[0],
                                        shapes.segments.points.top.centre[3],
                                    ],
                                    [
                                        shapes.segments.points.top.centre[4],
                                        shapes.segments.points.top.centre[0],
                                        shapes.segments.points.top.centre[2],
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
                                        shapes.segments.points.middle.centre[9],
                                        shapes.segments.points.middle.centre[7],
                                        shapes.segments.points.middle.centre[8],
                                    ],
                                    [
                                        shapes.segments.points.top.centre[0],
                                        shapes.segments.points.top.centre[1],
                                        shapes.segments.points.middle.centre[7],
                                        shapes.segments.points.middle.centre[0],
                                        shapes.segments.points.middle.centre[10],
                                        shapes.segments.points.top.centre[2],
                                    ],
                                    [
                                        shapes.segments.points.top.right[4],
                                        shapes.segments.points.top.right[3],
                                        shapes.segments.points.top.right[5],
                                        shapes.segments.points.middle.centre[11],
                                        shapes.segments.points.middle.centre[10],
                                        shapes.segments.points.middle.centre[12],
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
                                        shapes.segments.points.middle.centre[7],
                                        shapes.segments.points.middle.centre[0],
                                        shapes.segments.points.middle.centre[1],
                                    ],
                                    [
                                        shapes.segments.points.middle.right[3],
                                        shapes.segments.points.middle.right[2],
                                        shapes.segments.points.middle.right[0],
                                        shapes.segments.points.middle.centre[10],
                                        shapes.segments.points.middle.centre[0],
                                        shapes.segments.points.middle.centre[4],
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
                                        shapes.segments.points.middle.centre[2],
                                        shapes.segments.points.middle.centre[1],
                                        shapes.segments.points.middle.centre[3],
                                    ],
                                    [
                                        shapes.segments.points.bottom.centre[0],
                                        shapes.segments.points.bottom.centre[2],
                                        shapes.segments.points.bottom.centre[1],
                                        shapes.segments.points.middle.centre[4],
                                        shapes.segments.points.middle.centre[0],
                                        shapes.segments.points.middle.centre[1],
                                    ],
                                    [
                                        shapes.segments.points.bottom.right[4],
                                        shapes.segments.points.bottom.right[3],
                                        shapes.segments.points.bottom.right[5],
                                        shapes.segments.points.middle.centre[5],
                                        shapes.segments.points.middle.centre[4],
                                        shapes.segments.points.middle.centre[6],
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
                                        shapes.segments.points.bottom.centre[0],
                                        shapes.segments.points.bottom.centre[2],
                                        shapes.segments.points.bottom.centre[3],
                                    ],
                                    [
                                        shapes.segments.points.bottom.right[2],
                                        shapes.segments.points.bottom.right[0],
                                        shapes.segments.points.bottom.right[3],
                                        shapes.segments.points.bottom.centre[1],
                                        shapes.segments.points.bottom.centre[2],
                                        shapes.segments.points.bottom.centre[4],
                                    ],
                                ];
                                stamp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //canvas
                                        var canvas = interfacePart.builder('canvas','subcanvas',{ width:width, height:height, resolution:resolution });
                                        object.append(canvas);
                            
                                //graphics
                                function clear(){
                                    canvas._.fillStyle = backgroundStyle;
                                    canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
                                    canvas.requestUpdate();
                                };
                                function drawChar(){
                                    for(var a = 0; a < points.length; a++){
                                        canvas._.beginPath(); 
                                        canvas._.moveTo(canvas.$(points[a][0].x),canvas.$(points[a][0].y));
                                        for(var b = 1; b < points[a].length; b++){
                                            canvas._.lineTo(canvas.$(points[a][b].x),canvas.$(points[a][b].y));
                                        }
                                        canvas._.closePath(); 
                                        canvas._.fillStyle = stamp[a] == 0 ? dimStyle : glowStyle;
                                        canvas._.fill(); 
                                    }
                                    canvas.requestUpdate();
                                }
                            
                            
                                //methods
                                    object.set = function(segment,state){
                                        stamp[segment].state = state;
                                        drawChar();
                                    };
                                    object.get = function(segment){ return segments[segment].state; };
                                    object.clear = function(){
                                        for(var a = 0; a < segments.length; a++){
                                            this.set(a,false);
                                        }
                                    };
                            
                                    object.enterCharacter = function(char){
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
                            
                                            case '0': case 0: 
                                                stamp = [
                                                    1,1,
                                                    1,0,0,1,1,
                                                    0,0,
                                                    1,1,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '1': case 1: 
                                                stamp = [
                                                    1,0,
                                                    0,0,1,0,0,
                                                    0,0,
                                                    0,0,1,0,0,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '2': case 2: 
                                                stamp = [
                                                    1,1,
                                                    0,0,0,0,1,
                                                    0,1,
                                                    0,1,0,0,0,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '3': case 3:
                                                stamp = [
                                                    1,1,
                                                    0,0,0,0,1,
                                                    1,1,
                                                    0,0,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '4': case 4:
                                                stamp = [
                                                    0,0,
                                                    1,0,0,0,1,
                                                    1,1,
                                                    0,0,0,0,1,
                                                    0,0,
                                                ]; 
                                            break;
                                            case '5': case 5:
                                                stamp = [
                                                    1,1,
                                                    1,0,0,0,0,
                                                    1,1,
                                                    0,0,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '6': case 6:
                                                stamp = [
                                                    1,1,
                                                    1,0,0,0,0,
                                                    1,1,
                                                    1,0,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '7': case 7:
                                                stamp = [
                                                    1,1,
                                                    0,0,0,1,0,
                                                    0,0,
                                                    0,1,0,0,0,
                                                    0,0,
                                                ]; 
                                            break;
                                            case '8': case 8:
                                                stamp = [
                                                    1,1,
                                                    1,0,0,0,1,
                                                    1,1,
                                                    1,0,0,0,1,
                                                    1,1,
                                                ]; 
                                            break;
                                            case '9': case 9:
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
                            
                                        clear();
                                        drawChar();
                                    };
                            
                            
                                //setup
                                    clear();
                                    drawChar();
                            
                                return object;      
                            };
                            this.readout_sixteenSegmentDisplay_static = function(
                                name='readout_sixteenSegmentDisplay_static',
                                x, y, width=100, height=30, count=5, angle=0, resolution=5, 
                                backgroundStyle='rgb(0,0,0)',
                                glowStyle='rgb(200,200,200)',
                                dimStyle='rgb(20,20,20)'
                            ){
                                //values
                                    var text = '';
                                    var displayInterval = null;
                                    var displayIntervalTime = 150;
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                            
                                    //display units
                                        var units = [];
                                        for(var a = 0; a < count; a++){
                                            var temp = interfacePart.builder('sixteenSegmentDisplay_static', ''+a, {
                                                x:(width/count)*a, width:width/count, height:height, resolution:resolution,
                                                style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                                            });
                                            object.append( temp );
                                            units.push(temp);
                                        }
                            
                                //methods
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
                            this.readout_sixteenSegmentDisplay = function(
                                name='readout_sixteenSegmentDisplay',
                                x, y, width=100, height=30, count=5, angle=0,
                                backgroundStyle={r:0,g:0,b:0,a:1},
                                glowStyle={r:0.78,g:0.78,b:0.78,a:1},
                                dimStyle={r:0.1,g:0.1,b:0.1,a:1},
                            ){
                                //values
                                    var text = '';
                                    var displayInterval = null;
                                    var displayIntervalTime = 150;
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                            
                                    //display units
                                        var units = [];
                                        for(var a = 0; a < count; a++){
                                            var temp = interfacePart.builder('sixteenSegmentDisplay', ''+a, {
                                                x:(width/count)*a, width:width/count, height:height, 
                                                style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                                            });
                                            object.append( temp );
                                            units.push(temp);
                                        }
                            
                                //methods
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
                            this.grapher_audioScope_static = function(
                                name='grapher_audioScope_static',
                                x, y, width=120, height=60, angle=0,
                            
                                foregroundStyle={colour:'rgba(0,255,0,1)', thickness:0.5},
                                foregroundTextStyle={fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
                            
                                backgroundStyle_colour='rgba(0,100,0,1)',
                                backgroundStyle_thickness=0.25,
                                backgroundTextStyle_fill='rgba(0,150,0,1)',
                                backgroundTextStyle_size=0.1,
                                backgroundTextStyle_font='Helvetica',
                            
                                backingStyle='rgba(50,50,50,1)',
                            ){
                                //attributes
                                    var attributes = {
                                        analyser:{
                                            analyserNode: _canvas_.library.audio.context.createAnalyser(),
                                            timeDomainDataArray: null,
                                            frequencyData: null,
                                            refreshRate: 10,
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
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //grapher
                                        var grapher = interfacePart.builder('grapher_static',name,{
                                            x:0, y:0, width:width, height:height,
                                            foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                                            backgroundStyle_colour:backgroundStyle_colour, 
                                            backgroundStyle_thickness:backgroundStyle_thickness,
                                            backgroundTextStyle_fill:backgroundTextStyle_fill, 
                                            backgroundTextStyle_size:backgroundTextStyle_size,
                                            backgroundTextStyle_font:backgroundTextStyle_font,
                                            backingStyle:backingStyle,
                                        });
                                        object.append(grapher);
                            
                                //utility functions
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
                                        grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:false});
                                        grapher.verticalMarkings({points:[-0.25,-0.5,-0.75,0,0.25,0.5,0.75],printText:false});
                                        grapher.drawBackground();
                                    };
                            
                                //controls
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
                            
                                //setup
                                    setBackground();
                            
                                return object;
                            };
                            this.level = function(
                                name='level',
                                x, y, angle=0,
                                width=20, height=60,
                                backingStyle={r:0.04,g:0.04,b:0.04,a:1},
                                levelStyles=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.78,g:0.78,b:0.78,a:1}]
                            ){
                                var values = [];
                            
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                    //backing
                                        var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, colour:backingStyle });
                                            object.append(rect);
                                    //levels
                                        var levels = interfacePart.builder('group','levels');
                                            object.append(levels);
                            
                                        var level = [];
                                        for(var a = 0; a < levelStyles.length; a++){
                                            values.push(0);
                                            level.push( interfacePart.builder('rectangle','movingRect_'+a,{
                                                y:height,
                                                width:width, height:0,
                                                colour:levelStyles[a],
                                            }) );
                                            levels.prepend(level[a]);
                                        }
                            
                            
                                    
                            
                                    //methods
                                        object.layer = function(value,layer=0){
                                            if(layer == undefined){return values;}
                                            if(value==null){return values[layer];}
                            
                                            value = (value>1 ? 1 : value);
                                            value = (value<0 ? 0 : value);
                            
                                            values[layer] = value;
                            
                                            level[layer].height( height*value );
                                            level[layer].y( height - height*value );
                                        };
                            
                                return object;
                            };
                        };
                        this.dynamic = new function(){
                            this.connectionNode_voltage = function(
                                name='connectionNode_voltage',
                                x, y, angle=0, width=20, height=20,
                                allowConnections=true, allowDisconnections=true,
                                dimStyle={r:0.86,g:1,b:0.86,a:1},
                                glowStyle={r:0.94,g:0.98,b:0.93,a:1},
                                cable_dimStyle={r:0.32,g:0.96,b:0.43,a:1},
                                cable_glowStyle={r:0.62,g:0.98,b:0.68,a:1},
                                onchange=function(value){},
                                onconnect=function(instigator){},
                                ondisconnect=function(instigator){},
                            ){
                                //elements
                                    var object = interfacePart.builder('connectionNode',name,{
                                        x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'voltage',
                                        style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
                                    });
                            
                                //circuitry
                                    var localValue = 0;
                            
                                    object._getLocalValue = function(){ return localValue; };
                                    object._update = function(a){
                                        if(a>0){ object.activate(); }
                                        else{ object.deactivate(); }
                                        onchange(a);
                                    }
                            
                                    object.set = function(a){
                                        localValue = a;
                            
                                        var val = object.read();
                                        object._update(val);
                                        if(object.getForeignNode()!=undefined){ object.getForeignNode()._update(val); }
                                    };
                                    object.read = function(){ return localValue + (object.getForeignNode() != undefined ? object.getForeignNode()._getLocalValue() : false); };
                            
                                    object.onconnect = function(instigator){
                                        if(onconnect){onconnect(instigator);}
                                        object._update(object.read());
                                    };
                                    object.ondisconnect = function(instigator){
                                        if(ondisconnect){ondisconnect(instigator);}
                                        object._update(localValue);
                                    };
                            
                                return object;
                            };
                            this.cable = function(
                                name='path', 
                                x1=0, y1=0, x2=0, y2=0,
                                dimStyle={r:1,g:0,b:0,a:1},
                                glowStyle={r:1,g:0.39,b:0.39,a:1},
                            ){
                                //elements 
                                    //main
                                        var object = interfacePart.builder('group',name);
                                    //cable shape
                                        var path = interfacePart.builder('path','cable',{ points:[x1,y1,x2,y2], colour:dimStyle, thickness:2.5 });
                                        object.append(path);
                                
                                //controls
                                    object.activate = function(){ path.colour = glowStyle; };
                                    object.deactivate = function(){ path.colour = dimStyle; };
                                    object.draw = function(new_x1,new_y1,new_x2,new_y2){
                                        x1 = (new_x1!=undefined ? new_x1 : x1); 
                                        y1 = (new_y1!=undefined ? new_y1 : y1);
                                        x2 = (new_x2!=undefined ? new_x2 : x2); 
                                        y2 = (new_y2!=undefined ? new_y2 : y2);
                                        path.points([x1,y1,x2,y2]);
                                    };
                            
                                //identifier
                                    object._isCable = true;
                            
                                return object;
                            };
                            this.connectionNode_audio = function(
                                name='connectionNode_audio',
                                x, y, angle=0, width=20, height=20, allowConnections=true, allowDisconnections=true,
                                isAudioOutput=false, audioContext,
                                dimStyle={r:255/255, g:244/255, b:220/255, a:1},
                                glowStyle={r:255/255, g:244/255, b:244/255, a:1},
                                cable_dimStyle={r:247/255, g:146/255, b:84/255, a:1},
                                cable_glowStyle={r:242/255, g:168/255, b:123/255, a:1},
                                onconnect=function(){},
                                ondisconnect=function(){},
                            ){
                                //elements
                                    var object = interfacePart.builder('connectionNode',name,{
                                        x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'audio', direction:(isAudioOutput ? 'out' : 'in'),
                                        style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
                                    });
                                    object._direction = isAudioOutput ? 'out' : 'in';
                            
                                //circuitry
                                    object.audioNode = audioContext.createAnalyser();
                            
                                    //audio connections
                                        object.out = function(){return object.audioNode;};
                                        object.in = function(){return object.audioNode;};
                            
                                    object.onconnect = function(instigator){
                                        if(object._direction == 'out'){ object.audioNode.connect(object.getForeignNode().audioNode); }
                                        if(onconnect){onconnect(instigator);}
                                    };
                                    object.ondisconnect = function(instigator){
                                        if(object._direction == 'out'){ object.audioNode.disconnect(object.getForeignNode().audioNode); }
                                        if(ondisconnect){ondisconnect(instigator);}
                                    };
                                
                                return object;
                            };
                            this.connectionNode_data = function(
                                name='connectionNode_data',
                                x, y, angle=0, width=20, height=20, 
                                allowConnections=true, allowDisconnections=true,
                                dimStyle={r:220/255, g:244/255, b:255/255, a:1},
                                glowStyle={r:244/255, g:244/255, b:255/255, a:1},
                                cable_dimStyle={r:84/255, g:146/255, b:247/255, a:1},
                                cable_glowStyle={r:123/255, g:168/255, b:242/255, a:1},
                                onreceivedata=function(address, data){},
                                ongivedata=function(address){},
                                onconnect=function(){},
                                ondisconnect=function(){},
                            ){
                                //elements
                                    var object = interfacePart.builder('connectionNode',name,{
                                        x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'data',
                                        style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
                                        onconnect, ondisconnect
                                    });
                            
                                //circuitry
                                    function flash(obj){
                                        obj.activate();
                                        setTimeout(function(){ if(obj==undefined){return;} obj.deactivate(); },100);
                                        if(obj.getForeignNode()!=undefined){
                                            obj.getForeignNode().activate();
                                            setTimeout(function(){ if(obj==undefined || obj.getForeignNode() == undefined){return;} obj.getForeignNode().deactivate(); },100);
                                        }
                                    }
                            
                                    object.send = function(address,data){
                                        flash(object);
                            
                                        if(object.getForeignNode()!=undefined){ object.getForeignNode().onreceivedata(address,data); }
                                    };
                                    object.request = function(address){
                                        flash(object);
                            
                                        if(object.getForeignNode()!=undefined){ object.getForeignNode().ongivedata(address); }
                                    };
                            
                                    object.onreceivedata = onreceivedata;
                                    object.ongivedata = ongivedata;
                            
                                return object;
                            };
                            this.connectionNode = function(
                                name='connectionNode2',
                                x, y, angle=0, width=20, height=20, type='none', direction='',
                                allowConnections=true, allowDisconnections=true,
                                dimStyle={r:0.86,g:0.86,b:0.86,a:1},
                                glowStyle={r:0.95,g:0.95,b:0.95,a:1},
                                cable_dimStyle={r:0.57,g:0.57,b:0.57,a:1},
                                cable_glowStyle={r:0.84,g:0.84,b:0.84,a:1},
                                onconnect=function(instigator){},
                                ondisconnect=function(instigator){},
                            ){
                                //elements
                                    //main
                                        var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                                        object._connectionNode = true;
                                        object._type = type;
                                        object._direction = direction;
                                    //node
                                        var rectangle = interfacePart.builder('rectangle','node',{ width:width, height:height, colour:dimStyle });
                                            object.append(rectangle);
                            
                                //network functions
                                    var foreignNode = undefined;
                            
                                    object.isConnected = function(){ return cable != undefined; };
                                    object.canDisconnect = function(){ return this.allowDisconnections() && (foreignNode!=undefined && foreignNode.allowDisconnections()); };
                                    object.allowConnections = function(bool){
                                        if(bool == undefined){return allowConnections;}
                                        allowConnections = bool;
                                    };
                                    object.allowDisconnections = function(bool){
                                        if(bool == undefined){return allowDisconnections;}
                                        allowDisconnections = bool;
                                    };
                                    object.connectTo = function(new_foreignNode){ 
                                        if( new_foreignNode == undefined){ return; }
                                        if( new_foreignNode == this ){ return; }
                                        if( new_foreignNode._type != this._type ){ return; }
                                        if( (this._direction == '' || new_foreignNode._direction == '') && this._direction != new_foreignNode._direction){ return; }
                                        if( this._direction != '' && (new_foreignNode._direction == this._direction) ){ return; }
                                        if( new_foreignNode == foreignNode ){ return; }
                            
                                        this.disconnect();
                            
                                        foreignNode = new_foreignNode;
                                        if(onconnect!=undefined){this.onconnect(true);}
                                        foreignNode._receiveConnection(this);
                            
                                        this._addCable(this);
                                    };
                                    object._receiveConnection = function(new_foreignNode){
                                        this.disconnect();
                                        foreignNode = new_foreignNode;
                                        if(onconnect!=undefined){this.onconnect(false);}
                                    };
                                    object.disconnect = function(){
                                        if( foreignNode == undefined ){return;}
                            
                                        this._removeCable();
                                        if(ondisconnect!=undefined){this.ondisconnect(true);}
                                        foreignNode._receiveDisconnection();
                                        foreignNode = null;
                                    };
                                    object._receiveDisconnection = function(){
                                        if(ondisconnect!=undefined){this.ondisconnect(false);}
                                        foreignNode = null;
                                    };
                                    object.getForeignNode = function(){ return foreignNode; };
                            
                                //mouse interaction
                                    rectangle.onmousedown = function(x,y,event){
                                        _canvas_.system.mouse.mouseInteractionHandler(
                                            undefined,
                                            function(event){
                                                var element = _canvas_.core.arrangement.getElementsUnderPoint(event.x,event.y)[0];
                                                if(element == undefined){return;}
                                                
                                                var node = element.parent;
                                                if( node._connectionNode ){ 
                                                    if( node.isConnected() && !node.canDisconnect() ){return;}
                                                    if( object.isConnected() && !object.canDisconnect() ){return;}
                                                    if( allowConnections && node.allowConnections() ){ object.connectTo(node); }
                                                }
                                            }
                                        );
                                    };
                                    rectangle.ondblclick = function(x,y,event){
                                        if( !(allowDisconnections && foreignNode.allowDisconnections()) ){return;}
                                        object.disconnect();
                                    };
                            
                                //cabling
                                    var cable;
                            
                                    object._addCable = function(){
                                        cable = interfacePart.builder('cable','cable-'+object.getAddress().replace(/\//g, '_'),{ x1:0,y1:0,x2:100,y2:100, style:{dim:cable_dimStyle, glow:cable_glowStyle}});
                                        foreignNode._receiveCable(cable);
                                        _canvas_.system.pane.getMiddlegroundPane(this).append(cable);
                                        this.draw();
                                    }
                                    object._receiveCable = function(new_cable){
                                        cable = new_cable;
                                    };
                                    object._removeCable = function(){
                                        cable.parent.remove(cable);
                                        cable = undefined;
                                        foreignNode._loseCable();
                                    };
                                    object._loseCable = function(){
                                        cable = undefined;
                                    };
                                    object.getCablePoint = function(){
                                        var offset = object.getOffset();
                                        return _canvas_.core.viewport.adapter.windowPoint2workspacePoint( offset.x + (width*offset.scale)/2, offset.y + (height*offset.scale)/2 );
                                    };
                                    object.draw = function(){
                                        if( cable == undefined ){return;}
                            
                                        var pointA = this.getCablePoint();
                                        var pointB = foreignNode.getCablePoint();
                            
                                        cable.draw(pointA.x,pointA.y,pointB.x,pointB.y);
                                    };
                            
                                //graphical
                                    object.activate = function(){ 
                                        rectangle.colour = glowStyle;
                                        if(cable!=undefined){ cable.activate(); }
                                    }
                                    object.deactivate = function(){ 
                                        rectangle.colour = dimStyle;
                                        if(cable!=undefined){ cable.deactivate(); }
                                    }
                            
                                //callbacks
                                    object.onconnect = onconnect;
                                    object.ondisconnect = ondisconnect;
                            
                                return object;
                            };
                            this.connectionNode_signal = function(
                                name='connectionNode_signal',
                                x, y, angle=0, width=20, height=20,
                                allowConnections=true, allowDisconnections=true,
                                dimStyle={r:1,g:0.86,b:0.95,a:1}, // 'rgb(255, 220, 244)',
                                glowStyle={r:1,g:0.95,b:0.95,a:1}, // 'rgb(255, 244, 244)',
                                cable_dimStyle={r:0.96,g:0.32,b:0.57,a:1}, // 'rgb(247, 84, 146)',
                                cable_glowStyle={r:0.96,g:0.76,b:0.84,a:1}, // 'rgb(247, 195, 215)',
                                onchange=function(value){},
                                onconnect=function(instigator){},
                                ondisconnect=function(instigator){},
                            ){
                                //elements
                                    var object = interfacePart.builder('connectionNode',name,{
                                        x:x, y:y, angle:angle, width:width, height:height, allowConnections:allowConnections, allowDisconnections:allowDisconnections, type:'signal',
                                        style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
                                    });
                            
                                //circuitry
                                    var localValue = false;
                            
                                    object._getLocalValue = function(){ return localValue; };
                                    object._update = function(){
                                        var val = object.read();
                                        if(val){ object.activate(); }
                                        else{ object.deactivate(); }
                                        onchange(val);
                                    }
                            
                                    object.set = function(a){
                                        localValue = a;
                            
                                        object._update();
                                        if(object.getForeignNode()!=undefined){ object.getForeignNode()._update(); }
                                    };
                                    object.read = function(){ return localValue || (object.getForeignNode() != undefined ? object.getForeignNode()._getLocalValue() : false); };
                            
                                    object.onconnect = function(instigator){
                                        if(onconnect){onconnect(instigator);}
                                        object._update();
                                    };
                                    object.ondisconnect = function(instigator){
                                        if(ondisconnect){ondisconnect(instigator);}
                                        object._update();
                                    };
                            
                                return object;
                            };
                        };
                    };
                    this.builder = function(type,name,data){
                        if(!data){data={};}
                        if(data.style == undefined){data.style={};}
                    
                        switch(type){
                            default: console.warn('Interface Part Builder :: Unknown element: '+ type); return null;  
                            //basic
                                case 'group': return this.collection.basic.group( name, data.x, data.y, data.angle, data.ignored );
                                case 'rectangle': return this.collection.basic.rectangle( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour );
                                case 'rectangleWithOutline': return this.collection.basic.rectangleWithOutline( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.colour, data.thickness, data.lineColour );
                                case 'image': return this.collection.basic.image( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url );
                                case 'canvas': return this.collection.basic.canvas( name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.resolution );
                                case 'polygon': return this.collection.basic.polygon( name, data.points, data.ignored, data.colour, data.pointsAsXYArray );
                                case 'circle': return this.collection.basic.circle( name, data.x, data.y, data.angle, data.radius, data.ignored, data.colour );
                                case 'path': return this.collection.basic.path( name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray );
                                case 'loopedPath': return this.collection.basic.loopedPath( name, data.points, data.thickness, data.ignored, data.colour, data.pointsAsXYArray );
                        
                            //display
                                case 'glowbox_rect': return this.collection.display.glowbox_rect( name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim );
                                case 'sevenSegmentDisplay': return this.collection.display.sevenSegmentDisplay(
                                    name, data.x, data.y, data.width, data.height, data.angle,
                                    data.style.background, data.style.glow, data.style.dim
                                );
                                case 'sevenSegmentDisplay_static': return this.collection.display.sevenSegmentDisplay_static(
                                    name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                                    data.style.background, data.style.glow, data.style.dim
                                );
                                case 'sixteenSegmentDisplay': return this.collection.display.sixteenSegmentDisplay(
                                    name, data.x, data.y, data.width, data.height,  data.angle,
                                    data.style.background, data.style.glow, data.style.dim
                                );
                                case 'sixteenSegmentDisplay_static': return this.collection.display.sixteenSegmentDisplay_static(
                                    name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                                    data.style.background, data.style.glow, data.style.dim
                                );
                                case 'readout_sixteenSegmentDisplay': return this.collection.display.readout_sixteenSegmentDisplay(
                                    name, data.x, data.y, data.width, data.height, data.count, data.angle, 
                                    data.style.background, data.style.glow, data.style.dim,
                                );
                                case 'readout_sixteenSegmentDisplay_static': return this.collection.display.readout_sixteenSegmentDisplay_static(
                                    name, data.x, data.y, data.width, data.height, data.count, data.angle, data.resolution,
                                    data.style.background, data.style.glow, data.style.dim,
                                );
                                case 'level': return this.collection.display.level(
                                    name, data.x, data.y, data.angle, data.width, data.height, 
                                    data.style.backing, data.style.levels
                                );
                                case 'meter_level': return this.collection.display.meter_level(
                                    name, data.x, data.y, data.angle, data.width, data.height, data.markings,
                                    data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
                                );
                                case 'audio_meter_level': return this.collection.display.audio_meter_level(
                                    name, data.x, data.y, data.angle, data.width, data.height, data.markings, 
                                    data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
                                );
                                case 'rastorDisplay': return this.collection.display.rastorDisplay(
                                    name, data.x, data.y, data.angle, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage
                                );
                                case 'grapher': return this.collection.display.grapher(
                                    name, data.x, data.y, data.width, data.height, data.angle,
                                    data.style.foregrounds, data.style.foregroundText,
                                    data.style.background_stroke, data.style.background_thickness,
                                    data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
                                    data.style.backing,
                                );
                                case 'grapher_static': return this.collection.display.grapher_static(
                                    name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
                                    data.style.foregrounds, data.style.foregroundText,
                                    data.style.background_stroke, data.style.background_thickness,
                                    data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
                                    data.style.backing,
                                );
                                case 'grapher_periodicWave': return this.collection.display.grapher_periodicWave(
                                    name, data.x, data.y, data.width, data.height, data.angle,
                                    data.style.foregrounds, data.style.foregroundText,
                                    data.style.background_stroke, data.style.background_thickness,
                                    data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
                                    data.style.backing,
                                );
                                case 'grapher_periodicWave_static': return this.collection.display.grapher_periodicWave_static(
                                    name, data.x, data.y, data.width, data.height, data.angle,
                                    data.style.foregrounds, data.style.foregroundText,
                                    data.style.background_stroke, data.style.background_thickness,
                                    data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
                                    data.style.backing,
                                );
                                case 'grapher_audioScope': return this.collection.display.grapher_audioScope(
                                    name, data.x, data.y, data.width, data.height, data.angle,
                                    data.style.foregrounds, data.style.foregroundText,
                                    data.style.background_stroke, data.style.background_thickness,
                                    data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
                                    data.style.backing,
                                );
                                case 'grapher_audioScope_static': return this.collection.display.grapher_audioScope_static(
                                    name, data.x, data.y, data.width, data.height, data.angle,
                                    data.style.foregrounds, data.style.foregroundText,
                                    data.style.background_stroke, data.style.background_thickness,
                                    data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
                                    data.style.backing,
                                );
                    
                            //control
                               //button
                                    case 'button_': return this.collection.control.button_(
                                        name, data.x, data.y, data.angle, data.interactable,
                                        data.active, data.hoverable, data.selectable, data.pressable,
                    
                                        data.onenter,
                                        data.onleave,
                                        data.onpress,
                                        data.ondblpress,
                                        data.onrelease,
                                        data.onselect,
                                        data.ondeselect,
                                        
                                        data.subject,
                                    );
                    
                                    case 'button_image': return this.collection.control.button_image(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
                                        data.active, data.hoverable, data.selectable, data.pressable,
                    
                                        data.backingURL__off,
                                        data.backingURL__up,
                                        data.backingURL__press,
                                        data.backingURL__select,
                                        data.backingURL__select_press,
                                        data.backingURL__glow,
                                        data.backingURL__glow_press,
                                        data.backingURL__glow_select,
                                        data.backingURL__glow_select_press,
                                        data.backingURL__hover,
                                        data.backingURL__hover_press,
                                        data.backingURL__hover_select,
                                        data.backingURL__hover_select_press,
                                        data.backingURL__hover_glow,
                                        data.backingURL__hover_glow_press,
                                        data.backingURL__hover_glow_select,
                                        data.backingURL__hover_glow_select_press,
                                    
                                        data.onenter,
                                        data.onleave,
                                        data.onpress,
                                        data.ondblpress,
                                        data.onrelease,
                                        data.onselect,
                                        data.ondeselect,
                                    );
                                    case 'button_circle': return this.collection.control.button_circle(
                                        name, data.x, data.y, data.r, data.angle, data.interactable,
                                        data.text_centre,
                                        data.active, data.hoverable, data.selectable, data.pressable,
                    
                                        data.style.text_font, data.style.text_textBaseline, data.style.text_colour,
                    
                                        data.style.background__off__colour,                     data.style.background__off__lineColour,                     data.style.background__off__lineThickness,
                                        data.style.background__up__colour,                      data.style.background__up__lineColour,                      data.style.background__up__lineThickness,
                                        data.style.background__press__colour,                   data.style.background__press__lineColour,                   data.style.background__press__lineThickness,
                                        data.style.background__select__colour,                  data.style.background__select__lineColour,                  data.style.background__select__lineThickness,
                                        data.style.background__select_press__colour,            data.style.background__select_press__lineColour,            data.style.background__select_press__lineThickness,
                                        data.style.background__glow__colour,                    data.style.background__glow__lineColour,                    data.style.background__glow__lineThickness,
                                        data.style.background__glow_press__colour,              data.style.background__glow_press__lineColour,              data.style.background__glow_press__lineThickness,
                                        data.style.background__glow_select__colour,             data.style.background__glow_select__lineColour,             data.style.background__glow_select__lineThickness,
                                        data.style.background__glow_select_press__colour,       data.style.background__glow_select_press__lineColour,       data.style.background__glow_select_press__lineThickness,
                                        data.style.background__hover__colour,                   data.style.background__hover__lineColour,                   data.style.background__hover__lineThickness,
                                        data.style.background__hover_press__colour,             data.style.background__hover_press__lineColour,             data.style.background__hover_press__lineThickness,
                                        data.style.background__hover_select__colour,            data.style.background__hover_select__lineColour,            data.style.background__hover_select__lineThickness,
                                        data.style.background__hover_select_press__colour,      data.style.background__hover_select_press__lineColour,      data.style.background__hover_select_press__lineThickness,
                                        data.style.background__hover_glow__colour,              data.style.background__hover_glow__lineColour,              data.style.background__hover_glow__lineThickness,
                                        data.style.background__hover_glow_press__colour,        data.style.background__hover_glow_press__lineColour,        data.style.background__hover_glow_press__lineThickness,
                                        data.style.background__hover_glow_select__colour,       data.style.background__hover_glow_select__lineColour,       data.style.background__hover_glow_select__lineThickness,
                                        data.style.background__hover_glow_select_press__colour, data.style.background__hover_glow_select_press__lineColour, data.style.background__hover_glow_select_press__lineThickness,
                                    
                                        data.onenter,
                                        data.onleave,
                                        data.onpress,
                                        data.ondblpress,
                                        data.onrelease,
                                        data.onselect,
                                        data.ondeselect,
                                    );
                                    case 'button_polygon': return this.collection.control.button_polygon(
                                        name, data.x, data.y, data.points, data.angle, data.interactable,
                                        data.text_centre,
                                        data.active, data.hoverable, data.selectable, data.pressable,
                    
                                        data.style.text_font, data.style.text_textBaseline, data.style.text_colour,
                    
                                        data.style.background__off__colour,                     data.style.background__off__lineColour,                     data.style.background__off__lineThickness,
                                        data.style.background__up__colour,                      data.style.background__up__lineColour,                      data.style.background__up__lineThickness,
                                        data.style.background__press__colour,                   data.style.background__press__lineColour,                   data.style.background__press__lineThickness,
                                        data.style.background__select__colour,                  data.style.background__select__lineColour,                  data.style.background__select__lineThickness,
                                        data.style.background__select_press__colour,            data.style.background__select_press__lineColour,            data.style.background__select_press__lineThickness,
                                        data.style.background__glow__colour,                    data.style.background__glow__lineColour,                    data.style.background__glow__lineThickness,
                                        data.style.background__glow_press__colour,              data.style.background__glow_press__lineColour,              data.style.background__glow_press__lineThickness,
                                        data.style.background__glow_select__colour,             data.style.background__glow_select__lineColour,             data.style.background__glow_select__lineThickness,
                                        data.style.background__glow_select_press__colour,       data.style.background__glow_select_press__lineColour,       data.style.background__glow_select_press__lineThickness,
                                        data.style.background__hover__colour,                   data.style.background__hover__lineColour,                   data.style.background__hover__lineThickness,
                                        data.style.background__hover_press__colour,             data.style.background__hover_press__lineColour,             data.style.background__hover_press__lineThickness,
                                        data.style.background__hover_select__colour,            data.style.background__hover_select__lineColour,            data.style.background__hover_select__lineThickness,
                                        data.style.background__hover_select_press__colour,      data.style.background__hover_select_press__lineColour,      data.style.background__hover_select_press__lineThickness,
                                        data.style.background__hover_glow__colour,              data.style.background__hover_glow__lineColour,              data.style.background__hover_glow__lineThickness,
                                        data.style.background__hover_glow_press__colour,        data.style.background__hover_glow_press__lineColour,        data.style.background__hover_glow_press__lineThickness,
                                        data.style.background__hover_glow_select__colour,       data.style.background__hover_glow_select__lineColour,       data.style.background__hover_glow_select__lineThickness,
                                        data.style.background__hover_glow_select_press__colour, data.style.background__hover_glow_select_press__lineColour, data.style.background__hover_glow_select_press__lineThickness,
                                    
                                        data.onenter,
                                        data.onleave,
                                        data.onpress,
                                        data.ondblpress,
                                        data.onrelease,
                                        data.onselect,
                                        data.ondeselect,
                                    );
                                    case 'button_rectangle': return this.collection.control.button_rectangle(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
                                        data.text_centre, data.text_left, data.text_right,
                                        data.textVerticalOffsetMux, data.textHorizontalOffsetMux,
                                        data.active, data.hoverable, data.selectable, data.pressable,
                    
                                        data.style.text_font, data.style.text_textBaseline, data.style.text_colour,
                    
                                        data.style.background__off__colour,                     data.style.background__off__lineColour,                     data.style.background__off__lineThickness,
                                        data.style.background__up__colour,                      data.style.background__up__lineColour,                      data.style.background__up__lineThickness,
                                        data.style.background__press__colour,                   data.style.background__press__lineColour,                   data.style.background__press__lineThickness,
                                        data.style.background__select__colour,                  data.style.background__select__lineColour,                  data.style.background__select__lineThickness,
                                        data.style.background__select_press__colour,            data.style.background__select_press__lineColour,            data.style.background__select_press__lineThickness,
                                        data.style.background__glow__colour,                    data.style.background__glow__lineColour,                    data.style.background__glow__lineThickness,
                                        data.style.background__glow_press__colour,              data.style.background__glow_press__lineColour,              data.style.background__glow_press__lineThickness,
                                        data.style.background__glow_select__colour,             data.style.background__glow_select__lineColour,             data.style.background__glow_select__lineThickness,
                                        data.style.background__glow_select_press__colour,       data.style.background__glow_select_press__lineColour,       data.style.background__glow_select_press__lineThickness,
                                        data.style.background__hover__colour,                   data.style.background__hover__lineColour,                   data.style.background__hover__lineThickness,
                                        data.style.background__hover_press__colour,             data.style.background__hover_press__lineColour,             data.style.background__hover_press__lineThickness,
                                        data.style.background__hover_select__colour,            data.style.background__hover_select__lineColour,            data.style.background__hover_select__lineThickness,
                                        data.style.background__hover_select_press__colour,      data.style.background__hover_select_press__lineColour,      data.style.background__hover_select_press__lineThickness,
                                        data.style.background__hover_glow__colour,              data.style.background__hover_glow__lineColour,              data.style.background__hover_glow__lineThickness,
                                        data.style.background__hover_glow_press__colour,        data.style.background__hover_glow_press__lineColour,        data.style.background__hover_glow_press__lineThickness,
                                        data.style.background__hover_glow_select__colour,       data.style.background__hover_glow_select__lineColour,       data.style.background__hover_glow_select__lineThickness,
                                        data.style.background__hover_glow_select_press__colour, data.style.background__hover_glow_select_press__lineColour, data.style.background__hover_glow_select_press__lineThickness,
                                    
                                        data.onenter,
                                        data.onleave,
                                        data.onpress,
                                        data.ondblpress,
                                        data.onrelease,
                                        data.onselect,
                                        data.ondeselect,
                                    );
                                //dial
                                    case 'dial_continuous': return this.collection.control.dial_continuous(
                                        name,
                                        data.x, data.y, data.r, data.angle, data.interactable,
                                        data.value, data.resetValue,
                                        data.startAngle, data.maxAngle,
                                        data.style.handle, data.style.slot, data.style.needle,
                                        data.onchange, data.onrelease
                                    );
                                    case 'dial_discrete': return this.collection.control.dial_discrete(
                                        name,
                                        data.x, data.y, data.r, data.angle, data.interactable,
                                        data.value, data.resetValue, data.optionCount,
                                        data.startAngle, data.maxAngle,
                                        data.style.handle, data.style.slot, data.style.needle,
                                        data.onchange, data.onrelease
                                    );
                                    case 'dial_continuous_image': return this.collection.control.dial_continuous_image(
                                        name,
                                        data.x, data.y, data.r, data.angle, data.interactable,
                                        data.value, data.resetValue,
                                        data.startAngle, data.maxAngle,
                                        data.handleURL, data.slotURL, data.needleURL,
                                        data.onchange, data.onrelease
                                    );
                                    case 'dial_discrete_image': return this.collection.control.dial_discrete_image(
                                        name,
                                        data.x, data.y, data.r, data.angle, data.interactable,
                                        data.value, data.resetValue, data.optionCount,
                                        data.startAngle, data.maxAngle,
                                        data.handleURL, data.slotURL, data.needleURL,
                                        data.onchange, data.onrelease
                                    );
                                //slide
                                    case 'slide': return this.collection.control.slide(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
                                        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                                        data.onchange, data.onrelease
                                    );
                                    case 'slide_image': return this.collection.control.slide_image(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.value, data.resetValue, 
                                        data.handleURL, data.backingURL, data.slotURL, data.style.invisibleHandle,
                                        data.onchange, data.onrelease
                                    );
                                    case 'slidePanel': return this.collection.control.slidePanel(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
                                        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                                        data.onchange, data.onrelease
                                    );
                                    case 'slidePanel_image': return this.collection.control.slidePanel_image(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
                                        data.handleURL, data.backingURL, data.slotURL, data.overlayURL, data.style.invisibleHandle,
                                        data.onchange, data.onrelease
                                    );
                                    case 'rangeslide': return this.collection.control.rangeslide(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
                                        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span,
                                        data.onchange, data.onrelease
                                    );
                                    case 'rangeslide_image': return this.collection.control.rangeslide_image(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
                                        data.handleURL, data.backingURL, data.slotURL, data.style.invisibleHandle, data.spanURL,
                                        data.onchange, data.onrelease
                                    );
                                //list
                                    case 'list': return this.collection.control.list(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.list,
                                        data.itemTextVerticalOffsetMux, data.itemTextHorizontalOffsetMux,
                                        data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,
                    
                                        data.itemHeightMux, data.itemWidthMux, data.itemSpacingMux, 
                                        data.breakHeightMux, data.breakWidthMux, 
                                        data.spacingHeightMux,
                    
                                        data.style.backing, data.style.break,
                                        data.style.text_font, data.style.text_textBaseline, data.style.text_colour,
                                        data.style.background__off__colour,                     data.style.background__off__lineColour,                     data.style.background__off__lineThickness,
                                        data.style.background__up__colour,                      data.style.background__up__lineColour,                      data.style.background__up__lineThickness,
                                        data.style.background__press__colour,                   data.style.background__press__lineColour,                   data.style.background__press__lineThickness,
                                        data.style.background__select__colour,                  data.style.background__select__lineColour,                  data.style.background__select__lineThickness,
                                        data.style.background__select_press__colour,            data.style.background__select_press__lineColour,            data.style.background__select_press__lineThickness,
                                        data.style.background__glow__colour,                    data.style.background__glow__lineColour,                    data.style.background__glow__lineThickness,
                                        data.style.background__glow_press__colour,              data.style.background__glow_press__lineColour,              data.style.background__glow_press__lineThickness,
                                        data.style.background__glow_select__colour,             data.style.background__glow_select__lineColour,             data.style.background__glow_select__lineThickness,
                                        data.style.background__glow_select_press__colour,       data.style.background__glow_select_press__lineColour,       data.style.background__glow_select_press__lineThickness,
                                        data.style.background__hover__colour,                   data.style.background__hover__lineColour,                   data.style.background__hover__lineThickness,
                                        data.style.background__hover_press__colour,             data.style.background__hover_press__lineColour,             data.style.background__hover_press__lineThickness,
                                        data.style.background__hover_select__colour,            data.style.background__hover_select__lineColour,            data.style.background__hover_select__lineThickness,
                                        data.style.background__hover_select_press__colour,      data.style.background__hover_select_press__lineColour,      data.style.background__hover_select_press__lineThickness,
                                        data.style.background__hover_glow__colour,              data.style.background__hover_glow__lineColour,              data.style.background__hover_glow__lineThickness,
                                        data.style.background__hover_glow_press__colour,        data.style.background__hover_glow_press__lineColour,        data.style.background__hover_glow_press__lineThickness,
                                        data.style.background__hover_glow_select__colour,       data.style.background__hover_glow_select__lineColour,       data.style.background__hover_glow_select__lineThickness,
                                        data.style.background__hover_glow_select_press__colour, data.style.background__hover_glow_select_press__lineColour, data.style.background__hover_glow_select_press__lineThickness,
                                    
                                        data.onenter, data.onleave, data.onpress, data.ondblpress, data.onrelease, data.onselection, data.onpositionchange,
                                    );
                                    case 'list_image': return this.collection.control.list_image(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.list,
                                        data.itemTextVerticalOffsetMux, data.itemTextHorizontalOffsetMux,
                                        data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,
                    
                                        data.itemHeightMux, data.itemWidthMux, data.itemSpacingMux, 
                                        data.breakHeightMux, data.breakWidthMux, 
                                        data.spacingHeightMux,
                    
                                        data.backingURL, data.breakURL,
                    
                                        data.itemURL__off,
                                        data.itemURL__up,
                                        data.itemURL__press,
                                        data.itemURL__select,
                                        data.itemURL__select_press,
                                        data.itemURL__glow,
                                        data.itemURL__glow_press,
                                        data.itemURL__glow_select,
                                        data.itemURL__glow_select_press,
                                        data.itemURL__hover,
                                        data.itemURL__hover_press,
                                        data.itemURL__hover_select,
                                        data.itemURL__hover_select_press,
                                        data.itemURL__hover_glow,
                                        data.itemURL__hover_glow_press,
                                        data.itemURL__hover_glow_select,
                                        data.itemURL__hover_glow_select_press,
                                    
                                        data.onenter, data.onleave, data.onpress, data.ondblpress, data.onrelease, data.onselection, data.onpositionchange,
                                    );
                                //checkbox
                                    case 'checkbox_': return this.collection.control.checkbox_(
                                        name, data.x, data.y, data.angle, data.interactable,
                                        data.onchange, data.subject,
                                    );
                                    case 'checkbox_circle': return this.collection.control.checkbox_circle(
                                        name, data.x, data.y, data.radius, data.angle, data.interactable,
                                        data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
                                        data.onchange,
                                    );
                            //         case 'checkbox_image': return this.collection.control.checkbox_image(
                            //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
                            //             data.uncheckURL, data.checkURL,
                            //             data.onchange,
                            //         );
                                    case 'checkbox_polygon': return this.collection.control.checkbox_polygon(
                                        name, data.x, data.y, data.outterPoints, data.innerPoints, data.angle, data.interactable,
                                        data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
                                        data.onchange,
                                    );
                                    case 'checkbox_rect': case 'checkbox_rectangle': return this.collection.control.checkbox_rectangle(
                                        name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
                                        data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
                                        data.onchange,
                                    );
                            //     //other
                            //         case 'rastorgrid': return this.collection.control.rastorgrid(
                            //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.xCount, data.yCount,
                            //             data.style.backing, data.style.check, data.style.backingGlow, data.style.checkGlow,
                            //             data.onchange
                            //         );
                            //         case 'needleOverlay': return this.collection.control.needleOverlay(
                            //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,
                            //             data.needleWidth, data.selectNeedle, data.selectionArea, data.style.needles,
                            //             data.onchange, data.onrelease, data.selectionAreaToggle,
                            //         );
                            //         case 'grapher_waveWorkspace': return this.collection.control.grapher_waveWorkspace(
                            //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.selectNeedle, data.selectionArea,
                            //             data.style.foregrounds, data.style.foregroundText,
                            //             data.style.background_stroke, data.style.background_lineWidth,
                            //             data.style.backgroundText_fill, data.style.backgroundText_font,
                            //             data.style.backing,
                            //             data.onchange, data.onrelease, data.selectionAreaToggle
                            //         );
                            //         case 'sequencer': return this.collection.control.sequencer(
                            //             name, data.x, data.y, data.width, data.height, data.angle, data.interactable,             
                            //             data.xCount, data.yCount, data.zoomLevel_x, data.zoomLevel_y,
                            //             data.backingStyle, data.selectionAreaStyle,
                            //             data.blockStyle_body, data.blockStyle_bodyGlow, data.blockStyle_handle, data.blockStyle_handleWidth,
                            //             data.horizontalStripStyle_pattern, data.horizontalStripStyle_glow, data.horizontalStripStyle_styles,
                            //             data.verticalStripStyle_pattern,   data.verticalStripStyle_glow,   data.verticalStripStyle_styles,
                            //             data.playheadStyle,
                            //             data.onpan, data.onchangeviewarea, data.event,
                            //         );
                    
                            //dynamic
                                case 'cable': return this.collection.dynamic.cable(
                                    name, data.x1, data.y1, data.x2, data.y2,
                                    data.style.dim, data.style.glow,
                                );
                                case 'connectionNode': return this.collection.dynamic.connectionNode(
                                    name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction, data.allowConnections, data.allowDisconnections,
                                    data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                                    data.onconnect, data.ondisconnect,
                                );
                                case 'connectionNode_signal': return this.collection.dynamic.connectionNode_signal(
                                    name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
                                    data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                                    data.onchange, data.onconnect, data.ondisconnect,
                                );
                                case 'connectionNode_voltage': return this.collection.dynamic.connectionNode_voltage(
                                    name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
                                    data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                                    data.onchange, data.onconnect, data.ondisconnect,
                                );
                                case 'connectionNode_data': return this.collection.dynamic.connectionNode_data(
                                    name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections,
                                    data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                                    data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
                                );
                                case 'connectionNode_audio': return this.collection.dynamic.connectionNode_audio(
                                    name, data.x, data.y, data.angle, data.width, data.height, data.allowConnections, data.allowDisconnections, data.isAudioOutput, _canvas_.library.audio.context,
                                    data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                                    data.onconnect, data.ondisconnect,
                                );
                        }
                    }

                };
                // this.unit = new function(){
                // };
            };
        }
    }
})();
