let errorFound = false;
let errorData = {
    type:'',
    message:'',
};

//checks
    try{
        const OffscreenCanvas_test = OffscreenCanvas;
    }catch(error){
        errorData.type = 'OffscreenCanvas';
        errorData.message = error;
        errorFound = true;
    }

//redirection 
    if(errorFound){
        const destinationURL = 'errorPage?type='+errorData.type+'&message='+errorData.message;
        location.href = destinationURL;
    }