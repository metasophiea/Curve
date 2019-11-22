let elementRegistry = [];
const elementLibrary = new function(){
    {{include:modules/elementLibrary/main.js}}
};

this.meta = new function(){
    this.areYouReady = function(){
        dev.log.interface('.meta.areYouReady()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('areYouReady',[],resolve);
        });
    };
    this.refresh = function(){
        dev.log.interface('.meta.refresh()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('refresh',[],resolve);
        });
    };
};

this._dump = new function(){
    this.elememt = function(){
        dev.log.interface('._dump.elememt()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.element',[],resolve);
        });
    };
    this.arrangement = function(){
        dev.log.interface('._dump.arrangement()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.arrangement',[],resolve);
        });
    };
    this.render = function(){
        dev.log.interface('._dump.render()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.render',[],resolve);
        });
    };
    this.viewport = function(){
        dev.log.interface('._dump.viewport()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.viewport',[],resolve);
        });
    };
    this.callback = function(){
        dev.log.interface('._dump.callback()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('_dump.callback',[],resolve);
        });
    };
};

{{include:modules/element.js}}
{{include:modules/arrangement.js}}
{{include:modules/render.js}}
{{include:modules/viewport.js}}
{{include:modules/stats.js}}
{{include:modules/callback.js}}