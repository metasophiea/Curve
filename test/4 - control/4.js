_canvas_.control.viewport.activeRender(true);

var tmp = _canvas_.core.shape.create('canvas');
    tmp.name = 'canvas_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(0);
    tmp.y(0);
    tmp.width(_canvas_.control.viewport.width());
    tmp.height(_canvas_.control.viewport.height());
    tmp.stopAttributeStartedExtremityUpdate = false;
    _canvas_.system.pane.b.append(tmp);


//         tmp._.fillStyle = 'rgb(200,100,100)';
//         tmp._.fillRect(tmp.$(0),tmp.$(0),tmp.$(_canvas_.control.viewport.width()),tmp.$(_canvas_.control.viewport.height()));

//         _canvas_.core.viewport.cameraAdjust = function(data){
//             backgroundGenerator_2(tmp,data.position,data.scale,data.angle);
//         };
//         _canvas_.core.viewport.cameraAdjust({position:{x:0,y:0}, scale:1, angle:0});


// function backgroundGenerator_1(canvas,position,scale,angle){
//     canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:1,g:1,b:1,a:1});
//     canvas._.fillRect(0,0,canvas.$(_canvas_.control.viewport.width()),canvas.$(_canvas_.control.viewport.height()));

//     var shapeColour = {r:1,g:0,b:0,a:1};
//     var shapeData = {x:0,y:0,width:10,height:10};
//     canvas._.fillStyle = 'rgba('+shapeColour.r*255+','+shapeColour.g*255+','+shapeColour.b*255+','+shapeColour.a+')';
//     canvas._.fillRect( canvas.$(shapeData.x+position.x), canvas.$(shapeData.y+position.y), canvas.$(shapeData.width*scale), canvas.$(shapeData.height*scale) );

//     canvas.requestUpdate();
// }
// function backgroundGenerator_2(canvas,position,scale,angle){
//     canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:1,g:1,b:1,a:1});
//     canvas._.fillRect(0,0,canvas.$(_canvas_.control.viewport.width()),canvas.$(_canvas_.control.viewport.height()));

//     canvas._.filter = 'blur(5px)';

//     function drawCircle(x,y,r,colour){
//         canvas._.fillStyle = 'rgba('+colour.r*255+','+colour.g*255+','+colour.b*255+','+colour.a+')';
//         canvas._.beginPath();
//         canvas._.arc(canvas.$(x*scale+position.x), canvas.$(y*scale+position.y), canvas.$(r*scale), 0, 2*Math.PI);
//         canvas._.fill();
//         canvas._.closePath();
//     }

//     var field = [
//       {x:0,y:0,r:100,colour:{r:1,g:0,b:0,a:1}},
//       {x:100,y:100,r:100,colour:{r:0,g:1,b:0,a:1}},
//     ];
//     field.forEach(item => drawCircle(item.x,item.y,item.r,item.colour));

