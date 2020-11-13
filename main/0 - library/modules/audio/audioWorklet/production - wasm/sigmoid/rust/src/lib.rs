#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod sigmoid;
    use sigmoid::Sigmoid;




lazy_static! {
    static ref SIGMOID: Mutex<Sigmoid> = Mutex::new(Sigmoid::new());
}

#[no_mangle]
pub extern "C" fn get_input_pointer() -> *mut f32 {
    SIGMOID.lock().unwrap().get_input_pointer()
}
#[no_mangle]
pub extern "C" fn get_output_pointer() -> *mut f32 {
    SIGMOID.lock().unwrap().get_output_pointer()
}
#[no_mangle]
pub extern "C" fn get_gain_pointer() -> *mut f32 {
    SIGMOID.lock().unwrap().get_gain_pointer()
}
#[no_mangle]
pub extern "C" fn get_sharpness_pointer() -> *mut f32 {
    SIGMOID.lock().unwrap().get_sharpness_pointer()
}

#[no_mangle]
pub extern "C" fn process(
    gain_useFirstOnly: bool,
    sharpness_useFirstOnly: bool,
) {
    SIGMOID.lock().unwrap().process(
        gain_useFirstOnly,
        sharpness_useFirstOnly,
    );
}