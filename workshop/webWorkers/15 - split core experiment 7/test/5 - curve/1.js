_canvas_.curve.go.add( function(){

    // // view positioning
    // _canvas_.core.viewport.scale(3.5);
    // _canvas_.core.viewport.position(-6450,-520);

    // _canvas_.core.stats.active(true);
    // var averages = [];
    // var rollingAverage = 0;
    // var rollingAverageIndex = 1;
    // setInterval(function(){
    //     var tmp = _canvas_.core.stats.getReport();
    //     averages.push(tmp.framesPerSecond);
    //     if(averages.length > 10){averages.shift();}
    //     console.log( 'rollingAverage:',_canvas_.library.math.averageArray(averages),tmp );
    // },1000);

    _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(25);








    //pulse generators
        _canvas_.control.scene.addUnit(10,25,0,'pulseGenerator_signal','development');
        _canvas_.control.scene.addUnit(10,75,0,'pulseGenerator_signal_hyper','development');
        _canvas_.control.scene.addUnit(10,125,0,'pulseGenerator_voltage','development');
        _canvas_.control.scene.addUnit(10,175,0,'pulseGenerator_voltage_hyper','development');
        _canvas_.control.scene.addUnit(10,225,0,'pulseGenerator_data','development');
        _canvas_.control.scene.addUnit(10,275,0,'pulseGenerator_data_hyper','development');

    //direct human input units
        _canvas_.control.scene.addUnit(175,25,0,'musicalKeyboard','development');

    //duplicators
        _canvas_.control.scene.addUnit(515,25,0,'signal_duplicator','development');
        _canvas_.control.scene.addUnit(515,85,0,'voltage_duplicator','development');
        _canvas_.control.scene.addUnit(515,145,0,'data_duplicator','development');
        _canvas_.control.scene.addUnit(515,205,0,'audio_duplicator','development');

    //mixing units
        _canvas_.control.scene.addUnit(595,25,0,'basicMixer','development');

    //audio effect units
        _canvas_.control.scene.addUnit(720,25,0,'distortionUnit','development');
        _canvas_.control.scene.addUnit(720,125,0,'distortionUnit_stereo','development');
        _canvas_.control.scene.addUnit(845,25,0,'reverbUnit','development');
        _canvas_.control.scene.addUnit(845,100,0,'reverbUnit_stereo','development');
        _canvas_.control.scene.addUnit(970,25,0,'filterUnit','development');
        _canvas_.control.scene.addUnit(970,130,0,'filterUnit_stereo','development');
        _canvas_.control.scene.addUnit(1120,25,0,'multibandFilter','development');

    //audio output
        _canvas_.control.scene.addUnit(1330,25,0,'audioSink','development');

    //audio input
        _canvas_.control.scene.addUnit(1385,25,0,'audioIn','development');

    //visualisation
        _canvas_.control.scene.addUnit(1640,25,0,'universalreadout2','development');
        _canvas_.control.scene.addUnit(1640,85,0,'audioScope','development');

    // audio playback units
        _canvas_.control.scene.addUnit(1860,25,0,'player','development');
        //_canvas_.control.scene.addUnit(1860,110,0,'looper','development');
        // _canvas_.control.scene.addUnit(1860,170,0,'oneShot_single','development');
        // _canvas_.control.scene.addUnit(1860,230,0,'oneShot_multi','development');
        // _canvas_.control.scene.addUnit(1860,290,0,'oneShot_multi_multiTrack','development');

    //recording units
        _canvas_.control.scene.addUnit(2095,25,0,'recorder','development');

    //synthesizer
        _canvas_.control.scene.addUnit(2300,25,0,'basicSynthesizer','development');
        //// _canvas_.control.scene.addUnit(2300,135,0,'basicSynthesizer_img','development');

    //sequencers
        _canvas_.control.scene.addUnit(2560,25,0,'launchpad','development');
        _canvas_.control.scene.addUnit(2560,135,0,'basicSequencer','development');
        _canvas_.control.scene.addUnit(2560,370,0,'basicSequencer2','development');
        _canvas_.control.scene.addUnit(2560,605,0,'basicSequencer_midiOut','development');
});