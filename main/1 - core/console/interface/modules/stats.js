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
};