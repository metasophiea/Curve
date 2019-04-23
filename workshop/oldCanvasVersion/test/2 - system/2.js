var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle_background';
    rect.x = 0; rect.y = 0;
    rect.width = 60; rect.height = 60;
    rect.style.fill = 'rgba(255,0,0,0.3)';
    // rect.dotFrame = true;
    workspace.system.pane.b.append(rect);

var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle_middlegroud_back';
    rect.x = 10; rect.y = 60;
    rect.width = 60; rect.height = 60;
    rect.style.fill = 'rgba(0,255,0,0.3)';
    // rect.dotFrame = true;
    workspace.system.pane.mb.append(rect);
var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle_middlegroud_middle';
    rect.x = 80; rect.y = 60;
    rect.width = 60; rect.height = 60;
    rect.style.fill = 'rgba(0,255,0,0.6)';
    // rect.dotFrame = true;
    workspace.system.pane.mm.append(rect);
var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle_middlegroud_front';
    rect.x = 150; rect.y = 60;
    rect.width = 60; rect.height = 60;
    rect.style.fill = 'rgba(0,255,0,0.9)';
    // rect.dotFrame = true;
    workspace.system.pane.mf.append(rect);

var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle_foreground';
    rect.x = 160; rect.y = 120;
    rect.width = 60; rect.height = 60;
    rect.style.fill = 'rgba(0,0,255,0.3)';
    // rect.dotFrame = true;
    workspace.system.pane.f.append(rect);

workspace.core.render.active(true);