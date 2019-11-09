let groupId_1;
let groupId_2;
let rectangleId_1;
let rectangleId_2;
let rectangleId_3;


core.element.create('group','group_1').then(newId => {
    groupId_1 = newId;
    core.arrangement.append(groupId_1);
    core.element.executeMethod(groupId_1,'unifiedAttribute',[{ x:100, y:100 }]);

    core.element.create('rectangle','rectangle_1').then(newId => {
        rectangleId_1 = newId;
        core.element.executeMethod(groupId_1,'append',[rectangleId_1]);
        core.element.executeMethod(rectangleId_1,'unifiedAttribute',[{ width:30, height:30, colour:{r:1,g:0,b:0,a:1} }]);
    });

    core.element.create('group','group_2').then(newId => {
        groupId_2 = newId;
        core.element.executeMethod(groupId_1,'append',[groupId_2]);
        core.element.executeMethod(groupId_2,'unifiedAttribute',[{ x:50 }]);

        core.element.create('rectangle','rectangle_2').then(newId => {
            rectangleId_2 = newId;
            core.element.executeMethod(groupId_2,'append',[rectangleId_2]);
            core.element.executeMethod(rectangleId_2,'unifiedAttribute',[{ width:30, height:30, colour:{r:0,g:1,b:0,a:1} }]);
        });
        core.element.create('rectangle','rectangle_3').then(newId => {
            rectangleId_3 = newId;
            core.element.executeMethod(groupId_2,'append',[rectangleId_3]);
            core.element.executeMethod(rectangleId_3,'unifiedAttribute',[{ x:50, width:30, height:30, colour:{r:0,g:0,b:1,a:1} }]);
        });
    });
} );


var tick = 0;
setInterval(function(){
    if(groupId_1 != undefined){
        core.element.executeMethod(groupId_1,'angle').then(angle => {
            core.element.executeMethod(groupId_1,'angle',[angle+0.04]);
        });
        core.element.executeMethod(groupId_1,'scale',[1 + 0.5*Math.sin( 2*Math.PI*tick )]);
    }
    if(groupId_2 != undefined){
        core.element.executeMethod(groupId_2,'angle').then(angle => {
            core.element.executeMethod(groupId_2,'angle',[angle+0.04]);
        });
        core.element.executeMethod(groupId_2,'scale',[1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/4 )]);
    }
    if(rectangleId_3 != undefined){
        core.element.executeMethod(rectangleId_3,'angle').then(angle => {
            core.element.executeMethod(rectangleId_3,'angle',[angle+0.04]);
        });
        core.element.executeMethod(rectangleId_3,'scale',[1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/2)]);
    }

    tick += 0.01;
},1000/40);


core.render.active(true);