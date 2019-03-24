this.reverbUnit = function(x,y){
    var state = {
        reverbTypeSelected: 0,
        availableTypes: [],
    };
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3.5, ratio:1, font:'Courier New', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:2, ratio:1.5, font:'Courier New', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},

        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        },
        button:{
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1},
        }
    };
    var design = {
        name: 'reverbUnit',
        category: 'audioEffectUnits',
        collection: 'alpha',
        x: x, y: y,
        space:[{x:0,y:10}, {x:51.25,y:0}, {x:102.5,y:10}, {x:102.5,y:40}, {x:51.25,y:50}, {x:0,y:40}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:10}, {x:51.25,y:0}, {x:102.5,y:10}, {x:102.5,y:40}, {x:51.25,y:50}, {x:0,y:40}], colour:style.background }},

            {type:'connectionNode_audio', name:'audioIn', data:{ x: 102.5, y: 16, width: 10, height: 20 }},
            {type:'connectionNode_audio', name:'audioOut', data:{ x: -10, y: 16, width: 10, height: 20, isAudioOutput:true }},
            
            {type:'text', name:'outGain_0',   data:{x:10, y:36, text:'0', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {type:'text', name:'outGain_1/2', data:{x:20, y:11, text:'1/2', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {type:'text', name:'outGain_1',   data:{x:30, y:36, text:'1', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {type:'dial_continuous',name:'outGain_dial',data:{
                x: 20, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {type:'text', name:'wetdry_1/2', data:{x:72, y:36, text:'wet', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {type:'text', name:'wetdry_1',   data:{x:93, y:36, text:'dry', width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {type:'dial_continuous',name:'wetdry_dial',data:{
                x: 82.5, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},

            {type:'button_rectangle',name:'raiseByOne',data:{
                x:51, y:6, width: 10.25, height: 5, style:style.button, 
                onpress: function(){ incReverbType(); },
            }},
            {type:'button_rectangle',name:'raiseByTen',data:{
                x:38.75, y:6, width: 10.25, height: 5, style:style.button, 
                onpress: function(){ inc10ReverbType(); },
            }},
            {type:'button_rectangle',name:'lowerByOne',data:{
                x:51, y:39, width: 10.25, height: 5, style:style.button, 
                onpress: function(){ decReverbType(); },
            }},
            {type:'button_rectangle',name:'lowerByTen',data:{
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
        var object = _canvas_.interface.unit.builder(this.reverbUnit,design);

    //import/export
        object.importData = function(data){
            state.reverbTypeSelected = data.selectedType;
            object.elements.dial_continuous.wetdry_dial.set(data.wetdry);
            object.elements.dial_continuous.outGain_dial.set(data.outGain);
        };
        object.exportData = function(){
            return {
                selectedType: state.reverbTypeSelected,
                wetdry: object.elements.dial_continuous.wetdry_dial.get(),
                outGain: object.elements.dial_continuous.outGain_dial.get(),
            };
        };

    //circuitry
        //reverb
            object.reverbCircuit = new _canvas_.interface.circuit.reverbUnit(_canvas_.library.audio.context);
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
            gain:function(a){object.elements.dial_continuous.outGain_dial.set(a);},
            wetdry:function(a){object.elements.dial_continuous.wetdry_dial.set(a);},
        };

    //setup
        object.elements.dial_continuous.outGain_dial.set(1/2);
        object.elements.dial_continuous.wetdry_dial.set(1/2);
        setTimeout(function(){setReverbType(state.reverbTypeSelected);},1000);

    return object;
};

this.reverbUnit.metadata = {
    name:'Reverb Unit',
    category:'audioEffectUnits',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/reverbUnit/'
};
