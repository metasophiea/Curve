{{include:sequencer.js}}

var seq = system.utility.workspace.placeAndReturnObject( 
    sequencer(undefined, 10, 10, 300, 100, 0)
);

system.utility.workspace.gotoPosition(-12.179, -23.4097, 3.94053, 0);

seq.addNote(0,0,10, 10/10);
seq.addNote(1,1,10, 9/10);
seq.addNote(2,2,10, 8/10);
seq.addNote(3,3,10, 7/10);
seq.addNote(4,4,10, 6/10);
seq.addNote(5,5,10, 5/10);
seq.addNote(6,6,10, 4/10);
seq.addNote(7,7,10, 3/10);
seq.addNote(8,8,10, 2/10);
seq.addNote(9,9,10, 1/10);
seq.addNote(10,10,10,  0);