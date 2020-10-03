var partsCreated = {};

_canvas_.layers.registerFunctionForLayer("interface", function(){

    _canvas_.core.render.active(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(10);
    _canvas_.core.viewport.stopMouseScroll(true);

    // _canvas_.core.viewport.scale(5);
    // _canvas_.core.viewport.position(550,0);

    partsCreated.display = {};
    partsCreated.display.displayGroup = _canvas_.interface.part.builder( 'basic', 'group', 'displayGroup', { x:10, y:10 } );
    _canvas_.system.pane.mm.append(partsCreated.display.displayGroup);

    //glowbox
        //glowbox_rectangle
            partsCreated.display.glowbox_rectangle = _canvas_.interface.part.builder('display', 'glowbox_rectangle', 'test_glowbox_rectangle', {x:0, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.glowbox_rectangle);
        //glowbox_circle
            partsCreated.display.glowbox_circle = _canvas_.interface.part.builder('display', 'glowbox_circle', 'test_glowbox_circle', {x:15, y:45});
            partsCreated.display.displayGroup.append(partsCreated.display.glowbox_circle);
        //glowbox_image
            partsCreated.display.glowbox_image = _canvas_.interface.part.builder('display', 'glowbox_image', 'test_glowbox_image', {x:0, y:60, glowURL:'/images/testImages/Dore-munchausen-illustration.jpg', dimURL:'/images/testImages/mikeandbrian.jpg'});
            partsCreated.display.displayGroup.append(partsCreated.display.glowbox_image);
        //glowbox_polygon
            partsCreated.display.glowbox_polygon = _canvas_.interface.part.builder('display', 'glowbox_polygon', 'test_glowbox_polygon', {x:0, y:95});
            partsCreated.display.displayGroup.append(partsCreated.display.glowbox_polygon);
        //glowbox_path
            partsCreated.display.glowbox_path = _canvas_.interface.part.builder('display', 'glowbox_path', 'test_glowbox_path', {x:0, y:130});
            partsCreated.display.displayGroup.append(partsCreated.display.glowbox_path);
    
        // let display_glowbox_state = false;
        // setInterval(() => {
        //     if(display_glowbox_state){
        //         partsCreated.display.glowbox_rectangle.off();
        //         partsCreated.display.glowbox_circle.off();
        //         partsCreated.display.glowbox_image.off();
        //         partsCreated.display.glowbox_polygon.off();
        //         partsCreated.display.glowbox_path.off();
        //     }else{
        //         partsCreated.display.glowbox_rectangle.on();
        //         partsCreated.display.glowbox_circle.on();
        //         partsCreated.display.glowbox_image.on();
        //         partsCreated.display.glowbox_polygon.on();
        //         partsCreated.display.glowbox_path.on();
        //     }
        //     display_glowbox_state = !display_glowbox_state;
        // }, 1000);

    //segment displays
        //sevenSegmentDisplay
            partsCreated.display.sevenSegmentDisplay = _canvas_.interface.part.builder('display', 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.sevenSegmentDisplay);
        //sevenSegmentDisplay (static)
            partsCreated.display.sevenSegmentDisplay_static = _canvas_.interface.part.builder('display', 'sevenSegmentDisplay', 'test_sevenSegmentDisplay_static', {x:35, y:35, static:true});
            partsCreated.display.displayGroup.append(partsCreated.display.sevenSegmentDisplay_static);
        //sixteenSegmentDisplay
            partsCreated.display.sixteenSegmentDisplay = _canvas_.interface.part.builder('display', 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.sixteenSegmentDisplay);
        //sixteenSegmentDisplay (static)
            partsCreated.display.sixteenSegmentDisplay_static = _canvas_.interface.part.builder('display', 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay_static', {x:60, y:35, static:true});
            partsCreated.display.displayGroup.append(partsCreated.display.sixteenSegmentDisplay_static);
        //readout_sevenSegmentDisplay
            partsCreated.display.readout_sevenSegmentDisplay = _canvas_.interface.part.builder('display', 'readout_sevenSegmentDisplay', 'test_readout_sevenSegmentDisplay', {x:85, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.readout_sevenSegmentDisplay);
        //readout_sevenSegmentDisplay (static)
            partsCreated.display.readout_sevenSegmentDisplay_static = _canvas_.interface.part.builder('display', 'readout_sevenSegmentDisplay', 'test_readout_sevenSegmentDisplay_static', {x:85, y:35, static:true});
            partsCreated.display.displayGroup.append(partsCreated.display.readout_sevenSegmentDisplay_static);
        //readout_sixteenSegmentDisplay
            partsCreated.display.readout_sixteenSegmentDisplay = _canvas_.interface.part.builder('display', 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:190, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.readout_sixteenSegmentDisplay);
        //readout_sixteenSegmentDisplay (static)
            partsCreated.display.readout_sixteenSegmentDisplay_static = _canvas_.interface.part.builder('display', 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay_static', {x:190, y:35, static:true});
            partsCreated.display.displayGroup.append(partsCreated.display.readout_sixteenSegmentDisplay_static);

        // let display_sevenSegmentDisplay_state = 0;
        // let display_sixteenSegmentDisplay_state_index = 0;
        // let display_sixteenSegmentDisplay_state_glyphs = ['!','?','.',',','\'',':','"','_','-','\\','/','*','#','<','>','(',')','[',']','{','}','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        // setInterval(() => {
        //     partsCreated.display.sevenSegmentDisplay.enterCharacter(display_sevenSegmentDisplay_state);
        //     partsCreated.display.sevenSegmentDisplay_static.enterCharacter(display_sevenSegmentDisplay_state);
        //     display_sevenSegmentDisplay_state++;
        //     if(display_sevenSegmentDisplay_state > 9){display_sevenSegmentDisplay_state = 0;}

        //     partsCreated.display.sixteenSegmentDisplay.enterCharacter(display_sixteenSegmentDisplay_state_glyphs[display_sixteenSegmentDisplay_state_index]);
        //     partsCreated.display.sixteenSegmentDisplay_static.enterCharacter(display_sixteenSegmentDisplay_state_glyphs[display_sixteenSegmentDisplay_state_index]);
        //     display_sixteenSegmentDisplay_state_index++;
        //     if(display_sixteenSegmentDisplay_state_index >= display_sixteenSegmentDisplay_state_glyphs.length){display_sixteenSegmentDisplay_state_index = 0;}
        // }, 500);
        // setTimeout(() => {
        //     partsCreated.display.readout_sevenSegmentDisplay.text('1234567890');
        //     partsCreated.display.readout_sevenSegmentDisplay.print('smart');
        //     partsCreated.display.readout_sevenSegmentDisplay_static.text('1234567890');
        //     partsCreated.display.readout_sevenSegmentDisplay_static.print('smart');
        //     partsCreated.display.readout_sixteenSegmentDisplay.text('!?.,\':"_-\\/*#<>()[]{}0123456789abcdefghijklmnopqrstuvwxyz');
        //     partsCreated.display.readout_sixteenSegmentDisplay.print('smart');
        //     partsCreated.display.readout_sixteenSegmentDisplay_static.text('!?.,\':"_-\\/*#<>()[]{}0123456789abcdefghijklmnopqrstuvwxyz');
        //     partsCreated.display.readout_sixteenSegmentDisplay_static.print('smart');
        // }, 500);

    //levels
        //level
            partsCreated.display.level = _canvas_.interface.part.builder('display', 'level', 'test_level', {x:295, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.level);
        //meter_level
            partsCreated.display.meter_level = _canvas_.interface.part.builder('display', 'meter_level', 'test_meter_level', {x:320, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.meter_level);
        //audio_meter_level
            partsCreated.display.audio_meter_level = _canvas_.interface.part.builder('display', 'audio_meter_level', 'test_audio_meter_level', {x:345, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.audio_meter_level);

        // setInterval(() => {
        //     partsCreated.display.level.layer(Math.random(), 0);
        //     partsCreated.display.level.layer(Math.random(), 1);
        //     partsCreated.display.meter_level.set(Math.random());
        // },1000);

    //gauge
        //gauge
            partsCreated.display.gauge = _canvas_.interface.part.builder('display', 'gauge', 'test_gauge', {x:370, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.gauge);
        //gauge_image
            partsCreated.display.gauge_image = _canvas_.interface.part.builder('display', 'gauge_image', 'test_gauge_image', {x:425, y:0, backingURL:'/images/testImages/Dore-munchausen-illustration.jpg'});
            partsCreated.display.displayGroup.append(partsCreated.display.gauge_image);
        //meter_gauge
            partsCreated.display.meter_gauge = _canvas_.interface.part.builder('display', 'meter_gauge', 'test_meter_gauge', {x:370, y:35, markings:{ upper:'...........'.split(''), middle:'.........'.split(''), lower:'.......'.split('') }, style:{markingStyle_font:'defaultThin'}});
            partsCreated.display.displayGroup.append(partsCreated.display.meter_gauge);
        //meter_gauge_image
            partsCreated.display.meter_gauge_image = _canvas_.interface.part.builder('display', 'meter_gauge_image', 'test_meter_gauge_image', {x:425, y:35, backingURL:'/images/testImages/mikeandbrian.jpg'});
            partsCreated.display.displayGroup.append(partsCreated.display.meter_gauge_image);
    
        // setInterval(() => {
        //     partsCreated.display.gauge.needle(Math.random());
        //     partsCreated.display.gauge_image.needle(Math.random());
        //     partsCreated.display.meter_gauge.set(Math.random());
        //     partsCreated.display.meter_gauge_image.set(Math.random());
        // },1000);

    //rastor
        //rastorDisplay
            partsCreated.display.rastorDisplay = _canvas_.interface.part.builder('display', 'rastorDisplay', 'test_rastorDisplay', {x:480, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.rastorDisplay);

        // partsCreated.display.rastorDisplay.test();
        
    //grapher
        //grapher
            partsCreated.display.grapher = _canvas_.interface.part.builder('display', 'grapher', 'test_grapher', {x:550, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.grapher);
        //grapher (static)
            partsCreated.display.grapher_static = _canvas_.interface.part.builder('display', 'grapher', 'test_grapher_static', {x:550, y:65, static:true});
            partsCreated.display.displayGroup.append(partsCreated.display.grapher_static);
        //grapher_periodicWave
            partsCreated.display.grapher_periodicWave = _canvas_.interface.part.builder('display', 'grapher_periodicWave', 'test_grapher_periodicWave', {x:675, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.grapher_periodicWave);
        //grapher_periodicWave (static)
            partsCreated.display.grapher_periodicWave_static = _canvas_.interface.part.builder('display', 'grapher_periodicWave', 'test_grapher_periodicWave_static', {x:675, y:65, static:true});
            partsCreated.display.displayGroup.append(partsCreated.display.grapher_periodicWave_static);
        //grapher_audioScope
            partsCreated.display.grapher_audioScope = _canvas_.interface.part.builder('display', 'grapher_audioScope', 'test_grapher_audioScope', {x:800, y:0});
            partsCreated.display.displayGroup.append(partsCreated.display.grapher_audioScope);
        //grapher_audioScope (static)
            partsCreated.display.grapher_audioScope_static = _canvas_.interface.part.builder('display', 'grapher_audioScope', 'test_grapher_audioScope_static', {x:800, y:65, static:true});
            partsCreated.display.displayGroup.append(partsCreated.display.grapher_audioScope_static);

        // partsCreated.display.grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
        // partsCreated.display.grapher.draw([0,0.25,1],undefined,1);
        // partsCreated.display.grapher_static.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
        // partsCreated.display.grapher_static.draw([0,0.25,1],undefined,1);
        // partsCreated.display.grapher_periodicWave.reset();
        // partsCreated.display.grapher_periodicWave.wave([0,0,0.5],'sin');
        // partsCreated.display.grapher_periodicWave.wave([0,0.25],'cos');
        // partsCreated.display.grapher_periodicWave.draw();
        // partsCreated.display.grapher_periodicWave_static.reset();
        // partsCreated.display.grapher_periodicWave_static.wave([0,0,0.5],'sin');
        // partsCreated.display.grapher_periodicWave_static.wave([0,0.25],'cos');
        // partsCreated.display.grapher_periodicWave_static.draw();
        // // partsCreated.display.grapher_audioScope.start(); //this doesn't hold up well
        // partsCreated.display.grapher_audioScope_static.start();
} );