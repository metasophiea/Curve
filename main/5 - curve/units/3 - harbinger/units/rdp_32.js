this['rdp-32'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'rdp-32/';

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
                    dim:{r:0.5,g:0.5,b:0.5,a:1},
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
                            checkURL:unitStyle.imageStoreURL_localPrefix+'unify_on.png',
                            uncheckURL:unitStyle.imageStoreURL_localPrefix+'unify_off.png',
                        }},
                        {collection:'control', type:'button_image', name:'clear', data:{
                            x:21, y:22, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'clear_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'clear_down.png',
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
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'row_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'row_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'channel_right', data:{
                            x:87+8, y:22+20, width:8, height:20, angle:Math.PI, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'row_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'row_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'page_up', data:{
                            x:98, y:22, width:20, height:8, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'page_up_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'page_up_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'page_down', data:{
                            x:98, y:34, width:20, height:8, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'page_down_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'page_down_down.png',
                        }},
                        {collection:'display', type:'sevenSegmentDisplay', name:'page', data:{
                            x:121.5, y:22.5, width:11, height:19, canvasBased:true, resolution:5,
                        }},

                        {collection:'control', type:'button_image', name:'step', data:{
                            x:10, y:45, width:20, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'step_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'step_down.png',
                        }},
                        {collection:'control', type:'dial_discrete_image', name:'releaseLength', data:{
                            x:43, y:55, radius:20/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:4, 
                            handleURL:unitStyle.imageStoreURL_localPrefix+'dial_large.png',
                        }},
                        {collection:'control', type:'dial_discrete_image', name:'direction', data:{
                            x:66, y:55, radius:20/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:4, 
                            handleURL:unitStyle.imageStoreURL_localPrefix+'dial_large.png',
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
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'signal_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'signal_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'signal_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'signal_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'voltage', data:{
                            x:162, y:45, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'voltage_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'voltage_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'voltage_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'voltage_on.png',
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
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'1_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'1_down.png',
                                backingURL__select:unitStyle.imageStoreURL_localPrefix+'1_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_localPrefix+'1_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_localPrefix+'1_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'1_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_localPrefix+'1_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_localPrefix+'1_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+8), data:{
                                x:10 + (index+8)*20, y:70, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'2_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'2_down.png',
                                backingURL__select:unitStyle.imageStoreURL_localPrefix+'2_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_localPrefix+'2_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_localPrefix+'2_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'2_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_localPrefix+'2_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_localPrefix+'2_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+16), data:{
                                x:10 + index*20, y:105, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'3_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'3_down.png',
                                backingURL__select:unitStyle.imageStoreURL_localPrefix+'3_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_localPrefix+'3_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_localPrefix+'3_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'3_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_localPrefix+'3_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_localPrefix+'3_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+24), data:{
                                x:10 + (index+8)*20, y:105, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'4_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'4_down.png',
                                backingURL__select:unitStyle.imageStoreURL_localPrefix+'4_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_localPrefix+'4_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_localPrefix+'4_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'4_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_localPrefix+'4_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_localPrefix+'4_down_glow_select.png',
                            }},

                            {collection:'control', type:'dial_continuous_image', name:'selectorDial_'+index, data:{
                                x:197.5 + index*16, y:20.5, radius:13/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_localPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_continuous_image', name:'selectorDial_'+(index+8), data:{
                                x:205.5 + index*16, y:20.5+13, radius:13/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_localPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_continuous_image', name:'selectorDial_'+(index+16), data:{
                                x:197.5 + index*16, y:20.5+26, radius:13/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_localPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_continuous_image', name:'selectorDial_'+(index+24), data:{
                                x:205.5 + index*16, y:20.5+39, radius:13/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0.5, arcDistance:1.2, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_localPrefix+'dial_small.png',
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
            outputMode:'signal', //signal / voltage
            step:0, 
            direction:'l2r', //l2r / r2l / bounce / random
            bounceDirection:1,
            currentChannel:0,
            unifyChannels:false,
            channel:[],
            currentlySoundingChannels:[0,0,0,0,0,0,0,0],
            release:1,
            playThrough:{active:false, values: (new Array(channelCount)).fill().map(() => 1) },
            region:{start:0, end:31, mode:'32'},
            clipboard:[],
        };
        for(let a = 0; a < channelCount; a++){
            state.channel.push(
                {
                    currentPage:0,
                    pages:(new Array(pageCount)).fill().map(() => (new Array(selectorCount)).fill().map(() => ({value:1, state:false})) )
                }
            );
        }

        function refreshLEDs(){
            //output select
                if(state.outputMode == 'signal'){
                    object.elements.button_image.signal.glow(true);
                    object.elements.button_image.voltage.glow(false);
                }else if(state.outputMode == 'voltage'){
                    object.elements.button_image.signal.glow(false);
                    object.elements.button_image.voltage.glow(true);
                }

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
        function refresh(){
            refreshLEDs();

            //selector
                const page = state.channel[state.currentChannel].currentPage;
                for(let a = 0; a < selectorCount; a++){
                    object.elements.button_image['selector_'+a].select(
                        state.channel[state.currentChannel].pages[page][a].state
                    );
                    object.elements.dial_continuous_image['selectorDial_'+a].set(
                        state.channel[state.currentChannel].pages[page][a].value/2
                    );
                }

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
                            if( state.outputMode == 'signal' ){
                                object.elements.connectionNode_signal['signal_out_'+a].set( true );
                            }else if( state.outputMode == 'voltage' ){
                                object.elements.connectionNode_voltage['voltage_out_'+a].set( state.playThrough.values[a] );
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
                            if( state.outputMode == 'signal' ){
                                object.elements.connectionNode_signal['signal_out_'+a].set( false );
                            }else if( state.outputMode == 'voltage' ){
                                object.elements.connectionNode_voltage['voltage_out_'+a].set( 0 );
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
                switch(event.key){
                    case '1': setChannel(0); break;
                    case '2': setChannel(1); break;
                    case '3': setChannel(2); break;
                    case '4': setChannel(3); break;
                    case '5': setChannel(4); break;
                    case '6': setChannel(5); break;
                    case '7': setChannel(6); break;
                    case '8': setChannel(7); break;

                    case '9': object.elements.dial_discrete_image.releaseLength.nudge(-1); break;
                    case '0': object.elements.dial_discrete_image.releaseLength.nudge(1);  break;
                    case '-': object.elements.dial_discrete_image.direction.nudge(-1); break;
                    case '=': object.elements.dial_discrete_image.direction.nudge(1);  break;

                    case '/': object.elements.checkbox_image.unify.toggle(); break;
                    case ';': object.elements.button_image.clear.press(); break;
                    case 'Enter': step(); break;

                    case 'ArrowUp': object.elements.button_image.page_up.press(); break;
                    case 'ArrowDown': object.elements.button_image.page_down.press(); break;
                    case 'ArrowLeft': object.elements.button_image.channel_left.press(); break;
                    case 'ArrowRight': object.elements.button_image.channel_right.press(); break;

                    case 'q': object.elements.button_image.randomFill.press(); break;
                    case 'w': object.elements.button_image.cut.press(); break;
                    case 'e': object.elements.button_image.copy.press(); break;
                    case 'r': object.elements.button_image.paste.press(); break;
                    case 't': object.elements.button_image.region_left.press(); break;
                    case 'y': object.elements.button_image.region_right.press(); break;
                    case 'u': object.elements.button_image.region_32.press(); break;
                    case 'i': object.elements.button_image.region_16.press(); break;
                    case 'o': object.elements.button_image.region_8.press(); break;
                    case 'p': object.elements.button_image.through.press(); break;

                    case 'a': object.elements.button_image['selector_0'].press();  break;
                    case 's': object.elements.button_image['selector_1'].press();  break;
                    case 'd': object.elements.button_image['selector_2'].press();  break;
                    case 'f': object.elements.button_image['selector_3'].press();  break;
                    case 'g': object.elements.button_image['selector_4'].press();  break;
                    case 'h': object.elements.button_image['selector_5'].press();  break;
                    case 'j': object.elements.button_image['selector_6'].press();  break;
                    case 'k': object.elements.button_image['selector_7'].press();  break;
                    case '`': object.elements.button_image['selector_8'].press();  break;
                    case 'z': object.elements.button_image['selector_9'].press();  break;
                    case 'x': object.elements.button_image['selector_10'].press(); break;
                    case 'c': object.elements.button_image['selector_11'].press(); break;
                    case 'v': object.elements.button_image['selector_12'].press(); break;
                    case 'b': object.elements.button_image['selector_13'].press(); break;
                    case 'n': object.elements.button_image['selector_14'].press(); break;
                    case 'm': object.elements.button_image['selector_15'].press(); break;
                    case 'A': object.elements.button_image['selector_16'].press(); break;
                    case 'S': object.elements.button_image['selector_17'].press(); break;
                    case 'D': object.elements.button_image['selector_18'].press(); break;
                    case 'F': object.elements.button_image['selector_19'].press(); break;
                    case 'G': object.elements.button_image['selector_20'].press(); break;
                    case 'H': object.elements.button_image['selector_21'].press(); break;
                    case 'J': object.elements.button_image['selector_22'].press(); break;
                    case 'K': object.elements.button_image['selector_23'].press(); break;
                    case '~': object.elements.button_image['selector_24'].press(); break;
                    case 'Z': object.elements.button_image['selector_25'].press(); break;
                    case 'X': object.elements.button_image['selector_26'].press(); break;
                    case 'C': object.elements.button_image['selector_27'].press(); break;
                    case 'V': object.elements.button_image['selector_28'].press(); break;
                    case 'B': object.elements.button_image['selector_29'].press(); break;
                    case 'N': object.elements.button_image['selector_30'].press(); break;
                    case 'M': object.elements.button_image['selector_31'].press(); break;
                }
            });
            object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
                switch(event.key){
                    case ';': object.elements.button_image.clear.release(); break;

                    case 'ArrowUp': object.elements.button_image.page_up.release(); break;
                    case 'ArrowDown': object.elements.button_image.page_down.release(); break;
                    case 'ArrowLeft': object.elements.button_image.channel_left.release(); break;
                    case 'ArrowRight': object.elements.button_image.channel_right.release(); break;

                    case 'q': object.elements.button_image.randomFill.release(); break;
                    case 'w': object.elements.button_image.cut.release(); break;
                    case 'e': object.elements.button_image.copy.release(); break;
                    case 'r': object.elements.button_image.paste.release(); break;
                    case 't': object.elements.button_image.region_left.release(); break;
                    case 'y': object.elements.button_image.region_right.release(); break;
                    case 'u': object.elements.button_image.region_32.release(); break;
                    case 'i': object.elements.button_image.region_16.release(); break;
                    case 'o': object.elements.button_image.region_8.release(); break;
                    case 'p': object.elements.button_image.through.release(); break;

                    case 'a': object.elements.button_image['selector_0'].release();  break;
                    case 's': object.elements.button_image['selector_1'].release();  break;
                    case 'd': object.elements.button_image['selector_2'].release();  break;
                    case 'f': object.elements.button_image['selector_3'].release();  break;
                    case 'g': object.elements.button_image['selector_4'].release();  break;
                    case 'h': object.elements.button_image['selector_5'].release();  break;
                    case 'j': object.elements.button_image['selector_6'].release();  break;
                    case 'k': object.elements.button_image['selector_7'].release();  break;
                    case '`': object.elements.button_image['selector_8'].release();  break;
                    case 'z': object.elements.button_image['selector_9'].release();  break;
                    case 'x': object.elements.button_image['selector_10'].release(); break;
                    case 'c': object.elements.button_image['selector_11'].release(); break;
                    case 'v': object.elements.button_image['selector_12'].release(); break;
                    case 'b': object.elements.button_image['selector_13'].release(); break;
                    case 'n': object.elements.button_image['selector_14'].release(); break;
                    case 'm': object.elements.button_image['selector_15'].release(); break;
                    case 'A': object.elements.button_image['selector_16'].release(); break;
                    case 'S': object.elements.button_image['selector_17'].release(); break;
                    case 'D': object.elements.button_image['selector_18'].release(); break;
                    case 'F': object.elements.button_image['selector_19'].release(); break;
                    case 'G': object.elements.button_image['selector_20'].release(); break;
                    case 'H': object.elements.button_image['selector_21'].release(); break;
                    case 'J': object.elements.button_image['selector_22'].release(); break;
                    case 'K': object.elements.button_image['selector_23'].release(); break;
                    case '~': object.elements.button_image['selector_24'].release(); break;
                    case 'Z': object.elements.button_image['selector_25'].release(); break;
                    case 'X': object.elements.button_image['selector_26'].release(); break;
                    case 'C': object.elements.button_image['selector_27'].release(); break;
                    case 'V': object.elements.button_image['selector_28'].release(); break;
                    case 'B': object.elements.button_image['selector_29'].release(); break;
                    case 'N': object.elements.button_image['selector_30'].release(); break;
                    case 'M': object.elements.button_image['selector_31'].release(); break;
                }
                
            });

        //io
            object.io.signal.pulseIn.onchange = function(value){
                if(!value){return}
                step();
            } 

    //interface
        object.i = {
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
    name:'RDP-32',
    category:'',
    helpURL:'/help/units/harbinger/rdp-32/'
};