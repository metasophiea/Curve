#![allow(dead_code)]
#![allow(unused_variables)]

//external functions
    extern "C" {
        pub fn Math_random() -> f32;
    }
    pub fn generate_random_number() -> f32 { unsafe { Math_random() } }
    extern "C" {
        pub fn debug_(id: i32, v1: f32);
    }
    pub fn debug(id: i32, v1: f32) { unsafe { debug_(id, v1) } }


//rust
//local
    use crate::wave_data::WaveData;


//constants
    static SAMPLE_RATE:f64 = 44100.0;


//struct description
    pub struct IntegratedSynthesizer {
        gain_buffer: [f32; 128],
        detune_buffer: [f32; 128],
        duty_cycle_buffer: [f32; 128],
        output_buffer: [f32; 128],

        selected_waveform_index: usize, // sine / square / triangle

        waves: Vec<WaveData>,
    }

//new
    impl IntegratedSynthesizer {
        pub fn new() -> IntegratedSynthesizer {
            IntegratedSynthesizer {
                gain_buffer: [0.0; 128],
                detune_buffer: [0.0; 128],
                duty_cycle_buffer: [0.0; 128],
                output_buffer: [0.0; 128],

                selected_waveform_index: 0,

                waves: Vec::new(),
            }
        }
    }

//buffer
    impl IntegratedSynthesizer {
        pub fn get_gain_buffer(&mut self) -> *mut f32 {
            self.gain_buffer.as_mut_ptr() as *mut f32
        }
        pub fn get_detune_buffer(&mut self) -> *mut f32 {
            self.detune_buffer.as_mut_ptr() as *mut f32
        }
        pub fn get_duty_cycle_buffer(&mut self) -> *mut f32 {
            self.duty_cycle_buffer.as_mut_ptr() as *mut f32
        }
        pub fn get_output_pointer(&mut self) -> *mut f32 {
            self.output_buffer.as_mut_ptr() as *mut f32
        }
    }

//attribute modification
    impl IntegratedSynthesizer {
        pub fn select_waveform(&mut self, waveform_index:usize) {
            self.selected_waveform_index = waveform_index;
        }
    }


//performance control
    impl IntegratedSynthesizer {
        pub fn perform(&mut self, frequency:f64, velocity:f32) {
            for (index, wave) in self.waves.iter_mut().enumerate() {
                if wave.frequency == frequency {
                    if velocity == 0.0 {
                        self.waves.remove(index);
                    } else {
                        wave.velocity = velocity;
                    }
                    return;
                }
            }

            self.waves.push( 
                WaveData::new(frequency, velocity)
            );
        }
        pub fn stop_all(&mut self) {
            self.waves.clear();
        }
    }

//main processor
    impl IntegratedSynthesizer {
        pub fn process(
            &mut self,
            gain_useFirstOnly: bool,
            detune_useFirstOnly: bool,
            duty_cycle_useFirstOnly: bool,
        ){
            fn get_gain_detune_duty_cycle(
                this: &mut IntegratedSynthesizer,

                gain_useFirstOnly: bool,
                detune_useFirstOnly: bool,
                duty_cycle_useFirstOnly: bool,

                index: usize,
            ) -> (f64, f64, f64) {
                (
                    (if gain_useFirstOnly { this.gain_buffer[0] } else { this.gain_buffer[index] }) as f64,
                    (if detune_useFirstOnly { this.detune_buffer[0] } else { this.detune_buffer[index] }) as f64,
                    (if duty_cycle_useFirstOnly { this.duty_cycle_buffer[0] } else { this.duty_cycle_buffer[index] }) as f64,
                )
            }


            match self.selected_waveform_index {
                0 => { //sine
                    for index in 0..128 {
                        self.output_buffer[index] = 0.0;
                        let (gain, detune, duty_cycle) = get_gain_detune_duty_cycle(self, gain_useFirstOnly, detune_useFirstOnly, duty_cycle_useFirstOnly, index);

                        for wave in &mut self.waves {
                            wave.advance_wave_position(detune, SAMPLE_RATE);

                            let local_wave_amplitude = (wave.get_local_wave_position() * std::f64::consts::TAU).sin() * gain;

                            self.output_buffer[index] += (local_wave_amplitude as f32) * wave.velocity;
                        }
                    }
                },
                1 => { //square
                    for index in 0..128 {
                        self.output_buffer[index] = 0.0;
                        let (gain, detune, duty_cycle) = get_gain_detune_duty_cycle(self, gain_useFirstOnly, detune_useFirstOnly, duty_cycle_useFirstOnly, index);

                        for wave in &mut self.waves {
                            wave.advance_wave_position(detune, SAMPLE_RATE);

                            let local_wave_amplitude = if wave.get_local_wave_position() < duty_cycle { 1.0 } else { -1.0 } * gain;

                            self.output_buffer[index] += (local_wave_amplitude as f32) * wave.velocity;
                        }
                    }
                },
                2 => { //triangle
                    for index in 0..128 {
                        self.output_buffer[index] = 0.0;
                        let (gain, detune, duty_cycle) = get_gain_detune_duty_cycle(self, gain_useFirstOnly, detune_useFirstOnly, duty_cycle_useFirstOnly, index);

                        for wave in &mut self.waves {
                            wave.advance_wave_position(detune, SAMPLE_RATE);
                            
                            let local_wave_amplitude = if wave.get_local_wave_position() < (duty_cycle / 2.0) {
                                (2.0*wave.get_local_wave_position()) / duty_cycle
                            } else if wave.get_local_wave_position() >= (1.0 - duty_cycle/2.0) {
                                (2.0*wave.get_local_wave_position() - 2.0) / duty_cycle
                            } else {
                                (2.0*wave.get_local_wave_position() - 1.0) / (duty_cycle - 1.0)
                            } * gain;

                            self.output_buffer[index] += (local_wave_amplitude as f32) * wave.velocity;
                        }
                    }
                },
                _ => { //unknown selection
                    for index in 0..128 {
                        self.output_buffer[index] = 0.0;
                    }
                },
            }
        }
    }