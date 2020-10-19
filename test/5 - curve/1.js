_canvas_.layers.registerFunctionForLayer("curve", function(){
    // _canvas_.control.scene.addUnit(10,-135,0,'distortion','alpha');
    // _canvas_.control.scene.addUnit(-145,-170,0,'reverb','alpha');
    // _canvas_.control.scene.addUnit(-180,240,0,'filter','alpha');

    // _canvas_.control.scene.addUnit(160,85,0,'musicalKeyboard','alpha');
    // _canvas_.control.scene.addUnit(175,-95,0,'audio_in','alpha');
    // _canvas_.control.scene.addUnit(140,-115,0,'signal_switch','alpha');
    // _canvas_.control.scene.addUnit(-235,240,0,'voltage_dial','alpha');

    // _canvas_.control.scene.addUnit(500,30,0,'signal_duplicator','alpha');
    // _canvas_.control.scene.addUnit(385,30,0,'voltage_duplicator','alpha');
    // _canvas_.control.scene.addUnit(435,-35,0,'data_duplicator','alpha');
    // _canvas_.control.scene.addUnit(360,-90,0,'audio_duplicator','alpha');
    // _canvas_.control.scene.addUnit(445,30,0,'signal_combiner','alpha');
    // _canvas_.control.scene.addUnit(330,30,0,'voltage_combiner','alpha');
    // _canvas_.control.scene.addUnit(370,-35,0,'data_combiner','alpha');
    // _canvas_.control.scene.addUnit(-255,-60,0,'eightTrackMixer','alpha');

    // _canvas_.control.scene.addUnit(10,-65,0,'amplifier','alpha');
    _canvas_.control.scene.addUnit(370,225,0,'audio_recorder','alpha');
    // _canvas_.control.scene.addUnit(-280,85,0,'data_readout','alpha');
    // _canvas_.control.scene.addUnit(-230,-110,0,'signal_readout','alpha');
    // _canvas_.control.scene.addUnit(85,290,0,'voltage_readout','alpha');
    // _canvas_.control.scene.addUnit(165,225,0,'audio_scope','alpha');

    // _canvas_.control.scene.addUnit(370,275,0,'pulse_generator','alpha');
    // _canvas_.control.scene.addUnit(-200,290,0,'eightStepSequencer','alpha');
    // _canvas_.control.scene.addUnit(-70,85,0,'launchpad','alpha');

    // _canvas_.control.scene.addUnit(175,-40,0,'basic_synthesizer','alpha');
    // _canvas_.control.scene.addUnit(-170,-115,0,'audio_file_player','alpha');

    // _canvas_.control.scene.addUnit(-10,-10,0,'ruler','alpha');

    // _canvas_.control.viewport.scale(3.5);
    _canvas_.control.viewport.position(-170,-115);




    _canvas_.core.render.frameRateLimit(10);

    // scene = {"compressed":false,"data":"[{\"position\":{\"x\":363.1473990393359,\"y\":49.09867592589141,\"angle\":0},\"details\":{\"collection\":\"alpha\",\"model\":\"audio_duplicator\"},\"data\":{},\"connections\":[{\"typeAndNameOfSourcePort\":{\"type\":\"audio\",\"name\":\"input\"},\"nameOfDestinationUnit\":\"2\",\"indexOfDestinationUnit\":2,\"typeAndNameOfDestinationPort\":{\"type\":\"audio\",\"name\":\"io_output\"}},{\"typeAndNameOfSourcePort\":{\"type\":\"audio\",\"name\":\"output_1\"},\"nameOfDestinationUnit\":\"0\",\"indexOfDestinationUnit\":1,\"typeAndNameOfDestinationPort\":{\"type\":\"audio\",\"name\":\"input_R\"}},{\"typeAndNameOfSourcePort\":{\"type\":\"audio\",\"name\":\"output_2\"},\"nameOfDestinationUnit\":\"0\",\"indexOfDestinationUnit\":1,\"typeAndNameOfDestinationPort\":{\"type\":\"audio\",\"name\":\"input_L\"}}]},{\"position\":{\"x\":152,\"y\":-52.57142857142858,\"angle\":0},\"details\":{\"collection\":\"alpha\",\"model\":\"amplifier\"},\"data\":{},\"connections\":[{\"typeAndNameOfSourcePort\":{\"type\":\"audio\",\"name\":\"input_L\"},\"nameOfDestinationUnit\":\"1\",\"indexOfDestinationUnit\":0,\"typeAndNameOfDestinationPort\":{\"type\":\"audio\",\"name\":\"output_2\"}},{\"typeAndNameOfSourcePort\":{\"type\":\"audio\",\"name\":\"input_R\"},\"nameOfDestinationUnit\":\"1\",\"indexOfDestinationUnit\":0,\"typeAndNameOfDestinationPort\":{\"type\":\"audio\",\"name\":\"output_1\"}}]},{\"position\":{\"x\":460.53825884820566,\"y\":37.948395991313554,\"angle\":0},\"details\":{\"collection\":\"alpha\",\"model\":\"basic_synthesizer\"},\"data\":{\"gain\":0.5,\"attack\":0,\"release\":0,\"detune\":0,\"octave\":0,\"waveType\":\"sine\",\"gainWobble\":{\"rate\":50,\"depth\":0},\"detuneWobble\":{\"rate\":50,\"depth\":0}},\"connections\":[{\"typeAndNameOfSourcePort\":{\"type\":\"data\",\"name\":\"io_midiNoteInput\"},\"nameOfDestinationUnit\":\"3\",\"indexOfDestinationUnit\":3,\"typeAndNameOfDestinationPort\":{\"type\":\"data\",\"name\":\"output\"}},{\"typeAndNameOfSourcePort\":{\"type\":\"audio\",\"name\":\"io_output\"},\"nameOfDestinationUnit\":\"1\",\"indexOfDestinationUnit\":0,\"typeAndNameOfDestinationPort\":{\"type\":\"audio\",\"name\":\"input\"}}]},{\"position\":{\"x\":679.9980442496039,\"y\":51.23127038465677,\"angle\":0},\"details\":{\"collection\":\"alpha\",\"model\":\"eightStepSequencer\"},\"data\":{\"stages\":[{\"note\":0,\"octave\":0,\"velocity\":0.5},{\"note\":0,\"octave\":0,\"velocity\":0.5},{\"note\":0,\"octave\":0,\"velocity\":0.5},{\"note\":0,\"octave\":0,\"velocity\":0.5},{\"note\":0,\"octave\":0,\"velocity\":0.5},{\"note\":0,\"octave\":0,\"velocity\":0.5},{\"note\":0,\"octave\":0,\"velocity\":0.5},{\"note\":0,\"octave\":0,\"velocity\":0.5}],\"direction\":1,\"currentStage\":7},\"connections\":[{\"typeAndNameOfSourcePort\":{\"type\":\"signal\",\"name\":\"directionChange_step\"},\"nameOfDestinationUnit\":\"4\",\"indexOfDestinationUnit\":4,\"typeAndNameOfDestinationPort\":{\"type\":\"signal\",\"name\":\"output\"}},{\"typeAndNameOfSourcePort\":{\"type\":\"data\",\"name\":\"output\"},\"nameOfDestinationUnit\":\"2\",\"indexOfDestinationUnit\":2,\"typeAndNameOfDestinationPort\":{\"type\":\"data\",\"name\":\"io_midiNoteInput\"}}]},{\"position\":{\"x\":1008.8571428571428,\"y\":38,\"angle\":0},\"details\":{\"collection\":\"alpha\",\"model\":\"pulse_generator\"},\"data\":{\"tempo\":120},\"connections\":[{\"typeAndNameOfSourcePort\":{\"type\":\"signal\",\"name\":\"output\"},\"nameOfDestinationUnit\":\"3\",\"indexOfDestinationUnit\":3,\"typeAndNameOfDestinationPort\":{\"type\":\"signal\",\"name\":\"directionChange_step\"}}]}]"};
    // _canvas_.control.scene.printUnits( JSON.parse(scene.data) );
    // _canvas_.control.selection.deselectEverything();
});