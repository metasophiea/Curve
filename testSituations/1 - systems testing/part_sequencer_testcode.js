console.log('%cTesting - parts.elements.control.sequencer.noteRegistry', 'font-size:15px; font-weight:bold;');
console.log('%c-- regular use', 'font-weight: bold;');
console.log('%c- adding a note', 'font-weight: bold;');
    var noteRegistry = new parts.elements.control.sequencer.noteRegistry(64, 10, 10);
    noteRegistry.add({ line:0, position:0, length:5, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:0, position:0, length:5, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 0, position: 0, strength: 1},{noteID: 0, line: 0, position: 5, strength: 0}]);

console.log('%c- removing it', 'font-weight: bold;');
    noteRegistry.remove(0);
    tester(noteRegistry.getAllNotes(), [null]);
    tester(noteRegistry.getAllEvents(), [null,null]);

console.log('%c- adding three notes', 'font-weight: bold;');
    noteRegistry.add({ line:0, position:0, length:5, strength:1 });
    noteRegistry.add({ line:1, position:1, length:1, strength:0.5 });
    noteRegistry.add({ line:2, position:2, length:10, strength:0.25 });
    tester(noteRegistry.getAllNotes(), [
        {line:0,position:0,length:5,strength:1},
        {line:1,position:1,length:1,strength:0.5},
        {line:2,position:2,length:10,strength:0.25}
    ]);
    tester(noteRegistry.getAllEvents(), [
        {noteID:0,line:0,position:0,strength:1},{noteID:0,line:0,position:5,strength:0},
        {noteID:1,line:1,position:1,strength:0.5},{noteID:1,line:1,position:2,strength:0},
        {noteID:2,line:2,position:2,strength:0.25},{noteID:2,line:2,position:12,strength:0}
    ]);

console.log('%c- removing the middle one', 'font-weight: bold;');
    noteRegistry.remove(1);
    tester(noteRegistry.getAllNotes(), [
        {line:0,position:0,length:5,strength:1},
        null,
        {line:2,position:2,length:10,strength:0.25}
    ]);
    tester(noteRegistry.getAllEvents(), [
        {noteID:0,line:0,position:0,strength:1},{noteID:0,line:0,position:5,strength:0},
        null,null,
        {noteID:2,line:2,position:2,strength:0.25},{noteID:2,line:2,position:12,strength:0}
    ]);

console.log('%c- adding a note (to be automatically inserted in the middle position)', 'font-weight: bold;');
    noteRegistry.add({ line:4, position:4, length:6, strength:0.75 });
    tester(noteRegistry.getAllNotes(), [
        {line:0,position:0,length:5,strength:1},
        {line:4,position:4,length:6,strength:0.75},
        {line:2,position:2,length:10,strength:0.25}
    ]);
    tester(noteRegistry.getAllEvents(), [
        {noteID:0,line:0,position:0,strength:1},{noteID:0,line:0,position:5,strength:0},
        {noteID:1,line:4,position:4,strength:0.75},{noteID:1,line:4,position:10,strength:0},
        {noteID:2,line:2,position:2,strength:0.25},{noteID:2,line:2,position:12,strength:0}
    ]);

console.log('%c- updating a note', 'font-weight: bold;');
    noteRegistry.update(0,{ line:9, position:50, length:2, strength:0.1 });
    tester(noteRegistry.getAllNotes(), [
        {line:9,position:50,length:2,strength:0.1},
        {line:4,position:4,length:6,strength:0.75},
        {line:2,position:2,length:10,strength:0.25}
    ]);
    tester(noteRegistry.getAllEvents(), [
        {noteID:0,line:9,position:50,strength:0.1},{noteID:0,line:9,position:52,strength:0},
        {noteID:1,line:4,position:4,strength:0.75},{noteID:1,line:4,position:10,strength:0},
        {noteID:2,line:2,position:2,strength:0.25},{noteID:2,line:2,position:12,strength:0}
    ]);

console.log('%c- full reset', 'font-weight: bold;');
    noteRegistry.reset();
    tester(noteRegistry.getAllNotes(), []);
    tester(noteRegistry.getAllEvents(), []);

console.log('%c- getting events', 'font-weight: bold;');
    noteRegistry.add({ line:0, position:0, length:5, strength:1 });
    noteRegistry.add({ line:1, position:1, length:1, strength:0.5 });
    noteRegistry.add({ line:2, position:6, length:10, strength:0.25 });
    tester( noteRegistry.eventsBetween(0,3), [
        {noteID: 0, line: 0, position: 0, strength: 1},
        {noteID: 1, line: 1, position: 1, strength: 0.5},
        {noteID: 1, line: 1, position: 2, strength: 0}
    ]);
    tester( noteRegistry.eventsBetween(16), [
        {noteID: 2, line: 2, position: 16, strength: 0}
    ]);

