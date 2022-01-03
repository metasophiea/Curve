#![allow(dead_code)]

extern "C" {
    pub fn debug_(id: i32, v1: f32);
}
pub fn debug(id: i32, v1: f32) { unsafe { debug_(id, v1) } }

use super::audio_buffer::BoundaryEvent;




//definition
    #[derive(Copy, Clone)]
    pub struct Playhead {
        //control
            playing: bool,
            loop_active: bool,
            section_start: usize,
            section_end: usize,

        //position
            sample_index: usize,
            sample_index_fraction: f32,

        //calculated
            audio_track_length: usize,
            section_length: usize,
    }

//creation
    impl Playhead {
        pub fn new(audio_track_length:usize) -> Playhead {
            if audio_track_length == 0 {
                Playhead {
                    //control
                        playing: false,
                        loop_active: false,
                        section_start: 0,
                        section_end: 0,
    
                    //position
                        sample_index: 0,
                        sample_index_fraction: 0.0,
    
                    //calculated
                        audio_track_length: 0,
                        section_length: 0,
                }
            } else {
                Playhead {
                    //control
                        playing: false,
                        loop_active: false,
                        section_start: 0,
                        section_end: audio_track_length-1,
    
                    //position
                        sample_index: 0,
                        sample_index_fraction: 0.0,
    
                    //calculated
                        audio_track_length: audio_track_length,
                        section_length: audio_track_length-1,
                }
            }
        }
    }

//reset
    impl Playhead {
        pub fn reset(&mut self, audio_track_length:usize) {
            let maximize = self.section_start == 0 && self.section_end == self.audio_track_length;

            self.audio_track_length = audio_track_length;

            if maximize || audio_track_length < self.section_start && audio_track_length < self.section_end {
                self.section_start = 0;
                self.section_end = audio_track_length;
            }
            if audio_track_length < self.section_start { self.section_start = audio_track_length; }
            if audio_track_length < self.section_end { self.section_end = audio_track_length; }

            self.section_length = self.section_end - self.section_start;
        }
    }

//general
    impl Playhead {
        pub fn is_playing(&self) -> bool { self.playing }
        pub fn play(&mut self) {
            if self.audio_track_length == 0 { return; }
            if self.section_start == self.section_end { return; }
            self.playing = true;
        }
        pub fn stop(&mut self) {
            self.playing = false;
        }

        pub fn is_loop_active(&self) -> bool { self.loop_active }
        pub fn set_loop_active(&mut self, new:bool) { self.loop_active = new; }

        pub fn get_sample_index(&self) -> usize { self.sample_index }
        pub fn set_position(&mut self, new:f32) {
            if new < 0.0 {
                self.sample_index = 0;
                self.sample_index_fraction = 0.0;
            } else if new > self.audio_track_length as f32 {
                self.sample_index = self.audio_track_length-1;
                self.sample_index_fraction = 0.99;
            } else {
                self.sample_index = new.trunc() as usize;
                self.sample_index_fraction = new.fract();
            }
        }
        pub fn go_to_start(&mut self) {
            self.sample_index = self.section_start;
            self.sample_index_fraction = 0.0;
        }
        pub fn go_to_end(&mut self) {
            self.sample_index = self.section_end-1;
            self.sample_index_fraction = 0.99;
        }
    }

//section
    impl Playhead {
        fn calculate_section_length(&mut self) {
            if self.section_end >= self.section_start {
                self.section_length = self.section_end - self.section_start;
            } else {
                self.section_length = self.audio_track_length - (self.section_start - self.section_end);
            }
        }
        pub fn section_start(&mut self, position:usize) {
            let mut position = position;

            if position > self.audio_track_length-1 {
                position = self.audio_track_length-1;
            }
            
            self.section_start = position;
            self.calculate_section_length();
        }
        pub fn section_end(&mut self, position:usize) {
            let mut position = position;

            if position > self.audio_track_length-1 {
                position = self.audio_track_length-1;
            }

            self.section_end = position;
            self.calculate_section_length();
        }
        pub fn maximize_section(&mut self) {
            self.section_start = 0;
            self.section_end = self.audio_track_length;
            self.calculate_section_length();
        }
        pub fn invert_section(&mut self) {
            let tmp = self.section_start;
            self.section_start = self.section_end;
            self.section_end = tmp;
            self.calculate_section_length();
        }
    }

