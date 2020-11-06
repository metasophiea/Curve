//rust
    use std::fmt;

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
        #[wasm_bindgen(js_namespace = ["library", "_thirdparty"])]
        fn earcut(points:&[f32], holeIndices:&[usize]) -> Vec<f32>;
    }
    // macro_rules! console_log {
    //     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    // }

//core
    use crate::a_library::data_type::{
        LinePolygonIntersectionResult,
        PolygonIntersectionResult,
        PolySide,

        Point,
        BoundingBox,
        Line,
        SimplePolygon,
    };








//utilities
    fn search_for_duplicate_point_in_vector(vector:&Vec<Point>, point:&Point) -> bool {
        for p in vector {
            if p == point {
                return true;
            }
        }
        false
    }








//struct
    pub struct ComplexPolygon {
        body: SimplePolygon,
        holes: Vec<SimplePolygon>,
    }
//new
    impl ComplexPolygon {
        pub fn new_from_simple_polygons(body:SimplePolygon, holes:Vec<SimplePolygon>) -> ComplexPolygon {
            ComplexPolygon {
                body: body,
                holes: holes,
            }
        }
        pub fn new_default() -> ComplexPolygon {
            ComplexPolygon::new_from_simple_polygons(
                SimplePolygon::new_default(),
                vec![]
            )
        }
    }
//clone
    impl ComplexPolygon {
        pub fn clone(&self) -> ComplexPolygon {
            let mut holes:Vec<SimplePolygon> = vec![];
            for item in &self.holes {
                holes.push( item.clone() )
            }

            ComplexPolygon::new_from_simple_polygons(
                self.body.clone(),
                holes,
            )
        }
    }
//getters
    impl ComplexPolygon {
        pub fn get_body(&self) -> &SimplePolygon {
            &self.body
        }
        pub fn get_holes_count(&self) -> usize {
            self.holes.len()
        }
        pub fn get_body_mut(&mut self) -> &mut SimplePolygon {
            &mut self.body
        }
        pub fn get_hole(&self, index:usize) -> &SimplePolygon {
            &self.holes[index]
        }
        pub fn get_hole_mut(&mut self, index:usize) -> &mut SimplePolygon {
            &mut self.holes[index]
        }
        pub fn get_bounding_box(&self) -> &BoundingBox {
            self.body.get_bounding_box()
        }
    }
