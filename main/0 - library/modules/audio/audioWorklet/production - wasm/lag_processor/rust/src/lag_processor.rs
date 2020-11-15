const SAMPLE_LENGTH: usize = 100;

pub struct LagProcessor {
    input_buffer: [f32; 128],
    output_buffer: [f32; 128],

    data_array: [f32; SAMPLE_LENGTH],
    data_array_working_index: usize, 
}
impl LagProcessor {
    pub fn new() -> LagProcessor {
        LagProcessor {
            input_buffer: [0.0; 128],
            output_buffer: [0.0; 128],

            data_array: [0.0; 100],
            data_array_working_index: 0,
        }
    }
}

impl LagProcessor {
    pub fn get_input_pointer(&mut self) -> *mut f32 {
        self.input_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_output_pointer(&mut self) -> *mut f32 {
        self.output_buffer.as_mut_ptr() as *mut f32
    }
}

impl LagProcessor {
    pub fn process(
        &mut self,
        samples: usize,
    ){
        let samples = if samples > SAMPLE_LENGTH { SAMPLE_LENGTH } else { samples };

        for index in 0..128 {
            self.data_array[self.data_array_working_index] = self.input_buffer[index];
            self.data_array_working_index = if self.data_array_working_index+1 >= samples { 0 } else { self.data_array_working_index + 1 };

            self.output_buffer[index] = 0.0;
            for data_array_index in 0..samples {
                self.output_buffer[index] += self.data_array[data_array_index];
            }
            self.output_buffer[index] /= samples as f32;
        }
    }
}