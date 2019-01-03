this.misc = new function(){
    this.padString = function(string,length,padding=' '){
        if(padding.length<1){return string;}
        string = ''+string;

        while(string.length < length){
            string = padding + string;
        }

        return string;
    };
    this.blendColours = function(rgba_1,rgba_2,ratio){
        //extract
            function extract(rgba){
                rgba = rgba.split(',');
                rgba[0] = rgba[0].replace('rgba(', '');
                rgba[3] = rgba[3].replace(')', '');
                return rgba.map(function(a){return parseFloat(a);})
            }
            rgba_1 = extract(rgba_1);
            rgba_2 = extract(rgba_2);

        //blend
            var rgba_out = [];
            for(var a = 0; a < rgba_1.length; a++){
                rgba_out[a] = (1-ratio)*rgba_1[a] + ratio*rgba_2[a];
            }

        //pack
            return 'rgba('+rgba_out[0]+','+rgba_out[1]+','+rgba_out[2]+','+rgba_out[3]+')';            
    };
    this.multiBlendColours = function(rgbaList,ratio){
        //special cases
            if(ratio == 0){return rgbaList[0];}
            if(ratio == 1){return rgbaList[rgbaList.length-1];}
        //calculate the start colour and ratio(represented by as "colourIndex.ratio"), then blend
            var p = ratio*(rgbaList.length-1);
            return system.utility.misc.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
    };
    this.compressString = function(string){return system.utility.thirdparty.lzString.compress(string);};
    this.decompressString = function(string){return system.utility.thirdparty.lzString.decompress(string);};
    this.serialize = function(data,compress=true){
        function getType(obj){
            return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
        }
    
        var data = JSON.stringify(data, function(key, value){
    
            //preserve types that JSON.stringify can't handle as "unique types"
            switch(getType(value)){
                case 'function':
                    return {__uniqueType:'function', __value:value.toString(), __name:value.name};
                case 'arraybuffer': 
                    return {__uniqueType:'arraybuffer', __value:btoa(String.fromCharCode(new Uint8Array(value)))}
                case 'audiobuffer':
                    var channelData = [];
                    for(var a = 0; a < value.numberOfChannels; a++){
                        channelData.push( Array.from(value.getChannelData(a)) );
                    }
                    return {
                        __uniqueType:'audiobuffer', 
                        __channelData:channelData, 
                        __sampleRate:value.sampleRate,
                        __numberOfChannels:value.numberOfChannels,
                        __length:value.length
                    };
                break;
                default: return value;
            }
    
        });
    
        if(compress){ data = system.utility.misc.compressString(data); }
        return data;
    };
    this.unserialize = function(data,compressed=true){
        if(data === undefined){return undefined;}
    
        if(compressed){ data = system.utility.misc.decompressString(data); }
    
        return JSON.parse(data, function(key, value){
    
            //recover unique types
            if(typeof value == 'object' && value != null && '__uniqueType' in value){
                switch(value.__uniqueType){
                    case 'function':
                        var functionHead = value.__value.substring(0,value.__value.indexOf('{'));
                        functionHead = functionHead.substring(functionHead.indexOf('(')+1, functionHead.lastIndexOf(')'));
                        var functionBody = value.__value.substring(value.__value.indexOf('{')+1, value.__value.lastIndexOf('}'));
    
                        value = Function(functionHead,functionBody);
                    break;
                    case 'arraybuffer':
                        value = atob(value.__value);
                        for(var a = 0; a < value.length; a++){ value[a] = value[a].charCodeAt(0); }
                        value = new ArrayBuffer(value);
                    break;
                    case 'audiobuffer':
                        var audioBuffer = system.audio.context.createBuffer(value.__numberOfChannels, value.__length, value.__sampleRate);
    
                        for(var a = 0; a < audioBuffer.numberOfChannels; a++){
                            workingBuffer = audioBuffer.getChannelData(a);
                            for(var i = 0; i < audioBuffer.length; i++){
                                workingBuffer[i] = value.__channelData[a][i];
                            }
                        }
    
                        value = audioBuffer;
                    break;
                    default: value = value.__value;
                }
            }
    
            return value;
        });
    };
    this.openFile = function(callback,readAsType='readAsBinaryString'){
        var i = document.createElement('input');
        i.type = 'file';
        i.onchange = function(){
            var f = new FileReader();
            switch(readAsType){
                case 'readAsArrayBuffer':           f.readAsArrayBuffer(this.files[0]);  break;
                case 'readAsBinaryString': default: f.readAsBinaryString(this.files[0]); break;
            }
            f.onloadend = function(){ 
                if(callback){callback(f.result);}
            }
        };
        i.click();
    };
    this.printFile = function(filename,data){
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([data]));
        a.download = filename;
        a.click();
    };
    this.openURL = function(url){
        window.open( url, '_blank');
    };
};