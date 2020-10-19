//rust
    use std::fmt;

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn error(a: &str);
    }
    macro_rules! console_error {
        ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{
        Point
    };
    use crate::a_library::wasm::from_js_sys::{
        get_value_from_object__f32,
        get_value_from_object__u8,
        get_value_from_object__u32,
        get_value_from_object__i32,
        get_value_from_object__bool,
        get_value_from_object__string,
    };




    



fn generic_err(event_type:&str, key:&str) {
    console_error!("{}::from_js_sys_object - could not decode {}", event_type, key);
}








pub struct KeyboardEvent {
    key: String,
    code: String,
    key_code: u32,
    alt_key: bool,
    ctrl_key: bool,
    meta_key: bool,
    shift_key: bool,
}
impl KeyboardEvent {
    pub fn new(
        key: String,
        code: String,
        key_code: u32,
        alt_key: bool,
        ctrl_key: bool,
        meta_key: bool,
        shift_key: bool,
    ) -> KeyboardEvent {
        KeyboardEvent {
            key,
            code,
            key_code,
            alt_key,
            ctrl_key,
            meta_key,
            shift_key,
        }
    }

    pub fn get_key(&self) -> &String { &self.key }
    pub fn get_code(&self) -> &String { &self.code }
    pub fn get_key_code(&self) -> u32 { self.key_code }
    pub fn get_alt_key(&self) -> bool { self.alt_key }
    pub fn get_ctrl_key(&self) -> bool { self.ctrl_key }
    pub fn get_meta_key(&self) -> bool { self.meta_key }
    pub fn get_shift_key(&self) -> bool { self.shift_key }
}
impl KeyboardEvent {
    pub fn from_js_sys_object(object:&js_sys::Object) -> Option<KeyboardEvent> {
        fn err(key:&str) { generic_err("KeyboardEvent",key); }

        let key = match get_value_from_object__string("key", object, true) {
            Some(a) => a, None => { err("key"); return None; },
        };
        let code = match get_value_from_object__string("code", object, true) {
            Some(a) => a, None => { err("code"); return None; },
        };
        let key_code = match get_value_from_object__u32("keyCode", object, true) {
            Some(a) => a, None => { err("keyCode"); return None; },
        };
        let alt_key = match get_value_from_object__bool("altKey", object, true) {
            Some(a) => a, None => { err("altKey"); return None; },
        };
        let ctrl_key = match get_value_from_object__bool("ctrlKey", object, true) {
            Some(a) => a, None => { err("ctrlKey"); return None; },
        };
        let meta_key = match get_value_from_object__bool("metaKey", object, true) {
            Some(a) => a, None => { err("metaKey"); return None; }
        };
        let shift_key = match get_value_from_object__bool("shiftKey", object, true) {
            Some(a) => a, None => { err("shiftKey"); return None; }
        };

        Some( KeyboardEvent::new( key, code, key_code, alt_key, ctrl_key, meta_key, shift_key ) )
    }
    pub fn to_js_sys_object(&self) -> js_sys::Object {
        let output = js_sys::Object::new();

        js_sys::Reflect::set( &output, &JsValue::from_str("key"), &JsValue::from_str(&self.key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("code"), &JsValue::from_str(&self.code) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("keyCode"), &JsValue::from_f64(self.key_code as f64) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("altKey"), &JsValue::from_bool(self.alt_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("ctrlKey"), &JsValue::from_bool(self.ctrl_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("metaKey"), &JsValue::from_bool(self.meta_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("shiftKey"), &JsValue::from_bool(self.shift_key) ).unwrap();

        output
    }
}
impl KeyboardEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f, 
            "{{key:{:?}, code:{:?}, key_code:{:?}, alt_key:{:?}, ctrl_key:{:?}, meta_key:{:?}, shift_key:{:?}}}",
            self.key,
            self.code,
            self.key_code,
            self.alt_key,
            self.ctrl_key,
            self.meta_key,
            self.shift_key,
        )
    }
}
impl fmt::Display for KeyboardEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for KeyboardEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}








pub struct WheelEvent {
    x: f32,
    y: f32,
    wheel_delta: i32,
    wheel_delta_x: i32,
    wheel_delta_y: i32,
    alt_key: bool,
    ctrl_key: bool,
    meta_key: bool,
    shift_key: bool,
}
impl WheelEvent {
    pub fn new(
        x: f32,
        y: f32,
        wheel_delta: i32,
        wheel_delta_x: i32,
        wheel_delta_y: i32,
        alt_key: bool,
        ctrl_key: bool,
        meta_key: bool,
        shift_key: bool,
    ) -> WheelEvent {
        WheelEvent {
            x,
            y,
            wheel_delta,
            wheel_delta_x,
            wheel_delta_y,
            alt_key,
            ctrl_key,
            meta_key,
            shift_key,
        }
    }

    pub fn get_x(&self) -> f32 { self.x }
    pub fn get_y(&self) -> f32 { self.y }
    pub fn get_xy_point(&self) -> Point { Point::new(self.x,self.y) }
    pub fn get_wheel_delta(&self) -> i32 { self.wheel_delta }
    pub fn get_wheel_delta_x(&self) -> i32 { self.wheel_delta_x }
    pub fn get_wheel_delta_y(&self) -> i32 { self.wheel_delta_y }
    pub fn get_alt_key(&self) -> bool { self.alt_key }
    pub fn get_ctrl_key(&self) -> bool { self.ctrl_key }
    pub fn get_meta_key(&self) -> bool { self.meta_key }
    pub fn get_shift_key(&self) -> bool { self.shift_key }
}
impl WheelEvent {
    pub fn from_js_sys_object(object:&js_sys::Object) -> Option<WheelEvent> {
        fn err(key:&str) { generic_err("WheelEvent",key); }

        let x = match get_value_from_object__f32("x", object, true) {
            Some(a) => a, None => { err("x"); return None; },
        };
        let y = match get_value_from_object__f32("y", object, true) {
            Some(a) => a, None => { err("y"); return None; },
        };
        let wheel_delta = match get_value_from_object__i32("wheelDelta", object, true) {
            Some(a) => a, None => { err("wheelDelta"); return None; },
        };
        let wheel_delta_x = match get_value_from_object__i32("wheelDeltaX", object, true) {
            Some(a) => a, None => { err("wheelDeltaX"); return None; },
        };
        let wheel_delta_y = match get_value_from_object__i32("wheelDeltaY", object, true) {
            Some(a) => a, None => { err("wheelDeltaY"); return None; },
        };
        let alt_key = match get_value_from_object__bool("altKey", object, true) {
            Some(a) => a, None => { err("altKey"); return None; },
        };
        let ctrl_key = match get_value_from_object__bool("ctrlKey", object, true) {
            Some(a) => a, None => { err("ctrlKey"); return None; },
        };
        let meta_key = match get_value_from_object__bool("metaKey", object, true) {
            Some(a) => a, None => { err("metaKey"); return None; }
        };
        let shift_key = match get_value_from_object__bool("shiftKey", object, true) {
            Some(a) => a, None => { err("shiftKey"); return None; }
        };

        Some( WheelEvent::new( x, y, wheel_delta, wheel_delta_x, wheel_delta_y, alt_key, ctrl_key, meta_key, shift_key ) )
    }
    pub fn to_js_sys_object(&self) -> js_sys::Object {
        let output = js_sys::Object::new();

        js_sys::Reflect::set( &output, &JsValue::from_str("x"), &JsValue::from_f64(self.x as f64) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("y"), &JsValue::from_f64(self.y as f64) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("wheelDelta"), &JsValue::from_f64(self.wheel_delta as f64) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("wheelDeltaX"), &JsValue::from_f64(self.wheel_delta_x as f64) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("wheelDeltaY"), &JsValue::from_f64(self.wheel_delta_y as f64) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("altKey"), &JsValue::from_bool(self.alt_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("ctrlKey"), &JsValue::from_bool(self.ctrl_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("metaKey"), &JsValue::from_bool(self.meta_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("shiftKey"), &JsValue::from_bool(self.shift_key) ).unwrap();

        output
    }
}
impl WheelEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f, 
            "{{x:{:?}, y:{:?}, wheel_delta:{:?}, wheel_delta_x:{:?}, wheel_delta_y:{:?}, alt_key:{:?}, ctrl_key:{:?}, meta_key:{:?}, shift_key:{:?}}}",
            self.x,
            self.y,
            self.wheel_delta,
            self.wheel_delta_x,
            self.wheel_delta_y,
            self.alt_key,
            self.ctrl_key,
            self.meta_key,
            self.shift_key,
        )
    }
}
impl fmt::Display for WheelEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for WheelEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}








