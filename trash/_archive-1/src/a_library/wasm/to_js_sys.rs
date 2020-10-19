#![allow(non_snake_case)]

//rust

//wasm
    use wasm_bindgen::prelude::*;

//core








pub fn vector_to_array__usize(vector:&Vec<usize>) -> js_sys::Array {
    let array = js_sys::Array::new_with_length(vector.len() as u32);

    for (index, value) in vector.iter().enumerate() {
        array.set(index as u32, JsValue::from_f64(*value as f64));
    }

    array
}
pub fn vector_to_array__string(vector:&Vec<String>) -> js_sys::Array {
    let array = js_sys::Array::new_with_length(vector.len() as u32);

    for (index, value) in vector.iter().enumerate() {
        array.set(index as u32, JsValue::from_str(value));
    }

    array
}