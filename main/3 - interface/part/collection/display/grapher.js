this.grapher = function(
    name='grapher',
    x, y, width=120, height=60, angle=0,

    foregroundStyles=[
        {stroke:'rgba(0,255,0,1)', lineWidth:0.5, lineJoin:'round'},
        {stroke:'rgba(255,255,0,1)', lineWidth:0.5, lineJoin:'round'},
        {stroke:'rgba(0,255,255,1)', lineWidth:0.5, lineJoin:'round'},
    ],
    foregroundTextStyles=[
        {fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
        {fill:'rgba(255,255,100,1)', size:0.75, font:'Helvetica'},
        {fill:'rgba(100,255,255,1)', size:0.75, font:'Helvetica'},
    ],

    backgroundStyle_stroke='rgba(0,100,0,1)',
    backgroundStyle_lineWidth=0.25,
    backgroundTextStyle_fill='rgba(0,150,0,1)',
    backgroundTextStyle_font='1.5pt Helvetica',

    backingStyle='rgba(50,50,50,1)',
){
    var viewbox = {'bottom':-1,'top':1,'left':-1,'right':1};
    var horizontalMarkings = { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
    var verticalMarkings =   { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
    var foregroundElementsGroup = [];

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //backing
            var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, style:{fill:backingStyle} });
            object.append(rect);
        //background group
            var backgroundGroup = interfacePart.builder( 'group', 'background' );
            object.append(backgroundGroup);
        //foreground group
            var foregroundGroup = interfacePart.builder( 'group', 'foreground' );
            object.append(foregroundGroup);
        //stencil
            var stencil = interfacePart.builder('rectangle','stencil',{width:width, height:height});
            object.stencil(stencil);
            object.clip(true);

    //graphics
        function drawBackground(){
            backgroundGroup.clear();

            //horizontal lines
                //calculate the x value for all parts of this section
                    var x = workspace.library.math.relativeDistance(width, viewbox.left,viewbox.right, horizontalMarkings.mappedPosition );

                //add all horizontal markings
                    for(var a = 0; a < horizontalMarkings.points.length; a++){
                        //check if we should draw this line at all
                            if( !(horizontalMarkings.points[a] < viewbox.top || horizontalMarkings.points[a] > viewbox.bottom) ){ continue; }
        
                        //calculate the y value for this section
                            var y = height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);

                        //add line and text to group
                            //lines
                                var path = interfacePart.builder( 'rectangle', 'horizontal_line_'+a, {x:0,y:y,width:width,height:backgroundStyle_lineWidth,style:{fill:backgroundStyle_stroke}} );
                                backgroundGroup.append(path);
                            //text
                                if( horizontalMarkings.printText ){
                                    var text = interfacePart.builder( 'text', 'horizontal_text_'+a, {
                                        x:x+horizontalMarkings.textPositionOffset.x, y:y+horizontalMarkings.textPositionOffset.y,
                                        text:(horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                        style:{
                                            fill:backgroundTextStyle_fill,
                                            font:backgroundTextStyle_font
                                        }
                                    } );
                                    backgroundGroup.append(text);
                                }
                    }

            //vertical lines
                //calculate the y value for all parts of this section
                    var y = height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, verticalMarkings.mappedPosition );

                //add all vertical markings
                    for(var a = 0; a < verticalMarkings.points.length; a++){
                        //check if we should draw this line at all
                            if( verticalMarkings.points[a] < viewbox.left || verticalMarkings.points[a] > viewbox.right ){ continue; }

                        //calculate the x value for this section
                            var x = workspace.library.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);

                        //add line and text to group
                            //lines
                                var path = interfacePart.builder( 'rectangle', 'vertical_line_'+a, {x:x,y:0,width:backgroundStyle_lineWidth,height:height,style:{fill:backgroundStyle_stroke}} );
                                backgroundGroup.append(path);
                        
                            //text
                                if( verticalMarkings.printText ){
                                    var text = interfacePart.builder( 'text', 'vertical_text_'+a, {
                                        x:x+verticalMarkings.textPositionOffset.x, y:y+verticalMarkings.textPositionOffset.y,
                                        text:(verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                        style:{
                                            fill:backgroundTextStyle_fill,
                                            font:backgroundTextStyle_font
                                        }
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
                for(var L = 0; L < foregroundElementsGroup.length; L++){
                    if(foregroundElementsGroup[L] == undefined){continue;}

                    var layer = foregroundElementsGroup[L];
                    var points = [];

                    //generate path points
                        if( layer.y != undefined && layer.x == undefined ){ //auto x print
                            for(var a = 0; a < layer.y.length; a++){ 
                                points.push( {
                                    x: a*(width/(layer.y.length-1)), 
                                    y: height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true),
                                } );
                            }
                        }else if( layer.y.length == layer.x.length ){ //straight print
                            for(var a = 0; a < layer.y.length; a++){ 
                                points.push( {
                                    x:          workspace.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[a], true), 
                                    y: height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true),
                                } );
                            }
                        }else{console.error('grapher::'+name,':layers are of differnt length:',layer.y,layer.x);}

                    //create path shape and add it to the group
                        foregroundGroup.append(
                            interfacePart.builder( 'path', 'layer_'+L, { 
                                points:points, 
                                style:{
                                    stroke: foregroundStyles[L].stroke,
                                    lineWidth: foregroundStyles[L].lineWidth,
                                    lineJoin: foregroundStyles[L].lineJoin,
                                    lineCap: foregroundStyles[L].lineJoin,
                                }
                            })
                        );
                }
        }

    //controls
        object.viewbox = function(a){
            if(a==null){return viewbox;}
            if( a.bottom != undefined ){viewbox.bottom = a.bottom;}
            if( a.top != undefined ){viewbox.top = a.top;}
            if( a.left != undefined ){viewbox.left = a.left;}
            if( a.right != undefined ){viewbox.right = a.right;}
        };
        object.horizontalMarkings = function(a){
            if(a==null){return horizontalMarkings;}
            if( a.points != undefined ){horizontalMarkings.points = a.points;}
            if( a.printingValues != undefined ){horizontalMarkings.printingValues = a.printingValues;}
            if( a.textPositionOffset != undefined ){horizontalMarkings.textPositionOffset = a.textPositionOffset;}
            if( a.printText != undefined ){horizontalMarkings.printText = a.printText;}
        };
        object.verticalMarkings = function(a){
            if(a==null){return verticalMarkings;}
            if( a.points != undefined ){verticalMarkings.points = a.points;}
            if( a.printingValues != undefined ){verticalMarkings.printingValues = a.printingValues;}
            if( a.textPositionOffset != undefined ){verticalMarkings.textPositionOffset = a.textPositionOffset;}
            if( a.printText != undefined ){verticalMarkings.printText = a.printText;}
        };
        object.drawBackground = function(){ drawBackground(); };
        object.drawForeground = function(y,x,layer=0){ drawForeground(y,x,layer); };
        object.draw = function(y,x,layer=0){ drawBackground(); drawForeground(y,x,layer); };

    return object;
};