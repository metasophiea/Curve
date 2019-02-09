core.callback = new function(){
    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onkeydown', 'onkeyup',
    ];

    for(var a = 0; a < callbacks.length; a++){
        canvas[callbacks[a]] = function(callback){
            return function(event){
                //if core doesn't have this callback set up, just bail
                    if( !core.callback[callback] ){return;}
        
                //convert the point
                    var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);
        
                //get the shapes under this point that have this callback, in order of front to back
                    var shapes = core.arrangement.getElementUnderPoint(event.x,event.y).filter(a => a.onmousedown!=undefined);
        
                //activate core's callback, providing the converted point, original event, and shapes
                    core.callback[callback]( p.x, p.y, event, shapes );
            }
        }(callbacks[a]);
    }
};