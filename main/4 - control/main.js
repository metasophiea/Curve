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
                //(except 'enableUnloadWarning' which should be disabled)
                    if(devMode){
                        for(item in this){
                            if(item != 'devMode'){
                                if(item == 'enableUnloadWarning'){
                                    this[item](false);
                                }else{
                                    this[item](true);
                                }
                            }
                        }
                    }
            };

        //control
            var enableMenubar = true;
            this.enableMenubar = function(bool){
                if(bool==undefined){return enableMenubar;}
                if(devMode){return;}
                enableMenubar = bool;
                if(!enableMenubar){ control.gui.hideMenubar(); }else{ control.gui.showMenubar(); }
            };
            var enableNewScene = true;
            this.enableNewScene = function(bool){
                if(bool==undefined){return enableNewScene;}
                if(devMode){return;}
                enableNewScene = bool;
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

        //window
            var enableUnloadWarning = false;
            var enableUnloadWarning_message = "Unsaved work will be lost";
            this.enableUnloadWarning = function(bool,message){
                if(bool==undefined){return enableUnloadWarning;}
                if(devMode){return;}
                enableUnloadWarning = bool;
                enableUnloadWarning_message = message;

                if( enableUnloadWarning ){ window.onbeforeunload = function(){ return enableUnloadWarning_message; }; }
                else{ window.onbeforeunload = undefined; }
            };
            var enableWindowScrollbarRemoval = true;
            this.enableWindowScrollbarRemoval = function(bool){
                if(bool==undefined){return enableWindowScrollbarRemoval;}
                if(devMode){return;}
                enableWindowScrollbarRemoval = bool;

                control.viewport.stopMouseScroll(enableWindowScrollbarRemoval);
            };

        //unit modifications
            var enableUnitAdditionRemoval = true;
            this.enableUnitAdditionRemoval = function(bool){
                if(bool==undefined){return enableUnitAdditionRemoval;}
                if(devMode){return;}
                enableUnitAdditionRemoval = bool;
            };
            var enableUnitTransfer = true;
            this.enableUnitTransfer = function(bool){
                if(bool==undefined){return enableUnitTransfer;}
                if(devMode){return;}
                enableUnitTransfer = bool;
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
            var enableSnapping = true;
            this.enableSnapping = function(bool){
                if(bool==undefined){return enableSnapping;}
                if(devMode){return;}
                enableSnapping = bool;
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

        this.style = function(newStyle){
            if(menubar == undefined){return;}
            return menubar.style(newStyle);
        };
        this.refresh = function(){
            if(menubar != undefined){menubar.refresh();}
        };

        this.showMenubar = function(version=1){
            //control switch
                if(!_canvas_.control.interaction.enableMenubar()){
                    this.hideMenubar();
                    return;
                }

            if(menubar != undefined){return;}
            menubar = version == 1 ? control.gui.elements.menubar(0,0) : control.gui.elements.menubar2(0,0);
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
        this.width = function(){ return _canvas_.width/window.devicePixelRatio; };
        this.height = function(){ return _canvas_.height/window.devicePixelRatio; };

        this.scale = function(a){ return _canvas_.core.viewport.scale(a); };
        this.position = function(x,y){ return _canvas_.core.viewport.position(x,y); };
        this.refresh = function(){ 
            _canvas_.core.viewport.refresh();
            control.gui.refresh();
        };
        this.stopMouseScroll = function(bool){ return _canvas_.core.viewport.stopMouseScroll(bool); }
        this.activeRender = function(bool){ return _canvas_.core.render.active(bool); };
    };
    this.scene = new function(){
        {{include:scene.js}}
    };
    this.selection = new function(){
        {{include:selection.js}}
    };

    this.actionRegistry = new function(){
        {{include:actionRegistry.js}}
    };
    this.queryString = new function(){
        {{include:queryString.js}}
    };
};

{{include:grapple.js}}

window.onresize = _canvas_.control.viewport.refresh; 
_canvas_.control.interaction.devMode( (new URL(window.location.href)).searchParams.get("dev") != null );

_canvas_.control.misc = {
    currentStyleMode:'light',
    lightMode:function(){
        this.currentStyleMode = 'light';

        _canvas_.control.scene.backgroundColour({r:1,g:1,b:1,a:1});

        _canvas_.control.gui.style(
            {
                bar:{r:240/255,g:240/255,b:240/255,a:1}, 
                button:{
                    text_colour:{r:0,g:0,b:0,a:1},
                    text_font:'Helvetica',
                    text_size:14,
                    text_spacing:0.3,
                    text_interCharacterSpacing:0.04,
                    background__up__colour:{r:240/255,g:240/255,b:240/255,a:1}, 
                    background__press__colour:{r:240/255,g:240/255,b:240/255,a:1},
                    background__select_press__colour:{r:229/255,g:167/255,b:255/255,a:1},
                    background__press__lineColour:{r:0/255,g:0/255,b:0/255,a:0},
                    background__select__colour:{r:229/255,g:167/255,b:255/255,a:1}, background__select__lineColour:{r:0/255,g:0/255,b:0/255,a:0},
                    background__select_press__lineColour:{r:0,g:0,b:0,a:0},
                },
                list:{
                    text_size:14,
                    text_font:'Helvetica',
                    text_spacing:0.3,
                    text_interCharacterSpacing:0.04,
                    sublist_arrowColour:{r:0.5,g:0.5,b:0.5,a:1},
                    item__up__colour:{r:240/255,g:240/255,b:240/255,a:1}, 
                    item__hover__colour:{r:229/255,g:167/255,b:255/255,a:1}, 
                    item__hover_glow__colour:{r:239/255,g:209/255,b:255/255,a:1}, 
                    item__glow__colour:{r:220/255,g:220/255,b:220/255,a:1},
                    item__hover_press__colour:{r:240/255,g:240/255,b:240/255,a:1},
                    item__hover_glow_press__colour:{r:250/255,g:250/255,b:250/255,a:1},
                },
            }
        );
    },
    darkMode:function(){
        this.currentStyleMode = 'dark';

        _canvas_.control.scene.backgroundColour({r:0,g:0,b:0,a:1});

        var mux = 0.2;
        _canvas_.control.gui.style(
            {
                bar:{r:240/255*mux,g:240/255*mux,b:240/255*mux,a:1}, 
                button:{
                    text_colour:{r:1,g:1,b:1,a:1},
                    text_font:'Helvetica',
                    text_size:14,
                    text_spacing:0.3,
                    text_interCharacterSpacing:0.04,
                    background__up__colour:{r:240/255*mux,g:240/255*mux,b:240/255*mux,a:1}, 
                    background__press__colour:{r:240/255*mux,g:240/255*mux,b:240/255*mux,a:1}, 
                    background__select_press__colour:{r:100/255*mux,g:100/255*mux,b:100/255*mux,a:1},
                    background__press__lineColour:{r:0,g:0,b:0,a:0},
                    background__select__colour:{r:100/255*mux,g:100/255*mux,b:100/255*mux,a:1},
                    background__select__lineColour:{r:0,g:0,b:0,a:0},
                    background__select_press__lineColour:{r:0,g:0,b:0,a:0},
                },
                list:{
                    text_size:14,
                    text_colour:{r:1,g:1,b:1,a:1},
                    text_font:'Helvetica',
                    text_spacing:0.3,
                    text_interCharacterSpacing:0.04,
                    sublist_arrowColour:{r:1,g:1,b:1,a:1},
                    item__up__colour:{r:240/255*mux,g:240/255*mux,b:240/255*mux,a:1}, 
                    item__hover__colour:{r:100/255*mux,g:100/255*mux,b:100/255*mux,a:1},
                    item__hover_glow__colour:{r:150/255*mux,g:150/255*mux,b:150/255*mux,a:1}, 
                    item__glow__colour:{r:220/255*mux,g:220/255*mux,b:220/255*mux,a:1},
                    item__hover_press__colour:{r:240/255*mux*2,g:240/255*mux*2,b:240/255*mux*2,a:1},
                    item__hover_glow_press__colour:{r:250/255*mux*2,g:250/255*mux*2,b:250/255*mux*2,a:1},
                },
            }
        );
    },
};