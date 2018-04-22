{{include:*}}

(function(){


    var testObject_1 = makeTestObject(0,0,true);
    __globals.panes.middleground.append( testObject_1 );
    testObject_1.io.data_a.connectTo(testObject_1.io.data_b);
    testObject_1.io.audio_a.connectTo(testObject_1.io.audio_b);

    var testObject_2 = makeTestObject(400,0);
    __globals.panes.middleground.append( testObject_2 );
    testObject_2.io.data_a.connectTo(testObject_2.io.data_b);
    testObject_2.io.audio_a.connectTo(testObject_2.io.audio_b);

    testObject_1.io.data_main.connectTo(testObject_2.io.data_main);
    
    // __globals.svgElement.goto(-43.2089, 66.601, 4.76838, 0);

})();