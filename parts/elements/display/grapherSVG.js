this.grapherSVG = function(
    id='grapherSVG',
    x, y, width, height,
    foregroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    foregroundTextStyle='fill:rgba(100,255,100,1); font-size:3; font-family:Helvetica;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,150,0,1); font-size:2; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    var viewbox = {'l':-1,'h':1};
    var horizontalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printingValues:[],printText:false};
    var verticalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],  printingValues:[],printText:false};
    var backgroundLineThickness = 2;
    var foregroundLineThickness = 2;

    //elements
        //main
            var object = __globals.utility.misc.elementMaker('g',id,{x:x, y:y});
        //backing
            var backing = __globals.utility.misc.elementMaker('rect','backing',{width:width,height:height, style:backingStyle});
            object.appendChild(backing);
        //background elements
            var backgroundElements = __globals.utility.misc.elementMaker('g','backgroundElements',{});
            object.appendChild(backgroundElements);
        //foreground elements
            var foregroundElements = __globals.utility.misc.elementMaker('g','foregroundElements',{});
            object.appendChild(foregroundElements);

    //internal methods
        function pointConverter(realHeight, viewbox, y){
            var viewboxDistance = Math.abs( viewbox.h - viewbox.l );

            var mux = (viewbox.h-y)/viewboxDistance;
            if(mux > 1){return realHeight;} if(mux < 0){return 0;}

            var y_graphingDistance = realHeight * (viewbox.h-y)/viewboxDistance;
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
                        __globals.utility.misc.elementMaker('line','horizontalMarkings_line_'+a,{y1:y, x2:width, y2:y, style:backgroundStyle})
                    );
                    
                    //text
                    if(horizontalMarkings.printText){
                        backgroundElements.append(
                            __globals.utility.misc.elementMaker(
                                'text', 
                                'horizontalMarkings_text_'+horizontalMarkings.points[a],
                                {   
                                    x:0.5, 
                                    y:pointConverter(height, viewbox, horizontalMarkings.points[a]-0.05 ),
                                    text: (horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                    style:backgroundTextStyle,
                                }
                            )
                        );
                    }
                }
    
            //vertical lines
                for(var a = 0; a < verticalMarkings.points.length; a++){
                    var x = pointConverter(width, {'l':0,'h':1}, 1-verticalMarkings.points[a]);

                    //lines
                    backgroundElements.append(
                        __globals.utility.misc.elementMaker('line','verticalMarkings_line_'+a,{x1:x, x2:x, y2:height, style:backgroundStyle})
                    );

                    //text
                    if(verticalMarkings.printText){
                        backgroundElements.append(
                            __globals.utility.misc.elementMaker(
                                'text', 
                                'verticalMarkings_text_'+verticalMarkings.points[a],
                                {   
                                    x:pointConverter(width, {'l':0,'h':1}, 1-verticalMarkings.points[a]-0.01),
                                    y:pointConverter(height, viewbox, 0.025),
                                    text: (verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                    style:backgroundTextStyle,
                                }
                            )
                        );
                    }
                }
        };
        object.draw = function(y,x){
            foregroundElements.innerHTML = '';

            for(var a = 0; a < y.length-1; a++){
                var points = lineCorrecter({
                    'x1': x==undefined ? (a+0)*(width/(y.length-1)) : x[a+0]*width,
                    'x2': x==undefined ? (a+1)*(width/(y.length-1)) : x[a+1]*width,
                    'y1': pointConverter(height, viewbox, y[a+0]),
                    'y2': pointConverter(height, viewbox, y[a+1])
                }, height);

                if(points){
                    foregroundElements.append(
                        __globals.utility.misc.elementMaker('line',null,{x1:points.x1, y1:points.y1, x2:points.x2, y2:points.y2, style:foregroundStyle})
                    );
                }
            }
        };

    return object;
};