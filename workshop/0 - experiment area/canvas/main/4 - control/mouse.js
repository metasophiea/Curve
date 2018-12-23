workspace.system.mouse.functionList.onmousedown.push(
    {
        'specialKeys':[],
        'function':function(data){

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

workspace.system.mouse.functionList.onwheel.push(
    {
        'specialKeys':[],
        'function':function(data){
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