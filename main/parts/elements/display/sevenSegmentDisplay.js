this.sevenSegmentDisplay = function(
    id='sevenSegmentDisplay',
    x, y, width, height,
    backgroundStyle='fill:rgb(0,0,0)',
    glowStyle='fill:rgb(200,200,200)',
    dimStyle='fill:rgb(20,20,20)'
){
    var margin = width/8;
    var division = width/8;
    var shapes = {
        segments:{
            points: {
                top:{
                    left:[
                        {x:division*1.0+margin,         y:division*1.0+margin},
                        {x:division*0.5+margin,         y:division*0.5+margin},
                        {x:division*1.0+margin,         y:division*0.0+margin},
                        {x:division*0.0+margin,         y:division*1.0+margin},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:division*0.0+margin},
                        {x:width-division*0.5-margin,   y:division*0.5+margin},
                        {x:width-division*1.0-margin,   y:division*1.0+margin},
                        {x:width-division*0.0-margin,   y:division*1.0+margin}
                    ]
                },
                middle: {
                    left:[
                        {x:division*1.0+margin,         y:height*0.5-division*1.0+margin*0.5},
                        {x:division*0.5+margin,         y:height*0.5-division*0.5+margin*0.5},
                        {x:division*1.0+margin,         y:height*0.5-division*0.0+margin*0.5},
                        {x:division*0.0+margin,         y:height*0.5-division*1.0+margin*0.5},
                        {x:division*0.0+margin,         y:height*0.5-division*0.0+margin*0.5},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:height*0.5-division*0.0+margin*0.5},
                        {x:width-division*0.5-margin,   y:height*0.5-division*0.5+margin*0.5},
                        {x:width-division*1.0-margin,   y:height*0.5-division*1.0+margin*0.5},
                        {x:width-division*0.0-margin,   y:height*0.5-division*1.0+margin*0.5},
                        {x:width-division*0.0-margin,   y:height*0.5-division*0.0+margin*0.5}
                    ]
                },
                bottom: {
                    left:[
                        {x:division*1.0+margin,         y:height-division*1.0-margin},
                        {x:division*0.5+margin,         y:height-division*0.5-margin},
                        {x:division*1.0+margin,         y:height-division*0.0-margin},
                        {x:division*0.0+margin,         y:height-division*1.0-margin},
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:height-division*0.0-margin},
                        {x:width-division*0.5-margin,   y:height-division*0.5-margin},
                        {x:width-division*1.0-margin,   y:height-division*1.0-margin},
                        {x:width-division*0.0-margin,   y:height-division*1.0-margin}
                    ]
                }
            }
        }
    };

    //elements
        //main
            var object = system.utility.misc.elementMaker('g',id,{x:x, y:y});

        //backing
            var rect = system.utility.misc.elementMaker('rect',null,{width:width,height:height,style:backgroundStyle});
                object.appendChild(rect);

        //segments
            var segments = [];
            var points = [
                [
                    shapes.segments.points.top.left[0],
                    shapes.segments.points.top.right[2],
                    shapes.segments.points.top.right[1],
                    shapes.segments.points.top.right[0],
                    shapes.segments.points.top.left[2],
                    shapes.segments.points.top.left[1],
                ],
                [
                    shapes.segments.points.top.left[1],
                    shapes.segments.points.top.left[3],
                    shapes.segments.points.middle.left[3],
                    shapes.segments.points.middle.left[1],
                    shapes.segments.points.middle.left[0],
                    shapes.segments.points.top.left[0],  
                ],
                [
                    shapes.segments.points.top.right[1],  
                    shapes.segments.points.top.right[3],  
                    shapes.segments.points.middle.right[3],
                    shapes.segments.points.middle.right[1],
                    shapes.segments.points.middle.right[2],
                    shapes.segments.points.top.right[2],  
                ],
                [
                    shapes.segments.points.middle.left[0], 
                    shapes.segments.points.middle.right[2],
                    shapes.segments.points.middle.right[1],
                    shapes.segments.points.middle.right[0],
                    shapes.segments.points.middle.left[2], 
                    shapes.segments.points.middle.left[1], 
                ],
                [
                    shapes.segments.points.middle.left[1],
                    shapes.segments.points.middle.left[4],
                    shapes.segments.points.bottom.left[3],
                    shapes.segments.points.bottom.left[1],
                    shapes.segments.points.bottom.left[0],
                    shapes.segments.points.middle.left[2],
                ],
                [
                    shapes.segments.points.middle.right[1],
                    shapes.segments.points.middle.right[4],
                    shapes.segments.points.bottom.right[3],
                    shapes.segments.points.bottom.right[1],
                    shapes.segments.points.bottom.right[2],
                    shapes.segments.points.middle.right[0],
                ],
                [
                    shapes.segments.points.bottom.left[0],
                    shapes.segments.points.bottom.right[2],
                    shapes.segments.points.bottom.right[1],
                    shapes.segments.points.bottom.right[0],
                    shapes.segments.points.bottom.left[2],
                    shapes.segments.points.bottom.left[1],
                ]
            ];
            for(var a = 0; a < points.length; a++){
                var temp = {
                    segment: system.utility.misc.elementMaker('path','arc',{path:points[a], lineType:'L', style:dimStyle}),
                    state: false
                };
                segments.push( temp );
                object.append( temp.segment );
            }


    //methods
        object.set = function(segment,state){
            segments[segment].state = state;
            if(state){ system.utility.element.setStyle(segments[segment].segment,glowStyle); }
            else{ system.utility.element.setStyle(segments[segment].segment,dimStyle); }
        };
        object.get = function(segment){ return segments[segment].state; };
        object.clear = function(){
            for(var a = 0; a < segments.length; a++){
                this.set(a,false);
            }
        };

        object.enterCharacter = function(char){
            var stamp = [];
            switch(char){
                case '0': stamp = [1,1,1,0,1,1,1]; break;
                case '1': stamp = [0,0,1,0,0,1,0]; break;
                case '2': stamp = [1,0,1,1,1,0,1]; break;
                case '3': stamp = [1,0,1,1,0,1,1]; break;
                case '4': stamp = [0,1,1,1,0,1,0]; break;
                case '5': stamp = [1,1,0,1,0,1,1]; break;
                case '6': stamp = [1,1,0,1,1,1,1]; break;
                case '7': stamp = [1,0,1,0,0,1,0]; break;
                case '8': stamp = [1,1,1,1,1,1,1]; break;
                case '9': stamp = [1,1,1,1,0,1,1]; break;
                default:  stamp = [0,0,0,0,0,0,0]; break;
            }

            for(var a = 0; a < stamp.length; a++){
                this.set(a, stamp[a]==1);
            }
        };

        object.test = function(){
            this.clear();
            this.enterCharacter('9');
        };

    return object;
};