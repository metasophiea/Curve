{{include:wasm_library.js}}

self = this;;
wasm_bindgen('./wasm/wasm_library_bg.wasm').then(() => {
    Object.entries(wasm_bindgen).slice(0,-1).forEach(item => {
        self[item[0]] = item[1];
    });
});