#![allow(non_snake_case)]

//rust

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a: &str);
        #[wasm_bindgen(js_namespace = self)]
        fn __getWorker() -> web_sys::Worker;
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library;
    use crate::b_element;
    use crate::c_arrangement;
    use crate::d_render;
    use crate::e_viewport;
    use crate::g_callback;




#[wasm_bindgen]
pub struct Engine {
    pub(crate) worker:web_sys::Worker,
    pub(crate) element_manager: b_element::ElementManager,
    pub(crate) arrangement: c_arrangement::Arrangement,
    pub(crate) render: d_render::Render,
    pub(crate) viewport: e_viewport::Viewport,
    pub(crate) callback: g_callback::Callback,
}
#[wasm_bindgen]
impl Engine {
    pub fn new(worker:web_sys::Worker) -> Engine {
        console_log!("alpha");
        let mut element_manager = b_element::ElementManager::new();
        let arrangement = c_arrangement::Arrangement::new(&mut element_manager);
        let render = d_render::Render::new();
        let viewport = e_viewport::Viewport::new();
        let callback = g_callback::Callback::new();

        Engine {
            worker: worker,
            element_manager: element_manager,
            arrangement: arrangement,
            render: render,
            viewport: viewport,
            callback: callback,
        }
    }
    pub fn test() {
        console_log!("Engine Test");
        a_library::test::all();
        // b_element::test::all();
        // c_arrangement::test::all();
        // d_render::test::all();
        // e_viewport::test::all();
    }
}