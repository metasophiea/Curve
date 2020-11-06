//rust
    use std::fmt;
//wasm
    use wasm_bindgen::prelude::*;
//core
    use crate::a_library::wasm::from_js_sys::{
        get_value_from_object__f32,
    };




#[derive(Copy, Clone)]
pub struct Colour {
    r: f32,
    g: f32,
    b: f32,
    a: f32,

    premultiplied_r: f32,
    premultiplied_g: f32,
    premultiplied_b: f32,
}
impl Colour {
    pub fn new(r:f32, g:f32, b:f32, a:f32) -> Colour {
        let r = if r < 0.0 { 0.0 } else if r > 1.0 { 1.0 } else { r };
        let g = if g < 0.0 { 0.0 } else if g > 1.0 { 1.0 } else { g };
        let b = if b < 0.0 { 0.0 } else if b > 1.0 { 1.0 } else { b };
        let a = if a < 0.0 { 0.0 } else if a > 1.0 { 1.0 } else { a };

        Colour {
            r: r,
            g: g,
            b: b,
            a: a,

            premultiplied_r: r*a,
            premultiplied_g: g*a,
            premultiplied_b: b*a,
        }
    }
    pub fn new_optional(r:Option<f32>, g:Option<f32>, b:Option<f32>, a:Option<f32>) -> Colour {
        Colour::new( r.unwrap_or(0.0), g.unwrap_or(0.0), b.unwrap_or(0.0), a.unwrap_or(0.0) )
    }

    pub fn r(&self) -> f32 { self.r }
    pub fn g(&self) -> f32 { self.g }
    pub fn b(&self) -> f32 { self.b }
    pub fn a(&self) -> f32 { self.a }

    pub fn premultiplied_r(&self) -> f32 { self.premultiplied_r }
    pub fn premultiplied_g(&self) -> f32 { self.premultiplied_g }
    pub fn premultiplied_b(&self) -> f32 { self.premultiplied_b }
}
impl Colour {
    pub fn from_js_sys_object(object:&js_sys::Object) -> Colour {
        Colour::new_optional(
            get_value_from_object__f32("r", object, true),
            get_value_from_object__f32("g", object, true),
            get_value_from_object__f32("b", object, true),
            get_value_from_object__f32("a", object, true),
        )
    }
    pub fn to_js_sys_object(&self) -> js_sys::Object {
        let object = js_sys::Object::new();
        js_sys::Reflect::set( &object, &JsValue::from_str("r"), &JsValue::from_f64(self.r() as f64) ).unwrap();
        js_sys::Reflect::set( &object, &JsValue::from_str("g"), &JsValue::from_f64(self.g() as f64) ).unwrap();
        js_sys::Reflect::set( &object, &JsValue::from_str("b"), &JsValue::from_f64(self.b() as f64) ).unwrap();
        js_sys::Reflect::set( &object, &JsValue::from_str("a"), &JsValue::from_f64(self.a() as f64) ).unwrap();
        object
    }
}

impl Colour {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        write!(
            f, "{{r:{}, g:{}, b:{}, a:{} (premultiplied_r:{} premultiplied_g:{} premultiplied_b:{})}}",
            self.r,
            self.g,
            self.b,
            self.a,
            self.premultiplied_r,
            self.premultiplied_g,
            self.premultiplied_b,
        )
    }
}

impl fmt::Display for Colour {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for Colour {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}