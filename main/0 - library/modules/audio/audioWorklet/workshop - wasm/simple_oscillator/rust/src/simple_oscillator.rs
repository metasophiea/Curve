pub struct SimpleOscillator {
    output_buffer: [f32; 128],
}

impl SimpleOscillator {
    pub fn new() -> SimpleOscillator {
        SimpleOscillator {
            output_buffer: [0.0; 128],
        }
    }
}

impl SimpleOscillator {
    pub fn get_output_pointer(&mut self) -> *mut f32 {
        self.output_buffer.as_mut_ptr() as *mut f32
    }
}

impl SimpleOscillator {
    pub fn process(
        &mut self,
    ){
        for index in 0..128 {
            self.output_buffer[index] = 0.0;
        }
    }
}