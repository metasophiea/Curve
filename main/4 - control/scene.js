var IDcounter = 0;

this.listLayers = function(printToConsole=false){
    if(!printToConsole){
        function print(unit){
            return { model:unit.model, name:unit.name, x:unit.x(), y:unit.y(), a:unit.angle() };
        }
        return {
            foreground:_canvas_.system.pane.mf.children().filter( a => !a._isCable ).map(print),
            middleground:_canvas_.system.pane.mm.children().filter( a => !a._isCable ).map(print),
            background:_canvas_.system.pane.mb.children().filter( a => !a._isCable ).map(print),
        };
    }

    function print(unit){
        console.log( '\t', 'model:'+unit.model, 'name:'+unit.name, '-', '{x:'+unit.x()+',y:'+unit.y()+',a:'+unit.angle()+'}' );
    }

    console.log('foreground'); _canvas_.system.pane.mf.children().filter( a => !a._isCable ).forEach(print);
    console.log('middleground'); _canvas_.system.pane.mm.children().filter( a => !a._isCable ).forEach(print);
    console.log('background'); _canvas_.system.pane.mb.children().filter( a => !a._isCable ).forEach(print);
};
this.backgroundColour = function(colour){ return _canvas_.core.render.clearColour(colour); };
this.packData = function(data,compress=true){
    return _canvas_.library.misc.serialize({ 
        compressed:compress, 
        data:_canvas_.library.misc.serialize(data,compress)
    },false);
    
    // //serialize data
    //     data = _canvas_.library.misc.serialize(data,compress);

    // //wrap serialized scene
    //     data = { compressed:compress, data:data };

    // //serialize again
    //     data = _canvas_.library.misc.serialize(data,false);

    // return data;
};
this.unpackData = function(data){
    //deserialize first layer
        try{
            var data = _canvas_.library.misc.unserialize(data,false);
        }catch(e){
            console.error( "Major error unserializing first layer of file" );
            console.error(e);
            return null;
        }

    //determine if this data is compressed or not
        var compressed = data.compressed;

    //deserialize second layer (knowing now whether it's compressed or not)
        try{
            var data = _canvas_.library.misc.unserialize(data.data,compressed);
        }catch(e){
            console.error( "Major error unserializing second layer of file" );
            console.error(e);
            return null;
        }

    return data;
};

//getting units
    this.getAllUnits = function(pane=_canvas_.system.pane.mm){ return pane.children().filter( a => !a._isCable ); };
    this.getUnitByName = function(name,pane=_canvas_.system.pane.mm){ return pane.getChildByName(name); };
    this.getUnitsByModel = function(model){
        return this.getAllUnits().filter( a => a.model == model);
    };
    this.getUnitUnderPoint = function(x,y,pane=_canvas_.system.pane.mm){
        for( var a = 0; a < pane.children().length; a++){
            if( _canvas_.library.math.detectOverlap.boundingBoxes({bottomRight:{x:x,y:y},topLeft:{x:x,y:y}}, pane.children()[a].space.box) ){
                if( _canvas_.library.math.detectOverlap.pointWithinPoly({x:x,y:y}, pane.children()[a].space.points) ){
                    return pane.children()[a];
                }
            }
        }
    };
    this.getUnitsWithinPoly = function(points,pane=_canvas_.system.pane.mm){
        var box = _canvas_.library.math.boundingBoxFromPoints(points);
        return pane.children().filter(function(a){ return !a._isCable && _canvas_.library.math.detectOverlap.boundingBoxes(box, a.space.boundingBox) && _canvas_.library.math.detectOverlap.overlappingPolygons(points, a.space.points); });
    };

//unit extra features
    var snapping = {active:false,x:10,y:10,angle:Math.PI/8};
    this.activeSnapping = function(bool,pane=_canvas_.system.pane.mm){
        //control switch
            if(!_canvas_.control.interaction.enableSnapping()){return;}

        if(bool == undefined){return snapping.active;}

        snapping.active = bool;
        this.getAllUnits(pane).forEach(unit => unit.snappingActive(bool));
    };
    this.rectifyUnitPosition = function(unit,pane=_canvas_.system.pane.mm){
        //control switch
            if(!_canvas_.control.interaction.enableUnitCollision()){return;}

        //if this unit is to ignore any collision, just bail
            if(!unit.collisionActive){return false;}

        //discover if there's an overlap; if not skip all this
            var allOtherUnits = control.scene.getAllUnits(pane).filter(a => a != unit && a.collisionActive).map(a => { return a.space; });
            if( !_canvas_.library.math.detectOverlap.overlappingPolygonWithPolygons( unit.space, allOtherUnits ) ){return false;}

        //get the offset which will allow this unit to fit
            var offset = _canvas_.library.math.fitPolyIn( unit.space, allOtherUnits, snapping );
            
        //apply offset
            unit.x(unit.x() + offset.x);
            unit.y(unit.y() + offset.y);
        
        return true; //false: no change was made - true: a change was made
    };

