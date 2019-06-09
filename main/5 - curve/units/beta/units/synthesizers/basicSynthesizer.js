this.basicSynthesizer = function(x,y,a){
    var shape = [
        {x:0,y:0},
        {x:185,y:0},
        {x:185,y:45},
        {x:120,y:110},
        {x:0,y:110},
    ];


    var design = {
        name:'basicSynthesizer',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background}},

            {type:'connectionNode_audio', name:'output', data:{ 
                x:0, y:30, width:5, height:15, angle:Math.PI, cableVersion:2, isAudioOutput:true, 
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},
            {type:'connectionNode_data', name:'noteInput', data:{ 
                x:185, y:15, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.data.dim, 
                    glow:style.connectionNode.data.glow,
                    cable_dim:style.connectionCable.data.dim, 
                    cable_glow:style.connectionCable.data.glow,
                },
            }},
            {type:'connectionNode_data', name:'waveTypeInput', data:{ 
                x:152.5, y:77.5, width:5, height:15, cableVersion:2, angle:Math.PI/4, 
                style:{ 
                    dim:style.connectionNode.data.dim, 
                    glow:style.connectionNode.data.glow,
                    cable_dim:style.connectionCable.data.dim, 
                    cable_glow:style.connectionCable.data.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_gain', data:{ 
                x:12.5, y:0, width:5, height:12.5, angle:Math.PI*1.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_attack', data:{ 
                x:52.5, y:0, width:5, height:12.5, angle:Math.PI*1.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_release', data:{ 
                x:82.5, y:0, width:5, height:12.5, angle:Math.PI*1.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_detune', data:{ 
                x:122.5, y:0, width:5, height:12.5, angle:Math.PI*1.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_octave', data:{ 
                x:152.5, y:0, width:5, height:12.5, angle:Math.PI*1.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_tremolo_rate', data:{ 
                x:35, y:110, width:5, height:12.5, angle:Math.PI*0.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_tremolo_depth', data:{ 
                x:52.5, y:110, width:5, height:12.5, angle:Math.PI*0.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_vibrato_rate', data:{ 
                x:85, y:110, width:5, height:12.5, angle:Math.PI*0.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},
            {type:'connectionNode_voltage', name:'connection_vibrato_depth', data:{ 
                x:102.5, y:110, width:5, height:12.5, angle:Math.PI*0.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow, 
                    cable_dim:style.connectionCable.voltage.dim, 
                    cable_glow:style.connectionCable.voltage.glow,
                },
            }},

            {type:'dial_colourWithIndent_continuous',name:'dial_gain',data:{
                x:30-12.5, y:40-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:235/255,g:113/255,b:81/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dial_attack',data:{
                x:70-12.5, y:40-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:251/255,g:235/255,b:79/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dial_release',data:{
                x:100-12.5, y:40-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:117/255,g:249/255,b:209/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dial_detune',data:{
                x:140-12.5, y:40-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:159/255,g:43/255,b:245/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_discrete',name:'dial_octave',data:{
                x:170-12.5, y:40-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, optionCount:7,
                style:{
                    handle:{r:233/255,g:52/255,b:119/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dial_tremolo_rate',data:{
                x:50-12.5, y:75-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:155/255,g:250/255,b:78/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dial_tremolo_depth',data:{
                x:50-12.5, y:105-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:117/255,g:249/255,b:159/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dial_vibrato_rate',data:{
                x:100-12.5, y:75-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:239/255,g:145/255,b:53/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dial_vibrato_depth',data:{
                x:100-12.5, y:105-12.5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:244/255,g:193/255,b:66/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_discrete',name:'dial_waveType',data:{
                x:150-15, y:85-15, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:175/255,g:175/255,b:175/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},

        ],
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

    return object;
};

this.basicSynthesizer.metadata = {
    name:'Basic Synthesizer',
    category:'synthesizer',
    helpURL:'https://curve.metasophiea.com/help/units/beta/basicSynthesizer/'
};