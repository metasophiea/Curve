use std::fmt;
use crate::a_library::math::cartesian_angle_adjust;

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
}
impl Offset {
    pub fn update(&mut self, x:f32, y:f32, scale:f32, angle:f32) {
        self.x = x;
        self.y = y;
        self.scale = scale;
        self.angle = angle;
    }
    pub fn update_return_is_changed(&mut self, x:f32, y:f32, scale:f32, angle:f32) -> bool {
        let is_changed = self.x != x || self.y != y || self.scale != scale || self.angle != angle;

        self.x = x;
        self.y = y;
        self.scale = scale;
        self.angle = angle;

        is_changed
    }
    pub fn update_with_offset(&mut self, offset:Offset) {
        self.x = offset.get_x();
        self.y = offset.get_y();
        self.scale = offset.get_scale();
        self.angle = offset.get_angle();
    }
    pub fn update_with_offset_return_is_changed(&mut self, offset:Offset) -> bool {
        let is_changed = self.x != offset.get_x() ||  self.y != offset.get_y() || self.scale != offset.get_scale() ||  self.angle != offset.get_angle();

        self.x = offset.get_x();
        self.y = offset.get_y();
        self.scale = offset.get_scale();
        self.angle = offset.get_angle();

        is_changed
    }
}
impl Offset {
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
    pub fn combine(a:&Offset, b:&Offset) -> Offset {
        let point = cartesian_angle_adjust(a.get_x(), a.get_y(), b.get_angle());
        Offset::new(
            (point.get_x() * b.get_scale()) + b.get_x(),
            (point.get_y() * b.get_scale()) + b.get_y(),
            b.get_scale() * a.get_scale(),
            b.get_angle() + a.get_angle(),
        )
    }
}
impl PartialEq for Offset {
    fn eq(&self, other:&Self) -> bool {
        self.x == other.get_x() &&
        self.y == other.get_y() &&
        self.scale == other.get_scale() &&
        self.angle == other.get_angle()
    }
}
impl Offset {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
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
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for Offset {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}