{{include:*}}

var universalreadout_1 = objects.universalreadout(200, 50);
__globals.panes.middleground.append( universalreadout_1 );

var launchpad_1 = objects.launchpad(300, 50);
__globals.panes.middleground.append( launchpad_1 );

launchpad_1.io.out_0.connectTo(universalreadout_1.io.in);

__globals.utility.workspace.gotoPosition(-514.749, -77.9482, 2.83364, 0);
