this.audioScope = function(x,y,a){
    var attributes = {
        framerateLimits: {min:1, max:30}
    };
    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        h1:{fill:'rgba(0,0,0,1)', font:'4pt Courier New'},
        h2:{fill:'rgba(0,0,0,1)', font:'3pt Courier New'},
        button:{
            background__up__fill:'rgba(175,175,175,1)', 
            background__hover__fill:'rgba(190,190,190,1)', 
            background__hover_press__fill:'rgba(170,170,170,1)',
        },
        dial:{
            handle:{fill:'rgba(220,220,220,1)'},
            slot:{fill:'rgba(50,50,50,1)'},
            needle:{fill:'rgba(250,150,150,1)'},
        },
    };
    var design = {
        name:'audioScope',
        category:'humanOutputDevices',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}],
        // spaceOutline: true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}], style:style.background }},

            {type:'connectionNode_audio', name:'input', data:{ x:195, y:5, width:10, height:20 }},
            {type:'grapher_audioScope_static', name:'waveport', data:{ x:5, y:5, width:150, height:100 }},
            {type:'button_rect', name:'holdKey', data:{ x:160, y:5, width:30, height:20, style:style.button }},

            {type:'text', name:'framerate_name', data:{x: 155+6.5,  y: 30+38, text: 'framerate', style: style.h1}},
            {type:'text', name:'framerate_1',    data:{x: 155+7,    y: 30+32, text: '1',         style: style.h2}},
            {type:'text', name:'framerate_15',   data:{x: 155+17.5, y: 30+2,  text: '15',        style: style.h2}},
            {type:'text', name:'framerate_30',   data:{x: 155+31,   y: 30+32, text: '30',        style: style.h2}},
            {type:'dial_continuous', name:'framerate', data:{
                x:175, y:47.5, r:12, resetValue:0.5,
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},
        ]
    };

    //main object
        var object = interfaceUnit.builder(this.audioScope,design);
    
    //circuitry
        object.elements.button_rect.holdKey.onpress = function(){object.elements.grapher_audioScope_static.waveport.stop();};
        object.elements.button_rect.holdKey.onrelease = function(){object.elements.grapher_audioScope_static.waveport.start();};
        object.elements.connectionNode_audio.input.out().connect(object.elements.grapher_audioScope_static.waveport.getNode());

    //wiring
        object.elements.dial_continuous.framerate.onchange = function(a){
            object.elements.grapher_audioScope_static.waveport.refreshRate(
                attributes.framerateLimits.min + Math.floor((attributes.framerateLimits.max - attributes.framerateLimits.min)*a)
            );
        };

    //setup
        object.elements.grapher_audioScope_static.waveport.start();
        object.elements.dial_continuous.framerate.set(0);

    return object;
};

this.audioScope.metadata = {
    name:'Audio Scope',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/audioScope/'
};