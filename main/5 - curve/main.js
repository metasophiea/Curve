{{include:units/main.js}}
{{include:menubarItems.js}}

_canvas_.control.interaction.enableUnloadWarning(true,"Unsaved work will be lost");
_canvas_.control.gui.showMenubar();
_canvas_.control.viewport.stopMouseScroll(true);
_canvas_.control.viewport.activeRender(true);
_canvas_.core.render.activeLimitToFrameRate(true);