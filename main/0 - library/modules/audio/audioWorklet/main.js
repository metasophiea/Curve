this.audioWorklet = new function(){
    function checkIfReady(){
        dev.log.audio('.AudioWorklet::checkIfReady()'); //#development
        dev.log.audio('.AudioWorklet::checkIfReady -> worklets.length:',worklets.length); //#development
        if(worklets.length == 0){return true;}
        dev.log.audio('.AudioWorklet::checkIfReady -> worklets.map(a => a.loaded):',worklets.map(a => a.loaded) ); //#development
        return worklets.map(a => a.loaded).reduce((rolling,current) => {return rolling && current;});
    };
    this.checkIfReady = function(){ return checkIfReady(); };
    this.nowReady = function(){};

    const worklets = [
        {{include:production/manifest.js}}
        {{include:workshop/manifest.js}}
    ];
        
    worklets.forEach(worklet => {
        dev.log.audio('.AudioWorklet -> loading worklet:',worklet.name); //#development
        worklet.loaded = false;

        audio.context.audioWorklet.addModule(window.URL.createObjectURL(worklet.worklet)).then( () => {
            dev.log.audio('.AudioWorklet ->',worklet.name,'has been loaded'); //#development
            worklet.loaded = true;

            audio.audioWorklet[worklet.name] = worklet.class;

            if( checkIfReady() && this.nowReady != undefined ){
                this.nowReady();
            }
        } );
    });
};