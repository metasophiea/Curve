let errorFound = false;
let errorData = {
    type:'',
    message:'',
};

//checks
    if(typeof(Worker) == undefined){
        errorData.type = 'worker';
        errorFound = true;
    }

    try{
        const OffscreenCanvas_test = OffscreenCanvas;
    }catch(error){
        errorData.type = 'OffscreenCanvas';
        errorData.message = error;
        errorFound = true;
    }

    {
        const blob = new Blob([
            "try{"+
            "   requestAnimationFrame;"+
            "}catch(error){"+
            "   self.postMessage(''+error);"+
            "}"+
            ""
        ], { type: "text/javascript" });
        const worker = new Worker(window.URL.createObjectURL(blob));
        worker.onmessage = function(data){
            errorData.type = 'requestAnimationFrame';
            errorData.message = data.data;
            errorFound = true;
            const destinationURL = 'errorPage?type='+errorData.type+'&message='+errorData.message;
            location.href = destinationURL;
        };
    }

//redirection 
    if(errorFound){
        const destinationURL = 'errorPage?type='+errorData.type+'&message='+errorData.message;
        location.href = destinationURL;
    }