var core = new function(){
    {{include:core.js}}
};
var surface = this;

this.arrangement = new function(){
    this.get = function(){return core.arrangement.get();};
    this.set = function(arrangement){return core.arrangement.set(arrangement);};
    this.createElement = function(type){return core.arrangement.createElement(type);};
    this.append = function(element){return core.arrangement.append(element);};
    this.prepend = function(element){return core.arrangement.prepend(element);};
    this.remove = function(element){return core.arrangement.remove(element);};
    this.getElementUnderPoint = function(x,y){return core.arrangement.getElementUnderPoint(x,y);};
    
    this.forceRefresh = function(element){return core.arrangement.forceRefresh(element);};
};
this.viewport = new function(){
    this.position = function(x,y){return core.viewport.position(x,y);};
    this.scale = function(s){return core.viewport.scale(s);};
    this.angle = function(a){return core.viewport.angle(a);};
    this.windowPoint2workspacePoint = function(x,y){ return core.viewport.windowPoint2workspacePoint(x,y); };
};
this.render = new function(){
    this.frame = function(noClear=false){return core.render.frame(noClear);};
    this.active = function(bool){return core.render.active(bool);};
};
this.stats = new function(){
    this.active = function(bool){return core.stats.active(bool);};
    this.getReport = function(){return core.stats.getReport();};
};
this.callback = new function(){
    this.onmousedown = function(x,y,event){};
    core.callback.onmousedown = function(surface){
        return function(x,y,event){ surface.onmousedown(x,y,event); };
    }(this);
    this.onmouseup = function(x,y,event){};
    core.callback.onmouseup = function(surface){
        return function(x,y,event){ surface.onmouseup(x,y,event); };
    }(this);
    this.onmousemove = function(x,y,event){};
    core.callback.onmousemove = function(surface){
        return function(x,y,event){ surface.onmousemove(x,y,event); };
    }(this);
    this.onmouseenter = function(x,y,event){};
    core.callback.onmouseenter = function(surface){
        return function(x,y,event){ surface.onmouseenter(x,y,event); };
    }(this);
    this.onmouseleave = function(x,y,event){};
    core.callback.onmouseleave = function(surface){
        return function(x,y,event){ surface.onmouseleave(x,y,event); };
    }(this);
    this.onwheel = function(x,y,event){};
    core.callback.onwheel = function(surface){
        return function(x,y,event){ surface.onwheel(x,y,event); };
    }(this);


    this.onkeydown = function(x,y,event){};
    core.callback.onkeydown = function(surface){
        return function(x,y,event){ surface.onkeydown(x,y,event); };
    }(this);
    this.onkeyup = function(x,y,event){};
    core.callback.onkeyup = function(surface){
        return function(x,y,event){ surface.onkeyup(x,y,event); };
    }(this);


    this.touchstart = function(x,y,event){};
    core.callback.touchstart = function(surface){
        return function(x,y,event){ surface.touchstart(x,y,event); };
    }(this);
    this.touchmove = function(x,y,event){};
    core.callback.touchmove = function(surface){
        return function(x,y,event){ surface.touchmove(x,y,event); };
    }(this);
    this.touchend = function(x,y,event){};
    core.callback.touchend = function(surface){
        return function(x,y,event){ surface.touchend(x,y,event); };
    }(this);
    this.touchenter = function(x,y,event){};
    core.callback.touchenter = function(surface){
        return function(x,y,event){ surface.touchenter(x,y,event); };
    }(this);
    this.touchleave = function(x,y,event){};
    core.callback.touchleave = function(surface){
        return function(x,y,event){ surface.touchleave(x,y,event); };
    }(this);
    this.touchcancel = function(x,y,event){};
    core.callback.touchcancel = function(surface){
        return function(x,y,event){ surface.touchcancel(x,y,event); };
    }(this);
};