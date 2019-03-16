{{include:mouse.js}}
{{include:keyboard.js}}

_canvas_.control = new function(){
    var control = this;

    this.interaction = new function(){
        //global dev mode
            var devMode = false;
            this.devMode = function(bool){
                if(bool==undefined){return devMode;}
                devMode = bool;

                //if we're in dev mode; enable all switches
                    if(devMode){
                        for(item in this){
                            if(item != 'devMode'){
                                this[item](true);
                            }
                        }
                    }
            };

        //control
            var enableMenubar = true;
            this.enableMenubar = function(bool){
                if(bool==undefined){return enableMenubar;}
                // if(devMode){return;}
                enableMenubar = bool;
                if(!enableMenubar){ control.gui.hideMenubar(); }
            };
            var enableSceneSave = true;
            this.enableSceneSave = function(bool){
                if(bool==undefined){return enableSceneSave;}
                if(devMode){return;}
                enableSceneSave = bool;
            };
            var enableSceneLoad = true;
            this.enableSceneLoad = function(bool){
                if(bool==undefined){return enableSceneLoad;}
                if(devMode){return;}
                enableSceneLoad = bool;
        };

        //unit modifications
            var enableUnitAdditionRemoval = true;
            this.enableUnitAdditionRemoval = function(bool){
                if(bool==undefined){return enableUnitAdditionRemoval;}
                if(devMode){return;}
                enableUnitAdditionRemoval = bool;
            };
            var enableUnitSelection = true;
            this.enableUnitSelection = function(bool){
                if(bool==undefined){return enableUnitSelection;}
                if(devMode){return;}
                enableUnitSelection = bool;
            };
            var enableUnitInteractable = true;
            this.enableUnitInteractable = function(bool){
                if(bool==undefined){return enableUnitInteractable;}
                if(devMode){return;}
                enableUnitInteractable = bool;
                control.scene.getAllUnits().forEach(a => a.interactable(enableUnitInteractable));
            };
            var enableUnitCollision = true;
            this.enableUnitCollision = function(bool){
                if(bool==undefined){return enableUnitCollision;}
                if(devMode){return;}
                enableUnitCollision = bool;
            };
            var enablCableDisconnectionConnection = true;
            this.enableCableDisconnectionConnection = function(bool){
                if(bool==undefined){return enablCableDisconnectionConnection;}
                if(devMode){return;}
                enablCableDisconnectionConnection = bool;
                control.scene.getAllUnits().forEach(a => {
                    a.allowIOConnections(enablCableDisconnectionConnection);
                    a.allowIODisconnections(enablCableDisconnectionConnection);
                });
            };

        //general mouse actions
            var mouseGripPanningEnabled = true;
            this.mouseGripPanningEnabled = function(bool){
                if(bool==undefined){return mouseGripPanningEnabled;}
                if(devMode){return;}
                mouseGripPanningEnabled = bool;
            };
            var mouseWheelZoomEnabled = true;
            this.mouseWheelZoomEnabled = function(bool){
                if(bool==undefined){return mouseWheelZoomEnabled;}
                if(devMode){return;}
                mouseWheelZoomEnabled = bool;
            };
            var mouseGroupSelect = true;
            this.mouseGroupSelect = function(bool){
                if(bool==undefined){return mouseGroupSelect;}
                if(devMode){return;}
                mouseGroupSelect = bool;
            };
    };

    this.gui = new function(){
        var pane = _canvas_.system.pane.f;
        var menubar = undefined;
        var scale = window.devicePixelRatio;

        this.refresh = function(){
            if(menubar != undefined){menubar.refresh();}
        };

        this.showMenubar = function(){
            //control switch
                if(!_canvas_.control.interaction.enableMenubar()){
                    this.hideMenubar();
                    return;
                }

            if(menubar != undefined){return;}
            menubar = control.gui.elements.menubar(0,0,scale);
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
        this.width = function(){ return _canvas_.width; };
        this.height = function(){ return _canvas_.height; };

        this.scale = function(a){ return _canvas_.core.viewport.scale(a); };
        this.position = function(x,y){ return _canvas_.core.viewport.position(x,y); };
        this.refresh = function(){ 
            _canvas_.core.viewport.refresh();
            control.gui.refresh();
        };
        this.stopMouseScroll = function(bool){
            return _canvas_.core.viewport.stopMouseScroll(bool);
        }
        this.activeRender = function(bool){ return _canvas_.core.render.active(bool); };
    };
    this.scene = new function(){
        var pane = _canvas_.system.pane.mm;
        var IDcounter = 0;

        {{include:scene.js}}
    };
    this.selection = new function(){
        {{include:selection.js}}
    };
};

{{include:grapple.js}}

window.onresize = _canvas_.control.viewport.refresh; 
_canvas_.control.interaction.devMode( (new URL(window.location.href)).searchParams.get("dev") != null );