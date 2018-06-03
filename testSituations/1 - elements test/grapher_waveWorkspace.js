parts.dynamic.grapher_waveWorkspace = function(
    id='grapher_waveWorkspace',
    x, y, width, height, graphType='canvas',
    foregroundStyles=['fill:rgba(255, 231, 114);'], //stroke:rgb(255, 231, 114);stroke-width:0.25;fill:rgba(255, 231, 114,0.33);
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
            var overlay = parts.dynamic.needleOverlay('overlay', 0, 0, width, height, 0, 'fill:rgba(0,0,0,0);');
            object.append(overlay);
    //     //control objects
    //         var controlObjectsGroup = parts.basic.g(id, 0, 0);
    //         var controlObjects = [];
    //         object.append(controlObjectsGroup);
    //     //overlay
    //         var overlay = parts.basic.rect('overlay', 0, 0, width, height, 0, 'fill:rgba(0,0,0,0);');
    //         object.appendChild(overlay);

    // //internal functions
    //     function createNeedle(position,style){
    //         var needle = __globals.utility.experimental.elementMaker('slide','needle',{
    //             x:0, y:height, width:height, height:width, angle:-Math.PI/2,
    //             handleHeight:0.0025, value:position, resetValue:-1, 
    //             style:{
    //                 handle:style+'cursor: col-resize;', backing:'fill:rgba(0,0,0,0);', slot:'fill:none;',
    //                 invisibleHandle:'fill:rgba(0,0,0,0);cursor: col-resize;'
    //             }
    //         });

    //         needle.onwheel = undefined;

    //         return needle;
    //     }

    //     function select(needle,start){
    //         foregroundStyles[needle] = foregroundStyles[needle] ? foregroundStyles[needle] : foregroundStyles[0];
    //         if( !controlObjects[needle] ){
    //             controlObjects[needle] = createNeedle(start,foregroundStyles[needle]);
    //             controlObjectsGroup.appendChild( createNeedle(start,foregroundStyles[needle]) );
    //         }
    //         controlObjects[needle].set(start);
    //     }

    // //controls
    //     object._test = function(){
    //         graph._test();
    //         select(0,0.2);
    //     };

    // //interaction
    //     overlay.onmousedown = function(event){
    //         console.log(event);
    //         if(!event.shiftKey){
    //             controlObjects[0].onmousedown(event);
    //         }
    //     };
        
    // //callbacks
    // //setup

    return object;
};