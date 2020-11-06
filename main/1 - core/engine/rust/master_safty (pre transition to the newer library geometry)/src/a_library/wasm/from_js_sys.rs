#![allow(non_snake_case)]

//rust

//wasm
    use wasm_bindgen::prelude::*;
    use web_sys::ImageBitmap;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a:&str);
    }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{
        Colour,
        Point,
    };







    
pub fn get_js_value_from_js_sys_object(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<JsValue> {
    match js_sys::Reflect::get(&object, &JsValue::from_str(&key)) {
        Ok(jsvalue) => {
            if jsvalue.is_undefined() { 
                if !do_not_warn_on_undefined {
                    console_warn!("a_library::wasm::from_js_sys::get_js_value_from_js_sys_object : value \"{}\" is undefined", key); 
                }
                None
            } else {
                Some(jsvalue)
            }
        }
        Err(_) => { 
            console_warn!("a_library::wasm::from_js_sys::get_js_value_from_js_sys_object : issue getting entry \"{}\" from object", key); 
            None 
        },
    }
}
pub fn get_js_sys_object_from_js_sys_object(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<js_sys::Object> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => Some(js_sys::Object::from(jsvalue))
    }
}






pub fn js_sys_object_to_vector_of_f32(object:&js_sys::Object) -> Option<Vec<f32>> {
    let mut output:Vec<f32> = vec![];

    for item in js_sys::Array::from(&object).to_vec() {
        match item.as_f64() {
            None => { 
                console_warn!("a_library::wasm::from_js_sys::js_sys_object_to_vector_of_f32 : entry \"{:?}\" is not an f32", item); 
                return None;
            },
            Some(value) => output.push(value as f32),
        }
    }

    Some(output)
}
pub fn js_sys_array_to_vector_of_f32(array:&js_sys::Array) -> Option<Vec<f32>> {
    let mut output:Vec<f32> = vec![];

    for item in js_sys::Array::from(&array).to_vec() {
        match item.as_f64() {
            None => { 
                console_warn!("a_library::wasm::from_js_sys::js_sys_array_to_vector_of_f32 : entry \"{:?}\" is not an f32", item); 
                return None;
            },
            Some(value) => output.push(value as f32),
        }
    }

    Some(output)
}








pub fn get_value_from_object__bool(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<bool> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            match jsvalue.as_bool() {
                None => { 
                    console_warn!("a_library::wasm::from_js_sys::get_value_from_object__bool : issue parsing value ({:?}) as bool", jsvalue); 
                    None 
                },
                Some(value) => Some(value),
            }
        },
    }
}

pub fn get_value_from_object__u8(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<u8> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            match jsvalue.as_f64() {
                None => { 
                    console_warn!("a_library::wasm::from_js_sys::get_value_from_object__u8 : issue parsing value ({:?})as u8", jsvalue); 
                    None 
                },
                Some(value) => Some(value as u8),
            }
        },
    }
}
pub fn get_value_from_object__u32(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<u32> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            match jsvalue.as_f64() {
                None => { 
                    console_warn!("a_library::wasm::from_js_sys::get_value_from_object__u32 : issue parsing value ({:?})as u32", jsvalue); 
                    None 
                },
                Some(value) => Some(value as u32),
            }
        },
    }
}
pub fn get_value_from_object__i32(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<i32> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            match jsvalue.as_f64() {
                None => { 
                    console_warn!("a_library::wasm::from_js_sys::get_value_from_object__i32 : issue parsing value ({:?})as i32", jsvalue); 
                    None 
                },
                Some(value) => Some(value as i32),
            }
        },
    }
}
pub fn get_value_from_object__f32(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<f32> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            match jsvalue.as_f64() {
                None => { 
                    console_warn!("a_library::wasm::from_js_sys::get_value_from_object__f32 : issue parsing value ({:?}) as f32", jsvalue); 
                    None 
                },
                Some(value) => Some(value as f32),
            }
        },
    }
}

pub fn get_value_from_object__string(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<String> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            match jsvalue.as_string() {
                None => { 
                    console_warn!("a_library::wasm::from_js_sys::get_value_from_object__string : issue parsing value ({:?}) as string", jsvalue); 
                    None 
                },
                Some(value) => Some(value),
            }
        },
    }
}
pub fn get_value_from_object__char(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<char> {
    match get_value_from_object__string(key, object, do_not_warn_on_undefined) {
        None => { 
            console_warn!("a_library::wasm::from_js_sys::get_value_from_object__char : issue parsing value as string"); 
            None 
        },
        Some(value) => {
            match value.chars().next() {
                None => { 
                    console_warn!("a_library::wasm::from_js_sys::get_value_from_object__char : issue parsing value ({:?}) as char", value); 
                    None 
                },
                Some(value) => Some(value),
            }
        },
    }
}
pub fn get_value_from_object__ImageBitmap(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<ImageBitmap> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => Some(ImageBitmap::from(jsvalue)),
    }
}



pub fn get_value_from_object__point(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<Point> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            if !jsvalue.is_object() { 
                console_warn!("a_library::wasm::from_js_sys::get_value_from_object__point : entry \"{}\" with value {:?} is not an object", key, jsvalue); 
                None
            } else {
                Some(
                    Point::from_js_sys_object( js_sys::Object::try_from(&jsvalue).unwrap() )
                )
            }
        },
    }
}
pub fn get_value_from_object__colour(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<Colour> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            if !jsvalue.is_object() { 
                console_warn!("a_library::wasm::from_js_sys::get_value_from_object__colour : entry \"{}\" with value {:?} is not an object", key, jsvalue); 
                None
            } else {
                Some(
                    Colour::from_js_sys_object( &js_sys::Object::try_from(&jsvalue).unwrap() )
                )
            }
        },
    }
}
pub fn get_value_from_object__vector_of_f32(key:&str, object:&js_sys::Object, do_not_warn_on_undefined:bool) -> Option<Vec<f32>> {
    match get_js_value_from_js_sys_object(key, object, do_not_warn_on_undefined) {
        None => None,
        Some(jsvalue) => {
            if !jsvalue.is_object() { 
                console_warn!("a_library::wasm::from_js_sys::get_value_from_object__vector_of_f32 : entry \"{}\" with value {:?} is not an object", key, jsvalue); 
                None
            } else {
                js_sys_object_to_vector_of_f32(&js_sys::Object::try_from(&jsvalue).unwrap())
            }
        },
    }
}