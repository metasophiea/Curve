(function() {
    const __canvasPrefix = 'system';
    const __canvasElements = document.getElementsByTagName('canvas');
    for(let __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
        if( __canvasElements[__canvasElements_count].hasAttribute(__canvasPrefix) ){
            const _canvas_ = __canvasElements[__canvasElements_count];
            {{include:../main/0 - library/main.js}}
            {{include:../main/1 - core/main.js}}
            {{include:../main/2 - system/main.js}}
        }
    }
})();