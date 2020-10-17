#![allow(non_camel_case_types)]

//rust

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{*};
    use crate::a_library::math::{*};






pub fn all() {
    console_log!("detect_intersect");
    // bounding_boxes();
    // point_within_bounding_box();
    // point_on_line();
    point_within_poly();
    // line_on_line();
    // line_on_poly();
    // poly_on_poly();
}

pub fn bounding_boxes() {
    console_log!("- bounding_boxes");
        let testing_pairs = [
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(5.0, 5.0, 15.0,15.0), true),
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(15.0,15.0,25.0,25.0), false),
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(0.0, 0.0, 10.0,10.0), true),
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(10.0,0.0, 20.0,10.0), true),
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(11.0,0.0, 20.0,10.0), false),
            ( BoundingBox::new(0.0,0.0,50.0,45.0), BoundingBox::new(0.0, 0.0, 70.0,45.0), true)
        ];

        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = detect_intersect::bounding_boxes( &pair.0, &pair.1 );
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
}

pub fn point_within_bounding_box() {
    console_log!("- point_within_bounding_box");
        let testing_pairs = [
            (Point::new(5.0,5.0),                BoundingBox::new(0.0,0.0,10.0,10.0), true),
            (Point::new(50.0,5.0),               BoundingBox::new(0.0,0.0,10.0,10.0), false),
            (Point::new(0.0,0.0),                BoundingBox::new(0.0,0.0,10.0,10.0), true),
            (Point::new(10.0,0.0),               BoundingBox::new(0.0,0.0,10.0,10.0), true),
            (Point::new(10.0,10.0),              BoundingBox::new(0.0,0.0,10.0,10.0), true),
            (Point::new(0.0,10.0),               BoundingBox::new(0.0,0.0,10.0,10.0), true),
            (Point::new(-0.000000000000001,0.0), BoundingBox::new(0.0,0.0,10.0,10.0), false),
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = detect_intersect::point_within_bounding_box( &pair.0, &pair.1 );
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
}

pub fn point_on_line() {
    console_log!("- point_on_line");
        let testing_pairs = [
            (Point::new(10.0,10.0),     Line::new_from_values(100.0,100.0, 100.0,100.0),  false),
            (Point::new(100.0,100.0),   Line::new_from_values(100.0,100.0, 100.0,100.0),  true),
            (Point::new(10.0,10.0),     Line::new_from_values(0.0,0.0,     100.0,100.0),  true),
            (Point::new(0.0,0.0),       Line::new_from_values(0.0,0.0,     100.0,100.0),  true),
            (Point::new(100.0,100.0),   Line::new_from_values(0.0,0.0,     100.0,100.0),  true),
            (Point::new(50.0,50.0),     Line::new_from_values(0.0,0.0,     100.0,100.0),  true),
            (Point::new(50.0,51.0),     Line::new_from_values(0.0,0.0,     100.0,100.0),  false),
            (Point::new(50.0,50.0),     Line::new_from_values(0.0,50.0,    100.0,50.0),   true),
            (Point::new(50.0,49.0),     Line::new_from_values(0.0,50.0,    100.0,50.0),   false),
            (Point::new(20.0,49.0),     Line::new_from_values(20.0,10.0,   20.0,50.0),    true),
            (Point::new(21.0,49.0),     Line::new_from_values(20.0,10.0,   20.0,50.0),    false),
            (Point::new(0.0,0.0),       Line::new_from_values(1.0,1.0,     9.0,9.0),      false),
            (Point::new(0.0,0.0),       Line::new_from_values(-10.0,0.0,     10.0,10.0),      false), 
            (Point::new(0.0,10.0),       Line::new_from_values(-10.0,0.0,     10.0,10.0),      false), 
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = detect_intersect::point_on_line( &pair.0, &pair.1 );
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
}

pub fn point_within_poly() {
    console_log!("- point_within_poly");
        let testing_pairs = [
            (Point::new(0.0,0.0),                  Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::OnPoint ),
            (Point::new(-0.001,0.0),               Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::Outside ),
            (Point::new(-0.000000000000001,0.0),   Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::Outside ),
            (Point::new(1.0,1.0),                  Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::Inside  ),
            (Point::new(2.5,0.0),                  Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::OnEdge  ),
            (Point::new(4.9999,4.9999),            Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::Inside  ),
            (Point::new(5.0,5.0),                  Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::OnEdge  ),
            (Point::new(5.0001,5.0001),            Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::Outside ),
            (Point::new(5.1,5.1),                  Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0) ].to_vec()),                               detect_intersect::PolySide::Outside ),
            (Point::new(115.0,30.0),               Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)   ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(200.0,0.0),                Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)   ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(399.0,0.0),                Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)   ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(400.0,0.0),                Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)   ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(400.0,1.0),                Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)   ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(400.0,-1.0),               Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)   ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(10.0,20.0),                Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)   ].to_vec()), detect_intersect::PolySide::Inside  ),
            (Point::new(5.0,0.0),                  Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),     Point::new(0.0,10.0)    ].to_vec()), detect_intersect::PolySide::OnEdge  ),
            (Point::new(5.0,5.0),                  Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),     Point::new(0.0,10.0)    ].to_vec()), detect_intersect::PolySide::Inside  ),
            (Point::new(420.0,410.0),              Polygon::new_from_point_vector([Point::new(300.0,360.0), Point::new(300.0,410.0), Point::new(350.0,410.0),   Point::new(350.0,360.0) ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(420.0,190.0),              Polygon::new_from_point_vector([Point::new(300.0,360.0), Point::new(300.0,410.0), Point::new(350.0,410.0),   Point::new(350.0,360.0) ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(75.0,20.0),                Polygon::new_from_point_vector([Point::new(50.0,0.0),    Point::new(100.0,50.0),  Point::new(50.0,100.0),    Point::new(0.0,50.0)    ].to_vec()), detect_intersect::PolySide::Outside ),
            (Point::new(-380.0,-380.0),            Polygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(-400.0,0.0),  Point::new(-400.0,-400.0), Point::new(0.0,-400.0)  ].to_vec()), detect_intersect::PolySide::Inside  ),
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = detect_intersect::point_within_poly( &pair.0, &pair.1 );
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
}

pub fn line_on_line() {
    console_log!("- line_on_line");
        let testing_pairs = [
            ( Line::new_from_values(0.0,0.0,5.0,5.0),     Line::new_from_values(5.0,0.0,0.0,5.0),       detect_intersect::LineIntersectionResult {point:Some(Point::new(2.5,2.5)), range:None, intersect:true, contact:true}                        ),
            ( Line::new_from_values(0.0,0.0,5.0,0.0),     Line::new_from_values(0.0,2.0,5.0,2.0),       detect_intersect::LineIntersectionResult {point:None, range:None, intersect:false, contact:false}                                           ),
            ( Line::new_from_values(0.0,2.0,5.0,2.0),     Line::new_from_values(0.0,2.0,5.0,2.0),       detect_intersect::LineIntersectionResult {point:None, range:None, intersect:false, contact:true}                                            ),
            ( Line::new_from_values(0.0,2.0,3.0,2.0),     Line::new_from_values(0.0,2.0,5.0,2.0),       detect_intersect::LineIntersectionResult {point:Some(Point::new(0.0,2.0)), range:None, intersect:false, contact:true}                       ),
            ( Line::new_from_values(0.0,0.0,5.0,5.0),     Line::new_from_values(0.0,1.0,0.0,2.0),       detect_intersect::LineIntersectionResult {point:Some(Point::new(0.0,0.0)), range:None, intersect:false, contact:false}                      ),
            ( Line::new_from_values(0.0,0.0,5.0,5.0),     Line::new_from_values(2.5,2.5,0.0,5.0),       detect_intersect::LineIntersectionResult {point:Some(Point::new(2.5,2.5)), range:None, intersect:false, contact:true}                       ),
            ( Line::new_from_values(0.0,0.0,5.0,5.0),     Line::new_from_values(0.0,5.0,2.5,2.5),       detect_intersect::LineIntersectionResult {point:Some(Point::new(2.5,2.5)), range:None, intersect:false, contact:true}                       ),
            ( Line::new_from_values(0.0,0.0,0.0,5.0),     Line::new_from_values(0.0,5.0,2.5,2.5),       detect_intersect::LineIntersectionResult {point:Some(Point::new(0.0,5.0)), range:None, intersect:false, contact:true}                       ),
            ( Line::new_from_values(1.0,1.0,9.0,9.0),     Line::new_from_values(0.0,0.0,0.0,10.0),      detect_intersect::LineIntersectionResult {point:None, range:None, intersect:false, contact:false}                                           ),
            ( Line::new_from_values(0.0,0.0,0.0,10.0),    Line::new_from_values(0.0,0.0,0.0,10.0),      detect_intersect::LineIntersectionResult {point:None, range:None, intersect:false, contact:true}                                            ),
            ( Line::new_from_values(5.0,0.0,15.0,0.0),    Line::new_from_values(0.0,0.0,10.0,0.0),      detect_intersect::LineIntersectionResult {point:None, range:Some(Line::new_from_values(5.0,0.0,10.0,0.0)), intersect:false, contact:true}   ),
            ( Line::new_from_values(0.0,0.0,10.0,0.0),    Line::new_from_values(2.0,0.0,8.0,0.0),       detect_intersect::LineIntersectionResult {point:None, range:Some(Line::new_from_values(2.0,0.0,8.0,0.0)), intersect:false, contact:true}    ),
            ( Line::new_from_values(-10.0,0.0,10.0,10.0), Line::new_from_values(0.0,0.0,0.0,10.0),      detect_intersect::LineIntersectionResult {point:Some(Point::new(0.0,5.0)), range:None, intersect:true, contact:true}                     ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),   Line::new_from_values(60.0,-50.0,60.0,50.0),  detect_intersect::LineIntersectionResult {point:Some(Point::new(60.0,0.0)), range:None, intersect:true, contact:true}                  ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),  Line::new_from_values(50.0,-50.0,50.0,50.0),   detect_intersect::LineIntersectionResult {point:Some(Point::new(50.0,0.0)), range:None, intersect:true, contact:true}                                            ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),  Line::new_from_values(60.0,-50.0,50.0,-50.0),  detect_intersect::LineIntersectionResult {point:None, range:None, intersect:false, contact:false}                                            ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),  Line::new_from_values(60.0,50.0,60.0,-50.0),   detect_intersect::LineIntersectionResult {point:Some(Point::new(60.0,0.0)), range:None, intersect:true, contact:true}                                            ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),  Line::new_from_values(50.0,50.0,60.0,50.0),    detect_intersect::LineIntersectionResult {point:None, range:None, intersect:false, contact:false}                                            ),
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = detect_intersect::line_on_line( &pair.0, &pair.1 );
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
}

