function _compare(item1,item2){
    function getType(obj){ return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() }
    function comparer(item1,item2){
        if(getType(item1) != getType(item2)){ return false; }
        if(typeof item1 == 'boolean' || typeof item1 == 'number' || typeof item1 == 'string'){ return item1 === item2; }
        if(typeof item1 === 'undefined' || typeof item2 === 'undefined' || item1 === null || item2 === null){ return item1 === item2;  }
        if(getType(item1) == 'function'){
            item1 = item1.toString();
            item2 = item2.toString();

            var item1_functionHead = item1.substring(0,item1.indexOf('{'));
            item1_functionHead = item1_functionHead.substring(item1_functionHead.indexOf('(')+1, item1_functionHead.lastIndexOf(')'));
            var item1_functionBody = item1.substring(item1.indexOf('{')+1, item1.lastIndexOf('}'));

            var item2_functionHead = item2.substring(0,item2.indexOf('{'));
            item2_functionHead = item2_functionHead.substring(item2_functionHead.indexOf('(')+1, item2_functionHead.lastIndexOf(')'));
            var item2_functionBody = item2.substring(item2.indexOf('{')+1, item2.lastIndexOf('}'));

            return item1_functionHead.trim() == item2_functionHead.trim() && item1_functionBody.trim() == item2_functionBody.trim();
        }
        if(typeof item1 == 'object'){
            var keys = Object.keys(item1);
            var result = true;
            for(var a = 0; a < keys.length; a++){
                result = result && comparer(item1[keys[a]],item2[keys[a]]);
            }
            return result;
        }
        return false;
    }

    return comparer(item1,item2);
}

function pront(text){}

function testRunner(batch){

    for(var a = 0; a < batch.length; a++){
        var titleKey = Object.keys(batch[a])[0];
        // console.log(titleKey, batch[a][titleKey]);
        if( batch[a][titleKey]() ){
            console.log('*');
        }
    }

}






var tests = [
    {
        'good test':function(){
            return true;
        }
    },
    {
        'bad test':function(){
            return false;
        }
    }
];


// var tests = [
//     {
//         title:'adding a note',
//         test:function(){
//             var noteRegistry = new part.element.control.sequencer.noteRegistry(64, 10, 10);
//             noteRegistry.add({ line:0, position:0, length:5, strength:1 });

//             var res = true;
//             res = res && _compare(noteRegistry.getAllNotes(), [{line:0, position:0, length:5, strength:1}]);
//             res = res && _compare(noteRegistry.getAllEvents(), [{noteID: 0, line: 0, position: 0, strength: 1},{noteID: 0, line: 0, position: 5, strength: 0}]);
//             return res;
//         }
//     },
//     {
//         title:'good test',
//         test:function(){
//             return true;
//         }
//     },
//     {
//         title:'bad test',
//         test:function(){
//             return false;
//         }
//     }
// ];

console.log('%cTesting - part.element.control.sequencer.noteRegistry', 'font-size:15px; font-weight:bold;');
console.log('%c-- regular use', 'font-weight: bold;');
testRunner(tests);

