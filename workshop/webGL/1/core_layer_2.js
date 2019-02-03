core.viewport = new function(){
    var state = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
    };

    this.position = function(x,y){
        if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
        state.position.x = x;
        state.position.y = y;
        core.arrangement.get().x = state.position.x;
        core.arrangement.get().y = state.position.y;
    };
    this.scale = function(s){
        if(s == undefined){return state.scale;}
        state.scale = s <= 0 ? 1 : s;
        core.arrangement.get().scale = state.scale;
    };
    this.angle = function(a){
        if(a == undefined){return state.angle;}
        state.angle = a;
        core.arrangement.get().angle = state.angle;
    };
};