//progress
    impl Playhead {
        pub fn get_interpolated_audio_value(
            &self, 
            audio_data: &Vec<f32>,
            direction: bool, //true = forward / false = backward
        ) -> f32 {
            //check
                if audio_data.len() != self.audio_track_length {
                    println!("ERROR - Playhead::get_interpolated_audio_value - provided audio_data length does not match audio_track_length");
                    return 0.0;
                }

            //if the playhead isn't playing, just return zero
                if !self.playing {
                    return 0.0;
                }

            //if the section length is zero, return zero
                if self.section_length == 0 {
                    return 0.0;
                }

            //you can bail with an easy value if it turns out this position has no fractional part
                if self.sample_index_fraction == 0.0 {
                    return audio_data[ self.sample_index ];
                }

            if direction {
                //if the sample_index is (section_end-1), then interpolate around to the section_start position
                //otherwise interpolate between this position and the next

                let start_value = audio_data[ self.sample_index ];

                let end_value = audio_data[ if self.sample_index == self.section_end - 1 { 
                    self.section_start 
                } else { 
                    //either get the next point, or loop around to the audio data start
                        if self.sample_index == self.audio_track_length-1 {
                            0
                        } else {
                            self.sample_index + 1
                        }
                } ];

                let diff = (end_value - start_value) * self.sample_index_fraction;
                diff + start_value
            } else {
                //if the sample_index is section_start, then interpolate around to the section_end position
                //otherwise interpolate between this position and the previous
                
                let start_value = audio_data[ self.sample_index ];

                let end_value = audio_data[ if self.sample_index == self.section_start { 
                    self.section_end
                } else { 
                    //either get the previous point, or loop around to the audio data end
                        if self.sample_index == 0 {
                            self.audio_track_length - 1
                        } else {
                            self.sample_index - 1
                        }
                } ];

                let diff = (start_value - end_value) * self.sample_index_fraction;
                diff + start_value
            }
        }
        pub fn advance(&mut self, rate:f32) -> Option<BoundaryEvent> {
            //if the playhead isn't playing, don't bother
                if !self.playing { return None; }

            //ensure that the rate is smaller that the section size
                //todo
            
            //extract data
                let direction = rate.is_sign_positive(); //true = forward / false = backward
                let sample_index_step = rate.abs().trunc() as usize;
                let sample_index_fraction_step = rate.abs().fract();

            //progress
                if direction { //forward

                    //calculate new position
                        //initial calculation
                            let mut new_sample_index = self.sample_index + sample_index_step;
                            let mut new_sample_index_fraction = self.sample_index_fraction + sample_index_fraction_step;
                            while new_sample_index_fraction > 1.0 {
                                new_sample_index_fraction -= 1.0;
                                new_sample_index += 1;
                            }
                        //account for section_end
                            let mut traversed_section_end = false;
                            if self.sample_index < self.section_end && new_sample_index >= self.section_end { //transition over end of section
                                traversed_section_end = true;

                                if self.loop_active {
                                    if self.section_end < self.section_start { //section goes around the end of the audio data, so push the playhead forward to after the section_start
                                        new_sample_index += self.section_start - self.section_end;
                                    } else { //easy jump back
                                        new_sample_index -= self.section_length;
                                    }
                                } else {
                                    new_sample_index = self.section_end;
                                    new_sample_index_fraction = 0.99;
                                }
                            }
                        //account for end of audio data
                            let mut traversed_audio_data_end = false;
                            if new_sample_index >= self.audio_track_length { //encountering end of audio data
                                traversed_audio_data_end = true;
                                if self.section_end < self.section_start { //still within section, loop around to the start
                                    new_sample_index -= self.audio_track_length;
                                } else if self.audio_track_length-1 == self.section_end { //call it a day
                                    new_sample_index = self.section_end;
                                    new_sample_index_fraction = 0.99;
                                } else { //have reached the end of audio data while outside the section
                                    new_sample_index = self.audio_track_length-1;
                                    new_sample_index_fraction = 0.99;
                                }
                            }

                    //apply new position
                        self.sample_index = new_sample_index;
                        self.sample_index_fraction = new_sample_index_fraction;

                    //return event data (if any)
                        if traversed_section_end && self.loop_active {
                            Some( BoundaryEvent::Loop )
                        } else if traversed_section_end {
                            self.playing = false;
                            Some( BoundaryEvent::End )
                        } else if traversed_audio_data_end && self.loop_active {
                            None
                        } else if traversed_audio_data_end {
                            self.playing = false;
                            Some( BoundaryEvent::End )
                        } else {
                            None
                        }

                } else { //backward

                    //calculate new position
                        //initial calculation (account for start of audio data)
                            let mut _traversed_audio_data_start = false;
                            let mut new_sample_index = if self.sample_index < sample_index_step {
                                _traversed_audio_data_start = true;
                                self.audio_track_length + self.sample_index - sample_index_step
                            } else {
                                self.sample_index - sample_index_step
                            };
                            let mut new_sample_index_fraction = self.sample_index_fraction - sample_index_fraction_step;
                            while new_sample_index_fraction < 0.0 {
                                new_sample_index_fraction += 1.0;

                                if new_sample_index == 0 {
                                    new_sample_index = self.audio_track_length - 1;
                                } else {
                                    new_sample_index -= 1;
                                }
                            }
                        //account for section_start
                            let mut traversed_section_start = false;
                            if self.sample_index >= self.section_start && new_sample_index < self.section_start { //transition over start of section
                                traversed_section_start = true;

                                if self.loop_active {
                                    if self.section_end < self.section_start { //section goes around the start of the audio data, so push the playhead backward to before the section_end
                                        if self.section_start - self.section_end > new_sample_index {
                                            _traversed_audio_data_start = true;
                                            new_sample_index = new_sample_index + self.audio_track_length - (self.section_start - self.section_end);
                                        } else {
                                            new_sample_index -= self.section_start - self.section_end;
                                        }

                                    } else { //easy jump forward
                                        new_sample_index += self.section_length;
                                    }
                                } else {
                                    new_sample_index = self.section_start;
                                    new_sample_index_fraction = 0.0;
                                }
                            }

                    //apply new position
                        self.sample_index = new_sample_index;
                        self.sample_index_fraction = new_sample_index_fraction;

                    //return event data (if any)
                        if traversed_section_start && self.loop_active {
                            Some( BoundaryEvent::Loop )
                        } else if traversed_section_start {
                            self.playing = false;
                            Some( BoundaryEvent::End )
                        } else {
                            None
                        }

                }
        }
    }