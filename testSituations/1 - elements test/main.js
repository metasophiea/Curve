{{include:*}}

(function(){

    // // //testObject 1
    //     //creating first object, adding to pane, and doing internal connections
    //         var testObject_1 = makeTestObject1(0,0,true);
    //             __globals.panes.middleground.append( testObject_1 );
    //             testObject_1.io.data_a.connectTo(testObject_1.io.data_b);
    //             testObject_1.io.audio_a.connectTo(testObject_1.io.audio_b);
    //
    //     //creating second object, adding to pane, and doing internal connections
    //         var testObject_2 = makeTestObject1(400,0);
    //             __globals.panes.middleground.append( testObject_2 );
    //             testObject_2.io.data_a.connectTo(testObject_2.io.data_b);
    //             testObject_2.io.audio_a.connectTo(testObject_2.io.audio_b);
    //
    //     //connecting first object to second
    //         testObject_1.io.data_main.connectTo(testObject_2.io.data_main);


    //testObject 2
        //creating first object, adding to pane
            var testObject2_1 = makeTestObject2(0,0,true);
            __globals.panes.middleground.append( testObject2_1 );
    
        //creating second object, adding to pane
            var testObject2_2 = makeTestObject2(400,0,true);
            __globals.panes.middleground.append( testObject2_2 );

        //connecting first object to second
            testObject2_1.io.externalData_1.connectTo(testObject2_2.io.externalData_1);



    //auto position viewpoint
        __globals.utility.workspace.gotoPosition(-5327.47, -2284.83, 10, 0);
        // console.log(__globals.utility.workspace.currentPosition());

})();