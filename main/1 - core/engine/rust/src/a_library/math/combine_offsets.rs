use crate::a_library::data_type::Offset;
use crate::a_library::math::cartesian_angle_adjust;

pub fn combine_offsets(a:&Offset, b:&Offset) -> Offset {
    let point = cartesian_angle_adjust(a.get_x(), a.get_y(), b.get_angle());
    Offset::new(
        (point.get_x() * b.get_scale()) + b.get_x(),
        (point.get_y() * b.get_scale()) + b.get_y(),
        b.get_scale() * a.get_scale(),
        b.get_angle() + a.get_angle(),
    )
}