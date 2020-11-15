#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod lag_processor;
    use lag_processor::LagProcessor;


lazy_static! {
    static ref LAG_PROCESSOR: Mutex<LagProcessor> = Mutex::new(LagProcessor::new());
}

#[no_mangle]
pub extern "C" fn get_input_pointer() -> *mut f32 { LAG_PROCESSOR.lock().unwrap().get_input_pointer() }
#[no_mangle]
pub extern "C" fn get_output_pointer() -> *mut f32 { LAG_PROCESSOR.lock().unwrap().get_output_pointer() }

#[no_mangle]
pub extern "C" fn process(samples:usize) {
    LAG_PROCESSOR.lock().unwrap().process(samples);
}