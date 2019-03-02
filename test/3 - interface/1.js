//test of all parts


// //basic
//     var basicGroup = workspace.interface.part.builder( 'group', 'basic', { x:10, y:10, angle:0 } );
//     workspace.system.pane.mm.append( basicGroup );
//     basicGroup.append( workspace.interface.part.builder( 'rectangle', 'testRectangle', { x:5, y:5, width:30, height:30, style:{ fill:'rgba(255,0,0,1)' } } ) );
//     basicGroup.append( workspace.interface.part.builder( 'circle', 'testCircle', { x:20, y:55, r:15 } ) );
//     basicGroup.append( workspace.interface.part.builder( 'image', 'testImage', { x:40, y:40, width:30, height:30, url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg' } ) );
//     basicGroup.append( workspace.interface.part.builder( 'clippedImage', 'testClippedImage', { 
//         x:75, y:5, width:50, height:50, 
//         url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg',
//         points:[{x:0,y:0},{x:1,y:0},{x:1,y:1}]
//     } ) );
//     basicGroup.append( workspace.interface.part.builder( 'polygon', 'testPolygon', { points:[{x:55,y:5}, {x:70,y:35}, {x:40,y:35}], style:{ fill:'rgba(0,255,0,1)' } } ) );
//     basicGroup.append( workspace.interface.part.builder( 'text', 'testText', { x:7.5, y:95, text:'Hello', style:{font:'20pt Arial', fill:'rgba(150,150,255,1)' } } ) );
//     basicGroup.append( workspace.interface.part.builder( 'path', 'testPath', { points:[{x:0,y:0},{x:0,y:90},{x:2.5,y:90},{x:2.5,y:72.5},{x:75,y:72.5}] }) );

// //display
//     var displayGroup = workspace.interface.part.builder( 'group', 'display', { x:10, y:150, angle:0 } );
//     workspace.system.pane.mm.append( displayGroup );
//     displayGroup.append( workspace.interface.part.builder( 'glowbox_rect', 'test_glowbox_rect', {x:0,y:0} ) );
//     displayGroup.append( workspace.interface.part.builder( 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35,y:0} ) );
//     displayGroup.append( workspace.interface.part.builder( 'sevenSegmentDisplay_static', 'test_sevenSegmentDisplay_static', {x:35,y:70} ) );
//     displayGroup.append( workspace.interface.part.builder( 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60,y:0} ) );
//     displayGroup.append( workspace.interface.part.builder( 'sixteenSegmentDisplay_static', 'test_sixteenSegmentDisplay_static', {x:60,y:70} ) );
//     displayGroup.append( workspace.interface.part.builder( 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:85,y:0} ) );
//     displayGroup.append( workspace.interface.part.builder( 'readout_sixteenSegmentDisplay_static', 'test_readout_sixteenSegmentDisplay_static', {x:85,y:70} ) );
//     displayGroup.append( workspace.interface.part.builder( 'level', 'test_level1', {x:190, y:0} ) );
//     displayGroup.append( workspace.interface.part.builder( 'meter_level', 'test_meterLevel1', {x:215, y:0} ) );
//     displayGroup.append( workspace.interface.part.builder( 'audio_meter_level', 'test_audioMeterLevel1', {x:240, y:0} ) );
//     displayGroup.append( workspace.interface.part.builder( 'rastorDisplay', 'test_rastorDisplay1', {x:265, y:0} ) );
//     var grapher = workspace.interface.part.builder( 'grapher', 'test_grapher1', {x:330, y:0} );
//         displayGroup.append( grapher );
//         grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
//         grapher.draw([0,0.25,1],undefined,1);
//     var grapher = workspace.interface.part.builder( 'grapher_static', 'test_grapher_static1', {x:330, y:70} );
//         displayGroup.append( grapher );
//         grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
//         grapher.draw([0,0.25,1],undefined,1);
//     var grapher = workspace.interface.part.builder( 'grapher_periodicWave', 'test_grapher_periodicWave1', {x:455, y:0} );
//         displayGroup.append( grapher );
//         grapher.updateBackground();
//         grapher.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
//         grapher.draw();
//     var grapher = workspace.interface.part.builder( 'grapher_periodicWave_static', 'test_grapher_periodicWave_static1', {x:455, y:70} );
//         displayGroup.append( grapher );
//         grapher.updateBackground();
//         grapher.wave( {sin:[0,1/1,0,1/3,0,1/5,0,1/7,0,1/9,0,1/11,0,1/13,0,1/15],cos:[0,0]} );
//         grapher.draw();
//     var grapher = workspace.interface.part.builder( 'grapher_audioScope', 'test_grapher_audioScope1', {x:580, y:0} );
//         displayGroup.append( grapher );
//     var grapher = workspace.interface.part.builder( 'grapher_audioScope_static', 'test_grapher_audioScope_static1', {x:580, y:70} );
//         displayGroup.append( grapher );

