const stats = new function(){
    let active = false;
    let average = 30;
    let lastTimestamp = 0;

    const framesPerSecond = {
        compute:function(timestamp){
            dev.log.stats('::framesPerSecond.compute(',timestamp); //#development

            this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
            if( this.frameTimeArray.length > average){ this.frameTimeArray.shift(); }

            this.rate = library.math.averageArray( this.frameTimeArray );

            lastTimestamp = timestamp;
        },
        counter:0,
        frameTimeArray:[],
        rate:0,
    };
    const timePerFrame = {
        compute:function(time){
            dev.log.stats('::timePerFrame.compute(',time); //#development
            this.timePerFrameArray.push( time );
            if( this.timePerFrameArray.length > average){ this.timePerFrameArray.shift(); }
            this.time = library.math.averageArray( this.timePerFrameArray )/1000;
        },
        timePerFrameArray:[],
        time:0,
    };

    this.collectFrameTimestamp = function(timestamp){
        dev.log.stats('.collectFrameTimestamp(',timestamp); //#development
        //if stats are turned off, just bail
            if(!active){return;}

        framesPerSecond.compute(timestamp);
    };
    this.collectFrameTime = function(time){
        dev.log.stats('.collectFrameTime(',time); //#development
        //if stats are turned off, just bail
            if(!active){return;}

        timePerFrame.compute(time);
    };
    this._active = function(){ return active; };
    this.active = function(bool){
        dev.log.stats('.active(',bool); //#development
        if(bool==undefined){return active;} 
        active=bool;
    };
    this.getReport = function(){
        dev.log.stats('.getReport()'); //#development
        return {
            framesPerSecond: framesPerSecond.rate,
            secondsPerFrame: timePerFrame.time,
        };
    };
};