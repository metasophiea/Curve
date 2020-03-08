_canvas_.library.go.add( function(){

    osc_1 = new _canvas_.library.audio.audioWorklet.osc_4(_canvas_.library.audio.context);
    gain_1 = new _canvas_.library.audio.audioWorklet.gain(_canvas_.library.audio.context);
    gain_1.gain.setValueAtTime(0.1,0);
    osc_1.envelope = {
        front:[
            {elapse:0.1,destination:1},
            {elapse:0.1,destination:0.25},
        ],
        back:[
            {elapse:0.1,destination:0},
        ],
    };
    osc_1.frequency.setValueAtTime(220,0);

    osc_1.connect(gain_1).connect(_canvas_.library.audio.context.destination);

    setInterval(function(){
        osc_1.start();//osc_1.stop(); 
        setTimeout(function(){ osc_1.stop(); },500);
    },1000);

});