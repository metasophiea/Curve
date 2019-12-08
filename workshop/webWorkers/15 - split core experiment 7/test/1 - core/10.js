_canvas_.core.go.add( function(){ 
    var gap = 50;
    _canvas_.library.font.getLoadableFonts().forEach((name,index) => {
        
        let characterString = _canvas_.core.element.create('characterString','characterString_'+index);
        characterString.unifiedAttribute({
            string:name,
            font:name,
            x:10, y:gap*index, width:gap, height:gap, 
            colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
        });
        _canvas_.core.arrangement.append(characterString);

    });

    _canvas_.core.render.frame();
    setTimeout(function(){ _canvas_.core.render.frame(); },500);
    setTimeout(function(){ _canvas_.core.render.frame(); },1000);
    setTimeout(function(){ _canvas_.core.render.frame(); },1500);
    setTimeout(function(){ _canvas_.core.render.frame(); },2000);
    setTimeout(function(){ _canvas_.core.render.frame(); },2500);
} );