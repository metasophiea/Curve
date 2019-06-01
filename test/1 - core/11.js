var tmp = _canvas_.core.shape.create('polygon');
    tmp.name = 'polygon_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.pointsAsXYArray([ 
        {x:0,y:0},
        {x:400,y:200},
        {x:400,y:400},
        {x:0,y:400}

        // {x:10,y:80}, 
        // {x:50,y:80}, 
        // {x:20,y:100}, 
        // {x:70,y:140}, 
        // {x:10,y:140},
    ]);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
    tmp.onmousedown = function(){
        console.log('click');
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    };
    _canvas_.core.arrangement.append(tmp);

_canvas_.core.viewport.clickVisibility(true);
_canvas_.core.render.active(true);



console.log(_canvas_.core.arrangement.getElementsUnderPoint(115, 30));