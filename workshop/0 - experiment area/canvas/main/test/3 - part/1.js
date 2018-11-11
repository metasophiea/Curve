var temp = canvas.part.builder(
    'rectangle',
    'testRectangle',
    {
        x:10, y:10,
        width:30, height:30,
        style:{
            fill:'rgba(255,0,0,1)'
        }
    }
);
console.log( canvas.core.arrangement.add(canvas.system.pane.mm,temp) );








var temp = canvas.part.builder(
    'group',
    'testGroup',
    {
        x:10, y:10,
    }
);
console.log( canvas.core.arrangement.add(canvas.system.pane.mm,temp) );








var temp = canvas.part.builder(
    'image',
    'testImage',
    {
        x:45, y:10,
        width:30, height:30,
        url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg',
    }
);
console.log( canvas.core.arrangement.add(canvas.system.pane.mm,temp) );








var temp = canvas.part.builder(
    'polygon',
    'testPolygon',
    {
        points:[{x:0,y:0}, {x:10,y:0}, {x:10,y:10}, {x:5,y:20}, {x:0,y:10}],
    }
);
console.log( canvas.core.arrangement.add(canvas.system.pane.mm,temp) );