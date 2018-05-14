__globals.objects.make_audioIn = function(x,y){
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
        h2: 'fill:rgba(0,0,0,1); font-size:3px; font-family:Courier New;',
        h3: 'fill:rgba(0,0,0,1); font-size:2px; font-family:Courier New;',
        text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',

        markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:0.5;',

        handle: 'fill:rgba(220,220,220,1)',
        slot: 'fill:rgba(50,50,50,1)',
        needle: 'fill:rgba(250,150,150,1)'
    };
    var design = {
        type: 'audioIn',
        x: x, y: y,
        base: {points:[{x:0,y:0},{x:100,y:0},{x:100,y:55},{x:0,y:55}], style:style.background},
        connector: {
            audio:{
                audioOut: { type: 1, x: -10, y: 30*0.7-5, width: 20, height: 20 },
            }
        }
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(design,style);

    //circuitry
        obj.circuitry = {
            unit: new parts.audio.audioIn(__globals.audio.context)
        };
        obj.circuitry.unit.out().connect( design.connector.audio.audioOut.in() );

    return obj;
};