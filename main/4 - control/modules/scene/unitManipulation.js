this.generateUnitName = function(){
    return String(IDcounter++);
};
this.addUnit = function(x,y,a,model,collection,forceName,rectify=true,pane=_canvas_.system.pane.mm){
    dev.log.scene('.addUnit(',x,y,a,model,collection,forceName,rectify,pane); //#development

    //control switch
        if(!interactionState.unitAdditionRemoval){return;}

    //input checking
        if(model == undefined){
            console.warn('error::control.scene.addUnit: no model defined'); 
            return;
        }
        if(collection == undefined){
            console.warn('error::control.scene.addUnit: no collection defined'); 
            return;
        }

    //generate new name for unit
        const name = forceName==undefined ? this.generateUnitName() : forceName;

    //produce unit, assign its name and add grapple code
        if( _canvas_.interface.unit.collection[collection] == undefined ){
            console.warn('unknown unit collection "'+collection+'" (_canvas_.interface.unit.collection['+collection+'])'); 
            return;
        }
        if( _canvas_.interface.unit.collection[collection][model] == undefined ){
            console.warn('unknown unit model "'+model+'" (_canvas_.interface.unit.collection['+collection+']['+model+'])'); 
            return;
        }

        let tmp = _canvas_.interface.unit.collection[collection][model](name,x,y,a);
        tmp.collection = collection;
        tmp = _canvas_.control.grapple.declare(tmp);

    //if snapping is active in the scene, don't forget to activate it for this new unit too
        if(interactionState.snapping){ tmp.snappingActive(snapping.active); }

    //if requested to do so; check if this new position is possible, and if not find the closest one that is and adjust the unit's position accordingly
        if(rectify){ this.rectifyUnitPosition(tmp); }

    //add it to the pane
        pane.append( tmp );

    //run the unit's onCreate method
        tmp._oncreate();
        if(tmp.oncreate){tmp.oncreate();}

    //register action
        control.actionRegistry.registerAction(
            {
                functionName:'control.scene.addUnit',
                arguments:[x,y,a,model,collection,forceName,rectify,pane.getAddress()],
                name:tmp.getName(),
            }
        );

    return tmp;    
};
this.removeUnit = function(unit){
    dev.log.scene('.removeUnit(',unit); //#development

    //control switch
        if(!interactionState.unitAdditionRemoval){return;}

    //safety
        if(unit == undefined){return;}

    //only proceed if unit is actually in the scene
        if(_canvas_.system.pane.getMiddlegroundPane(unit) == undefined){ return; }

    //register action
        control.actionRegistry.registerAction(
            {
                functionName:'control.scene.removeUnit',
                name:unit.getName(),
                pane:_canvas_.system.pane.getMiddlegroundPane(unit),
                data:this.documentUnits([unit])[0],
            }
        );

    //run the unit's onDelete method
        if(unit.ondelete){unit.ondelete();}
    //run disconnect on every connection node of this unit
        unit.disconnectEverything();
    //run underlying onDelete method
        unit._ondelete();
    //remove the object from the pane
        _canvas_.system.pane.getMiddlegroundPane(unit).remove(unit);
};
this.transferUnits = function(units,destinationPane){
    dev.log.scene('.transferUnits(',units,destinationPane); //#development

    //control switch
        if(!interactionState.unitTransfer){return;}
    
    //register action
        control.actionRegistry.registerAction(
            {
                functionName:'control.scene.transferUnit',
                arguments:[units.map(unit=>unit.getName()),destinationPane],
                originalPanes:units.map(unit=>_canvas_.system.pane.getMiddlegroundPane(unit)),
            }
        );

    //collect all the information for these units
        const data = this.documentUnits(units);
    //remove the original units
        units.forEach(unit => this.removeUnit(unit));
    //print the units to the destination pane
        return this.printUnits(data,true,destinationPane);
};
this.rectifyUnitPosition = function(unit,pane=_canvas_.system.pane.mm){
    dev.log.scene('.rectifyUnitPosition(',unit,pane); //#development
    
    //control switch
        if(!interactionState.unitCollision){return;}

    //if this unit is to ignore any collision, just bail
        if(!unit.collisionActive){return false;}

    //discover if there's an overlap; if not skip all this
        const allOtherUnits = control.scene.getAllUnits(pane).filter(a => a != unit && a.collisionActive).map(a => { return a.space; });

        let anyCollision = false;
        for(let a = 0; a < allOtherUnits.length; a++){
            anyCollision = anyCollision || _canvas_.library.math.detectIntersect.polyOnPoly( unit.space, allOtherUnits[a] ).intersect;
        }
        if(!anyCollision){return false;}

    //get the offset which will allow this unit to fit
        const offset = _canvas_.library.math.fitPolyIn( unit.space, allOtherUnits, snapping );

    //apply offset
        unit.x(unit.x() + offset.x);
        unit.y(unit.y() + offset.y);
    
    return true; //false: no change was made - true: a change was made
};