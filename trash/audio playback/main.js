{{include:*}}

    var oneShot_single_1 = objects.oneShot_single(400,50);
    __globals.panes.middleground.append( oneShot_single_1 );
    __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:82.5, text:'oneShot_single'}) );
    
    var oneShot_multi_1 = objects.oneShot_multi(400,110);
    __globals.panes.middleground.append( oneShot_multi_1 );
    __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:142.5, text:'oneShot_multi'}) );
    
    var looper_1 = objects.looper(400,170);
    __globals.panes.middleground.append( looper_1 );
    __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:202.5, text:'looper'}) );

    var player_1 = objects.player(400,230);
    __globals.panes.middleground.append( player_1 );
    __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:262.5, text:'player'}) );

    var oneShot_multi_multiTrack_1 = objects.oneShot_multi_multiTrack(400,315);
    __globals.panes.middleground.append( oneShot_multi_multiTrack_1 );
    __globals.panes.background.append( __globals.utility.experimental.elementMaker('label','',{x:640, y:347.5, text:'oneShot_multi_multiTrack_1'}) );

__globals.utility.workspace.gotoPosition(-41.0367, -145.789, 0.903743, 0);










    // var audio_scope_1 = objects.audio_scope(150,50);
    // __globals.panes.middleground.append( audio_scope_1 );
    // looper_1.io.outRight.connectTo(audio_scope_1.io.input);