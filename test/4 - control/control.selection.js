_canvas_.layers.registerFunctionForLayer("control", function(){
    
    _canvas_.control.viewport.activeRender(true);
    var unit_1;
    var unit_2;
    var unit_3;
    var unit_4;
    function resetScene(){
        _canvas_.control.scene.new();
        _canvas_.control.selection.clearClipboard();
        _canvas_.control.selection.deselectEverything();
        unit_1 = _canvas_.control.scene.addUnit(10,10,0,'testUnit_2','test');
        unit_2 = _canvas_.control.scene.addUnit(200,10,0.1,'testUnit_2','test');
        unit_3 = _canvas_.control.scene.addUnit(10,150,0,'testUnit_3','test');
        unit_4 = _canvas_.control.scene.addUnit(150,150,0,'testUnit_3','test');
        unit_3.io._.test_connectionNode1.connectTo(unit_4.io._.test_connectionNode1);
    }
    resetScene();



    console.log('%cTesting - control.selection', 'font-size:15px; font-weight:bold;');

    console.log('%c- selecting', 'font-weight: bold;');
    console.log('%c-- select unit', 'font-weight: bold;');
    _canvas_.control.selection.selectUnit(unit_1);
    tester( _canvas_.control.selection.selectedUnits[0] == unit_1, true );

    console.log('%c-- select another unit', 'font-weight: bold;');
    _canvas_.control.selection.selectUnit(unit_2);
    tester( 
        _canvas_.control.selection.selectedUnits[0] == unit_1 && 
        _canvas_.control.selection.selectedUnits[1] == unit_2, true
    );

    console.log('%c-- deselect everything', 'font-weight: bold;');
    _canvas_.control.selection.deselectEverything();
    tester( _canvas_.control.selection.selectedUnits.length, 0 );

    console.log('%c-- select units', 'font-weight: bold;');
    _canvas_.control.selection.selectUnits([unit_1,unit_2]);
    tester( 
        _canvas_.control.selection.selectedUnits[0] == unit_1 && 
        _canvas_.control.selection.selectedUnits[1] == unit_2, 
        true
    );

    console.log('%c-- deselect unit', 'font-weight: bold;');
    _canvas_.control.selection.deselectUnit(unit_1);
    tester( _canvas_.control.selection.selectedUnits[0] == unit_2, true );

    console.log('%c-- select everything', 'font-weight: bold;');
    _canvas_.control.selection.deselectEverything();
    _canvas_.control.selection.selectEverything();
    tester( 
        _canvas_.control.selection.selectedUnits[0] == unit_3 && 
        _canvas_.control.selection.selectedUnits[1] == unit_4 && 
        _canvas_.control.selection.selectedUnits[2] == unit_1 && 
        _canvas_.control.selection.selectedUnits[3] == unit_2, 
        true
    );
    _canvas_.control.selection.deselectEverything();
    console.log('');










    console.log('%c- cut/copy/paste/duplicate/delete', 'font-weight: bold;');
    console.log('%c-- cut', 'font-weight: bold;');
    resetScene();
    console.log('%c--- cut 1 unit', 'font-weight: bold;');
    _canvas_.control.selection.selectUnit(unit_1);
    _canvas_.control.selection.cut();
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:200,y:10,angle:0.1},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]
            },
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:"3",indexOfDestinationUnit:2,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]
            },{
                position:{x:150,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:"2",indexOfDestinationUnit:1,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]
            },
        ]
    );
    tester(
        _canvas_.control.selection.clipboard,
        [{position:{x:10,y:10,angle:0},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]}]
    );
    console.log('%c--- cut 2 units', 'font-weight: bold;');
    _canvas_.control.selection.selectUnits([unit_3,unit_4]);
    _canvas_.control.selection.cut();
    tester(
        _canvas_.control.selection.clipboard,
        [
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:undefined,indexOfDestinationUnit:1,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]
            },{
                position:{x:150,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:undefined,indexOfDestinationUnit:0,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]
            }
        ]
    );
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [{position:{x:200,y:10,angle:0.1},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]}]
    );



    console.log('%c-- paste', 'font-weight: bold;');
    resetScene();
    _canvas_.control.selection.selectUnit(unit_1);
    _canvas_.control.selection.cut();

    _canvas_.control.selection.paste({x:0,y:0});
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {position:{x:200,y:10,angle:0.1},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]},
            {position:{x:10,y:150,angle:0},details:{collection:"test",model:"testUnit_3"},data:{},connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:"3",indexOfDestinationUnit:2,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]},
            {position:{x:150,y:150,angle:0},details:{collection:"test",model:"testUnit_3"},data:{},connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:"2",indexOfDestinationUnit:1,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]},
            {position:{x:0,y:0,angle:0},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]}]
    );

    console.log('%c-- copy', 'font-weight: bold;');
    resetScene();
    _canvas_.control.selection.selectUnit(unit_1);
    _canvas_.control.selection.copy();
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {position:{x:200,y:10,angle:0.1},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]},
            {position:{x:10,y:150,angle:0},details:{collection:"test",model:"testUnit_3"},data:{},connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:"3",indexOfDestinationUnit:2,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]},
            {position:{x:150,y:150,angle:0},details:{collection:"test",model:"testUnit_3"},data:{},connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:"2",indexOfDestinationUnit:1,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]},
            {position:{x:10,y:10,angle:0},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]}]
    );
    tester(
        _canvas_.control.selection.clipboard,
        [{position:{x:10,y:10,angle:0},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]}]
    );

    console.log('%c-- duplicate', 'font-weight: bold;');
    resetScene();
    _canvas_.control.selection.selectUnit(unit_1);
    _canvas_.control.selection.duplicate();
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [        
            {position:{x:200,y:10,angle:0.1},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]},
            {position:{x:10,y:150,angle:0},details:{collection:"test",model:"testUnit_3"},data:{},connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:"3",indexOfDestinationUnit:2,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]},
            {position:{x:150,y:150,angle:0},details:{collection:"test",model:"testUnit_3"},data:{},connections:[{typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},nameOfDestinationUnit:"2",indexOfDestinationUnit:1,typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}}]},
            {position:{x:10,y:10,angle:0},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]},
            {position:{x:9.99329196736305,y:-90.0293251853632,angle:0},details:{collection:"test",model:"testUnit_2"},data:{},connections:[]}]
    );

    console.log('%c-- delete', 'font-weight: bold;');
    resetScene();
    _canvas_.control.selection.selectUnit(unit_1);
    _canvas_.control.selection.delete();
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:200,y:10,angle:0.1},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},
                        nameOfDestinationUnit:"3",
                        indexOfDestinationUnit:2,
                        typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}
                    }
                ]
            },{
                position:{x:150,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        typeAndNameOfSourcePort:{type:"_",name:"test_connectionNode1"},
                        nameOfDestinationUnit:"2",
                        indexOfDestinationUnit:1,
                        typeAndNameOfDestinationPort:{type:"_",name:"test_connectionNode1"}
                    }
                ]
            },
        ]
    );


















    console.log('');
});