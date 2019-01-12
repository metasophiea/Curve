{{include:units/main.js}}
{{include:menubarItems.js}}

if( !workspace.control.switch.devMode ){ window.onbeforeunload = function(){ return "Unsaved work will be lost"; }; }
workspace.control.gui.showMenubar();
workspace.control.viewport.stopMouseScroll(true);
workspace.control.viewport.activeRender(true);