//control
    var controlGroup = workspace.interface.part.builder( 'group', 'control', { x:10, y:300, angle:0 } );
    workspace.system.pane.mm.append( controlGroup );
    //slide
        var s_1 = workspace.interface.part.builder( 'slide', 'test_slide1', {x:0,y:0} ); controlGroup.append( s_1 );
        var si_1 = workspace.interface.part.builder( 'slide_image', 'test_slide_image1', {
            x:12.5,y:0,
            handleURL:'https://cdn.kingcats-fence.com/wp-content/uploads/2017/12/expanded-metal-1.jpg',
            backingURL:'http://www.sydneydesignworld.com.au/wp-content/uploads/2016/03/41-satin-stainless-steel.jpg',
            slotURL:'https://img.freepik.com/free-photo/dark-background_1048-3848.jpg?size=338&ext=jpg',
        } ); controlGroup.append( si_1 );
        var sp_1 = workspace.interface.part.builder( 'slidePanel', 'test_slidePanel1', {x:25,y:0} ); controlGroup.append( sp_1 );
        var spi_1 = workspace.interface.part.builder( 'slidePanel_image', 'test_slidePanel_image1', {
            x:107.5,y:0,
            handleURL:'https://cdn.kingcats-fence.com/wp-content/uploads/2017/12/expanded-metal-1.jpg',
            backingURL:'http://www.sydneydesignworld.com.au/wp-content/uploads/2016/03/41-satin-stainless-steel.jpg',
            slotURL:'https://img.freepik.com/free-photo/dark-background_1048-3848.jpg?size=338&ext=jpg',
            overlayURL:'images/units/alpha/glowbox_rect_overlay_1.png',
        } ); controlGroup.append( spi_1 );
        var s_2 = workspace.interface.part.builder( 'slide', 'test_slide2', {x:190,y:10,angle:-Math.PI/2} ); controlGroup.append( s_2 );
        var si_2 = workspace.interface.part.builder( 'slide_image', 'test_slide_image2', {
            x:190,y:22.5,angle:-Math.PI/2,
            handleURL:'https://cdn.kingcats-fence.com/wp-content/uploads/2017/12/expanded-metal-1.jpg',
            backingURL:'http://www.sydneydesignworld.com.au/wp-content/uploads/2016/03/41-satin-stainless-steel.jpg',
            slotURL:'https://img.freepik.com/free-photo/dark-background_1048-3848.jpg?size=338&ext=jpg',
        } ); controlGroup.append( si_2 );
        var sp_2 = workspace.interface.part.builder( 'slidePanel', 'test_slidePanel2', {x:287.5,y:80,angle:-Math.PI/2} ); controlGroup.append( sp_2 );
        var spi_2 = workspace.interface.part.builder( 'slidePanel_image', 'test_slidePanel_image2', {
            x:287.5,y:162.5,angle:-Math.PI/2,
            handleURL:'https://cdn.kingcats-fence.com/wp-content/uploads/2017/12/expanded-metal-1.jpg',
            backingURL:'http://www.sydneydesignworld.com.au/wp-content/uploads/2016/03/41-satin-stainless-steel.jpg',
            slotURL:'https://img.freepik.com/free-photo/dark-background_1048-3848.jpg?size=338&ext=jpg',
        } ); controlGroup.append( spi_2 );
        var r_1 = workspace.interface.part.builder( 'rangeslide', 'test_rangeslide1', {x:385,y:0} ); controlGroup.append(r_1);
        var ri_1 = workspace.interface.part.builder( 'rangeslide_image', 'test_rangeslide_image1', {
            x:397.5,y:0,
            handleURL:'https://cdn.kingcats-fence.com/wp-content/uploads/2017/12/expanded-metal-1.jpg',
            backingURL:'http://www.sydneydesignworld.com.au/wp-content/uploads/2016/03/41-satin-stainless-steel.jpg',
            slotURL:'https://img.freepik.com/free-photo/dark-background_1048-3848.jpg?size=338&ext=jpg',
            spanURL:'images/units/alpha/glowbox_rect_overlay_1.png',
        } ); controlGroup.append(ri_1);
        var r_2 = workspace.interface.part.builder( 'rangeslide', 'test_rangeslide2', {x:410,y:10,angle:-Math.PI/2} ); controlGroup.append(r_2);
        var ri_2 = workspace.interface.part.builder( 'rangeslide_image', 'test_rangeslide_image2', {
            x:410,y:22.5,angle:-Math.PI/2,
            handleURL:'https://cdn.kingcats-fence.com/wp-content/uploads/2017/12/expanded-metal-1.jpg',
            backingURL:'http://www.sydneydesignworld.com.au/wp-content/uploads/2016/03/41-satin-stainless-steel.jpg',
            slotURL:'https://img.freepik.com/free-photo/dark-background_1048-3848.jpg?size=338&ext=jpg',
            spanURL:'images/units/alpha/glowbox_rect_overlay_1.png',
        } ); controlGroup.append(ri_2);
    //dial
        var dc_1 = workspace.interface.part.builder( 'dial_continuous', 'test_dial_continuous1', {x:525,y:20} ); controlGroup.append(dc_1);
        var dd_1 = workspace.interface.part.builder( 'dial_discrete', 'test_dial_discrete1', {x:560,y:20} ); controlGroup.append(dd_1);
        var dic_1 = workspace.interface.part.builder( 'dial_continuous_image', 'test_dial_continuous_image1', {
            x:525,y:60,
            handleURL:'http://space.alglobus.net/Basics/whyImages/earthFromSpace.gif',
            slotURL:'https://i.ytimg.com/vi/JS7NYKqhrFo/hqdefault.jpg',
            needleURL:'http://coolinterestingstuff.com/wp-content/uploads/2012/09/space-4.jpg',
        } ); controlGroup.append(dic_1);
        var did_1 = workspace.interface.part.builder( 'dial_discrete_image', 'test_dial_discrete_image1', {
            x:560,y:60,
            handleURL:'https://pbs.twimg.com/profile_images/927920625347383297/-ksNZr-Z_400x400.jpg',
            slotURL:'https://blueblots.com/wp-content/uploads/2009/07/space1.jpg',
            needleURL:'https://i.ytimg.com/vi/kpFryXQbVEA/hqdefault.jpg',
        } ); controlGroup.append(did_1);
    //button
        var br_1 = workspace.interface.part.builder( 'button_rectangle', 'test_button_rectangle1', {x:580,y:0,text_centre:'rectangle'} ); controlGroup.append(br_1);
        var bc_1 = workspace.interface.part.builder( 'button_circle', 'test_button_circle1', {x:595,y:37.5,text_centre:'circle'} ); controlGroup.append(bc_1);
        var bp_1 = workspace.interface.part.builder( 'button_polygon', 'test_button_polygon1', {
            x:580,y:55,points:[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}],
            text_centre:'polygon'
        } ); controlGroup.append(bp_1);
        var bi_1 = workspace.interface.part.builder( 'button_image', 'test_button_image1', {
            x:580,y:87.5,
            backingURL__off:'http://space.alglobus.net/Basics/whyImages/earthFromSpace.gif',
            backingURL__up:'https://i.ytimg.com/vi/JS7NYKqhrFo/hqdefault.jpg',
            backingURL__press:'http://coolinterestingstuff.com/wp-content/uploads/2012/09/space-4.jpg',
            backingURL__select:'https://pbs.twimg.com/profile_images/927920625347383297/-ksNZr-Z_400x400.jpg',
            backingURL__select_press:'https://blueblots.com/wp-content/uploads/2009/07/space1.jpg',
            backingURL__glow:'https://i.ytimg.com/vi/kpFryXQbVEA/hqdefault.jpg',
            backingURL__glow_press:'https://fabiusmaximus.files.wordpress.com/2016/01/north-america-at-night-from-space.jpg',
            backingURL__glow_select:'https://s3.amazonaws.com/spoonflower/public/design_thumbnails/0263/6418/rspoonflower_space_picmonkey_blue_v2_shop_preview.png',
            backingURL__glow_select_press:'https://www.onlytoptens.com/wp-content/uploads/2011/03/top-10-space-facts-moon-moving-away-from-earth.jpeg',
            backingURL__hover:'https://cbsnews2.cbsistatic.com/hub/i/r/2015/04/14/5b5bc07b-95cf-4d06-9b98-a4738d904981/resize/620x465/9146eac2f7e3d92908bd5dfe4450a31d/hubble-telescope-anniversary12.jpg#',
            backingURL__hover_press:'http://1.bp.blogspot.com/-gCkpyF_ib9M/TWBP5ftaeII/AAAAAAAAAY0/r1yI-UNbSSY/s1600/tychePlanet.jpg',
            backingURL__hover_select:'http://vignette3.wikia.nocookie.net/freerealmswarriorcats/images/6/61/4293522-567779-space-background-star-heart-in-night-sky.jpg/revision/latest?cb=20140103064430',
            backingURL__hover_select_press:'https://spaceplace.nasa.gov/templates/featured/space/galaxies300.png',
            backingURL__hover_glow:'https://s3.amazonaws.com/spoonflower/public/design_thumbnails/0157/0136/SPACE_PRINT-ALIEN_2_shop_preview.png',
            backingURL__hover_glow_press:'http://1.bp.blogspot.com/-rbBG3L514tQ/UD9eJuVrH1I/AAAAAAAAIo0/RKOGYNs0WwM/s400/Outer+Space+Wallpapers+6.jpg',
            backingURL__hover_glow_select:'http://previewcf.turbosquid.com/Preview/2014/05/25__12_10_05/gamma%20wormhole%202.jpg0671fb75-c6d0-49ee-9555-9ca9bf1ba482Larger.jpg',
            backingURL__hover_glow_select_press:'http://imgc.allpostersimages.com/images/P-473-488-90/61/6172/E2RG100Z/posters/earth-from-space.jpg',
        } ); controlGroup.append(bi_1);
    //list
        var l_1 = workspace.interface.part.builder( 'list', 'test_list1', {x:612.5,y:0,list:[
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
        ]} ); controlGroup.append(l_1);
        var li_1 = workspace.interface.part.builder( 'list_image', 'test_list_image1', {
            x:665,y:0,list:[
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
            ],
            backingURL:'http://www.sydneydesignworld.com.au/wp-content/uploads/2016/03/41-satin-stainless-steel.jpg',
            breakURL:'https://cdn.kingcats-fence.com/wp-content/uploads/2017/12/expanded-metal-1.jpg',
            itemURL__off:'http://space.alglobus.net/Basics/whyImages/earthFromSpace.gif',
            itemURL__up:'https://i.ytimg.com/vi/JS7NYKqhrFo/hqdefault.jpg',
            itemURL__press:'http://coolinterestingstuff.com/wp-content/uploads/2012/09/space-4.jpg',
            itemURL__select:'https://pbs.twimg.com/profile_images/927920625347383297/-ksNZr-Z_400x400.jpg',
            itemURL__select_press:'https://blueblots.com/wp-content/uploads/2009/07/space1.jpg',
            itemURL__glow:'https://i.ytimg.com/vi/kpFryXQbVEA/hqdefault.jpg',
            itemURL__glow_press:'https://fabiusmaximus.files.wordpress.com/2016/01/north-america-at-night-from-space.jpg',
            itemURL__glow_select:'https://s3.amazonaws.com/spoonflower/public/design_thumbnails/0263/6418/rspoonflower_space_picmonkey_blue_v2_shop_preview.png',
            itemURL__glow_select_press:'https://www.onlytoptens.com/wp-content/uploads/2011/03/top-10-space-facts-moon-moving-away-from-earth.jpeg',
            itemURL__hover:'https://cbsnews2.cbsistatic.com/hub/i/r/2015/04/14/5b5bc07b-95cf-4d06-9b98-a4738d904981/resize/620x465/9146eac2f7e3d92908bd5dfe4450a31d/hubble-telescope-anniversary12.jpg#',
            itemURL__hover_press:'http://1.bp.blogspot.com/-gCkpyF_ib9M/TWBP5ftaeII/AAAAAAAAAY0/r1yI-UNbSSY/s1600/tychePlanet.jpg',
            itemURL__hover_select:'http://vignette3.wikia.nocookie.net/freerealmswarriorcats/images/6/61/4293522-567779-space-background-star-heart-in-night-sky.jpg/revision/latest?cb=20140103064430',
            itemURL__hover_select_press:'https://spaceplace.nasa.gov/templates/featured/space/galaxies300.png',
            itemURL__hover_glow:'https://s3.amazonaws.com/spoonflower/public/design_thumbnails/0157/0136/SPACE_PRINT-ALIEN_2_shop_preview.png',
            itemURL__hover_glow_press:'http://1.bp.blogspot.com/-rbBG3L514tQ/UD9eJuVrH1I/AAAAAAAAIo0/RKOGYNs0WwM/s400/Outer+Space+Wallpapers+6.jpg',
            itemURL__hover_glow_select:'http://previewcf.turbosquid.com/Preview/2014/05/25__12_10_05/gamma%20wormhole%202.jpg0671fb75-c6d0-49ee-9555-9ca9bf1ba482Larger.jpg',
            itemURL__hover_glow_select_press:'http://imgc.allpostersimages.com/images/P-473-488-90/61/6172/E2RG100Z/posters/earth-from-space.jpg',
        } ); controlGroup.append(li_1);
    //check box
        var cr_1 = workspace.interface.part.builder( 'checkbox_rectangle', 'test_checkbox_rectangle1', {x:717.5,y:0} ); controlGroup.append(cr_1);
        var cc_1 = workspace.interface.part.builder( 'checkbox_circle', 'test_checkbox_circle1', {x:727.5,y:32.5} ); controlGroup.append(cc_1);
        var cp_1 = workspace.interface.part.builder( 'checkbox_polygon', 'test_checkbox_polygon1', {
            x:717.5,y:45,
            outterPoints:[{x:0,y:4},{x:4,y:0}, {x:16,y:0},{x:20,y:4}, {x:20,y:16},{x:16,y:20},{x:4,y:20},{x:0,y:16}],
            innerPoints:[ {x:2,y:4},{x:4,y:2}, {x:16,y:2},{x:18,y:4}, {x:18,y:16},{x:16,y:18}, {x:4,y:18},{x:2,y:16}],
        } ); controlGroup.append(cp_1);
        var ci_1 = workspace.interface.part.builder( 'checkbox_image', 'test_checkbox_image1', {
            x:717.5,y:67.5,
            uncheckURL:'https://s3.amazonaws.com/spoonflower/public/design_thumbnails/0157/0136/SPACE_PRINT-ALIEN_2_shop_preview.png',
            checkURL:'http://1.bp.blogspot.com/-gCkpyF_ib9M/TWBP5ftaeII/AAAAAAAAAY0/r1yI-UNbSSY/s1600/tychePlanet.jpg',
        } ); controlGroup.append(ci_1);

    // var ras_1 = workspace.interface.part.builder( 'rastorgrid', 'test_rastorgrid1', {x:605,y:0} ); controlGroup.append(ras_1);

    // var no = workspace.interface.part.builder( 'needleOverlay', 'test_needleOverlay1', {x:690,y:0} );
    //     controlGroup.append( no );
    //     no.select(0.25);
    //     no.area(0.5,0.75);
    //     no.mark(0.1);
    //     no.mark(0.1);
    // var gww = workspace.interface.part.builder( 'grapher_waveWorkspace', 'test_grapher_waveWorkspace1', {x:815,y:0} );
    //     controlGroup.append( gww );
    //     gww.select(0.2);
    //     gww.area(0.5,0.7);
    // var seq = workspace.interface.part.builder( 'sequencer', 'test_sequencer1', {x:940,y:0,zoomLevel_x:1/2} );
    //     controlGroup.append( seq );
    //     seq.addSignal( 0,0,  10,0.0 );
    //     seq.addSignal( 1,1,  10,0.1 );
    //     seq.addSignal( 2,2,  10,0.2 );
    //     seq.addSignal( 3,3,  10,0.3 );
    //     seq.addSignal( 4,4,  10,0.4 );
    //     seq.addSignal( 5,5,  10,0.5 );
    //     seq.addSignal( 6,6,  10,0.6 );
    //     seq.addSignal( 7,7,  10,0.7 );
    //     seq.addSignal( 8,8,  10,0.8 );
    //     seq.addSignal( 9,9,  10,0.9 );
    //     seq.addSignal( 10,10,10,1.0 );
    //     seq.event = function(data){console.log(data);};