//sub triangles
    impl ComplexPolygon {
        pub fn to_sub_triangles_flat_array(&self) -> Vec<f32> {
            let mut compiled_flat_array:Vec<f32> = self.body.get_points_as_flat_array();
            let mut holes_indices:Vec<usize> = vec![];

            for hole in &self.holes {
                holes_indices.push(compiled_flat_array.len()/2);
                compiled_flat_array.append(&mut hole.get_points_as_flat_array());
            }

            earcut(
                &compiled_flat_array,
                &holes_indices
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
    impl ComplexPolygon {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
            let mut hole_string:String = String::from("[");
            for (index, point) in self.holes.iter().enumerate() {
                hole_string = format!("{}{}", hole_string, point);
                if index != self.holes.len()-1 { hole_string = format!("{},", hole_string); }
            }
            hole_string = format!("{}]", hole_string);

            write!(
                f, "{{body:{}, holes:{}}}",
                self.body,
                hole_string,
            )
        }
    }
    impl fmt::Display for ComplexPolygon {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }
    impl fmt::Debug for ComplexPolygon {
        fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }
    //intersect
    impl ComplexPolygon {
        pub fn intersect_with_point(&self, point:&Point) -> PolySide {
            let body_result = self.body.intersect_with_point(point);

            if body_result != PolySide::Inside {
                return body_result;
            }

            //if the point is cleanly within the poly, there's a chance its over a hole
            //so, better check if it is or not

            for hole in &self.holes {
                match hole.intersect_with_point(point) {
                    PolySide::Outside => { continue; },
                    PolySide::Inside => { return PolySide::Outside; },
                    on_point_or_on_edge => { return on_point_or_on_edge; },
                }
            }

            body_result
        }
        //bounding box //currently not needed
        pub fn intersect_with_line(&self, line:&Line) -> LinePolygonIntersectionResult {
            let mut body_result = self.body.intersect_with_line(line);
            if !body_result.intersect && !body_result.contact {
                //doesn't go near anything
                return body_result;
            }

            for hole in &self.holes {
                let mut hole_result = hole.intersect_with_line(line);
                if !hole_result.intersect && !hole_result.contact {
                    //doesn't go near this hole
                    continue
                } else if hole_result.intersect && !hole_result.contact {
                    //cleanly inside hole, thus doesn't touch the polygon
                    return LinePolygonIntersectionResult {
                        points: vec![],
                        contact: false,
                        intersect: false,
                        inverse_intersect: true,
                        traverse: false,
                    }
                } else {
                    //something more interesting. Add it to the result
                    body_result.points.append( &mut hole_result.points );
                    body_result.contact |= hole_result.contact;
                    body_result.intersect |= hole_result.intersect;
                    body_result.inverse_intersect |= hole_result.inverse_intersect;
                    body_result.traverse |= hole_result.traverse;
                }
            }

            body_result
        }
        pub fn intersect_with_simple_polygon(&self, simple_polygon:&SimplePolygon) -> PolygonIntersectionResult {
            let mut body_result = self.body.intersect_with_simple_polygon(simple_polygon);
            // console_log!("{}", body_result);

            //polygon must intersect with the body polygon somehow, if there's any hope of the holes being relevant
                if !body_result.intersect {
                    return body_result;
                }

            for hole in &self.holes {
                let hole_result = hole.intersect_with_simple_polygon(simple_polygon);
                // console_log!("hole_result: {}", hole_result);

                //if the polygon intersects with the hole, but does not traverse its edges, come into contact with them or contain the hole; that's cleanly inside the hole, thus doesn't touch the polygon
                    if hole_result.intersect && !hole_result.contact && !hole_result.traverse && hole_result.first_contains_second_without_contact != Some(false) {
                        return PolygonIntersectionResult {
                            points: vec![],
                            contact: false,
                            intersect: false,
                            traverse: false,
                            first_contains_second_without_contact: None,
                        }
                    }

                //if the polygon intersects with the hole, does not traverse its edges or contain the hole, but does come into contact with them; that's inside the hole, and is touching the edges
                    if hole_result.intersect && hole_result.contact && !hole_result.traverse {
                        return PolygonIntersectionResult {
                            points: hole_result.points,
                            contact: true,
                            intersect: false,
                            traverse: false,
                            first_contains_second_without_contact: None,
                        }
                    }
                
                //if there's contact, there's contact
                    body_result.contact |= hole_result.contact;

                //add points of contact
                    if hole_result.contact {
                        for point in hole_result.points {
                            if !search_for_duplicate_point_in_vector(&body_result.points, &point) {
                                body_result.points.push(point);
                            }
                        }
                    }

                //if there's traverse, there's traverse
                    body_result.traverse |= hole_result.traverse;

                //if the self's hole is cleanly contained by the simple_polygon, then we can't have the self's body cleanly containing the simple_polygon
                //it also means that the shapes are traversing
                    if body_result.first_contains_second_without_contact == Some(true) && hole_result.first_contains_second_without_contact == Some(false) {
                        body_result.first_contains_second_without_contact = None;
                        body_result.traverse = true;
                    }
            }

            //if there's contact, we must clear first_contains_second_without_contact 
                if body_result.contact {
                    body_result.first_contains_second_without_contact = None;
                }

            body_result
        }
        // pub fn intersect_with_complex_polygon(&self, complex_polygon:&ComplexPolygon) -> PolygonIntersectionResult {
        //     let mut body_result = self.body.intersect_with_complex_polygon(complex_polygon);
        //     console_log!("{}", body_result);

        //     //polygon must intersect with the body polygon somehow, if there's any hope of the holes being relevant
        //         if !body_result.intersect {
        //             return body_result;
        //         }
            
        //     for hole in &self.holes {
        //         let hole_result = hole.intersect_with_complex_polygon(complex_polygon);
        //         console_log!("{}", hole_result);

        //         //if this hole cleanly contains the other complex_polygon, then that's no contact at all
        //             if hole_result.first_contains_second_without_contact == Some(false) {
        //                 return PolygonIntersectionResult {
        //                     points: vec![],
        //                     contact: false,
        //                     intersect: false,
        //                     traverse: false,
        //                     first_contains_second_without_contact: None,
        //                 }
        //             }

        //         //if the self's holes are cleanly contained by the complex_polygon, then we can't have the self's body cleanly containing the other complex_polygon
        //             if body_result.first_contains_second_without_contact == Some(false) && hole_result.first_contains_second_without_contact == Some(true) {
        //                 body_result.first_contains_second_without_contact = None;
        //             }

        //         //if there's contact, there's contact
        //             body_result.contact |= hole_result.contact;
        //         //and there's no clean containment to boot
        //             if hole_result.contact {
        //                 body_result.first_contains_second_without_contact = None;
        //             }

        //         //add points of contact
        //             if hole_result.contact {
        //                 for point in hole_result.points {
        //                     if !search_for_duplicate_point_in_vector(&body_result.points, &point) {
        //                         body_result.points.push(point);
        //                     }
        //                 }
        //             }

        //         //if there's traverse, there's traverse
        //             body_result.traverse |= hole_result.traverse;
        //     }

        //     body_result
        // }
    }