this.audioWorklet = new function(){
    function checkIfReady(){
        if(worklets.length == 0){return true;}
        return worklets.map(a => a.loaded).reduce((rolling,current) => {return rolling && current;});
    };
    this.nowReady = function(){};

    const worklets = [
        {{include:workletList.js}}
    ];
        
    worklets.forEach(worklet => {
        dev.log.audio('.AudioWorklet -> loading worklet:',worklet.name); //#development
        worklet.loaded = false;

        audio.context.audioWorklet.addModule(window.URL.createObjectURL(worklet.blob)).then( () => {
            dev.log.audio('.AudioWorklet ->',worklet.name,'has been loaded'); //#development
            worklet.loaded = true;
            const creationFunctionName = 'create'+worklet.name.charAt(0).toUpperCase() + worklet.name.slice(1);
            dev.log.audio('.AudioWorklet -> creationFunctionName:',creationFunctionName); //#development
            audio.context[creationFunctionName] = function(){
                return new AudioWorkletNode(_canvas_.library.audio.context, worklet.name, worklet.options);
            };

            if( checkIfReady() && this.nowReady != undefined ){
                this.nowReady();
            }
        } );
    });
};