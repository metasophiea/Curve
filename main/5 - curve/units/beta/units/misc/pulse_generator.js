this.pulse_generator = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'pulse_generator/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:590, height:260 },
        design:{ width:9.5, height:4 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    var colour = {
        LCD:{
            background:{r:0.1,g:0.1,b:0.1,a:1},
            glow:{r:0.3,g:0.64,b:0.22,a:1},
            dim:{r:0.1,g:0.24,b:0.12,a:1}
        }
    };

    var design = {
        name:'pulse_generator',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                        y:0                                            },
            { x:measurements.drawing.width -offset,       y:0                                            },
            { x:measurements.drawing.width -offset,       y:measurements.drawing.height -offset          },
            { x:(measurements.drawing.width -offset)/9.5, y:measurements.drawing.height -offset          },
            { x:0,                                        y:(measurements.drawing.height -offset)*0.75   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_signal', name:'output', data:{
                x:0, y:21.5, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_sync', data:{
                x:7.5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_100_up',     data:{ x:21.65 + (0.85 + 60/div)*0, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_10_up',      data:{ x:21.65 + (0.85 + 60/div)*1, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_1_up',       data:{ x:21.65 + (0.85 + 60/div)*2, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_0.1_up',     data:{ x:21.65 + (0.85 + 60/div)*3, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_0.01_up',    data:{ x:21.65 + (0.85 + 60/div)*4, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_0.001_up',   data:{ x:21.65 + (0.85 + 60/div)*5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_100_down',   data:{ x:10 + 21.65 + (0.85 + 60/div)*0, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_10_down',    data:{ x:10 + 21.65 + (0.85 + 60/div)*1, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_1_down',     data:{ x:10 + 21.65 + (0.85 + 60/div)*2, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_0.1_down',   data:{ x:10 + 21.65 + (0.85 + 60/div)*3, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_0.01_down',  data:{ x:10 + 21.65 + (0.85 + 60/div)*4, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},
            {collection:'dynamic', type:'connectionNode_signal', name:'port_0.001_down', data:{ x:10 + 21.65 + (0.85 + 60/div)*5, y:measurements.drawing.height-3-1/3, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal }},

            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            } },

            {collection:'display', type:'glowbox_path', name:'ledSyncFlash', data:{ 
                x:0, y:0, points:[ {x:5-3/4,y:5-3/4}, {x:20+3/4,y:5-3/4}, {x:20+3/4,y:35+3/4}, {x:12.5-2/5,y:35+3/4}, {x:5-3/4,y:27.5+2/5} ],
                looping:true, jointType:'round',
                style:{ dim:{r:0.64,g:0.31,b:0.24,a:1}, glow:{r:0.94,g:0.31,b:0.34,a:1} },
            } },
            {collection:'control', type:'button_polygon', name:'sync', data:{
                x:5, y:5, hoverable:false, points:[ {x:0,y:0}, {x:15,y:0}, {x:15,y:30}, {x:7.5,y:30}, {x:0,y:22.5} ],
                style:{
                    background__up__colour:{r:0.69,g:0.69,b:0.69,a:1},
                    background__press__colour:{r:0.8,g:0.8,b:0.8,a:1},
                }
            }},
            {collection:'basic', type:'image', name:'time_symbol', data:{ 
                x:6.25, y:12.5, width:74/div, height:74/div, url:imageStoreURL_localPrefix+'time_symbol.png'
            } },

            {collection:'display', type:'readout_sevenSegmentDisplay_static', name:'LCD', data:{ 
                x:21.75, y:10.75, width:64, height:18.5, count:6, decimalPlaces:true, style:colour.LCD
            }},

            {collection:'control', type:'button_image', name:'100_up',     data:{ x:21.65 + (0.85 + 60/div)*0, y:5,  width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'10_up',      data:{ x:21.65 + (0.85 + 60/div)*1, y:5,  width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'1_up',       data:{ x:21.65 + (0.85 + 60/div)*2, y:5,  width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'0.1_up',     data:{ x:21.65 + (0.85 + 60/div)*3, y:5,  width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'0.01_up',    data:{ x:21.65 + (0.85 + 60/div)*4, y:5,  width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'0.001_up',   data:{ x:21.65 + (0.85 + 60/div)*5, y:5,  width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'100_down',   data:{ x:21.65 + (0.85 + 60/div)*0, y:30, width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'10_down',    data:{ x:21.65 + (0.85 + 60/div)*1, y:30, width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'1_down',     data:{ x:21.65 + (0.85 + 60/div)*2, y:30, width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'0.1_down',   data:{ x:21.65 + (0.85 + 60/div)*3, y:30, width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'0.01_down',  data:{ x:21.65 + (0.85 + 60/div)*4, y:30, width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
            {collection:'control', type:'button_image', name:'0.001_down', data:{ x:21.65 + (0.85 + 60/div)*5, y:30, width:60/div, height:30/div, hoverable:false, backingURL__up:imageStoreURL_localPrefix+'button_up.png', backingURL__press:imageStoreURL_localPrefix+'button_down.png' }},
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //wiring
        var storedValue = [1,2,0,0,0,0];
        var interval = null;
        var tempo = 120;

        function updateTempo(newTempo){
            //safety
                if(newTempo > 999){newTempo = 999;}
                if(newTempo < 0.001){newTempo = 0.001;}

            //update readout
                var tmp = (''+newTempo).split('.');
                var string = tmp[0];
                if(newTempo < 100){string = '0' + string;}
                if(newTempo < 10){string = '0' + string;}
                if(tmp[1] == undefined){ string += '.000';}
                else if(tmp[1].length == 1){ string += '.' + tmp[1] + '00';}
                else if(tmp[1].length == 2){ string += '.' + tmp[1] + '0';}
                else if(tmp[1].length >= 3){ string += '.' + tmp[1];}
                if(string.length > 7){ string = string.slice(0,7); }
                tempoString = string;
                newTempo = parseFloat(string);

                object.elements.readout_sevenSegmentDisplay_static.LCD.text(string);
                object.elements.readout_sevenSegmentDisplay_static.LCD.print();

            //update interval
                if(interval){ clearInterval(interval); }
                if(newTempo > 0){
                    interval = setInterval(function(){
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
            tempo = newTempo;
        }
        function updateUsingStoredValue(){
            updateTempo( parseFloat(storedValue.slice(0,3).join('') +'.'+ storedValue.slice(3,6).join('')) );
        }

        object.elements.button_polygon.sync.onpress = function(){ updateTempo(tempo); };
        object.elements.button_image['100_up'].onpress = function(){ storedValue[0] = storedValue[0] == 9 ? 0 : storedValue[0]+1; updateUsingStoredValue(); };
        object.elements.button_image['10_up'].onpress = function(){ storedValue[1] = storedValue[1] == 9 ? 0 : storedValue[1]+1; updateUsingStoredValue(); };
        object.elements.button_image['1_up'].onpress = function(){ storedValue[2] = storedValue[2] == 9 ? 0 : storedValue[2]+1; updateUsingStoredValue(); };
        object.elements.button_image['0.1_up'].onpress = function(){ storedValue[3] = storedValue[3] == 9 ? 0 : storedValue[3]+1; updateUsingStoredValue(); };
        object.elements.button_image['0.01_up'].onpress = function(){ storedValue[4] = storedValue[4] == 9 ? 0 : storedValue[4]+1; updateUsingStoredValue(); };
        object.elements.button_image['0.001_up'].onpress = function(){ storedValue[5] = storedValue[5] == 9 ? 0 : storedValue[5]+1; updateUsingStoredValue(); };
        object.elements.button_image['100_down'].onpress = function(){ storedValue[0] = storedValue[0] == 0 ? 9 : storedValue[0]-1; updateUsingStoredValue(); };
        object.elements.button_image['10_down'].onpress = function(){ storedValue[1] = storedValue[1] == 0 ? 9 : storedValue[1]-1; updateUsingStoredValue(); };
        object.elements.button_image['1_down'].onpress = function(){ storedValue[2] = storedValue[2] == 0 ? 9 : storedValue[2]-1; updateUsingStoredValue(); };
        object.elements.button_image['0.1_down'].onpress = function(){ storedValue[3] = storedValue[3] == 0 ? 9 : storedValue[3]-1; updateUsingStoredValue(); };
        object.elements.button_image['0.01_down'].onpress = function(){ storedValue[4] = storedValue[4] == 0 ? 9 : storedValue[4]-1; updateUsingStoredValue(); };
        object.elements.button_image['0.001_down'].onpress = function(){ storedValue[5] = storedValue[5] == 0 ? 9 : storedValue[5]-1; updateUsingStoredValue(); };

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
            setTempo:function(value){
                updateTempo(value);
            },
        };

    //setup
        updateTempo(tempo);

    return object;
};



this.pulse_generator.metadata = {
    name:'Pulse Generator',
    category:'misc',
    helpURL:'/help/units/beta/pulse_generator/'
};