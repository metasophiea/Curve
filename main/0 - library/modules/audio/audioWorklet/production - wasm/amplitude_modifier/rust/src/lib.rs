#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod amplitude_modifier;
    use amplitude_modifier::AmplitudeModifier;




lazy_static! {
    static ref AMPLITUDE_MODIFIER: Mutex<AmplitudeModifier> = Mutex::new(AmplitudeModifier::new());
}

#[no_mangle]
pub extern "C" fn get_input_pointer() -> *mut f32 { AMPLITUDE_MODIFIER.lock().unwrap().get_input_pointer() }
#[no_mangle]
pub extern "C" fn get_output_pointer() -> *mut f32 { AMPLITUDE_MODIFIER.lock().unwrap().get_output_pointer() }
#[no_mangle]
pub extern "C" fn get_divisor_pointer() -> *mut f32 { AMPLITUDE_MODIFIER.lock().unwrap().get_divisor_pointer() }
#[no_mangle]
pub extern "C" fn get_offset_pointer() -> *mut f32 { AMPLITUDE_MODIFIER.lock().unwrap().get_offset_pointer() }
#[no_mangle]
pub extern "C" fn get_floor_pointer() -> *mut f32 { AMPLITUDE_MODIFIER.lock().unwrap().get_floor_pointer() }
#[no_mangle]
pub extern "C" fn get_ceiling_pointer() -> *mut f32 { AMPLITUDE_MODIFIER.lock().unwrap().get_ceiling_pointer() }

#[no_mangle]
pub extern "C" fn process(
    sign: f32,
    divisor_useFirstOnly: bool,
    offset_useFirstOnly: bool,
    floor_useFirstOnly: bool,
    ceiling_useFirstOnly: bool,
) {
    AMPLITUDE_MODIFIER.lock().unwrap().process(
        sign,
        divisor_useFirstOnly,
        offset_useFirstOnly,
        floor_useFirstOnly,
        ceiling_useFirstOnly,
    );
}