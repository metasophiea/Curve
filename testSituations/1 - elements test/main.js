{{include:*}}

(function(){


    var testObject_1 = makeTestObject(0,0);
    __globals.panes.middleground.append( testObject_1 );
    testObject_1.children.connectionNode_data_a.connectTo(testObject_1.children.connectionNode_data_b);
    testObject_1.children.connectionNode_audio_a.connectTo(testObject_1.children.connectionNode_audio_b);

    var testObject_2 = makeTestObject(400,0);
    __globals.panes.middleground.append( testObject_2 );
    testObject_2.children.connectionNode_data_a.connectTo(testObject_2.children.connectionNode_data_b);
    testObject_2.children.connectionNode_audio_a.connectTo(testObject_2.children.connectionNode_audio_b);

    testObject_1.children.connectionNode_data_main.connectTo(testObject_2.children.connectionNode_data_main);

    
    // __globals.svgElement.goto(-43.2089, 66.601, 4.76838, 0);

})();