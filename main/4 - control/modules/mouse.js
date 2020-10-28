//close dropdowns on click
_canvas_.system.mouse.functionList.onmousedown.push(
    {
        requiredKeys:[],
        function:function(){
            //close any open menubar dropdowns
                _canvas_.control.gui.closeAllDropdowns();
        }
    }
);
//group select (shift)
_canvas_.system.mouse.functionList.onmousedown.push(
    {
        requiredKeys:[['shift']],
        function:function(data){
            dev.log.mouse('.onmousedown[group select (shift)](',data); //#development

            //control switch
                if(!interactionState.mouseGroupSelect){return;}

            //create selection graphic and add it to the foreground
                _canvas_.system.mouse.tmp.selectionRectangle = _canvas_.interface.part.builder( 
                    'basic', 'rectangle', 'selectionRectangle', 
                    { x:data.x, y:data.y, width:0, height:0, colour:{r:224/255, g:184/255, b:252/255, a:0.25} } 
                );
                _canvas_.system.pane.mf.append( _canvas_.system.mouse.tmp.selectionRectangle );

            //follow mouse, adjusting selection rectangle as it moves. On mouse up, remove the rectangle and select all
            //units that touch the area
                _canvas_.system.mouse.tmp.start = {x:data.x, y:data.y};
                _canvas_.system.mouse.mouseInteractionHandler(
                    function(x,y,event){
                        const start = _canvas_.system.mouse.tmp.start;
                        const end = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);

                        _canvas_.system.mouse.tmp.selectionRectangle.width( end.x - start.x );
                        _canvas_.system.mouse.tmp.selectionRectangle.height( end.y - start.y );
                    },
                    function(x,y,event){
                        _canvas_.system.pane.mf.remove( _canvas_.system.mouse.tmp.selectionRectangle );

                        const start = _canvas_.system.mouse.tmp.start;
                        const end = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);

                        _canvas_.control.selection.selectUnits(
                            _canvas_.control.scene.getUnitsWithinPoly([ {x:start.x,y:start.y}, {x:end.x,y:start.y}, {x:end.x,y:end.y}, {x:start.x,y:end.y} ]) 
                        );
                    },
                );

            return true;
        }
    }
);
//panning
_canvas_.system.mouse.functionList.onmousedown.push(
    {
        requiredKeys:[],
        function:function(data){
            dev.log.mouse('.onmousedown[panning](',data); //#development

            _canvas_.control.selection.deselectEverything();
            
            //control switch
                if(!interactionState.mouseGripPanning){return;}

            //save the viewport position and click position
                _canvas_.system.mouse.tmp.oldPosition = _canvas_.control.viewport.position(); //workspace
                _canvas_.system.mouse.tmp.clickPosition = {x:data.event.x, y:data.event.y}; //window

            //perform viewport movement
                _canvas_.system.mouse.mouseInteractionHandler(
                    function(x,y,event){
                        //calculate diff
                            const pan = _canvas_.library.math.cartesianAngleAdjust(
                                (_canvas_.system.mouse.tmp.clickPosition.x - event.x) / _canvas_.control.viewport.scale(),
                                (_canvas_.system.mouse.tmp.clickPosition.y - event.y) / _canvas_.control.viewport.scale(),
                                -_canvas_.control.viewport.angle()
                            );
                        //update the viewport position
                            _canvas_.control.viewport.position(
                                _canvas_.system.mouse.tmp.oldPosition.x + pan.x,
                                _canvas_.system.mouse.tmp.oldPosition.y + pan.y,
                            );
                    },
                    function(event){},
                );

            //request that the function list stop here
                return true;
        }
    }
);

//zoom
this.mouseWheelMode = 'magic'; // magic / clickyWheel
_canvas_.system.mouse.functionList.onwheel.push(
    {
        requiredKeys:[],
        function:function(data){
            dev.log.mouse('.onwheel[zoom](',data); //#development

            //control switch
                if(!interactionState.mouseWheelZoom){return;}

            const scaleLimits = {'max':20, 'min':0.1};
            
            let delta = data.event.wheelDeltaY;
            switch(control.mouseWheelMode){
                case 'magic':
                    //already perfect, xoxo
                break;
                case 'clickyWheel':
                    delta = 25*Math.sign(delta);
                break;
            }

            //perform scaling math
                let scale = _canvas_.control.viewport.scale();
                scale += scale*(delta/100);
                if( scale > scaleLimits.max ){ scale = scaleLimits.max; }
                else if( scale < scaleLimits.min ){ scale = scaleLimits.min; }
            //actual scaling
                _canvas_.core.viewport.scaleAroundWindowPoint(scale, data.event.x, data.event.y);

            //request that the function list stop here
                return true;
        }
    }
);