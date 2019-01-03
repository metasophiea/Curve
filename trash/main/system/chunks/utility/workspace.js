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