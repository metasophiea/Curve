parts.dynamic.grapher_waveWorkspace = function(
    id='grapher_waveWorkspace',
    x, y, width, height, graphType='canvas',
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
            var graphMaker = graphType == 'canvas' ? parts.display.grapherCanvas : parts.display.grapherSVG;
            var graph = graphMaker('graph', 0, 0, width, height, middlegroundStyle, middlegroundTextStyle, backgroundStyle, backgroundTextStyle, backingStyle);
            object.append(graph);
        //needle overlay
            var overlay = parts.dynamic.needleOverlay('overlay', 0, 0, width, height);
            object.append(overlay);

    //controls
        object.select = overlay.select;
        object.area = overlay.area;
        object.draw = graph.draw;
        object.drawBackground = graph.drawBackground;

    //setup
        graph._test();

    return object;
};