this.grapher_waveWorkspace = function(
    name='grapher_waveWorkspace',
    x, y, width=120, height=60, angle=0, selectNeedle=true, selectionArea=true,

    foregroundStyles=[
        {stroke:'rgba(0,255,0,1)', lineWidth:0.25, lineJoin:'round'},
        {stroke:'rgba(255,255,0,1)', lineWidth:0.25, lineJoin:'round'},
    ],
    foregroundTextStyles=[
        {fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
        {fill:'rgba(255,255,100,1)', size:0.75, font:'Helvetica'},
    ],

    backgroundStyle_stroke='rgba(0,100,0,1)',
    backgroundStyle_lineWidth=0.25,
    backgroundTextStyle_fill='rgba(0,150,0,1)',
    backgroundTextStyle_font='10pt Helvetica',

    backingStyle='rgba(50,50,50,1)',

    onchange=function(needle,value){}, 
    onrelease=function(needle,value){}, 
    selectionAreaToggle=function(bool){},
){
    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //main graph
            var graph = interfacePart.builder('grapher_static', 'graph', {
                width:width, height:height,
                style:{
                    foregrounds:foregroundStyles,   
                    foregroundText:foregroundTextStyles,
                    background_stroke:backgroundStyle_stroke,
                    background_lineWidth:backgroundStyle_lineWidth,
                    backgroundText_fill:backgroundTextStyle_fill,
                    backgroundText_font:backgroundTextStyle_font,
                    backing:backingStyle,
                }
            });
            graph.resolution(10);
            object.append(graph);
        //needle overlay
            var overlay = interfacePart.builder('needleOverlay', 'overlay', {
                width:width, height:height, selectNeedle:selectNeedle, selectionArea:selectionArea,
                needleStyles:foregroundStyles.map(a => a.stroke),
            });
            object.append(overlay);

    //controls
        //grapher
            object.horizontalMarkings = graph.horizontalMarkings;
            object.verticalMarkings = graph.verticalMarkings;
            object.drawBackground = graph.drawBackground;
            object.drawForeground = graph.drawForeground;
            object.draw = graph.draw;
        //needle overlay
            object.mark = overlay.mark;
            object.removeAllMarks = overlay.removeAllMarks;
            object.select = overlay.select;
            object.area = overlay.area;

    //callbacks
        object.onchange = onchange;
        object.onrelease = onrelease;
        object.selectionAreaToggle = selectionAreaToggle;
        overlay.onchange = function(needle,value){ if(object.onchange){object.onchange(needle,value);} };
        overlay.onrelease = function(needle,value){ if(object.onrelease){object.onrelease(needle,value);} };
        overlay.selectionAreaToggle = function(toggle){ if(object.selectionAreaToggle){object.selectionAreaToggle(toggle);} };

    //setup
        graph.viewbox({left:0});
        graph.drawBackground();
        overlay.select(0);

    return object;
};