pub fn line_on_poly() {
    console_log!("- line_on_poly");
    let testing_pairs = [
        ( Line::new_from_values(-5.0,5.0,15.0,5.0),                         Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,5.0), Point::new(10.0,5.0) ],           intersect:true,  contact:true  } ),
        ( Line::new_from_values(-5.0,5.0,5.0,5.0),                          Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,5.0) ],                                 intersect:true,  contact:true  } ),
        ( Line::new_from_values(-5.0,5.0,15.0,5.0),                         Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,5.0), Point::new(10.0,5.0) ],           intersect:true,  contact:true  } ),
        ( Line::new_from_values(5.0,5.0,15.0,5.0),                          Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(10.0,5.0) ],                                intersect:true,  contact:true  } ),
        ( Line::new_from_values(-5.0,0.0,0.0,10.0),                         Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,10.0) ],                                intersect:false, contact:true  } ),
        ( Line::new_from_values(-5.0,-5.0,5.0,5.0),                         Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,0.0) ],                                 intersect:true,  contact:true  } ),
        ( Line::new_from_values(-5.0,-5.0,0.0,5.0),                         Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,5.0) ],                                 intersect:false, contact:true  } ), //skirt 
        ( Line::new_from_values(0.0,0.0,10.0,0.0),                          Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,0.0), Point::new(10.0,0.0) ],           intersect:false, contact:true  } ), //skirt 
        ( Line::new_from_values(400.0,400.0,410.0,400.0),                   Polygon::new_from_point_vector( vec![Point::new(400.0,400.0), Point::new(410.0,400.0), Point::new(420.0,410.0), Point::new(430.0,420.0), Point::new(430.0,450.0), Point::new(400.0,450.0)] ),      detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(400.0,400.0), Point::new(410.0,400.0) ],    intersect:false, contact:true  } ), //skirt 
        ( Line::new_from_values(0.0,0.0,10.0,10.0),                         Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,0.0), Point::new(10.0,10.0) ],          intersect:true,  contact:true  } ), //perfect traversal
        ( Line::new_from_values(1.0,1.0,9.0,9.0),                           Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ ],                                                     intersect:true,  contact:false } ), //completely within
        ( Line::new_from_values(-10.0,0.0,10.0,10.0),                       Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(0.0,5.0), Point::new(10.0,10.0) ],          intersect:true,  contact:true  } ),
        ( Line::new_from_values(10.0,0.0,100.0,0.0),                        Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(10.0,0.0) ],                                intersect:false, contact:true  } ),
        ( Line::new_from_values(5.0,0.0,15.0,0.0),                          Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                           detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(5.0,0.0), Point::new(10.0,0.0) ],           intersect:false, contact:true  } ),
        ( Line::new_from_values(0.0,10.0,0.0,0.0),                          Polygon::new_from_point_vector( vec![Point::new(50.0,-50.0),  Point::new(60.0,-50.0),  Point::new(60.0,50.0),   Point::new(50.0,50.0)] ),                                                          detect_intersect::PolygonIntersectionResult { points: vec![ ],                                                     intersect:false, contact:false } ),
        ( Line::new_from_values(0.0,0.0,100.0,0.0),                         Polygon::new_from_point_vector( vec![Point::new(50.0,-50.0),  Point::new(60.0,-50.0),  Point::new(60.0,50.0),   Point::new(50.0,50.0)] ),                                                          detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(50.0,0.0), Point::new(60.0,0.0) ],          intersect:true, contact:true   } ),
        ( Line::new_from_values(100.0,0.0,100.0,10.0),                      Polygon::new_from_point_vector( vec![Point::new(50.0,-50.0),  Point::new(60.0,-50.0),  Point::new(60.0,50.0),   Point::new(50.0,50.0)] ),                                                          detect_intersect::PolygonIntersectionResult { points: vec![ ],                                                     intersect:false, contact:false } ),
        ( Line::new_from_values(100.0,10.0,0.0,10.0),                       Polygon::new_from_point_vector( vec![Point::new(50.0,-50.0),  Point::new(60.0,-50.0),  Point::new(60.0,50.0),   Point::new(50.0,50.0)] ),                                                          detect_intersect::PolygonIntersectionResult { points: vec![ Point::new(50.0,10.0), Point::new(60.0,10.0) ],        intersect:true, contact:true   } ),
        ( Line::new_from_values(117.209595,176.8104,607.24286,276.14508),   Polygon::new_from_point_vector( vec![Point::new(600.0,160.0), Point::new(639.0,160.0), Point::new(639.0,199.0), Point::new(600.0,199.0)] ),                                                        detect_intersect::PolygonIntersectionResult { points: vec![],                                                      intersect:false, contact:false } ),
    ];
    for (index,pair) in testing_pairs.iter().enumerate() {
        let result = detect_intersect::line_on_poly( &pair.0, &pair.1 );
        console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
    }
}

