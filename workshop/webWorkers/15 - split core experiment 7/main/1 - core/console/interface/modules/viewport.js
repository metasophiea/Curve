this.viewport = new function(){
    this.refresh = function(){
        dev.log.interface('.viewport.refresh()'); //#development
        communicationModule.run('viewport.refresh',[]);
    };
    this.position = function(x,y){
        dev.log.interface('.viewport.position('+x+','+y+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.position',[x,y],resolve);
        });
    };
    this.scale = function(s){
        dev.log.interface('.viewport.scale('+s+')'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('viewport.scale',[s],resolve);
        });
    };
    this.angle = function(a){
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
};