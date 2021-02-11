this['dsds-8^3'] = function(name,x,y,angle){
    //audio sample URLs
        const samples = [
            [
                // - bass
                '/sounds/78/bass_1.wav',
                '/sounds/78/bass_2.wav',
                '/sounds/808/bass_1.wav',
                '/sounds/808/bass_2.wav',
                '/sounds/808/bass_3.wav',
                '/sounds/SP12/bass_1.wav',
                '/sounds/SP12/bass_2.wav',
                '/sounds/SP12/bass_3.wav',
            ],[
                // - snare
                '/sounds/78/snare_1.wav',
                '/sounds/78/snare_2.wav',
                '/sounds/808/snare_1.wav',
                '/sounds/808/snare_2.wav',
                '/sounds/808/snare_3.wav',
                '/sounds/SP12/snare_1.wav',
                '/sounds/SP12/snare_2.wav',
                '/sounds/SP12/snare_3.wav',
            ],[
                // - hat_closed
                '/sounds/78/hat_closed_1.wav',
                '/sounds/808/hat_closed_1.wav',
                '/sounds/808/hat_closed_2.wav',
                '/sounds/SP12/hat_closed_1.wav',
                '/sounds/SP12/hat_closed_2.wav',
                '/sounds/RetroMachines/hat_closed_1.wav',
                '/sounds/RetroMachines/hat_closed_2.wav',
                '/sounds/ModernMachines/hat_closed_1.wav',
            ],[
                // - hat_open
                '/sounds/78/hat_open_1.wav',
                '/sounds/78/hat_open_2.wav',
                '/sounds/808/hat_open_1.wav',
                '/sounds/808/hat_open_2.wav',
                '/sounds/SP12/hat_open_1.wav',
                '/sounds/SP12/hat_open_2.wav',
                '/sounds/RetroMachines/hat_open_1.wav',
                '/sounds/ModernMachines/hat_open_1.wav',
            ],[
                // misc 1 - 8
                '/sounds/ElectroBump/ride.wav',
                '/sounds/HitMachine/ride.wav',
                '/sounds/808/cowbell.wav',
                '/sounds/SP12/cowbell.wav',
                '/sounds/78/rim.wav',
                '/sounds/808/rim.wav',
                '/sounds/SP12/rim_1.wav',
                '/sounds/SP12/rim_2.wav',
            ],[
                // misc 9 - 16
                '/sounds/SP12/tom_low.wav',
                '/sounds/SP12/tom_mid.wav',
                '/sounds/SP12/tom_high.wav',
                '/sounds/78/maraca.wav',
                '/sounds/808/maraca.wav',
                '/sounds/78/tamb_1.wav',
                '/sounds/78/tamb_2.wav',
                '/sounds/78/tamb_3.wav',
            ],[
                // misc 17 - 24
                '/sounds/78/bongo_low.wav',
                '/sounds/78/bongo_mid.wav',
                '/sounds/78/bongo_high.wav',
                '/sounds/78/gulro_long.wav',
                '/sounds/78/gulro_short.wav',
                '/sounds/78/gulro_high.wav',
                '/sounds/78/clave.wav',
                '/sounds/78/metal.wav',
            ],[
                // misc 25 - 32
                '/sounds/808/clap.wav',
                '/sounds/Grimy909/crash.wav',
                '/sounds/808/conga_low.wav',
                '/sounds/808/conga_mid.wav',
                '/sounds/808/conga_high.wav',
                '/sounds/SP12/conga_low.wav',
                '/sounds/SP12/conga_mid.wav',
                '/sounds/SP12/conga_high.wav',
            ]
        ];
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'dsds-8^3/';
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';

            //calculation of measurements
                const div = 10;
                const measurement = {
                    file: { width:2900, height:1240 },
                    design: { width:28.5, height:12 },
                };

                this.offset = {x:5,y:2};
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //colours
                this.LED = {
                    glow:{r:1,g:0,b:0,a:1},
                    dim:{r:0.48,g:0.21,b:0.19,a:1},
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'dsds-8^3',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:
                (new Array(8)).fill().flatMap((item,index) => {
                    return [
                        {collection:'dynamic', type:'connectionNode_audio', name:'audio_out_'+index, data:{ 
                            x:(22.5-15/2)  + index*30, y:0, width:5, height:15, angle:-Math.PI/2, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                        }},
                        {collection:'dynamic', type:'connectionNode_signal', name:'signal_in_'+index, data:{ 
                            x:(22.5+10/2)  + index*30, y:unitStyle.drawingValue.height-unitStyle.offset.y*2, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                        }},
                        {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_in_'+index, data:{ 
                            x:(22.5+10/2)  + index*30, y:unitStyle.drawingValue.height-unitStyle.offset.y*2, width:0, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                        }},
                    ];
                }).concat(
                    [
                        {collection:'dynamic', type:'connectionNode_audio', name:'audio_out_master', data:{ 
                            x:(22.5-15/2)  + 8*30, y:0, width:5, height:15, angle:-Math.PI/2, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                        }},
                        {collection:'basic', type:'image', name:'backing', 
                            data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                        },
                        {collection:'control', type:'dial_continuous_image', name:'masterVolume', data:{
                            x:unitStyle.offset.x*2 + 252, y:27, radius:20/2, startAngle:2.5, maxAngle:4.4, value:0.5, resetValue:0.5,
                            handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                        }},
                        {collection:'control', type:'button_image', name:'signal', data:{
                            x:unitStyle.offset.x*2 + 244-1, y:95.5, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'signal_off.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'signal_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'signal_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'signal_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'voltage', data:{
                            x:unitStyle.offset.x*2 + 253, y:95.5, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'voltage_off.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'voltage_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'voltage_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'voltage_on.png',
                        }},

                        {collection:'control', type:'button_image', name:'preset_1', data:{
                            x:unitStyle.offset.x*2 + 241.5, y:40.5, width:21, height:9, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_1_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_1_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_1_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_1_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'preset_2', data:{
                            x:unitStyle.offset.x*2 + 241.5, y:40.5 + 11, width:21, height:9, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_2_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_2_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_2_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_2_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'preset_3', data:{
                            x:unitStyle.offset.x*2 + 241.5, y:40.5 + 11*2, width:21, height:9, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_3_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_3_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_3_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_3_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'preset_4', data:{
                            x:unitStyle.offset.x*2 + 241.5, y:40.5 + 11*3, width:21, height:9, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_4_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_4_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_4_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_4_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'preset_5', data:{
                            x:unitStyle.offset.x*2 + 241.5, y:40.5 + 11*4, width:21, height:9, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_5_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_5_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_5_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_5_on.png',
                        }},
                    ]
                ).concat(
                    (new Array(8)).fill().flatMap((item,index) => {
                        return [
                            {collection:'control', type:'dial_continuous_image', name:'volume_'+index, data:{
                                x:16 + index*30, y:24, radius:13/2, startAngle:2.5, maxAngle:4.4, value:0.5, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_continuous_image', name:'rate_'+index, data:{
                                x:28 + index*30, y:36, radius:13/2, startAngle:2.5, maxAngle:4.4, value:0.5, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_discrete_image', name:'bank_'+index, data:{
                                x:22 + index*30, y:60, radius:20/2, startAngle:2.5, maxAngle:4.4, value:0, optionCount:8, 
                                handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                            }},
                            {collection:'display', type:'glowbox_circle', name:'channelStatusLED_'+index, data:{
                                x:32 + index*30, y:74, radius:3/2, capType:'round', style:unitStyle.LED
                            }},
                            {collection:'control', type:'dial_discrete_image', name:'sample_'+index, data:{
                                x:22 + index*30, y:90, radius:20/2, startAngle:2.5, maxAngle:4.4, value:0, optionCount:8, 
                                handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                            }},
                            {collection:'display', type:'glowbox_path', name:'channelFireLED_'+index, data:{
                                x:14 + index*30, y:104, points:[{x:0,y:0},{x:16,y:0}], capType:'round', style:unitStyle.LED
                            }},
                            {collection:'control', type:'button_image', name:'fire_'+index, data:{
                                x:11.5 + index*30, y:107.5, width:21, height:9, hoverable:false,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'fire_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'fire_down.png',
                            }},
                        ];
                    })
                )
        });

    //circuitry
        const state = {
            presetSettingTimeout:2000,
            inputMode:'signal',
            currentPreset:1,
            presets:[
                [
                    {bank:0,sample:0,rate:0.5,volume:0.5},
                    {bank:1,sample:0,rate:0.5,volume:0.5},
                    {bank:2,sample:0,rate:0.5,volume:0.5},
                    {bank:3,sample:0,rate:0.5,volume:0.5},
                    {bank:7,sample:5,rate:0.5,volume:0.5},
                    {bank:7,sample:6,rate:0.5,volume:0.5},
                    {bank:6,sample:0,rate:0.5,volume:0.5},
                    {bank:7,sample:0,rate:0.5,volume:0.5},
                ],
                [
                    {bank:0,sample:5,rate:0.5,volume:0.5},
                    {bank:1,sample:5,rate:0.5,volume:0.5},
                    {bank:2,sample:5,rate:0.5,volume:0.5},
                    {bank:3,sample:4,rate:0.5,volume:0.5},
                    {bank:4,sample:5,rate:0.5,volume:0.5},
                    {bank:5,sample:1,rate:0.5,volume:0.5},
                    {bank:5,sample:4,rate:0.5,volume:0.5},
                    {bank:5,sample:6,rate:0.5,volume:0.5},
                ],
                [
                    {bank:0,sample:2,rate:0.5,volume:0.5},
                    {bank:1,sample:2,rate:0.5,volume:0.5},
                    {bank:2,sample:7,rate:0.5,volume:0.5},
                    {bank:3,sample:5,rate:0.5,volume:0.5},
                    {bank:4,sample:3,rate:0.5,volume:0.5},
                    {bank:5,sample:0,rate:0.5,volume:0.5},
                    {bank:5,sample:1,rate:0.5,volume:0.5},
                    {bank:5,sample:2,rate:0.5,volume:0.5},
                ],
                [
                    {bank:0,sample:5,rate:0.5,volume:0.5},
                    {bank:1,sample:7,rate:0.5,volume:0.5},
                    {bank:2,sample:6,rate:0.5,volume:0.5},
                    {bank:3,sample:6,rate:0.5,volume:0.5},
                    {bank:4,sample:1,rate:0.5,volume:0.5},
                    {bank:4,sample:3,rate:0.5,volume:0.5},
                    {bank:5,sample:4,rate:0.5,volume:0.5},
                    {bank:7,sample:1,rate:0.5,volume:0.5},
                ],
                [
                    {bank:7,sample:2,rate:0.5,volume:0.5},
                    {bank:7,sample:3,rate:0.5,volume:0.5},
                    {bank:7,sample:4,rate:0.5,volume:0.5},
                    {bank:6,sample:0,rate:0.5,volume:0.5},
                    {bank:6,sample:1,rate:0.5,volume:0.5},
                    {bank:6,sample:2,rate:0.5,volume:0.5},
                    {bank:4,sample:4,rate:0.5,volume:0.5},
                    {bank:7,sample:1,rate:0.5,volume:0.5},
                ],
            ],
        };
        
        const channelData = (new Array(8)).fill().map((item,index) => {
            return { bank:0, sample:0, rate:1, volume:1 }
        });

        const masterGain = new _canvas_.interface.circuit.gain(_canvas_.library.audio.context);
        object.io.audio.audio_out_master.audioNode = masterGain.out();
        const channelGains = (new Array(8)).fill().map((item,index) => {
            const gain = new _canvas_.interface.circuit.gain(_canvas_.library.audio.context);
            object.io.audio['audio_out_'+index].audioNode = gain.out();
            gain.out().connect( masterGain.in() );
            return gain;
        });
        const samplePlayers = (new Array(8)).fill().map((item,index) => {
            const player = new _canvas_.interface.circuit.player(_canvas_.library.audio.context);
            player.concurrentPlayCountLimit(-1);
            player.out_right().connect( channelGains[index].in() );
            return player;
        });

        function fire(channel,mode='signal',value){
            if(mode == 'signal'){
                samplePlayers[channel].start();
                object.elements.glowbox_path['channelFireLED_'+channel].on();
                setTimeout(object.elements.glowbox_path['channelFireLED_'+channel].off, 100);
            }else if(mode == 'voltage'){
                // samplePlayers[channel].rate(
                //     object.elements.dial_continuous_image['rate_'+channel].get()*2 * value 
                // );
                channelGains[channel].gain(
                    object.elements.dial_continuous_image['volume_'+channel].get()*2 * value 
                );
                samplePlayers[channel].start();
                object.elements.glowbox_path['channelFireLED_'+channel].on();
                setTimeout(object.elements.glowbox_path['channelFireLED_'+channel].off, 100);
            }
        }
        function loadSample(channel,bank,sample){
            setChannelStatusLED(channel,'loading');
            samplePlayers[channel].load(
                'url',
                () => { 
                    setChannelStatusLED(channel,'ready');
                    if( bank != channelData[channel].bank || sample != channelData[channel].sample ){
                        loadSample(channel,channelData[channel].bank,channelData[channel].sample);
                    }
                },
                samples[bank][sample],
                () => { 
                    setChannelStatusLED(channel,'error');
                    if( bank != channelData[channel].bank || sample != channelData[channel].sample ){
                        loadSample(channel,channelData[channel].bank,channelData[channel].sample);
                    }
                },
            );
        }
        function setInputConnectionNodes(mode){
            if(mode != 'signal' && mode != 'voltage'){return;}
            if(state.inputMode == mode){return;}
            state.inputMode = mode;

            const duration = 500;
            const detail = 30;
            const zero2five = _canvas_.library.math.curveGenerator.s(detail,0,5);
            const five2zero = _canvas_.library.math.curveGenerator.s(detail,5,0);

            if(mode == 'signal'){
                for(let a = 0; a < 8; a++){
                    object.elements.connectionNode_voltage['voltage_in_'+a].disconnect();
                    object.elements.connectionNode_voltage['voltage_in_'+a].set(0);
                    
                    for(let b = 0; b < detail; b++){
                        setTimeout(()=>{
                            object.elements.connectionNode_signal['signal_in_'+a].getChildren()[0].width(zero2five[b]);
                            object.elements.connectionNode_voltage['voltage_in_'+a].getChildren()[0].width(five2zero[b]);
                        },
                        (duration/detail)*b);
                    }
                }
            }else if(mode == 'voltage'){
                for(let a = 0; a < 8; a++){
                    object.elements.connectionNode_signal['signal_in_'+a].disconnect();
                    object.elements.connectionNode_signal['signal_in_'+a].set(false);
                    for(let b = 0; b < detail; b++){
                        setTimeout(()=>{
                            object.elements.connectionNode_signal['signal_in_'+a].getChildren()[0].width(five2zero[b]);
                            object.elements.connectionNode_voltage['voltage_in_'+a].getChildren()[0].width(zero2five[b]);
                        },
                        (duration/detail)*b);
                    }
                }
            }

            if(state.inputMode == 'signal'){
                object.elements.button_image.signal.glow(true);
                object.elements.button_image.voltage.glow(false);
            }else if(state.inputMode == 'voltage'){
                object.elements.button_image.signal.glow(false);
                object.elements.button_image.voltage.glow(true);
            }
        }
        const intervals = [];
        function setChannelStatusLED(channel,status){
            if( intervals[channel] != undefined && intervals[channel].interval != undefined ){
                clearInterval(intervals[channel].interval);
            }
            const led = object.elements.glowbox_circle['channelStatusLED_'+channel];

            switch(status){
                case 'ready':
                    led.on();
                break;
                case 'loading':
                    intervals[channel] = {};
                    intervals[channel].flip = true;
                    intervals[channel].interval = setInterval(() => {
                        intervals[channel].flip ? led.on() : led.off();
                        intervals[channel].flip = !intervals[channel].flip;
                    },250);
                break;
                case 'error':
                    led.off();
                break;
            }
        }
        function selectPreset(preset){
            for(let a = 1; a <= 5; a++){
                object.elements.button_image['preset_'+a].glow(false);
            }
            object.elements.button_image['preset_'+preset].glow(true);

            state.currentPreset = preset;

            state.presets[preset-1].forEach((set,index) => {
                object.elements.dial_continuous_image['volume_'+index].set(set.volume);
                object.elements.dial_continuous_image['rate_'+index].set(set.rate);
                object.elements.dial_discrete_image['bank_'+index].set(set.bank);
                object.elements.dial_discrete_image['sample_'+index].set(set.sample);
            });
        }
        function savePreset(block){
            block = block - 1;
            state.presets[block] = (new Array(8)).fill().map((item,index) => {
                return {
                    bank:object.elements.dial_discrete_image['bank_'+index].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+index].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+index].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+index].get()
                };
            });

            object.elements.button_image['preset_'+(block+1)].glow(false);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(true); },100);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(false); },200);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(true); },300);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(false); },400);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(true); },500);
        }

    //wiring
        //hid
            object.elements.button_image.signal.onpress = function(){
                setInputConnectionNodes('signal');
            };
            object.elements.button_image.voltage.onpress = function(){
                setInputConnectionNodes('voltage');
            };
            for(let a = 0; a < 8; a++){
                object.elements.dial_continuous_image['volume_'+a].onchange = function(value){
                    channelData[a].volume = value;
                    channelGains[a].gain(value*2);
                };
                object.elements.dial_continuous_image['rate_'+a].onchange = function(value){
                    channelData[a].rate = value;
                    if(channelData[a].rate <= 0.1){ channelData[a].rate = 0.1; }
                    samplePlayers[a].rate( 2*channelData[a].rate );
                };
                object.elements.dial_discrete_image['bank_'+a].onchange = function(value){
                    channelData[a].bank = value;
                    loadSample(a,channelData[a].bank,channelData[a].sample);
                };
                object.elements.dial_discrete_image['sample_'+a].onchange = function(value){
                    channelData[a].sample = value;
                    loadSample(a,channelData[a].bank,channelData[a].sample);
                };
                object.elements.button_image['fire_'+a].onpress = function(){
                    fire(a);
                };
            }

            object.elements.dial_continuous_image.masterVolume.onchange = function(value){
                masterGain.gain(value*2);
            };

            object.elements.button_image.preset_1.onpress = function(){
                object.elements.button_image.preset_1.pressedTime = Date.now();
                setTimeout(() => { 
                    const pressedTime = object.elements.button_image.preset_1.pressedTime;
                    if( pressedTime > 0 && Date.now() - pressedTime > state.presetSettingTimeout ){
                        savePreset(1);
                    }
                }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_1.onrelease = function(){
                object.elements.button_image.preset_1.pressedTime = -1;
                selectPreset(1);
            };
            object.elements.button_image.preset_2.onpress = function(){ 
                object.elements.button_image.preset_2.pressedTime = Date.now();
                setTimeout(() => { 
                    const pressedTime = object.elements.button_image.preset_2.pressedTime;
                    if( pressedTime > 0 && Date.now() - pressedTime > state.presetSettingTimeout ){
                        savePreset(2);
                    }
                }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_2.onrelease = function(){ 
                object.elements.button_image.preset_2.pressedTime = -1;
                selectPreset(2);
            };
            object.elements.button_image.preset_3.onpress = function(){ 
                object.elements.button_image.preset_3.pressedTime = Date.now();
                setTimeout(() => { 
                    const pressedTime = object.elements.button_image.preset_3.pressedTime;
                    if( pressedTime > 0 && Date.now() - pressedTime > state.presetSettingTimeout ){
                        savePreset(3);
                    }
                }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_3.onrelease = function(){ 
                object.elements.button_image.preset_3.pressedTime = -1;
                selectPreset(3);
            };
            object.elements.button_image.preset_4.onpress = function(){ 
                object.elements.button_image.preset_4.pressedTime = Date.now();
                setTimeout(() => { 
                    const pressedTime = object.elements.button_image.preset_4.pressedTime;
                    if( pressedTime > 0 && Date.now() - pressedTime > state.presetSettingTimeout ){
                        savePreset(4);
                    }
                }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_4.onrelease = function(){ 
                object.elements.button_image.preset_4.pressedTime = -1;
                selectPreset(4);
            };
            object.elements.button_image.preset_5.onpress = function(){ 
                object.elements.button_image.preset_5.pressedTime = Date.now();
                setTimeout(() => { 
                    const pressedTime = object.elements.button_image.preset_5.pressedTime;
                    if( pressedTime > 0 && Date.now() - pressedTime > state.presetSettingTimeout ){
                        savePreset(5);
                    }
                }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_5.onrelease = function(){ 
                object.elements.button_image.preset_5.pressedTime = -1;
                selectPreset(5);
            };

        //keycapture
            object.elements.image.backing.attachCallback('onkeydown', function(x,y,event){
                switch(event.keyCode){
                    case 49: object.elements.button_image.preset_1.press(); break;
                    case 50: object.elements.button_image.preset_2.press(); break;
                    case 51: object.elements.button_image.preset_3.press(); break;
                    case 52: object.elements.button_image.preset_4.press(); break;
                    case 53: object.elements.button_image.preset_5.press(); break;

                    case 90: object.elements.button_image['fire_'+0].press(); break;
                    case 88: object.elements.button_image['fire_'+1].press(); break;
                    case 67: object.elements.button_image['fire_'+2].press(); break;
                    case 86: object.elements.button_image['fire_'+3].press(); break;
                    case 66: object.elements.button_image['fire_'+4].press(); break;
                    case 78: object.elements.button_image['fire_'+5].press(); break;
                    case 77: object.elements.button_image['fire_'+6].press(); break;
                    case 188: object.elements.button_image['fire_'+7].press(); break;
                }
            });
            object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
                switch(event.keyCode){
                    case 49: object.elements.button_image.preset_1.release(); break;
                    case 50: object.elements.button_image.preset_2.release(); break;
                    case 51: object.elements.button_image.preset_3.release(); break;
                    case 52: object.elements.button_image.preset_4.release(); break;
                    case 53: object.elements.button_image.preset_5.release(); break;

                    case 90: object.elements.button_image['fire_'+0].release(); break;
                    case 88: object.elements.button_image['fire_'+1].release(); break;
                    case 67: object.elements.button_image['fire_'+2].release(); break;
                    case 86: object.elements.button_image['fire_'+3].release(); break;
                    case 66: object.elements.button_image['fire_'+4].release(); break;
                    case 78: object.elements.button_image['fire_'+5].release(); break;
                    case 77: object.elements.button_image['fire_'+6].release(); break;
                    case 188: object.elements.button_image['fire_'+7].release(); break;
                }
            });

        //io
            for(let a = 0; a < 8; a++){
                object.io.signal['signal_in_'+a].onchange = function(value){
                    if(!value){return;}
                    fire(a);
                } 
                object.io.voltage['voltage_in_'+a].onchange = function(value){
                    if(value <= 0){return;}
                    fire(a,'voltage',value);
                } 
            }

    //interface
        object.i = {
        };

    //import/export
        object.exportData = function(){
            return {
                currentSettings:(new Array(8)).fill().map((item,index) => {
                    return {
                        bank:object.elements.dial_discrete_image['bank_'+index].get(), 
                        sample:object.elements.dial_discrete_image['sample_'+index].get(), 
                        rate:object.elements.dial_continuous_image['rate_'+index].get(), 
                        volume:object.elements.dial_continuous_image['volume_'+index].get()
                    };
                }),
                state:JSON.parse(JSON.stringify(state)),
            };
        };
        object.importData = function(data){
            state.presetSettingTimeout = data.state.presetSettingTimeout;
            state.presets = data.state.presets;
            setInputConnectionNodes(data.state.inputMode);
            selectPreset(data.state.currentPreset);
            data.currentSettings.forEach((channel,index) => {
                object.elements.dial_discrete_image['bank_'+index].set(channel.bank);
                object.elements.dial_discrete_image['sample_'+index].set(channel.sample);
                object.elements.dial_continuous_image['rate_'+index].set(channel.rate);
                object.elements.dial_continuous_image['volume_'+index].set(channel.volume);
            });
        };

    //setup/tearDown
        object.oncreate = function(){
            loadSample(0,0,0);
            for(let a = 1; a < 8; a++){
                object.elements.dial_discrete_image['bank_'+a].set(a);
            }
            object.elements.button_image.signal.glow(true);
            selectPreset(1);
        };
        object.ondelete = function(){
            intervals.forEach(interval => {
                clearInterval(interval.interval);
            });
        };

    return object;
};
this['dsds-8^3'].metadata = {
    name:'Digital Sample Drum Set - 8^3',
    category:'',
    helpURL:'/help/units/harbinger/dsds-8^3/'
};