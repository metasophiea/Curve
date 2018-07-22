function tester(item1,item2){
    function comparer(item1,item2){
        if(typeof item1 != typeof item2){ return false; }
        if(typeof item1 == 'boolean' || typeof item1 == 'number' || typeof item1 == 'string'){ return item1 === item2; }
        if(item1 === null || item2 === null){ return item1 === item2;  }
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

    if( comparer(item1,item2) ){
        console.log('%cpass', 'color: green;'); return true;
    }else{
        console.log(item1 ,'!=', item2);
        console.log('%cfail', 'color: red;'); return false;
    }
}

{{include:utility.js}}
{{include:part_sequencer_testcode.js}}