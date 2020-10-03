//rust
    use std::fmt;
//wasm
    use wasm_bindgen::prelude::*;
//core
    use crate::a_library::wasm::from_js_sys::{
        get_value_from_object__f32,
    };




#[derive(Copy, Clone)]
pub struct Point {
    x: f32,
    y: f32,
}
impl Point {
    pub fn new(x:f32, y:f32) -> Point {
        Point {
            x,
            y,
        }
    }
    pub fn new_optional(x:Option<f32>, y:Option<f32>) -> Point {
        Point::new(
            match x { Some(num) => num, None => 0.0 },
            match y { Some(num) => num, None => 0.0 },
        )
    }

    pub fn get_x(&self) -> f32 {
        self.x
    }
    pub fn get_y(&self) -> f32 {
        self.y
    }
    pub fn set_x(&mut self, new:f32) {
        self.x = new;
    }
    pub fn set_y(&mut self, new:f32) {
        self.y = new;
    }
    pub fn set(&mut self, new_x:f32, new_y:f32) {
        self.x = new_x;
        self.y = new_y;
    }

    pub fn clone(&self) -> Point {
        Point {
            x: self.x,
            y: self.y,
        }
    }

    pub fn to_tuple(&self) -> (f32,f32) {
        (self.x,self.y)
    }
}
impl Point {
    pub fn from_js_sys_object(object:&js_sys::Object) -> Point {
        Point::new_optional(
            get_value_from_object__f32("x", object, true),
            get_value_from_object__f32("y", object, true),
        )
    }
    pub fn to_js_sys_object(&self) -> js_sys::Object {
        let object = js_sys::Object::new();
        js_sys::Reflect::set( &object, &JsValue::from_str("x"), &JsValue::from_f64(self.get_x() as f64) ).unwrap();
        js_sys::Reflect::set( &object, &JsValue::from_str("y"), &JsValue::from_f64(self.get_y() as f64) ).unwrap();
        object
    }
}

impl Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f, "{{x:{},y:{}}}",
            self.x,
            self.y,
        )
    }
}
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl PartialEq for Point {
    fn eq(&self, other: &Self) -> bool {
        let allow = 0.000_1;
        // let allow = 0.000_000_000_000_1;
        (self.x.abs() - other.x.abs()).abs() < allow &&
        (self.y.abs() - other.y.abs()).abs() < allow
    }
}