_canvas_.curve.go.add( function(){
    // _canvas_.core.render.frameRateLimit(10);

    // const bc = _canvas_.control.scene.addUnit(10,10,0,'bitcrusher','acousticresearch');
    // const am = _canvas_.control.scene.addUnit(10,10,0,'amplitude_modifier','acousticresearch');
    // const sa = _canvas_.control.scene.addUnit(10,10,0,'sigmoids_affecter','acousticresearch');
    const sa = _canvas_.control.scene.addUnit(10,10,0,'amplitude_controlled_modulator','acousticresearch');
    



    _canvas_.control.viewport.scale(4);
    // _canvas_.control.viewport.position(-5, -650);
});