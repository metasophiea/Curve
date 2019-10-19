_canvas_.curve = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:2019,m:10,d:19} };
};

{{include:units/main.js}}
{{include:menubarItems.js}}
{{include:queryStringManager.js}}

_canvas_.control.interaction.enableUnloadWarning(true,"Unsaved work will be lost");
_canvas_.control.gui.showMenubar();
_canvas_.control.viewport.stopMouseScroll(true);
_canvas_.control.viewport.activeRender(true);
_canvas_.core.render.activeLimitToFrameRate(true);
if( (new URL(window.location.href)).searchParams.get("darkmode") != null ){ _canvas_.control.misc.darkMode(); }