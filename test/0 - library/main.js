{{include:../../main/0 - library/main.js}}
{{include:../grapher.js}}

_canvas_.layers.registerFunctionForLayer("library", function(){
    //structuredTests
        // {
        //     {{include:structuredTests/math/misc.js}}
        // }
        // {
        //     {{include:structuredTests/math/detectIntersect.js}}
        // }
        // {
        //     {{include:structuredTests/math/pathExtrapolation.js}}
        // }
        // {
        //     {{include:structuredTests/math/fitPolyIn.js}}
        // }
        // {
        //     {{include:structuredTests/math/polygonsToVisibilityGraph.js}}
        // }
        // {
        //     {{include:structuredTests/math/shortestRouteFromVisibilityGraph.js}}
        // }
        // {
        //     {{include:structuredTests/structure.js}}
        // }
        // {
        //     {{include:structuredTests/audio.js}}
        // }
        // {
        //     {{include:structuredTests/font.js}}
        // }
        // {
        //     {{include:structuredTests/misc.js}}
        // }

    //audioProcessing
        //audioWorklet tests
            //workshop - only_js
                // {{include:audioProcessing/audioWorket/1 - testWorklet.js}} //testWorklet
                // {{include:audioProcessing/audioWorket/5 - amplitudeControlledModulator.js}} //amplitudeControlledModulator
                // {{include:audioProcessing/audioWorket/7 - squareWaveGenerator.js}} //squareWaveGenerator
            //workshop - wasm
                // {{include:audioProcessing/audioWorket/10 - squareWaveGenerator.js}} //squareWaveGenerator with wasm processor
                {{include:audioProcessing/audioWorket/14 - audio_buffer.js}} 
            //production - only_js
                // {{include:audioProcessing/audioWorket/2 - amplitudeModifier.js}} //amplitudeModifier
                // {{include:audioProcessing/audioWorket/4 - momentaryAmplitudeMeter.js}} //momentaryAmplitudeMeter
                // {{include:audioProcessing/audioWorket/6 - whiteNoiseGenerator.js}} //whiteNoiseGenerator
                // {{include:audioProcessing/audioWorket/8 - lagProcessor.js}} //lagProcessor
                // {{include:audioProcessing/audioWorket/9 - oscillator.js}} //oscillator
            //production - wasm
                // {{include:audioProcessing/audioWorket/11 - bitcrusher.js}} //bitcrusher with wasm processor
                // {{include:audioProcessing/audioWorket/12 - oscillator_type_1.js}} //simplistic sine-wave oscillator, edition 1
                // {{include:audioProcessing/audioWorket/3 - sigmoid.js}} //sigmoid with wasm processor
                // {{include:audioProcessing/audioWorket/13 - integrated_synthesizer_type_1.js}} //a synthesizer in an audio node

        // {{include:audioProcessing/1.js}} //frequency/amplitude measure rig

    //loadTests
        // {{include:loadTests/1.js}} //heavy test
        // {{include:loadTests/2.js}} //speed test

    //misc
        // {{include:misc/1.js}} //angles around a circle maker
});