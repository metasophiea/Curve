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


