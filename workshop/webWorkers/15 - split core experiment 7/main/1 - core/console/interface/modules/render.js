this.render = new function(){
    this.refresh = function(){
        dev.log.interface('.render.refresh()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.refresh',[],resolve);
        });
    };
    this.clearColour = function(colour){
        dev.log.interface('.render.clearColour('+JSON.stringify(colour)+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.clearColour',[colour],resolve);
        });
    };
    this.adjustCanvasSize = function(newWidth, newHeight){
        dev.log.interface('.render.adjustCanvasSize('+newWidth+','+newHeight+')'); //#development
        communicationModule.run('render.adjustCanvasSize',[newWidth, newHeight]);
    };
    this.getCanvasSize = function(){
        dev.log.interface('.render.getCanvasSize()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.getCanvasSize',[],resolve);
        });
    };
    this.activeLimitToFrameRate = function(active){
        dev.log.interface('.render.activeLimitToFrameRate('+active+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.activeLimitToFrameRate',[active],resolve);
        });
    };
    this.frameRateLimit = function(rate){
        dev.log.interface('.render.frameRateLimit('+rate+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.frameRateLimit',[rate],resolve);
        });
    };
    this.frame = function(){
        dev.log.interface('.render.frame()'); //#development
        communicationModule.run('render.frame',[]);
    };
    this.active = function(active){
        dev.log.interface('.render.active('+active+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('render.active',[active],resolve);
        });
    };
};
