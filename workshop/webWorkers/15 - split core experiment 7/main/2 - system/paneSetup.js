//add main panes to arrangement
_canvas_.system.pane = {};

_canvas_.core.go.add( function(){
    //background
        _canvas_.system.pane.background = _canvas_.core.element.create('group','background');
        _canvas_.system.pane.background.ignored(true);
        _canvas_.core.arrangement.append( _canvas_.system.pane.background );

    //middleground
        _canvas_.system.pane.middleground = _canvas_.core.element.create('group','middleground');
        _canvas_.system.pane.middleground.heedCamera(true);
        _canvas_.core.arrangement.append( _canvas_.system.pane.middleground );
        //back
            _canvas_.system.pane.middleground_back = _canvas_.core.element.create('group','back');
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground_back );
        //middle
            _canvas_.system.pane.middleground_middle = _canvas_.core.element.create('group','middle');
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground_middle );
        //front
            _canvas_.system.pane.middleground_front = _canvas_.core.element.create('group','front');
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground_front );

    //foreground
        _canvas_.system.pane.foreground = _canvas_.core.element.create('group','foreground');
        _canvas_.system.pane.foreground.ignored(true);
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
        const middlegrounds = [_canvas_.system.pane.mb, _canvas_.system.pane.mm, _canvas_.system.pane.mf];

        return new Promise((resolve, reject) => {
            _canvas_.core.arrangement.areParents( element, middlegrounds ).then(response => {
                const index = response.indexOf(0);
                resolve( index == -1 ? null : middlegrounds[index] );
            });
        });
    };