pub struct MouseEvent {
    x: f32,
    y: f32,
    alt_key: bool,
    ctrl_key: bool,
    meta_key: bool,
    shift_key: bool,
    buttons: u8,
}
impl MouseEvent {
    pub fn new(
        x: f32,
        y: f32,
        alt_key: bool,
        ctrl_key: bool,
        meta_key: bool,
        shift_key: bool,
        buttons: u8,
    ) -> MouseEvent {
        MouseEvent {
            x,
            y,
            alt_key,
            ctrl_key,
            meta_key,
            shift_key,
            buttons,
        }
    }

    pub fn get_x(&self) -> f32 { self.x }
    pub fn get_y(&self) -> f32 { self.y }
    pub fn get_xy_point(&self) -> Point { Point::new(self.x,self.y) }
    pub fn get_alt_key(&self) -> bool { self.alt_key }
    pub fn get_ctrl_key(&self) -> bool { self.ctrl_key }
    pub fn get_meta_key(&self) -> bool { self.meta_key }
    pub fn get_shift_key(&self) -> bool { self.shift_key }
    pub fn get_buttons(&self) -> u8 { self.buttons }
}
impl MouseEvent {
    pub fn from_js_sys_object(object:&js_sys::Object) -> Option<MouseEvent> {
        fn err(key:&str) { generic_err("MouseEvent",key); }

        let x = match get_value_from_object__f32("x", object, true) {
            Some(a) => a, None => { err("x"); return None; },
        };
        let y = match get_value_from_object__f32("y", object, true) {
            Some(a) => a, None => { err("y"); return None; },
        };
        let alt_key = match get_value_from_object__bool("altKey", object, true) {
            Some(a) => a, None => { err("altKey"); return None; },
        };
        let buttons = match get_value_from_object__u8("buttons", object, true) {
            Some(a) => a, None => { err("buttons"); return None; },
        };
        let ctrl_key = match get_value_from_object__bool("ctrlKey", object, true) {
            Some(a) => a, None => { err("ctrlKey"); return None; },
        };
        let meta_key = match get_value_from_object__bool("metaKey", object, true) {
            Some(a) => a, None => { err("metaKey"); return None; }
        };
        let shift_key = match get_value_from_object__bool("shiftKey", object, true) {
            Some(a) => a, None => { err("shiftKey"); return None; }
        };

        Some( MouseEvent::new( x, y, alt_key, ctrl_key, meta_key, shift_key, buttons ) )
    }
    pub fn to_js_sys_object(&self) -> js_sys::Object {
        let output = js_sys::Object::new();

        js_sys::Reflect::set( &output, &JsValue::from_str("x"), &JsValue::from_f64(self.x as f64) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("y"), &JsValue::from_f64(self.y as f64) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("altKey"), &JsValue::from_bool(self.alt_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("ctrlKey"), &JsValue::from_bool(self.ctrl_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("metaKey"), &JsValue::from_bool(self.meta_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("shiftKey"), &JsValue::from_bool(self.shift_key) ).unwrap();
        js_sys::Reflect::set( &output, &JsValue::from_str("buttons"), &JsValue::from_f64(self.buttons as f64) ).unwrap();

        output
    }
}
impl MouseEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f, "{{x:{:?}, y:{:?}, alt_key:{:?}, ctrl_key:{:?}, meta_key:{:?}, shift_key:{:?}, buttons:{:?}}}",
            self.x,
            self.y,
            self.alt_key,
            self.ctrl_key,
            self.meta_key,
            self.shift_key,
            self.buttons,
        )
    }
}
impl fmt::Display for MouseEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for MouseEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}