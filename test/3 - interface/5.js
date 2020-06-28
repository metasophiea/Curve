var partsCreated = {};

_canvas_.layers.registerFunctionForLayer("interface", function(){

    _canvas_.core.render.active(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(10);
    _canvas_.core.viewport.stopMouseScroll(true);

    // const scale = 2;
    // const position = {x:0, y:487.5};
    // _canvas_.core.viewport.scale(scale);
    // _canvas_.core.viewport.position(-(position.x)*scale,-(position.y)*scale);

    partsCreated.dynamic = {};
    partsCreated.dynamic.dynamicGroup = _canvas_.interface.part.builder('basic', 'group', 'dynamicGroup', { x:10, y:10 });
    _canvas_.system.pane.mm.append(partsCreated.dynamic.dynamicGroup);

    //connection node
        //cable
            //cable-1
                partsCreated.dynamic.cable_1 = _canvas_.interface.part.builder('dynamic', 'cable', 'test_cable-1', {x1:0,y1:0,x2:100,y2:20});
                partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.cable_1);
            //cable-2
                partsCreated.dynamic.cable_2 = _canvas_.interface.part.builder('dynamic', 'cable', 'test_cable-2', {version:2,x1:0,y1:20,x2:100,y2:40,a2:Math.PI});
                partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.cable_2);

        //generic
            partsCreated.dynamic.connectionNode_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_1', { x:25, y:55 } );
            partsCreated.dynamic.connectionNode_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_2', { x:0,  y:105 } );
            partsCreated.dynamic.connectionNode_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_3', { x:50, y:90 } );
            partsCreated.dynamic.connectionNode_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_4', { x:30, y:130 } );
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_0);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_1);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_2);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_3);

            partsCreated.dynamic.connectionNode_0.connectTo(partsCreated.dynamic.connectionNode_1); 
            // partsCreated.dynamic.connectionNode_0.allowConnections(false); 
            // partsCreated.dynamic.connectionNode_0.allowDisconnections(false);

        //signal
            partsCreated.dynamic.connectionNode_signal_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_1', { x:125, y:55 } );
            partsCreated.dynamic.connectionNode_signal_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_2', { x:100, y:105 } );
            partsCreated.dynamic.connectionNode_signal_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_3', { x:150, y:90 } );
            partsCreated.dynamic.connectionNode_signal_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_4', { x:130, y:130 } );
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_signal_0);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_signal_1);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_signal_2);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_signal_3);

            partsCreated.dynamic.connectionNode_signal_0.connectTo(partsCreated.dynamic.connectionNode_signal_1); 
            // partsCreated.dynamic.connectionNode_signal_0.allowConnections(false); 
            // partsCreated.dynamic.connectionNode_signal_0.allowDisconnections(false);

        //voltage
            partsCreated.dynamic.connectionNode_voltage_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_1', { x:225, y:55 } );
            partsCreated.dynamic.connectionNode_voltage_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_2', { x:200, y:105 } );
            partsCreated.dynamic.connectionNode_voltage_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_3', { x:250, y:90 } );
            partsCreated.dynamic.connectionNode_voltage_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_4', { x:230, y:130 } );
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_voltage_0);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_voltage_1);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_voltage_2);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_voltage_3);

            partsCreated.dynamic.connectionNode_voltage_0.connectTo(partsCreated.dynamic.connectionNode_voltage_1); 
            // partsCreated.dynamic.connectionNode_voltage_0.allowConnections(false); 
            // partsCreated.dynamic.connectionNode_voltage_0.allowDisconnections(false);

        //data
            partsCreated.dynamic.connectionNode_data_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_1', { x:325, y:55 } );
            partsCreated.dynamic.connectionNode_data_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_2', { x:300, y:105 } );
            partsCreated.dynamic.connectionNode_data_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_3', { x:350, y:90 } );
            partsCreated.dynamic.connectionNode_data_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_4', { x:320, y:130 } );
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_data_0);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_data_1);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_data_2);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_data_3);

            partsCreated.dynamic.connectionNode_data_0.connectTo(partsCreated.dynamic.connectionNode_data_1); 
            // partsCreated.dynamic.connectionNode_data_0.allowConnections(false); 
            // partsCreated.dynamic.connectionNode_data_0.allowDisconnections(false);

        //audio
            partsCreated.dynamic.connectionNode_audio_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_1', { x:425, y:55, isAudioOutput:true} );
            partsCreated.dynamic.connectionNode_audio_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_2', { x:400, y:105 } );
            partsCreated.dynamic.connectionNode_audio_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_3', { x:450, y:90 } );
            partsCreated.dynamic.connectionNode_audio_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_4', { x:420, y:130, isAudioOutput:true } );
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_audio_0);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_audio_1);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_audio_2);
            partsCreated.dynamic.dynamicGroup.append(partsCreated.dynamic.connectionNode_audio_3);

            partsCreated.dynamic.connectionNode_audio_0.connectTo(partsCreated.dynamic.connectionNode_audio_1); 
            // partsCreated.dynamic.connectionNode_audio_0.allowConnections(false); 
            // partsCreated.dynamic.connectionNode_audio_0.allowDisconnections(false);
} );