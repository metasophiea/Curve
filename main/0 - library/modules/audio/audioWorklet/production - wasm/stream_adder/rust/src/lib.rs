#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod stream_adder;
    use stream_adder::StreamAdder;




lazy_static! {
    static ref STREAM_ADDER: Mutex<StreamAdder> = Mutex::new(StreamAdder::new());
}

#[no_mangle]
pub extern "C" fn get_input_1_pointer() -> *mut f32 { STREAM_ADDER.lock().unwrap().get_input_1_pointer() }
#[no_mangle]
pub extern "C" fn get_input_2_pointer() -> *mut f32 { STREAM_ADDER.lock().unwrap().get_input_2_pointer() }
#[no_mangle]
pub extern "C" fn get_mix_control_pointer() -> *mut f32 { STREAM_ADDER.lock().unwrap().get_mix_control_pointer() }
#[no_mangle]
pub extern "C" fn get_output_pointer() -> *mut f32 { STREAM_ADDER.lock().unwrap().get_output_pointer() }

#[no_mangle]
pub extern "C" fn process(mix_control_useFirstOnly: bool) {
    STREAM_ADDER.lock().unwrap().process(mix_control_useFirstOnly);
}