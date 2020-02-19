_canvas_.library.go.add( function(){
    
    //testing apparatus
        const osc = new OscillatorNode(_canvas_.library.audio.context);
        const gain_1 = new GainNode(_canvas_.library.audio.context);
        const gain_2 = new GainNode(_canvas_.library.audio.context);
        const MAM = new _canvas_.library.audio.audioWorklet.momentaryAmplitudeMeter(_canvas_.library.audio.context);
        osc.connect(gain_1);
        gain_2.connect(_canvas_.library.audio.context.destination);
        gain_2.connect(MAM);

        gain_1.gain.setTargetAtTime(0, _canvas_.library.audio.context.currentTime, 0);
        osc.frequency.setTargetAtTime(0, _canvas_.library.audio.context.currentTime, 0);
        osc.start();

        let MAM_value = 0;
        MAM.parameters.get('updateDelay').setValueAtTime(10,0);
        MAM.parameters.get('fullSample').setValueAtTime(1,0);
        MAM.port.onmessage = function(msg){ MAM_value = msg.data; };

        function runTest( startFrequency, endFrequency, startGain=1, endGain=1, steps=100, liveValuesCallback=function(){}, completionCallback=function(){} ){
            const decimalPlaces = 2;
            const frequencyJourney = _canvas_.library.math.curveGenerator.linear(steps,startFrequency,endFrequency).map(a => Math.floor(a*Math.pow(10,decimalPlaces))/Math.pow(10,decimalPlaces));
            const gainJourney = _canvas_.library.math.curveGenerator.linear(steps,startGain,endGain).map(a => Math.floor(a*Math.pow(10,decimalPlaces))/Math.pow(10,decimalPlaces));

            const resultArray = [];
            let step = 0;
            const interval = setInterval(() => {
                osc.frequency.setTargetAtTime(frequencyJourney[step], _canvas_.library.audio.context.currentTime, 0);
                gain_1.gain.setTargetAtTime(gainJourney[step], _canvas_.library.audio.context.currentTime, 0);

                setTimeout(() => {
                    const tmp = {
                        frequency: frequencyJourney[step],
                        gain: gainJourney[step],
                        value: MAM_value,
                    };
                    resultArray.push(tmp);
                    liveValuesCallback(tmp);

                    step++;
                    if(step >= steps){
                        clearInterval(interval);
                        completionCallback( resultArray );
                        gain_1.gain.setTargetAtTime(0, _canvas_.library.audio.context.currentTime, 0);
                    }
                },90/2);
            },100/2);
        }


    //system to test
        // //filterNode
        //     const filterNode = _canvas_.library.audio.context.createBiquadFilter();
        //     filterNode.type = "bandpass";
        //     _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, filterNode.frequency,660,0.01,'instant',true);
        //     _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, filterNode.gain,0.1,0.01,'instant',true);
        //     _canvas_.library.audio.changeAudioParam(_canvas_.library.audio.context, filterNode.Q,10,0.01,'instant',true);
        //     gain_1.connect(filterNode).connect(gain_2);
        //amplitudePeakAttenuator
            const amplitudePeakAttenuator = new _canvas_.library.audio.audioWorklet.amplitudePeakAttenuator(_canvas_.library.audio.context);
            gain_1.connect(amplitudePeakAttenuator).connect(gain_2);


    //activate test
        grapher.newCanvas();
        grapher.clear();
        grapher.drawLine({x:0,y:250},{x:500,y:250},'rgba(200,200,200,1)');
        runTest( 0, 2000, 0.01, 10, 100, data=>{
            console.log( (data.frequency/2000)*500, data.gain, 500-data.value*250 );
            grapher.drawCircle( 
                (data.frequency/2000)*500,
                500-data.value*250,
                1,'rgba(0,0,0,1)'
            );
        }, data => {
            for(let a = 0; a < data.length-1; a++){
                const thisData = data[a];
                const nextData = data[a+1];

                grapher.drawLine(
                    { x:(thisData.frequency/2000)*500, y:500-thisData.value*250 },
                    { x:(nextData.frequency/2000)*500, y:500-nextData.value*250 },
                    'rgba(100,100,100,1)'
                );
            }
        } );
        
});