pub fn poly_on_poly() {
    console_log!("- poly_on_poly");

    let testing_pairs = [
        //totally separate shapes
            (
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0),   Point::new(10.0,0.0),  Point::new(10.0,10.0), Point::new(0.0,10.0)]  ),     
                Polygon::new_from_point_vector( vec![Point::new(15.0,15.0), Point::new(25.0,15.0), Point::new(25.0,25.0), Point::new(15.0,25.0)] ), 
                detect_intersect::PolygonIntersectionResult { points:vec![], intersect:false, contact:false },
            ),
        //simple overlap
            (
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(5.0,5.0), Point::new(15.0,5.0), Point::new(15.0,15.0), Point::new(5.0,15.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(10.0,5.0), Point::new(5.0,10.0)], intersect:true, contact:true },
            ),
        //the same shape twice
            (
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)], intersect:true,  contact:true },
            ),
        //shape totally inside the other shape
            (
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], intersect:true,  contact:false },
            ),
        //same, but the other way around
            (
                Polygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], intersect:true,  contact:false },
            ),
        //overlapping sides (like a cross shape)
            (
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,10.0), Point::new(0.0,10.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(50.0,-50.0), Point::new(60.0,-50.0), Point::new(60.0,50.0), Point::new(50.0,50.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(50.0,0.0), Point::new(60.0,0.0), Point::new(50.0,10.0), Point::new(60.0,10.0)],  intersect:true,  contact:true },
            ),
        //live examples (should all be 'true')
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(50.0,50.0), Point::new(105.0,50.0), Point::new(105.0,105.0), Point::new(50.0,105.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(68.0,50.0), Point::new(68.0,105.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(875.0,50.0), Point::new(930.0,50.0), Point::new(930.0,105.0), Point::new(875.0,105.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(150.0,50.0), Point::new(345.0,50.0), Point::new(345.0,160.0), Point::new(150.0,160.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(400.0,50.0), Point::new(500.0,50.0), Point::new(500.0,105.0), Point::new(400.0,105.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(550.0,50.0), Point::new(790.0,50.0), Point::new(790.0,90.0), Point::new(740.0,140.0), Point::new(550.0,140.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(25.0,130.0), Point::new(35.0,120.0), Point::new(59.166666666666664,120.0), Point::new(71.125,130.0), Point::new(81.375,130.0), Point::new(93.33333333333333,120.0), Point::new(117.5,120.0), Point::new(127.5,130.0), Point::new(127.5,205.0), Point::new(117.5,215.0), Point::new(93.33333333333333,215.0), Point::new(81.375,205.0), Point::new(71.125,205.0), Point::new(59.166666666666664,215.0), Point::new(35.0,215.0), Point::new(25.0,205.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(68.0,127.38675958188156), Point::new(68.0,207.61324041811847)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(160.0,175.0), Point::new(242.5,175.0), Point::new(252.5,245.0), Point::new(201.25,275.0), Point::new(150.0,245.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![],contact:false, intersect:true}
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(280.0,180.0), Point::new(331.25,170.0), Point::new(382.5,180.0), Point::new(382.5,210.0), Point::new(331.25,220.0), Point::new(280.0,210.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(425.0,160.0), Point::new(645.0,160.0), Point::new(645.0,215.0), Point::new(425.0,215.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(425.0,220.0), Point::new(645.0,220.0), Point::new(645.0,275.0), Point::new(425.0,275.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(425.0,280.0), Point::new(645.0,280.0), Point::new(645.0,335.0), Point::new(425.0,335.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(425.0,340.0), Point::new(645.0,340.0), Point::new(645.0,420.0), Point::new(425.0,420.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(425.0,355.0), Point::new(645.0,355.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(675.0,160.0), Point::new(895.0,160.0), Point::new(895.0,545.0), Point::new(675.0,545.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(675.0,355.0), Point::new(895.0,355.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(355.0,110.0), Point::new(530.0,110.0), Point::new(530.0,150.0), Point::new(355.0,150.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(15.0,285.0), Point::new(25.0,285.0), Point::new(37.5,275.0), Point::new(52.5,275.0), Point::new(65.0,285.0), Point::new(260.0,285.0), Point::new(260.0,315.0), Point::new(65.0,315.0), Point::new(52.5,325.0), Point::new(37.5,325.0), Point::new(25.0,315.0), Point::new(15.0,315.0)] ), 
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(68.0,285.0), Point::new(68.0,315.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(270.0,225.0), Point::new(395.0,225.0), Point::new(395.0,275.0), Point::new(370.0,285.0), Point::new(370.0,325.0), Point::new(270.0,325.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(830.0,50.0), Point::new(820.0,52.67949192431122), Point::new(812.6794919243113,60.0), Point::new(810.0,70.0), Point::new(812.6794919243113,80.0), Point::new(820.0,87.32050807568876), Point::new(830.0,90.0), Point::new(840.0,87.32050807568878), Point::new(847.3205080756887,80.0), Point::new(850.0,70.0), Point::new(847.3205080756887,60.000000000000014), Point::new(840.0,52.679491924311236)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(790.0,120.0), Point::new(800.0,110.0), Point::new(890.0,110.0), Point::new(905.0,120.0), Point::new(905.0,140.0), Point::new(890.0,150.0), Point::new(800.0,150.0), Point::new(790.0,140.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                Polygon::new_from_point_vector( vec![Point::new(80.0,330.0), Point::new(400.0,330.0), Point::new(400.0,392.5), Point::new(80.0,392.5)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(80.0,355.0), Point::new(400.0,355.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(6.0,6.0), Point::new(56.0,6.0), Point::new(56.0,51.0), Point::new(6.0,51.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(6.0,6.0), Point::new(76.0,6.0), Point::new(76.0,51.0), Point::new(6.0,51.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(6.0,51.0), Point::new(6.0,6.0), Point::new(56.0,6.0), Point::new(56.0,51.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(70.0,0.0), Point::new(70.0,45.0), Point::new(0.0,45.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(50.0,45.0), Point::new(0.0,45.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(0.0,45.0), Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(50.0,45.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,100.0), Point::new(0.0,100.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(0.0,100.0), Point::new(50.0,100.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(0.0,100.0), Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(50.0,100.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,100.0), Point::new(0.0,100.0)] ),
                Polygon::new_from_point_vector( vec![Point::new(-50.0,0.0), Point::new(50.0,0.0), Point::new(50.0,100.0), Point::new(-50.0,100.0)] ),
                detect_intersect::PolygonIntersectionResult { points:vec![Point::new(0.0,100.0), Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(50.0,100.0)], contact:true, intersect:true },
            ),
            (
                Polygon::new_from_point_vector( vec![ Point::new(117.209595,176.8104), Point::new(607.24286,276.14508), Point::new(547.6421,570.16504), Point::new(57.608795,470.83038) ] ),
                Polygon::new_from_point_vector( vec![ Point::new(600.0,160.0), Point::new(639.0,160.0), Point::new(639.0,199.0), Point::new(600.0,199.0) ] ),
                detect_intersect::PolygonIntersectionResult { points:vec![], contact:false, intersect:false}
            ),
    ];

    for (index,pair) in testing_pairs.iter().enumerate() {
        let result = detect_intersect::poly_on_poly( &pair.0, &pair.1 );
        console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
    }
}