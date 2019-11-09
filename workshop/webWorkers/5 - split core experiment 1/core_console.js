const core_engine = new Worker("core_engine.js");
core_engine.onmessage = function(data){
    document.getElementById("canvas").getContext("bitmaprenderer").transferFromImageBitmap(data.data);
};