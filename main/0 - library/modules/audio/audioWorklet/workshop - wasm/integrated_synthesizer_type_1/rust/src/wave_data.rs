pub struct WaveData {
    pub frequency: f64,
    pub velocity: f32,
    pub position: f64,

    local_wave_position: f64,
}

 impl WaveData {
    pub fn new(frequency:f64, velocity:f32) -> WaveData {
        WaveData {
            frequency: frequency,
            velocity: velocity,
            position: 0.0,

            local_wave_position: 0.0,
        }
    }
}

impl WaveData {
    pub fn advance_wave_position(&mut self, detune:f64, sample_rate:f64){
        self.position += (self.frequency * (detune + 1.0))/sample_rate;
        self.local_wave_position = self.position.fract();
    }
    pub fn get_local_wave_position(&self) -> f64 {
        self.local_wave_position
    }
}