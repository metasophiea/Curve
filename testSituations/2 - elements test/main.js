{{include:*}}

//creating first object, adding to pane
    var testObject_1 = __globals.utility.workspace.placeAndReturnObject( objects.testObject(0,0,true) );

//creating second object, adding to pane
    var testObject_2 = __globals.utility.workspace.placeAndReturnObject( objects.testObject(600,0,true) );

//connecting first object to second
    testObject_1.io.externalData_1.connectTo(testObject_2.io.externalData_1);

// auto position viewpoint
    __globals.utility.workspace.gotoPosition(-1533.02, -2161.7, 8.38412, 0);
//     console.log(__globals.utility.workspace.currentPosition());