this.multi_option_signal_sender_4 = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'multi_option_signal_sender/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:300, height:300 },
                    design: { width:3, height:3 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'multi_option_signal_sender_4',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out_0', data:{ 
                    x:0, y:12.5+1.25, width:5, height:10, angle:-Math.PI, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_1', data:{ 
                    x:unitStyle.drawingValue.width*(1/4)-5+1.25, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_2', data:{ 
                    x:unitStyle.drawingValue.width*(3/4)-5-1.25, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_3', data:{ 
                    x:unitStyle.drawingValue.width, y:2.5+1.25, width:5, height:10, angle:0, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'4_backing.png' }
                },
                {collection:'control', type:'dial_2_discrete',name:'detune_octave',data:{
                    x:15, y:15, radius:17.5/2, startAngle:-Math.PI*(7/8), maxAngle:(3/4)*Math.PI, arcDistance:1.2, optionCount:4, style:{handle:style.primeColour.lightGrey},
                }},
            ]
        });

    //circuitry
        const state = {position:0};
    
    //wiring
        //hid
            object.elements.dial_2_discrete.detune_octave.onchange = function(value){
                object.io.signal['out_'+state.position].set(false);
                state.position = value;
                object.io.signal['out_'+state.position].set(true);
            };

    //interface
            object.i = {
                position:function(value){
                    if(value == undefined){return state.position;}
                    object.elements.dial_2_discrete.detune_octave.set(value);
                }
            };

    //import/export
        object.importData = function(data){
            object.elements.dial_2_discrete.detune_octave.set(data.position);
        };
        object.exportData = function(){
            return { position: state.position };
        };

    //setup
        object.io.signal['out_'+state.position].set(true);

    return object;
};
this.multi_option_signal_sender_4.metadata = {
    name:'Multi Option Signal Sender - Type B',
    category:'interface',
    helpURL:'/help/units/beta/multi_option_signal_sender_4/'
};