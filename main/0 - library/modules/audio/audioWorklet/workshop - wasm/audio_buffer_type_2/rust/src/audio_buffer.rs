#![allow(dead_code)]
#![allow(unused_variables)]

extern "C" {
    pub fn _onEnd(id:i32);
}
pub fn onEnd(id:i32) { unsafe { _onEnd(id) } }
extern "C" {
    pub fn _onLoop(id:i32);
}
pub fn onLoop(id:i32) { unsafe { _onLoop(id) } }
extern "C" {
    pub fn debug_(id: i32, v1: f32);
}
pub fn debug(id: i32, v1: f32) { unsafe { debug_(id, v1) } }


const FRAME_SIZE:usize = 128; //matches the browser's frame size: 128
const SAMPLE_RATE:usize = 44100; //matches the browser's sample rate: 44100
const SHOVEL_SIZE:usize = 512;
const PLAYHEAD_LIMIT:usize = 256;

//minimum time step size = FRAME_SIZE / SAMPLE_RATE = 128/44100 = 2.9024943310657596 milliseconds



pub enum BoundaryEvent {
    Loop,
    End
}


use super::playhead::Playhead;





//definition
    pub struct AudioBuffer {
        //output buffer
            output_buffer: [f32; FRAME_SIZE],
            playhead_position_readout_buffer: [usize; PLAYHEAD_LIMIT],

        //main audio data
            audio_data: Vec<f32>,

        //input buffers
            rate_buffer: [f32; FRAME_SIZE],

        //shovel
            audio_buffer_shovel: [f32; SHOVEL_SIZE],

        //playheads
            playheads: Vec<Playhead>,
            default_playhead: Playhead,
    }
