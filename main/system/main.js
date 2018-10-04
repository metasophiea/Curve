var system = new function(){};

system.svgElement = __svgElements[__svgElements_count];


//added sequentially as some sections rely on others
system.super = new function(){
    {{include:chunks/super.js}}
};
system.utility = new function(){
    {{include:chunks/utility.js}}
};
system.pane = new function(){
    {{include:chunks/pane.js}}
};
system.selection = new function(){
    {{include:chunks/selection.js}}
};
system.mouse = new function(){
    {{include:chunks/mouse.js}}
};
system.keyboard = new function(){
    {{include:chunks/keyboard.js}}
};
system.audio = new function(){
    {{include:chunks/audio.js}}
};