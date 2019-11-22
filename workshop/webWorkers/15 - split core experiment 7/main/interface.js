(function() {
    const __canvasPrefix = 'interface';
    var __canvasElements = document.getElementsByTagName('canvas');
    for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
        if( __canvasElements[__canvasElements_count].hasAttribute(__canvasPrefix) ){
            var _canvas_ = __canvasElements[__canvasElements_count];
            {{include:../main/0 - library/main.js}}
            {{include:../main/1 - core/main.js}}
            {{include:../main/2 - system/main.js}}
            {{include:../main/3 - interface/main.js}}
        }
    }
})();