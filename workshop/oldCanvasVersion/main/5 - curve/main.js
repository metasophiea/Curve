{{include:units/main.js}}
{{include:menubarItems.js}}

if( !workspace.control.interaction.devMode() ){ window.onbeforeunload = function(){ return "Unsaved work will be lost"; }; }
workspace.control.gui.showMenubar();
workspace.control.viewport.stopMouseScroll(true);
// workspace.control.scene.backgroundColour('rgb(0,0,0)');
workspace.control.viewport.activeRender(true);