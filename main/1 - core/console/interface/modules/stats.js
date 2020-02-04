this.stats = new function(){
    this.active = function(active){
        dev.log.interface('.stats.active(',active); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('stats.active',[active],resolve);
        });
    };
    this.getReport = function(){
        dev.log.interface('.stats.getReport()'); //#development
        return new Promise((resolve, reject) => {
            communicationModule.run('stats.getReport',[],resolve);
        });
    };
    let autoPrintActive = false;
    let autoPrintIntervalId = undefined;
    this.autoPrint = function(bool){
        if(bool == undefined){ return autoPrintActive; }
        autoPrintActive = bool;

        if(autoPrintActive){
            autoPrintIntervalId = setInterval(() => {
                _canvas_.core.stats.getReport().then(console.log)
            }, 500);
        }else{
            clearInterval(autoPrintIntervalId);
        }
    };
};