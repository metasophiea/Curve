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
            audio_data_end_index: usize,

        //input buffers
            rate_buffer: [f32; FRAME_SIZE],

        //shovel
            audio_buffer_shovel: [f32; SHOVEL_SIZE],

        //status
            playing: bool,
            playhead_position: f32,
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
                    audio_data_end_index: 0,

                //input buffers
                    rate_buffer: [0.0; FRAME_SIZE],

                //shovel
                    audio_buffer_shovel: [0.0; SHOVEL_SIZE],

                //status
                    playing: false,
                    playhead_position: 0.0,
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
            self.set_playhead_position( self.section_start as f32 );
        }
        pub fn set_playhead_position(&mut self, position:f32) {
            if position > self.audio_data.len() as f32 {
                self.playhead_position = self.audio_data.len() as f32;
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
            self.audio_data_end_index = 0;
        }
        pub fn get_shovel_size() -> usize {
            SHOVEL_SIZE
        }
        pub fn append_shovel_audio_data(&mut self, limit:usize){
            self.audio_data.extend_from_slice(
                &self.audio_buffer_shovel[0..limit]
            );
            self.maximize_section();
            self.audio_data_end_index = self.audio_data.len() - 1;
        }
    }

//interpolated playhead
    impl AudioBuffer {
        pub fn get_interpolated_value(
            &self,
            playhead_position: f32,
        ) -> f32 {
            //you can bail with an easy value if it turns out this position has no fractional part
                let fractional_part = playhead_position.fract();
                if fractional_part == 0.0 {
                    return self.audio_data[ playhead_position as usize ];
                }
            
            let start = self.audio_data[ playhead_position.floor() as usize ];
            let end = self.audio_data[ playhead_position.ceil() as usize ];
            let diff = (end - start) * fractional_part;
            let result = diff + start;

            result
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
                    let rate = (if rate_useFirstOnly { self.rate_buffer[0] } else { self.rate_buffer[index] }) as f32;

                //advance the position
                    let previous_playhead_position = self.playhead_position;
                    self.playhead_position += rate;
                    self.playhead_position_readout_buffer[0] = self.playhead_position.round() as usize;

                //section/data limit management
                    if
                        ( //traverse section start from within
                            previous_playhead_position > self.section_start as f32 &&
                            self.playhead_position <= self.section_start as f32
                        )
                            ||
                        ( //traverse audio data start
                            previous_playhead_position > 0.0 &&
                            self.playhead_position <= 0.0
                        )
                            ||
                        ( //traverse section end from within
                            previous_playhead_position < self.section_end as f32 &&
                            self.playhead_position >= self.section_end as f32
                        )
                            ||
                        ( //traverse audio data end
                            previous_playhead_position < self.audio_data.len() as f32 &&
                            self.playhead_position >= self.audio_data.len() as f32
                        )
                    {
                        self.set_playhead_position(
                            if rate < 0.0 { self.section_end as f32 - 1.0 } else { self.section_start as f32 }
                        );
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

                //place position selected data in the output buffers
                    self.output_buffer[index] = self.get_interpolated_value(self.playhead_position);
            }
        }
    }