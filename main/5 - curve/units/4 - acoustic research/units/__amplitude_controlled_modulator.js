// this['amplitude_controlled_modulator'] = function(name,x,y,angle){
//     //style data
//         const unitStyle = new function(){
//             //image store location URL
//                 this.imageStoreURL_commonPrefix = imageStoreURL+'common/';
//                 this.imageStoreURL_localPrefix = imageStoreURL+'amplitude_controlled_modulator/';

//             //calculation of measurements
//                 const div = 10;
//                 const measurement = { 
//                     file: { width:775, height:675 },
//                     design: { width:7.75, height:6.75 },
//                 };

//                 this.offset = {x:0,y:0};
//                 this.drawingValue = { 
//                     width: measurement.file.width/div, 
//                     height: measurement.file.height/div
//                 };
//         };

//     //main object creation
//         const object = _canvas_.interface.unit.builder({
//             name:name,
//             model:'amplitude_controlled_modulator',
//             x:x, y:y, angle:angle,
//             space:[
//                 {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
//                 {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
//                 {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
//                 {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
//             ],
//             elements:[
//                 {collection:'dynamic', type:'connectionNode_audio', name:'ext', data:{ 
//                     x:45 + 15/2, y:6.75*10, width:5, height:15, angle:Math.PI/2, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
//                 }},
//                 {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ 
//                     x:unitStyle.drawingValue.width, y:6.75*5 - 15/2, width:5, height:15, angle:0, isAudioOutput:false, cableVersion:2, style:style.connectionNode.audio
//                 }},
//                 {collection:'dynamic', type:'connectionNode_audio', name:'output', data:{ 
//                     x:0, y:6.75*5 + 15/2, width:5, height:15, angle:Math.PI, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio
//                 }},
                
//                 {collection:'basic', type:'image', name:'backing', 
//                     data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'backing.png' }
//                 },

//                 {collection:'control', type:'checkbox_image', name:'mode', data:{
//                     x:2.5, y:44.5, width:10, height:20,
//                     uncheckURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_down.png', 
//                     checkURL:unitStyle.imageStoreURL_commonPrefix+'switch_large_up.png',
//                 }},
//                 {collection:'control', type:'dial_continuous_image', name:'LFO_freq', data:{
//                     x:20, y:24, radius:30/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, resetValue:1/3, arcDistance:1.2,
//                     handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_large.png',
//                 }},
//                 {collection:'control', type:'dial_continuous_image', name:'LFO_gain', data:{
//                     x:45, y:32.5, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1, resetValue:1, arcDistance:1.2,
//                     handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
//                 }},
//                 {collection:'control', type:'dial_continuous_image', name:'ext_gain', data:{
//                     x:45, y:55, radius:15/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:1, resetValue:1, arcDistance:1.2,
//                     handleURL:unitStyle.imageStoreURL_commonPrefix+'dial_small.png',
//                 }},
//                 {collection:'control', type:'checkbox_image', name:'LFO_wave_sine', data:{
//                     x:37.2, y:5.7, width:15/2, height:15/2,
//                     uncheckURL:unitStyle.imageStoreURL_localPrefix+'button_sine_up.png', 
//                     checkURL:unitStyle.imageStoreURL_localPrefix+'button_sine_down.png',
//                 }},
//                 {collection:'control', type:'checkbox_image', name:'LFO_wave_triangle', data:{
//                     x:45.3, y:5.7, width:15/2, height:15/2,
//                     uncheckURL:unitStyle.imageStoreURL_localPrefix+'button_triangle_up.png', 
//                     checkURL:unitStyle.imageStoreURL_localPrefix+'button_triangle_down.png',
//                 }},
//                 {collection:'control', type:'checkbox_image', name:'LFO_wave_square', data:{
//                     x:37.2, y:13.73, width:15/2, height:15/2,
//                     uncheckURL:unitStyle.imageStoreURL_localPrefix+'button_square_up.png', 
//                     checkURL:unitStyle.imageStoreURL_localPrefix+'button_square_down.png',
//                 }},
//                 {collection:'control', type:'checkbox_image', name:'LFO_wave_sawtooth', data:{
//                     x:45.3, y:13.73, width:15/2, height:15/2,
//                     uncheckURL:unitStyle.imageStoreURL_localPrefix+'button_sawtooth_up.png', 
//                     checkURL:unitStyle.imageStoreURL_localPrefix+'button_sawtooth_down.png',
//                 }},
//             ]
//         });

//     //circuitry
//         const state = {
//             LFO_freq: 0,
//             LFO_freq_dial: 0,
//             LFO_gain: 0,
//             LFO_wave: undefined,
//             mode: false,
//         };
//         function selectWave(wave){
//             if(wave == state.LFO_wave){ return; }
//             [ 'sine', 'triangle', 'square', 'sawtooth' ].filter(a => a!=wave).forEach(a => {
//                 object.elements.checkbox_image['LFO_wave_'+a].set(false,false);
//             });
//         }

//     //wiring
//         //hid
//             object.elements.dial_continuous_image.LFO_freq.onchange = function(value){
//                 state.LFO_freq = _canvas_.library.math.curvePoint.exponential(value,0.1,100,6.907755278982135);
//                 state.LFO_freq_dial = value;
//             };
//             object.elements.dial_continuous_image.LFO_gain.onchange = function(value){
//                 state.LFO_gain = value;
//             };
//             object.elements.dial_continuous_image.ext_gain.onchange = function(value){
//                 state.ext_gain = value;
//             };
//             object.elements.checkbox_image.mode.onchange = function(value){
//                 state.mode = value;
//             };

//             object.elements.checkbox_image.LFO_wave_sine.onchange = function(value){
//                 if(value == false){
//                     object.elements.checkbox_image.LFO_wave_sine.set(true,false);
//                     return;
//                 }
//                 selectWave('sine');
//             };
//             object.elements.checkbox_image.LFO_wave_triangle.onchange = function(value){
//                 if(value == false){
//                     object.elements.checkbox_image.LFO_wave_triangle.set(true,false);
//                     return;
//                 }
//                 selectWave('triangle');
//             };
//             object.elements.checkbox_image.LFO_wave_square.onchange = function(value){
//                 if(value == false){
//                     object.elements.checkbox_image.LFO_wave_square.set(true,false);
//                     return;
//                 }
//                 selectWave('square');
//             };
//             object.elements.checkbox_image.LFO_wave_sawtooth.onchange = function(value){
//                 if(value == false){
//                     object.elements.checkbox_image.LFO_wave_sawtooth.set(true,false);
//                     return;
//                 }
//                 selectWave('sawtooth');
//             };
            
//         //io

//     //interface
//         object.i = {
//         };

//     //import/export
//         object.exportData = function(){
//         };
//         object.importData = function(data){
//         };

//     //setup/tearDown
//         object.oncreate = function(){
//             object.elements.checkbox_image.LFO_wave_sine.set(true);
//         };

//     return object;
// };
// this['amplitude_controlled_modulator'].metadata = {
//     name:'Amplitude Controlled Modulator',
//     category:'',
//     helpURL:''
// };