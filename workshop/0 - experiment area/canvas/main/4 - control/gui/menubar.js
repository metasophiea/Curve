this.menubar = function(x,y){
    var bar = workspace.interface.part.alpha.builder( 'rectangle', 'rectangle', {x:0, y:0, width:40, height:40} );

    bar.refresh = function(){
        this.parameter.width( workspace.control.viewport.width() );
    };

    bar.refresh();

    return bar;
};