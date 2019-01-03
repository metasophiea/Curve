console.log('%cTesting - system.utility.misc', 'font-size:15px; font-weight:bold;');
    console.log('%c- serialize/unserialize (no compression)', 'font-weight: bold;');
        function doBoth(data,ser_data,un_data){
            var s_data = system.utility.misc.serialize(data,false);
            tester(s_data,ser_data);
            var u_data = system.utility.misc.unserialize(s_data,false);
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

    console.log('%c- blendColours', 'font-weight: bold;');
    tester( system.utility.misc.blendColours('rgba(0,0,0,0)', 'rgba(255,255,255,1)', 0), 'rgba(0,0,0,0)' );
    tester( system.utility.misc.blendColours('rgba(0,0,0,0)', 'rgba(255,255,255,1)', 1), 'rgba(255,255,255,1)' );
        tester( system.utility.misc.blendColours('rgba(0,0,0,0)', 'rgba(255,255,255,1)', 0.5), 'rgba(127.5,127.5,127.5,0.5)' );
        tester( system.utility.misc.blendColours('rgba(247, 180, 112, 0.5)', 'rgba(255, 173, 102,1)', 0.5), 'rgba(251,176.5,107,0.75)' );

    console.log('%c- multiBlendColours', 'font-weight: bold;');
        tester( system.utility.misc.multiBlendColours(['rgba(0,0,0,0)', 'rgba(255,255,255,1)'], 0.5), 'rgba(127.5,127.5,127.5,0.5)' );
        tester( system.utility.misc.multiBlendColours(['rgba(0,0,0,0)', 'rgba(255,255,255,1)'], 0), 'rgba(0,0,0,0)' );
        tester( system.utility.misc.multiBlendColours(['rgba(0,0,0,0)', 'rgba(255,255,255,1)'], 1), 'rgba(255,255,255,1)' );
        tester( system.utility.misc.multiBlendColours( ['rgba(150,100,150,0.75)','rgba(255,255,255,0.75)'], 0.5 ), 'rgba(202.5,177.5,202.5,0.75)' );
        tester( system.utility.misc.multiBlendColours( ['rgba(150,100,150,0.75)','rgba(0,0,0,1)','rgba(255,255,255,0.75)'], 0.25 ), 'rgba(75,50,75,0.875)' );
        tester( system.utility.misc.multiBlendColours( ['rgba(0,0,0,1)','rgba(150,100,150,0.75)','rgba(0,0,0,1)','rgba(255,255,255,0.75)'], 0.99 ), 'rgba(247.34999999999994,247.34999999999994,247.34999999999994,0.7575000000000001)' );
        //(this one can be rather touchy, as the math is a bit weird. For example the first number is supposed to be 247.345,
        //but can come out as 247.34999999999994 or 247.34500000000001 depending on how the system feels at the time)
         
         
         