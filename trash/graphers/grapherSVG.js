parts.elements.display.grapherSVG = function(
    id='grapherSVG',
    x, y, width, height,
    foregroundStyles=['stroke:rgba(0,255,0,1); stroke-width:0.75; stroke-linecap:round;','stroke:rgba(255,255,0,1); stroke-width:0.75; stroke-linecap:round;'],
    foregroundTextStyles=['fill:rgba(100,255,100,1); font-size:3; font-family:Helvetica;','fill:rgba(255,255,100,1); font-size:3; font-family:Helvetica;'],
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:1;',
    backgroundTextStyle='fill:rgba(0,150,0,1); font-size:5; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    var viewbox = {'bottom':-1,'top':1,'left':0,'right':1};
    var horizontalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],printingValues:[],textPosition:{x:-0.995,y:0.06},printText:false};
    var verticalMarkings = {points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75],  printingValues:[],textPosition:{x:-0.0025,y:0.04},printText:false};
    var backgroundLineThickness = 2;
    var foregroundLineThickness = 2;

    //elements
        //main
            var object = system.utility.misc.elementMaker('g',id,{x:x, y:y});
        //backing
            var backing = system.utility.misc.elementMaker('rect','backing',{width:width,height:height, style:backingStyle});
            object.appendChild(backing);
        //background elements
            var backgroundElements = system.utility.misc.elementMaker('g','backgroundElements',{});
            object.appendChild(backgroundElements);
        //foreground elements
            var foregroundElementsGroup = [];

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
            backgroundElements.innerHTML = '';
            
            //horizontal lines
                for(var a = 0; a < horizontalMarkings.points.length; a++){
                    var y = height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);

                    //lines
                        backgroundElements.append(
                            system.utility.misc.elementMaker('line','horizontalMarkings_line_'+a,{y1:y, x2:width, y2:y, style:backgroundStyle})
                        );

                    //text
                        if(horizontalMarkings.printText){
                            backgroundElements.append(
                                system.utility.misc.elementMaker(
                                    'text', 
                                    'horizontalMarkings_text_'+horizontalMarkings.points[a],
                                    {
                                        x: horizontalMarkings.textPosition == undefined || horizontalMarkings.textPosition.x == undefined ? 0.5 : 
                                            system.utility.math.relativeDistance(
                                                width, viewbox.left,viewbox.right, 
                                                (typeof horizontalMarkings.textPosition.x == 'number' ? horizontalMarkings.textPosition.x : horizontalMarkings.textPosition.x[a])
                                            ),
                                        y: horizontalMarkings.textPosition == undefined || horizontalMarkings.textPosition.y == undefined ? y : 
                                            height-system.utility.math.relativeDistance(
                                                height, viewbox.bottom,viewbox.top, 
                                                horizontalMarkings.points[a]-(typeof horizontalMarkings.textPosition.y == 'number' ? horizontalMarkings.textPosition.y : horizontalMarkings.textPosition.y[a])
                                            ),
                                        text: (horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                        style:backgroundTextStyle,
                                    }
                                )
                            );
                        }
                }

            
            //vertical lines
            for(var a = 0; a < verticalMarkings.points.length; a++){
                var x = system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);

                //lines
                    backgroundElements.append(
                        system.utility.misc.elementMaker('line','verticalMarkings_line_'+a,{x1:x, x2:x, y2:height, style:backgroundStyle})
                    );
                
                //text
                    if(verticalMarkings.printText){
                        backgroundElements.append(
                            system.utility.misc.elementMaker(
                                'text', 
                                'verticalMarkings_text_'+verticalMarkings.points[a],
                                {   
                                    x: verticalMarkings.textPosition == undefined || verticalMarkings.textPosition.x == undefined ? 0.5 : 
                                        system.utility.math.relativeDistance(
                                            width, viewbox.left,viewbox.right, 
                                            verticalMarkings.points[a]-(typeof verticalMarkings.textPosition.x == 'number' ? verticalMarkings.textPosition.x : verticalMarkings.textPosition.x[a]),
                                        ),
                                    y: verticalMarkings.textPosition == undefined || verticalMarkings.textPosition.y == undefined ? y : 
                                        system.utility.math.relativeDistance(
                                            height, viewbox.bottom,viewbox.top, 
                                            (typeof verticalMarkings.textPosition.y == 'number' ? verticalMarkings.textPosition.y : verticalMarkings.textPosition.y[a])
                                        ),
                                    text: (verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                    style:backgroundTextStyle,
                                }
                            )
                        );
                    }
            }
        };
        object.draw = function(y,x,layer=0){
            if( foregroundElementsGroup[layer] == undefined ){
                foregroundElementsGroup[layer] = system.utility.misc.elementMaker('g','foregroundElements_'+layer,{});
                object.appendChild(foregroundElementsGroup[layer] );
            }else{
                foregroundElementsGroup[layer].innerHTML = '';
            }

            for(var a = 0; a < y.length-1; a++){
                var points = system.utility.math.lineCorrecter({
                    'x1': x==undefined ? (a+0)*(width/(y.length-1)) : system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, x[a+0]),
                    'x2': x==undefined ? (a+1)*(width/(y.length-1)) : system.utility.math.relativeDistance(width, viewbox.left,viewbox.right, x[a+1]),
                    'y1': height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, y[a+0], true),
                    'y2': height-system.utility.math.relativeDistance(height, viewbox.bottom,viewbox.top, y[a+1], true)
                }, height, width);

                if(points){
                    foregroundElementsGroup[layer].append(
                        system.utility.misc.elementMaker('line',null,{
                            x1:points.x1, y1:points.y1, 
                            x2:points.x2, y2:points.y2, 
                            style:(foregroundStyles[layer] == undefined ? foregroundStyles[0] : foregroundStyles[layer])
                        })
                    );
                }
            }
        };


    return object;
};