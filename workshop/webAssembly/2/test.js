//https://medium.com/@tdeniffel/pragmatic-compiling-from-c-to-webassembly-a-guide-a496cc5954b8
//https://medium.com/@tdeniffel/c-to-webassembly-pass-and-arrays-to-c-86e0cb0464f5

setTimeout(function(){

function original_relativeDistance(realLength, start,end, d, allowOverflow=false){
    var mux = (d - start)/(end - start);
    if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
    return mux*realLength;
};
function wasm_relativeDistance(realLength, start, end, d, allowOverflow){
    var ans = _library___math___relativeDistance(realLength, start, end, d, allowOverflow);
    return ans;
}

//relativeDistance
console.log('%c- relativeDistance', 'font-weight: bold;');
tester( original_relativeDistance(100, 0,1, 0),          wasm_relativeDistance(100, 0,1, 0)                );
tester( original_relativeDistance(100, 0,1, 1),          wasm_relativeDistance(100, 0,1, 1)                );
tester( original_relativeDistance(100, 0,1, 0.1),        wasm_relativeDistance(100, 0,1, 0.1)              );
tester( original_relativeDistance(100, 0,1, 0.5),        wasm_relativeDistance(100, 0,1, 0.5)              );
tester( original_relativeDistance(100, -1,1, 0),         wasm_relativeDistance(100, -1,1, 0)               );
tester( original_relativeDistance(100, -1,0, 0),         wasm_relativeDistance(100, -1,0, 0)               );
tester( original_relativeDistance(100, -1,0, 0.5),       wasm_relativeDistance(100, -1,0, 0.5)             );
tester( original_relativeDistance(100, -1,0, 0.5, true), wasm_relativeDistance(100, -1,0, 0.5, true)       );
tester( original_relativeDistance(120, -1, 1, 0, false), wasm_relativeDistance(120, -1, 1, 0, false)       );
tester( original_relativeDistance(60, -1, 1, 1, false),  wasm_relativeDistance(60, -1, 1, 1, false)        );

tester( original_relativeDistance(60, -1.1, 1.1, 1, false),                     wasm_relativeDistance(60, -1.1, 1.1, 1, false)                  );
tester( original_relativeDistance(60, -1.1, 1.1, 0.75, false),                  wasm_relativeDistance(60, -1.1, 1.1, 0.75, false)               );
tester( original_relativeDistance(60, -1.1, 1.1, 0.5, false),                   wasm_relativeDistance(60, -1.1, 1.1, 0.5, false)                );
tester( original_relativeDistance(60, -1.1, 1.1, -0.7096312918194273, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.7096312918194273, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.7610384342079204, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.7610384342079204, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.7528039816331866, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.7528039816331866, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.7746699074885954, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.7746699074885954, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.8054839748931785, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.8054839748931785, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.8168779246382837, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.8168779246382837, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.7989772731353805, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.7989772731353805, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.7687872823270903, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.7687872823270903, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.7542679542679545, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.7542679542679545, true) );
tester( original_relativeDistance(60, -1.1, 1.1, -0.7687872823270891, true),    wasm_relativeDistance(60, -1.1, 1.1, -0.7687872823270891, true) );







function transferToHeap(array){
    const floatArray = new Float32Array(array.length).map((item,index) => array[index]); //convert array to float32Array
    heapSpace = Module._malloc(floatArray.length * floatArray.BYTES_PER_ELEMENT); //allocate some space on the shared heap
    Module.HEAPF32.set(floatArray, heapSpace >> 2); //set the actual data on the heap
    return heapSpace;
}
   
function sumUp(array){//js wrapper function for the wasm function
    let arrayOnHeap;
    try{
        arrayOnHeap = transferToHeap(array);
        return Module._library___math___sum_up(arrayOnHeap, array.length);
    }finally{//this code is executed no matter what; even after a return
        Module._free(arrayOnHeap); //free the allocated memory
    }
}

console.log( sumUp([1.0, 2.0, 3.0, 4.5]) ); 

},500);