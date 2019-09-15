var tmp = _canvas_.core.shape.create('canvas');
    tmp.name = 'canvas_1';
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.x(0);
    tmp.y(0);
    tmp.width(_canvas_.width);
    tmp.height(_canvas_.height);
    tmp.stopAttributeStartedExtremityUpdate = false;
    _canvas_.core.arrangement.append(tmp);
        tmp._.fillStyle = 'rgb(100,100,100)';
        tmp._.fillRect(tmp.$(5),tmp.$(5),tmp.$(160),tmp.$(160));
        tmp._.fillStyle = 'rgba(255,0,255,0.5)';
        tmp._.fillRect(tmp.$(0),tmp.$(0),tmp.$(20),tmp.$(20));


_canvas_.core.render.frame();