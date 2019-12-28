this.width = function(){ 
    return _canvas_.width;///window.devicePixelRatio; 
};
this.height = function(){ 
    return _canvas_.height;///window.devicePixelRatio; 
};

this.position = function(x,y){
    dev.log.interaction('.position(',x,y); //#development
    return _canvas_.core.viewport.position(x,y); 
};
this.scale = function(a){
    dev.log.interaction('.scale(',a); //#development
    return _canvas_.core.viewport.scale(a); 
};
this.angle = function(a){
    dev.log.interaction('.angle(',a); //#development
    return _canvas_.core.viewport.angle(a); 
};
this.refresh = function(){ 
    dev.log.interaction('.refresh()'); //#development
    _canvas_.core.meta.refresh();
    control.gui.refresh();
};
this.stopMouseScroll = function(bool){ 
    dev.log.interaction('.stopMouseScroll(',bool); //#development
    return _canvas_.core.viewport.stopMouseScroll(bool); 
};
this.activeRender = function(bool){ 
    dev.log.interaction('.activeRender(',bool); //#development
    return _canvas_.core.render.active(bool); 
};