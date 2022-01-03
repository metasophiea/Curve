#![allow(dead_code)]



extern "C" {
    pub fn _onEnd();
}
pub fn onEnd() { unsafe { _onEnd() } }
extern "C" {
    pub fn _onLoop();
}
pub fn onLoop() { unsafe { _onLoop() } }




const FRAME_SIZE:usize = 128; //matches the browser's frame size: 128
const SAMPLE_RATE:usize = 44100; //matches the browser's sample rate: 44100
const SHOVEL_SIZE:usize = 512;
//minimum time step size = FRAME_SIZE / SAMPLE_RATE = 128/44100 = 2.9024943310657596 milliseconds




//definition
    pub struct AudioBuffer {
        //output buffer
            output_buffer: [f32; FRAME_SIZE],
            playhead_position_readout_buffer: [usize; 1],

        //main audio data
            audio_data: Vec<f32>,

        //input buffers
            rate_buffer: [f32; FRAME_SIZE],

        //shovel
            audio_buffer_shovel: [f32; SHOVEL_SIZE],

        //status
            playing: bool,
            playhead_position: usize,
            section_start: usize,
            section_end: usize,
            loop_active: bool,
    }

//creation
    impl AudioBuffer {
        pub fn new() -> AudioBuffer {
            AudioBuffer {
                //output buffer
                    output_buffer: [0.0; FRAME_SIZE],
                    playhead_position_readout_buffer: [0; 1],

                //main audio data
                    audio_data: vec![],

                //input buffers
                    rate_buffer: [0.0; FRAME_SIZE],

                //shovel
                    audio_buffer_shovel: [0.0; SHOVEL_SIZE],

                //status
                    playing: false,
                    playhead_position: 0,
                    section_start: 0,
                    section_end: 1,
                    loop_active: false,
            }
        }
    }

//buffer pointers
    impl AudioBuffer {
        pub fn get_playhead_position_readout_pointer(&self) -> *mut usize {
            self.playhead_position_readout_buffer.as_ptr() as *mut usize
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
        pub fn stop(&mut self) {
            self.pause();
            self.return_playhead_position();
        }
        pub fn return_playhead_position(&mut self) {
            self.set_playhead_position( self.section_start );
        }
        pub fn set_playhead_position(&mut self, position:usize) {
            if position > self.audio_data.len()  {
                self.playhead_position = self.audio_data.len();
            } else {
                self.playhead_position = position;
            }
        }
        pub fn loop_active(&mut self, active:bool) {
            self.loop_active = active;
        }
        pub fn section_start(&mut self, position:usize) {
            if position > self.section_end {
                self.section_start = self.section_end;
            } else {
                self.section_start = position;
            }
        }
        pub fn section_end(&mut self, position:usize) {
            if position < self.section_start {
                self.section_end = self.section_start;
            } else {
                self.section_end = position;
            }
        }
        pub fn maximize_section(&mut self) {
            self.section_start = 0;
            self.section_end = self.audio_data.len();
        }
    }

//audio buffer / shovel control
    impl AudioBuffer {
        pub fn clear_audio_buffer(&mut self) {
            self.audio_data.clear();
            self.maximize_section();
        }
        pub fn get_shovel_size() -> usize {
            SHOVEL_SIZE
        }
        pub fn append_shovel_audio_data(&mut self, limit:usize){
            self.audio_data.extend_from_slice(
                &self.audio_buffer_shovel[0..limit]
            );
            self.maximize_section();
        }
    }

//process
    impl AudioBuffer {
        pub fn process(
            &mut self,
            rate_useFirstOnly: bool,
        ){
            //if not playing, just fill the output buffer with zeros
                if !self.playing {
                    for index in 0..FRAME_SIZE {
                        self.output_buffer[index] = 0.0;
                    }
                    return;
                }

            for index in 0..FRAME_SIZE {
                //determine the playback rate
                    let _rate = (if rate_useFirstOnly { self.rate_buffer[0] } else { self.rate_buffer[index] }) as f64;

                //advance the position
                    self.playhead_position += 1;
                    self.playhead_position_readout_buffer[0] = self.playhead_position;

                //when we reach the end of the section, depending on the looping mode either;
                // > reset position and stop playback
                // > reset position
                //if we stop playback; don't forget to fill out the rest of the frame with zeros 
                    if self.playhead_position == self.section_end {
                        self.return_playhead_position();
                        if self.loop_active {
                            onLoop();
                        } else {
                            self.playing = false;
                            for a in index..FRAME_SIZE {
                                self.output_buffer[a] = 0.0;
                            }
                            onEnd();
                            break;
                        }
                    }
                //also account for reaching the end outside the section
                    if self.playhead_position == self.audio_data.len() {
                        self.playing = false;
                        for a in index..FRAME_SIZE {
                            self.output_buffer[a] = 0.0;
                        }
                        onEnd();
                        break;
                    }

                //place position selected data in the output buffer
                    self.output_buffer[index] = self.audio_data[self.playhead_position];
            }
        }
    }