_canvas_.interface.go.add( function(){

    frequencyResponseMeasure_1 = new _canvas_.interface.circuit.frequencyAmplitudeResponseAnalyser(_canvas_.library.audio.context);
    frequencyResponseMeasure_1.range(20,5000);
    frequencyResponseMeasure_1.stepSize(10);
    // frequencyResponseMeasure_1.timePerStep(0.01);

    //1
        const testcircuit = _canvas_.library.audio.context.createBiquadFilter();
        testcircuit.type = "bandpass";
        _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, testcircuit.frequency,660,0.01,'instant',true);
        _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, testcircuit.gain,0.1,0.01,'instant',true);
        _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, testcircuit.Q,5,0.01,'instant',true);
        frequencyResponseMeasure_1.producer().connect(testcircuit).connect(frequencyResponseMeasure_1.consumer());
        frequencyResponseMeasure_1.producer().connect(testcircuit).connect(_canvas_.library.audio.context.destination);

    // //2
    //     const testcircuit = new _canvas_.library.audio.audioWorklet.lagProcessor(_canvas_.library.audio.context);
    //     testcircuit.samples = 20;
    //     frequencyResponseMeasure_1.producer().connect(testcircuit).connect(frequencyResponseMeasure_1.consumer());
    //     frequencyResponseMeasure_1.producer().connect(testcircuit).connect(_canvas_.library.audio.context.destination);





    grapher.newCanvas();
    grapher.clear();
    grapher.drawLine({x:0,y:250},{x:500,y:250},'rgba(200,200,200,1)');
    const range = frequencyResponseMeasure_1.range();
    frequencyResponseMeasure_1.onValue = function(data){
        const currentX = (data.frequency-range.start) / (range.end-range.start);
        grapher.drawCircle( 
            currentX*500,
            500-data.response*250,
            1,'rgba(0,0,0,1)'
        );
    };
    frequencyResponseMeasure_1.onCompletion = function(data){
        let previousX = undefined;
        let previousResponse = undefined;
        data.forEach(point => {
            const currentX = (point.frequency-range.start) / (range.end-range.start);
            if(previousX != undefined && previousResponse != undefined){
                grapher.drawLine(
                    { x:previousX*500, y:500-previousResponse*250 },
                    { x:currentX*500, y:500-point.response*250 },
                    'rgba(255,0,0,1)'
                );
            }
            previousResponse = point.response;
            previousX = currentX;
        });
    }
    frequencyResponseMeasure_1.start();

});