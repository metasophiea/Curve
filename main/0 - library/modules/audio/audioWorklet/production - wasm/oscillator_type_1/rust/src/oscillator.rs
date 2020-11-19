extern "C" {
    pub fn Math_random() -> f32;
}
pub fn generate_random_number() -> f32 { unsafe { Math_random() } }
// extern "C" {
//     pub fn debug_(id: i32, v1: f32);
// }
// pub fn debug(id: i32, v1: f32) { unsafe { debug_(id, v1) } }

static SAMPLE_RATE:f64 = 44100.0;

//struct description
    pub struct SimpleOscillator {
        running: bool,
        velocity: f32,

        frequency_buffer: [f32; 128],
        gain_buffer: [f32; 128],
        detune_buffer: [f32; 128],
        duty_cycle_buffer: [f32; 128],
        output_buffer: [f32; 128],

        selected_waveform_index: usize, // sine / square / triangle / noise

        wave_position: f64,
    }

//new
    impl SimpleOscillator {
        pub fn new() -> SimpleOscillator {
            SimpleOscillator {
                running: false,
                velocity: 0.0,

                frequency_buffer: [0.0; 128],
                gain_buffer: [0.0; 128],
                detune_buffer: [0.0; 128],
                duty_cycle_buffer: [0.0; 128],
                output_buffer: [0.0; 128],

                selected_waveform_index: 0,

                wave_position: 0.0,
            }
        }
    }

//buffer
    impl SimpleOscillator {
        pub fn get_frequency_buffer(&mut self) -> *mut f32 {
            self.frequency_buffer.as_mut_ptr() as *mut f32
        }
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
    impl SimpleOscillator {
        pub fn running(&mut self, state:bool, velocity:Option<f32>) {
            self.running = state;
            self.velocity = match velocity {
                None => 0.0,
                Some(v) => v,
            };
        }
        pub fn select_waveform(&mut self, waveform_index:usize) {
            self.selected_waveform_index = waveform_index;
        }
    }

//main processor
    impl SimpleOscillator {
        pub fn process(
            &mut self,
            frequency_useFirstOnly: bool,
            gain_useFirstOnly: bool,
            detune_useFirstOnly: bool,
            duty_cycle_useFirstOnly: bool,
        ){
            if !self.running {
                for index in 0..128 {
                    self.output_buffer[index] = 0.0;
                }
                return;
            }

            fn preamble(
                this: &mut SimpleOscillator,

                frequency_useFirstOnly: bool,
                detune_useFirstOnly: bool,
                duty_cycle_useFirstOnly: bool,

                index: usize,
            ) -> (f64, f64) {
                let frequency = (if frequency_useFirstOnly { this.frequency_buffer[0] } else { this.frequency_buffer[index] }) as f64;
                let detune = (if detune_useFirstOnly { this.detune_buffer[0] } else { this.detune_buffer[index] }) as f64;

                this.wave_position += (frequency * (detune + 1.0))/SAMPLE_RATE;

                (
                    this.wave_position - this.wave_position.trunc(), //local_wave_position
                    (if duty_cycle_useFirstOnly { this.duty_cycle_buffer[0] } else { this.duty_cycle_buffer[index] }) as f64 //duty_cycle
                )
            }

            match self.selected_waveform_index {
                0 => { //sine
                    for index in 0..128 {
                        let gain = (if gain_useFirstOnly { self.gain_buffer[0] } else { self.gain_buffer[index] }) as f64;
                        let (local_wave_position, _duty_cycle) = preamble(self, frequency_useFirstOnly, detune_useFirstOnly, duty_cycle_useFirstOnly, index);
                        self.output_buffer[index] = (((local_wave_position * std::f64::consts::TAU).sin() * gain) as f32) * self.velocity;
                    }
                },
                1 => { //square
                    for index in 0..128 {
                        let gain = (if gain_useFirstOnly { self.gain_buffer[0] } else { self.gain_buffer[index] }) as f64;
                        let (local_wave_position, duty_cycle) = preamble(self, frequency_useFirstOnly, detune_useFirstOnly, duty_cycle_useFirstOnly, index);
                        self.output_buffer[index] = ((if local_wave_position < duty_cycle { 1.0 } else { -1.0 } * gain) as f32) * self.velocity;
                    }
                },
                2 => { //triangle
                    for index in 0..128 {
                        let gain = (if gain_useFirstOnly { self.gain_buffer[0] } else { self.gain_buffer[index] }) as f64;
                        let (local_wave_position, duty_cycle) = preamble(self, frequency_useFirstOnly, detune_useFirstOnly, duty_cycle_useFirstOnly, index);

                        self.output_buffer[index] = ((if local_wave_position < (duty_cycle / 2.0) {
                            (2.0*local_wave_position) / duty_cycle
                        } else if local_wave_position >= (1.0 - duty_cycle/2.0) {
                            (2.0*local_wave_position - 2.0) / duty_cycle
                        } else {
                            (2.0*local_wave_position - 1.0) / (duty_cycle - 1.0)
                        } * gain) as f32) * self.velocity;
                    }
                },
                3 => { //noise
                    for index in 0..128 {
                        let gain = (if gain_useFirstOnly { self.gain_buffer[0] } else { self.gain_buffer[index] }) as f64;
                        self.output_buffer[index] = (2.0*generate_random_number() - 1.0) * (gain as f32) * self.velocity;
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