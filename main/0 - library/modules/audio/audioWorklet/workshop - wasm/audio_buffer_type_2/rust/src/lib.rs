#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod playhead;
    mod audio_buffer;
    use audio_buffer::AudioBuffer;

lazy_static! {
    static ref AUDIO_BUFFER: Mutex<AudioBuffer> = Mutex::new(AudioBuffer::new());
}


//buffer pointers
    #[no_mangle]
    pub extern "C" fn get_playhead_position_readout_pointer() -> *mut usize { AUDIO_BUFFER.lock().unwrap().get_playhead_position_readout_pointer() }
    #[no_mangle]
    pub extern "C" fn get_output_pointer() -> *mut f32 { AUDIO_BUFFER.lock().unwrap().get_output_pointer() }
    #[no_mangle]
    pub extern "C" fn get_rate_pointer() -> *mut f32 { AUDIO_BUFFER.lock().unwrap().get_rate_pointer() }
    #[no_mangle]
    pub extern "C" fn get_audio_buffer_shovel_pointer() -> *mut f32 { AUDIO_BUFFER.lock().unwrap().get_audio_buffer_shovel_pointer() }

//performance control
    #[no_mangle]
    pub extern "C" fn play(playhead_id_defined:bool, playhead_id:usize) { 
        AUDIO_BUFFER.lock().unwrap().play(
            if playhead_id_defined { Some(playhead_id) } else { None }
        );
    }
    #[no_mangle]
    pub extern "C" fn stop(playhead_id_defined:bool, playhead_id:usize) { 
        AUDIO_BUFFER.lock().unwrap().stop(
            if playhead_id_defined { Some(playhead_id) } else { None }
        );
    }

    #[no_mangle]
    pub extern "C" fn set_loop_active(playhead_id_defined:bool, playhead_id:usize, active:bool) {
        AUDIO_BUFFER.lock().unwrap().set_loop_active(
            if playhead_id_defined { Some(playhead_id) } else { None }, active
        );
    }
    
    #[no_mangle]
    pub extern "C" fn set_playhead_position(playhead_id_defined:bool, playhead_id:usize, position:f32) {
        AUDIO_BUFFER.lock().unwrap().set_playhead_position(
            if playhead_id_defined { Some(playhead_id) } else { None }, position
        );
    }
    #[no_mangle]
    pub extern "C" fn go_to_start(playhead_id_defined:bool, playhead_id:usize) {
        AUDIO_BUFFER.lock().unwrap().go_to_start(
            if playhead_id_defined { Some(playhead_id) } else { None }
        );
    }
    #[no_mangle]
    pub extern "C" fn go_to_end(playhead_id_defined:bool, playhead_id:usize) {
        AUDIO_BUFFER.lock().unwrap().go_to_end(
            if playhead_id_defined { Some(playhead_id) } else { None }
        );
    }

    #[no_mangle]
    pub extern "C" fn section_start(playhead_id_defined:bool, playhead_id:usize, position:usize) {
        AUDIO_BUFFER.lock().unwrap().section_start(
            if playhead_id_defined { Some(playhead_id) } else { None }, position
        );
    }
    #[no_mangle]
    pub extern "C" fn section_end(playhead_id_defined:bool, playhead_id:usize, position:usize) {
        AUDIO_BUFFER.lock().unwrap().section_end(
            if playhead_id_defined { Some(playhead_id) } else { None }, position
        );
    }
    #[no_mangle]
    pub extern "C" fn maximize_section(playhead_id_defined:bool, playhead_id:usize) {
        AUDIO_BUFFER.lock().unwrap().maximize_section(
            if playhead_id_defined { Some(playhead_id) } else { None }
        );
    }
    #[no_mangle]
    pub extern "C" fn invert_section(playhead_id_defined:bool, playhead_id:usize) {
        AUDIO_BUFFER.lock().unwrap().invert_section(
            if playhead_id_defined { Some(playhead_id) } else { None }
        );
    }

//audio buffer / shovel control
    #[no_mangle]
    pub extern "C" fn clear_audio_buffer() { AUDIO_BUFFER.lock().unwrap().clear_audio_buffer(); }
    #[no_mangle]
    pub extern "C" fn get_shovel_size() -> usize { AudioBuffer::get_shovel_size() }
    #[no_mangle]
    pub extern "C" fn shovel_audio_data_in(limit:usize) { AUDIO_BUFFER.lock().unwrap().append_shovel_audio_data(limit); }

//process
    #[no_mangle]
    pub extern "C" fn process(
        rate_useFirstOnly: bool,
    ) {
        AUDIO_BUFFER.lock().unwrap().process(rate_useFirstOnly);
    }