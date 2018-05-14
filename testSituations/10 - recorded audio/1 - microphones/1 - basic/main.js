var audioDevices = {
    all: null,
    out: null,
    in: null
};

//gather and list all audio devices
navigator.mediaDevices.enumerateDevices().then(
    function(devices){
        audioDevices.all = devices;
        audioDevices.in = devices.filter((d) => d.kind === 'audioinput')
        audioDevices.out = devices.filter((d) => d.kind === 'audiooutput')

        //all devices
        console.log('audio devices');
        console.log( audioDevices.all );
        console.log('');
        
        //get just the audio input ones
        console.log('audio input devices');
        console.log( audioDevices.in );
        console.log('');

        //get just the audio output ones
        console.log('audio output devices');
        console.log( audioDevices.out );
        console.log('');

        whenLoaded_2();
    }
);

function whenLoaded_1(){
    //get the default input device
    console.log(audioDevices.in[0].deviceId);
    navigator.mediaDevices.getUserMedia({audio: { deviceId: audioDevices.in[0].deviceId}}).then(
        function(a){
            console.log(a);
        }
    );

    // //get the default output device
    // console.log(audioDevices.out[1].deviceId);
    // navigator.mediaDevices.getUserMedia({audio: { deviceId: audioDevices.out[0].deviceId}}).then(
    //     function(a){
    //         console.log(a);
    //     }
    // );
}

function whenLoaded_2(){
    //get the default input device, and attach it to the audio output
    navigator.mediaDevices.getUserMedia({audio: { deviceId: audioDevices.in[0].deviceId}}).then(
        function(a){
            console.log(a);
            __globals.audio.context.createMediaStreamSource(a).connect(__globals.audio.context.destination);
        }
    );
}