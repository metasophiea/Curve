#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod gain;
    use gain::Gain;


lazy_static! {
    static ref GAIN: Mutex<Gain> = Mutex::new(Gain::new());
}

#[no_mangle]
pub extern "C" fn get_input_1_pointer() -> *mut f32 { GAIN.lock().unwrap().get_input_1_pointer() }
#[no_mangle]
pub extern "C" fn get_input_2_pointer() -> *mut f32 { GAIN.lock().unwrap().get_input_2_pointer() }
#[no_mangle]
pub extern "C" fn get_output_pointer() -> *mut f32 { GAIN.lock().unwrap().get_output_pointer() }

#[no_mangle]
pub extern "C" fn process(gain_useFirstOnly:bool) {
    GAIN.lock().unwrap().process(gain_useFirstOnly);
}