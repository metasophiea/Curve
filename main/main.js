var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var workspace = __canvasElements[__canvasElements_count];
        {{include:0 - library/main.js}}
        {{include:1 - core/main.js}}
        {{include:2 - system/main.js}}
        {{include:3 - interface/main.js}}
        {{include:4 - control/main.js}}
    }
}