const SHOVEL_SIZE:usize = 512;


//definition
    pub struct AudioBuffer {
        output_buffer: [f32; 128],

        audio_buffer_shovel: [f32; SHOVEL_SIZE],
        audio_data: Vec<f32>,

        block_progress: usize,
    }
//utilities
    impl AudioBuffer {
        pub fn get_shovel_size() -> usize { SHOVEL_SIZE }
    }
//creation
    impl AudioBuffer {
        pub fn new() -> AudioBuffer {
            AudioBuffer {
                output_buffer: [0.0; 128],

                audio_buffer_shovel: [0.0; SHOVEL_SIZE],
                audio_data: vec![],

                block_progress: 0,
            }
        }
    }
//buffer pointer getters
    impl AudioBuffer {
        pub fn get_output_pointer(&mut self) -> *mut f32 {
            self.output_buffer.as_mut_ptr() as *mut f32
        }
        pub fn get_audio_buffer_shovel_pointer(&mut self) -> *mut f32 {
            self.audio_buffer_shovel.as_mut_ptr() as *mut f32
        }
    }
//audio buffer / shovel control
    impl AudioBuffer {
        pub fn clear_audio_buffer(&mut self) {
            self.audio_data.clear();
        }
        pub fn append_shovel_audio_data(&mut self, limit:usize){
            self.audio_data.extend_from_slice( &self.audio_buffer_shovel[0..limit] );
        }
    }
//process
    impl AudioBuffer {
        pub fn process(
            &mut self,
        ){
            if self.audio_data.len() > ((self.block_progress + 1) * 128) {
                let start_index = self.block_progress * 128;
                for index in 0..128 {
                    self.output_buffer[index] = self.audio_data[index + start_index];
                }
                self.block_progress += 1;
            } else {
                self.block_progress = 0;
            }
        }
    }