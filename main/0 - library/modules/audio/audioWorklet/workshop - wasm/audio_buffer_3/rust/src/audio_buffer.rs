#![allow(dead_code)]




const FRAME_SIZE:usize = 128; //matches the browser's frame size: 128
const SAMPLE_RATE:usize = 44100; //matches the browser's sample rate: 44100
const SHOVEL_SIZE:usize = 512;
//minimum time step size = FRAME_SIZE / SAMPLE_RATE = 128/44100 = 2.9024943310657596 milliseconds




//definition
    pub struct AudioBuffer {
        //output buffer
            output_buffer: [f32; FRAME_SIZE],
            position_readout_buffer: [usize; 1],

        //main audio data
            audio_data: Vec<f32>,

        //input buffers
            rate_buffer: [f32; FRAME_SIZE],

        //shovel
            audio_buffer_shovel: [f32; SHOVEL_SIZE],

        //status
            playing: bool,
            position: usize,
            section_start: f32,
            section_end: f32,
            loop_active: bool,
    }
//creation
    impl AudioBuffer {
        pub fn new() -> AudioBuffer {
            AudioBuffer {
                //output buffer
                    output_buffer: [0.0; FRAME_SIZE],
                    position_readout_buffer: [0; 1],

                //main audio data
                    audio_data: vec![],

                //input buffers
                    rate_buffer: [0.0; FRAME_SIZE],

                //shovel
                    audio_buffer_shovel: [0.0; SHOVEL_SIZE],

                //status
                    playing: !false,
                    position: 0,
                    section_start: 0.0,
                    section_end: 1.0,
                    loop_active: false,
            }
        }
    }

//buffer pointers
    impl AudioBuffer {
        pub fn get_position_readout_pointer(&self) -> *mut usize {
            self.position_readout_buffer.as_ptr() as *mut usize
        }
        pub fn get_output_pointer(&mut self) -> *mut f32 {
            self.output_buffer.as_mut_ptr() as *mut f32
        }
        pub fn get_rate_pointer(&mut self) -> *mut f32 {
            self.rate_buffer.as_mut_ptr() as *mut f32
        }
        pub fn get_audio_buffer_shovel_pointer(&mut self) -> *mut f32 {
            self.audio_buffer_shovel.as_mut_ptr() as *mut f32
        }
    }

//performance control
    impl AudioBuffer {
        pub fn play(&mut self) {
            self.playing = true;
        }
        pub fn pause(&mut self) {
            self.playing = false;
        }
        pub fn return_play_position(&mut self) {
            self.position = 0;
        }
        pub fn loop_active(&mut self, active:bool) {
            self.loop_active = active;
        }
        pub fn section_start(&mut self, position:f32) {
            self.section_start = position;
        }
        pub fn section_end(&mut self, position:f32) {
            self.section_end = position;
        }
    }

//audio buffer / shovel control
    impl AudioBuffer {
        pub fn clear_audio_buffer(&mut self) {
            self.audio_data.clear();
        }
        pub fn get_shovel_size() -> usize {
            SHOVEL_SIZE
        }
        pub fn append_shovel_audio_data(&mut self, limit:usize){
            self.audio_data.extend_from_slice(
                &self.audio_buffer_shovel[0..limit]
            );
        }
    }

//process
    impl AudioBuffer {
        pub fn process(
            &mut self,
            _rate_useFirstOnly: bool,
        ){
            if !self.playing { return; }

            // let rate = (if rate_useFirstOnly { self.rate_buffer[0] } else { self.rate_buffer[index] }) as f64;

            for index in 0..FRAME_SIZE {
                self.position += 1;
                self.position_readout_buffer[0] = self.position;

                if self.audio_data.len() <= self.position {
                    self.position = 0;
                }

                self.output_buffer[index] = self.audio_data[self.position];
            }
        }
    }