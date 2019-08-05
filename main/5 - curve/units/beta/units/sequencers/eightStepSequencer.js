this.eightStepSequencer = function(x,y,a){
    var stepCount = 8;
    var imageStoreURL_localPrefix = imageStoreURL+'eightStepSequencer/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:1670, height:590 },
        design:{ width:27.5, height:9.5 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    
    var design = {
        name:'eightStepSequencer',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                                                    y:0                                                                      },
            { x:measurements.drawing.width -offset,                                   y:0                                                                      },
            { x:measurements.drawing.width -offset,                                   y:measurements.drawing.height*(5.5/measurements.design.height) -offset/2 },
            { x:measurements.drawing.width*(26/measurements.design.width)   -offset,  y:measurements.drawing.height*(5.5/measurements.design.height) -offset/2 },
            { x:measurements.drawing.width*(24.5/measurements.design.width) -offset,  y:measurements.drawing.height*(7/measurements.design.height)   -offset/2 },
            { x:measurements.drawing.width*(24.5/measurements.design.width) -offset,  y:measurements.drawing.height*(9.5/measurements.design.height) -offset   },
            { x:0,                                                                    y:measurements.drawing.height                                  -offset   },
        ],
        elements:[
            {collection:'dynamic', type:'connectionNode_data', name:'output', data:{ 
                x:0, y:30, width:5, height:15, angle:Math.PI, cableVersion:2,
                style:{ dim:style.connectionNode.data.dim, glow:style.connectionNode.data.glow, cable_dim:style.connectionCable.data.dim, cable_glow:style.connectionCable.data.glow }
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_step', data:{ 
                x:measurements.drawing.width-0.5 -offset, y:10, width:5, height:10, cableVersion:2,
                style:{ dim:style.connectionNode.signal.dim, glow:style.connectionNode.signal.glow, cable_dim:style.connectionCable.signal.dim, cable_glow:style.connectionCable.signal.glow },
                onchange:function(value){if(!value){return} object.elements.button_image.button_step.press(); object.elements.button_image.button_step.release(); } 
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_forwards', data:{ 
                x:measurements.drawing.width-0.5 -offset, y:22, width:5, height:10, cableVersion:2,
                style:{ dim:style.connectionNode.signal.dim, glow:style.connectionNode.signal.glow, cable_dim:style.connectionCable.signal.dim, cable_glow:style.connectionCable.signal.glow },
                onchange:function(value){if(!value){return} object.elements.slide_discrete_image.slide_direction.set(1); } 
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_backwards', data:{ 
                x:measurements.drawing.width-0.5 -offset, y:33, width:5, height:10, cableVersion:2,
                style:{ dim:style.connectionNode.signal.dim, glow:style.connectionNode.signal.glow, cable_dim:style.connectionCable.signal.dim, cable_glow:style.connectionCable.signal.glow },
                onchange:function(value){if(!value){return} object.elements.slide_discrete_image.slide_direction.set(0); } 
            }},

            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png' }
            },

            {collection:'control', type:'button_image', name:'button_step', data:{
                x:243.25, y:4.5, width:21, height:21, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'stepButton_up.png',
                backingURL__press:imageStoreURL_localPrefix+'stepButton_down.png',
                onpress:step,
            }},
            {collection:'control', type:'slide_discrete_image',name:'slide_direction',data:{
                x:244, y:37.125, width:9.25, height:19.4, handleHeight:1/2, resetValue:0.5, angle:-Math.PI/2, optionCount:2, value:1,
                handleURL:imageStoreURL_localPrefix+'directionSlideHandle.png',
                onchange:function(value){ state.direction = value*2 - 1; }
            }},
        ]
    };
    //dynamic design
    for(var a = 0; a < stepCount; a++){
        design.elements.push(
            {collection:'display', type:'glowbox_rectangle',name:'LED'+a,data:{
                x:12.5 +30*a, y:2.5, width:10, height:2.5, 
                style:{ glow:{r:232/255, g:160/255, b:111/255, a:1}, dim:{r:164/255, g:80/255, b:61/255, a:1} }
            }},
            {collection:'control', type:'dial_colourWithIndent_discrete',name:'dial_noteSelect_'+a,data:{
                x:17.5 +30*a, y:22.5, radius:(150/6)/2, startAngle:(2.9*Math.PI)/4, maxAngle:1.55*Math.PI, optionCount:12, arcDistance:1.2, resetValue:0.5,
                style:{ handle:style.primaryEight[a], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
                onchange:function(a){return function(value){state.stages[a].note=value}}(a),
            }},
            {collection:'control', type:'slide_discrete_image',name:'slide_octave_'+a,data:{
                x:5.6 +30*a, y:47.25, width:9.5, height:23.75, handleHeight:1/2.5, resetValue:0.5, angle:-Math.PI/2, optionCount:3, value:1,
                handleURL:imageStoreURL_localPrefix+'octaveSlideHandle_'+a+'.png',
                onchange:function(a){return function(value){state.stages[a].octave=value-1}}(a),
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_velocity_'+a,data:{
                x:17.5 +30*a, y:57.5, radius:(75/6)/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5,
                style:{ handle:style.primaryEight[a], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
                onchange:function(a){return function(value){state.stages[a].velocity=value}}(a),
            }},
            {collection:'control', type:'button_rectangle', name:'button_activate_'+a, data:{
                x:17.5 +30*a, y:68.5, width:16, height:16, angle:Math.PI/4,
                style:{ background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, background__hover__colour:{r:200/255,g:200/255,b:200/255,a:1} },
                onpress:function(a){return function(){state.requestedNextPosition=a;step();}}(a),
            }},
        );

        design.elements.unshift(
            {collection:'dynamic', type:'connectionNode_signal', name:'noteOctaveChange_back_'+a, data:{ 
                x:7 +30*a, y:0, width:5, height:10, angle:Math.PI*1.5, cableVersion:2,
                style:{ dim:style.connectionNode.signal.dim, glow:style.connectionNode.signal.glow, cable_dim:style.connectionCable.signal.dim, cable_glow:style.connectionCable.signal.glow },
                onchange:function(a){return function(value){
                    if(!value){return} 

                    var newNote = state.stages[a].note - 1;
                    var newOctave = state.stages[a].octave;
                    if(newNote < 0){ newNote = 11; newOctave--; }
                    if(newOctave < -1){ return; }

                    object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+a].set(newNote);
                    object.elements.slide_discrete_image['slide_octave_'+a].set(newOctave+1);
                } }(a),
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'noteOctaveChange_fore_'+a, data:{ 
                x:18 +30*a, y:0, width:5, height:10, angle:Math.PI*1.5, cableVersion:2,
                style:{ dim:style.connectionNode.signal.dim, glow:style.connectionNode.signal.glow, cable_dim:style.connectionCable.signal.dim, cable_glow:style.connectionCable.signal.glow },
                onchange:function(a){return function(value){
                    if(!value){return}

                    var newNote = state.stages[a].note + 1;
                    var newOctave = state.stages[a].octave;
                    if(newNote > 11){ newNote = 0; newOctave++; }
                    if(newOctave > 1){ return; }

                    object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+a].set(newNote);
                    object.elements.slide_discrete_image['slide_octave_'+a].set(newOctave+1);
                } }(a),
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'activate_'+a, data:{ 
                x:17 +30*a, y:measurements.drawing.height -offset, width:5, height:10, angle:Math.PI*0.5, cableVersion:2,
                style:{ dim:style.connectionNode.signal.dim, glow:style.connectionNode.signal.glow, cable_dim:style.connectionCable.signal.dim, cable_glow:style.connectionCable.signal.glow },
                onchange:function(a){ return function(value){ if(!value){return} object.elements.button_rectangle['button_activate_'+a].press(); object.elements.button_rectangle['button_activate_'+a].release(); } }(a),
            }},
            {collection:'dynamic', type:'connectionNode_voltage', name:'velocity_'+a, data:{ 
                x:28 +30*a, y:measurements.drawing.height -offset, width:5, height:10, angle:Math.PI*0.5, cableVersion:2,
                style:{ dim:style.connectionNode.voltage.dim, glow:style.connectionNode.voltage.glow, cable_dim:style.connectionCable.voltage.dim, cable_glow:style.connectionCable.voltage.glow },
                onchange:function(a){ return function(value){ object.elements.dial_colourWithIndent_continuous['dial_velocity_'+a].set(value) }}(a),
            }}
        );
    }

    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //import/export
        object.exportData = function(){
            return {
                stages:(new Array(stepCount).fill(0)).map( (item,index) => {
                    return {
                        note: object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+index].get(),
                        octave: object.elements.slide_discrete_image['slide_octave_'+index].get(),
                        velocity: object.elements.dial_colourWithIndent_continuous['dial_velocity_'+index].get(),
                    }
                }),
                direction: object.elements.slide_discrete_image.slide_direction.get(),
            };
        };
        object.importData = function(data){
            if(data == undefined){return;}

            object.elements.slide_discrete_image.slide_direction.set(data.direction);

            data.stages.forEach( (stage,index) => {
                object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+index].set(stage.note);
                object.elements.slide_discrete_image['slide_octave_'+index].set(stage.octave);
                object.elements.dial_colourWithIndent_continuous['dial_velocity_'+index].set(stage.velocity);
            });
        };

    //internal circuitry
        var state = {
            direction:1,
            previousPosition:-1,
            position:-1,
            requestedNextPosition:-1,
            stages:[
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
            ],
            previousMidiNumber:-1,
        }

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
                if(state.position > stepCount-1){state.position = 0;}else if(state.position < 0){state.position = stepCount-1;}

            //stop previous note (unless there wasn't one) and send the new one
                var midiNumber = stageToMidiNoteNumber(state.stages[state.position]);
                if(state.previousMidiNumber != -1){object.elements.connectionNode_data.output.send('midinumber',{num:state.previousMidiNumber, velocity:0});}
                object.elements.connectionNode_data.output.send('midinumber',{num:midiNumber, velocity:state.stages[state.position].velocity});
                state.previousMidiNumber = midiNumber;

            //light up the appropriate LED
                if(state.previousPosition != -1){ object.elements.glowbox_rectangle['LED'+state.previousPosition].off(); }
                object.elements.glowbox_rectangle['LED'+state.position].on(); 
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

    return object;
};



this.eightStepSequencer.metadata = {
    name:'Eight Step Sequencer',
    category:'sequencers',
    helpURL:'/help/units/beta/eightStepSequencer/'
};