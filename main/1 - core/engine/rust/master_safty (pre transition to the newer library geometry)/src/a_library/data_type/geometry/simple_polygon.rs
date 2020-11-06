#![allow(non_camel_case_types)]

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
        #[wasm_bindgen(js_namespace = ["library", "_thirdparty"])]
        fn earcut(points:&[f32], holeIndices:&[usize]) -> Vec<f32>;
    }
    // macro_rules! console_log {
    //     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    // }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{
        Direction,
        LinePolygonIntersectionResult,
        PolygonIntersectionResult,
        LineSide,
        PolySide,

        Point,
        BoundingBox,
        Line,
        ComplexPolygon,
    };
    use crate::a_library::{
        wasm::from_js_sys::{
            js_sys_object_to_vector_of_f32,
        },
    };








//struct
    pub struct SimplePolygon {
        points: Vec<Point>,
    }
//new
    impl SimplePolygon {
        pub fn new_from_point_vector(points:Vec<Point>) -> SimplePolygon {
            SimplePolygon {
                points: points,
            }
        }
        pub fn new_default() -> SimplePolygon {
            SimplePolygon::new_from_point_vector(vec![])
        }
        pub fn new_from_flat_array_reference(points:&Vec<f32>) -> SimplePolygon {
            if points.len() %2 != 0 {
                console_warn!("SimplePolygon::new_from_flat_array/new_from_flat_array_reference : provided array is not divisible by 2 : this SimplePolygon will use as many points as possible");
            }

            let length = points.len()/2 as usize;
            let mut point_vector:Vec<Point> = vec![];

            for index in 0..length {
                point_vector.push( Point::new(points[index*2], points[index*2 +1]) );
            }

            SimplePolygon::new_from_point_vector(point_vector)
        }
        pub fn new_from_flat_array(points:Vec<f32>) -> SimplePolygon {
            SimplePolygon::new_from_flat_array_reference(&points)
        }
        pub fn new_from_boundings(limit_left:f32, limit_top:f32, limit_right:f32, limit_bottom:f32, make_rectangle:bool) -> SimplePolygon {
            if make_rectangle {
                SimplePolygon::new_from_point_vector(
                    vec![
                        Point::new(limit_left, limit_top), 
                        Point::new(limit_right, limit_top), 
                        Point::new(limit_right, limit_bottom), 
                        Point::new(limit_left, limit_bottom)
                    ]
                )
            } else {
                SimplePolygon::new_from_point_vector(
                    vec![
                        Point::new(limit_left, limit_top), 
                        Point::new(limit_right, limit_bottom), 
                    ]
                )
            }
        }
        pub fn new_from_bounding_box(bounding_box:BoundingBox, make_rectangle:bool) -> SimplePolygon {
            SimplePolygon::new_from_boundings(
                bounding_box.get_top_left().get_x(),
                bounding_box.get_top_left().get_y(),
                bounding_box.get_bottom_right().get_x(),
                bounding_box.get_bottom_right().get_y(),
                make_rectangle
            )
        }
        pub fn new_triangle(x0:f32, y0:f32, x1:f32, y1:f32, x2:f32, y2:f32) -> SimplePolygon {
            SimplePolygon::new_from_point_vector(
                vec![ Point::new(x0, y0), Point::new(x1, y1), Point::new(x2, y2) ]
            )
        }
        pub fn new_rectangle(x0:f32, y0:f32, x1:f32, y1:f32, x2:f32, y2:f32, x3:f32, y3:f32) -> SimplePolygon {
            SimplePolygon::new_from_point_vector(
                vec![ Point::new(x0, y0), Point::new(x1, y1), Point::new(x2, y2), Point::new(x3, y3) ]
            )
        }
        pub fn new_from_js_sys_object_flat(points:js_sys::Object) -> Option<SimplePolygon> {
            match js_sys_object_to_vector_of_f32(&points) {
                None => None,
                Some(b) => Some(SimplePolygon::new_from_flat_array(b))
            }
        }
    }
//clone
    impl SimplePolygon {
        pub fn clone(&self) -> SimplePolygon {
            SimplePolygon {
                points: self.points.clone(),
            }
        }
    }
