// #![allow(non_snake_case)]
// #![allow(dead_code)]
// #![allow(non_camel_case_types)]
// #![allow(unused_macros)]
// #![allow(unused_imports)]

// //rust

// //wasm
//     use wasm_bindgen::prelude::*;
//     use web_sys::{
//         WebGl2RenderingContext, 
//         WebGlTexture,
//         WebGlFramebuffer,
//         WebGlRenderbuffer,
//     };

//     #[wasm_bindgen]
//     extern "C" {
//         #[wasm_bindgen(js_namespace = console)]
//         fn log(a:&str);
//         // #[wasm_bindgen(js_namespace = console)]
//         // fn warn(a:&str);
//         #[wasm_bindgen(js_namespace = console)]
//         fn error(a:&str);
//     }
//     macro_rules! console_log {
//         ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
//     }
//     // macro_rules! console_warn {
//     //     ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
//     // }
//     macro_rules! console_error {
//         ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
//     }

// //core
//     use crate::a_library::{
//         structure::{
//             WebGl2programConglomerate,
//             WebGl2programConglomerateManager,
//         }
//     };








// pub struct WebGl2textureFramebufferManager {
//     width: u32,
//     height: u32,
//     samples: u32,
//     framebuffer_id_stack: Vec<usize>,
// }
// impl WebGl2textureFramebufferManager {
//     pub fn new(width:u32, height:u32, samples:u32, _context:&WebGl2RenderingContext, _web_gl2_program_conglomerate_manager:&mut WebGl2programConglomerateManager) -> WebGl2textureFramebufferManager {
//         WebGl2textureFramebufferManager {
//             width: width,
//             height: height,
//             samples: samples,
//             framebuffer_id_stack: vec![],
//         }
//     }
// }
// impl WebGl2textureFramebufferManager {
//     pub fn update_dimensions(&mut self, width:u32, height:u32) {
//         self.width = width;
//         self.height = height;
//     }
//     pub fn update_samples(&mut self, samples:u32) {
//         self.samples = samples;
//     }
// }
// impl WebGl2textureFramebufferManager {
//     pub fn generate_framebuffer(
//         &mut self, 
//         _context:&WebGl2RenderingContext, 
//         _render_buffer_based: bool,
//     ) -> usize {
//         0
//     }
//     pub fn bind_framebuffer(&mut self, _context:&WebGl2RenderingContext, _framebuffer_id:Option<usize>) {
//     }
//     pub fn unbind_last_framebuffer(&mut self, _context:&WebGl2RenderingContext) {
//     }
// }
// impl WebGl2textureFramebufferManager {
//     pub fn _dump(&self, prefix:Option<&str>) {
//         let prefix = prefix.unwrap_or("");

//         console_log!("{}┌─WebGl2textureFramebufferManager Dump─", prefix);
//         console_log!("{}│ width: {}", prefix, self.width);
//         console_log!("{}│ height: {}", prefix, self.height);
//         console_log!("{}│ samples: {}", prefix, self.samples);
//         console_log!("{}│ framebuffer_id_stack: {:?}", prefix, self.framebuffer_id_stack);    
//         console_log!("{}└───────────────────────────────", prefix);
//     }
// }