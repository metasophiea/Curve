this.grapher = function(
    name='grapher',
    x, y, width=120, height=60, angle=0, canvasBased=false, resolution=5,

    foregroundStyles=[
        {colour:{r:0,g:1,b:0,a:1}, thickness:0.5},
        {colour:{r:1,g:1,b:0,a:1}, thickness:0.5},
        {colour:{r:0,g:1,b:1,a:1}, thickness:0.5},
    ],
    foregroundTextStyles=[
        {colour:{r:0.39,g:1,b:0.39,a:1}, size:7.5, font:'Helvetica'},
        {colour:{r:1,g:1,b:0.39,a:1}, size:7.5, font:'Helvetica'},
        {colour:{r:0.39,g:1,b:1,a:1}, size:7.5, font:'Helvetica'},
    ],

    backgroundStyle_colour={r:0,g:0.39,b:0,a:1},
    backgroundStyle_lineThickness=0.25,
    backgroundTextStyle_colour={r:0,g:0.58,b:0,a:1},
    backgroundTextStyle_size=7.5,
    backgroundTextStyle_font='Helvetica',
    backgroundTextStyle_horizontalMarkings={ points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true },
    backgroundTextStyle_verticalMarkings={ points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true },

    backingStyle={r:0.2,g:0.2,b:0.2,a:1},
){
    const viewbox = {'bottom':-1,'top':1,'left':-1,'right':1};
    const foregroundElementsGroup = [];

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});

    //controls
        object.viewbox = function(a){
            if(a==null){return viewbox;}
            if( a.bottom != undefined ){viewbox.bottom = a.bottom;}
            if( a.top != undefined ){viewbox.top = a.top;}
            if( a.left != undefined ){viewbox.left = a.left;}
            if( a.right != undefined ){viewbox.right = a.right;}
        };
        object.horizontalMarkings = function(a){
            if(a==null){return backgroundTextStyle_horizontalMarkings;}
            if( a.points != undefined ){backgroundTextStyle_horizontalMarkings.points = a.points;}
            if( a.printingValues != undefined ){backgroundTextStyle_horizontalMarkings.printingValues = a.printingValues;}
            if( a.textPositionOffset != undefined ){backgroundTextStyle_horizontalMarkings.textPositionOffset = a.textPositionOffset;}
            if( a.printText != undefined ){backgroundTextStyle_horizontalMarkings.printText = a.printText;}
            if( a.mappedPosition != undefined ){backgroundTextStyle_horizontalMarkings.mappedPosition = a.mappedPosition;}
        };
        object.verticalMarkings = function(a){
            if(a==null){return backgroundTextStyle_verticalMarkings;}
            if( a.points != undefined ){backgroundTextStyle_verticalMarkings.points = a.points;}
            if( a.printingValues != undefined ){backgroundTextStyle_verticalMarkings.printingValues = a.printingValues;}
            if( a.textPositionOffset != undefined ){backgroundTextStyle_verticalMarkings.textPositionOffset = a.textPositionOffset;}
            if( a.printText != undefined ){backgroundTextStyle_verticalMarkings.printText = a.printText;}
            if( a.mappedPosition != undefined ){backgroundTextStyle_verticalMarkings.mappedPosition = a.mappedPosition;}
        };

    if(canvasBased){
        //elements
            const backingCanvas = interfacePart.builder('basic','canvas','backingCanvas',{ width:width, height:height, resolution:resolution });
                object.append(backingCanvas);
            const frontingCanvas = interfacePart.builder('basic','canvas','frontingCanvas',{ width:width, height:height, resolution:resolution });
                object.append(frontingCanvas);

        //graphics
            function clearBackground(){
                backingCanvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba(backingStyle);
                backingCanvas._.fillRect(0,0,backingCanvas.$(width),backingCanvas.$(height));
                backingCanvas.requestUpdate();
            }
            function clearForeground(){
                frontingCanvas._.clearRect(0,0,frontingCanvas.$(width),frontingCanvas.$(height));
                frontingCanvas.requestUpdate();
            }
            function clearAll(){
                clearBackground();
                clearForeground();
            }
            function drawBackground(){
                //horizontal lines
                    //calculate the x value for all parts of this section
                        const x = _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, backgroundTextStyle_horizontalMarkings.mappedPosition?backgroundTextStyle_horizontalMarkings.mappedPosition:0 );
    
                    //add all horizontal markings
                        for(let a = 0; a < backgroundTextStyle_horizontalMarkings.points.length; a++){
                            //check if we should draw this line at all
                                if( !(backgroundTextStyle_horizontalMarkings.points[a] < viewbox.top || backgroundTextStyle_horizontalMarkings.points[a] > viewbox.bottom) ){ continue; }
            
                            //calculate the y value for this section
                                const y = height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, backgroundTextStyle_horizontalMarkings.points[a]);
    
                            //add line and text to group
                                //lines
                                    backingCanvas._.fillStyle = 'rgba('+backgroundStyle_colour.r*255+','+backgroundStyle_colour.g*255+','+backgroundStyle_colour.b*255+','+backgroundStyle_colour.a+')';
                                    backingCanvas._.fillRect(0,backingCanvas.$(y),backingCanvas.$(width),backingCanvas.$(backgroundStyle_lineThickness));
    
                                //text
                                    if( backgroundTextStyle_horizontalMarkings.printText ){
                                        backingCanvas._.fillStyle = 'rgba('+backgroundTextStyle_colour.r*255+','+backgroundTextStyle_colour.g*255+','+backgroundTextStyle_colour.b*255+','+backgroundTextStyle_colour.a+')';
                                        backingCanvas._.font = backgroundTextStyle_size*resolution/8 +'pt '+backgroundTextStyle_font;
                                        backingCanvas._.fillText(
                                            (backgroundTextStyle_horizontalMarkings.printingValues && backgroundTextStyle_horizontalMarkings.printingValues[a] != undefined) ? backgroundTextStyle_horizontalMarkings.printingValues[a] : backgroundTextStyle_horizontalMarkings.points[a],
                                            backingCanvas.$(x+backgroundTextStyle_horizontalMarkings.textPositionOffset.x),
                                            backingCanvas.$(y+backgroundTextStyle_horizontalMarkings.textPositionOffset.y),
                                        );
                                    }
                        }
    
                //vertical lines
                    //calculate the y value for all parts of this section
                        const y = height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, backgroundTextStyle_verticalMarkings.mappedPosition?backgroundTextStyle_verticalMarkings.mappedPosition:0 );
    
                    //add all vertical markings
                        for(let a = 0; a < backgroundTextStyle_verticalMarkings.points.length; a++){
                            //check if we should draw this line at all
                                if( backgroundTextStyle_verticalMarkings.points[a] < viewbox.left || backgroundTextStyle_verticalMarkings.points[a] > viewbox.right ){ continue; }
    
                            //calculate the x value for this section
                                const x = _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, backgroundTextStyle_verticalMarkings.points[a]);
    
                            //add line and text to group
                                //lines
                                    backingCanvas._.fillStyle = 'rgba('+backgroundStyle_colour.r*255+','+backgroundStyle_colour.g*255+','+backgroundStyle_colour.b*255+','+backgroundStyle_colour.a+')';
                                    backingCanvas._.fillRect(backingCanvas.$(x),0,backingCanvas.$(backgroundStyle_lineThickness),backingCanvas.$(height));
                            
                                //text
                                    if( backgroundTextStyle_verticalMarkings.printText ){
                                        backingCanvas._.fillStyle = 'rgba('+backgroundTextStyle_colour.r*255+','+backgroundTextStyle_colour.g*255+','+backgroundTextStyle_colour.b*255+','+backgroundTextStyle_colour.a+')';
                                        backingCanvas._.font = backgroundTextStyle_size*resolution/8 +'pt '+backgroundTextStyle_font;
                                        backingCanvas._.fillText(
                                            (backgroundTextStyle_verticalMarkings.printingValues && backgroundTextStyle_verticalMarkings.printingValues[a] != undefined) ? backgroundTextStyle_verticalMarkings.printingValues[a] : backgroundTextStyle_verticalMarkings.points[a],
                                            backingCanvas.$(x+backgroundTextStyle_verticalMarkings.textPositionOffset.x),
                                            backingCanvas.$(y+backgroundTextStyle_verticalMarkings.textPositionOffset.y),
                                        );
                                    }
                        }
    
                    backingCanvas.requestUpdate();
            }
            function drawForeground(y,x,layer=0){
                //if both data sets of a layer are being set to undefined; set the whole layer to undefined
                //otherwise, just update the layer's data sets
                    if(y == undefined && x == undefined){ foregroundElementsGroup[layer] = undefined; }
                    else{ foregroundElementsGroup[layer] = {x:x, y:y}; }
    
                //input check
                    if( foregroundElementsGroup[layer] != undefined && foregroundElementsGroup[layer].y == undefined ){
                        console.warn('grapher_canvasBased error',name,'attempting to add line with no y component');
                        console.warn('x:',foregroundElementsGroup[layer].x);
                        console.warn('y:',foregroundElementsGroup[layer].y);
                        return;
                    }
    
                //draw layers
                    for(let L = 0; L < foregroundElementsGroup.length; L++){
                        if(foregroundElementsGroup[L] == undefined){continue;}
    
                        const layer = foregroundElementsGroup[L];
    
                        //draw path
                            frontingCanvas._.strokeStyle = 'rgba('+foregroundStyles[L].colour.r*255+','+foregroundStyles[L].colour.g*255+','+foregroundStyles[L].colour.b*255+','+foregroundStyles[L].colour.a+')';
                            frontingCanvas._.lineWidth = frontingCanvas.$(foregroundStyles[L].thickness);
                            frontingCanvas._.lineJoin = foregroundStyles[L].lineJoin;
                            frontingCanvas._.lineCap = foregroundStyles[L].lineJoin;
                            frontingCanvas._.beginPath();
    
                            if( layer.y != undefined && layer.x == undefined ){ //auto x print
                                frontingCanvas._.moveTo( 0, frontingCanvas.$( height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[0], true) ) );
                                for(let a = 1; a < layer.y.length; a++){ 
                                    frontingCanvas._.lineTo(
                                        frontingCanvas.$(a*(width/(layer.y.length-1))),
                                        frontingCanvas.$(height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true)),
                                    );
                                }
                            }else if( layer.y.length == layer.x.length ){ //straight print
                                frontingCanvas._.moveTo( 
                                    frontingCanvas.$(          _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[0], true) ),
                                    frontingCanvas.$( height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[0], true) )
                                );
                                for(let a = 1; a < layer.y.length; a++){ 
                                    frontingCanvas._.lineTo(
                                        frontingCanvas.$(          _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[a], true) ),
                                        frontingCanvas.$( height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true) ),
                                    );
                                }
                            }else{console.error('grapher_canvasBased::'+name,':layers are of different length:',layer.y,layer.x);}
    
                            frontingCanvas._.stroke();
                    }
                        
                frontingCanvas.requestUpdate();
            }

        //controls
            object.resolution = function(a){
                return backingCanvas.resolution(a);
            };
            object.clearAll = function(){
                clearAll();
            };
            object.drawBackground = function(){
                clearBackground();
                drawBackground(); 
            };
            object.drawForeground = function(y,x,layer=0){ 
                clearForeground();
                drawForeground(y,x,layer); 
            };
            object.draw = function(y,x,layer=0){ 
                clearAll(); 
                drawBackground(); 
                drawForeground(y,x,layer); 
            };
    }else{
        const fontSizeMux = 1/7;

        //elements 
            //backing
                const backing = interfacePart.builder('basic','rectangle','backing',{width:width, height:height, colour:backingStyle});
                object.append(backing);
            //background group
                const backgroundGroup = interfacePart.builder('basic', 'group', 'background');
                object.append(backgroundGroup);
            //foreground group
                const foregroundGroup = interfacePart.builder( 'basic', 'group', 'foreground' );
                object.append(foregroundGroup);
            //stencil
                const stencil = interfacePart.builder('basic','rectangle','stencil',{width:width, height:height});
                object.stencil(stencil);
                object.clipActive(true);

        //graphics
            function clearBackground(){
                backgroundGroup.clear();
            }
            function clearForeground(){
                foregroundGroup.clear();
            }
            function clearAll(){
                clearBackground();
                clearForeground();
            }
            function drawBackground(){
                backgroundGroup.clear();

                //horizontal lines
                    //calculate the x value for all parts of this section
                        const x = _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, backgroundTextStyle_horizontalMarkings.mappedPosition?backgroundTextStyle_horizontalMarkings.mappedPosition:0 );

                    //add all horizontal markings
                        for(let a = 0; a < backgroundTextStyle_horizontalMarkings.points.length; a++){
                            //check if we should draw this line at all
                                if( !(backgroundTextStyle_horizontalMarkings.points[a] < viewbox.top || backgroundTextStyle_horizontalMarkings.points[a] > viewbox.bottom) ){ continue; }
            
                            //calculate the y value for this section
                                const y = height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, backgroundTextStyle_horizontalMarkings.points[a]);

                            //add line and text to group
                                //lines
                                    const path = interfacePart.builder( 'basic', 'rectangle', 'horizontal_line_'+a, {x:0,y:y,width:width,height:backgroundStyle_lineThickness,colour:backgroundStyle_colour} );
                                    backgroundGroup.append(path);

                                //text
                                    if( backgroundTextStyle_horizontalMarkings.printText ){
                                        const text = interfacePart.builder( 'basic', 'text', 'horizontal_text_'+a, {
                                            x:x+backgroundTextStyle_horizontalMarkings.textPositionOffset.x, y:y+backgroundTextStyle_horizontalMarkings.textPositionOffset.y - backgroundTextStyle_size*fontSizeMux,
                                            text:(backgroundTextStyle_horizontalMarkings.printingValues && backgroundTextStyle_horizontalMarkings.printingValues[a] != undefined) ? backgroundTextStyle_horizontalMarkings.printingValues[a] : backgroundTextStyle_horizontalMarkings.points[a],
                                            colour:backgroundTextStyle_colour,
                                            font:backgroundTextStyle_font,
                                            width:backgroundTextStyle_size*fontSizeMux, height:backgroundTextStyle_size*fontSizeMux,
                                            printingMode:{widthCalculation:'absolute',vertical:'top'}
                                        } );
                                        backgroundGroup.append(text);
                                    }
                        }

                //vertical lines
                    //calculate the y value for all parts of this section
                        const y = height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, backgroundTextStyle_verticalMarkings.mappedPosition?backgroundTextStyle_verticalMarkings.mappedPosition:0 );

                    //add all vertical markings
                        for(let a = 0; a < backgroundTextStyle_verticalMarkings.points.length; a++){
                            //check if we should draw this line at all
                                if( backgroundTextStyle_verticalMarkings.points[a] < viewbox.left || backgroundTextStyle_verticalMarkings.points[a] > viewbox.right ){ continue; }

                            //calculate the x value for this section
                                const x = _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, backgroundTextStyle_verticalMarkings.points[a]);

                            //add line and text to group
                                //lines
                                    const path = interfacePart.builder( 'basic', 'rectangle', 'vertical_line_'+a, {x:x,y:0,width:backgroundStyle_lineThickness,height:height,colour:backgroundStyle_colour} );
                                    backgroundGroup.append(path);
                            
                                //text
                                    if( backgroundTextStyle_verticalMarkings.printText ){
                                        const text = interfacePart.builder( 'basic', 'text', 'vertical_text_'+a, {
                                            x:x+backgroundTextStyle_verticalMarkings.textPositionOffset.x, y:y+backgroundTextStyle_horizontalMarkings.textPositionOffset.y - backgroundTextStyle_size*fontSizeMux,
                                            text:(backgroundTextStyle_verticalMarkings.printingValues && backgroundTextStyle_verticalMarkings.printingValues[a] != undefined) ? backgroundTextStyle_verticalMarkings.printingValues[a] : backgroundTextStyle_verticalMarkings.points[a],
                                            colour:backgroundTextStyle_colour, font:backgroundTextStyle_font,
                                            width:backgroundTextStyle_size*fontSizeMux, height:backgroundTextStyle_size*fontSizeMux,
                                            printingMode:{widthCalculation:'absolute',vertical:'top'}
                                        } );
                                        backgroundGroup.append(text);
                                    }
                        }
            }
            function drawForeground(y,x,layer=0){
                foregroundGroup.clear();

                //if both data sets of a layer are being set to undefined; set the whole layer to undefined
                //otherwise, just update the layer's data sets
                    if(y == undefined && x == undefined){ foregroundElementsGroup[layer] = undefined; }
                    else{ foregroundElementsGroup[layer] = {x:x, y:y}; }

                //input check
                    if( foregroundElementsGroup[layer] != undefined && foregroundElementsGroup[layer].y == undefined ){
                        console.warn('grapher error',name,'attempting to add line with no y component');
                        console.warn('x:',foregroundElementsGroup[layer].x);
                        console.warn('y:',foregroundElementsGroup[layer].y);
                        return;
                    }

                //draw layers
                    for(let L = 0; L < foregroundElementsGroup.length; L++){
                        if(foregroundElementsGroup[L] == undefined){continue;}

                        const layer = foregroundElementsGroup[L];
                        const points = [];

                        //generate path points
                            if( layer.y != undefined && layer.x == undefined ){ //auto x print
                                for(let a = 0; a < layer.y.length; a++){ 
                                    points.push( {
                                        x: a*(width/(layer.y.length-1)), 
                                        y: height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true),
                                    } );
                                }
                            }else if( layer.y.length == layer.x.length ){ //straight print
                                for(let a = 0; a < layer.y.length; a++){ 
                                    points.push( {
                                        x:          _canvas_.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[a], true), 
                                        y: height - _canvas_.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true),
                                    } );
                                }
                            }else{console.error('grapher::'+name,':layers are of different length:',layer.y,layer.x);}

                        //create path shape and add it to the group
                            const tmp = interfacePart.builder( 'basic', 'path', 'layer_'+L, { 
                                pointsAsXYArray:points, 
                                colour:foregroundStyles[L].colour,
                                thickness:foregroundStyles[L].thickness,
                            });
                            foregroundGroup.append(tmp);
                    }
            }

        //controls
            object.resolution = function(a){console.warn('this isn\'t the canvasBased version of the grapher part');};

            object.clearAll = function(){
                clearAll();
            };
            object.drawBackground = function(){
                clearBackground();
                drawBackground(); 
            };
            object.drawForeground = function(y,x,layer=0){ 
                clearForeground();
                drawForeground(y,x,layer); 
            };
            object.draw = function(y,x,layer=0){ 
                clearAll(); 
                drawBackground(); 
                drawForeground(y,x,layer); 
            };
    }

    return(object);
};

interfacePart.partLibrary.display.grapher = function(name,data){ 
    return interfacePart.collection.display.grapher(
        name, data.x, data.y, data.width, data.height, data.angle, data.canvasBased, data.resolution,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.backgroundText_horizontalMarkings,
        data.backgroundText_verticalMarkings,
        data.style.backing,
    );
};