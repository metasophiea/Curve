_canvas_.layers.registerFunctionForLayer("control", function(){

    _canvas_.control.viewport.activeRender(true);













    console.log('%cTesting - control.actionRegistry', 'font-size:15px; font-weight:bold;');

    console.log('%c- scene.addUnit', 'font-weight: bold;');
    _canvas_.control.scene.new();
    _canvas_.control.actionRegistry.clearRegistry();
    var unit_1 = _canvas_.control.scene.addUnit(10,15,0,'testUnit_2','test');
    tester(
        _canvas_.control.actionRegistry.printRegistry(),
        {
            actionPointer:0, 
            actionRegistry:[ 
                {
                    functionName:"control.scene.addUnit", 
                    arguments:[10,15,0,"testUnit_2","test",undefined,true,'/middleground/middle'], 
                    name:"0"
                } 
            ],
            actionRegistrationActive:true
        }
    );

    console.log('%c-- first undo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.undo();
    tester( _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ), [] );

    console.log('%c-- second undo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.undo();
    tester( _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ), [] );

    console.log('%c-- first redo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.redo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
        ]
    );

    console.log('%c-- second redo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.redo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
        ]
    );
    console.log('');








    console.log('%c- scene.removeUnit', 'font-weight: bold;');
    _canvas_.control.scene.new();
    var unit_1 = _canvas_.control.scene.addUnit(10,15,0,'testUnit_3','test');
    var unit_2 = _canvas_.control.scene.addUnit(10,150,0,'testUnit_3','test');
    unit_1.io._.test_connectionNode1.connectTo(unit_2.io._.test_connectionNode1);

    _canvas_.control.actionRegistry.clearRegistry();

    _canvas_.control.scene.removeUnit(unit_1);
    _canvas_.control.scene.removeUnit(unit_2);

    console.log('%c-- first undo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.undo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[]
            },
        ]
    );

    console.log('%c-- second undo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.undo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:1,
                        nameOfDestinationUnit:"0",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:0,
                        nameOfDestinationUnit:"1",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
        ]
    );

    console.log('%c-- first redo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.redo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[]
            },
        ]
    );

    console.log('%c-- second redo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.redo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        []
    );
    console.log('');








    console.log('%c- selection.delete', 'font-weight: bold;');
    _canvas_.control.scene.new();
    var unit_1 = _canvas_.control.scene.addUnit(10,15,0,'testUnit_3','test');
    var unit_2 = _canvas_.control.scene.addUnit(10,150,0,'testUnit_3','test');
    unit_1.io._.test_connectionNode1.connectTo(unit_2.io._.test_connectionNode1);
    _canvas_.control.actionRegistry.clearRegistry();

    _canvas_.control.selection.selectEverything();
    _canvas_.control.selection.delete();

    console.log('%c-- first undo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.undo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:1,
                        nameOfDestinationUnit:"0",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:0,
                        nameOfDestinationUnit:"1",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
        ]
    );
    console.log('%c-- second undo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.undo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:1,
                        nameOfDestinationUnit:"0",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:0,
                        nameOfDestinationUnit:"1",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
        ]
    );
    console.log('%c-- first redo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.redo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        []
    );

    console.log('%c-- second redo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.redo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        []
    );
    console.log('');








    console.log('%c- selection.duplicate', 'font-weight: bold;');
    _canvas_.control.scene.new();
    var unit_1 = _canvas_.control.scene.addUnit(10,15,0,'testUnit_3','test');
    var unit_2 = _canvas_.control.scene.addUnit(10,150,0,'testUnit_3','test');
    unit_1.io._.test_connectionNode1.connectTo(unit_2.io._.test_connectionNode1);
    _canvas_.control.actionRegistry.clearRegistry();

    _canvas_.control.selection.selectEverything();
    _canvas_.control.selection.duplicate();

    console.log('%c-- first undo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.undo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:1,
                        nameOfDestinationUnit:"1",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:0,
                        nameOfDestinationUnit:"0",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
        ]
    );
    console.log('%c-- second undo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.undo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:1,
                        nameOfDestinationUnit:"1",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:0,
                        nameOfDestinationUnit:"0",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
        ]
    );
    console.log('%c-- first redo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.redo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:1,
                        nameOfDestinationUnit:"1",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:0,
                        nameOfDestinationUnit:"0",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:110.06624603271484,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:3,
                        nameOfDestinationUnit:"5",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:110.06624603271484,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:2,
                        nameOfDestinationUnit:"4",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
        ]
    );

    console.log('%c-- second redo', 'font-weight: bold;');
    _canvas_.control.actionRegistry.redo();
    tester( 
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:1,
                        nameOfDestinationUnit:"1",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:0,
                        nameOfDestinationUnit:"0",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:110.06624603271484,y:15,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:3,
                        nameOfDestinationUnit:"5",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:110.06624603271484,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit:2,
                        nameOfDestinationUnit:"4",
                        typeAndNameOfDestinationPort:{type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort:{type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
        ]
    );

});