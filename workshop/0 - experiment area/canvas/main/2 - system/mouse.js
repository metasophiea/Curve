//setup
    this.tmp = {}; //for storing values
    this.functionList = {};

//utility functions
    function activateShapeFunctions(listenerName, x,y,event,shape){
        //starting with the shape under this point and climbing through all it's parents; look
        //for 'listenerName' listeners. If one is found, activate it, stop climbing and return 'true'
        //if no shape has a listener, return 'false'

            var tmp = shape;
            if(tmp == undefined){return false;}
            do{
                if( tmp[listenerName] != undefined ){ tmp[listenerName](x,y,event); return true; }
            }while( (tmp = tmp.parent) != undefined )

            return false;
    }
    this.mouseInteractionHandler = function(moveCode, stopCode){
        //save the old listener functions of the canvas
            workspace.system.mouse.tmp.onmousemove_old = workspace.onmousemove;
            workspace.system.mouse.tmp.onmouseleave_old = workspace.onmouseleave;
            workspace.system.mouse.tmp.onmouseup_old = workspace.onmouseup;

        //replace listener code
            //movement code
                workspace.onmousemove = function(event){ if(moveCode!=undefined){moveCode(event);} };
            //stopping code
                workspace.onmouseup = function(event){
                    if(stopCode != undefined){ stopCode(event); }
                    workspace.onmousemove = workspace.system.mouse.tmp.onmousemove_old;
                    workspace.onmouseleave = workspace.system.mouse.tmp.onmouseleave_old;
                    workspace.onmouseup = workspace.system.mouse.tmp.onmouseup_old;
                };
                workspace.onmouseleave = workspace.onmouseup;
    };
    this.forceMouseUp = function(){ workspace.onmouseup(); };
    
//connect callbacks to mouse function lists
    workspace.core.callback.onmousedown = function(x,y,event,shape){
        if(activateShapeFunctions('onmousedown',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmousedown)({event:event,x:x,y:y});
    };
    workspace.core.callback.onmousemove = function(x,y,event,shape){
        if(activateShapeFunctions('onmousemove',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmousemove)({event:event,x:x,y:y});
    };
    workspace.core.callback.onmouseup = function(x,y,event,shape){ 
        if(activateShapeFunctions('onmouseup',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmouseup)({event:event,x:x,y:y});
    };
    workspace.core.callback.onmouseleave = function(x,y,event,shape){
        if(activateShapeFunctions('onmouseleave',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmouseleave)({event:event,x:x,y:y});
    };
    workspace.core.callback.onmouseenter = function(x,y,event,shape){
        if(activateShapeFunctions('onmouseenter',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmouseenter)({event:event,x:x,y:y});
    };
    workspace.core.callback.onwheel = function(x,y,event,shape){
        if(activateShapeFunctions('onwheel',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onwheel)({event:event,x:x,y:y});
    };
    workspace.core.callback.onclick = function(x,y,event,shape){
        if(activateShapeFunctions('onclick',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onclick)({event:event,x:x,y:y});
    };
    workspace.core.callback.ondblclick = function(x,y,event,shape){
        if(activateShapeFunctions('ondblclick',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.ondblclick)({event:event,x:x,y:y});
    };

//creating the function lists (and adding a few basic functions)
    this.functionList.onmousedown = [
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
                                    workspace.system.mouse.tmp.oldPosition.x - ((workspace.system.mouse.tmp.clickPosition.x-event.x) / workspace.core.viewport.scale()),
                                    workspace.system.mouse.tmp.oldPosition.y - ((workspace.system.mouse.tmp.clickPosition.y-event.y) / workspace.core.viewport.scale()),
                                );
                        },
                        function(event){},
                    );

                //request that the function list stop here
                    return true;
            }
        }
    ];
    this.functionList.onmousemove = [];
    this.functionList.onmouseup = [];
    this.functionList.onmouseleave = [];
    this.functionList.onmouseenter = [];
    this.functionList.onwheel = [
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
];
    this.functionList.onclick = [];
    this.functionList.ondblclick = [];
