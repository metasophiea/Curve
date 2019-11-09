const stats = new function(){
    let active = false;
    let average = 30;
    let lastTimestamp = 0;

    const framesPerSecond = {
        compute:function(timestamp){
            dev.log.stats('::framesPerSecond.compute('+timestamp+')'); //#development

            this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
            if( this.frameTimeArray.length >= average){ this.frameTimeArray.shift(); }

            this.rate = library.math.averageArray( this.frameTimeArray );

            lastTimestamp = timestamp;
        },
        counter:0,
        frameTimeArray:[],
        rate:0,
    };

    this.collect = function(timestamp){
        dev.log.stats('.collect('+timestamp+')'); //#development
        //if stats are turned off, just bail
            if(!active){return;}

        framesPerSecond.compute(timestamp);
    };
    this.active = function(bool){
        dev.log.stats('.active('+bool+')'); //#development
        if(bool==undefined){return active;} 
        active=bool;
    };
    this.getReport = function(){
        dev.log.stats('.getReport()'); //#development
        return {
            framesPerSecond: framesPerSecond.rate,
        };
    };
};