let dynamicGroup;


core.element.create('group','dynamicGroup').then(newId => {
    dynamicGroup = newId;
    core.arrangement.append(dynamicGroup);
    core.element.executeMethod(dynamicGroup,'heedCamera',[true]);

    core.element.create('rectangle','rectangle_1').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ width:200, height:20, colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1} }]);
    });
    core.element.create('rectangle','rectangle_2').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ width:30, height:30, colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1} }]);
    });
    core.element.create('rectangle','rectangle_3').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:30, y:30, width:30, height:30, colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1} }]);
    });
    core.element.create('rectangle','rectangle_4').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:60, y:60, width:30, height:30, colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1} }]);
    });
    core.element.create('rectangle','rectangle_5').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:90, y:90, width:30, height:30, colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1} }]);
    });
    core.element.create('rectangle','rectangle_6').then(newId => {
        core.element.executeMethod(dynamicGroup,'append',[newId]);
        core.element.executeMethod(newId,'unifiedAttribute',[{ x:120, y:120, width:200, height:20, colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1} }]);
    });
});






core.viewport.position(15,15);

var tick = 0;
var tickStep = 0.02/4;

setInterval(function(){
    var s_1 = ( 1 + Math.sin( Math.PI*tick ) );
    var s_2 = ( 1 + Math.sin( Math.PI*0.5 + Math.PI*tick ) );

    core.viewport.scale( 1 + (s_2-0.5) );
    core.viewport.position(s_1*50,s_1*250);
    core.viewport.angle(-s_1);

    tick+=tickStep;
},1000/40);
core.viewport.angle(-Math.PI/4);

core.render.active(true);