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
    backgroundTextStyle_size=10,
    backgroundTextStyle_font='Helvetica',

    backingStyle={r:0.2,g:0.2,b:0.2,a:1},

    onchange=function(needle,value){}, 
    onrelease=function(needle,value){}, 
    selectionAreaToggle=function(bool){},
){
    dev.log.partControl('.grapher_waveWorkspace(...)'); //#development

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //main graph
            const graph = interfacePart.builder('display','grapher', 'graph', {
                static:true, resolution:10,
                width:width, height:height,
                backgroundText_horizontalMarkings:{ points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:['3/4','1/2','1/4','0','-1/4','-1/2','-3/4'], textPositionOffset:{x:1,y:-0.5}, printText:true },
                backgroundText_verticalMarkings:{  points:[0.75,0.5,0.25,0], printText:false },
                style:{
                    foregrounds:foregroundStyles,   
                    foregroundText:foregroundTextStyles,
                    background_colour:backgroundStyle_colour,
                    background_lineThickness:backgroundStyle_lineThickness,
                    backgroundText_colour:backgroundTextStyle_colour,
                    backgroundText_size:backgroundTextStyle_size,
                    backgroundText_font:backgroundTextStyle_font,
                    backing:backingStyle,
                }
            });
            object.append(graph);
        //needle overlay
            const overlay = interfacePart.builder('control','needleOverlay', 'overlay', {
                width:width, height:height, interactable:interactable, selectNeedle:selectNeedle, selectionArea:selectionArea,
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
            object.removeAllMarkers = overlay.removeAllMarkers;
            object.select = overlay.select;
            object.area = overlay.area;
            object.interactable = overlay.interactable;
            object.areaIsActive = overlay.areaIsActive;
            object.list = overlay.list;

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

interfacePart.partLibrary.control.grapher_waveWorkspace = function(name,data){ return interfacePart.collection.control.grapher_waveWorkspace(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.selectNeedle, data.selectionArea,
    data.style.foregrounds, data.style.foregroundText,
    data.style.background_colour, data.style.background_lineThickness,
    data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
    data.style.backing,
    data.onchange, data.onrelease, data.selectionAreaToggle
); };