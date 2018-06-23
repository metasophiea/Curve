__globals.objects = {};
{{include:../selectionAreaGenerator.js}}
{{include:../commonObjects/*}}/**/
{{include:*}}






var audioSink_1 = __globals.objects.make_audioSink(25,25);
__globals.panes.middleground.append( audioSink_1 );

var basicSynth_1 = __globals.objects.make_basicSynth(200,25);
__globals.panes.middleground.append( basicSynth_1 );

var launchpad_1 = __globals.objects.make_launchpad(500,25);
__globals.panes.middleground.append( launchpad_1 );

var pulseClock_1 = __globals.objects.make_pulseClock(700,25);
__globals.panes.middleground.append( pulseClock_1 );

var dataDuplicator_1 = __globals.objects.make_dataDuplicator(200,250);
__globals.panes.middleground.append( dataDuplicator_1 );

var accumulator_1 = __globals.objects.make_accumulator(300,250);
__globals.panes.middleground.append( accumulator_1 );

var selectorSender_1 = __globals.objects.make_selectorSender(100,250);
__globals.panes.middleground.append( selectorSender_1 );

pulseClock_1.io.out.connectTo(launchpad_1.io.pulseIn);
launchpad_1.io.out.connectTo(basicSynth_1.io.midiNote);
basicSynth_1.io.audioOut.connectTo(audioSink_1.io.audio_in);



// __globals.utility.workspace.gotoPosition(-1631.06, -1044.94, 4.59435, 0);