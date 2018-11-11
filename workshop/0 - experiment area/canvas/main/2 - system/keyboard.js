canvas.core.callback.onkeydown = function(x,y,event){
    //if key is already pressed, don't press it again
        if(canvas.system.keyboard.pressedKeys[event.code]){ return; }
        canvas.system.keyboard.pressedKeys[event.code] = true;
    
    //perform action
        canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeydown)(event,{x:x,y:y});
};
canvas.core.callback.onkeyup = function(x,y,event){
    //if key isn't pressed, don't release it
        if(!canvas.system.keyboard.pressedKeys[event.code]){return;}
        delete canvas.system.keyboard.pressedKeys[event.code];
    
    //perform action
        canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeyup)(event,{x:x,y:y});
};

this.releaseAll = function(){
    for(var a = 0; a < this.pressedKeys.length; a++){
        this.releaseKey(this.pressedKeys[a]);
    }
};
this.releaseKey = function(keyCode){
    canvas.onkeyup( new KeyboardEvent('keyup',{'key':keyCode}) );
}

this.pressedKeys = {};

this.functionList = {};
this.functionList.onkeydown = [
    {
        'specialKeys':[],
        'function':function(event,data){}
    }
];
this.functionList.onkeyup = [
    {
        'specialKeys':[],
        'function':function(event,data){}
    }
];