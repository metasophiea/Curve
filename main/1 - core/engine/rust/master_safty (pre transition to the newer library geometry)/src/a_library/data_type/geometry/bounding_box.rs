use std::fmt;

use super::point::Point;

//struct
    #[derive(Copy, Clone)]
    pub struct BoundingBox {
        top_left: Point,
        bottom_right: Point,
    }
//new
    impl BoundingBox {
        pub fn new(left:f32, top:f32, right:f32, bottom:f32) -> BoundingBox {
            BoundingBox {
                top_left: Point::new(left,top),
                bottom_right: Point::new(right,bottom),
            }
        }
        pub fn new_with_points(top_left:Point, bottom_right:Point) -> BoundingBox {
            BoundingBox {
                top_left: top_left,
                bottom_right: bottom_right,
            }
        }
        pub fn new_from_points(points:&[Point]) -> BoundingBox {
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
        pub fn new_from_points_ref(points:&[&Point]) -> BoundingBox {
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
    }
//getters
    impl BoundingBox {
        pub fn get_top_left(&self) -> &Point {
            &self.top_left
        }
        pub fn get_bottom_right(&self) -> &Point {
            &self.bottom_right
        }
    }
//printing
    impl BoundingBox {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
            write!(
                f, "{{topLeft:{}, bottomRight:{}}}",
                self.top_left,
                self.bottom_right,
            )
        }
    }
    impl fmt::Display for BoundingBox {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }
    impl fmt::Debug for BoundingBox {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }
//intersect
    impl BoundingBox {
        pub fn intersect_with_point(&self, point:&Point) -> bool {
            !(
                point.get_x() < self.get_top_left().get_x()     ||  point.get_y() < self.get_top_left().get_y()     ||
                point.get_x() > self.get_bottom_right().get_x() ||  point.get_y() > self.get_bottom_right().get_y()
            )
        }
        pub fn intersect_with_bounding_box(&self, other:&BoundingBox) -> bool {
            self.get_bottom_right().get_y() >= other.get_top_left().get_y() && 
            self.get_bottom_right().get_x() >= other.get_top_left().get_x() && 
            self.get_top_left().get_y() <= other.get_bottom_right().get_y() && 
            self.get_top_left().get_x() <= other.get_bottom_right().get_x()
        }
        //line //currently not needed
        //simple_poly //currently not needed
        //complex_polygon  //currently not needed
    }