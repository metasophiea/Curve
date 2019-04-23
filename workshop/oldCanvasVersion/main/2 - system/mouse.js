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
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmousedown,workspace.system.keyboard.pressedKeys)({event:event,x:x,y:y});
    };
    workspace.core.callback.onmousemove = function(x,y,event,shape){
        if(activateShapeFunctions('onmousemove',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmousemove,workspace.system.keyboard.pressedKeys)({event:event,x:x,y:y});
    };
    workspace.core.callback.onmouseup = function(x,y,event,shape){ 
        if(activateShapeFunctions('onmouseup',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmouseup,workspace.system.keyboard.pressedKeys)({event:event,x:x,y:y});
    };
    workspace.core.callback.onmouseleave = function(x,y,event,shape){
        if(activateShapeFunctions('onmouseleave',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmouseleave,workspace.system.keyboard.pressedKeys)({event:event,x:x,y:y});
    };
    workspace.core.callback.onmouseenter = function(x,y,event,shape){
        if(activateShapeFunctions('onmouseenter',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onmouseenter,workspace.system.keyboard.pressedKeys)({event:event,x:x,y:y});
    };
    workspace.core.callback.onwheel = function(x,y,event,shape){
        if(activateShapeFunctions('onwheel',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onwheel,workspace.system.keyboard.pressedKeys)({event:event,x:x,y:y});
    };
    workspace.core.callback.onclick = function(x,y,event,shape){
        if(activateShapeFunctions('onclick',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.onclick,workspace.system.keyboard.pressedKeys)({event:event,x:x,y:y});
    };
    workspace.core.callback.ondblclick = function(x,y,event,shape){
        if(activateShapeFunctions('ondblclick',x,y,event,shape)){return;}
        workspace.library.structure.functionListRunner(workspace.system.mouse.functionList.ondblclick,workspace.system.keyboard.pressedKeys)({event:event,x:x,y:y});
    };

//creating the function lists
    this.functionList.onmousedown = [];
    this.functionList.onmousemove = [];
    this.functionList.onmouseup = [];
    this.functionList.onmouseleave = [];
    this.functionList.onmouseenter = [];
    this.functionList.onwheel = [];
    this.functionList.onclick = [];
    this.functionList.ondblclick = [];
