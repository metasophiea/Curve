// (function(){
    var __svgElements = document.getElementsByTagName('svg');
    for(var __svgElements_count = 0; __svgElements_count < __svgElements.length; __svgElements_count++){
        if( __svgElements[__svgElements_count].hasAttribute('workspace') ){
            var system = new function(){};
            
            system.svgElement = __svgElements[__svgElements_count];
            
            
            //added sequentially as some sections rely on others
            system.super = new function(){
                //detect development mode
                    this.devMode = (new URL(window.location.href)).searchParams.get("dev") != null;
                
                    //stop page unload
                    //(will only work when page is not in dev mode)
                        if( !this.devMode ){
                            window.onbeforeunload = function(){ return "Unsaved work will be lost"; };
                        }
                
                //detect test mode
                    this.testMode = (new URL(window.location.href)).searchParams.get("test") != null;
                
                
                    
                //enable/disable mouse wheel zoom
                    this.mouseWheelZoomEnabled = true;
                //enable/disable mouse grip panning
                    this.mouseGripPanningEnabled = true;
                //enable/disable scene read-only mode
                    this.readOnlyMode = false;
                //enable/disable scene load and save
                    this.enableSaveload = true;
                //enable/disable menubar
                    this.enableMenubar = true;
                //enable/disable window scrollbar automatic removal
                    this.enableWindowScrollbarAutomaticRemoval = true;
                //enable/disable cable disconnection/connection
                    this.enablCableDisconnectionConnection = true;
                
                
                
                //adjustable keyboard mapping
                    this.keys = {
                        alt: 'altKey',
                        ctrl: 'ctrlKey',
                    };
                
                    if( window.navigator.platform.indexOf('Mac') != -1 ){
                        this.keys.ctrl = 'metaKey';
                    }
                
                //help folder location
                    // this.helpFolderLocation = 'https://metasophiea.com/curve/help/';
                    this.helpFolderLocation = 'help/index.html';
                    this.helpFolderLocation = 'help/';
                
                //enter demo mode
                    this.demoMode = function(a){
                        this.mouseWheelZoomEnabled = !a;
                        this.mouseGripPanningEnabled = !a;
                        this.readOnlyMode = a;
                        this.enableSaveload = !a;
                        this.enableMenubar = !a;
                        this.enableWindowScrollbarAutomaticRemoval = !a;
                        this.enablCableDisconnectionConnection = !a;
                        window.onbeforeunload = undefined;
                    };
                

            };
            system.utility = new function(){
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
                //        disconnectEverything            (object)
                //        generateSelectionArea           (points:[{x:0,y:0},...], object)
                //        deleteObject                    (object)
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
                //        relativeDistance                (realLength, start,end, d, allowOverflow=false
                //        lineCorrecter                   (points, maxheight, maxwidth)
                //
                //    misc
                //        padString                      (string, length)
                //        compressString                 (string)
                //        decompressString               (string)
                //        serialize                      (data, compress=true)
                //        unserialize                    (data, compressed=true)
                //        printFile                      (filename, data)
                //        openFile                       (callback)
                //
                //    thirdparty
                //        lzString (contains code for compressing and decompressing strings)
                //    
                //    experimental
                
                this.workspace = new function(){
                    this.currentPosition = function(){
                        return system.utility.element.getTransform(system.pane.workspace);
                    };
                    this.gotoPosition = function(x,y,z,r){
                        system.utility.element.setTransform(system.pane.workspace, {x:x,y:y,s:z,r:r});
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
                            var globalTransform = system.utility.element.getTransform(system.pane.workspace);
                            return {'x':(x-globalTransform.x)/globalTransform.s, 'y':(y-globalTransform.y)/globalTransform.s};
                        };
                        this.workspace2browser = function(x,y){
                            var globalTransform = system.utility.element.getTransform(system.pane.workspace);
                            return {'x':(x*globalTransform.s)+globalTransform.x, 'y':(y*globalTransform.s)+globalTransform.y};
                        };
                    };
                    this.dotMaker = function(x,y,text='',r=1,style='fill:rgba(255,100,255,0.75); font-size:3; font-family:Helvetica;',push=false){
                        var g = part.builder('g',null,{x:x, y:y});
                
                        var dot = part.builder('circle',null,{x:0, y:0, r:r, style:style});
                        var textElement =  part.builder('text',null,{x:0, y:0, angle:0, text:text, style:style});
                        g.appendChild(dot);
                        g.appendChild(textElement);
                
                        if(push){system.pane.foreground.append(g);}
                
                        return g;
                    };
                    this.getGlobalScale = function(element){
                        return system.utility.element.getTransform(system.utility.workspace.getGlobal(element)).s;
                    };
                    this.getViewportDimensions = function(){
                        return {width:system.svgElement.width.baseVal.value, height:system.svgElement.height.baseVal.value};
                    };
                    this.placeAndReturnObject = function(object,pane='middleground'){
                        if(object == undefined){return;}
                        return system.pane[pane].appendChild( object );
                    };
                    this.mouseInteractionHandler = function(moveCode, stopCode){
                        if(moveCode == undefined){return;}
                
                        system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                        system.svgElement.onmouseup_old = system.svgElement.onmouseup;
                        system.svgElement.onmouseleave_old = system.svgElement.onmouseleave;
                
                        system.svgElement.onmousemove = function(event){ moveCode(event); };
                        system.svgElement.onmouseup = function(event){
                            if(stopCode != undefined){ stopCode(event); }
                            system.svgElement.onmousemove = system.svgElement.onmousemove_old;
                            system.svgElement.onmouseleave = system.svgElement.onmouseleave_old;
                            system.svgElement.onmouseup = system.svgElement.onmouseup_old;
                        };
                        system.svgElement.onmouseleave = system.svgElement.onmouseup;
                    };
                    this.clear = function(){
                        system.selection.selectEverything();
                        system.selection.delete();
                    };
                    this.exportScene = function(bundleConstructorFunctions=false){
                        var outputData = [];
                        var constructorFunctions = {};
                    
                        //create array of all objects to be saved
                            var objectsArray = Array.from(system.pane.middleground.children);
                    
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
                                    //(if there was no object for this collection, make one)
                                    if(bundleConstructorFunctions){
                                        if( constructorFunctions[objectsArray[a].collection] == undefined ){ constructorFunctions[objectsArray[a].collection] = {}; }
                                        constructorFunctions[objectsArray[a].collection][objectsArray[a].name] = objectsArray[a].creatorMethod;
                                    }
                                    //if it's not set, just add the constructor name to the entry
                                    entry.objectConstructorCollection = objectsArray[a].collection;
                                    entry.objectConstructorName = objectsArray[a].name;
                                    
                                //get the objects position
                                    entry.position = system.utility.element.getTransform(objectsArray[a]);
                    
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
                                    //to find the one that matches this object's objectConstructorName and objectConstructorCollection
                                    //otherwise; look through the system's object constructor list to find it
                                    var constructor = bundleConstructorFunctions ? constructorFunctions[entry.objectConstructorCollection][entry.objectConstructorName] : object[entry.objectConstructorCollection][entry.objectConstructorName];
                    
                                //create the object and place
                                    var newObject = system.utility.workspace.placeAndReturnObject( constructor(entry.position.x,entry.position.y) );
                    
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
                        this.save = function(sceneName='project',compress=true,bundleConstructorFunctions=false){
                            //check that saving or loading is allowed
                                if(!system.super.enableSaveload){return;}
                
                            var outputData = {
                                sceneName:sceneName,
                                bundleConstructorFunctions:bundleConstructorFunctions,
                                viewportLocation:system.utility.workspace.currentPosition(),
                                constructorFunctions:{},
                                objects:[],
                            };
                            var sceneName = outputData.sceneName;
                        
                            //stopping audio
                                system.audio.destination.masterGain(0);
                
                            //gather the scene data
                                var temp = system.utility.workspace.exportScene(outputData.bundleConstructorFunctions);
                                outputData.objects = temp.scene;
                                outputData.constructorFunctions = temp.constructorFunctions;
                        
                            //serialize data
                                outputData = system.utility.misc.serialize(outputData,compress);
                        
                            //print to file
                                system.utility.misc.printFile(sceneName+'.crv',outputData);
                            
                            //restarting audio
                                system.audio.destination.masterGain(1);
                        };
                        this.__loadProcess = function(data,callback,compressed){
                            var metadata;
                
                            //stopping audio
                                system.audio.destination.masterGain(0);
                                
                            //unserialize data
                                var data = system.utility.misc.unserialize(data,compressed);
                
                            //check it's one of ours
                                if(data != null){
                                    //clear current scene
                                        system.utility.workspace.clear()
                
                                    //import scene
                                        system.utility.workspace.importScene(data.objects, data.bundleConstructorFunctions, data.constructorFunctions);
                
                                    //set viewport position
                                        system.utility.workspace.gotoPosition(data.viewportLocation.x, data.viewportLocation.y, data.viewportLocation.s, data.viewportLocation.r);
                
                                    //gather metadata
                                        metadata = {sceneName:data.sceneName};
                
                                    console.log('scene "'+data.sceneName+'" has been loaded');
                                }else{
                                    console.error('unrecognized file format');
                                }
                                
                                //restart audio
                                    system.audio.destination.masterGain(1);
                
                                //callback
                                    if(callback){callback(metadata);}
                        };
                        this.load = function(callback,compressed=true){
                            //check that saving or loading is allowed
                                if(!system.super.enableSaveload){return;}
                
                            system.utility.misc.openFile(function(data){system.utility.workspace.saveload.__loadProcess(data,callback,compressed);});
                        };
                        this.loadFromURL = function(url,callback,compressed=true){
                            var request = new XMLHttpRequest();
                            request.open('GET', url, true);
                            request.responseType = 'text';
                            request.onload = function(){ system.utility.workspace.saveload.__loadProcess(this.response,callback,compressed); };
                            request.send();
                        };
                    };
                    this.setStaticBackgroundStyle = function(style){
                        system.pane.staticBackground.innerHTML = '';
                        system.utility.workspace.placeAndReturnObject( part.builder('rect',null,{width:'100%',height:'100%',style:style+'pointer-events:none;'}), 'staticBackground' );    
                    };
                };
                this.element = new function(){
                    this.getTransform = function(element){
                        // //pure js
                        //     var end_1 = element.style.transform.indexOf('px');
                        //     var end_2 = element.style.transform.indexOf('px) scale(');
                        //     var end_3 = element.style.transform.indexOf(') rotate(');
                        //     var end_4 = element.style.transform.indexOf('rad)');
                
                        //     return {
                        //         x: Number( element.style.transform.substring(10,end_1)),
                        //         y: Number( element.style.transform.substring(end_1+4,end_2)),
                        //         s: Number( element.style.transform.substring(end_2+10,end_3)),
                        //         r: Number( element.style.transform.substring(end_3+9,end_4))
                        //     };
                
                        //pure js 2 
                            var text = element.style.transform;
                            text = text.slice(10).split('px, ',2);
                            var num1 = Number(text[0]);
                            text = text[1].split('px) scale(',2);
                            var num2 = Number(text[0]);
                            text = text[1].split(') rotate(',2);
                            var num3 = Number(text[0]);
                            var num4 = Number(text[1].slice(0,-4));
                
                            return { x: num1, y: num2, s: num3, r: num4 };
                
                        // //regex
                        //     var pattern = /translate\((.*)px,| (.*)px|\) scale\((.*)\) |rotate\((.*)rad\)/g;
                
                        //     var result = [];
                        //     for(var a = 0; a < 4; a++){
                        //         result.push(Number(pattern.exec(element.style.transform)[a+1]));
                        //     }
                            
                        //     return {x:result[0],y:result[1],s:result[2],r:result[3]};
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
                            var temp = system.utility.math.cartesian2polar(data.x,data.y);
                            temp.ang += newData.r;
                            temp = system.utility.math.polar2cartesian(temp.ang,temp.dis);
                            data.x = temp.x + newData.x;
                            data.y = temp.y + newData.y;
                            data.s *= newData.s;
                            data.r += newData.r;
                        }
                        return data;
                    };
                    this.setTransform = function(element, transform){
                        //(code removed for speed, but I remember it was solving some formatting problem somewhere)
                        // element.style.transform = 'translate('+transform.x.toFixed(16)+'px, '+(transform.y.toFixed(16))+'px) scale('+transform.s.toFixed(16)+') rotate(' +transform.r.toFixed(16)+ 'rad)';
                        element.style.transform = 'translate('+transform.x+'px, '+transform.y+'px) scale('+transform.s+') rotate(' +transform.r+ 'rad)';
                    };
                    this.setTransform_XYonly = function(element, x, y){
                        if(x == null && y == null){return;}
                
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
                        system.pane.workspace.append(tempG);
                
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
                        var elementOrigin = system.utility.element.getTruePoint(element);
                        var mouseClick = system.utility.workspace.pointConverter.browser2workspace(event.offsetX,event.offsetY);
                
                        var temp = system.utility.math.cartesian2polar(
                            mouseClick.x-elementOrigin.x,
                            mouseClick.y-elementOrigin.y
                        );
                        temp.ang -= elementOrigin.r;
                        temp = system.utility.math.polar2cartesian(temp.ang,temp.dis);
                
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
                        if(temp == null){return false;}
                
                        if(temp.hasAttribute('workspace')){return true;}
                        while(!temp.hasAttribute('global')){
                            if(temp == document.body){ return false; }
                
                            if(temp[type] || temp.hasAttribute(type)){return false;}
                            temp = temp.parentElement;
                        }
                        
                        return temp.getAttribute('pane')==globalName;
                    };
                    this.disconnectEverything = function(object){
                        var keys = Object.keys(object.io);
                        for( var a = 0; a < keys.length; a++){
                            //account for node arrays
                            if( Array.isArray(object.io[keys[a]]) ){
                                for(var c = 0; c < object.io[keys[a]].length; c++){
                                    object.io[keys[a]][c].disconnect();
                                }
                            }else{
                                object.io[keys[a]].disconnect();
                            }
                        }
                    };
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
                            object.selectionArea.box = system.utility.math.boundingBoxFromPoints(object.selectionArea.points);
                
                            //adjusting it for the object's position in space
                            var temp = system.utility.element.getTransform(object);
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
                            for(var a = 0; a < object.selectionArea.box.length; a++){ system.pane.foreground.append( system.utility.workspace.dotMaker(object.selectionArea.box[a].x, object.selectionArea.box[a].y, a) ); }
                            for(var a = 0; a < object.selectionArea.points.length; a++){ system.pane.foreground.append( system.utility.workspace.dotMaker(object.selectionArea.points[a].x, object.selectionArea.points[a].y, a) ); }
                        }
                    };
                    this.deleteObject = function(object){
                        //run the object's onDelete method
                            if(object.onDelete){object.onDelete();}
                        //run disconnect on every connection node of this object
                            system.utility.object.disconnectEverything(object);
                        //remove the object from the pane it's in
                            system.utility.workspace.getPane(object).removeChild(object);
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
                            var temp = system.utility.math.normalizeStretchArray([
                                1/( 1 + Math.exp(-sharpness*(0-0.5)) ),
                                1/( 1 + Math.exp(-sharpness*(x-0.5)) ),
                                1/( 1 + Math.exp(-sharpness*(1-0.5)) ),
                            ]);
                            return temp[1] *(end-start)+start;
                        };
                        this.exponential = function(x=0.5, start=0, end=1, sharpness=2){
                            var temp = system.utility.math.normalizeStretchArray([
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
                
                            var outputArray = system.utility.math.normalizeStretchArray(curve);
                
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
                            return system.utility.misc.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
                    };
                    this.compressString = function(string){return system.utility.thirdparty.lzString.compress(string);};
                    this.decompressString = function(string){return system.utility.thirdparty.lzString.decompress(string);};
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
                    
                        if(compress){ data = system.utility.misc.compressString(data); }
                        return data;
                    };
                    this.unserialize = function(data,compressed=true){
                        if(data === undefined){return undefined;}
                    
                        if(compressed){ data = system.utility.misc.decompressString(data); }
                    
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
                                        var audioBuffer = system.audio.context.createBuffer(value.__numberOfChannels, value.__length, value.__sampleRate);
                    
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
                    this.openURL = function(url){
                        window.open( url, '_blank');
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
            system.pane = new function(){
                //{'global':null, 'staticBackground':null, 'background':null, 'middleground':null, 'foreground':null, 'control':null};
                
                
                if( system.svgElement.children ){
                    //go through SVG and see if the 'global', 'background', 'middleground', 'foreground' and 'control' elements have already been made
                    for(var a = 0; a < system.svgElement.children.length; a++){
                        if( system.svgElement.children[a].hasAttribute('pane') ){
                            switch(system.svgElement.children[a].getAttribute('pane')){
                                case 'global':           this.workspace =           system.svgElement.children[a]; break;
                                case 'staticBackground': this.staticBackground =    system.svgElement.children[a]; break;
                                case 'background':       this.background =          system.svgElement.children[a]; break;
                                case 'middleground':     this.middleground =        system.svgElement.children[a]; break;
                                case 'foreground':       this.foreground =          system.svgElement.children[a]; break;
                                case 'control':          this.control =             system.svgElement.children[a]; break;
                            }
                        }
                    }
                
                    //if the 'background', 'middleground' or 'control' elements were not made, create them
                        if(this.workspace == null){
                            this.workspace = document.createElementNS('http://www.w3.org/2000/svg','g');
                            this.workspace.setAttribute('pane','workspace');
                        }
                        if(this.staticBackground == null){ 
                            this.staticBackground = document.createElementNS('http://www.w3.org/2000/svg','g');
                            this.staticBackground.setAttribute('pane','staticBackground');
                        }
                        if(this.background == null){ 
                            this.background = document.createElementNS('http://www.w3.org/2000/svg','g');
                            this.background.setAttribute('pane','background');
                        }
                        if(this.middleground == null){ 
                            this.middleground = document.createElementNS('http://www.w3.org/2000/svg','g');
                            this.middleground.setAttribute('pane','middleground');
                        }
                        if(this.foreground == null){ 
                            this.foreground = document.createElementNS('http://www.w3.org/2000/svg','g');
                            this.foreground.setAttribute('pane','foreground');
                        }
                        if(this.control == null){ 
                            this.control = document.createElementNS('http://www.w3.org/2000/svg','g');
                            this.control.setAttribute('pane','control'); 
                        }
                }
                
                //make panes unselectable
                    setTimeout(function(){
                        system.utility.element.makeUnselectable(system.pane.staticBackground);
                        system.utility.element.makeUnselectable(system.pane.background);
                        system.utility.element.makeUnselectable(system.pane.middleground);
                        system.utility.element.makeUnselectable(system.pane.foreground);
                    },10);
                
                //setup globals
                    if(!this.staticBackground.style.transform){ this.staticBackground.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
                    this.staticBackground.setAttribute('global',true);
                    if(!this.workspace.style.transform){ this.workspace.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
                    this.workspace.setAttribute('global',true);
                    if(!this.control.style.transform){ this.control.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
                    this.control.setAttribute('global',true);
                
                //clear out svg element
                    system.svgElement.innerHTML = '';
                
                //add this to svg element
                    system.svgElement.append(this.staticBackground);
                    system.svgElement.append(this.workspace);
                    system.svgElement.append(this.control);
                    this.workspace.append(this.background);
                    this.workspace.append(this.middleground);
                    this.workspace.append(this.foreground);
                
                //stop page scrolling when mouse is in the workspace SVG
                    system.svgElement.onmouseover = function(e){
                        if(system.super.enableWindowScrollbarAutomaticRemoval){
                            document.body.style.overflow = 'hidden';
                        }
                    };
                    system.svgElement.onmouseout = function(e){
                        if(system.super.enableWindowScrollbarAutomaticRemoval){
                            document.body.style.overflow = '';
                        }
                    };
            };
            system.selection = new function(){
                //setup selected objects spaces and functionality
                this.selectedObjects = [];
                this.lastselectedObjects = null;
                this.clipboard = [];
                    // pane                 -   the pane the object came from
                    // objectConstructor    -   the creation function of the object
                    // originalsPosition    -   the X and Y of the original object
                    // data                 -   the exported data from the original object
                    // connections          -   an array of where to connect what
                    //                              originPort
                    //                              destinationPort
                    //                              indexOfDestinationObject
                
                
                this.selectEverything = function(){
                    this.deselectEverything();
                    for(var a = 0; a < system.pane.middleground.children.length; a++){
                        if( system.pane.middleground.children[a].id != 'null' ){
                            this.selectedObjects.push(system.pane.middleground.children[a]);
                        }
                    }
                };
                this.deselectEverything = function(except=[]){
                    var newList = [];
                
                    for(var a = 0; a < system.selection.selectedObjects.length; a++){
                        if( except.includes(system.selection.selectedObjects[a]) ){
                            newList.push(system.selection.selectedObjects[a]);
                        }else{
                            if(system.selection.selectedObjects[a].onDeselect){system.selection.selectedObjects[a].onDeselect();}
                        }
                    }
                    system.selection.selectedObjects = newList;
                };
                this.selectObject = function(object){
                    //check if obbject is already selected
                        if( system.selection.selectedObjects.indexOf(object) != -1 ){return;}
                
                    //shift object to front of view, (within it's particular pane)
                        var pane = system.utility.workspace.getPane(object);
                        pane.removeChild(object);
                        pane.append(object);
                
                    //perform selection
                        if(object.onSelect){object.onSelect();}
                        system.selection.selectedObjects.push(object);
                        system.selection.lastselectedObjects = object;
                };
                this.deselectObject = function(object){
                    system.selection.selectedObjects.splice(system.selection.selectedObjects.indexOf(object),1);
                    if(object.onDeselect){object.onDeselect();}
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
                            newEntry.push( system.utility.workspace.getPane(this.selectedObjects[a]) );
                
                        //objectConstructor
                            //if the object doesn't have a constructor, don't bother with any of this
                            // in-fact; deselect it altogether and move on to the next object
                            if( !this.selectedObjects[a].creatorMethod ){
                                system.selection.deselectObject(this.selectedObjects[a]);
                                a--; continue;
                            }
                            newEntry.push( this.selectedObjects[a].creatorMethod );
                
                        //originalsPosition
                            newEntry.push( system.utility.element.getTransform(this.selectedObjects[a]) );
                
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
                                var topLeft = system.utility.math.boundingBoxFromPoints(points)[0];
                            //subtract this point from each position
                            // then add on the mouses's position, or the provided position
                                if(!position){
                                    // //use viewport for position (functional, but unused)
                                    //     var position = system.utility.element.getTransform(system.pane.workspace);
                                    //     position = {x:-position.x/position.s, y:-position.y/position.s};
                
                                    //use mouse position
                                        var position = system.utility.workspace.pointConverter.browser2workspace(system.mouse.currentPosition[0], system.mouse.currentPosition[1]);
                                }
                                this.clipboard.forEach( function(element){
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
                            system.selection.selectObject(obj);
                
                        //go through its connections, and attempt to connect them to everything they should be connected to
                        // (don't worry if a object isn't avalable yet, just skip that one. Things will work out in the end)
                            if(item[4]){
                                item[4].forEach(function(conn){
                                    // originPort                  = conn[0]
                                    // destinationPort             = conn[1]
                                    // indexOfDestinationObject    = conn[2]
                                    if( conn[2] < system.selection.selectedObjects.length ){
                                        obj.io[conn[0]].connectTo( system.selection.selectedObjects[conn[2]].io[conn[1]] );
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
                        //delete object
                            system.utility.object.deleteObject(this.selectedObjects[0]);
                        //remove object from selected array
                            this.selectedObjects.shift();
                    }
                    this.lastselectedObjects = null;
                };
            };
            system.mouse = new function(){
                // utility functions
                    this.currentPosition = [];
                    this.wheelInterpreter = function(y){
                        return y/100;
                        // return y > 0 ? 1 : -1;
                    };
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                // grapple functions
                    this.objectGrapple_functionList = {};
                    this.objectGrapple_functionList.onmousedown = [];
                    this.objectGrapple_functionList.onmouseup = [];
                    this.declareObjectGrapple = function(grapple, target, creatorMethod){
                        if(!creatorMethod){console.error('"declareObjectGrapple" requires a creatorMethod');return;}
                
                        grapple.target = target ? target : grapple;
                        grapple.target.creatorMethod = creatorMethod;
                        grapple.target.grapple = grapple;
                        grapple.target.style.transform = grapple.target.style.transform ? grapple.target.style.transform : 'translate(0px,0px) scale(1) rotate(0rad)';
                
                        grapple.onmousedown = function(event){
                            if(event.button != 0){return;}
                            system.svgElement.temp_onmousedown_originalObject = this.target;
                
                            for(var a = 0; a < system.mouse.objectGrapple_functionList.onmousedown.length; a++){
                                var shouldRun = true;
                                for(var b = 0; b < system.mouse.objectGrapple_functionList.onmousedown[a].specialKeys.length; b++){
                                    shouldRun = shouldRun && event[system.mouse.objectGrapple_functionList.onmousedown[a].specialKeys[b]];
                                    if(!shouldRun){break;}
                                }
                                if(shouldRun){ system.mouse.objectGrapple_functionList.onmousedown[a].function(event); break; }
                            }
                        };
                        grapple.onmouseup = function(event){
                            system.svgElement.temp_onmouseup_originalObject = this.target;
                
                            for(var a = 0; a < system.mouse.objectGrapple_functionList.onmouseup.length; a++){
                                var shouldRun = true;
                                for(var b = 0; b < system.mouse.objectGrapple_functionList.onmouseup[a].specialKeys.length; b++){
                                    shouldRun = shouldRun && event[system.mouse.objectGrapple_functionList.onmouseup[a].specialKeys[b]];
                                    if(!shouldRun){break;}
                                }
                                if(shouldRun){ system.mouse.objectGrapple_functionList.onmouseup[a].function(event); break; }
                            }
                        };
                    };
                
                    //duplication
                    this.objectGrapple_functionList.onmousedown.push(
                        {
                            'specialKeys':[system.super.keys.alt],
                            'function':function(event){
                                if(system.super.readOnlyMode){return;}
                
                                // if mousedown occurs over an object that isn't selected; select it
                                if( !system.selection.selectedObjects.includes(system.svgElement.temp_onmousedown_originalObject) ){
                                    system.selection.selectObject(system.svgElement.temp_onmousedown_originalObject);
                                }
                
                                //perform duplication
                                system.selection.duplicate();
                
                                //start moving the first object in the object list
                                // (the movement code will handle moving the rest)
                                system.selection.selectedObjects[0].grapple.onmousedown(
                                    {
                                        'x':event.x, 'y':event.y,
                                        'button':0
                                    }
                                );
                
                            }
                        }
                    );
                    //general moving
                    this.objectGrapple_functionList.onmousedown.push(
                        {
                            'specialKeys':[],
                            'function':function(event){
                                if(system.super.readOnlyMode){return;}
                
                                // if mousedown occurs over an object that isn't selected
                                //  and if the shift key is not pressed
                                //   deselect everything
                                //  now, select the object we're working on if not selected
                                if( !system.selection.selectedObjects.includes(system.svgElement.temp_onmousedown_originalObject) ){
                                    if(!event.shiftKey){ system.selection.deselectEverything(); }
                                    system.selection.selectObject(system.svgElement.temp_onmousedown_originalObject);
                                }
                
                                // collect together information on the click position and the selected object's positions
                                system.svgElement.temp_oldClickPosition = [event.x,event.y];
                                system.svgElement.temp_oldObjectPositions = [];
                                for(var a = 0; a < system.selection.selectedObjects.length; a++){
                                    system.svgElement.temp_oldObjectPositions.push( system.utility.element.getTransform(system.selection.selectedObjects[a]) );
                                }
                
                                // perform the move for all selected objects
                                system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                                system.svgElement.onmousemove = function(event){
                                    for(var a = 0; a < system.selection.selectedObjects.length; a++){
                                        var clickPosition = system.svgElement.temp_oldClickPosition;
                                        var position = {};
                                            position.x = system.svgElement.temp_oldObjectPositions[a].x;
                                            position.y = system.svgElement.temp_oldObjectPositions[a].y;
                                            position.s = system.svgElement.temp_oldObjectPositions[a].s;
                                            position.r = system.svgElement.temp_oldObjectPositions[a].r;
                                        var globalScale = system.utility.workspace.getGlobalScale(system.selection.selectedObjects[a]);
                
                                        position.x = (position.x-(clickPosition[0]-event.x)/globalScale);
                                        position.y = (position.y-(clickPosition[1]-event.y)/globalScale);
                
                                        system.utility.element.setTransform(system.selection.selectedObjects[a], position);
                
                                        //perform all redraws and updates for object
                                        if( system.selection.selectedObjects[a].onMove ){system.selection.selectedObjects[a].onMove();}
                                        if( system.selection.selectedObjects[a].updateSelectionArea ){system.selection.selectedObjects[a].updateSelectionArea();}
                                        if( system.selection.selectedObjects[a].io ){
                                            var keys = Object.keys( system.selection.selectedObjects[a].io );
                                            for(var b = 0; b < keys.length; b++){ 
                                                //account for node arrays
                                                if( Array.isArray(system.selection.selectedObjects[a].io[keys[b]]) ){
                                                    for(var c = 0; c < system.selection.selectedObjects[a].io[keys[b]].length; c++){
                                                        system.selection.selectedObjects[a].io[keys[b]][c].redraw();
                                                    }
                                                }else{  system.selection.selectedObjects[a].io[keys[b]].redraw(); }
                                            }
                                        }
                                    }
                                };
                
                                // clean-up code
                                system.svgElement.onmouseup = function(){
                                    this.onmousemove = null;
                                    delete system.svgElement.tempElements;
                                    this.onmousemove = system.svgElement.onmousemove_old;
                                    delete this.temp_onmousedown_originalObject;
                                    delete this.temp_oldClickPosition;
                                    delete this.temp_oldObjectPositions;
                                    delete this.onmouseleave;
                                    delete this.onmouseup;
                                };
                            
                                system.svgElement.onmouseleave = system.svgElement.onmouseup;
                
                                system.svgElement.onmousemove(event);
                            }
                        }
                    );
                    //selection
                    this.objectGrapple_functionList.onmouseup.push(
                        {
                            'specialKeys':[],
                            'function':function(event){
                                //if mouse-up occurs over an object that is selected
                                // and if the shift key is pressed
                                // and if the object we're working on is not the most recently selected
                                //  deselect the object we're working on
                                // now set the most recently selected reference to null
                                if( system.selection.selectedObjects.includes(system.svgElement.temp_onmouseup_originalObject) ){
                                    if( event.shiftKey && (system.selection.lastselectedObjects != system.svgElement.temp_onmouseup_originalObject) ){
                                        system.selection.deselectObject(system.svgElement.temp_onmouseup_originalObject);
                                    }
                                    system.selection.lastselectedObjects = null;
                                }
                
                            }
                        }
                    );
                
                
                
                
                
                
                
                
                
                
                // onmousemove functions
                    this.onmousemove_functionList = [];
                    system.svgElement.onmousemove = function(event){
                        //control
                            control.mousemove(event);
                
                        //workspace
                        if(system.utility.object.requestInteraction(event.x,event.y,'onmousemove','workspace')){
                            for(var a = 0; a < system.mouse.onmousemove_functionList.length; a++){
                                var shouldRun = true;
                                for(var b = 0; b < system.mouse.onmousemove_functionList[a].specialKeys.length; b++){
                                    shouldRun = shouldRun && event[system.mouse.onmousemove_functionList[a].specialKeys[b]];
                                    if(!shouldRun){break;}
                                }
                                if(shouldRun){ system.mouse.onmousemove_functionList[a].function(event); break; }
                            }
                        }
                    };
                
                    // register position
                    this.onmousemove_functionList.push(
                        {
                            'specialKeys':[],
                            'function':function(event){
                                system.mouse.currentPosition = [event.x, event.y];
                            }
                        }
                    );
                
                
                
                
                
                
                
                
                // onmousedown functions
                    this.onmousedown_functionList = [];
                    system.svgElement.onmousedown = function(event){
                        //control
                            control.mousedown(event);
                
                        //workspace
                        if(!system.utility.object.requestInteraction(event.x,event.y,'onmousedown','workspace') || event.button != 0){return;}
                        for(var a = 0; a < system.mouse.onmousedown_functionList.length; a++){
                            var shouldRun = true;
                            for(var b = 0; b < system.mouse.onmousedown_functionList[a].specialKeys.length; b++){
                                shouldRun = shouldRun && event[system.mouse.onmousedown_functionList[a].specialKeys[b]];
                                if(!shouldRun){break;}
                            }
                            if(shouldRun){ system.mouse.onmousedown_functionList[a].function(event,system.pane.workspace); break; }
                        }
                    };
                
                    //group selection
                    this.onmousedown_functionList.push(
                        {
                            'specialKeys':['shiftKey'],
                            'function':function(event,globalPane){
                                // if(system.super.readOnlyMode){return;}
                
                                //setup
                                system.svgElement.tempData = {};
                                system.svgElement.tempElements = [];
                                system.svgElement.tempData.start = {'x':event.x, 'y':event.y};
                
                                //create 'selection box' graphic and add it to the menu pane
                                system.svgElement.tempElements.push(
                                    part.builder(
                                        'path',null,{
                                            path:[
                                                system.svgElement.tempData.start,
                                                system.svgElement.tempData.start,
                                                system.svgElement.tempData.start,
                                                system.svgElement.tempData.start
                                            ], type:'L', style:'fill:rgba(120,120,255,0.25)'
                                        }
                                    )
                                );
                                for(var a = 0; a < system.svgElement.tempElements.length; a++){ system.pane.control.append(system.svgElement.tempElements[a]); }
                
                                //adjust selection box when the mouse moves
                                system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                                system.svgElement.onmousemove = function(event){
                                    system.svgElement.tempData.end = {'x':event.x, 'y':event.y};
                
                                    system.svgElement.tempElements[0].path(
                                        [
                                            {x:system.svgElement.tempData.start.x, y:system.svgElement.tempData.start.y},
                                            {x:system.svgElement.tempData.end.x,   y:system.svgElement.tempData.start.y},
                                            {x:system.svgElement.tempData.end.x,   y:system.svgElement.tempData.end.y},
                                            {x:system.svgElement.tempData.start.x, y:system.svgElement.tempData.end.y}
                                        ]
                                    );
                                    
                                };
                
                                //when the mouse is raised; 
                                //  find the objects that are selected
                                //  tell them they are selected (tell the rest they aren't)
                                //  add the selected to the 'selected objects list'
                                system.svgElement.onmouseup = function(){
                                    //set up
                                        system.selection.deselectEverything();
                                        var start = system.utility.workspace.pointConverter.browser2workspace(system.svgElement.tempData.start.x,system.svgElement.tempData.start.y);
                                        var end = system.utility.workspace.pointConverter.browser2workspace(system.svgElement.tempData.end.x,system.svgElement.tempData.end.y);
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
                                        
                                    //run though all middleground objects to see if they are selected in this box add the objects 
                                    //that overlap with the selection area to a temporary array, then select them all in one go
                                    //(this is to ease the object reordering that happens in the "system.selection.selectObject"
                                    //function)
                                        var objects = system.pane.middleground.children;
                                        var tempHolder = [];
                                        for(var a = 0; a < objects.length; a++){
                                            if(objects[a].selectionArea){
                                                if(system.utility.math.detectOverlap(selectionArea.points, objects[a].selectionArea.points, selectionArea.box, objects[a].selectionArea.box)){
                                                    tempHolder.push( objects[a] );
                                                }
                                            }
                                        }
                                        for(var a = 0; a < tempHolder.length; a++){ system.selection.selectObject(tempHolder[a]); }
                
                                    //delete all temporary elements and attributes
                                        delete system.svgElement.tempData;
                                        for(var a = 0; a < system.svgElement.tempElements.length; a++){
                                            system.pane.control.removeChild( system.svgElement.tempElements[a] ); 
                                            system.svgElement.tempElements[a] = null;
                                        }
                                        delete system.svgElement.tempElements;
                                        this.onmousemove = system.svgElement.onmousemove_old;
                                        delete system.svgElement.onmousemove_old;
                                        this.onmouseleave = null;
                                        globalPane.removeAttribute('oldPosition');
                                        globalPane.removeAttribute('clickPosition');
                                        this.onmouseleave = null;
                                        this.onmouseup = null;
                                };
                
                                system.svgElement.onmouseleave = system.svgElement.onmouseup;
                
                                system.svgElement.onmousemove(event);
                            }
                        }
                    );
                
                    //panning 
                    this.onmousedown_functionList.push(
                        {
                            'specialKeys':[],
                            'function':function(event,globalPane){
                                if(!system.super.mouseGripPanningEnabled){return;}
                
                                system.selection.deselectEverything();
                                system.svgElement.temp_oldPosition = system.utility.element.getTransform(globalPane);
                                system.pane.workspace.setAttribute('clickPosition','['+event.x +','+ event.y+']');
                
                                system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                                system.svgElement.onmousemove = function(event){
                                    var position = {};
                                        position.x = system.svgElement.temp_oldPosition.x;
                                        position.y = system.svgElement.temp_oldPosition.y;
                                        position.s = system.svgElement.temp_oldPosition.s;
                                        position.r = system.svgElement.temp_oldPosition.r;
                                    var clickPosition = JSON.parse(globalPane.getAttribute('clickPosition'));
                                    position.x = position.x-(clickPosition[0]-event.x);
                                    position.y = position.y-(clickPosition[1]-event.y);
                                    system.utility.element.setTransform(globalPane, position);
                                };
                
                                system.svgElement.onmouseup = function(){
                                    this.onmousemove = system.svgElement.onmousemove_old;
                                    delete system.svgElement.onmousemove_old;
                                    globalPane.removeAttribute('oldPosition');
                                    globalPane.removeAttribute('clickPosition');
                                    this.onmouseleave = null;
                                    this.onmouseup = null;
                                };
                
                                system.svgElement.onmouseleave = system.svgElement.onmouseup;
                
                                system.svgElement.onmousemove(event);
                
                            }
                        }
                    );
                
                
                
                
                
                
                
                // onwheel functions
                    this.onwheel_functionList = [];
                    system.svgElement.onwheel = function(event){
                        //control
                            control.mousewheel(event);
                
                        //workspace
                        if(system.utility.object.requestInteraction(event.x,event.y,'onwheel','workspace')){
                            for(var a = 0; a < system.mouse.onwheel_functionList.length; a++){
                                var shouldRun = true;
                                for(var b = 0; b < system.mouse.onwheel_functionList[a].specialKeys.length; b++){
                                    shouldRun = shouldRun && event[system.mouse.onwheel_functionList[a].specialKeys[b]];
                                    if(!shouldRun){break;}
                                }
                                if(shouldRun){ system.mouse.onwheel_functionList[a].function(event); break; }
                            }
                        }
                    };
                
                    this.onwheel_functionList.push(
                        {
                            'specialKeys':[],
                            'function':function(event){
                                if(!system.super.mouseWheelZoomEnabled){return;}
                
                                var zoomLimits = {'max':10, 'min':0.1};
                                var position = system.utility.element.getTransform(system.pane.workspace);
                
                                var XPosition = (event.x - position.x)/position.s;
                                var YPosition = (event.y - position.y)/position.s;
                                    var oldPixX = position.s * ( XPosition + position.x/position.s);
                                    var oldPixY = position.s * ( YPosition + position.y/position.s);
                                        // var mux = 1.25; position.s = position.s * ( event.deltaY < 0 ? 1*mux : 1/mux );
                                        position.s -= position.s*system.mouse.wheelInterpreter(event.deltaY);
                                        if( position.s > zoomLimits.max ){position.s = zoomLimits.max;}
                                        if( position.s < zoomLimits.min ){position.s = zoomLimits.min;}
                                    var newPixX = position.s * ( XPosition + position.x/position.s);
                                    var newPixY = position.s * ( YPosition + position.y/position.s);
                                position.x = position.x - ( newPixX - oldPixX );
                                position.y = position.y - ( newPixY - oldPixY );
                
                                system.utility.element.setTransform(system.pane.workspace, position);
                            }
                        }
                    );
            };
            system.keyboard = new function(){
                this.pressedKeys = {};
                
                // keycapture
                this.declareKeycaptureObject = function(object,desiredKeys={none:[],shift:[],control:[],meta:[],alt:[]}){
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
                            control:event[system.super.keys.ctrl],
                            meta:event.metaKey,
                            alt:event[system.super.keys.alt]
                        };
                
                        if( 
                            (event.control  && desiredKeys.control && ( desiredKeys.control=='all' || (Array.isArray(desiredKeys.control) && desiredKeys.control.includes(event.key)) )) ||
                            (event.shiftKey && desiredKeys.shift   && ( desiredKeys.shift=='all'   || (Array.isArray(desiredKeys.shift)   && desiredKeys.shift.includes(event.key))   )) ||
                            (event.metaKey  && desiredKeys.meta    && ( desiredKeys.meta=='all'    || (Array.isArray(desiredKeys.meta)    && desiredKeys.meta.includes(event.key))    )) ||
                            (event.alt      && desiredKeys.alt     && ( desiredKeys.alt=='all'     || (Array.isArray(desiredKeys.alt)     && desiredKeys.alt.includes(event.key))     )) ||
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
                    document.onkeydown = function(event){
                        //if key is already pressed, don't press it again
                            if(system.keyboard.pressedKeys[event.code]){ return; }
                            system.keyboard.pressedKeys[event.code] = true;
                
                        //discover what the mouse is pointing at and if that thing accepts keyboard input. First check whether the
                        //object overall accepts input, and if it doesn't check if any element accepts it. If neither do, or either
                        //function returns 'false';  use the global functions
                            var temp = [system.mouse.currentPosition[0], system.mouse.currentPosition[1]];
                            if(!system.utility.object.requestInteraction(temp[0],temp[1],'onkeydown','workspace')){
                                if( system.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeydown != undefined ){
                                    if(system.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeydown(event)){ return; }
                                }else{
                                    //start from the most bottom element and work up until a pane is reached; checking for 
                                    //onkeydown attributes. If one is found and it returns 'false', continue climbing. 
                                    var element = document.elementFromPoint(temp[0],temp[1]);
                                    while(!element.hasAttribute('pane')){
                                        if( element.onkeydown != undefined ){
                                            if(element.onkeydown(event)){ return; }
                                        }
                                        element = element.parentElement;
                                    }
                                }
                            }
                
                        //control function
                            control.keydown(event);
                    };
                 
                
                // onkeyup functions
                    document.onkeyup = function(event){
                        //if key isn't pressed, don't release it
                            if(!system.keyboard.pressedKeys[event.code]){return;}
                            delete system.keyboard.pressedKeys[event.code];
                
                        //discover what the mouse is pointing at and if that thing accepts keyboard input. First check whether the
                        //object overall accepts input, and if it doesn't check if the element accepts it. If neither do, or either
                        //function returns 'false';  use the global functions
                            var temp = [system.mouse.currentPosition[0], system.mouse.currentPosition[1]];
                            if(!system.utility.object.requestInteraction(temp[0],temp[1],'onkeyup','workspace')){
                                if( system.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeyup != undefined ){
                                    if(system.utility.workspace.objectUnderPoint(temp[0],temp[1]).onkeyup(event)){ return; }
                                }else{
                                    //start from the most bottom element and work up until a pane is reached; checking for 
                                    //onkeyup attributes. If one is found and it returns 'false', continue climbing. 
                                    var element = document.elementFromPoint(temp[0],temp[1]);
                                    while(!element.hasAttribute('pane')){
                                        if( element.onkeyup != undefined ){
                                            if(element.onkeyup(event)){ return; }
                                        }
                                        element = element.parentElement;
                                    }
                                }
                            }
                
                        //control function
                            control.keyup(event);
                    };
                
                // additional utilities
                    this.releaseAll = function(){
                        for(key in this.pressedKeys){
                            document.onkeyup( new KeyboardEvent('keyup',{'key':key}) );
                        }
                    };
            };
            system.audio = new function(){
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                
                //master output
                    this.destination = this.context.createGain();
                    this.destination.connect(this.context.destination);
                    this.destination._gain = 1;
                    this.destination.masterGain = function(value){
                        if(value == undefined){return this.destination._gain;}
                        this._gain = value;
                        system.utility.audio.changeAudioParam(system.audio.context, this.gain, this._gain, 0.01, 'instant', true);
                    };
                
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
                
                    this.getFreq = function(name){ return this.names_frequencies[name]; };
                    this.getName = function(freq){ return this.frequencies_names[freq]; };
                
                
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
                    
                this.num2name = function(num){ return this.midinumbers_names[num]; };
                this.num2freq = function(num){ return this.names_frequencies[this.midinumbers_names[num]]; };
                
                this.name2num = function(name){ return this.names_midinumbers[name]; };
                this.name2freq = function(name){ return this.names_frequencies[name]; };
                
                this.freq2num = function(freq){ return this.names_midinumbers[this.frequencies_names[freq]]; };
                this.freq2name = function(freq){ return this.frequencies_names[freq]; };
            };
            var part = new function(){
                this.circuit = new function(){
                    this.audio = new function(){
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
                                this.getTrack = function(){return new Blob(state.recordedChunks, { type: 'audio/ogg; codecs=opus' }); };
                        
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
                                system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain);
                        
                        
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
                                            system.audio.context.createMediaStreamSource(source).connect(flow.outAggregator.node);                    
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
                                    system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain,a);
                                };
                        
                            //setup
                                if(setupConnect){this.selectDevice('default');}
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
                                            this.generator.frequency.setTargetAtTime(system.audio.num2freq(midinumber+12*octave), context.currentTime, 0);
                                            this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
                                            this.generator.start(0);
                        
                                        this.gain = context.createGain();
                                            this.generator.connect(this.gain);
                                            this.gain.gain.setTargetAtTime(0, context.currentTime, 0);
                                            system.utility.audio.changeAudioParam(context,this.gain.gain, gain, attack.time, attack.curve, false);
                                            this.gain.connect(connection);
                        
                                        this.detune = function(target,time,curve){
                                            system.utility.audio.changeAudioParam(context,this.generator.detune,target,time,curve);
                                        };
                                        this.changeVelocity = function(a){
                                            system.utility.audio.changeAudioParam(context,this.gain.gain,a,attack.time,attack.curve);
                                        };
                                        this.stop = function(){
                                            system.utility.audio.changeAudioParam(context,this.gain.gain,0,release.time,release.curve, false);
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
                                        system.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.01, flow.wobbler_gain.wave );
                                        return;
                                    }
                                    flow.wobbler_gain.interval = setInterval(function(){
                                        if(flow.wobbler_gain.phase){ system.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1, 0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
                                        else{                        system.utility.audio.changeAudioParam(context, flow.wobbler_gain.node.gain, 1-flow.wobbler_gain.depth,  0.9*flow.wobbler_gain.period, flow.wobbler_gain.wave ); }
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
                                this.gain = function(target,time,curve){ return system.utility.audio.changeAudioParam(context,flow.mainOut.node.gain,target,time,curve); };
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
                                    system.utility.audio.loadAudioFile(
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
                                        flow.bufferSource = system.utility.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter);
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
                                    return system.utility.audio.waveformSegment(flow.track.buffer,data);
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
                                    system.utility.audio.loadAudioFile(
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
                                        flow.bufferSource = system.utility.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter);
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
                                    return system.utility.audio.waveformSegment(flow.track.buffer,data);
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
                                            default: console.error('"part.circuit.audio.oneShot_multi2.audioOut" unknown channel "'+channel+'"'); break;
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
                                    system.utility.audio.loadAudioFile(
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
                                            var temp = system.utility.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter, function(){
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
                                    return system.utility.audio.waveformSegment(flow.track.buffer,data);
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
                                analyser.analyserNode = system.audio.context.createAnalyser();
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
                                system.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);
                        
                            //reverbGain / bypassGain
                                flow.reverbGain.gain = 0.5;
                                flow.bypassGain.gain = 0.5;
                                flow.reverbGain.node = context.createGain();
                                flow.bypassGain.node = context.createGain();
                                system.utility.audio.changeAudioParam(context,flow.reverbGain.node.gain, flow.reverbGain.gain, 0.01, 'instant', true);
                                system.utility.audio.changeAudioParam(context,flow.bypassGain.node.gain, flow.bypassGain.gain, 0.01, 'instant', true);
                        
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
                                system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                        
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
                                    system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, a, 0.01, 'instant', true);
                                };
                                this.wetdry = function(a){
                                    if(a==null){return flow.reverbGain.gain;}
                                    flow.reverbGain.gain=a;
                                    flow.bypassGain.gain=1-a;
                                    system.utility.audio.changeAudioParam(context,flow.reverbGain.node.gain, flow.reverbGain.gain, 0.01, 'instant', true);
                                    system.utility.audio.changeAudioParam(context,flow.bypassGain.node.gain, flow.bypassGain.gain, 0.01, 'instant', true);
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
                                    system.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);
                        
                                //filterNodes
                                    function makeGenericFilter(type){
                                        var temp = { frequency:110, Q:0.1, node:context.createBiquadFilter() };
                                        temp.node.type = type;
                                        system.utility.audio.changeAudioParam(context, temp.node.frequency,110,0.01,'instant',true);
                                        system.utility.audio.changeAudioParam(context, temp.node.Q,0.1,0.01,'instant',true);
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
                                        system.utility.audio.changeAudioParam(context, temp.node.gain, temp.gain, 0.01, 'instant', true);
                                        flow.gainNodes.push(temp);
                                        saved.settings[a] = { Q:0.1, gain:1, frequency:110, fresh:true };
                                    }
                        
                                //outAggregator
                                    flow.outAggregator.gain = 1;
                                    flow.outAggregator.node = context.createGain();
                                    system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                        
                        
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
                                    system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                                };
                                this.gain = function(band,value){
                                    if(value == undefined){return flow.gainNodes[band].gain;}
                                    flow.gainNodes[band].gain = value;
                                    system.utility.audio.changeAudioParam(context, flow.gainNodes[band].node.gain, flow.gainNodes[band].gain, 0.01, 'instant', true);
                        
                                    saved.settings[band].gain = value;
                                    saved.settings[band].fresh = true;
                                };
                                this.frequency = function(band,value){
                                    if(value == undefined){return flow.filterNodes[band].frequency;}
                                    flow.filterNodes[band].frequency = value;
                                    system.utility.audio.changeAudioParam(context, flow.filterNodes[band].node.frequency,flow.filterNodes[band].frequency,0.01,'instant',true);
                        
                                    saved.settings[band].frequency = value;
                                    saved.settings[band].fresh = true;
                                };
                                this.Q = function(band,value){
                                    if(value == undefined){return flow.filterNodes[band].Q;}
                                    flow.filterNodes[band].Q = value;
                                    system.utility.audio.changeAudioParam(context, flow.filterNodes[band].node.Q,flow.filterNodes[band].Q,0.01,'instant',true);
                        
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
                                system.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);
                        
                            //distortionNode
                                flow.distortionNode.distortionAmount = 0;
                                flow.distortionNode.oversample = 'none'; //'none', '2x', '4x'
                                flow.distortionNode.resolution = 100;
                                function makeDistortionNode(){
                                    flow.inAggregator.node.disconnect();
                                    if(flow.distortionNode.node){flow.distortionNode.node.disconnect();}
                                    
                                    flow.distortionNode.node = context.createWaveShaper();
                                        flow.distortionNode.curve = new Float32Array(system.utility.math.curveGenerator.s(flow.distortionNode.resolution,-1,1,flow.distortionNode.distortionAmount));
                                        flow.distortionNode.node.curve = flow.distortionNode.curve;
                                        flow.distortionNode.node.oversample = flow.distortionNode.oversample;
                                        
                                    flow.inAggregator.node.connect(flow.distortionNode.node);
                                    flow.distortionNode.node.connect(flow.outAggregator.node);
                                }
                        
                            //outAggregator
                                flow.outAggregator.gain = 0;
                                flow.outAggregator.node = context.createGain();    
                                system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                        
                        
                            //input/output node
                                this.in = function(){return flow.inAggregator.node;}
                                this.out = function(){return flow.outAggregator.node;}
                        
                            //controls
                                this.inGain = function(a){
                                    if(a==null){return flow.inAggregator.gain;}
                                    flow.inAggregator.gain=a;
                                    system.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, a, 0.01, 'instant', true);
                                };
                                this.outGain = function(a){
                                    if(a==null){return flow.outAggregator.gain;}
                                    flow.outAggregator.gain=a;
                                    system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, a, 0.01, 'instant', true);
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
                                            case 'linear': steps = system.utility.math.curveGenerator.linear(totalSteps); break;
                                            case 'exponential': steps = system.utility.math.curveGenerator.exponential(totalSteps); break;
                                            case 's': steps = system.utility.math.curveGenerator.s(totalSteps,8); break;
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
                                    context, connection, midinumber,
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
                                            this.generator.frequency.setTargetAtTime(system.audio.num2freq(midinumber,octave), context.currentTime, 0);
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
                                }
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
                                    //this code is used to update the playhead position aswel as to calculate when the loop end will occur, 
                                    //and thus when the playhead should jump to the start of the loop. The actual looping of the audio is 
                                    //done by the system, so this process is done solely to update the playhead position data.
                                    //  Using the playhead's current postiion and paly rate; the length of time before the playhead is 
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
                                this.load = function(type,callback,url=''){
                                    state.fileLoaded = false;
                                    system.utility.audio.loadAudioFile(
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
                                        flow.bufferSource = system.utility.audio.loadBuffer(context, flow.track.buffer, flow.channelSplitter, function(a){state.itself.stop();});
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
                                this.waveformSegment = function(data={start:0,end:1}){
                                    if(data==undefined || !state.fileLoaded){return [];}
                                    return system.utility.audio.waveformSegment(flow.track.buffer, data);
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
                                    system.utility.audio.changeAudioParam(context,flow.in.node.gain, flow.in.gain, 0.01, 'instant', true);
                        
                                //outs
                                    for(var a = 0; a < outputCount; a++){
                                        var temp = { gain:0.5, node:context.createGain() };
                                        system.utility.audio.changeAudioParam(context,temp.node.gain, temp.gain, 0.01, 'instant', true);
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
                                    system.utility.audio.changeAudioParam(context,flow.in.node.gain, flow.in.gain, 0.01, 'instant', true);
                                };
                                this.outGain = function(a,value){
                                    if(value == undefined){ return flow.outs[a].gain; }
                                    flow.outs[a].gain = value;
                                    system.utility.audio.changeAudioParam(context,flow.outs[a].node.gain, flow.outs[a].gain, 0.01, 'instant', true);
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
                                system.utility.audio.changeAudioParam(context,flow.inAggregator.node.gain, flow.inAggregator.gain, 0.01, 'instant', true);
                        
                            //filterNode
                                flow.filterNode.node = context.createBiquadFilter();
                        	    flow.filterNode.node.type = "lowpass";
                                system.utility.audio.changeAudioParam(context, flow.filterNode.node.frequency,110,0.01,'instant',true);
                                system.utility.audio.changeAudioParam(context, flow.filterNode.node.gain,1,0.01,'instant',true);
                                system.utility.audio.changeAudioParam(context, flow.filterNode.node.Q,0.1,0.01,'instant',true);
                        
                            //outAggregator
                                flow.outAggregator.gain = 1;
                                flow.outAggregator.node = context.createGain();
                                system.utility.audio.changeAudioParam(context,flow.outAggregator.node.gain, flow.outAggregator.gain, 0.01, 'instant', true);
                        
                        
                            //do connections
                                flow.inAggregator.node.connect(flow.filterNode.node);
                                flow.filterNode.node.connect(flow.outAggregator.node);
                        
                            //input/output node
                                this.in = function(){return flow.inAggregator.node;}
                                this.out = function(){return flow.outAggregator.node;}
                        
                            //methods
                                this.type = function(type){flow.filterNode.node.type = type;};
                                this.frequency = function(value){system.utility.audio.changeAudioParam(context, flow.filterNode.node.frequency,value,0.01,'instant',true);};
                                this.gain = function(value){system.utility.audio.changeAudioParam(context, flow.filterNode.node.gain,value,0.01,'instant',true);};
                                this.Q = function(value){system.utility.audio.changeAudioParam(context, flow.filterNode.node.Q,value,0.01,'instant',true);};
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

                    };
                    this.sequencing = new function(){
                        this.noteRegistry = function(rightLimit=-1,bottomLimit=-1,blockLengthLimit=-1){
                            var notes = [];
                            var selectedNotes = [];
                            var events = [];
                            var events_byID = [];
                            var events_byPosition = {};
                            var positions = [];
                        
                            this.__dump = function(){
                                console.log('---- noteRegistry dump ----');
                        
                                console.log('\tnotes');
                                for(var a = 0; a < notes.length; a++){ 
                                    console.log( '\t\t', a, ' ' + JSON.stringify(notes[a]) );
                                }
                        
                                console.log('\tselectedNotes');
                                for(var a = 0; a < selectedNotes.length; a++){ 
                                    console.log( '\t\t', a, ' ' + JSON.stringify(selectedNotes[a]) );
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
                                        notes:              notes,
                                        selectedNotes:      selectedNotes,
                                        events:             events,
                                        events_byID:        events_byID,
                                        events_byPosition:  events_byPosition,
                                        positions:          positions,
                                    }
                                ));
                            };
                            this.import = function(data){
                                notes =             JSON.parse(JSON.stringify(data.notes));
                                selectedNotes =     JSON.parse(JSON.stringify(data.selectedNotes));
                                events =            JSON.parse(JSON.stringify(data.events));
                                events_byID =       JSON.parse(JSON.stringify(data.events_byID));
                                events_byPosition = JSON.parse(JSON.stringify(data.events_byPosition));
                                positions =         JSON.parse(JSON.stringify(data.positions));
                            };
                        
                            this.getAllNotes = function(){ return JSON.parse(JSON.stringify(notes)); };
                            this.getAllEvents = function(){ return JSON.parse(JSON.stringify(events)); };
                            this.getNote = function(id){
                                if( notes[id] == undefined ){return;}
                                return JSON.parse(JSON.stringify(notes[id]));
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
                                    if(blockLengthLimit > -1 && (data.length > blockLengthLimit)){data.length = blockLengthLimit;}
                                    if(rightLimit > -1 && (data.position > rightLimit) ){data.position = rightLimit-data.length;}
                                    if(rightLimit > -1 && (data.position+data.length > rightLimit)){ data.length = rightLimit-data.position; }
                                    if(rightLimit > -1 && (data.position+data.length > rightLimit)){data.position = rightLimit-data.length;}
                                    if(data.strength > 1){data.strength = 1;}
                        
                                //generate note ID
                                    var newID = 0;
                                    if(forceID == undefined){
                                        while(notes[newID] != undefined){newID++;}
                                    }else{newID = forceID;}
                        
                                //add note to storage
                                    notes[newID] = JSON.parse(JSON.stringify(data));
                        
                                //generate event data
                                    var newEvents = [
                                        {noteID:newID, line:data.line, position:data.position,               strength:data.strength},
                                        {noteID:newID, line:data.line, position:(data.position+data.length), strength:0}
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
                                if( notes[id] == undefined ){return;}
                        
                                delete notes[id];
                        
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
                                    if(!('line' in data)){data.line = notes[id].line;}
                        
                                    //Special cases where either by movement or lengthening, the note stretches further than the rightLimit
                                    //will allow. In these cases the note either has to be clipped, or prevented from moving further to the
                                    //right. In the case where a note is being lengthened and moved to the right; the system should opt to
                                    //clip it's length
                                    //Obviously, if there's no right limit don't bother
                                    if(rightLimit > -1){
                                        if('position' in data && 'length' in data){//clip length
                                            if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                                        }else{
                                            if('position' in data){//prevent movement
                                                if(notes[id].length+data.position >= rightLimit){ data.position = rightLimit - notes[id].length; }
                                            }else{ data.position = notes[id].position; }
                                            if('length' in data){//clip length
                                                if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                                            }else{ data.length = notes[id].length; }
                                        }
                                    }
                        
                                    if(!('strength' in data)){data.strength = notes[id].strength;}
                                
                                this.remove(id);
                                this.add(data,id);
                            };
                            this.reset = function(){
                                notes = [];
                                selectedNotes = [];
                                events = [];
                                events_byID = [];
                                events_byPosition = {};
                                positions = [];
                            };
                        };
                        this.launchpad = function(xCount,yCount){
                            var pages = [];
                            var pageCount = 10;
                            var currentPage = 0;
                            var position = 0;
                            var previousPosition = xCount-1;
                        
                            //internal functions
                                function makePage(xCount,yCount,fill){
                                    return Array(xCount).fill(Array(yCount).fill(fill));
                                }
                        
                            //controls
                                //getting/setting a square or a column
                                    this.square = function(x,y,value){
                                        if(x < 0){x = 0;}else if(x > xCount-1){x = xCount-1;}
                                        if(y < 0){y = 0;}else if(x > yCount-1){x = yCount-1;}
                        
                                        if(value == undefined){return pages[currentPage][y][x];}
                        
                                        pages[currentPage][y][x] = value;
                                    };
                                    this.line = function(a,data){
                                        if(a == undefined){a = position;}
                        
                                        if(data == undefined){
                                            var line = [];
                                            for(var a = 0; a < yCount; a++){
                                                if( 
                                                    pages[currentPage] == undefined || 
                                                    pages[currentPage][a] == undefined || 
                                                    pages[currentPage][a][position] == undefined
                                                ){ line.push(false); }
                                                else{ line.push(pages[currentPage][a][position]); }
                                            }
                                            return line;
                                        }else{
                                            for(var a = 0; a < yCount; a++){
                                                pages[currentPage][a][position] = data[a];
                                            }
                                        }
                                    };
                        
                                //getting/setting the playhead position
                                    this.position = function(a,react=true){
                                        if(a == undefined){return position;}
                                        previousPosition = position;
                        
                                        if(a > xCount-1){a = 0;}
                                        else if(a < 0){a = xCount-1;}
                        
                                        position = a;
                                        if(react){this.commands(this.line());}
                                    };
                                    this.previousPosition = function(){return previousPosition;};
                                    this.inc = function(){ this.position(position+1); };
                                    this.dec = function(){ this.position(position-1); };
                        
                                //getting/setting the page number
                                    this.page = function(a){
                                        if(a == undefined){return currentPage;}
                        
                                        if(a == -1){a = pageCount-1;}
                                        else if(a < 0){a = 0;}
                                        else if(a == pageCount){a = 0;}
                                        else if(a >= pageCount){a = pageCount-1;}
                                        currentPage = a;
                                        if(this.pageChange != undefined){this.pageChange(currentPage);}
                                    };
                                    this.incPage = function(){ this.page(currentPage+1); };
                                    this.decPage = function(){ this.page(currentPage-1); };
                        
                        
                                //getting/setting the data ina page or all pages
                                    this.exportPages = function(){
                                        return JSON.parse(JSON.stringify(pages));
                                    };
                                    this.importPages = function(data){
                                        pages = data;
                                        this.pageChange(currentPage);
                                    };
                                    this.exportPage = function(a){
                                        if(a == undefined){a = currentPage;}
                                        if(pages[a] == undefined){ return makePage(xCount,yCount,false); }
                                        return JSON.parse(JSON.stringify(pages[a]));
                                    };
                                    this.importPage = function(data,a){
                                        if(a == undefined){a = currentPage;}
                                        pages[a] = data;
                                        if(this.pageChange != undefined){this.pageChange(currentPage);}
                                    };
                                
                        
                            //callbacks
                                this.commands = function(){};
                                this.pageChange = function(){};
                        };
                    };
                };
                this.element = new function(){
                    this.basic = new function(){
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
                        this.circle = function(id=null, x=0, y=0, r=0, angle=0, style='fill:rgba(255,100,255,0.75)'){
                            var element = document.createElementNS('http://www.w3.org/2000/svg','circle');
                            element.id = id;
                            element.setAttribute('r',r);
                            element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+angle+'rad);' + style;
                        
                            return element;
                        };
                        this.rect = function(id=null, x=0, y=0, width=0, height=0, angle=0, style='fill:rgba(255,100,255,0.75)'){
                            var element = document.createElementNS('http://www.w3.org/2000/svg','rect');
                            element.id = id;
                            element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+angle+'rad);' + style;
                            element.setAttribute('height',height);
                            element.setAttribute('width',width);
                        
                            element.rotation = function(a){
                                if(a==null){return system.utility.element.getTransform(this).r;}
                                system.utility.element.setRotation(this, a);
                            };
                        
                            return element;
                        };
                        this.canvas = function(id=null, x=0, y=0, width=0, height=0, angle=0, res=1){
                            var canvas = document.createElement('canvas');
                                canvas.setAttribute('height',res*height);
                                canvas.setAttribute('width',res*width);
                            
                            var image = document.createElementNS('http://www.w3.org/2000/svg','image');
                                image.id = id;
                                image.style = 'transform: translate('+x+'px,'+y+'px) scale('+1/res+') rotate('+angle+'rad)';
                                image.setAttribute('height',height*res);
                                image.setAttribute('width',width*res);
                        
                            return {
                                element:image,
                                canvas:canvas,
                                context:canvas.getContext("2d"),
                                c:function(a){return a*res;},
                                print:function(){
                                    // this.element.setAttribute('href',this.canvas.toDataURL("image/png"));
                                    this.element.setAttribute('href',this.canvas.toDataURL());
                                }
                            };
                        };
                        
                        // //for when they fix forignobject/canvas
                        // this.canvas = function(id=null, x=0, y=0, width=0, height=0, angle=0){
                        //     var canvas = document.createElement('canvas');
                        //         canvas.id = id;
                        //         canvas.style = 'transform: translate('+x+'px,'+y+'px) scale('+1+') rotate('+angle+'rad)';
                        //         canvas.setAttribute('height',height);
                        //         canvas.setAttribute('width',width);
                        
                        //     var foreignObject = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
                        //         foreignObject.appendChild(canvas);
                        
                        //     return {
                        //         element:foreignObject,
                        //         canvas:canvas,
                        //         context:canvas.getContext("2d"),
                        //         c:function(a){return a;},
                        //         print:function(){}
                        //     };
                        // };
                        this.image = function(id=null, url, x=0, y=0, width=0, height=0, angle=0){
                            var element = document.createElementNS('http://www.w3.org/2000/svg','image');
                                element.id = id;
                                element.style = 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+angle+'rad)';
                                element.setAttribute('height',height);
                                element.setAttribute('width',width);
                                element.setAttribute('href',url);
                        
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
                        this.g = function(id=null, x=0, y=0, r=0, style=''){
                            var element = document.createElementNS('http://www.w3.org/2000/svg','g');
                                element.id = id;
                                element.style = style + 'transform: translate('+x+'px,'+y+'px) scale(1) rotate('+r+'rad);';
                        
                            return element;
                        };
                        this.text = function(id=null, x=0, y=0, text='', angle=0, style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;', scale=1){
                            var element = document.createElementNS('http://www.w3.org/2000/svg','text');
                                element.id = id;
                                element.style = 'transform: translate('+x+'px,'+y+'px) scale('+scale+') rotate('+angle+'rad);' + style;
                                element.innerHTML = text;
                        
                            return element;
                        };
                    };
                    this.display = new function(){
                        this.grapherSVG = function(
                            id='grapherSVG',
                            x, y, width, height,
                            foregroundStyles=['stroke:rgba(0,255,0,1); stroke-width:0.75; stroke-linecap:round;','stroke:rgba(255,255,0,1); stroke-width:0.75; stroke-linecap:round;'],
                            foregroundTextStyles=['fill:rgba(100,255,100,1); font-size:3; font-family:Helvetica;','fill:rgba(255,255,100,1); font-size:3; font-family:Helvetica;'],
                            backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:1;',
                            backgroundTextStyle='fill:rgba(0,150,0,1); font-size:5; font-family:Helvetica;',
                            backingStyle = 'fill:rgba(50,50,50,1)',
                        ){
                            var viewbox = {'bottom':-1,'top':1,'left':0,'right':1};
                            var horizontalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printingValues:[],textPosition:{x:-0.995,y:0.06},printText:false};
                            var verticalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],  printingValues:[],textPosition:{x:-0.0025,y:0.04},printText:false};
                            var backgroundLineThickness = 2;
                            var foregroundLineThickness = 2;
                        
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y});
                                //backing
                                    var backing = part.builder('rect','backing',{width:width,height:height, style:backingStyle});
                                    object.appendChild(backing);
                                //background elements
                                    var backgroundElements = part.builder('g','backgroundElements',{});
                                    object.appendChild(backgroundElements);
                                //foreground elements
                                    var foregroundElementsGroup = [];
                        
                            //controls
                                object._test = function(){
                                    this.drawBackground();
                                    this.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
                                    this.draw([0,1],undefined,1);
                                };
                                object.backgroundLineThickness = function(a){
                                    if(a==null){return backgroundLineThickness;}
                                    backgroundLineThickness = a;
                                };
                                object.foregroundLineThickness = function(a){
                                    if(a==null){return foregroundLineThickness;}
                                    foregroundLineThickness = a;
                                };
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
                                    if( a.textPosition != undefined ){horizontalMarkings.textPosition = a.textPosition;}
                                    if( a.printText != undefined ){horizontalMarkings.printText = a.printText;}
                                };
                                object.verticalMarkings = function(a){
                                    if(a==null){return verticalMarkings;}
                                    if( a.points != undefined ){verticalMarkings.points = a.points;}
                                    if( a.printingValues != undefined ){verticalMarkings.printingValues = a.printingValues;}
                                    if( a.textPosition != undefined ){verticalMarkings.textPosition = a.textPosition;}
                                    if( a.printText != undefined ){verticalMarkings.printText = a.printText;}
                                };
                                object.drawBackground = function(){
                                    backgroundElements.innerHTML = '';
                                    
                                    //horizontal lines
                                        for(var a = 0; a < horizontalMarkings.points.length; a++){
                                            var y = height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);
                        
                                            //lines
                                                backgroundElements.append(
                                                    part.builder('line','horizontalMarkings_line_'+a,{y1:y, x2:width, y2:y, style:backgroundStyle})
                                                );
                        
                                            //text
                                                if(horizontalMarkings.printText){
                                                    backgroundElements.append(
                                                        part.builder(
                                                            'text', 
                                                            'horizontalMarkings_text_'+horizontalMarkings.points[a],
                                                            {
                                                                x: horizontalMarkings.textPosition == undefined || horizontalMarkings.textPosition.x == undefined ? 0.5 : 
                                                                    system.utility.math.relativeDistance(
                                                                        width, viewbox.left,viewbox.right, 
                                                                        (typeof horizontalMarkings.textPosition.x == 'number' ? horizontalMarkings.textPosition.x : horizontalMarkings.textPosition.x[a])
                                                                    ),
                                                                y: horizontalMarkings.textPosition == undefined || horizontalMarkings.textPosition.y == undefined ? y : 
                                                                    height-system.utility.math.relativeDistance(
                                                                        height, viewbox.bottom,viewbox.top, 
                                                                        horizontalMarkings.points[a]-(typeof horizontalMarkings.textPosition.y == 'number' ? horizontalMarkings.textPosition.y : horizontalMarkings.textPosition.y[a])
                                                                    ),
                                                                text: (horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                                                style:backgroundTextStyle,
                                                            }
                                                        )
                                                    );
                                                }
                                        }
                        
                                    
                                    //vertical lines
                                    for(var a = 0; a < verticalMarkings.points.length; a++){
                                        var x = system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);
                        
                                        //lines
                                            backgroundElements.append(
                                                part.builder('line','verticalMarkings_line_'+a,{x1:x, x2:x, y2:height, style:backgroundStyle})
                                            );
                                        
                                        //text
                                            if(verticalMarkings.printText){
                                                backgroundElements.append(
                                                    part.builder(
                                                        'text', 
                                                        'verticalMarkings_text_'+verticalMarkings.points[a],
                                                        {   
                                                            x: verticalMarkings.textPosition == undefined || verticalMarkings.textPosition.x == undefined ? 0.5 : 
                                                                system.utility.math.relativeDistance(
                                                                    width, viewbox.left,viewbox.right, 
                                                                    verticalMarkings.points[a]-(typeof verticalMarkings.textPosition.x == 'number' ? verticalMarkings.textPosition.x : verticalMarkings.textPosition.x[a]),
                                                                ),
                                                            y: verticalMarkings.textPosition == undefined || verticalMarkings.textPosition.y == undefined ? y : 
                                                                system.utility.math.relativeDistance(
                                                                    height, viewbox.bottom,viewbox.top, 
                                                                    (typeof verticalMarkings.textPosition.y == 'number' ? verticalMarkings.textPosition.y : verticalMarkings.textPosition.y[a])
                                                                ),
                                                            text: (verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                                            style:backgroundTextStyle,
                                                        }
                                                    )
                                                );
                                            }
                                    }
                                };
                                object.draw = function(y,x,layer=0){
                                    if( foregroundElementsGroup[layer] == undefined ){
                                        foregroundElementsGroup[layer] = part.builder('g','foregroundElements_'+layer,{});
                                        object.appendChild(foregroundElementsGroup[layer] );
                                    }else{
                                        foregroundElementsGroup[layer].innerHTML = '';
                                    }
                        
                                    for(var a = 0; a < y.length-1; a++){
                                        var points = system.utility.math.lineCorrecter({
                                            'x1': x==undefined ? (a+0)*(width/(y.length-1)) : system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, x[a+0]),
                                            'x2': x==undefined ? (a+1)*(width/(y.length-1)) : system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, x[a+1]),
                                            'y1': height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, y[a+0], true),
                                            'y2': height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, y[a+1], true)
                                        }, height, width);
                        
                                        if(points){
                                            foregroundElementsGroup[layer].append(
                                                part.builder('line',null,{
                                                    x1:points.x1, y1:points.y1, 
                                                    x2:points.x2, y2:points.y2, 
                                                    style:(foregroundStyles[layer] == undefined ? foregroundStyles[0] : foregroundStyles[layer])
                                                })
                                            );
                                        }
                                    }
                                };
                        
                        
                            return object;
                        };
                        this.grapher_audioScope = function(
                            id='grapher_audioScope',
                            x, y, width, height,
                            graphType='Canvas',
                            foregroundStyle=['stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;'],
                            foregroundTextStyle=['fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;'],
                            backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
                            backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
                            backingStyle = 'fill:rgba(50,50,50,1)',
                        ){
                            //attributes
                                var attributes = {
                                    analyser:{
                                        analyserNode: system.audio.context.createAnalyser(),
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
                                var object = part.builder('g',id,{x:x, y:y});
                                    object._data = {};
                                    object._data.wave = {'sin':[],'cos':[]};
                                    object._data.resolution = 500;
                        
                                //main graph
                                    var grapher = part.builder('grapher'+graphType, 'graph', {
                                        x:0, y:0, width:width, height:height,
                                        style:{
                                            foreground:foregroundStyle, foregroundText:foregroundTextStyle, 
                                            background:backgroundStyle, backgroundText:backgroundTextStyle, 
                                            backing:backingStyle
                                        }
                                    });
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
                                    grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:false});
                                    grapher.verticalMarkings({points:[-0.25,-0.5,-0.75,0,0.25,0.5,0.75],printText:false});
                                    grapher.drawBackground();
                                };
                        
                            //setup
                                setBackground();
                        
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
                                    var object = part.builder('g',id,{x:x, y:y});
                        
                                //backing
                                    var rect = part.builder('rect',null,{width:width,height:height,style:backgroundStyle});
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
                                            segment: part.builder('path','arc',{path:points[a], lineType:'L', style:dimStyle}),
                                            state: false
                                        };
                                        segments.push( temp );
                                        object.append( temp.segment );
                                    }
                        
                        
                            //methods
                                object.set = function(segment,state){
                                    segments[segment].state = state;
                                    if(state){ system.utility.element.setStyle(segments[segment].segment,glowStyle); }
                                    else{ system.utility.element.setStyle(segments[segment].segment,dimStyle); }
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
                                    var object = part.builder('g',id,{x:x, y:y});
                        
                                //backing
                                    var rect = part.builder('rect',null,{width:width,height:height,style:backgroundStyle});
                                    object.appendChild(rect);
                        
                        
                        
                                // var keys = Object.keys(shapes.segments.points);
                                // for(var a = 0; a < keys.length; a++){
                                //     var subkeys = Object.keys(shapes.segments.points[keys[a]]);
                                //     for(var b = 0; b < subkeys.length; b++){
                                //         for(var c = 0; c < shapes.segments.points[keys[a]][subkeys[b]].length; c++){
                                //             object.appendChild(system.utility.workspace.dotMaker(
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
                                            segment: part.builder('path','arc',{path:points[a], lineType:'L', style:dimStyle}),
                                            state: false
                                        };
                                        segments.push( temp );
                                        object.append( temp.segment );
                                    }
                        
                        
                            //methods
                                object.set = function(segment,state){
                                    segments[segment].state = state;
                                    if(state){ system.utility.element.setStyle(segments[segment].segment,glowStyle); }
                                    else{ system.utility.element.setStyle(segments[segment].segment,dimStyle); }
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
                        this.rastorDisplay = function(
                            id='rastorDisplay',
                            x, y, width, height,
                            xCount, yCount, xGappage=1, yGappage=1
                        ){
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y});
                        
                                //backing
                                var rect = part.builder('rect',null,{width:width,height:height, style:'fill:rgb(0,0,0)'});
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
                                            var rect = part.builder('rect',null,{ x:(x*pixWidth)+xGappage/2, y:(y*pixHeight)+yGappage/2, width:pixWidth-xGappage, height:pixHeight-yGappage, style:'fill:rgb(0,0,0)' });
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
                                            system.utility.element.setStyle(pixels[x][y], 'fill:rgb('+255*pixelValues[x][y][0]+','+255*pixelValues[x][y][1]+','+255*pixelValues[x][y][2]+')' );
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
                        this.glowbox_rect = function(
                            id='glowbox_rect',
                            x, y, width, height, angle=0,
                            glowStyle = 'fill:rgba(240,240,240,1)',
                            dimStyle = 'fill:rgba(80,80,80,1)'
                        ){
                        
                            // elements 
                            var object = part.builder('g',id,{x:x, y:y});
                            var rect = part.builder('rect',null,{width:width,height:height,sngle:angle,style:dimStyle});
                                object.appendChild(rect);
                        
                            //methods
                            object.on = function(){
                                system.utility.element.setStyle(rect,glowStyle);
                            };
                            object.off = function(){
                                system.utility.element.setStyle(rect,dimStyle);
                            };
                        
                            return object;
                        };
                        this.grapherCanvas = function(
                            id='grapherCanvas',
                            x, y, width, height,
                            foregroundStyles=['stroke:rgba(0,255,0,1); stroke-width:0.75; stroke-linecap:round;','stroke:rgba(255,255,0,1); stroke-width:0.75; stroke-linecap:round;'],
                            foregroundTextStyles=['fill:rgba(100,255,100,1); font-size:3; font-family:Helvetica;','fill:rgba(255,255,100,1); font-size:3; font-family:Helvetica;'],
                            backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:1;',
                            backgroundTextStyle='fill:rgba(0,150,0,1); font-size:5; font-family:Helvetica;',
                            backingStyle = 'fill:rgba(50,50,50,1)',
                        ){
                            var viewbox = {'bottom':-1,'top':1,'left':0,'right':1};
                            var horizontalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printingValues:[],textPosition:{x:-0.995,y:0.06},printText:false};
                            var verticalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printingValues:[],textPosition:{x:-0.0025,y:0.04},printText:false};
                            var foregroundElementsGroup = [];
                        
                            //convert the style info
                                var tempStyleInfo = foregroundStyles.map(a => system.utility.element.styleExtractor(a));
                                foregroundStyles = tempStyleInfo.map(a => a.stroke);
                                var foregroundLineThicknesses = tempStyleInfo.map(a => a['stroke-width']*10);
                        
                                var tempStyleInfo = system.utility.element.styleExtractor(backgroundTextStyle);
                                backgroundTextStyle = (12*tempStyleInfo['font-size'])+'px ' + tempStyleInfo['font-family'];
                        
                                var tempStyleInfo = system.utility.element.styleExtractor(backgroundStyle);
                                backgroundStyle = tempStyleInfo.stroke;
                                var backgroundLineThickness = tempStyleInfo['stroke-width']*10;
                        
                                var tempStyleInfo = system.utility.element.styleExtractor(backingStyle);
                                backingStyle = tempStyleInfo['fill'];
                        
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y});
                                //canvas
                                    var canvas = part.builder('canvas',id,{width:width, height:height, resolution:10});
                                    object.appendChild(canvas.element);
                        
                            //controls
                                object._test = function(){
                                    this.drawBackground();
                                    this.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
                                    this.draw([0,1],undefined,1);
                                };
                                object.backgroundLineThickness = function(a){
                                    if(a==null){return backgroundLineThickness;}
                                    backgroundLineThickness = a;
                                };
                                object.foregroundLineThickness = function(a){
                                    if(a==null){return foregroundLineThickness;}
                                    foregroundLineThickness = a;
                                };
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
                                    if( a.textPosition != undefined ){horizontalMarkings.textPosition = a.textPosition;}
                                    if( a.printText != undefined ){horizontalMarkings.printText = a.printText;}
                                };
                                object.verticalMarkings = function(a){
                                    if(a==null){return verticalMarkings;}
                                    if( a.points != undefined ){verticalMarkings.points = a.points;}
                                    if( a.printingValues != undefined ){verticalMarkings.printingValues = a.printingValues;}
                                    if( a.textPosition != undefined ){verticalMarkings.textPosition = a.textPosition;}
                                    if( a.printText != undefined ){verticalMarkings.printText = a.printText;}
                                };
                                object.drawBackground = function(){
                                    //backing
                                        canvas.context.fillStyle = backingStyle;
                                        canvas.context.fillRect(canvas.c(0), canvas.c(0), canvas.c(width), canvas.c(height));
                        
                                    //horizontal lines
                                        for(var a = 0; a < horizontalMarkings.points.length; a++){
                                            var y = system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);
                        
                                            //lines
                                            canvas.context.strokeStyle = backgroundStyle; 
                                            canvas.context.lineWidth = backgroundLineThickness;
                                            canvas.context.beginPath();
                                            canvas.context.moveTo(0,canvas.c(y));
                                            canvas.context.lineTo(canvas.c(width),canvas.c(y));
                                            canvas.context.closePath();
                                            canvas.context.stroke();
                        
                                            //text
                                            if(horizontalMarkings.printText){
                                                canvas.context.fillStyle = backgroundStyle;
                                                canvas.context.font = backgroundTextStyle;
                                                canvas.context.fillText(
                                                    (horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                                    canvas.c(horizontalMarkings.textPosition == undefined || horizontalMarkings.textPosition.x == undefined ? 0.5 : 
                                                        system.utility.math.relativeDistance(
                                                            width, viewbox.left,viewbox.right, 
                                                            (typeof horizontalMarkings.textPosition.x == 'number' ? horizontalMarkings.textPosition.x : horizontalMarkings.textPosition.x[a])
                                                        )
                                                    ),
                                                    canvas.c(horizontalMarkings.textPosition == undefined || horizontalMarkings.textPosition.y == undefined ? y+1.75 : 
                                                        height-system.utility.math.relativeDistance(
                                                            height, viewbox.bottom,viewbox.top, 
                                                            horizontalMarkings.points[a]-(typeof horizontalMarkings.textPosition.y == 'number' ? horizontalMarkings.textPosition.y : horizontalMarkings.textPosition.y[a])
                                                        )
                                                    ),
                                                );
                                            }
                                        }
                        
                                    //vertical lines
                                        for(var a = 0; a < verticalMarkings.points.length; a++){
                                            var x = system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);
                        
                                            //lines
                                            canvas.context.strokeStyle = backgroundStyle; 
                                            canvas.context.lineWidth = backgroundLineThickness;
                                            canvas.context.beginPath();
                                            canvas.context.moveTo(canvas.c(x),0);
                                            canvas.context.lineTo(canvas.c(x),canvas.c(height));
                                            canvas.context.closePath();
                                            canvas.context.stroke();
                        
                                            //text
                                            if(verticalMarkings.printText){
                                                canvas.context.fillStyle = backgroundStyle;
                                                canvas.context.font = backgroundTextStyle;
                                                canvas.context.fillText(
                                                    (verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                                    canvas.c(verticalMarkings.textPosition == undefined || verticalMarkings.textPosition.x == undefined ? 0.5 : 
                                                        system.utility.math.relativeDistance(
                                                            width, viewbox.left,viewbox.right, 
                                                            verticalMarkings.points[a]-(typeof verticalMarkings.textPosition.x == 'number' ? verticalMarkings.textPosition.x : verticalMarkings.textPosition.x[a]),
                                                        )
                                                    ),
                                                    canvas.c(verticalMarkings.textPosition == undefined || verticalMarkings.textPosition.y == undefined ? y : 
                                                        system.utility.math.relativeDistance(
                                                            height, viewbox.bottom,viewbox.top, 
                                                            (typeof verticalMarkings.textPosition.y == 'number' ? verticalMarkings.textPosition.y : verticalMarkings.textPosition.y[a])
                                                        )
                                                    ),
                                                );
                                            }
                                        }
                        
                                    //printing
                                        canvas.print();
                                };
                                object.draw = function(y,x,layer=0){
                                    foregroundElementsGroup[layer] = {x:x, y:y};
                        
                                    //background redraw
                                        this.drawBackground();
                        
                                    //data drawing
                                        for(var g = 0; g < foregroundElementsGroup.length; g++){
                                            if(foregroundElementsGroup[g] == undefined){continue;}
                                            var y = foregroundElementsGroup[g].y;
                                            var x = foregroundElementsGroup[g].x;
                        
                                            for(var a = 0; a < y.length-1; a++){
                                                var points = system.utility.math.lineCorrecter({
                                                    'x1': x==undefined ? (a+0)*(width/(y.length-1)) : system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, x[a+0]),
                                                    'x2': x==undefined ? (a+1)*(width/(y.length-1)) : system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, x[a+1]),
                                                    'y1': height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, y[a+0], true),
                                                    'y2': height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, y[a+1], true)
                                                }, height, width);
                        
                                                if(points){
                                                    canvas.context.strokeStyle = (foregroundStyles[g] == undefined ? foregroundStyles[0] : foregroundStyles[g]);
                                                    canvas.context.lineWidth = (foregroundLineThicknesses[g] == undefined ? foregroundLineThicknesses[0] : foregroundLineThicknesses[g]);
                                                    canvas.context.beginPath();
                                                    canvas.context.moveTo(canvas.c(points.x1),canvas.c(points.y1));
                                                    canvas.context.lineTo(canvas.c(points.x2),canvas.c(points.y2));
                                                    canvas.context.closePath();
                                                    canvas.context.stroke();
                                                }   
                                            }
                                        }
                        
                                    //printing
                                        canvas.print();
                                };
                        
                            return object;
                        };
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
                                var object = part.builder('meter_level','mainlevel',{
                                    x:x, y:y,
                                    width:width, height:height, angle:angle,
                                    markings:markings,
                                    style:{
                                        backing:backingStyle,
                                        levels:levelStyles,
                                        marking:markingStyle,
                                    }
                                });
                                    
                            //circuitry
                                var converter = part.circuit.audio.audio2percentage()
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
                                var object = part.builder('g',id,{x:x, y:y});
                        
                            //level
                                levelStyles[0] += 'transition: height 0s;';
                                levelStyles[1] += 'transition: height 0.01s;';
                        
                                var level = part.builder('level','mainlevel',{width:width,height:height,angle:angle,style:{backing:backingStyle,levels:levelStyles}});
                                object.append(level);
                        
                            //markings
                                function makeMark(y){
                                    var markThickness = 0.2;
                                    var path = [{x:width,y:y-markThickness/2},{x:width-width/4, y:y-markThickness/2},{x:width-width/4, y:y+markThickness/2},{x:width,y:y+markThickness/2}];  
                                    return part.builder('path', null, {path:path, lineType:'L', style:markingStyle});
                                }
                                function insertText(y,text){
                                    return part.builder('label', null, {y:y+0.3, text:text, style:markingStyle});
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
                        this.grapher_periodicWave = function(
                            id='grapher_periodicWave',
                            x, y, width, height,
                            graphType='Canvas',
                            foregroundStyle=['stroke:rgba(0,255,0,1); stroke-width:0.75; stroke-linecap:round;'],
                            foregroundTextStyle=['fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;'],
                            backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:1;',
                            backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
                            backingStyle = 'fill:rgba(50,50,50,1)',
                        ){
                            //elements 
                            var object = part.builder('g',id,{x:x, y:y});
                                object._data = {};
                                object._data.wave = {'sin':[],'cos':[]};
                                object._data.resolution = 500;
                        
                            //main graph
                                var grapher = part.builder('grapher'+graphType, 'graph', {
                                    x:0, y:0, width:width, height:height,
                                    style:{
                                        foreground:foregroundStyle, foregroundText:foregroundTextStyle, 
                                        background:backgroundStyle, backgroundText:backgroundTextStyle, 
                                        backing:backingStyle
                                    }
                                });
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
                                grapher.viewbox( {'bottom':-1.1,'top':1.1} );
                                grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:true});
                                grapher.verticalMarkings({points:[0,1/4,1/2,3/4],printText:true});
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
                                // this.draw();
                            }
                        
                            object.reset();
                            return object;
                        };
                        this.readout_sixteenSegmentDisplay = function(
                            id='readout_sixteenSegmentDisplay',
                            x, y, width, height, count, angle=0,
                            backgroundStyle='fill:rgb(0,0,0)',
                            glowStyle='fill:rgb(200,200,200)',
                            dimStyle='fill:rgb(20,20,20)'
                        ){
                            //values
                                var text = '';
                                var displayInterval = null;
                        
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y, r:angle});
                        
                                //display units
                                    var units = [];
                                    for(var a = 0; a < count; a++){
                                        var temp = part.builder('sixteenSegmentDisplay', a, {
                                            x:(width/count)*a, width:width/count, height:height, 
                                            style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                                        });
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
                        this.label = function(
                            id='label',
                            x, y, text,
                            style='fill:rgba(0,0,0,1); font-size:3; font-family:Helvetica;',
                            angle=0
                        ){
                            //elements 
                            var object = part.builder('g',id,{x:x, y:y});
                        
                            var textElement = part.builder('text',id,{text:text, angle:angle, style:style});
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
                                var object = part.builder('g',id,{x:x, y:y});
                        
                                //level layers are layered from back forward, so backing must go on last
                                var levels = [];
                                for(var a = 0; a < levelStyles.length; a++){
                                    var tempStyle = levelStyles[a]!=undefined ? levelStyles[a] : levelStyles[0];
                        
                                    var temp = part.builder('rect','movingRect_'+a,{
                                        x:(-height*Math.sin(angle) + width*Math.cos(angle)).toFixed(10), 
                                        y:(height*Math.cos(angle) + width*Math.sin(angle)).toFixed(10),
                                        width:width,
                                        height:0, 
                                        angle:angle+Math.PI,
                                        style:tempStyle
                                    });
                                    levels.push(temp);
                                    object.prepend(temp);
                                }
                        
                                var backing = part.builder('rect','movingRect_'+a,{width:width, height:height, angle:angle, style:backingStyle});
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
                    };
                    this.control = new function(){
                        this.rangeslide = function(
                            id='rangeslide', 
                            x, y, width, height, angle=0,
                            handleHeight=0.025, spanWidth=0.75, values={start:0,end:1}, resetvalues={start:-1,end:-1},
                            handleStyle='fill:rgba(200,200,200,1)',
                            backingStyle='fill:rgba(150,150,150,1)',
                            slotStyle='fill:rgba(50,50,50,1)',
                            invisibleHandleStyle='fill:rgba(0,0,0,0);',
                            spanStyle='fill:rgba(200,0,200,0.5);',
                        ){
                            var grappled = false;
                            var handleNames = ['start','end'];
                        
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y, r:angle});
                                //backing and slot group
                                    var backingAndSlot = part.builder('g','backingAndSlotGroup',{});
                                    object.appendChild(backingAndSlot);
                                    //backing
                                        var backing = part.builder('rect','backing',{width:width,height:height, style:backingStyle});
                                        backingAndSlot.appendChild(backing);
                                    //slot
                                        var slot = part.builder('rect','slot',{x:width*0.45,y:(height*(handleHeight/2)),width:width*0.1,height:height*(1-handleHeight), style:slotStyle});
                                        backingAndSlot.appendChild(slot);
                        
                                //span
                                    var span = part.builder('rect','span',{
                                        x:width*((1-spanWidth)/2), y:height*handleHeight,
                                        width:width*spanWidth, height:height - 2*height*handleHeight, 
                                        style:spanStyle
                                    });
                                    object.appendChild(span);
                        
                                //handles
                                    var handles = {}
                                    for(var a = 0; a < handleNames.length; a++){
                                        //grouping
                                            handles[handleNames[a]] = part.builder('g','handle_'+a,{})
                                            object.appendChild(handles[handleNames[a]]);
                                        //handle
                                            var handle = part.builder('rect','handle',{width:width,height:height*handleHeight, style:handleStyle});
                                            handles[handleNames[a]].appendChild(handle);
                                        //invisible handle
                                            var invisibleHandleHeight = height*handleHeight + height*0.01;
                                            var invisibleHandle = part.builder('rect','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, style:invisibleHandleStyle});
                                            handles[handleNames[a]].appendChild(invisibleHandle);
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
                                        system.utility.element.setTransform_XYonly(handles.start,0,values.start*height*(1-handleHeight));
                                        system.utility.element.setTransform_XYonly(handles.end,0,values.end*height*(1-handleHeight));
                        
                                    //adjust span height (with a little bit of padding so the span is under the handles a little)
                                        system.utility.element.setTransform_XYonly(span, width*((1-spanWidth)/2), height*(handleHeight + values.start - handleHeight*(values.start + 0.1)));
                                        span.height.baseVal.value = height*( values.end - values.start + handleHeight*(values.start - values.end - 1 + 0.2) );
                        
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
                                object.smoothSet = function(targets,time,curve,update){
                                    if(grappled){return;}
                        
                                    var startTime = system.audio.context.currentTime;
                                    var startValues = JSON.parse(JSON.stringify(values));
                                    var pointFunc = system.utility.math.curvePoint.linear;
                        
                                    switch(curve){
                                        case 'linear': pointFunc = system.utility.math.curvePoint.linear; break;
                                        case 'sin': pointFunc = system.utility.math.curvePoint.sin; break;
                                        case 'cos': pointFunc = system.utility.math.curvePoint.cos; break;
                                        case 'exponential': pointFunc = system.utility.math.curvePoint.exponential; break;
                                        case 's': pointFunc = system.utility.math.curvePoint.s; break;
                                    }
                        
                                    object.smoothSet.interval = setInterval(function(){
                                        var progress = (system.audio.context.currentTime-startTime)/time; if(progress > 1){progress = 1;}
                                        if(targets.start != undefined){set( pointFunc(progress, startvalues.start, targets.start),'start', update );}
                                        if(targets.end != undefined){set( pointFunc(progress, startvalues.end, targets.end),'end', update );}
                                        if( (system.audio.context.currentTime-startTime) >= time ){
                                            if(object.onrelease){object.onrelease(values);}
                                            clearInterval(object.smoothSet.interval);
                                        }
                                    }, 1000/30); 
                                };
                                
                            //interaction
                                //background click
                                    backingAndSlot.onclick = function(event){
                                        if(grappled){return;}
                                        if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                        
                                        var y = system.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width,height).y;
                                        y = y + 0.5*handleHeight*((2*y)-1);
                        
                                        Math.abs(values.start-y) < Math.abs(values.end-y) ? set(y,'start') : set(y,'end');
                                    };
                        
                                //double-click reset
                                    object.ondblclick = function(){
                                        if(resetvalues.start<0 || resetvalues.end<0){return;}
                                        if(grappled){return;}
                                        if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                        
                                        set(resetvalues.start,'start');
                                        set(resetvalues.end,'end');
                                        object.onrelease(values);
                                    };
                        
                                //span panning - expand/shrink
                                    object.onwheel = function(){
                                        if(grappled){return;}
                                        if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                        
                                        var move = system.mouse.wheelInterpreter( event.deltaY );
                                        var globalScale = system.utility.workspace.getGlobalScale(object);
                                        var val = move/(10*globalScale);
                        
                                        set(values.start-val,'start');
                                        set(values.end+val,'end');
                                    };
                        
                                //span panning - drag
                                    span.onmousedown = function(event){
                                        grappled = true;
                                        if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                        
                                        var initialValue = values.start;
                                        var initialPosition = system.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                        
                                        system.utility.workspace.mouseInteractionHandler(
                                            function(event){
                                                var livePosition = system.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                                                pan( initialValue+(livePosition.y-initialPosition.y) )
                                                object.onchange(values);
                                            },
                                            function(event){
                                                var livePosition = system.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                                                pan( initialValue+(livePosition.y-initialPosition.y) )
                                                object.onrelease(values);
                                                grappled = false;
                                            }
                                        );
                                    };
                        
                                //handle movement
                                    for(var a = 0; a < handleNames.length; a++){
                                        handles[handleNames[a]].onmousedown = (function(a){
                                            return function(event){
                                                grappled = true;
                                                if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                                    
                                                var initialValue = values[handleNames[a]];
                                                var initialPosition = system.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width, height);
                                                
                                                system.utility.workspace.mouseInteractionHandler(
                                                    function(event){
                                                        var livePosition = system.utility.element.getPositionWithinFromMouse(event,backingAndSlot, width, height);
                                                        set( initialValue+(livePosition.y-initialPosition.y)/(1-handleHeight), handleNames[a] );
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
                                object.onchange = function(){};
                                object.onrelease = function(){};  
                        
                            //setup
                                set(0,'start');
                                set(1,'end');
                        
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
                            var object = part.builder('g',id,{x:x, y:y});
                            var rect = part.builder('rect',null,{width:width,height:height, style:backingStyle});
                                object.appendChild(rect);
                        
                            for(var y = 0; y < ycount; y++){
                                for(var x = 0; x < xcount; x++){
                                    var temp = part.builder('checkbox_rect',y+'_'+x,{
                                        x:x*(width/xcount), 
                                        y:y*(height/ycount), 
                                        width:width/xcount, 
                                        height:height/ycount, 
                                        style:{
                                            check:checkStyle,
                                            backing:backingStyle,
                                            checkGlow:checkGlowStyle,
                                            backingGlow:backingGlowStyle,
                                        }
                                    });
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
                        this.needleOverlay = function(
                            id='needleOverlay',
                            x, y, width, height, angle=0, needleWidth=0.00125, selectNeedle=true, selectionArea=true,
                            needleStyles=['fill:rgba(240, 240, 240, 1);','fill:rgba(255, 231, 114, 1);'],
                        ){
                            var needleData = {};
                        
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y});
                                //backing
                                    var backing = part.builder('rect','backing',{width:width,height:height,style:'fill:rgba(100,100,100, 0);'});
                                    object.appendChild(backing);
                                //control objects
                                    var invisibleHandleWidth = width*needleWidth + width*0.005;
                                    var controlObjects = {};
                                        //lead
                                        controlObjects.lead = part.builder('g','lead',{});
                                        controlObjects.lead.append(part.builder('rect','handle',{width:needleWidth*width,height:height,style:needleStyles[0]}));
                                        controlObjects.lead.append(part.builder('rect','invisibleHandle',{x:(width*needleWidth - invisibleHandleWidth)/2, width:invisibleHandleWidth,height:height,style:'fill:rgba(255,0,0,0);cursor: col-resize;'}));
                                        //selection_A
                                        controlObjects.selection_A = part.builder('g','selection_A',{});
                                        controlObjects.selection_A.append(part.builder('rect','handle',{width:needleWidth*width,height:height,style:needleStyles[1]}));
                                        controlObjects.selection_A.append(part.builder('rect','invisibleHandle',{x:(width*needleWidth - invisibleHandleWidth)/2, width:invisibleHandleWidth,height:height,style:'fill:rgba(255,0,0,0);cursor: col-resize;'}) );
                                        //selection_B
                                        controlObjects.selection_B = part.builder('g','selection_B',{});
                                        controlObjects.selection_B.append(part.builder('rect','handle',{width:needleWidth*width,height:height,style:needleStyles[1]}));
                                        controlObjects.selection_B.append(part.builder('rect','invisibleHandle',{x:(width*needleWidth - invisibleHandleWidth)/2, width:invisibleHandleWidth,height:height,style:'fill:rgba(255,0,0,0);cursor: col-resize;'}) );
                                        //selection_area
                                        controlObjects.selection_area = part.builder('rect','selection_area',{height:height,style:needleStyles[1]+'opacity:0.33; cursor: move;'});
                                        //generic needles
                                        controlObjects.generic = [];
                                    var controlObjectsGroup = part.builder('g','controlObjectsGroup',{})
                                    object.append(controlObjectsGroup);
                        
                            //internal functions
                                function setGenericNeedle(number,location,specialStyle={}){
                                    if(controlObjects.generic[number] && location != undefined){
                                        system.utility.element.setTransform_XYonly( controlObjects.generic[number], location*width - width*needleWidth*location, 0);
                                    }else if(controlObjects.generic[number]){
                                        controlObjects.generic[number].remove();
                                        delete controlObjects.generic[number];
                                    }else{
                                        controlObjects.generic[number] = part.builder('g','generic_'+number,{x:(location*width - needleWidth*width/2), style:specialStyle})
                                        controlObjects.generic[number].append( part.builder('rect','handle',{width:needleWidth*width,height:height,style:needleStyles[0]}) );
                                        controlObjects.generic[number].append( part.builder('rect','invisibleHandle',{x:(width*needleWidth - invisibleHandleWidth)/2, width:invisibleHandleWidth,height:height,style:'fill:rgba(255,0,0,0);'}) );
                                        controlObjectsGroup.append( controlObjects.generic[number] );
                                    }
                                }
                                //place the selected needle at the selected location
                                function needleJumpTo(needle,location){
                                    //if the location is wrong, remove the needle and return
                                    if(location == undefined || location < 0 || location > 1){
                                        controlObjects[needle].remove();
                                        delete needleData[needle];
                                        return;
                                    }
                        
                                    //if the needle isn't in the scene, add it
                                    if( !controlObjectsGroup.contains(controlObjects[needle]) ){
                                        controlObjectsGroup.append(controlObjects[needle]);
                                    }
                        
                                    //actualy set the location of the needle (adjusting for the size of needle)
                                    system.utility.element.setTransform_XYonly( controlObjects[needle], location*width - width*needleWidth*location, 0);
                                    //save this value
                                    needleData[needle] = location;
                                }
                                function computeSelectionArea(){
                                    //if the selection needles' data are missing (or they are the same position) remove the area element and return
                                    if(needleData.selection_A == undefined || needleData.selection_B == undefined || needleData.selection_A == needleData.selection_B){
                                        controlObjects.selection_area.remove();
                                        object.selectionAreaToggle(false);
                                        delete needleData.selection_area;
                                        return;
                                    }
                        
                                    //if the area isn't in the scene, add it
                                    if( !controlObjectsGroup.contains(controlObjects.selection_area) ){
                                        controlObjectsGroup.append(controlObjects.selection_area);
                                        object.selectionAreaToggle(true);
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
                        
                                    system.utility.element.setTransform_XYonly(controlObjects.selection_area, width*start, 0);
                                    controlObjects.selection_area.setAttribute('width',width*area);
                                }
                        
                            //interaction
                                //generic onmousedown code for interaction
                                function needle_onmousedown(needleName,callback){
                                    if(object.onchange){ object.onchange(needleName,system.utility.element.getPositionWithinFromMouse(event,object,width,height).x); }
                                    system.svgElement.onmousemove = function(event){
                                        var x = system.utility.element.getPositionWithinFromMouse(event,object,width,height).x;
                        
                                        needleJumpTo(needleName,x);
                                        if(object.onchange){ object.onchange(needleName,x); }
                                        if(callback){callback();}
                                    };
                                    system.svgElement.onmouseup = function(event){
                                        var x = system.utility.element.getPositionWithinFromMouse(event,object,width,height).x;
                                        needleJumpTo(needleName,x);
                                        if(object.onrelease){ object.onrelease(needleName,x); }
                                        if(callback){callback();}
                                        system.svgElement.onmousemove = undefined;
                                        system.svgElement.onmouseleave = undefined;
                                        system.svgElement.onmouseup = undefined;
                                    };
                                    system.svgElement.onmouseleave = system.svgElement.onmouseup;
                                }
                        
                                backing.onmousedown = function(event){
                                    if(!event.shiftKey){
                                        if(!selectNeedle){return;}
                                        needleJumpTo('lead',system.utility.element.getPositionWithinFromMouse(event,object,width,height).x);
                                        needle_onmousedown('lead');
                                    }
                                    else{
                                        if(!selectionArea){return;}
                                        needleJumpTo('selection_A',system.utility.element.getPositionWithinFromMouse(event,object,width,height).x);
                                        needle_onmousedown('selection_B',computeSelectionArea);
                                    }
                                };
                                controlObjects.lead.onmousedown = function(){ needle_onmousedown('lead'); };
                                controlObjects.selection_A.onmousedown = function(){
                                    needle_onmousedown('selection_A',computeSelectionArea); 
                                };
                                controlObjects.selection_B.onmousedown = function(){
                                    needle_onmousedown('selection_B',computeSelectionArea); 
                                };
                                controlObjects.selection_area.onmousedown = function(){
                                    system.svgElement.onmousemove = function(event){
                                        var divider = system.utility.workspace.getGlobalScale(object);
                                        var newAlocation = needleData['selection_A']+event.movementX/(width*divider);
                                        var newBlocation = needleData['selection_B']+event.movementX/(width*divider);
                        
                                        if(newAlocation > 1 || newAlocation < 0 || newBlocation > 1 || newBlocation < 0){return;}
                        
                                        if(object.onchange){ object.onchange('selection_A',newAlocation); object.onchange('selection_B',newBlocation); }
                                        needleJumpTo('selection_A',newAlocation);
                                        needleJumpTo('selection_B',newBlocation);
                                        computeSelectionArea();
                                    };
                                    system.svgElement.onmouseup = function(event){
                                        if(object.onrelease){ object.onrelease('selection_A',needleData.selection_A); object.onrelease('selection_B',needleData.selection_B); }
                                        system.svgElement.onmousemove = undefined;
                                        system.svgElement.onmouseleave = undefined;
                                        system.svgElement.onmouseup = undefined;
                                    };
                                };
                                
                                //doubleclick to destroy selection area
                                controlObjects.selection_A.ondblclick = function(){
                                    needleJumpTo('selection_A');
                                    needleJumpTo('selection_B');
                                    computeSelectionArea();
                                };
                                controlObjects.selection_B.ondblclick = controlObjects.selection_A.ondblclick;
                                controlObjects.selection_area.ondblclick = controlObjects.selection_A.ondblclick;
                        
                            //controls
                                object.select = function(position,update=true){
                                    if(!selectNeedle){return;}
                                    //if there's no input, return the value
                                    //if input is out of bounds, remove the needle
                                    //otherwise, set the position
                                    if(position == undefined){ return needleData.lead; }
                                    else if(position > 1 || position < 0){ needleJumpTo('lead'); }
                                    else{ needleJumpTo('lead',position); }
                                };
                                object.area = function(positionA,positionB){
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
                                };
                                object.genericNeedle = function(number,position,specialStyle=''){
                                    setGenericNeedle(number,position,specialStyle);
                                };
                        
                            //callbacks
                                object.onchange = function(needle,value){};
                                object.onrelease = function(needle,value){};
                                object.selectionAreaToggle = function(bool){};
                        
                            return object;
                        };
                        this.button_rect = function(
                            id='button_rect',
                            x, y, width, height, angle=0,
                            text_centre, text_left, text_right,
                            textVerticalOffsetMux=0.5, textHorizontalOffsetMux=0.05,
                            active=true, hoverable=true, selectable=false, pressable=true,
                            textStyle='fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
                            backgroundStyle_off=                     'fill:rgba(180,180,180,1)',
                            backgroundStyle_up=                      'fill:rgba(200,200,200,1)',
                            backgroundStyle_press=                   'fill:rgba(230,230,230,1)',
                            backgroundStyle_select=                  'fill:rgba(200,200,200,1); stroke:rgba(120,120,120,1); stroke-width:2;',
                            backgroundStyle_select_press=            'fill:rgba(230,230,230,1); stroke:rgba(120,120,120,1); stroke-width:2;',
                            backgroundStyle_glow=                    'fill:rgba(220,220,220,1)',
                            backgroundStyle_glow_press=              'fill:rgba(250,250,250,1)',
                            backgroundStyle_glow_select=             'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:2;',
                            backgroundStyle_glow_select_press=       'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:2;',
                            backgroundStyle_hover=                   'fill:rgba(220,220,220,1)',
                            backgroundStyle_hover_press=             'fill:rgba(240,240,240,1)',
                            backgroundStyle_hover_select=            'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:2;',
                            backgroundStyle_hover_select_press=      'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:2;',
                            backgroundStyle_hover_glow=              'fill:rgba(240,240,240,1)',
                            backgroundStyle_hover_glow_press=        'fill:rgba(250,250,250,1)',
                            backgroundStyle_hover_glow_select=       'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:2;',
                            backgroundStyle_hover_glow_select_press= 'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:2;',
                        ){
                            //elements
                                var object = part.builder('g',id,{x:x,y:y,r:angle});
                        
                                var background = part.builder('rect',null,{width:width, height:height, style:backgroundStyle_off});
                                object.appendChild( background );
                        
                                var text_centre = part.builder('text',null,{x:width/2, y:height*textVerticalOffsetMux, text:text_centre, style:textStyle+'text-anchor:middle;'});
                                object.appendChild(text_centre);
                                var text_left = part.builder('text',null,{x:width*textHorizontalOffsetMux, y:height*textVerticalOffsetMux, text:text_left, style:textStyle});
                                object.appendChild(text_left);
                                var text_right = part.builder('text',null,{x:width-(width*textHorizontalOffsetMux), y:height*textVerticalOffsetMux, text:text_right, style:textStyle+'text-anchor:end;'});
                                object.appendChild(text_right);
                        
                            //state
                                object.state = {
                                    hovering:false,
                                    glowing:false,
                                    selected:false,
                                    pressed:false,
                                };
                        
                                object.activateGraphicalState = function(){
                                    if(!active){ system.utility.element.setStyle( background, backgroundStyle_off); return; }
                        
                                    var styles = [
                                        backgroundStyle_up,                backgroundStyle_press,
                                        backgroundStyle_select,            backgroundStyle_select_press,
                                        backgroundStyle_glow,              backgroundStyle_glow_press,
                                        backgroundStyle_glow_select,       backgroundStyle_glow_select_press,
                                        backgroundStyle_hover,             backgroundStyle_hover_press,
                                        backgroundStyle_hover_select,      backgroundStyle_hover_select_press,
                                        backgroundStyle_hover_glow,        backgroundStyle_hover_glow_press,
                                        backgroundStyle_hover_glow_select, backgroundStyle_hover_glow_select_press,
                                    ];
                        
                                    if(!hoverable && object.state.hovering ){ object.state.hovering = false; }
                                    if(!selectable && object.state.selected ){ object.state.selected = false; }
                        
                                    system.utility.element.setStyle( 
                                        background, 
                                        styles[ object.state.hovering*8 + object.state.glowing*4 + object.state.selected*2 + (pressable && object.state.pressed)*1 ]
                                    );
                                };
                                object.activateGraphicalState();
                        
                                //interactivity
                                    object.onmouseenter = function(event){ 
                                        this.state.hovering = true;  
                                        this.activateGraphicalState();
                                        if(this.onenter){this.onenter(this, event);}
                                        if(event.buttons == 1){object.onmousedown(event);} 
                                    };
                                    object.onmouseleave = function(event){ 
                                        this.state.hovering = false; 
                                        this.release(event); 
                                        this.activateGraphicalState(); 
                                        if(this.onleave){this.onleave(this, event);}
                                    };
                                    object.onmouseup = function(event){   this.release(event); };
                                    object.onmousedown = function(event){ this.press(event);   };
                                    object.ondblclick = function(event){ if(this.ondblpress){this.ondblpress(this, event);} };
                                //controls
                                    object.press = function(event){
                                        if(this.state.pressed){return;}
                                        this.state.pressed = true;
                                        this.activateGraphicalState();
                                        if(this.onpress){this.onpress(this, event);}
                                        this.select( !this.select(), event );
                                    };
                                    object.release = function(event){
                                        if(!this.state.pressed){return;}
                                        this.state.pressed = false;
                                        this.activateGraphicalState();
                                        if(this.onrelease){this.onrelease(this, event);}
                                    };
                                    object.active = function(bool){ if(bool == undefined){return active;} active = bool; this.activateGraphicalState(); };
                                    object.glow = function(bool){   if(bool == undefined){return this.state.glowing;}  this.state.glowing = bool;  this.activateGraphicalState(); };
                                    object.select = function(bool,event,callback=true){ 
                                        if(bool == undefined){return this.state.selected;} 
                                        if(!selectable){return;}
                                        if(this.state.selected == bool){return;}
                                        this.state.selected = bool; this.activateGraphicalState();
                                        if(callback){ if( this.state.selected ){ this.onselect(this,event); }else{ this.ondeselect(this,event); } }
                                    };
                                //callbacks
                                    object.onenter = function(object, event){};
                                    object.onleave = function(object, event){};
                                    object.onpress = function(object, event){};
                                    object.ondblpress = function(object, event){};
                                    object.onrelease = function(object, event){};
                                    object.onselect = function(object, event){};
                                    object.ondeselect = function(object, event){};
                        
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
                            var object = part.builder('g',id,{x:x, y:y, r:angle});
                                object._checked = false;
                                object.styles = {
                                    'check':checkStyle,
                                    'uncheck':'fill:rgba(0,0,0,0)',
                                    'backing':backingStyle
                                };
                        
                            var rect = part.builder('rect',null,{width:width,height:height, style:backingStyle});
                                object.appendChild(rect);
                            var checkrect = part.builder('rect',null,{x:width*0.1,y:height*0.1,width:width*0.8,height:height*0.8, style:object.styles.uncheck});
                                object.appendChild(checkrect);
                        
                        
                            function updateGraphics(){
                                if(object._checked){ system.utility.element.setStyle(checkrect,object.styles.check); }
                                else{ system.utility.element.setStyle(checkrect,object.styles.uncheck); }
                                system.utility.element.setStyle(rect,object.styles.backing);
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
                        this.slide = function(
                            id='slide', 
                            x, y, width, height, angle=0,
                            handleHeight=0.1, value=0, resetValue=-1,
                            handleStyle = 'fill:rgba(200,200,200,1)',
                            backingStyle = 'fill:rgba(150,150,150,1)',
                            slotStyle = 'fill:rgba(50,50,50,1)',
                            invisibleHandleStyle = 'fill:rgba(0,0,0,0);',
                        ){
                            var grappled = false;
                        
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y, r:angle});
                                //backing and slot group
                                    var backingAndSlot = part.builder('g','backingAndSlotGroup',{});
                                    object.appendChild(backingAndSlot);
                                    //backing
                                        var backing = part.builder('rect','backing',{width:width,height:height, style:backingStyle});
                                        backingAndSlot.appendChild(backing);
                                    //slot
                                        var slot = part.builder('rect','slot',{x:width*0.45,y:(height*(handleHeight/2)),width:width*0.1,height:height*(1-handleHeight), style:slotStyle});
                                        backingAndSlot.appendChild(slot);
                                //handle
                                    var handle = part.builder('rect','handle',{width:width,height:height*handleHeight, style:handleStyle});
                                    object.appendChild(handle);
                                //invisible handle
                                    var invisibleHandleHeight = height*handleHeight + height*0.01;
                                    var invisibleHandle = part.builder('rect','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, style:invisibleHandleStyle});
                                    object.appendChild(invisibleHandle);
                        
                            //graphical adjust
                                function set(a,update=true){
                                    a = (a>1 ? 1 : a);
                                    a = (a<0 ? 0 : a);
                        
                                    if(update){object.onchange(a);}
                                    
                                    value = a;
                                    handle.y.baseVal.valueInSpecifiedUnits = a*height*(1-handleHeight);
                                    invisibleHandle.y.baseVal.valueInSpecifiedUnits = a*height*(1-handleHeight);
                                }
                                object.__calculationAngle = angle;
                                function currentMousePosition(event){
                                    return event.y*Math.cos(object.__calculationAngle) - event.x*Math.sin(object.__calculationAngle);
                                }
                            
                            //methods
                                object.set = function(value,update){
                                    if(grappled){return;}
                                    set(value,update);
                                };
                                object.smoothSet = function(target,time,curve,update){
                                    if(grappled){return;}
                        
                                    var startTime = system.audio.context.currentTime;
                                    var startValue = value;
                                    var pointFunc = system.utility.math.curvePoint.linear;
                        
                                    switch(curve){
                                        case 'linear': pointFunc = system.utility.math.curvePoint.linear; break;
                                        case 'sin': pointFunc = system.utility.math.curvePoint.sin; break;
                                        case 'cos': pointFunc = system.utility.math.curvePoint.cos; break;
                                        case 'exponential': pointFunc = system.utility.math.curvePoint.exponential; break;
                                        case 's': pointFunc = system.utility.math.curvePoint.s; break;
                                    }
                        
                                    object.smoothSet.interval = setInterval(function(){
                                        var progress = (system.audio.context.currentTime-startTime)/time; if(progress > 1){progress = 1;}
                                        set( pointFunc(progress, startValue, target), update );
                                        if( (system.audio.context.currentTime-startTime) >= time ){ clearInterval(object.smoothSet.interval); }
                                    }, 1000/30);            
                                };
                                object.get = function(){return value;};
                        
                            //interaction
                                object.ondblclick = function(){
                                    if(resetValue<0){return;}
                                    if(grappled){return;}
                                    if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                        
                                    set(resetValue);
                                    object.onrelease(value);
                                };
                                object.onwheel = function(){
                                    if(grappled){return;}
                                    if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                        
                                    var move = system.mouse.wheelInterpreter( event.deltaY );
                                    var globalScale = system.utility.workspace.getGlobalScale(object);
                                    set( value + move/(10*globalScale) );
                                    object.onrelease(value);
                                };
                                backingAndSlot.onclick = function(event){
                                    if(grappled){return;}
                                    if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                        
                                    var y = system.utility.element.getPositionWithinFromMouse(event,backingAndSlot,width,height).y;
                        
                                    var value = y + 0.5*handleHeight*((2*y)-1);
                                    set(value);
                                    object.onrelease(value);
                                };
                                invisibleHandle.onmousedown = function(event){
                                    grappled = true;
                                    if(object.smoothSet.interval){clearInterval(object.smoothSet.interval);}
                        
                                    var initialValue = value;
                                    var initialY = currentMousePosition(event);
                                    var mux = height - height*handleHeight;
                        
                                    system.utility.workspace.mouseInteractionHandler(
                                        function(event){
                                            var numerator = initialY-currentMousePosition(event);
                                            var divider = system.utility.workspace.getGlobalScale(object);
                                            set( initialValue - numerator/(divider*mux) );
                                        },
                                        function(event){
                                            var numerator = initialY-currentMousePosition(event);
                                            var divider = system.utility.workspace.getGlobalScale(object);
                                            object.onrelease(initialValue - numerator/(divider*mux));
                                            grappled = false;
                                        }
                                    );
                                };
                        
                            //callbacks
                                object.onchange = function(){};
                                object.onrelease = function(){};
                        
                            //setup
                                set(value);
                        
                            return object;
                        };
                        this.dial_continuous = function(
                            id='dial_continuous',
                            x, y, r,
                            startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
                            handleStyle = 'fill:rgba(175,175,175,1)',
                            slotStyle = 'fill:rgba(50,50,50,1)',
                            needleStyle = 'fill:rgba(250,100,100,1)',
                            handleStyle_glow = 'fill:rgba(175,175,175,1)',
                            slotStyle_glow = 'fill:rgba(254,255,219,1)',
                            needleStyle_glow = 'fill:rgba(250,100,100,1)',
                            arcDistance=1.35,
                            outerArcStyle='fill:none; stroke:none;',
                            outerArcStyle_glow='fill:none; stroke:none;',
                        ){
                            // elements
                                var object = part.builder('g',id,{x:x, y:y});
                                    object._value = 0;
                                    object._data = {
                                        'mux':r*4
                                    };
                        
                                //arc
                                    var points = 5;
                                    var pushDistance = 1.11;
                                    var arcPath = [];
                                    for(var a = 0; a < points; a++){
                                        var temp = system.utility.math.polar2cartesian(startAngle+a*(maxAngle/points),r*arcDistance);
                                        arcPath.push( temp );
                                        var temp = system.utility.math.polar2cartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
                                        arcPath.push( temp );
                                    }
                                    var temp = system.utility.math.polar2cartesian(startAngle+maxAngle,r*arcDistance);
                                    arcPath.push( temp );
                        
                                    var outerArc = part.builder('path','arc',{path:arcPath, lineType:'Q', style:outerArcStyle});
                                    object.appendChild(outerArc);
                        
                                //slot
                                    var slot = part.builder('circle','slot',{r:r*1.1, style:slotStyle});
                                        object.appendChild(slot);
                        
                                //handle
                                    var handle = part.builder('circle','slot',{r:r, style:handleStyle});
                                        object.appendChild(handle);
                        
                                //needle
                                    var needleWidth = r/5;
                                    var needleLength = r;
                                    var needle = part.builder('rect','needle',{height:needleWidth, width:needleLength, style:needleStyle});
                                        needle.x.baseVal.valueInSpecifiedUnits = needleLength/3;
                                        needle.y.baseVal.valueInSpecifiedUnits = -needleWidth/2;
                                        object.appendChild(needle);
                        
                        
                            //methods
                                object.get = function(){ return this._value; };
                                object.set = function(value, live=false, update=true){
                                    value = (value>1 ? 1 : value);
                                    value = (value<0 ? 0 : value);
                        
                                    this._value = value;
                                    if(update&&this.onchange){try{this.onchange(value);}catch(err){console.error('Error with dial_continuous:onchange\n',err);}}
                                    if(update&&!live&&this.onrelease){try{this.onrelease(value);}catch(err){console.error('Error with dial_continuous:onrelease\n',err);}}
                                    this.children['needle'].rotation(startAngle + maxAngle*value);
                                };
                                object.smoothSet = function(target,time,curve,update=true){
                                    var startTime = system.audio.context.currentTime;
                                    var startValue = value;
                                    var pointFunc = system.utility.math.curvePoint.linear;
                        
                                    switch(curve){
                                        case 'linear': pointFunc = system.utility.math.curvePoint.linear; break;
                                        case 'sin': pointFunc = system.utility.math.curvePoint.sin; break;
                                        case 'cos': pointFunc = system.utility.math.curvePoint.cos; break;
                                        case 'exponential': pointFunc = system.utility.math.curvePoint.exponential; break;
                                        case 's': pointFunc = system.utility.math.curvePoint.s; break;
                                    }
                        
                                    object.smoothSet.interval = setInterval(function(){
                                        var progress = (system.audio.context.currentTime-startTime)/time; if(progress > 1){progress = 1;}
                                        object.set( pointFunc(progress, startValue, target), true, update );
                                        if( (system.audio.context.currentTime-startTime) >= time ){ clearInterval(object.smoothSet.interval); }
                                    }, 1000/30);  
                                };
                                object.glow = function(state){
                                    if(state){
                                        system.utility.element.setStyle(outerArc,outerArcStyle_glow);
                                        system.utility.element.setStyle(slot,slotStyle_glow);
                                        system.utility.element.setStyle(handle,handleStyle_glow);
                                        system.utility.element.setStyle(needle,needleStyle_glow);
                                    }else{
                                        system.utility.element.setStyle(outerArc,outerArcStyle);
                                        system.utility.element.setStyle(slot,slotStyle);
                                        system.utility.element.setStyle(handle,handleStyle);
                                        system.utility.element.setStyle(needle,needleStyle);
                                    }
                                };
                                
                        
                            //callback
                                object.onchange = function(){};
                                object.onrelease = function(){};
                        
                        
                            //mouse interaction
                                object.ondblclick = function(){ this.set(0.5); };
                                object.onwheel = function(event){
                                    var move = system.mouse.wheelInterpreter( event.deltaY );
                                    var globalScale = system.utility.workspace.getGlobalScale(object);
                        
                                    this.set( this.get() - move/(10*globalScale) );
                                };
                                object.onmousedown = function(event){
                                    system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                                    system.svgElement.onmouseleave_old = system.svgElement.onmouseleave;
                                    system.svgElement.onmouseup_old = system.svgElement.onmouseup;
                        
                                    system.svgElement.tempRef = this;
                                    system.svgElement.tempRef._data.initialValue = this.get();
                                    system.svgElement.tempRef._data.initialY = event.y;
                                    system.svgElement.tempRef._data.mux = system.svgElement.tempRef._data.mux;
                                    system.svgElement.onmousemove = function(event){
                                        var mux = system.svgElement.tempRef._data.mux;
                                        var value = system.svgElement.tempRef._data.initialValue;
                                        var numerator = event.y-system.svgElement.tempRef._data.initialY;
                                        var divider = system.utility.workspace.getGlobalScale(object);
                        
                                        system.svgElement.tempRef.set( value - numerator/(divider*mux), true );
                                    };
                                    system.svgElement.onmouseup = function(){
                                        this.tempRef.set(this.tempRef.get(),false);
                                        delete this.tempRef;
                        
                                        system.svgElement.onmousemove = system.svgElement.onmousemove_old;
                                        system.svgElement.onmouseleave = system.svgElement.onmouseleave_old;
                                        system.svgElement.onmouseup = system.svgElement.onmouseup_old;
                        
                                        system.svgElement.onmousemove_old = null;
                                        system.svgElement.onmouseleave_old = null;
                                        system.svgElement.onmouseup_old = null;
                                    };
                                    system.svgElement.onmouseleave = system.svgElement.onmouseup;
                                    system.svgElement.onmousemove(event);
                                };
                        
                            //setup
                                object.set(0);
                        
                            return object;
                        };
                        this.slidePanel = function(
                            id='slidePanel', 
                            x, y, width, height, count, angle=0,
                            handleHeight=0.1, startValue=0, resetValue=0.5,
                            handleStyle = 'fill:rgba(180,180,180,1)',
                            backingStyle = 'fill:rgba(150,150,150,1)',
                            slotStyle = 'fill:rgba(50,50,50,1)'
                        ){
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y, r:angle});
                                //slides
                                    for(var a = 0; a < count; a++){
                                        var temp = part.builder(
                                            'slide',a,{
                                                x:a*(width/count), y:0,
                                                width:width/count, height:height,
                                                value:startValue, resetValue:resetValue,
                                                style:{handle:handleStyle, backing:backingStyle, slot:slotStyle}
                                            }
                                        );
                                        temp.onchange = function(value){ object.onchange(this.id,value); };
                                        temp.onrelease = function(value){ object.onrelease(this.id,value); };
                                        temp.__calculationAngle = angle;
                                        object.appendChild(temp);
                                    }
                        
                            //methods
                                object.slide = function(index){ return object.children[index]; };
                                object.get = function(){
                                    var outputArray = [];
                                    for(var a = 0; a < count; a++){
                                        outputArray.push(this.slide(a).get());
                                    }
                                    return outputArray;
                                };
                                object.set = function(values,update=true){
                                    for(var a = 0; a < values.length; a++){
                                        this.slide(a).set(values[a],update);
                                    }
                                };
                                object.setAll = function(value,update=true){
                                    this.set( Array.apply(null, Array(count)).map(Number.prototype.valueOf,value),false );
                                    if(update){this.onchange('all',value);}
                                };
                                object.smoothSet = function(values,time,curve,update=true){
                                    for(var a = 0; a < values.length; a++){
                                        this.slide(a).smoothSet(values[a],time,curve,update);
                                    }
                                };
                                object.smoothSetAll = function(value, time, curve, update=true){
                                    this.smoothSet( Array.apply(null, Array(count)).map(Number.prototype.valueOf,value), time, curve, false );
                                    if(update){this.onchange('all',value);}
                                };
                        
                            //callbacks
                                object.onchange = function(slide,value){};
                                object.onrelease = function(slide,value){};
                            
                            return object;
                        };
                        this.sequencer = function(
                            id='svg_sequencer',
                            x, y, width, height, angle,
                            
                            xCount=64, yCount=16,
                            zoomLevel_x=1/1, zoomLevel_y=1/1,
                        
                            backingStyle='fill:rgba(20,20,20,1);',
                            selectionAreaStyle='fill:rgba(209, 189, 222, 0.5);stroke:rgba(225, 217, 234,1);stroke-width:0.5;pointer-events:none;',
                        
                            blockStyle_body=[
                                'fill:rgba(138,138,138,0.6);stroke:rgba(175,175,175,0.8);stroke-width:0.5;',
                                'fill:rgba(130,199,208,0.6);stroke:rgba(130,199,208,0.8);stroke-width:0.5;',
                                'fill:rgba(129,209,173,0.6);stroke:rgba(129,209,173,0.8);stroke-width:0.5;',
                                'fill:rgba(234,238,110,0.6);stroke:rgba(234,238,110,0.8);stroke-width:0.5;',
                                'fill:rgba(249,178,103,0.6);stroke:rgba(249,178,103,0.8);stroke-width:0.5;',
                                'fill:rgba(255, 69, 69,0.6);stroke:rgba(255, 69, 69,0.8);stroke-width:0.5;',
                            ],
                            blockStyle_bodyGlow=[
                                'fill:rgba(138,138,138,0.8);stroke:rgba(175,175,175,1);stroke-width:0.5;',
                                'fill:rgba(130,199,208,0.8);stroke:rgba(130,199,208,1);stroke-width:0.5;',
                                'fill:rgba(129,209,173,0.8);stroke:rgba(129,209,173,1);stroke-width:0.5;',
                                'fill:rgba(234,238,110,0.8);stroke:rgba(234,238,110,1);stroke-width:0.5;',
                                'fill:rgba(249,178,103,0.8);stroke:rgba(249,178,103,1);stroke-width:0.5;',
                                'fill:rgba(255, 69, 69,0.8);stroke:rgba(255, 69, 69,1);stroke-width:0.5;',
                            ],    
                            blockStyle_handle='fill:rgba(200,0,0,0);cursor:col-resize;',
                            blockStyle_handleWidth=3,
                        
                            horizontalStripStyle_pattern=[0,1],
                            horizontalStripStyle_glow='stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.8);',
                            horizontalStripStyle_styles=[
                                'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.5);',
                                'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(100,100,100,0);',
                            ],
                            verticalStripStyle_pattern=[0],
                            verticalStripStyle_glow='stroke:rgba(252,244,128,0.5);stroke-width:0.5;fill:rgba(229, 221, 112,0.25);',
                            verticalStripStyle_styles=[
                                'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(30,30,30,0.5);',
                            ],
                        
                            playheadStyle='stroke:rgb(240, 240, 240);',
                        ){
                            //state
                                var totalSize =  {
                                    width:  width/zoomLevel_x,
                                    height: height/zoomLevel_y,
                                };
                                var viewposition = {x:0,y:0};
                                var viewArea = {
                                    left:0, right:zoomLevel_x,
                                    top:0, bottom:zoomLevel_y,
                                };
                                var noteRegistry = new part.circuit.sequencing.noteRegistry(xCount,yCount);
                                var selectedNotes = [];
                                var activeNotes = [];
                                var snapping = true;
                                var step = 1/1;
                                var defualtStrength = 0.5;
                                var loop = {active:false, period:{start:0, end:xCount}};
                                var playhead = {
                                    width:0.75,
                                    invisibleHandleMux:6,
                                    position:-1,
                                    held:false,
                                    automoveViewposition:false,
                                };
                        
                            //internal functions
                                function setViewArea(d,update=true){
                                    //clean off input
                                        if(d == undefined || (d.left == undefined && d.right == undefined && d.top == undefined && d.bottom == undefined)){return viewArea;}
                                        if(d.left == undefined){d.left = viewArea.left;} if(d.right == undefined){d.right = viewArea.right;}
                                        if(d.top == undefined){d.top = viewArea.top;}    if(d.bottom == undefined){d.bottom = viewArea.bottom;}
                        
                                    //only adjust the zoom, if the distance between the areas changed
                                        var x = (viewArea.right-viewArea.left)!=(d.right-d.left);
                                        var y = (d.bottom-d.top)!=(viewArea.bottom-viewArea.top);
                                        if(x && y){ adjustZoom( (d.right-d.left),(d.bottom-d.top) ); }
                                        else if(x){ adjustZoom( (d.right-d.left),undefined ); }
                                        else if(y){ adjustZoom( undefined,(d.bottom-d.top) ); }
                        
                                    //update pan
                                        var newX = 0; var newY = 0;
                                        if( (1-(d.right-d.left)) != 0 ){ newX = d.left + d.left*((d.right-d.left)/(1-(d.right-d.left))); }
                                        if( (1-(d.bottom-d.top)) != 0 ){ newY = d.top  +  d.top*((d.bottom-d.top)/(1-(d.bottom-d.top))); }
                                        setViewposition(newX,newY,update);
                        
                                    //update state
                                        viewArea = { top:d.top, bottom:d.bottom, left:d.left, right:d.right };
                                }
                                function adjustZoom(x,y){
                                    if(x == undefined && y == undefined){return {x:zoomLevel_x, y:zoomLevel_y};}
                                    var maxZoom = 0.01;
                                    
                                    //(awkward bid for speed)
                                    if(x != undefined && x != zoomLevel_x && y != undefined && y != zoomLevel_y ){
                                        //make sure things are between 0.01 and 1
                                            var maxZoom = 0.01;
                                            x = x<maxZoom?maxZoom:x; x = x>1?1:x;
                                            y = y<maxZoom?maxZoom:y; y = y>1?1:y;
                        
                                        //update state
                                            zoomLevel_x = x;
                                            zoomLevel_y = y;
                                            totalSize.width = width/zoomLevel_x;
                                            totalSize.height = height/zoomLevel_y;
                        
                                        //update interactionPlane
                                            interactionPlane.width.baseVal.value = totalSize.width;
                                            interactionPlane.height.baseVal.value = totalSize.height;
                        
                                        //update background strips
                                            for(var a = 0; a < xCount; a++){
                                                system.utility.element.setTransform_XYonly(backgroundDrawArea.children['strip_vertical_'+a], a*(width/(xCount*zoomLevel_x)), 0);
                                                backgroundDrawArea.children['strip_vertical_'+a].width.baseVal.value = width/(xCount*zoomLevel_x);
                                                backgroundDrawArea.children['strip_vertical_'+a].height.baseVal.value = totalSize.height;
                                            }
                                            for(var a = 0; a < yCount; a++){
                                                system.utility.element.setTransform_XYonly(backgroundDrawArea.children['strip_horizontal_'+a], 0, a*(height/(yCount*zoomLevel_y)));
                                                backgroundDrawArea.children['strip_horizontal_'+a].height.baseVal.value = height/(yCount*zoomLevel_y);
                                                backgroundDrawArea.children['strip_horizontal_'+a].width.baseVal.value = totalSize.width;
                                            }
                        
                                        //update note blocks
                                            for(var a = 0; a < notePane.children.length; a++){
                                                notePane.children[a].unit(width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y));
                                            }
                        
                                        //update playhead (if there is one)
                                            if(playhead.position >= 0){
                                                workarea.children.playhead.main.y2.baseVal.value = totalSize.height;
                                                workarea.children.playhead.invisibleHandle.y2.baseVal.value = totalSize.height;
                                                system.utility.element.setTransform_XYonly(workarea.children.playhead, playhead.position*(totalSize.width/xCount), 0);
                                        }
                                    }else if( x != undefined && x != zoomLevel_x ){
                                        //make sure things are between maxZoom and 1
                                            x = x<maxZoom?maxZoom:x; x = x>1?1:x;
                        
                                        //update state
                                            zoomLevel_x = x;
                                            totalSize.width = width/zoomLevel_x;
                        
                                        //update interactionPlane
                                            interactionPlane.width.baseVal.value = totalSize.width;
                        
                                        //update background strips
                                            for(var a = 0; a < xCount; a++){
                                                system.utility.element.setTransform_XYonly(backgroundDrawArea.children['strip_vertical_'+a], a*(width/(xCount*zoomLevel_x)), 0);
                                                backgroundDrawArea.children['strip_vertical_'+a].width.baseVal.value = width/(xCount*zoomLevel_x);
                                            }
                                            for(var a = 0; a < yCount; a++){
                                                backgroundDrawArea.children['strip_horizontal_'+a].width.baseVal.value = totalSize.width;
                                            }
                        
                                        //update note blocks
                                            for(var a = 0; a < notePane.children.length; a++){
                                                notePane.children[a].unit(width/(xCount*zoomLevel_x), undefined);
                                            }
                        
                                        //update playhead (if there is one)
                                            if(playhead.position >= 0){
                                                system.utility.element.setTransform_XYonly(workarea.children.playhead, playhead.position*(totalSize.width/xCount), 0);
                                            }
                                    }else if( y != undefined && y != zoomLevel_y ){
                                        //make sure things are between maxZoom and 1
                                            y = y<maxZoom?maxZoom:y; y = y>1?1:y;
                        
                                        //update state
                                            zoomLevel_y = y;
                                            totalSize.height = height/zoomLevel_y;
                        
                                        //update interactionPlane
                                            interactionPlane.height.baseVal.value = totalSize.height;
                                        
                                        //update background strips
                                            for(var a = 0; a < xCount; a++){
                                                backgroundDrawArea.children['strip_vertical_'+a].height.baseVal.value = totalSize.height;
                                            }
                                            for(var a = 0; a < yCount; a++){
                                                system.utility.element.setTransform_XYonly(backgroundDrawArea.children['strip_horizontal_'+a], 0, a*(height/(yCount*zoomLevel_y)));
                                                backgroundDrawArea.children['strip_horizontal_'+a].height.baseVal.value = height/(yCount*zoomLevel_y);
                                            }
                        
                                        //update note blocks
                                            for(var a = 0; a < notePane.children.length; a++){
                                                notePane.children[a].unit(undefined, height/(yCount*zoomLevel_y));
                                            }
                        
                                        //update playhead (if there is one)
                                            if(playhead.position >= 0){
                                                workarea.children.playhead.main.y2.baseVal.value = totalSize.height;
                                                workarea.children.playhead.invisibleHandle.y2.baseVal.value = totalSize.height;
                                            }
                                    }
                                }
                                function drawBackground(){
                                    backgroundDrawArea.innerHTML = '';
                        
                                    //background stipes
                                        //horizontal strips
                                        for(var a = 0; a < yCount; a++){
                                            backgroundDrawArea.appendChild(
                                                part.builder('rect','strip_horizontal_'+a,{
                                                    x1:0, y:a*(height/(yCount*zoomLevel_y)),
                                                    width:totalSize.width, height:height/(yCount*zoomLevel_y),
                                                    style:horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]],
                                                })
                                            );
                                        }
                                        //vertical strips
                                        for(var a = 0; a < xCount; a++){
                                            backgroundDrawArea.appendChild(
                                                part.builder('rect','strip_vertical_'+a,{
                                                    x:a*(width/(xCount*zoomLevel_x)), y:0,
                                                    width:width/(xCount*zoomLevel_x), height:totalSize.height,
                                                    style:verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]],
                                                })
                                            );
                                        }
                                }
                                function setViewposition(x,y,update=true){
                                    if(x == undefined && y == undefined){return viewposition;}
                                    if(x == undefined || isNaN(x)){ x = viewposition.x; }
                                    if(y == undefined || isNaN(y)){ y = viewposition.y; }
                        
                                    //make sure things are between 0 and 1
                                        x = x<0?0:x; x = x>1?1:x;
                                        y = y<0?0:y; y = y>1?1:y;
                        
                                    //perform transform
                                        viewposition.x = x;
                                        viewposition.y = y;
                                        system.utility.element.setTransform_XYonly(
                                            workarea,
                                            -viewposition.x*(totalSize.width - width),
                                            -viewposition.y*(totalSize.height - height)
                                        );
                        
                                    //adjust clipping box to follow where the viewport is looking
                                        var x_offSet = (totalSize.width - width) * viewposition.x;
                                        var y_offSet = (totalSize.height - height) * viewposition.y;
                                        var q = {
                                            tl:{x:x_offSet,       y:y_offSet},
                                            br:{x:x_offSet+width, y:y_offSet+height},
                                        };
                                        viewport.setAttribute('clip-path','polygon('+q.tl.x+'px '+q.tl.y+'px, '+q.tl.x+'px '+q.br.y+'px, '+q.br.x+'px '+q.br.y+'px, '+q.br.x+'px '+q.tl.y+'px)');
                        
                                    //update viewArea
                                        var offsetX = (1-(viewArea.right-viewArea.left))*x;
                                        var offsetY = (1-(viewArea.bottom-viewArea.top))*y;
                                        viewArea = {
                                            left:   offsetX, 
                                            right:  offsetX+(viewArea.right-viewArea.left),
                                            top:    offsetY,   
                                            bottom: offsetY+(viewArea.bottom-viewArea.top),
                                        };
                        
                                    //callbacks
                                        if(update){
                                            obj.onpan({x:x,y:y});
                                            obj.onchangeviewarea(viewArea);
                                        }
                                };
                                function visible2coordinates(xy){
                                    return {
                                        x: zoomLevel_x*(xy.x - viewposition.x) + viewposition.x,
                                        y: zoomLevel_y*(xy.y - viewposition.y) + viewposition.y,
                                    };
                                }
                                function coordinates2lineposition(xy){
                                    xy.y = Math.floor(xy.y*yCount);
                                    if(xy.y >= yCount){xy.y = yCount-1;}
                                
                                    xy.x = snapping ? Math.round((xy.x*xCount)/step)*step : xy.x*xCount;
                                    if(xy.x < 0){xy.x =0;}
                                
                                    return {line:xy.y, position:xy.x};
                                }
                                function makeNote(line, position, length, strength=defualtStrength){
                                    var newID = noteRegistry.add({ line:line, position:position, length:length, strength:strength });
                                    var approvedData = noteRegistry.getNote(newID);
                                    var newNoteBlock = part.element.control.sequencer.noteBlock(newID, width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y), approvedData.line, approvedData.position, approvedData.length, approvedData.strength, false, blockStyle_body, blockStyle_bodyGlow, blockStyle_handle, blockStyle_handleWidth);
                                    notePane.append(newNoteBlock);
                        
                                    //augmenting the graphic element
                                        newNoteBlock.select = function(remainSelected=false){
                                            if(selectedNotes.indexOf(this) != -1){ if(!remainSelected){this.deselect();} return; }
                                            this.selected(true);
                                            selectedNotes.push(this);
                                            this.glow(true);
                                        };
                                        newNoteBlock.deselect = function(){
                                            selectedNotes.splice(selectedNotes.indexOf(this),1);
                                            this.selected(false);
                                            this.glow(false);
                                        };
                                        newNoteBlock.delete = function(){
                                            this.deselect();
                                            noteRegistry.remove(parseInt(this.id));
                                            this.remove();
                                        };
                                        newNoteBlock.ondblclick = function(event){
                                            if(!event[system.super.keys.ctrl]){return;}
                                            selectedNotes.map(function(a){
                                                a.strength(defualtStrength);
                                                noteRegistry.update(a.id, { strength: defualtStrength });
                                            });
                                        };
                                        newNoteBlock.body.onmousedown = function(event){
                                            //if spacebar is pressed; ignore all of this, and redirect to the interaction pane (for panning)
                                            if(system.keyboard.pressedKeys.hasOwnProperty('Space') && system.keyboard.pressedKeys.Space){
                                                interactionPlane.onmousedown(event); return;
                                            }
                        
                                            //if the shift key is not pressed and this note is not already selected; deselect everything
                                                if(!event.shiftKey && !newNoteBlock.selected()){
                                                    while(selectedNotes.length > 0){
                                                        selectedNotes[0].deselect();
                                                    }
                                                }
                        
                                            //select this block
                                                newNoteBlock.select(true);
                        
                                            //gather data for all the blocks that we're about to affect
                                                var activeBlocks = [];
                                                for(var a = 0; a < selectedNotes.length; a++){
                                                    activeBlocks.push({
                                                        id: parseInt(selectedNotes[a].id),
                                                        block: selectedNotes[a],
                                                        starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                                                    });
                                                }
                        
                                            //if control key is pressed; this is a strength-change operation
                                                if(event[system.super.keys.ctrl]){
                                                    var initialStrengths = activeBlocks.map(a => a.block.strength());
                                                    var initial = event.offsetY;
                                                    system.utility.workspace.mouseInteractionHandler(function(event){
                                                        var diff = (initial - event.offsetY)/system.svgElement.clientHeight;
                                                        for(var a = 0; a < activeBlocks.length; a++){
                                                            activeBlocks[a].block.strength(initialStrengths[a] + diff);
                                                            noteRegistry.update(activeBlocks[a].id, { strength: initialStrengths[a] + diff });
                                                        }
                                                    });
                                                    return;
                                                }
                        
                                            //if the alt key is pressed, clone the block
                                            //(but don't select it, this is 'alt-click-and-drag to clone' trick)
                                            //this function isn't run until the first sign of movement
                                                var cloned = false;
                                                function cloneFunc(){
                                                    if(cloned){return;} cloned = true;
                                                    if(event[system.super.keys.alt]){
                                                        for(var a = 0; a < selectedNotes.length; a++){
                                                            var temp = noteRegistry.getNote(parseInt(selectedNotes[a].id));
                                                            makeNote(temp.line, temp.position, temp.length, temp.strength);
                                                        }
                                                    }
                                                }
                        
                                            //block movement
                                                var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                                system.utility.workspace.mouseInteractionHandler(
                                                    function(event){//move
                                                        cloneFunc(); //clone that block
                        
                                                        var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                                        var diff = {
                                                            line: livePosition.line - initialPosition.line,
                                                            position: livePosition.position - initialPosition.position,
                                                        };
                                
                                                        for(var a = 0; a < activeBlocks.length; a++){
                                                            noteRegistry.update(activeBlocks[a].id, {
                                                                line:activeBlocks[a].starting.line+diff.line,
                                                                position:activeBlocks[a].starting.position+diff.position,
                                                            });
                                
                                                            var temp = noteRegistry.getNote(activeBlocks[a].id);
                                
                                                            activeBlocks[a].block.line( temp.line );
                                                            activeBlocks[a].block.position( temp.position );
                                                        }
                                                    },
                                                );
                                        };
                                        newNoteBlock.leftHandle.onmousedown = function(event){
                                            //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                                                if(!event.shiftKey && !newNoteBlock.selected()){
                                                    while(selectedNotes.length > 0){
                                                        selectedNotes[0].deselect();
                                                    }
                                                }
                                            
                                            //select this block
                                                newNoteBlock.select(true);
                        
                                            //gather data for all the blocks that we're about to affect
                                                var activeBlocks = [];
                                                for(var a = 0; a < selectedNotes.length; a++){
                                                    activeBlocks.push({
                                                        id: parseInt(selectedNotes[a].id),
                                                        block: selectedNotes[a],
                                                        starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                                                    });
                                                }
                                            
                                            //perform block length adjustment 
                                                var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                                system.utility.workspace.mouseInteractionHandler(
                                                    function(event){
                                                        var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                                        var diff = {position: initialPosition.position-livePosition.position};
                                
                                                        for(var a = 0; a < activeBlocks.length; a++){
                                                            if( activeBlocks[a].starting.position-diff.position < 0 ){ continue; } //this stops a block from getting longer, when it is unable to move any further to the left
                                                            
                                                            noteRegistry.update(activeBlocks[a].id, {
                                                                length: activeBlocks[a].starting.length+diff.position,
                                                                position: activeBlocks[a].starting.position-diff.position,
                                                            });
                                                            var temp = noteRegistry.getNote(activeBlocks[a].id);
                                                            activeBlocks[a].block.position( temp.position );
                                                            activeBlocks[a].block.length( temp.length );
                                                        }
                                                    }
                                                );
                                        };
                                        newNoteBlock.rightHandle.onmousedown = function(event){
                                            //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                                                if(!event.shiftKey && !newNoteBlock.selected()){
                                                    while(selectedNotes.length > 0){
                                                        selectedNotes[0].deselect();
                                                    }
                                                }
                                            
                                            //select this block
                                                newNoteBlock.select(true);
                        
                                            //gather data for all the blocks that we're about to affect
                                                var activeBlocks = [];
                                                for(var a = 0; a < selectedNotes.length; a++){
                                                    activeBlocks.push({
                                                        id: parseInt(selectedNotes[a].id),
                                                        block: selectedNotes[a],
                                                        starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                                                    });
                                                }
                        
                                            //perform block length adjustment 
                                                var initialPosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                                system.utility.workspace.mouseInteractionHandler(
                                                    function(event){
                                                        var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                                        var diff = {position: livePosition.position - initialPosition.position};
                                
                                                        for(var a = 0; a < activeBlocks.length; a++){
                                                            noteRegistry.update(activeBlocks[a].id, {length: activeBlocks[a].starting.length+diff.position});
                                                            var temp = noteRegistry.getNote(activeBlocks[a].id);
                                                            activeBlocks[a].block.position( temp.position );
                                                            activeBlocks[a].block.length( temp.length );
                                                        }
                                                    }
                                                );
                                        };
                        
                                    return {id:newID, noteBlock:newNoteBlock};
                                }
                                function makePlayhead(){
                                    var newPlayhead = part.builder('g','playhead',{});
                                    workarea.appendChild(newPlayhead);
                                    newPlayhead.onmousedown = function(){
                                        playhead.held = true;
                                        system.utility.workspace.mouseInteractionHandler(
                                            function(event){//move
                                                var livePosition = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                                obj.playheadPosition(livePosition.position);
                                            },
                                            function(){playhead.held = false;}
                                        );
                                    };
                        
                                    newPlayhead.main = part.builder('line','main',{
                                        x1:0, y1:0,
                                        x2:0, y2:totalSize.height,
                                        style:playheadStyle + 'stroke-width:'+playhead.width+';'
                                    });
                                    newPlayhead.appendChild(newPlayhead.main);
                        
                                    newPlayhead.invisibleHandle = part.builder('line','invisibleHandle',{
                                        x1:0, y1:0, x2:0, y2:totalSize.height,
                                        style:'stroke:rgba(0,0,0,0); cursor: col-resize; stroke-width:'+playhead.width*playhead.invisibleHandleMux+';'
                                    });
                                    newPlayhead.appendChild(newPlayhead.invisibleHandle);
                                }
                        
                            //elements
                                //main
                                    var obj = part.builder('g',id,{x:x, y:y, r:angle});
                                //static backing
                                    var backing = part.builder('rect','backing',{width:width, height:height, style:backingStyle});
                                    obj.appendChild(backing);
                                //viewport (for clipping the workarea)
                                    var viewport = part.builder('g','viewport',{});
                                    viewport.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
                                    obj.appendChild(viewport);
                                //workarea
                                    var workarea = part.builder('g','workarea',{});
                                    viewport.appendChild(workarea);
                                    workarea.onkeydown = function(event){
                                        if(event.key == 'Delete' || event.key == 'Backspace'){
                                            //delete all selected notes
                                            while(selectedNotes.length > 0){
                                                selectedNotes[0].delete();
                                            }
                                            return true;
                                        }
                                    };
                                    //moveable background
                                        var backgroundDrawArea = part.builder('g','backgroundDrawArea',{});
                                        workarea.appendChild(backgroundDrawArea);
                                        drawBackground();
                                    //interaction pane
                                        var interactionPlane = part.builder('rect','interactionPlane',{width:totalSize.width, height:totalSize.height, style:'fill:rgba(0,0,0,0);'});
                                        workarea.appendChild(interactionPlane);
                                        interactionPlane.onmousedown = function(event){
                        
                                            if(event.shiftKey){ //click-n-drag group select
                                                var initialPositionData = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                                var livePositionData = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                                
                                                var selectionArea = part.builder('rect','selectionArea',{
                                                    x:initialPositionData.x*width, y:initialPositionData.y*height,
                                                    width:0, height:0,
                                                    style:selectionAreaStyle,
                                                });
                                                obj.appendChild(selectionArea);
                            
                                                system.utility.workspace.mouseInteractionHandler(
                                                    function(event){//move
                                                        //live re-size the selection box
                                                            livePositionData = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                                            var diff = {x:livePositionData.x-initialPositionData.x, y:livePositionData.y-initialPositionData.y};
                                    
                                                            var transform = {};
                                                            if(diff.x < 0){ 
                                                                selectionArea.width.baseVal.value = -diff.x*width;
                                                                transform.x = initialPositionData.x+diff.x;
                                                            }else{ 
                                                                selectionArea.width.baseVal.value = diff.x*width;
                                                                transform.x = initialPositionData.x;
                                                            }
                                                            if(diff.y < 0){ 
                                                                selectionArea.height.baseVal.value = -diff.y*height;
                                                                transform.y = initialPositionData.y+diff.y;
                                                            }else{ 
                                                                selectionArea.height.baseVal.value = diff.y*height;
                                                                transform.y = initialPositionData.y;
                                                            }
                                    
                                                            system.utility.element.setTransform_XYonly(selectionArea, transform.x*width, transform.y*height);
                                                    },
                                                    function(){//stop
                                                        //remove selection box
                                                            selectionArea.remove();
                        
                                                        //gather the corner points
                                                            var finishingPositionData = {
                                                                a:visible2coordinates(initialPositionData),
                                                                b:visible2coordinates(livePositionData),
                                                            };
                                                            finishingPositionData.a.x *= totalSize.width;  finishingPositionData.b.y *= totalSize.height;
                                                            finishingPositionData.b.x *= totalSize.width;  finishingPositionData.a.y *= totalSize.height;
                        
                                                            var selectionBox = [{},{}];
                                                            if( finishingPositionData.a.x < finishingPositionData.b.x ){
                                                                selectionBox[0].x = finishingPositionData.a.x;
                                                                selectionBox[1].x = finishingPositionData.b.x;
                                                            }else{
                                                                selectionBox[0].x = finishingPositionData.b.x;
                                                                selectionBox[1].x = finishingPositionData.a.x;
                                                            }
                                                            if( finishingPositionData.a.y < finishingPositionData.b.y ){
                                                                selectionBox[0].y = finishingPositionData.a.y;
                                                                selectionBox[1].y = finishingPositionData.b.y;
                                                            }else{
                                                                selectionBox[0].y = finishingPositionData.b.y;
                                                                selectionBox[1].y = finishingPositionData.a.y;
                                                            }
                        
                                                        //deselect everything
                                                            while(selectedNotes.length > 0){
                                                                selectedNotes[0].deselect();
                                                            }
                        
                                                        //select the notes that overlap with the selection area
                                                            var noteBlocks = notePane.getElementsByTagName('g');
                                                            for(var a = 0; a < noteBlocks.length; a++){
                                                                var temp = noteRegistry.getNote(parseInt(noteBlocks[a].id));
                                                                var block = [
                                                                        {x:temp.position*(totalSize.width/xCount), y:temp.line*(totalSize.height/yCount)},
                                                                        {x:(temp.position+temp.length)*(totalSize.width/xCount), y:(temp.line+1)*(totalSize.height/yCount)},
                                                                    ];    
                                                                if( system.utility.math.detectOverlap(selectionBox,block,selectionBox,block) ){ noteBlocks[a].select(true); }
                                                            }
                                                    }
                                                );
                                            }else if(event[system.super.keys.alt]){ //create note
                                                //deselect everything
                                                    while(selectedNotes.length > 0){
                                                        selectedNotes[0].deselect();
                                                    }
                                                
                                                //get the current location and make a new note there (with length 0)
                                                    var position = coordinates2lineposition(system.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                                    var temp = makeNote(position.line,position.position,0);
                            
                                                //select this new block, and direct the mouse-down to the right handle (for user lengthening)
                                                    temp.noteBlock.select();
                                                    temp.noteBlock.rightHandle.onmousedown(event);
                                            }else if(system.keyboard.pressedKeys.Space){//panning
                                                var initialPosition = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                                var old_viewposition = {x:viewposition.x, y:viewposition.y};
                                                system.utility.workspace.mouseInteractionHandler(
                                                    function(event){
                                                        var livePosition = system.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                                        var diffPosition = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};
                                                        setViewposition(
                                                            old_viewposition.x + (diffPosition.x*(xCount*zoomLevel_x))/(xCount-(xCount*zoomLevel_x)),
                                                            old_viewposition.y + (diffPosition.y*(yCount*zoomLevel_y))/(yCount-(yCount*zoomLevel_y)),
                                                        );
                                                    },
                                                    function(event){}
                                                );
                                            }else{ //elsewhere click
                                                //deselect everything
                                                    while(selectedNotes.length > 0){
                                                        selectedNotes[0].deselect();
                                                    }
                                            }
                        
                                        };
                                    //note block area
                                        var notePane = part.builder('g','notePane',{});
                                        workarea.appendChild(notePane);
                        
                            //controls
                                //background
                                obj.glowHorizontal = function(state,start,end){
                                    if(end == undefined){end = start+1;}
                        
                                    for(var a = start; a < end; a++){
                                        system.utility.element.setStyle(
                                            backgroundDrawArea.children['strip_horizontal_'+a],
                                            state ? horizontalStripStyle_glow : horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]]
                                        );
                                    }
                                };
                                obj.glowVertical = function(state,start,end){
                                    if(end == undefined){end = start+1;}
                        
                                    for(var a = start; a < end; a++){
                                        system.utility.element.setStyle(
                                            backgroundDrawArea.children['strip_vertical_'+a],
                                            state ? verticalStripStyle_glow : verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]]
                                        );
                                    }
                                };
                        
                                //step
                                obj.step = function(a){
                                    if(a == undefined){return step;}
                                    step = a;
                                };
                        
                                //viewport position
                                obj.viewposition = setViewposition;
                                obj.viewArea = setViewArea;
                        
                                //note interaction
                                obj.export = function(){return noteRegistry.export();};
                                obj.import = function(data){noteRegistry.import(data);};
                                obj.eventsBetween = function(start,end){ return noteRegistry.eventsBetween(start,end); };
                                obj.getAllNotes = function(){return noteRegistry.getAllNotes(); };
                                obj.addNote = function(line, position, length, strength=1){ makeNote(line, position, length, strength); };
                                obj.addNotes = function(data){ for(var a = 0; a < data.length; a++){this.addNote(data[a].line, data[a].position, data[a].length, data[a].strength);} };
                        
                                //loop
                                obj.loopActive = function(a){
                                    if(a == undefined){return loop.active;}
                                    loop.active = a;
                        
                                    obj.glowVertical(false,0,xCount);
                                    if( loop.active ){
                                        obj.glowVertical(true, 
                                            loop.period.start < 0 ? 0 : loop.period.start, 
                                            loop.period.end > xCount ? xCount : loop.period.end,
                                        );
                                    }
                                };
                                obj.loopPeriod = function(start,end){
                                    if(start == undefined || end == undefined){return loop.period;}
                                    if(start > end || start < 0 || end < 0){return;}
                        
                                    loop.period = {start:start, end:end};
                        
                                    if( loop.active ){
                                        obj.glowVertical(false,0,xCount);
                                        obj.glowVertical(true,
                                            start < 0 ? 0 : start, 
                                            end > xCount ? xCount : end,
                                        );
                                    }
                                };
                        
                                //playhead
                                obj.automove = function(a){
                                    if(a == undefined){return playhead.automoveViewposition;}
                                    playhead.automoveViewposition = a;
                                };
                                obj.playheadPosition = function(val,stopActive=true){
                                    if(val == undefined){return playhead.position;}
                        
                                    playhead.position = val;
                        
                                    //send stop events for all active notes
                                        if(stopActive){
                                            var events = [];
                                            for(var a = 0; a < activeNotes.length; a++){
                                                var tmp = noteRegistry.getNote(activeNotes[a]); if(tmp == null){continue;}
                                                events.unshift( {noteID:activeNotes[a], line:tmp.line, position:loop.period.start, strength:0} );
                                            }
                                            activeNotes = [];
                                            if(obj.event && events.length > 0){obj.event(events);}
                                        }
                        
                                    //reposition graphical playhead
                                        if(playhead.position < 0 || playhead.position > xCount){
                                            //outside vilible bounds, so remove
                                            if( workarea.children.playhead ){ workarea.children.playhead.remove(); }
                                        }else{ 
                                            //within vilible bounds, so either create or adjust
                                            if( !workarea.children.playhead ){ makePlayhead(); }
                                            system.utility.element.setTransform_XYonly(workarea.children.playhead, playhead.position*(totalSize.width/xCount), 0);
                                            //if the new position is beyond the view in the viewport, adjust the viewport (putting the playhead on the leftmost side)
                                            //(assuming automoveViewposition is set)
                                            if(playhead.automoveViewposition){
                                                var remainderSpace = xCount-(xCount*zoomLevel_x);
                                                if( playhead.position < Math.floor(viewposition.x*remainderSpace)   || 
                                                    playhead.position > Math.floor(viewposition.x*remainderSpace) + (xCount*zoomLevel_x)  
                                                ){ obj.viewposition( (playhead.position > remainderSpace ? remainderSpace : playhead.position)/remainderSpace ); }
                                            }
                                        }
                                };
                                obj.progress = function(){
                                    //if the playhead is being held, just bail completly
                                        if(playhead.held){return;}
                                        
                                    //if there's no playhead; create one and set its position to 0
                                        if(playhead.position < 0){makePlayhead(); playhead.position = 0; }
                        
                                    //gather together all the current events
                                        var events = obj.eventsBetween(playhead.position, playhead.position+step);
                        
                                    //upon loop; any notes that are still active are to be ended
                                    //(so create end events for them, and push those into the current events list)
                                        if(loop.active && playhead.position == loop.period.start){
                                            for(var a = 0; a < activeNotes.length; a++){
                                                var tmp = noteRegistry.getNote(activeNotes[a]); if(tmp == null){continue;}
                                                events.unshift( {noteID:activeNotes[a], line:tmp.line, position:loop.period.start, strength:0} );
                                            }
                                            activeNotes = [];
                                        }
                        
                                    //add newly started notes to - and remove newly finished notes from - 'activeNotes'
                                        for(var a = 0; a < events.length; a++){
                                            var index = activeNotes.indexOf(events[a].noteID);
                                            if(index != -1 && events[a].strength == 0){
                                                activeNotes.splice(index);
                                            }else{
                                                if( events[a].strength > 0 ){
                                                    activeNotes.push(events[a].noteID);
                                                }
                                            }
                                        }
                        
                                    //progress position
                                        if( loop.active && (playhead.position+step == loop.period.end) ){
                                            playhead.position = loop.period.start;
                                        }else{
                                            playhead.position = playhead.position+step;
                                        }
                        
                                    //update graphical playhead
                                        obj.playheadPosition(playhead.position,false);
                        
                                    //perform event callback
                                        if(obj.event && events.length > 0){obj.event(events);}
                                };
                                
                            //callbacks
                                obj.onpan = function(data){};
                                obj.onchangeviewarea = function(data){};
                                obj.event = function(events){};
                        
                            return obj;
                        };
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        this.sequencer.noteBlock = function(
                            id, unit_x, unit_y,
                            line, position, length, strength=1, glow=false, 
                            bodyStyle=[
                                'fill:rgba(138,138,138,0.6);stroke:rgba(175,175,175,0.8);stroke-width:0.5;',
                                'fill:rgba(130,199,208,0.6);stroke:rgba(130,199,208,0.8);stroke-width:0.5;',
                                'fill:rgba(129,209,173,0.6);stroke:rgba(129,209,173,0.8);stroke-width:0.5;',
                                'fill:rgba(234,238,110,0.6);stroke:rgba(234,238,110,0.8);stroke-width:0.5;',
                                'fill:rgba(249,178,103,0.6);stroke:rgba(249,178,103,0.8);stroke-width:0.5;',
                                'fill:rgba(255, 69, 69,0.6);stroke:rgba(255, 69, 69,0.8);stroke-width:0.5;',
                            ],
                            bodyGlowStyle=[
                                'fill:rgba(138,138,138,0.8);stroke:rgba(175,175,175,1);stroke-width:0.5;',
                                'fill:rgba(130,199,208,0.8);stroke:rgba(130,199,208,1);stroke-width:0.5;',
                                'fill:rgba(129,209,173,0.8);stroke:rgba(129,209,173,1);stroke-width:0.5;',
                                'fill:rgba(234,238,110,0.8);stroke:rgba(234,238,110,1);stroke-width:0.5;',
                                'fill:rgba(249,178,103,0.8);stroke:rgba(249,178,103,1);stroke-width:0.5;',
                                'fill:rgba(255, 69, 69,0.8);stroke:rgba(255, 69, 69,1);stroke-width:0.5;',
                            ],
                            handleStyle='fill:rgba(255,0,255,0);cursor:col-resize;',
                            handleWidth=5,
                        ){
                            var selected = false;
                            var minLength = handleWidth/4;
                            var currentStyles = {
                                body:getBlendedColour(bodyStyle,strength),
                                glow:getBlendedColour(bodyGlowStyle,strength),
                            };
                            
                            //elements
                                var obj = part.builder('g',id,{y:line*unit_y, x:position*unit_x});
                                obj.body = part.builder('rect','body',{width:length*unit_x, height:unit_y, style:currentStyles.body});
                                obj.leftHandle = part.builder('rect','leftHandle',{x:-handleWidth/2, width:handleWidth, height:unit_y,style:handleStyle});
                                obj.rightHandle = part.builder('rect','rightHandle',{x:length*unit_x-handleWidth/2, width:handleWidth, height:unit_y, style:handleStyle});
                                obj.append(obj.body);
                                obj.append(obj.leftHandle);
                                obj.append(obj.rightHandle);
                        
                            //internal functions
                                function updateHeight(){
                                    obj.body.height.baseVal.value = unit_y;
                                    obj.leftHandle.height.baseVal.value = unit_y;
                                    obj.rightHandle.height.baseVal.value = unit_y;
                                }
                                function updateLength(){
                                    obj.body.width.baseVal.value = length*unit_x;
                                    system.utility.element.setTransform_XYonly(obj.rightHandle, length*unit_x-handleWidth/2, 0);
                                }
                                function updateLineAndPosition(){ system.utility.element.setTransform_XYonly(obj, position*unit_x, line*unit_y); }
                                function updateLine(){ system.utility.element.setTransform_XYonly(obj, undefined, line*unit_y); }
                                function updatePosition(){ system.utility.element.setTransform_XYonly(obj, position*unit_x, undefined); }
                                function getBlendedColour(swatch,ratio){
                                    //extract stlyes and get an output template
                                        var tempSwatch = [];
                                        for(var a = 0; a < swatch.length; a++){
                                            tempSwatch[a] = system.utility.element.styleExtractor(swatch[a]);
                                        }
                                        var outputStyle = tempSwatch[0];
                        
                                    //if there's a fill attribute; blend it and add it to the template
                                        if( tempSwatch[0].hasOwnProperty('fill') ){
                                            outputStyle.fill = system.utility.misc.multiBlendColours(tempSwatch.map(a => a.fill),ratio);
                                        }
                        
                                    //if there's a stroke attribute; blend it and add it to the template
                                        if( tempSwatch[0].hasOwnProperty('stroke') ){
                                            outputStyle.stroke = system.utility.misc.multiBlendColours(tempSwatch.map(a => a.stroke),ratio);
                                        }
                        
                                    //pack up the template and return
                                        return system.utility.element.stylePacker(outputStyle);
                                }
                        
                            //controls
                                obj.unit = function(x,y){
                                    if(x == undefined && y == undefined){return {x:unit_x,y:unit_y};}
                                    //(awkard bid for speed)
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
                                        updateHeight();
                                        updateLength();
                                        updateLineAndPosition();
                                    }
                                };
                                obj.line = function(a){
                                    if(a == undefined){return line;}
                                    line = a;
                                    updateLine();
                                };
                                obj.position = function(a){
                                    if(a == undefined){return position;}
                                    position = a;
                                    updatePosition();
                                };
                                obj.length = function(a){
                                    if(a == undefined){return length;}
                                    length = a < (minLength/unit_x) ? (minLength/unit_x) : a;
                                    updateLength();
                                };
                                obj.strength = function(a){
                                    if(a == undefined){return strength;}
                                    a = a > 1 ? 1 : a; a = a < 0 ? 0 : a;
                                    strength = a;
                                    currentStyles = {
                                        body:getBlendedColour(bodyStyle,strength),
                                        glow:getBlendedColour(bodyGlowStyle,strength),
                                    };
                                    obj.glow(glow);
                                };
                                obj.glow = function(a){
                                    if(a == undefined){return glow;}
                                    glow = a;
                                    if(glow){ system.utility.element.setStyle(obj.body, currentStyles.glow); }
                                    else{     system.utility.element.setStyle(obj.body, currentStyles.body); }
                                };
                                obj.selected = function(a){
                                    if(a == undefined){return selected;}
                                    selected = a;
                                };
                        
                            return obj;
                        };
                        this.list = function(
                            id='list', 
                            x, y, width, height, angle=0,
                            list=[
                                {text:'item1',  function:function(){console.log('item1 function');}},  {text:'item2',  function:function(){console.log('item2 function');}},
                                {text:'item3',  function:function(){console.log('item3 function');}},  {text:'item4',  function:function(){console.log('item4 function');}},
                                'space','break','space',
                                {text:'item5',  function:function(){console.log('item5 function');}},  {text:'item6',  function:function(){console.log('item6 function');}},
                                {text:'item7',  function:function(){console.log('item7 function');}},  {text:'item8',  function:function(){console.log('item8 function');}},
                                {text:'item9',  function:function(){console.log('item9 function');}},  {text:'item10', function:function(){console.log('item10 function');}},
                                {text:'item11', function:function(){console.log('item11 function');}}, {text:'item12', function:function(){console.log('item12 function');}},
                                {text:'item13', function:function(){console.log('item13 function');}}, {text:'item14', function:function(){console.log('item14 function');}},
                                {text:'item15', function:function(){console.log('item15 function');}}, {text:'item16', function:function(){console.log('item16 function');}},
                                {text:'item17', function:function(){console.log('item17 function');}}, {text:'item18', function:function(){console.log('item18 function');}},
                                {text:'item19', function:function(){console.log('item19 function');}}, {text:'item20', function:function(){console.log('item20 function');}},
                                {text:'item21', function:function(){console.log('item21 function');}}, {text:'item22', function:function(){console.log('item22 function');}},
                                {text:'item23', function:function(){console.log('item23 function');}}, {text:'item24', function:function(){console.log('item24 function');}},
                                {text:'item25', function:function(){console.log('item25 function');}}, {text:'item26', function:function(){console.log('item26 function');}},
                                {text:'item27', function:function(){console.log('item27 function');}}, {text:'item28', function:function(){console.log('item28 function');}},
                                {text:'item29', function:function(){console.log('item29 function');}}, {text:'item30', function:function(){console.log('item30 function');}},
                                {text:'item31', function:function(){console.log('item31 function');}}, {text:'item32', function:function(){console.log('item32 function');}},
                            ],
                            selectable=true, multiSelect=true, hoverable=true, pressable=true, active=true,
                            itemHeightMux=0.1, itemSpacingMux=0.01, breakHeightMux=0.0025, breakWidthMux=0.9, spacingHeightMux=0.005,
                            itemTextVerticalOffsetMux=0.5, itemtextHorizontalOffsetMux=0.05,
                            listItemTextStyle='fill:rgba(0,0,0,1); font-size:5; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none;',
                            backingStyle='fill:rgba(230,230,230,1)',
                            breakStyle='fill:rgba(195,195,195,1)',
                            listItemBackgroundStyle_off=                     'fill:rgba(180,180,180,1)',
                            listItemBackgroundStyle_up=                      'fill:rgba(220,220,220,1)',
                            listItemBackgroundStyle_press=                   'fill:rgba(230,230,230,1)',
                            listItemBackgroundStyle_select=                  'fill:rgba(200,200,200,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
                            listItemBackgroundStyle_select_press=            'fill:rgba(230,230,230,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
                            listItemBackgroundStyle_glow=                    'fill:rgba(230,230,210,1)',
                            listItemBackgroundStyle_glow_press=              'fill:rgba(250,250,250,1)',
                            listItemBackgroundStyle_glow_select=             'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
                            listItemBackgroundStyle_glow_select_press=       'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
                            listItemBackgroundStyle_hover=                   'fill:rgba(230,230,230,1)',
                            listItemBackgroundStyle_hover_press=             'fill:rgba(240,240,240,1)',
                            listItemBackgroundStyle_hover_select=            'fill:rgba(220,220,220,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
                            listItemBackgroundStyle_hover_select_press=      'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
                            listItemBackgroundStyle_hover_glow=              'fill:rgba(240,240,240,1)',
                            listItemBackgroundStyle_hover_glow_press=        'fill:rgba(250,250,250,1)',
                            listItemBackgroundStyle_hover_glow_select=       'fill:rgba(240,240,240,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
                            listItemBackgroundStyle_hover_glow_select_press= 'fill:rgba(250,250,250,1); stroke:rgba(120,120,120,1); stroke-width:0.5;',
                        ){
                            //state
                                var itemArray = [];
                                var selectedItems = [];
                                var lastNonShiftClicked = 0;
                                var position = 0;
                                var calculatedListHeight;
                        
                        
                            //main object
                                var object = part.builder('g',id,{x:x, y:y, r:angle});
                        
                            //background
                                var rect = part.builder('rect',null,{width:width, height:height, style:backingStyle});
                                object.appendChild(rect);
                        
                            //viewport (for clipping the visible area)
                                var viewport = part.builder('g','viewport',{});
                                viewport.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
                                object.appendChild(viewport);
                        
                            //main list
                                var mainList = part.builder('g','mainList');
                                viewport.appendChild(mainList);
                        
                                function refreshList(){
                                    //clean out all values
                                        itemArray = [];
                                        mainList.innerHTML = '';
                                        selectedItems = [];
                                        position = 0;
                                        lastNonShiftClicked = 0;
                        
                                    //populate list
                                        var accumulativeHeight = 0;
                                        for(var a = 0; a < list.length; a++){
                                            if( list[a] == 'break' ){
                                                //break
                                                var temp = part.builder( 'rect', a, {
                                                    x:width*(1-breakWidthMux)*0.5, y:accumulativeHeight,
                                                    width:width*breakWidthMux, height:height*breakHeightMux,
                                                    style:breakStyle
                                                });
                        
                                                accumulativeHeight += height*(breakHeightMux+itemSpacingMux);
                                            }else if( list[a] == 'space' ){
                                                //spacing
                                                var temp = part.builder( 'rect', a, {
                                                    x:0, y:accumulativeHeight,
                                                    width:width, height:height*spacingHeightMux,
                                                    style:backingStyle
                                                });
                        
                                                accumulativeHeight += height*(spacingHeightMux+itemSpacingMux);
                                            }else{
                                                //regular item
                                                var temp = part.builder( 'button_rect', a, {
                                                    x:0, y:accumulativeHeight,
                                                    width:width, height:height*itemHeightMux, 
                                                    text_centre: (list[a].text?list[a].text:list[a].text_centre),
                                                    text_left: list[a].text_left, text_right:list[a].text_right,
                                                    textVerticalOffset:itemTextVerticalOffsetMux, textHorizontalOffsetMux:itemtextHorizontalOffsetMux,
                                                    active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,
                                                    style:{
                                                        text:listItemTextStyle,
                                                        off:listItemBackgroundStyle_off,
                                                        up:listItemBackgroundStyle_up,                               press:listItemBackgroundStyle_press,
                                                        select:listItemBackgroundStyle_select,                       select_press:listItemBackgroundStyle_select_press,
                                                        glow:listItemBackgroundStyle_glow,                           glow_press:listItemBackgroundStyle_glow_press,
                                                        glow_select:listItemBackgroundStyle_glow_select,             glow_select_press:listItemBackgroundStyle_glow_select_press,
                                                        hover:listItemBackgroundStyle_hover,                         hover_press:listItemBackgroundStyle_hover_press,
                                                        hover_select:listItemBackgroundStyle_hover_select,           hover_select_press:listItemBackgroundStyle_hover_select_press,
                                                        hover_glow:listItemBackgroundStyle_hover_glow,               hover_glow_press:listItemBackgroundStyle_hover_glow_press,
                                                        hover_glow_select:listItemBackgroundStyle_hover_glow_select, hover_glow_select_press:listItemBackgroundStyle_hover_glow_select_press,
                                                    }
                                                });
                        
                                                accumulativeHeight += height*(itemHeightMux+itemSpacingMux);
                        
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
                                            }
                        
                                            itemArray.push( temp );
                                            mainList.appendChild( temp );
                                        }
                        
                                    return accumulativeHeight - height*itemSpacingMux;
                                }
                        
                                calculatedListHeight = refreshList();
                        
                        
                        
                            //interaction
                                object.onwheel = function(event){
                                    var move = system.mouse.wheelInterpreter( event.deltaY );
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
                                    
                                    system.utility.element.setTransform_XYonly( mainList, undefined, -a*movementSpace );
                        
                                    var y_offSet = movementSpace * a;
                                    var bottom = y_offSet+height;
                        
                                    viewport.setAttribute('clip-path','polygon(0px '+y_offSet+'px, '+width+'px '+y_offSet+'px, '+width+'px '+bottom+'px, 0px '+bottom+'px)');
                        
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
                                                itemArray[ selectedItems[0] ].select(false,undefined,false);
                                                selectedItems.shift();
                                            }
                        
                                            //select current item
                                            selectedItems.push(a);
                        
                                            //do not update the item itself, in the case that it was the item that sent this command
                                            //(which would cause a little loop)
                                            if(update){ itemArray[a].select(true,undefined,false); }
                                        //where we want to deselect an item that is selected
                                        }else if(!state && selectedItems.includes(a)){
                                            //deselect current item
                                            selectedItems.splice( selectedItems.indexOf(a), 1 );
                        
                                            //do not update the item itself, in the case that it was the item that sent this command
                                            //(which would cause a little loop)
                                            if(update){ itemArray[a].select(false,undefined,false); }
                                        }
                        
                                    //where multi selection is allowed
                                    }else{
                                        //determind if range-selection is to be done
                                        if( event != undefined && event.shiftKey ){
                                            var min = Math.min(lastNonShiftClicked, a); var max = Math.max(lastNonShiftClicked, a);
                        
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
                                    object.onenter = function(listItemNumber){ /*console.log('onenter:',listItemNumber);*/ };
                                    object.onleave = function(listItemNumber){ /*console.log('onleave:',listItemNumber);*/ };
                                    object.onpress = function(listItemNumber){ /*console.log('onpress:',listItemNumber);*/ };
                                    object.ondblpress = function(listItemNumber){ /*console.log('ondblpress:',listItemNumber);*/ };
                                    object.onrelease = function(listItemNumber){ /*console.log('onrelease:',listItemNumber);*/ };
                                    object.onselection = function(listItemNumbers){ /*console.log('onselection:',listItemNumbers);*/ };
                                    object.onpositionchange = function(a){};
                                
                            return object;
                        };
                        this.grapher_waveWorkspace = function(
                            id='grapher_waveWorkspace',
                            x, y, width, height, angle=0, graphType='Canvas', selectNeedle=true, selectionArea=true,
                            foregroundStyles=['fill:rgba(240, 240, 240, 1);','fill:rgba(255, 231, 114, 1);'],
                            foregroundTextStyles=['fill:rgba(0,255,255,1); font-size:3; font-family:Helvetica;'],
                            middlegroundStyle=['stroke:rgba(0,255,0,1); stroke-width:0.1; stroke-linecap:round;'],
                            middlegroundTextStyle=['fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;'],
                            backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
                            backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
                            backingStyle='fill:rgba(50,50,50,1)',
                        ){
                            var needleWidth = 1/4;
                        
                            //elements
                                //main
                                    var object = part.builder('g',id,{x:x, y:y});
                                //main graph
                                    var graph = part.builder('grapher'+graphType, 'graph', {
                                        x:0, y:0, width:width, height:height,
                                        style:{
                                            foreground:middlegroundStyle, foregroundText:middlegroundTextStyle, 
                                            background:backgroundStyle, backgroundText:backgroundTextStyle, 
                                            backing:backingStyle
                                        }
                                    });
                                    
                                    object.append(graph);
                                //needle overlay
                                    var overlay = part.builder('needleOverlay', 'overlay', {
                                        x:0, y:0, width:width, height:height, selectNeedle:selectNeedle, selectionArea:selectionArea,
                                        needleStyles:foregroundStyles,
                                    });
                                    object.append(overlay);
                        
                            //controls
                                object.select = overlay.select;
                                object.area = overlay.area;
                                object.draw = graph.draw;
                                object.foregroundLineThickness = graph.foregroundLineThickness;
                                object.drawBackground = graph.drawBackground;
                                object.area = overlay.area;
                                object._test = graph._test;
                                object.genericNeedle = overlay.genericNeedle;
                        
                            //callbacks
                                object.onchange = function(needle,value){};
                                overlay.onchange = function(needle,value){ if(object.onchange){object.onchange(needle,value);} };
                                object.onrelease = function(needle,value){};
                                overlay.onrelease = function(needle,value){ if(object.onrelease){object.onrelease(needle,value);} };
                                object.selectionAreaToggle = function(toggle){};
                                overlay.selectionAreaToggle = function(toggle){ if(object.selectionAreaToggle){object.selectionAreaToggle(toggle);} };
                        
                            //setup
                                object.drawBackground();
                        
                            return object;
                        };
                        this.dial_discrete = function(
                            id='dial_discrete',
                            x, y, r,
                            optionCount=5,
                            startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,
                            handleStyle = 'fill:rgba(175,175,175,1)',
                            slotStyle = 'fill:rgba(50,50,50,1)',
                            needleStyle = 'fill:rgba(250,100,100,1)',
                            handleStyle_glow = 'fill:rgba(175,175,175,1)',
                            slotStyle_glow = 'fill:rgba(254,255,219,1)',
                            needleStyle_glow = 'fill:rgba(250,100,100,1)',
                            arcDistance=1.35,
                            outerArcStyle='fill:none; stroke:none;',
                            outerArcStyle_glow='fill:none; stroke:none;',
                        ){
                            // elements
                            var object = part.builder('g',id,{x:x, y:y});
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
                                        var temp = system.utility.math.polar2cartesian(startAngle+a*(maxAngle/points),r*arcDistance);
                                        arcPath.push( temp );
                                        var temp = system.utility.math.polar2cartesian(startAngle+(a+0.5)*(maxAngle/points),pushDistance*r*arcDistance);
                                        arcPath.push( temp );
                                    }
                                    var temp = system.utility.math.polar2cartesian(startAngle+maxAngle,r*arcDistance);
                                    arcPath.push( temp );
                                    var outerArc = part.builder('path','arc',{path:arcPath, lineType:'Q', style:outerArcStyle});
                                    object.appendChild(outerArc);
                        
                                //slot
                                    var slot = part.builder('circle','slot',{r:r*1.1, style:slotStyle});
                                        object.appendChild(slot);
                        
                                //handle
                                    var handle = part.builder('circle','slot',{r:r, style:handleStyle});
                                        object.appendChild(handle);
                        
                                //needle
                                    var needleWidth = r/5;
                                    var needleLength = r;
                                    var needle = part.builder('rect','needle',{height:needleWidth, width:needleLength, style:needleStyle});
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
                                };
                                object.glow = function(state){
                                    if(state){
                                        system.utility.element.setStyle(outerArc,outerArcStyle_glow);
                                        system.utility.element.setStyle(slot,slotStyle_glow);
                                        system.utility.element.setStyle(handle,handleStyle_glow);
                                        system.utility.element.setStyle(needle,needleStyle_glow);
                                    }else{
                                        system.utility.element.setStyle(outerArc,outerArcStyle);
                                        system.utility.element.setStyle(slot,slotStyle);
                                        system.utility.element.setStyle(handle,handleStyle);
                                        system.utility.element.setStyle(needle,needleStyle);
                                    }
                                };
                          
                        
                            //callback
                                object.onchange = function(){};
                                object.onrelease = function(){};
                        
                            
                            //mouse interaction
                                object.ondblclick = function(){ this.select( Math.floor(optionCount/2) ); /*this._set(0.5);*/ };
                                object.onwheel = function(event){
                                    var move = system.mouse.wheelInterpreter( event.deltaY );
                                    var globalScale = system.utility.workspace.getGlobalScale(object);
                        
                                    if(!object.onwheel.acc){object.onwheel.acc=0;}
                                    object.onwheel.acc += move/globalScale;
                                    if( Math.abs(object.onwheel.acc) >= 1 ){
                                        this.select( this.select()-1*Math.sign(object.onwheel.acc) );
                                        object.onwheel.acc = 0;
                                    }
                                };
                                object.onmousedown = function(event){
                                    system.svgElement.onmousemove_old = system.svgElement.onmousemove;
                                    system.svgElement.onmouseleave_old = system.svgElement.onmouseleave;
                                    system.svgElement.onmouseup_old = system.svgElement.onmouseup;
                        
                                    system.svgElement.tempRef = this;
                                    system.svgElement.tempRef._data.initialValue = this._get();
                                    system.svgElement.tempRef._data.initialY = event.y;
                                    system.svgElement.tempRef._data.mux = system.svgElement.tempRef._data.mux;
                                    system.svgElement.onmousemove = function(event){
                                        var mux = system.svgElement.tempRef._data.mux;
                                        var value = system.svgElement.tempRef._data.initialValue;
                                        var numerator = event.y-system.svgElement.tempRef._data.initialY;
                                        var divider = system.utility.workspace.getGlobalScale(object);
                        
                                        system.svgElement.tempRef.select(
                                            Math.round(
                                                (system.svgElement.tempRef._data.optionCount-1)*(value - numerator/(divider*mux))
                                            ) 
                                        );
                                    };
                                    system.svgElement.onmouseup = function(){
                                        this.tempRef.select(this.tempRef.select(),false);
                                        this.tempRef = null;
                                        
                                        system.svgElement.onmousemove = system.svgElement.onmousemove_old;
                                        system.svgElement.onmouseleave = system.svgElement.onmouseleave_old;
                                        system.svgElement.onmouseup = system.svgElement.onmouseup_old;
                        
                                        system.svgElement.onmousemove_old = null;
                                        system.svgElement.onmouseleave_old = null;
                                        system.svgElement.onmouseup_old = null;
                                    };
                                    system.svgElement.onmouseleave = system.svgElement.onmouseup;
                                    system.svgElement.onmousemove(event);
                                };
                        
                            //setup
                                object._set(0);
                                
                          return object;
                        };
                    };
                    this.dynamic = new function(){
                        this.cable = function(
                            id=null, 
                            x1=0, y1=0, x2=0, y2=0,
                            style='fill:none; stroke:rgb(255,0,0); stroke-width:4;',
                            activeStyle='fill:none; stroke:rgb(255,100,100); stroke-width:4;'
                        ){
                            //elements
                            var object = part.builder('g',id,{x:x1, y:y1});
                                object.points = [{x:x1,y:y1},{x:x2,y:y2}];
                                object.styles = {
                                    'normal':style,
                                    'active':activeStyle
                                };
                            var line = part.builder('path',null,{path:object.points, lineType:'L', style:style});
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
                            x, y, width, height, rotation=0, audioContext,
                            style='fill:rgba(255, 220, 220,1)'
                        ){
                            //elements
                            var object = part.builder('g',id,{x:x, y:y, r:rotation});
                                object._type = 'audio';
                                object._cable = null;
                                object._cableStyle = 'fill:none; stroke:rgb(242, 119, 84); stroke-width:4;';
                                object._cableActiveStyle = 'fill:none; stroke:rgb(242, 161, 138); stroke-width:4;';
                                object._boundary = {'width':width, 'height':height};
                                object._audioNode = audioContext.createAnalyser();
                                object._portType = type; if(type!=0&&type!=1){type=0;}
                            var rect = part.builder('rect','tab',{x:0, y:0, width:width, height:height,style:style});
                                object.appendChild(rect);
                        
                        
                            //network functions
                            object.onConnect = function(){};
                            object.onDisconnect = function(){};
                        
                        
                            //internal connections
                            object.out = function(){return this._audioNode;};
                            object.in = function(){return this._audioNode;};
                        
                            
                            //connecting and disconnecting
                            object.connectTo = function(foreignObject){
                                if(!system.super.enablCableDisconnectionConnection){return;}
                        
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
                                if(!system.super.enablCableDisconnectionConnection){return;}
                                
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
                                system.svgElement.tempRef = this;
                                system.svgElement.onmouseup = function(event){
                                    var destination = document.elementFromPoint(event.x, event.y).parentElement;
                                    system.svgElement.tempRef.connectTo(destination);
                                    system.svgElement.tempRef = null;
                                    this.onmouseup = null;
                                };
                            };
                            object.ondblclick = function(){
                                this.disconnect();
                            };
                        
                        
                            //cabling
                            object._add_cable = function(){
                                this._cable = part.builder('cable',null,{style:{unactive:this._cableStyle, active:this._cableActiveStyle}});
                                this.foreignNode._receive_cable(this._cable);
                                system.utility.workspace.getPane(this).appendChild(this._cable); // <-- should probably make prepend
                                this.draw();
                            };
                            object._receive_cable = function(_cable){
                                this._cable = _cable;
                            };
                            object._remove_cable = function(){
                                system.utility.workspace.getPane(this).removeChild(this._cable);
                                this.foreignNode._lose_cable();
                                this._cable = null;
                            };
                            object._lose_cable = function(){
                                this._cable = null;
                            };
                            object.draw = function(){
                                if( !object._cable ){return;}
                                
                                var t1 = system.utility.element.getCumulativeTransform(this);
                                var t2 = system.utility.element.getCumulativeTransform(this.foreignNode);
                        
                                this._cable.draw( 
                                    t1.x + this._boundary.width/2, 
                                    t1.y + this._boundary.height/2, 
                                    t2.x + this.foreignNode._boundary.width/2, 
                                    t2.y + this.foreignNode._boundary.height/2
                                );
                            };
                            object.redraw = function(){
                                if( !object._cable ){return;}
                        
                                var t1 = system.utility.element.getCumulativeTransform(this);
                                var t2 = system.utility.element.getCumulativeTransform(this.foreignNode);
                        
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
                            var object = part.builder('g',id,{x:x, y:y, r:rotation});
                                object._type = 'data';
                                object._rotation = rotation;
                                object._cable = null;
                                object._cableStyle = 'fill:none; stroke:rgb(84, 146, 247); stroke-width:4;';
                                object._cableActiveStyle = 'fill:none; stroke:rgb(123, 168, 242); stroke-width:4;';
                                object._boundary = {'width':width, 'height':height};
                            var rect = part.builder('rect','tab',{x:0, y:0, width:width, height:height,style:style});
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
                            object.activate = function(){ system.utility.element.setStyle(rect, glowStyle); };
                            object.disactivate = function(){ system.utility.element.setStyle(rect, style); };
                        
                        
                            //connecting and disconnecting
                            object.connectTo = function(foreignObject){
                                if(!system.super.enablCableDisconnectionConnection){return;}
                        
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
                                if(!system.super.enablCableDisconnectionConnection){return;}
                                
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
                                system.svgElement.tempRef = this;
                                system.svgElement.onmouseup = function(event){
                                    var destination = document.elementFromPoint(event.x, event.y).parentElement;
                                    system.svgElement.tempRef.connectTo(destination);
                                    system.svgElement.tempRef = null;
                                    this.onmouseup = null;
                                };
                            };
                            object.ondblclick = function(){
                                this.disconnect();
                            };
                        
                        
                            //cabling
                            object._add_cable = function(){
                                this._cable = part.builder('cable',null,{style:{unactive:this._cableStyle, active:this._cableActiveStyle}});
                                this.foreignNode._receive_cable(this._cable);
                                system.utility.workspace.getPane(this).appendChild(this._cable); // <-- should probably make prepend
                                this.draw();
                            };
                            object._receive_cable = function(_cable){
                                this._cable = _cable;
                            };
                            object._remove_cable = function(){
                                system.utility.workspace.getPane(this).removeChild(this._cable);
                                this.foreignNode._lose_cable();
                                this._cable = null;
                            };
                            object._lose_cable = function(){
                                this._cable = null;
                            };
                            object.draw = function(){
                                if( !object._cable ){return;}
                        
                                var t1 = system.utility.element.getCumulativeTransform(this);
                                var t2 = system.utility.element.getCumulativeTransform(this.foreignNode);
                                var centre_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
                                var centre_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};
                        
                                if(this._rotation != 0){
                                    var temp = system.utility.math.cartesian2polar(centre_local.x,centre_local.y);
                                    temp.ang += this._rotation;
                                    centre_local = system.utility.math.polar2cartesian(temp.ang,temp.dis);
                                }
                        
                                if(this.foreignNode._rotation != 0){
                                    var temp = system.utility.math.cartesian2polar(centre_foreign.x,centre_foreign.y);
                                    temp.ang += this.foreignNode._rotation;
                                    centre_foreign = system.utility.math.polar2cartesian(temp.ang,temp.dis);
                                }
                        
                                this._cable.draw( 
                                    t1.x + centre_local.x,
                                    t1.y + centre_local.y, 
                                    t2.x + centre_foreign.x,
                                    t2.y + centre_foreign.y
                                );
                            };
                            object.redraw = function(){
                                if( !object._cable ){return;}
                        
                                var t1 = system.utility.element.getCumulativeTransform(this);
                                var t2 = system.utility.element.getCumulativeTransform(this.foreignNode);
                                var centre_local = {'x':this._boundary.width/2,'y':this._boundary.height/2};
                                var centre_foreign = {'x':this.foreignNode._boundary.width/2,'y':this.foreignNode._boundary.height/2};
                        
                                if(this._rotation != 0){
                                    var temp = system.utility.math.cartesian2polar(centre_local.x,centre_local.y);
                                    temp.ang += this._rotation;
                                    centre_local = system.utility.math.polar2cartesian(temp.ang,temp.dis);
                                }
                        
                                if(this.foreignNode._rotation != 0){
                                    var temp = system.utility.math.cartesian2polar(centre_foreign.x,centre_foreign.y);
                                    temp.ang += this.foreignNode._rotation;
                                    centre_foreign = system.utility.math.polar2cartesian(temp.ang,temp.dis);
                                }
                        
                                this._cable.draw( 
                                    t1.x + centre_local.x,
                                    t1.y + centre_local.y, 
                                    t2.x + centre_foreign.x,
                                    t2.y + centre_foreign.y
                                );
                            };
                        
                        
                            return object;
                        };
                    };
                };
            };
            
            part.builder = function(type,name,data){
                if(!data){data={};}
                switch(type){
                    //basic
                        case 'g':      return part.element.basic.g(name, data.x, data.y, data.r, data.style); break;
                        case 'line':   return part.element.basic.line(name, data.x1, data.y1, data.x2, data.y2, data.style); break;
                        case 'rect':   return part.element.basic.rect(name, data.x, data.y, data.width, data.height, data.angle, data.style); break;
                        case 'path':   return part.element.basic.path(name, data.path, data.lineType, data.style); break;
                        case 'text':   return part.element.basic.text(name, data.x, data.y, data.text, data.angle, data.style); break;
                        case 'circle': return part.element.basic.circle(name, data.x, data.y, data.r, data.angle, data.style); break;
                        case 'canvas': return part.element.basic.canvas(name, data.x, data.y, data.width, data.height, data.angle, data.resolution); break;
                }
            
                if(data.style == undefined){data.style={};}
                switch(type){
                    default: console.warn('Unknown element: '+ type); return null; break;
            
                    //display
                        case 'label': return part.element.display.label(name, data.x, data.y, data.text, data.style, data.angle); break;
                        case 'level': return part.element.display.level(name, data.x, data.y, data.angle, data.width, data.height, data.style.backing, data.style.level); break;
                        case 'meter_level': return part.element.display.meter_level(name, data.x, data.y, data.angle, data.width, data.height, data.markings, data.style.backing, data.style.levels, data.style.marking); break;
                        case 'audio_meter_level': return part.element.display.audio_meter_level(name, data.x, data.y, data.angle, data.width, data.height, data.markings, data.style.backing, data.style.levels, data.style.marking); break;
                        case 'sevenSegmentDisplay': return part.element.display.sevenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.style.background, data.style.glow, data.style.dim); break;
                        case 'sixteenSegmentDisplay': return part.element.display.sixteenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.style.background, data.style.glow, data.style.dim); break;
                        case 'readout_sixteenSegmentDisplay': return part.element.display.readout_sixteenSegmentDisplay(name, data.x, data.y, data.width, data.height, data.count, data.angle, data.style.background, data.style.glow, data.style.dime); break;
                        case 'rastorDisplay': return part.element.display.rastorDisplay(name, data.x, data.y, data.width, data.height, data.xCount, data.yCount, data.xGappage, data.yGappage); break;
                        case 'glowbox_rect': return part.element.display.glowbox_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.glow, data.style.dim); break;
                        case 'grapherSVG': return part.element.display.grapherSVG(name, data.x, data.y, data.width, data.height, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
                        case 'grapherCanvas': return part.element.display.grapherCanvas(name, data.x, data.y, data.width, data.height, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
                        case 'grapher_periodicWave': return part.element.display.grapher_periodicWave(name, data.x, data.y, data.width, data.height, data.graphType, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
                        case 'grapher_audioScope': return part.element.display.grapher_audioScope(  name, data.x, data.y, data.width, data.height, data.graphType, data.style.foreground, data.style.foregroundText, data.style.background, data.style.backgroundText, data.style.backing); break;
            
                    //control
                        case 'button_rect': 
                            var temp = part.element.control.button_rect(
                                name,
                                data.x, data.y, data.width, data.height, data.angle, 
                                (data.text ? data.text : data.text_centre), data.text_left, data.text_right,
                                data.textVerticalOffset, data.textHorizontalOffset,
                                data.active, data.hoverable, data.selectable, data.pressable,
                                data.style.text, 
                                data.style.off,
                                data.style.up,                data.style.press,
                                data.style.select,            data.style.select_press,
                                data.style.glow,              data.style.glow_press,
                                data.style.glow_select,       data.style.glow_select_press,
                                data.style.hover,             data.style.hover_press,
                                data.style.hover_select,      data.style.hover_select_press,
                                data.style.hover_glow,        data.style.hover_glow_press,
                                data.style.hover_glow_select, data.style.hover_glow_select_press,
                            );
                            temp.onpress =    data.onpress    ? data.onpress    : temp.onpress;
                            temp.onrelease =  data.onrelease  ? data.onrelease  : temp.onrelease;
                            temp.ondblpress = data.ondblpress ? data.ondblpress : temp.ondblpress;
                            temp.onenter =    data.onenter    ? data.onenter    : temp.onenter;
                            temp.onleave =    data.onleave    ? data.onleave    : temp.onleave;
                            temp.onselect =   data.onselect   ? data.onselect   : temp.onselect;
                            temp.ondeselect = data.ondeselect ? data.ondeselect : temp.ondeselect;
                            return temp;
                        break;
                        case 'checkbox_rect':
                            var temp = part.element.control.checkbox_rect(name, data.x, data.y, data.width, data.height, data.angle, data.style.check, data.style.backing, data.style.checkGlow, data.style.backingGlow);
                            temp.onchange = data.onchange ? data.onchange : temp.onchange;
                            return temp;
                        break;
                        case 'slide':
                            var temp = part.element.control.slide(name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.value, data.resetValue, data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle);
                            temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                            temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                            return temp;
                        break;
                        case 'slidePanel':
                            var temp = part.element.control.slidePanel(name, data.x, data.y, data.width, data.height, data.count, data.angle, data.handleHeight, data.value, data.resetValue, data.style.handle, data.style.backing, data.style.slot);
                            temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                            temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                            return temp;
                        break;
                        case 'rangeslide':
                            var temp = part.element.control.rangeslide(name, data.x, data.y, data.width, data.height, data.angle, data.handleHeight, data.spanWidth, data.values, data.resetValues, data.style.handle, data.style.backing, data.style.slot, data.style.invisibleHandle, data.style.span);
                            temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                            temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                            return temp;
                        break;
                        case 'dial_continuous': 
                            var temp = part.element.control.dial_continuous(
                                name,
                                data.x, data.y, data.r,
                                data.startAngle, data.maxAngle,
                                data.style.handle, data.style.slot, data.style.needle,
                                data.style.handle_glow, data.style.slot_glow, data.style.needle_glow,
                                data.arcDistance, data.style.outerArc, data.style.outerArc_glow,
                            );
                            temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                            temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                            return temp;
                        break;
                        case 'dial_discrete':
                            var temp = part.element.control.dial_discrete(
                                name,
                                data.x, data.y, data.r,
                                data.optionCount,
                                data.startAngle, data.maxAngle,
                                data.style.handle, data.style.slot, data.style.needle,
                                data.style.handle_glow, data.style.slot_glow, data.style.needle_glow,
                                data.arcDistance, data.style.outerArc, data.style.outerArc_glow,
                            );
                            temp.onchange = data.onchange   ? data.onchange  : temp.onchange  ;
                            temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease ;
                            return temp;
                        break;
                        case 'rastorgrid':
                            var temp = part.element.control.rastorgrid(
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
                            var temp = part.element.control.sequencer(
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
                            var temp = part.element.control.needleOverlay(
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
                            var temp = part.element.control.grapher_waveWorkspace(
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
                        case 'list':
                                var temp = part.element.control.list(
                                    name, data.x, data.y, data.width, data.height, data.angle, data.list, 
                                    data.selectable, data.multiSelect, data.hoverable, data.pressable, data.active,
                                    data.itemHeightMux, data.itemSpacingMux, data.breakHeightMux, data.breakWidthMux, data.spaceHeightMux,
                                    data.itemTextVerticalOffsetMux, data.itemTextHorizontalOffsetMux,
                                    data.style.listItemText,
                                    data.style.backing,
                                    data.style.break,
                                    data.style.background_off,
                                    data.style.background_up,                data.style.background_press,
                                    data.style.background_select,            data.style.background_select_press,
                                    data.style.background_glow,              data.style.background_glow_press,
                                    data.style.background_glow_select,       data.style.background_glow_select_press,
                                    data.style.background_hover,             data.style.background_hover_press,
                                    data.style.background_hover_select,      data.style.background_hover_select_press,
                                    data.style.background_hover_glow,        data.style.background_hover_glow_press,
                                    data.style.background_hover_glow_select, data.style.background_hover_glow_select_press,
                                );
                                
                                temp.onenter = data.onenter ? data.onenter : temp.onenter;
                                temp.onleave = data.onleave ? data.onleave : temp.onleave;
                                temp.onpress = data.onpress ? data.onpress : temp.onpress;
                                temp.ondblpress = data.ondblpress ? data.ondblpress : temp.ondblpress;
                                temp.onrelease = data.onrelease ? data.onrelease : temp.onrelease;
                                temp.onselection = data.onselection ? data.onselection : temp.onselection;
                                temp.onpositionchange = data.onpositionchange ? data.onpositionchange : temp.onpositionchange;
                                return temp;
                        break;
            
                    //dynamic
                        case 'cable': return part.element.dynamic.cable(name, data.x1, data.y1, data.x2, data.y2, data.style.unactive, data.style.active); break;
                        case 'connectionNode_audio': 
                            if(Object.keys(data.style).length == 0){data.style = undefined;}
                            return part.element.dynamic.connectionNode_audio(name, data.type, data.x, data.y, data.width, data.height, data.angle, system.audio.context, data.style);
                        break;
                        case 'connectionNode_data':
                            if(Object.keys(data.style).length == 0){data.style = undefined;}
                            var temp = part.element.dynamic.connectionNode_data(name, data.x, data.y, data.width, data.height, data.angle, data.style);
                            temp.receive = data.receive ? data.receive : temp.receive;
                            temp.give = data.give ? data.give : temp.give;
                            return temp;
                        break;
                }
            }; 

            var object = new function(){
                this.alpha = new function(){
                    this.audio_duplicator = function(x,y){
                        var style = {
                            background:'fill:rgba(200,200,200,1);pointer-events:none;',
                            markings: 'fill:rgba(150,150,150,1); pointer-events:none;',
                        };
                        var design = {
                            name:'audio_duplicator',
                            collection: 'alpha',
                            x:x, y:y,
                            base:{
                                points:[{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
                                style:'fill:rgba(200,200,200,0);'
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'input', data:{ type:0, x:45, y:5, width:20, height:20 }},
                                {type:'connectionNode_audio', name:'output_1', data:{ type:1, x:-10, y:5, width:20, height:20 }},
                                {type:'connectionNode_audio', name:'output_2', data:{ type:1, x:-10, y:30, width:20, height:20 }},
                    
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
                            var obj = object.builder(object.alpha.audio_duplicator,design);
                    
                        //circuitry
                            design.connectionNode_audio.input.out().connect( design.connectionNode_audio.output_1.in() );
                            design.connectionNode_audio.input.out().connect( design.connectionNode_audio.output_2.in() );
                             
                        return obj;
                    };
                    
                    this.audio_duplicator.metadata = {
                        name:'Audio Duplicator',
                        helpurl:'https://metasophiea.com/curve/help/objects/audioDuplicator/'
                    };
                    this.filterUnit = function(x,y){
                        var state = {
                            freqRange:{ low: 0.1, high: 20000, },
                            graphDetail: 3,
                        };
                        var style = {
                            background: 'fill:rgba(200,200,200,1); stroke:none;',
                            h1: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
                            h2: 'fill:rgba(0,0,0,1); font-size:3px; font-family:Courier New;',
                            h3: 'fill:rgba(0,0,0,1); font-size:2px; font-family:Courier New;',
                    
                            dial:{
                                handle: 'fill:rgba(220,220,220,1)',
                                slot: 'fill:rgba(50,50,50,1)',
                                needle: 'fill:rgba(250,150,150,1)',
                                arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:0.5;',
                            },
                            graph:{
                                foregroundlines:['stroke:rgba(0,200,163,1); stroke-width:0.5; stroke-linecap:round;'],
                                backgroundlines:'stroke:rgba(0,200,163,0.25); stroke-width:0.25;',
                                backgroundtext:'fill:rgba(0,200,163,0.75); font-size:1; font-family:Helvetica;',
                            }
                        };
                        var design = {
                            name: 'filterUnit',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[
                                    {x:10,y:0},
                                    {x:92.5,y:0},
                                    {x:102.5,y:70},
                                    {x:51.25,y:100},
                                    {x:0,y:70},
                                ], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'audioIn', data:{ type: 0, x: 94.8, y: 16, width: 10, height: 20, angle:-0.14}},
                                {type:'connectionNode_audio', name:'audioOut', data:{ type: 1, x: -2.3, y: 16, width: 10, height: 20, angle:0.144 }},
                            
                                {type:'grapherCanvas', name:'graph', data:{x:15, y:5, width:72.5, height:50, 
                                    style:{foreground:style.graph.foregroundlines, background:style.graph.backgroundlines, backgroundText:style.graph.backgroundtext}}
                                },
                    
                                {type:'label', name:'Q_0',     data:{x:74,   y: 76,   text:'0',   style:style.h2}},
                                {type:'label', name:'Q_1/2',   data:{x:79.5, y: 59.5, text:'1/2', style:style.h2}},
                                {type:'label', name:'Q_1',     data:{x:89,   y: 76,   text:'1',   style:style.h2}},
                                {type:'label', name:'Q_title', data:{x:81,   y: 79,   text:'Q',   style:style.h1}},
                                {type:'dial_continuous',name:'Q',data:{
                                    x: 82.5, y: 68.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){obj.filterCircuit.Q(value*10);updateGraph();},
                                }},
                    
                                {type:'label', name:'gain_0',     data:{x:54,   y: 86,   text:'0',    style:style.h2}},
                                {type:'label', name:'gain_1/2',   data:{x:61.5, y: 68.5, text:'5',    style:style.h2}},
                                {type:'label', name:'gain_1',     data:{x:69,   y: 86,   text:'10',   style:style.h2}},
                                {type:'label', name:'gain_title', data:{x:58,   y: 89,   text:'Gain', style:style.h1}},
                                {type:'dial_continuous',name:'gain',data:{
                                    x: 62.5, y: 77.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){obj.filterCircuit.gain(value*10);updateGraph();},
                                }},
                                
                                {type:'label', name:'frequency_0',     data:{x:31.5, y: 86,   text:'0',     style:style.h3}},
                                {type:'label', name:'frequency_100',   data:{x:38.25, y:68.5, text:'100',   style:style.h3}},
                                {type:'label', name:'frequency_20000', data:{x:46.5, y: 86,   text:'20000', style:style.h3}},
                                {type:'label', name:'frequency_title', data:{x:35.5, y:89,    text:'Freq',  style:style.h1}},
                                {type:'dial_continuous',name:'frequency',data:{
                                    x: 40, y: 77.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){obj.filterCircuit.frequency( system.utility.math.curvePoint.exponential(value,0,20000,10.5866095) );updateGraph();},
                                }},
                    
                                {type:'label', name:'type_lowp',  data:{x:10,    y: 74.5, text:'lowp', style:style.h3}},
                                {type:'label', name:'type_highp', data:{x:5,     y: 69,   text:'highp',style:style.h3}},
                                {type:'label', name:'type_band',  data:{x:8,     y: 63,   text:'band', style:style.h3}},
                                {type:'label', name:'type_lows',  data:{x:14,    y: 59,   text:'lows', style:style.h3}},
                                {type:'label', name:'type_highs', data:{x:22.5,  y: 59.5, text:'highs',style:style.h3}},
                                {type:'label', name:'type_peak',  data:{x:27.5,  y: 63,   text:'peak', style:style.h3}},
                                {type:'label', name:'type_notch', data:{x:29,    y: 69,   text:'notch',style:style.h3}},
                                {type:'label', name:'type_all',   data:{x:25.5,  y: 74.5, text:'all',  style:style.h3}},
                                {type:'label', name:'type_title', data:{x:15.5,  y:78.5,  text:'Type', style:style.h1}},
                                {type:'dial_discrete',name:'type',data:{
                                    x: 20, y: 67.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, optionCount: 8,
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                                    onchange:function(value){obj.filterCircuit.type(['lowpass','highpass','bandpass','lowshelf','highshelf','peaking','notch','allpass'][value]);updateGraph();},
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.filterUnit,design);
                    
                        //import/export
                            obj.importData = function(data){
                                design.dial_continuous.Q.set(data.Q);
                                design.dial_continuous.gain.set(data.gain);
                                design.dial_discrete.type.select(data.type);
                                design.dial_continuous.frequency.set(data.frequency);
                            };
                            obj.exportData = function(){
                                return {
                                    Q:         design.dial_continuous.Q.get(), 
                                    gain:      design.dial_continuous.gain.get(), 
                                    type:      design.dial_discrete.type.select(), 
                                    frequency: design.dial_continuous.frequency.get(), 
                                };
                            };
                    
                        //circuitry
                            //filter
                                obj.filterCircuit = new part.circuit.audio.filterUnit(system.audio.context);
                                design.connectionNode_audio.audioIn.out().connect( obj.filterCircuit.in() );
                                obj.filterCircuit.out().connect( design.connectionNode_audio.audioOut.in() );
                    
                            //internalfunctions
                                function getFrequencyAndLocationArray(){
                                    var locationArray = [];
                                    var frequencyArray = [];
                                    for(var a = 0; a <= Math.floor(Math.log10(state.freqRange.high))+1; a++){
                                        for(var b = 1; b < 10; b+=1/Math.pow(2,state.graphDetail)){
                                            if( Math.pow(10,a)*(b/10) >= state.freqRange.high){break;}
                                            locationArray.push( Math.log10(Math.pow(10,a)*b) );
                                            frequencyArray.push( Math.pow(10,a)*(b/10) );
                                        }
                                    }
                                    return {frequency:frequencyArray, location:system.utility.math.normalizeStretchArray(locationArray)};
                                }
                                function updateGraph(){
                                    var temp = getFrequencyAndLocationArray();
                                    design.grapherCanvas.graph.draw( obj.filterCircuit.measureFrequencyResponse_values(temp.frequency)[0], temp.location );
                                };
                    
                        //setup
                            var arrays = getFrequencyAndLocationArray();
                            arrays.frequency = arrays.frequency.filter(function(a,i){return i%Math.pow(2,state.graphDetail)==0;});
                            arrays.location = arrays.location.filter(function(a,i){return i%Math.pow(2,state.graphDetail)==0;});
                            design.grapherCanvas.graph.viewbox({'bottom':0,'top':2});
                            design.grapherCanvas.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],textPosition:{x:0.005,y:0.075},printText:true});
                            design.grapherCanvas.graph.verticalMarkings({
                                    points:arrays.location,
                                    printingValues:arrays.frequency.map(a => Math.log10(a)%1 == 0 ? a : '').slice(0,arrays.frequency.length-1).concat(''), //only print the factoirs of 10, leaving everything else as an empty string
                                    textPosition:{x:-0.0025,y:1.99},
                                    printText:true,
                                });
                            design.grapherCanvas.graph.drawBackground();
                    
                            design.dial_discrete.type.select(0);
                            design.dial_continuous.Q.set(0);
                            design.dial_continuous.gain.set(0.1);
                            design.dial_continuous.frequency.set(0.5);
                            setTimeout(updateGraph,100);
                    
                        return obj;
                    };
                    
                    this.filterUnit.metadata = {
                        name:'Filter Unit',
                        helpurl:'https://metasophiea.com/curve/help/objects/filterUnit/'
                    };

                    this.reverbUnit = function(x,y){
                        var state = {
                            reverbTypeSelected: 0,
                            availableTypes: [],
                        };
                        var style = {
                            background: 'fill:rgba(200,200,200,1); stroke:none;',
                            h1: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
                            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
                    
                            dial:{
                                handle: 'fill:rgba(220,220,220,1)',
                                slot: 'fill:rgba(50,50,50,1)',
                                needle: 'fill:rgba(250,150,150,1)',
                                arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                            },
                            button:{
                                up: 'fill:rgba(175,175,175,1)',
                                hover: 'fill:rgba(220,220,220,1)',
                                down: 'fill:rgba(150,150,150,1)',
                                glow: 'fill:rgba(220,200,220,1)',
                            }
                        };
                        var design = {
                            name: 'reverbUnit',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[
                                    {x:0,y:10},
                                    {x:51.25,y:0},
                                    {x:102.5,y:10},
                                    {x:102.5,y:40},
                                    {x:51.25,y:50},
                                    {x:0,y:40},
                                ], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'audioIn', data:{ type: 0, x: 102.5, y: 16, width: 10, height: 20 }},
                                {type:'connectionNode_audio', name:'audioOut', data:{ type: 1, x: -10, y: 16, width: 10, height: 20 }},
                                
                                {type:'label', name:'outGain_0',   data:{x:7,    y:39, text:'0', style:style.h2}},
                                {type:'label', name:'outGain_1/2', data:{x:16.5, y:10, text:'1/2', style:style.h2}},
                                {type:'label', name:'outGain_1',   data:{x:30,   y:39, text:'1', style:style.h2}},
                                {type:'dial_continuous',name:'outGain',data:{
                                    x: 20, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){ obj.reverbCircuit.outGain(value); },
                                }},
                                {type:'label', name:'wetdry_1/2', data:{x:66.5, y:39, text:'wet', style:style.h2}},
                                {type:'label', name:'wetdry_1',   data:{x:92.5, y:39, text:'dry', style:style.h2}},
                                {type:'dial_continuous',name:'wetdry',data:{
                                    x: 82.5, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){ obj.reverbCircuit.wetdry(1-value); },
                                }},
                    
                                {type:'button_rect',name:'raiseByOne',data:{
                                    x:51, y:6, width: 10.25, height: 5,  
                                    style:{ up:style.button.up, hover:style.button.hover, hover_press:style.button.down },
                                    onpress: function(){ incReverbType(); },
                                }},
                                {type:'button_rect',name:'raiseByTen',data:{
                                    x:38.75, y:6, width: 10.25, height: 5,  
                                    style:{ up:style.button.up, hover:style.button.hover, hover_press:style.button.down },
                                    onpress: function(){ inc10ReverbType(); },
                                }},
                                {type:'button_rect',name:'lowerByOne',data:{
                                    x:51, y:39, width: 10.25, height: 5,  
                                    style:{ up:style.button.up, hover:style.button.hover, hover_press:style.button.down },
                                    onpress: function(){ decReverbType(); },
                                }},
                                {type:'button_rect',name:'lowerByTen',data:{
                                    x:38.75, y:39, width: 10.25, height: 5,  
                                    style:{ up:style.button.up, hover:style.button.hover, hover_press:style.button.down },
                                    onpress: function(){ dec10ReverbType(); },
                                }},
                    
                                {type:'sevenSegmentDisplay',name:'tens',data:{
                                    x:50, y:12.5, width:12.5, height:25,
                                }},
                                {type:'sevenSegmentDisplay',name:'ones',data:{
                                    x:37.5, y:12.5, width:12.5, height:25,
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.reverbUnit,design);
                    
                        //import/export
                            obj.importData = function(data){
                                state.reverbTypeSelected = data.selectedType;
                                design.dial_continuous.wetdry.set(data.wetdry);
                                design.dial_continuous.outGain.set(data.outGain);
                            };
                            obj.exportData = function(){
                                return {
                                    selectedType: state.reverbTypeSelected,
                                    wetdry: design.dial_continuous.wetdry.get(),
                                    outGain: design.dial_continuous.outGain.get(),
                                };
                            };
                    
                        //circuitry
                            //reverb
                                obj.reverbCircuit = new part.circuit.audio.reverbUnit(system.audio.context);
                                design.connectionNode_audio.audioIn.out().connect( obj.reverbCircuit.in() );
                                obj.reverbCircuit.out().connect( design.connectionNode_audio.audioOut.in() );
                                obj.reverbCircuit.getTypes( function(a){state.availableTypes = a;} );
                                
                            //internal functions
                                function setReadout(num){
                                    num = ("0" + num).slice(-2);
                    
                                    design.sevenSegmentDisplay.ones.enterCharacter(num[0]);
                                    design.sevenSegmentDisplay.tens.enterCharacter(num[1]);
                                }
                                function setReverbType(a){
                                    if( state.availableTypes.length == 0 ){ console.log('broken or not yet ready'); return;}
                    
                                    if( a >= state.availableTypes.length ){a = state.availableTypes.length-1;}
                                    else if( a < 0 ){a = 0;}
                        
                                    state.reverbTypeSelected = a;
                                    obj.reverbCircuit.type( state.availableTypes[a], function(){setReadout(state.reverbTypeSelected);});    
                                }
                                function incReverbType(){ setReverbType(state.reverbTypeSelected+1); }
                                function decReverbType(){ setReverbType(state.reverbTypeSelected-1); }
                                function inc10ReverbType(){ setReverbType(state.reverbTypeSelected+10); }
                                function dec10ReverbType(){ setReverbType(state.reverbTypeSelected-10); }
                    
                        //interface
                            obj.i = {
                                gain:function(a){design.dial_continuous.outGain.set(a);},
                                wetdry:function(a){design.dial_continuous.wetdry.set(a);},
                            };
                    
                        //setup
                            design.dial_continuous.outGain.set(1/2);
                            design.dial_continuous.wetdry.set(1/2);
                            setTimeout(function(){setReverbType(state.reverbTypeSelected);},1000);
                    
                        return obj;
                    };
                    
                    this.reverbUnit.metadata = {
                        name:'Reverb Unit',
                        helpurl:'https://metasophiea.com/curve/help/objects/reverbUnit/'
                    };

                    this.multibandFilter = function(
                        x, y, angle,
                    ){
                        var vars = {
                            allowUpdate:false,
                            freqRange:{ low: 0.1, high: 20000, },
                            graphDetail: 2, //factor of the number of points a graphed line is drawn with
                            channelCount: 8,
                            masterGain:1,
                            gain:[],
                            Q:[],
                            frequency:[],
                            curvePointExponentialSharpness:10.586609649448984,
                            defaultValues:{
                                gain:[0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,],
                                //standard tunings
                                    // Q:[0,0.06,0.06,0.06,0.06,0.06,0.06,0],
                                    // frequency:[0.05, 0.1, 0.225, 0.375, 0.5, 0.65, 0.8, 0.875],
                                //human range tunings
                                    Q:[0,0.09,0.09,0.09,0.09,0.09,0.09,0],
                                    frequency:[0.41416, 0.479046, 0.565238, 0.630592, 0.717072, 0.803595, 0.91345175, 0.93452845],
                            }
                        };
                        var style = {
                            background: 'fill:rgba(200,200,200,1); stroke:none;',
                            h1: 'fill:rgba(0,0,0,1); font-size:6px; font-family:Courier New;',
                            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
                            h3: 'fill:rgba(0,0,0,1); font-size:2px; font-family:Courier New;',
                            panels:[
                                'fill:rgba(0,200,163,  0.25);  pointer-events:none;',
                                'fill:rgba(100,235,131,0.25); pointer-events:none;',
                                'fill:rgba(228,255,26, 0.25); pointer-events:none;',
                                'fill:rgba(232,170,20, 0.25); pointer-events:none;',
                                'fill:rgba(255,87,20,  0.25); pointer-events:none;',
                                'fill:rgba(0,191,255,  0.25); pointer-events:none;',
                                'fill:rgba(249,99,202, 0.25); pointer-events:none;',
                                'fill:rgba(255,255,255,0.25); pointer-events:none;',
                            ],
                    
                            slide:{
                                handle:'fill:rgba(240,240,240,1)',
                                backing:'fill:rgba(150,150,150,0)',
                                slot:'fill:rgba(50,50,50,1)',
                            },
                            dial:{
                                handle: 'fill:rgba(220,220,220,1)',
                                slot: 'fill:rgba(50,50,50,1)',
                                needle: 'fill:rgba(250,150,150,1)',
                                arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                            },
                            graph:{
                                foregroundlines:[
                                    'stroke:rgba(0,200,163,1); stroke-width:0.5; stroke-linecap:round;',
                                    'stroke:rgba(100,235,131,1); stroke-width:0.5; stroke-linecap:round;',
                                    'stroke:rgba(228,255,26,1); stroke-width:0.5; stroke-linecap:round;',
                                    'stroke:rgba(232,170,20,1); stroke-width:0.5; stroke-linecap:round;',
                                    'stroke:rgba(255,87,20,1); stroke-width:0.5; stroke-linecap:round;',
                                    'stroke:rgba(0,191,255,1); stroke-width:0.5; stroke-linecap:round;',
                                    'stroke:rgba(249,99,202,1); stroke-width:0.5; stroke-linecap:round;',
                                    'stroke:rgba(255,255,255,1); stroke-width:0.5; stroke-linecap:round;',
                                ],
                                backgroundlines:'stroke:rgba(0,200,163,0.25); stroke-width:0.25;',
                                backgroundtext:'fill:rgba(0,200,163,0.75); font-size:1; font-family:Helvetica;',
                            }
                        };
                        var width = 195;
                        var height = 255;
                        var design = {
                            name: 'multibandFilter',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[
                                    { x:0,        y:10         }, { x:10,       y:0          },
                                    { x:width-10, y:0          }, { x:width,    y:10         },
                                    { x:width,    y:height-10  }, { x:width-10, y:height     },
                                    { x:10,       y:height     }, { x:0,        y:height-10  },
                                    { x:0, y:75 }, { x:-25, y:65 }, { x:-25, y:10 },
                                ], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'audioIn_0', data:{type:0, x:195, y:15, width:10, height:20}},
                                {type:'connectionNode_audio', name:'audioIn_1', data:{type:0, x:195, y:40, width:10, height:20}},
                                {type:'connectionNode_audio', name:'audioOut_0', data:{type:1, x:-35, y:15, width:10, height:20}},
                                {type:'connectionNode_audio', name:'audioOut_1', data:{type:1, x:-35, y:40, width:10, height:20}},
                                {type:'dial_continuous',name:'masterGain',data:{
                                    x:-10, y:37.5, r:10, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.35, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.markings},
                                    onchange:function(a){
                                        return function(value){
                                            vars.masterGain = value*2;
                                            obj.filterCircuit_0.masterGain(vars.masterGain);
                                            obj.filterCircuit_1.masterGain(vars.masterGain);
                                            updateGraph();
                                        }
                                    }(a)
                                }},
                                {type:'grapherSVG', name:'graph', data:{x:10, y:10, width:175, height:75, style:{foreground:style.graph.foregroundlines, background:style.graph.backgroundlines, backgroundText:style.graph.backgroundtext}}},
                            ]
                        };
                        //dynamic design
                        for(var a = 0; a < vars.channelCount; a++){
                            design.elements.push(
                                //channel strip backing
                                    {type:'rect', name:'backing_'+a, data:{
                                        x:13.75+a*22, y:87.5, width:12.5, height:157.5, style:style.panels[a],
                                    }},
                                //gain
                                    {type:'slide',name:'gainSlide_'+a,data:{
                                        x:15+a*22, y:90, width: 10, height: 80, angle:0, handleHeight:0.05, resetValue:0.5,
                                        style:{handle:style.slide.handle, backing:style.slide.backing, slot:style.slide.slot}, 
                                        onchange:function(a){
                                            return function(value){
                                                vars.gain[a] = (1-value)*2;
                                                obj.filterCircuit_0.gain(a,vars.gain[a]);
                                                obj.filterCircuit_1.gain(a,vars.gain[a]);
                                                updateGraph(a);
                                            }
                                        }(a)
                                    }},
                                //Q
                                    {type:'dial_continuous',name:'qDial_'+a,data:{
                                        x:20+a*22, y:180, r:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.35, 
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.markings},
                                        onchange:function(a){
                                            return function(value){
                                                vars.Q[a] = value;
                                                obj.filterCircuit_0.Q(a, system.utility.math.curvePoint.exponential(vars.Q[a],0,20000,vars.curvePointExponentialSharpness));
                                                obj.filterCircuit_1.Q(a, system.utility.math.curvePoint.exponential(vars.Q[a],0,20000,vars.curvePointExponentialSharpness));
                                                updateGraph(a);
                                            }
                                        }(a)
                                    }},
                                //frequency
                                    {type:'dial_continuous',name:'frequencyDial_'+a,data:{
                                        x:20+a*22, y:200, r:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.35, 
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.markings},
                                        onchange:function(a){
                                            return function(value){
                                                vars.frequency[a] = value;
                                                design.readout_sixteenSegmentDisplay['frequencyReadout_'+a].text( system.utility.misc.padString( system.utility.math.curvePoint.exponential(value,0,20000,vars.curvePointExponentialSharpness).toFixed(2), 8) );
                                                design.readout_sixteenSegmentDisplay['frequencyReadout_'+a].print('smart');
                                                obj.filterCircuit_0.frequency(a, system.utility.math.curvePoint.exponential(vars.frequency[a],0,20000,vars.curvePointExponentialSharpness));
                                                obj.filterCircuit_1.frequency(a, system.utility.math.curvePoint.exponential(vars.frequency[a],0,20000,vars.curvePointExponentialSharpness));
                                                updateGraph(a);
                                            }
                                        }(a)
                                    }},
                                //frequency readout
                                    {type:'readout_sixteenSegmentDisplay',name:'frequencyReadout_'+a,data:{
                                        x:25+a*22, y:212.5, width:30, height:10, count:8, angle:Math.PI/2,
                                    }},
                            );
                        }
                    
                        //main object
                            var obj = object.builder(object.alpha.multibandFilter,design);
                    
                        //import/export
                            obj.exportData = function(){
                                return {
                                    masterGain: vars.masterGain,
                                    freqRange: vars.freqRange,
                                    channelCount: vars.channelCount,
                                    gain: vars.gain,
                                    Q: vars.Q,
                                    frequency: vars.frequency,
                                };
                            };
                            obj.importData = function(data){};
                    
                        //circuitry
                            obj.filterCircuit_0 = new part.circuit.audio.multibandFilter(system.audio.context, vars.channelCount, true);
                            obj.filterCircuit_1 = new part.circuit.audio.multibandFilter(system.audio.context, vars.channelCount, true);
                            design.connectionNode_audio.audioIn_0.out().connect( obj.filterCircuit_0.in() );
                            design.connectionNode_audio.audioIn_1.out().connect( obj.filterCircuit_1.in() );
                            obj.filterCircuit_0.out().connect( design.connectionNode_audio.audioOut_0.in() );
                            obj.filterCircuit_1.out().connect( design.connectionNode_audio.audioOut_1.in() );
                    
                        //internal functions
                            function getFrequencyAndLocationArray(){
                                var locationArray = [];
                                var frequencyArray = [];
                                for(var a = 0; a <= Math.floor(Math.log10(vars.freqRange.high))+1; a++){
                                    for(var b = 1; b < 10; b+=1/Math.pow(2,vars.graphDetail)){
                                        if( Math.pow(10,a)*(b/10) >= vars.freqRange.high){break;}
                                        locationArray.push( Math.log10(Math.pow(10,a)*b) );
                                        frequencyArray.push( Math.pow(10,a)*(b/10) );
                                    }
                                }
                                return {frequency:frequencyArray, location:system.utility.math.normalizeStretchArray(locationArray)};
                            }
                            function updateGraph(specificBand){
                                if(!vars.allowUpdate){return;}
                                //if no band has been specified, gather the data for all of them and draw the whole thing. Otherwise, just gather 
                                //and redraw the data for the one band
                    
                                var frequencyAndLocationArray = getFrequencyAndLocationArray();
                                    if(specificBand == undefined){
                                        var result = obj.filterCircuit_0.measureFrequencyResponse(undefined, frequencyAndLocationArray.frequency);
                                        for(var a = 0; a < vars.channelCount; a++){ design.grapherSVG.graph.draw( result[a][0], frequencyAndLocationArray.location, a ); }
                                    }else{
                                        var result = obj.filterCircuit_0.measureFrequencyResponse(specificBand, frequencyAndLocationArray.frequency);
                                        design.grapherSVG.graph.draw( result[0], frequencyAndLocationArray.location, specificBand);
                                    }
                            }
                    
                        //interface
                            obj.i = {
                                gain:function(band,value){ if(value == undefined){return design.slide['gainSlide_'+band].get(value);} design.slide['gainSlide_'+band].set(value); },
                                Q:function(band,value){ if(value == undefined){return design.dial_continuous['qDial_'+band].get(value);} design.dial_continuous['qDial_'+band].set(value); },
                                frequency:function(band,value){ if(value == undefined){return design.dial_continuous['frequencyDial_'+band].get(value);} design.dial_continuous['frequencyDial_'+band].set(value); },
                                reset:function(channel){
                                    if(channel == undefined){
                                        //if no channel if specified, reset all of them
                                        for(var a = 0; a < vars.channelCount; a++){ obj.i.reset(a); }
                                        design.dial_continuous.masterGain.set(0.5);
                                        return;
                                    }
                                    for(var a = 0; a < vars.channelCount; a++){
                                        design.slide['gainSlide_'+a].set( vars.defaultValues.gain[a] );
                                        design.dial_continuous['qDial_'+a].set( vars.defaultValues.Q[a] );
                                        design.dial_continuous['frequencyDial_'+a].set( vars.defaultValues.frequency[a] );
                                    }
                                },
                            };
                    
                        //setup
                            //draw background
                                var arrays = getFrequencyAndLocationArray();
                                arrays.frequency = arrays.frequency.filter(function(a,i){return i%Math.pow(2,vars.graphDetail)==0;});
                                arrays.location = arrays.location.filter(function(a,i){return i%Math.pow(2,vars.graphDetail)==0;});
                                design.grapherSVG.graph.viewbox({'bottom':0,'top':2});
                                design.grapherSVG.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],textPosition:{x:0.005,y:0.075},printText:true});
                                design.grapherSVG.graph.verticalMarkings({
                                        points:arrays.location,
                                        printingValues:arrays.frequency.map(a => Math.log10(a)%1 == 0 ? a : '').slice(0,arrays.frequency.length-1).concat(''), //only print the factoirs of 10, leaving everything else as an empty string
                                        textPosition:{x:-0.0025,y:1.99},
                                        printText:true,
                                    });
                                design.grapherSVG.graph.drawBackground();
                            // setup default settings, allow graphical updates to occur and update graph
                                obj.i.reset();
                                vars.allowUpdate = true;
                                updateGraph();
                        
                        return obj;
                    };
                    
                    this.multibandFilter.metadata = {
                        name:'Multiband Filter',
                        helpurl:'https://metasophiea.com/curve/help/objects/multibandFilter/'
                    };
                    this.distortionUnit = function(x,y){
                        var style = {
                            background: 'fill:rgba(200,200,200,1); stroke:none;',
                            h1: 'fill:rgba(0,0,0,1); font-size:6px; font-family:Courier New;',
                            h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
                    
                            dial:{
                                handle: 'fill:rgba(220,220,220,1)',
                                slot: 'fill:rgba(50,50,50,1)',
                                needle: 'fill:rgba(250,150,150,1)',
                                arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                            }
                        };
                        var design = {
                            name: 'distortionUnit',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[
                                    { x:0,           y:10     },
                                    { x:10,          y:0      },
                                    { x:102.5/3,     y:0      },
                                    { x:102.5*0.45,  y:10     },
                                    { x:102.5*0.55,  y:10     },
                                    { x:2*(102.5/3), y:0      },
                                    { x:102.5-10,    y:0      },
                                    { x:102.5,       y:10     },
                                    { x:102.5,       y:95-10  },
                                    { x:102.5-10,    y:95     },
                                    { x:2*(102.5/3), y:95     },
                                    { x:102.5*0.55,  y:95-10  },
                                    { x:102.5*0.45,  y:95-10  },
                                    { x:102.5/3,     y:95     },
                                    { x:10,          y:95     },
                                    { x:0,           y:95-10  }
                                ], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'audioIn', data: { type: 0, x: 102.5, y: 61.5, width: 10, height: 20 }},
                                {type:'connectionNode_audio', name:'audioOut', data:{ type: 1, x: -10, y: 61.5, width: 10, height: 20 }},
                            
                                {type:'label', name:'outGain_title', data:{x:17.5, y:91,   text:'out', style:style.h1}},
                                {type:'label', name:'outGain_0',     data:{x:9.5,  y:85.5, text:'0',   style:style.h2}},
                                {type:'label', name:'outGain_1/2',   data:{x:19,   y:57,   text:'1/2', style:style.h2}},
                                {type:'label', name:'outGain_1',     data:{x:33,   y:85.5, text:'1',   style:style.h2}},
                                {type:'dial_continuous',name:'outGain',data:{
                                    x: 22.5, y: 72.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){obj.distortionCircuit.outGain(value);},
                                }},
                    
                                {type:'label', name:'distortionAmount_title', data:{x:15.5, y:41.5, text:'dist', style:style.h1}},
                                {type:'label', name:'distortionAmount_0',     data:{x:9.5,  y:36,   text:'0',    style:style.h2}},
                                {type:'label', name:'distortionAmount_50',    data:{x:20,   y:7.5,  text:'50',   style:style.h2}},
                                {type:'label', name:'distortionAmount_100',   data:{x:33,   y:36,   text:'100',  style:style.h2}},
                                {type:'dial_continuous',name:'distortionAmount',data:{
                                    x: 22.5, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){obj.distortionCircuit.distortionAmount(value*100);},
                                }},
                    
                                {type:'label', name:'resolution_title', data:{x:47, y:66, text:'res',  style:style.h1}},
                                {type:'label', name:'resolution_2',     data:{x:39, y:60, text:'2',    style:style.h2}},
                                {type:'label', name:'resolution_50',    data:{x:49, y:32, text:'500',  style:style.h2}},
                                {type:'label', name:'resolution_100',   data:{x:63, y:60, text:'1000', style:style.h2}},
                                {type:'dial_continuous',name:'resolution',data:{
                                    x: 52.5, y: 47.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){obj.distortionCircuit.resolution(Math.round(value*1000));},
                                }},
                                {type:'label', name:'overSample_title', data:{x:67,   y:41.5, text:'overSamp', style:style.h1}},
                                {type:'label', name:'overSample_0',     data:{x:61,   y:12,   text:'none',     style:style.h2}},
                                {type:'label', name:'overSample_50',    data:{x:77.5, y:7.5,  text:'2x',       style:style.h2}},
                                {type:'label', name:'overSample_100',   data:{x:90.5, y:12,   text:'4x',       style:style.h2}},
                                {type:'dial_discrete',name:'overSample',data:{
                                    x: 80, y: 23, r: 12, startAngle: (1.25*Math.PI), maxAngle: 0.5*Math.PI, arcDistance: 1.35, optionCount: 3,
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                                    onchange:function(value){obj.distortionCircuit.oversample(['none','2x','4x'][value]);},
                                }},
                                {type:'label', name:'inGain_title', data:{x:76,   y:91,   text:'in', style:style.h1}},
                                {type:'label', name:'inGain_0',     data:{x:67,   y:85.5, text:'0',   style:style.h2}},
                                {type:'label', name:'inGain_1/2',   data:{x:76.5, y:57,   text:'1/2', style:style.h2}},
                                {type:'label', name:'inGain_1',     data:{x:90.5, y:85.5, text:'1',   style:style.h2}},
                                {type:'dial_continuous',name:'inGain',data:{
                                    x: 80, y: 72.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){obj.distortionCircuit.inGain(2*value);},
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.distortionUnit,design);
                    
                        //import/export
                            obj.importData = function(data){
                                design.dial_continuous.outGain.set(data.outGain);
                                design.dial_continuous.distortionAmount.set(data.distortionAmount);
                                design.dial_continuous.resolution.set(data.resolution);
                                design.dial_discrete.overSample.select(data.overSample);
                                design.dial_continuous.inGain.set(data.inGain);
                            };
                            obj.exportData = function(){
                                return {
                                    outGain:design.dial_continuous.outGain.get(), 
                                    distortionAmount:design.dial_continuous.distortionAmount.get(), 
                                    resolution:design.dial_continuous.resolution.get(), 
                                    overSample:design.dial_discrete.overSample.select(), 
                                    inGain:design.dial_continuous.inGain.get()
                                };
                            };
                    
                        //circuitry
                            //distortion
                                obj.distortionCircuit = new part.circuit.audio.distortionUnit(system.audio.context);
                                design.connectionNode_audio.audioIn.out().connect( obj.distortionCircuit.in() );
                                obj.distortionCircuit.out().connect( design.connectionNode_audio.audioOut.in() );
                    
                        //setup
                            design.dial_continuous.resolution.set(0.5);
                            design.dial_continuous.inGain.set(0.5);
                            design.dial_continuous.outGain.set(1);
                    
                        return obj;
                    };
                    
                    this.distortionUnit.metadata = {
                        name:'Distortion Unit',
                        helpurl:'https://metasophiea.com/curve/help/objects/distortionUnit/'
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
                            name:'audio_sink',
                            collection: 'alpha',
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
                            var obj = object.builder(object.alpha.audio_sink,design);
                    
                        //circuitry
                            var flow = {
                                destination:null,
                                stereoCombiner: null,
                                pan_left:null, pan_right:null,
                            };
                            //destination
                                flow._destination = system.audio.destination;
                    
                            //stereo channel combiner
                                flow.stereoCombiner = new ChannelMergerNode(system.audio.context, {numberOfInputs:2});
                    
                            //audio connections
                                //inputs to meters
                                    design.connectionNode_audio.left.out().connect( design.audio_meter_level.left.audioIn() );
                                    design.connectionNode_audio.right.out().connect(design.audio_meter_level.right.audioIn());
                                //inputs to stereo combiner
                                    design.connectionNode_audio.left.out().connect(flow.stereoCombiner, 0, 0);
                                    design.connectionNode_audio.right.out().connect(flow.stereoCombiner, 0, 1);
                                //stereo combiner to main output
                                    flow.stereoCombiner.connect(flow._destination);
                    
                                //start audio meters
                                    design.audio_meter_level.left.start();
                                    design.audio_meter_level.right.start();
                        return obj;
                    };
                    
                    this.audio_sink.metadata = {
                        name:'Audio Sink',
                        helpurl:'https://metasophiea.com/curve/help/objects/audioSink/'
                    };
                    this.audio_scope = function(x,y){
                        var attributes = {
                            framerateLimits: {min:1, max:30}
                        };
                        var style = {
                            background:'fill:rgba(200,200,200,1);',
                            text:'fill:rgba(0,0,0,1); font-size:5px; font-family:Courier New; pointer-events: none;'
                        };
                        var design = {
                            name:'audio_scope',
                            collection: 'alpha',
                            x:x, y:y,
                            base:{
                                points:[{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}],
                                style:style.background,
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'input', data:{
                                    type:0, x:195, y:5, width:10, height:20
                                }},
                    
                                {type:'grapher_audioScope', name:'waveport', data:{
                                    x:5, y:5, width:150, height:100
                                }},
                                {type:'button_rect', name:'holdKey', data:{
                                    x:160, y:5, width:30, height:20,
                                    style:{ 
                                        up:'fill:rgba(175,175,175,1)', 
                                        hover:'fill:rgba(190,190,190,1)',
                                        hover_press:'fill:rgba(170,170,170,1)',
                                    },
                                    onpress:function(){design.grapher_audioScope.waveport.stop();},
                                    onrelease:function(){design.grapher_audioScope.waveport.start();},
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
                            var obj = object.builder(object.alpha.audio_scope,design);
                        
                        //circuitry
                            design.connectionNode_audio.input.out().connect(design.grapher_audioScope.waveport.getNode());
                    
                        //setup
                            design.grapher_audioScope.waveport.start();
                            design.dial_continuous.framerate.set(0);
                    
                        return obj;
                    };
                    
                    this.audio_scope.metadata = {
                        name:'Audio Scope',
                        helpurl:'https://metasophiea.com/curve/help/objects/audioScope/'
                    };
                    this.universalreadout = function(x,y,debug=false){
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',
                        };
                        var design = {
                            name: 'universalreadout',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                type:'circle',
                                x:10, y:10, r:20,
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_data', name:'in', data:{
                                    x: 0, y: 0, width: 20, height: 20,
                                    receive: function(address,data){ print('address: '+address+' data: '+JSON.stringify(data)); }
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.universalreadout,design);
                    
                        //internal functions
                            var lines = [];
                            var lineElements = [];
                            var lineLimit = 10;
                            function print(text){
                                //add the new text to the list, and if the list becomes too long, remove the oldest item
                                lines.unshift(text);
                                if( lines.length > lineLimit ){ lines.pop(); }
                    
                                //remove all the text elements
                                for(var a = 0; a < lineElements.length; a++){ lineElements[a].remove(); }
                                lineElements = [];
                    
                                //write in the new list
                                for(var a = 0; a < lines.length; a++){
                                    lineElements[a] = part.builder('text','universalreadout_'+a,{ x:40, y:a*5, text:lines[a], style:style.text })
                                    obj.append( lineElements[a] );
                                }
                            }
                    
                        return obj;
                    };
                    
                    this.universalreadout.metadata = {
                        name:'Universal Readout',
                        helpurl:'https://metasophiea.com/curve/help/objects/universalReadout/'
                    };
                    this.basicSynthesizer = function(x,y){
                        var attributes = {
                            detuneLimits: {min:-100, max:100}
                        };
                        var style = {
                            background:'fill:rgba(200,200,200,1);',
                            selectionGlow:{
                                off:'pointer-events:none; fill:none; ',
                                on: 'pointer-events:none; fill:none; stroke:rgb(255, 237, 147); stroke-width:2; stroke-linecap:round;',
                            },
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
                            name:'basicSynthesizer',
                            collection: 'alpha',
                            x:x, y:y,
                            base:{
                                points:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}], 
                                style:style.background,
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'audioOut', data: {
                                    type: 1, x: -15, y: 5, width: 15, height: 30
                                }},
                                {type:'connectionNode_data', name:'gain', data:{
                                    x: 12.5, y: -7.5, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        switch(address){
                                            case '%': design.dial_continuous.gain.set(data); break;
                                            case '%t': 
                                                obj.__synthesizer.gain(data.target,data.time,data.curve);
                                                design.dial_continuous.gain.smoothSet(data.target,data.time,data.curve,false);
                                            break;
                                            default: break;
                                        }
                                    }
                                }},
                                {type:'connectionNode_data', name:'attack', data:{
                                    x: 52.5, y: -7.5, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        if(address != '%'){return;}
                                        design.dial_continuous.attack.set(data);
                                    } 
                                }},
                                {type:'connectionNode_data', name:'release', data:{
                                    x: 92.5, y: -7.5, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        if(address != '%'){return;}
                                        design.dial_continuous.release.set(data);
                                    } 
                                }},
                                {type:'connectionNode_data', name:'detune', data:{
                                    x: 132.5, y: -7.5, width: 15, height: 7.5,
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
                                    x: 170.5, y: -7.5, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        if(address != 'discrete'){return;}
                                        design.dial_discrete.octave.select(data);
                                    } 
                                }},
                                {type:'connectionNode_data', name:'waveType', data:{
                                    x: 210.5, y: -7.5, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        if(address != 'discrete'){return;}
                                        design.dial_discrete.waveType.select(data);
                                    }
                                }},
                                {type:'connectionNode_data', name:'periodicWave', data:{
                                    x: 240, y: 12.5, width: 7.5, height: 15,
                                    receive: function(address,data){
                                        if(address != 'periodicWave'){return;}
                                        obj.__synthesizer.periodicWave(data);
                                    }
                                }},
                                {type:'connectionNode_data', name:'midiNote', data:{
                                    x:225, y:55, width: 15, height: 30, angle:Math.PI/4,
                                    receive: function(address,data){
                                        if(address != 'midinumber'){return;}
                                        obj.__synthesizer.perform(data);
                                    }
                                }},
                                {type:'connectionNode_data', name:'gainWobblePeriod', data:{
                                    x: 22.5, y: 90, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        if(address != '%'){return;}
                                        design.dial_continuous.gainWobblePeriod.set(data);
                                    }
                                }},
                                {type:'connectionNode_data', name:'gainWobbleDepth', data:{
                                    x: 57.5, y: 90, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        if(address != '%'){return;}
                                        design.dial_continuous.gainWobbleDepth.set(data);
                                    }
                                }},
                                {type:'connectionNode_data', name:'detuneWobblePeriod', data:{
                                    x: 107.5, y: 90, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        if(address != '%'){return;}
                                        design.dial_continuous.detuneWobblePeriod.set(data);
                                    }
                                }},
                                {type:'connectionNode_data', name:'detuneWobbleDepth', data:{
                                    x: 142.5, y: 90, width: 15, height: 7.5,
                                    receive: function(address,data){
                                        if(address != '%'){return;}
                                        design.dial_continuous.detuneWobbleDepth.set(data);
                                    }
                                }},
                    
                                //gain dial
                                    {type:'text', name:'gain_gain', data:{x: 11,   y: 43, text: 'gain', style: style.h1}},
                                    {type:'text', name:'gain_0',    data:{x: 7,    y: 37, text: '0',    style: style.h2}},
                                    {type:'text', name:'gain_1/2',  data:{x: 16.5, y: 7,  text: '1/2',  style: style.h2}},
                                    {type:'text', name:'gain_1',    data:{x: 30,   y: 37, text: '1',    style: style.h2}},
                                    {type:'dial_continuous',name:'gain',data:{
                                        x: 20, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                        onchange: function(value){ obj.__synthesizer.gain( value ); }
                                    }},
                                //attack dial
                                    {type:'text', name:'attack_gain', data:{x: 47,   y: 43, text: 'attack', style: style.h1}},
                                    {type:'text', name:'attack_0',    data:{x: 47,   y: 37, text: '0',      style: style.h2}},
                                    {type:'text', name:'attack_5',    data:{x: 58.5, y: 7,  text: '5',      style: style.h2}},
                                    {type:'text', name:'attack_10',   data:{x: 70,   y: 37, text: '10',     style: style.h2}},
                                    {type:'dial_continuous',name:'attack',data:{
                                        x: 60, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                        onchange: function(value){ obj.__synthesizer.attack( value ); }
                                    }},
                                //release dial
                                    {type:'text', name:'release_gain', data:{x: 85,   y: 43, text: 'release', style: style.h1}},
                                    {type:'text', name:'release_0',    data:{x: 85,   y: 37, text: '0',       style: style.h2}},
                                    {type:'text', name:'release_5',    data:{x: 98.5, y: 7,  text: '5',       style: style.h2}},
                                    {type:'text', name:'release_10',   data:{x: 110,  y: 37, text: '10',      style: style.h2}},
                                    {type:'dial_continuous',name:'release',data:{
                                        x: 100, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                        onchange: function(value){ obj.__synthesizer.release( value ); }
                                    }},
                                //detune dial
                                    {type:'text', name:'detune_gain', data:{x: 127,   y: 43, text: 'detune', style: style.h1}},
                                    {type:'text', name:'detune_-100', data:{x: 122,   y: 37, text: '-100',   style: style.h2}},
                                    {type:'text', name:'detune_0',    data:{x: 138.5, y: 7,  text: '0',      style: style.h2}},
                                    {type:'text', name:'detune_100',  data:{x: 150,   y: 37, text: '100',    style: style.h2}},
                                    {type:'dial_continuous',name:'detune',data:{
                                        x: 140, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                        onchange: function(value){ obj.__synthesizer.detune( value*(attributes.detuneLimits.max-attributes.detuneLimits.min) + attributes.detuneLimits.min ); }
                                    }},
                                //octave dial
                                    {type:'text', name:'octave_gain', data:{x: 167,    y: 43, text: 'octave', style: style.h1}},
                                    {type:'text', name:'octave_-3',   data:{x: 164,    y: 35, text: '-3',     style: style.h2}},
                                    {type:'text', name:'octave_-2',   data:{x: 160,    y: 24, text: '-2',     style: style.h2}},
                                    {type:'text', name:'octave_-1',   data:{x: 164,    y: 13, text: '-1',     style: style.h2}},
                                    {type:'text', name:'octave_0',    data:{x: 178.75, y: 8,  text: '0',      style: style.h2}},
                                    {type:'text', name:'octave_1',    data:{x: 190,    y: 13, text: '1',      style: style.h2}},
                                    {type:'text', name:'octave_2',    data:{x: 195,    y: 24, text: '2',      style: style.h2}},
                                    {type:'text', name:'octave_3',    data:{x: 190,    y: 35, text: '3',      style: style.h2}},
                                    {type:'dial_discrete',name:'octave',data:{
                                        x: 180, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, optionCount: 7,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                                        onchange: function(value){ obj.__synthesizer.octave(value-3); }
                                    }},
                                //waveType dial
                                    {type:'text', name:'waveType_gain', data:{x: 211, y: 43, text: 'wave', style: style.h1}},
                                    {type:'text', name:'waveType_sin',  data:{x: 202, y: 35, text: 'sin',  style: style.h2}},
                                    {type:'text', name:'waveType_tri',  data:{x: 199, y: 21, text: 'tri',  style: style.h2}},
                                    {type:'text', name:'waveType_squ',  data:{x: 210, y: 9,  text: 'squ',  style: style.h2}},
                                    {type:'text', name:'waveType_saw',  data:{x: 227, y: 10, text: 'saw',  style: style.h2}},
                                    {type:'rect', name:'periodicWaveType', data:{
                                        x: 230, y: 21.75, angle: 0,
                                        width: 10, height: 2.5,
                                        style:style.dial.slot,
                                    }},
                                    {type:'dial_discrete',name:'waveType',data:{
                                        x: 220, y: 23, r: 12, startAngle: (3*Math.PI)/4, maxAngle: (5*Math.PI)/4,  optionCount: 5,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
                                        onchange: function(value){ obj.__synthesizer.waveType(['sine','triangle','square','sawtooth','custom'][value]); }
                                    }},
                                //gainWobblePeriod dial
                                    {type:'text', name:'gainWobble', data:{x: 13, y: 70, angle: -Math.PI/2,text: 'gain', style: style.h2}}, 
                                    {type:'text', name:'gainWobblePeriod_gain', data:{x: 21,   y: 84,      text: 'rate', style: style.h1}},
                                    {type:'text', name:'gainWobblePeriod_0',    data:{x: 16,   y: 77,      text: '0',    style: style.h2}},
                                    {type:'text', name:'gainWobblePeriod_50',   data:{x: 27.5, y: 49,      text: '50',   style: style.h2}},
                                    {type:'text', name:'gainWobblePeriod_100',  data:{x: 42,   y: 77,      text: '100',  style: style.h2}},
                                    {type:'dial_continuous',name:'gainWobblePeriod',data:{
                                        x: 30, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                        onchange: function(value){ obj.__synthesizer.gainWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
                                    }},
                                //gainWobbleDepth dial
                                    {type:'text', name:'gainWobbleDepth_gain', data:{x: 54, y: 84, text: 'depth', style: style.h1}},
                                    {type:'text', name:'gainWobbleDepth_0',    data:{x: 51, y: 77, text: '0',     style: style.h2}},
                                    {type:'text', name:'gainWobbleDepth_50',   data:{x: 61, y: 49, text: '1/2',   style: style.h2}},
                                    {type:'text', name:'gainWobbleDepth_100',  data:{x: 77, y: 77, text: '1',     style: style.h2}},
                                    {type:'dial_continuous',name:'gainWobbleDepth',data:{
                                        x: 65, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                        onchange: function(value){ obj.__synthesizer.gainWobbleDepth(value); },
                                    }},
                                //detuneWobblePeriod dial
                                    {type:'text', name:'detuneWobble', data:{x: 98, y: 70, angle: -Math.PI/2, text: 'detune', style: style.h2}},    
                                    {type:'text', name:'detuneWobblePeriod_gain', data:{x: 105,   y: 84,      text: 'rate',   style: style.h1}},
                                    {type:'text', name:'detuneWobblePeriod_0',    data:{x: 100,   y: 77,      text: '0',      style: style.h2}},
                                    {type:'text', name:'detuneWobblePeriod_50',   data:{x: 111.5, y: 49,      text: '50',     style: style.h2}},
                                    {type:'text', name:'detuneWobblePeriod_100',  data:{x: 126,   y: 77,      text: '100',    style: style.h2}},
                                    {type:'dial_continuous',name:'detuneWobblePeriod',data:{
                                        x: 114, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                        onchange: function(value){ obj.__synthesizer.detuneWobblePeriod( (1-value)<0.01?0.011:(1-value) ); }
                                    }},
                                //detuneWobbleDepth dial
                                    {type:'text', name:'detuneWobbleDepth_gain', data:{x: 140,   y: 84, text: 'depth', style: style.h1}},
                                    {type:'text', name:'detuneWobbleDepth_0',    data:{x: 135,   y: 77, text: '0',     style: style.h2}},
                                    {type:'text', name:'detuneWobbleDepth_50',   data:{x: 145.5, y: 49, text: '1/2',   style: style.h2}},
                                    {type:'text', name:'detuneWobbleDepth_100',  data:{x: 161,   y: 77, text: '1',     style: style.h2}},
                                    {type:'dial_continuous',name:'detuneWobbleDepth',data:{
                                        x: 149, y: 65, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                        style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                        onchange: function(value){ obj.__synthesizer.detuneWobbleDepth(value*100); }
                                    }},
                    
                                {type:'button_rect', name:'panicButton', data: {
                                    x:197.5, y: 47.5, width:20, height:20, angle: Math.PI/4,
                                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' }, 
                                    onpress:function(){ obj.__synthesizer.panic(); },
                                }},
                    
                                {type:'path', name:'selectionGlow', data:{
                                    path:[{x:0,y:0},{x:240,y:0},{x:240,y:40},{x:190,y:90},{x:0,y:90},{x:0,y:0}],
                                    style:style.selectionGlow.off,
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.basicSynthesizer,design);
                    
                        //import/export
                            obj.exportData = function(){
                                return {
                                    gain:design.dial_continuous.gain.get(),
                                    attack:design.dial_continuous.attack.get()*10,
                                    release:design.dial_continuous.release.get()*10,
                                    detune:100*((design.dial_continuous.detune.get()*2)-1),
                                    octave:design.dial_discrete.octave.select()-3,
                                    waveType:['sine','triangle','square','sawtooth','custom'][design.dial_discrete.waveType.select()],
                                    gainWobble:{
                                        rate:design.dial_continuous.gainWobblePeriod.get()*100,
                                        depth:design.dial_continuous.gainWobbleDepth.get()
                                    },
                                    detuneWobble:{
                                        rate:design.dial_continuous.detuneWobblePeriod.get()*100,
                                        depth:design.dial_continuous.detuneWobbleDepth.get()
                                    },
                                };
                            };
                            obj.importData = function(data){
                                design.dial_continuous.gain.set(data.gain);
                                design.dial_continuous.attack.set(data.attack/10);
                                design.dial_continuous.release.set(data.release/10);
                                design.dial_continuous.detune.set( (1+(data.detune/100))/2 );
                                design.dial_discrete.octave.select(data.octave+3);
                                design.dial_discrete.waveType.select( ['sine','triangle','square','sawtooth','custom'].indexOf(data.waveType) );
                                design.dial_continuous.gainWobblePeriod.set(data.gainWobble.rate/100);
                                design.dial_continuous.gainWobbleDepth.set(data.gainWobble.depth);
                                design.dial_continuous.detuneWobblePeriod.set(data.detuneWobble.rate/100);
                                design.dial_continuous.detuneWobbleDepth.set(data.detuneWobble.depth);
                            };
                    
                        //selection
                            obj.onSelect = function(){
                                system.utility.element.setStyle(design.path.selectionGlow,style.selectionGlow.on);
                            };
                            obj.onDeselect = function(){
                                system.utility.element.setStyle(design.path.selectionGlow,style.selectionGlow.off);
                            };
                    
                        //circuitry
                            obj.__synthesizer = new part.circuit.audio.synthesizer2(system.audio.context);
                            obj.__synthesizer.out().connect( design.connectionNode_audio.audioOut.in() );
                    
                        //interface
                            obj.i = {
                                gain:function(value){design.dial_continuous.gain.set(value);},
                                attack:function(value){design.dial_continuous.attack.set(value);},
                                release:function(value){design.dial_continuous.release.set(value);},
                                detune:function(value){design.dial_continuous.detune.set(value);},
                                octave:function(value){design.dial_discrete.octave.select(value);},
                                waveType:function(value){design.dial_discrete.waveType.select(value);},
                                periodicWave:function(data){obj.__synthesizer.periodicWave(data);},
                                midiNote:function(data){obj.__synthesizer.perform(data);},
                                gainWobblePeriod:function(value){design.dial_continuous.gainWobblePeriod.set(value);},
                                gainWobbleDepth:function(value){design.dial_continuous.gainWobbleDepth.set(value);},
                                detuneWobblePeriod:function(value){design.dial_continuous.detuneWobblePeriod.set(value);},
                                detuneWobbleDepth:function(value){design.dial_continuous.detuneWobbleDepth.set(value);},
                            };
                    
                        //setup
                            design.dial_continuous.gain.set(0.5);
                            design.dial_continuous.detune.set(0.5);
                            design.dial_discrete.octave.select(3);
                    
                        return obj;
                    };
                    
                    this.basicSynthesizer.metadata = {
                        name:'Basic Synthesizer',
                        helpurl:'https://metasophiea.com/curve/help/objects/basicSynthesizer/'
                    };
                    this.pulseGenerator_hyper = function(x,y,maxTempo=999,debug=false){
                    
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',
                    
                            dial:{
                                handle: 'fill:rgba(220,220,220,1)',
                                slot: 'fill:rgba(50,50,50,1)',
                                needle: 'fill:rgba(250,150,150,1)',
                                arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                            }
                        };
                        var design = {
                            name: 'pulseGenerator_hyper',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                type:'path',
                                points:[
                                    {x:0,y:10},{x:10,y:0},
                                    {x:100,y:0},{x:115,y:10},
                                    {x:115,y:30},{x:100,y:40},
                                    {x:10,y:40},{x:0,y:30}
                                ], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_data', name:'out', data:{
                                    x: -5, y: 11.25, width: 5, height: 17.5,
                                }},
                                {type:'connectionNode_data', name:'sync', data:{
                                    x: 115, y: 11.25, width: 5, height: 17.5,
                                    receive:function(){design.button_rect.sync.press();},
                                }},
                                {type:'button_rect', name:'sync', data:{
                                    x:102.5, y: 11.25, width:10, height: 17.5,
                                    style:{
                                        up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', 
                                        down:'fill:rgba(150,150,150,1)', glow:'fill:rgba(220,200,220,1)'
                                    }, 
                                    onclick:function(){updateTempo(tempo)},
                                }},
                                {type:'dial_continuous',name:'tempo',data:{
                                    x:20, y:20, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){updateTempo(Math.round(value*maxTempo));}
                                }},
                                {type:'readout_sixteenSegmentDisplay',name:'readout',data:{
                                    x:40, y:10, width:60, height:20, count:6,
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.pulseGenerator_hyper,design);
                    
                        //import/export
                            obj.exportData = function(){
                                return design.dial_continuous.tempo.get();
                            };
                            obj.importData = function(data){
                                design.dial_continuous.tempo.set(data);
                            };
                    
                        //internal functions
                            var interval = null;
                            var tempo = 120;
                            function updateTempo(newTempo){
                                //update readout
                                    design.readout_sixteenSegmentDisplay.readout.text(
                                        system.utility.misc.padString(newTempo,3,' ')+'bpm'
                                    );
                                    design.readout_sixteenSegmentDisplay.readout.print();
                    
                                //update interval
                                    if(interval){ clearInterval(interval); }
                                    if(newTempo > 0){
                                        interval = setInterval(function(){
                                            obj.io.out.send('pulse');
                                        },1000*(60/newTempo));
                                    }
                    
                                obj.io.out.send('pulse');
                                tempo = newTempo;
                            }
                    
                        //interface
                            obj.i = {
                                setTempo:function(value){
                                    design.dial_continuous.tempo.set(value);
                                },
                            };
                    
                        //setup
                            design.dial_continuous.tempo.set(0.5);
                    
                        return obj;
                    };
                    
                    this.pulseGenerator_hyper.metadata = {
                        name:'Pulse Generator (hyper)',
                        helpurl:'https://metasophiea.com/curve/help/objects/pulseGenerator_hyper/'
                    };
                    this.pulseGenerator = function(x,y,debug=false){
                        var maxTempo = 240;
                    
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',
                    
                            dial:{
                                handle: 'fill:rgba(220,220,220,1)',
                                slot: 'fill:rgba(50,50,50,1)',
                                needle: 'fill:rgba(250,150,150,1)',
                                arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                            }
                        };
                        var design = {
                            name: 'pulseGenerator',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                type:'path',
                                points:[
                                    {x:0,y:10},{x:10,y:0},
                                    {x:100,y:0},{x:115,y:10},
                                    {x:115,y:30},{x:100,y:40},
                                    {x:10,y:40},{x:0,y:30}
                                ], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_data', name:'out', data:{
                                    x: -5, y: 11.25, width: 5, height: 17.5,
                                }},
                                {type:'connectionNode_data', name:'sync', data:{
                                    x: 115, y: 11.25, width: 5, height: 17.5,
                                    receive:function(){design.button_rect.sync.press();},
                                }},
                                {type:'button_rect', name:'sync', data:{
                                    x:102.5, y: 11.25, width:10, height: 17.5,
                                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' }, 
                                    onpress:function(){updateTempo(tempo)},
                                }},
                                {type:'dial_continuous',name:'tempo',data:{
                                    x:20, y:20, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){updateTempo(Math.round(value*maxTempo));}
                                }},
                                {type:'readout_sixteenSegmentDisplay',name:'readout',data:{
                                    x:40, y:10, width:60, height:20, count:6,
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.pulseGenerator,design);
                    
                        //import/export
                            obj.exportData = function(){
                                return design.dial_continuous.tempo.get();
                            };
                            obj.importData = function(data){
                                design.dial_continuous.tempo.set(data);
                            };
                    
                        //internal functions
                            var interval = null;
                            var tempo = 120;
                            function updateTempo(newTempo){
                                //update readout
                                    design.readout_sixteenSegmentDisplay.readout.text(
                                        system.utility.misc.padString(newTempo,3,' ')+'bpm'
                                    );
                                    design.readout_sixteenSegmentDisplay.readout.print();
                    
                                //update interval
                                    if(interval){ clearInterval(interval); }
                                    if(newTempo > 0){
                                        interval = setInterval(function(){
                                            obj.io.out.send('pulse');
                                        },1000*(60/newTempo));
                                    }
                    
                                obj.io.out.send('pulse');
                                tempo = newTempo;
                            }
                    
                        //interface
                            obj.i = {
                                setTempo:function(value){
                                    design.dial_continuous.tempo.set(value);
                                },
                            };
                    
                        //setup
                            design.dial_continuous.tempo.set(0.5);
                    
                        return obj;
                    };
                    
                    this.pulseGenerator.metadata = {
                        name:'Pulse Generator',
                        helpurl:'https://metasophiea.com/curve/help/objects/pulseGenerator/'
                    };
                    this.musicalkeyboard = function(x,y,debug=false){
                        var state = {
                            velocity:0.5,
                        };
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            h1: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
                            dial:{
                                handle: 'fill:rgba(220,220,220,1)',
                                slot: 'fill:rgba(50,50,50,1)',
                                needle: 'fill:rgba(250,150,150,1)',
                                arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                            },
                            keys:{
                                white:{
                                    off:'fill:rgba(250,250,250,1)',
                                    press:'fill:rgba(230,230,230,1)',
                                    glow:'fill:rgba(220,200,220,1)',
                                    pressAndGlow:'fill:rgba(200,150,200,1)',
                                },
                                black:{
                                    off:'fill:rgba(50,50,50,1)',
                                    press:'fill:rgba(100,100,100,1)',
                                    glow:'fill:rgba(220,200,220,1)',
                                    pressAndGlow:'fill:rgba(200,150,200,1)',
                                }
                            }
                        };
                        var design = {
                            name: 'musicalkeyboard',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                type:'path',
                                points:[ {x:0,y:0}, {x:320,y:0}, {x:320,y:62.5}, {x:0,y:62.5} ], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_data', name:'midiout', data:{ 
                                    x: -5, y: 5, width: 5, height: 10,
                                }},
                                {type:'connectionNode_data', name:'midiin', data:{ 
                                    x: 320, y: 5, width: 5, height: 10,
                                    receive:function(address,data){
                                        if(address != 'midinumber'){return;}
                                        if(data.velocity > 0){ design.button_rect[system.audio.num2name(data.num)].press();   }
                                                         else{ design.button_rect[system.audio.num2name(data.num)].release(); }
                                    },
                                }},
                    
                                //velocity dial
                                {type:'label', name:'velocity_title', data:{x:9,  y:59,   text:'velocity', style:style.h1}},
                                {type:'label', name:'velocity_0',     data:{x:4,  y:55,   text:'0',        style:style.h1}},
                                {type:'label', name:'velocity_1/2',   data:{x:14, y:26.5, text:'1/2',      style:style.h1}},
                                {type:'label', name:'velocity_1',     data:{x:28, y:55,   text:'1',        style:style.h1}},
                                {type:'dial_continuous',name:'velocity',data:{
                                    x:17.5, y:42, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                                    onchange:function(value){ state.velocity = value; }
                                }},
                            ]
                        };
                        //dynamic design
                            //placement of keys
                                var glyphs = [ '\\','a','z','s','x','c','f','v','g','b','h','n','m','k',',','l','.','/', '1','q','2','w','3','e','r','5','t','6','y','u','8','i','9','o','0','p','[' ];
                                var noteNames = [ '4C', '4C#', '4D', '4D#', '4E', '4F', '4F#', '4G', '4G#', '4A', '4A#', '4B', '5C', '5C#', '5D', '5D#', '5E', '5F', '5F#', '5G', '5G#', '5A', '5A#', '5B', '6C', '6C#', '6D', '6D#', '6E', '6F', '6F#', '6G', '6G#', '6A', '6A#', '6B', '7C' ];
                                var whiteX = 35;
                                var whiteKeyWidth = 12.5;
                                var blackX = 45;
                    
                                for(var a = 0; a < glyphs.length; a++){
                                    if( noteNames[a].slice(-1) != '#' ){
                                        design.elements.push(
                                            {type:'button_rect', name:noteNames[a], data:{
                                                x:whiteX, y:12.5, width:whiteKeyWidth, height:50, hoverable:false,
                                                style:{
                                                    up:style.keys.white.off, press:style.keys.white.press,
                                                    glow:style.keys.white.glow, glow_press:style.keys.white.pressAndGlow,
                                                },
                                                onpress:function(){ obj.io.midiout.send('midinumber', { num:system.audio.name2num(this.id), velocity:state.velocity } ); },
                                                onrelease:function(){ obj.io.midiout.send('midinumber', { num:system.audio.name2num(this.id), velocity:0 } ); },
                                            }}
                                        );
                                        whiteX += whiteKeyWidth;
                                    }
                                }
                    
                                var count = 0;
                                for(var a = 0; a < glyphs.length; a++){
                                    if( noteNames[a].slice(-1) == '#' ){
                                        design.elements.push(
                                            {type:'button_rect', name:noteNames[a], data:{
                                                x:blackX, y:12.5, width:5, height:30, hoverable:false,
                                                style:{
                                                    up:style.keys.black.off, press:style.keys.black.press,
                                                    glow:style.keys.black.glow, glow_press:style.keys.black.pressAndGlow,
                                                },
                                                onpress:function(){ obj.io.midiout.send('midinumber', { num:system.audio.name2num(this.id), velocity:state.velocity } ); },
                                                onrelease:function(){ obj.io.midiout.send('midinumber', { num:system.audio.name2num(this.id), velocity:0 } ); },
                                            }}
                                        );
                                        blackX += whiteKeyWidth;
                                        count = 0;
                                    }else{ count++; }
                                    
                                    if(count > 1){ blackX += whiteKeyWidth; }
                                }
                    
                    
                        //main object
                            var obj = object.builder(object.alpha.musicalkeyboard,design);
                    
                        //keycapture
                            var keycaptureObj = system.keyboard.declareKeycaptureObject(obj,{none:glyphs});
                            keycaptureObj.keyPress = function(key){ design.button_rect[noteNames[glyphs.indexOf(key)]].press(); };
                            keycaptureObj.keyRelease = function(key){ design.button_rect[noteNames[glyphs.indexOf(key)]].release(); };
                    
                        //interface
                            obj.i = {
                                velocity:function(a){design.dial_continuous.velocity.set(a);},
                            };
                    
                        //setup
                            design.dial_continuous.velocity.set(0.5);
                    
                        return obj;
                    };
                    
                    this.musicalkeyboard.metadata = {
                        name:'Musical Keyboard',
                        helpurl:'https://metasophiea.com/curve/help/objects/musicalKeyboard/'
                    };
                    this.audioIn = function(x,y,setupConnect=true){
                        var attributes = {
                            deviceList:[],
                            currentSelection: 0
                        };
                        var style = {
                            background: 'fill:rgba(200,200,200,1); stroke:none;',
                            marking:'fill:none; stroke:rgb(160,160,160); stroke-width:1;pointer-events: none;',
                            h1:'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
                            h2:'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
                    
                            readout: {background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'},
                            button: { up:'fill:rgba(220,220,220,1)', hover:'fill:rgba(230,230,230,1)', hover_press:'fill:rgba(180,180,180,1)'},
                            dial: {handle:'fill:rgba(220,220,220,1)', slot:'fill:rgba(50,50,50,1)',needle: 'fill:rgba(250,150,150,1)',outerArc:'fill:none; stroke:rgb(150,150,150); stroke-width:1;'},
                        };
                        var design = {
                            name:'audioIn',
                            collection: 'alpha',
                            x:x, y:y,
                            base:{
                                points:[
                                    {x:0,y:10},{x:10,y:10},{x:22.5,y:0},{x:37.5,y:0},{x:50,y:10},{x:245,y:10},
                                    {x:245,y:40},{x:50,y:40},{x:37.5,y:50},{x:22.5,y:50},{x:10,y:40},{x:0,y:40}
                                ], 
                                style:style.background
                            },
                            elements:[
                                    {type:'connectionNode_audio', name:'audioOut', data:{type: 1, x: -10, y: 15, width: 20, height: 20}},
                                    {type:'readout_sixteenSegmentDisplay', name:'index', data:{x: 70, y: 15, angle:0, width:50, height:20, count:5, style:style.readout}},
                                    {type:'readout_sixteenSegmentDisplay', name:'text',  data:{x: 122.5, y: 15, angle:0, width:100, height:20, count:10, style:style.readout}},
                                    {type:'button_rect', name:'up',   data:{x:225, y: 15, width:15, height:10, selectable:false, style:style.button, onpress:function(){incSelection();}}},
                                    {type:'button_rect', name:'down', data:{x:225, y: 25, width:15, height:10, selectable:false, style:style.button, onpress:function(){decSelection();}}},
                                    {type:'dial_continuous', name:'outputGain', data:{x: 30, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, style:style.dial, onchange:function(value){obj.circuitry.unit.gain(value*2);}}},
                                    {type:'label', name:'gainLabel_name', data:{x:21.25, y:44, text:'gain', style:style.h1, angle:0}},
                                    {type:'label', name:'gainLabel_0',    data:{x:15, y:40, text:'0', style:style.h2, angle:0}},
                                    {type:'label', name:'gainLabel_1',    data:{x:28.75, y:7, text:'1', style:style.h2, angle:0}},
                                    {type:'label', name:'gainLabel_2',    data:{x:42.5, y:40, text:'2', style:style.h2, angle:0}},
                                    {type:'path', name:'upArrow',   data:{path:[{x:227.5,y:22.5},{x:232.5,y:17.5},{x:237.5,y:22.5}], style:style.marking}},
                                    {type:'path', name:'downArrow', data:{path:[{x:227.5,y:27.5},{x:232.5,y:32.5},{x:237.5,y:27.5}], style:style.marking}},
                                    {type:'audio_meter_level', name:'audioIn',data:{x:50, y:15, width:17.5, height:20}},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.audioIn,design);
                    
                            var keycaptureObj = system.keyboard.declareKeycaptureObject(obj,{none:['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']});
                                keycaptureObj.keyPress = function(key){
                                    switch(key){
                                        case 'ArrowUp': design.button_rect.up.press();  break;
                                        case 'ArrowDown': design.button_rect.down.press();  break;
                                        case 'ArrowLeft': design.dial_continuous.outputGain.set(design.dial_continuous.outputGain.get()-0.1);  break;
                                        case 'ArrowRight': design.dial_continuous.outputGain.set(design.dial_continuous.outputGain.get()+0.1);  break;
                                    }
                                };
                    
                    
                        //circuitry
                            obj.circuitry = {
                                unit: new part.circuit.audio.audioIn(system.audio.context,setupConnect)
                            };
                            obj.circuitry.unit.out().connect( design.connectionNode_audio.audioOut.in() );
                            obj.circuitry.unit.out().connect( design.audio_meter_level.audioIn.audioIn() );
                    
                        //internal functions
                            function selectDevice(a){
                                if(attributes.deviceList.length == 0){
                                    design.readout_sixteenSegmentDisplay.index.text(' n/a');
                                    design.readout_sixteenSegmentDisplay.index.print();
                                    design.readout_sixteenSegmentDisplay.text.text('no devices');
                                    design.readout_sixteenSegmentDisplay.text.print('smart');
                                    return;
                                }
                                if( a < 0 || a >= attributes.deviceList.length ){return;}
                                attributes.currentSelection = a;
                    
                                selectionNum=''+(a+1);while(selectionNum.length < 2){ selectionNum = '0'+selectionNum;}
                                totalNum=''+attributes.deviceList.length;while(totalNum.length < 2){ totalNum = '0'+totalNum;}
                                design.readout_sixteenSegmentDisplay.index.text(selectionNum+'/'+totalNum);
                                design.readout_sixteenSegmentDisplay.index.print();
                    
                                var text = attributes.deviceList[a].deviceId;
                                if(attributes.deviceList[a].label.length > 0){text = attributes.deviceList[a].label +' - '+ text;}
                                design.readout_sixteenSegmentDisplay.text.text(text);
                                design.readout_sixteenSegmentDisplay.text.print('smart');
                    
                                obj.circuitry.unit.selectDevice( attributes.deviceList[a].deviceId );
                            }
                            function incSelection(){ selectDevice(attributes.currentSelection+1); }
                            function decSelection(){ selectDevice(attributes.currentSelection-1); }
                    
                        //setup
                            obj.circuitry.unit.listDevices(function(a){attributes.deviceList=a;});
                            if(setupConnect){setTimeout(function(){selectDevice(0);},500);}
                            design.dial_continuous.outputGain.set(0.5);
                            design.audio_meter_level.audioIn.start();
                    
                        return obj;
                    };
                    
                    this.audioIn.metadata = {
                        name:'Audio Input',
                        helpurl:'https://metasophiea.com/curve/help/objects/audioInput/'
                    };
                    this.data_duplicator = function(x,y){
                        var style = {
                            background:'fill:rgba(200,200,200,1);pointer-events:none;',
                            markings: 'fill:rgba(150,150,150,1); pointer-events:none;',
                        };
                        var design = {
                            name:'data_duplicator',
                            collection: 'alpha',
                            x:x, y:y,
                            base:{
                                points:[{x:0,y:0},{x:55,y:0},{x:55,y:55},{x:0,y:55}],
                                style:'fill:rgba(200,200,200,0);'
                            },
                            elements:[
                                {type:'connectionNode_data', name:'output_1', data:{ x:-10, y:5, width:20, height:20 }},
                                {type:'connectionNode_data', name:'output_2', data:{ x:-10, y:30, width:20, height:20 }},
                                {type:'connectionNode_data', name:'input', data:{ 
                                    x:45, y:5, width:20, height:20,
                                    receive:function(address,data){
                                        obj.io.output_1.send(address,data);
                                        obj.io.output_2.send(address,data);
                                    }
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
                            var obj = object.builder(object.alpha.data_duplicator,design);
                        
                        return obj;
                    
                    };
                    
                    this.data_duplicator.metadata = {
                        name:'Data Duplicator',
                        helpurl:'https://metasophiea.com/curve/help/objects/dataDuplicator/'
                    };
                    
                    //Operation Note:
                    //  Data signals that are sent into the 'in' port, are duplicated and sent out the two 'out' ports
                    //  They are not sent out at the same time; signals are produced from the 1st 'out' port first and 
                    //  then the 2nd port
                    this.recorder = function(x,y,debug=false){
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            text:'fill:rgba(0,0,0,1); font-size:5px; font-family:Courier New; pointer-events: none;',
                            buttonText:'fill:rgba(100,100,100,1); font-size:5px; font-family:Courier New; pointer-events: none;',
                            logoText:'fill:rgba(100,100,100,1); font-size:8px; font-family:Bookman; pointer-events: none;',
                        };
                        var design = {
                            name: 'recorder',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[{x:0,y:0},{x:175,y:0},{x:175,y:40},{x:0,y:40}], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'inRight',  data: {type: 0, x: 175, y: 2.5, width: 10, height: 15}},
                                {type:'connectionNode_audio', name:'inLeft',   data: {type: 0, x: 175, y: 22.5, width: 10, height: 15}},
                    
                    
                                //logo label
                                    {type:'rect', name:'logo_rect', data:{x:135, y:27.5, angle:-0.25, width:35, height:10, style:'fill:rgb(230,230,230)'}},
                                    {type:'label', name:'logo_label', data:{x:139, y:34.5, angle:-0.25, text:'REcorder', style:style.logoText}},
                    
                                //rec
                                    {type:'button_rect', name:'rec', data: {
                                        x:5, y: 25, width:20, height:10,
                                        style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                        onpress: function(){
                                            if(state == 'paused'){obj.recorder.resume();}
                                            else{obj.recorder.start();}
                                            updateLights('rec');
                                        }
                                    }},
                                    {type:'text', name:'button_rect_text', data:{x:10.5, y:31.5, text:'rec', angle:0, style:style.buttonText}},
                                //pause/resume
                                    {type:'button_rect', name:'pause/resume', data: {
                                        x:27.5, y: 25, width:20, height:10,
                                        style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                        onpress: function(){
                                            if(state == 'paused'){obj.recorder.resume();}
                                            else{obj.recorder.pause();}
                                            updateLights('pause/resume');
                                        }
                                    }},
                                    {type:'text', name:'button_pause/resume_text', data:{x:30, y:31.5, text:'pause', angle:0, style:style.buttonText}},
                                //stop
                                    {type:'button_rect', name:'stop', data: {
                                        x:50, y: 25, width:20, height:10,
                                        style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                        onpress: function(){updateLights('stop');obj.recorder.stop();}
                                    }},
                                    {type:'text', name:'button_stop_text', data:{x:54, y:31.5, text:'stop', angle:0, style:style.buttonText}},
                                //save
                                    {type:'button_rect', name:'save', data: {
                                        x:72.5, y: 25, width:20, height:10, 
                                        style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                        onpress: function(){
                                            updateLights('save');
                                            if(state != 'empty'){ obj.recorder.save(); }
                                        }
                                    }},
                                    {type:'text', name:'button_save_text', data:{x:76.5, y:31.5, text:'save', angle:0, style:style.buttonText}},
                                //clear
                                    {type:'button_rect', name:'clear', data: {
                                        x:95, y: 25, width:20, height:10, 
                                        style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                        onpress: function(){updateLights('clear');obj.recorder.clear();}
                                    }},
                                    {type:'text', name:'button_clear_text', data:{x:97.5, y:31.5, text:'clear', angle:0, style:style.buttonText}},
                    
                                //time readout
                                    {type:'readout_sixteenSegmentDisplay', name:'time', data:{
                                        x: 70, y: 5, angle:0, width:100, height:15, count:11, 
                                        style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                                    }},
                    
                                //activity lights
                                    //recording
                                        {type:'glowbox_rect', name:'activityLight_recording', data:{x:5, y:5, width:15, height:15, style:{glow:'fill:rgb(255, 63, 63)', dim:'fill:rgb(25, 6, 6)'}}},
                                        {type:'text', name:'activityLight_recording_text', data:{x:8, y:14, text:'rec', angle:0, style:style.text}},
                                    //paused
                                        {type:'glowbox_rect', name:'activityLight_paused', data:{x:20, y:5, width:15, height:15, style:{glow:'fill:rgb(126, 186, 247)', dim:'fill:rgb(12, 18, 24)'}}},
                                        {type:'text', name:'activityLight_paused_text', data:{x:23, y:14, text:'pau', angle:0, style:style.text}},
                                    //empty
                                        {type:'glowbox_rect', name:'activityLight_empty', data:{x:35, y:5, width:15, height:15, style:{glow:'fill:rgb(199, 249, 244)', dim:'fill:rgb(19, 24, 24)'}}},
                                        {type:'text', name:'activityLight_empty_text', data:{x:38, y:14, text:'emp', angle:0, style:style.text}},
                                    //ready to save
                                        {type:'glowbox_rect', name:'activityLight_full', data:{x:50, y:5, width:15, height:15, style:{glow:'fill:rgb(61, 224, 35)', dim:'fill:rgb(6, 22, 3)'}}},
                                        {type:'text', name:'activityLight_full_text', data:{x:53, y:14, text:'ful', angle:0, style:style.text}},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.recorder,design);
                    
                        //circuitry
                            //update functions
                                //time readout
                                    setInterval(function(){
                                        var time = obj.recorder.recordingTime();
                                        var decimalValues = time % 1;
                                        time = system.utility.math.seconds2time( Math.round(time) );
                    
                                        design.readout_sixteenSegmentDisplay.time.text(
                                            system.utility.misc.padString(time.h,2,'0')+':'+
                                            system.utility.misc.padString(time.m,2,'0')+':'+
                                            system.utility.misc.padString(time.s,2,'0')+'.'+
                                            system.utility.misc.padString((''+decimalValues).slice(2),2,'0')
                                        );
                                        design.readout_sixteenSegmentDisplay.time.print();
                                    },100);
                                //lights
                                    var state = 'empty'; //empty - recording - paused - full
                                    function updateLights(action){
                                        if( state == 'empty' && (action == 'save' || action == 'stop') ){return;}
                                        if( action == 'stop' || action == 'save' ){ state = 'full'; }
                                        if( state == 'empty' && action == 'rec' ){ state = 'recording'; }
                                        if( action == 'clear' ){ state = 'empty'; }
                                        if( state == 'recording' && action == 'pause/resume' ){ state = 'paused'; }
                                        else if( state == 'paused' && (action == 'pause/resume' || action == 'rec') ){ state = 'recording'; }
                    
                                        if(state == 'empty'){design.glowbox_rect.activityLight_empty.on();}else{design.glowbox_rect.activityLight_empty.off();}
                                        if(state == 'recording'){design.glowbox_rect.activityLight_recording.on();}else{design.glowbox_rect.activityLight_recording.off();}
                                        if(state == 'paused'){design.glowbox_rect.activityLight_paused.on();}else{design.glowbox_rect.activityLight_paused.off();}
                                        if(state == 'full'){design.glowbox_rect.activityLight_full.on();}else{design.glowbox_rect.activityLight_full.off();}
                                    }
                                    updateLights('clear');
                                    design.glowbox_rect.activityLight_empty.on();
                    
                            //audio recorder
                                obj.recorder = new part.circuit.audio.recorder(system.audio.context);
                                design.connectionNode_audio.inRight.out().connect( obj.recorder.in_right() );
                                design.connectionNode_audio.inLeft.out().connect( obj.recorder.in_left() );
                    
                        return obj;
                    };
                    
                    this.recorder.metadata = {
                        name:'Recorder',
                        helpurl:'https://metasophiea.com/curve/help/objects/recorder/'
                    };

                    this.looper = function(x,y,debug=false){
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
                            strokeMarkings: 'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
                        };
                        var design = {
                            name: 'looper',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'outRight', data:{ type: 1, x: -10, y: 5, width: 10, height: 20 }},
                                {type:'connectionNode_audio', name:'outLeft', data:{ type: 1, x: -10, y: 27.5, width: 10, height: 20 }},
                                {type:'connectionNode_data', name:'trigger', data:{
                                    x: 220, y: 17.5, width: 10, height: 20,
                                    receive:function(address, data){ design.button_rect.fire.press(); }
                                }},
                    
                                //symbol
                                {type:'circle', name:'symbol_outterCircle1', data:{ x:11.5, y:41, r:6, style:style.strokeMarkings }},
                                {type:'circle', name:'symbol_outterCircle2', data:{ x:18.5, y:41, r:6, style:style.strokeMarkings }},
                                {type:'rect', name:'symbol_blockingrect', data:{ x:11.5, y:34, width:7, height:15, style:style.background }},
                                {type:'path', name:'symbol_upperarrow', data:{ path:[{x:13.5, y:32.5},{x:16.5, y:35},{x:13.5, y:37.5}], style:style.strokeMarkings }},
                                {type:'path', name:'symbol_lowerarrow', data:{ path:[{x:16.5, y:44.75},{x:13.5, y:47.25},{x:16.5, y:49.75}], style:style.strokeMarkings }},
                    
                                {type:'button_rect', name:'loadFile', data: {
                                    x:5, y: 5, width:20, height:10,
                                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                    onpress: function(){
                                        obj.looper.load('file',function(data){
                                            design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.looper.waveformSegment() );
                                        });
                                    }
                                }},
                                {type:'button_rect',name:'fire',data:{
                                    x:5, y: 17.5, width:10, height:10,
                                    style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                                    onpress:function(){
                                        //no file = don't bother
                                            if(obj.looper.duration() < 0){return;}
                                
                                        //actualy start the audio
                                            obj.looper.start();
                    
                                        //perform graphical movements
                                            var duration = obj.looper.duration();
                                            function func(){
                                                //if there's already a needle; delete it
                                                if(needle){
                                                    design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0);
                                                    clearTimeout(needleTimout);
                                                }
                    
                                                //create new needle, and send it on its way
                                                design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0,0,'transition: transform '+duration+'s;transition-timing-function: linear;');
                                                setTimeout(function(){design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0,1);},1);
                                                needle = true;
                    
                                                //prep the next time this function should be run
                                                needleTimout = setTimeout(func,duration*1000);
                                            }
                    
                                            func();
                                    }
                                }},
                                {type:'button_rect',name:'stop',data:{
                                    x:15, y: 17.5, width:10, height:10,
                                    style:{ up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', hover_press:'fill:rgba(170,150,150,1)' }, 
                                    onpress:function(){
                                        obj.looper.stop();
                    
                                        //if there's a needle, remove it
                                        if(needle){
                                            design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0);
                                            needle = false;
                                            clearTimeout(needleTimout);
                                        }
                                    }
                                }},
                    
                                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                                    x:30, y:5, width:185, height:45, selectNeedle:false, selectionArea:false,
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.looper,design);
                    
                        //circuitry
                                var needle = undefined;
                                var needleTimout = undefined;
                    
                            //audioFilePlayer
                                obj.looper = new part.circuit.audio.looper(system.audio.context);
                                obj.looper.out_right().connect( design.connectionNode_audio.outRight.in() );
                                obj.looper.out_left().connect( design.connectionNode_audio.outLeft.in() );
                    
                        return obj;
                    };
                    
                    this.looper.metadata = {
                        name:'Looper',
                        helpurl:'https://metasophiea.com/curve/help/objects/looper/'
                    };
                    this.oneShot_single = function(x,y,debug=false){
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
                            strokeMarkings: 'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
                        };
                        var design = {
                            name: 'oneShot_single',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'outRight', data:{ type: 1, x: -10, y: 5, width: 10, height: 20 }},
                                {type:'connectionNode_audio', name:'outLeft', data:{ type: 1, x: -10, y: 27.5, width: 10, height: 20 }},
                                {type:'connectionNode_data', name:'trigger', data:{
                                    x: 220, y: 17.5, width: 10, height: 20,
                                    receive:function(address, data){ design.button_rect.fire.press(); design.button_rect.fire.release(); }
                                }},
                    
                                //symbol
                                {type:'path', name:'symbol_arrow', data:{ path:[{x:19, y:35},{x:25,y:40},{x:19, y:45}], style:style.strokeMarkings }},
                                {type:'rect', name:'symbol_line', data:{ x:15, y:39.5, width:6, height:1, style:style.markings }},
                                {type:'circle', name:'symbol_outterCircle', data:{ x:10, y:40, r:5.5, style:style.strokeMarkings }},
                                {type:'rect', name:'symbol_1', data:{ x:9.5, y:37.5, width:1, height:5, style:style.markings }},
                    
                                {type:'button_rect', name:'loadFile', data: {
                                    x:5, y: 5, width:20, height:10,
                                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                    onpress: function(){
                                        obj.oneShot.load('file',function(data){
                                            design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.oneShot.waveformSegment() );
                                        });
                                    }
                                }},
                                {type:'button_rect',name:'fire',data:{
                                    x:5, y: 17.5, width:20, height:10,
                                    style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                                    onpress:function(){
                                        //no file = don't bother
                                            if(obj.oneShot.duration() < 0){return;}
                                
                                        //actualy start the audio
                                            obj.oneShot.fire();
                    
                                        //if there's a playhead, remove it
                                            if(playhead){
                                                design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0);
                                                playhead = false;
                                                clearTimeout(playheadTimout);
                                            }
                    
                                        //perform graphical movements
                                            var duration = obj.oneShot.duration();
                                            design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0,0,'transition: transform '+duration+'s;transition-timing-function: linear;');
                                            playhead = true;
                                            setTimeout(function(){design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0,1);},1);
                                            playheadTimout = setTimeout(function(){
                                                design.grapher_waveWorkspace.grapher_waveWorkspace.genericNeedle(0);
                                                playhead = false;
                                            },duration*1000);
                                    }
                                }},
                    
                                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                                    x:30, y:5, width:185, height:45, selectNeedle:false, selectionArea:false,
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.oneShot_single,design);
                    
                        //circuitry
                                var playhead = undefined;
                                var playheadTimout = undefined;
                    
                            //audioFilePlayer
                                obj.oneShot = new part.circuit.audio.oneShot_single(system.audio.context);
                                obj.oneShot.out_right().connect( design.connectionNode_audio.outRight.in() );
                                obj.oneShot.out_left().connect( design.connectionNode_audio.outLeft.in() );
                    
                        return obj;
                    };
                    
                    this.oneShot_single.metadata = {
                        name:'One Shot (Single)',
                        helpurl:'https://metasophiea.com/curve/help/objects/oneShot_single/'
                    };
                    

                    this.oneShot_multi = function(x,y,debug=false){
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
                            strokeMarkings: 'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
                        };
                        var design = {
                            name: 'oneShot_multi',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[{x:0,y:0},{x:220,y:0},{x:220,y:55},{x:0,y:55}], 
                                style:style.background
                            },
                            elements:[
                                //connection nodes
                                    {type:'connectionNode_audio', name:'outRight', data:{ type: 1, x: -10, y: 5, width: 10, height: 20 }},
                                    {type:'connectionNode_audio', name:'outLeft', data:{ type: 1, x: -10, y: 27.5, width: 10, height: 20 }},
                                    {type:'connectionNode_data', name:'trigger', data:{
                                        x: 220, y: 17.5, width: 10, height: 20,
                                        receive:function(address, data){ design.button_rect.fire.press(); design.button_rect.fire.release(); }
                                    }},
                    
                                //symbol
                                    {type:'path', name:'symbol_arrow', data:{ path:[{x:19, y:35},{x:25,y:40},{x:19, y:45}], style:style.strokeMarkings }},
                                    {type:'rect', name:'symbol_line', data:{ x:15, y:39.5, width:6, height:1, style:style.markings }},
                                    {type:'circle', name:'symbol_outterCircle', data:{ x:10, y:40, r:5.5, style:style.strokeMarkings }},
                                    {type:'circle', name:'symbol_infCircle1', data:{ x:8.5, y:40, r:1.5, style:style.strokeMarkings }},
                                    {type:'circle', name:'symbol_infCircle2', data:{ x:11.5, y:40, r:1.5, style:style.strokeMarkings }},
                    
                                //load/fire/panic buttons
                                    {type:'button_rect', name:'loadFile', data: {
                                        x:5, y: 5, width:20, height:10,
                                        style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                        onpress: function(){
                                            obj.oneShot.load('file',function(data){
                                                design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.oneShot.waveformSegment() );
                                            });
                                        }
                                    }},
                                    {type:'button_rect',name:'fire',data:{
                                        x:5, y: 17.5, width:10, height:10,
                                        style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                                        onpress:function(){
                                            var filePlayer = obj.oneShot;
                                            var waveport = design.grapher_waveWorkspace.grapher_waveWorkspace;
                                            
                                            //no file = don't bother
                                                if(filePlayer.duration() < 0){return;}
                    
                                            //determind start, end and duration values
                                                var start = waveport.area().A != undefined ? waveport.area().A : 0;
                                                var end = waveport.area().B != undefined ? waveport.area().B : 1;
                                                var duration = filePlayer.duration();
                    
                                                var startTime = start*duration;
                                                var duration = end*duration - startTime;
                    
                                            //actualy start the audio
                                                filePlayer.fire(startTime, duration);
                    
                                            //determine playhead number
                                                var playheadNumber = 0;
                                                while(playheadNumber in playheads){playheadNumber++;}
                                                playheads[playheadNumber] = {};
                    
                                            //flash light
                                                design.glowbox_rect.glowbox_rect.on();
                                                setTimeout(
                                                    function(){
                                                        design.glowbox_rect.glowbox_rect.off();
                                                    }
                                                ,100);
                    
                                            //perform graphical movements
                                                waveport.genericNeedle(playheadNumber,start,'transition: transform '+duration+'s; transition-timing-function: linear;');
                                                setTimeout(function(a){waveport.genericNeedle(playheadNumber,a);},1,end);
                                                playheads[playheadNumber].timeout = setTimeout(function(){
                                                    waveport.genericNeedle(playheadNumber);
                                                    delete playheads[playheadNumber];
                                                },duration*1000);
                                        }
                                    }},
                                    {type:'button_rect',name:'panic',data:{
                                        x:15, y: 17.5, width:10, height:10,
                                        style:{ up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', hover_press:'fill:rgba(170,150,150,1)' }, 
                                        onpress:function(){
                                            var filePlayer = obj.oneShot;
                                            var waveport = design.grapher_waveWorkspace.grapher_waveWorkspace;
                    
                                            filePlayer.panic();
                    
                                            var keys = object.alpha.keys(playheads);
                                            for(var a = 0; a < keys.length; a++){
                                                if(playheads[a] == undefined){continue;}
                                                clearTimeout(playheads[a].timeout);
                                                waveport.genericNeedle(a);
                                                delete playheads[a];
                                            }
                                        }
                                    }},
                    
                                //rate adjust
                                    {type:'slide', name:'rate', data:{
                                        x:26.25, y:5, width:5, height:45, value:0.5, resetValue:0.5,
                                        style:{handle:'fill:rgba(220,220,220,1)'},
                                        onchange:function(value){obj.oneShot.rate((1-value)*2);}
                                    }},
                    
                                //fire light
                                    {type:'glowbox_rect', name:'glowbox_rect', data:{
                                        x:32.5, y:5, width:2.5, height:45,
                                    }},
                    
                                //waveport
                                    {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                                        x:35, y:5, width:180, height:45, selectNeedle:false, selectionArea:true,
                                    }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.oneShot_multi,design);
                    
                        //circuitry
                                var playheads = {};
                    
                            //audioFilePlayer
                                obj.oneShot = new part.circuit.audio.oneShot_multi(system.audio.context);
                                obj.oneShot.out_right().connect( design.connectionNode_audio.outRight.in() );
                                obj.oneShot.out_left().connect( design.connectionNode_audio.outLeft.in() );
                    
                        //interface
                            obj.i = {};
                            obj.i.loadURL = function(url, callback){
                                obj.oneShot.load('url', function(){
                                    design.grapher_waveWorkspace.grapher_waveWorkspace.draw(obj.oneShot.waveformSegment());
                                    if(callback != undefined){callback();}
                                }, url);
                            };
                            obj.i.area = function(a,b){
                                design.grapher_waveWorkspace.grapher_waveWorkspace.area(a,b);
                            };
                            
                        return obj;
                    };
                    
                    this.oneShot_multi.metadata = {
                        name:'One Shot (Multi)',
                        helpurl:'https://metasophiea.com/curve/help/objects/oneShot_multi/'
                    };

                    this.oneShot_multi_multiTrack = function(x,y,debug=false){
                        var trackCount = 8;
                    
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
                            strokeMarkings: 'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
                        };
                        var design = {
                            name: 'oneShot_multi_multiTrack',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[{x:0,y:0},{x:220,y:0},{x:220,y:385},{x:0,y:385}], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'outRight', data:{ type: 1, x: -10, y: 5, width: 10, height: 20 }},
                                {type:'connectionNode_audio', name:'outLeft', data:{  type: 1, x: -10, y: 27.5, width: 10, height: 20 }},
                            ]
                        };
                        //dynamic design
                            for(var a = 0; a < trackCount; a++){
                                //symbols
                                design.elements = design.elements.concat([
                                    {type:'path', name:'symbol_'+a+'_arrow', data:{ path:[{x:19, y:35+a*(2+45)},{x:25,y:40+a*(2+45)},{x:19, y:45+a*(2+45)}], style:style.strokeMarkings }},
                                    {type:'rect', name:'symbol_'+a+'_line', data:{ x:15, y:39.5+a*(2+45), width:6, height:1, style:style.markings }},
                                    {type:'circle', name:'symbo_'+a+'l_outterCircle', data:{ x:10, y:40+a*(2+45), r:5.5, style:style.strokeMarkings }},
                                    {type:'circle', name:'symbol_'+a+'_infCircle1', data:{ x:8.5, y:40+a*(2+45), r:1.5, style:style.strokeMarkings }},
                                    {type:'circle', name:'symbol_'+a+'_infCircle2', data:{ x:11.5, y:40+a*(2+45), r:1.5, style:style.strokeMarkings }},
                                ]);
                    
                                //rate adjust
                                design.elements.push(
                                    {type:'slide', name:'rate_'+a, data:{
                                        x:26.25, y:5+a*(2+45), width:5, height:45, value:0.5, resetValue:0.5,
                                        style:{handle:'fill:rgba(220,220,220,1)'},
                                        onchange:function(instance){
                                            return function(value){
                                                var filePlayer = obj.oneShot_multi_array[instance];
                                                filePlayer.rate((1-design.slide['rate_'+instance].get())*2);
                                            }
                                        }(a)
                                    }}
                                );
                    
                                //activation light
                                design.elements.push(
                                    {type:'glowbox_rect', name:'glowbox_rect_'+a, data:{
                                        x:32.5, y:5+a*(2+45), width:2.5, height:45,
                                    }}
                                );
                    
                                //waveport
                                design.elements.push(
                                    {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace_'+a, data:{
                                        x:35, y:5+a*(2+45), width:180, height:45, selectNeedle:false, selectionArea:true,
                                    }}
                                );
                    
                                //load button
                                design.elements.push(
                                    {type:'button_rect', name:'loadFile_'+a, data: {
                                        x:5, y: 5+a*(2+45), width:20, height:10,
                                        style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                        onpress:function(instance){
                                            return function(){
                                                obj.oneShot_multi_array[instance].load('file',
                                                    function(instance){
                                                        return function(data){
                                                            design.grapher_waveWorkspace['grapher_waveWorkspace_'+instance].draw( obj.oneShot_multi_array[instance].waveformSegment() );
                                                        }
                                                    }(instance)
                                                );
                                            }
                                        }(a)
                                    }}
                                );
                    
                                //fire button
                                design.elements.push(
                                    {type:'button_rect',name:'fire_'+a,data:{
                                        x:5, y: 17.5+a*(2+45), width:10, height:10,
                                        style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                                        onpress:function(instance){
                                            return function(){
                                                var filePlayer = obj.oneShot_multi_array[instance];
                                                var waveport = design.grapher_waveWorkspace['grapher_waveWorkspace_'+instance];
                                                var playheads = obj.playheads[instance];
                        
                                                //no file = don't bother
                                                    if(filePlayer.duration() < 0){return;}
                                        
                                                //determine start, end and duration values
                                                    var start = waveport.area().A != undefined ? waveport.area().A : 0;
                                                    var end = waveport.area().B != undefined ? waveport.area().B : 1;
                                                    if(start > end){var temp=start;start=end; end=temp;}
                                                    var duration = filePlayer.duration();
                        
                                                    var startTime = start*duration;
                                                    var duration = end*duration - startTime;
                        
                                                //actualy start the audio
                                                    filePlayer.fire(startTime, duration);
                        
                                                //determine playhead number
                                                    var playheadNumber = 0;
                                                    while(playheadNumber in playheads){playheadNumber++;}
                                                    playheads[playheadNumber] = {};
                        
                                                //flash light
                                                    design.glowbox_rect['glowbox_rect_'+instance].on();
                                                    setTimeout(
                                                        function(a){
                                                            return function(){
                                                                design.glowbox_rect['glowbox_rect_'+a].off();
                                                            }
                                                        }(instance)
                                                    ,100);
                        
                                                //perform graphical movements
                                                    waveport.genericNeedle(playheadNumber,start,'transition: transform '+duration+'s; transition-timing-function: linear;');
                                                    setTimeout(function(a){waveport.genericNeedle(playheadNumber,a);},1,end);
                                                    playheads[playheadNumber].timeout = setTimeout(function(playheadNumber){
                                                        waveport.genericNeedle(playheadNumber);
                                                        delete playheads[playheadNumber];
                                                    },duration*1000,playheadNumber);
                                            }
                                        }(a)
                                    }}
                                );
                    
                                //panic button
                                design.elements.push(
                                    {type:'button_rect',name:'panic_'+a,data:{
                                        x:15, y: 17.5+a*(2+45), width:10, height:10,
                                        style:{ up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', hover_press:'fill:rgba(170,150,150,1)' }, 
                                        onpress:function(instance){
                                            return function(value){
                                                var filePlayer = obj.oneShot_multi_array[instance];
                                                var waveport = design.grapher_waveWorkspace['grapher_waveWorkspace_'+instance];
                                                var playheads = obj.playheads[instance];
                        
                                                filePlayer.panic();
                        
                                                var keys = object.alpha.keys(playheads);
                                                for(var a = 0; a < keys.length; a++){
                                                    if(playheads[a] == undefined){continue;}
                                                    clearTimeout(playheads[a].timeout);
                                                    waveport.genericNeedle(a);
                                                    delete playheads[a];
                                                }
                                            }
                                        }(a)
                                    }}
                                );
                    
                                //fire connection
                                design.elements.push(
                                    {type:'connectionNode_data', name:'trigger_'+a, data:{
                                        x: 220, y: 17.5+a*(2+45), width: 10, height: 20,
                                        receive:function(instance){
                                            return function(address,data){
                                                if(address == 'pulse'){ 
                                                    design.button_rect['fire_'+instance].press();
                                                    design.button_rect['fire_'+instance].release();
                                                }
                                                else if(address == 'hit'){
                                                    if(data.velocity > 0.5){
                                                        design.button_rect['fire_'+instance].press();
                                                        design.button_rect['fire_'+instance].release();
                                                    }
                                                }
                                            }
                                        }(a)
                                    }}
                                );
                    
                            }
                    
                        //main object
                            var obj = object.builder(object.alpha.oneShot_multi_multiTrack,design);
                    
                        //import/export
                            obj.exportData = function(){
                                var data = {
                                    tracks:[],
                                    areas:[],
                                };
                    
                                for(var a = 0; a < trackCount; a++){
                                    data.tracks.push(
                                        obj.oneShot_multi_array[a].unloadRaw()
                                    );
                                    data.areas.push(
                                        obj.i.area(a)
                                    );
                                }
                    
                                return data;
                            };
                            obj.importData = function(data){
                                for(var a = 0; a < trackCount; a++){
                                    obj.i.loadRaw(a,data.tracks[a]);
                                    obj.i.area(a,data.areas[a].A,data.areas[a].B);
                                }
                            };
                    
                        //circuitry
                            //audioFilePlayers
                                obj.playheads = [];
                    
                                obj.oneShot_multi_array = [];
                                for(var a = 0; a < trackCount; a++){
                                    obj.oneShot_multi_array.push( new part.circuit.audio.oneShot_multi(system.audio.context) );
                                    obj.oneShot_multi_array[a].out_right().connect( design.connectionNode_audio.outRight.in() );
                                    obj.oneShot_multi_array[a].out_left().connect( design.connectionNode_audio.outLeft.in() );
                    
                                    obj.playheads.push([]);
                                }
                    
                        //interface
                            obj.i = {
                                loadURL:function(trackNumber, url, callback){
                                    obj.oneShot_multi_array[trackNumber].load('url', 
                                        function(a){
                                            return function(){
                                                document.getElementById('oneShot_multi_multiTrack').children['grapher_waveWorkspace_'+a].draw(document.getElementById('oneShot_multi_multiTrack').oneShot_multi_array[a].waveformSegment());
                                            };
                                        }(trackNumber)
                                    ,url);
                                },
                                loadRaw:function(trackNumber, data){
                                    obj.oneShot_multi_array[trackNumber].loadRaw(data);
                                    design.grapher_waveWorkspace['grapher_waveWorkspace_'+trackNumber].draw(
                                        obj.oneShot_multi_array[trackNumber].waveformSegment()
                                    );
                                },
                                area:function(trackNumber,a,b){
                                    return design.grapher_waveWorkspace['grapher_waveWorkspace_'+trackNumber].area(a,b);
                                }
                            };
                        
                        return obj;
                    };
                    
                    this.oneShot_multi_multiTrack.metadata = {
                        name:'One Shot (Multi)(8 Track)',
                        helpurl:'https://metasophiea.com/curve/help/objects/oneShot_multi_multiTrack/'
                    };
                    this.player = function(x,y,debug=false){
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',
                            markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
                        };
                        var design = {
                            name: 'player',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                points:[{x:0,y:0},{x:220,y:0},{x:220,y:80},{x:0,y:80}], 
                                style:style.background
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'outRight', data:{  type: 1, x: -10, y: 5, width: 10, height: 20 }},
                                {type:'connectionNode_audio', name:'outLeft', data:{ type: 1, x: -10, y: 27.5, width: 10, height: 20 }},
                    
                                //symbol
                                {type:'rect', name:'symbol_line1',  data:{ x:3.5,  y:38.5, width:1, height:2,  style:style.markings }},
                                {type:'rect', name:'symbol_line2',  data:{ x:5.5,  y:37,   width:1, height:5,  style:style.markings }},
                                {type:'rect', name:'symbol_line3',  data:{ x:7.5,  y:35.5, width:1, height:8,  style:style.markings }},
                                {type:'rect', name:'symbol_line4',  data:{ x:9.5,  y:34.5, width:1, height:10, style:style.markings }},
                                {type:'rect', name:'symbol_line5',  data:{ x:11.5, y:35.5, width:1, height:8,  style:style.markings }},
                                {type:'rect', name:'symbol_line6',  data:{ x:13.5, y:37,   width:1, height:5,  style:style.markings }},
                                {type:'rect', name:'symbol_line7',  data:{ x:15.5, y:39,   width:1, height:1,  style:style.markings }},
                                {type:'rect', name:'symbol_line8',  data:{ x:17.5, y:36,   width:1, height:7,  style:style.markings }},
                                {type:'rect', name:'symbol_line9',  data:{ x:19.5, y:32,   width:1, height:15, style:style.markings }},
                                {type:'rect', name:'symbol_line10', data:{ x:21.5, y:34.5, width:1, height:10, style:style.markings }},
                                {type:'rect', name:'symbol_line11', data:{ x:23.5, y:37,   width:1, height:5,  style:style.markings }},
                                {type:'rect', name:'symbol_line12', data:{ x:25.5, y:38.5, width:1, height:2,  style:style.markings }},
                                
                    
                                {type:'readout_sixteenSegmentDisplay', name:'trackNameReadout', data:{
                                    x: 30, y: 5, angle:0, width:100, height:20, count:10, 
                                    style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                                }},
                                {type:'readout_sixteenSegmentDisplay', name:'time', data:{
                                    x: 135, y: 5, angle:0, width:80, height:20, count:8, 
                                    style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
                                }},
                    
                                {type:'button_rect', name:'load', data: {
                                    x:5, y: 5, width:20, height:10,
                                    style:{ up:'fill:rgba(175,175,175,1)', hover:'fill:rgba(220,220,220,1)', hover_press:'fill:rgba(150,150,150,1)' },
                                    onpress: function(){
                                        obj.player.load('file',function(data){
                                            design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.player.waveformSegment() );                   
                                            design.grapher_waveWorkspace.grapher_waveWorkspace.select(0);
                                            design.grapher_waveWorkspace.grapher_waveWorkspace.area(-1,-1);
                                        
                                            design.readout_sixteenSegmentDisplay.trackNameReadout.text(data.name);
                                            design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');
                                        });
                                    }
                                }},
                                {type:'button_rect',name:'start',data:{
                                    x:5, y: 17.5, width:20, height:10,
                                    style:{ up:'fill:rgba(175,195,175,1)', hover:'fill:rgba(220,240,220,1)', hover_press:'fill:rgba(150,170,150,1)' }, 
                                    onpress:function(){ obj.player.start(); }
                                }},
                                {type:'button_rect',name:'stop',data:{
                                    x:15, y: 17.5, width:10, height:10,
                                    style:{ up:'fill:rgba(195,175,175,1)', hover:'fill:rgba(240,220,220,1)', hover_press:'fill:rgba(170,150,150,1)' }, 
                                    onpress:function(){ obj.player.stop(); }
                                }},
                    
                                {type:'label', name:'rate_label_name', data:{ x:10, y:78, text:'rate', style:style.text }},
                                {type:'label', name:'rate_label_0', data:{ x:5, y:75, text:'0', style:style.text }},
                                {type:'label', name:'rate_label_1', data:{ x:13.7, y:54, text:'1', style:style.text }},
                                {type:'label', name:'rate_label_2', data:{ x:23, y:75, text:'2', style:style.text }},
                                {type:'dial_continuous',name:'rate',data:{
                                    x:15, y:65, r: 9, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, 
                                    style:{outerArc:'stroke:rgba(50,50,50,0.25); fill:none;'},
                                    onchange:function(data){ obj.player.rate( 2*data ); },
                                }},
                    
                                {type:'grapher_waveWorkspace', name:'grapher_waveWorkspace', data:{
                                    x:30, y:30, width:185, height:45,
                                    selectionAreaToggle:function(bool){ obj.player.loop({active:bool}); },
                                    onchange:function(needle,value){
                                        if(needle == 'lead'){ obj.player.jumpTo(value); }
                                        else if(needle == 'selection_A' || needle == 'selection_B'){
                                            var temp = design.grapher_waveWorkspace.grapher_waveWorkspace.area();
                                            if(temp.A < temp.B){ obj.player.loop({start:temp.A,end:temp.B}); }
                                            else{ obj.player.loop({start:temp.B,end:temp.A}); }
                                        }
                                    },
                                }},
                            ]
                        };
                    
                        //main object
                            var obj = object.builder(object.alpha.player,design);
                    
                        //circuitry
                            //audio file player
                                obj.player = new part.circuit.audio.player(system.audio.context);
                                obj.player.out_right().connect( design.connectionNode_audio.outRight.in() );
                                obj.player.out_left().connect( design.connectionNode_audio.outLeft.in() );
                    
                            //data refresh
                                function refresh(){
                                    //check if there's a track at all
                                        if( !obj.player.isLoaded() ){return;}
                    
                                    //time readout
                                        var time = system.utility.math.seconds2time( Math.round(obj.player.currentTime()));
                    
                                        design.readout_sixteenSegmentDisplay.time.text(
                                            system.utility.misc.padString(time.h,2,'0')+':'+
                                            system.utility.misc.padString(time.m,2,'0')+':'+
                                            system.utility.misc.padString(time.s,2,'0')
                                        );
                                        design.readout_sixteenSegmentDisplay.time.print();
                    
                                    //wave box
                                        design.grapher_waveWorkspace.grapher_waveWorkspace.select(obj.player.progress());
                                }
                                setInterval(refresh,1000/30);
                    
                        //interface
                            obj.i = {
                                loadByURL:function(url){
                                    obj.player.load('url',function(data){
                                        design.grapher_waveWorkspace.grapher_waveWorkspace.draw( obj.player.waveformSegment() );                   
                                        design.grapher_waveWorkspace.grapher_waveWorkspace.select(0);
                                        design.grapher_waveWorkspace.grapher_waveWorkspace.area(-1,-1);
                                    
                                        design.readout_sixteenSegmentDisplay.trackNameReadout.text(data.name);
                                        design.readout_sixteenSegmentDisplay.trackNameReadout.print('smart');
                                    },url);
                                },
                            };
                    
                        //setup
                            design.dial_continuous.rate.set(0.5);
                    
                        return obj;
                    };
                    
                    this.player.metadata = {
                        name:'Player',
                        helpurl:'https://metasophiea.com/curve/help/objects/player/'
                    };
                    this.basicSequencer = function(x,y,debug=false){
                        var vals = {
                            sequencer:{
                                width:64, height:10,
                            }
                        };
                    
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            markings: {
                                fill:'fill:rgba(150,150,150,1); pointer-events: none;',
                                stroke:'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
                            },
                            rangeslide:{
                                handle:'fill:rgba(240,240,240,1)',
                                backing:'fill:rgba(150,150,150,1)',
                                slot:'fill:rgba(50,50,50,1)',
                                invisibleHandle:'fill:rgba(0,0,0,0);',
                                span:'fill:rgba(220,220,220,1)',
                            },
                            rangeslide_loop:{
                                handle:'fill:rgba(240,240,240,1)',
                                backing:'fill:rgba(150,150,150,1)',
                                slot:'fill:rgba(50,50,50,1)',
                                invisibleHandle:'fill:rgba(0,0,0,0);',
                                span:'fill:rgba(255,247,145,0.5)',
                            },
                            button:{
                                up:'fill:rgba(220,220,220,1)',
                                hover:'fill:rgba(240,240,240,1)',
                                down:'fill:rgba(180,180,180,1)',
                                glow:'fill:rgba(220,200,220,1)',
                            },
                            checkbox:{
                                backing:'fill:rgba(229, 229, 229,1)',
                                check:'fill:rgba(252,252,252,1)',
                            },
                            checkbox_loop:{
                                backing:'fill:rgba(229, 221, 112,1)',
                                check:'fill:rgba(252,244,128,1)',
                            },
                        };
                    
                        var design = {
                            name: 'basicSequencer',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                type:'path',
                                points:[
                                    {x:0,y:0}, 
                                    {x:800,y:0}, 
                                    {x:800,y:210}, 
                                    {x:140,y:210},
                                    {x:115,y:225},
                                    {x:0,y:225}
                                ], 
                                style:style.background
                            },
                            elements:[
                                //main sequencer
                                    {type:'sequencer', name:'main', data:{
                                        x:10, y:20, width:780, height:170, 
                                        xCount:vals.sequencer.width, yCount:vals.sequencer.height,
                                        event:function(event){
                                            for(var a = 0; a < event.length; a++){
                                                design.connectionNode_data['output_'+event[a].line].send('hit',{velocity:event[a].strength});
                                            }
                                        },
                                        onchangeviewarea:function(data){
                                            design.rangeslide.viewselect.set( {start:data.left, end:data.right}, false );
                                        },
                                    }},
                                    {type:'rangeslide', name:'viewselect', data:{
                                        x:10, y:20, height: 780, width: 10, angle:-Math.PI/2, handleHeight:1/32, spanWidth:1,
                                        style:{
                                            handle: style.rangeslide.handle,
                                            backing: style.rangeslide.backing,
                                            slot: style.rangeslide.slot,
                                            invisibleHandle: style.rangeslide.invisibleHandle,
                                            span: style.rangeslide.span,
                                        },
                                        onchange:function(values){ design.sequencer.main.viewArea({left:values.start,right:values.end},false); },
                                    }},    
                    
                                //follow playhead
                                    {type:'checkbox_rect', name:'followPlayhead',data:{
                                        x:100, y:205, width:15, height:15,
                                        style:{
                                            backing:style.checkbox.backing,
                                            check:style.checkbox.check,
                                        },
                                        onchange:function(value){design.sequencer.main.automove(value);}
                                    }},
                    
                                //loop control   
                                    //activation
                                    {type:'checkbox_rect', name:'loopActive',data:{
                                        x:70, y:205, width:25, height:15,
                                        style:{
                                            backing:style.checkbox_loop.backing,
                                            check:style.checkbox_loop.check,
                                        },
                                        onchange:function(value){design.sequencer.main.loopActive(value);}
                                    }},
                                    //range
                                    {type:'rangeslide', name:'loopSelect', data:{
                                        x:10, y:200, height: 780, width: 10, angle:-Math.PI/2, handleHeight:1/32, spanWidth:0.75,
                                        style:{
                                            handle: style.rangeslide_loop.handle,
                                            backing: style.rangeslide_loop.backing,
                                            slot: style.rangeslide_loop.slot,
                                            invisibleHandle: style.rangeslide_loop.invisibleHandle,
                                            span: style.rangeslide_loop.span,
                                        },
                                        onchange:function(values){ 
                                            var a = Math.round(values.start*vals.sequencer.width);
                                            var b = Math.round(values.end*vals.sequencer.width);
                                            if(b == 0){b = 1;}
                                            design.sequencer.main.loopPeriod(a,b);
                                        },
                                    }},    
                    
                                //progression
                                    //button
                                    {type:'button_rect', name:'progress', data:{
                                        x:10, y:205, width:25, height:15,
                                        style:{
                                            up:style.button.up,
                                            hover:style.button.hover,
                                            hover_press:style.button.down,
                                        },
                                        onpress:function(){design.sequencer.main.progress();},
                                    }},     
                                    //connection node
                                    {type:'connectionNode_data', name:'progress', data:{ 
                                        x: 800, y: 5, width: 5, height: 20,
                                        receive:function(){design.sequencer.main.progress();}
                                    }},
                                    //symbol
                                    {type:'path', name:'progress_arrow', data:{ path:[{x:20, y:209},{x:25,y:212.5},{x:20, y:216}], style:style.markings.stroke }},
                    
                    
                                //reset
                                    //button
                                    {type:'button_rect', name:'reset', data:{
                                        x:40, y:205, width:25, height:15,
                                        style:{
                                            up:style.button.up,
                                            hover:style.button.hover,
                                            hover_press:style.button.down,
                                        },
                                        onpress:function(){design.sequencer.main.playheadPosition(0);},
                                    }},
                                    //connection node
                                    {type:'connectionNode_data', name:'reset', data:{ 
                                        x: 800, y: 30, width: 5, height: 20,
                                        receive:function(){design.sequencer.main.playheadPosition(0);}
                                    }},
                                    //symbol
                                    {type:'path', name:'reset_arrow', data:{ path:[{x:55, y:209},{x:50,y:212.5},{x:55, y:216}], style:style.markings.stroke }},
                                    {type:'path', name:'reset_line', data:{ path:[{x:49, y:209},{x:49, y:216}], style:style.markings.stroke }},
                            ]
                        };
                        //dynamic design
                            for(var a = 0; a < vals.sequencer.height; a++){
                                design.elements.push(
                                    {type:'connectionNode_data', name:'output_'+a, data:{ 
                                        x: -5, y: 11+a*(180/vals.sequencer.height), width: 5, height:(180/vals.sequencer.height)-2,
                                        receive:function(){design.sequencer.main.playheadPosition(0);}
                                    }},
                                );
                            }
                    
                    
                        //main object
                            var obj = object.builder(object.alpha.basicSequencer,design);
                    
                        //import/export
                            obj.exportData = function(){
                                return {
                                    loop:{
                                        active:design.checkbox_rect.loopActive.get(),
                                        range:design.sequencer.main.loopPeriod(),
                                    },
                                    autofollow:design.checkbox_rect.followPlayhead.get(),
                                    notes:design.sequencer.main.getAllNotes(),
                                };
                            };
                            obj.importData = function(data){
                                design.sequencer.main.addNotes(data.notes);
                                obj.i.loopActive(data.loop.active);
                                design.rangeslide.loopSelect.set(data.loop.range);
                                design.checkbox_rect.followPlayhead.set(data.autofollow);
                            };
                    
                        //interface
                            obj.i = {
                                addNote:function(line, position, length, strength=1){design.sequencer.main.addNote(line, position, length, strength);},
                                addNotes:function(data){design.sequencer.main.addNotes(data);},
                                getNotes:function(){return design.sequencer.main.getAllNotes();},
                                loopActive:function(a){design.checkbox_rect.loopActive.set(a);},
                            };
                    
                        return obj;
                    };
                    
                    this.basicSequencer.metadata = {
                        name:'Basic Sequencer (Multi Pulse Out)',
                        helpurl:'https://metasophiea.com/curve/help/objects/basicSequencer_pulseOut/'
                    };
                    this.launchpad = function(x,y,debug=false){
                        var values = {
                            xCount:8, yCount:8,
                        };
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',
                            button: {
                                up: 'fill:rgba(175,175,175,1)',
                                hover: 'fill:rgba(220,220,220,1)',
                                down: 'fill:rgba(150,150,150,1)'
                            },
                            grid: {
                                backing: 'fill:rgba(200,175,200,1)',
                                check: 'fill:rgba(150,125,150,1)',
                                backingGlow: 'fill:rgba(225,175,225,1)',
                                checkGlow:'fill:rgba(200,125,200,1)'
                            },
                            sevenSegmentDisplay:{
                                background:'fill:rgba(200,175,200,1)',
                                glow:'fill:rgba(225,225,225,1)',
                                dim:'fill:rgba(150,125,150,1',
                            }
                        };
                        var design = {
                            name: 'launchpad',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                type:'path',
                                points:[{x:0,y:0},{x:125,y:0},{x:125,y:50},{x:100,y:60},{x:100,y:100},{x:0,y:100}], 
                                style:style.background
                            },
                            elements:[
                                //input data
                                    {type:'connectionNode_data', name:'pulse', data:{ 
                                        x: 125, y: 5, width: 5, height: 10,
                                        receive:function(){obj.internalCircuits.inc();lightLine();}
                                    }},
                                    {type:'connectionNode_data', name:'nextPage', data:{ 
                                        x: 125, y: 22.5, width: 5, height: 10,
                                        receive:function(){obj.internalCircuits.incPage();}
                                    }},
                                    {type:'connectionNode_data', name:'prevPage', data:{ 
                                        x: 125, y: 35, width: 5, height: 10,
                                        receive:function(){obj.internalCircuits.decPage();}
                                    }},
                                //pulse
                                    {type:'button_rect',name:'pulse',data:{
                                        x:100, y:5, width:20, height:10,
                                        style:{ up:style.button.up, hover:style.button.hover, hover_press:style.button.down, },
                                        onpress:function(){obj.internalCircuits.inc();lightLine();},
                                    }},
                                //rastorgrid
                                    {type:'rastorgrid',name:'rastorgrid',data:{
                                        x:5, y:5, width:90, height:90,
                                        xCount:values.xCount, yCount:values.yCount,
                                        style:{
                                            backing: style.grid.backing, 
                                            check:style.grid.check, 
                                            backingGlow:style.grid.backingGlow, 
                                            checkGlow:style.grid.checkGlow
                                        },
                                        onchange:function(data){obj.internalCircuits.importPage(data);},
                                    }},
                                //page select
                                    {type:'sevenSegmentDisplay',name:'pageNumber',data:{
                                        x:100, y:22.5, width:20, height:22.5,
                                        style:{
                                            background:style.sevenSegmentDisplay.background,
                                            glow:style.sevenSegmentDisplay.glow,
                                            dim:style.sevenSegmentDisplay.dim,
                                        }
                                    }},
                                    {type:'button_rect',name:'nextPage',data:{
                                        x:102.5, y:17.5, width:15, height:5, selectable:false,
                                        style:{ up:style.button.up, hover:style.button.hover, hover_press:style.button.down, },
                                        onpress:function(){obj.internalCircuits.incPage();},
                                    }},
                                    {type:'button_rect',name:'prevPage',data:{
                                        x:102.5, y:45, width:15, height:5, selectable:false,
                                        style:{ up:style.button.up, hover:style.button.hover, hover_press:style.button.down },
                                        onpress:function(){obj.internalCircuits.decPage();},
                                    }},
                            ]
                        };
                        //dynamic design
                            for(var a = 0; a < values.yCount; a++){
                                //data-out ports
                                design.elements.push(
                                    {type:'connectionNode_data', name:'out_'+a, data:{
                                        x: -5, y: a*12.5 + 2.5, width: 5, height: 7.5,
                                    }},
                                );
                            }
                    
                    
                        //main object
                            var obj = object.builder(object.alpha.launchpad,design);
                    
                        //import/export
                            obj.exportData = function(){
                                return {
                                    currentPage: obj.internalCircuits.page(),
                                    data:obj.internalCircuits.exportPages(),
                                };
                            };
                            obj.importData = function(data){
                                if(data.data != undefined){ obj.internalCircuits.importPages(data.data); }
                                if(data.currentPage){ obj.internalCircuits.page(data.currentPage); }
                            };
                    
                        //internal functions
                            function lightLine(){
                                for(var a = 0; a < values.yCount; a++){
                                    design.rastorgrid.rastorgrid.light(obj.internalCircuits.previousPosition(),a,false);
                                    design.rastorgrid.rastorgrid.light(obj.internalCircuits.position(),a,true);
                                }
                            }
                            function pageChange(data){
                                design.sevenSegmentDisplay.pageNumber.enterCharacter(''+data);
                                var newPage = obj.internalCircuits.exportPage();
                    
                                if(newPage == undefined){
                                    design.rastorgrid.rastorgrid.clear();
                                }else{
                                    design.rastorgrid.rastorgrid.set(newPage);
                                }
                            }
                    
                        //circuitry
                            obj.internalCircuits = new part.circuit.sequencing.launchpad(values.xCount, values.yCount);
                            obj.internalCircuits.commands = function(data){
                                for(var a = 0; a < values.yCount; a++){
                                    if(data[a]){ obj.io['out_'+a].send('pulse'); }
                                }
                            };
                            obj.internalCircuits.pageChange = pageChange;
                    
                        //interface
                            obj.i = {
                                importPage:function(data,a){obj.internalCircuits.importPage(data,a);},
                                exportPage:function(a){return obj.internalCircuits.exportPage(a);},
                                importPages:function(data){obj.internalCircuits.importPages(data);},
                                exportPages:function(){return obj.internalCircuits.exportPages();},
                                setPage:function(a){obj.internalCircuits.page(a);}
                            };
                    
                        //setup 
                            lightLine();
                            design.sevenSegmentDisplay.pageNumber.enterCharacter('0');
                    
                        return obj;
                    };
                    
                    this.launchpad.metadata = {
                        name:'Launchpad',
                        helpurl:'https://metasophiea.com/curve/help/objects/launchpad/'
                    };
                    this.basicSequencer_midiOut = function(x,y,debug=false){
                        var vals = {
                            sequencer:{
                                width:64, //height:100,
                                midiRange:{ bottom:24, top:131 },
                                pattern:[0,0,1,0,1,0,1,0,0,1,0,1],
                            }
                        };
                        //calculate pattern basied on midi range
                        var temp = vals.sequencer.pattern.length - ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(system.audio.num2name(vals.sequencer.midiRange.top).slice(1))
                        vals.sequencer.pattern = vals.sequencer.pattern.slice(temp).concat(vals.sequencer.pattern.slice(0,temp));
                    
                        var style = {
                            background:'fill:rgba(200,200,200,1)',
                            markings: {
                                fill:'fill:rgba(150,150,150,1); pointer-events: none;',
                                stroke:'fill:none; stroke:rgba(150,150,150,1); stroke-width:1; pointer-events: none;',
                            },
                            rangeslide:{
                                handle:'fill:rgba(240,240,240,1)',
                                backing:'fill:rgba(150,150,150,1)',
                                slot:'fill:rgba(50,50,50,1)',
                                invisibleHandle:'fill:rgba(0,0,0,0);',
                                span:'fill:rgba(220,220,220,1)',
                            },
                            rangeslide_loop:{
                                handle:'fill:rgba(240,240,240,1)',
                                backing:'fill:rgba(150,150,150,1)',
                                slot:'fill:rgba(50,50,50,1)',
                                invisibleHandle:'fill:rgba(0,0,0,0);',
                                span:'fill:rgba(255,247,145,0.5)',
                            },
                            button:{
                                up:'fill:rgba(220,220,220,1)',
                                hover:'fill:rgba(240,240,240,1)',
                                down:'fill:rgba(180,180,180,1)',
                                glow:'fill:rgba(220,200,220,1)',
                            },
                            checkbox:{
                                backing:'fill:rgba(229, 229, 229,1)',
                                check:'fill:rgba(252,252,252,1)',
                            },
                            checkbox_loop:{
                                backing:'fill:rgba(229, 221, 112,1)',
                                check:'fill:rgba(252,244,128,1)',
                            },
                        };
                    
                        var design = {
                            name: 'basicSequencer_midiOut',
                            collection: 'alpha',
                            x: x, y: y,
                            base: {
                                type:'path',
                                points:[ 
                                    {x:0,y:0}, 
                                    {x:800,y:0}, 
                                    {x:800,y:210}, 
                                    {x:140,y:210},
                                    {x:115,y:225},
                                    {x:0,y:225}
                                ], 
                                style:style.background
                            },
                            elements:[
                                //midi out
                                    {type:'connectionNode_data', name:'midiout', data:{
                                        x: -5, y: 11.25, width: 5, height: 17.5,
                                    }},
                    
                    
                                //main sequencer
                                    {type:'sequencer', name:'main', data:{
                                        x:20, y:20, width:770, height:170, 
                                        xCount:vals.sequencer.width, yCount:vals.sequencer.midiRange.top-vals.sequencer.midiRange.bottom+1,
                                        event:function(event){
                                            for(var a = 0; a < event.length; a++){
                                                design.connectionNode_data.midiout.send('midinumber',{num:midiNumber_line_converter(event[a].line), velocity:event[a].strength});
                                            }
                                        },
                                        style:{
                                            horizontalStrip_pattern:vals.sequencer.pattern
                                        },
                                        onchangeviewarea:function(data){
                                            design.rangeslide.viewselect_x.set( {start:data.left, end:data.right}, false );
                                            design.rangeslide.viewselect_y.set( {start:data.top, end:data.bottom}, false );
                                        },
                                    }},
                                    {type:'rangeslide', name:'viewselect_y', data:{
                                        x:10, y:20, height:170, width: 10, angle:0, handleHeight:1/16, spanWidth:1,
                                        style:{
                                            handle: style.rangeslide.handle,
                                            backing: style.rangeslide.backing,
                                            slot: style.rangeslide.slot,
                                            invisibleHandle: style.rangeslide.invisibleHandle,
                                            span: style.rangeslide.span,
                                        },
                                        onchange:function(values){ design.sequencer.main.viewArea({top:values.start,bottom:values.end},false); },
                                    }},
                                    {type:'rangeslide', name:'viewselect_x', data:{
                                        x:20, y:20, height: 770, width: 10, angle:-Math.PI/2, handleHeight:1/32, spanWidth:1,
                                        style:{
                                            handle: style.rangeslide.handle,
                                            backing: style.rangeslide.backing,
                                            slot: style.rangeslide.slot,
                                            invisibleHandle: style.rangeslide.invisibleHandle,
                                            span: style.rangeslide.span,
                                        },
                                        onchange:function(values){ design.sequencer.main.viewArea({left:values.start,right:values.end},false); },
                                    }},
                    
                                //follow playhead
                                    {type:'checkbox_rect', name:'followPlayhead',data:{
                                        x:100, y:205, width:15, height:15,
                                        style:{
                                            backing:style.checkbox.backing,
                                            check:style.checkbox.check,
                                        },
                                        onchange:function(value){design.sequencer.main.automove(value);}
                                    }},
                    
                                //loop control   
                                    //activation
                                    {type:'checkbox_rect', name:'loopActive',data:{
                                        x:70, y:205, width:25, height:15,
                                        style:{
                                            backing:style.checkbox_loop.backing,
                                            check:style.checkbox_loop.check,
                                        },
                                        onchange:function(value){design.sequencer.main.loopActive(value);}
                                    }},
                                    //range
                                    {type:'rangeslide', name:'loopSelect', data:{
                                        x:20, y:200, height: 770, width: 10, angle:-Math.PI/2, handleHeight:1/64, spanWidth:0.75,
                                        style:{
                                            handle: style.rangeslide_loop.handle,
                                            backing: style.rangeslide_loop.backing,
                                            slot: style.rangeslide_loop.slot,
                                            invisibleHandle: style.rangeslide_loop.invisibleHandle,
                                            span: style.rangeslide_loop.span,
                                        },
                                        onchange:function(values){ 
                                            var a = Math.round(values.start*vals.sequencer.width);
                                            var b = Math.round(values.end*vals.sequencer.width);
                                            if(b == 0){b = 1;}
                                            design.sequencer.main.loopPeriod(a,b);
                                        },
                                    }},    
                    
                                //progression
                                    //button
                                    {type:'button_rect', name:'progress', data:{
                                        x:10, y:205, width:25, height:15,
                                        style:{
                                            up:style.button.up,
                                            hover:style.button.hover,
                                            hover_press:style.button.down,
                                        },
                                        onpress:function(){design.sequencer.main.progress();},
                                    }},     
                                    //connection node
                                    {type:'connectionNode_data', name:'progress', data:{ 
                                        x: 800, y: 5, width: 5, height: 20,
                                        receive:function(){design.sequencer.main.progress();}
                                    }},
                                    //symbol
                                    {type:'path', name:'progress_arrow', data:{ path:[{x:20, y:209},{x:25,y:212.5},{x:20, y:216}], style:style.markings.stroke }},
                    
                    
                                //reset
                                    //button
                                    {type:'button_rect', name:'reset', data:{
                                        x:40, y:205, width:25, height:15,
                                        style:{
                                            up:style.button.up,
                                            hover:style.button.hover,
                                            hover_press:style.button.down,
                                        },
                                        onpress:function(){design.sequencer.main.playheadPosition(0);},
                                    }},
                                    //connection node
                                    {type:'connectionNode_data', name:'reset', data:{ 
                                        x: 800, y: 30, width: 5, height: 20,
                                        receive:function(){design.sequencer.main.playheadPosition(0);}
                                    }},
                                    //symbol
                                    {type:'path', name:'reset_arrow', data:{ path:[{x:55, y:209},{x:50,y:212.5},{x:55, y:216}], style:style.markings.stroke }},
                                    {type:'path', name:'reset_line', data:{ path:[{x:49, y:209},{x:49, y:216}], style:style.markings.stroke }},
                            ]
                        };
                    
                        //internal functions
                            function midiNumber_line_converter(num){ return vals.sequencer.midiRange.top - num; }
                    
                        //main object
                            var obj = object.builder(object.alpha.basicSequencer_midiOut,design);
                    
                        //import/export
                            obj.exportData = function(){
                                return {
                                    loop:{
                                        active:design.checkbox_rect.loopActive.get(),
                                        range:design.sequencer.main.loopPeriod(),
                                    },
                                    autofollow:design.checkbox_rect.followPlayhead.get(),
                                    notes:design.sequencer.main.getAllNotes(),
                                    viewArea:design.sequencer.main.viewArea(),
                                };
                            };
                            obj.importData = function(data){
                                design.sequencer.main.addNotes(data.notes);
                                obj.i.loopActive(data.loop.active);
                                design.rangeslide.loopSelect.set(data.loop.range);
                                design.checkbox_rect.followPlayhead.set(data.autofollow);
                                design.sequencer.main.viewArea(data.viewArea);
                            };
                    
                        //interface
                            obj.i = {
                                addNote:function(number, position, length, strength=1){design.sequencer.main.addNote(midiNumber_line_converter(number), position, length, strength);},
                                addNotes:function(data){ for(var a = 0; a < data.length; a++){ this.addNote(data[a].line, data[a].position, data[a].length, data[a].strength); } },
                                getNotes:function(){return design.sequencer.main.getAllNotes();},
                                loopActive:function(a){design.checkbox_rect.loopActive.set(a);},
                                stepSize:design.sequencer.main.step,
                            };
                    
                        //setup
                            design.rangeslide.viewselect_y.set({start:0.3, end:0.7});
                    
                        return obj;
                    };
                    
                    this.basicSequencer_midiOut.metadata = {
                        name:'Basic Sequencer (Midi Out)',
                        helpurl:'https://metasophiea.com/curve/help/objects/basicSequencer_midiOut/'
                    };
                    this.basicMixer = function(x,y){
                        var style = {
                            background:'fill:rgba(200,200,200,1);pointer-events:none;',
                            markings: 'fill:rgba(150,150,150,1); pointer-events: none;',
                            h1: 'fill:rgba(0,0,0,1); font-size:7px; font-family:Courier New;',
                            h2: 'fill:rgb(150,150,150); font-size:4px; font-family:Courier New;',
                    
                            dial:{
                                handle: 'fill:rgba(220,220,220,1)',
                                slot: 'fill:rgba(50,50,50,1)',
                                needle: 'fill:rgba(250,150,150,1)',
                                outerArc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
                            }
                        };
                        var design = {
                            name:'basicMixer',
                            collection: 'alpha',
                            x:x, y:y,
                            base:{
                                points:[{x:0,y:0},{x:100,y:0},{x:100,y:207.5},{x:0,y:207.5}],
                                style:'fill:rgba(200,200,200,0);'
                            },
                            elements:[
                                {type:'connectionNode_audio', name:'input_0', data:{ type:0, x:90, y:10+0,   width:20, height:20 }},
                                {type:'connectionNode_audio', name:'input_1', data:{ type:0, x:90, y:10+25,  width:20, height:20 }},
                                {type:'connectionNode_audio', name:'input_2', data:{ type:0, x:90, y:10+50,  width:20, height:20 }},
                                {type:'connectionNode_audio', name:'input_3', data:{ type:0, x:90, y:10+75,  width:20, height:20 }},
                                {type:'connectionNode_audio', name:'input_4', data:{ type:0, x:90, y:10+100, width:20, height:20 }},
                                {type:'connectionNode_audio', name:'input_5', data:{ type:0, x:90, y:10+125, width:20, height:20 }},
                                {type:'connectionNode_audio', name:'input_6', data:{ type:0, x:90, y:10+150, width:20, height:20 }},
                                {type:'connectionNode_audio', name:'input_7', data:{ type:0, x:90, y:10+175, width:20, height:20 }},
                    
                                {type:'connectionNode_audio', name:'output_0', data:{ type:1, x:-10, y:5, width:20, height:20 }},
                                {type:'connectionNode_audio', name:'output_1', data:{ type:1, x:-10, y:30, width:20, height:20 }},
                    
                                {type:'path', name:'backing', data:{
                                    path:[{x:0,y:0},{x:100,y:0},{x:100,y:207.5},{x:0,y:207.5}],
                                    style:style.background
                                }},
                    
                                {type:'text', name:'gain', data:{x:80, y:6.5, text: 'gain', style: style.h2}},
                                {type:'text', name:'pan', data:{x:56.5, y:6.5, text: 'pan', style: style.h2}},
                    
                                {type:'rect', name:'vertical', data:{ x:22.5, y:6, width:2, height:190, style:style.markings }},
                                {type:'rect', name:'overTheTop', data:{ x:10, y:6, width:14, height:2, style:style.markings }},
                                {type:'rect', name:'down', data:{ x:10, y:6, width:2, height:35, style:style.markings }},
                                {type:'rect', name:'inTo0', data:{ x:2, y:14, width:10, height:2, style:style.markings }},
                                {type:'rect', name:'inTo1', data:{ x:2, y:39, width:10, height:2, style:style.markings }},
                            ]
                        };
                        //dynamic design
                        for(var a = 0; a < 8; a++){
                            design.elements.push(
                                {type:'rect', name:'line_'+a, data:{
                                    x:23, y:19.1+a*25, width:75, height:2, 
                                    style:style.markings,
                                }}
                            );
                    
                            design.elements.push(
                                {type:'dial_continuous',name:'gain_'+a,data:{
                                    x:85, y:20+a*25, r: 8, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                    onchange:function(a){
                                        return function(value){
                                            obj['splitter_'+a].inGain(value);
                                        }
                                    }(a)
                                }}
                            );
                            design.elements.push(
                                {type:'dial_continuous',name:'pan_'+a,data:{
                                    x:60, y:20+a*25, r: 8, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2,
                                    style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.outerArc},
                                    onchange:function(a){
                                        return function(value){
                                            obj['splitter_'+a].outGain(0,value);
                                            obj['splitter_'+a].outGain(1,1-value);
                                        }
                                    }(a)
                                }}
                            );
                        }
                    
                        //main object
                            var obj = object.builder(object.alpha.basicMixer,design);
                    
                        //internal circuitry
                            for(var a = 0; a < 8; a++){
                                obj['splitter_'+a] = new part.circuit.audio.channelMultiplier(system.audio.context,2);
                                design.connectionNode_audio['input_'+a].out().connect(obj['splitter_'+a].in());
                                obj['splitter_'+a].out(0).connect( design.connectionNode_audio['output_0'].in() );
                                obj['splitter_'+a].out(1).connect( design.connectionNode_audio['output_1'].in() );
                            }
                    
                        //interface
                            obj.i = {
                                gain:function(track,value){design.dial_continuous['gain_'+track].set(value);},
                                pan:function(track,value){design.dial_continuous['pan_'+track].set(value);},
                            };
                    
                        //setup
                            for(var a = 0; a < 8; a++){
                                obj.i.gain(a,0.5);
                                obj.i.pan(a,0.5);
                            }
                        
                        return obj;
                    };
                    
                    this.basicMixer.metadata = {
                        name:'Basic Audio Mixer',
                        helpurl:'https://metasophiea.com/curve/help/objects/basicAudioMixer/'
                    };
                };
            };
            
            object.builder = function(creatorMethod,design){ 
                //main
                    var obj = part.builder('g',design.name,{x:design.x, y:design.y});
                    if(design.base.type == undefined){design.base.type = 'path';}
                    obj.name = design.name;
                    obj.collection = design.collection;
                
                //generate selection area
                    switch(design.base.type){
                        case 'rect':
                            //generate selection area
                                design.base.points = [{x:design.x,y:design.y}, {x:design.width,y:design.y}, {x:design.width,y:design.height}, {x:design.x,y:design.height}];
                                system.utility.object.generateSelectionArea(design.base.points, obj);
                                
                            //backing
                                design.base = part.builder('rect',null,{x:design.base.x, y:design.base.y, width:design.base.width, height:design.base.height, angle:design.base.angle, style:design.base.style});
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
                                system.utility.object.generateSelectionArea(design.base.points, obj);
                                
                            //backing
                                design.base = part.builder('circle',null,{x:design.base.x, y:design.base.y, r:design.base.r, angle:design.base.angle, style:design.base.style});
                        break;
                        case 'path': 
                            //generate selection area
                                system.utility.object.generateSelectionArea(design.base.points, obj);
                            //backing
                                design.base = part.builder('path',null,{path:design.base.points, lineType:'L', style:design.base.style});
                        break;
                        default: console.error('Unknown base type:',design.base.type,'when creating object "'+design.collection+'.'+design.name+'"'); return; break;
                    };
                    obj.append(design.base);
            
                    //declare grapple
                        if(!design.skipGrapple){
                            system.mouse.declareObjectGrapple(design.base, obj, creatorMethod);
                        }
            
                //generate elements
                    if(design.elements){
                        for(var a = 0; a < design.elements.length; a++){
                            if(!design[design.elements[a].type]){design[design.elements[a].type]={};}
                            if(design.elements[a].name in design[design.elements[a].type]){console.warn('error: element with the name "'+design.elements[a].name+'" already exists. Element:',design.elements[a],'will not be added');continue;}
                            design[design.elements[a].type][design.elements[a].name] = part.builder(design.elements[a].type,design.elements[a].name,design.elements[a].data);
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

            var control = new function(){
                this.objects = new function(){
                    this.menubar = function(){
                        var vars = {
                            width: system.utility.workspace.getViewportDimensions().width,
                            height: 20,
                            selected: undefined,
                            opendropdown: undefined,
                        };
                        var style = {
                            bar: 'fill:rgba(240,240,240,1);', 
                            text: 'fill:rgba(0,0,0,1); font-size:15; font-family:Helvetica; alignment-baseline:central; pointer-events: none; user-select: none; white-space: pre;',
                            button:{
                                up:'fill:rgba(240,240,240,1)',
                                select:'fill:rgba(229,167,255,1)',
                            }
                        };
                    
                        var design = {
                            type:'menubar',
                            skipGrapple:true,
                            x:0, y:0,
                            base:{
                                points:[{x:0,y:0},{x:vars.width,y:0},{x:vars.width,y:vars.height},{x:0,y:vars.height}],
                                style:style.bar,
                            },
                            elements:[]
                        };
                    
                        //dynamic design
                            var accWidth = 0;
                            for(var a = 0; a < this.menubar.dropdowns.length; a++){
                    
                                design.elements.push(
                                    {type:'button_rect', name:a, data:{
                                        x: accWidth, y: 0,
                                        width: this.menubar.dropdowns[a].width, height: vars.height, 
                                        text: this.menubar.dropdowns[a].text,
                                        hoverable: false, pressable: false, selectable: true,
                                        style:{ up:style.button.up, select:style.button.select },
                                        onpress:function(a){ return function(){ 
                                            // if this item has already been selected (and will be deselected after this callback)
                                            // sent the menubar's 'vars.selected' value to undefined. Otherwise, set it to
                                            // this item's number
                    
                                            vars.selected = design.button_rect[a].select() ? undefined : a;
                                        } }(a),
                                        onenter:function(a){ return function(obj,event){
                                            //assuming an item has been selected, and it isn't the item that's currently being 
                                            //entered; deselect that one and tell the menubar that this item is selected now.
                                            //if no mouse button is pressed (no button rolling is happening) select it manually
                                            if( vars.selected != undefined && vars.selected != a){
                                                design.button_rect[vars.selected].select(false);
                                                vars.selected = a;
                                                if(event.buttons == 0){ design.button_rect[vars.selected].select(true); }
                                            }
                                        }; }(a),
                                        onselect:function(a,x,that){
                                            return function(){
                                                //precalc
                                                    var height = 0;
                                                    for(var b = 0; b < that.menubar.dropdowns[a].itemList.length; b++){
                                                        switch(that.menubar.dropdowns[a].itemList[b]){
                                                            case 'break': height += that.menubar.dropdowns[a].breakHeight; break;
                                                            case 'space': height += that.menubar.dropdowns[a].spaceHeight; break;
                                                            default: height += that.menubar.dropdowns[a].listItemHeight; break;
                                                        }
                                                    }
                    
                                                //produce the dropdown list for the selected item
                                                    vars.opendropdown = part.builder('list','createMenu',{
                                                        x:x, y:20,
                                                        width: that.menubar.dropdowns[a].listWidth, height: height,
                                                        itemHeightMux:  that.menubar.dropdowns[a].listItemHeight/height, 
                                                        breakHeightMux: that.menubar.dropdowns[a].breakHeight/height,
                                                        spaceHeightMux: that.menubar.dropdowns[a].spaceHeight/height,
                                                        itemSpacingMux:0, 
                                                        list:that.menubar.dropdowns[a].itemList,
                                                        selectable:false, multiSelect:false, 
                                                        style:{ 
                                                            listItemText:style.text,
                                                            background_hover:style.button.select,
                                                            backing:style.button.up,
                                                            background_up:style.button.up,
                                                        }
                                                    });
                    
                                                //upon selection of an item in a dropdown; close the dropdown and have nothing selected
                                                    vars.opendropdown.onrelease = function(){ design.button_rect[a].select(false); vars.selected = undefined; };
                    
                                                obj.append( vars.opendropdown );
                                            }
                                        }(a,accWidth,this),
                                        ondeselect:function(){ obj.removeChild(vars.opendropdown); },
                                    }}
                                );
                                
                                this.menubar.dropdowns[a].x = accWidth;
                                accWidth += this.menubar.dropdowns[a].width;
                            }
                    
                    
                        //main object
                            var obj = object.builder(object.data_duplicator,design);
                    
                        //interface
                            obj.i = {
                                report:function(text){ if(text == undefined){return;} design.text.report.innerHTML = text; },
                                closeEverything:function(){ 
                                    if(vars.selected == undefined){return;}
                                    design.button_rect[vars.selected].select(false);
                                    vars.selected = undefined;
                                },
                            };
                    
                        return obj;
                    };
                    
                    
                    
                    
                    
                    
                    
                    
                    //dynamic population of menubar items
                    //a design object for the menubar options and their respective dropdown menu items
                    this.menubar.dropdowns = [
                        {
                            text:'file',
                            width:45,
                            listWidth:175,
                            listItemHeight:22.5,
                            breakHeight: 1,
                            spaceHeight: 2,
                            itemList:[
                                {text_left:'New Scene', function:function(){ if(confirm("This will clear the current scene! Are you sure?")){control.i.scene.new();} }},
                                {text_left:'Open Scene',text_right:'ctrl-f2', function:function(){ control.i.scene.load(); }},
                                {text_left:'Save Scene',text_right:'ctrl-f3', function:function(){ control.i.scene.save(control.project.name); }},
                            ]
                        },
                        {
                            text:'edit',
                            width:45,
                            listWidth:150,
                            listItemHeight:22.5,
                            breakHeight: 1,
                            spaceHeight: 2,
                            itemList:[
                                {text_left:'Cut',       text_right:'ctrl-x',    function:function(){system.selection.cut();}       },
                                {text_left:'Copy',      text_right:'ctrl-c',    function:function(){system.selection.copy();}      },
                                {text_left:'Paste',     text_right:'ctrl-v',    function:function(){system.selection.paste();}     },
                                {text_left:'Duplicate', text_right:'ctrl-b',    function:function(){system.selection.duplicate();} },
                                {text_left:'Delete',    text_right:'del',       function:function(){system.selection.delete();}    },
                            ]
                        },
                        {
                            text:'create',
                            width:65,
                            listWidth:250,
                            listItemHeight:22.5,
                            breakHeight: 1,
                            spaceHeight: 2,
                            itemList:(function(){
                                var outputArray = [];
                    
                                //populate array with all creatable objects
                                    for(i in object.alpha){
                                        outputArray.push(
                                            {
                                                text_left: object.alpha[i].metadata ? object.alpha[i].metadata.name : i,
                                                function:function(i){
                                                    return function(){
                                                        var p = system.utility.workspace.pointConverter.browser2workspace(30,30);
                                                        system.utility.workspace.placeAndReturnObject( object.alpha[i](p.x,p.y) );
                                                    }
                                                }(i),
                                            }
                                        );
                                    }
                    
                                //sort array
                                    outputArray.sort(
                                        function(a,b){
                                            if(a.text_left.toLowerCase() < b.text_left.toLowerCase()) return -1;
                                            if(a.text_left.toLowerCase() > b.text_left.toLowerCase()) return 1;
                                            return 0;
                                        }
                                    );
                            
                                return outputArray;
                            })()
                        },
                        {
                            text:'help',
                            width:50,
                            listWidth:150,
                            listItemHeight:22.5,
                            breakHeight: 1,
                            spaceHeight: 2,
                            itemList:[
                                {text_left:'Help Docs', text_right:'(empty)', function:function(){ system.utility.misc.openURL(system.super.helpFolderLocation); }},
                            ]
                        },
                    ];

                };
                this.mousemove = function(event){};
                this.mousedown = function(event){
                    if( system.utility.workspace.objectUnderPoint(event.x, event.y) == null ){
                        control.i.menubar.closeEverything();
                    }
                };
                this.mousewheel = function(event){};
                this.keydown = function(event){ /*console.log('control::keydown:',event);*/
            
                    switch(event.key.toLowerCase()){
                        case 'backspace': case 'delete':
                            system.selection.delete();
                        break;
                        case 'x': 
                            if(!event[system.super.keys.ctrl]){return;}
                            system.selection.cut();
                        break;
                        case 'c': 
                            if(!event[system.super.keys.ctrl]){return;}
                            system.selection.copy();
                        break;
                        case 'v': 
                            if(!event[system.super.keys.ctrl]){return;}
                            system.selection.paste();
                        break;
                        case 'b': 
                            if(!event[system.super.keys.ctrl]){return;}
                            system.selection.duplicate();
                        break;
                        case 'f1': 
                            var temp = system.utility.workspace.objectUnderPoint(system.mouse.currentPosition[0], system.mouse.currentPosition[1]);
                            if(temp){
                                if( object[temp.id].metadata ){
                                    system.utility.misc.openURL(object[temp.id].metadata.helpurl);
                                }else{
                                    console.warn('bad help url, please add metadata to your object file ->',temp.id);
                                }
                                system.keyboard.releaseAll();
                            }
                        break;
                        case 'f2': 
                            if(!event[system.super.keys.ctrl]){return;}
                            this.i.scene.load();
                        break;
                        case 'f3': 
                            if(!event[system.super.keys.ctrl]){return;}
                            this.i.scene.save(this.project.name);
                        break;
                    }
            
                };
                this.keyup = function(event){ /*console.log('control::keyup:',event);*/ };
                this.i = {
                    scene:{
                        new:function(){ system.utility.workspace.clear(); },
                        load:function(){
                            system.utility.workspace.saveload.load(function(data){
                                if(data == null){
                                    control.i.menubar.report('invalid file','error');
                                    return;
                                }
            
                                control.project.name = data.sceneName;
                            });
                        },
                        save:function(projectName){system.utility.workspace.saveload.save(projectName);},
                    },
                    menubar:{
                        obj:undefined,
                        report:function(text,type='default'){console.log(type+' - '+text);},
                        place:function(){
                            if(this.obj != undefined){ system.pane.control.remove(this.obj); }
                            this.obj = system.utility.workspace.placeAndReturnObject( control.objects.menubar(), 'control' );
                        },
                        closeEverything:function(){ this.obj.i.closeEverything(); },
                    },
                    objectPane:{
                        obj:undefined,
                        open:function(){
                            if( this.obj == undefined ){
                                this.obj = system.utility.workspace.placeAndReturnObject( control.objects.objectPane(10, 30), 'menu' );
                            }
                        },
                        close:function(){
                            if( this.objectPane.obj != undefined ){
                                system.utility.object.deleteObject(this.obj);
                                this.obj = undefined;
                            }
                        },
                    },
                };
                this.project = {
                    name:'myProject'
                };
            };
            
            
            setTimeout(function(){
                if(system.super.enableMenubar){ control.i.menubar.place(); }
            },1);
            
            
            //audio duplicator
                var audio_duplicator_1 = system.utility.workspace.placeAndReturnObject( object.alpha.audio_duplicator(50,50) );
            
            //data duplicator
                var data_duplicator_1 = system.utility.workspace.placeAndReturnObject( object.alpha.data_duplicator(875, 50) );
            
            //audio_scope
                var audio_scope_1 = system.utility.workspace.placeAndReturnObject( object.alpha.audio_scope(150,50) );
            
            //audio_sink
                var audio_sink_1 = system.utility.workspace.placeAndReturnObject( object.alpha.audio_sink(400,50) );
            
            //basic audio mixer
                var audio_mixer_1 = system.utility.workspace.placeAndReturnObject( object.alpha.basicMixer(925, 110) );
            
            //basicSynthesizer
                var basicSynthesizer_1 = system.utility.workspace.placeAndReturnObject( object.alpha.basicSynthesizer(550,50) );
            
            //audio effect objects
                //distortionUnit
                    var distortionUnit_1 = system.utility.workspace.placeAndReturnObject( object.alpha.distortionUnit(25, 120) );
                //filterUnit
                    var filterUnit_1 = system.utility.workspace.placeAndReturnObject( object.alpha.filterUnit(150, 175) );
                //reverbUnit
                    var reverbUnit_1 = system.utility.workspace.placeAndReturnObject( object.alpha.reverbUnit(280, 170) );
                //multiband filter
                    var multibandFilter = system.utility.workspace.placeAndReturnObject( object.alpha.multibandFilter(200,410) );
            
            //audio player objects
                //oneShot_single
                    var oneShot_single_1 = system.utility.workspace.placeAndReturnObject( object.alpha.oneShot_single(425, 160) );
                //oneShot_multi
                    var oneShot_multi_1 = system.utility.workspace.placeAndReturnObject( object.alpha.oneShot_multi(425, 220) );
                //looper
                    var looper_1 = system.utility.workspace.placeAndReturnObject( object.alpha.looper(425,280) );
                //standard player
                    var player_1 = system.utility.workspace.placeAndReturnObject( object.alpha.player(425,340) );
                //oneShot_multi_multiTrack
                    var oneShot_multi_multiTrack_1 = system.utility.workspace.placeAndReturnObject( object.alpha.oneShot_multi_multiTrack(675, 160) );
            
            
            //audio recorder
                var recorder_1 = system.utility.workspace.placeAndReturnObject( object.alpha.recorder(355, 110) );
            
            //audio input
                var audioIn_1 = system.utility.workspace.placeAndReturnObject( object.alpha.audioIn(15, 275, false) );
            
            //launchpad
                var launchpad_1 = system.utility.workspace.placeAndReturnObject( object.alpha.launchpad(270, 225) );
            
            //basic sequencer
                var basicSequencer_1 = system.utility.workspace.placeAndReturnObject( object.alpha.basicSequencer(925, 325) );
            
            //basic sequencer (midi output)
                var basicSequencer_midiOut_1 = system.utility.workspace.placeAndReturnObject( object.alpha.basicSequencer_midiOut(925, 560) );
            
            //universalreadout
                var universalreadout_1 = system.utility.workspace.placeAndReturnObject( object.alpha.universalreadout(820, 60) );
            
            //pulseGenerator
                var pulseGenerator_1 = system.utility.workspace.placeAndReturnObject( object.alpha.pulseGenerator(790, 110) );
            
            //musical keyboard
                var musicalkeyboard_1 = system.utility.workspace.placeAndReturnObject( object.alpha.musicalkeyboard(80, 330) );
            
            
            
            // system.utility.workspace.gotoPosition(-1597.19, -596.058, 1.92284, 0);

        }
    }
// })();