//getters
    impl SimplePolygon {
        //points
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

        //lines
            pub fn get_line_count(&self) -> usize {
                self.points.len()
            }
            pub fn get_lines(&self) -> Vec<Line> {
                let mut output = vec![];

                for index_a in 0..self.points.len()-1 {
                    output.push(
                        Line::new_from_points(
                            self.points[index_a],
                            self.points[index_a+1],
                        )
                    );
                }
                output.push(
                    Line::new_from_points(
                        self.points[self.points.len()-1],
                        self.points[0],
                    )
                );

                output
            }

        //bounding box
            pub fn get_bounding_box(&self) -> BoundingBox {
                BoundingBox::new_from_points(&self.points)
            }
    }
//setters
    impl SimplePolygon {
        pub fn prepend_point(&mut self, point:Point) {
            self.points.insert(0, point);
        }
        pub fn add_point(&mut self, point:Point) {
            self.points.push(point);
        }
    }
//sub triangles
    impl SimplePolygon {
        pub fn to_sub_triangles_flat_array(&self) -> Vec<f32> {
            earcut(
                &self.get_points_as_flat_array(),
                &[]
            )
        }
        pub fn to_sub_triangles_triangles(&self) -> Vec<SimplePolygon> {
            let flat_array = self.to_sub_triangles_flat_array();
            let mut output:Vec<SimplePolygon> = vec![];

            for index in (0..flat_array.len()).step_by(6) {
                output.push(
                    SimplePolygon::new_triangle(
                        flat_array[index+0],
                        flat_array[index+1],
                        flat_array[index+2],
                        flat_array[index+3],
                        flat_array[index+4],
                        flat_array[index+5],
                    )
                );
            }

            output
        }
    }
//printing
    impl SimplePolygon {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
            let mut point_string:String = String::from("[");
            for (index, point) in self.points.iter().enumerate() {
                point_string = format!("{}{}", point_string, point);
                if index != self.points.len()-1 { point_string = format!("{},", point_string); }
            }
            point_string = format!("{}]", point_string);

            write!(f, "{}", point_string)
        }
    }
    impl fmt::Display for SimplePolygon {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }
    impl fmt::Debug for SimplePolygon {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }
