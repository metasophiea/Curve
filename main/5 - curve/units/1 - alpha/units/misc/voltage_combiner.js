this.voltage_combiner = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'voltage_combiner/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:260, height:260 },
                    design: { width:4, height:4 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'voltage_combiner',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:(unitStyle.drawingValue.height -unitStyle.offset)/2 },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:0                                                   },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:unitStyle.drawingValue.height -unitStyle.offset     },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset     },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_voltage', name:'output',   data:{ 
                    x:0, y:unitStyle.drawingValue.height-14.5 + 5, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.voltage 
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'input_1',  data:{ 
                    x:unitStyle.drawingValue.width-3-1/3, y:10, width:5, height:10, cableVersion:2, style:style.connectionNode.voltage 
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'input_2',  data:{ 
                    x:unitStyle.drawingValue.width-3-1/3, y:unitStyle.drawingValue.height-18-1/3, width:5, height:10, cableVersion:2, style:style.connectionNode.voltage 
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'port_mix', data:{ 
                    x:unitStyle.drawingValue.width*0.78, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage 
                }},

                {collection:'basic', type:'image', name:'backing', data:{ 
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                } },

                {collection:'control', type:'slide_continuous_image',name:'slide_mix',data:{
                    x:32.5, y:10, width:5, height:25, handleHeight:0.18, value:0.5, resetValue:0.5,
                    handleURL:unitStyle.imageStoreURL_localPrefix+'handle.png'
                }},
            ]
        });

        //circuitry
            var mix = 0.5;
            var inputValue = [0,0];
            function calculateOutput(){ object.io.voltage.output.set( inputValue[1]*mix + inputValue[0]*(1-mix) ); }

        //wiring
            //hid
                object.elements.slide_continuous_image.slide_mix.onchange = function(value){ mix = value; calculateOutput(); };
            //io (updates hid)
                object.io.voltage.input_1.onchange = function(value){ inputValue[0] = value; calculateOutput(); };
                object.io.voltage.input_2.onchange = function(value){ inputValue[1] = value; calculateOutput(); };
                object.io.voltage.port_mix.onchange = function(value){ object.elements.slide_continuous_image.slide_mix.set(value); };

        //interface
            object.i = {
                mix:function(value){ object.elements.slide_continuous_image.slide_mix.set(value); },
            };

        //import/export
            object.exportData = function(){ return mix; };
            object.importData = function(data){
                if(data == undefined){return;}

                object.elements.slide_continuous_image.slide_mix.set(data); 
            };

        return object;
    };
this.voltage_combiner.metadata = {
    name:'Voltage Combiner',
    category:'misc',
    helpURL:'/help/units/beta/voltage_combiner/'
};
