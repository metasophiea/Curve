// {{include:*}}
// {{include:../../../midiLoader/0.0.1/midiLoader.js}}
// __globals.audio.midiLoader = midiLoader;

// // (function(){

//     // console.log( midiLoader._testData() );
//     // var midiSender = new parts.dynamic.midiSender();
//     // midiSender.noteOn = function(data){console.log('start note:', data.noteNumber);}
//     // midiSender.noteOff = function(data){console.log('stop note:', data.noteNumber);}
//     // midiSender.test_1();
//     // console.log();
//     // midiSender.test_2();
//     // midiSender.openFile_test();

//     var midiTestProducer_1 = makeMidiTestProducer(300,10);
//     __globals.panes.middleground.append( midiTestProducer_1 );
//     var universalReadout_1 = makeUniversalReadout(500,10);
//     __globals.panes.middleground.append( universalReadout_1 );

//     midiTestProducer_1.io.out.connectTo(universalReadout_1.io.in);






//     var simpleMidiSynthsizer_1 = makeSimpleMidiSynthsizer(100,350);
//     __globals.panes.middleground.append( simpleMidiSynthsizer_1 );

// // })();