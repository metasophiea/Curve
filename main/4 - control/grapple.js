_canvas_.control.grapple = {
    tmpdata:{},
    tmpunit:undefined,
    functionList:{ onmousedown:[], onmouseup:[], },
    declare:function(unit){

        function grappleFunctionRunner(list){
            return function(x,y,event){
                //ensure that it's the action button on the mouse
                    if(event.button != 0){return;}

                //save unit
                    _canvas_.control.grapple.tmpunit = this.unit;
                
                //run through function list, and activate functions where necessary
                    _canvas_.library.structure.functionListRunner(list,_canvas_.system.keyboard.pressedKeys)(event);
            };
        }

        unit.space.shape.onmousedown = grappleFunctionRunner( this.functionList.onmousedown );
        unit.space.shape.onmouseup = grappleFunctionRunner( this.functionList.onmouseup );
        return unit;
    },
};


//selection of current unit and deselection of previous unit (if shift is not pressed)
_canvas_.control.grapple.functionList.onmousedown.push(
    {
        requiredKeys:[],
        function:function(event){
            var control = _canvas_.control;

            // if mousedown occurs over an unit that isn't selected
            //  and if the shift key is not pressed
            //   deselect everything
            //  now, select the unit we're working on if not selected
                if( !control.selection.selectedUnits.includes(control.grapple.tmpunit) ){
                    if(!event.shiftKey){ control.selection.deselectEverything(); }
                    control.selection.selectUnit(control.grapple.tmpunit);
                }
        },
    }
);
//unit rotation
_canvas_.control.grapple.functionList.onmousedown.push(
    {
        requiredKeys:[['shift','alt']],
        function:function(event){
            var control = _canvas_.control;
            
            //collect together information on the click position and the selected unit's positions and section area
                control.grapple.tmpdata.oldClickPosition = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                control.grapple.tmpdata.oldUnitsPositions = [];
                control.grapple.tmpdata.oldUnitsSelectionArea = [];
                for(var a = 0; a < control.selection.selectedUnits.length; a++){
                    control.grapple.tmpdata.oldUnitsPositions.push( {x:control.selection.selectedUnits[a].x(), y:control.selection.selectedUnits[a].y(), angle:control.selection.selectedUnits[a].angle()} );
                    control.grapple.tmpdata.oldUnitsSelectionArea.push( Object.assign({},control.selection.selectedUnits[a].selectionArea) );
                }

            //perform the rotation for all selected units
                _canvas_.system.mouse.mouseInteractionHandler(
                    function(event){

                        for(var a = 0; a < control.selection.selectedUnits.length; a++){
                            var unit = control.selection.selectedUnits[a];

                            //calculate new angle
                                var rotationalMux = 1;
                                var oldClickPosition = control.grapple.tmpdata.oldClickPosition;
                                var newClickPosition = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                                var oldUnitAngle = control.grapple.tmpdata.oldUnitsPositions[a].angle;
                                var newUnitAngle = oldUnitAngle + ((newClickPosition.y - oldClickPosition.y) / 100 ) * rotationalMux;

                            //rotate unit
                                unit.angle(newUnitAngle);

                            //check if this new position is possible, and if not find the closest one that is and adjust the unit's position accordingly
                                _canvas_.control.scene.rectifyUnitPosition(unit);

                            //perform all redraws and updates for unit
                                if( unit.onrotate ){unit.onrotate();}
                                if( unit.io ){
                                    var connectionTypes = Object.keys( unit.io );
                                    for(var connectionType = 0; connectionType < connectionTypes.length; connectionType++){
                                        var connectionNodes = unit.io[connectionTypes[connectionType]];
                                        var nodeNames = Object.keys( connectionNodes );
                                        for(var b = 0; b < nodeNames.length; b++){
                                            connectionNodes[nodeNames[b]].draw();
                                        }
                                    }
                                }
                        }

                    },
                    function(event){},
                );

            return true;
        }
    }
);
_canvas_.control.grapple.functionList.onmousedown.push(
    {
        requiredKeys:[['alt']],
        function:function(){ _canvas_.control.selection.duplicate(); },
    }
);
//unit movement
_canvas_.control.grapple.functionList.onmousedown.push(
    {
        requiredKeys:[],
        function:function(event){
            var control = _canvas_.control;

            //collect together information on the click position and the selected unit's positions and section area
                control.grapple.tmpdata.oldClickPosition = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                control.grapple.tmpdata.oldUnitsPositions = [];
                control.grapple.tmpdata.oldUnitsSelectionArea = [];
                for(var a = 0; a < control.selection.selectedUnits.length; a++){
                    control.grapple.tmpdata.oldUnitsPositions.push( {x:control.selection.selectedUnits[a].x(),y:control.selection.selectedUnits[a].y()} );
                    control.grapple.tmpdata.oldUnitsSelectionArea.push( Object.assign({},control.selection.selectedUnits[a].selectionArea) );
                }

            //perform the move for all selected units
                _canvas_.system.mouse.mouseInteractionHandler(
                    function(event){
                        for(var a = 0; a < control.selection.selectedUnits.length; a++){
                            var unit = control.selection.selectedUnits[a];

                            //calculate new position
                                var oldClickPosition = control.grapple.tmpdata.oldClickPosition;
                                var newClickPosition = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                                var oldUnitPosition = control.grapple.tmpdata.oldUnitsPositions[a];
                                var newUnitPosition = {
                                    x: oldUnitPosition.x + (newClickPosition.x - oldClickPosition.x),
                                    y: oldUnitPosition.y + (newClickPosition.y - oldClickPosition.y),
                                };

                            //move unit
                                unit.x(newUnitPosition.x);
                                unit.y(newUnitPosition.y);

                            //check if this new position is possible, and if not find the closest one that is and adjust the unit's position accordingly
                                _canvas_.control.scene.rectifyUnitPosition(unit);

                            //perform all redraws and updates for unit
                                if( unit.onmove ){unit.onmove();}
                                if( unit.io ){
                                    var connectionTypes = Object.keys( unit.io );
                                    for(var connectionType = 0; connectionType < connectionTypes.length; connectionType++){
                                        var connectionNodes = unit.io[connectionTypes[connectionType]];
                                        var nodeNames = Object.keys( connectionNodes );
                                        for(var b = 0; b < nodeNames.length; b++){
                                            connectionNodes[nodeNames[b]].draw();
                                        }
                                    }
                                }
                                
                        }
                    },
                    function(event){}
                );

            return true;
        }
    }
);

//unselection of unit (with shift pressed)
_canvas_.control.grapple.functionList.onmouseup.push(
    {
        requiredKeys:[],
        function:function(event){
            var control = _canvas_.control;

            //if mouse-up occurs over an unit that is selected
            // and if the shift key is pressed
            // and if the unit we're working on is not the most recently selected
            //  deselect the unit we're working on
            // now set the most recently selected reference to null
                if( control.selection.selectedUnits.includes(control.grapple.tmpunit) ){
                    if( event.shiftKey && (control.selection.lastSelectedUnits != control.grapple.tmpunit) ){
                        control.selection.deselectUnit(control.grapple.tmpunit);
                    }
                    control.selection.lastSelectedUnits = null;
                }

            return true;
        }
    }
);