this.selectedUnits = [];
this.lastSelectedUnits = null;
this.clipboard = [];
    // pane                 -   the pane the object came from
    // position             -   the X and Y of the original object
    // details              -   data on the unit's type
    //      collection
    //      category
    //      model
    // data                 -   the exported data from the original object
    // connections          -   an array of where to connect what
    //      typeAndNameOfSourcePort
    //      indexOfDestinationUnit
    //      typeAndNameOfDestinationPort

this.selectUnit = function(unit,shiftToFront=true){
    // console.log('selecting unit',unit);

    //check if object is already selected
        if( this.selectedUnits.indexOf(unit) != -1 ){return;}

    //shift object to front of view, (within it's particular pane)
        if(shiftToFront){
            var pane = workspace.system.pane.getMiddlegroundPane(unit);
            pane.remove(unit);
            pane.append(unit);
        }

    //colourize space
        var tmp = workspace.interface.part.alpha.builder( 
            'polygon', 'selectionGlow-'+unit.getAddress(), 
            { 
                points:unit.space.points.map(function(a){ return {x:a.x-unit.x,y:a.y-unit.y};}), 
                style:{ fill:'rgba(244, 226, 66, 0.25)', stroke:'rgba(244, 226, 66, 1)' } 
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
    // console.log('deselecting unit',unit);

    //decolourize space
        unit.remove( unit.getChildByName('selectionGlow-'+unit.getAddress()) );
    
    //remove unit from selectedUnits list, and activate it's "ondeselect" function
        this.selectedUnits.splice(this.selectedUnits.indexOf(unit),1);
        if(unit.ondeselect){unit.ondeselect();}
};
this.selectEverything = function(){
    // console.log('selecting everything');
    
    this.deselectEverything();
    for(var a = 0; a < workspace.system.pane.mm.children.length; a++){
        if( !workspace.system.pane.mm.children[a]._isCable ){
            this.selectUnit(workspace.system.pane.mm.children[a],false);
        }
    }
};
this.deselectEverything = function(){
    // console.log('deselecting everything');

    while(this.selectedUnits.length > 0){
        this.deselectUnit( this.selectedUnits[0] );
    }
};

this.cut = function(){
    this.copy();
    this.delete();
};
this.copy = function(){
    //firstly, empty the clipboard
        this.clipboard = [];

    //for all selected units; collect their data and add it to the clipboard
        for( var a = 0; a < this.selectedUnits.length; a++){
            var newEntry = {};

            //pane
                newEntry.pane = workspace.system.pane.getMiddlegroundPane(this.selectedUnits[a]).getAddress();

            //position
                newEntry.position = {x:this.selectedUnits[a].parameter.x(), y:this.selectedUnits[a].parameter.y()};

            //unitDetails
                newEntry.details = {
                    collection: this.selectedUnits[a].collection,
                    category: this.selectedUnits[a].category,
                    model: this.selectedUnits[a].model,
                };

            //data
                newEntry.data = this.selectedUnits[a].exportData ? this.selectedUnits[a].exportData() : null;

            //connections
                newEntry.connections = [];
                for(var connectionType in this.selectedUnits[a].io){
                    for(var connection in this.selectedUnits[a].io[connectionType]){
                        var foreignNode = this.selectedUnits[a].io[connectionType][connection].getForeignNode();
                        if(foreignNode == undefined){continue;}
                
                        var newConnectionEntry = {};

                        //typeAndNameOfSourcePort
                            newConnectionEntry.typeAndNameOfSourcePort = { type:connectionType, name:connection };

                        //indexOfDestinationUnit
                            newConnectionEntry.indexOfDestinationUnit = this.selectedUnits.indexOf(foreignNode.parent);

                        //typeAndNameOfDestinationPort
                            for(var foreignConnection in foreignNode.parent.io[connectionType]){
                                var con = foreignNode.parent.io[connectionType][foreignConnection];
                                if( con.getForeignNode() == undefined ){ continue; }
                                if( con.getForeignNode().name == connection ){
                                    newConnectionEntry.typeAndNameOfDestinationPort = { type:connectionType, name:foreignConnection };
                                }
                            }

                        newEntry.connections.push(newConnectionEntry);
                    }
                }
                
            this.clipboard.push(newEntry);
        }
};
this.paste = function(position){
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
                var topLeft = workspace.library.math.boundingBoxFromPoints(points).topLeft;

            //if no position has been provided at all; calculate a new one from the mouse position
                if(position == undefined){
                    var tmp = workspace.core.viewport.mousePosition();
                    if(tmp.x == undefined || tmp.y == undefined){
                        position = workspace.core.viewport.windowPoint2workspacePoint(0, 0);
                    }else{
                        position = workspace.core.viewport.windowPoint2workspacePoint(tmp.x, tmp.y);
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
        for(var a = 0; a < this.clipboard.length; a++){
            var item = this.clipboard[a];

            //create the object with its new position adding it to the pane
                var unit = control.scene.addUnit(item.position.x, item.position.y, item.details.model, item.details.category, item.details.collection);

            //import data and select unit
                if(unit.importData){unit.importData(item.data);}
                this.selectUnit(unit);

            //go through its connections, and attempt to connect them to everything they should be connected to
            // (don't worry if a object isn't available yet, just skip that one. Things will work out in the end)
                for(var b = 0; b < item.connections.length; b++){
                    var connection = item.connections[b];

                    var destinationUnit = this.selectedUnits[connection.indexOfDestinationUnit];
                    if(destinationUnit == undefined){continue;}

                    var sourceNode = unit.io[connection.typeAndNameOfSourcePort.type][connection.typeAndNameOfSourcePort.name];
                    var destinationNode = destinationUnit.io[connection.typeAndNameOfDestinationPort.type][connection.typeAndNameOfDestinationPort.name];
                    sourceNode.connectTo(destinationNode);
                }
        }
};
this.duplicate = function(){
    this.copy();
    this.paste('duplicate');
    this.clipboard = [];
};
this.delete = function(){
    while(this.selectedUnits.length > 0){
        var unit = this.selectedUnits[0];
        //delete object
            //run the unit's onDelete method
                if(unit.ondelete){unit.ondelete();}
            //run disconnect on every connection node of this unit
                unit.disconnectEverything();
            //remove the object from the pane it's in
                workspace.system.pane.getMiddlegroundPane(unit).remove(unit);
        //remove object from selected array
            this.selectedUnits.shift();
    }
    this.lastSelectedUnits = null;
};