function makeText(y,font){
    var tmp = _canvas_.core.shape.create('characterString');
    tmp.name = 'characterString_'+y;
    tmp.stopAttributeStartedExtremityUpdate = true;
    tmp.string(font);
    tmp.x(10);
    tmp.y(y);
    tmp.width(60);
    tmp.height(60);
    tmp.font(font);
    tmp.printingMode({ widthCalculation:'absolute', horizontal:'left', vertical:'top' });
    tmp.stopAttributeStartedExtremityUpdate = false;
    tmp.colour({r:Math.random(),g:Math.random(),b:Math.random(),a:1});
    _canvas_.core.arrangement.append(tmp);
}


var gap = 60;
_canvas_.core.shape.library.character.getLoadableFonts().forEach((name,index) => {
    makeText(index*gap,name);
});



_canvas_.core.render.frame();
setTimeout(function(){ _canvas_.core.render.frame(); },1500);