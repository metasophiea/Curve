//add main panes to arrangement
_canvas_.system.pane = {};

_canvas_.core.meta.go = function(){
    //background
        _canvas_.core.element.create('group','background').then(group => {
            _canvas_.core.arrangement.append(group);
            group.ignored(true);
            _canvas_.system.pane.background = group;
            _canvas_.system.pane.b = group;
        });

    //middleground
        _canvas_.core.element.create('group','middleground').then(group => {
            _canvas_.core.arrangement.append(group);
            _canvas_.system.pane.middleground = group;
        }).then(() => {
            //back
                _canvas_.core.element.create('group','back').then(group => {
                    _canvas_.system.pane.middleground.append(group);
                    _canvas_.system.pane.middleground.back = group;
                    _canvas_.system.pane.mb = group;
                });
            //middle
                _canvas_.core.element.create('group','middle').then(group => {
                    _canvas_.system.pane.middleground.append(group);
                    _canvas_.system.pane.middleground.middle = group;
                    _canvas_.system.pane.mm = group;
                });
            //front
                _canvas_.core.element.create('group','front').then(group => {
                    _canvas_.system.pane.middleground.append(group);
                    _canvas_.system.pane.middleground.front = group;
                    _canvas_.system.pane.mf = group;
                });
        });

    //foreground
        _canvas_.core.element.create('group','foreground').then(group => {
            _canvas_.core.arrangement.append(group);
            group.ignored(true);
            _canvas_.system.pane.foreground = group;
            _canvas_.system.pane.f = group;
        });

    const checkingInterval = setInterval(() => {
        if(
            _canvas_.system.pane.b != undefined &&
            _canvas_.system.pane.mb != undefined &&
            _canvas_.system.pane.mm != undefined &&
            _canvas_.system.pane.mf != undefined &&
            _canvas_.system.pane.f != undefined
        ){
            clearInterval(checkingInterval);
            _canvas_.layers.registerLayerLoaded('system',_canvas_.system);
            if(_canvas_.system.go){_canvas_.system.go();}
        }
    }, 1);
};

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