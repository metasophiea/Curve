__globals.objects = {};
{{include:selectionAreaGenerator.js}}
{{include:objects/*}}/**/






var audioSink_1 = __globals.objects.make_audioSink(25,25);
__globals.panes.middleground.append( audioSink_1 );

var basicSynth_1 = __globals.objects.make_basicSynth(200,25);
__globals.panes.middleground.append( basicSynth_1 );

var launchpad_1 = __globals.objects.makeLaunchpad(500,25);
__globals.panes.middleground.append( launchpad_1 );

var pulseClock_1 = __globals.objects.make_pulseClock(700,25);
__globals.panes.middleground.append( pulseClock_1 );




pulseClock_1.io.out.connectTo(launchpad_1.io.pulseIn);
launchpad_1.io.out.connectTo(basicSynth_1.io.dataIn_midiNote);
basicSynth_1.io.audioOut.connectTo(audioSink_1.io.audio_in);