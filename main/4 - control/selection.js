this.selectedUnits = [];
this.lastSelectedUnits = null;
this.clipboard = [];

this.selectUnit = function(unit,shiftToFront=true){ 
    //control switch
        if(!_canvas_.control.interaction.enableUnitSelection()){return;}

    //check if object is already selected
        if( this.selectedUnits.indexOf(unit) != -1 ){return;}

    //shift object to front of view, (within it's particular pane)
        if(shiftToFront){
            var pane = _canvas_.system.pane.getMiddlegroundPane(unit);
            pane.remove(unit);
            pane.append(unit);
        }

    //colourize space
        var tmp = _canvas_.interface.part.builder( 
            'basic', 'polygonWithOutline', 'control.selection::shape::selectionGlow', 
            {
                pointsAsXYArray:unit.space.originalPoints, 
                colour:{r:244/255,g:226/255,b:66/255,a:0.25}, lineColour:{r:244/255,g:226/255,b:66/255,a:1}
            } 
        );
        unit.append(tmp);

    //perform selection
        if(unit.onselect){object.onselect();}
        this.selectedUnits.push(unit);
        this.lastSelectedUnits = unit;
};
this.selectUnits = function(unitList){
    for(var a = 0; a < unitList.length; a++){
        this.selectUnit(unitList[a]);
    }
};
this.deselectUnit = function(unit){
    //decolourize space
        unit.remove( unit.getChildByName('control.selection::shape::selectionGlow') );
    
    //remove unit from selectedUnits list, and activate it's "ondeselect" function
        this.selectedUnits.splice(this.selectedUnits.indexOf(unit),1);
        if(unit.ondeselect){unit.ondeselect();}
};
this.selectEverything = function(){
    this.deselectEverything();
    for(var a = 0; a < _canvas_.system.pane.mm.children().length; a++){
        if( !_canvas_.system.pane.mm.children()[a]._isCable ){
            this.selectUnit(_canvas_.system.pane.mm.children()[a],false);
        }
    }
};
this.deselectEverything = function(){
    while(this.selectedUnits.length > 0){
        this.deselectUnit( this.selectedUnits[0] );
    }
};

this.cut = function(){
    //control switch
        if(!_canvas_.control.interaction.enableUnitAdditionRemoval()){return;}


        
    this.copy();
    this.delete();
};
this.copy = function(){
    //control switch
        if(!_canvas_.control.interaction.enableUnitAdditionRemoval()){return;}



    this.clipboard = _canvas_.control.scene.documentUnits(this.selectedUnits,true);
};
this.paste = function(position,rectify=true){
    //control switch
        if(!_canvas_.control.interaction.enableUnitAdditionRemoval()){return;}



    //if clipboard is empty, don't bother
        if(this.clipboard.length == 0){return;}

    //deselect everything
        this.deselectEverything();

    //position manipulation
    //if position is not set to 'duplicate'; calculate new positions for the objects
        if(position != 'duplicate'){
            //collect all positions
                var points = [];
                this.clipboard.forEach( element => points.push(element.position) );

            //get the bounding box of this selection, and then the top left point of that
                var topLeft = _canvas_.library.math.boundingBoxFromPoints(points).topLeft;

            //if no position has been provided at all; calculate a new one from the mouse position
                if(position == undefined){
                    position = _canvas_.core.viewport.mousePosition();
                    position = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(position.x,position.y);
                    if(position.x == undefined || position.y == undefined){
                        position = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(0, 0);
                    }
                }

            //combine this topLeft point with the provided (or calculated) position, 
            //then add this to the mouses' position
                this.clipboard.forEach( function(element){
                    element.position.x += position.x - topLeft.x;
                    element.position.y += position.y - topLeft.y;
                } );
        }

    //unit printing
        _canvas_.control.scene.printUnits( this.clipboard, rectify );
};
this.duplicate = function(rectify=true){
    //control switch
        if(!_canvas_.control.interaction.enableUnitAdditionRemoval()){return;}

    //form register action
        var action = {
            functionName:'control.selection.duplicate',
            unitsToDuplicate:control.selection.selectedUnits.map(unit => unit.name),
        };
        
    control.actionRegistry.actionRegistrationActive(false);
    this.copy();
    this.paste('duplicate',rectify);
    this.clipboard = [];
    control.actionRegistry.actionRegistrationActive(true);

    //push action
        action.finalPositions = control.selection.selectedUnits.map(unit => ({x:unit.x(),y:unit.y(),a:unit.angle()}));
        action.producedUnitNames = control.selection.selectedUnits.map(unit => unit.name);
        control.actionRegistry.registerAction(action);
};
this.delete = function(){
    //control switch
        if(!_canvas_.control.interaction.enableUnitAdditionRemoval()){return;}

    //if there's nothing to delete, then don't bother trying
    if(this.selectedUnits.length == 0){return;}

    //register bookend action
        control.actionRegistry.registerAction(
            {
                functionName:'control.selection.delete',
                count:this.selectedUnits.length,
                bookendPosition:'start',
            }
        );

    var selectedUnitCount = this.selectedUnits.length;
    while(this.selectedUnits.length > 0){
        control.scene.removeUnit(this.selectedUnits[0]);
        this.deselectUnit(this.selectedUnits[0]);
    }
    this.lastSelectedUnits = null;

    //register bookend action
        control.actionRegistry.registerAction(
            {
                functionName:'control.selection.delete',
                count:selectedUnitCount,
                bookendPosition:'end',
            }
        );
};

this.clearClipboard = function(){ this.clipboard = [] };