this.ruler = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //calculation of measurements
                this.drawingValue = { 
                    width: 50, 
                    height: 1000,
                };

            //styling values
                this.background = {r:200/255,g:200/255,b:200/255,a:1};
                this.markings = {r:150/255,g:150/255,b:150/255,a:1};
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'ruler',
            x:x, y:y, angle:angle,
            collisionActive:false,
            space:[
                { x:0,                            y:0                             },
                { x:unitStyle.drawingValue.width, y:0                             },
                { x:unitStyle.drawingValue.width, y:unitStyle.drawingValue.height },
                { x:0,                            y:unitStyle.drawingValue.height },
            ],
            elements:
                [
                    {collection:'basic', type:'polygon', name:'backing', data:{ 
                        pointsAsXYArray:[
                            { x:0,                            y:0                             },
                            { x:unitStyle.drawingValue.width, y:0                             },
                            { x:unitStyle.drawingValue.width, y:unitStyle.drawingValue.height },
                            { x:0,                            y:unitStyle.drawingValue.height },
                        ], 
                        colour:unitStyle.background
                    }},
                ].concat(
                    (new Array(100).fill(0)).flatMap((value,index) => {
                        if(index == 0){return [];}
                        var newMarkings = []

                        //centimetres
                            newMarkings.push(
                                {collection:'basic', type:'rectangle', name:'centimetre_line_L_'+index, data:{
                                    x:0, y:index*10 - 0.5, width:5, height:1, 
                                    colour:unitStyle.markings,
                                }}
                            );
                            newMarkings.push(
                                {collection:'basic', type:'rectangle', name:'centimetre_line_R_'+index, data:{
                                    x:45, y:index*10 - 0.5, width:5, height:1, 
                                    colour:unitStyle.markings,
                                }}
                            );
                            if( index%5 != 0 && index%10 != 0 ){
                                newMarkings.push(
                                    {collection:'basic', type:'text', name:'centimetre_line_text_'+index, data:{
                                        x:25, y:index*10, text:index,
                                        width:2.5,height:2.5,
                                        printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
                                        colour:unitStyle.markings, font:'defaultThin',
                                    }}
                                );
                            }

                        //pentimetres
                            if( index%5 == 0 ){
                                newMarkings.push(
                                    {collection:'basic', type:'rectangle', name:'pentimetre_line_L_'+index, data:{
                                        x:0, y:index*10 - 0.5, width:10, height:1, 
                                        colour:unitStyle.markings,
                                    }}
                                );
                                newMarkings.push(
                                    {collection:'basic', type:'rectangle', name:'pentimetre_line_R_'+index, data:{
                                        x:40, y:index*10 - 0.5, width:10, height:1, 
                                        colour:unitStyle.markings,
                                    }}
                                );
                                if( index%10 != 0 ){
                                    newMarkings.push(
                                        {collection:'basic', type:'text', name:'pentimetre_line_text_'+index, data:{
                                            x:25, y:index*10, text:index,
                                            width:5,height:5,
                                            printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
                                            colour:unitStyle.markings, font:'defaultThin',
                                        }}
                                    );
                                }
                            }

                        //decimetres
                            if( index%10 == 0 ){
                                newMarkings.push(
                                    {collection:'basic', type:'rectangle', name:'decimetre_line_L_'+index, data:{
                                        x:0, y:index*10 - 0.5, width:15, height:1, 
                                        colour:unitStyle.markings,
                                    }}
                                );
                                newMarkings.push(
                                    {collection:'basic', type:'rectangle', name:'decimetre_line_R_'+index, data:{
                                        x:35, y:index*10 - 0.5, width:15, height:1, 
                                        colour:unitStyle.markings,
                                    }}
                                );
                                newMarkings.push(
                                    {collection:'basic', type:'text', name:'decimetre_line_text_'+index, data:{
                                        x:25, y:index*10, text:index,
                                        printingMode:{widthCalculation:'absolute', horizontal:'middle', vertical:'middle'},
                                        colour:unitStyle.markings, font:'defaultThin',
                                    }}
                                );
                            }

                        return newMarkings;
                    })
                )
        });

    return object;
};
this.ruler.metadata = {
    name:'Ruler',
    category:'tools',
    helpURL:'/help/units/beta/ruler/'
};