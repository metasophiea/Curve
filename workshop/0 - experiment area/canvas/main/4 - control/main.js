{{include:mouse.js}}
{{include:keyboard.js}}

workspace.control = new function(){
    var control = this;

    this.switch = {
        devMode: (new URL(window.location.href)).searchParams.get("dev") != null,

        mouseWheelZoomEnabled: true,
        mouseGripPanningEnabled: true,
        mouseGroupSelect: true,
        enableSceneSave: true,
        enableSceneLoad: true,
        enableMenubar: true,
        enableWindowScrollbarAutomaticRemoval: true,
        enableUnitSelection: true,
        enableSceneModification: true,

        // enablCableDisconnectionConnection: true,
        // enableUnitInterface: true,
    };

    this.gui = new function(){
        var pane = workspace.system.pane.f;
        var menubar = undefined;

        this.refresh = function(){
            if(menubar != undefined){menubar.refresh();}
        };

        this.showMenubar = function(){
            //control switch
                if(!workspace.control.switch.enableMenubar){
                    this.hideMenubar();
                    return;
                }

            if(menubar != undefined){return;}
            menubar = control.gui.elements.menubar(0,0);
            pane.append( menubar );
        };
        this.hideMenubar = function(){
            if(menubar == undefined){return;}
            pane.remove( menubar );
            menubar = undefined;
        };
        this.closeAllDropdowns = function(){
            if(menubar != undefined){
                menubar.closeAllDropdowns();
            }
        };

        this.elements = new function(){
            {{include:gui/menubar.js}}
        };
    };
    this.viewport = new function(){
        this.width = function(){ return workspace.width; };
        this.height = function(){ return workspace.height; };

        this.scale = function(a){ return workspace.core.viewport.scale(a); };
        this.position = function(x,y){ return workspace.core.viewport.position(x,y); };
        this.refresh = function(){ 
            workspace.core.viewport.refresh();
            control.gui.refresh();
        };
        this.stopMouseScroll = function(bool){
            //control switch
                if(!workspace.control.switch.enableWindowScrollbarAutomaticRemoval){
                    workspace.core.viewport.stopMouseScroll(false);
                    return false;
                }

            return workspace.core.viewport.stopMouseScroll(bool);
        }
        this.activeRender = function(bool){ return workspace.core.render.active(bool); };
    };
    this.scene = new function(){
        var pane = workspace.system.pane.mm;
        var IDcounter = 0;

        {{include:scene.js}}
    };
    this.selection = new function(){
        {{include:selection.js}}
    };
};

{{include:grapple.js}}

window.onresize = workspace.control.viewport.refresh; 
if( !workspace.control.switch.devMode ){ window.onbeforeunload = function(){ return "Unsaved work will be lost"; }; }

workspace.control.gui.showMenubar();
workspace.control.viewport.stopMouseScroll(true);
workspace.control.viewport.activeRender(true);