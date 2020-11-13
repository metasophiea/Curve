pub struct Bitcrusher {
    input_buffer: [f32; 128],
    output_buffer: [f32; 128],
}
impl Bitcrusher {
    pub fn new() -> Bitcrusher {
        Bitcrusher {
            input_buffer: [0.0; 128],
            output_buffer: [0.0; 128],
        }
    }
    pub fn get_input_pointer(&mut self) -> *mut f32 {
        self.input_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_output_pointer(&mut self) -> *mut f32 {
        self.output_buffer.as_mut_ptr() as *mut f32
    }
    pub fn process(
        &mut self,
        amplitudeResolution: f32,
        sampleFrequency: usize,
    ){
        for index in 0..128 {
            self.output_buffer[index] = if (index%sampleFrequency) == 0 { 
                (self.input_buffer[index] * amplitudeResolution).round() / amplitudeResolution
            } else { 
                self.output_buffer[index-1]
            };
        }
    }
}