_canvas_.control = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2020,m:10,d:27} };
    const control = this;

    {{include:dev.js}}

    const interactionState = {};
    {{include:modules/interaction.js}}

    this.gui = new function(){
        let menubar = undefined;

        this.refresh = function(){
            if(menubar != undefined){
                menubar.refresh();
            }
        };
        this.heavyRefresh = function(){
            if(menubar != undefined){
                menubar.heavyRefresh();
            }
        };
        this.checkboxRefresh = function(){
            if(menubar != undefined){
                menubar.checkboxRefresh();
            }
        };

        this.showMenubar = function(){
            //control switch
                if(!interactionState.menubar){
                    this.hideMenubar();
                    return;
                }

            if(menubar != undefined){return;}
            menubar = control.gui.elements.menubar(0,0);
            _canvas_.system.pane.f.append( menubar );
        };
        this.hideMenubar = function(){
            if(menubar == undefined){return;}
            _canvas_.system.pane.f.remove( menubar );
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
        this.style = new function(){
            {{include:gui/style.js}}
        };
    };

    this.viewport = new function(){
        {{include:modules/viewport.js}}
    };
    
    this.scene = new function(){
        {{include:modules/scene/main.js}}
    };
    this.selection = new function(){
        {{include:modules/selection.js}}
    };

    this.actionRegistry = new function(){
        {{include:modules/actionRegistry.js}}
    };
    this.queryString = new function(){
        {{include:modules/queryString.js}}
    };

    this.grapple = new function(){
        {{include:modules/grapple.js}}
    };

    {{include:modules/mouse.js}}
    {{include:modules/keyboard.js}}
};

if( new URL(window.location.href).searchParams.get("dev") != null ){
    _canvas_.control.interaction.unloadWarning(false);
    _canvas_.control.interaction.development(true);
}

window.onresize = _canvas_.control.viewport.refresh; 

_canvas_.layers.registerLayer("control", _canvas_.control);
_canvas_.layers.registerFunctionForLayer("interface", function(){
    _canvas_.layers.declareLayerAsLoaded("control");
} );
