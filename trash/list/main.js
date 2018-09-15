{{include:*}}
var temp = __globals.utility.misc.elementMaker('list',undefined,{x:10, y:10, width:200, height:300});
__globals.utility.workspace.placeAndReturnObject( temp );

var scroll = __globals.utility.misc.elementMaker('slide',undefined,{x:250, y:10, width:30, height:300});
__globals.utility.workspace.placeAndReturnObject( scroll );
scroll.onchange = temp.position;



temp.add('new thing!');
temp.remove(1);