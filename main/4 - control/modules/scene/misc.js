this.listLayers = function(printToConsole=false){
    dev.log.scene('.listLayers(',printToConsole); //#development

    if(!printToConsole){
        function print(unit){
            return { model:unit.model, name:unit.name, x:unit.x(), y:unit.y(), a:unit.angle() };
        }
        return {
            foreground:_canvas_.system.pane.mf.getChildren().filter( a => !a._isCable ).map(print),
            middleground:_canvas_.system.pane.mm.getChildren().filter( a => !a._isCable ).map(print),
            background:_canvas_.system.pane.mb.getChildren().filter( a => !a._isCable ).map(print),
        };
    }

    function print(unit){
        console.log( '\t', 'model:'+unit.model, 'name:'+unit.name, '-', '{x:'+unit.x()+',y:'+unit.y()+',a:'+unit.angle()+'}' );
    }

    console.log('foreground'); _canvas_.system.pane.mf.children().filter( a => !a._isCable ).forEach(print);
    console.log('middleground'); _canvas_.system.pane.mm.children().filter( a => !a._isCable ).forEach(print);
    console.log('background'); _canvas_.system.pane.mb.children().filter( a => !a._isCable ).forEach(print);
};
this.backgroundColour = function(colour){
    dev.log.scene('.backgroundColour(',colour); //#development
    return _canvas_.core.render.clearColour(colour);
};