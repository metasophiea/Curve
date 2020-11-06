#![allow(non_camel_case_types)]
#![allow(dead_code)]
#![allow(unused_mut)]
#![allow(unused_imports)]

//rust

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::structure::{*};








pub fn all() {
    console_log!("font_requester");
    // a();
    // b();
}

// fn a(){
//     let mut requester = FontRequester::new();

//     console_log!( "is_approved_font: {}", requester.is_approved_font("Arial") );
//     console_log!( "is_approved_font: {}", requester.is_approved_font("Arialsdf") );

//     console_log!( "font_load_attempted: {}", requester.font_load_attempted("Arial") );
//     console_log!( "font_load_attempted: {}", requester.font_load_attempted("Arialsdf") );

//     console_log!( "is_font_loaded: {}", requester.is_font_loaded("Arial") );
//     console_log!( "is_font_loaded: {}", requester.is_font_loaded("Arialsdf") );

//     requester.load_font("Arial", false, None);
//     requester.load_font("Arialsdf", false, None);

//     console_log!( "is_approved_font: {}", requester.is_approved_font("Arial") );
//     console_log!( "is_approved_font: {}", requester.is_approved_font("Arialsdf") );

//     console_log!( "font_load_attempted: {}", requester.font_load_attempted("Arial") );
//     console_log!( "font_load_attempted: {}", requester.font_load_attempted("Arialsdf") );

//     console_log!( "is_font_loaded: {}", requester.is_font_loaded("Arial") );
//     console_log!( "is_font_loaded: {}", requester.is_font_loaded("Arialsdf") );
// }
// fn b(){
//     let mut requester = FontRequester::new();
//     console_log!( "is_font_loaded: {}", requester.is_font_loaded("defaultThin") );

//     let font = requester.get_font("defaultThin").unwrap();
//     console_log!( "Font.get_vector('a'): {:?}", font.get_vector('a') );
//     console_log!( "Font.get_ratio('a'): {:?}", font.get_ratio('a') );
//     console_log!( "Font.get_offset('a'): {:?}", font.get_offset('a') );
//     console_log!( "Font.get_encroach('a', 'f'): {:?}", font.get_encroach('a', 'f') );
//     console_log!( "Font.get_encroach('a', 'a'): {:?}", font.get_encroach('a', 'a') );

//     console_log!("");
//     font._dump();
// }