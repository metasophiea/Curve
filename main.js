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
            
            // {{include:testSituations/1 - elements test/main.js}}
            // {{include:testSituations/2 - synth test/main.js}}
            // {{include:testSituations/3 - tests/main.js}}
            // {{include:testSituations/4 - synth test 2/main.js}}
            // {{include:testSituations/5 - HID interaction test/main.js}}
            // {{include:testSituations/6 - midi files/main.js}}
            // {{include:testSituations/7 - programmable note generators/main.js}}
            // {{include:testSituations/8 - advanced synthesisers/main.js}}
            // {{include:testSituations/9 - audio effect units/main.js}}
            {{include:testSituations/10 - recorded audio/main.js}}
        }
    }
// })();