var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var canvas = __canvasElements[__canvasElements_count];
        {{include:system/main.js}}
    }
}