console.log('%c- import/export', 'font-weight: bold;');
    noteRegistry.import({
        "notes":[
            {"line":9,"position":50,"length":2,"strength":0.1},
            {"line":4,"position":4,"length":6,"strength":0.75},
            {"line":2,"position":2,"length":10,"strength":0.25}
        ],
        "selectedNotes":[],
        "events":[
            {"noteID":0,"line":9,"position":50,"strength":0.1},
            {"noteID":0,"line":9,"position":52,"strength":0},
            {"noteID":1,"line":4,"position":4,"strength":0.75},
            {"noteID":1,"line":4,"position":10,"strength":0},
            {"noteID":2,"line":2,"position":2,"strength":0.25},
            {"noteID":2,"line":2,"position":12,"strength":0}
        ],
        "events_byID":[[0,1],[2,3],[4,5]],
        "events_byPosition":{"2":[4],"4":[2],"10":[3],"12":[5],"50":[0],"52":[1]},
        "positions":[2,12,4,10,50,52]
    });
    tester( noteRegistry.export(), {
        "notes":[
            {"line":9,"position":50,"length":2,"strength":0.1},
            {"line":4,"position":4,"length":6,"strength":0.75},
            {"line":2,"position":2,"length":10,"strength":0.25}
        ],
        "selectedNotes":[],
        "events":[
            {"noteID":0,"line":9,"position":50,"strength":0.1},
            {"noteID":0,"line":9,"position":52,"strength":0},
            {"noteID":1,"line":4,"position":4,"strength":0.75},
            {"noteID":1,"line":4,"position":10,"strength":0},
            {"noteID":2,"line":2,"position":2,"strength":0.25},
            {"noteID":2,"line":2,"position":12,"strength":0}
        ],
        "events_byID":[[0,1],[2,3],[4,5]],
        "events_byPosition":{"2":[4],"4":[2],"10":[3],"12":[5],"50":[0],"52":[1]},
        "positions":[2,12,4,10,50,52]
    });

console.log('%c-- irregular use', 'font-weight: bold;');
    noteRegistry.reset();
    
console.log('%c- adding a note (bad line)', 'font-weight: bold;');
    //(line should clip to a number within the bounds)
    noteRegistry.add({ line:20, position:0, length:5, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:9, position:0, length:5, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 9, position: 0, strength: 1},{noteID: 0, line: 9, position: 5, strength: 0}]);
    noteRegistry.reset();

    noteRegistry.add({ line:-1, position:0, length:5, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:0, position:0, length:5, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line:0, position: 0, strength: 1},{noteID: 0, line:0, position: 5, strength: 0}]);
    noteRegistry.reset();

console.log('%c- adding a note (bad position)', 'font-weight: bold;');
    //(position should clip to a place within the bounds, where there length of the note is also taken into account)
    noteRegistry.add({ line:5, position:100, length:5, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:5, position:59, length:5, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 5, position:59, strength: 1},{noteID: 0, line:5, position:64, strength: 0}]);
    noteRegistry.reset();

    noteRegistry.add({ line:5, position:-1, length:5, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:5, position:0, length:5, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 5, position:0, strength: 1},{noteID: 0, line:5, position:5, strength: 0}]);
    noteRegistry.reset();

console.log('%c- adding a note (bad length)', 'font-weight: bold;');
    //(length should clip to whatever the max is, or at minimum zero)
    noteRegistry.add({ line:5, position:10, length:100, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:5, position:10, length:10, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 5, position:10, strength: 1},{noteID: 0, line:5, position:20, strength: 0}]);
    noteRegistry.reset();

    noteRegistry.add({ line:5, position:10, length:-1, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:5, position:10, length:0, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 5, position:10, strength: 1},{noteID: 0, line:5, position:10, strength: 0}]);
    noteRegistry.reset();

