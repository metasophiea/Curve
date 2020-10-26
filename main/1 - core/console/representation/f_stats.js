this.stats = new function(){
    const cachedValues = {
        active:false,
    };

    this.elementRenderDecision_clearData = function(){
        dev.log.stats('.elementRenderDecision_clearData()'); //#development
        interface.operator.stats.elementRenderDecision_clearData();
    };

    this.active = function(active){
        dev.log.stats('.active(',active); //#development
        if(active == undefined){ return cachedValues.active; }
        cachedValues.active = active;
        interface.operator.stats.active(active);
    };
    this.getReport = function(){
        dev.log.stats('.getReport()'); //#development
        return interface.operator.stats.getReport();
    };


    let autoPrintActive = false;
    let autoPrintIntervalId = undefined;
    this.autoPrint = function(bool){
        dev.log.stats('.autoPrint(',bool); //#development
        if(bool == undefined){ return autoPrintActive; }
        autoPrintActive = bool;

        if(autoPrintActive){
            autoPrintIntervalId = setInterval(() => {
                core.stats.getReport().then(console.log)
            }, 500);
        }else{
            clearInterval(autoPrintIntervalId);
        }
    };
    let autoPrintRenderDecisionReportActive = false;
    let autoPrintRenderDecisionReportIntervalId = undefined;
    this.autoPrintRenderDecisionReport = function(bool){
        dev.log.stats('.autoPrintRenderDecisionReport(',bool); //#development
        if(bool == undefined){ return autoPrintRenderDecisionReportActive; }
        autoPrintRenderDecisionReportActive = bool;

        if(autoPrintRenderDecisionReportActive){
            autoPrintRenderDecisionReportIntervalId = setInterval(() => {
                core.stats.getReport().then(data => {
                    Object.keys(data.renderDecision).sort().forEach(key => {
                        let printingString = key + ': ';
                        Object.keys(data.renderDecision[key]).sort().forEach((innerDataKey, index, array) => {
                            printingString += innerDataKey + ':' + data.renderDecision[key][innerDataKey].percentage;
                            if(index < array.length-1){ printingString += ' - '; }
                        });
                        console.log(printingString);
                    });
                    console.log('');
                })
            }, 500);
        }else{
            clearInterval(autoPrintRenderDecisionReportIntervalId);
        }

    };

    let onScreenAutoPrint_active = false;
    let onScreenAutoPrint_intervalId = false;
    let onScreenAutoPrint_section = undefined;
    this.onScreenAutoPrint = function(bool){
        dev.log.stats('.onScreenAutoPrint(',bool); //#development
        if(bool == undefined){ return onScreenAutoPrint_active; }
        onScreenAutoPrint_active = bool;

        core.stats.active(bool);

        if(onScreenAutoPrint_active){
            onScreenAutoPrint_section = document.createElement('section');
                onScreenAutoPrint_section.style = 'position:fixed; z-index:1; margin:0; font-family:Helvetica;';
                document.body.prepend(onScreenAutoPrint_section);
                
            onScreenAutoPrint_intervalId = setInterval(() => {
                onScreenAutoPrint_section.style.top = (window.innerHeight-onScreenAutoPrint_section.offsetHeight)+'px';
                core.stats.getReport().then(data => {
                    const position = core.viewport.position();
                    const anchor = core.viewport.anchor();

                    const potentialFPS = data.secondsPerFrameOverTheLastThirtyFrames != 0 ? (1/data.secondsPerFrameOverTheLastThirtyFrames).toFixed(2) : 'infinite ';

                    onScreenAutoPrint_section.innerHTML = ''+
                        '<p style="margin:1px"> position: x:'+ position.x + ' y:' + position.y +'</p>' +
                        '<p style="margin:1px"> scale:'+ core.viewport.scale() +'</p>' +
                        '<p style="margin:1px"> angle:'+ core.viewport.angle()+'</p>' +
                        '<p style="margin:1px"> anchor: x:'+ anchor.x + ' y:' + anchor.y +'</p>' +
                        '<p style="margin:1px"> framesPerSecond: '+ data.framesPerSecond.toFixed(2) +'</p>' +
                        '<p style="margin:1px"> secondsPerFrameOverTheLastThirtyFrames: '+ data.secondsPerFrameOverTheLastThirtyFrames.toFixed(15) +' (potentially '+ potentialFPS +'fps)</p>' +
                        '<p style="margin:1px"> renderSplitOverTheLastThirtyFrames: '+ data.renderSplit+'</p>' +
                    '';

                    onScreenAutoPrint_section.innerHTML += '<p style="margin:1px">render decision</p>';
                    Object.keys(data.renderDecision).sort().forEach(key => {
                        let printingString = key + ': ';
                        Object.keys(data.renderDecision[key]).sort().forEach((innerDataKey, index, array) => {
                            printingString += innerDataKey + ':' + data.renderDecision[key][innerDataKey].percentage;
                            if(index < array.length-1){ printingString += ' - '; }
                        });
                        onScreenAutoPrint_section.innerHTML += '<p style="margin:1px"> - '+ printingString + '</p>';
                    });
        
                });
            }, 250);
        }else{
            clearInterval(onScreenAutoPrint_intervalId);
            if(onScreenAutoPrint_section != undefined){ onScreenAutoPrint_section.remove(); }
            onScreenAutoPrint_section = undefined;
        }
    };

    this._dump = function(){
        dev.log.callback('._dump()'); //#development
        interface.operator.stats._dump();
    };
};