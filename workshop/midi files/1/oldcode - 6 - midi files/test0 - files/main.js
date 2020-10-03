{{include:../midiparsers/MidiConvert.js}}

function print(data){
    var midi = MidiConvert.parse(data);
    console.log(JSON.stringify(midi, null, 0));
}
function print2(data){
    console.log(data);
    var midi = MidiConvert.parse(data);
    console.log(MidiConvert.fromJSON(midi).encode());
    downloadData('test','mid',MidiConvert.fromJSON(midi).encode());
}
function print3(data){
    var enc = new TextEncoder();
    console.log(''+enc.encode(data));
}
uploadData(print);