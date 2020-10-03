//add main panes to arrangement
_canvas_.system.pane = {};

_canvas_.layers.registerFunctionForLayer("core", function(){
    //background
        _canvas_.system.pane.background = _canvas_.core.element.create('Group','background');
        _canvas_.system.pane.background.ignored(true);
        _canvas_.core.arrangement.append( _canvas_.system.pane.background );

    //middleground
        _canvas_.system.pane.middleground = _canvas_.core.element.create('Group','middleground');
        _canvas_.system.pane.middleground.heedCamera(true);
        _canvas_.core.arrangement.append( _canvas_.system.pane.middleground );
        //back
            _canvas_.system.pane.middleground_back = _canvas_.core.element.create('Group','back');
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground_back );
        //middle
            _canvas_.system.pane.middleground_middle = _canvas_.core.element.create('Group','middle');
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground_middle );
        //front
            _canvas_.system.pane.middleground_front = _canvas_.core.element.create('Group','front');
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground_front );

    //foreground
        _canvas_.system.pane.foreground = _canvas_.core.element.create('Group','foreground');
        _canvas_.core.arrangement.append( _canvas_.system.pane.foreground );

    //shortcuts
        _canvas_.system.pane.b = _canvas_.system.pane.background;
        _canvas_.system.pane.mb = _canvas_.system.pane.middleground_back;
        _canvas_.system.pane.mm = _canvas_.system.pane.middleground_middle;
        _canvas_.system.pane.mf = _canvas_.system.pane.middleground_front;
        _canvas_.system.pane.f = _canvas_.system.pane.foreground;
} );

//utility
    _canvas_.system.pane.getMiddlegroundPane = function(element){
        let tempElement = element;
        while(tempElement != undefined){
            if(tempElement == _canvas_.system.pane.mb){ return _canvas_.system.pane.mb; }
            if(tempElement == _canvas_.system.pane.mm){ return _canvas_.system.pane.mm; }
            if(tempElement == _canvas_.system.pane.mf){ return _canvas_.system.pane.mf; }
            tempElement = tempElement.parent;
        }
    };