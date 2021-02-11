this['rdp-32'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'rdp-32/';
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:3450, height:1440 },
                    design: { width:34.5, height:14 },
                };

                this.offset = {x:5,y:2};
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //colours
                this.channelLEDstyle = {
                    glow:{r:1,g:0,b:0,a:1},
                    dim:{r:0.85,g:0.6,b:0.6,a:1},
                };
                this.selectorStepLEDstyle = {
                    glow:{r:1,g:1,b:1,a:1},
                    dim:{r:0.25,g:0.25,b:0.25,a:1},
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'rdp-32',
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
                        {collection:'dynamic', type:'connectionNode_signal', name:'signal_out_'+index, data:{ 
                            x:18 - (10/2) + index*30, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                        }},
                        {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_out_'+index, data:{ 
                            x:18 - (10/2) + index*30, y:0, width:0, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                        }},
                    ];
                }).concat(
                    [
                        {collection:'dynamic', type:'connectionNode_signal', name:'pulseIn', data:{ 
                            x:unitStyle.drawingValue.width - unitStyle.offset.x, y:80, width:5, height:10, angle:0, cableVersion:2, style:style.connectionNode.signal,
                        }},

                        {collection:'basic', type:'image', name:'backing', 
                            data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                        },

                        {collection:'control', type:'checkbox_image', name:'unify', data:{
                            x:10, y:22, width:8, height:20,
                            checkURL:unitStyle.imageStoreURL_commonPrefix+'unify_up.png',
                            uncheckURL:unitStyle.imageStoreURL_commonPrefix+'unify_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'clear', data:{
                            x:21, y:22, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'clear_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'clear_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'randomFill', data:{
                            x:32, y:22, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'randomFill_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'randomFill_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'cut', data:{
                            x:43, y:22, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'cut_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'cut_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'copy', data:{
                            x:54, y:22, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'copy_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'copy_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'paste', data:{
                            x:65, y:22, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'paste_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'paste_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'channel_left', data:{
                            x:76, y:22, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'arrow_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'arrow_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'channel_right', data:{
                            x:87+8, y:22+20, width:8, height:20, angle:Math.PI, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'arrow_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'arrow_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'page_up', data:{
                            x:98, y:30, width:8, height:20, angle:-Math.PI/2, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'plus_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'plus_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'page_down', data:{
                            x:98, y:42, width:8, height:20, angle:-Math.PI/2, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'minus_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'minus_down.png',
                        }},
                        {collection:'display', type:'sevenSegmentDisplay', name:'page', data:{
                            x:121.5, y:22.5, width:11, height:19, canvasBased:true, resolution:5,
                        }},

                        {collection:'control', type:'button_image', name:'step', data:{
                            x:10, y:45, width:20, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'step_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'step_down.png',
                        }},
                        {collection:'control', type:'dial_discrete_image', name:'releaseLength', data:{
                            x:43, y:55, radius:20/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:4, 
                            handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                        }},
                        {collection:'control', type:'dial_discrete_image', name:'direction', data:{
                            x:66, y:55, radius:20/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:4, 
                            handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                        }},
                        {collection:'control', type:'button_image', name:'region_left', data:{
                            x:86, y:45, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'region_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'region_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'region_right', data:{
                            x:97+8, y:45+20, width:8, height:20, angle:Math.PI, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'region_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'region_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'region_32', data:{
                            x:108, y:45, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'region_32_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'region_32_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'region_16', data:{
                            x:119, y:45, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'region_16_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'region_16_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'region_8', data:{
                            x:130, y:45, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'region_8_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'region_8_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'signal', data:{
                            x:151, y:45, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'signal_off.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'signal_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'signal_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'signal_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'voltage', data:{
                            x:162, y:45, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'voltage_off.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'voltage_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'voltage_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'voltage_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'through', data:{
                            x:173, y:45, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'through_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'through_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'through_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'through_on.png',
                        }},
                    ]
                ).concat(
                    (new Array(16)).fill().flatMap((item,index) => {
                        return [
                            {collection:'display', type:'glowbox_rectangle', name:'selectorStepLED_'+index, data:{
                                x:10 + index*20, y:100-3, width:15, height:5, style:unitStyle.selectorStepLEDstyle,
                            }},
                            {collection:'display', type:'glowbox_rectangle', name:'selectorStepLED_'+(index+16), data:{
                                x:10 + index*20, y:135-3, width:15, height:5, style:unitStyle.selectorStepLEDstyle,
                            }},
                        ];
                    })
                ).concat(
                    (new Array(8)).fill().flatMap((item,index) => {
                        return [
                            {collection:'display', type:'glowbox_path', name:'channelLED_'+index, data:{
                                x:10.5 + index*30, y:6, thickness:1.5, points:[{x:0,y:0},{x:15,y:0}], capType:'round', style:unitStyle.channelLEDstyle
                            }},
                        ]
                    })
                ).concat(
                    (new Array(8)).fill().flatMap((item,index) => {
                        return [
                            {collection:'control', type:'button_image', name:'selector_'+index, data:{
                                x:10 + index*20, y:70, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_commonPrefix+'1_up.png',
                                backingURL__press:unitStyle.imageStoreURL_commonPrefix+'1_down.png',
                                backingURL__select:unitStyle.imageStoreURL_commonPrefix+'1_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_commonPrefix+'1_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'1_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'1_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_commonPrefix+'1_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_commonPrefix+'1_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+8), data:{
                                x:10 + (index+8)*20, y:70, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_commonPrefix+'2_up.png',
                                backingURL__press:unitStyle.imageStoreURL_commonPrefix+'2_down.png',
                                backingURL__select:unitStyle.imageStoreURL_commonPrefix+'2_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_commonPrefix+'2_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'2_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'2_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_commonPrefix+'2_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_commonPrefix+'2_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+16), data:{
                                x:10 + index*20, y:105, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_commonPrefix+'3_up.png',
                                backingURL__press:unitStyle.imageStoreURL_commonPrefix+'3_down.png',
                                backingURL__select:unitStyle.imageStoreURL_commonPrefix+'3_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_commonPrefix+'3_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'3_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'3_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_commonPrefix+'3_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_commonPrefix+'3_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+24), data:{
                                x:10 + (index+8)*20, y:105, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_commonPrefix+'4_up.png',
                                backingURL__press:unitStyle.imageStoreURL_commonPrefix+'4_down.png',
                                backingURL__select:unitStyle.imageStoreURL_commonPrefix+'4_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_commonPrefix+'4_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'4_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'4_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_commonPrefix+'4_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_commonPrefix+'4_down_glow_select.png',
                            }},

                            {collection:'control', type:'dial_continuous_image', name:'selectorDial_'+index, data:{
                                x:197.5 + index*16, y:20.5, radius:13/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_continuous_image', name:'selectorDial_'+(index+8), data:{
                                x:205.5 + index*16, y:20.5+13, radius:13/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_continuous_image', name:'selectorDial_'+(index+16), data:{
                                x:197.5 + index*16, y:20.5+26, radius:13/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_continuous_image', name:'selectorDial_'+(index+24), data:{
                                x:205.5 + index*16, y:20.5+39, radius:13/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
                            }},
                        ];
                    })
                )
        });

    //circuitry
        const channelCount = 8;
        const selectorCount = 32;
        const pageCount = 16;
        const state = {
            outputMode:'signal', // signal / voltage
            step:0,
            direction:'l2r', // l2r / r2l / bounce / random
            bounceDirection:1, // 1 / -1
            currentChannel:0,
            unifyChannels:false,
            channel: (new Array(channelCount)).fill().map(() => {
                return {
                    currentPage:0,
                    pages:(new Array(pageCount)).fill().map(() => (new Array(selectorCount)).fill().map(() => ({value:1, state:false})) )
                }
            }),
            currentlySoundingChannels:[0,0,0,0,0,0,0,0],
            release:1, // 1 / 2 / 3 / 4
            playThrough:{active:false, values: (new Array(channelCount)).fill().map(() => 1) },
            region:{start:0, end:31, mode:'32'},
            clipboard:[],
        };

        function refreshLEDs(){
            //output select
                if(state.outputMode == 'signal'){
                    object.elements.button_image.signal.glow(true);
                    object.elements.button_image.voltage.glow(false);
                }else if(state.outputMode == 'voltage'){
                    object.elements.button_image.signal.glow(false);
                    object.elements.button_image.voltage.glow(true);
                }

            //unify
                object.elements.checkbox_image.unify.set(state.unifyChannels);

            //channel
                for(let a = 0; a < channelCount; a++){
                    object.elements.glowbox_path['channelLED_'+a].off();
                }
                object.elements.glowbox_path['channelLED_'+state.currentChannel].on();

            //page
                const page = state.channel[state.currentChannel].currentPage;
                object.elements.sevenSegmentDisplay.page.enterCharacter(['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'][page]);

            //step
                for(let a = 0; a < selectorCount; a++){
                    object.elements.button_image['selector_'+a].glow(false);
                }
                object.elements.button_image['selector_'+state.step].glow(true);

            //selection region
                for(let a = 0; a < selectorCount; a++){
                    object.elements.glowbox_rectangle['selectorStepLED_'+a].off();
                    if(a >= state.region.start && a <= state.region.end){
                        object.elements.glowbox_rectangle['selectorStepLED_'+a].on();
                    }
                }
        }
        function refreshSelectors(){
            const page = state.channel[state.currentChannel].currentPage;
            for(let a = 0; a < selectorCount; a++){
                object.elements.button_image['selector_'+a].select(
                    state.channel[state.currentChannel].pages[page][a].state
                );
                object.elements.dial_continuous_image['selectorDial_'+a].set(
                    state.channel[state.currentChannel].pages[page][a].value/2
                );
            }
        }
        function refresh(){
            refreshLEDs();
            refreshSelectors();

            //reset playThrough
                if(state.playThrough.active){
                    toggleThroughMode();
                }
        }
        function setOutputConnectionNodes(mode){
            if(mode != 'signal' && mode != 'voltage'){return;}
            if(state.outputMode == mode){return;}
            state.outputMode = mode;

            const duration = 500;
            const detail = 30;
            const zero2five = _canvas_.library.math.curveGenerator.s(detail,0,5);
            const five2zero = _canvas_.library.math.curveGenerator.s(detail,5,0);

            if(mode == 'signal'){
                for(let a = 0; a < 8; a++){
                    object.elements.connectionNode_voltage['voltage_out_'+a].disconnect();
                    object.elements.connectionNode_voltage['voltage_out_'+a].set(0);
                    
                    for(let b = 0; b < detail; b++){
                        setTimeout(()=>{
                            object.elements.connectionNode_signal['signal_out_'+a].getChildren()[0].width(zero2five[b]);
                            object.elements.connectionNode_voltage['voltage_out_'+a].getChildren()[0].width(five2zero[b]);
                        },
                        (duration/detail)*b);
                    }
                }
            }else if(mode == 'voltage'){
                for(let a = 0; a < 8; a++){
                    object.elements.connectionNode_signal['signal_out_'+a].disconnect();
                    object.elements.connectionNode_signal['signal_out_'+a].set(false);
                    for(let b = 0; b < detail; b++){
                        setTimeout(()=>{
                            object.elements.connectionNode_signal['signal_out_'+a].getChildren()[0].width(five2zero[b]);
                            object.elements.connectionNode_voltage['voltage_out_'+a].getChildren()[0].width(zero2five[b]);
                        },
                        (duration/detail)*b);
                    }
                }
            }
            refresh();
        }
        function setChannel(channel){
            if(channel == undefined){ return state.currentChannel; }
            state.currentChannel = channel;
            refresh();
        }
        function step(){
            switch(state.direction){
                case 'l2r':
                    state.step++;
                    if(state.step == state.region.end+1 || state.step >= selectorCount){state.step = state.region.start;}
                break;
                case 'r2l': 
                    state.step--;
                    if(state.step == state.region.start-1 || state.step < 0){state.step = state.region.end;}
                break;
                case 'bounce':
                    if(state.step == state.region.start || state.step == 0){state.bounceDirection = 1;}
                    if(state.step == state.region.end || state.step == selectorCount-1){state.bounceDirection = -1;}
                    state.step += state.bounceDirection;
                break;
                case 'random':
                    state.step = state.region.start + Math.round(Math.random()*(state.region.end - state.region.start));
                break;
            }

            state.currentlySoundingChannels = state.currentlySoundingChannels.map((item,index) => {
                if(item == 0){return 0;}
                if(item == 1){
                    if( state.outputMode == 'signal' ){
                        object.elements.connectionNode_signal['signal_out_'+index].set( false );
                    }else if( state.outputMode == 'voltage' ){
                        object.elements.connectionNode_voltage['voltage_out_'+index].set( 0 );
                    }
                    return 0;
                }
                if(item > 1){
                    return item - 1;
                }
            });
            for(let a = 0; a < channelCount; a++){
                if( state.channel[a].pages[state.channel[a].currentPage][state.step].state && state.currentlySoundingChannels[a] == 0 ){
                    if( state.outputMode == 'signal' ){
                        object.elements.connectionNode_signal['signal_out_'+a].set( true );
                    }else if( state.outputMode == 'voltage' ){
                        object.elements.connectionNode_voltage['voltage_out_'+a].set( state.channel[a].pages[state.channel[a].currentPage][state.step].value );
                    }
                    state.currentlySoundingChannels[a] = state.release;
                }
            }
            
            refreshLEDs();
        }
        function clear(){
            const page = state.channel[state.currentChannel].currentPage;
            if(state.unifyChannels){
                for(let a = 0; a < channelCount; a++){
                    for(let b = 0; b < selectorCount; b++){
                        state.channel[a].pages[page][b].state = false;
                        state.channel[a].pages[page][b].value = 1;
                    }
                }
            }else{
                for(let a = 0; a < selectorCount; a++){
                    state.channel[state.currentChannel].pages[page][a].state = false;
                    state.channel[state.currentChannel].pages[page][a].value = 1;
                }
            }
            refresh();
        }
        function randomFill(){
            const page = state.channel[state.currentChannel].currentPage;

            if(state.unifyChannels){
                for(let a = 0; a < channelCount; a++){
                    for(let b = 0; b < selectorCount; b++){
                        state.channel[a].pages[page][b].state = Math.round(Math.random()) == 1;
                        state.channel[a].pages[page][b].value = Math.random()*2;
                    }
                }
            }else{
                for(let a = 0; a < selectorCount; a++){
                    state.channel[state.currentChannel].pages[page][a].state = Math.round(Math.random()) == 1;
                    state.channel[state.currentChannel].pages[page][a].value = Math.random()*2;
                }
            }
            refresh();
        }
        function copy(){
            state.clipboard = [];
            const page = state.channel[state.currentChannel].currentPage;

            if(state.unifyChannels){
                for(let a = 0; a < channelCount; a++){
                    state.clipboard[a] = [];
                    for(let b = 0; b < selectorCount; b++){
                        state.clipboard[a].push({
                            state: state.channel[a].pages[page][b].state,
                            value: state.channel[a].pages[page][b].value,
                        });
                    }
                }
            }else{
                for(let a = 0; a < selectorCount; a++){
                    state.clipboard.push({
                        state: state.channel[state.currentChannel].pages[page][a].state,
                        value: state.channel[state.currentChannel].pages[page][a].value,
                    });
                }
            }
        }
        function cut(){
            copy();
            clear();
        }
        function paste(){
            if(state.clipboard.length == 0){return;}

            const page = state.channel[state.currentChannel].currentPage;
            if(state.unifyChannels){
                for(let a = 0; a < channelCount; a++){
                    for(let b = 0; b < selectorCount; b++){
                        state.channel[a].pages[page][b].state = state.clipboard[a][b].state;
                        state.channel[a].pages[page][b].value = state.clipboard[a][b].value;
                    }
                }
            }else{
                for(let a = 0; a < selectorCount; a++){
                    state.channel[state.currentChannel].pages[page][a].state = state.clipboard[a].state;
                    state.channel[state.currentChannel].pages[page][a].value = state.clipboard[a].value;
                }
            }
            refresh();
        }
        function toggleThroughMode(){
            state.playThrough.active = !state.playThrough.active;
            object.elements.button_image.through.glow(state.playThrough.active);

            if(state.playThrough.active){
                for(let a = 0; a < selectorCount; a++){
                    object.elements.button_image['selector_'+a].select(false,undefined,false);
                    object.elements.button_image['selector_'+a].glow(false);
                    object.elements.button_image['selector_'+a].selectable(false);
                    object.elements.dial_continuous_image['selectorDial_'+a].set(
                        state.playThrough.values[a] != undefined ? state.playThrough.values[a]/2 : 0
                    );
                }
            }else{
                for(let a = 0; a < selectorCount; a++){
                    object.elements.button_image['selector_'+a].selectable(true);
                }
                refresh();
            }
        }

    //wiring
        //hid
            //page
                object.elements.checkbox_image.unify.onchange = function(bool){
                    state.unifyChannels = bool;
                    state.clipboard = [];
                };
                object.elements.button_image.clear.onpress = function(){
                    clear();
                };
                object.elements.button_image.randomFill.onpress = function(){
                    randomFill();
                };
                object.elements.button_image.cut.onpress = function(){
                    cut();
                };
                object.elements.button_image.copy.onpress = function(){
                    copy();
                };
                object.elements.button_image.paste.onpress = function(){
                    paste();
                };
                object.elements.button_image.channel_left.onpress = function(){
                    state.currentChannel--;
                    if(state.currentChannel < 0){state.currentChannel = channelCount-1;}
                    refresh();
                };
                object.elements.button_image.channel_right.onpress = function(){
                    state.currentChannel++;
                    if(state.currentChannel > channelCount-1){state.currentChannel = 0;}
                    refresh();
                };
                object.elements.button_image.page_up.onpress = function(){
                    state.channel[state.currentChannel].currentPage++;
                    if(state.channel[state.currentChannel].currentPage > pageCount-1){state.channel[state.currentChannel].currentPage = 0;}
    
                    if(state.unifyChannels){
                        for(let a = 0; a < channelCount; a++){
                            state.channel[a].currentPage = state.channel[state.currentChannel].currentPage;
                        }
                    }
    
                    refresh();
                };
                object.elements.button_image.page_down.onpress = function(){
                    state.channel[state.currentChannel].currentPage--;
                    if(state.channel[state.currentChannel].currentPage < 0){state.channel[state.currentChannel].currentPage = pageCount-1;}
    
                    if(state.unifyChannels){
                        for(let a = 0; a < channelCount; a++){
                            state.channel[a].currentPage = state.channel[state.currentChannel].currentPage;
                        }
                    }
    
                    refresh();
                };
        
            //progression
                object.elements.button_image.step.onpress = function(){
                    step();
                };
                object.elements.dial_discrete_image.releaseLength.onchange = function(value){
                    state.release = value+1;
                };
                object.elements.dial_discrete_image.direction.onchange = function(value){
                    state.direction = ['l2r','r2l','bounce','random'][value];
                };

            //subsection selection
                object.elements.button_image.region_left.onpress = function(){
                    state.region.mode = 'left';
                };
                object.elements.button_image.region_right.onpress = function(){
                    state.region.mode = 'right';
                };
                object.elements.button_image.region_32.onpress = function(){
                    state.region = {start:0, end:31};
                    refresh();
                    state.region.mode = '32';
                };
                object.elements.button_image.region_16.onpress = function(){
                    if( state.region.mode == '16_1' ){
                        state.region = {start:16, end:31};
                        state.region.mode = '16_2';
                    }else{
                        state.region = {start:0, end:15};
                        state.region.mode = '16_1';
                    }
                    refresh();
                };
                object.elements.button_image.region_8.onpress = function(){
                    if( state.region.mode == '8_1' ){
                        state.region = {start:8, end:15};
                        state.region.mode = '8_2';
                    }else if( state.region.mode == '8_2' ){
                        state.region = {start:16, end:23};
                        state.region.mode = '8_3';
                    }else if( state.region.mode == '8_3' ){
                        state.region = {start:24, end:31};
                        state.region.mode = '8_4';
                    }else{
                        state.region = {start:0, end:7};
                        state.region.mode = '8_1';
                    }
                    refresh();
                };
                
            //meta
                object.elements.button_image.signal.onpress = function(){
                    setOutputConnectionNodes('signal');
                };
                object.elements.button_image.voltage.onpress = function(){
                    setOutputConnectionNodes('voltage');
                };
                object.elements.button_image.through.onpress = function(){
                    toggleThroughMode();
                };
            
            //selectors
                for(let a = 0; a < selectorCount; a++){
                    object.elements.button_image['selector_'+a].onpress = function(){
                        if(state.playThrough.active){
                            if( a < 8 ){
                                if( state.outputMode == 'signal' ){
                                    object.elements.connectionNode_signal['signal_out_'+a].set( true );
                                }else if( state.outputMode == 'voltage' ){
                                    object.elements.connectionNode_voltage['voltage_out_'+a].set( state.playThrough.values[a] );
                                }
                            }
                        }

                        if( state.region.mode != 'left' && state.region.mode != 'right' ){return;}

                        if( state.region.mode == 'left' ){
                            if( a > state.region.end ){
                                state.region.mode = '';
                                return;
                            }
                            state.region.start = a;
                        }else if( state.region.mode == 'right' ){
                            if( a < state.region.start ){
                                state.region.mode = '';
                                return;
                            }
                            state.region.end = a;
                        }

                        const page = state.channel[state.currentChannel].currentPage;
                        state.channel[state.currentChannel].pages[page][a].state = !state.channel[state.currentChannel].pages[page][a].state;

                        state.region.mode = '';
                        refresh();
                    };
                    object.elements.button_image['selector_'+a].onrelease = function(){
                        if(state.playThrough.active){
                            if( a < 8 ){
                                if( state.outputMode == 'signal' ){
                                    object.elements.connectionNode_signal['signal_out_'+a].set( false );
                                }else if( state.outputMode == 'voltage' ){
                                    object.elements.connectionNode_voltage['voltage_out_'+a].set( 0 );
                                }
                            }
                        }
                    };
                    object.elements.button_image['selector_'+a].onselect = function(){
                        const page = state.channel[state.currentChannel].currentPage;
                        state.channel[state.currentChannel].pages[page][a].state = true;
                    };
                    object.elements.button_image['selector_'+a].ondeselect = function(){
                        const page = state.channel[state.currentChannel].currentPage;
                        state.channel[state.currentChannel].pages[page][a].state = false;
                    };

                    object.elements.dial_continuous_image['selectorDial_'+a].onchange = function(value){
                        if(state.playThrough.active){
                            state.playThrough.values[a] = value*2;
                            return;
                        }

                        const page = state.channel[state.currentChannel].currentPage;
                        state.channel[state.currentChannel].pages[page][a].value = value*2;
                    };
                }

        //keycapture
            object.elements.image.backing.attachCallback('onkeydown', function(x,y,event){
                const OEBI = object.elements.button_image;

                switch(event.keyCode){
                    case 49: setChannel(0); break;
                    case 50: setChannel(1); break;
                    case 51: setChannel(2); break;
                    case 52: setChannel(3); break;
                    case 53: setChannel(4); break;
                    case 54: setChannel(5); break;
                    case 55: setChannel(6); break;
                    case 56: setChannel(7); break;

                    case 57: object.elements.dial_discrete_image.releaseLength.nudge(-1); break;
                    case 48: object.elements.dial_discrete_image.releaseLength.nudge(1);  break;
                    case 189: object.elements.dial_discrete_image.direction.nudge(-1); break;
                    case 187: object.elements.dial_discrete_image.direction.nudge(1);  break;

                    case 191: object.elements.checkbox_image.unify.toggle(); break;
                    case 186: OEBI.clear.press(); break;
                    case 13: step(); break;

                    case 38: OEBI.page_up.press(); break;
                    case 40: OEBI.page_down.press(); break;
                    case 37: OEBI.channel_left.press(); break;
                    case 39: OEBI.channel_right.press(); break;

                    case 81: OEBI.randomFill.press(); break;
                    case 87: OEBI.cut.press(); break;
                    case 69: OEBI.copy.press(); break;
                    case 82: OEBI.paste.press(); break;
                    case 84: OEBI.region_left.press(); break;
                    case 89: OEBI.region_right.press(); break;
                    case 85: OEBI.region_32.press(); break;
                    case 73: OEBI.region_16.press(); break;
                    case 79: OEBI.region_8.press(); break;
                    case 80: OEBI.through.press(); break;

                    case 65:  if(!event.shiftKey){ OEBI['selector_0'].press();  }else{ OEBI['selector_16'].press(); } break;
                    case 83:  if(!event.shiftKey){ OEBI['selector_1'].press();  }else{ OEBI['selector_17'].press(); } break;
                    case 68:  if(!event.shiftKey){ OEBI['selector_2'].press();  }else{ OEBI['selector_18'].press(); } break;
                    case 70:  if(!event.shiftKey){ OEBI['selector_3'].press();  }else{ OEBI['selector_19'].press(); } break;
                    case 71:  if(!event.shiftKey){ OEBI['selector_4'].press();  }else{ OEBI['selector_20'].press(); } break;
                    case 72:  if(!event.shiftKey){ OEBI['selector_5'].press();  }else{ OEBI['selector_21'].press(); } break;
                    case 74:  if(!event.shiftKey){ OEBI['selector_6'].press();  }else{ OEBI['selector_22'].press(); } break;
                    case 75:  if(!event.shiftKey){ OEBI['selector_7'].press();  }else{ OEBI['selector_23'].press(); } break;
                    case 90:  if(!event.shiftKey){ OEBI['selector_8'].press();  }else{ OEBI['selector_24'].press(); } break;
                    case 88:  if(!event.shiftKey){ OEBI['selector_9'].press();  }else{ OEBI['selector_25'].press(); } break;
                    case 67:  if(!event.shiftKey){ OEBI['selector_10'].press(); }else{ OEBI['selector_26'].press(); } break;
                    case 86:  if(!event.shiftKey){ OEBI['selector_11'].press(); }else{ OEBI['selector_27'].press(); } break;
                    case 66:  if(!event.shiftKey){ OEBI['selector_12'].press(); }else{ OEBI['selector_28'].press(); } break;
                    case 78:  if(!event.shiftKey){ OEBI['selector_13'].press(); }else{ OEBI['selector_29'].press(); } break;
                    case 77:  if(!event.shiftKey){ OEBI['selector_14'].press(); }else{ OEBI['selector_30'].press(); } break;
                    case 188: if(!event.shiftKey){ OEBI['selector_15'].press(); }else{ OEBI['selector_31'].press(); } break;
                }
            });
            object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
                const OEBI = object.elements.button_image;
                switch(event.keyCode){
                    case 186: OEBI.clear.release(); break;

                    case 57: object.elements.button_image.page_up.release(); break;
                    case 48: object.elements.button_image.page_down.release(); break;
                    case 189: object.elements.button_image.channel_left.release(); break;
                    case 187: object.elements.button_image.channel_right.release(); break;

                    case 81: object.elements.button_image.randomFill.release(); break;
                    case 87: object.elements.button_image.cut.release(); break;
                    case 69: object.elements.button_image.copy.release(); break;
                    case 82: object.elements.button_image.paste.release(); break;
                    case 84: object.elements.button_image.region_left.release(); break;
                    case 89: object.elements.button_image.region_right.release(); break;
                    case 85: object.elements.button_image.region_32.release(); break;
                    case 73: object.elements.button_image.region_16.release(); break;
                    case 79: object.elements.button_image.region_8.release(); break;
                    case 80: object.elements.button_image.through.release(); break;

                    case 65:  if(!event.shiftKey){ OEBI['selector_0'].release();  }else{ OEBI['selector_16'].release(); } break;
                    case 83:  if(!event.shiftKey){ OEBI['selector_1'].release();  }else{ OEBI['selector_17'].release(); } break;
                    case 68:  if(!event.shiftKey){ OEBI['selector_2'].release();  }else{ OEBI['selector_18'].release(); } break;
                    case 70:  if(!event.shiftKey){ OEBI['selector_3'].release();  }else{ OEBI['selector_19'].release(); } break;
                    case 71:  if(!event.shiftKey){ OEBI['selector_4'].release();  }else{ OEBI['selector_20'].release(); } break;
                    case 72:  if(!event.shiftKey){ OEBI['selector_5'].release();  }else{ OEBI['selector_21'].release(); } break;
                    case 74:  if(!event.shiftKey){ OEBI['selector_6'].release();  }else{ OEBI['selector_22'].release(); } break;
                    case 75:  if(!event.shiftKey){ OEBI['selector_7'].release();  }else{ OEBI['selector_23'].release(); } break;
                    case 90:  if(!event.shiftKey){ OEBI['selector_8'].release();  }else{ OEBI['selector_24'].release(); } break;
                    case 88:  if(!event.shiftKey){ OEBI['selector_9'].release();  }else{ OEBI['selector_25'].release(); } break;
                    case 67:  if(!event.shiftKey){ OEBI['selector_10'].release(); }else{ OEBI['selector_26'].release(); } break;
                    case 86:  if(!event.shiftKey){ OEBI['selector_11'].release(); }else{ OEBI['selector_27'].release(); } break;
                    case 66:  if(!event.shiftKey){ OEBI['selector_12'].release(); }else{ OEBI['selector_28'].release(); } break;
                    case 78:  if(!event.shiftKey){ OEBI['selector_13'].release(); }else{ OEBI['selector_29'].release(); } break;
                    case 77:  if(!event.shiftKey){ OEBI['selector_14'].release(); }else{ OEBI['selector_30'].release(); } break;
                    case 188: if(!event.shiftKey){ OEBI['selector_15'].release(); }else{ OEBI['selector_31'].release(); } break;
                }
            });

        //io
            object.io.signal.pulseIn.onchange = function(value){
                if(!value){return}
                step();
            } 

    //interface
        object.i = {
            outputMode:function(mode){
                if(mode == undefined){ return state.outputMode; }
                setOutputConnectionNodes(mode);
            },
            playThrough:function(bool){
                if(bool == undefined){ return state.playThrough.active; }
                if( state.playThrough.active == bool ){ return; }
                toggleThroughMode();
            },
            step:function(){
                step();
            },
            currentChannel:function(channel){
                if(channel == undefined){ return state.currentChannel; }
                if(channel > channelCount-1 || channel < 0){return;}
                state.currentChannel = channel;
                refreshLEDs();
                refreshSelectors();
            },
            currentPage:function(channel, page){
                if(channel == undefined){ return; }
                if(channel > channelCount-1 || channel < 0){return;}
                if(page == undefined){ return state.channel[channel].currentPage; }
                if(page > pageCount-1 || page < 0){return;}
                state.channel[channel].currentPage = page;
                refreshLEDs();
                refreshSelectors();
            },
            pageData:function(channel, page, data){
                if(channel == undefined){ return; }
                if(channel > channelCount-1 || channel < 0){return;}
                if(page == undefined){ return state.channel[channel].pages; }
                if(page > pageCount-1 || page < 0){return;}
                if(data == undefined){ return state.channel[channel].pages[page]; }
                state.channel[channel].pages[page] = data;
                refreshLEDs();
                refreshSelectors();
            },
            unify:function(bool){
                if(bool == undefined){ return state.unifyChannels; }
                object.elements.checkbox_image.unify.set(bool);
            },
            clear:function(){
                clear();
            },
            randomFill:function(){
                randomFill();
            },
            release:function(value){
                if(value == undefined){ return state.release-1; }
                object.elements.dial_discrete_image.releaseLength.set(value);
            },
            direction:function(mode){
                if(mode == undefined){ return state.direction; }
                object.elements.dial_discrete_image.direction.set( ['l2r','r2l','bounce','random'].indexOf(mode) );
            },
            region:function(start,end){
                if(start == undefined && end == undefined){ return {start:state.region.start,end:state.region.end}; }
                if( start < 0 || start > selectorCount-1 || end < 0 || end > selectorCount-1){ return; }
                if( end < start ){ return; }
                state.region = {start:start, end:end};
                refresh();
                state.region.mode = '';
            },
            reset:function(){
                state.outputMode = 'signal';
                state.step = 0;
                state.direction = 'l2r';
                state.bounceDirection = 1;
                state.currentChannel = 0;
                state.unifyChannels = false;
                state.channel = (new Array(channelCount)).fill().map(() => {
                    return {
                        currentPage:0,
                        pages:(new Array(pageCount)).fill().map(() => (new Array(selectorCount)).fill().map(() => ({value:1, state:false})) )
                    }
                });
                state.currentlySoundingChannels = [0,0,0,0,0,0,0,0];
                state.release = 1;
                state.playThrough.active = false
                state.playThrough.values = (new Array(channelCount)).fill().map(() => 1);
                state.region.start = 0, 
                state.region.end = 31
                state.region.mode = '32'
                state.clipboard = [];

                refresh();
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            Object.keys(data).forEach(key => { state[key] = JSON.parse(JSON.stringify(data[key])); });
            refresh();
        };

    //setup/tearDown
        object.oncreate = function(){
            setChannel(0);
        };

    return object;
};
this['rdp-32'].metadata = {
    name:'Rhythm Designer Pro - 32',
    category:'',
    helpURL:'/help/units/harbinger/rdp-32/'
};