//rust
    use std::fmt;

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a:&str);
        #[wasm_bindgen(js_namespace = console)]
        fn error(a:&str);
    }
    // macro_rules! console_log {
    //     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    // }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }
    macro_rules! console_error {
        ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{
        Direction,
        LineSide,
        LineIntersectionResult,
        LinePolygonIntersectionResult,

        Point,
        BoundingBox,
        SimplePolygon,
        ComplexPolygon,
    };








//struct
    #[derive(Copy, Clone)]
    pub struct Line {
        point_a: Point,
        point_b: Point,
    }
//new
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
        pub fn new_from_points_ref(point_a:&Point, point_b:&Point) -> Line {
            Line::new_from_points(*point_a, *point_b)
        }
        pub fn new_from_point_vector(points:Vec<Point>) -> Line {
            if points.len() < 2 {
                console_error!("Line::new_from_point_vector - supplied vector doesn't have enough points");
                return Line::new_empty();
            } else if points.len() > 2 {
                console_error!("Line::new_from_point_vector - supplied vector has too many points");
                return Line::new_empty();
            }
            Line {
                point_a: points[0],
                point_b: points[1],
            }
        }
    }
//getters
    impl Line {
        pub fn get_point_a(&self) -> &Point { &self.point_a }
        pub fn get_point_b(&self) -> &Point { &self.point_b }
        pub fn get_bounding_box(&self) -> BoundingBox {
            BoundingBox::new_from_points(&[self.point_a, self.point_b])
        }
    }
//setters
    impl Line {
        pub fn set_point_a(&mut self, new:Point) { self.point_a = new; }
        pub fn set_point_b(&mut self, new:Point) { self.point_b = new; }
        pub fn update_by_ref(&mut self, a:&Point, b:&Point) {
            self.point_a.set_from_point_ref(a);
            self.point_b.set_from_point_ref(b);
        }
    }
//printing
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
//comparison
    impl PartialEq for Line {
        fn eq(&self, other:&Self) -> bool {
            self.point_a == other.point_a && self.point_b == other.point_b
        }
    }
