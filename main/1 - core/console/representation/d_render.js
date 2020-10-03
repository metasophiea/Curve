this.render = new function(){
    const cachedValues = {
        clearColour:{r:1,g:1,b:1,a:1},
        activeLimitToFrameRate:false,
        frameRateLimit:30,
        active:false,
    };

    //canvas and webGL context
        this.clearColour = function(colour){
            dev.log.render('.clearColour(',colour); //#development
            if(colour == undefined){ return cachedValues.clearColour; }
            cachedValues.clearColour = colour;
            interface.operator.render.clearColour(colour);
        };
        this.getCanvasSize = function(){
            dev.log.render('.getCanvasSize()'); //#development
            return interface.operator.render.getCanvasSize();
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            dev.log.render('.adjustCanvasSize(',newWidth,newHeight); //#development
            interface.operator.render.adjustCanvasSize(newWidth, newHeight);
        };
        this.refreshCoordinates = function(){
            dev.log.render('.refreshCoordinates()'); //#development
            interface.operator.render.refreshCoordinates();
        };
        this.refresh = function(){
            dev.log.render('.refresh()'); //#development
            interface.operator.render.refresh();
        };

    //frame rate control
        this.activeLimitToFrameRate = function(a){
            dev.log.render('.activeLimitToFrameRate(',a); //#development
            if(a == undefined){ return cachedValues.activeLimitToFrameRate; }
            cachedValues.activeLimitToFrameRate = a;
            interface.operator.render.activeLimitToFrameRate(a);
        };
        this.frameRateLimit = function(a){
            dev.log.render('.frameRateLimit(',a); //#development
            if(a == undefined){ return cachedValues.frameRateLimit; }
            cachedValues.frameRateLimit = a;
            interface.operator.render.frameRateLimit(a);
        };

    //actual render
        this.frame = function(noClear=false){
            dev.log.render('.frame(',noClear); //#development
            interface.operator.render.frame(noClear);
        };
        this.active = function(bool){
            dev.log.render('.active(',bool); //#development
            if(bool == undefined){ return cachedValues.active; }
            cachedValues.active = bool;
            interface.operator.render.active(bool);
        };

    //misc
        this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
            dev.log.render('.drawDot(',x,y,r,colour); //#development
            interface.operator.render.drawDot(x,y,r,colour);
        };
        this._dump = function(){
            dev.log.render('._dump()'); //#development
            interface.operator.render._dump();
        };
};