this.sevenSegmentDisplay = function(
    name='sevenSegmentDisplay',
    x, y, width=20, height=30, angle=0,
    backgroundStyle='rgb(0,0,0)',
    glowStyle='rgb(200,200,200)',
    dimStyle='rgb(20,20,20)'
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
            var object = interfacePart.builder('group',name,{x:x, y:y});

        //backing
            var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, style:{fill:backgroundStyle} });
                object.append(rect);

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
                    segment: interfacePart.builder('polygon','segment_'+a,{points:points[a], style:{fill:dimStyle}}),
                    state: false
                };
                segments.push( temp );
                object.append( temp.segment );
            }

    //methods
        object.set = function(segment,state){
            segments[segment].state = state;
            if(state){ segments[segment].segment.style.fill = glowStyle; }
            else{ segments[segment].segment.style.fill = dimStyle; }
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
                case 0: case '0': stamp = [1,1,1,0,1,1,1]; break;
                case 1: case '1': stamp = [0,0,1,0,0,1,0]; break;
                case 2: case '2': stamp = [1,0,1,1,1,0,1]; break;
                case 3: case '3': stamp = [1,0,1,1,0,1,1]; break;
                case 4: case '4': stamp = [0,1,1,1,0,1,0]; break;
                case 5: case '5': stamp = [1,1,0,1,0,1,1]; break;
                case 6: case '6': stamp = [1,1,0,1,1,1,1]; break;
                case 7: case '7': stamp = [1,0,1,0,0,1,0]; break;
                case 8: case '8': stamp = [1,1,1,1,1,1,1]; break;
                case 9: case '9': stamp = [1,1,1,1,0,1,1]; break;
                default:  stamp = [0,0,0,0,0,0,0]; break;
            }

            for(var a = 0; a < stamp.length; a++){
                this.set(a, stamp[a]==1);
            }
        };

    return object;
};