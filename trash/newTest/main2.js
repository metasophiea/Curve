var tester = new function(){
    document.body.innerHTML = '';
    var style = document.createElement('style');
    style.innerHTML = ''+
        '.h1{font-size:20px; font-weight:bold; margin:0px;} '+
        '.normal{font-size:15px;margin:0px;} ' +
        '.error{font-size:15px;margin:0px;color: red;} ' +
        '.errorExplain{font-size:15px;margin:0px 5px;} '
    ;
    document.head.appendChild(style);

    function pront(data={text:'', join:false, element:'p', class:'normal', newLine:false}){
        if(data.text != undefined){
            if(data.join){
                var p = document.body.lastElementChild;
                p.innerHTML += data.text;
            }else{
                var p = document.createElement(data.element == undefined ? 'p' : data.element);
                p.innerHTML = data.text;
                p.className = data.class == undefined ? 'normal' : data.class;
                document.body.appendChild(p);
            }
        }
        
        if(data.newLine){
            var p = document.createElement('p');
            p.innerHTML ='&nbsp;';
            p.style = 'margin:0px;';
            document.body.appendChild(p);
        }
    };

    function compare(item1,item2){
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
    
        if( comparer(item1,item2) ){ return {result:true}; }
        else{ return {result: false, item1:item1, item2:item2}; }
    }

    this.runBatch = function(batch){
        for(var a = 0; a < batch.length; a++){
            var titleKey = Object.keys(batch[a]);
            var result = batch[a][titleKey](compare);

            pront({text:titleKey});
            if(result.result){ pront({text:' - _/', join:true}); }
            else{ 
                pront({text:' - X', join:true, class:'error'}); 
                pront( {text:JSON.stringify(result.item1), class:'errorExplain'} );
                pront( {text:JSON.stringify(result.item2), class:'errorExplain'} );
            }
        }



        pront({newLine:true});
    };

};


// tester.pront({text:'text',element:'h1'});
// tester.pront({text:'text'});
// tester.pront({text:' text',join:true});
// tester.pront({newLine:true});
// tester.pront({text:'text'});












var tests = [
    {
        'good test':function(compare){
            var number = 15;
            return compare(number,15);
        },
    },
    {
        'bad test':function(compare){
            var number = 125;
            return compare(number,15);
        }
    }
];

tester.runBatch(tests);