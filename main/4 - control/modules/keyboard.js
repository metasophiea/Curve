_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','F2'],['command','F2']],
        function:function(data){ 
            dev.log.mouse('.onkeydown[load scene](',data); //#development
            _canvas_.control.scene.load(undefined,undefined,true);
            _canvas_.system.keyboard.releaseAll();
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','F3'],['command','F3']],
        function:function(data){ 
            dev.log.mouse('.onmousedown[save scene](',data); //#development
            _canvas_.control.scene.save();
            _canvas_.system.keyboard.releaseAll();
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['shift','control','KeyZ'],['shift','command','KeyZ']],
        function:function(data){ 
            dev.log.mouse('.onmousedown[redo](',data); //#development
            _canvas_.control.actionRegistry.redo(); 
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyZ'],['command','KeyZ']],
        function:function(data){ 
            dev.log.mouse('.onmousedown[undo](',data); //#development
            _canvas_.control.actionRegistry.undo(); 
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyX'],['command','KeyX']],
        function:function(data){ 
            dev.log.mouse('.onmousedown[cut](',data); //#development
            _canvas_.system.keyboard.releaseAll(); 
            _canvas_.control.selection.cut(); 
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyC'],['command','KeyC']],
        function:function(data){
            dev.log.mouse('.onmousedown[copy](',data); //#development
            _canvas_.system.keyboard.releaseAll(); 
            _canvas_.control.selection.copy();
            return true;
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyV'],['command','KeyV']],
        function:function(data){
            dev.log.mouse('.onmousedown[paste](',data); //#development
            _canvas_.system.keyboard.releaseAll(); 
            _canvas_.control.selection.paste();
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyB'],['command','KeyB']],
        function:function(data){ 
            dev.log.mouse('.onmousedown[duplicate](',data); //#development
            _canvas_.control.selection.duplicate(); 
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['Delete'],['Backspace']],
        function:function(data){ 
            dev.log.mouse('.onmousedown[delete](',data); //#development
            _canvas_.control.selection.delete(); 
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','shift','KeyA'],['command','shift','KeyA']],
        function:function(data){ 
            dev.log.mouse('.onmousedown[deselect everything](',data); //#development
            _canvas_.control.selection.deselectEverything(); 
            return true; 
        }
    }
);
_canvas_.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyA'],['command','KeyA']],
        function:function(data){ 
            dev.log.mouse('.onmousedown[select everything](',data); //#development
            _canvas_.control.selection.selectEverything();
            return true; 
        }
    }
);