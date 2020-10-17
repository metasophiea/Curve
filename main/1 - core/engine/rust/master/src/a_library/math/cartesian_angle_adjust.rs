use crate::a_library::data_type::Point;

pub fn cartesian_angle_adjust(x:f32, y:f32, angle:f32) -> Point {
    if angle == 0.0 { return Point::new(x,y); }
    Point::new(
        x * angle.cos() - y * angle.sin(),
        y * angle.cos() + x * angle.sin(),
    )
}