let dynamicGroup;
function rc(){return {r:Math.random(),g:Math.random(),b:Math.random(),a:1};}

_canvas_.core.go.add( function(){ 



    dynamicGroup = _canvas_.core.element.create('group','dynamicGroup');
    dynamicGroup.unifiedAttribute({ heedCamera:true });
    _canvas_.core.arrangement.append(dynamicGroup);

        let rectangle_1 = _canvas_.core.element.create('rectangle','test_rectangle_1');
        rectangle_1.unifiedAttribute({ width:200, height:20, colour:rc() });
        dynamicGroup.append(rectangle_1);
        let rectangle_2 = _canvas_.core.element.create('rectangle','test_rectangle_2');
        rectangle_2.unifiedAttribute({ width:30, height:30, colour:rc() });
        dynamicGroup.append(rectangle_2);
        let rectangle_3 = _canvas_.core.element.create('rectangle','test_rectangle_3');
        rectangle_3.unifiedAttribute({ x:30, y:30, width:30, height:30, colour:rc() });
        dynamicGroup.append(rectangle_3);
        let rectangle_4 = _canvas_.core.element.create('rectangle','test_rectangle_4');
        rectangle_4.unifiedAttribute({ x:60, y:60, width:30, height:30, colour:rc() });
        dynamicGroup.append(rectangle_4);
        let rectangle_5 = _canvas_.core.element.create('rectangle','test_rectangle_5');
        rectangle_5.unifiedAttribute({ x:90, y:90, width:30, height:30, colour:rc() });
        dynamicGroup.append(rectangle_5);
        let rectangle_6 = _canvas_.core.element.create('rectangle','test_rectangle_6');
        rectangle_6.unifiedAttribute({ x:120, y:120, width:200, height:20, colour:rc() });
        dynamicGroup.append(rectangle_6);

    let tick = 0;
    let tickStep = 0.005;
    setInterval(function(){
        let s_1 = ( 1 + Math.sin( Math.PI*tick ) );
        let s_2 = ( 1 + Math.sin( Math.PI*0.5 + Math.PI*tick ) );
    
        _canvas_.core.viewport.scale( 1 + (s_2-0.5) );
        _canvas_.core.viewport.position(s_1*50,s_1*250);
        _canvas_.core.viewport.angle(-s_1);
    
        tick+=tickStep;
    },1000/40);
    
    _canvas_.core.render.active(true);
} );