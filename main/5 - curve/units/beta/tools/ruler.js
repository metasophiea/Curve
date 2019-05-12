this.ruler = function(x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        markings:{r:150/255,g:150/255,b:150/255,a:1},
    };
    var shape = [{x:0,y:0},{x:50,y:0},{x:50,y:1000},{x:0,y:1000}];
    var design = {
        name:'ruler',
        x:x, y:y, angle:a,
        space:shape,
        collisionActive:false,
        elements:[
            {type:'polygon', name:'backing', data:{ pointsAsXYArray:shape, colour:style.background }},
        ]
    };

    //add markings
        for(var a = 1; a < 100; a++){
            //centimetres
            design.elements.push(
                {type:'rectangle', name:'centimetre_line_L_'+a, data:{
                    x:0, y:a*10 - 0.5, width:5, height:1, 
                    colour:style.markings,
                }}
            );
            design.elements.push(
                {type:'rectangle', name:'centimetre_line_R_'+a, data:{
                    x:50-5, y:a*10 - 0.5, width:5, height:1, 
                    colour:style.markings,
                }}
            );
            if( a%5 != 0 && a%10 != 0 ){
                design.elements.push(
                    {type:'text', name:'centimetre_line_text_'+a, data:{
                        x:50/2, y:a*10, text:a,
                        width:2.5,height:2.5,
                        printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
                        colour:style.markings, font:'defaultThin',
                    }}
                );
            }

            //pentimetres
            if( a%5 == 0 ){
                design.elements.push(
                    {type:'rectangle', name:'vigintimetre_line_L_'+a, data:{
                        x:0, y:a*10 - 0.5, width:10, height:1, 
                        colour:style.markings,
                    }}
                );
                design.elements.push(
                    {type:'rectangle', name:'vigintimetre_line_R_'+a, data:{
                        x:50-10, y:a*10 - 0.5, width:10, height:1, 
                        colour:style.markings,
                    }}
                );
                if( a%10 != 0 ){
                    design.elements.push(
                        {type:'text', name:'vigintimetre_line_text_'+a, data:{
                            x:50/2, y:a*10, text:a,
                            width:5,height:5,
                            printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
                            colour:style.markings, font:'defaultThin',
                        }}
                    );
                }
            }

            //decimetres
            if( a%10 == 0 ){
                design.elements.push(
                    {type:'rectangle', name:'decimetre_line_L_'+a, data:{
                        x:0, y:a*10 - 0.5, width:15, height:1, 
                        colour:style.markings,
                    }}
                );
                design.elements.push(
                    {type:'rectangle', name:'decimetre_line_R_'+a, data:{
                        x:50-15, y:a*10 - 0.5, width:15, height:1, 
                        colour:style.markings,
                    }}
                );
                design.elements.push(
                    {type:'text', name:'decimetre_line_text_'+a, data:{
                        x:50/2, y:a*10, text:a,
                        printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
                        colour:style.markings, font:'defaultThin',
                    }}
                );
            }
        }

    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);
    
    return object;
};

this.ruler.metadata = {
    name:'Ruler',
    category:'tools',
    helpURL:'https://curve.metasophiea.com/help/units/beta/ruler/'
};