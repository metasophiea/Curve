this.sixteenSegmentDisplay = function(
    id='sixteenSegmentDisplay',
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
                        {x:division*0.5+margin,         y:division*0.5+margin},  //center
                        {x:division*1.0+margin,         y:division*0.0+margin},  //top
                        {x:division*0.0+margin,         y:division*1.0+margin},  //left
                        {x:division*1.0+margin,         y:division*1.0+margin},  //inner point
                        {x:division*1.75+margin,        y:division*1.0+margin},  //inner point right
                        {x:division*1.0+margin,         y:division*1.75+margin}, //inner point down
                    ],
                    center:[
                        {x:width/2,                     y:division*0.5+margin}, //central point
                        {x:width/2-division*0.5,        y:division*1.0+margin}, //lower left
                        {x:width/2+division*0.5,        y:division*1.0+margin}, //lower right
                        {x:width/2-division*0.5,        y:division*0.0+margin}, //upper left
                        {x:width/2+division*0.5,        y:division*0.0+margin}, //upper right
                    ],
                    right:[
                        {x:width-division*0.5-margin,   y:division*0.5+margin},  //center
                        {x:width-division*1.0-margin,   y:division*0.0+margin},  //top
                        {x:width-division*0.0-margin,   y:division*1.0+margin},  //right
                        {x:width-division*1.0-margin,   y:division*1.0+margin},  //inner point
                        {x:width-division*1.0-margin,   y:division*1.75+margin}, //inner point down
                        {x:width-division*1.75-margin,  y:division*1.0+margin},  //inner point left
                    ]
                },
                middle:{
                    left:[
                        {x:division*0.0+margin,         y:height*0.5-division*1.0+margin*0.5}, //top left
                        {x:division*1.0+margin,         y:height*0.5-division*1.0+margin*0.5}, //top right
                        {x:division*0.5+margin,         y:height*0.5-division*0.5+margin*0.5}, //center
                        {x:division*0.0+margin,         y:height*0.5-division*0.0+margin*0.5}, //bottom left
                        {x:division*1.0+margin,         y:height*0.5-division*0.0+margin*0.5}, //bottom right
                    ],
                    center:[
                        {x:width/2,                     y:height/2},               //central point
                        {x:width/2-division*0.5,        y:division*0.5+height/2},  //lower left
                        {x:width/2-division*0.5,        y:division*1.0+height/2},  //lower left down
                        {x:width/2-division*1.0,        y:division*0.5+height/2},  //lower left left
                        {x:width/2+division*0.5,        y:division*0.5+height/2},  //lower right
                        {x:width/2+division*0.5,        y:division*1.0+height/2},  //lower right down
                        {x:width/2+division*1.0,        y:division*0.5+height/2},  //lower right right
                        {x:width/2-division*0.5,        y:-division*0.5+height/2}, //upper left
                        {x:width/2-division*0.5,        y:-division*1.0+height/2}, //upper left up
                        {x:width/2-division*1.0,        y:-division*0.5+height/2}, //upper left left
                        {x:width/2+division*0.5,        y:-division*0.5+height/2}, //upper right
                        {x:width/2+division*0.5,        y:-division*1.0+height/2}, //upper right up
                        {x:width/2+division*1.0,        y:-division*0.5+height/2}, //upper right right
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:height*0.5-division*1.0+margin*0.5}, //top left
                        {x:width-division*0.0-margin,   y:height*0.5-division*1.0+margin*0.5}, //top right
                        {x:width-division*0.5-margin,   y:height*0.5-division*0.5+margin*0.5}, //center
                        {x:width-division*1.0-margin,   y:height*0.5-division*0.0+margin*0.5}, //bottom left
                        {x:width-division*0.0-margin,   y:height*0.5-division*0.0+margin*0.5}  //bottom right
                    ]
                },
                bottom: {
                    left:[
                        {x:division*0.5+margin,         y:height-division*0.5-margin}, //center
                        {x:division*0.0+margin,         y:height-division*1.0-margin}, //left
                        {x:division*1.0+margin,         y:height-division*0.0-margin}, //bottom
                        {x:division*1.0+margin,         y:height-division*1.0-margin}, //inner point
                        {x:division*1.0+margin,         y:height-division*1.5-margin}, //inner point up
                        {x:division*1.5+margin,         y:height-division*1.0-margin}, //inner point right
                    ],
                    center:[
                        {x:width/2-division*0.5,        y:height-division*1.0-margin}, //lower left
                        {x:width/2+division*0.5,        y:height-division*1.0-margin}, //lower right
                        {x:width/2,                     y:height-division*0.5-margin}, //central point
                        {x:width/2-division*0.5,        y:height-division*0.0-margin}, //upper left
                        {x:width/2+division*0.5,        y:height-division*0.0-margin}, //upper right
                    ],
                    right:[
                        {x:width-division*0.5-margin,   y:height-division*0.5-margin}, //center
                        {x:width-division*0.0-margin,   y:height-division*1.0-margin}, //right
                        {x:width-division*1.0-margin,   y:height-division*0.0-margin}, //bottom
                        {x:width-division*1.0-margin,   y:height-division*1.0-margin}, //inner point
                        {x:width-division*1.0-margin,   y:height-division*1.5-margin}, //inner point up
                        {x:width-division*1.5-margin,   y:height-division*1.0-margin}, //inner point left
                    ]
                }
            }
        }
    };


    //elements
        //main
        var object = parts.basic.g(id, x, y);

        //backing
        var rect = parts.basic.rect(null, 0, 0, width, height, 0, backgroundStyle);
            object.appendChild(rect);



        var keys = Object.keys(shapes.segments.points);
        for(var a = 0; a < keys.length; a++){
            var subkeys = Object.keys(shapes.segments.points[keys[a]]);
            for(var b = 0; b < subkeys.length; b++){
                for(var c = 0; c < shapes.segments.points[keys[a]][subkeys[b]].length; c++){
                    object.appendChild(__globals.utility.workspace.dotMaker(
                        shapes.segments.points[keys[a]][subkeys[b]][c].x, shapes.segments.points[keys[a]][subkeys[b]][c].y, undefined, 0.25
                    ));
                }
            }
        }


        //segments
            var segments = [];
            var points = [];
            for(var a = 0; a < points.length; a++){
                var temp = {
                    segment: parts.basic.path(null, points[a], 'L', dimStyle),
                    state: false
                };
                segments.push( temp );
                object.append( temp.segment );
            }


    //methods
        object.set = function(segment,state){
            segments[segment].state = state;
            if(state){ __globals.utility.element.setStyle(segments[segment].segment,glowStyle); }
            else{ __globals.utility.element.setStyle(segments[segment].segment,dimStyle); }
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