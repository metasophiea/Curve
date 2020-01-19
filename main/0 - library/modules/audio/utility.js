this.changeAudioParam = function(context,audioParam,target,time,curve,cancelScheduledValues=true){
    dev.log.audio('.changeAudioParam(',context,audioParam,target,time,curve,cancelScheduledValues); //#development
    dev.count('.audio.changeAudioParam'); //#development

    if(target==null){return audioParam.value;}

    if(cancelScheduledValues){ audioParam.cancelScheduledValues(0); }

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
                const mux = target - audioParam.value;
                const array = library.math.curveGenerator.s(10);
                for(let a = 0; a < array.length; a++){
                    array[a] = audioParam.value + array[a]*mux;
                }
                audioParam.setValueCurveAtTime(new Float32Array(array), context.currentTime, time);
            break;
            case 'instant': default:
                audioParam.setTargetAtTime(target, context.currentTime, 0.01);
            break;
        }
    }catch(e){
        console.log('could not change param (possibly due to an overlap, or bad target value)');
        console.log('audioParam:',audioParam,'target:',target,'time:',time,'curve:',curve,'cancelScheduledValues:',cancelScheduledValues);
        console.log(e);
    }
};
const loadedAudioFiles = {};
this.loadAudioFile = function(callback,type='file',url='',errorCallback,forceRequest=false){
    dev.log.audio('.loadAudioFile(',callback,type,url); //#development
    dev.count('.audio.loadAudioFile'); //#development

    if(callback == undefined){
        dev.log.audio('.loadAudioFile -> no callback provided; result has nowhere to go, so it will not be done'); //#development
        return;
    }

    switch(type){
        case 'url': 
            if(!forceRequest && loadedAudioFiles[url] != undefined){
                callback(loadedAudioFiles[url]);
                break;
            }

            library.misc.loadFileFromURL(
                url, 
                data => {
                    library.audio.context.decodeAudioData(data, function(data){
                        loadedAudioFiles[url] = { buffer:data, name:(url.split('/')).pop(), duration:data.duration };
                        callback(loadedAudioFiles[url]);
                    });
                },
                'arraybuffer',
                errorCallback
            );
        break;
        case 'file': default:
            library.misc.openFile(
                (data,file) => {
                    library.audio.context.decodeAudioData(data, function(buffer){
                        callback({ buffer:buffer, name:file.name, duration:buffer.duration });
                    });
                },
                'readAsArrayBuffer'
            );
        break;
    }
};
this.waveformSegment = function(audioBuffer, bounds={start:0,end:1}, resolution=10000){
    dev.log.audio('.waveformSegment(',audioBuffer,bounds,resolution); //#development
    dev.count('.audio.waveformSegment'); //#development

    const waveform = audioBuffer.getChannelData(0);
    // const channelCount = audioBuffer.numberOfChannels;

    bounds.start = bounds.start ? bounds.start : 0;
    bounds.end = bounds.end ? bounds.end : 1;
    const start = audioBuffer.length*bounds.start;
    const end = audioBuffer.length*bounds.end;
    const step = (end - start)/resolution;

    const outputArray = [];
    for(let a = start; a < end; a+=Math.round(step)){
        outputArray.push( 
            library.math.largestValueFound(
                waveform.slice(a, a+Math.round(step))
            )
        );
    }

    return outputArray;
};
this.loadBuffer = function(context, data, destination, onended){
    dev.log.audio('.loadBuffer(',context,data,destination,onended); //#development
    dev.count('.audio.loadBuffer'); //#development

    const temp = context.createBufferSource();
    temp.buffer = data;
    temp.connect(destination);
    temp.onended = onended;
    return temp;
};