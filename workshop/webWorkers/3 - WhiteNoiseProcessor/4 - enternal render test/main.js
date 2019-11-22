externalCore = new Worker("externalCore.js");
externalCore.onmessage = function(data){
    document.getElementById("canvas").getContext("bitmaprenderer").transferFromImageBitmap(data.data);
};
