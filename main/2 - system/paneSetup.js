//add main panes to arrangement
_canvas_.system.pane = {};

//background
    _canvas_.system.pane.background = _canvas_.core.shape.create('group');
    _canvas_.system.pane.background.name = 'background'
    _canvas_.system.pane.background.ignored = true;
    _canvas_.core.arrangement.append( _canvas_.system.pane.background );

//middleground
    _canvas_.system.pane.middleground = _canvas_.core.shape.create('group');
    _canvas_.system.pane.middleground.name = 'middleground'
    _canvas_.system.pane.middleground.heedCamera = true;
    _canvas_.core.arrangement.append( _canvas_.system.pane.middleground );

        //back
            _canvas_.system.pane.middleground.back = _canvas_.core.shape.create('group');
            _canvas_.system.pane.middleground.back.name = 'back'
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground.back );

        //middle
            _canvas_.system.pane.middleground.middle = _canvas_.core.shape.create('group');
            _canvas_.system.pane.middleground.middle.name = 'middle'
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground.middle );

        //front
            _canvas_.system.pane.middleground.front = _canvas_.core.shape.create('group');
            _canvas_.system.pane.middleground.front.name = 'front'
            _canvas_.system.pane.middleground.append( _canvas_.system.pane.middleground.front );

//foreground
    _canvas_.system.pane.foreground = _canvas_.core.shape.create('group');
    _canvas_.system.pane.foreground.name = 'foreground'
    _canvas_.core.arrangement.append( _canvas_.system.pane.foreground );


    
//shortcuts
    _canvas_.system.pane.b = _canvas_.system.pane.background;
    _canvas_.system.pane.mb = _canvas_.system.pane.middleground.back;
    _canvas_.system.pane.mm = _canvas_.system.pane.middleground.middle;
    _canvas_.system.pane.mf = _canvas_.system.pane.middleground.front;
    _canvas_.system.pane.f = _canvas_.system.pane.foreground;

//utility
    _canvas_.system.pane.getMiddlegroundPane = function(element){
        var tmp = element;
        do{
            if(tmp == _canvas_.system.pane.mb){return _canvas_.system.pane.mb;}
            else if(tmp == _canvas_.system.pane.mm){return _canvas_.system.pane.mm;}
            else if(tmp == _canvas_.system.pane.mf){return _canvas_.system.pane.mf;}
        }while((tmp=tmp.parent) != undefined);
        return null;
    };