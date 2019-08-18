//test of all parts

_canvas_.core.render.active(true);
// _canvas_.core.render.frame();

// view positioning
_canvas_.core.viewport.scale(12);
var x = 190;
var y = 240;
_canvas_.core.viewport.position(-x*_canvas_.core.viewport.scale(),-y*_canvas_.core.viewport.scale());
// _canvas_.core.viewport.angle(-0.1);

// _canvas_.core.stats.active(true);
// var averages = [];
// var rollingAverage = 0;
// var rollingAverageIndex = 1;
// setInterval(function(){
//     var tmp = _canvas_.core.stats.getReport();
//     averages.push(tmp.framesPerSecond);
//     console.log( 'rollingAverage:',_canvas_.library.math.averageArray(averages),tmp );
// },1000);


// console.log('\n\n\n');
















// //basic
//     var basicGroup = _canvas_.interface.part.builder( 'basic', 'group', 'basic', { x:10, y:10 } );
//     _canvas_.system.pane.mm.append( basicGroup );
//     basicGroup.append( _canvas_.interface.part.builder( 'basic', 'rectangle', 'testRectangle', { x:5, y:5, width:30, height:30, colour:{r:1,g:0,b:0,a:1} } ) );
//     basicGroup.append( _canvas_.interface.part.builder( 'basic', 'circle', 'testCircle', { x:20, y:55, radius:15 } ) );
//     basicGroup.append( _canvas_.interface.part.builder( 'basic', 'image', 'testImage', { x:40, y:40, width:30, height:30, url:'/images/testImages/Dore-munchausen-illustration.jpg' } ) );
//     var clippingGroup = _canvas_.interface.part.builder( 'basic', 'group', 'clippingGroup', { x:75, y:5 } );
//         clippingGroup.stencil( _canvas_.interface.part.builder( 'basic', 'polygon', 'testPolygon', { points:[0,0, 50,0, 50,50], colour:{r:0,g:1,b:0,a:1} } ) );
//         clippingGroup.append( _canvas_.interface.part.builder( 'basic', 'image', 'clippedImage', { width:50, height:50, url:'/images/testImages/mikeandbrian.jpg' } ) );
//         clippingGroup.clipActive(true);
//         basicGroup.append(clippingGroup);
//     basicGroup.append( _canvas_.interface.part.builder( 'basic', 'polygon', 'testPolygon', { points:[55,5, 70,35, 40,35], colour:{r:0,g:1,b:0,a:1} } ) );
//     basicGroup.append( _canvas_.interface.part.builder( 'basic', 'polygonWithOutline', 'testPolygonWithOutline', { points:[75,15, 75,55, 115,55], thickness:1, colour:{r:1,g:0,b:0.5,a:1}, lineColour:{r:0,g:0,b:0,a:1} } ) );
//     basicGroup.append( _canvas_.interface.part.builder( 'basic', 'text', 'testText', { x:5, y:75, text:'Hello', height:15, width:70, colour:{r:150/255,g:150/255,b:1,a:1} } ) );
//     basicGroup.append( _canvas_.interface.part.builder( 'basic', 'path', 'testPath', { points:[0,0, 0,90, 2.5,90, 2.5,72.5, 75,72.5], thickness:1.25, jointType:'round', capType:'round' }) );
//     basicGroup.append( _canvas_.interface.part.builder( 'basic', 'circleWithOutline', 'testCircleWithOutline', { x:90, y:70, radius:10 } ) );
















