//basic
    var basicGroup = canvas.part.builder( 'group', 'basic', { x:10, y:10, angle:0 } );
    canvas.system.pane.mm.append( basicGroup );
    basicGroup.append( canvas.part.builder( 'rectangle', 'testRectangle', { x:5, y:5, width:30, height:30, style:{ fill:'rgba(255,0,0,1)' } } ) );
    basicGroup.append( canvas.part.builder( 'circle', 'testCircle', { x:20, y:55, r:15 } ) );
    basicGroup.append( canvas.part.builder( 'image', 'testImage', { x:40, y:40, width:30, height:30, url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg' } ) );
    basicGroup.append( canvas.part.builder( 'polygon', 'testPolygon', { points:[{x:55,y:5}, {x:70,y:35}, {x:40,y:35}], style:{ fill:'rgba(0,255,0,1)' } } ) );
    basicGroup.append( canvas.part.builder( 'text', 'testText', { x:7.5, y:95, text:'Hello', style:{font:'20pt Arial', fill:'rgba(150,150,255,1)' } } ) );
    basicGroup.append( canvas.part.builder( 'path', 'testPath', { points:[{x:0,y:0},{x:0,y:90},{x:2.5,y:90},{x:2.5,y:72.5},{x:75,y:72.5}] }) );

//display
    var displayGroup = canvas.part.builder( 'group', 'display', { x:100, y:10, angle:0 } );
    canvas.system.pane.mm.append( displayGroup );
    displayGroup.append( canvas.part.builder( 'glowbox_rect', 'test_glowbox_rect', {x:0,y:0} ) );
    displayGroup.append( canvas.part.builder( 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35,y:0} ) );
    displayGroup.append( canvas.part.builder( 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60,y:0} ) );
    displayGroup.append( canvas.part.builder( 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:85,y:0} ) );
    displayGroup.append( canvas.part.builder( 'level', 'test_level1', {x:0, y:35} ) );
    displayGroup.append( canvas.part.builder( 'meter_level', 'test_meterLevel1', {x:25, y:35} ) );
    displayGroup.append( canvas.part.builder( 'audio_meter_level', 'test_audioMeterLevel1', {x:50, y:35} ) );
    displayGroup.append( canvas.part.builder( 'rastorDisplay', 'test_rastorDisplay1', {x:75, y:35} ) );

//control
    var controlGroup = canvas.part.builder( 'group', 'control', { x:10, y:120, angle:0 } );
    canvas.system.pane.mm.append( controlGroup );
    controlGroup.append( canvas.part.builder( 'slide', 'test_slide1', {x:0,y:0} ) );
    controlGroup.append( canvas.part.builder( 'slidePanel', 'test_slidePanel1', {x:15,y:0} ) );
    controlGroup.append( canvas.part.builder( 'slide', 'test_slide2', {x:0,y:110,angle:-Math.PI/2} ) );
    controlGroup.append( canvas.part.builder( 'slidePanel', 'test_slidePanel2', {x:0,y:195,angle:-Math.PI/2} ) );
    controlGroup.append( canvas.part.builder( 'rangeslide', 'test_rangeslide1', {x:100,y:0} ) );
    controlGroup.append( canvas.part.builder( 'rangeslide', 'test_rangeslide2', {x:100,y:110,angle:-Math.PI/2} ) );
    controlGroup.append( canvas.part.builder( 'dial_continuous', 'test_dial_continuous1', {x:130,y:15} ) );
    controlGroup.append( canvas.part.builder( 'dial_discrete', 'test_dial_discrete1', {x:170,y:15} ) );
    controlGroup.append( canvas.part.builder( 'button_rect', 'test_button_rect1', {x:115,y:35} ) );
    controlGroup.append( canvas.part.builder( 'checkbox_rect', 'test_checkbox_rect1', {x:150,y:35} ) );
    controlGroup.append( canvas.part.builder( 'rastorgrid', 'test_rastorgrid1', {x:100,y:115} ) );

//dynamic
    var dynamicGroup = canvas.part.builder( 'group', 'dynamic', { x:240, y:120, angle:0 } );
    canvas.system.pane.mm.append( dynamicGroup );
    dynamicGroup.append( canvas.part.builder( 'cable', 'test_cable1', {x1:0,y1:0,x2:100,y2:0} ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal1', { x:25, y:25 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal2', { x:0,  y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal3', { x:50, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data1', { x:125, y:25 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data2', { x:100, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data3', { x:150, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio1', { x:225, y:25, isAudioOutput:true} ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio2', { x:200, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio3', { x:250, y:75 } ) );