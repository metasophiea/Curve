this.audio_combiner = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'audio_combiner/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:584, height:534 },
                    design: { width:5.5, height:5 },
                };

                this.offset = 30/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
                this.dial = { handle:style.connectionNode.audio.dim, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
        };

    //main object creation
        const reverseOffset = (unitStyle.drawingValue.width)*(0.95/10);
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'audio_combiner',
            x:x, y:y, angle:angle,
            space:[
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 - 0/10),    y:0                                                       },
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 - 1.7/10),  y:0                                                       },
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 - 9/10),    y:(unitStyle.drawingValue.height -unitStyle.offset)*(1/5) },
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 - 9/10),    y:(unitStyle.drawingValue.height -unitStyle.offset)*(4/5) },
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 - 1.7/10),  y:unitStyle.drawingValue.height -unitStyle.offset         },
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 - 0/10),    y:unitStyle.drawingValue.height -unitStyle.offset         },
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 + 0.9/10),  y:(unitStyle.drawingValue.height -unitStyle.offset)*(4/5) },
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 + 1.25/10), y:(unitStyle.drawingValue.height -unitStyle.offset)*(1/2) },
                { x:-reverseOffset + (unitStyle.drawingValue.width -unitStyle.offset)*(1 + 0.9/10),  y:(unitStyle.drawingValue.height -unitStyle.offset)*(1/5) },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
                    x:1, y:unitStyle.drawingValue.height - 20.75, width:5, height:15, angle:Math.PI, cableVersion:2, isAudioOutput:true, style:style.connectionNode.audio 
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_1', data:{ 
                    x:unitStyle.drawingValue.width-4 -1, y:7.85, width:5, height:15, angle:-0.15, cableVersion:2, style:style.connectionNode.audio
                }},
                {collection:'dynamic', type:'connectionNode_audio', name:'input_2', data:{ 
                    x:unitStyle.drawingValue.width-1.8 -1, y:unitStyle.drawingValue.height-25-0.5, width:5, height:15, angle:0.15, cableVersion:2, style:style.connectionNode.audio 
                }},
                {collection:'dynamic', type:'connectionNode_voltage', name:'port_mix', data:{ 
                    x:unitStyle.drawingValue.width*0.5, y:unitStyle.drawingValue.height - 8, width:5, height:10, angle:0.25 + Math.PI/2, cableVersion:2, style:style.connectionNode.voltage 
                }},

                {collection:'basic', type:'image', name:'backing', data:{
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2,
                    width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, 
                    url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                } },
                
                {collection:'control', type:'dial_2_continuous',name:'chanel_selection',data:{
                    x:36.75, y:25.75, radius:30/2, startAngle:Math.PI/4, maxAngle:1.5*Math.PI, arcDistance:1.2, value:0.5, resetValue:0.5, style:unitStyle.dial,
                }}
            ]
        });

        //circuitry
            let mix = 0.5;
            const gains = [
                new _canvas_.library.audio.audioWorklet.production.wasm.gain(_canvas_.library.audio.context),
                new _canvas_.library.audio.audioWorklet.production.wasm.gain(_canvas_.library.audio.context),
            ];
            const combiner = new _canvas_.library.audio.audioWorklet.production.only_js.nothing(_canvas_.library.audio.context);
            gains[0].connect(combiner);
            gains[1].connect(combiner);
            function update(){
                _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, gains[0].gain, mix, 0.01, 'instant', true);
                _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, gains[1].gain, 1-mix, 0.01, 'instant', true);
            }
            update();

        //wiring
            //hid
                object.elements.dial_2_continuous.chanel_selection.onchange = function(value){ mix = value; update(); };
            //io
                object.io.voltage.port_mix.onchange = function(value){ object.elements.dial_2_continuous.chanel_selection.set(value); };
                object.io.audio.input_1.audioNode = gains[0];
                object.io.audio.input_2.audioNode = gains[1];
                object.io.audio.output.audioNode = combiner;

        //interface
            object.i = {
                mix:function(value){ object.elements.dial_2_continuous.chanel_selection.set(value); },
            };

        //import/export
            object.exportData = function(){ return mix; };
            object.importData = function(data){
                if(data == undefined){return;}

                object.elements.dial_2_continuous.chanel_selection.set(data); 
            };

        return object;
    };
this.audio_combiner.metadata = {
    name:'Audio Combiner',
    category:'routing',
    helpURL:'/help/units/alpha/audio_combiner/'
};