//     canvas.requestUpdate();
// }





    var exploredWorkspace = { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
    function mapExploredWorkspace(){
        var data_topLeft = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(0,0);
        var data_bottomRight = _canvas_.core.viewport.adapter.windowPoint2workspacePoint(_canvas_.control.viewport.width(),_canvas_.control.viewport.height());
    
        updated = false;
        if( exploredWorkspace.topLeft.x > data_topLeft.x ){ exploredWorkspace.topLeft.x = data_topLeft.x; updated = true; }
        if( exploredWorkspace.topLeft.y > data_topLeft.y ){ exploredWorkspace.topLeft.y = data_topLeft.y; updated = true; }
        if( exploredWorkspace.bottomRight.x < data_bottomRight.x ){ exploredWorkspace.bottomRight.x = data_bottomRight.x; updated = true; }
        if( exploredWorkspace.bottomRight.y < data_bottomRight.y ){ exploredWorkspace.bottomRight.y = data_bottomRight.y; updated = true; }
        return updated;
    }
    var field = [];
    var filledWorkspace = { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
    // function backgroundGenerator_1(area){
    //     var newField = [];
    //     for(var a = 0; a < 100; a++){
    //         var pos = _canvas_.library.math.cartesianAngleAdjust(a*20,0,a/10);
    //         newField.push( {x:pos.x,y:pos.y,r:10,colour:{r:1,g:0,b:0,a:1}} );
    //     }
    //     return newField;
    // }
    function backgroundGenerator_2(area){
        var approvedColours = [
            {r:1,g:0,b:0,a:1},
            {r:0,g:1,b:0,a:1},
        ];

        var squareSize = 1000;

        var topLeft_x = Math.ceil(Math.abs(area.topLeft.x)/squareSize)*squareSize * Math.sign(area.topLeft.x);
        var topLeft_y = Math.ceil(Math.abs(area.topLeft.y)/squareSize)*squareSize * Math.sign(area.topLeft.y);
        var bottomRight_x = Math.ceil(Math.abs(area.bottomRight.x)/squareSize)*squareSize * Math.sign(area.bottomRight.x);
        var bottomRight_y = Math.ceil(Math.abs(area.bottomRight.y)/squareSize)*squareSize * Math.sign(area.bottomRight.y);

        for(var y = topLeft_y; y < bottomRight_y; y+=squareSize){
            for(var x = topLeft_x; x < bottomRight_x; x+=squareSize){
                if(y < filledWorkspace.topLeft.y || y >= filledWorkspace.bottomRight.y || x < filledWorkspace.topLeft.x || x >= filledWorkspace.bottomRight.x){
                    field.push(
                        {type:'square',x:x,y:y,s:squareSize,
                            // colour:approvedColours[Math.floor(Math.random()*approvedColours.length)]
                            colour:{
                                r: Math.random() + 0.5,
                                g: Math.random() + 0.5,
                                b: Math.random() + 0.5,
                                a: 1
                            }
                        }
                    );
                }
            }
        }

        filledWorkspace.topLeft.x = topLeft_x;
        filledWorkspace.topLeft.y = topLeft_y;
        filledWorkspace.bottomRight.x = bottomRight_x;
        filledWorkspace.bottomRight.y = bottomRight_y;

        return field;
    }
    function drawField(field,canvas,position,scale,angle){
        canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:1,g:1,b:1,a:1});
        canvas._.fillRect(0,0,canvas.$(_canvas_.control.viewport.width()),canvas.$(_canvas_.control.viewport.height()));
    
        // canvas._.filter = 'blur(10px)';
    
        function drawCircle(x,y,r,colour){
            canvas._.fillStyle = 'rgba('+colour.r*255+','+colour.g*255+','+colour.b*255+','+colour.a+')';
            canvas._.beginPath();
            canvas._.arc(canvas.$(x*scale+position.x), canvas.$(y*scale+position.y), canvas.$(r*scale), 0, 2*Math.PI);
            canvas._.fill();
            canvas._.closePath();
        }
        function drawSquare(x,y,s,colour){
            canvas._.fillStyle = 'rgba('+colour.r*255+','+colour.g*255+','+colour.b*255+','+colour.a+')';
            canvas._.fillRect( canvas.$(x*scale+position.x), canvas.$(y*scale+position.y), canvas.$(s*scale), canvas.$(s*scale) );
        }
    
        field.forEach(item => {
            switch(item.type){
                case 'circle': drawCircle(item.x,item.y,item.r,item.colour); break;
                case 'square': drawSquare(item.x,item.y,item.s,item.colour); break;
            }
            
        });
    
        canvas.requestUpdate();
    }

    _canvas_.core.viewport.cameraAdjust = function(data){
        if( mapExploredWorkspace() ){ field = backgroundGenerator_2(exploredWorkspace); }
        drawField(field,tmp,data.position,data.scale,data.angle);
    };
    _canvas_.core.viewport.cameraAdjust({position:{x:0,y:0}, scale:1, angle:0});