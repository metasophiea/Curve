workspace.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','F2'],['command','F2']],
        function:function(data){ workspace.control.scene.load(undefined,undefined,true); return true; }
    }
);
workspace.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','F3'],['command','F3']],
        function:function(data){ workspace.control.scene.save(); return true; }
    }
);
workspace.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyX'],['command','KeyX']],
        function:function(data){ workspace.control.selection.cut(); return true; }
    }
);
workspace.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyC'],['command','KeyC']],
        function:function(data){
            workspace.system.keyboard.releaseKey('KeyC');
            workspace.control.selection.copy();
            return true;
        }
    }
);
workspace.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyV'],['command','KeyV']],
        function:function(data){
            workspace.system.keyboard.releaseKey('KeyV');
            workspace.control.selection.paste();
            return true; 
        }
    }
);
workspace.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['control','KeyB'],['command','KeyB']],
        function:function(data){ workspace.control.selection.duplicate(); return true; }
    }
);
workspace.system.keyboard.functionList.onkeydown.push(
    {
        requiredKeys:[['Delete'],['Backspace']],
        function:function(data){ workspace.control.selection.delete(); return true; }
    }
);