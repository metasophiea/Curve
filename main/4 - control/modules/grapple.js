this.tmpdata = {};
this.tmpunit = undefined;
this.functionList = { onmousedown:[], onmouseup:[], };

this.declare = function(unit){
    dev.log.grapple('.declare(',unit); //#development

    function grappleFunctionRunner(list){
        return function(x,y,event){
            //save unit
                _canvas_.control.grapple.tmpunit = unit;
            
            //run through function list, and activate functions where necessary
                _canvas_.library.structure.functionListRunner(list,_canvas_.system.keyboard.pressedKeys)(event);
        };
    }

    unit.space.shape.attachCallback('onmousedown', grappleFunctionRunner( this.functionList.onmousedown ) );
    unit.space.shape.attachCallback('onmouseup', grappleFunctionRunner( this.functionList.onmouseup ) );
    return unit;
};



//selection of current unit and deselection of previous unit (if shift is not pressed)
this.functionList.onmousedown.push(
    {
        requiredKeys:[],
        function:function(event){
            dev.log.grapple(' - mouse.functionList.onmousedown[unit selection](',event); //#development

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
this.functionList.onmousedown.push(
    {
        requiredKeys:[['shift','alt']],
        function:function(event){
            dev.log.grapple(' - mouse.functionList.onmousedown[unit rotation](',event); //#development

            //control switch
                if(!interactionState.unitGrappleRotation){return;}
            
            //collect together information on the click position and the selected unit's positions and section area
                control.grapple.tmpdata.oldClickPosition = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                control.grapple.tmpdata.oldUnitsPositions = [];
                control.grapple.tmpdata.oldUnitsSelectionArea = [];
                control.grapple.tmpdata.focalPoint = {x:-1,y:-1};
                for(let a = 0; a < control.selection.selectedUnits.length; a++){
                    control.grapple.tmpdata.oldUnitsPositions.push( {x:control.selection.selectedUnits[a].x(), y:control.selection.selectedUnits[a].y(), angle:control.selection.selectedUnits[a].angle()} );
                    control.grapple.tmpdata.oldUnitsSelectionArea.push( Object.assign({},control.selection.selectedUnits[a].selectionArea) );
                    if(control.grapple.tmpdata.focalPoint.x == -1 || control.grapple.tmpdata.focalPoint.x > control.selection.selectedUnits[a].x()){ control.grapple.tmpdata.focalPoint.x = control.selection.selectedUnits[a].x(); }
                    if(control.grapple.tmpdata.focalPoint.y == -1 || control.grapple.tmpdata.focalPoint.y > control.selection.selectedUnits[a].y()){ control.grapple.tmpdata.focalPoint.y = control.selection.selectedUnits[a].y(); }
                }

            //perform the rotation for all selected units
                _canvas_.system.mouse.mouseInteractionHandler(
                    function(x,y,event){
                        for(let a = 0; a < control.selection.selectedUnits.length; a++){
                            const unit = control.selection.selectedUnits[a];

                            //calculate new angle
                                const rotationalMux = 1/100;
                                const oldClickPosition = control.grapple.tmpdata.oldClickPosition;
                                const newClickPosition = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                                const oldUnitPosition = control.grapple.tmpdata.oldUnitsPositions[a];

                                const producedAngle = (newClickPosition.y - oldClickPosition.y) * rotationalMux;

                            //rotate unit
                                unit.angle(oldUnitPosition.angle + producedAngle);

                            //calculate xy offset around the focal point of the angle adjust
                                const offset = _canvas_.library.math.cartesianAngleAdjust(
                                    oldUnitPosition.x - control.grapple.tmpdata.focalPoint.x,
                                    oldUnitPosition.y - control.grapple.tmpdata.focalPoint.y,
                                    producedAngle
                                );

                            //maintain position
                                unit.x(offset.x + control.grapple.tmpdata.focalPoint.x);
                                unit.y(offset.y + control.grapple.tmpdata.focalPoint.y);

                            //check if this new position is possible, and if not find the closest one that is and adjust the unit's position accordingly
                                _canvas_.control.scene.rectifyUnitPosition(unit);

                            //perform all redraws and updates for unit
                                if( unit.onrotate ){unit.onrotate();}
                                unit.ioRedraw();
                        }
                    },
                    function(x,y,event){},
                );

            return true;
        }
    }
);
this.functionList.onmousedown.push(
    {
        requiredKeys:[['alt']],
        function:function(){
            dev.log.grapple(' - mouse.functionList.onmousedown[duplicate](',event); //#development
            _canvas_.control.selection.duplicate(false);
        },
    }
);
this.functionList.onmouseup.push(
    {
        requiredKeys:[],
        function:function(){
            dev.log.grapple(' - mouse.functionList.onmouseup[unit rectification and io redraw](',event); //#development

            _canvas_.control.selection.selectedUnits.forEach(unit => {
                _canvas_.control.scene.rectifyUnitPosition(unit);
                unit.ioRedraw();
            });
        },
    }
);
//unit movement
this.functionList.onmousedown.push(
    {
        requiredKeys:[],
        function:function(event){
            dev.log.grapple(' - mouse.functionList.onmousedown[unit movement](',event); //#development

            //control switch
                if(!interactionState.unitGrapplePosition){return;}

            //collect together information on the click position and the selected unit's positions and section area
                control.grapple.tmpdata.oldClickPosition = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                control.grapple.tmpdata.oldUnitsPositions = [];
                control.grapple.tmpdata.oldUnitsSelectionArea = [];
                for(let a = 0; a < control.selection.selectedUnits.length; a++){
                    control.grapple.tmpdata.oldUnitsPositions.push( {x:control.selection.selectedUnits[a].x(),y:control.selection.selectedUnits[a].y()} );
                    control.grapple.tmpdata.oldUnitsSelectionArea.push( Object.assign({},control.selection.selectedUnits[a].selectionArea) );
                }

            //perform the move for all selected units
                _canvas_.system.mouse.mouseInteractionHandler(
                    function(x,y,event){
                        for(let a = 0; a < control.selection.selectedUnits.length; a++){
                            const unit = control.selection.selectedUnits[a];

                            //calculate new position
                                const oldClickPosition = control.grapple.tmpdata.oldClickPosition;
                                const newClickPosition = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);
                                const oldUnitPosition = control.grapple.tmpdata.oldUnitsPositions[a];
                                const newUnitPosition = {
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
                                unit.ioRedraw();
                        }
                    },
                    function(x,y,event){}
                );

            return true;
        }
    }
);

//deselection of unit (with shift pressed)
this.functionList.onmouseup.push(
    {
        requiredKeys:[['shift']],
        function:function(event){
            dev.log.grapple(' - mouse.functionList.onmouseup[unselection of unit](',event); //#development

            //if mouse-up occurs over an unit that is selected
            // and if the shift key is pressed
            // and if the unit we're working on is not the most recently selected
            //  deselect the unit we're working on
            // now set the most recently selected reference to null
                if( control.selection.selectedUnits.indexOf(control.grapple.tmpunit) != -1 ){
                    if( control.selection.lastSelectedUnit != control.grapple.tmpunit ){
                        control.selection.deselectUnit(control.grapple.tmpunit);
                    }
                    control.selection.lastSelectedUnit = null;
                }

            return true;
        }
    }
);