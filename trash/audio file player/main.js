{{include:*}}

var pulseGenerator_1 = objects.pulseGenerator(400, 27.5);
__globals.panes.middleground.append( pulseGenerator_1 );
var oneShot_multi_1 = objects.oneShot_multi(150, 20);
__globals.panes.middleground.append( oneShot_multi_1 );
var audio_sink_1 = objects.audio_sink(20,20);
__globals.panes.middleground.append( audio_sink_1 );


pulseGenerator_1.io.out.connectTo(oneShot_multi_1.io.trigger);
oneShot_multi_1.io.outRight.connectTo( audio_sink_1.io.right );
oneShot_multi_1.io.outLeft.connectTo( audio_sink_1.io.left );


pulseGenerator_1.children.tempo.set(0.1);