this.grapher_waveWorkspace = function(
    id='grapher_waveWorkspace',
    x, y, width, height,
    foregroundStyle='fill:rgb(255, 231, 114);', 
    foregroundTextStyle='fill:rgba(0,255,255,1); font-size:3; font-family:Helvetica;',
    middlegroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    middlegroundTextStyle='fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle='fill:rgba(50,50,50,1)',
){
    var needlePosition = 0;
    var needleWidth = 1/4;
    var selectionNeedlePosition = 0;
    var selectionAreaWidth = 0;
    var leadNeedleStyle = 'fill:rgb(237, 237, 237);'+'pointer-events: none;';
    var selectionNeedleStyle = 'fill:rgb(255, 231, 114);'+'pointer-events: none;';
    var selectionAreaStyle = 'fill:rgba(255, 231, 114, 0.25);'+'pointer-events: none;';

    //elements
        //main
            var object = parts.basic.g(id, x, y);
        //main graph
            var graph = parts.display.grapherCanvas(
                id,0,0,width,height,
                middlegroundStyle, middlegroundTextStyle,
                backgroundStyle,   backgroundTextStyle,
                backingStyle
            );
            object.appendChild(graph);

        //overlay objects
            //needle
                var needle = __globals.utility.experimental.elementMaker(
                    'rect', 'needle', {
                        x:0, y:0, width:needleWidth, height:height, angle:0, style:leadNeedleStyle
                    }
                );
                object.appendChild(needle);
            //selection needle
                var selectionArea = __globals.utility.experimental.elementMaker(
                    'rect', 'selectionArea', {
                        x:selectionNeedlePosition, y:0, width:selectionAreaWidth*width, height:height, angle:0, style:selectionAreaStyle
                    }
                );
                var selectionNeedle_start = __globals.utility.experimental.elementMaker(
                    'rect', 'selectionNeedle_start', {
                        x:selectionNeedlePosition, y:0, width:needleWidth, height:height, angle:0, style:selectionNeedleStyle
                    }
                );
                var selectionNeedle_end = __globals.utility.experimental.elementMaker(
                    'rect', 'selectionNeedle_end', {
                        x:selectionNeedlePosition+selectionAreaWidth*width, y:0, width:needleWidth, height:height, angle:0, style:selectionNeedleStyle
                    }
                );

                object.appendChild(selectionArea);
                object.appendChild(selectionNeedle_start);
                object.appendChild(selectionNeedle_end);

            
    //internal functions
        function setNeedlePosition(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);
            needlePosition = a;
            __globals.utility.element.setTransform_XYonly(needle, (width*a)-needleWidth/2, 0);
            if(object.needleSet && update){object.needleSet(a);}
        }
        function setSelectionArea_start(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);
            selectionNeedlePosition = a;
            __globals.utility.element.setTransform_XYonly(selectionNeedle_start, (width*a)-needleWidth/2, 0);
            __globals.utility.element.setTransform_XYonly(selectionArea, (width*a)-needleWidth/2, 0);
        }
        function setSelectionArea_end(a,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);
            selectionAreaWidth = a-selectionNeedlePosition;
            if( selectionAreaWidth > 0 ){
                __globals.utility.element.setTransform_XYonly(selectionNeedle_end, (width*a)-needleWidth/2, 0);
                selectionArea.setAttribute('width',(selectionAreaWidth*width));
            }else{
                selectionArea.setAttribute('width',(Math.abs(selectionAreaWidth)*width));
            }
        }

    //controls
        object._test = function(){
            graph._test();
            this.setNeedlePosition(0.25);
        };
        object.setNeedlePosition = function(percentage,update=true){setNeedlePosition(percentage,update);};
        object.getNeedlePosition = function(){return needlePosition};
        object.draw = graph.draw;
        object.foregroundLineThickness = graph.foregroundLineThickness;
        object.drawBackground = graph.drawBackground;
    
    //interaction
        graph.onmousedown = function(event){
            var boundingClientRect = this.getBoundingClientRect();
            var x = (event.offsetX-boundingClientRect.x)/boundingClientRect.width;

            //!shift -> effect lead needle
            // shift -> effect selection area
            if( !event.shiftKey ){
                setNeedlePosition(x);
            }else{
                setSelectionArea_start(x);
                graph.onmousemove = function(event){
                    var boundingClientRect = this.getBoundingClientRect();
                    var x = (event.offsetX-boundingClientRect.x)/boundingClientRect.width;
                    setSelectionArea_end(x);
                };
                graph.onmouseup = function(){
                    graph.onmousemove = null;
                    graph.onmouseup = null;
                    graph.onmouseout = null;
                };
                graph.onmouseout = graph.onmouseup;
            }
        };

    //callbacks
        object.needleSet = function(a){};

    return object;
};