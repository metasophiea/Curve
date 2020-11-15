#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod simple_oscillator;
    use simple_oscillator::SimpleOscillator;




lazy_static! {
    static ref SIMPLE_OSCILLATOR: Mutex<SimpleOscillator> = Mutex::new(SimpleOscillator::new());
}

#[no_mangle]
pub extern "C" fn get_output_pointer() -> *mut f32 { SIMPLE_OSCILLATOR.lock().unwrap().get_output_pointer() }

#[no_mangle]
pub extern "C" fn process() {
    SIMPLE_OSCILLATOR.lock().unwrap().process();
}