//basic
    var basicGroup = workspace.interface.part.alpha.builder( 'group', 'basic', { x:10, y:10, angle:0 } );
    workspace.system.pane.mm.append( basicGroup );
    basicGroup.append( workspace.interface.part.alpha.builder( 'rectangle', 'testRectangle', { x:5, y:5, width:30, height:30, style:{ fill:'rgba(255,0,0,1)' } } ) );
    basicGroup.append( workspace.interface.part.alpha.builder( 'circle', 'testCircle', { x:20, y:55, r:15 } ) );
    basicGroup.append( workspace.interface.part.alpha.builder( 'image', 'testImage', { x:40, y:40, width:30, height:30, url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg' } ) );
    basicGroup.append( workspace.interface.part.alpha.builder( 'polygon', 'testPolygon', { points:[{x:55,y:5}, {x:70,y:35}, {x:40,y:35}], style:{ fill:'rgba(0,255,0,1)' } } ) );
    basicGroup.append( workspace.interface.part.alpha.builder( 'text', 'testText', { x:7.5, y:95, text:'Hello', style:{font:'20pt Arial', fill:'rgba(150,150,255,1)' } } ) );
    basicGroup.append( workspace.interface.part.alpha.builder( 'path', 'testPath', { points:[{x:0,y:0},{x:0,y:90},{x:2.5,y:90},{x:2.5,y:72.5},{x:75,y:72.5}] }) );

//display
    var displayGroup = workspace.interface.part.alpha.builder( 'group', 'display', { x:10, y:150, angle:0 } );
    workspace.system.pane.mm.append( displayGroup );
    displayGroup.append( workspace.interface.part.alpha.builder( 'glowbox_rect', 'test_glowbox_rect', {x:0,y:0} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35,y:0} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'sevenSegmentDisplay_static', 'test_sevenSegmentDisplay_static', {x:35,y:70} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60,y:0} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'sixteenSegmentDisplay_static', 'test_sixteenSegmentDisplay_static', {x:60,y:70} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:85,y:0} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'readout_sixteenSegmentDisplay_static', 'test_readout_sixteenSegmentDisplay_static', {x:85,y:70} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'level', 'test_level1', {x:190, y:0} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'meter_level', 'test_meterLevel1', {x:215, y:0} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'audio_meter_level', 'test_audioMeterLevel1', {x:240, y:0} ) );
    displayGroup.append( workspace.interface.part.alpha.builder( 'rastorDisplay', 'test_rastorDisplay1', {x:265, y:0} ) );
    var grapher = workspace.interface.part.alpha.builder( 'grapher', 'test_grapher1', {x:330, y:0} );
        displayGroup.append( grapher );
        grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
        grapher.draw([0,0.25,1],undefined,1);
    var grapher = workspace.interface.part.alpha.builder( 'grapher_static', 'test_grapher_static1', {x:330, y:70} );
        displayGroup.append( grapher );
        grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
        grapher.draw([0,0.25,1],undefined,1);
    var grapher = workspace.interface.part.alpha.builder( 'grapher_periodicWave', 'test_grapher_periodicWave1', {x:455, y:0} );
        displayGroup.append( grapher );
        grapher.updateBackground();
        grapher.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
        grapher.draw();
    var grapher = workspace.interface.part.alpha.builder( 'grapher_periodicWave_static', 'test_grapher_periodicWave_static1', {x:455, y:70} );
        displayGroup.append( grapher );
        grapher.updateBackground();
        grapher.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
        grapher.draw();
    var grapher = workspace.interface.part.alpha.builder( 'grapher_audioScope', 'test_grapher_audioScope1', {x:580, y:0} );
        displayGroup.append( grapher );
    var grapher = workspace.interface.part.alpha.builder( 'grapher_audioScope_static', 'test_grapher_audioScope_static1', {x:580, y:70} );
        displayGroup.append( grapher );

//control
    var controlGroup = workspace.interface.part.alpha.builder( 'group', 'control', { x:10, y:300, angle:0 } );
    workspace.system.pane.mm.append( controlGroup );
    controlGroup.append( workspace.interface.part.alpha.builder( 'slide', 'test_slide1', {x:0,y:0} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'slidePanel', 'test_slidePanel1', {x:15,y:0} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'slide', 'test_slide2', {x:100,y:10,angle:-Math.PI/2} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'slidePanel', 'test_slidePanel2', {x:200,y:80,angle:-Math.PI/2} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'rangeslide', 'test_rangeslide1', {x:300,y:0} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'rangeslide', 'test_rangeslide2', {x:315,y:10,angle:-Math.PI/2} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'dial_continuous', 'test_dial_continuous1', {x:430,y:20} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'dial_discrete', 'test_dial_discrete1', {x:470,y:20} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'button_rect', 'test_button_rect1', {x:490,y:0} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'list', 'test_list1', {x:525,y:0,list:[
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
    controlGroup.append( workspace.interface.part.alpha.builder( 'checkbox_rect', 'test_checkbox_rect1', {x:580,y:0} ) );
    controlGroup.append( workspace.interface.part.alpha.builder( 'rastorgrid', 'test_rastorgrid1', {x:605,y:0} ) );
    var no = workspace.interface.part.alpha.builder( 'needleOverlay', 'test_needleOverlay1', {x:690,y:0} );
        controlGroup.append( no );
        no.select(0.25);
        no.area(0.5,0.75);
        no.mark(0.1);
        no.mark(0.1);
    var gww = workspace.interface.part.alpha.builder( 'grapher_waveWorkspace', 'test_grapher_waveWorkspace1', {x:815,y:0} );
        controlGroup.append( gww );
        gww.select(0.2);
        gww.area(0.5,0.7);
    var seq = workspace.interface.part.alpha.builder( 'sequencer', 'test_sequencer1', {x:940,y:0} );
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
    var dynamicGroup = workspace.interface.part.alpha.builder( 'group', 'dynamic', { x:10, y:450, angle:0 } );
    workspace.system.pane.mm.append( dynamicGroup );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'cable', 'test_cable1', {x1:0,y1:0,x2:100,y2:0} ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode', 'test_connectionNode1', { x:25, y:25 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode', 'test_connectionNode2', { x:0,  y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode', 'test_connectionNode3', { x:50, y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_signal', 'test_connectionNode_signal1', { x:125, y:25 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_signal', 'test_connectionNode_signal2', { x:100, y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_signal', 'test_connectionNode_signal3', { x:150, y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_voltage', 'test_connectionNode_voltage1', { x:225, y:25 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_voltage', 'test_connectionNode_voltage2', { x:200, y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_voltage', 'test_connectionNode_voltage3', { x:250, y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_data', 'test_connectionNode_data1', { x:325, y:25 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_data', 'test_connectionNode_data2', { x:300, y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_data', 'test_connectionNode_data3', { x:350, y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_audio', 'test_connectionNode_audio1', { x:425, y:25, isAudioOutput:true} ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_audio', 'test_connectionNode_audio2', { x:400, y:75 } ) );
    dynamicGroup.append( workspace.interface.part.alpha.builder( 'connectionNode_audio', 'test_connectionNode_audio3', { x:450, y:75 } ) );







workspace.core.render.active(true);
// //view positioning
//     workspace.core.viewport.scale(10);
//     workspace.core.viewport.position(-945, -295);