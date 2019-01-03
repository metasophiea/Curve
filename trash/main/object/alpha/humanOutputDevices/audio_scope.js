this.audio_scope = function(x,y){
    var attributes = {
        framerateLimits: {min:1, max:30}
    };
    var style = {
        background:'fill:rgba(200,200,200,1);',
        text:'fill:rgba(0,0,0,1); font-size:5px; font-family:Courier New; pointer-events: none;'
    };
    var design = {
        name:'audio_scope',
        collection: 'alpha',
        x:x, y:y,
        base:{
            points:[{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}],
            style:style.background,
        },
        elements:[
            {type:'connectionNode_audio', name:'input', data:{
                type:0, x:195, y:5, width:10, height:20
            }},

            {type:'grapher_audioScope', name:'waveport', data:{
                x:5, y:5, width:150, height:100
            }},
            {type:'button_rect', name:'holdKey', data:{
                x:160, y:5, width:30, height:20,
                style:{ 
                    up:'fill:rgba(175,175,175,1)', 
                    hover:'fill:rgba(190,190,190,1)',
                    hover_press:'fill:rgba(170,170,170,1)',
                },
                onpress:function(){design.grapher_audioScope.waveport.stop();},
                onrelease:function(){design.grapher_audioScope.waveport.start();},
            }},
            {type:'text', name:'framerate_name', data:{x: 155+6.5, y: 30+40, text: 'framerate', style: style.text}},
            {type:'text', name:'framerate_1',    data:{x: 155+4,   y: 30+34, text: '1',         style: style.text}},
            {type:'text', name:'framerate_15',   data:{x: 155+17,  y: 30+2,  text: '15',        style: style.text}},
            {type:'text', name:'framerate_30',   data:{x: 155+33,  y: 30+34, text: '30',        style: style.text}},
            {type:'dial_continuous', name:'framerate', data:{
                x:175, y:50, r:12,
                style:{
                    handle:'fill:rgba(220,220,220,1)', slot:'fill:rgba(50,50,50,1)',
                    needle:'fill:rgba(250,150,250,1)', outerArc:'fill:none; stroke:rgb(150,150,150); stroke-width:1;'
                },
                onchange:function(a){
                    design.grapher_audioScope.waveport.refreshRate(
                        attributes.framerateLimits.min + Math.floor((attributes.framerateLimits.max - attributes.framerateLimits.min)*a)
                    );
                }
            }},
        ]
    };

    //main object
        var obj = object.builder(object.alpha.audio_scope,design);
    
    //circuitry
        design.connectionNode_audio.input.out().connect(design.grapher_audioScope.waveport.getNode());

    //setup
        design.grapher_audioScope.waveport.start();
        design.dial_continuous.framerate.set(0);

    return obj;
};

this.audio_scope.metadata = {
    name:'Audio Scope',
    helpurl:'https://metasophiea.com/curve/help/objects/audioScope/'
};