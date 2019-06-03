//colour test


for(var RED = 0; RED < 256; RED+=10){
    for(var GREEN = 0; GREEN < 256; GREEN+=10){
        var tmp = _canvas_.core.shape.create('rectangle');
            tmp.name = 'rectangle_'+RED+'_'+GREEN;
            tmp.stopAttributeStartedExtremityUpdate = true;
            tmp.x(10+RED*4);
            tmp.y(10+GREEN*4); 
            tmp.width(30);
            tmp.height(30);
            tmp.stopAttributeStartedExtremityUpdate = false;
            tmp.colour = {r:RED/255,g:0/255,b:0,a:1};
            console.log({r:RED/255,g:GREEN/255,b:0,a:1});
            _canvas_.core.arrangement.append(tmp);
    }
}









_canvas_.core.render.frame();