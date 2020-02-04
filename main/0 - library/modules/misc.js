this.padString = function(string,length,padding=' ',paddingSide='l'){
    dev.log.misc('.padString(',string,length,padding,paddingSide); //#development
    dev.count('.misc.padString'); //#development

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
    dev.log.misc('.compressString(',string); //#development
    dev.count('.misc.compressString'); //#development

    return _thirdparty.lzString.compress(string);
};
this.decompressString = function(string){
    dev.log.misc('.decompressString(',string); //#development
    dev.count('.misc.decompressString'); //#development

    return _thirdparty.lzString.decompress(string);
};
this.serialize = function(data,compress=true){
    dev.log.misc('.serialize(',data,compress); //#development
    dev.count('.misc.serialize'); //#development

    function getType(obj){
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }

    data = JSON.stringify(data, function(key, value){

        //preserve types that JSON.stringify can't handle as "unique types"
        switch(getType(value)){
            case 'function':
                return {__uniqueType:'function', __value:value.toString(), __name:value.name};
            case 'arraybuffer': 
                return {__uniqueType:'arraybuffer', __value:btoa(String.fromCharCode(new Uint8Array(value)))}
            case 'audiobuffer':
                const channelData = [];
                for(let a = 0; a < value.numberOfChannels; a++){
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
    dev.log.misc('.unserialize(',data,compressed); //#development
    dev.count('.misc.unserialize'); //#development

    if(data === undefined){return undefined;}

    if(compressed){ data = library.misc.decompressString(data); }

    return JSON.parse(data, function(key, value){

        //recover unique types
        if(typeof value == 'object' && value != null && '__uniqueType' in value){
            switch(value.__uniqueType){
                case 'function':
                    let functionHead = value.__value.substring(0,value.__value.indexOf('{'));
                    functionHead = functionHead.substring(functionHead.indexOf('(')+1, functionHead.lastIndexOf(')'));
                    const functionBody = value.__value.substring(value.__value.indexOf('{')+1, value.__value.lastIndexOf('}'));

                    value = Function(functionHead,functionBody);
                break;
                case 'arraybuffer':
                    value = atob(value.__value);
                    for(let a = 0; a < value.length; a++){ value[a] = value[a].charCodeAt(0); }
                    value = new ArrayBuffer(value);
                break;
                case 'audiobuffer':
                    const audioBuffer = library.audio.context.createBuffer(value.__numberOfChannels, value.__length, value.__sampleRate);

                    for(let a = 0; a < audioBuffer.numberOfChannels; a++){
                        workingBuffer = audioBuffer.getChannelData(a);
                        for(let i = 0; i < audioBuffer.length; i++){
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
this.packData = function(data,compress=true){
    dev.log.misc('.packData(',data,compress); //#development
    dev.count('.misc.packData'); //#development
    return library.misc.serialize({ 
        compressed:compress, 
        data:library.misc.serialize(data,compress)
    },false);
};
this.unpackData = function(data){
    dev.log.misc('.unpackData(',data); //#development
    dev.count('.misc.unpackData'); //#development

    //deserialize first layer
        try{
            data = library.misc.unserialize(data,false);
        }catch(e){
            console.error( "Major error unserializing first layer of file" );
            console.error(e);
            return null;
        }

    //determine if this data is compressed or not
        const compressed = data.compressed;

    //deserialize second layer (knowing now whether it's compressed or not)
        try{
            data = library.misc.unserialize(data.data,compressed);
        }catch(e){
            console.error( "Major error unserializing second layer of file" );
            console.error(e);
            return null;
        }

    return data;
};
this.openFile = function(callback,readAsType='readAsBinaryString',fileType){
    dev.log.misc('.openFile(',callback,readAsType); //#development
    dev.count('.misc.openFile'); //#development

    const i = document.createElement('input');
    i.type = 'file';
    i.accept = fileType;
    i.onchange = function(){
        dev.log.misc('.openFile::onchange()'); //#development
        const f = new FileReader();
        switch(readAsType){
            case 'readAsArrayBuffer':           f.readAsArrayBuffer(this.files[0]);  break;
            case 'readAsBinaryString': default: f.readAsBinaryString(this.files[0]); break;
        }
        f.onloadend = function(){ 
            dev.log.misc('.openFile::onloadend()'); //#development
            if(callback){callback(f.result,i.files[0]);}
        }
    };

    document.body.appendChild(i);
    i.click();
    setTimeout(() => {document.body.removeChild(i);},1000);
};
this.printFile = function(filename,data){
    dev.log.misc('.printFile(',filename,data); //#development
    dev.count('.misc.printFile'); //#development

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data]));
    a.download = filename;
    a.click();
};
this.argumentsToArray = function(argumentsObject){
    dev.log.misc('.argumentsToArray(',argumentsObject); //#development
    dev.count('.misc.argumentsToArray'); //#development
    const outputArray = [];
    for(let a = 0; a < argumentsObject.length; a++){
        outputArray.push( argumentsObject[a] );
    }
    return outputArray;
};
this.comparer = function(item1,item2){
    dev.log.misc('.comparer(',item1,item2); //#development
    dev.count('.misc.comparer'); //#development
    function getType(obj){
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }

    if(getType(item1) != getType(item2)){ return false; }
    if(typeof item1 == 'boolean' || typeof item1 == 'string'){ return item1 === item2; }
    if(typeof item1 == 'number'){
        if( Math.abs(item1) < 1.0e-14 ){item1 = 0;}
        if( Math.abs(item2) < 1.0e-14 ){item2 = 0;}
        if( Math.abs(item1 - item2) < 1.0e-14 ){return true;}
        return item1 === item2;
    }
    if(typeof item1 === 'undefined' || typeof item2 === 'undefined' || item1 === null || item2 === null){ return item1 === item2;  }
    if(getType(item1) == 'function'){
        item1 = item1.toString();
        item2 = item2.toString();

        let item1_functionHead = item1.substring(0,item1.indexOf('{'));
        item1_functionHead = item1_functionHead.substring(item1_functionHead.indexOf('(')+1, item1_functionHead.lastIndexOf(')'));
        const item1_functionBody = item1.substring(item1.indexOf('{')+1, item1.lastIndexOf('}'));

        let item2_functionHead = item2.substring(0,item2.indexOf('{'));
        item2_functionHead = item2_functionHead.substring(item2_functionHead.indexOf('(')+1, item2_functionHead.lastIndexOf(')'));
        const item2_functionBody = item2.substring(item2.indexOf('{')+1, item2.lastIndexOf('}'));

        return item1_functionHead.trim() == item2_functionHead.trim() && item1_functionBody.trim() == item2_functionBody.trim();
    }
    if(typeof item1 == 'object'){
        const keys1 = Object.keys(item1);
        const keys2 = Object.keys(item2);
        if(keys1.length != keys2.length){return false;}

        for(let a = 0; a < keys1.length; a++){ 
            if( keys1.indexOf(keys2[a]) == -1 || !library.misc.comparer(item1[keys1[a]],item2[keys1[a]])){return false;}
        }
        return true;
    }
    return false;
};
this.removeThisFromThatArray = function(item,array){
    dev.log.misc('.removeThisFromThatArray(',item,array); //#development
    dev.count('.misc.removeThisFromThatArray'); //#development
    const index = array.findIndex(a => library.misc.comparer(a,item))
    if(index == -1){return;}
    return array.splice(index,1);
};
this.removeTheseElementsFromThatArray = function(theseElements,thatArray){
    dev.log.misc('.removeTheseElementsFromThatArray(',theseElements,thatArray); //#development
    dev.count('.misc.removeTheseElementsFromThatArray'); //#development

    theseElements.forEach(a => library.misc.removeThisFromThatArray(a,thatArray) );
    return thatArray;
};
this.getDifferenceOfArrays = function(array_a,array_b){
    dev.log.misc('.getDifferenceOfArrays(',array_a,array_b); //#development
    dev.count('.misc.getDifferenceOfArrays'); //#development

    if(array_a.length == 0 && array_b.length == 0){
        return {a:[],b:[]};
    }
    if(array_a.length == 0){
        return {a:[],b:array_b};
    }
    if(array_b.length == 0){
        return {a:array_a,b:[]};
    }

    function arrayRemovals(a,b){
        a.forEach(item => {
            let i = b.indexOf(item);
            if(i != -1){ b.splice(i,1); }
        });
        return b;
    }

    return {
        a:arrayRemovals(array_b,array_a.slice()),
        b:arrayRemovals(array_a,array_b.slice())
    };
};

this.loadFileFromURL = function(url,callback,responseType='blob',errorCallback){
    dev.log.misc('.loadFileFromURL(',url,callback,responseType,errorCallback); //#development
    dev.count('.misc.loadFileFromURL'); //#development

    //responseType: text / arraybuffer / blob / document / json 

    const xhttp = new XMLHttpRequest();
    xhttp.onloadend = a => {
        if(a.target.status == 200){ 
            if(callback != undefined){
                callback(a.target.response);
            }else{
                console.log(a.target.response);
            }
        }else{ 
            if(errorCallback != undefined){
                errorCallback(a.target);
            }else{
                console.warn('library.misc.loadFileFromURL error: could not find the file',a.target.responseURL);
            }
        }
    };
    xhttp.open('get',url,true);
    xhttp.responseType = responseType;
    xhttp.send();
};
// this.loadFileFromURL2 = function(url,callback,errorCallback,responseType='blob'){
//     dev.log.misc('.loadFileFromURL2(',url,callback,responseType,errorCallback); //#development
//     dev.count('.misc.loadFileFromURL2'); //#development

//     //responseType: text / arraybuffer / blob / document / json 

//     const xhttp = new XMLHttpRequest();
//     xhttp.onloadend = a => {
//         if(a.target.status == 200){ 
//             if(callback != undefined){
//                 callback(a.target);
//             }else{
//                 console.log(a.target);
//             }
//         }else{ 
//             if(errorCallback != undefined){
//                 errorCallback(a.target);
//             }else{
//                 console.warn('library.misc.loadFileFromURL error: could not find the file',a.target.responseURL);
//             }
//         }
//     };
//     xhttp.open('get',url,true);
//     xhttp.responseType = responseType;
//     xhttp.send();
// };
// this.loadImageFromURL = function(url,callback,errorCallback,forceUpdate=false,scale=1){
//     dev.log.misc('.loadImageFromURL(',url,callback,errorCallback,forceUpdate,scale); //#development
//     dev.count('.misc.loadImageFromURL'); //#development

//     const dataStore = this.loadImageFromURL.loadedImageData;

//     if(dataStore[url] == undefined || forceUpdate && dataStore[url].state != 'requested' ){
//         dev.log.misc('.loadImageFromURL -> no previously requested image bitmap for this URL, requesting now...'); //#development
//         dataStore[url] = { state:'requested', mipmap:{}, callbacks:[{success:callback,failure:errorCallback,scale:scale}], timestamp:undefined };

//         function getImageFromDataStoreByUrlWithScale(url,scale=1){
//             dev.log.misc('.loadImageFromURL::getImageFromdataStoreByUrl(',url,scale); //#development
//             console.log( dataStore[url] );
//             global = dataStore[url];
//             return dataStore[url].mipmap[1];
//         }

//         library.misc.loadFileFromURL2(
//             url,
//             response => {
//                 dev.log.misc('.loadImageFromURL -> response:',response); //#development
//                 dataStore[url].response = response.response;
//                 createImageBitmap(response.response).then(bitmap => {
//                     dev.log.misc('.loadImageFromURL -> bitmap:',bitmap); //#development
//                     dataStore[url].mipmap[1] = bitmap;
//                     dataStore[url].state = 'ready';
//                     dataStore[url].timestamp = Date.now();
//                     dataStore[url].callbacks.forEach(callbackBlock => {
//                         dev.log.misc('.loadImageFromURL -> running success callback from callbackBlock:',callbackBlock); //#development
//                         if(callbackBlock.success != undefined){callbackBlock.success( getImageFromDataStoreByUrlWithScale(url,callbackBlock.scale) );}
//                     } );
//                     dataStore[url].callbacks = [];
//                 }).catch(error => {
//                     dev.log.misc('.loadImageFromURL -> image decoding error:',error); //#development
//                     dataStore[url].state = 'failed';
//                     dataStore[url].timestamp = Date.now();
//                     dataStore[url].callbacks.forEach(callbackBlock => {
//                         dev.log.misc('.loadImageFromURL -> running failure callback from callbackBlock:',callbackBlock); //#development
//                         if(callbackBlock.failure != undefined){ callbackBlock.failure('imageDecodingError',response,error); }
//                     } );
//                     dataStore[url].callbacks = [];
//                 });
//             },
//             response => {
//                 dev.log.misc('.loadImageFromURL -> image was not found at url: '+url); //#development
//                 dataStore[url].state = 'failed';
//                 dataStore[url].timestamp = Date.now();
//                 dataStore[url].callbacks.forEach(callbackBlock => {
//                     dev.log.misc('.loadImageFromURL -> running failure callback from callbackBlock:',callbackBlock); //#development
//                     if(callbackBlock.failure != undefined){ callbackBlock.failure('badURL',response); }
//                 } );
//                 dataStore[url].callbacks = [];
//             },
//         );

//     }else if( dataStore[url].state == 'ready' ){
//         dev.log.misc('.loadImageFromURL -> found a previously loaded image bitmap for this URL'); //#development
//         if(callback != undefined){ callback( getImageFromDataStoreByUrlWithScale(url,callbackBlock.scale) ); }
//     }else if( dataStore[url].state == 'requested' ){
//         dev.log.misc('.loadImageFromURL -> bitmap is being loaded, adding callbacks to list'); //#development
//         dataStore[url].callbacks.push({success:callback,failure:errorCallback,scale:scale});
//     }else if( dataStore[url].state == 'failed' ){
//         dev.log.misc('.loadImageFromURL -> previous attempt to load from the URL has failed'); //#development
//         if(errorCallback != undefined){ errorCallback('previousFailure'); }
//     }
// };
// this.loadImageFromURL.loadedImageData = {};