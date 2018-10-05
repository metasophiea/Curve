// (function(){
    var __svgElements = document.getElementsByTagName('svg');
    for(var __svgElements_count = 0; __svgElements_count < __svgElements.length; __svgElements_count++){
        if( __svgElements[__svgElements_count].hasAttribute('workspace') ){
            {{include:system/main.js}}
            {{include:part/main.js}}
            {{include:object/main.js}}
            {{include:control/main.js}}
            
            {{include:../workshop/main.js}}
        }
    }
// })();