//creation
    impl AudioBuffer {
        pub fn new() -> AudioBuffer {
            AudioBuffer {
                //output buffer
                    output_buffer: [0.0; FRAME_SIZE],
                    playhead_position_readout_buffer: [0; PLAYHEAD_LIMIT],

                //main audio data
                    audio_data: vec![],

                //input buffers
                    rate_buffer: [0.0; FRAME_SIZE],

                //shovel
                    audio_buffer_shovel: [0.0; SHOVEL_SIZE],
                    
                //playheads
                    playheads: vec![],
                    default_playhead: Playhead::new(0),
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
            self.default_playhead.reset( self.audio_data.len() );
            for playhead in &mut self.playheads {
                playhead.reset(
                    self.audio_data.len()
                );
            }
        }
    }
//performance control
    impl AudioBuffer {
        fn create_new_playhead(&mut self, playing:bool) -> Option<usize> {
            if self.playheads.len() == PLAYHEAD_LIMIT {
                return None;
            }

            let tmp = if playing {
                let mut tmp = self.default_playhead.clone();
                if playing { tmp.play(); }
                tmp
            } else {
                self.default_playhead.clone()
            };

            self.playheads.push(tmp);

            Some(self.playheads.len() - 1)
        }

        pub fn play(&mut self, playhead_id:Option<usize>) -> Option<usize> {
            if let Some(playhead_id) = playhead_id {
                //attempt to play this specific playhead
                //If one isn't present; then create a new one and ignore the id

                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.play();
                    Some(playhead_id)
                } else {
                    self.create_new_playhead(true)
                }
            } else {
                //start whichever is convenient
                    //find one that's stopped
                    //push it back to the start and hit play
                    //if all are playing, create a new one

                for (index, playhead) in self.playheads.iter_mut().enumerate() {
                    if !playhead.is_playing() {
                        playhead.go_to_start();
                        playhead.play();
                        return Some(index);
                    }
                }

                self.create_new_playhead(true)
            }
        }
        pub fn stop(&mut self, playhead_id:Option<usize>) {
            if let Some(playhead_id) = playhead_id {
                //attempt to stop this specific playhead
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.stop();
                }
            } else {
                //stop all playheads
                for playhead in &mut self.playheads {
                    playhead.stop();
                }
            }
        }

        pub fn set_loop_active(&mut self, playhead_id:Option<usize>, active:bool) {
            if let Some(playhead_id) = playhead_id {
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.set_loop_active(active);
                }
            } else {
                self.default_playhead.set_loop_active(active);
                for playhead in &mut self.playheads {
                    playhead.set_loop_active(active);
                }
            }
        }

        pub fn get_playhead_position(&self, playhead_id:usize) -> Option<usize> {
            if let Some(playhead) = self.playheads.get(playhead_id) {
                Some(playhead.get_sample_index())
            } else {
                None
            }
        }
        pub fn set_playhead_position(&mut self, playhead_id:Option<usize>, position:f32) {
            if let Some(playhead_id) = playhead_id {
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.set_position(position);
                }
            } else {
                self.default_playhead.set_position(position);
                for playhead in &mut self.playheads {
                    playhead.set_position(position);
                }
            }
        }
        pub fn go_to_start(&mut self, playhead_id:Option<usize>) {
            if let Some(playhead_id) = playhead_id {
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.go_to_start();
                }
            } else {
                self.default_playhead.go_to_start();
                for playhead in &mut self.playheads {
                    playhead.go_to_start();
                }
            }
        }
        pub fn go_to_end(&mut self, playhead_id:Option<usize>) {
            if let Some(playhead_id) = playhead_id {
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.go_to_end();
                }
            } else {
                self.default_playhead.go_to_end();
                for playhead in &mut self.playheads {
                    playhead.go_to_end();
                }
            }
        }

        pub fn section_start(&mut self, playhead_id:Option<usize>, position:usize) {
            if let Some(playhead_id) = playhead_id {
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.section_start(position);
                }
            } else {
                self.default_playhead.section_start(position);
                for playhead in &mut self.playheads {
                    playhead.section_start(position);
                }
            }
        }
        pub fn section_end(&mut self, playhead_id:Option<usize>, position:usize) {
            if let Some(playhead_id) = playhead_id {
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.section_end(position);
                }
            } else {
                self.default_playhead.section_end(position);
                for playhead in &mut self.playheads {
                    playhead.section_end(position);
                }
            }
        }
        pub fn maximize_section(&mut self, playhead_id:Option<usize>) {
            if let Some(playhead_id) = playhead_id {
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.maximize_section();
                }
            } else {
                self.default_playhead.maximize_section();
                for playhead in &mut self.playheads {
                    playhead.maximize_section();
                }
            }
        }
        pub fn invert_section(&mut self, playhead_id:Option<usize>) {
            if let Some(playhead_id) = playhead_id {
                if let Some(playhead) = self.playheads.get_mut(playhead_id) {
                    playhead.invert_section();
                }
            } else {
                self.default_playhead.invert_section();
                for playhead in &mut self.playheads {
                    playhead.invert_section();
                }
            }
        }
    }
//process
    impl AudioBuffer {
        pub fn process(
            &mut self,
            rate_useFirstOnly: bool,
        ){

            for index in 0..FRAME_SIZE {
                //determine the playback rate
                    let rate = (if rate_useFirstOnly { self.rate_buffer[0] } else { self.rate_buffer[index] }) as f32;

                //advance playheads
                    for (index, playhead) in self.playheads.iter_mut().enumerate() {
                        if let Some(boundary_event) = playhead.advance(rate) {
                            match boundary_event {
                                BoundaryEvent::Loop => { onLoop(index as i32); },
                                BoundaryEvent::End => { onEnd(index as i32); },
                            }
                        }
                    }

                //report on playheads' general positions
                    for (index, playhead) in self.playheads.iter().enumerate() {
                        self.playhead_position_readout_buffer[index] = playhead.get_sample_index();
                    }

                //populate output buffer
                    self.output_buffer[index] = 0.0;
                    for playhead in &self.playheads {
                        self.output_buffer[index] += playhead.get_interpolated_audio_value(&self.audio_data, rate >= 0.0);
                    }
            }

        }
    }