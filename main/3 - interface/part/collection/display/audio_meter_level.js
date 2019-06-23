this.audio_meter_level = function(
    name='audio_meter_level',
    x, y, angle=0,
    width=20, height=60,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle={r:0.04,g:0.04,b:0.04,a:1},
    levelStyles=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.3,g:0.3,b:0.3,a:1}],
    markingStyle_fill={r:0.86,g:0.86,b:0.86,a:1},
    markingStyle_font='Roboto-Regular',
    markingStyle_printingMode={widthCalculation:'absolute', horizontal:'left', vertical:'top'},
    markingStyle_size=2,
){
    //elements
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //meter
            var meter = interfacePart.builder('display','meter_level','meter',{
                width:width, height:height, markings:markings,
                style:{
                    backing:backingStyle,
                    levels:levelStyles,
                    markingStyle_fill:markingStyle_fill,
                    markingStyle_font:markingStyle_font,
                    markingStyle_printingMode:markingStyle_printingMode,
                    markingStyle_size:markingStyle_size,
                },
            });
            object.append(meter);

    //circuitry
        var converter = interface.circuit.audio2percentage()
        converter.newValue = function(val){meter.set( val );};

    //audio connections
        object.audioIn = function(){ return converter.audioIn(); }

    //methods
        object.start = function(){ converter.start(); };
        object.stop = function(){ converter.stop(); };

    return object;
};