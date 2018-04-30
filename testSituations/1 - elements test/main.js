{{include:*}}

(function(){

    //creating first object, adding to pane, and doing internal connections
        var testObject_1 = makeTestObject(0,0,true);
            __globals.panes.middleground.append( testObject_1 );
            testObject_1.io.data_a.connectTo(testObject_1.io.data_b);
            testObject_1.io.audio_a.connectTo(testObject_1.io.audio_b);

    //creating first object, adding to pane, and doing internal connections
        var testObject_2 = makeTestObject(400,0);
            __globals.panes.middleground.append( testObject_2 );
            testObject_2.io.data_a.connectTo(testObject_2.io.data_b);
            testObject_2.io.audio_a.connectTo(testObject_2.io.audio_b);

    //connecting first object to second
        testObject_1.io.data_main.connectTo(testObject_2.io.data_main);
    
    //auto position viewpoint
        __globals.utility.workspace.gotoPosition(-43.2089, 66.601, 4.76838, 0);
        console.log(__globals.utility.workspace.currentPosition());

})();