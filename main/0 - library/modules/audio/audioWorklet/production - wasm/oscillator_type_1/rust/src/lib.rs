#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod oscillator;
    use oscillator::SimpleOscillator;




lazy_static! {
    static ref SIMPLE_OSCILLATOR: Mutex<SimpleOscillator> = Mutex::new(SimpleOscillator::new());
}



//buffers
    #[no_mangle]
    pub extern "C" fn get_frequency_pointer() -> *mut f32 { SIMPLE_OSCILLATOR.lock().unwrap().get_frequency_buffer() }
    #[no_mangle]
    pub extern "C" fn get_gain_pointer() -> *mut f32 { SIMPLE_OSCILLATOR.lock().unwrap().get_gain_buffer() }
    #[no_mangle]
    pub extern "C" fn get_detune_pointer() -> *mut f32 { SIMPLE_OSCILLATOR.lock().unwrap().get_detune_buffer() }
    #[no_mangle]
    pub extern "C" fn get_duty_cycle_pointer() -> *mut f32 { SIMPLE_OSCILLATOR.lock().unwrap().get_duty_cycle_buffer() }
    #[no_mangle]
    pub extern "C" fn get_output_pointer() -> *mut f32 { SIMPLE_OSCILLATOR.lock().unwrap().get_output_pointer() }

//start/stop
    #[no_mangle]
    pub extern "C" fn start(velocity:f32) { SIMPLE_OSCILLATOR.lock().unwrap().running(true, Some(velocity)); }
    #[no_mangle]
    pub extern "C" fn stop() { SIMPLE_OSCILLATOR.lock().unwrap().running(false, None); }

//change value
    #[no_mangle]
    pub extern "C" fn select_waveform(waveform_index:usize) { SIMPLE_OSCILLATOR.lock().unwrap().select_waveform(waveform_index)  }

//main process
    #[no_mangle]
    pub extern "C" fn process(
        frequency_useFirstOnly: bool,
        gain_useFirstOnly: bool,
        detune_useFirstOnly: bool,
        duty_cycle_useFirstOnly: bool,
    ) {
        SIMPLE_OSCILLATOR.lock().unwrap().process(
            frequency_useFirstOnly,
            gain_useFirstOnly,
            detune_useFirstOnly,
            duty_cycle_useFirstOnly,
        );
    }