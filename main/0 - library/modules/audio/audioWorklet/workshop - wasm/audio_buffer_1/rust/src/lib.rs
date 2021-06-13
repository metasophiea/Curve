#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod audio_buffer;
    use audio_buffer::AudioBuffer;

extern "C" {
    pub fn debug_(id: i32, v1: f32);
}
pub fn debug(id: i32, v1: f32) { unsafe { debug_(id, v1) } }




lazy_static! {
    static ref AUDIO_BUFFER: Mutex<AudioBuffer> = Mutex::new(AudioBuffer::new());
}



//buffers
    #[no_mangle]
    pub extern "C" fn get_rate_pointer() -> *mut f32 { AUDIO_BUFFER.lock().unwrap().get_rate_pointer() }
    #[no_mangle]
    pub extern "C" fn get_audio_data_shovel_pointer() -> *mut f32 { AUDIO_BUFFER.lock().unwrap().get_audio_data_shovel_pointer() }
    #[no_mangle]
    pub extern "C" fn get_output_pointer() -> *mut f32 { AUDIO_BUFFER.lock().unwrap().get_output_pointer() }
    #[no_mangle]
    pub extern "C" fn clear_audio_data() { AUDIO_BUFFER.lock().unwrap().clear_audio_data(); }
    #[no_mangle]
    pub extern "C" fn shovel_load_audio_data(limit:usize) {
        AUDIO_BUFFER.lock().unwrap().append_shovel_audio_data(limit);
    }

//main process
    #[no_mangle]
    pub extern "C" fn process(
        rate_useFirstOnly: bool,
    ) {
        AUDIO_BUFFER.lock().unwrap().process(
            rate_useFirstOnly,
        );
    }