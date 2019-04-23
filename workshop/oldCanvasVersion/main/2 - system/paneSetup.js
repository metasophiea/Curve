//add main panes to arrangement
workspace.system.pane = {};

//background
    workspace.system.pane.background = workspace.core.arrangement.createElement('group');
    workspace.system.pane.background.name = 'background'
    workspace.system.pane.background.static = true;
    workspace.system.pane.background.ignored = true;
    workspace.core.arrangement.append( workspace.system.pane.background );

//middleground
    workspace.system.pane.middleground = workspace.core.arrangement.createElement('group');
    workspace.system.pane.middleground.name = 'middleground'
    workspace.core.arrangement.append( workspace.system.pane.middleground );

        //back
            workspace.system.pane.middleground.back = workspace.core.arrangement.createElement('group');
            workspace.system.pane.middleground.back.name = 'back'
            workspace.system.pane.middleground.append( workspace.system.pane.middleground.back );

        //middle
            workspace.system.pane.middleground.middle = workspace.core.arrangement.createElement('group');
            workspace.system.pane.middleground.middle.name = 'middle'
            workspace.system.pane.middleground.append( workspace.system.pane.middleground.middle );

        //front
            workspace.system.pane.middleground.front = workspace.core.arrangement.createElement('group');
            workspace.system.pane.middleground.front.name = 'front'
            workspace.system.pane.middleground.append( workspace.system.pane.middleground.front );

//foreground
    workspace.system.pane.foreground = workspace.core.arrangement.createElement('group');
    workspace.system.pane.foreground.name = 'foreground'
    workspace.system.pane.foreground.static = true;
    workspace.core.arrangement.append( workspace.system.pane.foreground );


    
//shortcuts
    workspace.system.pane.b = workspace.system.pane.background;
    workspace.system.pane.mb = workspace.system.pane.middleground.back;
    workspace.system.pane.mm = workspace.system.pane.middleground.middle;
    workspace.system.pane.mf = workspace.system.pane.middleground.front;
    workspace.system.pane.f = workspace.system.pane.foreground;

//utility
    workspace.system.pane.getMiddlegroundPane = function(element){
        var tmp = element;
        do{
            if(tmp == workspace.system.pane.mb){return workspace.system.pane.mb;}
            else if(tmp == workspace.system.pane.mm){return workspace.system.pane.mm;}
            else if(tmp == workspace.system.pane.mf){return workspace.system.pane.mf;}
        }while((tmp=tmp.parent) != undefined);
    };