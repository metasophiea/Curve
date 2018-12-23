this.reverbUnit = function(x,y){
    var state = {
        reverbTypeSelected: 0,
        availableTypes: [],
    };
    var style = {
        background: {fill:'rgba(200,200,200,1)'},
        h1:{fill:'rgba(0,0,0,1)', font:'4pt Courier New'},
        h2:{fill:'rgba(0,0,0,1)', font:'3pt Courier New'},

        dial:{
            handle:{fill:'rgba(220,220,220,1)'},
            slot:{fill:'rgba(50,50,50,1)'},
            needle:{fill:'rgba(250,150,150,1)'},
        },
        button:{
            background__up__fill:'rgba(175,175,175,1)', 
            background__hover__fill:'rgba(220,220,220,1)', 
            background__hover_press__fill:'rgba(150,150,150,1)',
        }
    };
    var design = {
        name: 'reverbUnit',
        collection: 'alpha',
        x: x, y: y,
        space:[{x:0,y:10}, {x:51.25,y:0}, {x:102.5,y:10}, {x:102.5,y:40}, {x:51.25,y:50}, {x:0,y:40}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:10}, {x:51.25,y:0}, {x:102.5,y:10}, {x:102.5,y:40}, {x:51.25,y:50}, {x:0,y:40}], style:style.background }},

            {type:'connectionNode_audio', name:'audioIn', data:{ x: 102.5, y: 16, width: 10, height: 20 }},
            {type:'connectionNode_audio', name:'audioOut', data:{ x: -10, y: 16, width: 10, height: 20, isAudioOutput:true }},
            
            {type:'text', name:'outGain_0',   data:{x:8,    y:38, text:'0', style:style.h2}},
            {type:'text', name:'outGain_1/2', data:{x:16.5, y:11, text:'1/2', style:style.h2}},
            {type:'text', name:'outGain_1',   data:{x:29,   y:38, text:'1', style:style.h2}},
            {type:'dial_continuous',name:'outGain_dial',data:{
                x: 20, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, 
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},

            {type:'text', name:'wetdry_1/2', data:{x:66.5, y:39, text:'wet', style:style.h2}},
            {type:'text', name:'wetdry_1',   data:{x:91.5, y:39, text:'dry', style:style.h2}},
            {type:'dial_continuous',name:'wetdry_dial',data:{
                x: 82.5, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},

            {type:'button_rect',name:'raiseByOne',data:{
                x:51, y:6, width: 10.25, height: 5, style:style.button, 
                onpress: function(){ incReverbType(); },
            }},
            {type:'button_rect',name:'raiseByTen',data:{
                x:38.75, y:6, width: 10.25, height: 5, style:style.button, 
                onpress: function(){ inc10ReverbType(); },
            }},
            {type:'button_rect',name:'lowerByOne',data:{
                x:51, y:39, width: 10.25, height: 5, style:style.button, 
                onpress: function(){ decReverbType(); },
            }},
            {type:'button_rect',name:'lowerByTen',data:{
                x:38.75, y:39, width: 10.25, height: 5, style:style.button, 
                onpress: function(){ dec10ReverbType(); },
            }},

            {type:'sevenSegmentDisplay_static',name:'tens',data:{
                x:50, y:12.5, width:12.5, height:25,
            }},
            {type:'sevenSegmentDisplay_static',name:'ones',data:{
                x:37.5, y:12.5, width:12.5, height:25,
            }},
        ]
    };

    //main object
        var object = interfaceUnit.builder(this.reverbUnit,design);

    //import/export
        object.importData = function(data){
            state.reverbTypeSelected = data.selectedType;
            design.dial_continuous.wetdry.set(data.wetdry);
            design.dial_continuous.outGain.set(data.outGain);
        };
        object.exportData = function(){
            return {
                selectedType: state.reverbTypeSelected,
                wetdry: object.elements.dial_continuous.wetdry.get(),
                outGain: object.elements.dial_continuous.outGain.get(),
            };
        };

    //circuitry
        //reverb
            object.reverbCircuit = new interface.circuit.alpha.reverbUnit(workspace.library.audio.context);
            object.elements.connectionNode_audio.audioIn.out().connect( object.reverbCircuit.in() );
            object.reverbCircuit.out().connect( object.elements.connectionNode_audio.audioOut.in() );
            object.reverbCircuit.getTypes( function(a){state.availableTypes = a;} );
            
        //internal functions
            function setReadout(num){
                num = ("0" + num).slice(-2);

                object.elements.sevenSegmentDisplay_static.ones.enterCharacter(num[0]);
                object.elements.sevenSegmentDisplay_static.tens.enterCharacter(num[1]);
            }
            function setReverbType(a){
                if( state.availableTypes.length == 0 ){ console.log('broken or not yet ready'); return;}

                if( a >= state.availableTypes.length ){a = state.availableTypes.length-1;}
                else if( a < 0 ){a = 0;}
    
                state.reverbTypeSelected = a;
                object.reverbCircuit.type( state.availableTypes[a], function(){setReadout(state.reverbTypeSelected);});    
            }
            function incReverbType(){ setReverbType(state.reverbTypeSelected+1); }
            function decReverbType(){ setReverbType(state.reverbTypeSelected-1); }
            function inc10ReverbType(){ setReverbType(state.reverbTypeSelected+10); }
            function dec10ReverbType(){ setReverbType(state.reverbTypeSelected-10); }

        //wiring
        object.elements.dial_continuous.outGain_dial.onchange = function(value){ object.reverbCircuit.outGain(value); };
        object.elements.dial_continuous.wetdry_dial.onchange = function(value){ object.reverbCircuit.wetdry(1-value); };

    //interface
        object.i = {
            gain:function(a){object.elements.dial_continuous.outGain.set(a);},
            wetdry:function(a){object.elements.dial_continuous.wetdry.set(a);},
        };

    //setup
        object.elements.dial_continuous.outGain_dial.set(1/2);
        object.elements.dial_continuous.wetdry_dial.set(1/2);
        setTimeout(function(){setReverbType(state.reverbTypeSelected);},1000);

    return object;
};

this.reverbUnit.metadata = {
    name:'Reverb Unit',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/reverbUnit/'
};