//display
    var displayGroup = _canvas_.interface.part.builder( 'basic', 'group', 'display', { x:10, y:150, angle:0 } );
    _canvas_.system.pane.mm.append( displayGroup );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'glowbox_rectangle', 'test_glowbox_rect', {x:0,y:0} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'glowbox_circle', 'test_glowbox_circle', {x:10,y:45} ) );
    var gb_i = _canvas_.interface.part.builder( 'display', 'glowbox_image', 'test_glowbox_image', { x:0,y:60, glowURL:'/images/testImages/Dore-munchausen-illustration.jpg', dimURL:'/images/testImages/mikeandbrian.jpg' } ); displayGroup.append( gb_i );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35,y:0} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'sevenSegmentDisplay_static', 'test_sevenSegmentDisplay_static', {x:35,y:70} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60,y:0} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'sixteenSegmentDisplay_static', 'test_sixteenSegmentDisplay_static', {x:60,y:70} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:85,y:0} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'readout_sixteenSegmentDisplay_static', 'test_readout_sixteenSegmentDisplay_static', {x:85,y:70} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'level', 'test_level', {x:190, y:0} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'meter_level', 'test_meterLevel', {x:215, y:0} ) );
    displayGroup.append( _canvas_.interface.part.builder( 'display', 'audio_meter_level', 'test_audioMeterLevel', {x:240, y:0} ) );
    var g = _canvas_.interface.part.builder( 'display', 'gauge', 'test_gauge', {x:190, y:65} ); displayGroup.append(g);
    var g_i = _canvas_.interface.part.builder( 'display', 'gauge_image', 'test_gauge_image', { x:245, y:65, backingURL:'/images/testImages/Dore-munchausen-illustration.jpg' } ); displayGroup.append(g_i);
    var mg = _canvas_.interface.part.builder( 'display', 'meter_gauge', 'test_meterGauge', { 
        x:190, y:100,
        markings:{
            upper:'...........'.split(''),
            middle:'.........'.split(''),
            lower:'.......'.split(''),
        },
        style:{markingStyle_font:'defaultThin'}
    } ); displayGroup.append(mg);
    var mg_i = _canvas_.interface.part.builder( 'display', 'meter_gauge_image', 'test_meterGauge_image', { x:245, y:100, backingURL:'/images/testImages/mikeandbrian.jpg' } ); displayGroup.append(mg_i);
    var rastorDisplay = _canvas_.interface.part.builder( 'display', 'rastorDisplay', 'test_rastorDisplay1', {x:265, y:0} ); displayGroup.append( rastorDisplay ); rastorDisplay.test();
    var grapher = _canvas_.interface.part.builder( 'display', 'grapher', 'test_grapher1', {x:330, y:0} );
        displayGroup.append( grapher );
        grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
        grapher.draw([0,0.25,1],undefined,1);
    var grapher = _canvas_.interface.part.builder( 'display', 'grapher_static', 'test_grapher_static1', {x:330, y:70} );
        displayGroup.append( grapher );
        grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
        grapher.draw([0,0.25,1],undefined,1);
    var grapher = _canvas_.interface.part.builder( 'display', 'grapher_periodicWave', 'test_grapher_periodicWave1', {x:455, y:0} );
        displayGroup.append( grapher );
        grapher.updateBackground();
        grapher.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
        grapher.draw();
    var grapher = _canvas_.interface.part.builder( 'display', 'grapher_periodicWave_static', 'test_grapher_periodicWave_static1', {x:455, y:70} );
        displayGroup.append( grapher );
        grapher.updateBackground();
        grapher.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
        grapher.draw();
    var grapher = _canvas_.interface.part.builder( 'display', 'grapher_audioScope', 'test_grapher_audioScope1', {x:580, y:0} );
        displayGroup.append( grapher );
    var grapher = _canvas_.interface.part.builder( 'display', 'grapher_audioScope_static', 'test_grapher_audioScope_static1', {x:580, y:70} );
        displayGroup.append( grapher );
















