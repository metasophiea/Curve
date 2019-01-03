this.audio2percentage = function(){
    return new function(){
        var analyser = {
            timeDomainDataArray: null,
            frequencyData: null,
            refreshRate: 30,
            refreshInterval: null,
            returnedValueLimits: {min:0, max: 256, halfdiff:128},
            resolution: 128
        };
        analyser.analyserNode = system.audio.context.createAnalyser();
        analyser.analyserNode.fftSize = analyser.resolution;
        analyser.timeDomainDataArray = new Uint8Array(analyser.analyserNode.fftSize);
        analyser.frequencyData = new Uint8Array(analyser.analyserNode.fftSize);

        this.__render = function(){
                analyser.analyserNode.getByteTimeDomainData(analyser.timeDomainDataArray);

                var numbers = [];
                for(var a = 0; a < analyser.timeDomainDataArray.length; a++){
                    numbers.push(
                        analyser.timeDomainDataArray[a]/analyser.returnedValueLimits.halfdiff - 1
                    );
                }

                var val = 0;
                numbers.forEach(function(item){ if(Math.abs(item) > val){val = Math.abs(item);} });

                this.newValue(val);
        }

        //audio connections
            this.audioIn = function(){return analyser.analyserNode;};

        //methods
            this.start = function(){
                analyser.refreshInterval = setInterval( function(that){ that.__render(); }, 1000/30, this );
            };
            this.stop = function(){
                clearInterval(analyser.refreshInterval);
            };

        //callbacks
            this.newValue = function(a){};
    };
};