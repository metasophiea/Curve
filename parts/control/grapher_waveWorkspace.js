this.grapher_waveWorkspace = function(
    id='grapher_waveWorkspace',
    x, y, width, height, angle=0, graphType='Canvas',
    foregroundStyles=['fill:rgba(255, 231, 114);'],
    foregroundTextStyles=['fill:rgba(0,255,255,1); font-size:3; font-family:Helvetica;'],
    middlegroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    middlegroundTextStyle='fill:rgba(0,255,0,1); font-size:3; font-family:Helvetica;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle='fill:rgba(50,50,50,1)',
){
    var needleWidth = 1/4;

    //elements
        //main
            var object = parts.basic.g(id, x, y);
        //main graph
            var graph = __globals.utility.experimental.elementMaker('grapher'+graphType, 'graph', {
                x:0, y:0, width:width, height:height,
                style:{
                    foreground:middlegroundStyle, foregroundText:middlegroundTextStyle, 
                    background:backgroundStyle, backgroundText:backgroundTextStyle, 
                    backing:backingStyle
                }
            });
            
            object.append(graph);
        //needle overlay
            var overlay = __globals.utility.experimental.elementMaker('needleOverlay', 'overlay', {
                x:0, y:0, width:width, height:height
            });
            object.append(overlay);

    //controls
        object.select = overlay.select;
        object.area = overlay.area;
        object.draw = graph.draw;
        object.foregroundLineThickness = graph.foregroundLineThickness;
        object.drawBackground = graph.drawBackground;
        object.area = overlay.area;

    //callbacks
        object.onchange = function(needle,value){};
        overlay.onchange = function(needle,value){ if(object.onchange){object.onchange(needle,value);} };
        object.onrelease = function(needle,value){};
        overlay.onrelease = function(needle,value){ if(object.onrelease){object.onrelease(needle,value);} };
        object.selectionAreaToggle = function(toggle){};
        overlay.selectionAreaToggle = function(toggle){ if(object.selectionAreaToggle){object.selectionAreaToggle(toggle);} };

    //setup
        graph._test();

    return object;
};