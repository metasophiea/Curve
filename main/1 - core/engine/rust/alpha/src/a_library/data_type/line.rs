//rust
    use std::fmt;

//wasm

//core
    use crate::a_library::data_type::{
        Point,
        BoundingBox,
    };








#[derive(Copy, Clone)]
pub struct Line {
    point_a: Point,
    point_b: Point,
}
impl Line {
    pub fn new_empty() -> Line {
        Line {
            point_a: Point::new(0.0,0.0),
            point_b: Point::new(0.0,0.0),
        }
    }
    pub fn new_from_values(point_a_x:f32, point_a_y:f32, point_b_x:f32, point_b_y:f32) -> Line {
        Line {
            point_a: Point::new(point_a_x,point_a_y),
            point_b: Point::new(point_b_x,point_b_y),
        }
    }
    pub fn new_from_points(point_a:Point, point_b:Point) -> Line {
        Line {
            point_a: point_a,
            point_b: point_b,
        }
    }
    pub fn new_from_point_vector(points:Vec<Point>) -> Line {
        Line {
            point_a: points[0],
            point_b: points[1],
        }
    }

    pub fn get_point_a(&self) -> &Point { &self.point_a }
    pub fn set_point_a(&mut self, new:Point) { self.point_a = new; }
    pub fn get_point_b(&self) -> &Point { &self.point_b }
    pub fn set_point_b(&mut self, new:Point) { self.point_b = new; }

    pub fn get_bounding_box(&self) -> BoundingBox {
        BoundingBox::new_from_points(&[self.point_a, self.point_b])
    }
}
impl Line {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        write!(
            f, "{{point_a:{},point_b:{}}}",
            self.point_a,
            self.point_b,
        )
    }
}
impl fmt::Display for Line {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for Line {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl PartialEq for Line {
    fn eq(&self, other:&Self) -> bool {
        self.point_a == other.point_a && self.point_b == other.point_b
    }
}