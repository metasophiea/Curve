//add main panes to arrangement
canvas.system.pane = {};

//background
    canvas.system.pane.background = canvas.core.arrangement.createElement('group');
    canvas.system.pane.background.name = 'background'
    canvas.system.pane.background.static = true;
    canvas.system.pane.background.ignored = true;
    canvas.core.arrangement.append( canvas.system.pane.background );

//middleground
    canvas.system.pane.middleground = canvas.core.arrangement.createElement('group');
    canvas.system.pane.middleground.name = 'middleground'
    canvas.core.arrangement.append( canvas.system.pane.middleground );

        //back
            canvas.system.pane.middleground.back = canvas.core.arrangement.createElement('group');
            canvas.system.pane.middleground.back.name = 'back'
            canvas.system.pane.middleground.append( canvas.system.pane.middleground.back );

        //middle
            canvas.system.pane.middleground.middle = canvas.core.arrangement.createElement('group');
            canvas.system.pane.middleground.middle.name = 'middle'
            canvas.system.pane.middleground.append( canvas.system.pane.middleground.middle );

        //front
            canvas.system.pane.middleground.front = canvas.core.arrangement.createElement('group');
            canvas.system.pane.middleground.front.name = 'front'
            canvas.system.pane.middleground.append( canvas.system.pane.middleground.front );

//foreground
    canvas.system.pane.foreground = canvas.core.arrangement.createElement('group');
    canvas.system.pane.foreground.name = 'foreground'
    canvas.system.pane.foreground.static = true;
    canvas.core.arrangement.append( canvas.system.pane.foreground );


    
//shortcuts
    canvas.system.pane.b = canvas.system.pane.background;
    canvas.system.pane.mb = canvas.system.pane.middleground.back;
    canvas.system.pane.mm = canvas.system.pane.middleground.middle;
    canvas.system.pane.mf = canvas.system.pane.middleground.front;
    canvas.system.pane.f = canvas.system.pane.foreground;

//utility
    canvas.system.pane.getMiddlegroundPane = function(element){
        var tmp = element;
        do{
            if(tmp == canvas.system.pane.mb){return canvas.system.pane.mb;}
            else if(tmp == canvas.system.pane.mm){return canvas.system.pane.mm;}
            else if(tmp == canvas.system.pane.mf){return canvas.system.pane.mf;}
        }while((tmp=tmp.parent) != undefined);
    };