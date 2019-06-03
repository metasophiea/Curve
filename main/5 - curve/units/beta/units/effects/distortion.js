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
            {type:'connectionNode_audio', name:'input', data:{ 
                x:120, y:45, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},
            {type:'connectionNode_audio', name:'output', data:{ 
                x:-5, y:45, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},

            {type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background}},

            {type:'dial_colourWithIndent_continuous',name:'in_dial',data:{
                x:(105-25/2), y:60 - 25/2, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:236/255,g:97/255,b:43/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'dist_dial',data:{
                x:(50-25/2), y:25/2+5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:117/255,g:251/255,b:237/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'overSample_dial',data:{
                x:55, y:50, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:181/255,g:251/255,b:99/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'res_dial',data:{
                x:(85-25/2), y:25/2+5, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
                style:{
                    handle:{r:175/255,g:46/255,b:246/255,a:1},
                    slot:{r:0,g:0,b:0,a:0},
                    needle:{r:1,g:1,b:1,a:1},
                }
            }},
            {type:'dial_colourWithIndent_continuous',name:'out_dial',data:{
                x:(30-25/2), y:60 - 25/2, radius:25/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.2, 
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
    
    return object;
};

this.distortion.metadata = {
    name:'Distortion',
    category:'effects',
    helpURL:'https://curve.metasophiea.com/help/units/beta/distortion/'
};