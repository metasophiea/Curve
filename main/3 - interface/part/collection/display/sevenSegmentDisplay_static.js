this.sevenSegmentDisplay_static = function(
    name='sevenSegmentDisplay_static',
    x, y, width=20, height=30, angle=0, resolution=5, 
    backgroundStyle={r:0,g:0,b:0,a:1},
    glowStyle={r:0.78,g:0.78,b:0.78,a:1},
    dimStyle={r:0.1,g:0.1,b:0.1,a:1},
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
    var stamp = [0,0,0,0,0,0,0];

    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //canvas
            var canvas = interfacePart.builder('basic','canvas','subcanvas',{ width:width, height:height, resolution:resolution });
            object.append(canvas);

    //graphics
        function clear(){
            canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba(backgroundStyle);
            canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
            canvas.requestUpdate();
        };
        function drawChar(){
            //draw segments in 
                for(var a = 0; a < points.length; a++){
                    canvas._.beginPath(); 
                    canvas._.moveTo(canvas.$(points[a][0].x),canvas.$(points[a][0].y));
                    for(var b = 1; b < points[a].length; b++){
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
            clear();
            stamp[segment] = state;
            drawChar();
        };
        object.get = function(segment){ if(segment==undefined){console.error('sevenSegmentDisplay_static::get: must provide segment value'); return;} return stamp[segment].state; };
        object.clear = function(){
            clear();
            for(var a = 0; a < stamp.length; a++){
                this.set(a,false);
            }
            drawChar();
        };

        object.enterCharacter = function(char){
            //generate stamp
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
                    default: stamp = [0,0,0,0,0,0,0]; break;
                }

            clear();
            drawChar();
        };

    //setup
        clear();
        drawChar();

    return object;
};

interfacePart.partLibrary.display.sevenSegmentDisplay_static = function(name,data){ 
    return interfacePart.collection.display.sevenSegmentDisplay_static(
        name, data.x, data.y, data.width, data.height, data.angle, data.resolution,
        data.style.background, data.style.glow, data.style.dim
    );
};