// //dynamic
//     var dynamicGroup = workspace.interface.part.builder( 'group', 'dynamic', { x:10, y:450, angle:0 } );
//     workspace.system.pane.mm.append( dynamicGroup );
//     dynamicGroup.append( workspace.interface.part.builder( 'cable', 'test_cable1', {x1:0,y1:0,x2:100,y2:0} ) );

//     var cn_reg_0 = workspace.interface.part.builder( 'connectionNode', 'test_connectionNode1', { x:25, y:25 } ); dynamicGroup.append( cn_reg_0 );
//     var cn_reg_1 = workspace.interface.part.builder( 'connectionNode', 'test_connectionNode2', { x:0,  y:75 } ); dynamicGroup.append( cn_reg_1 );
//     var cn_reg_2 = workspace.interface.part.builder( 'connectionNode', 'test_connectionNode3', { x:50, y:60 } ); dynamicGroup.append( cn_reg_2 );
//     var cn_reg_3 = workspace.interface.part.builder( 'connectionNode', 'test_connectionNode4', { x:30, y:100 } ); dynamicGroup.append( cn_reg_3 );
//     var cn_sig_0 = workspace.interface.part.builder( 'connectionNode_signal', 'test_connectionNode_signal1', { x:125, y:25 } ); dynamicGroup.append( cn_sig_0 );
//     var cn_sig_1 = workspace.interface.part.builder( 'connectionNode_signal', 'test_connectionNode_signal2', { x:100, y:75 } ); dynamicGroup.append( cn_sig_1 );
//     var cn_sig_2 = workspace.interface.part.builder( 'connectionNode_signal', 'test_connectionNode_signal3', { x:150, y:60 } ); dynamicGroup.append( cn_sig_2 );
//     var cn_sig_3 = workspace.interface.part.builder( 'connectionNode_signal', 'test_connectionNode_signal4', { x:130, y:100 } ); dynamicGroup.append( cn_sig_3 );
//     var cn_vol_0 = workspace.interface.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage1', { x:225, y:25 } ); dynamicGroup.append( cn_vol_0 ); 
//     var cn_vol_1 = workspace.interface.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage2', { x:200, y:75 } ); dynamicGroup.append( cn_vol_1 ); 
//     var cn_vol_2 = workspace.interface.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage3', { x:250, y:60 } ); dynamicGroup.append( cn_vol_2 ); 
//     var cn_vol_3 = workspace.interface.part.builder( 'connectionNode_voltage', 'test_connectionNode_voltage4', { x:230, y:100 } ); dynamicGroup.append( cn_vol_3 ); 
//     var cn_dat_0 = workspace.interface.part.builder( 'connectionNode_data', 'test_connectionNode_data1', { x:325, y:25 } ); dynamicGroup.append( cn_dat_0 ); 
//     var cn_dat_1 = workspace.interface.part.builder( 'connectionNode_data', 'test_connectionNode_data2', { x:300, y:75 } ); dynamicGroup.append( cn_dat_1 ); 
//     var cn_dat_2 = workspace.interface.part.builder( 'connectionNode_data', 'test_connectionNode_data3', { x:350, y:60 } ); dynamicGroup.append( cn_dat_2 ); 
//     var cn_dat_3 = workspace.interface.part.builder( 'connectionNode_data', 'test_connectionNode_data4', { x:320, y:100 } ); dynamicGroup.append( cn_dat_3 ); 
//     var cn_aud_0 = workspace.interface.part.builder( 'connectionNode_audio', 'test_connectionNode_audio1', { x:425, y:25, isAudioOutput:true} ); dynamicGroup.append( cn_aud_0 ); 
//     var cn_aud_1 = workspace.interface.part.builder( 'connectionNode_audio', 'test_connectionNode_audio2', { x:400, y:75 } ); dynamicGroup.append( cn_aud_1 ); 
//     var cn_aud_2 = workspace.interface.part.builder( 'connectionNode_audio', 'test_connectionNode_audio3', { x:450, y:60 } ); dynamicGroup.append( cn_aud_2 ); 
//     var cn_aud_3 = workspace.interface.part.builder( 'connectionNode_audio', 'test_connectionNode_audio4', { x:420, y:100, isAudioOutput:true} ); dynamicGroup.append( cn_aud_3 ); 

//     cn_reg_0.connectTo(cn_reg_1); cn_reg_0.allowConnections(false); cn_reg_0.allowDisconnections(false);
//     cn_sig_0.connectTo(cn_sig_1); cn_sig_0.allowConnections(false); cn_sig_0.allowDisconnections(false);
//     cn_vol_0.connectTo(cn_vol_1); cn_vol_0.allowConnections(false); cn_vol_0.allowDisconnections(false);
//     cn_dat_0.connectTo(cn_dat_1); cn_dat_0.allowConnections(false); cn_dat_0.allowDisconnections(false);
//     cn_aud_0.connectTo(cn_aud_1); cn_aud_0.allowConnections(false); cn_aud_0.allowDisconnections(false);





workspace.core.render.active(true);
workspace.core.viewport.stopMouseScroll(true);

// //view positioning
//     workspace.core.viewport.scale(10/2);
//     workspace.core.viewport.position(-650,-290);