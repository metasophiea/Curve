parts.elements.display.grapherCanvas = function(
    id='grapherCanvas',
    x, y, width, height,
    foregroundStyles=['stroke:rgba(0,255,0,1); stroke-width:0.75; stroke-linecap:round;','stroke:rgba(255,255,0,1); stroke-width:0.75; stroke-linecap:round;'],
    foregroundTextStyles=['fill:rgba(100,255,100,1); font-size:3; font-family:Helvetica;','fill:rgba(255,255,100,1); font-size:3; font-family:Helvetica;'],
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:1;',
    backgroundTextStyle='fill:rgba(0,150,0,1); font-size:5; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    var viewbox = {'bottom':-1,'top':1,'left':0,'right':1};
    var horizontalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printingValues:[],textPosition:{x:-0.995,y:0.06},printText:false};
    var verticalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printingValues:[],textPosition:{x:-0.0025,y:0.04},printText:false};
    var foregroundElementsGroup = [];

    //convert the style info
        var tempStyleInfo = foregroundStyles.map(a => system.utility.element.styleExtractor(a));
        foregroundStyles = tempStyleInfo.map(a => a.stroke);
        var foregroundLineThicknesses = tempStyleInfo.map(a => a['stroke-width']*8);

        var tempStyleInfo = system.utility.element.styleExtractor(backgroundTextStyle);
        backgroundTextStyle = (12*tempStyleInfo['font-size'])+'px ' + tempStyleInfo['font-family'];

        var tempStyleInfo = system.utility.element.styleExtractor(backgroundStyle);
        backgroundStyle = tempStyleInfo.stroke;
        var backgroundLineThickness = tempStyleInfo['stroke-width'] * 8;

        var tempStyleInfo = system.utility.element.styleExtractor(backingStyle);
        backingStyle = tempStyleInfo['fill'];

    //elements
        //main
            var object = system.utility.misc.elementMaker('g',id,{x:x, y:y});
        //canvas
            var canvas = system.utility.misc.elementMaker('canvas',id,{width:width, height:height, resolution:7});
            object.appendChild(canvas.element);

    //controls
        object._test = function(){
            this.drawBackground();
            this.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
            this.draw([0,1],undefined,1);
        };
        object.backgroundLineThickness = function(a){
            if(a==null){return backgroundLineThickness;}
            backgroundLineThickness = a;
        };
        object.foregroundLineThickness = function(a){
            if(a==null){return foregroundLineThickness;}
            foregroundLineThickness = a;
        };
        object.viewbox = function(a){
            if(a==null){return viewbox;}
            if( a.bottom ){viewbox.bottom = a.bottom;}
            if( a.top ){viewbox.top = a.top;}
            if( a.left ){viewbox.left = a.left;}
            if( a.right ){viewbox.right = a.right;}
        };
        object.horizontalMarkings = function(a){
            if(a==null){return horizontalMarkings;}
            if( a.points ){horizontalMarkings.points = a.points;}
            if( a.printingValues ){horizontalMarkings.printingValues = a.printingValues;}
            if( a.textPosition ){horizontalMarkings.textPosition = a.textPosition;}
            if( a.printText ){horizontalMarkings.printText = a.printText;}
        };
        object.verticalMarkings = function(a){
            if(a==null){return verticalMarkings;}
            if( a.points ){verticalMarkings.points = a.points;}
            if( a.printingValues ){verticalMarkings.printingValues = a.printingValues;}
            if( a.textPosition ){verticalMarkings.textPosition = a.textPosition;}
            if( a.printText ){verticalMarkings.printText = a.printText;}
        };
        object.drawBackground = function(){
            //backing
                canvas.context.fillStyle = backingStyle;
                canvas.context.fillRect(canvas.c(0), canvas.c(0), canvas.c(width), canvas.c(height));

            //horizontal lines
                for(var a = 0; a < horizontalMarkings.points.length; a++){
                    var y = system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);

                    //lines
                    canvas.context.strokeStyle = backgroundStyle; 
                    canvas.context.lineWidth = backgroundLineThickness;
                    canvas.context.beginPath();
                    canvas.context.moveTo(0,canvas.c(y));
                    canvas.context.lineTo(canvas.c(width),canvas.c(y));
                    canvas.context.closePath();
                    canvas.context.stroke();

                    //text
                    if(horizontalMarkings.printText){
                        canvas.context.fillStyle = backgroundStyle;
                        canvas.context.font = backgroundTextStyle;
                        canvas.context.fillText(
                            horizontalMarkings.points[a],
                            canvas.c(horizontalMarkings.textPosition == undefined || horizontalMarkings.textPosition.x == undefined ? 0.5 : 
                                system.utility.math.relativeDistance(
                                    width, viewbox.left,viewbox.right, 
                                    (typeof horizontalMarkings.textPosition.x == 'number' ? horizontalMarkings.textPosition.x : horizontalMarkings.textPosition.x[a])
                                )
                            ),
                            canvas.c(horizontalMarkings.textPosition == undefined || horizontalMarkings.textPosition.y == undefined ? y+1.75 : 
                                height-system.utility.math.relativeDistance(
                                    height, viewbox.bottom,viewbox.top, 
                                    horizontalMarkings.points[a]-(typeof horizontalMarkings.textPosition.y == 'number' ? horizontalMarkings.textPosition.y : horizontalMarkings.textPosition.y[a])
                                )
                            ),
                        );
                    }
                }

            //vertical lines
                for(var a = 0; a < verticalMarkings.points.length; a++){
                    var x = system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);

                    //lines
                    canvas.context.strokeStyle = backgroundStyle; 
                    canvas.context.lineWidth = backgroundLineThickness;
                    canvas.context.beginPath();
                    canvas.context.moveTo(canvas.c(x),0);
                    canvas.context.lineTo(canvas.c(x),canvas.c(height));
                    canvas.context.closePath();
                    canvas.context.stroke();

                    //text
                    if(verticalMarkings.printText){
                        canvas.context.fillStyle = backgroundStyle;
                        canvas.context.font = backgroundTextStyle;
                        canvas.context.fillText(
                            verticalMarkings.points[a],
                            canvas.c(verticalMarkings.textPosition == undefined || verticalMarkings.textPosition.x == undefined ? 0.5 : 
                                system.utility.math.relativeDistance(
                                    width, viewbox.left,viewbox.right, 
                                    verticalMarkings.points[a]-(typeof verticalMarkings.textPosition.x == 'number' ? verticalMarkings.textPosition.x : verticalMarkings.textPosition.x[a]),
                                )
                            ),
                            canvas.c(verticalMarkings.textPosition == undefined || verticalMarkings.textPosition.y == undefined ? y : 
                                system.utility.math.relativeDistance(
                                    height, viewbox.bottom,viewbox.top, 
                                    (typeof verticalMarkings.textPosition.y == 'number' ? verticalMarkings.textPosition.y : verticalMarkings.textPosition.y[a])
                                )
                            ),
                        );
                    }
                }

            //printing
                canvas.print();
        };
        object.draw = function(y,x,layer=0){
            foregroundElementsGroup[layer] = {x:x, y:y};

            //background redraw
                this.drawBackground();

            //data drawing
                for(var g = 0; g < foregroundElementsGroup.length; g++){
                    if(foregroundElementsGroup[g] == undefined){continue;}
                    var y = foregroundElementsGroup[g].y;
                    var x = foregroundElementsGroup[g].x;

                    for(var a = 0; a < y.length-1; a++){
                        var points = system.utility.math.lineCorrecter({
                            'x1': x==undefined ? (a+0)*(width/(y.length-1)) : system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, x[a+0]),
                            'x2': x==undefined ? (a+1)*(width/(y.length-1)) : system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, x[a+1]),
                            'y1': height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, y[a+0], true),
                            'y2': height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, y[a+1], true)
                        }, height, width);

                        if(points){
                            canvas.context.strokeStyle = (foregroundStyles[g] == undefined ? foregroundStyles[0] : foregroundStyles[g]);
                            canvas.context.lineWidth = (foregroundLineThicknesses[g] == undefined ? foregroundLineThicknesses[0] : foregroundLineThicknesses[g]);
                            canvas.context.beginPath();
                            canvas.context.moveTo(canvas.c(points.x1),canvas.c(points.y1));
                            canvas.context.lineTo(canvas.c(points.x2),canvas.c(points.y2));
                            canvas.context.closePath();
                            canvas.context.stroke();
                        }   
                    }
                }

            //printing
                canvas.print();
        };

    return object;
};