//intersect
    impl Line {
        pub fn intersect_with_point(&self, point:&Point) -> LineSide {
            let distance_from_line = 
                (self.get_point_b().get_x() - self.get_point_a().get_x()) * (point.get_y() - self.get_point_a().get_y()) - 
                (self.get_point_b().get_y() - self.get_point_a().get_y()) * (point.get_x() - self.get_point_a().get_x())
            ;
            
            if distance_from_line > 0.0 {
                return LineSide::Right;
            } else if distance_from_line < 0.0 {
                return LineSide::Left;
            }
            
            //point is on line, but is it within the segment?
            
            if !(
                ( point.get_x() < self.get_point_a().get_x() && point.get_x() < self.get_point_b().get_x() ) ||
                ( point.get_y() < self.get_point_a().get_y() && point.get_y() < self.get_point_b().get_y() ) ||
                ( point.get_x() > self.get_point_a().get_x() && point.get_x() > self.get_point_b().get_x() ) ||
                ( point.get_y() > self.get_point_a().get_y() && point.get_y() > self.get_point_b().get_y() )
            ) {
                LineSide::Upon
            } else {
                LineSide::AlignedButOff
            }
        }
        //bounding box //currently not needed
        pub fn intersect_with_line(&self, other:&Line) -> LineIntersectionResult {
            if !self.get_bounding_box().intersect_with_bounding_box(&other.get_bounding_box()) {
                return LineIntersectionResult { point:None, range:None, contact:false, intersect:false, direction:None };
            }
        
            let self_a_x = self.get_point_a().get_x();
            let self_a_y = self.get_point_a().get_y();
            let self_b_x = self.get_point_b().get_x();
            let self_b_y = self.get_point_b().get_y();
            let other_a_x = other.get_point_a().get_x();
            let other_a_y = other.get_point_a().get_y();
            let other_b_x = other.get_point_b().get_x();
            let other_b_y = other.get_point_b().get_y();

            //detect point-on-point
                let self_a_on_other_a = self_a_x == other_a_x && self_a_y == other_a_y;
                let self_a_on_other_b = self_a_x == other_b_x && self_a_y == other_b_y;
                let self_b_on_other_a = self_b_x == other_a_x && self_b_y == other_a_y;
                let self_b_on_other_b = self_b_x == other_b_x && self_b_y == other_b_y;

            //identical lines
                if ( self_a_on_other_a && self_a_on_other_b ) || ( self_b_on_other_a && self_b_on_other_b ) {
                    return LineIntersectionResult { 
                        point: None, 
                        range: Some(*other),
                        contact: true,
                        intersect: false, 
                        direction: None,
                    };
                }
            
            //parallel lines
                let denominator = ( ( other_b_y-other_a_y ) * ( self_b_x-self_a_x ) ) - ( ( other_b_x-other_a_x ) * ( self_b_y-self_a_y ) );
                if denominator == 0.0 { //indicates that the two lines are parallel
                    let mut range:Vec<Point> = vec![];

                    if self_a_on_other_a || self_a_on_other_b { range.push(*self.get_point_a()); }
                    if self_b_on_other_a || self_b_on_other_b { range.push(*self.get_point_b()); }

                    if !self_a_on_other_a && !self_a_on_other_b {//if self_a is not on one of the other's point, then find out if its on there at all
                        if other.intersect_with_point(&self.get_point_a()) == LineSide::Upon {
                            range.push(*self.get_point_a());
                        }
                    }
                    if !self_b_on_other_a && !self_b_on_other_b {//if self_b is not on one of the other's point, then find out if its on there at all
                        if other.intersect_with_point(&self.get_point_b()) == LineSide::Upon {
                            range.push(*self.get_point_b());
                        }
                    }
                    if !self_a_on_other_a && !self_b_on_other_a {//if other_a is not on one of the self's point, then find out if its on there at all
                        if self.intersect_with_point(&other.get_point_a()) == LineSide::Upon {
                            range.push(*other.get_point_a());
                        }
                    }
                    if !self_a_on_other_b && !self_b_on_other_b {//if other_b is not on one of the self's point, then find out if its on there at all
                        if self.intersect_with_point(&other.get_point_b()) == LineSide::Upon {
                            range.push(*other.get_point_b());
                        }
                    }

                    return if range.len() == 0 { //no touching
                        LineIntersectionResult {point:None, range:None, contact:false, intersect:false, direction:None}
                    } else if range.len() == 1 { //only touching at one point
                        LineIntersectionResult {
                            point: Some(range[0]),
                            range: None,
                            contact: true,
                            intersect: false,
                            direction: None,
                        }
                    } else if range.len() == 2 { //touching at two points (a range of values)
                        LineIntersectionResult {
                            point: None,
                            range: Some(Line::new_from_point_vector(range)),
                            contact: true,
                            intersect: false,
                            direction: None,
                        }
                    } else {
                        console_warn!("Line::intersect_with_line - line overlap, but more than 2 points found?");
                        LineIntersectionResult {point:None, range:None, intersect:false, contact:true, direction:None}
                    }
                }

            //otherwise...
                let u1 = ( ( (other_b_x-other_a_x) * (self_a_y-other_a_y) ) - ( (other_b_y-other_a_y) * (self_a_x-other_a_x) ) ) / denominator;
                let u2 = ( ( (self_b_x-self_a_x) * (self_a_y-other_a_y) ) - ( (self_b_y-self_a_y) * (self_a_x-other_a_x) ) ) / denominator;
                let contact = (u1 >= 0.0 && u1 <= 1.0) && (u2 >= 0.0 && u2 <= 1.0);
                let intersect = (u1 > 0.0 && u1 < 1.0) && (u2 > 0.0 && u2 < 1.0);

                let direction = if !contact {
                    None
                } else {
                    let a_side = self.intersect_with_point(&other.get_point_a());
                    let b_side = self.intersect_with_point(&other.get_point_b());

                    if (a_side == LineSide::Right && b_side != LineSide::Right) || (b_side == LineSide::Left && a_side != LineSide::Left) {
                        Some(Direction::Left)
                    } else {
                        Some(Direction::Right)
                    }
                };

                LineIntersectionResult {
                    point: if contact {
                        Some(Point::new(
                            self_a_x + u1*(self_b_x-self_a_x),
                            self_a_y + u1*(self_b_y-self_a_y),
                        ))
                    } else {
                        None
                    },
                    range: None, 
                    contact: contact,
                    intersect: intersect, 
                    direction: direction,
                }
        }
        pub fn intersect_with_simple_polygon(&self, simple_polygon:&SimplePolygon) -> LinePolygonIntersectionResult {
            simple_polygon.intersect_with_line(self)
        }
        pub fn intersect_with_complex_polygon(&self, complex_polygon:&ComplexPolygon) -> LinePolygonIntersectionResult {
            complex_polygon.intersect_with_line(self)
        }
    }