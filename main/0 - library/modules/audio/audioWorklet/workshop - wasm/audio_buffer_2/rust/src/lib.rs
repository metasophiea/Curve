#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod audio_buffer;
    use audio_buffer::AudioBuffer;


lazy_static! {
    static ref AUDIO_BUFFER: Mutex<AudioBuffer> = Mutex::new(AudioBuffer::new());
}

#[no_mangle]
pub extern "C" fn get_shovel_size() -> usize { AudioBuffer::get_shovel_size() }
#[no_mangle]
pub extern "C" fn get_output_pointer() -> *mut f32 { AUDIO_BUFFER.lock().unwrap().get_output_pointer() }
#[no_mangle]
pub extern "C" fn get_audio_buffer_shovel_pointer() -> *mut f32 { AUDIO_BUFFER.lock().unwrap().get_audio_buffer_shovel_pointer() }
#[no_mangle]
pub extern "C" fn clear_audio_buffer() { AUDIO_BUFFER.lock().unwrap().clear_audio_buffer(); }
#[no_mangle]
pub extern "C" fn shovel_audio_data_in(limit:usize) { AUDIO_BUFFER.lock().unwrap().append_shovel_audio_data(limit); }

#[no_mangle]
pub extern "C" fn process() {
    AUDIO_BUFFER.lock().unwrap().process();
}