//unit manipulation
    this.generateUnitName = function(){ return IDcounter++; };
    this.addUnit = function(x,y,a,model,collection='alpha',forceName,rectify=true,pane=_canvas_.system.pane.mm){
        //control switch
            if(!_canvas_.control.interaction.enableUnitAdditionRemoval()){return;}



        //generate new name for unit
            var name = forceName==undefined ? this.generateUnitName() : forceName;

        //produce unit, assign its name and add grapple code
            if( _canvas_.interface.unit.collection[collection] == undefined ){
                console.warn('unknown unit collection "'+collection+'" (_canvas_.interface.unit.collection['+collection+'])'); 
                return;
            }
            if( _canvas_.interface.unit.collection[collection][model] == undefined ){
                console.warn('unknown unit model "'+model+'" (_canvas_.interface.unit.collection['+collection+']['+model+'])'); 
                return;
            }

            var tmp = _canvas_.interface.unit.collection[collection][model](x,y,a);
            tmp.name = ''+name;
            tmp.collection = collection;
            tmp = _canvas_.control.grapple.declare(tmp);

        //if snapping is active in the scene, don't forget to activate it for this new unit too
            if(_canvas_.control.scene.activeSnapping()){ tmp.snappingActive(true); }

        //if requestsed to do so; check if this new position is possible, and if not find the closest one that is and adjust the unit's position accordingly
            if(rectify){ this.rectifyUnitPosition(tmp); }

        //add it to the pane
            pane.append( tmp );



        //register action
            control.actionRegistry.registerAction(
                {
                    functionName:'control.scene.addUnit',
                    arguments:[x,y,a,model,collection,forceName,rectify,pane.getAddress()],
                    name:tmp.name,
                }
            );

        return tmp;    
    };
    this.removeUnit = function(unit){
        //control switch
            if(!_canvas_.control.interaction.enableUnitAdditionRemoval()){return;}

        //safty
            if(unit == undefined){return;}

        //only proceed if unit is actually in the scene
            if(_canvas_.system.pane.getMiddlegroundPane(unit) == undefined){ return; }

        //register action
            control.actionRegistry.registerAction(
                {
                    functionName:'control.scene.removeUnit',
                    name:unit.name,
                    pane:_canvas_.system.pane.getMiddlegroundPane(unit),
                    data:this.documentUnits([unit])[0],
                }
            );
            
        //run the unit's onDelete method
            if(unit.ondelete){unit.ondelete();}
        //run disconnect on every connection node of this unit
            unit.disconnectEverything();
        //remove the object from the pane
            _canvas_.system.pane.getMiddlegroundPane(unit).remove(unit);
    };
    this.transferUnits = function(units,destinationPane){
        //control switch
            if(!_canvas_.control.interaction.enableUnitTransfer()){return;}
        
        //register action
            control.actionRegistry.registerAction(
                {
                    functionName:'control.scene.transferUnit',
                    arguments:[units.map(unit=>unit.name),destinationPane],
                    originalPanes:units.map(unit=>_canvas_.system.pane.getMiddlegroundPane(unit)),
                }
            );

        //collect all the information for these units
            var data = this.documentUnits(units);
        //remove the original units
            units.forEach(unit => this.removeUnit(unit));
        //print the units to the destination pane
            return this.printUnits(data,true,destinationPane);
    };

