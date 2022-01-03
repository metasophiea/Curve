//type 1
    // ab_1 = new _canvas_.library.audio.audioWorklet.production.wasm.audio_buffer_type_1(_canvas_.library.audio.context);
    // gain_1 = new _canvas_.library.audio.audioWorklet.production.wasm.gain(_canvas_.library.audio.context);
    // ab_1.connect(gain_1).connect(_canvas_.library.audio.context.destination);
    // // gain_1.gain.setValueAtTime(0.05,0);
    // // new Float32Array(new Array(441).fill(1).map((_,index) => Math.sin(2*Math.PI*(index/441))))

    // _canvas_.library.audio.loadAudioFile(result => {
    //     ab_1.loadAudioData( result.buffer.getChannelData(0) ).then(
    //         () => {
    //             ab_1.rate.setValueAtTime(0.75,0);
    //             ab_1.loop = true;
    //             ab_1.sectionStart = ab_1.length/2;
    //             ab_1.sectionEnd = ab_1.length/16;
    //             ab_1.playheadPosition = ab_1.length/2;
    //             ab_1.play();
    //         },
    //     );
    // // }, 'url', '/sounds/78/bass_1.wav', undefined, undefined);
    // }, 'url', '/sounds/test/33_1.mp3', undefined, undefined);
    // // }, 'url', '/sounds/test/4-piano.m4a', undefined, undefined);

    // ab_1.onEnd = function(playheadId){ console.log('onEnd!',playheadId); };
    // ab_1.onLoop = function(playheadId){ console.log('onLoop!',playheadId); };

//type 2
    ab_1 = new _canvas_.library.audio.audioWorklet.workshop.wasm.audio_buffer_type_2(_canvas_.library.audio.context);
    gain_1 = new _canvas_.library.audio.audioWorklet.production.wasm.gain(_canvas_.library.audio.context);
    ab_1.connect(gain_1).connect(_canvas_.library.audio.context.destination);

    _canvas_.library.audio.loadAudioFile(result => {
        ab_1.loadAudioData( result.buffer.getChannelData(0) ).then(
            () => {
                ab_1.rate.setValueAtTime(1.01,0);
                ab_1.loop(undefined, true);
                ab_1.sectionStart(undefined, ab_1.length/2);
                ab_1.sectionEnd(undefined, ab_1.length/16);
                // ab_1.setPlayheadPosition(0, ab_1.length/2);
                ab_1.setPlayheadPosition(undefined, ab_1.length*0.99);
                ab_1.play();
                ab_1.play();
            },
        );
    // }, 'url', '/sounds/78/bass_1.wav', undefined, undefined);
    }, 'url', '/sounds/test/33_1.mp3', undefined, undefined);
    // }, 'url', '/sounds/test/4-piano.m4a', undefined, undefined);

    ab_1.onEnd = function(playheadId){ console.log('onEnd!',playheadId); };
    ab_1.onLoop = function(playheadId){ console.log('onLoop!',playheadId); };