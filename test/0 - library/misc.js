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

//loadFileFromURL
    //(the results of this are dependent on when the response is received, so, they could arrive out of order with the rest)
    _canvas_.library.misc.loadFileFromURL('http://0.0.0.0:8000/docs/CNAME', function(response){console.log('%c- loadFileFromURL', 'font-weight: bold;');tester(response,'curve.metasophiea.com\n')}, 'text');

console.log('');