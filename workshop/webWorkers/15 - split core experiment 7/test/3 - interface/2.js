var partsCreated = {};

_canvas_.interface.go = function(){
    _canvas_.core.render.active(true);
    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(10);

    _canvas_.core.viewport.scale(4);
    _canvas_.core.viewport.position(0,-550);

    //basic
        partsCreated.basic = {};
        _canvas_.interface.part.builder( 'basic', 'group', 'basicGroup', { x:10, y:10 } ).then(basicGroup => {
            partsCreated.basic.basicGroup = basicGroup;
            _canvas_.system.pane.mm.append(basicGroup);

            //rectangle
                _canvas_.interface.part.builder('basic', 'rectangle', 'testRectangle', { 
                    x:5, y:5, width:30, height:30, colour:{r:1,g:0,b:0,a:1}
                }).then(obj => {
                    partsCreated.basic.rectangle = obj;
                    basicGroup.append(obj);
                });
            //circle
                _canvas_.interface.part.builder('basic', 'circle', 'testCircle', { 
                    x:20, y:55, radius:15
                }).then(obj => {
                    partsCreated.basic.circle = obj;
                    basicGroup.append(obj);
                });
            //polygon
                _canvas_.interface.part.builder('basic', 'polygon', 'testPolygon', { 
                    points:[55,5, 70,35, 40,35], colour:{r:0,g:1,b:0,a:1},
                }).then(obj => {
                    partsCreated.basic.polygon = obj;
                    basicGroup.append(obj);
                });
            //path
                _canvas_.interface.part.builder('basic', 'path', 'testPath', { 
                    points:[0,0, 0,90, 2.5,90, 2.5,72.5, 75,72.5], thickness:1.25, jointType:'round', capType:'round',
                }).then(obj => {
                    partsCreated.basic.path = obj;
                    basicGroup.append(obj);
                });
            //image
                _canvas_.interface.part.builder('basic', 'image', 'testImage', { 
                    x:40, y:40, width:30, height:30, url:'/images/testImages/Dore-munchausen-illustration.jpg'
                }).then(obj => {
                    partsCreated.basic.image = obj;
                    basicGroup.append(obj);
                });
            //text
                _canvas_.interface.part.builder('basic', 'text', 'testText', { 
                    x:5, y:75, text:'Hello', height:15, width:70, colour:{r:150/255,g:150/255,b:1,a:1},
                }).then(obj => {
                    partsCreated.basic.text = obj;
                    basicGroup.append(obj);
                });
            //rectangleWithOutline
                _canvas_.interface.part.builder('basic', 'rectangleWithOutline', 'testRectangleWithOutline', { 
                    x:105, y:60, width:30, height:30,
                }).then(obj => {
                    partsCreated.basic.rectangleWithOutline = obj;
                    basicGroup.append(obj);
                });
            //circleWithOutline
                _canvas_.interface.part.builder('basic', 'circleWithOutline', 'testCircleWithOutline', { 
                    x:90, y:70, radius:10,
                }).then(obj => {
                    partsCreated.basic.circleWithOutline = obj;
                    basicGroup.append(obj);
                });
            //polygonWithOutline
                _canvas_.interface.part.builder('basic', 'polygonWithOutline', 'testPolygonWithOutline', { 
                    points:[75,15, 75,55, 115,55], thickness:1, colour:{r:1,g:0,b:0.5,a:1}, lineColour:{r:0,g:0,b:0,a:1},
                }).then(obj => {
                    partsCreated.basic.polygonWithOutline = obj;
                    basicGroup.append(obj);
                });
            //canvas
                _canvas_.interface.part.builder('basic', 'canvas', 'testCanvas', { 
                    x:130, y:5, width:30, height:30,
                }).then(obj => {
                    partsCreated.basic.canvas = obj;
                    basicGroup.append(obj);

                    const $ = partsCreated.basic.canvas.$;
                    partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.9,g:0.9,b:0.9,a:1});
                    partsCreated.basic.canvas._.fillRect($(0),$(0),$(30),$(30));
                    partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
                    partsCreated.basic.canvas._.fillRect($(0),$(0),$(10),$(10));
                    partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.107,g:0.722,b:0.945,a:1});
                    partsCreated.basic.canvas._.fillRect($(20),$(0),$(10),$(10));
                    partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.859,g:0.573,b:0.754,a:1});
                    partsCreated.basic.canvas._.fillRect($(0),$(20),$(10),$(10));
                    partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.754,g:0.859,b:0.573,a:1});
                    partsCreated.basic.canvas._.fillRect($(20),$(20),$(10),$(10));
                    partsCreated.basic.canvas.requestUpdate();
                });
            //clipped group
                _canvas_.interface.part.builder( 'basic', 'group', 'clippingGroup', { x:75, y:5 } ).then(clippingGroup => {
                    partsCreated.basic.clippingGroup = clippingGroup;
                    basicGroup.append(clippingGroup);
                    clippingGroup.clipActive(true);

                    _canvas_.interface.part.builder('basic', 'polygon', 'testPolygon', { 
                        points:[0,0, 50,0, 50,50], 
                    }).then( clippingGroup.stencil );
                    _canvas_.interface.part.builder('basic', 'image', 'clippedImage', { 
                        width:50, height:50, url:'/images/testImages/mikeandbrian.jpg'
                    }).then( clippingGroup.append );
                });
        });
















    //display
        partsCreated.display = {};
        _canvas_.interface.part.builder( 'basic', 'group', 'displayGroup', {x:10, y:150} ).then(displayGroup => {
            partsCreated.display.displayGroup = displayGroup;
            _canvas_.system.pane.mm.append(displayGroup);

            //glowbox
                //the parts
                    _canvas_.interface.part.builder('display', 'glowbox_rectangle', 'test_glowbox_rectangle', {x:0, y:0}).then(obj => {
                        partsCreated.display.glowbox_rectangle = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'glowbox_circle', 'test_glowbox_circle', {x:15, y:45}).then(obj => {
                        partsCreated.display.glowbox_circle = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'glowbox_image', 'test_glowbox_image', {x:0, y:60, glowURL:'/images/testImages/Dore-munchausen-illustration.jpg', dimURL:'/images/testImages/mikeandbrian.jpg'}).then(obj => {
                        partsCreated.display.glowbox_image = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'glowbox_polygon', 'test_glowbox_polygon', {x:0, y:95}).then(obj => {
                        partsCreated.display.glowbox_polygon = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'glowbox_path', 'test_glowbox_path', {x:0, y:130}).then(obj => {
                        partsCreated.display.glowbox_path = obj;
                        displayGroup.append(obj);
                    });
                // //test of functionality
                //     let display_glowbox_state = false;
                //     setInterval(() => {
                //         if(display_glowbox_state){
                //             partsCreated.display.glowbox_rectangle.off();
                //             partsCreated.display.glowbox_circle.off();
                //             partsCreated.display.glowbox_image.off();
                //             partsCreated.display.glowbox_polygon.off();
                //             partsCreated.display.glowbox_path.off();
                //         }else{
                //             partsCreated.display.glowbox_rectangle.on();
                //             partsCreated.display.glowbox_circle.on();
                //             partsCreated.display.glowbox_image.on();
                //             partsCreated.display.glowbox_polygon.on();
                //             partsCreated.display.glowbox_path.on();
                //         }
                //         display_glowbox_state = !display_glowbox_state;
                //     }, 1000);

            //segment displays
                //the parts
                    _canvas_.interface.part.builder('display', 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35, y:0}).then(obj => {
                        partsCreated.display.sevenSegmentDisplay = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'sevenSegmentDisplay', 'test_sevenSegmentDisplay_static', {x:35, y:35,static:true}).then(obj => {
                        partsCreated.display.sevenSegmentDisplay_static = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60, y:0}).then(obj => {
                        partsCreated.display.sixteenSegmentDisplay = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay_static', {x:60, y:35, static:true}).then(obj => {
                        partsCreated.display.sixteenSegmentDisplay_static = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'readout_sevenSegmentDisplay', 'test_readout_sevenSegmentDisplay', {x:85, y:0}).then(obj => {
                        partsCreated.display.readout_sevenSegmentDisplay = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'readout_sevenSegmentDisplay', 'test_readout_sevenSegmentDisplay_static', {x:85, y:35, static:true}).then(obj => {
                        partsCreated.display.readout_sevenSegmentDisplay_static = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:190, y:0}).then(obj => {
                        partsCreated.display.readout_sixteenSegmentDisplay = obj;
                        displayGroup.append(obj);
                    });
                    _canvas_.interface.part.builder('display', 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay_static', {x:190, y:35, static:true}).then(obj => {
                        partsCreated.display.readout_sixteenSegmentDisplay_static = obj;
                        displayGroup.append(obj);
                    });
            //     //test of functionality
            //         let display_sevenSegmentDisplay_state = 0;
            //         let display_sixteenSegmentDisplay_state_index = 0;
            //         let display_sixteenSegmentDisplay_state_glyphs = ['!','?','.',',','\'',':','"','_','-','\\','/','*','#','<','>','(',')','[',']','{','}','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

            //         setInterval(() => {
            //             partsCreated.display.sevenSegmentDisplay.enterCharacter(display_sevenSegmentDisplay_state);
            //             partsCreated.display.sevenSegmentDisplay_static.enterCharacter(display_sevenSegmentDisplay_state);
            //             display_sevenSegmentDisplay_state++;
            //             if(display_sevenSegmentDisplay_state > 9){display_sevenSegmentDisplay_state = 0;}

            //             partsCreated.display.sixteenSegmentDisplay.enterCharacter(display_sixteenSegmentDisplay_state_glyphs[display_sixteenSegmentDisplay_state_index]);
            //             partsCreated.display.sixteenSegmentDisplay_static.enterCharacter(display_sixteenSegmentDisplay_state_glyphs[display_sixteenSegmentDisplay_state_index]);
            //             display_sixteenSegmentDisplay_state_index++;
            //             if(display_sixteenSegmentDisplay_state_index >= display_sixteenSegmentDisplay_state_glyphs.length){display_sixteenSegmentDisplay_state_index = 0;}
            //         },500);

            //         setTimeout(() => {
            //             partsCreated.display.readout_sevenSegmentDisplay.text('1234567890');
            //             partsCreated.display.readout_sevenSegmentDisplay.print('smart');
            //             partsCreated.display.readout_sevenSegmentDisplay_static.text('1234567890');
            //             partsCreated.display.readout_sevenSegmentDisplay_static.print('smart');
            //             partsCreated.display.readout_sixteenSegmentDisplay.text('!?.,\':"_-\\/*#<>()[]{}0123456789abcdefghijklmnopqrstuvwxyz');
            //             partsCreated.display.readout_sixteenSegmentDisplay.print('smart');
            //             partsCreated.display.readout_sixteenSegmentDisplay_static.text('!?.,\':"_-\\/*#<>()[]{}0123456789abcdefghijklmnopqrstuvwxyz');
            //             partsCreated.display.readout_sixteenSegmentDisplay_static.print('smart');
            //         },500);

            // //levels
                // level
                // meter_level
                // audio_meter_level
            //gauge
                // gauge
                // gauge_image
                // meter_gauge
                // meter_gauge_image
            //rastor
                // rastorDisplay
            //grapher
                // grapher
                // grapher_static
                // grapher_periodicWave
                // grapher_periodicWave_static
                // grapher_audioScope
                // grapher_audioScope_static
       });

















    
};