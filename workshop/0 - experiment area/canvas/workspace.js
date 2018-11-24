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
                    var height = font.split('pt')[0].split(' ').pop();
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
                    
                            //paint this shape as requested
                                context.fillStyle = this.style.fill;
                                context.strokeStyle = this.style.stroke;
                                context.lineWidth = shapeValue.lineWidth;
                                context.shadowColor = this.style.shadowColour;
                                context.shadowBlur = shapeValue.shadowBlur;
                                context.shadowOffsetX = shapeValue.shadowOffset.x;
                                context.shadowOffsetY = shapeValue.shadowOffset.y;
                    
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
                    
                    
                        this.parameter = {};
                        this.parameter.x = function(shape){ return function(a){if(a==undefined){return shape.x;} shape.x = a; shape.computeExtremities(undefined,true);} }(this);
                        this.parameter.y = function(shape){ return function(a){if(a==undefined){return shape.y;} shape.y = a; shape.computeExtremities(undefined,true);} }(this);
                        this.parameter.angle = function(shape){ return function(a){if(a==undefined){return shape.angle;} shape.angle = a; shape.computeExtremities(undefined,true);} }(this);
                    
                        
                    
                        this.getAddress = function(){
                            var address = '';
                            var tmp = this;
                            do{
                                address = tmp.name + '/' + address;
                            }while((tmp = tmp.parent) != undefined)
                    
                            return '/'+address;
                        };
                        
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
                            if( isPointWithinBoundingBox(x,y,this) ){
                                return isPointWithinHitBox(x,y,this);
                            }
                            return false;
                        };
                        this.getElementUnderPoint = function(x,y,static=false){
                            //go through the children in reverse order, discovering if
                            //  the object is not ignored and,
                            //  the point is within their bounding box
                            //if so; if it's a group, follow the 'getElementUnderPoint' function down
                            //if it's not, return that shape
                            //otherwise, carry onto the next shape
                    
                            for(var a = this.children.length-1; a >= 0; a--){
                                //if child shape is static (or any of its parents), use adjusted x and y values for 'isPointWithin' judgement
                                    var point = (this.children[a].static || static) ? adapter.workspacePoint2windowPoint(x,y) : {x:x,y:y};
                    
                                    if( !this.children[a].ignored && this.children[a].isPointWithin(point.x,point.y) ){
                                        if( this.children[a].type == 'group' ){
                                            var temp = this.children[a].getElementUnderPoint(x,y,(this.children[a].static || static));
                                            if(temp != undefined){return temp;}
                                        }else{
                                            return this.children[a];
                                        }
                                    }
                            }
                        };
                    
                        function shouldRender(shape){
                            //if this shape is static, always render
                                if(shape.static){return true;}
                    
                            //if any of this shape's children are static, render the group (and let the individuals decide to render themselves or not)
                                for(var a = 0; a < shape.children.length; a++){ if(shape.children[a].static){return true;} }
                    
                            //dertermine if this shape's bounding box overlaps with the viewport's bounding box. If so; render
                                return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox);
                        };
                        this.render = function(context,offset={x:0,y:0,a:0},static=false){
                            //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method) just bail on the whole thing
                                if(!shouldRender(this)){return;}
                    
                            //adjust offset for parent's angle
                                // console.log(this.name,'group>',JSON.stringify(offset));
                                var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.a);
                                offset.x += point.x - this.x;
                                offset.y += point.y - this.y;
                    
                            //cycle through all children, activating their render functions
                                for(var a = 0; a < this.children.length; a++){
                                    var item = this.children[a];
                    
                                    item.render(
                                        context,
                                        {
                                            a: offset.a + this.angle,
                                            x: offset.x + this.x,
                                            y: offset.y + this.y,
                                            parentAngle: this.angle,
                                        },
                                        (static||item.static)
                                    );
                                }
                    
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
                        this.text = 'curvie-gH';
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
                    this.getElementUnderPoint = function(x,y){ return design.getElementUnderPoint(x,y); };
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
                        stopScrollActive:false
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
                            //default
                                canvas[callbacks[a]] = function(callback){
                                    return function(event){
                                        if( !core.callback[callback] ){return;}
                                        var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                        var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                                        core.callback[callback](p.x,p.y,event,shape);
                                    }
                                }(callbacks[a]);
                
                            //special cases
                                canvas.onmouseover = function(event){
                                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = 'hidden'; }
                
                                    if( !core.callback.onmouseover ){return;}
                                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                                    core.callback.onmouseover(p.x,p.y,event,shape);
                                };
                                canvas.onmouseout = function(event){
                                    if(core.viewport.stopMouseScroll()){ document.body.style.overflow = ''; }
                                    
                                    if( !core.callback.onmouseout ){return;}
                                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                                    core.callback.onmouseout(p.x,p.y,event,shape);
                                };
                                var lastShape;
                                canvas.onmousemove = function(event){
                                    if( !core.callback.onmousemove ){return;}
                                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                
                                    if( lastShape != shape ){
                                        core.callback.onmouseleave(p.x,p.y,event,lastShape);
                                        core.callback.onmouseenter(p.x,p.y,event,shape);
                                    }
                                    lastShape = shape;
                                    
                                    core.callback.onmousemove(p.x,p.y,event,shape);
                                    core.viewport.mousePosition(p.x,p.y);
                                };
                
                                canvas.onkeydown = function(event){
                                    if( !core.callback.onkeydown ){return;}
                                    var p = core.viewport.mousePosition();
                                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                                    core.callback.onkeydown(p.x,p.y,event,shape);
                                };
                                canvas.onkeyup = function(event){
                                    if( !core.callback.onkeyup ){return;}
                                    var p = core.viewport.mousePosition();
                                    var shape = canvas.core.arrangement.getElementUnderPoint(p.x,p.y);
                                    core.callback.onkeyup(p.x,p.y,event,shape);
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
            canvas.core.callback.onkeydown = function(x,y,event){
                //if key is already pressed, don't press it again
                    if(canvas.system.keyboard.pressedKeys[event.code]){ return; }
                    canvas.system.keyboard.pressedKeys[event.code] = true;
                
                //perform action
                    canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeydown)(event,{x:x,y:y});
            };
            canvas.core.callback.onkeyup = function(x,y,event){
                //if key isn't pressed, don't release it
                    if(!canvas.system.keyboard.pressedKeys[event.code]){return;}
                    delete canvas.system.keyboard.pressedKeys[event.code];
                
                //perform action
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
                    backing__select__lineWidth=                  2,
                    backing__select_press__fill=                 'rgba(230,230,230,1)',
                    backing__select_press__stroke=               'rgba(120,120,120,1)',
                    backing__select_press__lineWidth=            2,
                    backing__glow__fill=                         'rgba(220,220,220,1)',
                    backing__glow__stroke=                       'rgba(0,0,0,0)',
                    backing__glow__lineWidth=                    0,
                    backing__glow_press__fill=                   'rgba(250,250,250,1)',
                    backing__glow_press__stroke=                 'rgba(0,0,0,0)',
                    backing__glow_press__lineWidth=              0,
                    backing__glow_select__fill=                  'rgba(220,220,220,1)',
                    backing__glow_select__stroke=                'rgba(120,120,120,1)',
                    backing__glow_select__lineWidth=             2,
                    backing__glow_select_press__fill=            'rgba(250,250,250,1)',
                    backing__glow_select_press__stroke=          'rgba(120,120,120,1)',
                    backing__glow_select_press__lineWidth=       2,
                    backing__hover__fill=                        'rgba(220,220,220,1)',
                    backing__hover__stroke=                      'rgba(0,0,0,0)',
                    backing__hover__lineWidth=                   0,
                    backing__hover_press__fill=                  'rgba(240,240,240,1)',
                    backing__hover_press__stroke=                'rgba(0,0,0,0)',
                    backing__hover_press__lineWidth=             0,
                    backing__hover_select__fill=                 'rgba(220,220,220,1)',
                    backing__hover_select__stroke=               'rgba(120,120,120,1)',
                    backing__hover_select__lineWidth=            2,
                    backing__hover_select_press__fill=           'rgba(240,240,240,1)',
                    backing__hover_select_press__stroke=         'rgba(120,120,120,1)',
                    backing__hover_select_press__lineWidth=      2,
                    backing__hover_glow__fill=                   'rgba(240,240,240,1)',
                    backing__hover_glow__stroke=                 'rgba(0,0,0,0)',
                    backing__hover_glow__lineWidth=              0,
                    backing__hover_glow_press__fill=             'rgba(250,250,250,1)',
                    backing__hover_glow_press__stroke=           'rgba(0,0,0,0)',
                    backing__hover_glow_press__lineWidth=        0,
                    backing__hover_glow_select__fill=            'rgba(240,240,240,1)',
                    backing__hover_glow_select__stroke=          'rgba(120,120,120,1)',
                    backing__hover_glow_select__lineWidth=       2,
                    backing__hover_glow_select_press__fill=      'rgba(250,250,250,1)',
                    backing__hover_glow_select_press__stroke=    'rgba(120,120,120,1)',
                    backing__hover_glow_select_press__lineWidth= 2,
                
                    onenter = function(object, event){},
                    onleave = function(object, event){},
                    onpress = function(object, event){},
                    ondblpress = function(object, event){},
                    onrelease = function(object, event){},
                    onselect = function(object, event){},
                    ondeselect = function(object, event){},
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
                            if(this.state.pressed){return;}
                            this.state.pressed = true;
                            activateGraphicalState();
                            if(this.onpress){this.onpress(this, event);}
                            this.select( !this.select(), event );
                        };
                        object.release = function(event){
                            if(!this.state.pressed){return;}
                            this.state.pressed = false;
                            activateGraphicalState();
                            if(this.onrelease){this.onrelease(this, event);}
                        };
                        object.active = function(bool){ if(bool == undefined){return active;} active = bool; activateGraphicalState(); };
                        object.glow = function(bool){   if(bool == undefined){return this.state.glowing;}  this.state.glowing = bool;  activateGraphicalState(); };
                        object.select = function(bool,event,callback=true){ 
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
                            if(object.onenter){object.onenter(object, event);}
                            if(event.buttons == 1){cover.onmousedown(event);} 
                        };
                        cover.onmouseleave = function(event){ 
                            object.state.hovering = false; 
                            object.release(event); 
                            activateGraphicalState(); 
                            if(object.onleave){object.onleave(object, event);}
                        };
                        cover.onmouseup = function(event){   object.release(event); };
                        cover.onmousedown = function(event){ object.press(event); };
                        cover.ondblclick = function(event){ if(object.ondblpress){object.ondblpress(object, event);} };
                        
                
                
                
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
                
                            if(update && object.change != undefined){object.onchange(a);}
                            
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
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                            object._connectionNode = true;
                            object._type = 'audio';
                            object._direction = isAudioOutput ? 'output' : 'input';
                        //node
                            var rectangle = canvas.part.builder('rectangle','node',{ width:width, height:height, style:{fill:dimStyle} });
                                object.append(rectangle);
                
                    //control
                        var audioNode = audioContext.createAnalyser();
                        object._getAudioNode = function(){return audioNode;}
                
                    //audio connections
                        object.out = function(){return audioNode;};
                        object.in = function(){return audioNode;};
                
                    //network functions
                        var foreignNode = undefined;
                
                        object.connectTo = function(new_foreignNode){
                            if( new_foreignNode == this ){ return; }
                            if( new_foreignNode._type != this._type ){ return; } 
                            if( new_foreignNode._direction == this._direction ){ return; }
                            if( new_foreignNode == foreignNode ){ return; }
                
                            this.disconnect();
                
                            foreignNode = new_foreignNode;
                            if(isAudioOutput){ audioNode.connect(foreignNode._getAudioNode()); }
                            foreignNode._receiveConnection(this);
                            this.onconnect();
                
                
                            this._addCable(this);
                        };
                        object._receiveConnection = function(new_foreignNode){
                            this.disconnect();
                            foreignNode = new_foreignNode;
                            if(isAudioOutput){ audioNode.connect(foreignNode._getAudioNode()); }
                            this.onconnect();
                        };
                        object.disconnect = function(){
                            if( foreignNode == undefined ){return;}
                
                            this._removeCable();
                            if(isAudioOutput){ audioNode.disconnect(foreignNode._getAudioNode()); }
                            foreignNode._receiveDisconnection();
                            foreignNode = null;
                
                            this.ondisconnect();
                        };
                        object._receiveDisconnection = function(){
                            if(isAudioOutput){ audioNode.disconnect(foreignNode._getAudioNode()); }
                            foreignNode = null;
                            this.ondisconnect();
                        };
                
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
                            cable = canvas.part.builder('cable','cable-'+this.getAddress(),{ x1:0,y1:0,x2:100,y2:100, style:{dimStyle:cable_dimStyle, glowStyle:cable_glowStyle}});
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
                this.connectionNode_data = function(
                    name='connectionNode_data',
                    x, y, angle=0, width=20, height=20,
                    dimStyle='rgba(220, 244, 255,1)',
                    glowStyle='rgba(244, 244, 255, 1)',
                    cable_dimStyle='rgb(84, 146, 247)',
                    cable_glowStyle='rgb(123, 168, 242)',
                    onreceive=function(address, data){},
                    ongive=function(address){},
                    onconnect=function(){},
                    ondisconnect=function(){},
                ){
                    //elements
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                            object._connectionNode = true;
                            object._type = 'data';
                        //node
                            var rectangle = canvas.part.builder('rectangle','node',{ width:width, height:height, style:{fill:dimStyle} });
                                object.append(rectangle);
                
                    //control
                        object.send = function(address,data){
                            object.activate();
                            setTimeout(function(){ if(object==undefined){return;} object.deactivate(); },100);
                
                            if(foreignNode==undefined){return;}
                            if(foreignNode.onreceive){foreignNode.onreceive(address, data);}
                        };
                        object.request = function(address){
                            if(foreignNode==undefined){return;}
                            if(foreignNode.ongive){foreignNode.ongive(address, data);}
                        };
                
                    //network functions
                        var foreignNode = undefined;
                
                        object.connectTo = function(new_foreignNode){
                            if( new_foreignNode == this ){ return; }
                            if( new_foreignNode._type != this._type ){ return; }
                            if( new_foreignNode == foreignNode ){ return; }
                
                            this.disconnect();
                
                            foreignNode = new_foreignNode;
                            foreignNode._receiveConnection(this);
                            this.onconnect();
                
                            this._addCable(this);
                        };
                        object._receiveConnection = function(new_foreignNode){
                            this.disconnect();
                            foreignNode = new_foreignNode;
                            this.onconnect();
                        };
                        object.disconnect = function(){
                            if( foreignNode == undefined ){return;}
                
                            this._removeCable();
                            foreignNode._receiveDisconnection();
                            foreignNode = null;
                
                            this.ondisconnect();
                        };
                        object._receiveDisconnection = function(){
                            foreignNode = null;
                            this.ondisconnect();
                        };
                
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
                            cable = canvas.part.builder('cable','cable-'+this.getAddress(),{ x1:0,y1:0,x2:100,y2:100, style:{dimStyle:cable_dimStyle, glowStyle:cable_glowStyle}});
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
                        object.onreceive = onreceive;
                        object.ongive = ongive;
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
                    onconnect=function(){},
                    ondisconnect=function(){},
                ){
                    //elements
                        //main
                            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
                            object._connectionNode = true;
                            object._type = 'signal';
                        //node
                            var rectangle = canvas.part.builder('rectangle','node',{ width:width, height:height, style:{fill:dimStyle} });
                                object.append(rectangle);
                
                
                    //control
                        var value = 0;
                
                        object._set = function(a){
                            value = a;
                            if(onchange!=undefined){this.onchange(a);}
                
                            object.updateGraphics();
                        };
                        object.set = function(a){
                            this._set(a);
                            if(foreignNode!=undefined){foreignNode._set(a);}
                        };
                        object.read = function(){
                            return value;
                        };
                
                    //network functions
                        var foreignNode = undefined;
                
                        object.connectTo = function(new_foreignNode){
                            if( new_foreignNode == this ){ return; }
                            if( new_foreignNode._type != this._type ){ return; }
                            if( new_foreignNode == foreignNode ){ return; }
                
                            this.disconnect();
                
                            foreignNode = new_foreignNode;
                            foreignNode._receiveConnection(this);
                            if(onconnect!=undefined){this.onconnect();}
                
                            this._addCable(this);
                            object.updateGraphics();
                        };
                        object._receiveConnection = function(new_foreignNode){
                            this.disconnect();
                            foreignNode = new_foreignNode;
                            this._set( foreignNode.read() );
                            if(onconnect!=undefined){this.onconnect();}
                        };
                        object.disconnect = function(){
                            if( foreignNode == undefined ){return;}
                
                            this._removeCable();
                            object.updateGraphics();
                            foreignNode._receiveDisconnection();
                            foreignNode = null;
                
                            if(ondisconnect!=undefined){this.ondisconnect();}
                        };
                        object._receiveDisconnection = function(){
                            foreignNode = null;
                            object.updateGraphics();
                            if(ondisconnect!=undefined){this.ondisconnect();}
                        };
                
                
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
                            cable = canvas.part.builder('cable','cable-'+this.getAddress(),{ x1:0,y1:0,x2:100,y2:100, style:{dimStyle:cable_dimStyle, glowStyle:cable_glowStyle}});
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
                        object.updateGraphics = function(){
                            if(value > 0){object.activate();}
                            else{object.deactivate();}
                        };
                        object.activate = function(){ 
                            rectangle.style.fill = glowStyle;
                            if(cable!=undefined){ cable.activate(); }
                        }
                        object.deactivate = function(){ 
                            rectangle.style.fill = dimStyle;
                            if(cable!=undefined){ cable.deactivate(); }
                        }
                
                    //callbacks
                        object.onchange = onchange;
                        object.onconnect = onconnect;
                        object.ondisconnect = ondisconnect;
                
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
                        name, data.x, data.y, data.text, data.angle, data.anchor, data.ignored,
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
                            data.textVerticalOffsetMux, data.extHorizontalOffsetMux,
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
        
                //dynamic
                    case 'cable': return this.element.dynamic.cable(
                        name, data.x1, data.y1, data.x2, data.y2,
                        data.style.dimStyle, data.style.glowStyle,
                    );
                    case 'connectionNode_signal': return this.element.dynamic.connectionNode_signal(
                        name, data.x, data.y, data.angle, data.width, data.height,
                        data.style.dimStyle, data.style.glowStyle, data.style.cable_dimStyle, data.style.cable_glowStyle, 
                        data.onchange, data.onconnect, data.ondisconnect,
                    );
                    case 'connectionNode_data': return this.element.dynamic.connectionNode_data(
                        name, data.x, data.y, data.angle, data.width, data.height,
                        data.style.dimStyle, data.style.glowStyle, data.style.cable_dimStyle, data.style.cable_glowStyle, 
                        data.onreceive, data.ongive, data.onconnect, data.ondisconnect,
                    );
                    case 'connectionNode_audio': return this.element.dynamic.connectionNode_audio(
                        name, data.x, data.y, data.angle, data.width, data.height, data.isAudioOutput, canvas.library.audio.context,
                        data.style.dimStyle, data.style.glowStyle, data.style.cable_dimStyle, data.style.cable_glowStyle, 
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
            controlGroup.append( canvas.part.builder( 'checkbox_rect', 'test_checkbox_rect1', {x:150,y:35} ) );
            controlGroup.append( canvas.part.builder( 'rastorgrid', 'test_rastorgrid1', {x:100,y:115} ) );
        
        //dynamic
            var dynamicGroup = canvas.part.builder( 'group', 'dynamic', { x:240, y:120, angle:0 } );
            canvas.system.pane.mm.append( dynamicGroup );
            dynamicGroup.append( canvas.part.builder( 'cable', 'test_cable1', {x1:0,y1:0,x2:100,y2:0} ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal1', { x:25, y:25 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal2', { x:0,  y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal3', { x:50, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data1', { x:125, y:25 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data2', { x:100, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data3', { x:150, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio1', { x:225, y:25, isAudioOutput:true} ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio2', { x:200, y:75 } ) );
            dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio3', { x:250, y:75 } ) );


    }
}
