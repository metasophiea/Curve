// //rust

// //wasm
//     use wasm_bindgen::prelude::*;

//     #[wasm_bindgen]
//     extern "C" {
//         #[wasm_bindgen(js_namespace = console)]
//         fn log(a:&str);
//     }
//     macro_rules! console_log {
//         ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
//     }

// //core
//     use crate::a_library::data_type::{
//         Point,
//         SimplePolygon,
//         ComplexPolygon,
//     };




// pub fn all() {
//     console_log!("data_type__polygon2");
//     a();
// }


// pub fn a() {
//     console_log!("simplePoly_1");
//     let simplePoly_1 = SimplePolygon::new_default();
//     console_log!("{}", simplePoly_1);
//     console_log!("{:?}", simplePoly_1.to_sub_triangles_flat_array() );
//     console_log!("{:?}", simplePoly_1.to_sub_triangles_triangles() );
//     console_log!("");

//     console_log!("simplePoly_2");
//     let simplePoly_2 = SimplePolygon::new_triangle(0.0,0.0, 10.0,0.0, 0.0,10.0);
//     console_log!("{}", simplePoly_2);
//     console_log!("{:?}", simplePoly_2.to_sub_triangles_flat_array() );
//     console_log!("{:?}", simplePoly_2.to_sub_triangles_triangles() );
//     console_log!("");

//     console_log!("simplePoly_3");
//     let simplePoly_3 = SimplePolygon::new_rectangle(0.0,0.0, 10.0,0.0, 10.0,10.0, 0.0,10.0);
//     console_log!("{}", simplePoly_3);
//     console_log!("{:?}", simplePoly_3.to_sub_triangles_flat_array() );
//     console_log!("{:?}", simplePoly_3.to_sub_triangles_triangles() );
//     console_log!("");


    

//     console_log!("complexPoly_1");
//     let complexPoly_1 = ComplexPolygon::new_default();
//     console_log!("{}", complexPoly_1);
//     console_log!("");

//     console_log!("complexPoly_2");
//     let complexPoly_2 = ComplexPolygon::new_from_simple_polygons(
//         SimplePolygon::new_rectangle(0.0,0.0, 100.0,0.0, 100.0,100.0, 0.0,100.0),
//         vec![
//             SimplePolygon::new_from_point_vector(
//                 vec![
//                     Point::new(25.0,25.0),
//                     Point::new(75.0,25.0),
//                     Point::new(75.0,40.0),
//                     Point::new(25.0,40.0),
//                 ],
//             ),
//             SimplePolygon::new_from_point_vector(
//                 vec![
//                     Point::new(25.0,60.0),
//                     Point::new(75.0,60.0),
//                     Point::new(75.0,75.0),
//                     Point::new(25.0,75.0),
//                 ],
//             )
//         ],
//     );
//     console_log!("{}", complexPoly_2);
//     console_log!("{:?}", complexPoly_2.to_sub_triangles_flat_array() );
//     console_log!("{:?}", complexPoly_2.to_sub_triangles_triangles() );
//     console_log!("");

//     console_log!("complexPoly_3");
//     let complexPoly_3 = ComplexPolygon::new_from_simple_polygons(
//         SimplePolygon::new_rectangle(0.0,0.0, 100.0,0.0, 100.0,100.0, 0.0,100.0),
//         vec![
//             SimplePolygon::new_from_point_vector(
//                 vec![
//                     Point::new(25.0,25.0),
//                     Point::new(150.0,25.0),
//                     Point::new(150.0,40.0),
//                     Point::new(25.0,40.0),
//                 ],
//             ),
//             SimplePolygon::new_from_point_vector(
//                 vec![
//                     Point::new(25.0,60.0),
//                     Point::new(75.0,60.0),
//                     Point::new(75.0,75.0),
//                     Point::new(25.0,75.0),
//                 ],
//             )
//         ],
//     );
//     console_log!("{}", complexPoly_3);
//     console_log!("{:?}", complexPoly_3.to_sub_triangles_flat_array() );
//     console_log!("{:?}", complexPoly_3.to_sub_triangles_triangles() );
//     for item in complexPoly_3.to_sub_triangles_triangles() {
//         console_log!("{:?}", item );
//     }
// }