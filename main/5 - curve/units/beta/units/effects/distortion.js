this.distortion = function(x,y,a){
    var shape = [
        {x:0,y:0},
        {x:120,y:0},
        {x:120,y:65},
        {x:0,y:65},
    ];
    var design = {
        name:'distortion',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {type:'connectionNode_audio', name:'output', data:{ 
                x:0, y:60, width:5, height:15, angle:Math.PI, cableVersion:2, isAudioOutput:true, 
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},
            {type:'connectionNode_audio', name:'input', data:{ 
                x:120, y:45, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},

            {type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background}},
            {type:'image', name:'markings', data:{x:0,y:0,width:120,height:65,url:'images/units/beta/distortionMarkings.png'} },

            {type:'dial_colourWithIndent_continuous',name:'in_dial',data:{
                x:92.5, y:47.5, radius:12.5, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:236/255,g:97/255,b:43/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'res_dial',data:{
                x:72.5, y:18.5, radius:12.5, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:175/255,g:46/255,b:246/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_discrete',name:'overSample_dial',data:{
                x:55, y:50, radius:15/2, startAngle:1.1*Math.PI, maxAngle:0.8*Math.PI, arcDistance:1.2, optionCount:3, 
                style:{
                    handle:{r:181/255,g:251/255,b:99/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dist_dial',data:{
                x:37.5, y:18.5, radius:12.5, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:117/255,g:251/255,b:237/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'out_dial',data:{
                x:20, y:47.5, radius:12.5, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:234/255,g:52/255,b:119/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
        ]
    };
    //add bumpers
    for(var a = shape.length-1, b=0, c=1; b < shape.length; a=b, b++, c++){
        if(c == shape.length){c = 0;}

        var arm1 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.medium.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[a]));
        var arm2 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.medium.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[c]));

        design.elements.push( {type:'path', name:'bumper_'+b, data:{ pointsAsXYArray:[
            { x:shape[b].x+arm1.x, y:shape[b].y+arm1.y }, shape[b], { x:shape[b].x+arm2.x, y:shape[b].y+arm2.y },
        ], thickness:bumperCoverage.medium.thickness, jointType:'round', capType:'round', colour:style.bumper }} );
    }


    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //import/export
        object.importData = function(data){
            object.elements.dial_colourWithIndent_continuous.out_dial.set(data.outGain);
            object.elements.dial_colourWithIndent_continuous.dist_dial.set(data.distortionAmount);
            object.elements.dial_colourWithIndent_continuous.res_dial.set(data.resolution);
            object.elements.dial_colourWithIndent_discrete.overSample_dial.set(data.overSample);
            object.elements.dial_colourWithIndent_continuous.in_dial.set(data.inGain);
        };
        object.exportData = function(){
            return {
                outGain:         object.elements.dial_colourWithIndent_continuous.out_dial.get(), 
                distortionAmount:object.elements.dial_colourWithIndent_continuous.dist_dial.get(), 
                resolution:      object.elements.dial_colourWithIndent_continuous.res_dial.get(), 
                overSample:      object.elements.dial_colourWithIndent_discrete.overSample_dial.get(), 
                inGain:          object.elements.dial_colourWithIndent_continuous.in_dial.get()
            };
        };

    //circuitry
        object.distortionCircuit = new _canvas_.interface.circuit.distortionUnit(_canvas_.library.audio.context);
        object.elements.connectionNode_audio.input.out().connect( object.distortionCircuit.in() );
        object.distortionCircuit.out().connect( object.elements.connectionNode_audio.output.in() );

    //wiring
        object.elements.dial_colourWithIndent_continuous.out_dial.onchange = function(value){object.distortionCircuit.outGain(value);};
        object.elements.dial_colourWithIndent_continuous.dist_dial.onchange = function(value){object.distortionCircuit.distortionAmount(value*100);};
        object.elements.dial_colourWithIndent_continuous.res_dial.onchange = function(value){object.distortionCircuit.resolution(Math.round(value*1000));};
        object.elements.dial_colourWithIndent_discrete.overSample_dial.onchange = function(value){object.distortionCircuit.oversample(['none','2x','4x'][value]);};
        object.elements.dial_colourWithIndent_continuous.in_dial.onchange = function(value){object.distortionCircuit.inGain(2*value);};

    //setup
        object.elements.dial_colourWithIndent_continuous.res_dial.set(0.5);
        object.elements.dial_colourWithIndent_continuous.in_dial.set(0.5);
        object.elements.dial_colourWithIndent_continuous.out_dial.set(1);
    
    return object;
};

this.distortion.metadata = {
    name:'Distortion',
    category:'effects',
    helpURL:'https://curve.metasophiea.com/help/units/beta/distortion/'
};