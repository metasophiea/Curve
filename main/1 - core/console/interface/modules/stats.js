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

    let onScreenAutoPrint_active = false;
    let onScreenAutoPrint_intervalId = false;
    let onScreenAutoPrint_section = undefined;
    this.onScreenAutoPrint = function(bool){
        if(bool == undefined){ return onScreenAutoPrint_active; }
        onScreenAutoPrint_active = bool;

        _canvas_.core.stats.active(bool);

        if(onScreenAutoPrint_active){
            onScreenAutoPrint_section = document.createElement('section');
                onScreenAutoPrint_section.style = 'position:fixed; z-index:1; margin:0; font-family:Helvetica;';
                document.body.prepend(onScreenAutoPrint_section);
                
            onScreenAutoPrint_intervalId = setInterval(() => {
                onScreenAutoPrint_section.style.top = (window.innerHeight-onScreenAutoPrint_section.offsetHeight)+'px';
                _canvas_.core.stats.getReport().then(data => {
                    const position = _canvas_.core.viewport.position();

                    const potentialFPS = data.secondsPerFrameOverTheLastThirtyFrames != 0 ? (1/data.secondsPerFrameOverTheLastThirtyFrames).toFixed(2) : 'infinite ';
        
                    onScreenAutoPrint_section.innerHTML = ''+
                        '<p style="margin:1px"> position: x:'+ position.x + ' y:' + position.y +'</p>' +
                        '<p style="margin:1px"> scale:'+ _canvas_.core.viewport.scale() +'</p>' +
                        '<p style="margin:1px"> angle:'+ _canvas_.core.viewport.angle()+'</p>' +
                        '<p style="margin:1px"> framesPerSecond: '+ data.framesPerSecond.toFixed(2) +'</p>' +
                        '<p style="margin:1px"> secondsPerFrameOverTheLastThirtyFrames: '+ data.secondsPerFrameOverTheLastThirtyFrames.toFixed(5) +' (potentially '+ potentialFPS +'fps)</p>' +
                        '<p style="margin:1px"> renderNonRenderSplitOverTheLastThirtyFrames: '+ data.renderNonRenderSplitOverTheLastThirtyFrames.toFixed(2) +'</p>' +
                    '';
                });
            }, 100);
        }else{
            clearInterval(onScreenAutoPrint_intervalId);
            if(onScreenAutoPrint_section != undefined){ onScreenAutoPrint_section.remove(); }
            onScreenAutoPrint_section = undefined;
        }
    };
};