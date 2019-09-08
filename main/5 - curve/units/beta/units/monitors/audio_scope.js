this.audio_scope = function(x,y,a){
    var imageStoreURL_localPrefix = imageStoreURL+'audio_scope/';

    var div = 6;
    var offset = 20/div;
    var measurements = { 
        file:{ width:1220, height:680 },
        design:{ width:20, height:11 },
    };
    measurements.drawing = { width: measurements.file.width/div, height: measurements.file.height/div };
    measurements.drawingUnit = {
        width: measurements.drawing.width/measurements.design.width,
        height: measurements.drawing.height/measurements.design.height,
    };

    var design = {
        name:'audio_scope',
        x:x, y:y, angle:a,
        space:[
            { x:0,                                    y:0                                       },
            { x:measurements.drawing.width -offset,   y:0                                       },
            { x:measurements.drawing.width -offset,   y:measurements.drawingUnit.height*6 - 2   },
            { x:measurements.drawingUnit.width*17.2, y:measurements.drawingUnit.height*6 - 2   },
            { x:measurements.drawingUnit.width*15.75, y:measurements.drawingUnit.height*7.475 - 2 },
            { x:measurements.drawingUnit.width*15.75, y:measurements.drawing.height -offset     },
            { x:0,                                    y:measurements.drawing.height -offset     },
        ],
        elements:[
            {collection:'basic', type:'image', name:'backing', data:{ 
                x:-offset/2, y:-offset/2, width:measurements.drawing.width, height:measurements.drawing.height, url:imageStoreURL_localPrefix+'backing.png'
            }},
            {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                x:160, y:80, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2,
                style:style.connectionNode.audio,
            }},
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_framerate',data:{
                x:173.5, y:42.5, radius:75/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5,
                style:{ handle:{r:0.93,g:0,b:0.55,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
            }},
            {collection:'control', type:'button_image', name:'hold', data:{
                x:158.5, y:5, width:30, height:15, hoverable:false, 
                backingURL__up:imageStoreURL_localPrefix+'button_up.png',
                backingURL__press:imageStoreURL_localPrefix+'button_down.png',
            }},
            {collection:'display', type:'grapher_audioScope_static', name:'waveport', data:{
                x:5, y:5, width:150, height:100,
                style:{
                    backgroundText_size:10,
                    backing:{r:0.15,g:0.15,b:0.15,a:1}
                },
            }},
        ]
    };
    
    //main object
        var object = _canvas_.interface.unit.builder(design);

    //circuitry
        var attributes = {
            framerateLimits: {min:1, max:30},
            framerate:1,
        };
        object.elements.button_image.hold.onpress = function(){object.elements.grapher_audioScope_static.waveport.stop();};
        object.elements.button_image.hold.onrelease = function(){object.elements.grapher_audioScope_static.waveport.start();};
        object.elements.connectionNode_audio.input.out().connect(object.elements.grapher_audioScope_static.waveport.getNode());
        object.elements.dial_colourWithIndent_continuous.dial_framerate.onchange = function(a){
            attributes.framerate = attributes.framerateLimits.min + Math.floor((attributes.framerateLimits.max - attributes.framerateLimits.min)*a);
            object.elements.grapher_audioScope_static.waveport.refreshRate(attributes.framerate);
        };
    
    //interface
        object.i = {
            framerate:function(a){
                if(a==undefined){return attributes.framerate;}
                object.elements.dial_colourWithIndent_continuous.dial_framerate.set(a/attributes.framerateLimits.max);
            },
            sampleWidth:function(a){
                return object.elements.grapher_audioScope_static.waveport.resolution(a);
            },
        };

    //setup
        object.elements.grapher_audioScope_static.waveport.start();
        object.elements.dial_colourWithIndent_continuous.dial_framerate.set(0);

    return object;
};



this.audio_scope.metadata = {
    name:'Audio Scope',
    category:'monitors',
    helpURL:'/help/units/beta/audio_scope/'
};