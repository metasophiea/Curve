this.voltage_combiner = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'voltage_combiner/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:260, height:260 },
        design:{ width:4, height:4 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };

    var design = {
        name:'voltage_combiner',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                  y:(measurements.drawing.height -offset)/2 },
            { x:measurements.drawing.width -offset, y:0                                       },
            { x:measurements.drawing.width -offset, y:measurements.drawing.height -offset     },
            { x:0,                                  y:measurements.drawing.height -offset     },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_voltage', name:'output', data:{ x:0, y:measurements.drawing.height-14.5 + 5, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.voltage }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'input_1', data:{ x:measurements.drawing.width-3-1/3, y:7.5, width:5, height:10, cableVersion:2, style:style.connectionNode.voltage }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'input_2', data:{ x:measurements.drawing.width-3-1/3, y:measurements.drawing.height-19.5, width:5, height:10, cableVersion:2, style:style.connectionNode.voltage }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'port_mix', data:{ x:measurements.drawing.width*0.78, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage }},

            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            } },

            {collection:'control', type:'slide_continuous_image',name:'slide_mix',data:{
                x:32.5, y:10, width:5, height:25, handleHeight:0.18, value:0.5, resetValue:0.5,
                handleURL:imageStoreURL_localPrefix+'handle.png'
            }},
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(this.voltage_combiner,design);

    //wiring
        var mix = 0.5;
        var inputValue = [0,0];
        function calculateOutput(){ object.io.voltage.output.set( inputValue[1]*mix + inputValue[0]*(1-mix) ); }

        object.io.voltage.input_1.onchange = function(value){ inputValue[0] = value; calculateOutput(); };
        object.io.voltage.input_2.onchange = function(value){ inputValue[1] = value; calculateOutput(); };
        object.elements.slide_continuous_image.slide_mix.onchange = function(value){ mix = value; calculateOutput(); };
        object.io.voltage.port_mix.onchange = function(value){ object.elements.slide_continuous_image.slide_mix.set(value); };

    //import/export
        object.exportData = function(){ return mix; };
        object.importData = function(data){
            if(data == undefined){return;}

            object.elements.slide_continuous_image.slide_mix.set(data); 
        };

    //interface
        object.i = {
            mix:function(value){ object.elements.slide_continuous_image.slide_mix.set(value); },
        };

    return object;
};



this.voltage_combiner.metadata = {
    name:'Voltage Combiner',
    category:'misc',
    helpURL:'/help/units/beta/voltage_combiner/'
};