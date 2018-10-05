{{include:*}}

var svg_seq = system.utility.workspace.placeAndReturnObject( svg_sequencer(undefined,50,50,1200,200,0) );
svg_seq.addNote(1,1,5,0.5);
for(var a = 0; a < 2000; a++){svg_seq.addNote(10,10,5,0.5);}
var svg_yrange = system.utility.workspace.placeAndReturnObject( part.element.control.rangeslide(undefined,50,40,10,1200,-Math.PI/2) );
svg_yrange.onchange = function(values){svg_seq.viewArea({left:values.start, right:values.end});};
var xrange = system.utility.workspace.placeAndReturnObject( part.element.control.rangeslide(undefined,30,50,10,200,0,0.1) );
xrange.onchange = function(values){svg_seq.viewArea({top:values.start, bottom:values.end});};

// canvas object is still broken, thus this is not a viable option due to rendering speed (when the bug is fixed, I expect this to be much faster)
var canvas_seq = system.utility.workspace.placeAndReturnObject( canvas_sequencer(undefined,50,300,1200,200,0) );
var canvas_yrange = system.utility.workspace.placeAndReturnObject( part.element.control.rangeslide(undefined,50,290,10,1200,-Math.PI/2) );
canvas_yrange.onchange = function(values){canvas_seq.viewArea({left:values.start, right:values.end});};
var xrange = system.utility.workspace.placeAndReturnObject( part.element.control.rangeslide(undefined,30,300,10,200,0,0.1) );
xrange.onchange = function(values){canvas_seq.viewArea({top:values.start, bottom:values.end});};

// system.utility.workspace.gotoPosition(7, -259, 1, 0);