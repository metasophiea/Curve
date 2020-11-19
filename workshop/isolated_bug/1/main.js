const worker = new Worker("worker.js");

let canvases = [];
let canvas_contexts = [];
for(let a = 0; a < 25; a++){
    const canvas = document.getElementById('canvas_'+a) ;
    canvases.push( canvas );
    canvas_contexts.push( canvas.getContext("2d") );
}

let tick = 0;
setInterval(() => {
    for(let a = 0; a < 25; a++){
        const length = Math.abs(Math.sin(tick*(1+(a/100))));
        
        canvas_contexts[a].fillStyle = 'rgba(255,255,255,1)';
        canvas_contexts[a].fillRect(0,0,60,60);
        canvas_contexts[a].fillStyle = 'rgba(100,150,150,1)';
        canvas_contexts[a].fillRect(0,0,60,length*60);

        createImageBitmap(canvases[a]).then(bitmap => {
            worker.postMessage(bitmap,[bitmap]);
        });
    }
    tick += 0.1;
}, 10);