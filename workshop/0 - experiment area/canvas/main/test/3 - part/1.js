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
canvas.system.pane.mm.append( temp );








var g = canvas.part.builder(
    'group',
    'testGroup',
    {
        x:100, y:10, angle:0.3,
    }
);
canvas.system.pane.mm.append( g );








var temp = canvas.part.builder(
    'image',
    'testImage',
    {
        x:45, y:10,
        width:30, height:30,
        url:'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg',
    }
);
canvas.system.pane.mm.append( temp );








var temp = canvas.part.builder(
    'circle',
    'testCircle',
    {
        x:0, y:0,
    }
);
g.append( temp );
var temp = canvas.part.builder(
    'circle',
    'testCircle2',
    {
        x:100, y:0, r:10,
    }
);
g.append( temp );







var temp = canvas.part.builder(
    'polygon',
    'testPolygon',
    {
        points:[{x:0,y:0}, {x:10,y:0}, {x:10,y:10}, {x:5,y:20}, {x:0,y:10}],
    }
);
canvas.system.pane.mm.append( temp );
// var temp = canvas.part.builder(
//     'advancedPolygon',
//     'testPolygon2',
//     {
//         points:[{x:100,y:10}, {x:200,y:10}, {x:200,y:110}, {type:'arc', x1:200,y1:210, x2:150,y2:210, r:50}, {x:100,y:110}],
//     }
// );
// canvas.system.pane.mm.append( temp );








var temp = canvas.part.builder(
    'text',
    'testText',
    {
        x:10, y:100, text:'Hello'
    }
);
canvas.system.pane.mm.append( temp );