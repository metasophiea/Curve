this.grapher_waveWorkspace = function(
    name='grapher_waveWorkspace',
    x, y, width=120, height=60, angle=0, interactable=true, selectNeedle=true, selectionArea=true,

    foregroundStyles=[
        {colour:{r:0,g:1,b:0,a:1}, thickness:0.25},
        {colour:{r:1,g:1,b:0,a:1}, thickness:0.25},
    ],
    foregroundTextStyles=[
        {colour:{r:0.39,g:1,b:0.39,a:1}, size:7.5, font:'Helvetica'},
        {colour:{r:1,g:1,b:0.39,a:1}, size:7.5, font:'Helvetica'},
    ],

    backgroundStyle_colour={r:0,g:0.39,b:0,a:1},
    backgroundStyle_lineThickness=0.25,
    backgroundTextStyle_colour={r:0,g:0.58,b:0,a:1},
    backgroundTextStyle_size=7.5,
    backgroundTextStyle_font='Helvetica',

    backingStyle={r:0.2,g:0.2,b:0.2,a:1},

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
                    backgroundStyle_colour:backgroundStyle_colour,
                    backgroundStyle_lineThickness:backgroundStyle_lineThickness,
                    backgroundText_colour:backgroundTextStyle_colour,
                    backgroundText_size:backgroundTextStyle_size,
                    backgroundText_font:backgroundTextStyle_font,
                    backing:backingStyle,
                }
            });
            graph.resolution(10);
            object.append(graph);
        //needle overlay
            var overlay = interfacePart.builder('needleOverlay', 'overlay', {
                width:width, height:height, interactable:interactable, selectNeedle:selectNeedle, selectionArea:selectionArea,
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
            object.interactable = overlay.interactable;

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