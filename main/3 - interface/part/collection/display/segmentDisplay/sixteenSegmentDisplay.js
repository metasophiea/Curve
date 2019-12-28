this.sixteenSegmentDisplay = function(
    name='sixteenSegmentDisplay', static=false, resolution=2, 
    x=0, y=0, width=20, height=30, angle=0,
    backgroundStyle={r:0,g:0,b:0,a:1},
    glowStyle={r:0.78,g:0.78,b:0.78,a:1},
    dimStyle={r:0.1,g:0.1,b:0.1,a:1},
){
    dev.log.partDisplay('.sixteenSegmentDisplay('+name+','+static+','+resolution+','+x+','+y+','+width+','+height+','+angle+','+JSON.stringify(backgroundStyle)+','+JSON.stringify(glowStyle)+','+JSON.stringify(dimStyle)+')'); //#development
    
    const margin = width/8;
    const division = width/8;
    const shapes = {
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
    const points = [
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
    function getStamp(character){
        dev.log.partDisplay('.sevenSegmentDisplay::getStamp('+character+')'); //#development

        switch(character){
            case '!': 
                return [
                    1,1,
                    0,1,1,1,0,
                    0,0,
                    0,0,0,0,0,
                    1,1,
                ]; 
            case '?': 
                return [
                    1,1,
                    0,0,0,0,1,
                    0,1,
                    0,0,0,0,0,
                    1,1,
                ]; 
            case '.': 
                return [
                    0,0,
                    0,0,0,0,0,
                    0,0,
                    0,0,0,0,0,
                    1,0,
                ]; 
            case ',': 
                return [
                    0,0,
                    0,0,0,0,0,
                    0,0,
                    0,0,1,0,0,
                    0,0,
                ]; 
            case '\'': 
                return [
                    0,0,
                    1,0,0,0,0,
                    0,0,
                    0,0,0,0,0,
                    0,0,
                ]; 
            case ':':
                return [
                    0,0,
                    0,1,0,1,0,
                    0,0,
                    0,1,0,1,0,
                    0,0,
                ]; 
            case '"': 
                return [
                    0,0,
                    1,0,1,0,0,
                    0,0,
                    0,0,0,0,0,
                    0,0,
                ]; 
            case '_': 
                return [
                    0,0,
                    0,0,0,0,0,
                    0,0,
                    0,0,0,0,0,
                    1,1,
                ]; 
            case '-': 
                return [
                    0,0,
                    0,0,0,0,0,
                    1,1,
                    0,0,0,0,0,
                    0,0,
                ]; 
            case '\\': 
                return [
                    0,0,
                    0,1,0,0,0,
                    0,0,
                    0,0,0,1,0,
                    0,0,
                ]; 
            case '/': 
                return [
                    0,0,
                    0,0,0,1,0,
                    0,0,
                    0,1,0,0,0,
                    0,0,
                ]; 
            case '*': 
                return [
                    0,0,
                    0,1,1,1,0,
                    1,1,
                    0,1,1,1,0,
                    0,0,
                ]; 
            case '#': 
                return [
                    1,1,
                    1,0,1,0,1,
                    1,1,
                    1,0,1,0,1,
                    1,1,
                ]; 
            case '<': 
                return [
                    0,0,
                    0,0,0,1,0,
                    0,0,
                    0,0,0,1,0,
                    0,0,
                ]; 
            case '>': 
                return [
                    0,0,
                    0,1,0,0,0,
                    0,0,
                    0,1,0,0,0,
                    0,0,
                ]; 
            case '(': 
                return [
                    0,1,
                    0,0,1,0,0,
                    0,0,
                    0,0,1,0,0,
                    0,1,
                ]; 
            case ')': 
                return [
                    1,0,
                    0,0,1,0,0,
                    0,0,
                    0,0,1,0,0,
                    1,0,
                ]; 
            case '[': 
                return [
                    1,1,
                    1,0,0,0,0,
                    0,0,
                    1,0,0,0,0,
                    1,1,
                ]; 
            case ']': 
                return [
                    1,1,
                    0,0,0,0,1,
                    0,0,
                    0,0,0,0,1,
                    1,1,
                ]; 
            case '{': 
                return [
                    1,1,
                    0,1,0,0,0,
                    1,0,
                    0,1,0,0,0,
                    1,1,
                ]; 
            case '}': 
                return [
                    1,1,
                    0,0,0,1,0,
                    0,1,
                    0,0,0,1,0,
                    1,1,
                ]; 

            case '0': case 0: 
                return [
                    1,1,
                    1,0,0,1,1,
                    0,0,
                    1,1,0,0,1,
                    1,1,
                ]; 
            case '1': case 1: 
                return [
                    1,0,
                    0,0,1,0,0,
                    0,0,
                    0,0,1,0,0,
                    1,1,
                ]; 
            case '2': case 2: 
                return [
                    1,1,
                    0,0,0,0,1,
                    0,1,
                    0,1,0,0,0,
                    1,1,
                ]; 
            case '3': case 3:
                return [
                    1,1,
                    0,0,0,0,1,
                    1,1,
                    0,0,0,0,1,
                    1,1,
                ]; 
            case '4': case 4:
                return [
                    0,0,
                    1,0,0,0,1,
                    1,1,
                    0,0,0,0,1,
                    0,0,
                ]; 
            case '5': case 5:
                return [
                    1,1,
                    1,0,0,0,0,
                    1,1,
                    0,0,0,0,1,
                    1,1,
                ]; 
            case '6': case 6:
                return [
                    1,1,
                    1,0,0,0,0,
                    1,1,
                    1,0,0,0,1,
                    1,1,
                ]; 
            case '7': case 7:
                return [
                    1,1,
                    0,0,0,1,0,
                    0,0,
                    0,1,0,0,0,
                    0,0,
                ]; 
            case '8': case 8:
                return [
                    1,1,
                    1,0,0,0,1,
                    1,1,
                    1,0,0,0,1,
                    1,1,
                ]; 
            case '9': case 9:
                return [
                    1,1,
                    1,0,0,0,1,
                    1,1,
                    0,0,0,0,1,
                    1,1,
                ]; 

            case 'a': case 'A': 
                return [
                    1,1,
                    1,0,0,0,1,
                    1,1,
                    1,0,0,0,1,
                    0,0,
                ]; 
            case 'b': case 'B': 
                return [
                    1,1,
                    0,0,1,0,1,
                    0,1,
                    0,0,1,0,1,
                    1,1,
                ]; 
            case 'c': case 'C': 
                return [
                    1,1,
                    1,0,0,0,0,
                    0,0,
                    1,0,0,0,0,
                    1,1,
                ]; 
            case 'd': case 'D': 
                return [
                    1,1,
                    0,0,1,0,1,
                    0,0,
                    0,0,1,0,1,
                    1,1,
                ]; 
            case 'e': case 'E': 
                return [
                    1,1,
                    1,0,0,0,0,
                    1,1,
                    1,0,0,0,0,
                    1,1,
                ]; 
            case 'f': case 'F': 
                return [
                    1,1,
                    1,0,0,0,0,
                    1,1,
                    1,0,0,0,0,
                    0,0,
                ]; 
            case 'g': case 'G': 
                return [
                    1,1,
                    1,0,0,0,0,
                    0,1,
                    1,0,0,0,1,
                    1,1,
                ]; 
            case 'h': case 'H': 
                return [
                    0,0,
                    1,0,0,0,1,
                    1,1,
                    1,0,0,0,1,
                    0,0,
                ]; 
            case 'i': case 'I': 
                return [
                    1,1,
                    0,0,1,0,0,
                    0,0,
                    0,0,1,0,0,
                    1,1,
                ]; 
            case 'j': case 'J': 
                return [
                    1,1,
                    0,0,1,0,0,
                    0,0,
                    0,0,1,0,0,
                    1,0,
                ]; 
            case 'k': case 'K': 
                return [
                    0,0,
                    1,0,0,1,0,
                    1,0,
                    1,0,0,1,0,
                    0,0,
                ]; 
            case 'l': case 'L': 
                return [
                    0,0,
                    1,0,0,0,0,
                    0,0,
                    1,0,0,0,0,
                    1,1,
                ]; 
            case 'm': case 'M': 
                return [
                    0,0,
                    1,1,0,1,1,
                    0,0,
                    1,0,0,0,1,
                    0,0,
                ]; 
            case 'n': case 'N': 
                return [
                    0,0,
                    1,1,0,0,1,
                    0,0,
                    1,0,0,1,1,
                    0,0,
                ]; 
            case 'o': case 'O': 
                return [
                    1,1,
                    1,0,0,0,1,
                    0,0,
                    1,0,0,0,1,
                    1,1,
                ]; 
            case 'p': case 'P': 
                return [
                    1,1,
                    1,0,0,0,1,
                    1,1,
                    1,0,0,0,0,
                    0,0,
                ];
            case 'q': case 'Q': 
                return [
                    1,1,
                    1,0,0,0,1,
                    0,0,
                    1,0,0,1,1,
                    1,1,
                ]; 
            case 'r': case 'R': 
                return [
                    1,1,
                    1,0,0,0,1,
                    1,1,
                    1,0,0,1,0,
                    0,0,
                ]; 
            case 's': case 'S': 
                return [
                    1,1,
                    1,0,0,0,0,
                    1,1,
                    0,0,0,0,1,
                    1,1,
                ]; 
            case 't': case 'T': 
                return [
                    1,1,
                    0,0,1,0,0,
                    0,0,
                    0,0,1,0,0,
                    0,0,
                ]; 
            case 'u': case 'U': 
                return [
                    0,0,
                    1,0,0,0,1,
                    0,0,
                    1,0,0,0,1,
                    1,1,
                ]; 
            case 'v': case 'V': 
                return [
                    0,0,
                    1,0,0,1,0,
                    0,0,
                    1,1,0,0,0,
                    0,0,
                ]; 
            case 'w': case 'W': 
                return [
                    0,0,
                    1,0,0,0,1,
                    0,0,
                    1,1,0,1,1,
                    0,0,
                ]; 
            case 'x': case 'X': 
                return [
                    0,0,
                    0,1,0,1,0,
                    0,0,
                    0,1,0,1,0,
                    0,0,
                ]; 
            case 'y': case 'Y': 
                return [
                    0,0,
                    0,1,0,1,0,
                    0,0,
                    0,0,1,0,0,
                    0,0,
                ]; 
            case 'z': case 'Z': 
                return [
                    1,1,
                    0,0,0,1,0,
                    0,0,
                    0,1,0,0,0,
                    1,1,
                ]; 

            case 'all': 
                return [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
            default:
                return [
                    0,0,
                    0,0,0,0,0,
                    0,0,
                    0,0,0,0,0,
                    0,0,
                ];
        }
    }

    if(static){
        let stamp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        //elements 
            const object = interfacePart.builder('basic','group',name,{x:x, y:y});
            const canvas = interfacePart.builder('basic','canvas','backing',{ width:width, height:height, colour:backgroundStyle,resolution:resolution });
                object.append(canvas);

        //graphics
            function clear(){
                dev.log.partDisplay('.sixteenSegmentDisplay::clear()'); //#development

                canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba(backgroundStyle);
                canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
                canvas.requestUpdate();
            };
            function drawChar(){
                dev.log.partDisplay('.sixteenSegmentDisplay::drawChar()'); //#development

                //draw segments in 
                    for(let a = 0; a < points.length; a++){
                        canvas._.beginPath(); 
                        canvas._.moveTo(canvas.$(points[a][0].x),canvas.$(points[a][0].y));
                        for(let b = 1; b < points[a].length; b++){
                            canvas._.lineTo(canvas.$(points[a][b].x),canvas.$(points[a][b].y));
                        }
                        canvas._.closePath(); 
                        canvas._.fillStyle = stamp[a] == 0 ? _canvas_.library.math.convertColour.obj2rgba(dimStyle) : _canvas_.library.math.convertColour.obj2rgba(glowStyle);
                        canvas._.fill(); 
                    }
                    canvas.requestUpdate();
            }

        //methods
            object.set = function(segment,state){
                dev.log.partDisplay('.sixteenSegmentDisplay.set('+segment+','+state+')'); //#development
                clear();
                stamp[segment] = state;
                drawChar();
            };
            object.get = function(segment){ 
                if(segment==undefined){
                    console.error('sevenSegmentDisplay_static::get: must provide segment value'); 
                    return;
                } 
                return stamp[segment].state;
            };
            object.clear = function(){
                dev.log.partDisplay('.sixteenSegmentDisplay.clear()'); //#development
                clear();
                for(let a = 0; a < stamp.length; a++){
                    this.set(a,false);
                }
                drawChar();
            };

            object.enterCharacter = function(char){
                dev.log.partDisplay('.sixteenSegmentDisplay.enterCharacter('+char+')'); //#development
                stamp = getStamp(char);

                clear();
                drawChar();
            };

        //setup
            clear();
            drawChar();

        return(object);
    }else{
        //elements 
            const object = interfacePart.builder('basic','group',name,{x:x, y:y});
            const backing = interfacePart.builder('basic','rectangle','backing',{ width:width, height:height, angle:angle, colour:backgroundStyle });
                object.append(backing);

            //segments
                const segments = [];
                for(let a = 0; a < points.length; a++){
                    segments[a] = {
                        segment:interfacePart.builder('basic','polygon','segment_'+a,{ pointsAsXYArray:points[a], colour:dimStyle }), 
                        state:false
                    };
                    object.append(segments[a].segment);
                }

        //methods
            object.set = function(segment,state){
                dev.log.partDisplay('.sixteenSegmentDisplay.set('+segment+','+state+')'); //#development
                segments[segment].state = state;
                if(state){ segments[segment].segment.colour(glowStyle); }
                else{ segments[segment].segment.colour(dimStyle); }
            };
            object.get = function(segment){
                return segments[segment].state;
            };
            object.clear = function(){
                dev.log.partDisplay('.sixteenSegmentDisplay.clear()'); //#development
                for(let a = 0; a < segments.length; a++){
                    this.set(a,false);
                }
            };
            object.enterCharacter = function(char){
                dev.log.partDisplay('.sixteenSegmentDisplay.enterCharacter('+char+')'); //#development
                stamp = getStamp(char);

                for(let a = 0; a < stamp.length; a++){
                    this.set(a, stamp[a]==1);
                }
            };

        return object;
    }
};

interfacePart.partLibrary.display.sixteenSegmentDisplay = function(name,data){ 
    return interfacePart.collection.display.sixteenSegmentDisplay(
        name, data.static, data.resolution, data.x, data.y, data.width, data.height, data.angle,
        data.style.background, data.style.glow, data.style.dim
    );
};