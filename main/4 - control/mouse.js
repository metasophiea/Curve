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
            //control switch
                if(!_canvas_.control.interaction.mouseGroupSelect()){return;}



            //create selection graphic and add it to the foregroud
                var mouseDownPoint = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(data.x,data.y);
                _canvas_.system.mouse.tmp.selectionRectangle = _canvas_.interface.part.builder( 
                    'basic', 'rectangle', 'selectionRectangle', 
                    { x:mouseDownPoint.x, y:mouseDownPoint.y, width:0, height:0, colour:{r:224/255, g:184/255, b:252/255, a:0.25} } 
                );
                _canvas_.system.pane.mf.append( _canvas_.system.mouse.tmp.selectionRectangle );

            //follow mouse, adjusting selection rectangle as it moves. On mouse up, remove the rectangle and select all
            //units that touch the area
                _canvas_.system.mouse.tmp.start = {x:mouseDownPoint.x, y:mouseDownPoint.y};
                _canvas_.system.mouse.mouseInteractionHandler(
                    function(event){
                        var start = _canvas_.system.mouse.tmp.start;
                        var end = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

                        _canvas_.system.mouse.tmp.selectionRectangle.width( end.x - start.x );
                        _canvas_.system.mouse.tmp.selectionRectangle.height( end.y - start.y );
                    },
                    function(event){
                        _canvas_.system.pane.mf.remove( _canvas_.system.mouse.tmp.selectionRectangle );

                        var start = _canvas_.system.mouse.tmp.start;
                        var end = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(event.X,event.Y);

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
            _canvas_.control.selection.deselectEverything();
            
            //control switch
                if(!_canvas_.control.interaction.mouseGripPanningEnabled()){return;}




            //save the viewport position and click position
                _canvas_.system.mouse.tmp.oldPosition = _canvas_.core.viewport.position();
                _canvas_.system.mouse.tmp.clickPosition = {x:data.x, y:data.y};

            //perform viewport movement
                _canvas_.system.mouse.mouseInteractionHandler(
                    function(event){
                        //update the viewport position
                            _canvas_.core.viewport.position(
                                _canvas_.system.mouse.tmp.oldPosition.x - ((_canvas_.system.mouse.tmp.clickPosition.x-event.X)),
                                _canvas_.system.mouse.tmp.oldPosition.y - ((_canvas_.system.mouse.tmp.clickPosition.y-event.Y)),
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
_canvas_.system.mouse.functionList.onwheel.push(
    {
        requiredKeys:[],
        function:function(data){
            //control switch
                if(!_canvas_.control.interaction.mouseWheelZoomEnabled()){return;}



            var scaleLimits = {'max':20, 'min':0.1};

            //perform scale and associated pan
                //discover point under mouse
                    var originalPoint = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(data.x,data.y);
                //perform actual scaling
                    var scale = _canvas_.core.viewport.scale();
                    scale -= scale*(data.event.deltaY/100);
                    if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                    if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                    _canvas_.core.viewport.scale(scale);
                //discover new point under mouse
                    var newPoint = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(data.x,data.y);
                //pan so we're back at the old point (accounting for angle)
                    var pan = _canvas_.library.math.cartesianAngleAdjust(
                        (newPoint.x - originalPoint.x),
                        (newPoint.y - originalPoint.y),
                        _canvas_.core.viewport.angle()
                    );
                    var temp = _canvas_.core.viewport.position();
                    _canvas_.core.viewport.position(temp.x+pan.x*scale,temp.y+pan.y*scale)

            //request that the function list stop here
                return true;
        }
    }
);