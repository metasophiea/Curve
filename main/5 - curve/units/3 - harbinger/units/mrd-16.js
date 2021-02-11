this['mrd-16'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'mrd-16/';
                this.imageStoreURL_commonPrefix = imageStoreURL+'common/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:3450, height:790 },
                    design: { width:33.5, height:7.5 },
                };

                this.offset = {x:5,y:2};
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //colours
                this.selectorLEDstyle = {
                    glow:{r:1,g:0.5,b:0.5,a:1},
                    dim:{r:1,g:1,b:1,a:1},
                };
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
            model:'mrd-16',
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
                            x:unitStyle.drawingValue.width - unitStyle.offset.x, y:50, width:5, height:10, angle:0, cableVersion:2, style:style.connectionNode.signal,
                        }},

                        {collection:'basic', type:'image', name:'backing', 
                            data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                        },

                        {collection:'control', type:'button_image', name:'signal', data:{
                            x:10, y:13, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'signal_off.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'signal_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'signal_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'signal_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'voltage', data:{
                            x:22, y:13, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'voltage_off.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'voltage_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'voltage_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'voltage_on.png',
                        }},

                        {collection:'control', type:'button_image', name:'channel_left', data:{
                            x:34, y:13, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'arrow_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'arrow_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'channel_right', data:{
                            x:46+8, y:13+20, width:8, height:20, angle:Math.PI, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'arrow_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'arrow_down.png',
                        }},
                        {collection:'control', type:'checkbox_image', name:'unify', data:{
                            x:58, y:13, width:8, height:20,
                            checkURL:unitStyle.imageStoreURL_commonPrefix+'unify_up.png',
                            uncheckURL:unitStyle.imageStoreURL_commonPrefix+'unify_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'page_up', data:{
                            x:70, y:21, width:8, height:20, angle:-Math.PI/2, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'plus_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'plus_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'page_down', data:{
                            x:70, y:33, width:8, height:20, angle:-Math.PI/2, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'minus_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'minus_down.png',
                        }},
                        {collection:'display', type:'sevenSegmentDisplay', name:'page', data:{
                            x:94.5, y:13.5, width:11, height:19, canvasBased:true, resolution:5,
                        }},
                        {collection:'control', type:'button_image', name:'clear', data:{
                            x:110, y:13, width:8, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'clear_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'clear_down.png',
                        }},
                        {collection:'control', type:'dial_discrete_image', name:'releaseLength', data:{
                            x:132, y:23, radius:20/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:4, 
                            handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                        }},
                        {collection:'control', type:'button_image', name:'step', data:{
                            x:146, y:13, width:20, height:20, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_commonPrefix+'step_up.png',
                            backingURL__press:unitStyle.imageStoreURL_commonPrefix+'step_down.png',
                        }},
                        {collection:'control', type:'dial_discrete_image', name:'direction', data:{
                            x:180, y:23, radius:20/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:4, 
                            handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
                        }},
                    ]
                ).concat(
                    (new Array(16)).fill().flatMap((item,index) => {
                        return [
                            {collection:'display', type:'glowbox_rectangle', name:'selectorStepLED_'+index, data:{
                                x:17.5 - (5/2) + index*20, y:69, width:5*0, height:2.5, style:unitStyle.selectorStepLEDstyle,
                            }},
                        ];
                    })
                ).concat(
                    (new Array(8)).fill().flatMap((item,index) => {
                        return [
                            {collection:'display', type:'glowbox_path', name:'channelLED_'+index, data:{
                                x:10.5 + index*30, y:6.5, thickness:1.5, points:[{x:0,y:0},{x:15,y:0}], capType:'round', style:unitStyle.channelLEDstyle
                            }},
                        ]
                    })
                ).concat(
                    (new Array(4)).fill().flatMap((item,index) => {
                        return [
                            {collection:'control', type:'button_image', name:'selector_'+index, data:{
                                x:10 + index*20, y:39, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_commonPrefix+'1_up.png',
                                backingURL__press:unitStyle.imageStoreURL_commonPrefix+'1_down.png',
                                backingURL__select:unitStyle.imageStoreURL_commonPrefix+'1_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_commonPrefix+'1_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'1_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'1_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_commonPrefix+'1_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_commonPrefix+'1_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+4), data:{
                                x:10 + (index+4)*20, y:39, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_commonPrefix+'2_up.png',
                                backingURL__press:unitStyle.imageStoreURL_commonPrefix+'2_down.png',
                                backingURL__select:unitStyle.imageStoreURL_commonPrefix+'2_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_commonPrefix+'2_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'2_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'2_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_commonPrefix+'2_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_commonPrefix+'2_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+8), data:{
                                x:10 + (index+8)*20, y:39, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_commonPrefix+'3_up.png',
                                backingURL__press:unitStyle.imageStoreURL_commonPrefix+'3_down.png',
                                backingURL__select:unitStyle.imageStoreURL_commonPrefix+'3_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_commonPrefix+'3_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'3_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'3_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_commonPrefix+'3_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_commonPrefix+'3_down_glow_select.png',
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+12), data:{
                                x:10 + (index+12)*20, y:39, width:15, height:30, hoverable:false, selectable:true,
                                backingURL__up:unitStyle.imageStoreURL_commonPrefix+'4_up.png',
                                backingURL__press:unitStyle.imageStoreURL_commonPrefix+'4_down.png',
                                backingURL__select:unitStyle.imageStoreURL_commonPrefix+'4_up_select.png',
                                backingURL__select_press:unitStyle.imageStoreURL_commonPrefix+'4_down_select.png',
                                backingURL__glow:unitStyle.imageStoreURL_commonPrefix+'4_up_glow.png',
                                backingURL__glow_press:unitStyle.imageStoreURL_commonPrefix+'4_down_glow.png',
                                backingURL__glow_select:unitStyle.imageStoreURL_commonPrefix+'4_up_glow_select.png',
                                backingURL__glow_select_press:unitStyle.imageStoreURL_commonPrefix+'4_down_glow_select.png',
                            }},
                        ];
                    })
                )
        });

    //circuitry
        const channelCount = 8;
        const selectorCount = 16;
        const pageCount = 10;
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
        };
        for(let a = 0; a < channelCount; a++){
            state.channel.push(
                {
                    currentPage:0,
                    pages:(new Array(pageCount)).fill().map(() => (new Array(selectorCount)).fill().map(() => false) )
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

            //unify
                object.elements.checkbox_image.unify.set(state.unifyChannels);

            //channel
                for(let a = 0; a < channelCount; a++){
                    object.elements.glowbox_path['channelLED_'+a].off();
                }
                object.elements.glowbox_path['channelLED_'+state.currentChannel].on();

            //page
                const page = state.channel[state.currentChannel].currentPage;
                object.elements.sevenSegmentDisplay.page.enterCharacter(page);
                
            //step
                for(let a = 0; a < selectorCount; a++){
                    object.elements.button_image['selector_'+a].glow(false);
                }
                object.elements.button_image['selector_'+state.step].glow(true);
        }
        function refreshSelectors(){
            const page = state.channel[state.currentChannel].currentPage;
            for(let a = 0; a < selectorCount; a++){
                object.elements.button_image['selector_'+a].select(
                    state.channel[state.currentChannel].pages[page][a]
                );
            }
        }
        function refresh(){
            refreshLEDs();
            refreshSelectors();
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
            refreshLEDs();
        }
        function setChannel(channel){
            if(channel == undefined){ return state.currentChannel; }
            state.currentChannel = channel;
            refreshLEDs();
        }
        function step(){
            switch(state.direction){
                case 'l2r':
                    state.step++;
                    if(state.step > selectorCount-1){state.step = 0;}
                break;
                case 'r2l': 
                    state.step--;
                    if(state.step < 0){state.step = selectorCount-1;}
                break;
                case 'bounce':
                    if(state.step == 0){state.bounceDirection = 1;}
                    if(state.step == selectorCount-1){state.bounceDirection = -1;}
                    state.step += state.bounceDirection;
                break;
                case 'random': 
                    state.step = Math.floor(Math.random()*selectorCount);
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
            for(let a = 0; a < 8; a++){
                if( state.channel[a].pages[state.channel[a].currentPage][state.step] && state.currentlySoundingChannels[a] == 0 ){
                    if( state.outputMode == 'signal' ){
                        object.elements.connectionNode_signal['signal_out_'+a].set( true );
                    }else if( state.outputMode == 'voltage' ){
                        object.elements.connectionNode_voltage['voltage_out_'+a].set( 1 );
                    }
                    state.currentlySoundingChannels[a] = state.release;
                }
            }
            
            refreshLEDs();
        }

    //wiring
        //hid
            object.elements.button_image.signal.onpress = function(){
                setOutputConnectionNodes('signal');
            };
            object.elements.button_image.voltage.onpress = function(){
                setOutputConnectionNodes('voltage');
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
                if(state.channel[state.currentChannel].currentPage > channelCount-1){state.channel[state.currentChannel].currentPage = 0;}

                if(state.unifyChannels){
                    for(let a = 0; a < 8; a++){
                        state.channel[a].currentPage = state.channel[state.currentChannel].currentPage;
                    }
                }

                refresh();
            };
            object.elements.button_image.page_down.onpress = function(){
                state.channel[state.currentChannel].currentPage--;
                if(state.channel[state.currentChannel].currentPage < 0){state.channel[state.currentChannel].currentPage = channelCount-1;}

                if(state.unifyChannels){
                    for(let a = 0; a < 8; a++){
                        state.channel[a].currentPage = state.channel[state.currentChannel].currentPage;
                    }
                }

                refresh();
            };
            object.elements.checkbox_image.unify.onchange = function(bool){
                state.unifyChannels = bool;
            };
            object.elements.button_image.clear.onpress = function(){
                const page = state.channel[state.currentChannel].currentPage;
                for(let a = 0; a < selectorCount; a++){
                    state.channel[state.currentChannel].pages[page][a] = false;
                }
                if(state.unifyChannels){
                    for(let a = 0; a < channelCount; a++){
                        for(let b = 0; b < selectorCount; b++){
                            state.channel[a].pages[page][b] = false;
                        }
                    }
                }
                refresh();
            };
            object.elements.dial_discrete_image.releaseLength.onchange = function(value){
                state.release = value+1;
            };
            object.elements.button_image.step.onpress = function(){
                step();
            };
            object.elements.dial_discrete_image.direction.onchange = function(value){
                state.direction = ['l2r','r2l','bounce','random'][value];
            };
            
            //selectors
                for(let a = 0; a < selectorCount; a++){
                    object.elements.button_image['selector_'+a].onselect = function(){
                        const page = state.channel[state.currentChannel].currentPage;
                        state.channel[state.currentChannel].pages[page][a] = true;
                        refreshLEDs();
                    };
                    object.elements.button_image['selector_'+a].ondeselect = function(){
                        const page = state.channel[state.currentChannel].currentPage;
                        state.channel[state.currentChannel].pages[page][a] = false;
                        refreshLEDs();
                    };
                }

        //keycapture
            object.elements.image.backing.attachCallback('onkeydown', function(x,y,event){
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
                    case 186: object.elements.button_image.clear.press(); break;
                    case 13: step(); break;

                    case 81: 
                        state.channel[state.currentChannel].currentPage = 0;
                        if(state.unifyChannels){
                            state.channel.forEach( a => {a.currentPage = 0;} );
                        }
                        refreshLEDs();
                    break;
                    case 87: 
                        state.channel[state.currentChannel].currentPage = 1;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 1;} ); }
                        refreshLEDs();
                    break;
                    case 69: 
                        state.channel[state.currentChannel].currentPage = 2;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 2;} ); }
                        refreshLEDs();
                    break;
                    case 82: 
                        state.channel[state.currentChannel].currentPage = 3;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 3;} ); }
                        refreshLEDs();
                    break;
                    case 84: 
                        state.channel[state.currentChannel].currentPage = 4;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 4;} ); }
                        refreshLEDs();
                    break;
                    case 89: 
                        state.channel[state.currentChannel].currentPage = 5;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 5;} ); }
                        refreshLEDs();
                    break;
                    case 85: 
                        state.channel[state.currentChannel].currentPage = 6;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 6;} ); }
                        refreshLEDs();
                    break;
                    case 73: 
                        state.channel[state.currentChannel].currentPage = 7;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 7;} ); }
                        refreshLEDs();
                    break;
                    case 79: 
                        state.channel[state.currentChannel].currentPage = 8;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 8;} ); }
                        refreshLEDs();
                    break;
                    case 80: 
                        state.channel[state.currentChannel].currentPage = 9;
                        if(state.unifyChannels){ state.channel.forEach( a => {a.currentPage = 9;} ); }
                        refreshLEDs();
                    break;

                    case 65: object.elements.button_image['selector_0'].press();  break;
                    case 83: object.elements.button_image['selector_1'].press();  break;
                    case 68: object.elements.button_image['selector_2'].press();  break;
                    case 70: object.elements.button_image['selector_3'].press();  break;
                    case 71: object.elements.button_image['selector_4'].press();  break;
                    case 72: object.elements.button_image['selector_5'].press();  break;
                    case 74: object.elements.button_image['selector_6'].press();  break;
                    case 75: object.elements.button_image['selector_7'].press();  break;
                    case 90: object.elements.button_image['selector_8'].press();  break;
                    case 88: object.elements.button_image['selector_9'].press();  break;
                    case 67: object.elements.button_image['selector_10'].press(); break;
                    case 86: object.elements.button_image['selector_11'].press(); break;
                    case 66: object.elements.button_image['selector_12'].press(); break;
                    case 78: object.elements.button_image['selector_13'].press(); break;
                    case 77: object.elements.button_image['selector_14'].press(); break;
                    case 188: object.elements.button_image['selector_15'].press(); break;
                }
            });
            object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
                switch(event.keyCode){
                    case 186: object.elements.button_image.clear.release(); break;

                    case 65: object.elements.button_image['selector_0'].release();  break;
                    case 83: object.elements.button_image['selector_1'].release();  break;
                    case 68: object.elements.button_image['selector_2'].release();  break;
                    case 70: object.elements.button_image['selector_3'].release();  break;
                    case 71: object.elements.button_image['selector_4'].release();  break;
                    case 72: object.elements.button_image['selector_5'].release();  break;
                    case 74: object.elements.button_image['selector_6'].release();  break;
                    case 75: object.elements.button_image['selector_7'].release();  break;
                    case 90: object.elements.button_image['selector_8'].release();  break;
                    case 88: object.elements.button_image['selector_9'].release();  break;
                    case 67: object.elements.button_image['selector_10'].release(); break;
                    case 86: object.elements.button_image['selector_11'].release(); break;
                    case 66: object.elements.button_image['selector_12'].release(); break;
                    case 78: object.elements.button_image['selector_13'].release(); break;
                    case 77: object.elements.button_image['selector_14'].release(); break;
                    case 188: object.elements.button_image['selector_15'].release(); break;
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
            step:function(){
                step();
            },
            currentChannel:function(channel){
                if(channel == undefined){ return state.currentChannel; }
                if(channel > channelCount-1 || channel < 0){return;}
                state.currentChannel = channel;
                refreshLEDs();
            },
            currentPage:function(channel, page){
                if(channel == undefined){ return; }
                if(channel > channelCount-1 || channel < 0){return;}
                if(page == undefined){ return state.channel[channel].currentPage; }
                if(page > pageCount-1 || page < 0){return;}
                state.channel[channel].currentPage = page;
                refreshLEDs();
            },
            pageData:function(channel, page, data){
                if(channel == undefined){ return; }
                if(channel > channelCount-1 || channel < 0){return;}
                if(page == undefined){ return state.channel[channel].pages; }
                if(page > pageCount-1 || page < 0){return;}
                if(data == undefined){ return state.channel[channel].pages[page]; }
                state.channel[channel].pages[page] = data;
                refreshLEDs();
            },
            clear:function(){
                object.elements.button_image.clear.press();
                object.elements.button_image.clear.release();
            },
            unify:function(bool){
                if(bool == undefined){ return state.unifyChannels; }
                object.elements.checkbox_image.unify.set(bool);
            },
            release:function(value){
                if(value == undefined){ return state.release-1; }
                object.elements.dial_discrete_image.releaseLength.set(value);
            },
            direction:function(mode){
                if(mode == undefined){ return state.direction; }
                object.elements.dial_discrete_image.direction.set( ['l2r','r2l','bounce','random'].indexOf(mode) );
            },
        };

    //import/export
        object.exportData = function(){
            return JSON.parse(JSON.stringify(state));
        };
        object.importData = function(data){
            state.outputMode = data.outputMode;
            state.step = data.step;
            state.direction = data.direction;
            state.bounceDirection = data.bounceDirection;
            state.currentChannel = data.currentChannel;
            state.unifyChannels = data.unifyChannels;
            state.channel = data.channel;
            state.currentlySoundingChannels = data.currentlySoundingChannels;
            state.release = data.release;
            refresh();
        };

    //setup/tearDown
        object.oncreate = function(){
            setChannel(0);
        };

    return object;
};
this['mrd-16'].metadata = {
    name:'Mini Rhythm Designer - 16',
    category:'',
    helpURL:'/help/units/harbinger/mrd-16/'
};