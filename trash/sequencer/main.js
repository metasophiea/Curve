{{include:*}}
system.utility.workspace.gotoPosition(45.9492, 71.8586, 3.94055, 0);




var seq = system.utility.workspace.placeAndReturnObject( sequencer(undefined, 10, 10, 300, 100, 0) );

seq.loopActive(true);
seq.loopPeriod(1,63);
setInterval(function(){
    seq.progress();
},100);

seq.addNote(1,1,10);
seq.addNote(4,10,10);

// seq.viewArea(1/64,63/64,1/16,15/16);








var slide = system.utility.workspace.placeAndReturnObject( part.builder('rangeslide','slide',{x:10, y:5, height:300, width:10, angle:-Math.PI/2, handleHeight:0.025}) );
slide.onchange = function(data){ seq.viewArea(data.start,data.end,0,1); };