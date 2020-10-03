(function() {
    const __canvasPrefix = 'curve';
    const __canvasElements = document.getElementsByTagName('canvas');
    for(let __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
        if( __canvasElements[__canvasElements_count].hasAttribute(__canvasPrefix) ){
            const _canvas_ = __canvasElements[__canvasElements_count];
            {{include:../main/0 - library/main.js}}
            {{include:../main/1 - core/main.js}}
            {{include:../main/2 - system/main.js}}
            {{include:../main/3 - interface/main.js}}
            {{include:../main/4 - control/main.js}}
            {{include:../main/5 - curve/main.js}}
        }
    }
})();