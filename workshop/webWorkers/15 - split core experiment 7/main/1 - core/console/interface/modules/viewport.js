this.viewport = new function(){
    const cachedValues = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
    };

    //adapter
        this.adapter = new function(){
            this.windowPoint2workspacePoint = function(x,y){
                dev.log.interface('.viewport.adapter.windowPoint2workspacePoint('+x+','+y+')'); //#development
                const position = cachedValues.position;
                const scale = cachedValues.scale;
                const angle = cachedValues.angle;

                let tmp = {x:x, y:y};
                tmp.x = (tmp.x - position.x)/scale;
                tmp.y = (tmp.y - position.y)/scale;
                tmp = _canvas_.library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);

                return tmp;
            };
            // this.workspacePoint2windowPoint = function(x,y){
                // const position = cachedValues.position;
                // const scale = cachedValues.scale;
                // const angle = cachedValues.angle;

            //     let point = _canvas_.library.math.cartesianAngleAdjust(x,y,angle);

            //     return {
            //         x: (point.x+position.x) * scale,
            //         y: (point.y+position.y) * scale
            //     };
            // };
        };

    this.refresh = function(){
        dev.log.interface('.viewport.refresh()'); //#development
        communicationModule.run('viewport.refresh',[]);
    };
    this.position = function(x,y){
        if(x==undefined || y==undefined){ return cachedValues.position; }
        cachedValues.position = {x:x,y:y};
        dev.log.interface('.viewport.position('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.position',[x,y],resolve);
        });
    };
    this.scale = function(s){
        if(s==undefined){ return cachedValues.scale; }
        cachedValues.scale = s;
        dev.log.interface('.viewport.scale('+s+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.scale',[s],resolve);
        });
    };
    this.angle = function(a){
        if(a==undefined){ return cachedValues.angle; }
        cachedValues.angle = a;
        dev.log.interface('.viewport.angle('+a+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.angle',[a],resolve);
        });
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.interface('.viewport.getElementsUnderPoint('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.getElementsUnderPoint',[x,y],resolve);
        });
    };
    this.getElementsUnderArea = function(points){
        dev.log.interface('.viewport.getElementsUnderArea('+JSON.stringify(points)+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.getElementsUnderArea',[points],resolve);
        });
    };
    this.getMousePosition = function(x,y){
        dev.log.interface('.viewport.getMousePosition('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.getMousePosition',[x,y],resolve);
        });
    };
    this.getBoundingBox = function(){
        dev.log.interface('.viewport.getBoundingBox()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.getBoundingBox',[],resolve);
        });
    };
    this.stopMouseScroll = function(bool){
        dev.log.interface('.viewport.stopMouseScroll('+bool+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.stopMouseScroll',[bool],resolve);
        });
    };

    this.cursor = function(type){
        //cursor types: https://www.w3schools.com/csSref/tryit.asp?filename=trycss_cursor
        if(type == undefined){return document.body.style.cursor;}
        document.body.style.cursor = type;
    };
};