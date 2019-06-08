function tester(item1,item2,numericalAccuracy=14){
    function getType(obj){
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }
    function comparer(item1,item2,numericalAccuracy=14){
        if(getType(item1) != getType(item2)){ return false; }
        if(typeof item1 == 'boolean' || typeof item1 == 'string'){ return item1 === item2; }
        if(typeof item1 == 'number'){
            if( Math.abs(item1) < 1/(Math.pow(10,numericalAccuracy)) ){item1 = 0;}
            if( Math.abs(item2) < 1/(Math.pow(10,numericalAccuracy)) ){item2 = 0;}
            if( Math.abs(item1 - item2) < 1/(Math.pow(10,numericalAccuracy)) ){return true;}
            return {boolean:item1 === item2};
        }
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
            var keys1 = Object.keys(item1);
            var keys2 = Object.keys(item2);
            if(keys1.length != keys2.length){return false;}

            for(var a = 0; a < keys1.length; a++){ 
                if( keys1.indexOf(keys2[a]) == -1 || !comparer(item1[keys1[a]],item2[keys1[a]])){return false;}
            }
            return true;
        }
        return false;
    }

    var result = comparer(item1,item2,numericalAccuracy);
    if(typeof result == 'boolean'){
        if( result ){
            console.log('%cpass', 'color: green;'); return true;
        }else{
            console.log(item1 ,'!=', item2);
            console.log('%cfail', 'color: red;'); return false;
        }
    }else{
        if( result.boolean ){
            console.log('%cpass', 'color: green;'); return true;
        }else{
            if(typeof item1 == 'number'){
                console.log(parseFloat((item1).toFixed(numericalAccuracy)) ,'!=', parseFloat((item2).toFixed(numericalAccuracy)));
                console.log('%cfail (difference of '+parseFloat((item1-item2).toFixed(numericalAccuracy))+')', 'color: red;'); return false;
            }else{
                console.log(item1 ,'!=', item2);
                console.log('%cfail', 'color: red;'); return false;
            }
        }
    }
}


