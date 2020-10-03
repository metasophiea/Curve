use std::fmt;

pub struct Offset {
    x: f32,
    y: f32,
    scale: f32,
    angle: f32,
}
impl Offset {
    pub fn new(x:f32, y:f32, scale:f32, angle:f32) -> Offset {
        Offset {
            x, y, scale, angle
        }
    }
    pub fn new_default() -> Offset {
        Offset {
            x: 0.0,
            y: 0.0,
            scale: 1.0,
            angle: 0.0
         }
    }
    pub fn update(&mut self, x:f32, y:f32, scale:f32, angle:f32) {
        self.x = x;
        self.y = y;
        self.scale = scale;
        self.angle = angle;
    }

    pub fn get_x(&self) -> f32 { self.x }
    pub fn get_y(&self) -> f32 { self.y }
    pub fn get_scale(&self) -> f32 { self.scale }
    pub fn get_angle(&self) -> f32 { self.angle }
    pub fn set_x(&mut self, new:f32) { self.x = new; }
    pub fn set_y(&mut self, new:f32) { self.y = new; }
    pub fn set_scale(&mut self, new:f32) { self.scale = new; }
    pub fn set_angle(&mut self, new:f32) { self.angle = new; }

    pub fn invert_angle(&mut self) { self.angle = -self.angle; }
}
impl Offset {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f, "{{x:{},y:{},scale:{},angle:{}}}",
            self.x,
            self.y,
            self.scale,
            self.angle,
        )
    }
}
impl fmt::Display for Offset {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for Offset {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}