extern "C" {
    pub fn Math_random() -> f32;
}
pub fn generate_random_number() -> f32 { unsafe { Math_random() } }
extern "C" {
    pub fn debug_(id: i32, v1: f32);
}
pub fn debug(id: i32, v1: f32) { unsafe { debug_(id, v1) } }

static SAMPLE_RATE:f64 = 44100.0;

//struct description
    pub struct AudioBuffer {
        rate_buffer: [f32; 128],
        output_buffer: [f32; 128],

        audio_data_shovel: [f32; 128],
        audio_data: Vec<f32>,

        playing: bool,
        position: usize,
    }

//new
    impl AudioBuffer {
        pub fn new() -> AudioBuffer {
            AudioBuffer {
                rate_buffer: [0.0; 128],
                output_buffer: [0.0; 128],
                audio_data_shovel: [0.0; 128],
                audio_data: vec![],

                playing: false,
                position: 0,
            }
        }
    }

//buffer
    impl AudioBuffer {
        pub fn get_rate_pointer(&mut self) -> *mut f32 {
            self.rate_buffer.as_mut_ptr() as *mut f32
        }
        pub fn get_audio_data_shovel_pointer(&mut self) -> *mut f32 {
            self.audio_data_shovel.as_mut_ptr() as *mut f32
        }
        pub fn get_output_pointer(&mut self) -> *mut f32 {
            self.output_buffer.as_mut_ptr() as *mut f32
        }
    }

//audio data
    impl AudioBuffer {
        pub fn clear_audio_data(&mut self) {
            self.audio_data.clear();
            self.position = 0;
        }
        // pub fn load_audio_data(&mut self, data:Vec<f32>) {
        //     self.audio_data = data;
        //     self.position = 0;
        // }
        pub fn append_shovel_audio_data(&mut self, limit:usize){
            self.audio_data.extend_from_slice( &self.audio_data_shovel[0..limit] );
        }
    }


//main processor
    impl AudioBuffer {
        pub fn process(
            &mut self,
            rate_useFirstOnly: bool,
        ){
            if !self.playing { return; }

            for index in 0..128 {
                if self.position >= self.audio_data.len() {
                    self.playing = false;
                    break;
                }

                self.output_buffer[index] = self.audio_data[self.position];
                self.position += 1;
            }
        }
    }