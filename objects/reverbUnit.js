this.reverbUnit = function(x,y){
    var state = {
        reverbTypeSelected: 0,
        availableTypes: [],
    };
    var style = {
        background: 'fill:rgba(200,200,200,1); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
        h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',

        dial:{
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)',
            arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
        },
        button:{
            up: 'fill:rgba(175,175,175,1)',
            hover: 'fill:rgba(220,220,220,1)',
            down: 'fill:rgba(150,150,150,1)',
            glow: 'fill:rgba(220,200,220,1)',
        }
    };
    var design = {
        type: 'reverbUnit',
        x: x, y: y,
        base: {
            points:[
                {x:0,y:10},
                {x:51.25,y:0},
                {x:102.5,y:10},
                {x:102.5,y:40},
                {x:51.25,y:50},
                {x:0,y:40},
            ], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_audio', name:'audioIn', data:{ type: 0, x: 102.5, y: 16, width: 10, height: 20 }},
            {type:'connectionNode_audio', name:'audioOut', data:{ type: 1, x: -10, y: 16, width: 10, height: 20 }},
            
            {type:'label', name:'outGain_0',   data:{x:7,    y:39, text:'0', style:style.h2}},
            {type:'label', name:'outGain_1/2', data:{x:16.5, y:10, text:'1/2', style:style.h2}},
            {type:'label', name:'outGain_1',   data:{x:30,   y:39, text:'1', style:style.h2}},
            {type:'dial_continuous',name:'outGain',data:{
                x: 20, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(){},
            }},
            {type:'label', name:'wetdry_1/2', data:{x:66.5, y:39, text:'wet', style:style.h2}},
            {type:'label', name:'wetdry_1',   data:{x:92.5, y:39, text:'dry', style:style.h2}},
            {type:'dial_continuous',name:'wetdry',data:{
                x: 82.5, y: 25, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(){},
            }},

            {type:'button_rect',name:'raiseByOne',data:{
                x:51, y:6, width: 10.25, height: 5,
                style:{ up:style.button.up, hover:style.button.hover, down:style.button.down, glow:style.button.glow },
                onclick: function(){ incReverbType(); },
            }},
            {type:'button_rect',name:'raiseByTen',data:{
                x:38.75, y:6, width: 10.25, height: 5,
                style:{ up:style.button.up, hover:style.button.hover, down:style.button.down, glow:style.button.glow },
                onclick: function(){ inc10ReverbType(); },
            }},
            {type:'button_rect',name:'lowerByOne',data:{
                x:51, y:39, width: 10.25, height: 5,
                style:{ up:style.button.up, hover:style.button.hover, down:style.button.down, glow:style.button.glow },
                onclick: function(){ decReverbType(); },
            }},
            {type:'button_rect',name:'lowerByTen',data:{
                x:38.75, y:39, width: 10.25, height: 5,
                style:{ up:style.button.up, hover:style.button.hover, down:style.button.down, glow:style.button.glow },
                onclick: function(){ dec10ReverbType(); },
            }},

            {type:'sevenSegmentDisplay',name:'tens',data:{
                x:50, y:12.5, width:12.5, height:25,
            }},
            {type:'sevenSegmentDisplay',name:'ones',data:{
                x:37.5, y:12.5, width:12.5, height:25,
            }},
        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.reverbUnit,design);

    //import/export
        obj.importData = function(data){
            state.reverbTypeSelected = data.selectedType;
            design.dial_continuous.wetdry.set(data.wetdry);
            design.dial_continuous.outGain.set(data.outGain);
        };
        obj.exportData = function(){
            return {
                selectedType: state.reverbTypeSelected,
                wetdry: design.dial_continuous.wetdry.get(),
                outGain: design.dial_continuous.outGain.get(),
            };
        };

    //circuitry
        //reverb
            obj.reverbCircuit = new parts.circuits.audio.reverbUnit(__globals.audio.context);
            design.connectionNode_audio.audioIn.out().connect( obj.reverbCircuit.in() );
            obj.reverbCircuit.out().connect( design.connectionNode_audio.audioOut.in() );
            obj.reverbCircuit.getTypes( function(a){state.availableTypes = a;} );
            
        //internal functions
            function setReadout(num){
                num = ("0" + num).slice(-2);

                design.sevenSegmentDisplay.ones.enterCharacter(num[0]);
                design.sevenSegmentDisplay.tens.enterCharacter(num[1]);
            }
            function setReverbType(a){
                if( state.availableTypes.length == 0 ){ console.log('broken or not yet ready'); return;}

                if( a >= state.availableTypes.length ){a = state.availableTypes.length-1;}
                else if( a < 0 ){a = 0;}
    
                state.reverbTypeSelected = a;
                obj.reverbCircuit.type( state.availableTypes[a], function(){setReadout(state.reverbTypeSelected);});    
            }
            function incReverbType(){ setReverbType(state.reverbTypeSelected+1); }
            function decReverbType(){ setReverbType(state.reverbTypeSelected-1); }
            function inc10ReverbType(){ setReverbType(state.reverbTypeSelected+10); }
            function dec10ReverbType(){ setReverbType(state.reverbTypeSelected-10); }

    //setup
        design.dial_continuous.outGain.set(1/2);
        design.dial_continuous.wetdry.set(1/2);
        setTimeout(function(){setReverbType(state.reverbTypeSelected);},1000);

    return obj;
};
