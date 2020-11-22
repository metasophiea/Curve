#![allow(non_snake_case)]

#[macro_use]
extern crate lazy_static;

//rust
    use std::sync::Mutex;

//local
    mod wave_data;
    mod integrated_synthesizer;
    use integrated_synthesizer::IntegratedSynthesizer;




lazy_static! {
    static ref INTEGRATED_SYNTHESIZER: Mutex<IntegratedSynthesizer> = Mutex::new(IntegratedSynthesizer::new());
}



//buffers
    #[no_mangle]
    pub extern "C" fn get_gain_pointer() -> *mut f32 { INTEGRATED_SYNTHESIZER.lock().unwrap().get_gain_buffer() }
    #[no_mangle]
    pub extern "C" fn get_detune_pointer() -> *mut f32 { INTEGRATED_SYNTHESIZER.lock().unwrap().get_detune_buffer() }
    #[no_mangle]
    pub extern "C" fn get_duty_cycle_pointer() -> *mut f32 { INTEGRATED_SYNTHESIZER.lock().unwrap().get_duty_cycle_buffer() }
    #[no_mangle]
    pub extern "C" fn get_output_pointer() -> *mut f32 { INTEGRATED_SYNTHESIZER.lock().unwrap().get_output_pointer() }

//change value
    #[no_mangle]
    pub extern "C" fn select_waveform(waveform_index:usize) { INTEGRATED_SYNTHESIZER.lock().unwrap().select_waveform(waveform_index); }

//performance control
    #[no_mangle]
    pub extern "C" fn perform(frequency:f32, velocity:f32) { INTEGRATED_SYNTHESIZER.lock().unwrap().perform(frequency as f64, velocity); }
    #[no_mangle]
    pub extern "C" fn stop_all() { INTEGRATED_SYNTHESIZER.lock().unwrap().stop_all(); }

//main process
    #[no_mangle]
    pub extern "C" fn process(
        gain_useFirstOnly: bool,
        detune_useFirstOnly: bool,
        duty_cycle_useFirstOnly: bool,
    ) {
        INTEGRATED_SYNTHESIZER.lock().unwrap().process(
            gain_useFirstOnly,
            detune_useFirstOnly,
            duty_cycle_useFirstOnly,
        );
    }