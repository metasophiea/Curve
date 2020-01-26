this.sevenSegmentDisplay = function(
    name='sevenSegmentDisplay', canvasBased=false, resolution=2, 
    x=0, y=0, width=20, height=30, angle=0,
    backgroundStyle={r:0,g:0,b:0,a:1},
    glowStyle={r:0.78,g:0.78,b:0.78,a:1},
    dimStyle={r:0.1,g:0.1,b:0.1,a:1},
){
    dev.log.partDisplay('.sevenSegmentDisplay('+name+','+canvasBased+','+resolution+','+x+','+y+','+width+','+height+','+angle+','+JSON.stringify(backgroundStyle)+','+JSON.stringify(glowStyle)+','+JSON.stringify(dimStyle)+')'); //#development
    
    const margin = width/8;
    const division = width/8;
    const shapes = {
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
    const points = [
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
    function getStamp(character){
        dev.log.partDisplay('.sevenSegmentDisplay::getStamp('+character+')'); //#development
        
        switch(character){
            case 0: case '0': return [1,1,1,0,1,1,1];
            case 1: case '1': return [0,0,1,0,0,1,0];
            case 2: case '2': return [1,0,1,1,1,0,1];
            case 3: case '3': return [1,0,1,1,0,1,1];
            case 4: case '4': return [0,1,1,1,0,1,0];
            case 5: case '5': return [1,1,0,1,0,1,1];
            case 6: case '6': return [1,1,0,1,1,1,1];
            case 7: case '7': return [1,0,1,0,0,1,0];
            case 8: case '8': return [1,1,1,1,1,1,1];
            case 9: case '9': return [1,1,1,1,0,1,1];

            case 'a': case 'A': return [1,1,1,1,1,1,0];
            case 'b': case 'B': return [0,1,0,1,1,1,1];
            case 'c': case 'C': return [1,1,0,0,1,0,1];
            case 'd': case 'D': return [0,0,1,1,1,1,1];
            case 'e': case 'E': return [1,1,0,1,1,0,1];
            case 'f': case 'F': return [1,1,0,1,1,0,0];

            default: return [0,0,0,0,0,0,0];
        }
    }

    if(canvasBased){
        let stamp = [0,0,0,0,0,0,0];

        //elements 
            const object = interfacePart.builder('basic','group',name,{x:x, y:y});
            const canvas = interfacePart.builder('basic','canvas','backing',{ width:width, height:height, colour:backgroundStyle,resolution:resolution });
                object.append(canvas);

        //graphics
            function clear(){
                dev.log.partDisplay('.sevenSegmentDisplay::clear()'); //#development

                canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba(backgroundStyle);
                canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
                canvas.requestUpdate();
            };
            function drawChar(){
                dev.log.partDisplay('.sevenSegmentDisplay::drawChar()'); //#development

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
                dev.log.partDisplay('.sevenSegmentDisplay.set('+segment+','+state+')'); //#development
                clear();
                stamp[segment] = state;
                drawChar();
            };
            object.get = function(segment){ 
                if(segment==undefined){
                    console.error('sevenSegmentDisplay_canvasBased::get: must provide segment value'); 
                    return;
                } 
                return stamp[segment].state;
            };
            object.clear = function(){
                dev.log.partDisplay('.sevenSegmentDisplay.clear()'); //#development
                clear();
                for(let a = 0; a < stamp.length; a++){
                    this.set(a,false);
                }
                drawChar();
            };

            object.enterCharacter = function(char){
                dev.log.partDisplay('.sevenSegmentDisplay.enterCharacter('+char+')'); //#development
                stamp = getStamp(char);

                clear();
                drawChar();
            };

        //setup
            clear();
            drawChar();

        return object;
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
                    dev.log.partDisplay('.sevenSegmentDisplay.set('+segment+','+state+')'); //#development
                    segments[segment].state = state;
                    if(state){ segments[segment].segment.colour(glowStyle); }
                    else{ segments[segment].segment.colour(dimStyle); }
                };
                object.get = function(segment){
                    return segments[segment].state;
                };
                object.clear = function(){
                    dev.log.partDisplay('.sevenSegmentDisplay.clear()'); //#development
                    for(let a = 0; a < segments.length; a++){
                        this.set(a,false);
                    }
                };

                object.enterCharacter = function(char){
                    dev.log.partDisplay('.sevenSegmentDisplay.enterCharacter('+char+')'); //#development
                    stamp = getStamp(char);

                    for(let a = 0; a < stamp.length; a++){
                        this.set(a, stamp[a]==1);
                    }
                };
                    
        return object;
    }
};

interfacePart.partLibrary.display.sevenSegmentDisplay = function(name,data){ 
    return interfacePart.collection.display.sevenSegmentDisplay(
        name, data.canvasBased, data.resolution, data.x, data.y, data.width, data.height, data.angle,
        data.style.background, data.style.glow, data.style.dim
    );
};