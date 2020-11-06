#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

//rust

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a: &str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core
    pub mod data_type__geometry;
    pub mod font_requester;



pub fn all() {
    console_log!("Library Test");
    data_type__geometry::all();
    // detect_intersect::all();
    // font_requester::all();
}