pub struct StreamAdder {
    input_1_buffer: [f32; 128],
    input_2_buffer: [f32; 128],
    mix_control_buffer: [f32; 128],
    output_buffer: [f32; 128],
}
impl StreamAdder {
    pub fn new() -> StreamAdder {
        StreamAdder {
            input_1_buffer: [0.0; 128],
            input_2_buffer: [0.0; 128],
            mix_control_buffer: [0.0; 128],
            output_buffer: [0.0; 128],
        }
    }
}

impl StreamAdder {
    pub fn get_input_1_pointer(&mut self) -> *mut f32 {
        self.input_1_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_input_2_pointer(&mut self) -> *mut f32 {
        self.input_2_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_output_pointer(&mut self) -> *mut f32 {
        self.output_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_mix_control_pointer(&mut self) -> *mut f32 {
        self.mix_control_buffer.as_mut_ptr() as *mut f32
    }
}

impl StreamAdder {
    pub fn process(
        &mut self,
        mix_control_useFirstOnly: bool,
    ){
        for index in 0..128 {
            let mix = if mix_control_useFirstOnly { self.mix_control_buffer[0] } else { self.mix_control_buffer[index] };
            self.output_buffer[index] = self.input_1_buffer[index]*(1.0-mix) + self.input_2_buffer[index]*(mix);
        }
    }
}