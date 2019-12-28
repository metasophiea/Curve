this.character = function(_name){
    genericElementProxy.call(this,'character',_name);

    Object.entries({
        colour: {r:1,g:0,b:0,a:1},
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
        font: 'defaultThin',
        character: '',
        printingMode: { horizontal:'left', vertical:'bottom' },
    }).forEach(([name,defaultValue]) => this.setupSimpleAttribute(name,defaultValue) );
};