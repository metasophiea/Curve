//add main panes to arrangement
_canvas_.system.pane = {};

_canvas_.core.meta.go = function(){

    //background
        _canvas_.core.meta.createSetAppend('group','background',{ignored:true}).then(id => { 
            _canvas_.system.pane.background = id;
            _canvas_.system.pane.b = id;
        });

    //middleground
         _canvas_.core.meta.createSetAppend('group','middleground').then(id => { 
            _canvas_.system.pane.middleground = id;
        }).then(() => {
            //back
                _canvas_.core.meta.createSetAppend('group','back',undefined,_canvas_.system.pane.middleground).then(id => { 
                    _canvas_.system.pane.middleground.back = id;
                    _canvas_.system.pane.mb = id;
                });

            //middle
                _canvas_.core.meta.createSetAppend('group','middle',undefined,_canvas_.system.pane.middleground).then(id => { 
                    _canvas_.system.pane.middleground.middle = id; 
                    _canvas_.system.pane.mm = id;
                });

            //front
                _canvas_.core.meta.createSetAppend('group','front',undefined,_canvas_.system.pane.middleground).then(id => { 
                    _canvas_.system.pane.middleground.front = id;
                    _canvas_.system.pane.mf = id;
                });
        });

    //foreground
        _canvas_.core.meta.createSetAppend('group','foreground',{ignored:true}).then(id => { 
            _canvas_.system.pane.foreground = id;
            _canvas_.system.pane.f = id;
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