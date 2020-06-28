_canvas_.layers.registerFunctionForLayer("control", function(){

    _canvas_.control.viewport.activeRender(true);
    console.log('%cTesting - control.scene', 'font-size:15px; font-weight:bold;');








    console.log('%c- documentUnits', 'font-weight: bold;');
    _canvas_.control.scene.new();
    var unit = _canvas_.interface.unit.collection['test']['testUnit_2']('elementName',0,0,0);
    unit.collection = 'test';
    tester(
        _canvas_.control.scene.documentUnits([unit]),
        [
            {
                position:{x:0,y:0,angle:0},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
        ]
    );
    var unit = _canvas_.interface.unit.collection['test']['testUnit_4']('elementName',10,10,1);
    unit.collection = 'test';
    tester(
        _canvas_.control.scene.documentUnits([unit]),
        [
            {
                position:{x:10,y:10,angle:1},
                details:{collection:"test",model:"testUnit_4"},
                data:{},
                connections:[]
            },
        ]
    );
    var units = [
        _canvas_.control.scene.addUnit(10,150,0,'testUnit_3','test'),
        _canvas_.control.scene.addUnit(150,150,0,'testUnit_3','test'),
    ];
    units[0].io._.test_connectionNode1.connectTo(units[1].io._.test_connectionNode1);
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit: 1,
                        nameOfDestinationUnit: "1",
                        typeAndNameOfDestinationPort: {type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort: {type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
            {
                position:{x:150,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[
                    {
                        indexOfDestinationUnit: 0,
                        nameOfDestinationUnit: "0",
                        typeAndNameOfDestinationPort: {type: "_", name: "test_connectionNode1"},
                        typeAndNameOfSourcePort: {type: "_", name: "test_connectionNode1"},
                    }
                ]
            },
        ]
    );








    console.log('%c- new', 'font-weight: bold;');
    tester(  _canvas_.control.scene.getAllUnits().filter(a => !a._isCable).length, 2 );
    _canvas_.control.scene.new();
    tester(  _canvas_.control.scene.getAllUnits().filter(a => !a._isCable).length, 0 );








    console.log('%c- adding', 'font-weight: bold;');

    console.log('%c-- first unit', 'font-weight: bold;');
    var unit_1 = _canvas_.control.scene.addUnit(10,10,0,'testUnit_2','test');
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:10,angle:0},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
        ]
    );
    tester( _canvas_.control.scene.getUnitByName(0) === unit_1, true );

    console.log('%c-- second unit', 'font-weight: bold;');
    var unit_2 = _canvas_.control.scene.addUnit(200,10,0.1,'testUnit_2','test');
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:10,angle:0},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
            {
                position:{x:200,y:10,angle:0.1},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
        ]
    );
    tester( _canvas_.control.scene.getUnitByName(1) === unit_2, true );








    console.log('%c- removing', 'font-weight: bold;');

    console.log('%c-- first unit', 'font-weight: bold;');
    _canvas_.control.scene.removeUnit(unit_1);
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:200,y:10,angle:0.1},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
        ]
    );
    tester( _canvas_.control.scene.getUnitByName(0), undefined);
    tester( _canvas_.control.scene.getUnitByName(1) === unit_2, true );

    console.log('%c-- second unit', 'font-weight: bold;');
    _canvas_.control.scene.removeUnit(unit_2);
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        []
    );
    tester( _canvas_.control.scene.getUnitByName(0), undefined);
    tester( _canvas_.control.scene.getUnitByName(1), undefined);

    console.log('%c-- second unit again (nothing should happen)', 'font-weight: bold;');
    var errorFound = false;
    try{ _canvas_.control.scene.removeUnit(unit_2); }
    catch(e){ console.log(e); errorFound = true; }
    finally{ tester(errorFound,false); }

    console.log('%c-- this time they\'re connected', 'font-weight: bold;');
    var units = [
        _canvas_.control.scene.addUnit(10,150,0,'testUnit_3','test'),
        _canvas_.control.scene.addUnit(150,150,0,'testUnit_3','test'),
    ];
    units[0].io._.test_connectionNode1.connectTo(units[1].io._.test_connectionNode1);
    _canvas_.control.scene.removeUnit(units[0]);
    tester( units[1].io._.test_connectionNode1.getForeignNode(), null );
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:150,y:150,angle:0},
                details:{collection:"test",model:"testUnit_3"},
                data:{},
                connections:[]
            },
        ]
    );








    console.log('%c- printUnits', 'font-weight: bold;');
    _canvas_.control.scene.new();
    _canvas_.control.scene.printUnits(
        [
            {
                position:{x:10,y:10,angle:0},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
            {
                position:{x:200,y:10,angle:0.1},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
        ],
        undefined,undefined,false
    );
    tester(
        _canvas_.control.scene.documentUnits( _canvas_.control.scene.getAllUnits().filter(a => !a._isCable) ),
        [
            {
                position:{x:10,y:10,angle:0},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
            {
                position:{x:200,y:10,angle:0.1},
                details:{collection:"test",model:"testUnit_2"},
                data:{},
                connections:[]
            },
        ]
    );
    _canvas_.control.scene.getAllUnits().filter(a => !a._isCable).forEach(unit => _canvas_.control.scene.removeUnit(unit));








    console.log('%c- transfering', 'font-weight: bold;');
    _canvas_.control.scene.new();
    var units = [
        _canvas_.control.scene.addUnit(10,150,0,'testUnit_3','test'),
        _canvas_.control.scene.addUnit(150,150,0,'testUnit_3','test'),
    ];
    units[0].io._.test_connectionNode1.connectTo(units[1].io._.test_connectionNode1);

    tester( _canvas_.system.pane.getMiddlegroundPane(units[0]).getAddress(), '/middleground/middle' );
    tester( _canvas_.system.pane.getMiddlegroundPane(units[1]).getAddress(), '/middleground/middle' );
    tester( units[0].io._.test_connectionNode1.getForeignNode().parent.getAddress(), units[1].getAddress() );
    units = _canvas_.control.scene.transferUnits(units,_canvas_.system.pane.mf);
    tester( _canvas_.system.pane.getMiddlegroundPane(units[0]).getAddress(), '/middleground/front' );
    tester( _canvas_.system.pane.getMiddlegroundPane(units[1]).getAddress(), '/middleground/front' );
    tester( units[0].io._.test_connectionNode1.getForeignNode().parent.getAddress(), units[1].getAddress() );

    units.forEach(unit => _canvas_.control.scene.removeUnit(unit));




















    console.log('');
});