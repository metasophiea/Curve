#![allow(non_snake_case)]

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
    use crate::engine::Engine;
    use crate::a_library::{
        data_type::{
            ElementType,
            RenderDecision,
        },
    };








const AVERAGE_SAMPLE_LENGTH: usize = 30;




struct FrameSkip {
    index: usize,
    array: [bool; AVERAGE_SAMPLE_LENGTH],
}
impl FrameSkip {
    pub fn new() -> FrameSkip {
        FrameSkip {
            index: 0,
            array: [false; AVERAGE_SAMPLE_LENGTH],
        }
    }
    pub fn register_skip(&mut self, skipped:bool) {
        self.array[self.index] = skipped;
        self.index = if self.index+1 < AVERAGE_SAMPLE_LENGTH {
            self.index + 1
        } else {
            0
        };
    }
    pub fn get_average_split(&self) -> f32 {
        let mut result = 0.0;
        for value in &self.array {
            result += if *value { 1.0 } else { 0.0 };
        }
        1.0 - result/AVERAGE_SAMPLE_LENGTH as f32
    }
}
impl FrameSkip {
    pub fn _dump(&self, prefix:Option<&str>) {
        let prefix = prefix.unwrap_or("");

        console_log!("{}┌─FrameSkip Dump─", prefix);
        console_log!("{}│ AVERAGE_SAMPLE_LENGTH:{}", prefix, AVERAGE_SAMPLE_LENGTH);
        console_log!("{}│ index:{}", prefix, self.index);
        let mut array_string = String::from("| ");
        for item in &self.array {
            array_string.push_str( if *item {"1 | "} else {"0 | "} );
        }
        console_log!("{}│ array: {}", prefix, array_string);
        console_log!("{}└────────────────", prefix);
    }
}





pub struct Stats {
    active: bool,

    frame_skip_stats: FrameSkip,
}
impl Stats {
    pub fn new() -> Stats {
        Stats {
            active: false,
            frame_skip_stats: FrameSkip::new(),
        }
    }
}
impl Stats {
    pub fn _dump(&self) {
        console_log!("┌─Stats Dump─");
        console_log!("│ active: {}", self.active);
        self.frame_skip_stats._dump(Some("│ "));
        console_log!("└────────────");
    }
}
impl Stats {
    pub fn get_active(&mut self) -> bool { self.active }
    pub fn set_active(&mut self, new:bool) { self.active = new; }

    pub fn render_frame_register_skip(&mut self, skipped:bool) {
        if !self.active { return }
        self.frame_skip_stats.register_skip(skipped);
    }
    pub fn render_frame_skip_get_average_split(&self) -> f32 {
        self.frame_skip_stats.get_average_split()
    }

    pub fn element_render_register_info(&mut self, _id:usize, _element_type:&ElementType, _render_decision:RenderDecision) {
    }
}

#[wasm_bindgen]
impl Engine {
    pub fn stats__dump(&self) {
        self.stats._dump();
    }
    pub fn stats__set_active(&mut self, active:bool) {
        self.stats.set_active(active);
    }
    pub fn stats__render_frame_skip_get_average_split(&self) -> f32 {
        self.stats.render_frame_skip_get_average_split()
    }
}

















// #![allow(non_snake_case)]
// #![allow(unused_must_use)]
// #![allow(dead_code)]

// //rust
//     use std::collections::HashMap;

// //wasm
//     use wasm_bindgen::prelude::*;
    
//     // #[wasm_bindgen]
//     // extern "C" {
//     //     #[wasm_bindgen(js_namespace = console)]
//     //     fn log(a:&str);
//     // }
//     // macro_rules! console_log {
//     //     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
//     // }

// //core
//     use crate::engine::Engine;
//     use crate::a_library::{
//         data_type::{
//             ElementType,
//             RenderDecision,
//         },
//     };








// const AVERAGE_SAMPLE_LENGTH: usize = 30;




// struct FrameSkip {
//     index: usize,
//     array: [bool; AVERAGE_SAMPLE_LENGTH],
// }
// impl FrameSkip {
//     pub fn new() -> FrameSkip {
//         FrameSkip {
//             index: 0,
//             array: [false; AVERAGE_SAMPLE_LENGTH],
//         }
//     }
//     pub fn register_skip(&mut self, skipped:bool) {
//         self.array[self.index] = skipped;
//         self.index = if self.index+1 < AVERAGE_SAMPLE_LENGTH {
//             self.index + 1
//         } else {
//             0
//         };
//     }
//     pub fn get_average_split(&self) -> f32 {
//         let mut result = 0.0;
//         for value in &self.array {
//             result += if *value { 1.0 } else { 0.0 };
//         }
//         1.0 - result/AVERAGE_SAMPLE_LENGTH as f32
//     }
// }




