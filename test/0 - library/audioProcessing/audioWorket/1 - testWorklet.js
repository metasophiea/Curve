const osc = new OscillatorNode(_canvas_.library.audio.context);
const testWorklet = new _canvas_.library.audio.audioWorklet.workshop.only_js.testWorklet(_canvas_.library.audio.context)

osc.connect(testWorklet).connect(_canvas_.library.audio.context.destination);

// osc.type = 'sine';
// osc.frequency.setTargetAtTime(440, _canvas_.library.audio.context.currentTime, 0);
// osc.start();

console.log( testWorklet.superImportantValue );
testWorklet.superImportantValue = 'butts';
console.log( testWorklet.superImportantValue );
testWorklet.doubleTheSuperImportantValue();
console.log( testWorklet.superImportantValue );


testWorklet.parameters.get('valueA').linearRampToValueAtTime(100, _canvas_.library.audio.context.currentTime+2);
testWorklet.parameters.get('valueB').linearRampToValueAtTime(100, _canvas_.library.audio.context.currentTime+2);