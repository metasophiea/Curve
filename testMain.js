// (function(){
    var __svgElements = document.getElementsByTagName('svg');
    for(var __svgElements_count = 0; __svgElements_count < __svgElements.length; __svgElements_count++){
        if( __svgElements[__svgElements_count].hasAttribute('workspace') ){
            var __globals = {};
            __globals.svgElement = __svgElements[__svgElements_count];

            {{include:system/setup}}
            {{include:parts/parts.js}}
            {{include:objects/objects.js}}
            {{include:menu/main.js}}
            
            {{include:testSituations/main.js}}
        }
    }
// })();