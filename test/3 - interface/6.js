_canvas_.core.render.active(true);

_canvas_.layers.registerFunctionForLayer("interface", function(){
    
    console.log('%c- connectionNode : Generic', 'font-weight: bold;');
    var cn_reg_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode1', { x:10, y:10 } );
    var cn_reg_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode2', { x:110,  y:10 } );
    _canvas_.system.pane.mm.append( cn_reg_0 );
    _canvas_.system.pane.mm.append( cn_reg_1 );
    console.log('%c-- connecting', 'font-weight: bold;');
    cn_reg_0.onconnect = function(instigator){ console.log('%c--- cn_reg_0 connected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_reg_1.onconnect = function(instigator){ console.log('%c--- cn_reg_1 connected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_reg_0.connectTo(cn_reg_1);
    console.log('%c-- disconnecting', 'font-weight: bold;');
    cn_reg_0.ondisconnect = function(instigator){ console.log('%c--- cn_reg_0 disconnected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_reg_1.ondisconnect = function(instigator){ console.log('%c--- cn_reg_1 disconnected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_reg_0.disconnect();
    console.log('');
    
    
    console.log('%c- connectionNode : Signal', 'font-weight: bold;');
    var cn_sig_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal1', { x:10, y:110 } );
    var cn_sig_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal2', { x:110, y:110 } );
    _canvas_.system.pane.mm.append( cn_sig_0 );
    _canvas_.system.pane.mm.append( cn_sig_1 );
    console.log('%c-- connecting', 'font-weight: bold;');
    cn_sig_0.onconnect = function(instigator){ console.log('%c--- cn_sig_0 connected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_sig_1.onconnect = function(instigator){ console.log('%c--- cn_sig_1 connected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_sig_0.connectTo(cn_sig_1);
    console.log('%c-- setting', 'font-weight: bold;');
    cn_sig_0.onchange = function(value){ console.log('%c--- cn_sig_0 sent changed value', 'font-weight: bold;'); tester(true,value); };
    cn_sig_1.onchange = function(value){ console.log('%c--- cn_sig_1 recieved changed value', 'font-weight: bold;'); tester(true,value);};
    cn_sig_0.set(true);
    console.log('%c-- disconnecting', 'font-weight: bold;');
    cn_sig_0.onchange = function(value){ console.log('%c--- cn_sig_0 sent changed value', 'font-weight: bold;'); tester(true,value); };
    cn_sig_1.onchange = function(value){ console.log('%c--- cn_sig_1 recieved changed value', 'font-weight: bold;'); tester(false,value);};
    cn_sig_0.ondisconnect = function(instigator){ console.log('%c--- cn_sig_0 disconnected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_sig_1.ondisconnect = function(instigator){ console.log('%c--- cn_sig_1 disconnected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_sig_0.disconnect();
    console.log('');
    
    
    console.log('%c- connectionNode : Voltage', 'font-weight: bold;');
    var cn_vol_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage1', { x:10, y:210 } );
    var cn_vol_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage2', { x:110, y:210 } );
    _canvas_.system.pane.mm.append( cn_vol_0 );
    _canvas_.system.pane.mm.append( cn_vol_1 );
    console.log('%c-- connecting', 'font-weight: bold;');
    cn_vol_0.onconnect = function(instigator){ console.log('%c--- cn_vol_0 connected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_vol_1.onconnect = function(instigator){ console.log('%c--- cn_vol_1 connected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_vol_0.connectTo(cn_vol_1);
    console.log('%c-- setting', 'font-weight: bold;');
    cn_vol_0.onchange = function(value){ console.log('%c--- cn_vol_0 sent changed value', 'font-weight: bold;'); tester(1,value); };
    cn_vol_1.onchange = function(value){ console.log('%c--- cn_vol_1 recieved changed value', 'font-weight: bold;'); tester(1,value);};
    cn_vol_0.set(1);
    console.log('%c-- disconnecting', 'font-weight: bold;');
    cn_vol_0.onchange = function(value){ console.log('%c--- cn_vol_0 sent changed value', 'font-weight: bold;'); tester(1,value); };
    cn_vol_1.onchange = function(value){ console.log('%c--- cn_vol_1 recieved changed value', 'font-weight: bold;'); tester(0,value);};
    cn_vol_0.ondisconnect = function(instigator){ console.log('%c--- cn_vol_0 disconnected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_vol_1.ondisconnect = function(instigator){ console.log('%c--- cn_vol_1 disconnected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_vol_0.disconnect();
    console.log('');
    
    
    console.log('%c- connectionNode : Data', 'font-weight: bold;');
    var cn_dat_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data1', { x:10, y:310 } );
    var cn_dat_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data2', { x:110, y:310 } );
    _canvas_.system.pane.mm.append( cn_dat_0 );
    _canvas_.system.pane.mm.append( cn_dat_1 );
    console.log('%c-- connecting', 'font-weight: bold;');
    cn_dat_0.onconnect = function(instigator){ console.log('%c--- cn_dat_0 connected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_dat_1.onconnect = function(instigator){ console.log('%c--- cn_dat_1 connected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_dat_0.connectTo(cn_dat_1);
    console.log('%c-- sending', 'font-weight: bold;');
    cn_dat_1.onreceive = function(address,data){ console.log('%c--- cn_dat_1 recieved data', 'font-weight: bold;'); tester(address,'address'); tester(data,'data'); };
    cn_dat_0.send('address','data');
    console.log('%c-- request', 'font-weight: bold;');
    cn_dat_1.ongive = function(address){ console.log('%c--- cn_dat_1 recieved request for data', 'font-weight: bold;'); tester(address,'address'); };
    cn_dat_0.request('address');
    console.log('%c-- disconnecting', 'font-weight: bold;');
    cn_dat_0.ondisconnect = function(instigator){ console.log('%c--- cn_dat_0 disconnected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_dat_1.ondisconnect = function(instigator){ console.log('%c--- cn_dat_1 disconnected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_dat_0.disconnect();
    console.log('');
    
    
    console.log('%c- connectionNode : Audio', 'font-weight: bold;');
    var cn_aud_2_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio1', { x:10, y:510, isAudioOutput:true} );
    var cn_aud_2_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio2', { x:110, y:510 } );
    cn_aud_2_0.audioNode = _canvas_.library.audio.context.createAnalyser();
    cn_aud_2_1.audioNode = _canvas_.library.audio.context.createAnalyser();
    _canvas_.system.pane.mm.append( cn_aud_2_0 );
    _canvas_.system.pane.mm.append( cn_aud_2_1 );
    console.log('%c-- connecting', 'font-weight: bold;');
    cn_aud_2_0.onconnect = function(instigator){ console.log('%c--- cn_aud_0 connected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_aud_2_1.onconnect = function(instigator){ console.log('%c--- cn_aud_1 connected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_aud_2_0.connectTo(cn_aud_2_1);
    console.log('%c-- disconnecting', 'font-weight: bold;');
    cn_aud_2_0.ondisconnect = function(instigator){ console.log('%c--- cn_aud_0 disconnected as instigator', 'font-weight: bold;'); tester(true,instigator); };
    cn_aud_2_1.ondisconnect = function(instigator){ console.log('%c--- cn_aud_1 disconnected not as instigator', 'font-weight: bold;'); tester(false,instigator); };
    cn_aud_2_0.disconnect();
    console.log('');
});