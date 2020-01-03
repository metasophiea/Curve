this['mrd-16'] = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'MRD-16/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:2500, height:520 },
                    design: { width:25, height:5.2 },
                };

                this.offset = {x:2.5,y:1};
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
                            x:5 + index*20, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                        }},
                        {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_out_'+index, data:{ 
                            x:5 + index*20, y:5, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                        }},
                    ];
                }).concat(
                    [
                        {collection:'dynamic', type:'connectionNode_signal', name:'pulseIn', data:{ 
                            x:unitStyle.drawingValue.width - unitStyle.offset.x, y:30, width:5, height:10, angle:0, cableVersion:2, style:style.connectionNode.signal,
                        }},

                        {collection:'basic', type:'image', name:'backing', 
                            data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                        },

                        {collection:'control', type:'checkbox_image', name:'signal', data:{
                            x:5, y:7.5, width:6, height:15,
                            checkURL:unitStyle.imageStoreURL_localPrefix+'button_signal_on.png',
                            uncheckURL:unitStyle.imageStoreURL_localPrefix+'button_signal_off.png',
                        }},
                        {collection:'control', type:'checkbox_image', name:'voltage', data:{
                            x:14, y:7.5, width:6, height:15,
                            checkURL:unitStyle.imageStoreURL_localPrefix+'button_voltage_on.png',
                            uncheckURL:unitStyle.imageStoreURL_localPrefix+'button_voltage_off.png',
                        }},
                        {collection:'control', type:'button_image', name:'channel_left', data:{
                            x:23, y:7.5, width:6, height:15, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_row_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_row_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'channel_right', data:{
                            x:38, y:22.5, width:6, height:15, angle:Math.PI, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_row_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_row_down.png',
                        }},
                        {collection:'control', type:'checkbox_image', name:'unify', data:{
                            x:41, y:7.5, width:6, height:15,
                            checkURL:unitStyle.imageStoreURL_localPrefix+'button_unify_on.png',
                            uncheckURL:unitStyle.imageStoreURL_localPrefix+'button_unify_off.png',
                        }},
                        {collection:'control', type:'button_image', name:'page_up', data:{
                            x:50, y:7.5, width:15, height:6, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_page_up_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_page_up_down.png',
                        }},
                        {collection:'control', type:'button_image', name:'page_down', data:{
                            x:50, y:16.5, width:15, height:6, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_page_down_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_page_down_down.png',
                        }},
                        {collection:'display', type:'sevenSegmentDisplay', name:'page', data:{
                            x:68.5, y:8, width:7, height:14, static:true, resolution:5,
                        }},
                        {collection:'control', type:'button_image', name:'clear', data:{
                            x:79, y:7.5, width:6, height:15, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_page_clear_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_page_clear_down.png',
                        }},
                        {collection:'control', type:'dial_discrete_image', name:'releaseLength', data:{
                            x:95.5, y:15, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:4, 
                            handleURL:unitStyle.imageStoreURL_localPrefix+'dial.png',
                        }},
                        {collection:'control', type:'button_image', name:'step', data:{
                            x:106, y:7.5, width:15, height:15, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_step_up.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_step_down.png',
                        }},
                        {collection:'control', type:'dial_discrete_image', name:'direction', data:{
                            x:131.75, y:15, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, optionCount:4, 
                            handleURL:unitStyle.imageStoreURL_localPrefix+'dial.png',
                        }},
                    ]
                ).concat(
                    (new Array(16)).fill().flatMap((item,index) => {
                        return [
                            {collection:'display', type:'glowbox_rectangle', name:'selectorStepLED_'+index, data:{
                                x:7.5 + index*15, y:45, width:5, height:2.5, style:unitStyle.selectorStepLEDstyle,
                            }},
                        ];
                    })
                ).concat(
                    (new Array(8)).fill().flatMap((item,index) => {
                        return [
                            {collection:'display', type:'glowbox_path', name:'channelLED_'+index, data:{
                                x:5 + index*20, y:3.5, points:[{x:0,y:0},{x:10,y:0}], capType:'round', style:unitStyle.channelLEDstyle
                            }},
                        ]
                    })
                ).concat(
                    (new Array(4)).fill().flatMap((item,index) => {
                        return [
                            {collection:'control', type:'button_image', name:'selector_'+index, data:{
                                x:5 + index*15, y:25, width:10, height:20, hoverable:false,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_1_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_1_down.png',
                            }},
                            {collection:'display', type:'glowbox_circle', name:'selectorLED_'+index, data:{
                                x:10 + index*15, y:30, radius:2, style:unitStyle.selectorLEDstyle,
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+4), data:{
                                x:5 + (index+4)*15, y:25, width:10, height:20, hoverable:false,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_2_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_2_down.png',
                            }},
                            {collection:'display', type:'glowbox_circle', name:'selectorLED_'+(index+4), data:{
                                x:10 + (index+4)*15, y:30, radius:2, style:unitStyle.selectorLEDstyle,
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+8), data:{
                                x:5 + (index+8)*15, y:25, width:10, height:20, hoverable:false,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_3_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_3_down.png',
                            }},
                            {collection:'display', type:'glowbox_circle', name:'selectorLED_'+(index+8), data:{
                                x:10 + (index+8)*15, y:30, radius:2, style:unitStyle.selectorLEDstyle,
                            }},
                            {collection:'control', type:'button_image', name:'selector_'+(index+12), data:{
                                x:5 + (index+12)*15, y:25, width:10, height:20, hoverable:false,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_4_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_4_down.png',
                            }},
                            {collection:'display', type:'glowbox_circle', name:'selectorLED_'+(index+12), data:{
                                x:10 + (index+12)*15, y:30, radius:2, style:unitStyle.selectorLEDstyle,
                            }},
                        ];
                    })
                )
        });

    //circuitry
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
        for(let a = 0; a < 8; a++){
            state.channel.push(
                {
                    currentPage:0,
                    pages:(new Array(10)).fill().map(() => (new Array(16)).fill().map(() => false) )
                }
            );
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
                object.elements.checkbox_image.signal.set(true);
                object.elements.checkbox_image.voltage.set(false);
                for(let a = 0; a < 8; a++){
                    object.elements.connectionNode_voltage['voltage_out_'+a].disconnect();
                    object.elements.connectionNode_voltage['voltage_out_'+a].set(0);
                    
                    for(let b = 0; b < detail; b++){
                        setTimeout(()=>{
                            object.elements.connectionNode_signal['signal_out_'+a].y(five2zero[b]);
                            object.elements.connectionNode_voltage['voltage_out_'+a].y(zero2five[b]);
                        },
                        (duration/detail)*b);
                    }
                    
                }
            }else if(mode == 'voltage'){
                object.elements.checkbox_image.signal.set(false);
                object.elements.checkbox_image.voltage.set(true);
                for(let a = 0; a < 8; a++){
                    object.elements.connectionNode_signal['signal_out_'+a].disconnect();
                    object.elements.connectionNode_signal['signal_out_'+a].set(false);
                    for(let b = 0; b < detail; b++){
                        setTimeout(()=>{
                            object.elements.connectionNode_signal['signal_out_'+a].y(zero2five[b]);
                            object.elements.connectionNode_voltage['voltage_out_'+a].y(five2zero[b]);
                        },
                        (duration/detail)*b);
                    }
                }
            }
        }
        function refreshLEDS(){
            //channel
                for(let a = 0; a < 8; a++){
                    object.elements.glowbox_path['channelLED_'+a].off();
                }
                object.elements.glowbox_path['channelLED_'+state.currentChannel].on();

            //page
                const page = state.channel[state.currentChannel].currentPage;
                object.elements.sevenSegmentDisplay.page.enterCharacter(page);
                
            //selector
                for(let a = 0; a < 16; a++){
                    if( state.channel[state.currentChannel].pages[page][a] ){
                        object.elements.glowbox_circle['selectorLED_'+a].on();
                    }else{
                        object.elements.glowbox_circle['selectorLED_'+a].off();
                    }
                }

            //step
                for(let a = 0; a < 16; a++){
                    object.elements.glowbox_rectangle['selectorStepLED_'+a].off();
                }
                object.elements.glowbox_rectangle['selectorStepLED_'+state.step].on();
        }
        function setChannel(channel){
            if(channel == undefined){ return state.currentChannel; }
            state.currentChannel = channel;
            refreshLEDS();
        }
        function step(){
            switch(state.direction){
                case 'l2r':
                    state.step++;
                    if(state.step > 15){state.step = 0;}
                break;
                case 'r2l': 
                    state.step--;
                    if(state.step < 0){state.step = 15;}
                break;
                case 'bounce':
                    if(state.step == 0){state.bounceDirection = 1;}
                    if(state.step == 15){state.bounceDirection = -1;}
                    state.step += state.bounceDirection;
                break;
                case 'random': 
                    state.step = Math.floor(Math.random()*16);
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
            
            refreshLEDS();
        }

    //wiring
        //hid
            object.elements.checkbox_image.signal.onchange = function(state){
                if(state){
                    setOutputConnectionNodes('signal');
                }
            };
            object.elements.checkbox_image.voltage.onchange = function(state){
                if(state){
                    setOutputConnectionNodes('voltage');
                }
            };
            object.elements.button_image.channel_left.onpress = function(){
                state.currentChannel--;
                if(state.currentChannel < 0){state.currentChannel = 7;}
                refreshLEDS();
            };
            object.elements.button_image.channel_right.onpress = function(){
                state.currentChannel++;
                if(state.currentChannel > 7){state.currentChannel = 0;}
                refreshLEDS();
            };
            for(let a = 0; a < 16; a++){
                object.elements.button_image['selector_'+a].onpress = function(){
                    const page = state.channel[state.currentChannel].currentPage;
                    state.channel[state.currentChannel].pages[page][a] = !state.channel[state.currentChannel].pages[page][a];
                    refreshLEDS();
                };
            }
            object.elements.button_image.page_up.onpress = function(){
                state.channel[state.currentChannel].currentPage++;
                if(state.channel[state.currentChannel].currentPage > 7){state.channel[state.currentChannel].currentPage = 0;}

                if(state.unifyChannels){
                    for(let a = 0; a < 8; a++){
                        state.channel[a].currentPage = state.channel[state.currentChannel].currentPage;
                    }
                }

                refreshLEDS();
            };
            object.elements.button_image.page_down.onpress = function(){
                state.channel[state.currentChannel].currentPage--;
                if(state.channel[state.currentChannel].currentPage < 0){state.channel[state.currentChannel].currentPage = 7;}

                if(state.unifyChannels){
                    for(let a = 0; a < 8; a++){
                        state.channel[a].currentPage = state.channel[state.currentChannel].currentPage;
                    }
                }

                refreshLEDS();
            };
            object.elements.checkbox_image.unify.onchange = function(bool){
                state.unifyChannels = bool;
            };
            object.elements.button_image.clear.onpress = function(){
                const page = state.channel[state.currentChannel].currentPage;
                for(let a = 0; a < 16; a++){
                    state.channel[state.currentChannel].pages[page][a] = false;
                }
                if(state.unifyChannels){
                    for(let a = 0; a < 8; a++){
                        for(let b = 0; b < 16; b++){
                            state.channel[a].pages[page][b] = false;
                        }
                    }
                }
                refreshLEDS();
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

                    case '.': 
                        if(state.outputMode == 'signal'){ setOutputConnectionNodes('voltage'); }
                        else if(state.outputMode == 'voltage'){ setOutputConnectionNodes('signal'); }
                    break;
                    case '/': object.elements.checkbox_image.unify.toggle(); break;
                    case ';': object.elements.button_image.clear.press(); break;
                    case 'Enter': step(); break;

                    case 'q': state.channel[state.currentChannel].currentPage = 0; refreshLEDS(); break;
                    case 'w': state.channel[state.currentChannel].currentPage = 1; refreshLEDS(); break;
                    case 'e': state.channel[state.currentChannel].currentPage = 2; refreshLEDS(); break;
                    case 'r': state.channel[state.currentChannel].currentPage = 3; refreshLEDS(); break;
                    case 't': state.channel[state.currentChannel].currentPage = 4; refreshLEDS(); break;
                    case 'y': state.channel[state.currentChannel].currentPage = 5; refreshLEDS(); break;
                    case 'u': state.channel[state.currentChannel].currentPage = 6; refreshLEDS(); break;
                    case 'i': state.channel[state.currentChannel].currentPage = 7; refreshLEDS(); break;
                    case 'o': state.channel[state.currentChannel].currentPage = 8; refreshLEDS(); break;
                    case 'p': state.channel[state.currentChannel].currentPage = 9; refreshLEDS(); break;

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
                }
            });
            object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
                switch(event.key){
                    case ';': object.elements.button_image.clear.release(); break;

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
                if(channel > 7 || channel < 0){return;}
                state.currentChannel = channel;
                refreshLEDS();
            },
            currentPage:function(channel, page){
                if(channel == undefined){ return; }
                if(page == undefined){ return state.channel[channel].currentPage; }
                if(page > 9 || page < 0){return;}
                state.channel[channel].currentPage = page;
                refreshLEDS();
            },
            pageData:function(channel, page, data){
                if(channel == undefined){ return; }
                if(page == undefined){ return state.channel[channel].pages; }
                if(data == undefined){ return state.channel[channel].pages[page]; }
                state.channel[channel].pages[page] = data;
                refreshLEDS();
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
            return JSON.stringify(state);
        };
        object.importData = function(data){
            data = JSON.parse(data);
            state.outputMode = data.outputMode;
            state.step = data.step;
            state.direction = data.direction;
            state.bounceDirection = data.bounceDirection;
            state.currentChannel = data.currentChannel;
            state.unifyChannels = data.unifyChannels;
            state.channel = data.channel;
            state.currentlySoundingChannels = data.currentlySoundingChannels;
            state.release = data.release;
            refreshLEDS();
        };

    //setup/tearDown
        object.oncreate = function(){
            object.elements.checkbox_image.signal.set(true);
            setChannel(0);
        };

    return object;
};
this['mrd-16'].metadata = {
    name:'MRD-16',
    category:'sequencers',
    helpURL:'/help/units/harbinger/mrd-16/'
};