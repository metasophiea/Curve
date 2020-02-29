_canvas_.curve.go.add( function(){
    _canvas_.core.render.frameRateLimit(10);

    const dsds = _canvas_.control.scene.addUnit(10,100,0,'dsds-8^3','harbinger');
    const mrd = _canvas_.control.scene.addUnit(10,180,0,'mrd-16','harbinger');
    const rdp = _canvas_.control.scene.addUnit(10,180,0,'rdp-32','harbinger');

    // setTimeout( () => {
    //     const rdp2 = _canvas_.control.scene.addUnit(10,180,0,'rdp-32','harbinger');
    // },1000);

    // for(let a = 0; a < 8; a++){
    //     mrd.io.signal['signal_out_'+a].connectTo(dsds.io.signal['signal_in_'+a]);
    // }


    // const pulse = _canvas_.control.scene.addUnit(370,120,0,'pulse_generator','alpha');
    // const amp = _canvas_.control.scene.addUnit(-150,-150,0,'amplifier','alpha');
    // const dup = _canvas_.control.scene.addUnit(60,-60,0,'audio_duplicator','alpha');
    // dsds.io.audio.audio_out_master.connectTo(dup.io.audio.input);
    // dup.io.audio.output_1.connectTo(amp.io.audio.input_R);
    // dup.io.audio.output_2.connectTo(amp.io.audio.input_L);
    // pulse.io.signal.output.connectTo(mrd.io.signal.pulseIn);
    // pulse.i.tempo(380);

    // mrd.i.pageData(0,0,
    //     [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false]
    // );
    // mrd.i.pageData(1,0,
    //     [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
    // );
    // mrd.i.pageData(2,0,
    //     [false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, true]
    // );
    // mrd.i.pageData(6,0,
    //     [false, false, true, false, false, false, true, false, false, false, true, true, false, false, true, false]
    // );
    
    



    _canvas_.control.viewport.scale(4);
    _canvas_.control.viewport.position(-5, -650);
});