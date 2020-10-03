this.RectangleWithOutline = function(_name){
    genericElement.call(this,'RectangleWithOutline',_name);

    Object.entries({
        colour: {r:1,g:0,b:0,a:1},
        lineColour: {r:1,g:0,b:0,a:1},
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
        thickness: 0,
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );
};