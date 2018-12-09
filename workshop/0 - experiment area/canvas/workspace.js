var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var canvas = __canvasElements[__canvasElements_count];
        canvas.library = new function(){};
        canvas.library.math = new function(){
            this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
            this.distanceBetweenTwoPoints = function(a, b){ return Math.pow(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2),0.5) };
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
            };

        };
        canvas.library.structure = new function(){
            this.functionListRunner = function(list){
                //function builder for working with the 'functionList' format
            
                return function(event,data){
                    //run through function list, and activate functions where necessary
                        for(var a = 0; a < list.length; a++){
                            var shouldRun = true;
            
                            //determine if all the requirements of this function are met
                                for(var b = 0; b < list[a].specialKeys.length; b++){
                                    shouldRun = shouldRun && event[list[a].specialKeys[b]];
                                    if(!shouldRun){break;} //(one is already not a match, so save time and just bail here)
                                }
            
                            //if all requirements were met, run the function
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
                            signals:             signals,
                            selectedSignals:     selectedSignals,
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
        canvas.library.audio = new function(){
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
                                var array = system.utility.math.curveGenerator.s(10);
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
                                system.audio.context.decodeAudioData(this.response, function(data){
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
                                    system.audio.context.decodeAudioData(data.target.result, function(buffer){
                                        callback({
                                            buffer:buffer,
                                            name:file.name,
                                            duration:buffer.duration,
                                        });
                                    });
                                }
                            };
                            document.body.appendChild(inputObject);
                            inputObject.click();
                        break;
                    }
                };
                this.waveformSegment = function(audioBuffer, bounds={start:0,end:1}){
                    var waveform = audioBuffer.getChannelData(0);
                    // var channelCount = audioBuffer.numberOfChannels;
                
                    bounds.start = bounds.start ? bounds.start : 0;
                    bounds.end = bounds.end ? bounds.end : 1;
                    var resolution = 10000;
                    var start = audioBuffer.length*bounds.start;
                    var end = audioBuffer.length*bounds.end;
                    var step = (end - start)/resolution;
                
                    var outputArray = [];
                    for(var a = start; a < end; a+=Math.round(step)){
                        outputArray.push( 
                            system.utility.math.largestValueFound(
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
                    canvas.library.audio.utility.changeAudioParam(canvas.library.audio.context, this.gain, this._gain, 0.01, 'instant', true);
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
        canvas.library.misc = new function(){
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
                    return canvas.library.misc.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
            };
        };
        canvas.core = new function(){
            var core = new function(){
                var core = this;
                
                var adapter = new function(){
                    this.length = function(l){
                        return l*core.viewport.scale();
                    };
                    this.windowPoint2workspacePoint = function(x,y){
                        var position = core.viewport.position();
                        var scale = core.viewport.scale();
                        var angle = core.viewport.angle();
                
                        x = (x/scale) - position.x;
                        y = (y/scale) - position.y;
                
                        return canvas.library.math.cartesianAngleAdjust(x,y,-angle);
                    };
                    this.workspacePoint2windowPoint = function(x,y){
                        var position = core.viewport.position();
                        var scale = core.viewport.scale();
                        var angle = core.viewport.angle();
                
                        var point = canvas.library.math.cartesianAngleAdjust(x,y,angle);
                
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
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
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
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    points: this.points.map( function(a){
                                        a = canvas.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
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
                                point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                this.extremities.origin = {
                                    x: this.x + offset.x,
                                    y: this.y + offset.y,
                                };
                    
                            //calculate points
                                this.extremities.points = canvas.library.math.pointsOfCircle(this.x, this.y, this.r, 10);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            var circleCentre = {
                                x: shape.x + shape.extremities.origin.x,
                                y: shape.y + shape.extremities.origin.y,
                            };
                    
                            return canvas.library.math.distanceBetweenTwoPoints( {x:x,y:y},circleCentre ) <= shape.r;
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
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                            if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
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
                                this.extremities.points = canvas.library.math.pointsOfRect(this.x, this.y, this.width, this.height, -this.angle, this.anchor);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
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
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
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
                                    shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
                                };
                            
                            //adapt values
                                shapeValue.location = adapter.workspacePoint2windowPoint( (shapeValue.location.x - this.anchor.x*shapeValue.width), (shapeValue.location.y - this.anchor.y*shapeValue.height) );              
                                shapeValue.width = adapter.length(shapeValue.width);
                                shapeValue.height = adapter.length(shapeValue.height);
                                shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //post adaptation calculations
                                shapeValue.location = canvas.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                    
                            //if this image url is not cached; cache it
                                if( !imageObject.hasOwnProperty(this.url) ){
                                    imageObject[this.url] = new Image(); 
                                    imageObject[this.url].src = this.url;
                                }
                    
                            //actual render
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
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
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
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
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                            
                            //collect and consolidate shape values into a neat package
                                var shapeValue = {
                                    points: this.points.map( function(a){
                                        a = canvas.library.math.cartesianAngleAdjust(a.x,a.y,offset.a);
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
                                this.extremities.points = canvas.library.math.pointsOfRect(this.x, this.y, this.width, this.height, -this.angle, this.anchor);
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
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
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
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
                                shapeValue.location = canvas.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                                
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
                                        var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
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
                                            temp = canvas.library.math.boundingBoxFromPoints( temp );
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
                                            var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                                combinedOffset.x += point.x;
                                                combinedOffset.y += point.y;
                                            this.clippingStencil.computeExtremities(combinedOffset);
                                            this.extremities.points = this.clippingStencil.extremities.points;
                                    }
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined && rootCalculationElement){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
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
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
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
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    // this.group = function(){
                    
                    //     this.type = 'group';
                    
                    //     this.name = '';
                    //     this.ignored = false;
                    //     this.static = false;
                    //     this.parent = undefined;
                    //     this.dotFrame = false;
                    //     this.extremities = {
                    //         points:[],
                    //         boundingBox:{},
                    //     };
                    
                    //     this.x = 0;
                    //     this.y = 0;
                    //     this.angle = 0;
                    //     this.children = [];
                    
                    
                    //     this.parameter = {};
                    //     this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities(undefined,true);} }(this);
                    //     this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities(undefined,true);} }(this);
                    //     this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities(undefined,true);} }(this);
                    
                        
                    
                    //     this.getAddress = function(){
                    //         var address = '';
                    //         var tmp = this;
                    //         do{
                    //             address = tmp.name + '/' + address;
                    //         }while((tmp = tmp.parent) != undefined)
                    
                    //         return '/'+address;
                    //     };
                        
                    //     function checkElementIsValid(group,element){
                    //         if(element == undefined){return group.getAddress()+' >> no element provided';}
                    
                    //         //check for name
                    //             if(element.name == undefined || element.name == ''){return group.getAddress()+' >> element has no name'}
                        
                    //         //check that the name is not already taken in this grouping
                    //             for(var a = 0; a < group.children.length; a++){
                    //                 if( group.children[a].name == element.name ){ 
                    //                     return 'element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+group.name+'"'); 
                    //                 }
                    //             }
                    //     }
                    //     this.prepend = function(element){
                    //         //check that the element is valid
                    //             var temp = checkElementIsValid(this,element);
                    //             if(temp != undefined){console.error('element invalid:',temp); return;}
                    
                    //         //actually add the element
                    //             this.children.unshift(element);
                    
                    //         //inform element of who it's parent is
                    //             element.parent = this;
                    
                    //         //computation of extremities
                    //             element.computeExtremities(undefined,true);
                    //     };
                    //     this.append = function(element){
                    //         //check that the element is valid
                    //             var temp = checkElementIsValid(this, element);
                    //             if(temp != undefined){console.error('element invalid:',temp); return;}
                    
                    //         //actually add the element
                    //             this.children.push(element);
                    
                    //         //inform element of who it's parent is
                    //             element.parent = this;
                    
                    //         //computation of extremities
                    //             element.computeExtremities(undefined,true);
                    //     };
                    //     this.remove = function(element){
                    //         //check that an element was provided
                    //             if(element == undefined){return;}
                    
                    //         //get index of element (if this element isn't in the group, just bail)
                    //             var index = this.children.indexOf(element);
                    //             if(index < 0){return;}
                    
                    //         //actual removal
                    //             this.children.splice(index, 1);
                    
                    //         //computation of extremities
                    //             this.computeExtremities();
                    //     };
                    //     this.clear = function(){
                    //         //empty out children
                    //             this.children = [];
                    
                    //         //computation of extremities
                    //             this.computeExtremities();
                    //     };
                    //     this.getChildByName = function(name){
                    //         for(var a = 0; a < this.children.length; a++){
                    //             if( this.children[a].name == name ){ return this.children[a]; }
                    //         }
                    //     };
                    //     this.getElementsWithName = function(name){
                    //         var result = [];
                    //         for(var a = 0; a < this.children.length; a++){
                    //             if( this.children[a].name == name ){
                    //                 result.push(this.children[a]);
                    //             }
                    //             if( this.children[a].type == 'group' ){
                    //                 var list = this.children[a].getElementsWithName(name);
                    //                 for(var b = 0; b < list.length; b++){ result.push( list[b] ); } //because concat doesn't work
                    //             }
                    //         }
                    //         return result;
                    //     };
                    
                    //     this.getOffset = function(){return gatherParentOffset(this);};
                    //     this.computeExtremities = function(offset,deepCompute=false){
                    //         //root calculation element
                    //             var rootCalculationElement = offset == undefined;
                    
                    //         //discover if this shape should be static
                    //             var isStatic = this.static;
                    //             var tmp = this;
                    //             while((tmp = tmp.parent) != undefined && !isStatic){
                    //                 isStatic = isStatic || tmp.static;
                    //             }
                    //             this.static = isStatic;
                    
                    //         //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
                    //         //in which case; gather the offset of all parents. Otherwise just use what was provided
                    //             offset = offset == undefined ? gatherParentOffset(this) : offset;
                    
                    //         //if 'deepCompute' is set, recalculate the extremities for all children
                    //             if(deepCompute){
                    //                 //calculate offset to be sent down to this group's children
                    //                     var combinedOffset = { x: offset.x, y: offset.y, a: offset.a + this.angle };
                    //                     var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                    //                         combinedOffset.x += point.x;
                    //                         combinedOffset.y += point.y;
                    
                    //                 //request deep calculation from all children
                    //                     for(var a = 0; a < this.children.length; a++){
                    //                         this.children[a].computeExtremities(combinedOffset,true);
                    //                     }
                    //             }
                    
                    //         //reset variables
                    //             this.extremities = {
                    //                 points:[],
                    //                 boundingBox:{},
                    //             };
                    
                    //         //calculate points
                    //             //the points for a group, is just the four corners of the bounding box, calculated using
                    //             //the bounding boxes of all the children
                    //             //  -> this method needs to be trashed <-
                    //             var temp = [];
                    //             for(var a = 0; a < this.children.length; a++){
                    //                 temp.push(this.children[a].extremities.boundingBox.topLeft);
                    //                 temp.push(this.children[a].extremities.boundingBox.bottomRight);
                    //             }
                    //             temp = canvas.library.math.boundingBoxFromPoints( temp );
                    //             this.extremities.points = [
                    //                 { x: temp.topLeft.x,     y: temp.topLeft.y,     },
                    //                 { x: temp.bottomRight.x, y: temp.topLeft.y,     },
                    //                 { x: temp.bottomRight.x, y: temp.bottomRight.y, },
                    //                 { x: temp.topLeft.x,     y: temp.bottomRight.y, },
                    //             ];            
                    
                    //         //calculate boundingBox
                    //             this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                    //         //update the points and bounding box of the parent
                    //             if(this.parent != undefined && rootCalculationElement){
                    //                 this.parent.computeExtremities();
                    //             }
                    //     };
                    //     function isPointWithinBoundingBox(x,y,shape){
                    //         if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                    //         return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                    //     }
                    //     function isPointWithinHitBox(x,y,shape){
                    //         if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                    //         return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
                    //     }
                    //     this.isPointWithin = function(x,y){
                    //         if( isPointWithinBoundingBox(x,y,this) ){
                    //             return isPointWithinHitBox(x,y,this);
                    //         }
                    //         return false;
                    //     };
                    //     this.getElementUnderPoint = function(x,y,static=false,getList=false){
                    //         //go through the children in reverse order, discovering if
                    //         //  the object is not ignored and,
                    //         //  the point is within their bounding box
                    //         //if so; if it's a group, follow the 'getElementUnderPoint' function down
                    //         //if it's not, return that shape
                    //         //otherwise, carry onto the next shape
                    
                    //         var returnList = [];
                    
                    //         for(var a = this.children.length-1; a >= 0; a--){
                    //             //if child shape is static (or any of its parents), use adjusted x and y values for 'isPointWithin' judgement
                    //                 var point = (this.children[a].static || static) ? adapter.workspacePoint2windowPoint(x,y) : {x:x,y:y};
                    
                    //                 if( !this.children[a].ignored && this.children[a].isPointWithin(point.x,point.y) ){
                    //                     if( this.children[a].type == 'group' ){
                    //                         var temp = this.children[a].getElementUnderPoint(x,y,(this.children[a].static || static),getList);
                    //                         if(temp != undefined){
                    //                             if(getList){ returnList = returnList.concat(temp); }
                    //                             else{ return temp; }
                    //                         }
                    //                     }else{
                    //                         if(getList){ returnList.push(this.children[a]); }
                    //                         else{ return this.children[a]; }
                    //                     }
                    //                 }
                    //         }
                    
                    //         if(getList){return returnList;}
                    //     };
                    
                    //     function shouldRender(shape){
                    //         //if this shape is static, always render
                    //             if(shape.static){return true;}
                    
                    //         //if any of this shape's children are static, render the group (and let the individuals decide to render themselves or not)
                    //             for(var a = 0; a < shape.children.length; a++){ if(shape.children[a].static){return true;} }
                    
                    //         //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                    //             return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                    //     };
                    //     this.render = function(context,offset={x:0,y:0,a:0},static=false){
                    //         //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                    //             if(!shouldRender(this)){return;}
                    
                    //         //adjust offset for parent's angle
                    //             var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                    //             offset.x += point.x - this.x;
                    //             offset.y += point.y - this.y;
                    
                    //         //cycle through all children, activating their render functions
                    //             for(var a = 0; a < this.children.length; a++){
                    //                 var item = this.children[a];
                    
                    //                 item.render(
                    //                     context,
                    //                     {
                    //                         a: offset.a + this.angle,
                    //                         x: offset.x + this.x,
                    //                         y: offset.y + this.y,
                    //                         parentAngle: this.angle,
                    //                     },
                    //                     (static||item.static)
                    //                 );
                    //             }
                    
                    //         //if dotFrame is set, draw in dots fot the points and bounding box extremities
                    //             if(this.dotFrame){
                    //                 //points
                    //                     for(var a = 0; a < this.extremities.points.length; a++){
                    //                         var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                    //                         core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                    //                     }
                    //                 //boudning box
                    //                     var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                    //                     core.render.drawDot( temp.x, temp.y );
                    //                     var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                    //                     core.render.drawDot( temp.x, temp.y );
                    //             }
                    //     };
                    // };
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
                                this.extremities.points = canvas.library.math.pointsOfText( this.text, this.x, this.y, this.angle, 1/this.size, this.style.font, this.style.align, this.style.baseline );
                                this.extremities.points = this.extremities.points.map(function(point){
                                    point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                    
                            //calculate boundingBox
                                this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
                    
                            //update the points and bounding box of the parent
                                if(this.parent != undefined){
                                    this.parent.computeExtremities();
                                }
                        };
                    
                        function isPointWithinBoundingBox(x,y,shape){
                            if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
                        }
                        function isPointWithinHitBox(x,y,shape){
                            if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
                            return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
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
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false,isClipper=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
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
                                shapeValue.location = adapter.workspacePoint2windowPoint( shapeValue.location.x, shapeValue.location.y );   
                          
                                shapeValue.size = adapter.length(shapeValue.size);
                                shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
                                shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
                                shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);
                    
                            //post adaptation calculations
                                shapeValue.location = canvas.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);
                    
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
                                    //boudning box
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
                                var point = canvas.library.math.cartesianAngleAdjust(offsetList[a].x,offsetList[a].y,offsetList[a-1].a);
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
                        scale:1,
                        angle:0,
                        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
                        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
                    };
                    var mouseData = { 
                        x:undefined, 
                        y:undefined, 
                        stopScrollActive:false,
                    };
                
                    function adjustCanvasSize(){
                        var changesMade = false;
                
                        function dimensionAdjust(direction){
                            var Direction = direction.charAt(0).toUpperCase() + direction.slice(1)
                
                            var attribute = canvas.getAttribute('workspace'+Direction);
                            if( pageData[direction] != attribute || pageData['window'+Direction] != window['inner'+Direction] ){
                                //save values for future reference
                                    pageData[direction] = attribute;
                                    pageData['window'+Direction] = window['inner'+Direction];
                
                                //adjust canvas dimension based on the size requirement set out in the workspace attribute
                                    if(attribute == undefined){
                                        canvas[direction] = pageData.defaultSize[direction];
                                    }else if( attribute.indexOf('%') == (attribute.length-1) ){
                                        var parentSize = canvas.parentElement['offset'+Direction]
                                        var percent = parseFloat(attribute.slice(0,(attribute.length-1))) / 100;
                                        canvas[direction] = parentSize * percent;
                                    }else{
                                        canvas[direction] = attribute;
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
                            state.points.tr = adapter.windowPoint2workspacePoint(canvas.width,0);
                            state.points.bl = adapter.windowPoint2workspacePoint(0,canvas.height);
                            state.points.br = adapter.windowPoint2workspacePoint(canvas.width,canvas.height);
                        
                        //calculate a bounding box for the viewport from these points
                            state.boundingBox = canvas.library.math.boundingBoxFromPoints([state.points.tl, state.points.tr, state.points.br, state.points.bl]);
                    }
                
                    this.position = function(x,y){
                        if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
                        state.position.x = x;
                        state.position.y = y;
                        calculateViewportExtremities();
                    };
                    this.scale = function(s){
                        if(s == undefined){return state.scale;}
                        state.scale = s;
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
                        canvas.setAttribute('tabIndex',1); //enables keyboard input
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
                    this.cursor = function(type){
                        //cursor types: https://www.w3schools.com/csSref/tryit.asp?filename=trycss_cursor
                        if(type == undefined){return document.body.style.cursor;}
                        document.body.style.cursor = type;
                    };
                };
                this.render = new function(){
                    var context = canvas.getContext('2d', { alpha: true });
                    var animationRequestId = undefined;
                
                    function clearFrame(){
                        context.fillStyle = 'rgb(255,255,255)';
                        context.fillRect(0, 0, canvas.width, canvas.height);
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
                
                            this.rate = canvas.library.math.averageArray( this.frameTimeArray );
                
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
                                canvas[callbacks[a]] = function(callback){
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
                                canvas.onmouseover = function(event){
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
                                canvas.onmouseout = function(event){
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
                                canvas.onmousemove = function(event){
                                    var callback = 'onmousemove';
                
                                    //if core doesn't have this callback set up, just bail
                                        if( !core.callback[callback] ){return;}
                
                                    //convert the point
                                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                
                                    //update the stored mouse position (used in keydown callbacks)
                                        core.viewport.mousePosition(p.x,p.y);
                                    
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
                
                                canvas.onkeydown = function(event){
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
                                canvas.onkeyup = function(event){
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
                this.stopMouseScroll = function(bool){ return core.viewport.stopMouseScroll(bool); };
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
        canvas.system = new function(){};
        canvas.system.mouse = new function(){
            //setup
                this.tmp = {}; //for storing values
                this.functionList = {};
            
            //utility functions
                function activateShapeFunctions(listenerName, x,y,event,shape){
                    //starting with the shape under this point and climbing through all it's parents; look
                    //for 'listenerName' listeners. If one is found, activate it, stop climbing and return 'true'
                    //if no shape has a listener, return 'false'
            
                        var tmp = shape;
                        if(tmp == undefined){return false;}
                        do{
                            if( tmp[listenerName] != undefined ){ tmp[listenerName](x,y,event); return true; }
                        }while( (tmp = tmp.parent) != undefined )
            
                        return false;
                }
                this.mouseInteractionHandler = function(moveCode, stopCode){
                    //save the old listener functions of the canvas
                        canvas.system.mouse.tmp.onmousemove_old = canvas.onmousemove;
                        canvas.system.mouse.tmp.onmouseleave_old = canvas.onmouseleave;
                        canvas.system.mouse.tmp.onmouseup_old = canvas.onmouseup;
            
                    //replace listener code
                        //movement code
                            canvas.onmousemove = function(event){ if(moveCode!=undefined){moveCode(event);} };
                        //stopping code
                            canvas.onmouseup = function(event){
                                if(stopCode != undefined){ stopCode(event); }
                                canvas.onmousemove = canvas.system.mouse.tmp.onmousemove_old;
                                canvas.onmouseleave = canvas.system.mouse.tmp.onmouseleave_old;
                                canvas.onmouseup = canvas.system.mouse.tmp.onmouseup_old;
                            };
                            canvas.onmouseleave = canvas.onmouseup;
                };
                this.forceMouseUp = function(){ canvas.onmouseup(); };
                
            //connect callbacks to mouse function lists
                canvas.core.callback.onmousedown = function(x,y,event,shape){
                    if(activateShapeFunctions('onmousedown',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmousedown)({event:event,x:x,y:y});
                };
                canvas.core.callback.onmousemove = function(x,y,event,shape){
                    if(activateShapeFunctions('onmousemove',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmousemove)({event:event,x:x,y:y});
                };
                canvas.core.callback.onmouseup = function(x,y,event,shape){ 
                    if(activateShapeFunctions('onmouseup',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseup)({event:event,x:x,y:y});
                };
                canvas.core.callback.onmouseleave = function(x,y,event,shape){
                    if(activateShapeFunctions('onmouseleave',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseleave)({event:event,x:x,y:y});
                };
                canvas.core.callback.onmouseenter = function(x,y,event,shape){
                    if(activateShapeFunctions('onmouseenter',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseenter)({event:event,x:x,y:y});
                };
                canvas.core.callback.onwheel = function(x,y,event,shape){
                    if(activateShapeFunctions('onwheel',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onwheel)({event:event,x:x,y:y});
                };
                canvas.core.callback.onclick = function(x,y,event,shape){
                    if(activateShapeFunctions('onclick',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onclick)({event:event,x:x,y:y});
                };
                canvas.core.callback.ondblclick = function(x,y,event,shape){
                    if(activateShapeFunctions('ondblclick',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.ondblclick)({event:event,x:x,y:y});
                };
            
            //creating the function lists (and adding a few basic functions)
                this.functionList.onmousedown = [
                    {
                        'specialKeys':[],
                        'function':function(data){
            
                            //save the viewport position and click position
                                canvas.system.mouse.tmp.oldPosition = canvas.core.viewport.position();
                                canvas.system.mouse.tmp.clickPosition = {x:data.event.x, y:data.event.y};
            
                            //perform viewport movement
                                canvas.system.mouse.mouseInteractionHandler(
                                    function(event){
                                        //update the viewport position
                                            canvas.core.viewport.position(
                                                canvas.system.mouse.tmp.oldPosition.x - ((canvas.system.mouse.tmp.clickPosition.x-event.x) / canvas.core.viewport.scale()),
                                                canvas.system.mouse.tmp.oldPosition.y - ((canvas.system.mouse.tmp.clickPosition.y-event.y) / canvas.core.viewport.scale()),
                                            );
                                    },
                                    function(event){},
                                );
            
                            //request that the function list stop here
                                return true;
                        }
                    }
                ];
                this.functionList.onmousemove = [];
                this.functionList.onmouseup = [];
                this.functionList.onmouseleave = [];
                this.functionList.onmouseenter = [];
                this.functionList.onwheel = [
                {
                    'specialKeys':[],
                    'function':function(data){
                        var scaleLimits = {'max':20, 'min':0.1};
            
                        //perform scale and associated pan
                            //discover point under mouse
                                var originalPoint = {x:data.x, y:data.y};
                            //perform actual scaling
                                var scale = canvas.core.viewport.scale();
                                scale -= scale*(data.event.deltaY/100);
                                if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                                if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                                canvas.core.viewport.scale(scale);
                            //discover new point under mouse
                                var newPoint = canvas.core.viewport.windowPoint2workspacePoint(data.event.x,data.event.y);
                            //pan so we're back at the old point (accounting for angle)
                                var pan = canvas.library.math.cartesianAngleAdjust(
                                    (newPoint.x - originalPoint.x),
                                    (newPoint.y - originalPoint.y),
                                    canvas.core.viewport.angle()
                                );
                                var temp = canvas.core.viewport.position();
                                canvas.core.viewport.position(temp.x+pan.x,temp.y+pan.y)
            
                        //request that the function list stop here
                            return true;
                    }
                }
            ];
                this.functionList.onclick = [];
                this.functionList.ondblclick = [];

        };
        canvas.system.keyboard = new function(){
            //utility functions
                function activateShapeFunctions(listenerName, x,y,event,shape){
                    //starting with the shape under this point and climbing through all it's parents; look
                    //for 'listenerName' listeners. If one is found, activate it, stop climbing and return 'true'
                    //if no shape has a listener, return 'false'
            
                        var tmp = shape;
                        if(tmp == undefined){return false;}
                        do{
                            if( tmp[listenerName] != undefined ){ tmp[listenerName](x,y,event); return true; }
                        }while( (tmp = tmp.parent) != undefined )
            
                        return false;
                }
            
            
            canvas.core.callback.onkeydown = function(x,y,event,shape){
                //if key is already pressed, don't press it again
                    if(canvas.system.keyboard.pressedKeys[event.code]){ return; }
                    canvas.system.keyboard.pressedKeys[event.code] = true;
                
                //perform action
                    if(activateShapeFunctions('onkeydown',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeydown)(event,{x:x,y:y});
            };
            canvas.core.callback.onkeyup = function(x,y,event,shape){
                //if key isn't pressed, don't release it
                    if(!canvas.system.keyboard.pressedKeys[event.code]){return;}
                    delete canvas.system.keyboard.pressedKeys[event.code];
                
                //perform action
                    if(activateShapeFunctions('onkeyup',x,y,event,shape)){return;}
                    canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeyup)(event,{x:x,y:y});
            };
            
            this.releaseAll = function(){
                for(var a = 0; a < this.pressedKeys.length; a++){
                    this.releaseKey(this.pressedKeys[a]);
                }
            };
            this.releaseKey = function(keyCode){
                canvas.onkeyup( new KeyboardEvent('keyup',{'key':keyCode}) );
            }
            
            this.pressedKeys = {};
            
            this.functionList = {};
            this.functionList.onkeydown = [
                {
                    'specialKeys':[],
                    'function':function(event,data){}
                }
            ];
            this.functionList.onkeyup = [
                {
                    'specialKeys':[],
                    'function':function(event,data){}
                }
            ];
        };
        
        //add main panes to arrangement
        canvas.system.pane = {};
        
        //background
            canvas.system.pane.background = canvas.core.arrangement.createElement('group');
            canvas.system.pane.background.name = 'background'
            canvas.system.pane.background.static = true;
            canvas.system.pane.background.ignored = true;
            canvas.core.arrangement.append( canvas.system.pane.background );
        
        //middleground
            canvas.system.pane.middleground = canvas.core.arrangement.createElement('group');
            canvas.system.pane.middleground.name = 'middleground'
            canvas.core.arrangement.append( canvas.system.pane.middleground );
        
                //back
                    canvas.system.pane.middleground.back = canvas.core.arrangement.createElement('group');
                    canvas.system.pane.middleground.back.name = 'back'
                    canvas.system.pane.middleground.append( canvas.system.pane.middleground.back );
        
                //middle
                    canvas.system.pane.middleground.middle = canvas.core.arrangement.createElement('group');
                    canvas.system.pane.middleground.middle.name = 'middle'
                    canvas.system.pane.middleground.append( canvas.system.pane.middleground.middle );
        
                //front
                    canvas.system.pane.middleground.front = canvas.core.arrangement.createElement('group');
                    canvas.system.pane.middleground.front.name = 'front'
                    canvas.system.pane.middleground.append( canvas.system.pane.middleground.front );
        
        //foreground
            canvas.system.pane.foreground = canvas.core.arrangement.createElement('group');
            canvas.system.pane.foreground.name = 'foreground'
            canvas.system.pane.foreground.static = true;
            canvas.core.arrangement.append( canvas.system.pane.foreground );
        
        
            
        //shortcuts
            canvas.system.pane.b = canvas.system.pane.background;
            canvas.system.pane.mb = canvas.system.pane.middleground.back;
            canvas.system.pane.mm = canvas.system.pane.middleground.middle;
            canvas.system.pane.mf = canvas.system.pane.middleground.front;
            canvas.system.pane.f = canvas.system.pane.foreground;
        
        //utility
            canvas.system.pane.getMiddlegroundPane = function(element){
                var tmp = element;
                do{
                    if(tmp == canvas.system.pane.mb){return canvas.system.pane.mb;}
                    else if(tmp == canvas.system.pane.mm){return canvas.system.pane.mm;}
                    else if(tmp == canvas.system.pane.mf){return canvas.system.pane.mf;}
                }while((tmp=tmp.parent) != undefined);
            };
        
        canvas.core.viewport.stopMouseScroll(true);
        canvas.core.render.active(true);
        canvas.part = new function(){};
        
        canvas.part.circuit = new function(){
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
                        analyser.analyserNode = canvas.library.audio.context.createAnalyser();
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
            };

        };
        
        canvas.part.element = new function(){
            this.basic = new function(){
                this.polygon = function(
                    name=null, 
                    points=[], 
                    ignored=false,
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,0)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('polygon');
                    temp.name = name;
                    temp.points = points;
                    temp.ignored = ignored;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                
                    return temp;
                };
                
                this.advancedPolygon = function(
                    name=null, 
                    points=[], 
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,1)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('advancedPolygon');
                    temp.name = name;
                    temp.points = points;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                
                    return temp;
                };
                this.circle = function(
                    name=null, 
                    x=0, 
                    y=0, 
                    r=2,
                    ignored=false,
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,1)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('circle');
                    temp.name = name;
                    temp.x = x; temp.y = y;
                    temp.r = r;
                    temp.ignored = ignored;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                    return temp;
                };
                this.image = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, url=''){
                    var temp = canvas.core.arrangement.createElement('image');
                    temp.name = name;
                    temp.x = x; temp.y = y;
                    temp.width = width; temp.height = height;
                    temp.angle = angle;
                    temp.anchor = anchor;
                    temp.ignored = ignored;
                    temp.url = url;
                    return temp;
                };
                this.path = function(
                    name=null, 
                    points=[],
                    ignored=false,
                    strokeStyle='rgba(0,0,0,1)', 
                    lineWidth=1,
                    lineCap='butt',
                    lineJoin='miter',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('path');
                    temp.name = name;
                    temp.points = points;
                    temp.ignored = ignored;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineCap = lineCap;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                    
                    return temp;
                };
                this.rectangle = function(
                    name=null, 
                    x=0, 
                    y=0, 
                    width=10, 
                    height=10, 
                    angle=0,
                    anchor={x:0,y:0}, 
                    ignored=false,
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,0)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('rectangle');
                    temp.name = name;
                    temp.x = x; temp.y = y;
                    temp.width = width; temp.height = height;
                    temp.angle = angle;
                    temp.anchor = anchor;
                    temp.ignored = ignored;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                    return temp;
                };
                this.group = function(name=null, x=0, y=0, angle=0, ignored=false){
                    var temp = canvas.core.arrangement.createElement('group');
                    temp.name = name;
                    temp.x = x; 
                    temp.y = y;
                    temp.angle = angle;
                    temp.ignored = ignored;
                    return temp;
                };
                this.text = function(
                    name=null,
                    x=0,
                    y=0, 
                    text='Hello',
                    angle=0, 
                    anchor={x:0,y:0},
                    size=1,
                    ignored=false,
                    font='30pt Arial',
                    textAlign='start', //start/end/center/lief/right 
                    textBaseline='alphabetic', //alphabetic/top/hanging/middle/ideographic/bottom
                    fillStyle='rgba(255,100,255,1)', 
                    strokeStyle='rgba(0,0,0,0)', 
                    lineWidth=1,
                    lineJoin='round',
                    miterLimit=2,
                    shadowColour='rgba(0,0,0,0)',
                    shadowBlur=20,
                    shadowOffset={x:20, y:20},
                ){
                    var temp = canvas.core.arrangement.createElement('text');
                    temp.name = name;
                    temp.x = x; 
                    temp.y = y;
                    temp.text = text;
                    temp.angle = angle;
                    temp.anchor = anchor;
                    temp.size = size;
                    temp.ignored = ignored;
                    temp.style.font = font;
                    temp.style.align = textAlign;
                    temp.style.baseline = textBaseline;
                    temp.style.fill = fillStyle;
                    temp.style.stroke = strokeStyle;
                    temp.style.lineWidth = lineWidth;
                    temp.style.lineJoin = lineJoin;
                    temp.style.miterLimit = miterLimit;
                    temp.style.shadowColour = shadowColour;
                    temp.style.shadowBlur = shadowBlur;
                    temp.style.shadowOffset = shadowOffset;
                    return temp;
                };
            };
            
            this.display = new function(){
                this.rastorDisplay = function(
                    name='rastorDisplay',
                    x, y, angle=0, width=60, height=60,
                    xCount=8, yCount=8, xGappage=0.1, yGappage=0.1,
                    backing='rgba(50,50,50)', defaultPixelValue='rgba(0,0,0)',
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //backing
                            var rect = canvas.part.builder('rectangle','backing',{ width:width, height:height, style:{fill:backing} });
                            object.append(rect);
                        //pixels
                            var pixelGroup = canvas.part.builder('group','pixels');
                            object.append(pixelGroup);
                
                            var pixels = [];
                            var pixelValues = [];
                            var pixWidth = width/xCount;
                            var pixHeight = height/yCount;
                
                            for(var x = 0; x < xCount; x++){
                                var temp_pixels = [];
                                var temp_pixelValues = [];
                                for(var y = 0; y < yCount; y++){
                                    var rect = canvas.part.builder('rectangle',x+'_'+y,{ 
                                        x:(x*pixWidth)+xGappage/2,  y:(y*pixHeight)+yGappage/2, 
                                        width:pixWidth-xGappage,    height:pixHeight-yGappage,
                                        style:{fill:defaultPixelValue},
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
                                    pixels[x][y].style.fill = 'rgb('+255*pixelValues[x][y][0]+','+255*pixelValues[x][y][1]+','+255*pixelValues[x][y][2]+')';
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
                this.grapher_audioScope = function(
                    name='grapher_audioScope',
                    x, y, width=120, height=60, angle=0,
                
                    foregroundStyle={stroke:'rgba(0,255,0,1)', lineWidth:0.5, lineJoin:'round'},
                    foregroundTextStyle={fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
                
                    backgroundStyle_stroke='rgba(0,100,0,1)',
                    backgroundStyle_lineWidth=0.25,
                    backgroundTextStyle_fill='rgba(0,150,0,1)',
                    backgroundTextStyle_size=0.1,
                    backgroundTextStyle_font='Helvetica',
                
                    backingStyle='rgba(50,50,50,1)',
                ){
                    //attributes
                        var attributes = {
                            analyser:{
                                analyserNode: canvas.library.audio.context.createAnalyser(),
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
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //grapher
                            var grapher = canvas.part.builder('grapher',name,{
                                x:0, y:0, width:width, height:height,
                                foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                                backgroundStyle_stroke:backgroundStyle_stroke, 
                                backgroundStyle_lineWidth:backgroundStyle_lineWidth,
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
                    x, y, width=20, height=30,
                    backgroundStyle='rgb(0,0,0)',
                    glowStyle='rgb(200,200,200)',
                    dimStyle='rgb(20,20,20)'
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
                            var object = canvas.part.builder('group',name,{x:x, y:y});
                
                        //backing
                            var rect = canvas.part.builder('rectangle','backing',{ width:width, height:height, style:{fill:backgroundStyle} });
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
                                    segment: canvas.part.builder('polygon','segment_'+a,{points:points[a], style:{fill:dimStyle}}),
                                    state: false
                                };
                                segments.push( temp );
                                object.append( temp.segment );
                            }
                
                    //methods
                        object.set = function(segment,state){
                            segments[segment].state = state;
                            if(state){ segments[segment].segment.style.fill = glowStyle; }
                            else{ segments[segment].segment.style.fill = dimStyle; }
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
                                default:  stamp = [0,0,0,0,0,0,0]; break;
                            }
                
                            for(var a = 0; a < stamp.length; a++){
                                this.set(a, stamp[a]==1);
                            }
                        };
                
                    return object;
                };
                this.sixteenSegmentDisplay = function(
                    name='sixteenSegmentDisplay',
                    x, y, width=20, height=30,
                    backgroundStyle='rgb(0,0,0)',
                    glowStyle='rgb(200,200,200)',
                    dimStyle='rgb(20,20,20)'
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
                            var object = canvas.part.builder('group',name,{x:x, y:y});
                
                        //backing
                            var rect = canvas.part.builder('rectangle','backing',{ width:width, height:height, style:{fill:backgroundStyle} });
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
                                    segment: canvas.part.builder('polygon','segment_'+a,{points:points[a], style:{fill:dimStyle}}),
                                    state: false
                                };
                                segments.push( temp );
                                object.append( temp.segment );
                            }
                
                
                    //methods
                        object.set = function(segment,state){
                            segments[segment].state = state;
                            if(state){ segments[segment].segment.style.fill = glowStyle; }
                            else{ segments[segment].segment.style.fill = dimStyle; }
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
                
                
                    return object;      
                };
                this.glowbox_rect = function(
                    name='glowbox_rect',
                    x, y, width=30, height=30, angle=0,
                    glowStyle = 'rgba(244,234,141,1)',
                    dimStyle = 'rgba(80,80,80,1)'
                ){
                    //elements 
                        var object = canvas.part.builder('group',name,{x:x, y:y});
                        var rect = canvas.part.builder('rectangle','light',{ width:width, height:height, angle:angle, style:{fill:dimStyle} });
                            object.append(rect);
                
                    //methods
                        object.on = function(){
                            rect.style.fill = glowStyle;
                        };
                        object.off = function(){
                            rect.style.fill = dimStyle;
                        };
                
                    return object;
                };
                this.audio_meter_level = function(
                    name='audio_meter_level',
                    x, y, angle=0,
                    width=20, height=60,
                    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],
                
                    backingStyle='rgb(10,10,10)',
                    levelStyles=['rgba(250,250,250,1)','rgb(100,100,100)'],
                    markingStyle_fill='rgba(220,220,220,1)',
                    markingStyle_font='1pt Courier New',
                ){
                    //elements
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //meter
                            var meter = canvas.part.builder('meter_level','meter',{
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
                        var converter = canvas.part.circuit.audio.audio2percentage()
                        converter.newValue = function(val){object.set( val );};
                
                    //audio connections
                        object.audioIn = function(){ return converter.audioIn(); }
                
                    //methods
                        object.start = function(){ converter.start(); };
                        object.stop = function(){ converter.stop(); };
                
                    return object;
                };
                this.grapher = function(
                    name='grapher',
                    x, y, width=120, height=60, angle=0,
                
                    foregroundStyles=[
                        {stroke:'rgba(0,255,0,1)', lineWidth:0.5, lineJoin:'round'},
                        {stroke:'rgba(255,255,0,1)', lineWidth:0.5, lineJoin:'round'},
                    ],
                    foregroundTextStyles=[
                        {fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
                        {fill:'rgba(255,255,100,1)', size:0.75, font:'Helvetica'},
                    ],
                
                    backgroundStyle_stroke='rgba(0,100,0,1)',
                    backgroundStyle_lineWidth=0.25,
                    backgroundTextStyle_fill='rgba(0,150,0,1)',
                    backgroundTextStyle_size=0.1,
                    backgroundTextStyle_font='Helvetica',
                
                    backingStyle='rgba(50,50,50,1)',
                ){
                    var viewbox = {'bottom':-1,'top':1,'left':-1,'right':1};
                    var horizontalMarkings = { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
                    var verticalMarkings =   { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
                    var foregroundElementsGroup = [];
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //backing
                            var rect = canvas.part.builder('rectangle','backing',{ width:width, height:height, style:{fill:backingStyle} });
                            object.append(rect);
                        //background group
                            var backgroundGroup = canvas.part.builder( 'group', 'background' );
                            object.append(backgroundGroup);
                        //foreground group
                            var foregroundGroup = canvas.part.builder( 'group', 'foreground' );
                            object.append(foregroundGroup);
                        //stencil
                            var stencil = canvas.part.builder('rectangle','stencil',{width:width, height:height});
                            object.stencil(stencil);
                            object.clip(true);
                
                    //graphics
                        function drawBackground(){
                            backgroundGroup.clear();
                
                            //horizontal lines
                                //calculate the x value for all parts of this section
                                    var x = canvas.library.math.relativeDistance(width, viewbox.left,viewbox.right, horizontalMarkings.mappedPosition );
                
                                //add all horizontal markings
                                    for(var a = 0; a < horizontalMarkings.points.length; a++){
                                        //check if we should draw this line at all
                                            if( !(horizontalMarkings.points[a] < viewbox.top || horizontalMarkings.points[a] > viewbox.bottom) ){ continue; }
                        
                                        //calculate the y value for this section
                                            var y = height - canvas.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);
                
                                        //add line and text to group
                                            //lines
                                                var path = canvas.part.builder( 'rectangle', 'horizontal_line_'+a, {x:0,y:y,width:width,height:backgroundStyle_lineWidth,style:{fill:backgroundStyle_stroke}} );
                                                backgroundGroup.append(path);
                                            //text
                                                if( horizontalMarkings.printText ){
                                                    var text = canvas.part.builder( 'text', 'horizontal_text_'+a, {
                                                        x:x+horizontalMarkings.textPositionOffset.x, y:y+horizontalMarkings.textPositionOffset.y,
                                                        text:(horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                                        size:backgroundTextStyle_size,
                                                        style:{
                                                            fill:backgroundTextStyle_fill,
                                                            font:'15pt '+backgroundTextStyle_font
                                                        }
                                                    } );
                                                    backgroundGroup.append(text);
                                                }
                                    }
                
                            //vertical lines
                                //calculate the y value for all parts of this section
                                    var y = height - canvas.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, verticalMarkings.mappedPosition );
                
                                //add all vertical markings
                                    for(var a = 0; a < verticalMarkings.points.length; a++){
                                        //check if we should draw this line at all
                                            if( verticalMarkings.points[a] < viewbox.left || verticalMarkings.points[a] > viewbox.right ){ continue; }
                
                                        //calculate the x value for this section
                                            var x = canvas.library.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);
                
                                        //add line and text to group
                                            //lines
                                                var path = canvas.part.builder( 'rectangle', 'vertical_line_'+a, {x:x,y:0,width:backgroundStyle_lineWidth,height:height,style:{fill:backgroundStyle_stroke}} );
                                                backgroundGroup.append(path);
                                        
                                            //text
                                                if( verticalMarkings.printText ){
                                                    var text = canvas.part.builder( 'text', 'vertical_text_'+a, {
                                                        x:x+verticalMarkings.textPositionOffset.x, y:y+verticalMarkings.textPositionOffset.y,
                                                        text:(verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                                        size:backgroundTextStyle_size,
                                                        style:{
                                                            fill:backgroundTextStyle_fill,
                                                            font:'15pt '+backgroundTextStyle_font
                                                        }
                                                    } );
                                                    backgroundGroup.append(text);
                                            }
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
                                                    y: height - canvas.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true),
                                                } );
                                            }
                                        }else if( layer.y.length == layer.x.length ){ //straight print
                                            for(var a = 0; a < layer.y.length; a++){ 
                                                points.push( {
                                                    x:          canvas.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[a], true), 
                                                    y: height - canvas.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true),
                                                } );
                                            }
                                        }else{console.error('tell brandon about this -> grapher::',name,' ',layer.y,layer.x);}
                
                                    //create path shape and add it to the group
                                        foregroundGroup.append(
                                            canvas.part.builder( 'path', 'layer_'+L, { 
                                                points:points, 
                                                style:{
                                                    stroke: foregroundStyles[L].stroke,
                                                    lineWidth: foregroundStyles[L].lineWidth,
                                                    lineJoin: foregroundStyles[L].lineJoin,
                                                    lineCap: foregroundStyles[L].lineJoin,
                                                }
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
                
                    backingStyle='rgb(10,10,10)',
                    levelStyles=['rgba(250,250,250,1)','fill:rgb(100,100,100)'],
                    markingStyle_fill='rgba(220,220,220,1)',
                    markingStyle_font='1pt Courier New',
                ){
                
                    //elements
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //level
                            var level = canvas.part.builder('level','level',{
                                width:width, height:height,
                                style:{
                                    backing:backingStyle,
                                    levels:levelStyles,
                                },
                            });
                            object.append(level);
                
                        //markings
                            var marks = canvas.part.builder('group','markings');
                                object.append(marks);
                
                            function makeMark(y){
                                var markThickness = 0.2;
                                var path = [{x:width,y:y-markThickness/2},{x:width-width/4, y:y-markThickness/2},{x:width-width/4, y:y+markThickness/2},{x:width,y:y+markThickness/2}];  
                                return canvas.part.builder('polygon', 'mark_'+y, {points:path, style:{fill:markingStyle_fill}});
                            }
                            function insertText(y,text){
                                return canvas.part.builder('text', 'text_'+text, {x:0.5, y:y+0.3, text:text, style:{fill:markingStyle_fill,font:markingStyle_font}});
                            }
                
                            for(var a = 0; a < markings.length; a++){
                                marks.append( makeMark(height*(1-markings[a])) );
                                marks.append( insertText(height*(1-markings[a]),markings[a]) );
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
                this.grapher_periodicWave = function(
                    name='grapher_periodicWave',
                    x, y, width=120, height=60, angle=0,
                
                    foregroundStyle={stroke:'rgba(0,255,0,1)', lineWidth:0.5, lineJoin:'round'},
                    foregroundTextStyle={fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
                
                    backgroundStyle_stroke='rgba(0,100,0,1)',
                    backgroundStyle_lineWidth=0.25,
                    backgroundTextStyle_fill='rgba(0,150,0,1)',
                    backgroundTextStyle_size=0.1,
                    backgroundTextStyle_font='Helvetica',
                
                    backingStyle='rgba(50,50,50,1)',
                ){
                    var wave = {'sin':[],'cos':[]};
                    var resolution = 100;
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //grapher
                            var grapher = canvas.part.builder('grapher',name,{
                                x:0, y:0, width:width, height:height,
                                foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                                backgroundStyle_stroke:backgroundStyle_stroke, 
                                backgroundStyle_lineWidth:backgroundStyle_lineWidth,
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
                this.readout_sixteenSegmentDisplay = function(
                    name='readout_sixteenSegmentDisplay',
                    x, y, width=100, height=30, count=5, angle=0,
                    backgroundStyle='rgb(0,0,0)',
                    glowStyle='rgb(200,200,200)',
                    dimStyle='rgb(20,20,20)'
                ){
                    //values
                        var text = '';
                        var displayInterval = null;
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y});
                
                        //display units
                            var units = [];
                            for(var a = 0; a < count; a++){
                                var temp = canvas.part.builder('sixteenSegmentDisplay', ''+a, {
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
                this.level = function(
                    name='level',
                    x, y, angle=0,
                    width=20, height=60,
                    backingStyle='rgb(10,10,10)',
                    levelStyles=['rgb(250,250,250)','rgb(200,200,200)']
                ){
                    var values = [];
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //backing
                            var rect = canvas.part.builder('rectangle','backing',{ width:width, height:height, style:{fill:backingStyle} });
                                object.append(rect);
                        //levels
                            var levels = canvas.part.builder('group','levels');
                                object.append(levels);
                
                            var level = [];
                            for(var a = 0; a < levelStyles.length; a++){
                                values.push(0);
                                level.push( canvas.part.builder('rectangle','movingRect_'+a,{
                                    y:height,
                                    width:width, height:0,
                                    style:{fill:levelStyles[a]},
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
                
                                level[layer].parameter.height( height*value );
                                level[layer].parameter.y( height - height*value );
                            };
                
                    return object;
                };
            };
            
            this.control = new function(){
                this.rastorgrid = function(
                    name='rastorgrid', 
                    x, y, width=80, height=80, angle=0,
                    xcount=5, ycount=5,
                    backingStyle = 'rgba(200,200,200,1)',
                    checkStyle = 'rgba(150,150,150,1)',
                    backingGlowStyle = 'rgba(220,220,220,1)',
                    checkGlowStyle = 'rgba(220,220,220,1)',
                    onchange = function(){},
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        
                        //checkboxes
                            for(var y = 0; y < ycount; y++){
                                for(var x = 0; x < xcount; x++){
                                    var temp = canvas.part.builder('checkbox_rect',y+'_'+x,{
                                        x:x*(width/xcount),  y:y*(height/ycount), 
                                        width:width/xcount,  height:height/ycount, 
                                        style:{ check:checkStyle, backing:backingStyle, checkGlow:checkGlowStyle, backingGlow:backingGlowStyle },
                                        onchange:function(){ if(object.onchange){object.onchange(object.get());} },
                                    });
                                    object.append(temp);
                                }
                            }
                
                
                
                
                    //methods
                        object.box = function(x,y){ return object.getChildByName(y+'_'+x); };
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
                        object.onchange = onchange;
                
                    return object;
                };
                this.needleOverlay = function(
                    name='needleOverlay',
                    x, y, width=120, height=60, angle=0, needleWidth=0.003125, selectNeedle=true, selectionArea=true,
                    needleStyles=[
                        'rgba(240, 240, 240, 1)',
                        'rgba(255, 231, 114, 1)'
                    ],
                    onchange=function(needle,value){}, 
                    onrelease=function(needle,value){}, 
                    selectionAreaToggle=function(bool){},
                ){
                    var needleData = {};
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //backing
                            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
                            object.append(backing);
                        //control objects
                            var controlObjectsGroup = canvas.part.builder('group','controlObjectsGroup');
                            object.append(controlObjectsGroup);
                                var controlObjectsGroup_back = canvas.part.builder('group','back');
                                controlObjectsGroup.append(controlObjectsGroup_back);
                                var controlObjectsGroup_front = canvas.part.builder('group','front');
                                controlObjectsGroup.append(controlObjectsGroup_front);
                
                
                            var invisibleHandleWidth = width*needleWidth + width*0.005;
                            var controlObjects = {};
                            //lead
                                controlObjects.lead = canvas.part.builder('group','lead');
                                controlObjects.lead.append( canvas.part.builder('rectangle','handle',{
                                    width:needleWidth*width,
                                    height:height,
                                    style:{ fill:needleStyles[0] },
                                }));
                                controlObjects.lead.append( canvas.part.builder('rectangle','invisibleHandle',{
                                    x:(width*needleWidth - invisibleHandleWidth)/2, 
                                    width:invisibleHandleWidth,
                                    height:height,
                                    style:{ fill:'rgba(255,0,0,0)' },
                                }));
                            //selection_A
                                controlObjects.selection_A = canvas.part.builder('group','selection_A');
                                controlObjects.selection_A.append( canvas.part.builder('rectangle','handle',{
                                    width:needleWidth*width,
                                    height:height,
                                    style:{fill:needleStyles[1]},
                                }));
                                controlObjects.selection_A.append( canvas.part.builder('rectangle','invisibleHandle',{
                                    x:(width*needleWidth - invisibleHandleWidth)/2, 
                                    width:invisibleHandleWidth,height:height,
                                    style:{fill:'rgba(255,0,0,0)'},
                                }));
                            //selection_B
                                controlObjects.selection_B = canvas.part.builder('group','selection_B');
                                controlObjects.selection_B.append( canvas.part.builder('rectangle','handle',{
                                    width:needleWidth*width,
                                    height:height,
                                    style:{fill:needleStyles[1]},
                                }));
                                controlObjects.selection_B.append( canvas.part.builder('rectangle','invisibleHandle',{
                                    x:(width*needleWidth - invisibleHandleWidth)/2, 
                                    width:invisibleHandleWidth,height:height,
                                    style:{fill:'rgba(255,0,0,0)'},
                                }));
                            //selection_area
                                controlObjects.selection_area = canvas.part.builder('rectangle','selection_area',{
                                    height:height,
                                    style:{fill:canvas.library.misc.blendColours(needleStyles[1],'rgba(0,0,0,0)',0.5)},
                                });
                
                    //internal functions
                        object.__calculationAngle = angle;
                        var leadNeedle_grappled = false;
                        var selectionArea_grappled = false;
                        var selectionNeedleA_grappled = false;
                        var selectionNeedleB_grappled = false;
                        function currentMousePosition_x(event){
                            return event.x*Math.cos(object.__calculationAngle) - event.y*Math.sin(object.__calculationAngle);
                        }
                        function needleJumpTo(needle,location){
                            var group = needle == 'lead' ? controlObjectsGroup_front : controlObjectsGroup_back;
                
                            //if the location is wrong, remove the needle and return
                                if(location == undefined || location < 0 || location > 1){
                                    group.remove(controlObjects[needle]);
                                    delete needleData[needle];
                                    return;
                                }
                
                            //if the needle isn't in the scene, add it
                                if( !group.contains(controlObjects[needle]) ){
                                    group.append(controlObjects[needle]);
                                }
                
                            //actually set the location of the needle (adjusting for the size of needle)
                                controlObjects[needle].parameter.x( location*width - width*needleWidth*location );
                            //save this value
                                needleData[needle] = location;
                        }
                        function computeSelectionArea(){
                            //if the selection needles' data are missing (or they are the same position) remove the area element and return
                                if(needleData.selection_A == undefined || needleData.selection_B == undefined || needleData.selection_A == needleData.selection_B){
                                    controlObjectsGroup_back.remove(controlObjects.selection_area);
                                    if(object.selectionAreaToggle){object.selectionAreaToggle(false);}
                                    delete needleData.selection_area;
                                    return;
                                }
                
                            //if the area isn't in the scene, add it
                                if( !controlObjectsGroup_back.contains(controlObjects.selection_area) ){
                                    controlObjectsGroup_back.append(controlObjects.selection_area);
                                    if(object.selectionAreaToggle){object.selectionAreaToggle(true);}
                                }
                
                            //compute area position and size
                                if(needleData.selection_A < needleData.selection_B){
                                    var A = needleData.selection_A;
                                    var B = needleData.selection_B;
                                }else{
                                    var A = needleData.selection_B;
                                    var B = needleData.selection_A;
                                }
                                var start = A - needleWidth*A + needleWidth
                                var area = B - needleWidth*B - start; 
                                if(area < 0){area = 0}
                
                                controlObjects.selection_area.parameter.x(width*start);
                                controlObjects.selection_area.parameter.width(width*area);
                        }
                        function select(position,update=true){
                            if(!selectNeedle){return;}
                            //if there's no input, return the value
                            //if input is out of bounds, remove the needle
                            //otherwise, set the position
                            if(position == undefined){ return needleData.lead; }
                            else if(position > 1 || position < 0){ needleJumpTo('lead'); }
                            else{ needleJumpTo('lead',position); }
                
                            if(update && object.onchange != undefined){object.onchange('lead',position);}
                        }
                        function area(positionA,positionB,update=true){
                            if(!selectionArea){return;}
                
                            //if there's no input, return the values
                            //if input is out of bounds, remove the needles
                            //otherwise, set the position
                                if(positionA == undefined || positionB == undefined){
                                    return {A:needleData.selection_A, B:needleData.selection_B};
                                }else if(positionA > 1 || positionA < 0 || positionB > 1 || positionB < 0 ){
                                    needleJumpTo('selection_A');
                                    needleJumpTo('selection_B');
                                }else{
                                    needleJumpTo('selection_A',positionA);
                                    needleJumpTo('selection_B',positionB);
                                }
                
                            //you always gotta compute the selection area
                                computeSelectionArea();
                
                            if(update && object.onchange != undefined){object.onchange('selection_A',positionA);}
                            if(update && object.onchange != undefined){object.onchange('selection_B',positionB);}
                        }
                
                    //interaction
                        //generic onmousedown code for interaction
                            backing.onmousedown = function(x,y,event){};
                            controlObjects.lead.getChildByName('invisibleHandle').onmouseenter = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
                            controlObjects.lead.getChildByName('invisibleHandle').onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};
                            controlObjects.lead.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
                                leadNeedle_grappled = true;
                
                                var initialValue = needleData.lead;
                                var initialX = currentMousePosition_x(event);
                                var mux = width - width*needleWidth;
                
                                canvas.system.mouse.mouseInteractionHandler(
                                    function(event){
                                        var numerator = initialX - currentMousePosition_x(event);
                                        var divider = canvas.core.viewport.scale();
                                        var location = initialValue - numerator/(divider*mux);
                                        location = location < 0 ? 0 : location;
                                        location = location > 1 ? 1 : location;
                                        select(location);
                                    },
                                    function(event){
                                        var numerator = initialX - currentMousePosition_x(event);
                                        var divider = canvas.core.viewport.scale();
                                        var location = initialValue - numerator/(divider*mux);
                                        location = location < 0 ? 0 : location;
                                        location = location > 1 ? 1 : location;
                                        leadNeedle_grappled = false;
                                        select(location);
                                        if(object.onrelease != undefined){object.onrelease('lead',location);}
                                    },       
                                );
                            };
                
                            controlObjects.selection_A.getChildByName('invisibleHandle').onmouseenter = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
                            controlObjects.selection_A.getChildByName('invisibleHandle').onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};
                            controlObjects.selection_A.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
                                selectionNeedleA_grappled = true;
                
                                var initialValue = needleData.selection_A;
                                var initialX = currentMousePosition_x(event);
                                var mux = width - width*needleWidth;
                
                                canvas.system.mouse.mouseInteractionHandler(
                                    function(event){
                                        var numerator = initialX - currentMousePosition_x(event);
                                        var divider = canvas.core.viewport.scale();
                                        var location = initialValue - numerator/(divider*mux);
                                        location = location < 0 ? 0 : location;
                                        location = location > 1 ? 1 : location;
                                        area(location,needleData.selection_B);
                                    },
                                    function(event){
                                        var numerator = initialX - currentMousePosition_x(event);
                                        var divider = canvas.core.viewport.scale();
                                        var location = initialValue - numerator/(divider*mux);
                                        location = location < 0 ? 0 : location;
                                        location = location > 1 ? 1 : location;
                                        selectionNeedleA_grappled = false;
                                        area(location,needleData.selection_B);
                                        if(object.onrelease != undefined){object.onrelease('selection_A',location);}
                                    },       
                                );
                            };
                
                            controlObjects.selection_B.getChildByName('invisibleHandle').onmouseenter = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
                            controlObjects.selection_B.getChildByName('invisibleHandle').onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};
                            controlObjects.selection_B.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
                                selectionNeedleB_grappled = true;
                
                                var initialValue = needleData.selection_B;
                                var initialX = currentMousePosition_x(event);
                                var mux = width - width*needleWidth;
                
                                canvas.system.mouse.mouseInteractionHandler(
                                    function(event){
                                        var numerator = initialX - currentMousePosition_x(event);
                                        var divider = canvas.core.viewport.scale();
                                        var location = initialValue - numerator/(divider*mux);
                                        location = location < 0 ? 0 : location;
                                        location = location > 1 ? 1 : location;
                                        area(needleData.selection_A,location);
                                    },
                                    function(event){
                                        var numerator = initialX - currentMousePosition_x(event);
                                        var divider = canvas.core.viewport.scale();
                                        var location = initialValue - numerator/(divider*mux);
                                        location = location < 0 ? 0 : location;
                                        location = location > 1 ? 1 : location;
                                        selectionNeedleB_grappled = false;
                                        area(needleData.selection_A,location);
                                        if(object.onrelease != undefined){object.onrelease('selection_B',location);}
                                    },       
                                );
                            };
                
                            controlObjects.selection_area.onmouseenter = function(x,y,event){canvas.core.viewport.cursor('grab');};
                            controlObjects.selection_area.onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};
                            controlObjects.selection_area.onmousedown = function(x,y,event){
                                canvas.core.viewport.cursor('grabbing');
                                selectionArea_grappled = true;
                
                                var areaSize = needleData.selection_B - needleData.selection_A;
                                var initialValues = {A:needleData.selection_A, B:needleData.selection_B};
                                var initialX = currentMousePosition_x(event);
                                var mux = width - width*needleWidth;
                
                                canvas.system.mouse.mouseInteractionHandler(
                                    function(event){
                                        var numerator = initialX - currentMousePosition_x(event);
                                        var divider = canvas.core.viewport.scale();
                
                                        var location = {
                                            A: initialValues.A - numerator/(divider*mux),
                                            B: initialValues.B - numerator/(divider*mux),
                                        };
                
                                        if( location.A > 1 ){ location.A = 1; location.B = 1 + areaSize; }
                                        if( location.B > 1 ){ location.B = 1; location.A = 1 - areaSize; }
                                        if( location.A < 0 ){ location.A = 0; location.B = areaSize; }
                                        if( location.B < 0 ){ location.B = 0; location.A = -areaSize; }
                
                                        area(location.A,location.B);
                                    },
                                    function(event){
                                        canvas.core.viewport.cursor('grab');
                                        var numerator = initialX - currentMousePosition_x(event);
                                        var divider = canvas.core.viewport.scale();
                
                                        var location = {
                                            A: initialValues.A - numerator/(divider*mux),
                                            B: initialValues.B - numerator/(divider*mux),
                                        };
                
                                        if( location.A > 1 ){ location.A = 1; location.B = 1 + areaSize; }
                                        if( location.B > 1 ){ location.B = 1; location.A = 1 - areaSize; }
                                        if( location.A < 0 ){ location.A = 0; location.B = areaSize; }
                                        if( location.B < 0 ){ location.B = 0; location.A = -areaSize; }
                
                                        selectionArea_grappled = false;
                                        area(location.A,location.B);
                                        if(object.onrelease != undefined){object.onrelease('selection_A',location.A);}
                                        if(object.onrelease != undefined){object.onrelease('selection_B',location.B);}
                                    },
                                );
                
                                
                            };
                
                        //doubleclick to destroy selection area
                            controlObjects.selection_A.ondblclick = function(x,y,event,shape){ area(-1,-1); };
                            controlObjects.selection_B.ondblclick = controlObjects.selection_A.ondblclick;
                            controlObjects.selection_area.ondblclick = controlObjects.selection_A.ondblclick;
                    
                    //control
                        object.select = function(position,update=true){
                            if(position == undefined){return select();}
                
                            if(leadNeedle_grappled){return;}
                            select(position,update);
                        };
                        object.area = function(positionA,positionB,update=true){
                            if(positionA == undefined && positionB == undefined){ return area(); }
                            if(selectionArea_grappled){return;}
                            if(positionA != undefined && selectionNeedleA_grappled){return;}
                            if(positionB != undefined && selectionNeedleB_grappled){return;}
                            area(positionA,positionB,update);
                        };
                
                    //callback
                        object.onchange = onchange;
                        object.onrelease = onrelease;
                        object.selectionAreaToggle = selectionAreaToggle;
                        
                    return object;
                };
                this.button_rect = function(
                    name='button_rect',
                    x, y, width=30, height=20, angle=0,
                    text_centre='button', text_left='', text_right='',
                    textVerticalOffsetMux=0.5, textHorizontalOffsetMux=0.05,
                    
                    active=true, hoverable=true, selectable=false, pressable=true,
                
                    text_font = '5pt Arial',
                    text_textBaseline = 'alphabetic',
                    text_fill = 'rgba(0,0,0,1)',
                    text_stroke = 'rgba(0,0,0,0)',
                    text_lineWidth = 1,
                
                    backing__off__fill=                          'rgba(180,180,180,1)',
                    backing__off__stroke=                        'rgba(0,0,0,0)',
                    backing__off__lineWidth=                     0,
                    backing__up__fill=                           'rgba(200,200,200,1)',
                    backing__up__stroke=                         'rgba(0,0,0,0)',
                    backing__up__lineWidth=                      0,
                    backing__press__fill=                        'rgba(230,230,230,1)',
                    backing__press__stroke=                      'rgba(0,0,0,0)',
                    backing__press__lineWidth=                   0,
                    backing__select__fill=                       'rgba(200,200,200,1)',
                    backing__select__stroke=                     'rgba(120,120,120,1)',
                    backing__select__lineWidth=                  0.75,
                    backing__select_press__fill=                 'rgba(230,230,230,1)',
                    backing__select_press__stroke=               'rgba(120,120,120,1)',
                    backing__select_press__lineWidth=            0.75,
                    backing__glow__fill=                         'rgba(220,220,220,1)',
                    backing__glow__stroke=                       'rgba(0,0,0,0)',
                    backing__glow__lineWidth=                    0,
                    backing__glow_press__fill=                   'rgba(250,250,250,1)',
                    backing__glow_press__stroke=                 'rgba(0,0,0,0)',
                    backing__glow_press__lineWidth=              0,
                    backing__glow_select__fill=                  'rgba(220,220,220,1)',
                    backing__glow_select__stroke=                'rgba(120,120,120,1)',
                    backing__glow_select__lineWidth=             0.75,
                    backing__glow_select_press__fill=            'rgba(250,250,250,1)',
                    backing__glow_select_press__stroke=          'rgba(120,120,120,1)',
                    backing__glow_select_press__lineWidth=       0.75,
                    backing__hover__fill=                        'rgba(220,220,220,1)',
                    backing__hover__stroke=                      'rgba(0,0,0,0)',
                    backing__hover__lineWidth=                   0,
                    backing__hover_press__fill=                  'rgba(240,240,240,1)',
                    backing__hover_press__stroke=                'rgba(0,0,0,0)',
                    backing__hover_press__lineWidth=             0,
                    backing__hover_select__fill=                 'rgba(220,220,220,1)',
                    backing__hover_select__stroke=               'rgba(120,120,120,1)',
                    backing__hover_select__lineWidth=            0.75,
                    backing__hover_select_press__fill=           'rgba(240,240,240,1)',
                    backing__hover_select_press__stroke=         'rgba(120,120,120,1)',
                    backing__hover_select_press__lineWidth=      0.75,
                    backing__hover_glow__fill=                   'rgba(240,240,240,1)',
                    backing__hover_glow__stroke=                 'rgba(0,0,0,0)',
                    backing__hover_glow__lineWidth=              0,
                    backing__hover_glow_press__fill=             'rgba(250,250,250,1)',
                    backing__hover_glow_press__stroke=           'rgba(0,0,0,0)',
                    backing__hover_glow_press__lineWidth=        0,
                    backing__hover_glow_select__fill=            'rgba(240,240,240,1)',
                    backing__hover_glow_select__stroke=          'rgba(120,120,120,1)',
                    backing__hover_glow_select__lineWidth=       0.75,
                    backing__hover_glow_select_press__fill=      'rgba(250,250,250,1)',
                    backing__hover_glow_select_press__stroke=    'rgba(120,120,120,1)',
                    backing__hover_glow_select_press__lineWidth= 0.75,
                
                    onenter = function(event){},
                    onleave = function(event){},
                    onpress = function(event){},
                    ondblpress = function(event){},
                    onrelease = function(event){},
                    onselect = function(event){},
                    ondeselect = function(event){},
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        
                        //backing
                            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{
                                fill:backing__off__fill,
                                stroke:backing__off__stroke,
                                lineWidth:backing__off__lineWidth,
                            }});
                            object.append(backing);
                
                        //text
                            var text_centre = canvas.part.builder('text','centre', {
                                x:width/2, 
                                y:height*textVerticalOffsetMux, 
                                text:text_centre, 
                                style:{
                                    font:text_font,
                                    testBaseline:text_textBaseline,
                                    fill:text_fill,
                                    stroke:text_stroke,
                                    lineWidth:text_lineWidth,
                                    textAlign:'center',
                                    textBaseline:'middle',
                                }
                            });
                            object.append(text_centre);
                            var text_left = canvas.part.builder('text','left',     {
                                x:width*textHorizontalOffsetMux, 
                                y:height*textVerticalOffsetMux, 
                                text:text_left, 
                                style:{
                                    font:text_font,
                                    testBaseline:text_textBaseline,
                                    fill:text_fill,
                                    stroke:text_stroke,
                                    lineWidth:text_lineWidth,
                                    textAlign:'left',
                                    textBaseline:'middle',
                                }
                            });
                            object.append(text_left);
                            var text_right = canvas.part.builder('text','right',   {
                                x:width-(width*textHorizontalOffsetMux), 
                                y:height*textVerticalOffsetMux, 
                                text:text_right, 
                                style:{
                                    font:text_font,
                                    testBaseline:text_textBaseline,
                                    fill:text_fill,
                                    stroke:text_stroke,
                                    lineWidth:text_lineWidth,
                                    textAlign:'right',
                                    textBaseline:'middle',
                                }
                            });
                            object.append(text_right);
                
                        //cover
                            var cover = canvas.part.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
                            object.append(cover);
                
                
                
                
                    //state
                        object.state = {
                            hovering:false,
                            glowing:false,
                            selected:false,
                            pressed:false,
                        };
                
                        function activateGraphicalState(){
                            if(!active){ 
                                backing.style.fill = backing__off__fill;
                                backing.style.stroke = backing__off__stroke;
                                backing.style.lineWidth = backing__off__lineWidth;
                                return;
                            }
                
                            var styles = [
                                { fill:backing__up__fill,                      stroke:backing__up__stroke,                      lineWidth:backing__up__lineWidth                      },
                                { fill:backing__press__fill,                   stroke:backing__press__stroke,                   lineWidth:backing__press__lineWidth                   },
                                { fill:backing__select__fill,                  stroke:backing__select__stroke,                  lineWidth:backing__select__lineWidth                  },
                                { fill:backing__select_press__fill,            stroke:backing__select_press__stroke,            lineWidth:backing__select_press__lineWidth            },
                                { fill:backing__glow__fill,                    stroke:backing__glow__stroke,                    lineWidth:backing__glow__lineWidth                    },
                                { fill:backing__glow_press__fill,              stroke:backing__glow_press__stroke,              lineWidth:backing__glow_press__lineWidth              },
                                { fill:backing__glow_select__fill,             stroke:backing__glow_select__stroke,             lineWidth:backing__glow_select__lineWidth             },
                                { fill:backing__glow_select_press__fill,       stroke:backing__glow_select_press__stroke,       lineWidth:backing__glow_select_press__lineWidth       },
                                { fill:backing__hover__fill,                   stroke:backing__hover__stroke,                   lineWidth:backing__hover__lineWidth                   },
                                { fill:backing__hover_press__fill,             stroke:backing__hover_press__stroke,             lineWidth:backing__hover_press__lineWidth             },
                                { fill:backing__hover_select__fill,            stroke:backing__hover_select__stroke,            lineWidth:backing__hover_select__lineWidth            },
                                { fill:backing__hover_select_press__fill,      stroke:backing__hover_select_press__stroke,      lineWidth:backing__hover_select_press__lineWidth      },
                                { fill:backing__hover_glow__fill,              stroke:backing__hover_glow__stroke,              lineWidth:backing__hover_glow__lineWidth              },
                                { fill:backing__hover_glow_press__fill,        stroke:backing__hover_glow_press__stroke,        lineWidth:backing__hover_glow_press__lineWidth        },
                                { fill:backing__hover_glow_select__fill,       stroke:backing__hover_glow_select__stroke,       lineWidth:backing__hover_glow_select__lineWidth       },
                                { fill:backing__hover_glow_select_press__fill, stroke:backing__hover_glow_select_press__stroke, lineWidth:backing__hover_glow_select_press__lineWidth },
                            ];
                
                            if(!hoverable && object.state.hovering ){ object.state.hovering = false; }
                            if(!selectable && object.state.selected ){ object.state.selected = false; }
                
                            var i = object.state.hovering*8 + object.state.glowing*4 + object.state.selected*2 + (pressable && object.state.pressed)*1;
                            backing.style.fill =       styles[i].fill;
                            backing.style.stroke =     styles[i].stroke;
                            backing.style.lineWidth =  styles[i].lineWidth;
                        };
                        activateGraphicalState();
                
                
                
                
                    //control
                        object.press = function(event){
                            if(!active){return;}
                
                            if( pressable ){
                                if(this.state.pressed){return;}
                                this.state.pressed = true;
                                if(this.onpress){this.onpress(this, event);}
                            }
                            
                            this.select( !this.select(), event );
                
                            activateGraphicalState();
                        };
                        object.release = function(event){
                            if(!active || !pressable){return;}
                
                            if(!this.state.pressed){return;}
                            this.state.pressed = false;
                            activateGraphicalState();
                            if(this.onrelease){this.onrelease(this, event);}
                        };
                        object.active = function(bool){ if(bool == undefined){return active;} active = bool; activateGraphicalState(); };
                        object.glow = function(bool){   if(bool == undefined){return this.state.glowing;}  this.state.glowing = bool;  activateGraphicalState(); };
                        object.select = function(bool,event,callback=true){ 
                            if(!active){return;}
                
                            if(bool == undefined){return this.state.selected;}
                            if(!selectable){return;}
                            if(this.state.selected == bool){return;}
                            this.state.selected = bool; activateGraphicalState();
                            if(callback){ if( this.state.selected ){ this.onselect(this,event); }else{ this.ondeselect(this,event); } }
                        };
                
                
                
                
                    //interactivity
                        cover.onmouseenter = function(x,y,event){
                            object.state.hovering = true;  
                            activateGraphicalState();
                            if(object.onenter){object.onenter(event);}
                            if(event.buttons == 1){cover.onmousedown(event);} 
                        };
                        cover.onmouseleave = function(x,y,event){ 
                            object.state.hovering = false; 
                            object.release(event); 
                            activateGraphicalState(); 
                            if(object.onleave){object.onleave(event);}
                        };
                        cover.onmouseup = function(x,y,event){   object.release(event); };
                        cover.onmousedown = function(x,y,event){ object.press(event); };
                        cover.ondblclick = function(x,y,event){ if(!active){return;} if(object.ondblpress){object.ondblpress(event);} };
                        
                
                
                
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
                this.checkbox_rect = function(
                    name='checkbox_rect',
                    x, y, width=20, height=20, angle=0,
                    checkStyle = 'rgba(150,150,150,1)',
                    backingStyle = 'rgba(200,200,200,1)',
                    checkGlowStyle = 'rgba(220,220,220,1)',
                    backingGlowStyle = 'rgba(220,220,220,1)',
                    onchange = function(){},
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        
                        //backing
                            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
                            object.append(backing);
                        //check
                            var checkrect = canvas.part.builder('rectangle','checkrect',{x:width*0.1,y:height*0.1,width:width*0.8,height:height*0.8, style:{fill:'rgba(0,0,0,0)'}});
                            object.append(checkrect);
                        //cover
                            var cover = canvas.part.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
                            object.append(cover);
                
                
                
                
                
                    //state
                        var state = {
                            checked:false,
                            glowing:false,
                        }
                
                        function updateGraphics(){
                            if(state.glowing){
                                backing.style.fill = backingGlowStyle;
                                checkrect.style.fill = state.checked ? checkGlowStyle : 'rgba(0,0,0,0)';
                            }else{
                                backing.style.fill = backingStyle;
                                checkrect.style.fill = state.checked ? checkStyle : 'rgba(0,0,0,0)';
                            }
                        }
                
                
                
                
                    //methods
                        object.get = function(){ return state.checked; };
                        object.set = function(value, update=true){
                            state.checked = value;
                            
                            updateGraphics();
                    
                            if(update&&this.onchange){ this.onchange(value); }
                        };
                        object.light = function(state){
                            if(state == undefined){ return state.glowing; }
                
                            state.glowing = state;
                
                            updateGraphics();
                        };
                
                
                
                
                    //interactivity
                        cover.onclick = function(event){
                            object.set(!object.get());
                        };
                        cover.onmousedown = function(){};
                
                
                
                
                    //callbacks
                        object.onchange = onchange;
                
                    return object;
                };
                this.slide = function(
                    name='slide', 
                    x, y, width=10, height=95, angle=0,
                    handleHeight=0.1, value=0, resetValue=-1,
                    handleStyle = 'rgba(200,200,200,1)',
                    backingStyle = 'rgba(150,150,150,1)',
                    slotStyle = 'rgba(50,50,50,1)',
                    invisibleHandleStyle = 'rgba(255,0,0,0)',
                    onchange=function(){},
                    onrelease=function(){},
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //backing and slot group
                            var backingAndSlot = canvas.part.builder('group','backingAndSlotGroup');
                            object.append(backingAndSlot);
                            //backing
                                var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
                                backingAndSlot.append(backing);
                            //slot
                                var slot = canvas.part.builder('rectangle','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), style:{fill:slotStyle}});
                                backingAndSlot.append(slot);
                            //backing and slot cover
                                var backingAndSlotCover = canvas.part.builder('rectangle','backingAndSlotCover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
                                backingAndSlot.append(backingAndSlotCover);
                        //handle
                            var handle = canvas.part.builder('rectangle','handle',{width:width, height:height*handleHeight, style:{fill:handleStyle}});
                            object.append(handle);
                        //invisible handle
                            var invisibleHandleHeight = height*handleHeight + height*0.01;
                            var invisibleHandle = canvas.part.builder('rectangle','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, style:{fill:invisibleHandleStyle}});
                            object.append(invisibleHandle);
                
                
                
                
                    //graphical adjust
                        function set(a,update=true){
                            a = (a>1 ? 1 : a);
                            a = (a<0 ? 0 : a);
                
                            if(update && object.onchange != undefined){object.onchange(a);}
                            
                            value = a;
                            handle.y = a*height*(1-handleHeight);
                            invisibleHandle.y = a*height*(1-handleHeight);
                
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
                
                
                
                
                    //interaction
                        object.ondblclick = function(){
                            if(resetValue<0){return;}
                            if(grappled){return;}
                
                            set(resetValue);
                            if(object.onrelease != undefined){object.onrelease(value);}
                        };
                        object.onwheel = function(){
                            if(grappled){return;}
                
                            var move = event.deltaY/100;
                            var globalScale = canvas.core.viewport.scale();
                            set( value + move/(10*globalScale) );
                            if(object.onrelease != undefined){object.onrelease(value);}
                        };
                        backingAndSlot.onclick = function(x,y,event){
                            if(grappled){return;}
                
                            //calculate the distance the click is from the top of the slider (accounting for angle)
                                var offset = backingAndSlot.getOffset();
                                var delta = {
                                    x: x - (backingAndSlot.x     + offset.x),
                                    y: y - (backingAndSlot.y     + offset.y),
                                    a: 0 - (backingAndSlot.angle + offset.a),
                                };
                                var d = canvas.library.math.cartesianAngleAdjust( delta.x, delta.y, delta.a ).y / backingAndSlotCover.height;
                
                            //use the distance to calculate the correct value to set the slide to
                            //taking into account the slide handle's size also
                                var value = d + 0.5*handleHeight*((2*d)-1);
                
                            set(value);
                            if(object.onrelease != undefined){object.onrelease(value);}
                        };
                        invisibleHandle.onmousedown = function(x,y,event){
                            grappled = true;
                
                            var initialValue = value;
                            var initialY = currentMousePosition(event);
                            var mux = height - height*handleHeight;
                
                            canvas.system.mouse.mouseInteractionHandler(
                                function(event){
                                    var numerator = initialY-currentMousePosition(event);
                                    var divider = canvas.core.viewport.scale();
                                    set( initialValue - numerator/(divider*mux) );
                                },
                                function(event){
                                    var numerator = initialY-currentMousePosition(event);
                                    var divider = canvas.core.viewport.scale();
                                    object.onrelease(initialValue - numerator/(divider*mux));
                                    grappled = false;
                                }
                            );
                        };
                
                
                
                
                    //callbacks
                        object.onchange = onchange; 
                        object.onrelease = onrelease;
                
                    return object;
                };
                this.dial_continuous = function(
                    name='dial_continuous',
                    x, y, r=15, angle=0,
                    value=0, resetValue=-1,
                    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
                
                    handleStyle = 'rgba(200,200,200,1)',
                    slotStyle = 'rgba(50,50,50,1)',
                    needleStyle = 'rgba(250,100,100,1)',
                
                    onchange=function(){},
                    onrelease=function(){},
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        
                        //slot
                            var slot = canvas.part.builder('circle','slot',{r:r*1.1, style:{fill:slotStyle}});
                            object.append(slot);
                
                        //handle
                            var handle = canvas.part.builder('circle','handle',{r:r, style:{fill:handleStyle}});
                                object.append(handle);
                
                        //needle group
                            var needleGroup = canvas.part.builder('group','needleGroup',{ignored:true});
                            object.append(needleGroup);
                
                            //needle
                                var needleWidth = r/5;
                                var needleLength = r;
                                var needle = canvas.part.builder('rectangle','needle',{x:needleLength/3, y:-needleWidth/2, height:needleWidth, width:needleLength, style:{fill:needleStyle}});
                                    needleGroup.append(needle);
                
                
                
                
                    //graphical adjust
                        function set(a,update=true){
                            a = (a>1 ? 1 : a);
                            a = (a<0 ? 0 : a);
                
                            if(update && object.change != undefined){object.onchange(a);}
                
                            value = a;
                            needleGroup.parameter.angle(startAngle + maxAngle*value);
                        }
                
                
                
                
                    //methods
                        var grappled = false;
                
                        object.set = function(value,update){
                            if(grappled){return;}
                            set(value,update);
                        };
                        object.get = function(){return value;};
                
                
                
                
                    //interaction
                        var turningSpeed = r*4;
                        
                        handle.ondblclick = function(){
                            if(resetValue<0){return;}
                            if(grappled){return;}
                            
                            set(resetValue); 
                
                            if(object.onrelease != undefined){object.onrelease(value);}
                        };
                        handle.onwheel = function(x,y,event){
                            if(grappled){return;}
                            
                            var move = event.deltaY/100;
                            var globalScale = canvas.core.viewport.scale();
                            set( value - move/(10*globalScale) );
                
                            if(object.onrelease != undefined){object.onrelease(value);}
                        };
                        handle.onmousedown = function(x,y,event){
                            var initialValue = value;
                            var initialY = event.y;
                
                            grappled = true;
                            canvas.system.mouse.mouseInteractionHandler(
                                function(event){
                                    var value = initialValue;
                                    var numerator = event.y - initialY;
                                    var divider = canvas.core.viewport.scale();
                                    set( value - numerator/(divider*turningSpeed), true );
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
                        set(0);
                
                    return object;
                };
                this.slidePanel = function(
                    name='slidePanel', 
                    x, y, width=80, height=95, angle=0,
                    handleHeight=0.1, count=8, startValue=0, resetValue=0.5,
                    handleStyle = 'rgba(200,200,200,1)',
                    backingStyle = 'rgba(150,150,150,1)',
                    slotStyle = 'rgba(50,50,50,1)'
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //slides
                            for(var a = 0; a < count; a++){
                                var temp = canvas.part.builder(
                                    'slide', 'slide_'+a, {
                                        x:a*(width/count), y:0,
                                        width:width/count, height:height,
                                        value:startValue, resetValue:resetValue,
                                        style:{handle:handleStyle, backing:backingStyle, slot:slotStyle},
                                        function(value){ object.onchange(this.id,value); },
                                        function(value){ object.onrelease(this.id,value); },
                                    }
                                );
                                // temp.dotFrame = true;
                                temp.__calculationAngle = angle;
                                object.append(temp);
                            }
                
                    return object;
                };
                this.sequencer = function(
                    name='sequencer',
                    x, y, width=300, height=100, angle=0,
                    
                    xCount=64, yCount=16,
                    zoomLevel_x=1/2, zoomLevel_y=1/2,
                
                    backingStyle='rgba(20,20,20,1)',
                    selectionAreaStyle='rgba(209, 189, 222, 0.5)',
                
                    signalStyle_body=[
                        {fill:'rgba(138,138,138,0.6)', stroke:'rgba(175,175,175,0.95)', lineWidth:0.5},
                        {fill:'rgba(130,199,208,0.6)', stroke:'rgba(130,199,208,0.95)', lineWidth:0.5},
                        {fill:'rgba(129,209,173,0.6)', stroke:'rgba(129,209,173,0.95)', lineWidth:0.5},
                        {fill:'rgba(234,238,110,0.6)', stroke:'rgba(234,238,110,0.95)', lineWidth:0.5},
                        {fill:'rgba(249,178,103,0.6)', stroke:'rgba(249,178,103,0.95)', lineWidth:0.5},
                        {fill:'rgba(255, 69, 69,0.6)', stroke:'rgba(255, 69, 69,0.95)', lineWidth:0.5},
                    ],
                    signalStyle_bodyGlow=[
                        {fill:'rgba(138,138,138,0.8)', stroke:'rgba(175,175,175,1)', lineWidth:0.5},
                        {fill:'rgba(130,199,208,0.8)', stroke:'rgba(130,199,208,1)', lineWidth:0.5},
                        {fill:'rgba(129,209,173,0.8)', stroke:'rgba(129,209,173,1)', lineWidth:0.5},
                        {fill:'rgba(234,238,110,0.8)', stroke:'rgba(234,238,110,1)', lineWidth:0.5},
                        {fill:'rgba(249,178,103,0.8)', stroke:'rgba(249,178,103,1)', lineWidth:0.5},
                        {fill:'rgba(255, 69, 69,0.8)', stroke:'rgba(255, 69, 69,1)', lineWidth:0.5},
                    ],    
                    signalStyle_handle='rgba(200,0,0,0)',
                    signalStyle_handleWidth=3,
                
                    horizontalStripStyle_pattern=[0,1],
                    horizontalStripStyle_glow={fill:'rgba(120,120,120,0.8)', stroke:'rgba(120,120,120,1)', lineWidth:0.5},
                    horizontalStripStyle_styles=[
                        {fill:'rgba(120,120,120,0.5)', stroke:'rgba(120,120,120,1)', lineWidth:0.5},
                        {fill:'rgba(100,100,100,  0)', stroke:'rgba(120,120,120,1)', lineWidth:0.5},
                    ],
                    verticalStripStyle_pattern=[0],
                    verticalStripStyle_glow={fill:'rgba(229, 221, 112,0.25)', stroke:'rgba(252,244,128,0.5)', lineWidth:0.5},
                    verticalStripStyle_styles=[
                        {fill:'rgba(30,30,30,0.5)', stroke:'rgba(120,120,120,1)', lineWidth:0.5},
                    ],
                
                    playheadStyle='rgb(240, 240, 240)',
                
                    onpan=function(data){},
                    onchangeviewarea=function(data){},
                    event=function(events){},
                ){
                
                    //settings
                        const viewport = {
                            totalSize:{
                                width:  width/zoomLevel_x,
                                height: height/zoomLevel_y,
                            },
                            viewposition: {x:0,y:0},
                            viewArea:{
                                topLeft:     {x:0, y:0},
                                bottomRight: {x:zoomLevel_x, y:zoomLevel_y},
                            }
                        };
                        const signals = {
                            step:1/1,
                            snapping: true,
                            defaultStrength: 0.5,
                            selectedSignals: [],
                            activeSignals: [],
                            signalRegistry: new canvas.library.structure.signalRegistry(xCount,yCount),
                        };
                        const loop = {
                            active:false, 
                            period:{
                                start:0, 
                                end:xCount
                            },
                        };
                        const playhead = {
                            present:false,
                            width:0.75,
                            invisibleHandleMux:4,
                            position:-1,
                            held:false,
                            automoveViewposition:false,
                        };
                
                
                
                
                    
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //static backing
                            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
                            object.append(backing);
                        //viewport stencil
                            var stencil = canvas.part.builder('rectangle','stencil',{width:width, height:height});
                            object.stencil(stencil);
                            object.clip(true);
                
                        //workarea
                            var workarea = canvas.part.builder('group','workarea');
                            object.append(workarea);
                            //moveable background
                                var backgroundDrawArea = canvas.part.builder('group','backgroundDrawArea');
                                workarea.append(backgroundDrawArea);
                                var backgroundDrawArea_horizontal = canvas.part.builder('group','backgroundDrawArea_horizontal');
                                backgroundDrawArea.append(backgroundDrawArea_horizontal);
                                var backgroundDrawArea_vertical = canvas.part.builder('group','backgroundDrawArea_vertical');
                                backgroundDrawArea.append(backgroundDrawArea_vertical);
                            //interaction pane back
                                var interactionPlane_back = canvas.part.builder('rectangle','interactionPlane_back',{width:viewport.totalSize.width, height:viewport.totalSize.height, style:{fill:'rgba(0,0,0,0)'}});
                                workarea.append(interactionPlane_back);
                                interactionPlane_back.onwheel = function(x,y,event){};
                            //signal block area
                                var signalPane = canvas.part.builder('group','signalPane');
                                workarea.append(signalPane);
                            //interaction pane back
                                var interactionPlane_front = canvas.part.builder('rectangle','interactionPlane_front',{width:viewport.totalSize.width, height:viewport.totalSize.height, style:{fill:'rgba(0,0,0,0)'}});
                                workarea.append(interactionPlane_front);
                                interactionPlane_front.onwheel = function(x,y,event){};
                    //internal
                        object.__calculationAngle = angle;
                        function currentMousePosition(event){
                            var workspacePoint = canvas.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                            var point = {
                                x: workspacePoint.x - backing.extremities.points[0].x, 
                                y: workspacePoint.y - backing.extremities.points[0].y,
                            };
                            return {
                                x: (point.x*Math.cos(object.__calculationAngle) - point.y*Math.sin(object.__calculationAngle)) / width,
                                y: (point.y*Math.cos(object.__calculationAngle) - point.x*Math.sin(object.__calculationAngle)) / height,
                            };
                        }
                        function viewportPosition2internalPosition(xy){
                            return {x: viewport.viewArea.topLeft.x + xy.x*zoomLevel_x, y:viewport.viewArea.topLeft.y + xy.y*zoomLevel_y };
                        }
                        function visible2coordinates(xy){
                            return {
                                x: zoomLevel_x*(xy.x - viewport.viewposition.x) + viewport.viewposition.x,
                                y: zoomLevel_y*(xy.y - viewport.viewposition.y) + viewport.viewposition.y,
                            };
                        }
                        function coordinates2lineposition(xy){
                            xy.y = Math.floor(xy.y*yCount);
                            if(xy.y >= yCount){xy.y = yCount-1;}
                        
                            xy.x = signals.snapping ? Math.round((xy.x*xCount)/signals.step)*signals.step : xy.x*xCount;
                            if(xy.x < 0){xy.x =0;}
                        
                            return {line:xy.y, position:xy.x};
                        }
                        function drawBackground(){
                            //horizontal strips
                                backgroundDrawArea_horizontal.clear();
                                for(var a = 0; a < yCount; a++){
                                    var style = horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]];
                                    backgroundDrawArea_horizontal.append(
                                        canvas.part.builder( 'rectangle', 'strip_horizontal_'+a,
                                            {
                                                x:0, y:a*(height/(yCount*zoomLevel_y)),
                                                width:viewport.totalSize.width, height:height/(yCount*zoomLevel_y),
                                                style:{ fill:style.fill, stroke:style.stroke, lineWidth:style.lineWidth }
                                            }
                                        )
                                    );
                                }
                
                            //vertical strips
                                backgroundDrawArea_vertical.clear();
                                for(var a = 0; a < xCount; a++){
                                    var style = verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]];
                                    backgroundDrawArea_vertical.append(
                                        canvas.part.builder( 'rectangle', 'strip_vertical_'+a,
                                            {
                                                x:a*(width/(xCount*zoomLevel_x)), y:0,
                                                width:width/(xCount*zoomLevel_x), height:viewport.totalSize.height,
                                                style:{ fill:style.fill, stroke:style.stroke, lineWidth:style.lineWidth }
                                            }
                                        )
                                    );
                                }
                        }
                        function setViewposition(x,y,update=true){
                            if(x == undefined && y == undefined){return viewport.viewposition;}
                            if(x == undefined || isNaN(x)){ x = viewport.viewposition.x; }
                            if(y == undefined || isNaN(y)){ y = viewport.viewposition.y; }
                
                            //make sure things are between 0 and 1
                                x = x<0?0:x; x = x>1?1:x;
                                y = y<0?0:y; y = y>1?1:y;
                
                            //perform transform
                                viewport.viewposition.x = x;
                                viewport.viewposition.y = y;
                                workarea.parameter.x( -viewport.viewposition.x*(viewport.totalSize.width - width) );
                                workarea.parameter.y( -viewport.viewposition.y*(viewport.totalSize.height - height) );
                
                            //update viewport.viewArea
                                viewport.viewArea = {
                                    topLeft:     { x:x - zoomLevel_x*x,     y:y - zoomLevel_y*y     },
                                    bottomRight: { x:x + zoomLevel_x*(1-x), y:y + zoomLevel_y*(1-y) },
                                };
                        }
                        function adjustZoom(x,y){
                            if(x == undefined && y == undefined){return {x:zoomLevel_x, y:zoomLevel_y};}
                            var maxZoom = 0.01;
                
                            //(in a bid for speed, I've written the following code in an odd way, so that if both x and y scales are being changed, then
                            //all the elements will be adjusted together (instead of having to repeat resizings of shapes))
                            if(x != undefined && x != zoomLevel_x && y != undefined && y != zoomLevel_y ){
                                //make sure things are between 0.01 and 1
                                    x = x<maxZoom?maxZoom:x; x = x>1?1:x;
                                    y = y<maxZoom?maxZoom:y; y = y>1?1:y;
                
                                //update state
                                    zoomLevel_x = x;
                                    zoomLevel_y = y;
                                    viewport.totalSize.width = width/zoomLevel_x;
                                    viewport.totalSize.height = height/zoomLevel_y;
                
                                //update interactionPlane_back
                                    interactionPlane_back.parameter.width( viewport.totalSize.width );
                                    interactionPlane_back.parameter.height( viewport.totalSize.width );
                
                                //update background strips
                                    for(var a = 0; a < xCount; a++){
                                        backgroundDrawArea_vertical.children[a].parameter.x( a*(width/(xCount*zoomLevel_x)) );
                                        backgroundDrawArea_vertical.children[a].parameter.width( width/(xCount*zoomLevel_x) );
                                        backgroundDrawArea_vertical.children[a].parameter.height( viewport.totalSize.height );
                                    }
                                    for(var a = 0; a < yCount; a++){
                                        backgroundDrawArea_horizontal.children[a].parameter.y( a*(height/(yCount*zoomLevel_y)) );
                                        backgroundDrawArea_horizontal.children[a].parameter.height( height/(yCount*zoomLevel_y) );
                                        backgroundDrawArea_horizontal.children[a].parameter.width( viewport.totalSize.width );
                                    }
                
                                //update signals
                                    for(var a = 0; a < signalPane.children.length; a++){
                                        signalPane.children[a].unit(width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y));
                                    }
                
                                //update playhead (if there is one)
                                    if(playhead.present){
                                        workarea.getElementsWithName('playhead')[0].getElementsWithName('main')[0].parameter.height(viewport.totalSize.height);
                                        workarea.getElementsWithName('playhead')[0].getElementsWithName('invisibleHandle')[0].parameter.height(viewport.totalSize.height);
                                        workarea.getElementsWithName('playhead')[0].parameter.x( playhead.position*(viewport.totalSize.width/xCount) );
                                }
                            }else if( x != undefined && x != zoomLevel_x ){
                                //make sure things are between maxZoom and 1
                                    x = x<maxZoom?maxZoom:x; x = x>1?1:x;
                
                                //update state
                                    zoomLevel_x = x;
                                    viewport.totalSize.width = width/zoomLevel_x;
                
                                //update interactionPlane_back
                                    interactionPlane_back.parameter.width( viewport.totalSize.width );
                
                                //update background strips
                                    for(var a = 0; a < xCount; a++){
                                        backgroundDrawArea_vertical.children[a].parameter.x( a*(width/(xCount*zoomLevel_x)) );
                                        backgroundDrawArea_vertical.children[a].parameter.width( width/(xCount*zoomLevel_x) );
                                    }
                                    for(var a = 0; a < yCount; a++){
                                        backgroundDrawArea_horizontal.children[a].parameter.width( viewport.totalSize.width );
                                    }
                
                                //update signals
                                    for(var a = 0; a < signalPane.children.length; a++){
                                        signalPane.children[a].unit(width/(xCount*zoomLevel_x), undefined);
                                    }
                
                                //update playhead (if there is one)
                                    if(playhead.present){
                                        workarea.getElementsWithName('playhead')[0].parameter.x( playhead.position*(viewport.totalSize.width/xCount) );
                                    }
                            }else if( y != undefined && y != zoomLevel_y ){
                                //make sure things are between maxZoom and 1
                                    y = y<maxZoom?maxZoom:y; y = y>1?1:y;
                
                                //update state
                                    zoomLevel_y = y;
                                    viewport.totalSize.height = height/zoomLevel_y;
                
                                //update interactionPlane_back
                                    interactionPlane_back.parameter.height( viewport.totalSize.width );
                                
                                //update background strips
                                    for(var a = 0; a < xCount; a++){
                                        backgroundDrawArea_vertical.children[a].parameter.height( viewport.totalSize.height );
                                    }
                                    for(var a = 0; a < yCount; a++){
                                        backgroundDrawArea_horizontal.children[a].parameter.y( a*(height/(yCount*zoomLevel_y)) );
                                        backgroundDrawArea_horizontal.children[a].parameter.height( height/(yCount*zoomLevel_y) );
                                    }
                
                                //update signals
                                    for(var a = 0; a < signalPane.children.length; a++){
                                        signalPane.children[a].unit(undefined, height/(yCount*zoomLevel_y));
                                    }
                
                                //update playhead (if there is one)
                                    if(playhead.present){
                                        workarea.getElementsWithName('playhead')[0].getElementsWithName('main')[0].parameter.height(viewport.totalSize.height);
                                        workarea.getElementsWithName('playhead')[0].getElementsWithName('invisibleHandle')[0].parameter.height(viewport.totalSize.height);
                                    }
                            }
                        }
                        function setViewArea(d,update=true){
                            //clean off input
                                if(d == undefined || (d.topLeft == undefined && d.bottomRight == undefined)){return viewport.viewArea;}
                                if(d.topLeft == undefined){ d.topLeft.x = viewport.viewArea.topLeft.x; d.topLeft.y = viewport.viewArea.topLeft.y; }
                                if(d.bottomRight == undefined){ d.bottomRight.x = viewport.viewArea.topLeft.x; d.bottomRight.y = viewport.viewArea.topLeft.y; }
                
                            //first adjust the zoom, if the distance between the areas changed
                                var x = (viewport.viewArea.bottomRight.x-viewport.viewArea.topLeft.x) != (d.bottomRight.x-d.topLeft.x);
                                var y = (d.bottomRight.y-d.topLeft.y)!=(viewport.viewArea.bottomRight.y-viewport.viewArea.topLeft.y);
                                
                                if(x && y){ adjustZoom( (d.bottomRight.x-d.topLeft.x),(d.bottomRight.y-d.topLeft.y) ); }
                                else if(x){ adjustZoom( (d.bottomRight.x-d.topLeft.x),undefined ); }
                                else if(y){ adjustZoom( undefined,(d.bottomRight.y-d.topLeft.y) ); }
                
                            //update pan
                                var newX = 0; var newY = 0;
                                if( (1-(d.bottomRight.x-d.topLeft.x)) != 0 ){ newX = d.topLeft.x + d.topLeft.x*((d.bottomRight.x-d.topLeft.x)/(1-(d.bottomRight.x-d.topLeft.x))); }
                                if( (1-(d.bottomRight.y-d.topLeft.y)) != 0 ){ newY = d.topLeft.y + d.topLeft.y*((d.bottomRight.y-d.topLeft.y)/(1-(d.bottomRight.y-d.topLeft.y))); }
                                setviewport.viewposition(newX,newY,update);
                
                            //update state
                                viewport.viewArea = Object.assign(d,{});
                        }
                        // function makePlayhead(){
                        //     var newPlayhead = canvas.part.builder('group','playhead');
                        //     workarea.append(newPlayhead);
                
                        //     newPlayhead.main = canvas.part.builder('rectangle','main',{
                        //         width:playhead.width,
                        //         height:viewport.totalSize.height,
                        //         style:{ fill:playheadStyle },
                        //     });
                        //     newPlayhead.append(newPlayhead.main);
                
                        //     newPlayhead.invisibleHandle = canvas.part.builder('rectangle','invisibleHandle',{
                        //         x:-playhead.width*playhead.invisibleHandleMux/2 + playhead.width/2, 
                        //         width: playhead.width*playhead.invisibleHandleMux,
                        //         height:viewport.totalSize.height,
                        //         style:{ fill:'rgba(255,0,0,0.5)' },
                        //     })
                        //     newPlayhead.append(newPlayhead.invisibleHandle);
                
                        //     newPlayhead.invisibleHandle.onmousedown = function(){
                        //         playhead.held = true;
                        //         canvas.system.mouse.mouseInteractionHandler(
                        //             function(event){ object.playheadPosition( coordinates2lineposition(currentMousePosition()).position ); },
                        //             function(){playhead.held = false;}
                        //         );
                        //     };
                
                        //     newPlayhead.invisibleHandle.onmouseenter = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
                        //     newPlayhead.invisibleHandle.onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};
                
                        //     playhead.present = true;
                        // }
                        function makeSignal(line, position, length, strength=signals.defaultStrength){
                            //register signal and get new id. From the registry, get the approved signal values
                                var newID = signals.signalRegistry.add({ line:line, position:position, length:length, strength:strength });
                                var approvedData = signals.signalRegistry.getSignal(newID);
                
                            //create graphical signal with approved values and append it to the pane
                                var newSignalBlock = canvas.part.element.control.sequencer.signalBlock(
                                    newID, width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y), 
                                    approvedData.line, approvedData.position, approvedData.length, approvedData.strength, 
                                    false, signalStyle_body, signalStyle_bodyGlow, signalStyle_handle, signalStyle_handleWidth
                                );
                                signalPane.append(newSignalBlock);
                
                            //add signal controls to graphical signal block
                                newSignalBlock.select = function(remainSelected=false){
                                    if(signals.selectedSignals.indexOf(this) != -1){ if(!remainSelected){this.deselect();} return; }
                                    this.selected(true);
                                    signals.selectedSignals.push(this);
                                    this.glow(true);
                                };
                                newSignalBlock.deselect = function(){
                                    signals.selectedSignals.splice(signals.selectedSignals.indexOf(this),1);
                                    this.selected(false);
                                    this.glow(false);
                                };
                                newSignalBlock.delete = function(){
                                    this.deselect();
                                    signals.signalRegistry.remove(parseInt(this.name));
                                    this.parent.remove(this);
                                };
                
                            //add interactions to graphical signal block
                                newSignalBlock.ondblclick = function(x,y,event){
                                    if(!event.ctrlKey){return;}
                                    for(var a = 0; a < signals.selectedSignals.length; a++){
                                        signals.selectedSignals[a].strength(signals.defaultStrength);
                                        signals.signalRegistry.update(parseInt(signals.selectedSignals[a].name), {strength: signals.defaultStrength});
                                    }
                                };
                                newSignalBlock.body.onmousedown = function(x,y,event){
                                    //if spacebar is pressed; ignore all of this, and redirect to the interaction pane (for panning)
                                        if(canvas.system.keyboard.pressedKeys.hasOwnProperty('Space') && canvas.system.keyboard.pressedKeys){
                                            interactionPlane_back.onmousedown(x,y,event); return;
                                        }
                
                                    //if the shift key is not pressed and this note is not already selected; deselect everything
                                        if(!event.shiftKey && !newSignalBlock.selected()){
                                            while(signals.selectedSignals.length > 0){
                                                signals.selectedSignals[0].deselect();
                                            }
                                        }
                
                                    //select this block
                                        newSignalBlock.select(true);
                
                                    //gather data for all the blocks that we're about to affect
                                        var activeBlocks = [];
                                        for(var a = 0; a < signals.selectedSignals.length; a++){
                                            activeBlocks.push({
                                                name: parseInt(signals.selectedSignals[a].name),
                                                block: signals.selectedSignals[a],
                                                starting: signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name)),
                                            });
                                        }
                
                                    //if control key is pressed; this is a strength-change operation
                                        if(event.ctrlKey){
                                            var mux = 4;
                                            var initialStrengths = activeBlocks.map(a => a.block.strength());
                                            var initial = event.offsetY;
                                            canvas.system.mouse.mouseInteractionHandler(
                                                function(event){
                                                    //check if ctrl is still pressed
                                                        if(!canvas.system.keyboard.pressedKeys.ControlLeft && !canvas.system.keyboard.pressedKeys.ControlRight){ canvas.system.mouse.forceMouseUp(); }
                
                                                    var diff = (initial - event.offsetY)/(canvas.core.viewport.scale()*height*mux);
                                                    for(var a = 0; a < activeBlocks.length; a++){
                                                        activeBlocks[a].block.strength(initialStrengths[a] + diff);
                                                        signals.signalRegistry.update(activeBlocks[a].name, { strength: initialStrengths[a] + diff });
                                                    }
                                                }
                                            );
                                            return;
                                        }
                
                                    //if the alt key is pressed, clone the block
                                    //(but don't select it, this is the 'alt-click-and-drag to clone' trick)
                                    //this function isn't run until the first sign of movement
                                        var cloned = false;
                                        function cloneFunc(){
                                            if(cloned){return;} cloned = true;
                                            if(event.altKey){
                                                for(var a = 0; a < signals.selectedSignals.length; a++){
                                                    var temp = signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name));
                                                    makeSignal(temp.line, temp.position, temp.length, temp.strength);
                                                }
                                            }
                                        }
                
                                    //block movement
                                        var initialPosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                        canvas.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                //clone that block
                                                    cloneFunc();
                
                                                var livePosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                                var diff = {
                                                    line: livePosition.line - initialPosition.line,
                                                    position: livePosition.position - initialPosition.position,
                                                };
                        
                                                for(var a = 0; a < activeBlocks.length; a++){
                                                    signals.signalRegistry.update(activeBlocks[a].name, {
                                                        line:activeBlocks[a].starting.line+diff.line,
                                                        position:activeBlocks[a].starting.position+diff.position,
                                                    });
                        
                                                    var temp = signals.signalRegistry.getSignal(activeBlocks[a].name);
                        
                                                    activeBlocks[a].block.line( temp.line );
                                                    activeBlocks[a].block.position( temp.position );
                                                }
                                            }
                                        );
                                };
                                newSignalBlock.body.onmousemove = function(x,y,event){
                                    var pressedKeys = canvas.system.keyboard.pressedKeys;
                                    canvas.core.viewport.cursor( (pressedKeys.AltLeft || pressedKeys.AltRight) ? 'copy' : 'default' );
                                };
                                newSignalBlock.body.onkeydown = function(x,y,event){
                                    var pressedKeys = canvas.system.keyboard.pressedKeys;
                                    if(pressedKeys.AltLeft || pressedKeys.AltRight){ canvas.core.viewport.cursor('copy'); }
                                };
                                newSignalBlock.body.onkeyup = function(x,y,event){
                                    var pressedKeys = canvas.system.keyboard.pressedKeys;
                                    if(!(pressedKeys.AltLeft || pressedKeys.AltRight)){ canvas.core.viewport.cursor('default'); }
                                };
                                newSignalBlock.leftHandle.onmousedown = function(x,y,event){
                                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                                        if(!event.shiftKey && !newSignalBlock.selected()){
                                            while(signals.selectedSignals.length > 0){
                                                signals.selectedSignals[0].deselect();
                                            }
                                        }
                                
                                    //select this block
                                        newSignalBlock.select(true);
                
                                    //gather data for all the blocks that we're about to affect
                                        var activeBlocks = [];
                                        for(var a = 0; a < signals.selectedSignals.length; a++){
                                            activeBlocks.push({
                                                name: parseInt(signals.selectedSignals[a].name),
                                                block: signals.selectedSignals[a],
                                                starting: signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name)),
                                            });
                                        }
                                    
                                    //perform block length adjustment 
                                        var initialPosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                        canvas.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var livePosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                                var diff = {position: initialPosition.position-livePosition.position};
                        
                                                for(var a = 0; a < activeBlocks.length; a++){
                                                    if( activeBlocks[a].starting.position-diff.position < 0 ){ continue; } //this stops a block from getting longer, when it is unable to move any further to the left
                                                    
                                                    signals.signalRegistry.update(activeBlocks[a].name, {
                                                        length: activeBlocks[a].starting.length+diff.position,
                                                        position: activeBlocks[a].starting.position-diff.position,
                                                    });
                                                    var temp = signals.signalRegistry.getSignal(activeBlocks[a].name);
                                                    activeBlocks[a].block.position( temp.position );
                                                    activeBlocks[a].block.length( temp.length );
                                                }
                                            }
                                        );
                                };
                                newSignalBlock.leftHandle.onmousemove = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
                                newSignalBlock.leftHandle.onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};
                                newSignalBlock.rightHandle.onmousedown = function(x,y,event){
                                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                                        if(!event.shiftKey && !newSignalBlock.selected()){
                                            while(signals.selectedSignals.length > 0){
                                                signals.selectedSignals[0].deselect();
                                            }
                                        }
                                    
                                    //select this block
                                        newSignalBlock.select(true);
                
                                    //gather data for all the blocks that we're about to affect
                                        var activeBlocks = [];
                                        for(var a = 0; a < signals.selectedSignals.length; a++){
                                            activeBlocks.push({
                                                name: parseInt(signals.selectedSignals[a].name),
                                                block: signals.selectedSignals[a],
                                                starting: signals.signalRegistry.getSignal(parseInt(signals.selectedSignals[a].name)),
                                            });
                                        }
                
                                    //perform block length adjustment 
                                        var initialPosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                        canvas.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var livePosition = coordinates2lineposition(viewportPosition2internalPosition(currentMousePosition(event)));
                                                var diff = {position: livePosition.position - initialPosition.position};
                        
                                                for(var a = 0; a < activeBlocks.length; a++){
                                                    signals.signalRegistry.update(activeBlocks[a].name, {length: activeBlocks[a].starting.length+diff.position});
                                                    var temp = signals.signalRegistry.getSignal(activeBlocks[a].name);
                                                    activeBlocks[a].block.position( temp.position );
                                                    activeBlocks[a].block.length( temp.length );
                                                }
                                            }
                                        );
                                };
                                newSignalBlock.rightHandle.onmousemove = function(x,y,event){canvas.core.viewport.cursor('col-resize');};
                                newSignalBlock.rightHandle.onmouseleave = function(x,y,event){canvas.core.viewport.cursor('default');};
                
                            return {id:newID, signalBlock:newSignalBlock};
                        }
                
                    //controls
                        object.viewport = setViewposition;
                        object.viewarea = setViewArea;
                
                        //background
                            object.glowHorizontal = function(state,start,end){
                                if(end == undefined){end = start+1;}
                
                                for(var a = start; a <= end; a++){
                                    var tmp = state ? horizontalStripStyle_glow : horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]];
                                    backgroundDrawArea_horizontal.children[a].style.fill = tmp.fill;
                                    backgroundDrawArea_horizontal.children[a].style.stroke = tmp.stroke;
                                    backgroundDrawArea_horizontal.children[a].style.lineWidth = tmp.lineWidth;
                                }
                            };
                            object.glowVertical = function(state,start,end){
                                if(end == undefined){end = start+1;}
                
                                for(var a = start; a <= end; a++){
                                    var tmp = state ? verticalStripStyle_glow : verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]];
                                    backgroundDrawArea_vertical.children[a].style.fill = tmp.fill;
                                    backgroundDrawArea_vertical.children[a].style.stroke = tmp.stroke;
                                    backgroundDrawArea_vertical.children[a].style.lineWidth = tmp.lineWidth;
                                }
                            };
                        
                        //looping
                            object.loopActive = function(bool){
                                if(bool == undefined){return loop.active;}
                                loop.active = bool;
                
                                object.glowVertical(false,0,xCount);
                                if( loop.active ){
                                    object.glowVertical(true, 
                                        loop.period.start < 0 ? 0 : loop.period.start, 
                                        loop.period.end > xCount ? xCount : loop.period.end,
                                    );
                                }
                            };
                            object.loopPeriod = function(start,end){
                                if(start == undefined || end == undefined){return loop.period;}
                                if(start > end || start < 0 || end < 0){return;}
                
                                loop.period = {start:start, end:end};
                
                                if( loop.active ){
                                    object.glowVertical(false,0,xCount);
                                    object.glowVertical(true,
                                        start < 0 ? 0 : start, 
                                        end > xCount ? xCount : end,
                                    );
                                }
                            };
                
                        //signals
                            object.addSignal = function(line, position, length, strength=1){ makeSignal(line, position, length, strength); };
                
                    //interaction
                        var tmp = {};
                        var panningCode = {
                            start:function(x,y,event){
                                tmp.onmousemove = interactionPlane_front.onmousemove;
                                interactionPlane_front.onmousemove = function(){};
                                tmp.onmouseleave = interactionPlane_front.onmouseleave;
                                interactionPlane_front.onmouseleave = function(){};
                
                                canvas.core.viewport.cursor('grabbing');
                
                                var initialPosition = currentMousePosition(event);
                                var old_viewport = {x:viewport.viewposition.x, y:viewport.viewposition.y};
                
                                canvas.system.mouse.mouseInteractionHandler(
                                    function(event){
                                        var livePosition = currentMousePosition(event);
                                        var diffPosition = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};
                                        setViewposition(
                                            old_viewport.x - (diffPosition.x*zoomLevel_x)/(zoomLevel_x-1),
                                            old_viewport.y - (diffPosition.y*zoomLevel_y)/(zoomLevel_y-1),
                                        );
                                    },
                                    function(event){
                                        canvas.core.viewport.cursor('grab');
                                    },
                                );
                            },
                            stop:function(x,y,event){
                                interactionPlane_front.onmousemove = tmp.onmousemove;
                                interactionPlane_front.onmouseleave = tmp.onmouseleave;
                            },
                        };
                        var click_n_drag = function(x,y,event){
                            var initialPositionData = currentMousePosition(event);
                            var livePositionData =    currentMousePosition(event);
                
                            var selectionArea = canvas.part.builder('rectangle','selectionArea',{
                                x:initialPositionData.x*width, y:initialPositionData.y*height,
                                width:0, height:0,
                                style:{fill:selectionAreaStyle}
                            });
                            object.append(selectionArea);
                
                            canvas.system.mouse.mouseInteractionHandler(
                                function(event){
                                    //get live position, and correct it so it's definitely within in the relevant area
                                        livePositionData = currentMousePosition(event);
                                        livePositionData.x < 0 ? 0 : livePositionData.x;
                                        livePositionData.y < 0 ? 0 : livePositionData.y;
                                        livePositionData.x > 1 ? 1 : livePositionData.x;
                                        livePositionData.y > 1 ? 1 : livePositionData.y;
                                        
                                    //gather difference between this point and the initial
                                        var diff = {
                                            x:livePositionData.x - initialPositionData.x, 
                                            y:livePositionData.y - initialPositionData.y
                                        };
                
                                    //account for an inverse rectangle
                                        var transform = {
                                            x: initialPositionData.x, y: initialPositionData.y, 
                                            width: 1, height: 1,
                                        };
                                        
                                        if(diff.x < 0){ transform.width = -1;  transform.x += diff.x; }
                                        if(diff.y < 0){ transform.height = -1; transform.y += diff.y; }
                
                                    //update rectangle 
                                        selectionArea.parameter.x(transform.x*width);
                                        selectionArea.parameter.y(transform.y*height);
                                        selectionArea.parameter.width(  transform.width  * diff.x*width  );
                                        selectionArea.parameter.height( transform.height * diff.y*height );
                                },
                                function(event){
                                    //remove selection box
                                        selectionArea.parent.remove(selectionArea);
                
                                    //gather the corner points
                                        var finishingPositionData = {
                                            a: visible2coordinates(initialPositionData),
                                            b: visible2coordinates(livePositionData),
                                        };
                                        finishingPositionData.a.x *= viewport.totalSize.width; finishingPositionData.b.y *= viewport.totalSize.height;
                                        finishingPositionData.b.x *= viewport.totalSize.width; finishingPositionData.a.y *= viewport.totalSize.height;
                
                                        var selectionBox = { topLeft:{ x:0, y:0 }, bottomRight:{ x:0, y:0 } };
                                        if( finishingPositionData.a.x < finishingPositionData.b.x ){
                                            selectionBox.topLeft.x =     finishingPositionData.a.x;
                                            selectionBox.bottomRight.x = finishingPositionData.b.x;
                                        }else{
                                            selectionBox.topLeft.x =     finishingPositionData.b.x;
                                            selectionBox.bottomRight.x = finishingPositionData.a.x;
                                        }
                                        if( finishingPositionData.a.y < finishingPositionData.b.y ){
                                            selectionBox.topLeft.y =     finishingPositionData.a.y;
                                            selectionBox.bottomRight.y = finishingPositionData.b.y;
                                        }else{
                                            selectionBox.topLeft.y =     finishingPositionData.b.y;
                                            selectionBox.bottomRight.y = finishingPositionData.a.y;
                                        }
                
                                    //deselect everything
                                        while(signals.selectedSignals.length > 0){
                                            signals.selectedSignals[0].deselect();
                                        }
                
                                    //select the notes that overlap with the selection area
                                        for(var a = 0; a < signalPane.children.length; a++){
                                            var temp = signals.signalRegistry.getSignal(parseInt(signalPane.children[a].name));
                                            var block = { 
                                                    topLeft:{
                                                        x:temp.position * (viewport.totalSize.width/xCount), 
                                                        y:temp.line *     (viewport.totalSize.height/yCount)},
                                                    bottomRight:{
                                                        x:(temp.position+temp.length) * (viewport.totalSize.width/xCount), 
                                                        y:(temp.line+1)*                (viewport.totalSize.height/yCount)
                                                    },
                                            };
                
                                            if( canvas.library.math.detectOverlap.boundingBoxes( block, selectionBox ) ){signalPane.children[a].select(true);}
                                        }
                                },
                            );
                        };
                        var createSignal = function(x,y,event){};
                
                        interactionPlane_front.onkeydown = function(x,y,event){
                            var pressedKeys = canvas.system.keyboard.pressedKeys;
                            if(pressedKeys.Delete || pressedKeys.Backspace){
                                //delete all selected notes
                                while(signals.selectedSignals.length > 0){
                                    signals.selectedSignals[0].delete();
                                }
                            }else if(pressedKeys.Space){
                                canvas.core.viewport.cursor('grab');
                                tmp.onmousedown = interactionPlane_front.onmousedown;
                                interactionPlane_front.onmousedown = panningCode.start;
                            }
                        };
                        interactionPlane_front.onkeyup = function(x,y,event){
                            if(!canvas.system.keyboard.pressedKeys.Space){
                                canvas.core.viewport.cursor('default');
                                panningCode.stop();
                                interactionPlane_front.onmousedown = tmp.onmousedown;
                            }
                        };
                
                        interactionPlane_back.onmousedown = function(x,y,event){
                            if(event.shiftKey){ click_n_drag(x,y,event); }
                            else if(event.altKey){ createSignal(x,y,event); }
                            else{//elsewhere click
                                //deselect everything
                                    while(signals.selectedSignals.length > 0){
                                        signals.selectedSignals[0].deselect();
                                    }
                            }
                        };
                        interactionPlane_front.onmouseleave = function(x,y,event){ canvas.core.viewport.cursor('default'); };
                    //callbacks
                        object.onpan = onpan;
                        object.onchangeviewarea = onchangeviewarea;
                        object.event = event;
                
                    //setup
                        drawBackground();
                
                    return object;
                };
                
                
                
                
                
                
                
                
                this.sequencer.signalBlock = function(
                    name, unit_x, unit_y,
                    line, position, length, strength=1, glow=false, 
                    bodyStyle=[
                        {fill:'rgba(138,138,138,0.6)',stroke:'rgba(175,175,175,0.8)', lineWidth:0.5},
                        {fill:'rgba(130,199,208,0.6)',stroke:'rgba(130,199,208,0.8)', lineWidth:0.5},
                        {fill:'rgba(129,209,173,0.6)',stroke:'rgba(129,209,173,0.8)', lineWidth:0.5},
                        {fill:'rgba(234,238,110,0.6)',stroke:'rgba(234,238,110,0.8)', lineWidth:0.5},
                        {fill:'rgba(249,178,103,0.6)',stroke:'rgba(249,178,103,0.8)', lineWidth:0.5},
                        {fill:'rgba(255, 69, 69,0.6)',stroke:'rgba(255, 69, 69,0.8)', lineWidth:0.5},
                    ],
                    bodyGlowStyle=[
                        {fill:'rgba(138,138,138,0.8)',stroke:'rgba(175,175,175,1)',lineWidth:0.5},
                        {fill:'rgba(130,199,208,0.8)',stroke:'rgba(130,199,208,1)',lineWidth:0.5},
                        {fill:'rgba(129,209,173,0.8)',stroke:'rgba(129,209,173,1)',lineWidth:0.5},
                        {fill:'rgba(234,238,110,0.8)',stroke:'rgba(234,238,110,1)',lineWidth:0.5},
                        {fill:'rgba(249,178,103,0.8)',stroke:'rgba(249,178,103,1)',lineWidth:0.5},
                        {fill:'rgba(255, 69, 69,0.8)',stroke:'rgba(255, 69, 69,1)',lineWidth:0.5},
                    ],
                    handleStyle='rgba(255,0,255,0)',
                    handleWidth=5,
                ){
                    var selected = false;
                    var minLength = handleWidth/4;
                    var currentStyles = {
                        body:getBlendedColour(bodyStyle,strength),
                        glow:getBlendedColour(bodyGlowStyle,strength),
                    };
                    
                    //elements
                        var object = canvas.part.builder('group',String(name),{x:position*unit_x, y:line*unit_y});
                        object.body = canvas.part.builder('rectangle','body',{width:length*unit_x, height:unit_y, style:{fill:currentStyles.body.fill, stroke:currentStyles.body.stroke, lineWidth:currentStyles.body.lineWidth}});
                        object.leftHandle = canvas.part.builder('rectangle','leftHandle',{x:-handleWidth/2, width:handleWidth, height:unit_y, style:{fill:handleStyle}});
                        object.rightHandle = canvas.part.builder('rectangle','rightHandle',{x:length*unit_x-handleWidth/2, width:handleWidth, height:unit_y, style:{fill:handleStyle}});
                        object.append(object.body);
                        object.append(object.leftHandle);
                        object.append(object.rightHandle);
                
                    //internal functions
                        function updateHeight(){
                            object.body.parameter.height(unit_y);
                            object.leftHandle.parameter.height(unit_y);
                            object.rightHandle.parameter.height(unit_y);
                        }
                        function updateLength(){
                            object.body.parameter.width(length*unit_x);
                            object.rightHandle.parameter.x(length*unit_x-handleWidth/2);
                        }
                        function updateLineAndPosition(){ updateLine(); updatePosition(); }
                        function updateLengthAndHeight(){ updateLength(); updateHeight(); }
                        function updateLine(){ object.parameter.y(line*unit_y); }
                        function updatePosition(){ object.parameter.x(position*unit_x); }
                        function getBlendedColour(swatch,ratio){
                            var outputStyle = Object.assign({},swatch[0]);
                
                            //if there's a fill attribute; blend it and add it to the output 
                                if( swatch[0].hasOwnProperty('fill') ){
                                    outputStyle.fill = canvas.library.misc.multiBlendColours(swatch.map(a => a.fill),ratio);
                                }
                
                            //if there's a stroke attribute; blend it and add it to the output
                                if( swatch[0].hasOwnProperty('stroke') ){
                                    outputStyle.stroke = canvas.library.misc.multiBlendColours(swatch.map(a => a.stroke),ratio);
                                }
                
                            return outputStyle;
                        }
                
                    //controls
                        object.unit = function(x,y){
                            if(x == undefined && y == undefined){return {x:unit_x,y:unit_y};}
                            //(awkward bid for speed)
                            else if( x == undefined ){
                                unit_y = y;
                                updateHeight();
                                updateLine();
                            }else if( y == undefined ){
                                unit_x = x;
                                updateLength();
                                updatePosition();
                            }else{
                                unit_x = x;
                                unit_y = y;
                                updateLengthAndHeight();
                                updateLineAndPosition();
                            }
                        };
                        object.line = function(a){
                            if(a == undefined){return line;}
                            line = a;
                            updateLine();
                        };
                        object.position = function(a){
                            if(a == undefined){return position;}
                            position = a;
                            updatePosition();
                        };
                        object.length = function(a){
                            if(a == undefined){return length;}
                            length = a < (minLength/unit_x) ? (minLength/unit_x) : a;
                            updateLength();
                        };
                        object.strength = function(a){
                            if(a == undefined){return strength;}
                            a = a > 1 ? 1 : a; a = a < 0 ? 0 : a;
                            strength = a;
                            currentStyles = {
                                body:getBlendedColour(bodyStyle,strength),
                                glow:getBlendedColour(bodyGlowStyle,strength),
                            };
                            object.glow(glow);
                        };
                        object.glow = function(a){
                            if(a == undefined){return glow;}
                            glow = a;
                            if(glow){ 
                                object.body.style.fill = currentStyles.glow.fill;
                                object.body.style.stroke = currentStyles.glow.stroke;
                                object.body.style.lineWidth = currentStyles.glow.lineWidth;
                            }else{    
                                object.body.style.fill = currentStyles.body.fill;
                                object.body.style.stroke = currentStyles.body.stroke;
                                object.body.style.lineWidth = currentStyles.body.lineWidth;
                            }            
                        };
                        object.selected = function(a){
                            if(a == undefined){return selected;}
                            selected = a;
                        };
                
                    return object;
                };
                this.list = function(
                    name='list', 
                    x, y, width=50, height=100, angle=0,
                    list=[],
                
                    itemTextVerticalOffsetMux=0.5, itemTextHorizontalOffsetMux=0.05,
                    active=true, multiSelect=true, hoverable=true, selectable=!false, pressable=true,
                
                    itemHeightMux=0.1, itemWidthMux=0.95, itemSpacingMux=0.01, 
                    breakHeightMux=0.0025, breakWidthMux=0.9, 
                    spacingHeightMux=0.005,
                    backing_style='rgba(230,230,230,1)', break_style='rgba(195,195,195,1)',
                
                    text_font = '5pt Arial',
                    text_textBaseline = 'alphabetic',
                    text_fill = 'rgba(0,0,0,1)',
                    text_stroke = 'rgba(0,0,0,0)',
                    text_lineWidth = 1,
                
                    item__off__fill=                          'rgba(180,180,180,1)',
                    item__off__stroke=                        'rgba(0,0,0,0)',
                    item__off__lineWidth=                     0,
                    item__up__fill=                           'rgba(200,200,200,1)',
                    item__up__stroke=                         'rgba(0,0,0,0)',
                    item__up__lineWidth=                      0,
                    item__press__fill=                        'rgba(230,230,230,1)',
                    item__press__stroke=                      'rgba(0,0,0,0)',
                    item__press__lineWidth=                   0,
                    item__select__fill=                       'rgba(200,200,200,1)',
                    item__select__stroke=                     'rgba(120,120,120,1)',
                    item__select__lineWidth=                  2,
                    item__select_press__fill=                 'rgba(230,230,230,1)',
                    item__select_press__stroke=               'rgba(120,120,120,1)',
                    item__select_press__lineWidth=            2,
                    item__glow__fill=                         'rgba(220,220,220,1)',
                    item__glow__stroke=                       'rgba(0,0,0,0)',
                    item__glow__lineWidth=                    0,
                    item__glow_press__fill=                   'rgba(250,250,250,1)',
                    item__glow_press__stroke=                 'rgba(0,0,0,0)',
                    item__glow_press__lineWidth=              0,
                    item__glow_select__fill=                  'rgba(220,220,220,1)',
                    item__glow_select__stroke=                'rgba(120,120,120,1)',
                    item__glow_select__lineWidth=             2,
                    item__glow_select_press__fill=            'rgba(250,250,250,1)',
                    item__glow_select_press__stroke=          'rgba(120,120,120,1)',
                    item__glow_select_press__lineWidth=       2,
                    item__hover__fill=                        'rgba(220,220,220,1)',
                    item__hover__stroke=                      'rgba(0,0,0,0)',
                    item__hover__lineWidth=                   0,
                    item__hover_press__fill=                  'rgba(240,240,240,1)',
                    item__hover_press__stroke=                'rgba(0,0,0,0)',
                    item__hover_press__lineWidth=             0,
                    item__hover_select__fill=                 'rgba(220,220,220,1)',
                    item__hover_select__stroke=               'rgba(120,120,120,1)',
                    item__hover_select__lineWidth=            2,
                    item__hover_select_press__fill=           'rgba(240,240,240,1)',
                    item__hover_select_press__stroke=         'rgba(120,120,120,1)',
                    item__hover_select_press__lineWidth=      2,
                    item__hover_glow__fill=                   'rgba(240,240,240,1)',
                    item__hover_glow__stroke=                 'rgba(0,0,0,0)',
                    item__hover_glow__lineWidth=              0,
                    item__hover_glow_press__fill=             'rgba(250,250,250,1)',
                    item__hover_glow_press__stroke=           'rgba(0,0,0,0)',
                    item__hover_glow_press__lineWidth=        0,
                    item__hover_glow_select__fill=            'rgba(240,240,240,1)',
                    item__hover_glow_select__stroke=          'rgba(120,120,120,1)',
                    item__hover_glow_select__lineWidth=       2,
                    item__hover_glow_select_press__fill=      'rgba(250,250,250,1)',
                    item__hover_glow_select_press__stroke=    'rgba(120,120,120,1)',
                    item__hover_glow_select_press__lineWidth= 2,
                
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
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //backing
                            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{
                                fill:backing_style,
                            }});
                            object.append(backing);
                        //item collection
                            var itemCollection = canvas.part.builder('group','itemCollection');
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
                                        switch(list[a]){
                                            case 'space':
                                                var temp = canvas.part.builder( 'rectangle', ''+a, {
                                                    x:0, y:accumulativeHeight,
                                                    width:width, height:height*spacingHeightMux,
                                                    style:{fill:'rgba(255,0,0,0)'}
                                                });
                
                                                accumulativeHeight += height*(spacingHeightMux+itemSpacingMux);
                                                itemCollection.append( temp );
                                            break;
                                            case 'break':
                                                var temp = canvas.part.builder( 'rectangle', ''+a, {
                                                    x:width*(1-breakWidthMux)*0.5, y:accumulativeHeight,
                                                    width:width*breakWidthMux, height:height*breakHeightMux,
                                                    style:{fill:break_style}
                                                });
                
                                                accumulativeHeight += height*(breakHeightMux+itemSpacingMux);
                                                itemCollection.append( temp );
                                            break;
                                            default:
                                                var temp = canvas.part.builder( 'button_rect', ''+a, {
                                                    x:width*(1-itemWidthMux)*0.5, y:accumulativeHeight,
                                                    width:width*itemWidthMux, height:height*itemHeightMux, 
                                                    text_left: list[a].text_left,
                                                    text_centre: (list[a].text?list[a].text:list[a].text_centre),
                                                    text_right: list[a].text_right,
                
                                                    textVerticalOffset: itemTextVerticalOffsetMux, textHorizontalOffsetMux: itemTextHorizontalOffsetMux,
                                                    active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                
                                                    style:{
                                                        text_font:text_font,
                                                        text_textBaseline:text_textBaseline,
                                                        text_fill:text_fill,
                                                        text_stroke:text_stroke,
                                                        text_lineWidth:text_lineWidth,
                
                                                        item__off__fill:                            item__off__fill,
                                                        item__off__stroke:                          item__off__stroke,
                                                        item__off__lineWidth:                       item__off__lineWidth,
                                                        item__up__fill:                             item__up__fill,
                                                        item__up__stroke:                           item__up__stroke,
                                                        item__up__lineWidth:                        item__up__lineWidth,
                                                        item__press__fill:                          item__press__fill,
                                                        item__press__stroke:                        item__press__stroke,
                                                        item__press__lineWidth:                     item__press__lineWidth,
                                                        item__select__fill:                         item__select__fill,
                                                        item__select__stroke:                       item__select__stroke,
                                                        item__select__lineWidth:                    item__select__lineWidth,
                                                        item__select_press__fill:                   item__select_press__fill,
                                                        item__select_press__stroke:                 item__select_press__stroke,
                                                        item__select_press__lineWidth:              item__select_press__lineWidth,
                                                        item__glow__fill:                           item__glow__fill,
                                                        item__glow__stroke:                         item__glow__stroke,
                                                        item__glow__lineWidth:                      item__glow__lineWidth,
                                                        item__glow_press__fill:                     item__glow_press__fill,
                                                        item__glow_press__stroke:                   item__glow_press__stroke,
                                                        item__glow_press__lineWidth:                item__glow_press__lineWidth,
                                                        item__glow_select__fill:                    item__glow_select__fill,
                                                        item__glow_select__stroke:                  item__glow_select__stroke,
                                                        item__glow_select__lineWidth:               item__glow_select__lineWidth,
                                                        item__glow_select_press__fill:              item__glow_select_press__fill,
                                                        item__glow_select_press__stroke:            item__glow_select_press__stroke,
                                                        item__glow_select_press__lineWidth:         item__glow_select_press__lineWidth,
                                                        item__hover__fill:                          item__hover__fill,
                                                        item__hover__stroke:                        item__hover__stroke,
                                                        item__hover__lineWidth:                     item__hover__lineWidth,
                                                        item__hover_press__fill:                    item__hover_press__fill,
                                                        item__hover_press__stroke:                  item__hover_press__stroke,
                                                        item__hover_press__lineWidth:               item__hover_press__lineWidth,
                                                        item__hover_select__fill:                   item__hover_select__fill,
                                                        item__hover_select__stroke:                 item__hover_select__stroke,
                                                        item__hover_select__lineWidth:              item__hover_select__lineWidth,
                                                        item__hover_select_press__fill:             item__hover_select_press__fill,
                                                        item__hover_select_press__stroke:           item__hover_select_press__stroke,
                                                        item__hover_select_press__lineWidth:        item__hover_select_press__lineWidth,
                                                        item__hover_glow__fill:                     item__hover_glow__fill,
                                                        item__hover_glow__stroke:                   item__hover_glow__stroke,
                                                        item__hover_glow__lineWidth:                item__hover_glow__lineWidth,
                                                        item__hover_glow_press__fill:               item__hover_glow_press__fill,
                                                        item__hover_glow_press__stroke:             item__hover_glow_press__stroke,
                                                        item__hover_glow_press__lineWidth:          item__hover_glow_press__lineWidth,
                                                        item__hover_glow_select__fill:              item__hover_glow_select__fill,
                                                        item__hover_glow_select__stroke:            item__hover_glow_select__stroke,
                                                        item__hover_glow_select__lineWidth:         item__hover_glow_select__lineWidth,
                                                        item__hover_glow_select_press__fill:        item__hover_glow_select_press__fill,
                                                        item__hover_glow_select_press__stroke:      item__hover_glow_select_press__stroke,
                                                        item__hover_glow_select_press__lineWidth:   item__hover_glow_select_press__lineWidth,
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
                                            break;
                                        }
                                    }
                
                                return accumulativeHeight - height*itemSpacingMux;
                            }
                            calculatedListHeight = refreshList();
                        //cover
                            var cover = canvas.part.builder('rectangle','cover',{width:width, height:height, style:{ fill:'rgba(0,0,0,0)' }});
                            object.append(cover);
                        //stencil
                            var stencil = canvas.part.builder('rectangle','stencil',{width:width, height:height, style:{ fill:'rgba(0,0,0,0)' }});
                            object.stencil(stencil);
                            object.clip(true);
                
                
                    //interaction
                        cover.onwheel = function(x,y,event){
                            var move = event.deltaY/100;
                            object.position( object.position() + move/10 );
                        };
                    
                    //controls
                        object.position = function(a,update=true){
                            if(a == undefined){return position;}
                            a = a < 0 ? 0 : a;
                            a = a > 1 ? 1 : a;
                            position = a;
                
                            if( calculatedListHeight < height ){return;}
                            var movementSpace = calculatedListHeight - height;
                            itemCollection.parameter.y( -a*movementSpace );
                            
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
                this.grapher_waveWorkspace = function(
                    name='grapher_waveWorkspace',
                    x, y, width=120, height=60, angle=0, selectNeedle=true, selectionArea=true,
                
                    foregroundStyles=[
                        {stroke:'rgba(0,255,0,1)', lineWidth:0.5, lineJoin:'round'},
                        {stroke:'rgba(255,255,0,1)', lineWidth:0.5, lineJoin:'round'},
                    ],
                    foregroundTextStyles=[
                        {fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
                        {fill:'rgba(255,255,100,1)', size:0.75, font:'Helvetica'},
                    ],
                
                    backgroundStyle_stroke='rgba(0,100,0,1)',
                    backgroundStyle_lineWidth=0.25,
                    backgroundTextStyle_fill='rgba(0,150,0,1)',
                    backgroundTextStyle_size=0.1,
                    backgroundTextStyle_font='Helvetica',
                
                    backingStyle='rgba(50,50,50,1)',
                
                    onchange=function(needle,value){}, 
                    onrelease=function(needle,value){}, 
                    selectionAreaToggle=function(bool){},
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //main graph
                            var graph = canvas.part.builder('grapher', 'graph', {
                                width:width, height:height,
                                style:{
                                    foregrounds:foregroundStyles,   
                                    foregroundText:foregroundTextStyles,
                                    background_stroke:backgroundStyle_stroke,
                                    background_lineWidth:backgroundStyle_lineWidth,
                                    backgroundText_fill:backgroundTextStyle_fill,
                                    backgroundText_size:backgroundTextStyle_size,
                                    backgroundText_font:backgroundTextStyle_font,
                                    backing:backingStyle,
                                }
                            });
                            object.append(graph);
                        //needle overlay
                            var overlay = canvas.part.builder('needleOverlay', 'overlay', {
                                width:width, height:height, selectNeedle:selectNeedle, selectionArea:selectionArea,
                                needleStyles:foregroundStyles.map(a => a.stroke),
                            });
                            object.append(overlay);
                
                    //controls
                        //grapher
                            object.horizontalMarkings = graph.horizontalMarkings;
                            object.verticalMarkings = graph.verticalMarkings;
                            object.drawBackground = graph.drawBackground;
                            object.drawForeground = graph.drawForeground;
                            object.draw = graph.draw;
                        //needle overlay
                            object.select = overlay.select;
                            object.area = overlay.area;
                
                    //callbacks
                        object.onchange = onchange;
                        object.onrelease = onrelease;
                        object.selectionAreaToggle = selectionAreaToggle;
                        overlay.onchange = function(needle,value){ if(object.onchange){object.onchange(needle,value);} };
                        overlay.onrelease = function(needle,value){ if(object.onrelease){object.onrelease(needle,value);} };
                        overlay.selectionAreaToggle = function(toggle){ if(object.selectionAreaToggle){object.selectionAreaToggle(toggle);} };
                
                    //setup
                        graph.viewbox({left:0});
                        graph.drawBackground();
                        overlay.select(0);
                
                    return object;
                };
                this.dial_discrete = function(
                    name='dial_discrete',
                    x, y, r=15, angle=0,
                    value=0, resetValue=0, optionCount=5,
                    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
                
                    handleStyle = 'rgba(175,175,175,1)',
                    slotStyle = 'rgba(50,50,50,1)',
                    needleStyle = 'rgba(250,100,100,1)',
                
                    onchange=function(){},
                    onrelease=function(){},
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        
                        //dial
                            var dial = canvas.part.builder('dial_continuous',name,{
                                x:0, y:0, r:r, angle:0,
                                startAngle:startAngle, smaxAngle:maxAngle,
                                style:{ handleStyle:handleStyle, slotStyle:slotStyle, needleStyle:needleStyle }
                            });
                            //clean out built-in interation
                            dial.getChildByName('handle').ondblclick = undefined;
                            dial.getChildByName('handle').onwheel = undefined;
                            dial.getChildByName('handle').onmousedown = undefined;
                
                            object.append(dial);
                        
                
                
                
                
                
                    //graphical adjust
                        function set(a,update=true){
                            a = (a>(optionCount-1) ? (optionCount-1) : a);
                            a = (a<0 ? 0 : a);
                
                            if(update && object.change != undefined){object.onchange(a);}
                
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
                
                
                
                
                    //interaction
                        var acc = 0;
                
                        dial.getChildByName('handle').ondblclick = function(){
                            if(resetValue<0){return;}
                            if(grappled){return;}
                            
                            set(resetValue);
                
                            if(object.onrelease != undefined){object.onrelease(value);}
                        };
                        dial.getChildByName('handle').onwheel = function(x,y,event){
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
                            var initialValue = value;
                            var initialY = event.y;
                
                            grappled = true;
                            canvas.system.mouse.mouseInteractionHandler(
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
                        set(0);
                
                    return object;
                };
                this.rangeslide = function(
                    name='rangeslide', 
                    x, y, width=10, height=95, angle=0,
                    handleHeight=0.1, spanWidth=0.75, values={start:0,end:1}, resetValues={start:-1,end:-1},
                    handleStyle = 'rgba(200,200,200,1)',
                    backingStyle = 'rgba(150,150,150,1)',
                    slotStyle = 'rgba(50,50,50,1)',
                    invisibleHandleStyle = 'rgba(255,0,0,0)',
                    spanStyle='rgba(200,0,200,0.5)',
                    onchange=function(){},
                    onrelease=function(){},
                ){
                    var grappled = false;
                    var handleNames = ['start','end'];
                
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                        //backing and slot group
                            var backingAndSlot = canvas.part.builder('group','backingAndSlotGroup');
                            // backingAndSlot.dotFrame = true;
                            object.append(backingAndSlot);
                            //backing
                                var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{fill:backingStyle}});
                                backingAndSlot.append(backing);
                            //slot
                                var slot = canvas.part.builder('rectangle','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), style:{fill:slotStyle}});
                                backingAndSlot.append(slot);
                            //backing and slot cover
                                var backingAndSlotCover = canvas.part.builder('rectangle','backingAndSlotCover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
                                backingAndSlot.append(backingAndSlotCover);
                
                        //span
                            var span = canvas.part.builder('rectangle','span',{x:width*((1-spanWidth)/2), y:height*handleHeight, width:width*spanWidth, height:height - 2*height*handleHeight, style:{fill:spanStyle} });
                            object.append(span);
                
                        //handles
                            var handles = {}
                            for(var a = 0; a < handleNames.length; a++){
                                //grouping
                                    handles[handleNames[a]] = canvas.part.builder('group','handle_'+a,{})
                                    object.append(handles[handleNames[a]]);
                                //handle
                                    var handle = canvas.part.builder('rectangle','handle',{width:width,height:height*handleHeight, style:{fill:handleStyle}});
                                    handles[handleNames[a]].append(handle);
                                //invisible handle
                                    var invisibleHandleHeight = height*handleHeight + height*0.01;
                                    var invisibleHandle = canvas.part.builder('rectangle','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, style:{fill:invisibleHandleStyle}});
                                    handles[handleNames[a]].append(invisibleHandle);
                            }
                
                
                
                
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
                                handles.start.parameter.y( values.start*height*(1-handleHeight) );
                                handles.end.parameter.y( values.end*height*(1-handleHeight) );
                
                            //adjust span height (with a little bit of padding so the span is under the handles a little)
                                span.parameter.y( height*(handleHeight + values.start - handleHeight*(values.start + 0.1)) );
                                span.parameter.height( height*( values.end - values.start + handleHeight*(values.start - values.end - 1 + 0.2) ) );
                
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
                
                
                
                        
                    //interaction
                        function getPositionWithinFromMouse(x,y){
                            //calculate the distance the click is from the top of the slider (accounting for angle)
                                var offset = backingAndSlot.getOffset();
                                var delta = {
                                    x: x - (backingAndSlot.x     + offset.x),
                                    y: y - (backingAndSlot.y     + offset.y),
                                    a: 0 - (backingAndSlot.angle + offset.a),
                                };
                
                            return canvas.library.math.cartesianAngleAdjust( delta.x, delta.y, delta.a ).y / backingAndSlotCover.height;
                        }
                
                        //background click
                            backingAndSlot.onclick = function(x,y,event){
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
                            object.ondblclick = function(){
                                if(resetValues.start<0 || resetValues.end<0){return;}
                                if(grappled){return;}
                
                                set(resetValues.start,'start');
                                set(resetValues.end,'end');
                                object.onrelease(values);
                            };
                
                        //span panning - expand/shrink
                            object.onwheel = function(){
                                if(grappled){return;}
                
                                var move = event.deltaY/100;
                                var globalScale = canvas.core.viewport.scale();
                                var val = move/(10*globalScale);
                
                                set(values.start-val,'start');
                                set(values.end+val,'end');
                            };
                
                        // span panning - drag
                            span.onmousedown = function(x,y,event){
                                grappled = true;
                
                                var initialValue = values.start;
                                var initialPosition = getPositionWithinFromMouse(x,y);
                
                                canvas.system.mouse.mouseInteractionHandler(
                                    function(event){
                                        var point = canvas.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                                        var livePosition = getPositionWithinFromMouse(point.x,point.y);
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
                                handles[handleNames[a]].onmousedown = (function(a){
                                    return function(x,y,event){
                                        grappled = true;
                            
                                        var initialValue = values[handleNames[a]];
                                        var initialPosition = getPositionWithinFromMouse(x,y);
                                        
                                        canvas.system.mouse.mouseInteractionHandler(
                                            function(event){
                                                var point = canvas.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                                                var livePosition = getPositionWithinFromMouse(point.x,point.y);
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
            };
            
            this.dynamic = new function(){
                this.connectionNode_voltage = function(
                    name='connectionNode_voltage',
                    x, y, angle=0, width=20, height=20,
                    dimStyle='rgb(222, 255, 220)',
                    glowStyle='rgb(240, 252, 239)',
                    cable_dimStyle='rgb(84, 247, 111)',
                    cable_glowStyle='rgb(159, 252, 174)',
                    onchange=function(value){},
                    onconnect=function(instigator){},
                    ondisconnect=function(instigator){},
                ){
                    //elements
                        var object = canvas.part.builder('connectionNode',name,{
                            x:x, y:y, angle:angle, width:width, height:height, type:'voltage',
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
                    dimStyle='rgb(255,0,0)',
                    glowStyle='rgb(255,100,100)',
                ){
                    //elements 
                        //main
                            var object = canvas.part.builder('group',name);
                        //cable shape
                            var path = canvas.part.builder('path','cable',{
                                points:[{x:x1,y:y1},{x:x2,y:y2}],
                                style:{
                                    stroke:dimStyle,
                                    lineWidth:5,
                                }
                            });
                            object.append(path);
                    
                    //controls
                        object.activate = function(){ path.style.stroke = glowStyle; };
                        object.deactivate = function(){ path.style.stroke = dimStyle; };
                        object.draw = function(new_x1,new_y1,new_x2,new_y2){
                            x1 = (new_x1!=undefined ? new_x1 : x1); 
                            y1 = (new_y1!=undefined ? new_y1 : y1);
                            x2 = (new_x2!=undefined ? new_x2 : x2); 
                            y2 = (new_y2!=undefined ? new_y2 : y2);
                            path.parameter.points([{x:x1,y:y1},{x:x2,y:y2}]);
                        };
                
                    return object;
                };
                this.connectionNode_audio = function(
                    name='connectionNode_audio',
                    x, y, angle=0, width=20, height=20, isAudioOutput=false, audioContext,
                    dimStyle='rgba(255, 244, 220, 1)',
                    glowStyle='rgba(255, 244, 244, 1)',
                    cable_dimStyle='rgb(247, 146, 84)',
                    cable_glowStyle='rgb(242, 168, 123)',
                    onconnect=function(){},
                    ondisconnect=function(){},
                ){
                    //elements
                        var object = canvas.part.builder('connectionNode',name,{
                            x:x, y:y, angle:angle, width:width, height:height, type:'audio', direction:(isAudioOutput ? 'out' : 'in'),
                            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
                        });
                        object._direction = isAudioOutput ? 'out' : 'in';
                
                    //circuitry
                        object.audioNode = audioContext.createAnalyser();
                
                        //audio connections
                            object.out = function(){return audioNode;};
                            object.in = function(){return audioNode;};
                
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
                    dimStyle='rgba(220, 244, 255,1)',
                    glowStyle='rgba(244, 244, 255, 1)',
                    cable_dimStyle='rgb(84, 146, 247)',
                    cable_glowStyle='rgb(123, 168, 242)',
                    onreceivedata=function(address, data){console.log(name,address,data);},
                    ongivedata=function(address){console.log(name,address);},
                    onconnect=function(){},
                    ondisconnect=function(){},
                ){
                    //elements
                        var object = canvas.part.builder('connectionNode',name,{
                            x:x, y:y, angle:angle, width:width, height:height, type:'data',
                            style:{ dim:dimStyle, glow:glowStyle, cable_dim:cable_dimStyle, cable_glow:cable_glowStyle },
                            onconnect, ondisconnect
                        });
                
                    //circuitry
                        function flash(obj){
                            obj.activate();
                            setTimeout(function(){ if(obj==undefined){return;} obj.deactivate(); },100);
                            if(obj.getForeignNode()!=undefined){
                                obj.getForeignNode().activate();
                                setTimeout(function(){ if(obj==undefined){return;} obj.getForeignNode().deactivate(); },100);
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
                    name='connectionNode',
                    x, y, angle=0, width=20, height=20, type='none', direction='',
                    dimStyle='rgb(220, 220, 220)',
                    glowStyle='rgb(244, 244, 244)',
                    cable_dimStyle='rgb(146, 146, 146)',
                    cable_glowStyle='rgb(215, 215, 215)',
                    onconnect=function(instigator){},
                    ondisconnect=function(instigator){},
                ){
                    //elements
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                            object._connectionNode = true;
                            object._type = type;
                            object._direction = direction;
                        //node
                            var rectangle = canvas.part.builder('rectangle','node',{ width:width, height:height, style:{fill:dimStyle} });
                                object.append(rectangle);
                
                    //network functions
                        var foreignNode = undefined;
                
                        object.connectTo = function(new_foreignNode){
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
                            canvas.system.mouse.mouseInteractionHandler(
                                undefined,
                                function(event){
                                    var point = canvas.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                                    var element = canvas.core.arrangement.getElementUnderPoint(point.x,point.y);
                                    if(element == undefined){return;}
                                    
                                    var node = element.parent;
                                    if( node._connectionNode ){ object.connectTo(node); }
                                }
                            );
                        };
                        rectangle.ondblclick = function(x,y,event){
                            object.disconnect();
                        };
                
                    //cabling
                        var cable;
                
                        object._addCable = function(){
                            cable = canvas.part.builder('cable','cable-'+this.getAddress(),{ x1:0,y1:0,x2:100,y2:100, style:{dim:cable_dimStyle, glow:cable_glowStyle}});
                            foreignNode._receiveCable(cable);
                            canvas.system.pane.getMiddlegroundPane(this).append(cable);
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
                            var offset = this.getOffset();
                            var point = canvas.library.math.cartesianAngleAdjust(x,y,offset.a); 
                            point.x += offset.x + width/2;
                            point.y += offset.y + height/2;
                            return point;
                        };
                        object.draw = function(){
                            if( cable == undefined ){return;}
                
                            var pointA = this.getCablePoint();
                            var pointB = foreignNode.getCablePoint();
                
                            cable.draw(pointA.x,pointA.y,pointB.x,pointB.y);
                        };
                
                    //graphical
                        object.activate = function(){ 
                            rectangle.style.fill = glowStyle;
                            if(cable!=undefined){ cable.activate(); }
                        }
                        object.deactivate = function(){ 
                            rectangle.style.fill = dimStyle;
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
                    dimStyle='rgb(255, 220, 244)',
                    glowStyle='rgb(255, 244, 244)',
                    cable_dimStyle='rgb(247, 84, 146)',
                    cable_glowStyle='rgb(247, 195, 215)',
                    onchange=function(value){},
                    onconnect=function(instigator){},
                    ondisconnect=function(instigator){},
                ){
                    //elements
                        var object = canvas.part.builder('connectionNode',name,{
                            x:x, y:y, angle:angle, width:width, height:height, type:'signal',
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
        
        canvas.part.builder = function(type,name,data){
            if(!data){data={};}
            if(data.style == undefined){data.style={};}
        
            switch(type){
                default: console.warn('Unknown element: '+ type); return null;  
        
                //basic
                    case 'group': return this.element.basic.group(
                        name, data.x, data.y, data.angle, data.ignored,
                    );
                    case 'rectangle': return this.element.basic.rectangle(
                        name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored,
                        data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin,
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
                    );
                    case 'image': return this.element.basic.image(
                        name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url
                    );
                    case 'polygon': return this.element.basic.polygon(
                        name, data.points, data.ignored,
                        data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffse
                    );
                    case 'text': return this.element.basic.text(
                        name, data.x, data.y, data.text, data.angle, data.anchor, data.size, data.ignored,
                        data.style.font, data.style.textAlign, data.style.textBaseline,
                        data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
                    );
                    case 'circle': return this.element.basic.circle(
                        name, data.x, data.y, data.r, data.ignored,
                        data.style.fill, data.style.stroke, data.style.lineWidth, data.style.lineJoin, 
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffset
                    );
                    case 'path': return this.element.basic.path(
                        name, data.points, data.ignored,
                        data.style.stroke, data.style.lineWidth, data.style.lineCap,  data.style.lineJoin, 
                        data.style.miterLimit, data.style.shadowColour, data.style.shadowBlur, data.style.shadowOffse
                    );
            
                //display
                    case 'glowbox_rect': return this.element.display.glowbox_rect(
                        name, data.x, data.y, data.width, data.height, data.angle, 
                        data.style.glow, data.style.dim
                    );
                    case 'sevenSegmentDisplay': return this.element.display.sevenSegmentDisplay(
                        name, data.x, data.y, data.width, data.height,
                        data.style.background, data.style.glow, data.style.dim
                    );
                    case 'sixteenSegmentDisplay': return this.element.display.sixteenSegmentDisplay(
                        name, data.x, data.y, data.width, data.height, 
                        data.style.background, data.style.glow, data.style.dim
                    );
                    case 'readout_sixteenSegmentDisplay': return this.element.display.readout_sixteenSegmentDisplay(
                        name, data.x, data.y, data.width, data.height, data.count, data.angle, 
                        data.style.background, data.style.glow, data.style.dime
                    );
                    case 'level': return this.element.display.level(
                        name, data.x, data.y, data.angle, data.width, data.height, 
                        data.style.backing, data.style.levels
                    );
                    case 'meter_level': return this.element.display.meter_level(
                        name, data.x, data.y, data.angle, data.width, data.height, data.markings,
                        data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
                    );
                    case 'audio_meter_level': return this.element.display.audio_meter_level(
                        name, data.x, data.y, data.angle, data.width, data.height, data.markings, 
                        data.style.backing, data.style.levels, data.style.markingStyle_fill, data.style.markingStyle_font,
                    );
                    case 'rastorDisplay': return this.element.display.rastorDisplay(
                        name, data.x, data.y, data.angle, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage
                    );
                    case 'grapher': return this.element.display.grapher(
                        name, data.x, data.y, data.width, data.height, data.angle,
                        data.style.foregrounds, data.style.foregroundText,
                        data.style.background_stroke, data.style.background_lineWidth,
                        data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                        data.style.backing,
                    );
                    case 'grapher_periodicWave': return this.element.display.grapher_periodicWave(
                        name, data.x, data.y, data.width, data.height, data.angle,
                        data.style.foregrounds, data.style.foregroundText,
                        data.style.background_stroke, data.style.background_lineWidth,
                        data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                        data.style.backing,
                    );
                    case 'grapher_audioScope': return this.element.display.grapher_audioScope(
                        name, data.x, data.y, data.width, data.height, data.angle,
                        data.style.foregrounds, data.style.foregroundText,
                        data.style.background_stroke, data.style.background_lineWidth,
                        data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                        data.style.backing,
                    );
        
                //control
                    case 'slide': return this.element.control.slide(
                        name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.value, data.resetValue, 
                        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                        data.onchange, data.onrelease
                    );
                    case 'slidePanel': return this.element.control.slidePanel(
                        name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.count, data.value, data.resetValue, 
                        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle,
                        data.onchange, data.onrelease
                    );
                    case 'rangeslide': return this.element.control.rangeslide(
                        name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.spanWidth, data.values, data.resetValues, 
                        data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span,
                        data.onchange, data.onrelease
                    );
                    case 'dial_continuous': return this.element.control.dial_continuous(
                            name,
                            data.x, data.y, data.r, data.angle,
                            data.value, data.resetValue,
                            data.startAngle, data.maxAngle,
                            data.style.handle, data.style.slot, data.style.needle,
                            data.onchange, data.onrelease
                    );
                    case 'dial_discrete': return this.element.control.dial_discrete(
                            name,
                            data.x, data.y, data.r, data.angle,
                            data.value, data.resetValue, data.optionCount,
                            data.startAngle, data.maxAngle,
                            data.style.handle, data.style.slot, data.style.needle,
                            data.onchange, data.onrelease
                    );
                    case 'button_rect': return this.element.control.button_rect(
                            name, data.x, data.y, data.width, data.height, data.angle,
                            data.text_centre, data.text_left, data.text_right,
                            data.textVerticalOffsetMux, data.textHorizontalOffsetMux,
                            data.active, data.hoverable, data.selectable, data.pressable,
        
                            data.style.text_font, data.style.text_textBaseline, data.style.text_fill, data.style.text_stroke, data.style.text_lineWidth,
        
                            data.style.background__off__fill,                     data.style.background__off__stroke,                     data.style.background__off__strokeWidth,
                            data.style.background__up__fill,                      data.style.background__up__stroke,                      data.style.background__up__strokeWidth,
                            data.style.background__press__fill,                   data.style.background__press__stroke,                   data.style.background__press__strokeWidth,
                            data.style.background__select__fill,                  data.style.background__select__stroke,                  data.style.background__select__strokeWidth,
                            data.style.background__select_press__fill,            data.style.background__select_press__stroke,            data.style.background__select_press__strokeWidth,
                            data.style.background__glow__fill,                    data.style.background__glow__stroke,                    data.style.background__glow__strokeWidth,
                            data.style.background__glow_press__fill,              data.style.background__glow_press__stroke,              data.style.background__glow_press__strokeWidth,
                            data.style.background__glow_select__fill,             data.style.background__glow_select__stroke,             data.style.background__glow_select__strokeWidth,
                            data.style.background__glow_select_press__fill,       data.style.background__glow_select_press__stroke,       data.style.background__glow_select_press__strokeWidth,
                            data.style.background__hover__fill,                   data.style.background__hover__stroke,                   data.style.background__hover__strokeWidth,
                            data.style.background__hover_press__fill,             data.style.background__hover_press__stroke,             data.style.background__hover_press__strokeWidth,
                            data.style.background__hover_select__fill,            data.style.background__hover_select__stroke,            data.style.background__hover_select__strokeWidth,
                            data.style.background__hover_select_press__fill,      data.style.background__hover_select_press__stroke,      data.style.background__hover_select_press__strokeWidth,
                            data.style.background__hover_glow__fill,              data.style.background__hover_glow__stroke,              data.style.background__hover_glow__strokeWidth,
                            data.style.background__hover_glow_press__fill,        data.style.background__hover_glow_press__stroke,        data.style.background__hover_glow_press__strokeWidth,
                            data.style.background__hover_glow_select__fill,       data.style.background__hover_glow_select__stroke,       data.style.background__hover_glow_select__strokeWidth,
                            data.style.background__hover_glow_select_press__fill, data.style.background__hover_glow_select_press__stroke, data.style.background__hover_glow_select_press__strokeWidth,
                        
                            data.onenter,
                            data.onleave,
                            data.onpress,
                            data.ondblpress,
                            data.onrelease,
                            data.onselect,
                            data.ondeselect,
                    );
                    case 'list': return this.element.control.list(
                        name, data.x, data.y, data.width, data.height, data.angle, data.list,
                        data.itemTextVerticalOffsetMux, data.itemTextHorizontalOffsetMux,
                        data.active, data.multiSelect, data.hoverable, data.selectable, data.pressable,
        
                        data.itemHeightMux, data.itemWidthMux, data.itemSpacingMux, 
                        data.breakHeightMux, data.breakWidthMux, 
                        data.spacingHeightMux,
        
                        data.style.backing, data.style.break,
                        data.style.text_font, data.style.text_textBaseline, data.style.text_fill, data.style.text_stroke, data.style.text_lineWidth,
                        data.style.item__off__fill,                     data.style.item__off__stroke,                     data.style.item__off__strokeWidth,
                        data.style.item__up__fill,                      data.style.item__up__stroke,                      data.style.item__up__strokeWidth,
                        data.style.item__press__fill,                   data.style.item__press__stroke,                   data.style.item__press__strokeWidth,
                        data.style.item__select__fill,                  data.style.item__select__stroke,                  data.style.item__select__strokeWidth,
                        data.style.item__select_press__fill,            data.style.item__select_press__stroke,            data.style.item__select_press__strokeWidth,
                        data.style.item__glow__fill,                    data.style.item__glow__stroke,                    data.style.item__glow__strokeWidth,
                        data.style.item__glow_press__fill,              data.style.item__glow_press__stroke,              data.style.item__glow_press__strokeWidth,
                        data.style.item__glow_select__fill,             data.style.item__glow_select__stroke,             data.style.item__glow_select__strokeWidth,
                        data.style.item__glow_select_press__fill,       data.style.item__glow_select_press__stroke,       data.style.item__glow_select_press__strokeWidth,
                        data.style.item__hover__fill,                   data.style.item__hover__stroke,                   data.style.item__hover__strokeWidth,
                        data.style.item__hover_press__fill,             data.style.item__hover_press__stroke,             data.style.item__hover_press__strokeWidth,
                        data.style.item__hover_select__fill,            data.style.item__hover_select__stroke,            data.style.item__hover_select__strokeWidth,
                        data.style.item__hover_select_press__fill,      data.style.item__hover_select_press__stroke,      data.style.item__hover_select_press__strokeWidth,
                        data.style.item__hover_glow__fill,              data.style.item__hover_glow__stroke,              data.style.item__hover_glow__strokeWidth,
                        data.style.item__hover_glow_press__fill,        data.style.item__hover_glow_press__stroke,        data.style.item__hover_glow_press__strokeWidth,
                        data.style.item__hover_glow_select__fill,       data.style.item__hover_glow_select__stroke,       data.style.item__hover_glow_select__strokeWidth,
                        data.style.item__hover_glow_select_press__fill, data.style.item__hover_glow_select_press__stroke, data.style.item__hover_glow_select_press__strokeWidth,
                    
                        data.onenter, data.onleave, data.onpress, data.ondblpress, data.onrelease, data.onselection, data.onpositionchange,
                    );
                    case 'checkbox_rect': return this.element.control.checkbox_rect(
                        name, data.x, data.y, data.width, data.height, data.angle, 
                        data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow,
                        data.onchange, 
                    );
                    case 'rastorgrid': return this.element.control.rastorgrid(
                        name, data.x, data.y, data.width, data.height, data.xCount, data.yCount,
                        data.style.backing, data.style.check, data.style.backingGlow, data.style.checkGlow,
                        data.onchange
                    );
                    case 'needleOverlay': return this.element.control.needleOverlay(
                        name, data.x, data.y, data.width, data.height, data.angle, 
                        data.needleWidth, data.selectNeedle, data.selectionArea, data.style.needles,
                        data.onchange, data.onrelease, data.selectionAreaToggle,
                    );
                    case 'grapher_waveWorkspace': return this.element.control.grapher_waveWorkspace(
                        name, data.x, data.y, data.width, data.height, data.angle, data.selectNeedle, data.selectionArea,
                        data.style.foregrounds, data.style.foregroundText,
                        data.style.background_stroke, data.style.background_lineWidth,
                        data.style.backgroundText_fill, data.style.backgroundText_size, data.style.backgroundText_font,
                        data.style.backing,
                        data.onchange, data.onrelease, data.selectionAreaToggle
                    );
                    case 'sequencer': return this.element.control.sequencer(
                        name, data.x, data.y, data.width, data.height, data.angle,                
                        data.xCount, data.yCount, data.zoomLevel_x, data.zoomLevel_y,
                        data.backingStyle, data.selectionAreaStyle,
                        data.blockStyle_body, data.blockStyle_bodyGlow, data.blockStyle_handle, data.blockStyle_handleWidth,
                        data.horizontalStripStyle_pattern, data.horizontalStripStyle_glow, data.horizontalStripStyle_styles,
                        data.verticalStripStyle_pattern,   data.verticalStripStyle_glow,   data.verticalStripStyle_styles,
                        data.playheadStyle,
                    );
        
                //dynamic
                    case 'cable': return this.element.dynamic.cable(
                        name, data.x1, data.y1, data.x2, data.y2,
                        data.style.dim, data.style.glow,
                    );
                    case 'connectionNode': return this.element.dynamic.connectionNode(
                        name, data.x, data.y, data.angle, data.width, data.height, data.type, data.direction,
                        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                        data.onconnect, data.ondisconnect,
                    );
                    case 'connectionNode_signal': return this.element.dynamic.connectionNode_signal(
                        name, data.x, data.y, data.angle, data.width, data.height,
                        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                        data.onchange, data.onconnect, data.ondisconnect,
                    );
                    case 'connectionNode_voltage': return this.element.dynamic.connectionNode_voltage(
                        name, data.x, data.y, data.angle, data.width, data.height,
                        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                        data.onchange, data.onconnect, data.ondisconnect,
                    );
                    case 'connectionNode_data': return this.element.dynamic.connectionNode_data(
                        name, data.x, data.y, data.angle, data.width, data.height,
                        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                        data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
                    );
                    case 'connectionNode_audio': return this.element.dynamic.connectionNode_audio(
                        name, data.x, data.y, data.angle, data.width, data.height, data.isAudioOutput, canvas.library.audio.context,
                        data.style.dim, data.style.glow, data.style.cable_dim, data.style.cable_glow, 
                        data.onconnect, data.ondisconnect,
                    );
            }
        }


        function tester(item1,item2){
            function getType(obj){
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
            }
            function comparer(item1,item2){
                if(getType(item1) != getType(item2)){ return false; }
                if(typeof item1 == 'boolean' || typeof item1 == 'string'){ return item1 === item2; }
                if(typeof item1 == 'number'){
                    if( Math.abs(item1) < 1.0e-14 ){item1 = 0;}
                    if( Math.abs(item2) < 1.0e-14 ){item2 = 0;}
                    return item1 === item2;
                }
                if(typeof item1 === 'undefined' || typeof item2 === 'undefined' || item1 === null || item2 === null){ return item1 === item2;  }
                if(getType(item1) == 'function'){
                    item1 = item1.toString();
                    item2 = item2.toString();
        
                    var item1_functionHead = item1.substring(0,item1.indexOf('{'));
                    item1_functionHead = item1_functionHead.substring(item1_functionHead.indexOf('(')+1, item1_functionHead.lastIndexOf(')'));
                    var item1_functionBody = item1.substring(item1.indexOf('{')+1, item1.lastIndexOf('}'));
        
                    var item2_functionHead = item2.substring(0,item2.indexOf('{'));
                    item2_functionHead = item2_functionHead.substring(item2_functionHead.indexOf('(')+1, item2_functionHead.lastIndexOf(')'));
                    var item2_functionBody = item2.substring(item2.indexOf('{')+1, item2.lastIndexOf('}'));
        
                    return item1_functionHead.trim() == item2_functionHead.trim() && item1_functionBody.trim() == item2_functionBody.trim();
                }
                if(typeof item1 == 'object'){
                    var keys = Object.keys(item1);
                    var result = true;
                    for(var a = 0; a < keys.length; a++){
                        result = result && comparer(item1[keys[a]],item2[keys[a]]);
                    }
                    return result;
                }
                return false;
            }
        
            if( comparer(item1,item2) ){
                console.log('%cpass', 'color: green;'); return true;
            }else{
                console.log(item1 ,'!=', item2);
                console.log('%cfail', 'color: red;'); return false;
            }
        }
        
        

        
        // -- Only one test per time -- //
        //basic
            var basicGroup = canvas.part.builder( 'group', 'basic', { x:10, y:10, angle:0 } );
            canvas.system.pane.mm.append( basicGroup );
            basicGroup.append( canvas.part.builder( 'rectangle', 'testRectangle', { x:5, y:5, width:30, height:30, style:{ fill:'rgba(255,0,0,1)' } } ) );
            basicGroup.append( canvas.part.builder( 'circle', 'testCircle', { x:20, y:55, r:15 } ) );
            basicGroup.append( canvas.part.builder( 'image', 'testImage', { x:40, y:40, width:30, height:30, url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg' } ) );
            basicGroup.append( canvas.part.builder( 'polygon', 'testPolygon', { points:[{x:55,y:5}, {x:70,y:35}, {x:40,y:35}], style:{ fill:'rgba(0,255,0,1)' } } ) );
            basicGroup.append( canvas.part.builder( 'text', 'testText', { x:7.5, y:95, text:'Hello', style:{font:'20pt Arial', fill:'rgba(150,150,255,1)' } } ) );
            basicGroup.append( canvas.part.builder( 'path', 'testPath', { points:[{x:0,y:0},{x:0,y:90},{x:2.5,y:90},{x:2.5,y:72.5},{x:75,y:72.5}] }) );
        
        //display
            var displayGroup = canvas.part.builder( 'group', 'display', { x:100, y:10, angle:0 } );
            canvas.system.pane.mm.append( displayGroup );
            displayGroup.append( canvas.part.builder( 'glowbox_rect', 'test_glowbox_rect', {x:0,y:0} ) );
            displayGroup.append( canvas.part.builder( 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35,y:0} ) );
            displayGroup.append( canvas.part.builder( 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60,y:0} ) );
            displayGroup.append( canvas.part.builder( 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:85,y:0} ) );
            displayGroup.append( canvas.part.builder( 'level', 'test_level1', {x:0, y:35} ) );
            displayGroup.append( canvas.part.builder( 'meter_level', 'test_meterLevel1', {x:25, y:35} ) );
            displayGroup.append( canvas.part.builder( 'audio_meter_level', 'test_audioMeterLevel1', {x:50, y:35} ) );
            displayGroup.append( canvas.part.builder( 'rastorDisplay', 'test_rastorDisplay1', {x:75, y:35} ) );
            var grapher = canvas.part.builder( 'grapher', 'test_grapher1', {x:140, y:35} );
                displayGroup.append( grapher );
                grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
                grapher.draw([0,0.25,1],undefined,1);
            var grapher = canvas.part.builder( 'grapher_periodicWave', 'test_grapher_periodicWave1', {x:265, y:35} );
                displayGroup.append( grapher );
                grapher.updateBackground();
                grapher.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
                grapher.draw();
            var grapher = canvas.part.builder( 'grapher_audioScope', 'test_grapher_audioScope1', {x:390, y:35} );
                displayGroup.append( grapher );
        
        
        //control
            var controlGroup = canvas.part.builder( 'group', 'control', { x:10, y:120, angle:0 } );
            canvas.system.pane.mm.append( controlGroup );
            controlGroup.append( canvas.part.builder( 'slide', 'test_slide1', {x:0,y:0} ) );
            controlGroup.append( canvas.part.builder( 'slidePanel', 'test_slidePanel1', {x:15,y:0} ) );
            controlGroup.append( canvas.part.builder( 'slide', 'test_slide2', {x:0,y:110,angle:-Math.PI/2} ) );
            controlGroup.append( canvas.part.builder( 'slidePanel', 'test_slidePanel2', {x:0,y:195,angle:-Math.PI/2} ) );
            controlGroup.append( canvas.part.builder( 'rangeslide', 'test_rangeslide1', {x:100,y:0} ) );
            controlGroup.append( canvas.part.builder( 'rangeslide', 'test_rangeslide2', {x:100,y:110,angle:-Math.PI/2} ) );
            controlGroup.append( canvas.part.builder( 'dial_continuous', 'test_dial_continuous1', {x:130,y:15} ) );
            controlGroup.append( canvas.part.builder( 'dial_discrete', 'test_dial_discrete1', {x:170,y:15} ) );
            controlGroup.append( canvas.part.builder( 'button_rect', 'test_button_rect1', {x:115,y:35} ) );
            controlGroup.append( canvas.part.builder( 'list', 'test_list1', {x:185,y:115,list:[
                'space',
                { text_left:'item1',  text_centre:'', text_right:'', function:function(){console.log('item1 function');} },
                { text_left:'item2',  text_centre:'', text_right:'', function:function(){console.log('item2 function');} },
                { text_left:'item3',  text_centre:'', text_right:'', function:function(){console.log('item3 function');} },
                { text_left:'item4',  text_centre:'', text_right:'', function:function(){console.log('item4 function');} },
                { text_left:'item5',  text_centre:'', text_right:'', function:function(){console.log('item5 function');} },
                'break',
                { text_left:'item6',  text_centre:'', text_right:'', function:function(){console.log('item6 function');} },
                { text_left:'item7',  text_centre:'', text_right:'', function:function(){console.log('item7 function');} },
                { text_left:'item8',  text_centre:'', text_right:'', function:function(){console.log('item8 function');} },
                { text_left:'item9',  text_centre:'', text_right:'', function:function(){console.log('item9 function');} },
                { text_left:'item10', text_centre:'', text_right:'', function:function(){console.log('item10 function');} },
                'break',
                { text_left:'item11', text_centre:'', text_right:'', function:function(){console.log('item11 function');} },
                { text_left:'item12', text_centre:'', text_right:'', function:function(){console.log('item12 function');} },
                { text_left:'item13', text_centre:'', text_right:'', function:function(){console.log('item13 function');} },
                { text_left:'item14', text_centre:'', text_right:'', function:function(){console.log('item14 function');} },
                { text_left:'item15', text_centre:'', text_right:'', function:function(){console.log('item15 function');} },
                'space',
            ]} ) );
            controlGroup.append( canvas.part.builder( 'checkbox_rect', 'test_checkbox_rect1', {x:150,y:35} ) );
            controlGroup.append( canvas.part.builder( 'rastorgrid', 'test_rastorgrid1', {x:100,y:115} ) );
            var no = canvas.part.builder( 'needleOverlay', 'test_needleOverlay1', {x:0,y:200} );
                controlGroup.append( no );
                no.select(0.25);
                no.area(0.5,0.75)
            var gww = canvas.part.builder( 'grapher_waveWorkspace', 'test_grapher_waveWorkspace1', {x:0,y:265} );
                controlGroup.append( gww );
                gww.select(0.2);
                gww.area(0.5,0.7)
            var seq = canvas.part.builder( 'sequencer', 'test_sequencer1', {x:125,y:220} );
                controlGroup.append( seq );
                seq.addSignal( 0,0,  10,0.0 );
                seq.addSignal( 1,1,  10,0.1 );
                seq.addSignal( 2,2,  10,0.2 );
                seq.addSignal( 3,3,  10,0.3 );
                seq.addSignal( 4,4,  10,0.4 );
                seq.addSignal( 5,5,  10,0.5 );
                seq.addSignal( 6,6,  10,0.6 );
                seq.addSignal( 7,7,  10,0.7 );
                seq.addSignal( 8,8,  10,0.8 );
                seq.addSignal( 9,9,  10,0.9 );
                seq.addSignal( 10,10,10,1.0 );
        
        
        //dynamic
            var dynamicGroup = canvas.part.builder( 'group', 'dynamic', { x:240, y:120, angle:0 } );
            canvas.system.pane.mm.append( dynamicGroup );
            dynamicGroup.append( canvas.part.builder( 'cable', 'test_cable1', {x1:0,y1:0,x2:100,y2:0} ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode', 'test_connectionNode1', { x:25, y:25 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode', 'test_connectionNode2', { x:0,  y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode', 'test_connectionNode3', { x:50, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal1', { x:125, y:25 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal2', { x:100, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal3', { x:150, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage1', { x:225, y:25 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage2', { x:200, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage3', { x:250, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data1', { x:325, y:25 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data2', { x:300, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data3', { x:350, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio1', { x:425, y:25, isAudioOutput:true} ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio2', { x:400, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio3', { x:450, y:75 } ) );
        
        
        
        
        
        
        
        
        //view positioning
            canvas.core.viewport.scale(3.5);
            canvas.core.viewport.position(-130,-335);


    }
}
