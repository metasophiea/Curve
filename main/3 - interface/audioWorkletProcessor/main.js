this.audioWorkletProcessor = new function(){
    const processorCodeBlobs = [
        new Blob([`
            {{include:bitcrusher.js}}
        `], { type: "text/javascript" }),
    ];

    processorCodeBlobs.map(blob => _canvas_.library.audio.context.audioWorklet.addModule(window.URL.createObjectURL(blob)));
};