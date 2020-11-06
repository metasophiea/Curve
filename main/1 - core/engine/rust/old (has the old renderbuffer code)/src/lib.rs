//rust

//wasm
    use wasm_bindgen::prelude::*;

//core
    pub mod interface;

    pub mod a_library;
    pub mod b_element;
    pub mod c_arrangement;
    pub mod d_render;
    pub mod e_viewport;
    pub mod f_stats;
    pub mod g_callback;
    pub mod engine;




#[wasm_bindgen(start)]
pub fn go() {
    console_error_panic_hook::set_once();
}