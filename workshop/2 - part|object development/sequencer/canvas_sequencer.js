var canvas_sequencer = function(
    id='canvas_sequencer',
    x, y, width, height, angle,
    
    xCount=64, yCount=16,
    zoomLevel_x=1/1, zoomLevel_y=1/1,

    backingStyle='fill:rgba(20,20,20,1);',
    selectionAreaStyle='fill:rgba(209, 189, 222, 0.5);stroke:rgba(225, 217, 234,1);stroke-width:0.5;pointer-events:none;',

    blockStyle_body=[
        'fill:rgba(138,138,138,0.6);stroke:rgba(175,175,175,0.8);stroke-width:0.5;',
        'fill:rgba(130,199,208,0.6);stroke:rgba(130,199,208,0.8);stroke-width:0.5;',
        'fill:rgba(129,209,173,0.6);stroke:rgba(129,209,173,0.8);stroke-width:0.5;',
        'fill:rgba(234,238,110,0.6);stroke:rgba(234,238,110,0.8);stroke-width:0.5;',
        'fill:rgba(249,178,103,0.6);stroke:rgba(249,178,103,0.8);stroke-width:0.5;',
        'fill:rgba(255, 69, 69,0.6);stroke:rgba(255, 69, 69,0.8);stroke-width:0.5;',
    ],
    blockStyle_bodyGlow=[
        'fill:rgba(138,138,138,0.8);stroke:rgba(175,175,175,1);stroke-width:0.5;',
        'fill:rgba(130,199,208,0.8);stroke:rgba(130,199,208,1);stroke-width:0.5;',
        'fill:rgba(129,209,173,0.8);stroke:rgba(129,209,173,1);stroke-width:0.5;',
        'fill:rgba(234,238,110,0.8);stroke:rgba(234,238,110,1);stroke-width:0.5;',
        'fill:rgba(249,178,103,0.8);stroke:rgba(249,178,103,1);stroke-width:0.5;',
        'fill:rgba(255, 69, 69,0.8);stroke:rgba(255, 69, 69,1);stroke-width:0.5;',
    ],    
    blockStyle_handle='fill:rgba(200,0,0,0.75);cursor:col-resize;',
    blockStyle_handleWidth=3,

    horizontalStripStyle_pattern=[0,1],
    horizontalStripStyle_glow='stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.8);',
    horizontalStripStyle_styles=[
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.5);',
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(100,100,100,0);',
    ],
    verticalStripStyle_pattern=[0],
    verticalStripStyle_glow='stroke:rgba(252,244,128,0.5);stroke-width:0.5;fill:rgba(229, 221, 112,0.25);',
    verticalStripStyle_styles=[
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(30,30,30,0.5);',
    ],

    playheadStyle='stroke:rgb(240, 240, 240);',
){

    //unpack styles
        backingStyle = system.utility.element.styleExtractor(backingStyle);
        selectionAreaStyle = system.utility.element.styleExtractor(selectionAreaStyle);
        blockStyle_body = blockStyle_body.map(a => system.utility.element.styleExtractor(a));
        blockStyle_bodyGlow = blockStyle_bodyGlow.map(a => system.utility.element.styleExtractor(a));
        blockStyle_handle = system.utility.element.styleExtractor(blockStyle_handle);
        horizontalStripStyle_glow = system.utility.element.styleExtractor(horizontalStripStyle_glow);
        horizontalStripStyle_styles = horizontalStripStyle_styles.map(a => system.utility.element.styleExtractor(a));
        verticalStripStyle_glow = system.utility.element.styleExtractor(verticalStripStyle_glow);
        verticalStripStyle_styles = verticalStripStyle_styles.map(a => system.utility.element.styleExtractor(a));
        playheadStyle = system.utility.element.styleExtractor(playheadStyle);

    //state
        var totalSize =  {
            width:  width/zoomLevel_x,
            height: height/zoomLevel_y,
        };
        var viewposition = {x:0,y:0};
        var viewArea = {
            left:0, right:zoomLevel_x,
            top:0, bottom:zoomLevel_y,
        };
        var noteRegistry = new parts.circuits.sequencing.noteRegistry(xCount,yCount);
        var selectedNotes = [];
        var activeNotes = [];
        var snapping = true;
        var step = 1/1;
        var defualtStrength = 0.5;
        var loop = {active:false, period:{start:0, end:xCount}};
        var playhead = {
            width:0.75,
            invisibleHandleMux:6,
            position:-1,
            held:false,
            automoveViewposition:false,
        };

    //internal functions
        function setViewArea(d,update=true){
            //clean up received data
            if(d == undefined || (d.left == undefined && d.right == undefined && d.top == undefined && d.bottom == undefined)){return viewArea;}
            if(d.left == undefined){d.left = viewArea.left;} if(d.right == undefined){d.right = viewArea.right;}
            if(d.top == undefined){d.top = viewArea.top;}    if(d.bottom == undefined){d.bottom = viewArea.bottom;}

            zoomLevel_x = (d.right-d.left);
            zoomLevel_y = (d.bottom-d.top);

            render();
        }
        function drawBackground(){
            //background pane
                canvas.context.fillStyle = backingStyle.fill;
                canvas.context.fillRect( 0, 0, canvas.c(width), canvas.c(height) );

            //background stipes
                //horizontal strips
                for(var a = 0; a < yCount; a++){
                    var temp = horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]];
                    var mux = height/(yCount*zoomLevel_y);
                    canvas.context.strokeStyle = temp.stroke;
                    canvas.context.fillStyle = temp.fill;
                    canvas.context.lineWidth = temp['stroke-width']*5;
                    canvas.context.fillRect(   0, canvas.c(a*mux), canvas.c(totalSize.width), canvas.c(mux) );
                    canvas.context.strokeRect( 0, canvas.c(a*mux), canvas.c(totalSize.width), canvas.c(mux) );                            
                }
                //vertical strips
                for(var a = 0; a < xCount; a++){
                    var temp = verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]];
                    var mux = width/(xCount*zoomLevel_x);
                    canvas.context.strokeStyle = temp.stroke;
                    canvas.context.fillStyle = temp.fill;
                    canvas.context.lineWidth = temp['stroke-width']*5;
                    canvas.context.fillRect(   canvas.c(a*mux), 0, canvas.c(mux), canvas.c(totalSize.height) );
                    canvas.context.strokeRect( canvas.c(a*mux), 0, canvas.c(mux), canvas.c(totalSize.height) );
                }
        }
        function render(){
            drawBackground();
            canvas.print();
        }

    //elements
        //main
        var obj = system.utility.misc.elementMaker('g',id,{x:x, y:y});
        //canvas
            var canvas = system.utility.misc.elementMaker('canvas',id,{width:width, height:height, resolution:5});
            obj.appendChild(canvas.element);
    //controls
        obj.viewArea = setViewArea;
    //callbacks

    render();
    return obj;
};