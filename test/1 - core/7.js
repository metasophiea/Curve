var tmp = _canvas_.core.shape.create('rectangle');
    tmp.name = 'rectangle_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(10); 
    tmp.y(10);
    tmp.width(60);
    tmp.height(60);
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
    _canvas_.core.arrangement.append(tmp);

_canvas_.core.render.frame();
_canvas_.core.viewport.clickVisibility(true);