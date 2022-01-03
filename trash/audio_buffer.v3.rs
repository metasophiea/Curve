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




#[derive(Copy, Clone)]
struct PlayheadPosition {
    major: usize,
    fraction: f32,

    audio_track_length: usize,
}
impl PlayheadPosition {
    pub fn new(audio_track_length:usize) -> PlayheadPosition {
        PlayheadPosition {
            major: 0,
            fraction: 0.0,
            audio_track_length: audio_track_length,
        }
    }
}
impl PlayheadPosition {
    pub fn get_major(&self) -> usize {
        self.major
    }
    pub fn set_major(&mut self, new:usize) {
        self.major = new;
    }
    pub fn get_fraction(&self) -> f32 {
        self.fraction
    }
    pub fn set_fraction(&mut self, new:f32) {
        self.fraction = new;
    }

    pub fn set_with_f32(&mut self, replacement_value:f32) {
        self.major = replacement_value.trunc() as usize;
        self.fraction = replacement_value.fract();
    }

    pub fn add(&mut self, new:f32) -> bool {

        if new > 0.0 {
            self.major += new.trunc() as usize;

            self.fraction += new.fract();
            if self.fraction >= 1.0 {
                self.major += 1;
                self.fraction -= 1.0;
            }

            while self.major >= self.audio_track_length {
                self.major -= self.audio_track_length;
                return true;
            }
        } else if new < 0.0 {
            let new = -new;

            let mut subtracting_major = new.trunc() as usize;

            self.fraction -= new.fract();
            while self.fraction < 0.0 {
                self.fraction += 1.0;
                subtracting_major += 1;
            }

            if subtracting_major <= self.major {
                self.major -= subtracting_major;
            } else {
                while subtracting_major >= self.audio_track_length {
                    subtracting_major -= self.audio_track_length;
                }
                if subtracting_major <= self.major {
                    self.major -= subtracting_major;
                } else if subtracting_major > self.major {
                    self.major = self.audio_track_length - ( subtracting_major - self.major );
                }

                return true;
            }
        }

        false
    }
}




//definition
    pub struct AudioBuffer {
        //output buffer
            output_buffer: [f32; FRAME_SIZE],
            playhead_position_readout_buffer: [usize; 1],

        //main audio data
            audio_data: Vec<f32>,
            // audio_data_end_index: usize,

        //input buffers
            rate_buffer: [f32; FRAME_SIZE],

        //shovel
            audio_buffer_shovel: [f32; SHOVEL_SIZE],

        //status
            playing: bool,
            playhead_position: PlayheadPosition,
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
                    playhead_position: PlayheadPosition::new(0),
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
                self.playhead_position.set_major(self.audio_data.len());
                self.playhead_position.set_fraction(0.0);
            } else {
                self.playhead_position.set_with_f32(position);
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
            self.playhead_position = PlayheadPosition::new(0);
        }
        pub fn get_shovel_size() -> usize {
            SHOVEL_SIZE
        }
        pub fn append_shovel_audio_data(&mut self, limit:usize){
            self.audio_data.extend_from_slice(
                &self.audio_buffer_shovel[0..limit]
            );
            self.maximize_section();
            self.playhead_position = PlayheadPosition::new(self.audio_data.len());
        }
    }

//interpolated playhead
    impl AudioBuffer {
        fn get_interpolated_value(
            &self,
            playhead_position: &PlayheadPosition,
        ) -> f32 {
            //you can bail with an easy value if it turns out this position has no fractional part
                if playhead_position.get_fraction() == 0.0 {
                    return self.audio_data[ playhead_position.get_major() ];
                }

            // //audio data range protection
            //     if (playhead_position.get_major() + 1) >= self.audio_data.len() {
            //         panic!("AudioBuffer::get_interpolated_value - attempting to get sample from outside audio_data range: {} from {}", playhead_position.get_major() + 1, self.audio_data.len());
            //         // return 0.0;
            //     }
            
            //interpolate
                let start = self.audio_data[ playhead_position.get_major() ];
                let end = if playhead_position.get_major() == self.audio_data.len() - 1 {
                    self.audio_data[ 0 ]
                } else {
                    self.audio_data[ playhead_position.get_major() + 1 ]
                };
                let diff = (end - start) * playhead_position.get_fraction();
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
                    let audio_data_limit_loop_occurred = self.playhead_position.add( rate );

                //section/data limit management

                    if
                        ( //traverse section start from within, with reverse play
                            rate < 0.0 &&
                            previous_playhead_position.get_major() > self.section_start &&
                            self.playhead_position.get_major() <= self.section_start
                        ) 
                            ||
                        ( //traverse section end from within, with forward play
                            rate > 0.0 &&
                            previous_playhead_position.get_major() < self.section_end &&
                            self.playhead_position.get_major() >= self.section_end
                        )
                    {
                        self.set_playhead_position(
                            if rate < 0.0 {
                                self.section_end as f32 - 1.0
                            } else {
                                self.section_start as f32
                            }
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
                    } else if audio_data_limit_loop_occurred {
                        if
                            (
                                (
                                    rate < 0.0 && self.section_start == 0
                                )
                                    ||
                                (
                                    rate > 0.0 && self.section_end == self.audio_data.len()
                                )
                            ) 
                            && self.loop_active
                        {
                            onLoop();
                        } else {
                            self.playing = false;
                            for a in index..FRAME_SIZE {
                                self.output_buffer[a] = 0.0;
                            }
                            onEnd();
                            self.set_playhead_position(
                                if rate < 0.0 {
                                    self.section_end as f32 - 1.0
                                } else {
                                    self.section_start as f32
                                }
                            );
                            break;
                        }
                    }

                //place position selected data in the output buffers
                    self.playhead_position_readout_buffer[0] = self.playhead_position.get_major();
                    self.output_buffer[index] = self.get_interpolated_value(&self.playhead_position);
            }
        }
    }