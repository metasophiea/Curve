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
            canvas.system.mouse.tmp.onmousemove_old = canvas.onmousemove;
            canvas.system.mouse.tmp.onmouseleave_old = canvas.onmouseleave;
            canvas.system.mouse.tmp.onmouseup_old = canvas.onmouseup;

        //replace listener code
            //movement code
                canvas.onmousemove = function(event){ if(moveCode!=undefined){moveCode(event);} };
            //stopping code
                canvas.onmouseup = function(event){
                    if(stopCode != undefined){ stopCode(event); }
                    canvas.onmousemove = canvas.system.mouse.tmp.onmousemove_old;
                    canvas.onmouseleave = canvas.system.mouse.tmp.onmouseleave_old;
                    canvas.onmouseup = canvas.system.mouse.tmp.onmouseup_old;
                };
                canvas.onmouseleave = canvas.onmouseup;
    };
    this.forceMouseUp = function(){ canvas.onmouseup(); };
    
//connect callbacks to mouse function lists
    canvas.core.callback.onmousedown = function(x,y,event,shape){
        if(activateShapeFunctions('onmousedown',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmousedown)({event:event,x:x,y:y});
    };
    canvas.core.callback.onmousemove = function(x,y,event,shape){
        if(activateShapeFunctions('onmousemove',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmousemove)({event:event,x:x,y:y});
    };
    canvas.core.callback.onmouseup = function(x,y,event,shape){ 
        if(activateShapeFunctions('onmouseup',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseup)({event:event,x:x,y:y});
    };
    canvas.core.callback.onmouseleave = function(x,y,event,shape){
        if(activateShapeFunctions('onmouseleave',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseleave)({event:event,x:x,y:y});
    };
    canvas.core.callback.onmouseenter = function(x,y,event,shape){
        if(activateShapeFunctions('onmouseenter',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onmouseenter)({event:event,x:x,y:y});
    };
    canvas.core.callback.onwheel = function(x,y,event,shape){
        if(activateShapeFunctions('onwheel',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onwheel)({event:event,x:x,y:y});
    };
    canvas.core.callback.onclick = function(x,y,event,shape){
        if(activateShapeFunctions('onclick',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.onclick)({event:event,x:x,y:y});
    };
    canvas.core.callback.ondblclick = function(x,y,event,shape){
        if(activateShapeFunctions('ondblclick',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.mouse.functionList.ondblclick)({event:event,x:x,y:y});
    };

//creating the function lists (and adding a few basic functions)
    this.functionList.onmousedown = [
        {
            'specialKeys':[],
            'function':function(data){

                //save the viewport position and click position
                    canvas.system.mouse.tmp.oldPosition = canvas.core.viewport.position();
                    canvas.system.mouse.tmp.clickPosition = {x:data.event.x, y:data.event.y};

                //perform viewport movement
                    canvas.system.mouse.mouseInteractionHandler(
                        function(event){
                            //update the viewport position
                                canvas.core.viewport.position(
                                    canvas.system.mouse.tmp.oldPosition.x - ((canvas.system.mouse.tmp.clickPosition.x-event.x) / canvas.core.viewport.scale()),
                                    canvas.system.mouse.tmp.oldPosition.y - ((canvas.system.mouse.tmp.clickPosition.y-event.y) / canvas.core.viewport.scale()),
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
                    var scale = canvas.core.viewport.scale();
                    scale -= scale*(data.event.deltaY/100);
                    if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                    if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                    canvas.core.viewport.scale(scale);
                //discover new point under mouse
                    var newPoint = canvas.core.viewport.windowPoint2workspacePoint(data.event.x,data.event.y);
                //pan so we're back at the old point (accounting for angle)
                    var pan = canvas.library.math.cartesianAngleAdjust(
                        (newPoint.x - originalPoint.x),
                        (newPoint.y - originalPoint.y),
                        canvas.core.viewport.angle()
                    );
                    var temp = canvas.core.viewport.position();
                    canvas.core.viewport.position(temp.x+pan.x,temp.y+pan.y)

            //request that the function list stop here
                return true;
        }
    }
];
    this.functionList.onclick = [];
    this.functionList.ondblclick = [];
