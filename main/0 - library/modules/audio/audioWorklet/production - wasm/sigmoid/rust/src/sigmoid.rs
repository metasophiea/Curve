pub struct Sigmoid {
    input_buffer: [f32; 128],
    output_buffer: [f32; 128],

    gain_buffer: [f32; 128],
    sharpness_buffer: [f32; 128],
}
impl Sigmoid {
    pub fn new() -> Sigmoid {
        Sigmoid {
            input_buffer: [0.0; 128],
            output_buffer: [0.0; 128],

            gain_buffer: [0.0; 128],
            sharpness_buffer: [0.0; 128],
        }
    }

    pub fn get_input_pointer(&mut self) -> *mut f32 {
        self.input_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_output_pointer(&mut self) -> *mut f32 {
        self.output_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_gain_pointer(&mut self) -> *mut f32 {
        self.gain_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_sharpness_pointer(&mut self) -> *mut f32 {
        self.sharpness_buffer.as_mut_ptr() as *mut f32
    }

    pub fn process(
        &mut self,
        gain_useFirstOnly: bool,
        sharpness_useFirstOnly: bool,
    ){
        for index in 0..128 {
            let gain = if gain_useFirstOnly { self.gain_buffer[0] } else { self.gain_buffer[index] };
            let sharpness = if sharpness_useFirstOnly { self.sharpness_buffer[0] } else { self.sharpness_buffer[index] };
            self.output_buffer[index] = gain * ( self.input_buffer[index] / ( 1.0 - sharpness + sharpness*(self.input_buffer[index].abs()) ) );
        }
    }
}