console.log('%c- adding a note (ends beyond boundries)', 'font-weight: bold;');
    //(note should be clipped to fit)
    //too far to the right
    noteRegistry.add({ line:5, position:62, length:8, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:5, position:62, length:2, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line:5, position:62, strength: 1},{noteID: 0, line:5, position:64, strength: 0}]);
    noteRegistry.reset();
    //too far to the left
    noteRegistry.add({ line:5, position:-5, length:8, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:5, position:0, length:8, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line:5, position:0, strength: 1},{noteID: 0, line:5, position:8, strength: 0}]);
    noteRegistry.reset();
    //below last line
    noteRegistry.add({ line:50, position:5, length:8, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:9, position:5, length:8, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID:0, line:9, position:5, strength: 1},{noteID:0, line:9, position:13, strength: 0}]);
    noteRegistry.reset();
    //above top line
    noteRegistry.add({ line:-6, position:5, length:8, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:0, position:5, length:8, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID:0, line:0, position:5, strength: 1},{noteID:0, line:0, position:13, strength: 0}]);
    noteRegistry.reset();

console.log('%c- adding a note (all of the above)', 'font-weight: bold;');
    //(length is limited before the postition is corrected. Line can be corrected in an unrelated way)
    noteRegistry.add({ line:50, position:100, length:100, strength:1 });
    tester(noteRegistry.getAllNotes(), [{line:9, position:54, length:10, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line:9, position:54, strength: 1},{noteID: 0, line:9, position:64, strength: 0}]);
    noteRegistry.reset();

console.log('%c- remove note (note doesn\'t exist)', 'font-weight: bold;');
    //remove should just do nothing
    noteRegistry.add({ line:0, position:0, length:5, strength:1 });
    noteRegistry.add({ line:1, position:1, length:1, strength:0.5 });
    noteRegistry.add({ line:2, position:6, length:10, strength:0.25 });
    noteRegistry.remove(10);
    noteRegistry.remove(-1);
    tester(noteRegistry.getAllNotes(), [
        {line: 0, position: 0, length: 5, strength: 1},
        {line: 1, position: 1, length: 1, strength: 0.5},
        {line: 2, position: 6, length: 10, strength: 0.25},
    ]);
    tester(noteRegistry.getAllEvents(), [
        {noteID: 0, line: 0, position: 0, strength: 1},{noteID: 0, line: 0, position: 5, strength: 0},
        {noteID: 1, line: 1, position: 1, strength: 0.5},{noteID: 1, line: 1, position: 2, strength: 0},
        {noteID: 2, line: 2, position: 6, strength: 0.25},{noteID: 2, line: 2, position: 16, strength: 0},
    ]);

console.log('%c- getting events (out of range)', 'font-weight: bold;');
    //should be pretty straight-forward. Either there are events in the range, or there isn't
    tester( noteRegistry.eventsBetween(100,1000), []);
    tester( noteRegistry.eventsBetween(-100,-1), []);
    tester( noteRegistry.eventsBetween(-100,100), [
        {noteID: 0, line: 0, position: 0, strength: 1},
        {noteID: 1, line: 1, position: 1, strength: 0.5},
        {noteID: 1, line: 1, position: 2, strength: 0},
        {noteID: 0, line: 0, position: 5, strength: 0},
        {noteID: 2, line: 2, position: 6, strength: 0.25},
        {noteID: 2, line: 2, position: 16, strength: 0},
    ]);
    
console.log('%c- updating a note (wrong position)', 'font-weight: bold;');
    //(note should be provented from moving too far to the right)
    var noteRegistry = new parts.elements.control.sequencer.noteRegistry(64, 10, 10);
    noteRegistry.add({ line:0, position:0, length:5, strength:1 });
    noteRegistry.update(0,{position:100});
    tester(noteRegistry.getAllNotes(), [{line:0, position:59, length:5, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 0, position: 59, strength: 1},{noteID: 0, line: 0, position: 64, strength: 0}]);
console.log('%c- updating a note (wrong length)', 'font-weight: bold;');
    //(note should be provented from extending past the right limit)
    var noteRegistry = new parts.elements.control.sequencer.noteRegistry(64, 10);
    noteRegistry.add({ line:0, position:7, length:5, strength:1 });
    noteRegistry.update(0,{length:100});
    tester(noteRegistry.getAllNotes(), [{line:0, position:7, length:57, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 0, position: 7, strength: 1},{noteID: 0, line: 0, position: 64, strength: 0}]);
console.log('%c- updating a note (wrong length and position)', 'font-weight: bold;');
    //(note should be provented from extending past the right limit)
    var noteRegistry = new parts.elements.control.sequencer.noteRegistry(64, 10);
    noteRegistry.add({ line:0, position:7, length:5, strength:1 });
    noteRegistry.update(0,{position:100,length:100});
    tester(noteRegistry.getAllNotes(), [{line:0, position:64, length:0, strength:1}]);
    tester(noteRegistry.getAllEvents(), [{noteID: 0, line: 0, position: 64, strength: 1},{noteID: 0, line: 0, position: 64, strength: 0}]);