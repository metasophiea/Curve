let dynamicGroup;
function rc(){return {r:Math.random(),g:Math.random(),b:Math.random(),a:1};}

_canvas_.core.meta.go = function(){

    _canvas_.core.element.create('group','dynamicGroup').then(group => {
        dynamicGroup = group;
        group.unifiedAttribute({ heedCamera:true });
        _canvas_.core.arrangement.append(group);



        _canvas_.core.element.create('rectangle','rectangle_1').then(rectangle => {
            rectangle.unifiedAttribute({ width:200, height:20, colour:rc() });
            dynamicGroup.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','rectangle_2').then(rectangle => {
            rectangle.unifiedAttribute({ width:30, height:30, colour:rc() });
            dynamicGroup.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','rectangle_3').then(rectangle => {
            rectangle.unifiedAttribute({ x:30, y:30, width:30, height:30, colour:rc() });
            dynamicGroup.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','rectangle_4').then(rectangle => {
            rectangle.unifiedAttribute({ x:60, y:60, width:30, height:30, colour:rc() });
            dynamicGroup.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','rectangle_5').then(rectangle => {
            rectangle.unifiedAttribute({ x:90, y:90, width:30, height:30, colour:rc() });
            dynamicGroup.append(rectangle);
        });
        _canvas_.core.element.create('rectangle','rectangle_6').then(rectangle => {
            rectangle.unifiedAttribute({ x:120, y:120, width:200, height:20, colour:rc() });
            dynamicGroup.append(rectangle);
        });
    });

    var tick = 0;
    var tickStep = 0.005;
    setInterval(function(){
        var s_1 = ( 1 + Math.sin( Math.PI*tick ) );
        var s_2 = ( 1 + Math.sin( Math.PI*0.5 + Math.PI*tick ) );
    
        _canvas_.core.viewport.scale( 1 + (s_2-0.5) );
        _canvas_.core.viewport.position(s_1*50,s_1*250);
        _canvas_.core.viewport.angle(-s_1);
    
        tick+=tickStep;
    },1000/40);
    
    _canvas_.core.render.active(true);
};