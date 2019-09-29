this.eightStepSequencer = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'eightStepSequencer/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:1670, height:590 },
                    design: { width:27.5, height:9.5 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.LED = {
                    glow:{r:232/255, g:160/255, b:111/255, a:1},
                    dim:{r:164/255, g:80/255, b:61/255, a:1},
                };
                this.dial = {
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                };
                this.button = {
                    background__up__colour:{r:175/255,g:175/255,b:175/255,a:1},
                    background__hover__colour:{r:200/255,g:200/255,b:200/255,a:1},
                };
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'eightStepSequencer',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                                           y:0                                                           },
                { x:unitStyle.drawingValue.width -unitStyle.offset,              y:0                                                           },
                { x:unitStyle.drawingValue.width -unitStyle.offset,              y:(unitStyle.drawingValue.height -unitStyle.offset)*(5.5/9.5) },
                { x:(unitStyle.drawingValue.width-unitStyle.offset)*(26/27.5),   y:(unitStyle.drawingValue.height -unitStyle.offset)*(5.5/9.5) },
                { x:(unitStyle.drawingValue.width-unitStyle.offset)*(24.5/27.5), y:(unitStyle.drawingValue.height -unitStyle.offset)*(7/9.5)   },
                { x:(unitStyle.drawingValue.width-unitStyle.offset)*(24.5/27.5), y:unitStyle.drawingValue.height -unitStyle.offset             },
                { x:0,                                                           y:unitStyle.drawingValue.height -unitStyle.offset             },
            ],
            elements:
                (new Array(8).fill(0)).flatMap((value,index) => { 
                    return [
                        {collection:'dynamic', type:'connectionNode_signal', name:'noteOctaveChange_back_'+index, data:{ 
                            x:7 +30*index, y:0, width:5, height:10, angle:Math.PI*1.5, cableVersion:2, style:style.connectionNode.signal,
                        }},
                        {collection:'dynamic', type:'connectionNode_signal', name:'noteOctaveChange_fore_'+index, data:{ 
                            x:18 +30*index, y:0, width:5, height:10, angle:Math.PI*1.5, cableVersion:2, style:style.connectionNode.signal,
                        }},
                        {collection:'dynamic', type:'connectionNode_signal', name:'activate_'+index, data:{ 
                            x:17 +30*index, y:unitStyle.drawingValue.height -unitStyle.offset, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.signal,
                        }},
                        {collection:'dynamic', type:'connectionNode_voltage', name:'velocity_'+index, data:{ 
                            x:28 +30*index, y:unitStyle.drawingValue.height -unitStyle.offset, width:5, height:10, angle:Math.PI*0.5, cableVersion:2, style:style.connectionNode.voltage,
                        }}
                    ]; 
                }).concat(
                [
                    {collection:'dynamic', type:'connectionNode_data', name:'output', data:{ 
                        x:0, y:30, width:5, height:15, angle:Math.PI, cableVersion:2, style:style.connectionNode.data,
                    }},
                    {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_step', data:{ 
                        x:unitStyle.drawingValue.width-0.5 -unitStyle.offset, y:10, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
                    }},
                    {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_forwards', data:{ 
                        x:unitStyle.drawingValue.width-0.5 -unitStyle.offset, y:22, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
                    }},
                    {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_backwards', data:{ 
                        x:unitStyle.drawingValue.width-0.5 -unitStyle.offset, y:33, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
                    }},

                    {collection:'basic', type:'image', name:'backing', 
                        data:{ x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
                    },

                    {collection:'control', type:'button_image', name:'button_step', data:{
                        x:243.25, y:4.5, width:21, height:21, hoverable:false, 
                        backingURL__up:unitStyle.imageStoreURL_localPrefix+'stepButton_up.png',
                        backingURL__press:unitStyle.imageStoreURL_localPrefix+'stepButton_down.png',
                    }},
                    {collection:'control', type:'slide_discrete_image',name:'slide_direction',data:{
                        x:244, y:37.125, width:9.25, height:19.4, handleHeight:1/2, resetValue:0.5, angle:-Math.PI/2, optionCount:2, value:1,
                        handleURL:unitStyle.imageStoreURL_localPrefix+'directionSlideHandle.png',
                    }},
                ]).concat(
                    (new Array(8).fill(0)).flatMap((value,index) => { 
                        return [
                            {collection:'display', type:'glowbox_rectangle',name:'LED'+index,data:{
                                x:12.5 +30*index, y:2.5, width:10, height:2.5, style:unitStyle.LED
                            }},
                            {collection:'control', type:'dial_colourWithIndent_discrete',name:'dial_noteSelect_'+index,data:{
                                x:17.5 +30*index, y:22.5, radius:(150/6)/2, startAngle:(2.9*Math.PI)/4, maxAngle:1.55*Math.PI, optionCount:12, arcDistance:1.2, resetValue:0.5,
                                style:{ handle:style.primaryEight[index], slot:unitStyle.dial.slot, needle:unitStyle.dial.needle },
                            }},
                            {collection:'control', type:'slide_discrete_image',name:'slide_octave_'+index,data:{
                                x:5.6 +30*index, y:47.25, width:9.5, height:23.75, handleHeight:1/2.5, resetValue:0.5, angle:-Math.PI/2, optionCount:3, value:1,
                                handleURL:unitStyle.imageStoreURL_localPrefix+'octaveSlideHandle_'+index+'.png',
                            }},
                            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_velocity_'+index,data:{
                                x:17.5 +30*index, y:57.5, radius:(75/6)/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5,
                                style:{ handle:style.primaryEight[index], slot:unitStyle.dial.slot, needle:unitStyle.dial.needle },
                            }},
                            {collection:'control', type:'button_rectangle', name:'button_activate_'+index, data:{
                                x:17.5 +30*index, y:68.5, width:16, height:16, angle:Math.PI/4, style:unitStyle.button,
                            }},
                        ]; 
                    })
                )
        });

    //circuitry
        var state = {
            stepCount:8,
            direction:1,
            previousPosition:-1,
            position:-1,
            requestedNextPosition:-1,
            stages:new Array(8).fill(undefined).map(() => ({note:0, octave:0, velocity:0})),
            previousMidiNumber:-1,
        };
        function stageToMidiNoteNumber(stage){
            var octaveOffset = 4;
            var note = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][stage.note];
            var octave = stage.octave+octaveOffset;
            return _canvas_.library.audio.name2num(octave+note);
        }
        function step(){
            //figure out what stage to step to next
                state.previousPosition = state.position;
                state.position = state.requestedNextPosition != -1 ? state.requestedNextPosition : state.position+state.direction;
                state.requestedNextPosition = -1;
                if(state.position > state.stepCount-1){state.position = 0;}else if(state.position < 0){state.position = stepCount-1;}

            //stop previous note (unless there wasn't one) and send the new one
                var midiNumber = stageToMidiNoteNumber(state.stages[state.position]);
                if(state.previousMidiNumber != -1){object.elements.connectionNode_data.output.send('midinumber',{num:state.previousMidiNumber, velocity:0});}
                object.elements.connectionNode_data.output.send('midinumber',{num:midiNumber, velocity:state.stages[state.position].velocity});
                state.previousMidiNumber = midiNumber;

            //light up the appropriate LED
                if(state.previousPosition != -1){ object.elements.glowbox_rectangle['LED'+state.previousPosition].off(); }
                object.elements.glowbox_rectangle['LED'+state.position].on(); 
        }

    //wiring
        //hid
            object.elements.button_image.button_step.onpress = step;
            object.elements.slide_discrete_image.slide_direction.onchange = function(value){ state.direction = value*2 - 1; };
            for(var index = 0; index < 8; index++){
                object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+index].onchange = function(index){return function(value){state.stages[index].note=value}}(index);
                object.elements.slide_discrete_image['slide_octave_'+index].onchange = function(index){return function(value){state.stages[index].octave=value-1}}(index);
                object.elements.dial_colourWithIndent_continuous['dial_velocity_'+index].onchange = function(index){return function(value){state.stages[index].velocity=value}}(index);
                object.elements.button_rectangle['button_activate_'+index].onpress = function(index){return function(){state.requestedNextPosition=index;step();}}(index);
            }
        //io
            object.io.signal.directionChange_step.onchange = function(value){ if(!value){return} object.elements.button_image.button_step.press(); object.elements.button_image.button_step.release(); } 
            object.io.signal.directionChange_forwards.onchange = function(value){ if(!value){return} object.elements.slide_discrete_image.slide_direction.set(1); } 
            object.io.signal.directionChange_backwards.onchange = function(value){ if(!value){return} object.elements.slide_discrete_image.slide_direction.set(0); } 
            for(var index = 0; index < 8; index++){
                object.io.signal['noteOctaveChange_back_'+index].onchange = function(index){return function(value){
                    if(!value){return} 

                    var newNote = state.stages[index].note - 1;
                    var newOctave = state.stages[index].octave;
                    if(newNote < 0){ newNote = 11; newOctave--; }
                    if(newOctave < -1){ return; }

                    object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+index].set(newNote);
                    object.elements.slide_discrete_image['slide_octave_'+index].set(newOctave+1);
                } }(index);
                object.io.signal['noteOctaveChange_fore_'+index].onchange = function(index){return function(value){
                    if(!value){return}

                    var newNote = state.stages[index].note + 1;
                    var newOctave = state.stages[index].octave;
                    if(newNote > 11){ newNote = 0; newOctave++; }
                    if(newOctave > 1){ return; }

                    object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+index].set(newNote);
                    object.elements.slide_discrete_image['slide_octave_'+index].set(newOctave+1);
                } }(index);
                object.io.signal['activate_'+index].onchange = function(index){ return function(value){ 
                    if(!value){return} 
                    object.elements.button_rectangle['button_activate_'+index].press(); 
                    object.elements.button_rectangle['button_activate_'+index].release(); 
                } }(index);
                object.io.voltage['velocity_'+index].onchange = function(index){ return function(value){ 
                    object.elements.dial_colourWithIndent_continuous['dial_velocity_'+index].set(value);
                }}(index);
            }

    //interface
        object.i = {
            step:function(){ object.elements.button_image.button_step.press(); },
            direction:function(value){ 
                if(value == undefined){ return object.elements.slide_discrete_image.slide_direction.get(); }
                object.elements.slide_discrete_image.slide_direction.set(value);
            },
            noteDial:function(number,value){ 
                if(number == undefined){return null;}
                if(value == undefined){ object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+number].get(); }
                object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+number].set(value);
            },
            octaveSlider:function(number,value){ 
                if(number == undefined){return null;}
                if(value == undefined){ object.elements.slide_discrete_image['slide_octave_'+number].get(); }
                object.elements.slide_discrete_image['slide_octave_'+number].set(value);
            },
            velocityDial:function(number,value){ 
                if(number == undefined){return null;}
                if(value == undefined){ object.elements.dial_colourWithIndent_continuous['dial_velocity_'+number].get(); }
                object.elements.dial_colourWithIndent_continuous['dial_velocity_'+number].set(value);
            },
            activateStep:function(number){ object.elements.button_rectangle['button_activate_'+number].press(); },
            getStages:function(){return state.stages;},
        };

    //import/export
        object.exportData = function(){
            return {
                stages:Object.assign([],state.stages),
                direction: object.elements.slide_discrete_image.slide_direction.get(),
                currentStage: state.position,
            };
        };
        object.importData = function(data){
            object.elements.slide_discrete_image.slide_direction.set(data.direction);

            data.stages.forEach( (stage,index) => {
                object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+index].set(stage.note);
                object.elements.slide_discrete_image['slide_octave_'+index].set(stage.octave+1);
                object.elements.dial_colourWithIndent_continuous['dial_velocity_'+index].set(stage.velocity);
            });

            state.position = data.currentStage;
        };

    return object;
};
this.eightStepSequencer.metadata = {
    name:'Eight Step Sequencer',
    category:'sequencers',
    helpURL:'/help/units/beta/eightStepSequencer/'
};