this.new = function(askForConfirmation=true){
    dev.log.scene('.new(',askForConfirmation); //#development

    //control switch
        if(!interactionState.newScene){return;}

    if(interactionState.unloadWarning && askForConfirmation){
        if( !confirm("This will clear the current scene! Are you sure?") ){ return; }
    }

    this.getAllUnits().forEach(unit => this.removeUnit(unit));

    IDcounter = 0;
    control.viewport.position(0,0);
    control.viewport.scale(1);
    control.viewport.angle(0);

    control.actionRegistry.clearRegistry();
};
this.load = function(url,callback,askForConfirmation=true){
    dev.log.scene('.load(',url,callback,askForConfirmation); //#development

    //control switch
        if(!interactionState.sceneLoad){return;}

    if(interactionState.unloadWarning && askForConfirmation){
        if( !confirm("This will clear the current scene! Are you sure?") ){ return; }
    }

    //procedure for loading in a .crv file
        function procedure(data,callback){
            //stopping audio
                dev.log.scene('.load -> stopping audio'); //#development
                _canvas_.library.audio.destination.masterGain(0);

            //unpack data
                dev.log.scene('.load -> unpack data'); //#development
                data = _canvas_.library.misc.unpackData(data);

            //clear scene
                dev.log.scene('.load -> clear scene'); //#development
                control.scene.new(false);

            //print to scene
                dev.log.scene('.load -> print to scene'); //#development
                control.scene.printUnits( data.units );
            
            //reposition viewport
                dev.log.scene('.load -> reposition viewport'); //#development
                control.viewport.position( data.viewportLocation.xy.x, data.viewportLocation.xy.y );
                control.viewport.scale( data.viewportLocation.scale );

            //restarting audio
                dev.log.scene('.load -> restarting audio'); //#development
                _canvas_.library.audio.destination.masterGain(1);

            //select everything again to shift every unit in front of the cables, then deselect all units
                dev.log.scene('.load -> select everything again to shift every unit in front of the cables, then deselect all units'); //#development
                control.selection.selectEverything(true);
                control.selection.deselectEverything();

            //clear the actionRegister
                dev.log.scene('.load -> clear the actionRegister'); //#development
                control.actionRegistry.clearRegistry();

            //callback
                dev.log.scene('.load -> callback'); //#development
                if(callback){callback(metadata);}
        }

    //depending on whether a url has been provided or not, perform the appropriate load
        if(url == undefined){ //load from file
            _canvas_.library.misc.openFile(function(data){procedure(data,callback);});
        }else{ //load from url
            _canvas_.library.misc.loadFileFromURL(url,function(text){ procedure(text.response,callback); },undefined,'text');
        }
};
this.save = function(filename='project.crv',compress=false){
    dev.log.scene('.save(',filename,compress); //#development

    //control switch
        if(!interactionState.sceneSave){return;}
    
    //stopping audio
        _canvas_.library.audio.destination.masterGain(0);

    //gather some initial data
        const outputData = {
            filename: filename,
            viewportLocation: {
                xy: _canvas_.control.viewport.position(),
                scale: _canvas_.control.viewport.scale(),
            },
        };

    //gather the scene data
        outputData.units = this.documentUnits( this.getAllUnits().filter(a => !a._isCable) );

    //pack up data
        const packedOutputData = _canvas_.library.misc.packData(outputData,compress);

    //print to file
        _canvas_.library.misc.printFile(filename,packedOutputData);

    //restarting audio
        _canvas_.library.audio.destination.masterGain(1);
};