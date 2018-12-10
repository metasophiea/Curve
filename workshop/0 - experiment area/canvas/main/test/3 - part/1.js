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
    var grapher = canvas.part.builder( 'grapher', 'test_grapher1', {x:140, y:35} );
        displayGroup.append( grapher );
        grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
        grapher.draw([0,0.25,1],undefined,1);
    var grapher = canvas.part.builder( 'grapher_periodicWave', 'test_grapher_periodicWave1', {x:265, y:35} );
        displayGroup.append( grapher );
        grapher.updateBackground();
        grapher.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
        grapher.draw();
    var grapher = canvas.part.builder( 'grapher_audioScope', 'test_grapher_audioScope1', {x:390, y:35} );
        displayGroup.append( grapher );


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
    controlGroup.append( canvas.part.builder( 'list', 'test_list1', {x:185,y:115,list:[
        'space',
        { text_left:'item1',  text_centre:'', text_right:'', function:function(){console.log('item1 function');} },
        { text_left:'item2',  text_centre:'', text_right:'', function:function(){console.log('item2 function');} },
        { text_left:'item3',  text_centre:'', text_right:'', function:function(){console.log('item3 function');} },
        { text_left:'item4',  text_centre:'', text_right:'', function:function(){console.log('item4 function');} },
        { text_left:'item5',  text_centre:'', text_right:'', function:function(){console.log('item5 function');} },
        'break',
        { text_left:'item6',  text_centre:'', text_right:'', function:function(){console.log('item6 function');} },
        { text_left:'item7',  text_centre:'', text_right:'', function:function(){console.log('item7 function');} },
        { text_left:'item8',  text_centre:'', text_right:'', function:function(){console.log('item8 function');} },
        { text_left:'item9',  text_centre:'', text_right:'', function:function(){console.log('item9 function');} },
        { text_left:'item10', text_centre:'', text_right:'', function:function(){console.log('item10 function');} },
        'break',
        { text_left:'item11', text_centre:'', text_right:'', function:function(){console.log('item11 function');} },
        { text_left:'item12', text_centre:'', text_right:'', function:function(){console.log('item12 function');} },
        { text_left:'item13', text_centre:'', text_right:'', function:function(){console.log('item13 function');} },
        { text_left:'item14', text_centre:'', text_right:'', function:function(){console.log('item14 function');} },
        { text_left:'item15', text_centre:'', text_right:'', function:function(){console.log('item15 function');} },
        'space',
    ]} ) );
    controlGroup.append( canvas.part.builder( 'checkbox_rect', 'test_checkbox_rect1', {x:150,y:35} ) );
    controlGroup.append( canvas.part.builder( 'rastorgrid', 'test_rastorgrid1', {x:100,y:115} ) );
    var no = canvas.part.builder( 'needleOverlay', 'test_needleOverlay1', {x:0,y:200} );
        controlGroup.append( no );
        no.select(0.25);
        no.area(0.5,0.75)
    var gww = canvas.part.builder( 'grapher_waveWorkspace', 'test_grapher_waveWorkspace1', {x:0,y:265} );
        controlGroup.append( gww );
        gww.select(0.2);
        gww.area(0.5,0.7)
    var seq = canvas.part.builder( 'sequencer', 'test_sequencer1', {x:125,y:220} );
        controlGroup.append( seq );
        seq.addSignal( 0,0,  10,0.0 );
        seq.addSignal( 1,1,  10,0.1 );
        seq.addSignal( 2,2,  10,0.2 );
        seq.addSignal( 3,3,  10,0.3 );
        seq.addSignal( 4,4,  10,0.4 );
        seq.addSignal( 5,5,  10,0.5 );
        seq.addSignal( 6,6,  10,0.6 );
        seq.addSignal( 7,7,  10,0.7 );
        seq.addSignal( 8,8,  10,0.8 );
        seq.addSignal( 9,9,  10,0.9 );
        seq.addSignal( 10,10,10,1.0 );
        seq.event = function(data){console.log(data);};


//dynamic
    var dynamicGroup = canvas.part.builder( 'group', 'dynamic', { x:240, y:120, angle:0 } );
    canvas.system.pane.mm.append( dynamicGroup );
    dynamicGroup.append( canvas.part.builder( 'cable', 'test_cable1', {x1:0,y1:0,x2:100,y2:0} ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode', 'test_connectionNode1', { x:25, y:25 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode', 'test_connectionNode2', { x:0,  y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode', 'test_connectionNode3', { x:50, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal1', { x:125, y:25 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal2', { x:100, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_signal', 'test_connectionNode_signal3', { x:150, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage1', { x:225, y:25 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage2', { x:200, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage3', { x:250, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data1', { x:325, y:25 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data2', { x:300, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_data', 'test_connectionNode_data3', { x:350, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio1', { x:425, y:25, isAudioOutput:true} ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio2', { x:400, y:75 } ) );
    dynamicGroup.append( canvas.part.builder( 'connectionNode_audio', 'test_connectionNode_audio3', { x:450, y:75 } ) );








//view positioning
    canvas.core.viewport.scale(3.5);
    canvas.core.viewport.position(-130,-335);