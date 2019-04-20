this.basicMixer = function(x,y,a){
    var connectionCount = 8;
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        markings:{r:150/255,g:150/255,b:150/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:8, font:'Courier New', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:5, font:'Courier New', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},

        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        }
    };
    var design = {
        name:'basicMixer',
        category: 'misc',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:100,y:0},{x:100,y:207.5},{x:0,y:207.5}],
        // spaceOutline: true,
        elements:[
            {type:'connectionNode_audio', name:'output_0', data:{ x:-10, y:5, width:20, height:20, isAudioOutput:true }},
            {type:'connectionNode_audio', name:'output_1', data:{ x:-10, y:30, width:20, height:20, isAudioOutput:true }},

            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:100,y:0},{x:100,y:207.5},{x:0,y:207.5}], colour:style.background }},

            {type:'text', name:'gain', data:{ x:85, y:5, text:'gain', colour:style.h2.colour, width:style.h2.size, height:style.h2.size, font:style.h2.font, printingMode:style.h2.printingMode } }, 
            {type:'text', name:'pan', data:{  x:60, y:5, text:'pan', colour:style.h2.colour, width:style.h2.size, height:style.h2.size, font:style.h2.font, printingMode:style.h2.printingMode } }, 
            
            {type:'rectangle', name:'vertical', data:{ x:22.5, y:6, width:2, height:190, colour:style.markings }},
            {type:'rectangle', name:'overTheTop', data:{ x:10, y:6, width:14, height:2, colour:style.markings }},
            {type:'rectangle', name:'down', data:{ x:10, y:6, width:2, height:35, colour:style.markings }},
            {type:'rectangle', name:'inTo0', data:{ x:2, y:14, width:10, height:2, colour:style.markings }},
            {type:'rectangle', name:'inTo1', data:{ x:2, y:39, width:10, height:2, colour:style.markings }},
        ],
    };

    //dynamic design
    for(var a = 0; a < connectionCount; a++){
        design.elements.unshift(
            {type:'connectionNode_audio', name:'input_'+a, data:{ 
                x:90, y:10+(a*25), width:20, height:20 
            }},
        );

        design.elements.push(
            {type:'rectangle', name:'line_'+a, data:{
                x:23, y:19.1+a*25, width:75, height:2, 
                colour:style.markings,
            }}
        );

        design.elements.push(
            {type:'dial_continuous',name:'gain_'+a,data:{
                x:85, y:20+a*25, radius:8, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }}
        );
        design.elements.push(
            {type:'dial_continuous',name:'pan_'+a,data:{
                x:60, y:20+a*25, radius:8, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, resetValue:0.5,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }}
        );
    }

    //main object
        var object = _canvas_.interface.unit.builder(this.basicMixer,design);

    

    //internal circuitry
        for(var a = 0; a < connectionCount; a++){
            object['splitter_'+a] = new _canvas_.interface.circuit.channelMultiplier(_canvas_.library.audio.context,2);
            object.elements.connectionNode_audio['input_'+a].out().connect(object['splitter_'+a].in());
            object['splitter_'+a].out(0).connect( object.elements.connectionNode_audio['output_0'].in() );
            object['splitter_'+a].out(1).connect( object.elements.connectionNode_audio['output_1'].in() );

            object.elements.dial_continuous['gain_'+a].onchange = function(a){
                return function(value){
                    object['splitter_'+a].inGain(value);
                }
            }(a);
            object.elements.dial_continuous['pan_'+a].onchange = function(a){
                return function(value){
                    object['splitter_'+a].outGain(0,value);
                    object['splitter_'+a].outGain(1,1-value);
                }
            }(a);
        }

    //interface
        object.i = {
            gain:function(track,value){object.elements.dial_continuous['gain_'+track].set(value);},
            pan:function(track,value){object.elements.dial_continuous['pan_'+track].set(value);},
        };

    //setup
        for(var a = 0; a < connectionCount; a++){
            object.i.gain(a,0.5);
            object.i.pan(a,0.5);
        }
    
    return object;
};

this.basicMixer.metadata = {
    name:'Basic Audio Mixer',
    category:'misc',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/basicAudioMixer/'
};