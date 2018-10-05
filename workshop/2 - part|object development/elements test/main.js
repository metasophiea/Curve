{{include:*}}

//creating first object, adding to pane
    var testObject_1 = system.utility.workspace.placeAndReturnObject( object.testObject(0,0,true) );

//creating second object, adding to pane
    var testObject_2 = system.utility.workspace.placeAndReturnObject( object.testObject(600,0,true) );

//connecting first object to second
    testObject_1.io.externalData_1.connectTo(testObject_2.io.externalData_1);

// auto position viewpoint
    // system.utility.workspace.gotoPosition( -2292.56, -901.214, 3.91813, 0);
//     console.log(system.utility.workspace.currentPosition());