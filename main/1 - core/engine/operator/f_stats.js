this.stats = new function(){
    let active = false;
    let average = 30;
    let lastTimestamp = 0;

    const framesPerSecond = {
        compute:function(timestamp){
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
            this.timePerFrameArray.push( time );
            if( this.timePerFrameArray.length > average){ this.timePerFrameArray.shift(); }
            this.time = library.math.averageArray( this.timePerFrameArray )/1000;
        },
        timePerFrameArray:[],
        time:0,
    };

    this.collectFrameTimestamp = function(timestamp){
        //if stats are turned off, just bail
            if(!active){return;}

        framesPerSecond.compute(timestamp);
    };
    this.collectFrameTime = function(time){
        //if stats are turned off, just bail
            if(!active){return;}

        timePerFrame.compute(time);
    };


    this.active = function(bool){
        if(bool==undefined){return active;} 
        active=bool;
    };
    this.getReport = function(){
        return {
            framesPerSecond: framesPerSecond.rate,
            // timeTakenByMostRecentFrame: timePerFrame.timePerFrameArray[timePerFrame.timePerFrameArray.length-1]/1000,
            secondsPerFrameOverTheLastThirtyFrames: timePerFrame.time,
        };
    };
};