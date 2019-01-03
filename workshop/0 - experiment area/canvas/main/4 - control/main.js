{{include:mouse.js}}
{{include:keyboard.js}}

workspace.control = new function(){
    var control = this;

    this.gui = new function(){
        var pane = workspace.system.pane.f;
        var menubar = undefined;

        this.refresh = function(){
            if(menubar != undefined){menubar.refresh();}
        };

        this.showMenubar = function(){
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
            menubar.closeAllDropdowns();
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