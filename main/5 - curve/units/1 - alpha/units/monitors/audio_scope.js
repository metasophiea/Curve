this.audio_scope = function(name,x,y,angle){
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'audio_scope/';

            //calculation of measurements
                const div = 6;
                const measurement = { 
                    file: { width:1220, height:680 },
                    design: { width:20, height:11 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //styling values
                this.dial = { handle:{r:0.93,g:0,b:0.55,a:1}, slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} };
                this.waveport = { backgroundText_size:10, backing:{r:0.15,g:0.15,b:0.15,a:1} };
        };

    //main object creation
    const object = _canvas_.interface.unit.builder({
            name:name,
            model:'audio_scope',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                                          y:0                                                                 },
                { x:unitStyle.drawingValue.width -unitStyle.offset,             y:0                                                                 },
                { x:unitStyle.drawingValue.width -unitStyle.offset,             y:(unitStyle.drawingValue.height -unitStyle.offset)*(11.25/20) - 2  },
                { x:(unitStyle.drawingValue.width -unitStyle.offset)*(17.5/20), y:(unitStyle.drawingValue.height -unitStyle.offset)*(11.25/20) - 2  },
                { x:(unitStyle.drawingValue.width -unitStyle.offset)*(16/20),   y:(unitStyle.drawingValue.height -unitStyle.offset)*(14/20) - 2     },
                { x:(unitStyle.drawingValue.width -unitStyle.offset)*(16/20),   y:unitStyle.drawingValue.height -unitStyle.offset                   },
                { x:0,                                                          y:unitStyle.drawingValue.height -unitStyle.offset                   },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
                    x:160, y:80, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio,
                }},
                {collection:'basic', type:'image', name:'backing', data:{ 
                    x:-unitStyle.offset/2, y:-unitStyle.offset/2, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                }},
                {collection:'control', type:'dial_2_continuous',name:'dial_framerate',data:{
                    x:173.5, y:42.5, radius:75/6, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5, style:unitStyle.dial,
                }},
                {collection:'control', type:'button_image', name:'hold', data:{
                    x:158.5, y:5, width:30, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'button_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'button_down.png',
                }},
                {collection:'display', type:'grapher_audioScope', name:'waveport', data:{
                    x:5, y:5, width:150, height:100, static:true, style:unitStyle.waveport,
                }},
            ]
        });

    //circuitry
        const attributes = {
            framerateLimits: {min:1, max:30},
            framerate:1,
        };

    //wiring
        //hid
            object.elements.button_image.hold.onpress = function(){object.elements.grapher_audioScope.waveport.stop();};
            object.elements.button_image.hold.onrelease = function(){object.elements.grapher_audioScope.waveport.start();};
            object.elements.dial_2_continuous.dial_framerate.onchange = function(a){
                attributes.framerate = attributes.framerateLimits.min + Math.floor((attributes.framerateLimits.max - attributes.framerateLimits.min)*a);
                object.elements.grapher_audioScope.waveport.refreshRate(attributes.framerate);
            };
        //io 
            object.io.audio.input.out().connect(object.elements.grapher_audioScope.waveport.getNode());

    //interface
        object.i = {
            framerate:function(a){
                if(a==undefined){return attributes.framerate;}
                object.elements.dial_2_continuous.dial_framerate.set(a/attributes.framerateLimits.max);
            },
            sampleWidth:function(a){
                return object.elements.grapher_audioScope.waveport.resolution(a);
            },
        };

    //import/export
        object.exportData = function(){
            return {
                framerate:object.i.framerate(),
                sampleWidth:object.i.sampleWidth(),
            };
        };
        object.importData = function(data){
            object.i.framerate(data.framerate);
            object.i.sampleWidth(data.sampleWidth);
        };

    //setup
        object.elements.grapher_audioScope.waveport.start();
        object.elements.dial_2_continuous.dial_framerate.set(0);

    return object;
};
this.audio_scope.metadata = {
    name:'Audio Scope',
    category:'monitors',
    helpURL:'/help/units/beta/audio_scope/'
};
