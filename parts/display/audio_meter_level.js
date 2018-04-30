this.audio_meter_level = function(
    id='audio_meter_level',
    x, y, angle,
    width, height,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle='fill:rgb(10,10,10)',
    levelStyles=['fill:rgba(250,250,250,1);','fill:rgb(100,100,100);'],
    markingStyle='fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
){
    //elements
        var object = parts.display.meter_level('mainlevel',x,y,angle,width,height,markings,backingStyle,levelStyles,markingStyle);
            
    //circuitry
        var converter = parts.audio.audio2percentage()
            converter.newValue = function(val){object.set( val );};

    //audio connections
        object.audioIn = function(){ return converter.audioIn(); }

    //methods
        object.start = function(){ converter.start(); };
        object.stop = function(){ converter.stop(); };

    //setup
        object.set(0)

    return object;
};