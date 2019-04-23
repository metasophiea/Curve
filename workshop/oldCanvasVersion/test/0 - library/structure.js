console.log('%cTesting - workspace.library.structure.signalRegistry', 'font-size:15px; font-weight:bold;');
    console.log('%c-- regular use', 'font-weight: bold;');
        console.log('%c- adding a signal', 'font-weight: bold;');
            var signalRegistry = new workspace.library.structure.signalRegistry(64, 10, 10);
            signalRegistry.add({ line:0, position:0, length:5, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:0, position:0, length:5, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 0, position: 0, strength: 1},{signalID: 0, line: 0, position: 5, strength: 0}]);

        console.log('%c- removing it', 'font-weight: bold;');
            signalRegistry.remove(0);
            tester(signalRegistry.getAllSignals(), [null]);
            tester(signalRegistry.getAllEvents(), [null,null]);

        console.log('%c- adding three signals', 'font-weight: bold;');
            signalRegistry.add({ line:0, position:0, length:5, strength:1 });
            signalRegistry.add({ line:1, position:1, length:1, strength:0.5 });
            signalRegistry.add({ line:2, position:2, length:10, strength:0.25 });
            tester(signalRegistry.getAllSignals(), [
                {line:0,position:0,length:5,strength:1},
                {line:1,position:1,length:1,strength:0.5},
                {line:2,position:2,length:10,strength:0.25}
            ]);
            tester(signalRegistry.getAllEvents(), [
                {signalID:0,line:0,position:0,strength:1},{signalID:0,line:0,position:5,strength:0},
                {signalID:1,line:1,position:1,strength:0.5},{signalID:1,line:1,position:2,strength:0},
                {signalID:2,line:2,position:2,strength:0.25},{signalID:2,line:2,position:12,strength:0}
            ]);

        console.log('%c- removing the middle one', 'font-weight: bold;');
            signalRegistry.remove(1);
            tester(signalRegistry.getAllSignals(), [
                {line:0,position:0,length:5,strength:1},
                null,
                {line:2,position:2,length:10,strength:0.25}
            ]);
            tester(signalRegistry.getAllEvents(), [
                {signalID:0,line:0,position:0,strength:1},{signalID:0,line:0,position:5,strength:0},
                null,null,
                {signalID:2,line:2,position:2,strength:0.25},{signalID:2,line:2,position:12,strength:0}
            ]);

        console.log('%c- adding a signal (to be automatically inserted in the middle position)', 'font-weight: bold;');
            signalRegistry.add({ line:4, position:4, length:6, strength:0.75 });
            tester(signalRegistry.getAllSignals(), [
                {line:0,position:0,length:5,strength:1},
                {line:4,position:4,length:6,strength:0.75},
                {line:2,position:2,length:10,strength:0.25}
            ]);
            tester(signalRegistry.getAllEvents(), [
                {signalID:0,line:0,position:0,strength:1},{signalID:0,line:0,position:5,strength:0},
                {signalID:1,line:4,position:4,strength:0.75},{signalID:1,line:4,position:10,strength:0},
                {signalID:2,line:2,position:2,strength:0.25},{signalID:2,line:2,position:12,strength:0}
            ]);

        console.log('%c- updating a signal', 'font-weight: bold;');
            signalRegistry.update(0,{ line:9, position:50, length:2, strength:0.1 });
            tester(signalRegistry.getAllSignals(), [
                {line:9,position:50,length:2,strength:0.1},
                {line:4,position:4,length:6,strength:0.75},
                {line:2,position:2,length:10,strength:0.25}
            ]);
            tester(signalRegistry.getAllEvents(), [
                {signalID:0,line:9,position:50,strength:0.1},{signalID:0,line:9,position:52,strength:0},
                {signalID:1,line:4,position:4,strength:0.75},{signalID:1,line:4,position:10,strength:0},
                {signalID:2,line:2,position:2,strength:0.25},{signalID:2,line:2,position:12,strength:0}
            ]);

        console.log('%c- full reset', 'font-weight: bold;');
            signalRegistry.reset();
            tester(signalRegistry.getAllSignals(), []);
            tester(signalRegistry.getAllEvents(), []);

        console.log('%c- getting events', 'font-weight: bold;');
            signalRegistry.add({ line:0, position:0, length:5, strength:1 });
            signalRegistry.add({ line:1, position:1, length:1, strength:0.5 });
            signalRegistry.add({ line:2, position:6, length:10, strength:0.25 });
            tester( signalRegistry.eventsBetween(0,3), [
                {signalID: 0, line: 0, position: 0, strength: 1},
                {signalID: 1, line: 1, position: 1, strength: 0.5},
                {signalID: 1, line: 1, position: 2, strength: 0}
            ]);
            tester( signalRegistry.eventsBetween(16), [
                {signalID: 2, line: 2, position: 16, strength: 0}
            ]);

        console.log('%c- import/export', 'font-weight: bold;');
            signalRegistry.import({
                "signals":[
                    {"line":9,"position":50,"length":2,"strength":0.1},
                    {"line":4,"position":4,"length":6,"strength":0.75},
                    {"line":2,"position":2,"length":10,"strength":0.25}
                ],
                "selectedSignals":[],
                "events":[
                    {"signalID":0,"line":9,"position":50,"strength":0.1},
                    {"signalID":0,"line":9,"position":52,"strength":0},
                    {"signalID":1,"line":4,"position":4,"strength":0.75},
                    {"signalID":1,"line":4,"position":10,"strength":0},
                    {"signalID":2,"line":2,"position":2,"strength":0.25},
                    {"signalID":2,"line":2,"position":12,"strength":0}
                ],
                "events_byID":[[0,1],[2,3],[4,5]],
                "events_byPosition":{"2":[4],"4":[2],"10":[3],"12":[5],"50":[0],"52":[1]},
                "positions":[2,12,4,10,50,52]
            });
            tester( signalRegistry.export(), {
                "signals":[
                    {"line":9,"position":50,"length":2,"strength":0.1},
                    {"line":4,"position":4,"length":6,"strength":0.75},
                    {"line":2,"position":2,"length":10,"strength":0.25}
                ],
                "selectedSignals":[],
                "events":[
                    {"signalID":0,"line":9,"position":50,"strength":0.1},
                    {"signalID":0,"line":9,"position":52,"strength":0},
                    {"signalID":1,"line":4,"position":4,"strength":0.75},
                    {"signalID":1,"line":4,"position":10,"strength":0},
                    {"signalID":2,"line":2,"position":2,"strength":0.25},
                    {"signalID":2,"line":2,"position":12,"strength":0}
                ],
                "events_byID":[[0,1],[2,3],[4,5]],
                "events_byPosition":{"2":[4],"4":[2],"10":[3],"12":[5],"50":[0],"52":[1]},
                "positions":[2,12,4,10,50,52]
            });

    console.log('%c-- irregular use', 'font-weight: bold;');
        signalRegistry.reset();
            
        console.log('%c- adding a signal (bad line)', 'font-weight: bold;');
            //(line should clip to a number within the bounds)
            signalRegistry.add({ line:20, position:0, length:5, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:9, position:0, length:5, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 9, position: 0, strength: 1},{signalID: 0, line: 9, position: 5, strength: 0}]);
            signalRegistry.reset();

            signalRegistry.add({ line:-1, position:0, length:5, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:0, position:0, length:5, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line:0, position: 0, strength: 1},{signalID: 0, line:0, position: 5, strength: 0}]);
            signalRegistry.reset();

        console.log('%c- adding a signal (bad position)', 'font-weight: bold;');
            //(position should clip to a place within the bounds, where there length of the signal is also taken into account)
            signalRegistry.add({ line:5, position:100, length:5, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:5, position:59, length:5, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 5, position:59, strength: 1},{signalID: 0, line:5, position:64, strength: 0}]);
            signalRegistry.reset();

            signalRegistry.add({ line:5, position:-1, length:5, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:5, position:0, length:5, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 5, position:0, strength: 1},{signalID: 0, line:5, position:5, strength: 0}]);
            signalRegistry.reset();

        console.log('%c- adding a signal (bad length)', 'font-weight: bold;');
            //(length should clip to whatever the max is, or at minimum zero)
            signalRegistry.add({ line:5, position:10, length:100, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:5, position:10, length:10, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 5, position:10, strength: 1},{signalID: 0, line:5, position:20, strength: 0}]);
            signalRegistry.reset();

            signalRegistry.add({ line:5, position:10, length:-1, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:5, position:10, length:0, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 5, position:10, strength: 1},{signalID: 0, line:5, position:10, strength: 0}]);
            signalRegistry.reset();

        console.log('%c- adding a signal (ends beyond boundries)', 'font-weight: bold;');
            //(signal should be clipped to fit)
            //too far to the right
            signalRegistry.add({ line:5, position:62, length:8, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:5, position:62, length:2, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line:5, position:62, strength: 1},{signalID: 0, line:5, position:64, strength: 0}]);
            signalRegistry.reset();
            //too far to the left
            signalRegistry.add({ line:5, position:-5, length:8, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:5, position:0, length:8, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line:5, position:0, strength: 1},{signalID: 0, line:5, position:8, strength: 0}]);
            signalRegistry.reset();
            //below last line
            signalRegistry.add({ line:50, position:5, length:8, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:9, position:5, length:8, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID:0, line:9, position:5, strength: 1},{signalID:0, line:9, position:13, strength: 0}]);
            signalRegistry.reset();
            //above top line
            signalRegistry.add({ line:-6, position:5, length:8, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:0, position:5, length:8, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID:0, line:0, position:5, strength: 1},{signalID:0, line:0, position:13, strength: 0}]);
            signalRegistry.reset();

        console.log('%c- adding a signal (all of the above)', 'font-weight: bold;');
            //(length is limited before the postition is corrected. Line can be corrected in an unrelated way)
            signalRegistry.add({ line:50, position:100, length:100, strength:1 });
            tester(signalRegistry.getAllSignals(), [{line:9, position:54, length:10, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line:9, position:54, strength: 1},{signalID: 0, line:9, position:64, strength: 0}]);
            signalRegistry.reset();

        console.log('%c- remove signal (signal doesn\'t exist)', 'font-weight: bold;');
            //remove should just do nothing
            signalRegistry.add({ line:0, position:0, length:5, strength:1 });
            signalRegistry.add({ line:1, position:1, length:1, strength:0.5 });
            signalRegistry.add({ line:2, position:6, length:10, strength:0.25 });
            signalRegistry.remove(10);
            signalRegistry.remove(-1);
            tester(signalRegistry.getAllSignals(), [
                {line: 0, position: 0, length: 5, strength: 1},
                {line: 1, position: 1, length: 1, strength: 0.5},
                {line: 2, position: 6, length: 10, strength: 0.25},
            ]);
            tester(signalRegistry.getAllEvents(), [
                {signalID: 0, line: 0, position: 0, strength: 1},{signalID: 0, line: 0, position: 5, strength: 0},
                {signalID: 1, line: 1, position: 1, strength: 0.5},{signalID: 1, line: 1, position: 2, strength: 0},
                {signalID: 2, line: 2, position: 6, strength: 0.25},{signalID: 2, line: 2, position: 16, strength: 0},
            ]);

        console.log('%c- getting events (out of range)', 'font-weight: bold;');
            //should be pretty straight-forward. Either there are events in the range, or there isn't
            tester( signalRegistry.eventsBetween(100,1000), []);
            tester( signalRegistry.eventsBetween(-100,-1), []);
            tester( signalRegistry.eventsBetween(-100,100), [
                {signalID: 0, line: 0, position: 0, strength: 1},
                {signalID: 1, line: 1, position: 1, strength: 0.5},
                {signalID: 1, line: 1, position: 2, strength: 0},
                {signalID: 0, line: 0, position: 5, strength: 0},
                {signalID: 2, line: 2, position: 6, strength: 0.25},
                {signalID: 2, line: 2, position: 16, strength: 0},
            ]);
            
        console.log('%c- updating a signal (wrong position)', 'font-weight: bold;');
            //(signal should be provented from moving too far to the right)
            var signalRegistry = new workspace.library.structure.signalRegistry(64, 10, 10);
            signalRegistry.add({ line:0, position:0, length:5, strength:1 });
            signalRegistry.update(0,{position:100});
            tester(signalRegistry.getAllSignals(), [{line:0, position:59, length:5, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 0, position: 59, strength: 1},{signalID: 0, line: 0, position: 64, strength: 0}]);
        console.log('%c- updating a signal (wrong length)', 'font-weight: bold;');
            //(signal should be provented from extending past the right limit)
            var signalRegistry = new workspace.library.structure.signalRegistry(64, 10);
            signalRegistry.add({ line:0, position:7, length:5, strength:1 });
            signalRegistry.update(0,{length:100});
            tester(signalRegistry.getAllSignals(), [{line:0, position:7, length:57, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 0, position: 7, strength: 1},{signalID: 0, line: 0, position: 64, strength: 0}]);
        console.log('%c- updating a signal (wrong length and position)', 'font-weight: bold;');
            //(signal should be provented from extending past the right limit)
            var signalRegistry = new workspace.library.structure.signalRegistry(64, 10);
            signalRegistry.add({ line:0, position:7, length:5, strength:1 });
            signalRegistry.update(0,{position:100,length:100});
            tester(signalRegistry.getAllSignals(), [{line:0, position:64, length:0, strength:1}]);
            tester(signalRegistry.getAllEvents(), [{signalID: 0, line: 0, position: 64, strength: 1},{signalID: 0, line: 0, position: 64, strength: 0}]);