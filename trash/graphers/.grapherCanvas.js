this.grapherCanvas = function(
    id='grapherCanvas',
    x, y, width, height,
    foregroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    foregroundTextStyle='fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    var viewbox = {'l':-1,'h':1};
    var horizontalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printText:false};
    var verticalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printText:false};

    //convert the style info
        var tempStyleInfo = system.utility.element.styleExtractor(foregroundStyle);
        foregroundStyle = tempStyleInfo.stroke;
        var foregroundLineThickness = tempStyleInfo['stroke-width'] * 8;

        var tempStyleInfo = system.utility.element.styleExtractor(backgroundStyle);
        backgroundStyle = tempStyleInfo.stroke;
        var backgroundLineThickness = tempStyleInfo['stroke-width'] * 4;

        var tempStyleInfo = system.utility.element.styleExtractor(backingStyle);
        backingStyle = tempStyleInfo['fill'];

    //elements
        //main
            var object = part.builder('g',id,{x:x, y:y});
        //canvas
            var canvas = part.builder('canvas',id,{width:width, height:height, resolution:7});
            object.appendChild(canvas.element);

    //internal methods
        function pointConverter(realHeight, viewbox, y){
            var viewboxDistance = Math.abs( viewbox.h - viewbox.l );
            var y_graphingDistance = realHeight * (viewbox.h-y)/viewboxDistance
            return !isNaN(y_graphingDistance) ? y_graphingDistance : 0;
        }
        function lineCorrecter(points, maxheight){
            if( points.y1 < 0 && points.y2 < 0 ){ return; }
            if( points.y1 > maxheight && points.y2 > maxheight ){ return; }
    
            var slope = (points.y2 - points.y1)/(points.x2 - points.x1);
    
            if( points.y1 < 0 ){ points.x1 = (0 - points.y1 + slope*points.x1)/slope; points.y1 = 0; }
            else if( points.y2 < 0 ){ points.x2 = (0 - points.y2 + slope*points.x2)/slope; points.y2 = 0; }
            if( points.y1 > maxheight ){ points.x1 = (maxheight - points.y1 + slope*points.x1)/slope; points.y1 = maxheight; }
            else if( points.y2 > maxheight ){ points.x2 = (maxheight - points.y2 + slope*points.x2)/slope; points.y2 = maxheight; }
    
            return points;
        }

    //controls
        object._test = function(){
            this.draw([0,-2,1,-1,2]);
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
            viewbox = a;
        };
        object.horizontalMarkings = function(a){
            if(a==null){return horizontalMarkings;}
            horizontalMarkings = a;
        };
        object.verticalMarkings = function(a){
            if(a==null){return verticalMarkings;}
            verticalMarkings = a;
        };
        object.drawBackground = function(){
            //backing
                canvas.context.fillStyle = backingStyle;
                canvas.context.fillRect(canvas.c(0), canvas.c(0), canvas.c(width), canvas.c(height));

            //horizontal lines
                for(var a = 0; a < horizontalMarkings.points.length; a++){
                    var y = pointConverter(height, viewbox, horizontalMarkings.points[a]);

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
                            canvas.c(0.5),
                            canvas.c(y+1.75)
                        );
                    }
                }

            //vertical lines
                for(var a = 0; a < verticalMarkings.points.length; a++){
                    var x = pointConverter(width, viewbox, verticalMarkings.points[a]);

                    //lines
                    canvas.context.strokeStyle = backgroundStyle; 
                    canvas.context.lineWidth = 2;
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
                            canvas.c(pointConverter(width, viewbox, verticalMarkings.points[a]-0.01)),
                            canvas.c(pointConverter(height, viewbox, -0.06)),
                        );
                    }
                }

            //printing
                canvas.print();
        };
        object.draw = function(y,x){
            //background redraw
                this.drawBackground();

            //data drawing
                for(var a = 0; a < y.length-1; a++){
                    var points = lineCorrecter({
                        'x1': (a+0)*(width/(y.length-1)),
                        'x2': (a+1)*(width/(y.length-1)),
                        'y1': pointConverter(height, viewbox, y[a+0]),
                        'y2': pointConverter(height, viewbox, y[a+1])
                    }, height);
                    
                    if(points){
                        canvas.context.strokeStyle = foregroundStyle; 
                        canvas.context.lineWidth = foregroundLineThickness;
                        canvas.context.beginPath();
                        canvas.context.moveTo(canvas.c(points.x1),canvas.c(points.y1));
                        canvas.context.lineTo(canvas.c(points.x2),canvas.c(points.y2));
                        canvas.context.closePath();
                        canvas.context.stroke();
                    }
                }

            //printing
                canvas.print();
        };



    return object;
};