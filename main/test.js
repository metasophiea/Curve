// (function() {
    const __canvasPrefix = 'workspace';
    const __canvasElements = document.getElementsByTagName('canvas');
    for(let __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
        if( __canvasElements[__canvasElements_count].hasAttribute(__canvasPrefix) ){
            const _canvas_ = __canvasElements[__canvasElements_count];
            {{include:../test/main.js}}
        }
    }
// })();