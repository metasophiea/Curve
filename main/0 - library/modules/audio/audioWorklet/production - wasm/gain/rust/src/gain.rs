pub struct Gain {
    input_1_buffer: [f32; 128],
    input_2_buffer: [f32; 128],
    output_buffer: [f32; 128],
}
impl Gain {
    pub fn new() -> Gain {
        Gain {
            input_1_buffer: [0.0; 128],
            input_2_buffer: [0.0; 128],
            output_buffer: [0.0; 128],
        }
    }
}

impl Gain {
    pub fn get_input_1_pointer(&mut self) -> *mut f32 {
        self.input_1_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_input_2_pointer(&mut self) -> *mut f32 {
        self.input_2_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_output_pointer(&mut self) -> *mut f32 {
        self.output_buffer.as_mut_ptr() as *mut f32
    }
}

impl Gain {
    pub fn process(
        &mut self,
        gain_useFirstOnly: bool,
    ){
        for index in 0..128 {
            let gain = if gain_useFirstOnly { self.input_2_buffer[0] } else { self.input_2_buffer[index] };
            self.output_buffer[index] = self.input_1_buffer[index]*gain;
        }
    }
}