// //control
//     var controlGroup = _canvas_.interface.part.builder( 'basic', 'group', 'control', { x:10, y:300, angle:0 } );
//     _canvas_.system.pane.mm.append( controlGroup );
//     //slide
//         var s_1 = _canvas_.interface.part.builder( 'control', 'slide_continuous', 'test_slide1', {x:0,y:0} ); controlGroup.append( s_1 );
//         var si_1 = _canvas_.interface.part.builder( 'control', 'slide_continuous_image', 'test_slide_image1', {
//             x:12.5,y:0,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
//         } ); controlGroup.append( si_1 );
//         var sp_1 = _canvas_.interface.part.builder( 'control', 'slidePanel', 'test_slidePanel1', {x:25,y:0} ); controlGroup.append( sp_1 );
//         var spi_1 = _canvas_.interface.part.builder( 'control', 'slidePanel_image', 'test_slidePanel_image1', {
//             x:107.5,y:0,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
//             overlayURL:'/images/units/alpha/glowbox_rect_overlay_1.png',
//         } ); controlGroup.append( spi_1 );
//         var s_2 = _canvas_.interface.part.builder( 'control', 'slide_continuous', 'test_slide2', {x:190,y:10,angle:-Math.PI/2} ); controlGroup.append( s_2 );
//         var si_2 = _canvas_.interface.part.builder( 'control', 'slide_continuous_image', 'test_slide_image2', {
//             x:190,y:22.5,angle:-Math.PI/2,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
//         } ); controlGroup.append( si_2 );
//         var sd_1 = _canvas_.interface.part.builder( 'control', 'slide_discrete', 'test_slideDiscrete1', {x:190,y:25, height:70} ); controlGroup.append( sd_1 );
//         var sdi_1 = _canvas_.interface.part.builder( 'control', 'slide_discrete_image', 'test_slideDiscrete_image1', {
//             x:190+12.5,y:25, height:70,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
//         } ); controlGroup.append( sdi_1 );
//         var sp_2 = _canvas_.interface.part.builder( 'control', 'slidePanel', 'test_slidePanel2', {x:287.5,y:80,angle:-Math.PI/2} ); controlGroup.append( sp_2 );
//         var spi_2 = _canvas_.interface.part.builder( 'control', 'slidePanel_image', 'test_slidePanel_image2', {
//             x:287.5,y:162.5,angle:-Math.PI/2,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
//         } ); controlGroup.append( spi_2 );
//         var r_1 = _canvas_.interface.part.builder( 'control', 'rangeslide', 'test_rangeslide1', {x:385,y:0} ); controlGroup.append(r_1);
//         var ri_1 = _canvas_.interface.part.builder( 'control', 'rangeslide_image', 'test_rangeslide_image1', {
//             x:397.5,y:0,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
//             spanURL:'/images/units/alpha/glowbox_rect_overlay_1.png',
//         } ); controlGroup.append(ri_1);
//         var r_2 = _canvas_.interface.part.builder( 'control', 'rangeslide', 'test_rangeslide2', {x:410,y:10,angle:-Math.PI/2} ); controlGroup.append(r_2);
//         var ri_2 = _canvas_.interface.part.builder( 'control', 'rangeslide_image', 'test_rangeslide_image2', {
//             x:410,y:22.5,angle:-Math.PI/2,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
//             spanURL:'/images/units/alpha/glowbox_rect_overlay_1.png',
//         } ); controlGroup.append(ri_2);
//     //dial
//         var dc_1 = _canvas_.interface.part.builder( 'control', 'dial_continuous', 'test_dial_continuous1', {x:525,y:20} ); controlGroup.append(dc_1);
//         var dd_1 = _canvas_.interface.part.builder( 'control', 'dial_discrete', 'test_dial_discrete1', {x:560,y:20} ); controlGroup.append(dd_1);
//         var dic_1 = _canvas_.interface.part.builder( 'control', 'dial_continuous_image', 'test_dial_continuous_image1', {
//             x:525,y:60,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             slotURL:'/images/testImages/dark-background_1048-3848.jpg?size=338&ext=jpg',
//             needleURL:'/images/testImages/41-satin-stainless-steel.jpg',
//         } ); controlGroup.append(dic_1);
//         var did_1 = _canvas_.interface.part.builder( 'control', 'dial_discrete_image', 'test_dial_discrete_image1', {
//             x:560,y:60,
//             handleURL:'/images/testImages/expanded-metal-1.jpg',
//             slotURL:'/images/testImages/dark-background_1048-3848.jpg?size=338&ext=jpg',
//             needleURL:'/images/testImages/41-satin-stainless-steel.jpg',
//         } ); controlGroup.append(did_1);
//     //button
//         var br_1 = _canvas_.interface.part.builder( 'control', 'button_rectangle', 'test_button_rectangle1', {x:580,y:0,text_centre:'rectangle'} ); controlGroup.append(br_1);
//         var bc_1 = _canvas_.interface.part.builder( 'control', 'button_circle', 'test_button_circle1', {x:595,y:37.5,text_centre:'circle'} ); controlGroup.append(bc_1);
//         var bp_1 = _canvas_.interface.part.builder( 'control', 'button_polygon', 'test_button_polygon1', {
//             x:580,y:55, points:[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}],
//             text_centre:'polygon'
//         } ); controlGroup.append(bp_1);
//         var bi_1 = _canvas_.interface.part.builder( 'control', 'button_image', 'test_button_image1', {
//             x:580,y:87.5,
//             backingURL__off:'/images/testImages/buttonStates/off.png',
//             backingURL__up:'/images/testImages/buttonStates/up.png',
//             backingURL__press:'/images/testImages/buttonStates/press.png',
//             backingURL__select:'/images/testImages/buttonStates/select.png',
//             backingURL__select_press:'/images/testImages/buttonStates/select_press.png',
//             backingURL__glow:'/images/testImages/buttonStates/glow.png',
//             backingURL__glow_press:'/images/testImages/buttonStates/glow_press.png',
//             backingURL__glow_select:'/images/testImages/buttonStates/glow_select.png',
//             backingURL__glow_select_press:'/images/testImages/buttonStates/glow_select_press.png',
//             backingURL__hover:'/images/testImages/buttonStates/hover.png',
//             backingURL__hover_press:'/images/testImages/buttonStates/hover_press.png',
//             backingURL__hover_select:'/images/testImages/buttonStates/hover_select.png',
//             backingURL__hover_select_press:'/images/testImages/buttonStates/hover_select_press.png',
//             backingURL__hover_glow:'/images/testImages/buttonStates/hover_glow.png',
//             backingURL__hover_glow_press:'/images/testImages/buttonStates/hover_glow_press.png',
//             backingURL__hover_glow_select:'/images/testImages/buttonStates/hover_glow_select.png',
//             backingURL__hover_glow_select_press:'/images/testImages/buttonStates/hover_glow_select_press.png',
//         } ); controlGroup.append(bi_1);
//     //list
//         var l_1 = _canvas_.interface.part.builder( 'control', 'list', 'test_list', {x:612.5,y:0,limitHeightTo:100,limitWidthTo:50,list:[
//             { type:'space' },
//             { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('item1 function');} },
//             { type:'list', text:'sublist', list:[
//                 { type:'space' },
//                 { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('sublist item1 function');} },
//                 { type:'break' },
//                 { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('sublist item2 function');} },
//                 { type:'textbreak', text:'break 1'},
//                 { type:'list', text:'sublist', list:[
//                     { type:'space' },
//                     { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item1 function');} },
//                     { type:'break' },
//                     { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item2 function');} },
//                     { type:'textbreak', text:'break 1'},
//                     { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item3 function');} },
//                     { type:'space' },
//                 ] },
//                 { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('sublist item3 function');} },
//                 { type:'space' },
//             ] },
//             { type:'break' },
//             { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('item2 function');} },
//             { type:'textbreak', text:'break 1'},
//             { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('item3 function');} },
//             { type:'checkbox', text:'checkable', onclickFunction:function(val){console.log('checkbox:',val);} },
//             { type:'item', text_left:'item4', text_centre:'', text_right:'', function:function(){console.log('item4 function');} },
//             { type:'item', text_left:'item5', text_centre:'', text_right:'', function:function(){console.log('item5 function');} },
//             { type:'textbreak', text:'break 1'},
//             { type:'item', text_left:'item6', text_centre:'', text_right:'', function:function(){console.log('item6 function');} },
//             { type:'item', text_left:'item7', text_centre:'', text_right:'', function:function(){console.log('item7 function');} },
//             { type:'item', text_left:'item8', text_centre:'', text_right:'', function:function(){console.log('item8 function');} },
//             { type:'item', text_left:'item9', text_centre:'', text_right:'', function:function(){console.log('item9 function');} },
//             { type:'item', text_left:'item10', text_centre:'', text_right:'', function:function(){console.log('item10 function');} },
//             { type:'break' },
//             { type:'item', text_left:'item11', text_centre:'', text_right:'', function:function(){console.log('item11 function');} },
//             { type:'item', text_left:'item12', text_centre:'', text_right:'', function:function(){console.log('item12 function');} },
//             { type:'item', text_left:'item13', text_centre:'', text_right:'', function:function(){console.log('item13 function');} },
//             { type:'item', text_left:'item14', text_centre:'', text_right:'', function:function(){console.log('item14 function');} },
//             { type:'item', text_left:'item15', text_centre:'', text_right:'', function:function(){console.log('item15 function');} },
//             { type:'space' },
//         ]} ); controlGroup.append(l_1);
//         var li_1 = _canvas_.interface.part.builder( 'control', 'list_image', 'test_list_image', {
//             x:665,y:0,limitHeightTo:100,limitWidthTo:50,list:[
//                 { type:'space' },
//                 { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('item1 function');} },
//                 { type:'list', text:'sublist', list:[
//                     { type:'space' },
//                     { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('sublist item1 function');} },
//                     { type:'break' },
//                     { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('sublist item2 function');} },
//                     { type:'textbreak', text:'break 1'},
//                     { type:'list', text:'sublist', list:[
//                         { type:'space' },
//                         { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item1 function');} },
//                         { type:'break' },
//                         { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item2 function');} },
//                         { type:'textbreak', text:'break 1'},
//                         { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item3 function');} },
//                         { type:'space' },
//                     ] },
//                     { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('sublist item3 function');} },
//                     { type:'space' },
//                 ] },
//                 { type:'break' },
//                 { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('item2 function');} },
//                 { type:'textbreak', text:'break 1'},
//                 { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('item3 function');} },
//                 { type:'checkbox', text:'checkable', onclickFunction:function(val){console.log('checkbox:',val);} },
//                 { type:'item', text_left:'item4', text_centre:'', text_right:'', function:function(){console.log('item4 function');} },
//                 { type:'item', text_left:'item5', text_centre:'', text_right:'', function:function(){console.log('item5 function');} },
//                 { type:'textbreak', text:'break 1'},
//                 { type:'item', text_left:'item6', text_centre:'', text_right:'', function:function(){console.log('item6 function');} },
//                 { type:'item', text_left:'item7', text_centre:'', text_right:'', function:function(){console.log('item7 function');} },
//                 { type:'item', text_left:'item8', text_centre:'', text_right:'', function:function(){console.log('item8 function');} },
//                 { type:'item', text_left:'item9', text_centre:'', text_right:'', function:function(){console.log('item9 function');} },
//                 { type:'item', text_left:'item10', text_centre:'', text_right:'', function:function(){console.log('item10 function');} },
//                 { type:'break' },
//                 { type:'item', text_left:'item11', text_centre:'', text_right:'', function:function(){console.log('item11 function');} },
//                 { type:'item', text_left:'item12', text_centre:'', text_right:'', function:function(){console.log('item12 function');} },
//                 { type:'item', text_left:'item13', text_centre:'', text_right:'', function:function(){console.log('item13 function');} },
//                 { type:'item', text_left:'item14', text_centre:'', text_right:'', function:function(){console.log('item14 function');} },
//                 { type:'item', text_left:'item15', text_centre:'', text_right:'', function:function(){console.log('item15 function');} },
//                 { type:'space' },
//             ],
//             backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
//             breakURL:'/images/testImages/expanded-metal-1.jpg',
//             sublist__up:'/images/testImages/buttonStates/up.png',
//             sublist__hover:'/images/testImages/buttonStates/hover.png',
//             sublist__glow:'/images/testImages/buttonStates/glow.png',
//             sublist__hover_glow:'/images/testImages/buttonStates/hover_glow.png',
//             sublist__hover_glow_press:'/images/testImages/buttonStates/hover_glow_press.png',
//             checkbox_uncheckURL:'/images/testImages/Dore-munchausen-illustration.jpg',
//             checkbox_checkURL:'/images/testImages/mikeandbrian.jpg',
//             itemURL__off:'/images/testImages/buttonStates/off.png',
//             itemURL__up:'/images/testImages/buttonStates/up.png',
//             itemURL__press:'/images/testImages/buttonStates/press.png',
//             itemURL__select:'/images/testImages/buttonStates/select.png',
//             itemURL__select_press:'/images/testImages/buttonStates/select_press.png',
//             itemURL__glow:'/images/testImages/buttonStates/glow.png',
//             itemURL__glow_press:'/images/testImages/buttonStates/glow_press.png',
//             itemURL__glow_select:'/images/testImages/buttonStates/glow_select.png',
//             itemURL__glow_select_press:'/images/testImages/buttonStates/glow_select_press.png',
//             itemURL__hover:'/images/testImages/buttonStates/hover.png',
//             itemURL__hover_press:'/images/testImages/buttonStates/hover_press.png',
//             itemURL__hover_select:'/images/testImages/buttonStates/hover_select.png',
//             itemURL__hover_select_press:'/images/testImages/buttonStates/hover_select_press.png',
//             itemURL__hover_glow:'/images/testImages/buttonStates/hover_glow.png',
//             itemURL__hover_glow_press:'/images/testImages/buttonStates/hover_glow_press.png',
//             itemURL__hover_glow_select:'/images/testImages/buttonStates/hover_glow_select.png',
//             itemURL__hover_glow_select_press:'/images/testImages/buttonStates/hover_glow_select_press.png',
//         } ); controlGroup.append(li_1);
//     //check box
//         var cr_1 = _canvas_.interface.part.builder( 'control', 'checkbox_rectangle', 'test_checkbox_rectangle1', {x:717.5,y:0} ); controlGroup.append(cr_1);
//         var cc_1 = _canvas_.interface.part.builder( 'control', 'checkbox_circle', 'test_checkbox_circle1', {x:727.5,y:32.5} ); controlGroup.append(cc_1);
//         var cp_1 = _canvas_.interface.part.builder( 'control', 'checkbox_polygon', 'test_checkbox_polygon1', {
//             x:717.5,y:45,
//             outterPoints:[{x:0,y:4},{x:4,y:0}, {x:16,y:0},{x:20,y:4}, {x:20,y:16},{x:16,y:20},{x:4,y:20},{x:0,y:16}],
//             innerPoints:[ {x:2,y:4},{x:4,y:2}, {x:16,y:2},{x:18,y:4}, {x:18,y:16},{x:16,y:18}, {x:4,y:18},{x:2,y:16}],

