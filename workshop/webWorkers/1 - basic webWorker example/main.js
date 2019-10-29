console.log('hello');

if(!window.Worker){ console.log("webWorkers not supported"); }

worker = new Worker("worker_1.js");
worker.onmessage = function(event){ console.log(event); };
worker.postMessage('hello from the main thread');
// setTimeout(function(){ worker.terminate(); },100);

var transferableObject = new ArrayBuffer(10);
worker.postMessage(transferableObject,[transferableObject]);
console.log();