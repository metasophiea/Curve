this.grapherSVG = function(
    id='grapherSVG',
    x, y, width, height,
    foregroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    foregroundTextStyle='fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'rgba(50,50,50,1)',
){
    var viewbox = {'l':-1,'h':1};
    var horizontalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printText:false};
    var verticalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printText:false};
    var backgroundLineThickness = 2;
    var foregroundLineThickness = 2;

    //elements
        //main
            var object = parts.basic.g(id, x, y);
        //backing
            var backing = parts.basic.rect('backing', 0, 0, width, height, 0, backingStyle);
            object.appendChild(backing);
        //background elements
            var backgroundElements = parts.basic.g('backgroundElements', 0, 0);
            object.appendChild(backgroundElements);
        //foreground elements
            var foregroundElements = parts.basic.g('foregroundElements', 0, 0);
            object.appendChild(foregroundElements);

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
            this.drawBackground();
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
            backgroundElements.innerHTML = '';
    
            //horizontal lines
                for(var a = 0; a < horizontalMarkings.points.length; a++){
                    var y = pointConverter(height, viewbox, horizontalMarkings.points[a]);

                    //lines
                    backgroundElements.append(
                        parts.basic.line( 'horizontalMarkings_line_'+a, 0, y, width, y, backgroundStyle )
                    );
                    
                    //text
                    if(horizontalMarkings.printText){
                        backgroundElements.append(
                            parts.basic.text(
                                'horizontalMarkings_text_'+horizontalMarkings.points[a],
                                0.5,
                                pointConverter(height, viewbox, horizontalMarkings.points[a]-0.075 ),
                                horizontalMarkings.points[a],
                                0,
                                backgroundTextStyle,
                                0.5
                            )
                        );
                    }
                }
    
            //vertical lines
                for(var a = 0; a < verticalMarkings.points.length; a++){
                    var x = pointConverter(width, viewbox, verticalMarkings.points[a]);

                    //lines
                    backgroundElements.append(
                        parts.basic.line( 'verticalMarkings_line_'+a, x, 0, x, height, backgroundStyle )
                    );

                    //text
                    if(verticalMarkings.printText){
                        backgroundElements.append(
                            parts.basic.text(
                                'verticalMarkings_text_'+verticalMarkings.points[a],
                                pointConverter(width, viewbox, verticalMarkings.points[a]-0.01),
                                pointConverter(height, viewbox, -0.065),
                                verticalMarkings.points[a],
                                0,
                                backgroundTextStyle,
                                0.5
                            )
                        );
                    }
                }
        };
        object.draw = function(y,x){
            foregroundElements.innerHTML = '';

            for(var a = 0; a < y.length-1; a++){
                var points = lineCorrecter({
                    'x1': (a+0)*(width/(y.length-1)),
                    'x2': (a+1)*(width/(y.length-1)),
                    'y1': pointConverter(height, viewbox, y[a+0]),
                    'y2': pointConverter(height, viewbox, y[a+1])
                }, height);

                if(points){
                    foregroundElements.append(
                        parts.basic.line(
                            null,
                            points.x1, points.y1,
                            points.x2, points.y2,
                            foregroundStyle
                        )
                    );
                }
            }
        };

    return object;
};