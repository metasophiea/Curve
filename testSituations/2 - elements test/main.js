{{include:*}}

//creating first object, adding to pane
    var testObject_1 = objects.testObject(0,0,true);
    __globals.panes.middleground.append( testObject_1 );

//creating second object, adding to pane
    var testObject_2 = objects.testObject(600,0,true);
    __globals.panes.middleground.append( testObject_2 );

//connecting first object to second
    testObject_1.io.externalData_1.connectTo(testObject_2.io.externalData_1);

//auto position viewpoint
    // __globals.utility.workspace.gotoPosition(-2666.13, -1087.34, 5.17105,0);
    // console.log(__globals.utility.workspace.currentPosition());