//comparison
    impl PartialEq for SimplePolygon {
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
//intersect
    impl SimplePolygon {
        pub fn intersect_with_point(&self, point:&Point) -> PolySide {
            if !self.get_bounding_box().intersect_with_bounding_box(&BoundingBox::new_from_points(&[*point])) {
                return PolySide::Outside; 
            }
        
            let point_x = point.get_x();
            let point_y = point.get_y();
        
            //check if the point is on a point of the poly; bail and return 'onPoint'
            for poly_point in self.get_points() {
                if point_x == poly_point.get_x() && point_y == poly_point.get_y() {
                    return PolySide::OnPoint;
                }
            }
            
            fn point_level_with_poly_point_checker(poly:&SimplePolygon, point:&Point, index_a:usize, index_b:usize) -> bool {
                //only flip, if the point is not perfectly level with point a of the line 
                //or if you can prove that the a's two adjacent points are higher and lower than the matching point's level
                //(the system will come round to having this same point be point b)

                if poly.get_point(index_a).get_y() != point.get_y() && poly.get_point(index_b).get_y() != point.get_y() {
                    return true;
                } else if poly.get_point(index_a).get_y() == point.get_y() {
                    //point is perfectly level with a point on the poly (line point a)
                    //walk forward and backward through the poly's points until you find two that are not level

                    let mut forward_position:Option<bool> = None; // Some(false) / None / Some(true) > below / level / above
                    let mut backward_position:Option<bool> = None; // Some(false) / None / Some(true) > below / level / above
                    for index_offset in 1..(poly.get_points_length()/2 + 1) {
                        //forward test
                            if forward_position.is_none() {
                                let forward_index = if (index_a + index_offset) >= poly.get_points_length() {
                                    index_a + index_offset - poly.get_points_length()
                                } else {
                                    index_a + index_offset
                                };
                                if poly.get_point(forward_index).get_y() < poly.get_point(index_a).get_y() {
                                    //forward_index is lower than this point
                                    forward_position = Some(false);
                                } else if poly.get_point(forward_index).get_y() > poly.get_point(index_a).get_y() {
                                    //forward_index is higher than this point
                                    forward_position = Some(true);
                                }
                            }

                        //backward test
                            if backward_position.is_none() {
                                let backward_index = if (index_a as isize - index_offset as isize) < 0 {
                                    poly.get_points_length() + index_a - index_offset
                                } else {
                                    index_a - index_offset
                                };
                                if poly.get_point(backward_index).get_y() < poly.get_point(index_a).get_y() {
                                    //backward_index is lower than this point");
                                    backward_position = Some(false);
                                } else if poly.get_point(backward_index).get_y() > poly.get_point(index_a).get_y() {
                                    //backward_index is higher than this point
                                    backward_position = Some(true);
                                }
                            }
                        
                        //if we've found both, then you can skip out
                            if forward_position.is_some() && backward_position.is_some() { break; }
                    }

                    //if both position slots are filled and they show that one is above and the other is below; return true 
                    return forward_position.is_some() && backward_position.is_some() && forward_position.unwrap() ^ backward_position.unwrap();
                }

                return false;
            }

            //Ray casting algorithm (casting to the left (negative X))
            let mut inside:bool = false;
            let mut index_b = self.get_points_length() - 1;
            for (index_a,_) in self.get_points().iter().enumerate() {
                let poly_a_x = self.get_point(index_a).get_x();
                let poly_a_y = self.get_point(index_a).get_y();
                let poly_b_x = self.get_point(index_b).get_x();
                let poly_b_y = self.get_point(index_b).get_y();
        
                //point must be on the same level of the line
                if 
                    ( poly_b_y >= point_y && poly_a_y <= point_y ) ||
                    ( poly_a_y >= point_y && poly_b_y <= point_y ) 
                {
                    //discover if the point is on the far right of the line
                    if poly_a_x < point_x && poly_b_x < point_x {
                        //point is on far right of line
                        //only flip if the line is not perfectly level (which would make the ray skirt the line)
                        if poly_a_y != poly_b_y {
                            if point_level_with_poly_point_checker(self, &point, index_a, index_b) {
                                inside = !inside;
                            }
                        }
        
                    //discover if the point is on the far left of the line, skip it if so
                    } else if poly_a_x > point_x && poly_b_x > point_x {
                        index_b = index_a;
                        continue;
                    }else{
                        //calculate what side of the line this point is
                            let area_location:Option<f32> = if poly_b_y > poly_a_y && poly_b_x > poly_a_x {
                                Some( (point_x-poly_a_x)/(poly_b_x-poly_a_x) - (point_y-poly_a_y)/(poly_b_y-poly_a_y) + 1.0 )
                            } else if poly_b_y <= poly_a_y && poly_b_x <= poly_a_x {
                                Some( (point_x-poly_b_x)/(poly_a_x-poly_b_x) - (point_y-poly_b_y)/(poly_a_y-poly_b_y) + 1.0 )
                            } else if poly_b_y > poly_a_y && poly_b_x < poly_a_x {
                                Some( (point_x-poly_b_x)/(poly_a_x-poly_b_x) + (point_y-poly_a_y)/(poly_b_y-poly_a_y) )
                            } else if poly_b_y <= poly_a_y && poly_b_x >= poly_a_x {
                                Some( (point_x-poly_a_x)/(poly_b_x-poly_a_x) + (point_y-poly_b_y)/(poly_a_y-poly_b_y) )
                            } else {
                                None
                            };
        
                        //if its on the line, return 'onEdge' immediately, if it's above 1 do a flip
                            if area_location.is_none() || area_location.unwrap().is_nan() || area_location.unwrap() == 1.0 {
                                return PolySide::OnEdge;
                            } else if area_location.unwrap() > 1.0 {
                                if point_level_with_poly_point_checker(self, &point, index_a, index_b) {
                                    inside = !inside;
                                }
                            }
                    }
                } else {
                    //point is not on the same level as the line
                }
                index_b = index_a;
            }
        
            if inside { 
                PolySide::Inside 
            } else { 
                PolySide::Outside 
            }
        }
        //bounding box //currently not needed
        pub fn intersect_with_line(&self, line:&Line) -> LinePolygonIntersectionResult {
            //quick detection of clearly different shapes
                if !self.get_bounding_box().intersect_with_bounding_box(&line.get_bounding_box()) {
                    return LinePolygonIntersectionResult { points:vec![], contact:false, intersect:false, inverse_intersect:true, traverse:false };
                }

            //utilities
                fn search_for_duplicate_point_in_vector(vector:&Vec<Point>, point:&Point) -> bool {
                    for p in vector {
                        if p == point {
                            return true;
                        }
                    }
                    false
                }
                #[derive(PartialEq, Debug)]
                enum LinePointState {
                    Inside,
                    Outside,

                    NoTouch_NoPoint,
                    NoTouch_PointButNoDirection,

                    BothSides,
                }

            let mut output_result = LinePolygonIntersectionResult {
                points: vec![],
                contact: false,
                intersect: false,
                inverse_intersect: false,
                traverse: false,
            };

            //get the line's point's positions relative to the polygon
                let line_point_a_result = self.intersect_with_point(&line.get_point_a());
                let line_point_b_result = self.intersect_with_point(&line.get_point_b());

            //if one of the points is outside the polygon while the other is inside the polygon, that's a traversal
                output_result.traverse |= (line_point_a_result == PolySide::Outside && line_point_b_result == PolySide::Inside) || (line_point_a_result == PolySide::Inside && line_point_b_result == PolySide::Outside);
            //if either of the points are inside the polygon, that's an intersect (also a traversal is an intersect)
                output_result.intersect |= line_point_b_result == PolySide::Inside || line_point_a_result == PolySide::Inside || output_result.traverse;
            //if either of the points are outside the polygon, that's an inverse_intersect (also a traversal is an inverse_intersect)
                output_result.inverse_intersect |= line_point_b_result == PolySide::Outside || line_point_a_result == PolySide::Outside || output_result.traverse;

                let mut poly_line_side_first:Option<(LinePointState,Option<Point>)> = None;
                let mut poly_line_side_last:Option<(LinePointState,Option<Point>)> = None;

                for poly_line in self.get_lines() {
                    //get intersect data for the line and this line of the polygon
                        let line_on_line_result = poly_line.intersect_with_line(&line);

                    //a contact between the two, is a contact indeed
                        output_result.contact |= line_on_line_result.contact;
                    //the two lines intersecting is a traversal
                        output_result.traverse |= line_on_line_result.intersect;
                    //if it traverses, it has to intersect
                        output_result.intersect |= output_result.traverse;
                    //if it traverses, it has to inverse_intersect
                        output_result.inverse_intersect |= output_result.traverse;

                    //add points of contact
                        if line_on_line_result.contact {
                            match line_on_line_result.point {
                                None => {},
                                Some(point) => {
                                    if !search_for_duplicate_point_in_vector(&output_result.points, &point) {
                                        output_result.points.push(point);
                                    }
                                },
                            }
                            match line_on_line_result.range {
                                None => {},
                                Some(range) => {
                                    if !search_for_duplicate_point_in_vector(&output_result.points, range.get_point_a()) {
                                        output_result.points.push(*range.get_point_a());
                                    }
                                    if !search_for_duplicate_point_in_vector(&output_result.points, range.get_point_b()) {
                                        output_result.points.push(*range.get_point_b());
                                    }
                                }
                            }
                        }

                    //get side of polygon
                        //here we determine what side of the polygon the line is on. Polygons are wound clockwise, thus if a line is heading towards the left of a line of the polygon; its heading towards the inside.
                        //ofcourse we have to also think about which side the points are on; if the line is heading towards the left but all its points are on the right, then its outside. This code requires that the two
                        //lines be in contact, and that there is only one point of contact; otherwise "NoTouch" states are returned. With the correct set-up, the code then figures out what side the points are on to
                        //determine what side the line is on. Here we can also populate the output_result.intersect and output_result.inverse_intersect if we get a nice clean result.output_result
                        // In more unusual situations, the lines may cross each other, returning a "BothSides" state. Or the line's points may not be on the polygon line, but a points of the polygon line may be on the
                        // line. In this case, we split the line in two and recursively run the intersect_with_line with the two resulting line segments the results from these runs are compiled together into the
                        // output_result, and immediately returned
                        let polygon_side = match &line_on_line_result.point {
                            None => LinePointState::NoTouch_NoPoint, //the lines have no point of contact, thus the line isn't going across the polygon line in any direction, or is parallel to it
                            Some(point) => {
                                match &line_on_line_result.direction {
                                    None => LinePointState::NoTouch_PointButNoDirection, //the lines do have a point of contact, but they are parallel to each other
                                    Some(direction) => {
                                        if line.get_point_a() == point || poly_line.intersect_with_point(&line.get_point_a()) == LineSide::Upon { //the point of contact is the A point of the line, or at least this line point A is on the polygon line somewhere
                                            if direction == &Direction::Right {
                                                output_result.intersect |= line_point_a_result == PolySide::OnEdge; //inside and OnEdge? well hot damn
                                                LinePointState::Inside 
                                            } else {
                                                output_result.inverse_intersect |= line_point_a_result == PolySide::OnEdge; //outside and OnEdge? well hot damn
                                                LinePointState::Outside
                                            }
                                        } else if line.get_point_b() == point || poly_line.intersect_with_point(&line.get_point_b()) == LineSide::Upon { //the point of contact is the B point of the line, or at least this line point B is on the polygon line somewhere
                                            if direction == &Direction::Left {
                                                output_result.intersect |= line_point_b_result == PolySide::OnEdge; //inside and OnEdge? well hot damn
                                                LinePointState::Inside
                                            } else {
                                                output_result.inverse_intersect |= line_point_a_result == PolySide::OnEdge; //outside and OnEdge? well hot damn
                                                LinePointState::Outside
                                            }
                                        } else if line.intersect_with_point(&poly_line.get_point_a()) == LineSide::Upon || line.intersect_with_point(&poly_line.get_point_b()) == LineSide::Upon { //looks to me like a point of the polygon line is touching the body of the line
                                            let line_section_a_result = self.intersect_with_line( &Line::new_from_points_ref(line.get_point_a(), point) );
                                            let line_section_b_result = self.intersect_with_line( &Line::new_from_points_ref(point, line.get_point_b()) );

                                            for point in line_section_a_result.points {
                                                if !search_for_duplicate_point_in_vector(&output_result.points, &point) {
                                                    output_result.points.push(point);
                                                }
                                            }
                                            for point in line_section_b_result.points {
                                                if !search_for_duplicate_point_in_vector(&output_result.points, &point) {
                                                    output_result.points.push(point);
                                                }
                                            }

                                            output_result.contact |= line_section_a_result.contact || line_section_b_result.contact;
                                            output_result.intersect |= line_section_a_result.intersect || line_section_b_result.intersect;
                                            output_result.inverse_intersect |= line_section_a_result.inverse_intersect || line_section_b_result.inverse_intersect;
                                            output_result.traverse |= line_section_a_result.traverse || line_section_b_result.traverse;

                                            return output_result;
                                        } else {
                                            LinePointState::BothSides
                                        }
                                    },
                                }
                            },
                        };

                    //detect double-inside/double-outside
                        if !output_result.intersect && !output_result.inverse_intersect { //this is only for populating output_result.intersect and output_result.inverse_intersect, so, don't bother if it they have already been detected
                            match poly_line_side_last.as_ref() {
                                Some(last) => {
                                    if last.1.is_some() && line_on_line_result.point.is_some() {
                                        if 
                                            last.1.unwrap() == line_on_line_result.point.unwrap() && //points must be the same (like a book)
                                            (last.0 == LinePointState::Inside || last.0 == LinePointState::NoTouch_PointButNoDirection) && polygon_side == LinePointState::Inside
                                        {
                                            output_result.intersect = true;
                                        }
                                        if 
                                            last.1.unwrap() == line_on_line_result.point.unwrap() && //points must be the same (like a book)
                                            (last.0 == LinePointState::Outside || last.0 == LinePointState::NoTouch_PointButNoDirection || last.0 == LinePointState::Inside) && polygon_side == LinePointState::Outside 
                                        {
                                            output_result.inverse_intersect = true;
                                        }
                                    }
                                },
                                None => {
                                    match poly_line_side_first.as_ref() {
                                        None => {},
                                        Some(first) => {
                                            if first.1.is_some() && line_on_line_result.point.is_some() {
                                                if 
                                                    first.1.unwrap() == line_on_line_result.point.unwrap() && //points must be the same (like a book)
                                                    (first.0 == LinePointState::Inside || first.0 == LinePointState::NoTouch_PointButNoDirection) && polygon_side == LinePointState::Inside
                                                {
                                                    output_result.intersect = true;
                                                }

                                                if 
                                                    first.1.unwrap() == line_on_line_result.point.unwrap() && //points must be the same (like a book)
                                                    (first.0 == LinePointState::Outside || first.0 == LinePointState::NoTouch_PointButNoDirection || first.0 == LinePointState::Inside) && polygon_side == LinePointState::Outside 
                                                {
                                                    output_result.inverse_intersect = true;
                                                }
                                            }
                                        },
                                    }
                                },
                            }
                        }

                    //push findings to storage
                        //if there's nothing in the 'first' slot, then this must be the first iteration, thus fill the 'first' slot otherwise, fill the 'last' slot
                        if poly_line_side_first.is_none() {
                            poly_line_side_first = Some((polygon_side, line_on_line_result.point));
                        } else {
                            poly_line_side_last = Some((polygon_side, line_on_line_result.point));
                        }
                }

                //finishing off that double-inside/double-outside detection from earlier
                    if !output_result.intersect && !output_result.inverse_intersect { //this is only for populating output_result.intersect and output_result.inverse_intersect, so, don't bother if it they have already been detected
                        let poly_line_side_first = poly_line_side_first.unwrap();
                        let poly_line_side_last = poly_line_side_last.unwrap();
                        if 
                            poly_line_side_last.1 == poly_line_side_first.1 &&  //points must be the same (like a book)
                            (poly_line_side_last.0 == LinePointState::Inside || poly_line_side_last.0 == LinePointState::NoTouch_PointButNoDirection) && poly_line_side_first.0 == LinePointState::Inside
                        {
                            output_result.intersect = true;
                        }
                        if 
                            poly_line_side_last.1 == poly_line_side_first.1 &&  //points must be the same (like a book)
                            (poly_line_side_last.0 == LinePointState::Outside || poly_line_side_last.0 == LinePointState::NoTouch_PointButNoDirection || poly_line_side_last.0 == LinePointState::Inside) && poly_line_side_first.0 == LinePointState::Outside
                        {
                            output_result.inverse_intersect = true;
                        }
                    }

            output_result
        }
        pub fn intersect_with_simple_polygon(&self, other:&SimplePolygon) -> PolygonIntersectionResult {
            //clearly different polygons
                if !self.get_bounding_box().intersect_with_bounding_box(&other.get_bounding_box()) {
                    return PolygonIntersectionResult { points:vec![], contact:false, intersect:false, traverse:false, first_contains_second_without_contact:None };
                }

            //identical polygons
                if self == other {
                    return PolygonIntersectionResult {
                        points: self.get_points().to_vec(),
                        contact: true,
                        intersect: true,
                        traverse: false,
                        first_contains_second_without_contact: None,
                    };
                }

            let mut output_result = PolygonIntersectionResult {
                points: vec![],
                contact: false,
                intersect: false,
                traverse: false,
                first_contains_second_without_contact: None,
            };

            //find all side intersection points
            //also, if one side intersects and inverse_intersects; that's a traversal
                let mut running_intersect = false;
                let mut running_inverse_intersect = false;

                let mut a_a = self.get_points_length() - 1;
                for a_b in 0..self.get_points_length() {
                    let tmp = other.intersect_with_line( &Line::new_from_points(*self.get_point(a_a),*self.get_point(a_b)) );
                    // console_log!("{}", tmp);

                    for point in tmp.points {
                        match output_result.points.iter().find( |&&x| x == point ) {
                            Some(_) => {},
                            None => output_result.points.push(point),
                        }
                    }

                    running_intersect |= tmp.intersect;
                    running_inverse_intersect |= tmp.inverse_intersect;

                    output_result.contact |= tmp.contact;
                    output_result.intersect |= tmp.intersect;
                    output_result.traverse |= tmp.traverse;

                    a_a = a_b;
                }

                output_result.traverse |= running_intersect && running_inverse_intersect;

            //check if other polygon is totally inside self polygon (the reverse comes later)    
                if !output_result.contact && running_intersect && !running_inverse_intersect {
                    output_result.first_contains_second_without_contact = Some(false);
                }
                
            //if no intersect has been found but contact has; check again but the other way around
                running_intersect = false;
                running_inverse_intersect = false;

                if output_result.contact && !output_result.intersect || !output_result.traverse {
                    let mut a_a = other.get_points_length() - 1;
                    for a_b in 0..other.get_points_length() {
                        let tmp = self.intersect_with_line( &Line::new_from_points(*other.get_point(a_a),*other.get_point(a_b)) );

                        running_intersect |= tmp.intersect;
                        running_inverse_intersect |= tmp.inverse_intersect;

                        output_result.intersect |= tmp.intersect;
                        a_a = a_b;
                    }
                }

            //check if self polygon is totally inside other polygon (the reverse, remember?)    
                if !output_result.contact && running_intersect && !running_inverse_intersect {
                    output_result.first_contains_second_without_contact = Some(true);
                }

            //if necessary, check for intersect by seeing if any point of the other poly is within the self poly
                for point in other.get_points() {
                    if output_result.intersect { break; }
                    output_result.intersect |= self.intersect_with_point(&point) == PolySide::Inside;
                }

            output_result
        }
        pub fn intersect_with_complex_polygon(&self, complex_polygon:&ComplexPolygon) -> PolygonIntersectionResult {
            complex_polygon.intersect_with_simple_polygon(self)
        }
    }