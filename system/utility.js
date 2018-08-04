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
//        placeAndReturnObject            (object, pane='middleground')
//        mouseInteractionHandler         (moveCode, stopCode)
//        clear                           (pane='middleground')
//        exportScene                     (bundleConstructorFunctions=false)
//        importScene                     (data, bundleConstructorFunctions=false, constructorFunctions)
//        saveload
//            save                        (compress=true, sceneName='project', bundleConstructorFunctions=false)
//            __loadProcess               (data, compressed)
//            load                        (compressed=true)
//            loadFromURL                 (url, compressed=true)
//        setStaticBackgroundStyle        (style)
//    
//    element
//        getTransform                    (element)
//        getCumulativeTransform          (element)
//        getTruePoint                    (element)
//        setTransform                    (element, transform:{x:0, y:0, s:1, r:0})
//        setTransform_XYonly             (element, x, y)
//        setStyle                        (element, style)
//        setRotation                     (element, rotation)
//        getBoundingBox                  (element)
//        makeUnselectable                (element)
//        getPositionWithinFromMouse      (event, element, elementWidth, elementHeight)
//        styleExtractor                  (string)
//        stylePacker                     (object)
//    
//    object
//        requestInteraction              (x,y,type) (browser position)
//        //disconnectEverything          (object)
//        generateSelectionArea           (points:[{x:0,y:0},...], object)
//    
//    audio
//        changeAudioParam                (audioParam, target, time, curve, cancelScheduledValues=true)
//        loadBuffer                      (callback, type='file', url)
//        waveformSegment                 (audioBuffer, bounds={start:0,end:1})
//    
//    math
//        averageArray                    (array)
//        largestValueFound               (array)
//        polar2cartesian                 (angle,distance)
//        cartesian2polar                 (x,y)
//        boundingBoxFromPoints           (points:[{x:0,y:0},...])
//        intersectionOfTwoLineSegments   (segment1:{{x:0,y:0},{x:0,y:0}}, segment2:{{x:0,y:0},{x:0,y:0}})
//        seconds2time                    (seconds)
//        detectOverlap                   (poly_a:[{x:0,y:0},...], poly_b:[{x:0,y:0},...], box_a:[{x:0,y:0},{x:0,y:0}]=null, box_b:[{x:0,y:0},{x:0,y:0}]=null)
//        normalizeStretchArray           (array)
//        curvePoint
//            linear                      (x, start=0, end=1)
//            sin                         (x, start=0, end=1)
//            cos                         (x, start=0, end=1)
//            s                           (x, start=0, end=1, sharpness=8)
//        curveGenerator
//            linear                      (stepCount, start=0, end=1)
//            sin                         (stepCount, start=0, end=1)
//            cos                         (stepCount, start=0, end=1)
//            s                           (stepCount, start=0, end=1, sharpness=8)
//            exponential                 (stepCount, start=0, end=1)
//
//    misc
//        padString                      (string, length)
//        compressString                 (string)
//        decompressString               (string)
//        serialize                      (data, compress=true)
//        unserialize                    (data, compressed=true)
//        printFile                      (filename, data)
//        openFile                       (callback)
//        elementMaker                   (type, name, data)
//        objectBuilder                  (creatorMethod, design)
//
//    thirdparty
//        lzString (contains code for compressing and decompressing strings)
//    
//    experimental

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
            if(x == undefined || y == undefined){return;}

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
        this.dotMaker = function(x,y,text='',r=1,style='fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;',push=false){
            var g = __globals.utility.misc.elementMaker('g',null,{x:x, y:y});

            var dot = __globals.utility.misc.elementMaker('circle',null,{x:0, y:0, r:r, style:style});
            var textElement =  __globals.utility.misc.elementMaker('text',null,{x:0, y:0, angle:0, text:text, style:style});
            g.appendChild(dot);
            g.appendChild(textElement);

            if(push){__globals.panes.foreground.append(g);}

            return g;
        };
        this.getGlobalScale = function(element){
            return __globals.utility.element.getTransform(__globals.utility.workspace.getGlobal(element)).s
        };
        this.getViewportDimensions = function(){
            return {width:__globals.svgElement.width.baseVal.value, height:__globals.svgElement.height.baseVal.value};
        };
        this.placeAndReturnObject = function(object,pane='middleground'){
            return __globals.panes[pane].appendChild( object );
        };
        this.mouseInteractionHandler = function(moveCode, stopCode){
            if(moveCode == undefined){return;}

            __globals.svgElement.onmousemove_old = __globals.svgElement.onmousemove;
            __globals.svgElement.onmouseup_old = __globals.svgElement.onmouseup;
            __globals.svgElement.onmouseleave_old = __globals.svgElement.onmouseleave;

            __globals.svgElement.onmousemove = function(event){ moveCode(event); };
            __globals.svgElement.onmouseup = function(event){
                if(stopCode != undefined){ stopCode(event); }
                __globals.svgElement.onmousemove = __globals.svgElement.onmousemove_old;
                __globals.svgElement.onmouseleave = __globals.svgElement.onmouseleave_old;
                __globals.svgElement.onmouseup = __globals.svgElement.onmouseup_old;
            };
            __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
        };
        this.clear = function(pane='middleground'){
            __globals.panes[pane].innerHTML = '';
        };
        this.exportScene = function(bundleConstructorFunctions=false){
            var outputData = [];
            var constructorFunctions = {};
        
            //create array of all objects to be saved
                var objectsArray = Array.from(__globals.panes.middleground.children);
        
            //strip out all the cable objects (they have the id 'null')
                var temp = [];
                for(var a = 0; a < objectsArray.length; a++){
                    if(objectsArray[a].id != 'null'){
                        temp.push(objectsArray[a]);
                    }
                }
                objectsArray = temp;
        
            //cycle through this array, and create the scene data
                for(var a = 0; a < objectsArray.length; a++){
                    var entry = {};
        
                    //save the object's constructor
                        //(if the object doesn't have a constructor, don't bother with any of this)
                        if( !objectsArray[a].creatorMethod ){continue;}
                        //if bundleConstructorFunctions is true, save all the constructor functions 
                        //in constructorFunctions, then add the constructor name to the entry
                        if(bundleConstructorFunctions){
                            constructorFunctions[objectsArray[a].id] = objectsArray[a].creatorMethod;
                        }
                        //if it's not set, just add the constructor name to the entry
                        entry.objectConstructorName = objectsArray[a].id
                        
                    //get the objects position
                        entry.position = __globals.utility.element.getTransform(objectsArray[a]);
        
                    //export the object's state
                        if( objectsArray[a].exportData ){
                            entry.data = objectsArray[a].exportData();
                        }
        
                    //log all connections
                        if(objectsArray[a].io){
                            var connections = [];
                            var keys = Object.keys(objectsArray[a].io);
                            for(var b = 0; b < keys.length; b++){
                                var connection = {};
        
                                //originPort
                                    connection.originPort = keys[b];
                                //destinationPort and indexOfDestinationObject
                                    if(!objectsArray[a].io[keys[b]].foreignNode){continue;}
        
                                    var destinationPorts = Object.keys(objectsArray[a].io[keys[b]].foreignNode.parentElement.io);
                                    for(var c = 0; c < destinationPorts.length; c++){
                                        if(objectsArray[a].io[keys[b]].foreignNode.parentElement.io[destinationPorts[c]] === objectsArray[a].io[keys[b]].foreignNode){
                                            connection.destinationPorts = destinationPorts[c];
                                            connection.destinationIndex = objectsArray.indexOf(objectsArray[a].io[keys[b]].foreignNode.parentElement);
                                            break;
                                        }
                                    }
                                    if( connection.destinationIndex >= 0 ){ connections.push(connection); }
                            }
                            entry.connections = connections;
                        }
        
                    //add this entry to the save data list
                        outputData.push(entry);
                }
        
            return {scene:outputData, constructorFunctions:constructorFunctions};
        };
        this.importScene = function(data,bundleConstructorFunctions=false,constructorFunctions){
            //print objects to scene
                var producedObjects = [];
                for(var a = 0; a < data.length; a++){
                    var entry = data[a];
        
                    //get the creator function
                        //if bundleConstructorFunctions is set to true, look through the constructorFunctions
                        //to find the one that matches this object's objectConstructorName
                        //otherwise; look through the system's object constructor list to find it
                        var constructor = bundleConstructorFunctions ? constructorFunctions[entry.objectConstructorName] : objects[entry.objectConstructorName];
        
                    //create the object and place
                        var newObject = __globals.utility.workspace.placeAndReturnObject( constructor(entry.position.x,entry.position.y) );
        
                    //import object's state
                        if(newObject.importData){
                            newObject.importData(entry.data);
                        }
        
                    //perform connections
                        if(entry.connections){
                            entry.connections.forEach(function(conn){
                                if( conn.destinationIndex < producedObjects.length ){
                                    newObject.io[conn.originPort].connectTo( producedObjects[conn.destinationIndex].io[conn.destinationPorts] );
                                }
                            });
                        }
                    //add object to produced list (for the connection handler to use in future)
                        producedObjects.push(newObject);
                }
        };
        this.saveload = new function(){
            this.save = function(compress=true,sceneName='project',bundleConstructorFunctions=false){
                var outputData = {
                    sceneName:sceneName,
                    bundleConstructorFunctions:bundleConstructorFunctions,
                    viewportLocation:__globals.utility.workspace.currentPosition(),
                    constructorFunctions:{},
                    objects:[],
                };
                var sceneName = outputData.sceneName;
            
                //stopping audio
                    __globals.audio.destination.masterGain(0);

                //gather the scene data
                    var temp = __globals.utility.workspace.exportScene(outputData.bundleConstructorFunctions);
                    outputData.objects = temp.scene;
                    outputData.constructorFunctions = temp.constructorFunctions;
            
                //serialize data
                    outputData = __globals.utility.misc.serialize(outputData,compress);
            
                //print to file
                    __globals.utility.misc.printFile(sceneName+'.crv',outputData);
                
                //restarting audio
                    __globals.audio.destination.masterGain(1);
            };
            this.__loadProcess = function(data,compressed){
                //stopping audio
                    __globals.audio.destination.masterGain(0);
                    
                //clear current scene
                    __globals.utility.workspace.clear()
    
                //unserialize data
                    data = __globals.utility.misc.unserialize(data,compressed);
        
                //import scene
                    __globals.utility.workspace.importScene(data.objects, data.bundleConstructorFunctions, data.constructorFunctions);

                //set viewport position
                    __globals.utility.workspace.gotoPosition(data.viewportLocation.x, data.viewportLocation.y, data.viewportLocation.s, data.viewportLocation.r);
                
                //restarting audio
                    __globals.audio.destination.masterGain(1);
            
                console.log('scene "'+data.sceneName+'" has been loaded');
            };
            this.load = function(compressed=true){
                __globals.utility.misc.openFile(function(data){__globals.utility.workspace.saveload.__loadProcess(data,compressed);});
            };
            this.loadFromURL = function(url,compressed=true){
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'text';
                request.onload = function(){ __globals.utility.workspace.saveload.__loadProcess(this.response,compressed); };
                request.send();
            };
        };
        this.setStaticBackgroundStyle = function(style){
            __globals.panes.staticBackground.innerHTML = '';
            __globals.utility.workspace.placeAndReturnObject( __globals.utility.misc.elementMaker('rect',null,{width:'100%',height:'100%',style:style+'pointer-events:none;'}), 'staticBackground' );    
        };
    };
    this.element = new function(){
        this.getTransform = function(element){
            var pattern = /translate\((.*)px,| (.*)px|\) scale\((.*)\) |rotate\((.*)rad\)/g;

            var result = [];
            for(var a = 0; a < 4; a++){
                result.push(Number(pattern.exec(element.style.transform)[a+1]));
            }
            
            return {x:result[0],y:result[1],s:result[2],r:result[3]};
        };
        this.getCumulativeTransform = function(element){
            data = this.getTransform(element);
            while( !element.parentElement.getAttribute('pane') ){
                element = element.parentElement;
                var newData = this.getTransform(element);
                data.x += newData.x;
                data.y += newData.y;
                data.s *= newData.s;
                data.r += newData.r;
            }
            return data;
        };
        this.getTruePoint = function(element){
            data = this.getTransform(element);
            while( !element.parentElement.getAttribute('pane') ){
                element = element.parentElement;
                var newData = this.getTransform(element);
                var temp = __globals.utility.math.cartesian2polar(data.x,data.y);
                temp.ang += newData.r;
                temp = __globals.utility.math.polar2cartesian(temp.ang,temp.dis);
                data.x = temp.x + newData.x;
                data.y = temp.y + newData.y;
                data.s *= newData.s;
                data.r += newData.r;
            }
            return data;
        };
        this.setTransform = function(element, transform){
            element.style.transform = 'translate('+transform.x.toFixed(16)+'px, '+(transform.y.toFixed(16))+'px) scale('+transform.s.toFixed(16)+') rotate(' +transform.r.toFixed(16)+ 'rad)';
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
        this.getPositionWithinFromMouse = function(event, element, elementWidth, elementHeight){
            var elementOrigin = __globals.utility.element.getTruePoint(element);
            var mouseClick = __globals.utility.workspace.pointConverter.browser2workspace(event.offsetX,event.offsetY);

            var temp = __globals.utility.math.cartesian2polar(
                mouseClick.x-elementOrigin.x,
                mouseClick.y-elementOrigin.y
            );
            temp.ang -= elementOrigin.r;
            temp = __globals.utility.math.polar2cartesian(temp.ang,temp.dis);

            var ans = { x:temp.x/elementWidth, y:temp.y/elementHeight };
            if(ans.x < 0){ans.x = 0;}else if(ans.x > 1){ans.x = 1;}
            if(ans.y < 0){ans.y = 0;}else if(ans.y > 1){ans.y = 1;}
            return ans;
        };
        this.styleExtractor = function(string){
            var outputObject= {};

            //split style string into individual settings (and filter out any empty strings)
                var array = string.split(';').filter(function(n){ return n.length != 0 });

            //create the object
            try{
                for(var a = 0; a < array.length; a++){
                    //split on colon
                        var temp = array[a].split(':');
                    //strip whitespace
                        temp[0] = temp[0].replace(/^\s+|\s+$/g, '');
                        temp[1] = temp[1].replace(/^\s+|\s+$/g, '');
                    //push into object
                        outputObject[temp[0]] = temp[1];
                }
            }catch(e){console.error('styleExtractor was unable to parse the string "'+string+'"');return {};}
            
            return outputObject;
        };
        this.stylePacker = function(object){
            var styleString = '';
            var keys = Object.keys(object);
            for(var a = 0; a < keys.length; a++){
                styleString += keys[a] +':'+ object[keys[a]] +';';
            }
            return styleString;
        };
    };
    this.object = new function(){
        this.requestInteraction = function(x,y,type,globalName){
            if(!x || !y){return true;}
            var temp = document.elementFromPoint(x,y);
    
            if(temp.hasAttribute('workspace')){return true;}
            while(!temp.hasAttribute('global')){
                if(temp == document.body){ return false; }

                if(temp[type] || temp.hasAttribute(type)){return false;}
                temp = temp.parentElement;
            }
            
            return temp.getAttribute('pane')==globalName;
        };
        // this.disconnectEverything = function(object){
        //     console.warn('you\'re using this?');
        //     // var keys = Object.keys(object.io);
        //     // for(var a = 0; a < keys.length; a++){
        //     //     object.io[keys[a]].disconnect();
        //     // }
        // };
        this.generateSelectionArea = function(points, object){
            var debug = false;
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

            if(debug){
                for(var a = 0; a < object.selectionArea.box.length; a++){ __globals.panes.foreground.append( __globals.utility.workspace.dotMaker(object.selectionArea.box[a].x, object.selectionArea.box[a].y, a) ); }
                for(var a = 0; a < object.selectionArea.points.length; a++){ __globals.panes.foreground.append( __globals.utility.workspace.dotMaker(object.selectionArea.points[a].x, object.selectionArea.points[a].y, a) ); }
            }
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
        this.loadAudioFile = function(callback,type='file',url=''){
            switch(type){
                case 'url': 
                    var request = new XMLHttpRequest();
                    request.open('GET', url, true);
                    request.responseType = 'arraybuffer';
                    request.onload = function(){
                        __globals.audio.context.decodeAudioData(this.response, function(data){
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
                            __globals.audio.context.decodeAudioData(data.target.result, function(buffer){
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
            var channelCount = audioBuffer.numberOfChannels;

            bounds.start = bounds.start ? bounds.start : 0;
            bounds.end = bounds.end ? bounds.end : 1;
            var resolution = 10000;
            var start = audioBuffer.length*bounds.start;
            var end = audioBuffer.length*bounds.end;
            var step = (end - start)/resolution;

            var outputArray = [];
            for(var a = start; a < end; a+=Math.round(step)){
                outputArray.push( 
                    __globals.utility.math.largestValueFound(
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
    };
    this.math = new function(){
        this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        this.largestValueFound = function(array){
            return array.reduce(function(max,current){
                return Math.abs(max) > Math.abs(current) ? max : current;
            });
        };
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
    
            return [{x:right,y:bottom},{x:left,y:top}];
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
        this.detectOverlap = function(poly_a, poly_b, box_a, box_b){
            var debugMode = false;

            // Quick Judgement with bounding boxes
            // (when bounding boxes are provided)
            if(box_a && box_b){

                //sort boxes ("largest points" should be first)
                    if(box_a[0].x < box_a[1].x){
                        if(debugMode){console.log('bounding box a sorting required');}
                        var temp = box_a[0];
                        box_a[0] = box_a[1];
                        box_a[1] = temp;
                    }
                    if(box_b[0].x < box_b[1].x){
                        if(debugMode){console.log('bounding box b sorting required');}
                        var temp = box_b[0];
                        box_b[0] = box_b[1];
                        box_b[1] = temp;
                    }

                if(
                    (box_a[0].y < box_b[1].y) || //a_0_y (a's highest point) is below b_1_y (b's lowest point)
                    (box_a[1].y > box_b[0].y) || //a_1_y (a's lowest point) is above b_0_y (b's highest point)
                    (box_a[0].x < box_b[1].x) || //a_0_x (a's leftest point) is right of b_1_x (b's rightest point)
                    (box_a[1].x > box_b[0].x)    //a_1_x (a's rightest point) is left of b_0_x (b's leftest point)
                ){if(debugMode){console.log('clearly separate shapes');}return false;}
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
                            if(dis==0){if(debugMode){console.log('oh hay, collision - AinB');}return true; }
                            //get distance from point to line segment
                            //if zero, it's a collision and we can end early
    
                        if( tempSmallestDistance.dis > dis ){ 
                            //if this distance is the smallest found in this round, save the distance and side
                            tempSmallestDistance.dis = dis; 
                            tempSmallestDistance.side = sideOfLineSegment(point, linePoint_1, linePoint_2);
                        }
                    }
                    if( tempSmallestDistance.side ){if(debugMode){console.log('a point from A is in B');}return true;}
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
                            if(dis==0){if(debugMode){console.log('oh hay, line collision - BinA');}return true; }
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
                    if( tempSmallestDistance.side ){if(debugMode){console.log('a point from B is in A');}return true;}
                }
    
                //side intersection
                // compare each side of each poly to every other side, looking for lines that
                // cross each other. If a crossing is found at any point; return true
                    for(var a = 0; a < poly_a_clone.length-1; a++){
                        for(var b = 0; b < poly_b_clone.length-1; b++){
                            var data = this.intersectionOfTwoLineSegments(poly_a_clone, poly_b_clone);
                            if(!data){continue;}
                            if(data.inSeg1 && data.inSeg2){if(debugMode){console.log('point intersection at ' + data.x + ' ' + data.y);}return true;}
                        }
                    }
    
            return false;
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
                var temp = __globals.utility.math.normalizeStretchArray([
                    1/( 1 + Math.exp(-sharpness*(0-0.5)) ),
                    1/( 1 + Math.exp(-sharpness*(x-0.5)) ),
                    1/( 1 + Math.exp(-sharpness*(1-0.5)) ),
                ]);
                return temp[1] *(end-start)+start;
            };
            this.exponential = function(x=0.5, start=0, end=1, sharpness=2){
                var temp = __globals.utility.math.normalizeStretchArray([
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
    
                var outputArray = __globals.utility.math.normalizeStretchArray(curve);
    
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

                outputArray = __globals.utility.math.normalizeStretchArray(outputArray);

                var mux = end-start;
                for(var a = 0 ; a < outputArray.length; a++){
                    outputArray[a] = outputArray[a]*mux + start;
                }
    
                return outputArray;
            };
        };
    };
    this.misc = new function(){
        this.padString = function(string,length,padding=' '){
            if(padding.length<1){return string;}
            string = ''+string;

            while(string.length < length){
                string = padding + string;
            }

            return string;
        };
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
                return __globals.utility.misc.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
        };
        this.compressString = function(string){return __globals.utility.thirdparty.lzString.compress(string);};
        this.decompressString = function(string){return __globals.utility.thirdparty.lzString.decompress(string);};
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
        
            if(compress){ data = __globals.utility.misc.compressString(data); }
            return data;
        };
        this.unserialize = function(data,compressed=true){
            if(data === undefined){return undefined;}
        
            if(compressed){ data = __globals.utility.misc.decompressString(data); }
        
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
                            var audioBuffer = __globals.audio.context.createBuffer(value.__numberOfChannels, value.__length, value.__sampleRate);
        
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
        this.openFile = function(callback){
            var i = document.createElement('input');
            i.type = 'file';
            i.onchange = function(){
                var f = new FileReader();
                f.readAsBinaryString(this.files[0]);
                f.onloadend = function(){ if(callback){callback(f.result);} }
            };
            i.click();
        };
        this.printFile = function(filename,data){
            var a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([data]));
            a.download = filename;
            a.click();
        };
        this.elementMaker = function(type,name,data){
            if(!data.style){data.style='';}
            switch(type){

                //basic
                    case 'g':      return parts.elements.basic.g(name, data.x, data.y, data.r, data.style); break;
                    case 'line':   return parts.elements.basic.line(name, data.x1, data.y1, data.x2, data.y2, data.style); break;
                    case 'rect':   return parts.elements.basic.rect(name, data.x, data.y, data.width, data.height, data.angle, data.style); break;
                    case 'path':   return parts.elements.basic.path(name, data.path, data.lineType, data.style); break;
                    case 'text':   return parts.elements.basic.text(name, data.x, data.y, data.text, data.angle, data.style); break;
                    case 'circle': return parts.elements.basic.circle(name, data.x, data.y, data.r, data.angle, data.style); break;
                    case 'canvas': return parts.elements.basic.canvas(name, data.x, data.y, data.width, data.height, data.angle, data.resolution); break;
            }

            if(data.style == ''){data.style={};}
            switch(type){
                default: console.warn('Unknown element: '+ type); return null; break;

                //display
                    case 'label': return parts.elements.display.label(name, data.x, data.y, data.text, data.style, data.angle); break;
                    case 'level': return parts.elements.display.level(name, data.x, data.y, data.angle, data.width, data.height, data.style.backing, data.style.level); break;
                    case 'meter_level': return parts.elements.display.meter_level(name, data.x, data.y, data.angle, data.width, data.height, data.markings, data.style.backing, data.style.levels, data.style.marking); break;
                    case 'audio_meter_level': return parts.elements.display.audio_meter_level(name, data.x, data.y, data.angle, data.width, data.height, data.markings, data.style.backing, data.style.levels, data.style.marking); break;
                    case 'sevenSegmentDisplay': return parts.elements.display.sevenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.style.background, data.style.glow, data.style.dim); break;
                    case 'sixteenSegmentDisplay': return parts.elements.display.sixteenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.style.background, data.style.glow, data.style.dim); break;
                    case 'readout_sixteenSegmentDisplay': return parts.elements.display.readout_sixteenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.count, data.style.background, data.style.glow, data.style.dime); break;
                    case 'rastorDisplay': return parts.elements.display.rastorDisplay(name, data.x, data.y, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage); break;
                    case 'glowbox_rect': return parts.elements.display.glowbox_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim); break;
                    case 'grapherSVG': return parts.elements.display.grapherSVG(name, data.x, data.y, data.width, data.height, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
                    case 'grapherCanvas': return parts.elements.display.grapherCanvas(name, data.x, data.y, data.width, data.height, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
                    case 'grapher_periodicWave': return parts.elements.display.grapher_periodicWave(name, data.x, data.y, data.width, data.height, data.graphType, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
                    case 'grapher_audioScope': return parts.elements.display.grapher_audioScope(  name, data.x, data.y, data.width, data.height, data.graphType, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;

                //control
                    case 'button_rect': 
                        var temp = parts.elements.control.button_rect(name, data.x, data.y, data.width, data.height, data.angle ,data.style.up, data.style.hover, data.style.down, data.style.glow);
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
                        var temp = parts.elements.control.checkbox_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow);
                        temp.onchange = data.onchange ? data.onchange : temp.onchange;
                        return temp;
                    break;
                    case 'key_rect':
                        var temp = parts.elements.control.key_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.off, data.style.press, data.style.glow, data.style.pressAndGlow);
                        temp.keyup =   data.keyup   ? data.keyup   : temp.keyup;
                        temp.keydown = data.keydown ? data.keydown : temp.keydown;
                        return temp;
                    break;
                    case 'slide':
                        var temp = parts.elements.control.slide(name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.value, data.resetValue, data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle);
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'slidePanel':
                        var temp = parts.elements.control.slidePanel(name, data.x, data.y, data.width, data.height, data.count, data.angle, data.handleHeight, data.value, data.resetValue, data.style.handle, data.style.backing, data.style.slot);
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'rangeslide':
                        var temp = parts.elements.control.rangeslide(name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.spanWidth, data.values, data.resetValues, data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span);
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        return temp;
                    break;
                    case 'dial_continuous': 
                        var temp = parts.elements.control.dial_continuous(
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
                        var temp = parts.elements.control.dial_discrete(
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
                        var temp = parts.elements.control.rastorgrid(
                            name,
                            data.x, data.y, data.width, data.height,
                            data.xCount, data.yCount,
                            data.style.backing,
                            data.style.check,
                            data.style.backingGlow,
                            data.style.checkGlow
                        );
                        temp.onchange = data.onchange ? data.onchange  : temp.onchange  ;
                        return temp;
                    break;
                    case 'sequencer':
                        var temp = parts.elements.control.sequencer(
                            name,
                            data.x, data.y, data.width, data.height, data.angle,
                            data.xCount, data.yCount,
                            data.zoomLevel_x, data.zoomLevel_y,
                            data.style.backing,
                            data.style.selectionArea,
                            data.style.block_body, data.style.block_bodyGlow, data.style.block_handle, data.style.block_handleWidth,
                            data.style.horizontalStrip_pattern, data.style.horizontalStrip_glow, data.style.horizontalStrip_styles,
                            data.style.verticalStrip_pattern,   data.style.verticalStrip_glow,   data.style.verticalStrip_styles,
                            data.style.playhead,
                        );
                        temp.onpan = data.onpan ? data.onpan : temp.onpan;
                        temp.onchangeviewarea = data.onchangeviewarea ? data.onchangeviewarea : temp.onchangeviewarea;
                        temp.event = data.event ? data.event : temp.event;
                        return temp;
                    break;
                    case 'needleOverlay':
                        var temp = parts.elements.control.needleOverlay(
                            name, data.x, data.y, data.width, data.height, data.angle,
                            data.needleWidth, data.selectNeedle, data.selectionArea,
                            data.needleStyles,
                        );
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease;
                        temp.selectionAreaToggle = data.selectionAreaToggle ? data.selectionAreaToggle : temp.selectionAreaToggle;
                        return temp;
                    break;
                    case 'grapher_waveWorkspace':
                        var temp = parts.elements.control.grapher_waveWorkspace(
                            name, data.x, data.y, data.width, data.height, data.angle, data.graphType, data.selectNeedle, data.selectionArea,
                            data.style.foreground,   data.style.foregroundText,
                            data.style.middleground, data.style.middlegroundText,
                            data.style.background,   data.style.backgroundText,
                        );
                        temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                        temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                        temp.selectionAreaToggle = data.selectionAreaToggle ? data.selectionAreaToggle : temp.selectionAreaToggle ;
                        return temp;
                    break;

                //dynamic
                    case 'cable': return parts.elements.dynamic.cable(name, data.x1, data.y1, data.x2, data.y2, data.style.unactive, data.style.active); break;
                    case 'connectionNode_audio': return parts.elements.dynamic.connectionNode_audio(name, data.type, data.x, data.y, data.width, data.height, data.angle, __globals.audio.context); break;
                    case 'connectionNode_data': 
                        var temp = parts.elements.dynamic.connectionNode_data(name, data.x, data.y, data.width, data.height, data.angle);
                        temp.receive = data.receive ? data.receive : temp.receive;
                        temp.give = data.give ? data.give : temp.give;
                        return temp;
                    break;
            }
        }; 
        this.objectBuilder = function(creatorMethod,design){
            //main
                var obj = __globals.utility.misc.elementMaker('g',design.type,{x:design.x, y:design.y});

            //generate selection area
                if(design.base.type == undefined){design.base.type = 'path';}
                switch(design.base.type){
                    case 'rect':
                        //generate selection area
                            design.base.points = [{x:design.x,y:design.y}, {x:design.width,y:design.y}, {x:design.width,y:design.height}, {x:design.x,y:design.height}];
                            __globals.utility.object.generateSelectionArea(design.base.points, obj);
                            
                        //backing
                            design.base = __globals.utility.misc.elementMaker('rect',null,{x:design.base.x, y:design.base.y, width:design.base.width, height:design.base.height, angle:design.base.angle, style:design.base.style});
                    break;
                    case 'circle': 
                        //generate selection area
                            var res = 12; //(number of sides generated)
                            var mux = 2*Math.PI/res;
                            design.base.points = [];
                            for(var a = 0; a < res; a++){
                                design.base.points.push(
                                    { x:design.base.x-Math.sin(a*mux)*design.base.r, y:design.base.y-Math.cos(a*mux)*design.base.r }
                                );
                            }
                            __globals.utility.object.generateSelectionArea(design.base.points, obj);
                            
                        //backing
                            design.base = __globals.utility.misc.elementMaker('circle',null,{x:design.base.x, y:design.base.y, r:design.base.r, angle:design.base.angle, style:design.base.style});
                    break;
                    case 'path': 
                        //generate selection area
                            __globals.utility.object.generateSelectionArea(design.base.points, obj);
                        //backing
                            design.base = __globals.utility.misc.elementMaker('path',null,{path:design.base.points, lineType:'L', style:design.base.style});
                    break;
                    default: console.error('Unknown base type:',design.base.type,'when creating object "'+design.type+'"'); return; break;
                };
                obj.append(design.base);

                //declare grapple
                    if(!design.skipGrapple){
                        __globals.mouseInteraction.declareObjectGrapple(design.base, obj, creatorMethod);
                    }

            //generate elements
                if(design.elements){
                    for(var a = 0; a < design.elements.length; a++){
                        if(!design[design.elements[a].type]){design[design.elements[a].type]={};}
                        if(design.elements[a].name in design[design.elements[a].type]){console.warn('error: element with the name "'+design.elements[a].name+'" already exists. Element:',design.elements[a],'will not be added');continue;}
                        design[design.elements[a].type][design.elements[a].name] = __globals.utility.misc.elementMaker(design.elements[a].type,design.elements[a].name,design.elements[a].data);
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
    this.thirdparty = new function(){
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
    this.experimental = new function(){
    };
};