#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod bitcrusher;
    use bitcrusher::Bitcrusher;




lazy_static! {
    static ref BITCRUSHER: Mutex<Bitcrusher> = Mutex::new(Bitcrusher::new());
}

#[no_mangle]
pub extern "C" fn get_input_pointer() -> *mut f32 {
    BITCRUSHER.lock().unwrap().get_input_pointer()
}
#[no_mangle]
pub extern "C" fn get_output_pointer() -> *mut f32 {
    BITCRUSHER.lock().unwrap().get_output_pointer()
}
#[no_mangle]
pub extern "C" fn process(
    amplitudeResolution: f32,
    sampleFrequency: usize,
) {
    BITCRUSHER.lock().unwrap().process(amplitudeResolution, sampleFrequency);
}