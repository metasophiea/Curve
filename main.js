// (function(){
    var __svgElements = document.getElementsByTagName('svg');
    for(var __svgElements_count = 0; __svgElements_count < __svgElements.length; __svgElements_count++){
        if( __svgElements[__svgElements_count].hasAttribute('workspace') ){
            var __globals = {};
            __globals.svgElement = __svgElements[__svgElements_count];

            {{include:system/setup}}
            {{include:parts/parts.js}}

            // //printing of all the global functions
            // console.log( 'globals', __globals ); 
            // for(var a = 0; a < Object.keys(__globals).length; a++){
            //     console.log('\t', Object.keys(__globals)[a]);
            //     for(var b = 0; b < Object.keys(__globals[Object.keys(__globals)[a]]).length; b++){
            //         console.log('\t\t', Object.keys(__globals[Object.keys(__globals)[a]])[b] );
            //     }
            // }
            // console.log(' ');     

            // //printing of all the parts
            // console.log( 'parts', parts );            
            // for(var a = 0; a < Object.keys(parts).length; a++){
            //     console.log('\t', Object.keys(parts)[a]);
            //     for(var b = 0; b < Object.keys(parts[Object.keys(parts)[a]]).length; b++){
            //         console.log('\t\t', Object.keys(parts[Object.keys(parts)[a]])[b] );
            //     }
            // }
            // console.log(' ');

            // {{include:testSituations/1 - elements test/main.js}}
            // {{include:testSituations/2 - synth test/main.js}}
            // {{include:testSituations/3 - a midi mess/main.js}}
            // {{include:testSituations/4 - synth test 2/main.js}}
            // {{include:testSituations/5 - HID interaction test/ma~in.js}}
            {{include:testSituations/6 - midi files/main.js}}
            // {{include:testSituations/7 - programmable note generator/main.js}}
        }
    }

// })();