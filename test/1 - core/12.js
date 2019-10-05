//colour test

var density = 1;

for(var RED = 0; RED < 256; RED+=density){
    for(var GREEN = 0; GREEN < 256; GREEN+=density){
        var tmp = _canvas_.core.shape.create('rectangle');
            tmp.name = 'rectangle_'+RED+'_'+GREEN;
            tmp.stopAttributeStartedExtremityUpdate = true;
            tmp.x(10+RED*1);
            tmp.y(10+GREEN*1); 
            tmp.width(density);
            tmp.height(density);
            tmp.stopAttributeStartedExtremityUpdate = false;
            tmp.colour = {r:RED/255,g:GREEN/255,b:0,a:1};
            // console.log({r:RED/255,g:GREEN/255,b:0,a:1});
            _canvas_.core.arrangement.append(tmp);
    }
}





console.log( (256/density) * (256/density) );



_canvas_.core.render.frame();
console.log('frame 1');

setTimeout(
    function(){
        _canvas_.core.render.frame();
        console.log('frame 2');
    },
    5000
)