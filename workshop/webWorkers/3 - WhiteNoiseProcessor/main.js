const audioContext = new AudioContext();
let whiteNoiseNode;
audioContext.audioWorklet.addModule('white-noise-processor.js').then( () => {
    whiteNoiseNode = new AudioWorkletNode(audioContext, 'white-noise-processor');
    whiteNoiseNode.connect(audioContext.destination);
} );