//print __globals
    console.log('__globals');
    function diver(object,objectName,spacer=''){
        var keys = Object.keys(object);
        for(var a = 0; a < keys.length; a++){
            console.log(spacer+'\t'+keys[a]);
            if( 
                object[keys[a]] && 
                !(object[keys[a]] instanceof HTMLElement) &&
                !Array.isArray(object[keys[a]]) &&
                typeof object[keys[a]] != 'function' &&
                typeof object[keys[a]][Object.keys(object[keys[a]])[0]] != 'number' &&
                typeof object[keys[a]][Object.keys(object[keys[a]])[0]] != 'string' &&
                typeof object[keys[a]] == 'object'
            ){
                diver(object[keys[a]],keys[a],spacer+'\t');
            }
        }
    }
    diver(__globals,'__globals');
    console.log('');


{{include:__globalsTest.js}}


// //printing of all the parts
//     console.log( 'parts' );            
//     for(var a = 0; a < Object.keys(parts).length; a++){
//         console.log('\t', Object.keys(parts)[a]);
//         for(var b = 0; b < Object.keys(parts[Object.keys(parts)[a]]).length; b++){
//             console.log('\t\t', Object.keys(parts[Object.keys(parts)[a]])[b] );
//         }
//     }
//     console.log(' ');