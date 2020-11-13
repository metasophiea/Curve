pub struct AmplitudeModifier {
    input_buffer: [f32; 128],
    output_buffer: [f32; 128],

    divisor_buffer: [f32; 128],
    offset_buffer: [f32; 128],
    floor_buffer: [f32; 128],
    ceiling_buffer: [f32; 128],
}
impl AmplitudeModifier {
    pub fn new() -> AmplitudeModifier {
        AmplitudeModifier {
            input_buffer: [0.0; 128],
            output_buffer: [0.0; 128],

            divisor_buffer: [0.0; 128],
            offset_buffer: [0.0; 128],
            floor_buffer: [0.0; 128],
            ceiling_buffer: [0.0; 128],
        }
    }
}

impl AmplitudeModifier {
    pub fn get_input_pointer(&mut self) -> *mut f32 {
        self.input_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_output_pointer(&mut self) -> *mut f32 {
        self.output_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_divisor_pointer(&mut self) -> *mut f32 {
        self.divisor_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_offset_pointer(&mut self) -> *mut f32 {
        self.offset_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_floor_pointer(&mut self) -> *mut f32 {
        self.floor_buffer.as_mut_ptr() as *mut f32
    }
    pub fn get_ceiling_pointer(&mut self) -> *mut f32 {
        self.ceiling_buffer.as_mut_ptr() as *mut f32
    }
}

impl AmplitudeModifier {
    pub fn process(
        &mut self,
        sign: f32,
        divisor_useFirstOnly: bool,
        offset_useFirstOnly: bool,
        floor_useFirstOnly: bool,
        ceiling_useFirstOnly: bool,
    ){
        for index in 0..128 {
            let divisor = if divisor_useFirstOnly { self.divisor_buffer[0] } else { self.divisor_buffer[index] };
            let offset = if offset_useFirstOnly { self.offset_buffer[0] } else { self.offset_buffer[index] };
            let floor = if floor_useFirstOnly { self.floor_buffer[0] } else { self.floor_buffer[index] };
            let ceiling = if ceiling_useFirstOnly { self.ceiling_buffer[0] } else { self.ceiling_buffer[index] };

            self.output_buffer[index] = sign * (self.input_buffer[index]/divisor) + offset;

            if self.output_buffer[index] < floor {
                self.output_buffer[index] = floor;
            }else if self.output_buffer[index] > ceiling {
                self.output_buffer[index] = ceiling;
            }
        }
    }
}