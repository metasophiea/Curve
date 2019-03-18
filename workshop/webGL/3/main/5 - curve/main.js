{{include:units/main.js}}
{{include:menubarItems.js}}

if( !_canvas_.control.interaction.devMode() ){ window.onbeforeunload = function(){ return "Unsaved work will be lost"; }; }
_canvas_.control.gui.showMenubar();
_canvas_.control.viewport.stopMouseScroll(true);
// _canvas_.control.scene.backgroundColour('rgb(0,0,0)');
_canvas_.control.viewport.activeRender(true);