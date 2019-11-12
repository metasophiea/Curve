this.padString = function(string,length,padding=' ',paddingSide='l'){
    library._control.logflow.log('misc.padString'); //#development
    if(padding.length<1){return string;}
    string = ''+string;

    if(paddingSide == 'l'){
        while(string.length < length){ string = padding + string; }
    }else{
        while(string.length < length){ string = string + padding; }
    }

    return string;
};
this.compressString = function(string){
    library._control.logflow.log('misc.compressString'); //#development
    return _thirdparty.lzString.compress(string);
};
this.decompressString = function(string){
    library._control.logflow.log('misc.decompressString'); //#development
    return _thirdparty.lzString.decompress(string);
};
this.serialize = function(data,compress=true){
    library._control.logflow.log('misc.serialize'); //#development
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

    if(compress){ data = library.misc.compressString(data); }
    return data;
};
this.unserialize = function(data,compressed=true){
    library._control.logflow.log('misc.unserialize'); //#development
    if(data === undefined){return undefined;}

    if(compressed){ data = library.misc.decompressString(data); }

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
                    var audioBuffer = library.audio.context.createBuffer(value.__numberOfChannels, value.__length, value.__sampleRate);

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
    library._control.logflow.log('misc.openFile'); //#development
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
    library._control.logflow.log('misc.printFile'); //#development
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data]));
    a.download = filename;
    a.click();
};
this.loadFileFromURL = function(URL,callback,responseType='blob',errorCallback){
    library._control.logflow.log('misc.loadFileFromURL'); //#development
    //responseType: text / arraybuffer / blob / document / json 

    var xhttp = new XMLHttpRequest();
    if(callback != undefined){ xhttp.onloadend = a => {
        if(a.target.status == 200){ callback(a.target.response); }
        else{ 
            if(errorCallback != undefined){ errorCallback(); }
            else{console.warn('library.misc.loadFileFromURL error: could not find the file',a.target.responseURL);}
        }
    }; }
    xhttp.open('get',URL,true);
    xhttp.responseType = responseType;
    xhttp.send();
};