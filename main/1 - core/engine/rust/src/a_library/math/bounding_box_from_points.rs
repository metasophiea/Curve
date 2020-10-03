use crate::a_library::data_type::{
    Point,
    BoundingBox,
};

pub fn bounding_box_from_points(points: &[Point]) -> BoundingBox {
    if points.len() == 0 {
        return BoundingBox::new( 0.0, 0.0, 0.0, 0.0 );
    }

    if points.len() == 1 {
        return BoundingBox::new( 
            points[0].get_x(), points[0].get_y(),
            points[0].get_x(), points[0].get_y()
        );
    }

    if points.len() == 2 {
        if points[0].get_x() < points[1].get_x() {
            if points[0].get_y() < points[1].get_y() {
                return BoundingBox::new(
                    points[0].get_x(), points[0].get_y(),
                    points[1].get_x(), points[1].get_y(),
                );
            }else{
                return BoundingBox::new(
                    points[0].get_x(), points[1].get_y(),
                    points[1].get_x(), points[0].get_y(),
                );
            }
        }else{
            if points[0].get_y() < points[1].get_y() {
                return BoundingBox::new(
                    points[1].get_x(), points[0].get_y(),
                    points[0].get_x(), points[1].get_y(),
                );
            }else{
                return BoundingBox::new(
                    points[1].get_x(), points[1].get_y(),
                    points[0].get_x(), points[0].get_y(),
                );
            }
        }
    }

    let mut left = points[0].get_x(); let mut right = points[0].get_x();
    let mut top = points[0].get_y();  let mut bottom = points[0].get_y();
    for point in points {
        if point.get_x() < left { left = point.get_x(); }
        else if point.get_x() > right { right = point.get_x(); }

        if point.get_y() < top { top = point.get_y(); }
        else if point.get_y() > bottom { bottom = point.get_y(); }
    }
    BoundingBox::new( left, top, right, bottom )
}

pub fn bounding_box_from_points_refref(points: &[&Point]) -> BoundingBox {
    if points.len() == 0 {
        return BoundingBox::new( 0.0, 0.0, 0.0, 0.0 );
    }

    if points.len() == 1 {
        return BoundingBox::new( 
            points[0].get_x(), points[0].get_y(),
            points[0].get_x(), points[0].get_y()
        );
    }

    if points.len() == 2 {
        if points[0].get_x() < points[1].get_x() {
            if points[0].get_y() < points[1].get_y() {
                return BoundingBox::new(
                    points[0].get_x(), points[0].get_y(),
                    points[1].get_x(), points[1].get_y(),
                );
            }else{
                return BoundingBox::new(
                    points[0].get_x(), points[1].get_y(),
                    points[1].get_x(), points[0].get_y(),
                );
            }
        }else{
            if points[0].get_y() < points[1].get_y() {
                return BoundingBox::new(
                    points[1].get_x(), points[0].get_y(),
                    points[0].get_x(), points[1].get_y(),
                );
            }else{
                return BoundingBox::new(
                    points[1].get_x(), points[1].get_y(),
                    points[0].get_x(), points[0].get_y(),
                );
            }
        }
    }

    let mut left = points[0].get_x(); let mut right = points[0].get_x();
    let mut top = points[0].get_y();  let mut bottom = points[0].get_y();
    for point in points {
        if point.get_x() < left { left = point.get_x(); }
        else if point.get_x() > right { right = point.get_x(); }

        if point.get_y() < top  { top = point.get_y(); }
        else if point.get_y() > bottom { bottom = point.get_y(); }
    }
    BoundingBox::new( left, top, right, bottom )
}