{{include:mouse.js}}
{{include:keyboard.js}}

_canvas_.control = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2019,m:10,d:12} };
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

_canvas_.control.misc = {
    currentStyleMode:'light',
    lightMode:function(){
        this.currentStyleMode = 'light';

        _canvas_.control.scene.backgroundColour({r:1,g:1,b:1,a:1});

        _canvas_.control.gui.style(
            {
                backgroundColour:{r:240/255,g:240/255,b:240/255,a:1},
        
                text__font:'Helvetica',
                text__fontSize:14,
                text__spacing:0.3,
                text__interCharacterSpacing:0.04,
        
                text_colour__off:                                       {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__up:                                        {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__press:                                     {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__select:                                    {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__select_press:                              {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__glow:                                      {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__glow_press:                                {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__glow_select:                               {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__glow_select_press:                         {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover:                                     {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_press:                               {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_select:                              {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_select_press:                        {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_glow:                                {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_glow_press:                          {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_glow_select:                         {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_glow_select_press:                   {r:0.2,g:0.2,b:0.2,a:1},
                    
                item_backing__off__colour:                              {r:180/255,g:180/255,b:180/255,a:1},
                item_backing__off__lineColour:                          {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__off__lineThickness:                       0,
                item_backing__up__colour:                               {r:240/255,g:240/255,b:240/255,a:1},
                item_backing__up__lineColour:                           {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__up__lineThickness:                        0,
                item_backing__press__colour:                            {r:240/255,g:240/255,b:240/255,a:1},
                item_backing__press__lineColour:                        {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__press__lineThickness:                     0,
                item_backing__select__colour:                           {r:220/255,g:220/255,b:220/255,a:1},
                item_backing__select__lineColour:                       {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__select__lineThickness:                    0,
                item_backing__select_press__colour:                     {r:229/255,g:167/255,b:255/255,a:1},
                item_backing__select_press__lineColour:                 {r:0,g:0,b:0,a:0},
                item_backing__select_press__lineThickness:              0,
                item_backing__glow__colour:                             {r:220/255,g:220/255,b:220/255,a:1},
                item_backing__glow__lineColour:                         {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__glow__lineThickness:                      0,
                item_backing__glow_press__colour:                       {r:250/255,g:250/255,b:250/255,a:1},
                item_backing__glow_press__lineColour:                   {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__glow_press__lineThickness:                0,
                item_backing__glow_select__colour:                      {r:220/255,g:220/255,b:220/255,a:1},
                item_backing__glow_select__lineColour:                  {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__glow_select__lineThickness:               0,
                item_backing__glow_select_press__colour:                {r:250/255,g:250/255,b:250/255,a:1},
                item_backing__glow_select_press__lineColour:            {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__glow_select_press__lineThickness:         0,
                item_backing__hover__colour:                            {r:229/255,g:167/255,b:255/255,a:1},
                item_backing__hover__lineColour:                        {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__hover__lineThickness:                     0,
                item_backing__hover_press__colour:                      {r:240/255,g:240/255,b:240/255,a:1},
                item_backing__hover_press__lineColour:                  {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__hover_press__lineThickness:               0,
                item_backing__hover_select__colour:                     {r:239/255,g:209/255,b:255/255,a:1},
                item_backing__hover_select__lineColour:                 {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__hover_select__lineThickness:              0,
                item_backing__hover_select_press__colour:               {r:240/255,g:240/255,b:240/255,a:1},
                item_backing__hover_select_press__lineColour:           {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__hover_select_press__lineThickness:        0,
                item_backing__hover_glow__colour:                       {r:239/255,g:209/255,b:255/255,a:1},
                item_backing__hover_glow__lineColour:                   {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__hover_glow__lineThickness:                0,
                item_backing__hover_glow_press__colour:                 {r:250/255,g:250/255,b:250/255,a:1},
                item_backing__hover_glow_press__lineColour:             {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__hover_glow_press__lineThickness:          0,
                item_backing__hover_glow_select__colour:                {r:240/255,g:240/255,b:240/255,a:1},
                item_backing__hover_glow_select__lineColour:            {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__hover_glow_select__lineThickness:         0,
                item_backing__hover_glow_select_press__colour:          {r:250/255,g:250/255,b:250/255,a:1},
                item_backing__hover_glow_select_press__lineColour:      {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__hover_glow_select_press__lineThickness:   0,
            }
        );
    },
    darkMode:function(){
        this.currentStyleMode = 'dark';

        _canvas_.control.scene.backgroundColour({r:0,g:0,b:0,a:1});

        var mux = 0.2;
        _canvas_.control.gui.style(
            {
                backgroundColour:{r:240/255*mux,g:240/255*mux,b:240/255*mux,a:1},
        
                text__font:'Helvetica',
                text__fontSize:14,
                text__spacing:0.3,
                text__interCharacterSpacing:0.04,
        
                text_colour__off:                                       {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__up:                                        {r:1.0,g:1.0,b:1.0,a:1},
                text_colour__press:                                     {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__select:                                    {r:0.0,g:0.0,b:0.0,a:1},
                text_colour__select_press:                              {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__glow:                                      {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__glow_press:                                {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__glow_select:                               {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__glow_select_press:                         {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover:                                     {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_press:                               {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_select:                              {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_select_press:                        {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_glow:                                {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_glow_press:                          {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_glow_select:                         {r:0.2,g:0.2,b:0.2,a:1},
                text_colour__hover_glow_select_press:                   {r:0.2,g:0.2,b:0.2,a:1},
                    
                item_backing__off__colour:                              {r:180/255,g:180/255,b:180/255,a:1},
                item_backing__off__lineColour:                          {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__off__lineThickness:                       0,
                item_backing__up__colour:                               {r:240/255*mux,g:240/255*mux,b:240/255*mux,a:1},
                item_backing__up__lineColour:                           {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__up__lineThickness:                        0,
                item_backing__press__colour:                            {r:240/255,g:240/255,b:240/255,a:1},
                item_backing__press__lineColour:                        {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__press__lineThickness:                     0,
                item_backing__select__colour:                           {r:1,g:1,b:1,a:1},
                item_backing__select__lineColour:                       {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__select__lineThickness:                    0,
                item_backing__select_press__colour:                     {r:0.85,g:0.85,b:0.85,a:1},
                item_backing__select_press__lineColour:                 {r:0,g:0,b:0,a:0},
                item_backing__select_press__lineThickness:              0,
                item_backing__glow__colour:                             {r:220/255,g:220/255,b:220/255,a:1},
                item_backing__glow__lineColour:                         {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__glow__lineThickness:                      0,
                item_backing__glow_press__colour:                       {r:250/255,g:250/255,b:250/255,a:1},
                item_backing__glow_press__lineColour:                   {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__glow_press__lineThickness:                0,
                item_backing__glow_select__colour:                      {r:220/255,g:220/255,b:220/255,a:1},
                item_backing__glow_select__lineColour:                  {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__glow_select__lineThickness:               0,
                item_backing__glow_select_press__colour:                {r:250/255,g:250/255,b:250/255,a:1},
                item_backing__glow_select_press__lineColour:            {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__glow_select_press__lineThickness:         0,
                item_backing__hover__colour:                            {r:1,g:1,b:1,a:1},
                item_backing__hover__lineColour:                        {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__hover__lineThickness:                     0,
                item_backing__hover_press__colour:                      {r:0.85,g:0.85,b:0.85,a:1},
                item_backing__hover_press__lineColour:                  {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__hover_press__lineThickness:               0,
                item_backing__hover_select__colour:                     {r:0.9,g:0.9,b:0.9,a:1},
                item_backing__hover_select__lineColour:                 {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__hover_select__lineThickness:              0,
                item_backing__hover_select_press__colour:               {r:0.85,g:0.85,b:0.85,a:1},
                item_backing__hover_select_press__lineColour:           {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__hover_select_press__lineThickness:        0,
                item_backing__hover_glow__colour:                       {r:239/255,g:209/255,b:255/255,a:1},
                item_backing__hover_glow__lineColour:                   {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__hover_glow__lineThickness:                0,
                item_backing__hover_glow_press__colour:                 {r:250/255,g:250/255,b:250/255,a:1},
                item_backing__hover_glow_press__lineColour:             {r:0/255,g:0/255,b:0/255,a:0},
                item_backing__hover_glow_press__lineThickness:          0,
                item_backing__hover_glow_select__colour:                {r:240/255,g:240/255,b:240/255,a:1},
                item_backing__hover_glow_select__lineColour:            {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__hover_glow_select__lineThickness:         0,
                item_backing__hover_glow_select_press__colour:          {r:250/255,g:250/255,b:250/255,a:1},
                item_backing__hover_glow_select_press__lineColour:      {r:120/255,g:120/255,b:120/255,a:1},
                item_backing__hover_glow_select_press__lineThickness:   0,
            }
        );
    },
};

window.onresize = _canvas_.control.viewport.refresh; 
_canvas_.control.interaction.devMode( (new URL(window.location.href)).searchParams.get("dev") != null );
_canvas_.control.misc.lightMode();