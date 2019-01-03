this.sixteenSegmentDisplay_static = function(
    name='sixteenSegmentDisplay_static',
    x, y, width=20, height=30, angle=0, resolution=5, 
    backgroundStyle='rgb(0,0,0)',
    glowStyle='rgb(200,200,200)',
    dimStyle='rgb(20,20,20)',
){
    var margin = width/8;
    var division = width/8;
    var shapes = {
        segments:{
            points: {
                top:{
                    left:[
                        {x:division*0.5+margin,         y:division*0.5+margin},  //centre
                        {x:division*1.0+margin,         y:division*0.0+margin},  //top
                        {x:division*0.0+margin,         y:division*1.0+margin},  //left
                        {x:division*1.0+margin,         y:division*1.0+margin},  //inner point
                        {x:division*1.75+margin,        y:division*1.0+margin},  //inner point right
                        {x:division*1.0+margin,         y:division*1.75+margin}, //inner point down
                    ],
                    centre:[
                        {x:width/2,                     y:division*0.5+margin}, //central point
                        {x:width/2-division*0.5,        y:division*1.0+margin}, //lower left
                        {x:width/2+division*0.5,        y:division*1.0+margin}, //lower right
                        {x:width/2-division*0.5,        y:division*0.0+margin}, //upper left
                        {x:width/2+division*0.5,        y:division*0.0+margin}, //upper right
                    ],
                    right:[
                        {x:width-division*0.5-margin,   y:division*0.5+margin},  //centre
                        {x:width-division*1.0-margin,   y:division*0.0+margin},  //top
                        {x:width-division*0.0-margin,   y:division*1.0+margin},  //right
                        {x:width-division*1.0-margin,   y:division*1.0+margin},  //inner point
                        {x:width-division*1.0-margin,   y:division*1.75+margin}, //inner point down
                        {x:width-division*1.75-margin,  y:division*1.0+margin},  //inner point left
                    ]
                },
                middle:{
                    left:[
                        {x:division*0.0+margin,         y:height*0.5-division*0.5}, //top left
                        {x:division*1.0+margin,         y:height*0.5-division*0.5}, //top right
                        {x:division*0.5+margin,         y:height*0.5-division*0.0}, //centre
                        {x:division*0.0+margin,         y:height*0.5+division*0.5}, //bottom left
                        {x:division*1.0+margin,         y:height*0.5+division*0.5}, //bottom right
                    ],
                    centre:[
                        {x:width/2,                     y:height/2},                //central point
                        {x:width/2-division*0.5,        y:division*0.5+height/2},   //lower left
                        {x:width/2-division*0.25,       y:division*1.25+height/2},  //lower left down
                        {x:width/2-division*1.0,        y:division*0.5+height/2},   //lower left left
                        {x:width/2+division*0.5,        y:division*0.5+height/2},   //lower right
                        {x:width/2+division*0.5,        y:division*1.75+height/2},  //lower right down
                        {x:width/2+division*1.0,        y:division*0.5+height/2},   //lower right right
                        {x:width/2-division*0.5,        y:-division*0.5+height/2},  //upper left
                        {x:width/2-division*0.25,       y:-division*1.25+height/2}, //upper left up
                        {x:width/2-division*1.0,        y:-division*0.25+height/2}, //upper left left
                        {x:width/2+division*0.5,        y:-division*0.5+height/2},  //upper right
                        {x:width/2+division*0.5,        y:-division*1.75+height/2}, //upper right up
                        {x:width/2+division*1.0,        y:-division*0.25+height/2}, //upper right right
                    ],
                    right:[
                        {x:width-division*1.0-margin,   y:height*0.5-division*0.5}, //top left
                        {x:width-division*0.0-margin,   y:height*0.5-division*0.5}, //top right
                        {x:width-division*0.5-margin,   y:height*0.5-division*0.0}, //centre
                        {x:width-division*1.0-margin,   y:height*0.5+division*0.5}, //bottom left
                        {x:width-division*0.0-margin,   y:height*0.5+division*0.5}  //bottom right
                    ]
                },
                bottom: {
                    left:[
                        {x:division*0.5+margin,         y:height-division*0.5-margin}, //centre
                        {x:division*0.0+margin,         y:height-division*1.0-margin}, //left
                        {x:division*1.0+margin,         y:height-division*0.0-margin}, //bottom
                        {x:division*1.0+margin,         y:height-division*1.0-margin}, //inner point
                        {x:division*1.0+margin,         y:height-division*1.75-margin},//inner point up
                        {x:division*1.75+margin,        y:height-division*1.0-margin}, //inner point right
                    ],
                    centre:[
                        {x:width/2-division*0.5,        y:height-division*1.0-margin}, //upper left
                        {x:width/2+division*0.5,        y:height-division*1.0-margin}, //upper right
                        {x:width/2,                     y:height-division*0.5-margin}, //central point
                        {x:width/2-division*0.5,        y:height-division*0.0-margin}, //lower left
                        {x:width/2+division*0.5,        y:height-division*0.0-margin}, //lower right
                    ],
                    right:[
                        {x:width-division*0.5-margin,   y:height-division*0.5-margin}, //centre
                        {x:width-division*0.0-margin,   y:height-division*1.0-margin}, //right
                        {x:width-division*1.0-margin,   y:height-division*0.0-margin}, //bottom
                        {x:width-division*1.0-margin,   y:height-division*1.0-margin}, //inner point
                        {x:width-division*1.0-margin,   y:height-division*1.75-margin},//inner point up
                        {x:width-division*1.75-margin,  y:height-division*1.0-margin}, //inner point left
                    ]
                }
            }
        }
    };
    var points = [
        [
            shapes.segments.points.top.left[1],
            shapes.segments.points.top.left[0],
            shapes.segments.points.top.left[3],
            shapes.segments.points.top.centre[1],
            shapes.segments.points.top.centre[0],
            shapes.segments.points.top.centre[3],
        ],
        [
            shapes.segments.points.top.centre[4],
            shapes.segments.points.top.centre[0],
            shapes.segments.points.top.centre[2],
            shapes.segments.points.top.right[3],
            shapes.segments.points.top.right[0],
            shapes.segments.points.top.right[1],
        ],

        [
            shapes.segments.points.top.left[0],
            shapes.segments.points.top.left[2],
            shapes.segments.points.middle.left[0],
            shapes.segments.points.middle.left[2],
            shapes.segments.points.middle.left[1],
            shapes.segments.points.top.left[3],
        ],
        [
            shapes.segments.points.top.left[4],
            shapes.segments.points.top.left[3],
            shapes.segments.points.top.left[5],
            shapes.segments.points.middle.centre[9],
            shapes.segments.points.middle.centre[7],
            shapes.segments.points.middle.centre[8],
        ],
        [
            shapes.segments.points.top.centre[0],
            shapes.segments.points.top.centre[1],
            shapes.segments.points.middle.centre[7],
            shapes.segments.points.middle.centre[0],
            shapes.segments.points.middle.centre[10],
            shapes.segments.points.top.centre[2],
        ],
        [
            shapes.segments.points.top.right[4],
            shapes.segments.points.top.right[3],
            shapes.segments.points.top.right[5],
            shapes.segments.points.middle.centre[11],
            shapes.segments.points.middle.centre[10],
            shapes.segments.points.middle.centre[12],
        ],
        [
            shapes.segments.points.top.right[0],
            shapes.segments.points.top.right[2],
            shapes.segments.points.middle.right[1],
            shapes.segments.points.middle.right[2],
            shapes.segments.points.middle.right[0],
            shapes.segments.points.top.right[3],
        ],

        [
            shapes.segments.points.middle.left[4],
            shapes.segments.points.middle.left[2],
            shapes.segments.points.middle.left[1],
            shapes.segments.points.middle.centre[7],
            shapes.segments.points.middle.centre[0],
            shapes.segments.points.middle.centre[1],
        ],
        [
            shapes.segments.points.middle.right[3],
            shapes.segments.points.middle.right[2],
            shapes.segments.points.middle.right[0],
            shapes.segments.points.middle.centre[10],
            shapes.segments.points.middle.centre[0],
            shapes.segments.points.middle.centre[4],
        ],

        [
            shapes.segments.points.bottom.left[0],
            shapes.segments.points.bottom.left[1],
            shapes.segments.points.middle.left[3],
            shapes.segments.points.middle.left[2],
            shapes.segments.points.middle.left[4],
            shapes.segments.points.bottom.left[3],
        ],
        [
            shapes.segments.points.bottom.left[4],
            shapes.segments.points.bottom.left[3],
            shapes.segments.points.bottom.left[5],
            shapes.segments.points.middle.centre[2],
            shapes.segments.points.middle.centre[1],
            shapes.segments.points.middle.centre[3],
        ],
        [
            shapes.segments.points.bottom.centre[0],
            shapes.segments.points.bottom.centre[2],
            shapes.segments.points.bottom.centre[1],
            shapes.segments.points.middle.centre[4],
            shapes.segments.points.middle.centre[0],
            shapes.segments.points.middle.centre[1],
        ],
        [
            shapes.segments.points.bottom.right[4],
            shapes.segments.points.bottom.right[3],
            shapes.segments.points.bottom.right[5],
            shapes.segments.points.middle.centre[5],
            shapes.segments.points.middle.centre[4],
            shapes.segments.points.middle.centre[6],
        ],
        [
            shapes.segments.points.bottom.right[3],
            shapes.segments.points.middle.right[3],
            shapes.segments.points.middle.right[2],
            shapes.segments.points.middle.right[4],
            shapes.segments.points.bottom.right[1],
            shapes.segments.points.bottom.right[0],
        ],

        [
            shapes.segments.points.bottom.left[2],
            shapes.segments.points.bottom.left[0],
            shapes.segments.points.bottom.left[3],
            shapes.segments.points.bottom.centre[0],
            shapes.segments.points.bottom.centre[2],
            shapes.segments.points.bottom.centre[3],
        ],
        [
            shapes.segments.points.bottom.right[2],
            shapes.segments.points.bottom.right[0],
            shapes.segments.points.bottom.right[3],
            shapes.segments.points.bottom.centre[1],
            shapes.segments.points.bottom.centre[2],
            shapes.segments.points.bottom.centre[4],
        ],
    ];
    stamp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //canvas
            var canvas = interfacePart.builder('canvas','subcanvas',{ width:width, height:height, resolution:resolution });
            object.append(canvas);

    //graphics
    function clear(){
        canvas._.fillStyle = backgroundStyle;
        canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
    };
    function drawChar(){
        for(var a = 0; a < points.length; a++){
            canvas._.beginPath(); 
            canvas._.moveTo(canvas.$(points[a][0].x),canvas.$(points[a][0].y));
            for(var b = 1; b < points[a].length; b++){
                canvas._.lineTo(canvas.$(points[a][b].x),canvas.$(points[a][b].y));
            }
            canvas._.closePath(); 
            canvas._.fillStyle = stamp[a] == 0 ? dimStyle : glowStyle;
            canvas._.fill(); 
        }
    }


    //methods
        object.set = function(segment,state){
            stamp[segment].state = state;
            drawChar();
        };
        object.get = function(segment){ return segments[segment].state; };
        object.clear = function(){
            for(var a = 0; a < segments.length; a++){
                this.set(a,false);
            }
        };

        object.enterCharacter = function(char){
            switch(char){
                case '!': 
                    stamp = [
                        1,1,
                        0,1,1,1,0,
                        0,0,
                        0,0,0,0,0,
                        1,1,
                    ]; 
                break;
                case '?': 
                    stamp = [
                        1,1,
                        0,0,0,0,1,
                        0,1,
                        0,0,0,0,0,
                        1,1,
                    ]; 
                break;
                case '.': 
                    stamp = [
                        0,0,
                        0,0,0,0,0,
                        0,0,
                        0,0,0,0,0,
                        1,0,
                    ]; 
                break;
                case ',': 
                    stamp = [
                        0,0,
                        0,0,0,0,0,
                        0,0,
                        0,0,1,0,0,
                        0,0,
                    ]; 
                break;
                case '\'': 
                    stamp = [
                        0,0,
                        1,0,0,0,0,
                        0,0,
                        0,0,0,0,0,
                        0,0,
                    ]; 
                break;
                case ':':
                    stamp = [
                        0,0,
                        0,1,0,1,0,
                        0,0,
                        0,1,0,1,0,
                        0,0,
                    ]; 
                break;
                case '"': 
                    stamp = [
                        0,0,
                        1,0,1,0,0,
                        0,0,
                        0,0,0,0,0,
                        0,0,
                    ]; 
                break;
                case '_': 
                    stamp = [
                        0,0,
                        0,0,0,0,0,
                        0,0,
                        0,0,0,0,0,
                        1,1,
                    ]; 
                break;
                case '-': 
                    stamp = [
                        0,0,
                        0,0,0,0,0,
                        1,1,
                        0,0,0,0,0,
                        0,0,
                    ]; 
                break;
                case '\\': 
                    stamp = [
                        0,0,
                        0,1,0,0,0,
                        0,0,
                        0,0,0,1,0,
                        0,0,
                    ]; 
                break;
                case '/': 
                    stamp = [
                        0,0,
                        0,0,0,1,0,
                        0,0,
                        0,1,0,0,0,
                        0,0,
                    ]; 
                break;
                case '*': 
                    stamp = [
                        0,0,
                        0,1,1,1,0,
                        1,1,
                        0,1,1,1,0,
                        0,0,
                    ]; 
                break;
                case '#': 
                    stamp = [
                        1,1,
                        1,0,1,0,1,
                        1,1,
                        1,0,1,0,1,
                        1,1,
                    ]; 
                break;
                case '<': 
                    stamp = [
                        0,0,
                        0,0,0,1,0,
                        0,0,
                        0,0,0,1,0,
                        0,0,
                    ]; 
                break;
                case '>': 
                    stamp = [
                        0,0,
                        0,1,0,0,0,
                        0,0,
                        0,1,0,0,0,
                        0,0,
                    ]; 
                break;
                case '(': 
                    stamp = [
                        0,1,
                        0,0,1,0,0,
                        0,0,
                        0,0,1,0,0,
                        0,1,
                    ]; 
                break;
                case ')': 
                    stamp = [
                        1,0,
                        0,0,1,0,0,
                        0,0,
                        0,0,1,0,0,
                        1,0,
                    ]; 
                break;
                case '[': 
                    stamp = [
                        1,1,
                        1,0,0,0,0,
                        0,0,
                        1,0,0,0,0,
                        1,1,
                    ]; 
                break;
                case ']': 
                    stamp = [
                        1,1,
                        0,0,0,0,1,
                        0,0,
                        0,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case '{': 
                    stamp = [
                        1,1,
                        0,1,0,0,0,
                        1,0,
                        0,1,0,0,0,
                        1,1,
                    ]; 
                break;
                case '}': 
                    stamp = [
                        1,1,
                        0,0,0,1,0,
                        0,1,
                        0,0,0,1,0,
                        1,1,
                    ]; 
                break;

                case '0': case 0: 
                    stamp = [
                        1,1,
                        1,0,0,1,1,
                        0,0,
                        1,1,0,0,1,
                        1,1,
                    ]; 
                break;
                case '1': case 1: 
                    stamp = [
                        1,0,
                        0,0,1,0,0,
                        0,0,
                        0,0,1,0,0,
                        1,1,
                    ]; 
                break;
                case '2': case 2: 
                    stamp = [
                        1,1,
                        0,0,0,0,1,
                        0,1,
                        0,1,0,0,0,
                        1,1,
                    ]; 
                break;
                case '3': case 3:
                    stamp = [
                        1,1,
                        0,0,0,0,1,
                        1,1,
                        0,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case '4': case 4:
                    stamp = [
                        0,0,
                        1,0,0,0,1,
                        1,1,
                        0,0,0,0,1,
                        0,0,
                    ]; 
                break;
                case '5': case 5:
                    stamp = [
                        1,1,
                        1,0,0,0,0,
                        1,1,
                        0,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case '6': case 6:
                    stamp = [
                        1,1,
                        1,0,0,0,0,
                        1,1,
                        1,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case '7': case 7:
                    stamp = [
                        1,1,
                        0,0,0,1,0,
                        0,0,
                        0,1,0,0,0,
                        0,0,
                    ]; 
                break;
                case '8': case 8:
                    stamp = [
                        1,1,
                        1,0,0,0,1,
                        1,1,
                        1,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case '9': case 9:
                    stamp = [
                        1,1,
                        1,0,0,0,1,
                        1,1,
                        0,0,0,0,1,
                        1,1,
                    ]; 
                break;

                case 'a': case 'A': 
                    stamp = [
                        1,1,
                        1,0,0,0,1,
                        1,1,
                        1,0,0,0,1,
                        0,0,
                    ]; 
                break;
                case 'b': case 'B': 
                    stamp = [
                        1,1,
                        0,0,1,0,1,
                        0,1,
                        0,0,1,0,1,
                        1,1,
                    ]; 
                break;
                case 'c': case 'C': 
                    stamp = [
                        1,1,
                        1,0,0,0,0,
                        0,0,
                        1,0,0,0,0,
                        1,1,
                    ]; 
                break;
                case 'd': case 'D': 
                    stamp = [
                        1,1,
                        0,0,1,0,1,
                        0,0,
                        0,0,1,0,1,
                        1,1,
                    ]; 
                break;
                case 'e': case 'E': 
                    stamp = [
                        1,1,
                        1,0,0,0,0,
                        1,1,
                        1,0,0,0,0,
                        1,1,
                    ]; 
                break;
                case 'f': case 'F': 
                    stamp = [
                        1,1,
                        1,0,0,0,0,
                        1,1,
                        1,0,0,0,0,
                        0,0,
                    ]; 
                break;
                case 'g': case 'G': 
                    stamp = [
                        1,1,
                        1,0,0,0,0,
                        0,1,
                        1,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case 'h': case 'H': 
                    stamp = [
                        0,0,
                        1,0,0,0,1,
                        1,1,
                        1,0,0,0,1,
                        0,0,
                    ]; 
                break;
                case 'i': case 'I': 
                    stamp = [
                        1,1,
                        0,0,1,0,0,
                        0,0,
                        0,0,1,0,0,
                        1,1,
                    ]; 
                break;
                case 'j': case 'J': 
                    stamp = [
                        1,1,
                        0,0,1,0,0,
                        0,0,
                        0,0,1,0,0,
                        1,0,
                    ]; 
                break;
                case 'k': case 'K': 
                    stamp = [
                        0,0,
                        1,0,0,1,0,
                        1,0,
                        1,0,0,1,0,
                        0,0,
                    ]; 
                break;
                case 'l': case 'L': 
                    stamp = [
                        0,0,
                        1,0,0,0,0,
                        0,0,
                        1,0,0,0,0,
                        1,1,
                    ]; 
                break;
                case 'm': case 'M': 
                    stamp = [
                        0,0,
                        1,1,0,1,1,
                        0,0,
                        1,0,0,0,1,
                        0,0,
                    ]; 
                break;
                case 'n': case 'N': 
                    stamp = [
                        0,0,
                        1,1,0,0,1,
                        0,0,
                        1,0,0,1,1,
                        0,0,
                    ]; 
                break;
                case 'o': case 'O': 
                    stamp = [
                        1,1,
                        1,0,0,0,1,
                        0,0,
                        1,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case 'p': case 'P': 
                    stamp = [
                        1,1,
                        1,0,0,0,1,
                        1,1,
                        1,0,0,0,0,
                        0,0,
                    ];
                break;
                case 'q': case 'Q': 
                    stamp = [
                        1,1,
                        1,0,0,0,1,
                        0,0,
                        1,0,0,1,1,
                        1,1,
                    ]; 
                break;
                case 'r': case 'R': 
                    stamp = [
                        1,1,
                        1,0,0,0,1,
                        1,1,
                        1,0,0,1,0,
                        0,0,
                    ]; 
                break;
                case 's': case 'S': 
                    stamp = [
                        1,1,
                        1,0,0,0,0,
                        1,1,
                        0,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case 't': case 'T': 
                    stamp = [
                        1,1,
                        0,0,1,0,0,
                        0,0,
                        0,0,1,0,0,
                        0,0,
                    ]; 
                break;
                case 'u': case 'U': 
                    stamp = [
                        0,0,
                        1,0,0,0,1,
                        0,0,
                        1,0,0,0,1,
                        1,1,
                    ]; 
                break;
                case 'v': case 'V': 
                    stamp = [
                        0,0,
                        1,0,0,1,0,
                        0,0,
                        1,1,0,0,0,
                        0,0,
                    ]; 
                break;
                case 'w': case 'W': 
                    stamp = [
                        0,0,
                        1,0,0,0,1,
                        0,0,
                        1,1,0,1,1,
                        0,0,
                    ]; 
                break;
                case 'x': case 'X': 
                    stamp = [
                        0,0,
                        0,1,0,1,0,
                        0,0,
                        0,1,0,1,0,
                        0,0,
                    ]; 
                break;
                case 'y': case 'Y': 
                    stamp = [
                        0,0,
                        0,1,0,1,0,
                        0,0,
                        0,0,1,0,0,
                        0,0,
                    ]; 
                break;
                case 'z': case 'Z': 
                    stamp = [
                        1,1,
                        0,0,0,1,0,
                        0,0,
                        0,1,0,0,0,
                        1,1,
                    ]; 
                break;

                case 'all': stamp = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]; break;
                default:
                    stamp = [
                        0,0,
                        0,0,0,0,0,
                        0,0,
                        0,0,0,0,0,
                        0,0,
                    ];
                break;
            }

            clear();
            drawChar();
        };


    //setup
        clear();
        drawChar();

    return object;      
};