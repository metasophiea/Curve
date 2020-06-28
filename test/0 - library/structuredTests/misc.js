console.log('%cTesting - library.misc', 'font-size:15px; font-weight:bold;');

//serialize / unserialize
    console.log('%c- serialize/unserialize (no compression)', 'font-weight: bold;');
        function doBoth(data,ser_data,un_data){
            var s_data = _canvas_.library.misc.serialize(data,false);
            tester(s_data,ser_data);
            var u_data = _canvas_.library.misc.unserialize(s_data,false);
            tester(u_data,un_data);
        }

        var org_data;
        var ser_data;
        doBoth(org_data,ser_data,org_data);
        var org_data = 1;
        var ser_data = '1';
        doBoth(org_data,ser_data,org_data);
        var org_data = 5;
        var ser_data = '5';
        doBoth(org_data,ser_data,org_data);
        var org_data = 546544494849;
        var ser_data = '546544494849';
        doBoth(org_data,ser_data,org_data);

        var org_data = '';
        var ser_data = '""';
        doBoth(org_data,ser_data,org_data);
        var org_data = 'hello\n';
        var ser_data = JSON.stringify('hello\n');
        doBoth(org_data,ser_data,org_data);
        var org_data = '546544494849';
        var ser_data = '"546544494849"';
        doBoth(org_data,ser_data,org_data);

        var org_data = [1,2,3];
        var ser_data = '[1,2,3]';
        doBoth(org_data,ser_data,org_data);
        var org_data = [1,2,3];
        var ser_data = '[1,2,3]';
        doBoth(org_data,ser_data,org_data);
        var org_data = ['hello','there','my','friend'];
        var ser_data = JSON.stringify(['hello','there','my','friend']);
        doBoth(org_data,ser_data,org_data);
        var org_data = ['hello',1,'my',76];
        var ser_data = JSON.stringify(['hello',1,'my',76]);
        doBoth(org_data,ser_data,org_data);

        var org_data = {item:0,thing:'hello',null:null};
        var ser_data = JSON.stringify({item:0,thing:'hello',null:null});
        doBoth(org_data,ser_data,org_data);
        var org_data = {item:0,thing:function(){console.log('hello');},null:null};
        var ser_data = JSON.stringify({"item":0,"thing":{"__uniqueType":"function","__value":"function(){console.log('hello');}","__name":"thing"},"null":null});
        doBoth(org_data,ser_data,org_data);

        var org_data = new ArrayBuffer(8);
        var ser_data = JSON.stringify({"__uniqueType":"arraybuffer","__value":"AA=="});
        doBoth(org_data,ser_data,org_data);
        var org_data = [new ArrayBuffer(8),new ArrayBuffer(8),new ArrayBuffer(8)]
        var ser_data = JSON.stringify([{"__uniqueType":"arraybuffer","__value":"AA=="},{"__uniqueType":"arraybuffer","__value":"AA=="},{"__uniqueType":"arraybuffer","__value":"AA=="}]);
        doBoth(org_data,ser_data,org_data);

// //openFile
//     _canvas_.library.misc.openFile(function(response){
//         console.log('%c- openFile', 'font-weight: bold;');
//         tester(response,'curve.metasophiea.com\n');
//     });

//removeThisFromThatArray
    console.log('%c- removeThisFromThatArray', 'font-weight: bold;');
    {
        const testArray_1 = [0,1,2,3,4,5,6,7,8,9];
        _canvas_.library.misc.removeThisFromThatArray(3,testArray_1);
        tester(testArray_1,[0,1,2,4,5,6,7,8,9]);
        
        const testArray_2 = ['0','1','2','3','4','5','6','7','8','9'];
        _canvas_.library.misc.removeThisFromThatArray('3',testArray_2);
        tester(testArray_2,['0','1','2','4','5','6','7','8','9']);
        
        const testArray_3 = [[1,2,3],[4,5,6],[7,8,9],[8,5,2],[1,5,9]];
        _canvas_.library.misc.removeThisFromThatArray([1,5,9],testArray_3);
        tester(testArray_3,[[1,2,3],[4,5,6],[7,8,9],[8,5,2]]);
    }
    console.log('');

//removeTheseElementsFromThatArray
    console.log('%c- removeTheseElementsFromThatArray', 'font-weight: bold;');
    tester( _canvas_.library.misc.removeTheseElementsFromThatArray([],[]),[] );
    tester( _canvas_.library.misc.removeTheseElementsFromThatArray([1,2,3,4],[1,2,3,4]),[] );
    tester( _canvas_.library.misc.removeTheseElementsFromThatArray([1,2],[1,2,3,4]),[3,4] );
    tester( _canvas_.library.misc.removeTheseElementsFromThatArray([],[1,2,3,4]),[1,2,3,4] );
    tester( _canvas_.library.misc.removeTheseElementsFromThatArray([1,2,3,4],[]),[] );
    console.log('');

//getDifferenceOfArrays
    console.log('%c- getDifferenceOfArrays', 'font-weight: bold;');
    tester( _canvas_.library.misc.getDifferenceOfArrays([1,2,3,4],[3,4,5,6]),{a:[1,2],b:[5,6]} );
    tester( _canvas_.library.misc.getDifferenceOfArrays([],[3,4,5,6]),{a:[],b:[3,4,5,6]} );
    tester( _canvas_.library.misc.getDifferenceOfArrays([1,2,3,4],[]),{a:[1,2,3,4],b:[]} );
    tester( _canvas_.library.misc.getDifferenceOfArrays([],[]),{a:[],b:[]} );
    tester( _canvas_.library.misc.getDifferenceOfArrays([5,9,4,1,8,0,4,0,65],[14,85,960,1,8,40,0,0,0,0]),{a:[5,9,4,4,65],b:[14,85,960,40,0,0]} );
    console.log('');

//loadFileFromURL
    //(the results of this are dependent on when the response is received, so, they could arrive out of order with the rest)
    _canvas_.library.misc.loadFileFromURL(
        'http://localhost:8000/CNAME', 
        function(response){
            console.log('%c- loadFileFromURL', 'font-weight: bold;');
            tester(response.response,'curve.metasophiea.com\n');
        }, 
        function(){},
        'text'
    );