//         } ); controlGroup.append(cp_1);
//         var ci_1 = _canvas_.interface.part.builder( 'control', 'checkbox_image', 'test_checkbox_image1', {
//             x:717.5,y:67.5,
//             uncheckURL:'/images/testImages/Dore-munchausen-illustration.jpg',
//             checkURL:'/images/testImages/mikeandbrian.jpg',
//         } ); controlGroup.append(ci_1);
//     var ras_1 = _canvas_.interface.part.builder( 'control', 'rastorgrid', 'test_rastorgrid1', {x:740,y:0} ); controlGroup.append(ras_1);
//     var no = _canvas_.interface.part.builder( 'control', 'needleOverlay', 'test_needleOverlay1', {x:822.5,y:0} );
//         controlGroup.append( no );
//         no.select(0.25);
//         no.area(0.5,0.75);
//         no.mark(0.1);
//         no.mark(0.1);
//     var gww = _canvas_.interface.part.builder( 'control', 'grapher_waveWorkspace', 'test_grapher_waveWorkspace1', {x:945,y:0} );
//         controlGroup.append( gww );
//         gww.select(0.2);
//         gww.area(0.5,0.7);
//     var seq = _canvas_.interface.part.builder( 'control', 'sequencer', 'test_sequencer1', {x:1067.5,y:0,zoomLevel_x:1/2} );
//         controlGroup.append( seq );
//         seq.addSignal( 0,0,  10,0.0 );
//         seq.addSignal( 1,1,  10,0.1 );
//         seq.addSignal( 2,2,  10,0.2 );
//         seq.addSignal( 3,3,  10,0.3 );
//         seq.addSignal( 4,4,  10,0.4 );
//         seq.addSignal( 5,5,  10,0.5 );
//         seq.addSignal( 6,6,  10,0.6 );
//         seq.addSignal( 7,7,  10,0.7 );
//         seq.addSignal( 8,8,  10,0.8 );
//         seq.addSignal( 9,9,  10,0.9 );
//         seq.addSignal( 10,10,10,1.0 );
//         seq.event = function(data){console.log(data);};
















