this.audio_meter_level = function(
    name='audio_meter_level',
    x, y, angle=0,
    width=20, height=60,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle='rgb(10,10,10)',
    levelStyles=['rgba(250,250,250,1)','rgb(100,100,100)'],
    markingStyle_fill='rgba(220,220,220,1)',
    markingStyle_font='1pt Courier New',
){
    //elements
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        //meter
            var meter = canvas.part.builder('meter_level','meter',{
                width:width, height:height, markings:markings,
                style:{
                    backing:backingStyle,
                    levels:levelStyles,
                    markingStyle_fill:markingStyle_fill,
                    markingStyle_font:markingStyle_font,
                },
            });
            object.append(meter);

    //circuitry
        var converter = canvas.part.circuit.audio.audio2percentage()
        converter.newValue = function(val){meter.set( val );};

    //audio connections
        object.audioIn = function(){ return converter.audioIn(); }

    //methods
        object.start = function(){ converter.start(); };
        object.stop = function(){ converter.stop(); };

    return object;
};