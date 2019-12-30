this.audio_meter_level = function(
    name='audio_meter_level',
    x, y, angle=0,
    width=20, height=60,
    markings=[0.125,0.25,0.375,0.5,0.625,0.75,0.875],

    backingStyle={r:0.04,g:0.04,b:0.04,a:1},
    levelStyles=[{r:0.3,g:0.3,b:0.3,a:1},{r:0.98,g:0.98,b:0.98,a:1}],
    markingStyle_fill={r:0.86,g:0.86,b:0.86,a:1},
    markingStyle_font='Roboto-Regular',
    markingStyle_printingMode={widthCalculation:'absolute', horizontal:'left', vertical:'top'},
    markingStyle_size=2,
){
    dev.log.partDisplay('.audio_meter_level('  //#development
        +name+','+x+','+y+','+angle+','+width+','+height+','  //#development
        +JSON.stringify(markings)+','+JSON.stringify(backingStyle)+','+JSON.stringify(levelStyles)  //#development
        +JSON.stringify(markingStyle_fill)+','+JSON.stringify(markingStyle_font)+','+JSON.stringify(markingStyle_printingMode)+','+JSON.stringify(markingStyle_size)  //#development
    +')'); //#development

    //elements
        const object = _canvas_.interface.part.builder('display', 'meter_level', name, {
            x:x, y:y, angle:angle, width:width, height:height, style:{
                backing:backingStyle,
                levels:levelStyles,
                markingStyle_fill:markingStyle_fill,
                markingStyle_font:markingStyle_font,
                markingStyle_printingMode:markingStyle_printingMode,
                markingStyle_size:markingStyle_size,
            }
        });

    //circuitry
        const converter = interface.circuit.audio2percentage()
        converter.newValue = function(val){object.set(val);};

    //audio connections
        object.audioIn = function(){ return converter.audioIn() };

    //methods
        object.start = function(){
            dev.log.partDisplay('.audio_meter_level.start()');  //#development
            converter.start();
        };
        object.stop = function(){
            dev.log.partDisplay('.audio_meter_level.stop()');  //#development
            converter.stop();
        };

    //setup/tear down
        object._ondelete = object.ondelete;
        object.ondelete = function(){
            object.stop();
            object._ondelete();
        };

    return(object);
};

interfacePart.partLibrary.display.audio_meter_level = function(name,data){ 
    return interfacePart.collection.display.audio_meter_level(
        name, data.x, data.y, data.angle, data.width, data.height, data.markings, 
        data.style.backing, data.style.levels, data.style.markingStyle_colour, data.style.markingStyle_font, data.style.markingStyle_printingMode, data.style.markingStyle_size
    ); 
};