//master context
    this.context = new (window.AudioContext || window.webkitAudioContext)();

    


    
//utility functions
    this.changeAudioParam = function(context,audioParam,target,time,curve,cancelScheduledValues=true){
        dev.log.audio('.changeAudioParam(-context-,'+JSON.stringify(audioParam)+','+target+','+time+','+curve+','+cancelScheduledValues+')'); //#development
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
                    audioParam.setTargetAtTime(target, context.currentTime, 0.001*10);
                break;
            }
        }catch(e){
            console.log('could not change param (possibly due to an overlap, or bad target value)');
            console.log('audioParam:',audioParam,'target:',target,'time:',time,'curve:',curve,'cancelScheduledValues:',cancelScheduledValues);
            console.log(e);
        }
    };
    this.loadAudioFile = function(callback,type='file',url=''){
        dev.log.audio('.loadAudioFile('+JSON.stringify(callback)+','+type+','+url+')'); //#development
        dev.count('.audio.loadAudioFile'); //#development
    
        switch(type){
            case 'url': 
                const request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                request.onload = function(){
                    library.audio.context.decodeAudioData(this.response, function(data){
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
                const inputObject = document.createElement('input');
                inputObject.type = 'file';
                inputObject.onchange = function(){
                    const file = this.files[0];
                    const fileReader = new FileReader();
                    fileReader.readAsArrayBuffer(file);
                    fileReader.onload = function(data){
                        library.audio.context.decodeAudioData(data.target.result, function(buffer){
                            callback({
                                buffer:buffer,
                                name:file.name,
                                duration:buffer.duration,
                            });
                        });
                        inputObject.remove();
                    }
                };
                document.body.appendChild(inputObject);
                inputObject.click();
            break;
        }
    };
    this.waveformSegment = function(audioBuffer, bounds={start:0,end:1}, resolution=10000){
        dev.log.audio('.waveformSegment('+JSON.stringify(audioBuffer)+','+JSON.stringify(bounds)+','+resolution+')'); //#development
        dev.count('.audio.waveformSegment'); //#development
    
        const waveform = audioBuffer.getChannelData(0);
        // var channelCount = audioBuffer.numberOfChannels;
    
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
        dev.log.audio('.loadBuffer(-context-,'+JSON.stringify(data)+','+destination+','+onended+')'); //#development
        dev.count('.audio.loadBuffer'); //#development
    
        const temp = context.createBufferSource();
        temp.buffer = data;
        temp.connect(destination);
        temp.onended = onended;
        return temp;
    };
    







//destination
    this.destination = this.context.createGain();
    this.destination.connect(this.context.destination);
    this.destination._gain = 1;
    this.destination.masterGain = function(value){
        dev.log.audio('.masterGain('+value+')'); //#development
        dev.count('.audio.masterGain'); //#development
    
        if(value == undefined){return this.destination._gain;}
        this._gain = value;
        library.audio.changeAudioParam(library.audio.context, this.gain, this._gain, 0.01, 'instant', true);
    };








//conversion
    //frequencies index
        this.names_frequencies_split = {
            0:{ 'C':16.35, 'C#':17.32, 'D':18.35, 'D#':19.45, 'E':20.60, 'F':21.83, 'F#':23.12, 'G':24.50, 'G#':25.96, 'A':27.50, 'A#':29.14, 'B':30.87  },
            1:{ 'C':32.70, 'C#':34.65, 'D':36.71, 'D#':38.89, 'E':41.20, 'F':43.65, 'F#':46.25, 'G':49.00, 'G#':51.91, 'A':55.00, 'A#':58.27, 'B':61.74, },    
            2:{ 'C':65.41, 'C#':69.30, 'D':73.42, 'D#':77.78, 'E':82.41, 'F':87.31, 'F#':92.50, 'G':98.00, 'G#':103.8, 'A':110.0, 'A#':116.5, 'B':123.5, },
            3:{ 'C':130.8, 'C#':138.6, 'D':146.8, 'D#':155.6, 'E':164.8, 'F':174.6, 'F#':185.0, 'G':196.0, 'G#':207.7, 'A':220.0, 'A#':233.1, 'B':246.9, },    
            4:{ 'C':261.6, 'C#':277.2, 'D':293.7, 'D#':311.1, 'E':329.6, 'F':349.2, 'F#':370.0, 'G':392.0, 'G#':415.3, 'A':440.0, 'A#':466.2, 'B':493.9, },
            5:{ 'C':523.3, 'C#':554.4, 'D':587.3, 'D#':622.3, 'E':659.3, 'F':698.5, 'F#':740.0, 'G':784.0, 'G#':830.6, 'A':880.0, 'A#':932.3, 'B':987.8, },    
            6:{ 'C':1047,  'C#':1109,  'D':1175,  'D#':1245,  'E':1319,  'F':1397,  'F#':1480,  'G':1568,  'G#':1661,  'A':1760,  'A#':1865,  'B':1976,  },
            7:{ 'C':2093,  'C#':2217,  'D':2349,  'D#':2489,  'E':2637,  'F':2794,  'F#':2960,  'G':3136,  'G#':3322,  'A':3520,  'A#':3729,  'B':3951,  },    
            8:{ 'C':4186,  'C#':4435,  'D':4699,  'D#':4978,  'E':5274,  'F':5588,  'F#':5920,  'G':6272,  'G#':6645,  'A':7040,  'A#':7459,  'B':7902   }, 
        };
        //generate forward index
        // eg. {... '4C':261.6, '4C#':277.2 ...}
            this.names_frequencies = {};
            Object.entries(this.names_frequencies_split).forEach((octave,index) => {
                Object.entries(this.names_frequencies_split[index]).forEach(name => {
                    this.names_frequencies[ octave[0]+name[0] ] = name[1];
                });
            });

        //generate backward index
        // eg. {... 261.6:'4C', 277.2:'4C#' ...}
            this.frequencies_names = {};
            Object.entries(this.names_frequencies).forEach(entry => {
                this.frequencies_names[entry[1]] = entry[0];
            });

    //generate midi notes index
        const noteNames = [
            '0C', '0C#', '0D', '0D#', '0E', '0F', '0F#', '0G', '0G#', '0A', '0A#', '0B',
            '1C', '1C#', '1D', '1D#', '1E', '1F', '1F#', '1G', '1G#', '1A', '1A#', '1B',
            '2C', '2C#', '2D', '2D#', '2E', '2F', '2F#', '2G', '2G#', '2A', '2A#', '2B',
            '3C', '3C#', '3D', '3D#', '3E', '3F', '3F#', '3G', '3G#', '3A', '3A#', '3B',
            '4C', '4C#', '4D', '4D#', '4E', '4F', '4F#', '4G', '4G#', '4A', '4A#', '4B',
            '5C', '5C#', '5D', '5D#', '5E', '5F', '5F#', '5G', '5G#', '5A', '5A#', '5B',
            '6C', '6C#', '6D', '6D#', '6E', '6F', '6F#', '6G', '6G#', '6A', '6A#', '6B',
            '7C', '7C#', '7D', '7D#', '7E', '7F', '7F#', '7G', '7G#', '7A', '7A#', '7B',
            '8C', '8C#', '8D', '8D#', '8E', '8F', '8F#', '8G', '8G#', '8A', '8A#', '8B',
        ];
        //generate forward index
            this.midinumbers_names = {};
            noteNames.forEach((entry,index) => {
                this.midinumbers_names[index+24] = entry;
            });
        //generate backward index
            this.names_midinumbers = {};
            Object.entries(this.midinumbers_names).forEach(entry => {
                this.names_midinumbers[entry[1]] = parseInt(entry[0]);
            });

    //lead functions
        this.num2name = function(num){ 
            dev.log.audio('.num2name('+num+')'); //#development
            dev.count('.audio.num2name'); //#development
    
            return this.midinumbers_names[num];
        };
        this.num2freq = function(num){ 
            dev.log.audio('.num2freq('+num+')'); //#development
            dev.count('.audio.num2freq'); //#development
    
            return this.names_frequencies[this.midinumbers_names[num]];
        };

        this.name2num = function(name){ 
            dev.log.audio('.name2num('+name+')'); //#development
            dev.count('.audio.name2num'); //#development
    
            return this.names_midinumbers[name];
        };
        this.name2freq = function(name){ 
            dev.log.audio('.name2freq(-'+name+')'); //#development
            dev.count('.audio.name2freq'); //#development
    
            return this.names_frequencies[name];
        };

        this.freq2num = function(freq){ 
            dev.log.audio('.freq2num('+freq+')'); //#development
            dev.count('.audio.freq2num'); //#development
    
            return this.names_midinumbers[this.frequencies_names[freq]];
        };
        this.freq2name = function(freq){ 
            dev.log.audio('.freq2name(-'+freq+')'); //#development
            dev.count('.audio.freq2name'); //#development
    
            return this.frequencies_names[freq];
        };