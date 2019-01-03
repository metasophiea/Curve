this.audio = new function(){
    this.changeAudioParam = function(context,audioParam,target,time,curve,cancelScheduledValues=true){
        if(target==null){return audioParam.value;}

        if(cancelScheduledValues){ audioParam.cancelScheduledValues(context.currentTime); }

        try{
            switch(curve){
                case 'linear': 
                    audioParam.linearRampToValueAtTime(target, context.currentTime+time);
                break;
                case 'exponential':
                    console.warn('2018-4-18 - changeAudioParam:exponential doesn\'t work on chrome');
                    if(target == 0){target = 1/10000;}
                    audioParam.exponentialRampToValueAtTime(target, context.currentTime+time);
                break;
                case 's':
                    var mux = target - audioParam.value;
                    var array = system.utility.math.curveGenerator.s(10);
                    for(var a = 0; a < array.length; a++){
                        array[a] = audioParam.value + array[a]*mux;
                    }
                    audioParam.setValueCurveAtTime(new Float32Array(array), context.currentTime, time);
                break;
                case 'instant': default:
                    audioParam.setTargetAtTime(target, context.currentTime, 0.001);
                break;
            }
        }catch(e){
            console.log('could not change param (possibly due to an overlap, or bad target value)');
            console.log('audioParam:',audioParam,'target:',target,'time:',time,'curve:',curve,'cancelScheduledValues:',cancelScheduledValues);
            console.log(e);
        }
    };
    this.loadAudioFile = function(callback,type='file',url=''){
        switch(type){
            case 'url': 
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                request.onload = function(){
                    system.audio.context.decodeAudioData(this.response, function(data){
                        callback({
                            buffer:data,
                            name:(url.split('/')).pop(),
                            duration:data.duration,
                        });
                    }, function(e){console.warn("Error with decoding audio data" + e.err);});
                }
                request.send();
            break;
            case 'file': default:
                var inputObject = document.createElement('input');
                inputObject.type = 'file';
                inputObject.onchange = function(){
                    var file = this.files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsArrayBuffer(file);
                    fileReader.onload = function(data){
                        system.audio.context.decodeAudioData(data.target.result, function(buffer){
                            callback({
                                buffer:buffer,
                                name:file.name,
                                duration:buffer.duration,
                            });
                        });
                    }
                };
                document.body.appendChild(inputObject);
                inputObject.click();
            break;
        }
    };
    this.waveformSegment = function(audioBuffer, bounds={start:0,end:1}){
        var waveform = audioBuffer.getChannelData(0);
        // var channelCount = audioBuffer.numberOfChannels;

        bounds.start = bounds.start ? bounds.start : 0;
        bounds.end = bounds.end ? bounds.end : 1;
        var resolution = 10000;
        var start = audioBuffer.length*bounds.start;
        var end = audioBuffer.length*bounds.end;
        var step = (end - start)/resolution;

        var outputArray = [];
        for(var a = start; a < end; a+=Math.round(step)){
            outputArray.push( 
                system.utility.math.largestValueFound(
                    waveform.slice(a, a+Math.round(step))
                )
            );
        }

        return outputArray;
    };
    this.loadBuffer = function(context, data, destination, onended){
        var temp = context.createBufferSource();
        temp.buffer = data;
        temp.connect(destination);
        temp.onended = onended;
        return temp;
    };
};