{{include:loadsave.js}}

// {{include:MidiConvert.js}}
// https://github.com/Tonejs/MidiConvert
// https://tonejs.github.io/MidiConvert/build/MidiConvert.js
//      MidiConvert.parse(t){return(new s.a).decode(t)}
//          MidiConvert.parse(rawFileData)
//      MidiConvert.load(t,e){var n=(new s.a).load(t);return e&&n.then(e),n}
//          MidiConvert.load('path/to/midi.mid',callback)
//      MidiConvert.create(){return new s.a}
//          creates a blank MidiConvert midi data structure which one can populate
//      MidiConvert.fromJSON(t,e){var n=(new s.a).load(t);return e&&n.then(e),n}



// {{include:test0 - files/main.js}}
// {{include:test1 - midiConvert format/main.js}}
{{include:test2 - internal format/main.js}}