// //dynamic
//     var dynamicGroup = _canvas_.interface.part.builder( 'basic', 'group', 'dynamic', { x:10, y:450, angle:0 } );
//     _canvas_.system.pane.mm.append( dynamicGroup );
//     dynamicGroup.append( _canvas_.interface.part.builder( 'dynamic', 'cable', 'test_cable1', {x1:0,y1:0,x2:100,y2:0} ) );

//     var cn_reg_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode1', { x:25, y:25 } ); dynamicGroup.append( cn_reg_0 );
//     var cn_reg_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode2', { x:0,  y:75 } ); dynamicGroup.append( cn_reg_1 );
//     var cn_reg_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode3', { x:50, y:60 } ); dynamicGroup.append( cn_reg_2 );
//     var cn_reg_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode4', { x:30, y:100 } ); dynamicGroup.append( cn_reg_3 );
//     var cn_sig_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal1', { x:125, y:25 } ); dynamicGroup.append( cn_sig_0 );
//     var cn_sig_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal2', { x:100, y:75 } ); dynamicGroup.append( cn_sig_1 );
//     var cn_sig_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal3', { x:150, y:60 } ); dynamicGroup.append( cn_sig_2 );
//     var cn_sig_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal4', { x:130, y:100 } ); dynamicGroup.append( cn_sig_3 );
//     var cn_vol_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage1', { x:225, y:25 } ); dynamicGroup.append( cn_vol_0 ); 
//     var cn_vol_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage2', { x:200, y:75 } ); dynamicGroup.append( cn_vol_1 ); 
//     var cn_vol_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage3', { x:250, y:60 } ); dynamicGroup.append( cn_vol_2 ); 
//     var cn_vol_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage4', { x:230, y:100 } ); dynamicGroup.append( cn_vol_3 ); 
//     var cn_dat_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data1', { x:325, y:25 } ); dynamicGroup.append( cn_dat_0 ); 
//     var cn_dat_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data2', { x:300, y:75 } ); dynamicGroup.append( cn_dat_1 ); 
//     var cn_dat_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data3', { x:350, y:60 } ); dynamicGroup.append( cn_dat_2 ); 
//     var cn_dat_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data4', { x:320, y:100 } ); dynamicGroup.append( cn_dat_3 ); 
//     var cn_aud_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio1', { x:425, y:25, isAudioOutput:true} ); dynamicGroup.append( cn_aud_0 ); 
//     var cn_aud_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio2', { x:400, y:75 } ); dynamicGroup.append( cn_aud_1 ); 
//     var cn_aud_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio3', { x:450, y:60 } ); dynamicGroup.append( cn_aud_2 ); 
//     var cn_aud_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio4', { x:420, y:100, isAudioOutput:true} ); dynamicGroup.append( cn_aud_3 ); 

//     cn_reg_0.connectTo(cn_reg_1); //cn_reg_0.allowConnections(false); cn_reg_0.allowDisconnections(false);
//     cn_sig_0.connectTo(cn_sig_1); //cn_sig_0.allowConnections(false); cn_sig_0.allowDisconnections(false);
//     cn_vol_0.connectTo(cn_vol_1); //cn_vol_0.allowConnections(false); cn_vol_0.allowDisconnections(false);
//     cn_dat_0.connectTo(cn_dat_1); //cn_dat_0.allowConnections(false); cn_dat_0.allowDisconnections(false);
//     cn_aud_0.connectTo(cn_aud_1); //cn_aud_0.allowConnections(false); cn_aud_0.allowDisconnections(false);

//     var cn_reg_4 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode5', { x:50,  y:150, angle:Math.PI*0.15 } ); dynamicGroup.append( cn_reg_4 );
//     var cn_reg_5 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode6', { x:100, y:150, angle:Math.PI*0.25 } ); dynamicGroup.append( cn_reg_5 );
//     cn_reg_4.connectTo(cn_reg_5);