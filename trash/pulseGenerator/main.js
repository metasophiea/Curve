{{include:*}}

    var universalreadout_1 = objects.universalreadout(200, 50);
    __globals.panes.middleground.append( universalreadout_1 );

    var pulseGenerator_1 = objects.pulseGenerator(400, 50);
    __globals.panes.middleground.append( pulseGenerator_1 );


__globals.utility.workspace.gotoPosition(-484.407, -18.9664, 2.83364, 0);



pulseGenerator_1.io.out.connectTo( universalreadout_1.io.in );