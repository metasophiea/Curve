//close dropdowns on click
workspace.system.mouse.functionList.onmousedown.push(
    {
        requiredKeys:[],
        function:function(data){
            //close any open menubar dropdowns
                workspace.control.gui.closeAllDropdowns();
        }
    }
);
//group select (shift)
workspace.system.mouse.functionList.onmousedown.push(
    {
        requiredKeys:[['shift']],
        function:function(data){
            //control switch
                if(!workspace.control.switch.mouseGroupSelect){return;}



            //creat selection graphic and add it to the foregroud
                workspace.system.mouse.tmp.selectionRectangle = workspace.interface.part.alpha.builder( 
                    'rectangle', 'selectionRectangle', 
                    { x:data.x, y:data.y, width:0, height:0, style:{ fill:'rgba(224, 184, 252, 0.25)' } } 
                );
                workspace.system.pane.mf.append( workspace.system.mouse.tmp.selectionRectangle );

            //follow mouse, adjusting selection rectangle as it moves. On mouse up, remove the rectangle and select all
            //units that touch the area
                workspace.system.mouse.tmp.start = {x:data.x, y:data.y};
                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        var start = workspace.system.mouse.tmp.start;
                        var end = workspace.core.viewport.windowPoint2workspacePoint(event.x,event.y);

                        workspace.system.mouse.tmp.selectionRectangle.parameter.width( end.x - start.x );
                        workspace.system.mouse.tmp.selectionRectangle.parameter.height( end.y - start.y );
                    },
                    function(event){
                        workspace.system.pane.mf.remove( workspace.system.mouse.tmp.selectionRectangle );

                        var start = workspace.system.mouse.tmp.start;
                        var end = workspace.core.viewport.windowPoint2workspacePoint(event.x,event.y);

                        workspace.control.selection.selectUnits(
                            workspace.control.scene.getUnitsWithinPoly([ {x:start.x,y:start.y}, {x:end.x,y:start.y}, {x:end.x,y:end.y}, {x:start.x,y:end.y} ]) 
                        );
                    },
                );

            return true;
        }
    }
);
//panning
workspace.system.mouse.functionList.onmousedown.push(
    {
        requiredKeys:[],
        function:function(data){
            //control switch
                if(!workspace.control.switch.mouseGripPanningEnabled){return;}



            workspace.control.selection.deselectEverything();

            //save the viewport position and click position
                workspace.system.mouse.tmp.oldPosition = workspace.core.viewport.position();
                workspace.system.mouse.tmp.clickPosition = {x:data.event.x, y:data.event.y};

            //perform viewport movement
                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        //update the viewport position
                            workspace.core.viewport.position(
                                workspace.system.mouse.tmp.oldPosition.x - ((workspace.system.mouse.tmp.clickPosition.x-event.x) / workspace.core.viewport.scale()) * window.devicePixelRatio,
                                workspace.system.mouse.tmp.oldPosition.y - ((workspace.system.mouse.tmp.clickPosition.y-event.y) / workspace.core.viewport.scale()) * window.devicePixelRatio,
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
workspace.system.mouse.functionList.onwheel.push(
    {
        requiredKeys:[],
        function:function(data){
            //control switch
                if(!workspace.control.switch.mouseWheelZoomEnabled){return;}



            var scaleLimits = {'max':20, 'min':0.1};

            //perform scale and associated pan
                //discover point under mouse
                    var originalPoint = {x:data.x, y:data.y};
                //perform actual scaling
                    var scale = workspace.core.viewport.scale();
                    scale -= scale*(data.event.deltaY/100);
                    if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                    if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                    workspace.core.viewport.scale(scale);
                //discover new point under mouse
                    var newPoint = workspace.core.viewport.windowPoint2workspacePoint(data.event.x,data.event.y);
                //pan so we're back at the old point (accounting for angle)
                    var pan = workspace.library.math.cartesianAngleAdjust(
                        (newPoint.x - originalPoint.x),
                        (newPoint.y - originalPoint.y),
                        workspace.core.viewport.angle()
                    );
                    var temp = workspace.core.viewport.position();
                    workspace.core.viewport.position(temp.x+pan.x,temp.y+pan.y)

            //request that the function list stop here
                return true;
        }
    }
);