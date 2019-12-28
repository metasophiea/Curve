this.readout_sixteenSegmentDisplay = function(
    name='readout_sixteenSegmentDisplay', static=false, resolution=1, 
    x=0, y=0, width=100, height=30, count=5, angle=0, decimalPlaces=false,
    backgroundStyle={r:0,g:0,b:0,a:1},
    glowStyle={r:0.78,g:0.78,b:0.78,a:1},
    dimStyle={r:0.1,g:0.1,b:0.1,a:1},
){
    dev.log.partDisplay('.readout_sixteenSegmentDisplay('+name+','+static+','+resolution+','+x+','+y+','+width+','+height+','+angle+','+decimalPlaces+','+JSON.stringify(backgroundStyle)+','+JSON.stringify(glowStyle)+','+JSON.stringify(dimStyle)+')'); //#development
    
    //values
        let text = '';
        let displayInterval = null;
        const displayIntervalTime = 150;

    //elements 
        //main
            const object = interfacePart.builder('basic', 'group', name, {x:x, y:y, angle:angle});

    if(static){
        const margin = (width/count)/8;
        const division = (width/count)/8;
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
                            {x:(width/count)/2,                     y:division*0.5+margin}, //central point
                            {x:(width/count)/2-division*0.5,        y:division*1.0+margin}, //lower left
                            {x:(width/count)/2+division*0.5,        y:division*1.0+margin}, //lower right
                            {x:(width/count)/2-division*0.5,        y:division*0.0+margin}, //upper left
                            {x:(width/count)/2+division*0.5,        y:division*0.0+margin}, //upper right
                        ],
                        right:[
                            {x:(width/count)-division*0.5-margin,   y:division*0.5+margin},  //centre
                            {x:(width/count)-division*1.0-margin,   y:division*0.0+margin},  //top
                            {x:(width/count)-division*0.0-margin,   y:division*1.0+margin},  //right
                            {x:(width/count)-division*1.0-margin,   y:division*1.0+margin},  //inner point
                            {x:(width/count)-division*1.0-margin,   y:division*1.75+margin}, //inner point down
                            {x:(width/count)-division*1.75-margin,  y:division*1.0+margin},  //inner point left
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
                            {x:(width/count)/2,                     y:height/2},                //central point
                            {x:(width/count)/2-division*0.5,        y:division*0.5+height/2},   //lower left
                            {x:(width/count)/2-division*0.25,       y:division*1.25+height/2},  //lower left down
                            {x:(width/count)/2-division*1.0,        y:division*0.5+height/2},   //lower left left
                            {x:(width/count)/2+division*0.5,        y:division*0.5+height/2},   //lower right
                            {x:(width/count)/2+division*0.5,        y:division*1.75+height/2},  //lower right down
                            {x:(width/count)/2+division*1.0,        y:division*0.5+height/2},   //lower right right
                            {x:(width/count)/2-division*0.5,        y:-division*0.5+height/2},  //upper left
                            {x:(width/count)/2-division*0.25,       y:-division*1.25+height/2}, //upper left up
                            {x:(width/count)/2-division*1.0,        y:-division*0.25+height/2}, //upper left left
                            {x:(width/count)/2+division*0.5,        y:-division*0.5+height/2},  //upper right
                            {x:(width/count)/2+division*0.5,        y:-division*1.75+height/2}, //upper right up
                            {x:(width/count)/2+division*1.0,        y:-division*0.25+height/2}, //upper right right
                        ],
                        right:[
                            {x:(width/count)-division*1.0-margin,   y:height*0.5-division*0.5}, //top left
                            {x:(width/count)-division*0.0-margin,   y:height*0.5-division*0.5}, //top right
                            {x:(width/count)-division*0.5-margin,   y:height*0.5-division*0.0}, //centre
                            {x:(width/count)-division*1.0-margin,   y:height*0.5+division*0.5}, //bottom left
                            {x:(width/count)-division*0.0-margin,   y:height*0.5+division*0.5}  //bottom right
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
                            {x:(width/count)/2-division*0.5,        y:height-division*1.0-margin}, //upper left
                            {x:(width/count)/2+division*0.5,        y:height-division*1.0-margin}, //upper right
                            {x:(width/count)/2,                     y:height-division*0.5-margin}, //central point
                            {x:(width/count)/2-division*0.5,        y:height-division*0.0-margin}, //lower left
                            {x:(width/count)/2+division*0.5,        y:height-division*0.0-margin}, //lower right
                        ],
                        right:[
                            {x:(width/count)-division*0.5-margin,   y:height-division*0.5-margin}, //centre
                            {x:(width/count)-division*0.0-margin,   y:height-division*1.0-margin}, //right
                            {x:(width/count)-division*1.0-margin,   y:height-division*0.0-margin}, //bottom
                            {x:(width/count)-division*1.0-margin,   y:height-division*1.0-margin}, //inner point
                            {x:(width/count)-division*1.0-margin,   y:height-division*1.75-margin},//inner point up
                            {x:(width/count)-division*1.75-margin,  y:height-division*1.0-margin}, //inner point left
                        ]
                    }
                }
            }
        };
        const segmentPointArray = [
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

        //values
            const stamps = (new Array(count)).fill().map(() => [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
            const decimalPoints = (new Array(count-1)).fill().map(() => false);
            const decimalPointRadius = 1.5;

        //elements 
            const canvas = interfacePart.builder('basic','canvas','backing',{ width:width, height:height, colour:backgroundStyle,resolution:resolution });
                object.append(canvas);

        //internal
            function clear(requestUpdate=true){
                dev.log.partDisplay('.readout_sixteenSegmentDisplay::clear()'); //#development
                canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba(backgroundStyle);
                canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
                if(requestUpdate){canvas.requestUpdate();}
            };
            function drawCharacters(){
                dev.log.partDisplay('.readout_sixteenSegmentDisplay::drawChar()'); //#development

                stamps.forEach((stamp,stampIndex) => {
                    const xOffset = stampIndex*(width/count);

                    segmentPointArray.forEach((segmentPoints, segmentPointsIndex) => {
                        canvas._.beginPath(); 
                        canvas._.moveTo(
                            canvas.$(segmentPoints[0].x + xOffset),
                            canvas.$(segmentPoints[0].y)
                        );
                        for(let a = 1; a < segmentPoints.length; a++){
                            canvas._.lineTo(
                                canvas.$(segmentPoints[a].x + xOffset),
                                canvas.$(segmentPoints[a].y)
                            );
                        }
                        canvas._.closePath(); 
                        canvas._.fillStyle = stamp[segmentPointsIndex] == 0 ? _canvas_.library.math.convertColour.obj2rgba(dimStyle) : _canvas_.library.math.convertColour.obj2rgba(glowStyle);
                        canvas._.fill(); 
                    });
                });

                if(decimalPlaces){
                    decimalPoints.forEach((state,index) => {
                        canvas._.beginPath();
                        canvas._.arc( canvas.$( (index+1)*(width/count) ), canvas.$(height - 2*decimalPointRadius), canvas.$(decimalPointRadius), 0, 2*Math.PI );
                        canvas._.fillStyle = state == 0 ? _canvas_.library.math.convertColour.obj2rgba(dimStyle) : _canvas_.library.math.convertColour.obj2rgba(glowStyle);
                        canvas._.fill(); 

                    });
                }

                canvas.requestUpdate();
            }
            function print(style,offset=0,dontClear=false){
                dev.log.partDisplay('.readout_sixteenSegmentDisplay::print('+style+','+offset+','+dontClear+')'); //#development
                
                if(decimalPlaces){ decimalPoints.forEach((point,index) => decimalPoints[index] = false); }
                if(!dontClear){ clearInterval(displayInterval); }

                switch(style){
                    case 'smart':
                        if(decimalPlaces){
                            if(text.replace('.','').length > stamps.length){print('r2lSweep');}
                            else{print('regular');}
                        }else{
                            if(text.length > stamps.length){print('r2lSweep');}
                            else{print('regular');}
                        }
                    break;
                    case 'r2lSweep':
                        let displayStage = -stamps.length;

                        displayInterval = setInterval(function(){
                            print('regular',-displayStage,true);
                            displayStage++;
                            if(text[displayStage] == "."){
                                displayStage++;
                            }
                            if(displayStage > stamps.length+text.length-1){
                                displayStage=-stamps.length;
                            }
                        },displayIntervalTime);
                    break;
                    case 'regular': default:
                        let textIndex = 0;
                        for(let a = offset; a < stamps.length; a++){
                            if(stamps[a] == undefined){ textIndex++; continue; }

                            if(decimalPlaces && text[textIndex] == '.'){
                                if(decimalPoints[a-1] != undefined){
                                    decimalPoints[a-1] = true;
                                }
                                a--;
                            }else{
                                stamps[a] = getStamp(text[textIndex]);
                            }
                            textIndex++;
                        }
                    break;
                }

                clear(false);
                drawCharacters();
            }

        //methods
            object.text = function(a){
                if(a==null){return text;}
                dev.log.partDisplay('.readout_sixteenSegmentDisplay.text('+a+')'); //#development
                text = a;
            };
            object.print = function(style){
                dev.log.partDisplay('.readout_sixteenSegmentDisplay::print('+style+')'); //#development
                print(style);
            };  

        //setup
            clear();
            drawCharacters();
    }else{
        //elements 
            //display units
                const units = (new Array(count)).fill().map((a,index) => {
                    return _canvas_.interface.part.builder('display', 'sixteenSegmentDisplay', ''+index, {
                        x:(width/count)*index, width:width/count, height:height, 
                        static:static, resolution:resolution,
                        style:{background:backgroundStyle, glow:glowStyle, dim:dimStyle}
                    });
                });
                units.forEach(element => object.append(element));
            //decimal point
                let decimalPoints = [];
                if(decimalPlaces){
                    decimalPoints = (new Array(count-1)).fill().map((a,index) => {
                        return _canvas_.interface.part.builder('display', 'glowbox_circle', 'decimalPoint_'+index, {
                            x:(width/count)*(index+1), y:height*0.9, radius:(height/10)/2,
                            style:{glow:glowStyle, dim:dimStyle},
                        });
                    });
                    decimalPoints.forEach(element => object.append(element));
                }

        //methods
            function print(style,offset=0,dontClear=false){
                dev.log.partDisplay('.readout_sixteenSegmentDisplay::print('+style+','+offset+','+dontClear+')'); //#development
                
                decimalPoints.forEach(point => point.off());
                if(!dontClear){ clearInterval(displayInterval); }

                switch(style){
                    case 'smart':
                        if(decimalPlaces){
                            if(text.replace('.','').length > units.length){print('r2lSweep');}
                            else{print('regular');}
                        }else{
                            if(text.length > units.length){print('r2lSweep');}
                            else{print('regular');}
                        }
                    break;
                    case 'r2lSweep':
                        let displayStage = -units.length;

                        displayInterval = setInterval(function(){
                            print('regular',-displayStage,true);
                            displayStage++; if(displayStage > units.length+text.length-1){displayStage=-units.length;}
                        },displayIntervalTime);
                    break;
                    case 'regular': default:
                        let textIndex = 0;
                        for(let a = offset; a < units.length; a++){
                            if(units[a] == undefined){ textIndex++; continue; }

                            if(decimalPlaces && text[textIndex] == '.'){
                                if(decimalPoints[a-1] != undefined){decimalPoints[a-1].on();}
                                a--;
                            }else{ units[a].enterCharacter(text[textIndex]); }
                            textIndex++;
                        }
                    break;
                }
            }

            object.text = function(a){
                if(a==null){return text;}
                dev.log.partDisplay('.readout_sixteenSegmentDisplay.text('+a+')'); //#development
                text = a;
            };
            object.print = function(style){
                dev.log.partDisplay('.readout_sixteenSegmentDisplay::print('+style+')'); //#development
                print(style);
            };  
    }

    return(object);
};

interfacePart.partLibrary.display.readout_sixteenSegmentDisplay = function(name,data){ 
    return interfacePart.collection.display.readout_sixteenSegmentDisplay(
        name, data.static, data.resolution, data.x, data.y, data.width, data.height, data.count, data.angle, data.decimalPlaces,
        data.style.background, data.style.glow, data.style.dim,
    ); 
};