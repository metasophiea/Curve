__globals.objects = {};
// {{include:../../../9 - audio effect units/main.js}}
{{include:parts/*}}
{{include:objects/*}}
/**/




// var audioIn = new parts.audio.audioIn(__globals.audio.context);

var audioIn_1 = __globals.objects.make_audioIn(300, 10);
__globals.panes.middleground.append( audioIn_1 );