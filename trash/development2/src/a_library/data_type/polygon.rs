//rust
    use std::fmt;

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a:&str);
    }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{*};
    use crate::a_library::math::{*};
    use crate::a_library::{
        wasm::from_js_sys::{
            js_sys_object_to_vector_of_f32,
        },
    };








pub struct Polygon {
    bounding_box: BoundingBox,
    points: Vec<Point>,
}
impl Polygon {
    pub fn new_empty() -> Polygon {
        Polygon {
            bounding_box: BoundingBox::new(0.0,0.0,0.0,0.0),
            points: vec![],
        }
    }
    pub fn new_from_point_vector(points:Vec<Point>) -> Polygon {
        Polygon {
            bounding_box: BoundingBox::new_from_points(&points),
            points: points,
        }
    }
    pub fn new_from_flat_array(points:Vec<f32>) -> Polygon {
        if points.len() %2 != 0 {
            console_warn!("Polygon::new_from_flat_array : provided array is not divisible by 2 : this Polygon will use as many points as possible");
        }

        let length = points.len()/2 as usize;
        let mut point_vector:Vec<Point> = vec![];

        for index in 0..length {
            point_vector.push( Point::new(points[index*2], points[index*2 +1]) );
        }

        Polygon {
            bounding_box: BoundingBox::new_from_points(&point_vector),
            points: point_vector,
        }
    }
    pub fn new_from_bounding_box(bounding_box:BoundingBox, make_rectangle:bool) -> Polygon {
        if make_rectangle {
            let left = bounding_box.get_top_left().get_x();
            let top = bounding_box.get_top_left().get_y();
            let right = bounding_box.get_bottom_right().get_x();
            let bottom = bounding_box.get_bottom_right().get_y();

            Polygon {
                bounding_box: bounding_box,
                points: vec![
                    Point::new(left, top),
                    Point::new(right, top),
                    Point::new(right, bottom),
                    Point::new(left, bottom),
                ],
            }
        } else {
            Polygon {
                bounding_box: bounding_box,
                points: vec![
                    *bounding_box.get_top_left(),
                    *bounding_box.get_bottom_right(),
                ],
            }
        }
    }
    pub fn new_from_boundings(limit_left:f32, limit_top:f32, limit_right:f32, limit_bottom:f32, make_rectangle:bool) -> Polygon {
        if make_rectangle {
            Polygon::new_from_point_vector(
                vec![
                    Point::new(limit_left, limit_top), 
                    Point::new(limit_right, limit_top), 
                    Point::new(limit_right, limit_bottom), 
                    Point::new(limit_left, limit_bottom)
                ]
            )
        } else {
            Polygon::new_from_point_vector(
                vec![
                    Point::new(limit_left, limit_top), 
                    Point::new(limit_right, limit_bottom), 
                ]
            )
        }
    }
    pub fn new_triangle_from_flat(x0:f32, y0:f32, x1:f32, y1:f32, x2:f32, y2:f32) -> Polygon {
        let point_vector = vec![ Point::new(x0, y0), Point::new(x1, y1), Point::new(x2, y2) ];
        Polygon {
            bounding_box: BoundingBox::new_from_points(&point_vector),
            points: point_vector,
        }
    }
    pub fn new_from_js_sys_object_flat(points:js_sys::Object) -> Option<Polygon> {
        match js_sys_object_to_vector_of_f32(&points) {
            None => None,
            Some(b) => Some(Polygon::new_from_flat_array(b))
        }
    }

    pub fn update_with_bounding_box(&mut self, bounding_box:BoundingBox, make_rectangle:bool) {
        self.bounding_box = bounding_box;

        if make_rectangle {
            let left = bounding_box.get_top_left().get_x();
            let top = bounding_box.get_top_left().get_y();
            let right = bounding_box.get_bottom_right().get_x();
            let bottom = bounding_box.get_bottom_right().get_y();

            self.points.push( Point::new(left, top) );
            self.points.push( Point::new(right, top) );
            self.points.push( Point::new(right, bottom) );
            self.points.push( Point::new(left, bottom) );
        } else {
            self.points.push( *bounding_box.get_top_left() );
            self.points.push( *bounding_box.get_bottom_right() );
        }
    }

    pub fn clone(&self) -> Polygon {
        Polygon {
            bounding_box: self.bounding_box,
            points: self.points.clone(),
        }
    }

    pub fn get_bounding_box(&self) -> &BoundingBox {
        &self.bounding_box
    }
    pub fn get_points_length(&self) -> usize {
        self.points.len()
    }
    pub fn get_points(&self) -> &Vec<Point> {
        &self.points
    }
    pub fn get_point(&self, index:usize) -> &Point {
        &self.points[index]
    }
    pub fn get_point_as_tuple(&self, index:usize) -> (f32,f32) {
        (
            self.points[index].get_x(),
            self.points[index].get_y()
        )
    }
    pub fn get_points_as_flat_array(&self) -> Vec<f32> {
        let mut output:Vec<f32> = vec![];
        for point in &self.points {
            output.extend_from_slice(
                &[point.get_x(), point.get_y()]
            );
        }
        output
    }

    pub fn to_sub_triangles(&self) -> Vec<Polygon> {
        polygon_to_sub_triangles(self, vec![])
    }

    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        let mut point_string:String = String::from("[");
        for (index, point) in self.points.iter().enumerate() {
            point_string = format!("{}{}", point_string, point);
            if index != self.points.len()-1 { point_string = format!("{},", point_string); }
        }
        point_string = format!("{}]", point_string);

        write!(
            f, "{{points:[{}], boundingBox:{}}}",
            point_string,
            self.bounding_box
        )
    }
}
impl fmt::Display for Polygon {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for Polygon {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl PartialEq for Polygon {
    fn eq(&self, other:&Self) -> bool {
        if self.get_points_length() != other.get_points_length() {
            return false;
        }

        for (index,_) in self.points.iter().enumerate() {
            if self.points[index] != other.points[index] {
                return false;
            }
        }

        true
    }
}