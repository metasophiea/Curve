this.pulse_generator = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'pulse_generator/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:590, height:260 },
                    design: { width:9.5, height:4 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.LCD = {
                    background:{r:0.1,g:0.1,b:0.1,a:1},
                    glow: {r:0.3,g:0.64,b:0.22,a:1},
                    dim: {r:0.1,g:0.24,b:0.12,a:1}
                }
                this.ledSyncFlash = {
                    dim: {r:0.64,g:0.31,b:0.24,a:1}, 
                    glow: {r:0.94,g:0.31,b:0.34,a:1}
                };
                this.syncButton = {
                    background__up__colour: {r:0.69,g:0.69,b:0.69,a:1},
                    background__press__colour: {r:0.8,g:0.8,b:0.8,a:1},
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'pulse_generator',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                                    y:0                                                      },
                { x:unitStyle.drawingValue.width -unitStyle.offset,       y:0                                                      },
                { x:unitStyle.drawingValue.width -unitStyle.offset,       y:unitStyle.drawingValue.height -unitStyle.offset        },
                { x:(unitStyle.drawingValue.width -unitStyle.offset)/9.5, y:unitStyle.drawingValue.height -unitStyle.offset        },
                { x:0,                                                    y:(unitStyle.drawingValue.height -unitStyle.offset)*0.75 },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'output', data:{
                    x:0, y:21.5, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_sync', data:{
                    x:7.5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_100_up',     data:{ x:21.65 + 10.85*0, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_10_up',      data:{ x:21.65 + 10.85*1, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_1_up',       data:{ x:21.65 + 10.85*2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_0.1_up',     data:{ x:21.65 + 10.85*3, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_0.01_up',    data:{ x:21.65 + 10.85*4, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_0.001_up',   data:{ x:21.65 + 10.85*5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_100_down',   data:{ x:10 + 21.65 + 10.85*0, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_10_down',    data:{ x:10 + 21.65 + 10.85*1, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_1_down',     data:{ x:10 + 21.65 + 10.85*2, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_0.1_down',   data:{ x:10 + 21.65 + 10.85*3, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_0.01_down',  data:{ x:10 + 21.65 + 10.85*4, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
                {collection:'dynamic', type:'connectionNode_signal', name:'port_0.001_down', data:{ x:10 + 21.65 + 10.85*5, y:unitStyle.drawingValue.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},

                {collection:'basic', type:'image', name:'backing', data:{ 
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, 
                    width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, 
                    url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                } },

                {collection:'display', type:'glowbox_path', name:'ledSyncFlash', data:{ 
                    x:0, y:0, points:[ {x:5-3/4,y:5-3/4}, {x:20+3/4,y:5-3/4}, {x:20+3/4,y:35+3/4}, {x:12.5-2/5,y:35+3/4}, {x:5-3/4,y:27.5+2/5} ],
                    looping:true, jointType:'round', style:unitStyle.ledSyncFlash,
                } },
                {collection:'control', type:'button_polygon', name:'sync', data:{
                    x:5, y:5, hoverable:false, points:[ {x:0,y:0}, {x:15,y:0}, {x:15,y:30}, {x:7.5,y:30}, {x:0,y:22.5} ], style:unitStyle.syncButton,
                }},
                {collection:'basic', type:'image', name:'time_symbol', data:{ 
                    x:6.25, y:12.5, width:12 + 1/3, height:12 + 1/3, url:unitStyle.imageStoreURL_localPrefix+'time_symbol.png'
                } },

                {collection:'display', type:'readout_sevenSegmentDisplay', name:'LCD', data:{ 
                    x:21.75, y:10.75, width:64, height:18.5, static:true, count:6, decimalPlaces:true, style:unitStyle.LCD, resolution:5,
                }},

                {collection:'control', type:'button_image', name:'100_up',     data:{ x:21.65 + 10.85*0, y:5,  width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'10_up',      data:{ x:21.65 + 10.85*1, y:5,  width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'1_up',       data:{ x:21.65 + 10.85*2, y:5,  width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.1_up',     data:{ x:21.65 + 10.85*3, y:5,  width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.01_up',    data:{ x:21.65 + 10.85*4, y:5,  width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.001_up',   data:{ x:21.65 + 10.85*5, y:5,  width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'100_down',   data:{ x:21.65 + 10.85*0, y:30, width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'10_down',    data:{ x:21.65 + 10.85*1, y:30, width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'1_down',     data:{ x:21.65 + 10.85*2, y:30, width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.1_down',   data:{ x:21.65 + 10.85*3, y:30, width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.01_down',  data:{ x:21.65 + 10.85*4, y:30, width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
                {collection:'control', type:'button_image', name:'0.001_down', data:{ x:21.65 + 10.85*5, y:30, width:10, height:5, hoverable:false, backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png', backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png' }},
            ],
        });

    //circuitry
        const state = {
            storedValue: [1,2,0,0,0,0],
            interval: null,
            tempo: 120,
        };
        function updateTempo(newTempo){
            //safety
                if(newTempo > 999){newTempo = 999;}
                if(newTempo < 0.001){newTempo = 0.001;}

            //update readout
                const readout_tmp = (''+newTempo).split('.');
                let string = readout_tmp[0];
                if(newTempo < 100){string = '0' + string;}
                if(newTempo < 10){string = '0' + string;}
                if(readout_tmp[1] == undefined){ string += '.000';}
                else if(readout_tmp[1].length == 1){ string += '.' + readout_tmp[1] + '00';}
                else if(readout_tmp[1].length == 2){ string += '.' + readout_tmp[1] + '0';}
                else if(readout_tmp[1].length >= 3){ string += '.' + readout_tmp[1];}
                if(string.length > 7){ string = string.slice(0,7); }
                tempoString = string;
                newTempo = parseFloat(string);

                object.elements.readout_sevenSegmentDisplay.LCD.text(string);
                object.elements.readout_sevenSegmentDisplay.LCD.print();

            //update interval
                if(state.interval){ clearInterval(state.interval); }
                if(newTempo > 0){
                    state.interval = setInterval(function(){
                        object.io.signal.output.set(true);
                        object.elements.glowbox_path.ledSyncFlash.on();
                        setTimeout(function(){
                            object.io.signal.output.set(false);
                            object.elements.glowbox_path.ledSyncFlash.off();
                        },50)
                    },1000*(60/newTempo));
                }

            object.io.signal.output.set(true);
            object.elements.glowbox_path.ledSyncFlash.on();
            setTimeout(function(){
                object.io.signal.output.set(false);
                object.elements.glowbox_path.ledSyncFlash.off();
            },50)

            //update state
                state.tempo = newTempo;

                state.storedValue = [0,0,0,0,0,0];
                let tmp = String(state.tempo).split('');
                
                if(tmp.indexOf('.') == -1){
                    tmp.reverse().forEach((value,index) => { state.storedValue[2-index] = value; });
                }else{
                    tmp.slice(0,(tmp.indexOf('.'))).reverse().forEach((value,index) => { state.storedValue[2-index] = value; });
                    tmp.slice((tmp.indexOf('.'))+1).forEach((value,index) => { state.storedValue[3+index] = value; });
                }

                state.storedValue = state.storedValue.map(item => parseInt(item));
        }
        function updateUsingStoredValue(){
            updateTempo( parseFloat(state.storedValue.slice(0,3).join('') +'.'+ state.storedValue.slice(3,6).join('')) );
        }

    //wiring
        //hid
            object.elements.button_polygon.sync.onpress = function(){ updateTempo(state.tempo); };
            ['100_up', '10_up', '1_up', '0.1_up', '0.01_up', '0.001_up'].forEach((buttonName,index) => {
                object.elements.button_image[buttonName].onpress = function(){ state.storedValue[index] = state.storedValue[index] == 9 ? 0 : state.storedValue[index]+1; updateUsingStoredValue(); };
            });
            ['100_down', '10_down', '1_down', '0.1_down', '0.01_down', '0.001_down'].forEach((buttonName,index) => {
                object.elements.button_image[buttonName].onpress = function(){ state.storedValue[index] = state.storedValue[index] == 0 ? 9 : state.storedValue[index]-1; updateUsingStoredValue(); };
            });
            
        //io
            [
                'sync',
                '100_up', '10_up', '1_up', '0.1_up', '0.01_up', '0.001_up',
                '100_down', '10_down', '1_down', '0.1_down', '0.01_down', '0.001_down'
            ].forEach(portName => {
                object.io.signal['port_'+portName].onchange = function(value){
                    if(value){ object.elements.button_image[portName].press();   }
                    else{      object.elements.button_image[portName].release(); }
                };
            });

    //interface
        object.i = {
            tempo:function(value){
                if(value == undefined){return state.tempo;}
                updateTempo(value);
            },
        };

    //import/export
        object.exportData = function(){
            return { tempo:state.tempo };
        };
        object.importData = function(data){
            object.i.tempo(data.tempo);
        };

    //setup
        updateUsingStoredValue();

    return object;
};
this.pulse_generator.metadata = {
    name:'Pulse Generator',
    category:'sequencers',
    helpURL:'/help/units/beta/pulse_generator/'
};