// // struct ElementRenderDecisionEntry {
// //     decisions: HashMap<RenderDecision, usize>,
// // }
// // impl ElementRenderDecisionEntry {
// //     pub fn new() -> ElementRenderDecisionEntry {
// //         ElementRenderDecisionEntry {
// //             decisions: HashMap::new(),
// //         }
// //     }
// //     pub fn clear(&mut self) {
// //         self.decisions.clear();
// //     }
// //     pub fn register_render_decision(&mut self, render_decision:RenderDecision) {
// //         let new_value = match self.decisions.get(&render_decision) {
// //             None => 0,
// //             Some(value) => *value,
// //         };
// //         self.decisions.insert( render_decision, new_value + 1 );
// //     }
// //     pub fn get_data(&self) -> HashMap<RenderDecision, (usize, f32)> {
// //         let mut result: HashMap<RenderDecision, (usize, f32)> = HashMap::new();

// //         let mut total = 0;
// //         for (_key, value) in &self.decisions {
// //             total += value;
// //         }
// //         for (key, value) in &self.decisions {
// //             result.insert( *key, (*value, (*value as f32/total as f32)) );
// //         }

// //         result
// //     }
// // }
// // struct ElementRenderDecision {
// //     database_by_type: HashMap<ElementType, ElementRenderDecisionEntry>,
// // }
// // impl ElementRenderDecision {
// //     pub fn new() -> ElementRenderDecision {
// //         ElementRenderDecision {
// //             database_by_type: HashMap::new(),
// //         }
// //     }
// //     pub fn register_info(&mut self, _id:usize, element_type:&ElementType, render_decision:RenderDecision) {
// //         if !self.database_by_type.contains_key(element_type) {
// //             self.database_by_type.insert(*element_type, ElementRenderDecisionEntry::new());
// //         }
// //         self.database_by_type.get_mut(element_type).unwrap().register_render_decision(render_decision);
// //     }
// //     pub fn get_data(&mut self) -> HashMap<ElementType,HashMap<RenderDecision,(usize, f32)>> {
// //         let mut result: HashMap<ElementType, HashMap<RenderDecision,(usize,f32)> > = HashMap::new();

// //         for (key, value) in &mut self.database_by_type {
// //             result.insert( *key, value.get_data() );
// //         }

// //         result
// //     }
// //     pub fn get_data_and_flush(&mut self) -> HashMap<ElementType,HashMap<RenderDecision,(usize, f32)>> {
// //         let mut result: HashMap<ElementType, HashMap<RenderDecision,(usize,f32)> > = HashMap::new();

// //         for (key, value) in &mut self.database_by_type {
// //             result.insert( *key, value.get_data() );
// //             value.clear();
// //         }

// //         result
// //     }
// // }



// pub struct Stats {
//     active: bool,

//     frame_skip_stats: FrameSkip,
//     // element_render_decision: ElementRenderDecision,
// }
// impl Stats {
//     pub fn new() -> Stats {
//         Stats {
//             active: true,
//             frame_skip_stats: FrameSkip::new(),
//             // element_render_decision: ElementRenderDecision::new(),
//         }
//     }
// }
// impl Stats {
//     pub fn get_active(&mut self) -> bool { self.active }
//     pub fn set_active(&mut self, new:bool) { self.active = new; }

//     pub fn render_frame_register_skip(&mut self, skipped:bool) {
//         if !self.active { return }
//         self.frame_skip_stats.register_skip(skipped);
//     }
//     pub fn render_frame_skip_get_average_split(&self) -> f32 {
//         self.frame_skip_stats.get_average_split()
//     }

//     pub fn element_render_register_info(&mut self, _id:usize, _element_type:&ElementType, _render_decision:RenderDecision) {
//     //     if !self.active { return }
//     //     self.element_render_decision.register_info(id, element_type, render_decision);
//     }
//     // pub fn element_render_decision_get_decision_data(&mut self) -> HashMap<ElementType,HashMap<RenderDecision,(usize, f32)>> {
//     //     self.element_render_decision.get_data()
//     // }
// }

// #[wasm_bindgen]
// impl Engine {
//     pub fn stats__render_frame_skip_get_average_split(&self) -> f32 {
//         self.stats.render_frame_skip_get_average_split()
//     }
//     // pub fn stats__element_render_decision_get_decision_data(&mut self) -> js_sys::Object {
//     //     let data = self.stats.element_render_decision_get_decision_data();
//     //     let result = js_sys::Object::new();

//     //     for (element_type_key, element_type_value) in data {

//     //         let element_type_obj = js_sys::Object::new();
//     //         for (element_type_value_render_decision_key, element_type_value_render_decision_value) in element_type_value {

//     //             let datas = js_sys::Object::new();
//     //             js_sys::Reflect::set( 
//     //                 &datas, 
//     //                 &JsValue::from_str("count"), 
//     //                 &JsValue::from_f64(element_type_value_render_decision_value.0 as f64)
//     //             );
//     //             js_sys::Reflect::set( 
//     //                 &datas, 
//     //                 &JsValue::from_str("percentage"), 
//     //                 &JsValue::from_f64(element_type_value_render_decision_value.1 as f64)
//     //             );

//     //             js_sys::Reflect::set( 
//     //                 &element_type_obj, 
//     //                 &JsValue::from_str(&element_type_value_render_decision_key.to_string()), 
//     //                 &datas
//     //             );
//     //         }

//     //         js_sys::Reflect::set( 
//     //             &result, 
//     //             &JsValue::from_str(&element_type_key.to_string()), 
//     //             &element_type_obj
//     //         );
//     //     }

//     //     result
//     // }
// }