this.set = function(newStyle){
    if(menubar == undefined){return;}
    return menubar.style(newStyle);
};

this.currentStyleMode = 'light';
this.lightMode = function(){
    this.currentStyleMode = 'light';

    _canvas_.control.scene.backgroundColour({r:1,g:1,b:1,a:1});

    _canvas_.control.gui.style.set('default');
};
this.darkMode = function(){
    this.currentStyleMode = 'dark';

    _canvas_.control.scene.backgroundColour({r:0,g:0,b:0,a:1});

    _canvas_.control.gui.style.set('dark');
};