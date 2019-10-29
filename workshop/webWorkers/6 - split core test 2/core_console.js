const core_engine = new Worker("core_engine.js");
core_engine.onmessage = function(data){
    document.getElementById("canvas").getContext("bitmaprenderer").transferFromImageBitmap(data.data);
};

// const core_console = new function(){
//     let messageId = 0;
//     const messagingCallbacks = {};
//     this.sendMessage = function(data,callback){
//         if(callback != undefined){ messagingCallbacks[messageId] = callback; }
//         core_engine.postMessage({messageId:messageId++,data:data});
//     };
//     core_engine.onmessage = function(_a){
//         var data = _a.data;
//         if(messagingCallbacks[data.messageId] != undefined){
//             messagingCallbacks[data.messageId](data.data);
//             delete messagingCallbacks[data.messageId];
//         }
//     };


//     this.isReady = function(){
//         core_console.sendMessage(
//             {'function':'isReady',arguments:[]},
//             function(a){console.log(a);}
//         );
//     };

//     // this.shape = new function(){
//     //     this.create = function(type){
//     //     };
//     // };
// };







// // core_console.sendMessage('hello',function(a){console.log(a);});
// core_console.isReady();