self.postMessage('hello from the worker');
onmessage = function(event){ self.postMessage(event.data); };