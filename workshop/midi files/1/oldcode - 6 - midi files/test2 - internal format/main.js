{{include:fileData2MidiConvert2internal.js}}
{{include:../10014.raw}}
{{include:../starshipgroove.raw}}

system.data = {};
system.data.midiTracks = [];
system.data.midiTracks.push(internalizeMidi_v1_MidiConvert(midi_10014));
system.data.midiTracks.push(internalizeMidi_v1_MidiConvert(midi_starshipgroove));

var internalizedMidi = system.data.midiTracks[0];

// {{include:basicPlayback_1.js}}
// {{include:basicPlayback_2.js}}
{{include:basicPlayback_3.js}}


//hacking
// internalizedMidi.control[2].data = 3/4;


{{include:../../5 - HID interaction test/universalReadout.js}}
{{include:../../5 - HID interaction test/synthesizer.js}}
{{include:../../5 - HID interaction test/simpleSynthsizer.js}}
{{include:../../5 - HID interaction test/audioSink.js}}
{{include:../../5 - HID interaction test/dataDuplicator.js}}
{{include:audioCombiner.js}}



var universalReadout_1 = makeUniversalReadout(700,300);
system.pane.middleground.append( universalReadout_1 );

var midiPlayer_1 = makeMidiPlayer(500,50);
system.pane.middleground.append( midiPlayer_1 );

var dataDuplicator_1 = makeDataDuplicator(800,100);
system.pane.middleground.append( dataDuplicator_1 );


var simpleSynthesizer_1 = makeSimpleSynthesizer(200,80);
system.pane.middleground.append( simpleSynthesizer_1 );
var simpleSynthesizer_2 = makeSimpleSynthesizer(200,180);
system.pane.middleground.append( simpleSynthesizer_2 );
var simpleSynthesizer_3 = makeSimpleSynthesizer(200,280);
system.pane.middleground.append( simpleSynthesizer_3 );
var simpleSynthesizer_4 = makeSimpleSynthesizer(200,380);
system.pane.middleground.append( simpleSynthesizer_4 );

var audioCombiner_1 = makeAudioCombiner(50,150);
system.pane.middleground.append( audioCombiner_1 );
var audioCombiner_2 = makeAudioCombiner(20,250);
system.pane.middleground.append( audioCombiner_2 );
var audioCombiner_3 = makeAudioCombiner(90,350);
system.pane.middleground.append( audioCombiner_3 );

var audioSink_1 = makeAudioSink(25,25);
system.pane.middleground.append( audioSink_1 );






simpleSynthesizer_1.io.dataIn_gain.receive('%',0.24);

simpleSynthesizer_2.io.dataIn_gain.receive('%',0.24);
simpleSynthesizer_2.io.dataIn_release.receive('%',0.1);
simpleSynthesizer_2.io.dataIn_type.receive('discrete',1);
simpleSynthesizer_2.io.dataIn_octave.receive('discrete',4);

simpleSynthesizer_3.io.dataIn_gain.receive('%',0.4);
simpleSynthesizer_3.io.dataIn_attack.receive('%',0.1);
simpleSynthesizer_3.io.dataIn_release.receive('%',0.1);
simpleSynthesizer_3.io.dataIn_type.receive('discrete',1);
simpleSynthesizer_3.io.dataIn_octave.receive('discrete',4);

simpleSynthesizer_4.io.dataIn_gain.receive('%',0.24);
simpleSynthesizer_4.io.dataIn_attack.receive('%',0.1);
simpleSynthesizer_4.io.dataIn_release.receive('%',0.1);
simpleSynthesizer_4.io.dataIn_type.receive('discrete',1);
simpleSynthesizer_4.io.dataIn_octave.receive('discrete',5);






midiPlayer_1.io.out[1].connectTo(simpleSynthesizer_1.io.dataIn_midiNote);
midiPlayer_1.io.out[2].connectTo(simpleSynthesizer_2.io.dataIn_midiNote);
midiPlayer_1.io.out[3].connectTo(simpleSynthesizer_3.io.dataIn_midiNote);
    // midiPlayer_1.io.out[3].connectTo(dataDuplicator_1.io.in);
    // dataDuplicator_1.io.out_1.connectTo(simpleSynthesizer_3.io.dataIn_midiNote);
    // dataDuplicator_1.io.out_2.connectTo(universalReadout_1.io.in);
midiPlayer_1.io.out[4].connectTo(simpleSynthesizer_4.io.dataIn_midiNote);

simpleSynthesizer_1.io.audioOut.connectTo(audioCombiner_2.io.in_1);
simpleSynthesizer_2.io.audioOut.connectTo(audioCombiner_2.io.in_2);
simpleSynthesizer_3.io.audioOut.connectTo(audioCombiner_3.io.in_1);
simpleSynthesizer_4.io.audioOut.connectTo(audioCombiner_3.io.in_2);

audioCombiner_2.io.out.connectTo(audioCombiner_1.io.in_1);
audioCombiner_3.io.out.connectTo(audioCombiner_1.io.in_2);

audioCombiner_1.io.out.connectTo(audioSink_1.io.in);