//unit <-> notationalUnit
    this.documentUnits = function(units,selfContained=false){
        // position             -   the X, Y and angle of the original object
        // details              -   data on the unit's type
        //      collection
        //      model
        // data                 -   the exported data from the original object
        // connections          -   an array of where to connect what
        //      typeAndNameOfSourcePort
        //      indexOfDestinationUnit
        //      typeAndNameOfDestinationPort

        var outputData = [];

        //cycle through this array, and create the scene data
            for(var a = 0; a < units.length; a++){
                // outputData.push(this.absolute_documentUnit(units[a]));
                var unit = units[a];
                var entry = {};

                //get the units position
                    entry.position = { x:unit.x(), y:unit.y(), angle:unit.angle() };

                //unitDetails
                    entry.details = { collection:unit.collection, model:unit.model };

                //export the unit's state
                    entry.data = unit.exportData ? unit.exportData() : {};

                //log all connections
                    entry.connections = [];
                        for(var connectionType in unit.io){
                            for(var connection in unit.io[connectionType]){
                                var foreignNode = unit.io[connectionType][connection].getForeignNode();
                                if(foreignNode == undefined){continue;} //this node isn't connected to anything, so just bail
                        
                                var newConnectionEntry = {};

                                //typeAndNameOfSourcePort
                                    newConnectionEntry.typeAndNameOfSourcePort = { type:connectionType, name:connection };

                                //nameOfDestinationUnit
                                    newConnectionEntry.nameOfDestinationUnit = selfContained ? undefined : foreignNode.parent.name;
                                //indexOfDestinationUnit
                                    newConnectionEntry.indexOfDestinationUnit = units.indexOf(foreignNode.parent);

                                //typeAndNameOfDestinationPort
                                    newConnectionEntry.typeAndNameOfDestinationPort = { type:connectionType, name:foreignNode.name };

                                entry.connections.push(newConnectionEntry);
                            }
                        }

                //add this entry to the save data list
                    outputData.push(entry);
            }

        return outputData;  
    };
    this.printUnits = function(units, rectify=true, pane=_canvas_.system.pane.mm, autoselect=true){
        var printedUnits = [];

        for(var a = 0; a < units.length; a++){
            var item = units[a];

            //create the object with its new position adding it to the pane
                var unit = control.scene.addUnit(item.position.x, item.position.y, item.position.angle, item.details.model, item.details.collection, item.details.name, rectify, pane);
                printedUnits.push(unit);

            //import data and select unit
                if(unit.importData){unit.importData(item.data);}
                if(autoselect){control.selection.selectUnit(unit);}

            //go through its connections, and attempt to connect them to everything they should be connected to
            // (don't worry if a object isn't available yet, just skip that one. Things will work out in the end)
                for(var b = 0; b < item.connections.length; b++){
                    var connection = item.connections[b];

                    var destinationUnit = connection.indexOfDestinationUnit != -1 ? control.selection.selectedUnits[connection.indexOfDestinationUnit] : control.scene.getUnitByName(connection.nameOfDestinationUnit);
                    if(destinationUnit == undefined){continue;}

                    var sourceNode = unit.io[connection.typeAndNameOfSourcePort.type][connection.typeAndNameOfSourcePort.name];
                    var destinationNode = destinationUnit.io[connection.typeAndNameOfDestinationPort.type][connection.typeAndNameOfDestinationPort.name];
                    
                    sourceNode.connectTo(destinationNode);
                }
        }

        return printedUnits;
    };

//scene file
    this.new = function(askForConfirmation=false){
        //control switch
            if(!_canvas_.control.interaction.enableNewScene()){return;}


        if(askForConfirmation){
            if( !confirm("This will clear the current scene! Are you sure?") ){ return; }
        }

        this.getAllUnits().forEach(unit => this.removeUnit(unit));

        IDcounter = 0;
        control.viewport.position(0,0);
        control.viewport.scale(0);

        control.actionRegistry.clearRegistry();
    };
    this.load = function(url,callback,askForConfirmation=false){
        //control switch
            if(!_canvas_.control.interaction.enableSceneLoad()){return;}



        if(askForConfirmation){
            if( !confirm("This will clear the current scene! Are you sure?") ){ return; }
        }

        //procedure for loading in a .crv file
            function procedure(data,callback){
                //stopping audio
                    _canvas_.library.audio.destination.masterGain(0);

                //unpack data
                    data = control.scene.unpackData(data);

                //clear scene
                    control.scene.new();

                //print to scene
                    control.scene.printUnits( data.units );
                
                //reposition viewport
                    control.viewport.position( data.viewportLocation.xy.x, data.viewportLocation.xy.y );
                    control.viewport.scale( data.viewportLocation.scale );

                //restarting audio
                    _canvas_.library.audio.destination.masterGain(1);

                //deselect all units
                    control.selection.deselectEverything();

                //clear the actionReigister
                    control.actionRegistry.clearRegistry();

                //callback
                    if(callback){callback(metadata);}
            }

        //depending on whether a url has been provided or not, perform the appropiate load
            if(url == undefined){ //load from file
                _canvas_.library.misc.openFile(function(data){procedure(data,callback);});
            }else{ //load from url
                _canvas_.library.misc.loadFileFromURL(url,function(text){ procedure(text,callback); },'text');
            }
    };
    this.save = function(filename='project.crv',compress=false){
        //control switch
            if(!_canvas_.control.interaction.enableSceneSave()){return;}
        


        //stopping audio
            _canvas_.library.audio.destination.masterGain(0);

        //gather some initial data
            var outputData = {
                filename: filename,
                viewportLocation: {
                    xy: _canvas_.control.viewport.position(),
                    scale: _canvas_.control.viewport.scale(),
                },
            };

        //gather the scene data
            outputData.units = this.documentUnits( this.getAllUnits().filter(a => !a._isCable) );

        //pack up data
            outputData = this.packData(outputData,compress);

        //print to file
            _canvas_.library.misc.printFile(filename,outputData);

        //restarting audio
            _canvas_.library.audio.destination.masterGain(1);
    };