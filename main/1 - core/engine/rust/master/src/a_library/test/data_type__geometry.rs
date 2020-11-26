#![allow(dead_code)]

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
    use crate::a_library::data_type::{
        Direction,
        LineSide,
        LineIntersectionResult,
        LinePolygonIntersectionResult,
        PolySide,
        PolygonIntersectionResult,

        Point,
        BoundingBox,
        Line,
        SimplePolygon,
        ComplexPolygon,
    };




pub fn all() {
    console_log!("data_type__geometry");

    //point
        point_on_point();
    //boundingbox
        boundingbox_on_point();
        boundingbox_on_boundingbox();
    //line
        line_on_point();
        ////line_on_boundingbox(); //currently not needed
        line_on_line();
    //simplepolygon
        simplepolygon_on_point();
        ////simplepolygon_on_boundingbox(); //currently not needed
        simplepolygon_on_line();
        simplepolygon_on_simplepolygon();
        intersect_with_simple_polygon__intersect_only();
    // //complexpolygon
    //     complexpolygon_on_point();
    //     //complexpolygon_on_boundingbox(); //currently not needed
    //     complexpolygon_on_line();
    //     complexpolygon_on_simplepolygon();
    //     // complexpolygon_on_complexpolygon(); //currently not needed
}

//point
    fn point_on_point() {
        console_log!("- point_on_point");

        let testing_pairs = [
            (Point::new(5.0,5.0),                Point::new(5.0,5.0),                true),
            (Point::new(50.0,5.0),               Point::new(50.0,5.0),               true),
            (Point::new(0.0,0.0),                Point::new(0.0,0.0),                true),
            (Point::new(10.0,0.0),               Point::new(10.0,0.0),               true),
            (Point::new(10.0,10.0),              Point::new(10.0,10.0),              true),
            (Point::new(0.0,10.0),               Point::new(0.0,10.0),               true),
            (Point::new(-0.000000000000001,0.0), Point::new(-0.000000000000001,0.0), true),
            (Point::new(0.0,10.0),               Point::new(0.1,10.0),               false),
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0 == pair.1;
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }

//boundingbox
    fn boundingbox_on_point() {
        console_log!("- boundingbox_on_point");

        let testing_pairs = [
            (BoundingBox::new(0.0,0.0,10.0,10.0), Point::new(5.0,5.0),                true),
            (BoundingBox::new(0.0,0.0,10.0,10.0), Point::new(50.0,5.0),               false),
            (BoundingBox::new(0.0,0.0,10.0,10.0), Point::new(0.0,0.0),                true),
            (BoundingBox::new(0.0,0.0,10.0,10.0), Point::new(10.0,0.0),               true),
            (BoundingBox::new(0.0,0.0,10.0,10.0), Point::new(10.0,10.0),              true),
            (BoundingBox::new(0.0,0.0,10.0,10.0), Point::new(0.0,10.0),               true),
            (BoundingBox::new(0.0,0.0,10.0,10.0), Point::new(-0.000000000000001,0.0), false),
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_point(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }
    fn boundingbox_on_boundingbox() {
        console_log!("- boundingbox_on_boundingbox");

        let testing_pairs = [
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(5.0, 5.0, 15.0,15.0), true),
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(15.0,15.0,25.0,25.0), false),
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(0.0, 0.0, 10.0,10.0), true),
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(10.0,0.0, 20.0,10.0), true),
            ( BoundingBox::new(0.0,0.0,10.0,10.0), BoundingBox::new(11.0,0.0, 20.0,10.0), false),
            ( BoundingBox::new(0.0,0.0,50.0,45.0), BoundingBox::new(0.0, 0.0, 70.0,45.0), true)
        ];

        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_bounding_box(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }

//line
    fn line_on_point() {
        console_log!("- line_on_point");

        let testing_pairs = [
            (Line::new_from_values(100.0,100.0, 100.0,100.0),  Point::new(10.0,10.0),   LineSide::AlignedButOff),
            (Line::new_from_values(100.0,100.0, 100.0,100.0),  Point::new(100.0,100.0), LineSide::Upon),
            (Line::new_from_values(0.0,0.0,     100.0,100.0),  Point::new(10.0,10.0),   LineSide::Upon),
            (Line::new_from_values(0.0,0.0,     100.0,100.0),  Point::new(0.0,0.0),     LineSide::Upon),
            (Line::new_from_values(0.0,0.0,     100.0,100.0),  Point::new(100.0,100.0), LineSide::Upon),
            (Line::new_from_values(0.0,0.0,     100.0,100.0),  Point::new(200.0,200.0), LineSide::AlignedButOff),
            (Line::new_from_values(0.0,0.0,     100.0,100.0),  Point::new(50.0,50.0),   LineSide::Upon),
            (Line::new_from_values(0.0,0.0,     100.0,100.0),  Point::new(50.0,49.0),   LineSide::Left),
            (Line::new_from_values(0.0,0.0,     100.0,100.0),  Point::new(50.0,51.0),   LineSide::Right),
            (Line::new_from_values(0.0,50.0,    100.0,50.0),   Point::new(50.0,50.0),   LineSide::Upon),
            (Line::new_from_values(0.0,50.0,    100.0,50.0),   Point::new(50.0,49.0),   LineSide::Left),
            (Line::new_from_values(20.0,10.0,   20.0,50.0),    Point::new(20.0,49.0),   LineSide::Upon),
            (Line::new_from_values(20.0,10.0,   20.0,50.0),    Point::new(21.0,49.0),   LineSide::Left),
            (Line::new_from_values(1.0,1.0,     9.0,9.0),      Point::new(0.0,0.0),     LineSide::AlignedButOff),
            (Line::new_from_values(-10.0,0.0,   10.0,10.0),    Point::new(0.0,0.0),     LineSide::Left),
            (Line::new_from_values(-10.0,0.0,   10.0,10.0),    Point::new(0.0,10.0),    LineSide::Right),
            (Line::new_from_values(0.0,0.0,     100.0,100.0),  Point::new(0.0,100.0),   LineSide::Right),
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_point(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }
    // fn line_on_boundingbox() {
    //     console_log!("- line_on_boundingbox");
    // }
    fn line_on_line() {
        console_log!("- line_on_line");

        let testing_pairs = [
            ( Line::new_from_values(0.0,0.0,5.0,5.0),     Line::new_from_values(5.0,0.0,0.0,5.0),       LineIntersectionResult {point:Some(Point::new(2.5,2.5)), range:None, contact:true, intersect:true, direction:Some(Direction::Right)}      ),
            ( Line::new_from_values(0.0,0.0,5.0,0.0),     Line::new_from_values(0.0,2.0,5.0,2.0),       LineIntersectionResult {point:None, range:None, contact:false, intersect:false, direction:None}                                           ),
            ( Line::new_from_values(0.0,2.0,5.0,2.0),     Line::new_from_values(0.0,2.0,5.0,2.0),       LineIntersectionResult {point:None, range:Some(Line::new_from_values(0.0,2.0,5.0,2.0)), contact:true, intersect:false, direction:None}    ),
            ( Line::new_from_values(0.0,2.0,3.0,2.0),     Line::new_from_values(0.0,2.0,5.0,2.0),       LineIntersectionResult {point:None, range:Some(Line::new_from_values(0.0,2.0,3.0,2.0)), contact:true, intersect:false, direction:None}    ),
            ( Line::new_from_values(0.0,0.0,5.0,5.0),     Line::new_from_values(0.0,1.0,0.0,2.0),       LineIntersectionResult {point:None, range:None, contact:false, intersect:false, direction:None}                                           ),
            ( Line::new_from_values(0.0,0.0,5.0,5.0),     Line::new_from_values(2.5,2.5,0.0,5.0),       LineIntersectionResult {point:Some(Point::new(2.5,2.5)), range:None, contact:true, intersect:false, direction:Some(Direction::Right)}     ),
            ( Line::new_from_values(0.0,0.0,5.0,5.0),     Line::new_from_values(0.0,5.0,2.5,2.5),       LineIntersectionResult {point:Some(Point::new(2.5,2.5)), range:None, contact:true, intersect:false, direction:Some(Direction::Left)}      ),
            ( Line::new_from_values(0.0,0.0,0.0,5.0),     Line::new_from_values(0.0,5.0,2.5,2.5),       LineIntersectionResult {point:Some(Point::new(0.0,5.0)), range:None, contact:true, intersect:false, direction:Some(Direction::Left)}      ),
            ( Line::new_from_values(1.0,1.0,9.0,9.0),     Line::new_from_values(0.0,0.0,0.0,10.0),      LineIntersectionResult {point:None, range:None, contact:false, intersect:false, direction:None}                                           ),
            ( Line::new_from_values(0.0,0.0,0.0,10.0),    Line::new_from_values(0.0,0.0,0.0,10.0),      LineIntersectionResult {point:None, range:Some(Line::new_from_values(0.0,0.0,0.0,10.0)), contact:true, intersect:false, direction:None}   ),
            ( Line::new_from_values(5.0,0.0,15.0,0.0),    Line::new_from_values(0.0,0.0,10.0,0.0),      LineIntersectionResult {point:None, range:Some(Line::new_from_values(5.0,0.0,10.0,0.0)), contact:true, intersect:false, direction:None}   ),
            ( Line::new_from_values(0.0,0.0,10.0,0.0),    Line::new_from_values(2.0,0.0,8.0,0.0),       LineIntersectionResult {point:None, range:Some(Line::new_from_values(2.0,0.0,8.0,0.0)), contact:true, intersect:false, direction:None}    ),
            ( Line::new_from_values(-10.0,0.0,10.0,10.0), Line::new_from_values(0.0,0.0,0.0,10.0),      LineIntersectionResult {point:Some(Point::new(0.0,5.0)), range:None, contact:true, intersect:true, direction:Some(Direction::Right)}      ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),   Line::new_from_values(60.0,-50.0,60.0,50.0),  LineIntersectionResult {point:Some(Point::new(60.0,0.0)), range:None, contact:true, intersect:true, direction:Some(Direction::Right)}     ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),   Line::new_from_values(50.0,-50.0,50.0,50.0),  LineIntersectionResult {point:Some(Point::new(50.0,0.0)), range:None, contact:true, intersect:true, direction:Some(Direction::Right)}     ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),   Line::new_from_values(60.0,-50.0,50.0,-50.0), LineIntersectionResult {point:None, range:None, contact:false, intersect:false, direction:None}                                           ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),   Line::new_from_values(60.0,50.0,60.0,-50.0),  LineIntersectionResult {point:Some(Point::new(60.0,0.0)), range:None, contact:true, intersect:true, direction:Some(Direction::Left)}      ),
            ( Line::new_from_values(0.0,0.0,100.0,0.0),   Line::new_from_values(50.0,50.0,60.0,50.0),   LineIntersectionResult {point:None, range:None, contact:false, intersect:false, direction:None}                                           ),
            ( Line::new_from_values(0.0,0.0,10.0,0.0),    Line::new_from_values(0.0,0.0,10.0,0.0),      LineIntersectionResult {point:None, range:Some(Line::new_from_values(0.0,0.0,10.0,0.0)), contact:true, intersect:false, direction:None}   ),
            ( Line::new_from_values(0.0,0.0,10.0,0.0),    Line::new_from_values(0.0,0.0,9.0,0.0),       LineIntersectionResult {point:None, range:Some(Line::new_from_values(0.0,0.0,9.0,0.0)), contact:true, intersect:false, direction:None}    ),
            ( Line::new_from_values(0.0,0.0,10.0,0.0),    Line::new_from_values(1.0,0.0,9.0,0.0),       LineIntersectionResult {point:None, range:Some(Line::new_from_values(1.0,0.0,9.0,0.0)), contact:true, intersect:false, direction:None}    ),
            ( Line::new_from_values(0.0,0.0,10.0,0.0),    Line::new_from_values(1.0,0.0,10.0,0.0),      LineIntersectionResult {point:None, range:Some(Line::new_from_values(10.0,0.0,1.0,0.0)), contact:true, intersect:false, direction:None}   ),
            ( Line::new_from_values(0.0,0.0,10.0,0.0),    Line::new_from_values(10.0,0.0,20.0,0.0),     LineIntersectionResult {point:Some(Point::new(10.0,0.0)), range:None, contact:true, intersect:false, direction:None}                      ),
            ( Line::new_from_values(0.0,0.0,10.0,10.0),   Line::new_from_values(1.0,0.0,11.0,10.0),     LineIntersectionResult {point:None, range:None, contact:false, intersect:false, direction:None}                                           ),
            ( Line::new_from_values(0.0,0.0,10.0,10.0),   Line::new_from_values(1.0,0.0,11.0,11.0),     LineIntersectionResult {point:None, range:None, contact:false, intersect:false, direction:None}                                           ),
            ( Line::new_from_values(10.0,10.0,0.0,10.0),  Line::new_from_values(0.0,10.0,5.0,10.0),     LineIntersectionResult {point:None, range:Some(Line::new_from_values(0.0,10.0,5.0,10.0)), contact:true, intersect:false, direction:None}  ),
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_line(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }

//simplepolygon
    fn simplepolygon_on_point() {
        console_log!("- simplepolygon_on_point");

        let testing_pairs = [
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(0.0,0.0),                PolySide::OnPoint),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(-0.001,0.0),             PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(-0.000000000000001,0.0), PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(1.0,1.0),                PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(2.5,0.0),                PolySide::OnEdge ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(4.9999,4.9999),          PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(5.0,5.0),                PolySide::OnEdge ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(5.0001,5.0001),          PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(0.0,10.0)                              ].to_vec()), Point::new(5.1,5.1),                PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)  ].to_vec()), Point::new(115.0,30.0),             PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)  ].to_vec()), Point::new(200.0,0.0),              PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)  ].to_vec()), Point::new(399.0,0.0),              PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)  ].to_vec()), Point::new(400.0,0.0),              PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)  ].to_vec()), Point::new(400.0,1.0),              PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)  ].to_vec()), Point::new(400.0,-1.0),             PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(400.0,200.0), Point::new(400.0,400.0),   Point::new(0.0,400.0)  ].to_vec()), Point::new(10.0,20.0),              PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),     Point::new(0.0,10.0)   ].to_vec()), Point::new(5.0,0.0),                PolySide::OnEdge ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),     Point::new(0.0,10.0)   ].to_vec()), Point::new(5.0,5.0),                PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(300.0,360.0), Point::new(300.0,410.0), Point::new(350.0,410.0),   Point::new(350.0,360.0)].to_vec()), Point::new(420.0,410.0),            PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(300.0,360.0), Point::new(300.0,410.0), Point::new(350.0,410.0),   Point::new(350.0,360.0)].to_vec()), Point::new(420.0,190.0),            PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(50.0,0.0),    Point::new(100.0,50.0),  Point::new(50.0,100.0),    Point::new(0.0,50.0)   ].to_vec()), Point::new(75.0,20.0),              PolySide::Outside),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,0.0),     Point::new(-400.0,0.0),  Point::new(-400.0,-400.0), Point::new(0.0,-400.0) ].to_vec()), Point::new(-380.0,-380.0),          PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,10.0), Point::new(10.0,0.0), Point::new(20.0,10.0), Point::new(10.0,20.0), Point::new(10.0,10.0)].to_vec()), Point::new(15.0,11.0),   PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,10.0), Point::new(10.0,0.0), Point::new(20.0,10.0), Point::new(10.0,20.0), Point::new(10.0,10.0)].to_vec()), Point::new(15.0,10.0),   PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,10.0), Point::new(10.0,0.0), Point::new(20.0,11.0), Point::new(10.0,20.0), Point::new(10.0,10.0)].to_vec()), Point::new(15.0,10.0),   PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,10.0), Point::new(10.0,0.0), Point::new(20.0,9.0),  Point::new(10.0,20.0), Point::new(10.0,10.0)].to_vec()), Point::new(15.0,10.0),   PolySide::Inside ),
            (SimplePolygon::new_from_point_vector([Point::new(0.0,10.0), Point::new(10.0,0.0), Point::new(20.0,1.0),  Point::new(10.0,20.0), Point::new(10.0,10.0)].to_vec()), Point::new(15.0,10.0),   PolySide::Inside ),

            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,11.0), Point::new(8.0,10.0), Point::new(5.0,5.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Point::new(10.0,10.0),
                PolySide::Inside,
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(11.0,-1.0), Point::new(10.0,11.0), Point::new(8.0,10.0), Point::new(5.0,5.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Point::new(10.0,10.0),
                PolySide::Inside,
            ),

        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_point(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }
    // fn simplepolygon_on_boundingbox() {
    //     console_log!("- simplepolygon_on_boundingbox");
    // }
    fn simplepolygon_on_line() {
        console_log!("- simplepolygon_on_line");

        let testing_pairs = [
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(-5.0,5.0,15.0,5.0),                       LinePolygonIntersectionResult { points: vec![ Point::new(10.0,5.0), Point::new(0.0,5.0) ],        contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(-5.0,0.0,15.0,0.0),                       LinePolygonIntersectionResult { points: vec![ Point::new(0.0,0.0), Point::new(10.0,0.0) ],        contact:true,  intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                                               Line::new_from_values(-5.0,0.0,15.0,0.0),                       LinePolygonIntersectionResult { points: vec![ Point::new(0.0,0.0)],                               contact:true,  intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(-5.0,5.0,5.0,5.0),                        LinePolygonIntersectionResult { points: vec![ Point::new(0.0,5.0) ],                              contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0),    Point::new(10.0,0.0),    Point::new(20.0,10.0),   Point::new(10.0,20.0), Point::new(10.0,10.0)]),                               Line::new_from_values(-10.0,10.0,15.0,10.0),                    LinePolygonIntersectionResult { points: vec![ Point::new(0.0,10.0), Point::new(10.0,10.0) ],      contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0),    Point::new(10.0,0.0),    Point::new(20.0,10.0),   Point::new(10.0,20.0), Point::new(10.0,10.0)]),                               Line::new_from_values(0.0,20.0,5.0,15.0),                       LinePolygonIntersectionResult { points: vec![],                                                   contact:false, intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0),    Point::new(10.0,0.0),    Point::new(20.0,10.0),   Point::new(10.0,20.0), Point::new(10.0,10.0)]),                               Line::new_from_values(-10.0,10.0,10.0,10.0),                    LinePolygonIntersectionResult { points: vec![ Point::new(0.0,10.0), Point::new(10.0,10.0) ],      contact:true,  intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(5.0,5.0,15.0,5.0),                        LinePolygonIntersectionResult { points: vec![ Point::new(10.0,5.0) ],                             contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(-5.0,0.0,0.0,10.0),                       LinePolygonIntersectionResult { points: vec![ Point::new(0.0,10.0) ],                             contact:true,  intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(-5.0,-5.0,5.0,5.0),                       LinePolygonIntersectionResult { points: vec![ Point::new(0.0,0.0) ],                              contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(-5.0,-5.0,0.0,5.0),                       LinePolygonIntersectionResult { points: vec![ Point::new(0.0,5.0) ],                              contact:true,  intersect:false, inverse_intersect:true,  traverse:false } ), //skirt 
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(0.0,0.0,10.0,0.0),                        LinePolygonIntersectionResult { points: vec![ Point::new(0.0,0.0), Point::new(10.0,0.0) ],        contact:true,  intersect:false, inverse_intersect:false, traverse:false } ), //skirt 
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(1.0,0.0,9.0,0.0),                         LinePolygonIntersectionResult { points: vec![ Point::new(1.0,0.0), Point::new(9.0,0.0) ],         contact:true,  intersect:false, inverse_intersect:false, traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(0.0,0.0,10.0,10.0),                       LinePolygonIntersectionResult { points: vec![ Point::new(0.0,0.0), Point::new(10.0,10.0) ],       contact:true,  intersect:true,  inverse_intersect:false, traverse:false } ), //perfect traversal
            ( SimplePolygon::new_from_point_vector( vec![Point::new(400.0,400.0), Point::new(410.0,400.0), Point::new(420.0,410.0), Point::new(430.0,420.0), Point::new(430.0,450.0), Point::new(400.0,450.0)] ), Line::new_from_values(400.0,400.0,410.0,400.0),                 LinePolygonIntersectionResult { points: vec![ Point::new(400.0,400.0), Point::new(410.0,400.0) ], contact:true,  intersect:false, inverse_intersect:false, traverse:false } ), //skirt 
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(0.0,10.0, 5.0,10.0),                      LinePolygonIntersectionResult { points:vec![Point::new(0.0,10.0),Point::new(5.0,10.0)],           contact:true,  intersect:false, inverse_intersect:false, traverse:false } ), //skirt
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(0.0,0.0,10.0,0.0),                        LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0),Point::new(10.0,0.0)],            contact:true,  intersect:false, inverse_intersect:false, traverse:false } ), //skirt
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(1.0,1.0,9.0,9.0),                         LinePolygonIntersectionResult { points: vec![],                                                   contact:false, intersect:true,  inverse_intersect:false, traverse:false } ), //completely within
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(-10.0,0.0,10.0,10.0),                     LinePolygonIntersectionResult { points: vec![ Point::new(10.0,10.0), Point::new(0.0,5.0) ],       contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(10.0,0.0,100.0,0.0),                      LinePolygonIntersectionResult { points: vec![ Point::new(10.0,0.0) ],                             contact:true,  intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(5.0,0.0,15.0,0.0),                        LinePolygonIntersectionResult { points: vec![ Point::new(10.0,0.0), Point::new(5.0,0.0) ],        contact:true,  intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0),  Point::new(60.0,-50.0),  Point::new(60.0,50.0),   Point::new(50.0,50.0)] ),                                                     Line::new_from_values(0.0,10.0,0.0,0.0),                        LinePolygonIntersectionResult { points: vec![],                                                   contact:false, intersect:false, inverse_intersect:true,  traverse:false } ), //completely separate
            ( SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0),  Point::new(60.0,-50.0),  Point::new(60.0,50.0),   Point::new(50.0,50.0)] ),                                                     Line::new_from_values(0.0,0.0,100.0,0.0),                       LinePolygonIntersectionResult { points: vec![ Point::new(60.0,0.0), Point::new(50.0,0.0) ],       contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0),  Point::new(60.0,-50.0),  Point::new(60.0,50.0),   Point::new(50.0,50.0)] ),                                                     Line::new_from_values(100.0,0.0,100.0,10.0),                    LinePolygonIntersectionResult { points: vec![],                                                   contact:false, intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0),  Point::new(60.0,-50.0),  Point::new(60.0,50.0),   Point::new(50.0,50.0)] ),                                                     Line::new_from_values(100.0,10.0,0.0,10.0),                     LinePolygonIntersectionResult { points: vec![ Point::new(60.0,10.0), Point::new(50.0,10.0) ],     contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(600.0,160.0), Point::new(639.0,160.0), Point::new(639.0,199.0), Point::new(600.0,199.0)] ),                                                   Line::new_from_values(117.209595,176.8104,607.24286,276.14508), LinePolygonIntersectionResult { points: vec![],                                                   contact:false, intersect:false, inverse_intersect:true,  traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(0.0,0.0,1.0,1.0),                         LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0)],                                 contact:true,  intersect:true,  inverse_intersect:false, traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(10.0,0.0),    Point::new(10.0,10.0),   Point::new(0.0,10.0)] ),                                                      Line::new_from_values(-1.0,-1.0,1.0,1.0),                       LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0)],                                 contact:true,  intersect:true,  inverse_intersect:true,  traverse:true  } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(25.0,60.0),   Point::new(75.0,60.0),   Point::new(75.0,75.0),   Point::new(25.0,75.0)] ),                                                     Line::new_from_values(40.0,60.0,55.0,60.0),                     LinePolygonIntersectionResult { points:vec![Point::new(40.0,60.0),Point::new(55.0,60.0)],         contact:true,  intersect:false, inverse_intersect:false, traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(100.0,0.0),   Point::new(100.0,100.0), Point::new(0.0,100.0)] ),                                                     Line::new_from_values(0.0,50.0,100.0,50.0),                     LinePolygonIntersectionResult { points:vec![Point::new(100.0,50.0),Point::new(0.0,50.0)],         contact:true,  intersect:true,  inverse_intersect:false, traverse:false } ),
            ( SimplePolygon::new_from_point_vector( vec![Point::new(40.0,60.0),   Point::new(55.0,60.0),   Point::new(55.0,70.0),   Point::new(40.0,70.0)] ),                                                     Line::new_from_values(25.0,60.0,75.0,60.0),                     LinePolygonIntersectionResult { points:vec![Point::new(40.0,60.0),Point::new(55.0,60.0)],         contact:true,  intersect:false, inverse_intersect:true,  traverse:false } ),    
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(100.0,0.0),   Point::new(100.0,100.0), Point::new(0.0,100.0)] ),                                                     Line::new_from_values(10.0,0.0,90.0,0.0),                       LinePolygonIntersectionResult { points:vec![Point::new(10.0,0.0), Point::new(90.0,0.0)],          contact:true,  intersect:false, inverse_intersect:false, traverse:false } ), //skirt
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(100.0,0.0),   Point::new(100.0,100.0), Point::new(0.0,100.0)] ),                                                     Line::new_from_values(0.0,0.0,90.0,0.0),                        LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(90.0,0.0)],           contact:true,  intersect:false, inverse_intersect:false, traverse:false } ), //skirt
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(100.0,0.0),   Point::new(100.0,100.0), Point::new(0.0,100.0)] ),                                                     Line::new_from_values(10.0,0.0,100.0,0.0),                      LinePolygonIntersectionResult { points:vec![Point::new(100.0,0.0), Point::new(10.0,0.0)],         contact:true,  intersect:false, inverse_intersect:false, traverse:false } ), //skirt
            ( SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),     Point::new(100.0,0.0),   Point::new(100.0,100.0), Point::new(0.0,100.0)] ),                                                     Line::new_from_values(0.0,0.0,100.0,0.0),                       LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(100.0,0.0)],          contact:true,  intersect:false, inverse_intersect:false, traverse:false } ), //skirt

            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(5.0,5.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(0.0,10.0,10.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(5.0,5.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(0.0,10.0,10.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(5.0,15.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(0.0,10.0,10.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:true, inverse_intersect:false, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(5.0,5.0), Point::new(2.0,9.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(0.0,10.0,10.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,11.0), Point::new(8.0,10.0), Point::new(5.0,5.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(0.0,10.0,10.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(8.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:true, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(8.0,10.0), Point::new(5.0,15.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(0.0,10.0,10.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(8.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:true, inverse_intersect:false, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(0.0,10.0,10.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false },
            ),

            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(5.0,5.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(10.0,10.0,0.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(5.0,5.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(10.0,10.0,0.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(5.0,15.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(10.0,10.0,0.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:true, inverse_intersect:false, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(5.0,5.0), Point::new(2.0,9.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(10.0,10.0,0.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,11.0), Point::new(8.0,10.0), Point::new(5.0,5.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(10.0,10.0,0.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(8.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:true, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(8.0,10.0), Point::new(5.0,15.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(10.0,10.0,0.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(8.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:true, inverse_intersect:false, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(10.0,10.0,0.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false },
            ),

            (
                SimplePolygon::new_from_point_vector( vec![Point::new(-1.0,-1.0), Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(8.0,10.0), Point::new(5.0,5.0), Point::new(2.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(10.0,10.0,0.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(8.0,10.0), Point::new(2.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false },
            ),
            (
                SimplePolygon::new_from_point_vector( vec![ Point::new(11.0,-1.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                Line::new_from_values(0.0,10.0,10.0,10.0),
                LinePolygonIntersectionResult { points:vec![Point::new(10.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false },
            ),
            ( 
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,4.0), Point::new(2.5,1.0), Point::new(3.0,4.0), Point::new(3.5,1.0), Point::new(6.0,4.0), Point::new(4.0,0.0), Point::new(2.0,0.0), Point::new(0.0,4.0)] ),
                Line::new_from_values(0.0,4.0,6.0,4.0),
                LinePolygonIntersectionResult { points:vec![Point::new(0.0,4.0), Point::new(3.0,4.0), Point::new(6.0,4.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false  } 
            ),
            ( 
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,4.0), Point::new(2.5,1.0), Point::new(3.0,5.0), Point::new(3.5,1.0), Point::new(6.0,4.0), Point::new(4.0,0.0), Point::new(2.0,0.0), Point::new(0.0,4.0)] ),
                Line::new_from_values(0.0,4.0,6.0,4.0),
                LinePolygonIntersectionResult { points:vec![Point::new(0.0,4.0), Point::new(2.875,4.0), Point::new(3.125,4.0), Point::new(6.0,4.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true  } 
            ),
            ( 
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,10.0), Point::new(10.0,-10.0), Point::new(20.0,10.0), Point::new(20.0,-10.0), Point::new(30.0,10.0), Point::new(40.0,0.0), Point::new(30.0,-20.0), Point::new(10.0,-20.0)]),
                Line::new_from_values(-10.0,5.0,30.0,5.0),
                LinePolygonIntersectionResult { points:vec![Point::new(5.0,5.0),Point::new(10.0,5.0),Point::new(17.5,5.0),Point::new(20.0,5.0),Point::new(27.5,5.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true }
            ),

            ( 
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,5.0), Point::new(2.5,2.5), Point::new(5.0,5.0), Point::new(7.5,5.0), Point::new(10.0,2.5), Point::new(10.0,5.0), Point::new(12.0,2.5), Point::new(12.0,7.5), Point::new(14.0,5.0), Point::new(14.0,0.0), Point::new(0.0,0.0)] ),
                Line::new_from_values(2.0,5.0,13.0,5.0),
                LinePolygonIntersectionResult { points:vec![Point::new(5.0,5.0), Point::new(7.5,5.0), Point::new(10.0,5.0), Point::new(12.0,5.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true  } 
            ),
            ( 
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,5.0), Point::new(2.5,2.5), Point::new(5.0,5.0), Point::new(7.5,5.0), Point::new(10.0,2.5), Point::new(10.0,5.0), Point::new(12.0,2.5), Point::new(12.0,7.5), Point::new(14.0,5.0), Point::new(14.0,0.0), Point::new(0.0,0.0)] ),
                Line::new_from_values(0.0,5.0,13.0,5.0),
                LinePolygonIntersectionResult { points:vec![Point::new(0.0,5.0), Point::new(5.0,5.0), Point::new(7.5,5.0), Point::new(10.0,5.0), Point::new(12.0,5.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true  } 
            ),
            ( 
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(1126.0,0.0), Point::new(1126.0,1066.0), Point::new(0.0,1066.0)] ),
                Line::new_from_values(0.0,0.0,10.0,0.0),
                LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(10.0,0.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } 
            ),

            ( 
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,20.0)] ),
                Line::new_from_values(0.0,20.0,0.0,20.0),
                LinePolygonIntersectionResult { points:vec![Point::new(0.0,20.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } 
            ),
        ];
        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_line(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }
    fn simplepolygon_on_simplepolygon() {
        console_log!("- simplepolygon_on_simplepolygon");

        let testing_pairs = [
            //totally separate shapes
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),   Point::new(10.0,0.0),  Point::new(10.0,10.0), Point::new(0.0,10.0)]  ),     
                    SimplePolygon::new_from_point_vector( vec![Point::new(15.0,15.0), Point::new(25.0,15.0), Point::new(25.0,25.0), Point::new(15.0,25.0)] ), 
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
            //simple overlap
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(5.0,5.0), Point::new(15.0,5.0), Point::new(15.0,15.0), Point::new(5.0,15.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,5.0), Point::new(5.0,10.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
            //completely inside
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(false) },
                ),
            //deck-of-cards overlap
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,10.0), Point::new(10.0,0.0), Point::new(10.0,10.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,10.0), Point::new(10.0,0.0), Point::new(10.0,10.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
            //bigger-piece-of-paper overlap
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(15.0,0.0), Point::new(15.0,15.0), Point::new(0.0,15.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,10.0), Point::new(10.0,0.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(15.0,0.0), Point::new(15.0,15.0), Point::new(0.0,15.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,10.0), Point::new(10.0,0.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
            //difficult traverse
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0), Point::new(10.0,20.0), Point::new(20.0,10.0), Point::new(10.0,0.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,10.0), Point::new(10.0,0.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0), Point::new(5.0,5.0), Point::new(10.0,10.0), Point::new(11.0,-1.0), Point::new(-1.0,-1.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,10.0), Point::new(10.0,10.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                //half-n-half overlap
                    (
                        SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                        SimplePolygon::new_from_point_vector( vec![Point::new(5.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(5.0,10.0)] ),
                        PolygonIntersectionResult { points:vec![Point::new(5.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(5.0,10.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                    ),
                    //same, but the other way around
                    (
                        SimplePolygon::new_from_point_vector( vec![Point::new(5.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(5.0,10.0)] ),
                        SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                        PolygonIntersectionResult { points:vec![Point::new(5.0,0.0), Point::new(5.0,10.0), Point::new(10.0,0.0), Point::new(10.0,10.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                    ),
                    //same, but pointer
                    (
                        SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                        SimplePolygon::new_from_point_vector( vec![Point::new(5.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(5.0,10.0), Point::new(5.0,5.0)] ),
                        PolygonIntersectionResult { points:vec![Point::new(5.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(5.0,10.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                    ),
                    //same, but the other way around
                    (
                        SimplePolygon::new_from_point_vector( vec![Point::new(5.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(5.0,10.0), Point::new(5.0,5.0)] ),
                        SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                        PolygonIntersectionResult { points:vec![Point::new(5.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(5.0,10.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                    ),
            //touching points
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,10.0), Point::new(20.0,10.0), Point::new(20.0,20.0), Point::new(10.0,20.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,10.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
            //point on side
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,5.0), Point::new(5.0,0.0), Point::new(10.0,5.0), Point::new(5.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,0.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,5.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,0.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,5.0), Point::new(5.0,0.0), Point::new(10.0,5.0), Point::new(5.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,5.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
            //touching sides
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,0.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,0.0), Point::new(10.0,10.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
            //touching sides, one side smaller
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,2.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,8.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,2.0), Point::new(10.0,8.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,2.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,8.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,8.0), Point::new(10.0,2.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
            //touching sides, one side smaller, smaller is inside the other
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(2.0,2.0), Point::new(10.0,2.0), Point::new(10.0,8.0), Point::new(2.0,8.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,2.0), Point::new(10.0,8.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(2.0,2.0), Point::new(10.0,2.0), Point::new(10.0,8.0), Point::new(2.0,8.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(10.0,2.0), Point::new(10.0,8.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
            //the same shape twice
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
            //shape totally inside the other shape
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(false) },
                ),
            //overlapping sides (like a cross shape)
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0), Point::new(60.0,-50.0), Point::new(60.0,50.0), Point::new(50.0,50.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(60.0,0.0), Point::new(50.0,0.0), Point::new(60.0,10.0), Point::new(50.0,10.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
            //wedged in an L shape thing
                //close, but no contact
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(2.0,2.0), Point::new(5.0,2.0), Point::new(5.0,5.0), Point::new(2.0,5.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
                //touching
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(5.0,1.0), Point::new(5.0,5.0), Point::new(1.0,5.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(1.0,1.0), Point::new(5.0,1.0), Point::new(1.0,5.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
                //complex
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.5,0.5), Point::new(5.0,1.0), Point::new(5.0,5.0), Point::new(1.0,5.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(5.0,1.0), Point::new(1.0,5.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.5,0.5), Point::new(5.0,0.5), Point::new(5.0,5.0), Point::new(1.0,5.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(5.0,1.0), Point::new(1.0,5.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(4.0,5.0), Point::new(5.0,4.0), Point::new(-4.0,-5.0), Point::new(-5.0,-4.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,1.0), Point::new(1.0,0.0), Point::new(2.0,1.0), Point::new(1.0,2.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,4.0), Point::new(2.5,1.0), Point::new(3.0,4.0), Point::new(3.5,1.0), Point::new(6.0,4.0), Point::new(4.0,0.0), Point::new(2.0,0.0), Point::new(0.0,4.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(4.0,5.0), Point::new(5.0,4.0), Point::new(-4.0,-5.0), Point::new(-5.0,-4.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(2.2727273,1.2727273), Point::new(1.3636365,2.3636365), Point::new(2.6,1.5999999), Point::new(3.0,4.0), Point::new(3.2857141,2.2857141), Point::new(1.6666667,0.66666675), Point::new(1.0,2.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),

            //misc
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0), Point::new(10.0,10.0), Point::new(11.0,-1.0), Point::new(-1.0,-1.0), Point::new(0.0,10.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,10.0), Point::new(10.0,10.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(50.0,50.0), Point::new(105.0,50.0), Point::new(105.0,105.0), Point::new(50.0,105.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(68.0,50.0), Point::new(68.0,105.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(875.0,50.0), Point::new(930.0,50.0), Point::new(930.0,105.0), Point::new(875.0,105.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(150.0,50.0), Point::new(345.0,50.0), Point::new(345.0,160.0), Point::new(150.0,160.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(400.0,50.0), Point::new(500.0,50.0), Point::new(500.0,105.0), Point::new(400.0,105.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(550.0,50.0), Point::new(790.0,50.0), Point::new(790.0,90.0), Point::new(740.0,140.0), Point::new(550.0,140.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(25.0,130.0), Point::new(35.0,120.0), Point::new(59.166666666666664,120.0), Point::new(71.125,130.0), Point::new(81.375,130.0), Point::new(93.33333333333333,120.0), Point::new(117.5,120.0), Point::new(127.5,130.0), Point::new(127.5,205.0), Point::new(117.5,215.0), Point::new(93.33333333333333,215.0), Point::new(81.375,205.0), Point::new(71.125,205.0), Point::new(59.166666666666664,215.0), Point::new(35.0,215.0), Point::new(25.0,205.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(68.0,127.38675958188156), Point::new(68.0,207.61324041811847)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(160.0,175.0), Point::new(242.5,175.0), Point::new(252.5,245.0), Point::new(201.25,275.0), Point::new(150.0,245.0)] ),
                    PolygonIntersectionResult { points:vec![],contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) }
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(280.0,180.0), Point::new(331.25,170.0), Point::new(382.5,180.0), Point::new(382.5,210.0), Point::new(331.25,220.0), Point::new(280.0,210.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(425.0,160.0), Point::new(645.0,160.0), Point::new(645.0,215.0), Point::new(425.0,215.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(425.0,220.0), Point::new(645.0,220.0), Point::new(645.0,275.0), Point::new(425.0,275.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(425.0,280.0), Point::new(645.0,280.0), Point::new(645.0,335.0), Point::new(425.0,335.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(425.0,340.0), Point::new(645.0,340.0), Point::new(645.0,420.0), Point::new(425.0,420.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(645.0,355.0), Point::new(425.0,355.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(675.0,160.0), Point::new(895.0,160.0), Point::new(895.0,545.0), Point::new(675.0,545.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(895.0,355.0), Point::new(675.0,355.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(355.0,110.0), Point::new(530.0,110.0), Point::new(530.0,150.0), Point::new(355.0,150.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(15.0,285.0), Point::new(25.0,285.0), Point::new(37.5,275.0), Point::new(52.5,275.0), Point::new(65.0,285.0), Point::new(260.0,285.0), Point::new(260.0,315.0), Point::new(65.0,315.0), Point::new(52.5,325.0), Point::new(37.5,325.0), Point::new(25.0,315.0), Point::new(15.0,315.0)] ), 
                    PolygonIntersectionResult { points:vec![Point::new(68.0,285.0), Point::new(68.0,315.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(270.0,225.0), Point::new(395.0,225.0), Point::new(395.0,275.0), Point::new(370.0,285.0), Point::new(370.0,325.0), Point::new(270.0,325.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(830.0,50.0), Point::new(820.0,52.67949192431122), Point::new(812.6794919243113,60.0), Point::new(810.0,70.0), Point::new(812.6794919243113,80.0), Point::new(820.0,87.32050807568876), Point::new(830.0,90.0), Point::new(840.0,87.32050807568878), Point::new(847.3205080756887,80.0), Point::new(850.0,70.0), Point::new(847.3205080756887,60.000000000000014), Point::new(840.0,52.679491924311236)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(790.0,120.0), Point::new(800.0,110.0), Point::new(890.0,110.0), Point::new(905.0,120.0), Point::new(905.0,140.0), Point::new(890.0,150.0), Point::new(800.0,150.0), Point::new(790.0,140.0)] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(80.0,330.0), Point::new(400.0,330.0), Point::new(400.0,392.5), Point::new(80.0,392.5)] ),
                    PolygonIntersectionResult { points:vec![ Point::new(400.0,355.0), Point::new(80.0,355.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),

                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(6.0,6.0), Point::new(56.0,6.0), Point::new(56.0,51.0), Point::new(6.0,51.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(6.0,6.0), Point::new(76.0,6.0), Point::new(76.0,51.0), Point::new(6.0,51.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(6.0,6.0), Point::new(6.0,51.0), Point::new(56.0,6.0), Point::new(56.0,51.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(70.0,0.0), Point::new(70.0,45.0), Point::new(0.0,45.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(50.0,45.0), Point::new(0.0,45.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,45.0), Point::new(50.0,0.0), Point::new(50.0,45.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),

                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,100.0), Point::new(0.0,100.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(0.0,100.0), Point::new(50.0,100.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,100.0), Point::new(50.0,0.0), Point::new(50.0,100.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,100.0), Point::new(0.0,100.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(-50.0,0.0), Point::new(50.0,0.0), Point::new(50.0,100.0), Point::new(-50.0,100.0)] ),
                    PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,100.0), Point::new(50.0,0.0), Point::new(50.0,100.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![ Point::new(117.209595,176.8104), Point::new(607.24286,276.14508), Point::new(547.6421,570.16504), Point::new(57.608795,470.83038) ] ),
                    SimplePolygon::new_from_point_vector( vec![ Point::new(600.0,160.0), Point::new(639.0,160.0), Point::new(639.0,199.0), Point::new(600.0,199.0) ] ),
                    PolygonIntersectionResult { points:vec![], contact:false, intersect:false, traverse:false, first_contains_second_without_contact:None },
                ),
        ];

        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_simple_polygon(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }
    fn intersect_with_simple_polygon__intersect_only() {
        console_log!("- intersect_with_simple_polygon__intersect_only");

        let testing_pairs = [
            //totally separate shapes
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0),   Point::new(10.0,0.0),  Point::new(10.0,10.0), Point::new(0.0,10.0)]  ),     
                    SimplePolygon::new_from_point_vector( vec![Point::new(15.0,15.0), Point::new(25.0,15.0), Point::new(25.0,25.0), Point::new(15.0,25.0)] ), 
                    false,
                ),
            //simple overlap
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(5.0,5.0), Point::new(15.0,5.0), Point::new(15.0,15.0), Point::new(5.0,15.0)] ),
                    true,
                ),
            //completely inside
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                    true,
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    true,
                ),
            //deck-of-cards overlap
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(0.0,10.0)] ),
                    true,
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    true,
                ),
            //bigger-piece-of-paper overlap
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(15.0,0.0), Point::new(15.0,15.0), Point::new(0.0,15.0)] ),
                    true,
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(15.0,0.0), Point::new(15.0,15.0), Point::new(0.0,15.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    true,
                ),
            //difficult traverse
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0), Point::new(10.0,20.0), Point::new(20.0,10.0), Point::new(10.0,0.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0), Point::new(5.0,5.0), Point::new(10.0,10.0), Point::new(11.0,-1.0), Point::new(-1.0,-1.0), Point::new(0.0,10.0)] ),
                    true,
                ),
                //half-n-half overlap
                    (
                        SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                        SimplePolygon::new_from_point_vector( vec![Point::new(5.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(5.0,10.0)] ),
                        true,
                    ),
                    //same, but the other way around
                    (
                        SimplePolygon::new_from_point_vector( vec![Point::new(5.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(5.0,10.0)] ),
                        SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                        true,
                    ),
                    //same, but pointer
                    (
                        SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                        SimplePolygon::new_from_point_vector( vec![Point::new(5.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(5.0,10.0), Point::new(5.0,5.0)] ),
                        true,
                    ),
                    //same, but the other way around
                    (
                        SimplePolygon::new_from_point_vector( vec![Point::new(5.0,0.0), Point::new(15.0,0.0), Point::new(15.0,10.0), Point::new(5.0,10.0), Point::new(5.0,5.0)] ),
                        SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                        true,
                    ),
            //touching points
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,10.0), Point::new(20.0,10.0), Point::new(20.0,20.0), Point::new(10.0,20.0)] ),
                    false,
                ),
            //point on side
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,5.0), Point::new(5.0,0.0), Point::new(10.0,5.0), Point::new(5.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,0.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,10.0)] ),
                    false,
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,0.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,5.0), Point::new(5.0,0.0), Point::new(10.0,5.0), Point::new(5.0,10.0)] ),
                    false,
                ),
            //touching sides
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,0.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,10.0)] ),
                    false,
                ),
            //touching sides, one side smaller
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,2.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,8.0)] ),
                    false,
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(10.0,2.0), Point::new(20.0,0.0), Point::new(20.0,10.0), Point::new(10.0,8.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    false,
                ),
            //touching sides, one side smaller, smaller is inside the other
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(2.0,2.0), Point::new(10.0,2.0), Point::new(10.0,8.0), Point::new(2.0,8.0)] ),
                    true,
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(2.0,2.0), Point::new(10.0,2.0), Point::new(10.0,8.0), Point::new(2.0,8.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    true,
                ),
            //the same shape twice
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    true,
                ),
            //shape totally inside the other shape
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                    true,
                ),
            //same, but the other way around
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    true,
                ),
            //overlapping sides (like a cross shape)
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0), Point::new(60.0,-50.0), Point::new(60.0,50.0), Point::new(50.0,50.0)] ),
                    true,
                ),
            //wedged in an L shape thing
                //close, but no contact
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(2.0,2.0), Point::new(5.0,2.0), Point::new(5.0,5.0), Point::new(2.0,5.0)] ),
                    false,
                ),
                //touching
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(5.0,1.0), Point::new(5.0,5.0), Point::new(1.0,5.0)] ),
                    false,
                ),
                //complex
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.5,0.5), Point::new(5.0,1.0), Point::new(5.0,5.0), Point::new(1.0,5.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.5,0.5), Point::new(5.0,0.5), Point::new(5.0,5.0), Point::new(1.0,5.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,1.0), Point::new(1.0,1.0), Point::new(1.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(4.0,5.0), Point::new(5.0,4.0), Point::new(-4.0,-5.0), Point::new(-5.0,-4.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,4.0), Point::new(2.5,1.0), Point::new(3.0,4.0), Point::new(3.5,1.0), Point::new(6.0,4.0), Point::new(4.0,0.0), Point::new(2.0,0.0), Point::new(0.0,4.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(4.0,5.0), Point::new(5.0,4.0), Point::new(-4.0,-5.0), Point::new(-5.0,-4.0)] ),
                    true,
                ),

            //misc
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,10.0), Point::new(10.0,10.0), Point::new(11.0,-1.0), Point::new(-1.0,-1.0), Point::new(0.0,10.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(50.0,50.0), Point::new(105.0,50.0), Point::new(105.0,105.0), Point::new(50.0,105.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(875.0,50.0), Point::new(930.0,50.0), Point::new(930.0,105.0), Point::new(875.0,105.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(150.0,50.0), Point::new(345.0,50.0), Point::new(345.0,160.0), Point::new(150.0,160.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(400.0,50.0), Point::new(500.0,50.0), Point::new(500.0,105.0), Point::new(400.0,105.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(550.0,50.0), Point::new(790.0,50.0), Point::new(790.0,90.0), Point::new(740.0,140.0), Point::new(550.0,140.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(25.0,130.0), Point::new(35.0,120.0), Point::new(59.166666666666664,120.0), Point::new(71.125,130.0), Point::new(81.375,130.0), Point::new(93.33333333333333,120.0), Point::new(117.5,120.0), Point::new(127.5,130.0), Point::new(127.5,205.0), Point::new(117.5,215.0), Point::new(93.33333333333333,215.0), Point::new(81.375,205.0), Point::new(71.125,205.0), Point::new(59.166666666666664,215.0), Point::new(35.0,215.0), Point::new(25.0,205.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(160.0,175.0), Point::new(242.5,175.0), Point::new(252.5,245.0), Point::new(201.25,275.0), Point::new(150.0,245.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(280.0,180.0), Point::new(331.25,170.0), Point::new(382.5,180.0), Point::new(382.5,210.0), Point::new(331.25,220.0), Point::new(280.0,210.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(425.0,160.0), Point::new(645.0,160.0), Point::new(645.0,215.0), Point::new(425.0,215.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(425.0,220.0), Point::new(645.0,220.0), Point::new(645.0,275.0), Point::new(425.0,275.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(425.0,280.0), Point::new(645.0,280.0), Point::new(645.0,335.0), Point::new(425.0,335.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(425.0,340.0), Point::new(645.0,340.0), Point::new(645.0,420.0), Point::new(425.0,420.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(675.0,160.0), Point::new(895.0,160.0), Point::new(895.0,545.0), Point::new(675.0,545.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(355.0,110.0), Point::new(530.0,110.0), Point::new(530.0,150.0), Point::new(355.0,150.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(15.0,285.0), Point::new(25.0,285.0), Point::new(37.5,275.0), Point::new(52.5,275.0), Point::new(65.0,285.0), Point::new(260.0,285.0), Point::new(260.0,315.0), Point::new(65.0,315.0), Point::new(52.5,325.0), Point::new(37.5,325.0), Point::new(25.0,315.0), Point::new(15.0,315.0)] ), 
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(270.0,225.0), Point::new(395.0,225.0), Point::new(395.0,275.0), Point::new(370.0,285.0), Point::new(370.0,325.0), Point::new(270.0,325.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(830.0,50.0), Point::new(820.0,52.67949192431122), Point::new(812.6794919243113,60.0), Point::new(810.0,70.0), Point::new(812.6794919243113,80.0), Point::new(820.0,87.32050807568876), Point::new(830.0,90.0), Point::new(840.0,87.32050807568878), Point::new(847.3205080756887,80.0), Point::new(850.0,70.0), Point::new(847.3205080756887,60.000000000000014), Point::new(840.0,52.679491924311236)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(790.0,120.0), Point::new(800.0,110.0), Point::new(890.0,110.0), Point::new(905.0,120.0), Point::new(905.0,140.0), Point::new(890.0,150.0), Point::new(800.0,150.0), Point::new(790.0,140.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(1027.0,34.0), Point::new(1027.0,355.0), Point::new(68.0,355.0), Point::new(68.0,34.0)] ), 
                    SimplePolygon::new_from_point_vector( vec![Point::new(80.0,330.0), Point::new(400.0,330.0), Point::new(400.0,392.5), Point::new(80.0,392.5)] ),
                    true,
                ),

                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(6.0,6.0), Point::new(56.0,6.0), Point::new(56.0,51.0), Point::new(6.0,51.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(6.0,6.0), Point::new(76.0,6.0), Point::new(76.0,51.0), Point::new(6.0,51.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(70.0,0.0), Point::new(70.0,45.0), Point::new(0.0,45.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(50.0,45.0), Point::new(0.0,45.0)] ),
                    true,
                ),

                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,100.0), Point::new(0.0,100.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(0.0,100.0), Point::new(50.0,100.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,100.0), Point::new(0.0,100.0)] ),
                    SimplePolygon::new_from_point_vector( vec![Point::new(-50.0,0.0), Point::new(50.0,0.0), Point::new(50.0,100.0), Point::new(-50.0,100.0)] ),
                    true,
                ),
                (
                    SimplePolygon::new_from_point_vector( vec![ Point::new(117.209595,176.8104), Point::new(607.24286,276.14508), Point::new(547.6421,570.16504), Point::new(57.608795,470.83038) ] ),
                    SimplePolygon::new_from_point_vector( vec![ Point::new(600.0,160.0), Point::new(639.0,160.0), Point::new(639.0,199.0), Point::new(600.0,199.0) ] ),
                    false,
                ),
        ];

        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_simple_polygon__intersect_only(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }

//complexpolygon
    fn complexpolygon_on_point() {
        console_log!("- complexpolygon_on_point");

        let blocky_eight_test_shape = ComplexPolygon::new_from_simple_polygons(
            SimplePolygon::new_rectangle(0.0,0.0, 100.0,0.0, 100.0,100.0, 0.0,100.0),
            vec![
                SimplePolygon::new_from_point_vector(
                    vec![
                        Point::new(25.0,25.0),
                        Point::new(75.0,25.0),
                        Point::new(75.0,40.0),
                        Point::new(25.0,40.0),
                    ],
                ),
                SimplePolygon::new_from_point_vector(
                    vec![
                        Point::new(25.0,60.0),
                        Point::new(75.0,60.0),
                        Point::new(75.0,75.0),
                        Point::new(25.0,75.0),
                    ],
                )
            ],
        );

        let testing_pairs = [
            ( &blocky_eight_test_shape, Point::new(-10.0,-10.0), PolySide::Outside ),
            ( &blocky_eight_test_shape, Point::new(10.0,10.0),   PolySide::Inside ),
            ( &blocky_eight_test_shape, Point::new(30.0,30.0),   PolySide::Outside ),
            ( &blocky_eight_test_shape, Point::new(25.0,25.0),   PolySide::OnPoint ),
            ( &blocky_eight_test_shape, Point::new(25.0,30.0),   PolySide::OnEdge ),
        ];
        for (index, pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_point(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }
    // fn complexpolygon_on_boundingbox() {
    //     console_log!("- complexpolygon_on_boundingbox");
    // }
    fn complexpolygon_on_line() {
        console_log!("- complexpolygon_on_line");

        let blocky_eight_test_shape = ComplexPolygon::new_from_simple_polygons(
            SimplePolygon::new_rectangle(0.0,0.0, 100.0,0.0, 100.0,100.0, 0.0,100.0),
            vec![
                SimplePolygon::new_from_point_vector(
                    vec![
                        Point::new(25.0,25.0),
                        Point::new(75.0,25.0),
                        Point::new(75.0,40.0),
                        Point::new(25.0,40.0),
                    ],
                ),
                SimplePolygon::new_from_point_vector(
                    vec![
                        Point::new(25.0,60.0),
                        Point::new(75.0,60.0),
                        Point::new(75.0,75.0),
                        Point::new(25.0,75.0),
                    ],
                )
            ],
        );

        let testing_pairs = [
            ( &blocky_eight_test_shape, Line::new_from_values(100.0,110.0, 100.0,110.0),             LinePolygonIntersectionResult { points:vec![], contact:false, intersect:false, inverse_intersect:true, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(0.0,100.0, 100.0,100.0),               LinePolygonIntersectionResult { points:vec![Point::new(100.0,100.0), Point::new(0.0,100.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(0.0,100.0, 50.0,100.0),                LinePolygonIntersectionResult { points:vec![Point::new(0.0,100.0), Point::new(50.0,100.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(100.0,100.0, 100.0,100.0),             LinePolygonIntersectionResult { points:vec![Point::new(100.0,100.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(0.0,0.0, 100.0,100.0),                 LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(100.0,100.0), Point::new(25.0,25.0), Point::new(40.0,40.0), Point::new(60.0,60.0), Point::new(75.0,75.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true } ),
            ( &blocky_eight_test_shape, Line::new_from_values(0.0,50.0, 100.0,50.0),                 LinePolygonIntersectionResult { points:vec![Point::new(100.0,50.0), Point::new(0.0,50.0)], contact:true, intersect:true, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(20.0,10.0, 20.0,50.0),                 LinePolygonIntersectionResult { points:vec![], contact:false, intersect:true, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(1.0,1.0, 9.0,9.0),                     LinePolygonIntersectionResult { points:vec![], contact:false, intersect:true, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(-10.0,0.0, 10.0,10.0),                 LinePolygonIntersectionResult { points:vec![Point::new(0.0,5.0)], contact:true , intersect:true, inverse_intersect:true, traverse:true } ),
            ( &blocky_eight_test_shape, Line::new_from_values(-5.0,5.0, 15.0,5.0),                   LinePolygonIntersectionResult { points:vec![Point::new(0.0,5.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true } ),
            ( &blocky_eight_test_shape, Line::new_from_values(-5.0,5.0, 5.0,5.0),                    LinePolygonIntersectionResult { points:vec![Point::new(0.0,5.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true } ),
            ( &blocky_eight_test_shape, Line::new_from_values(5.0,5.0, 15.0,5.0),                    LinePolygonIntersectionResult { points:vec![], contact:false, intersect:true, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(-5.0,0.0, 0.0,10.0),                   LinePolygonIntersectionResult { points:vec![Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(-5.0,-5.0, 5.0,5.0),                   LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true } ),
            ( &blocky_eight_test_shape, Line::new_from_values(-5.0,-5.0, 0.0,5.0),                   LinePolygonIntersectionResult { points:vec![Point::new(0.0,5.0)], contact:true, intersect:false, inverse_intersect:true, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(0.0,0.0, 10.0,0.0),                    LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(10.0,0.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(0.0,0.0, 10.0,10.0),                   LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0)], contact:true, intersect:true, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(400.0,400.0, 410.0,400.0),             LinePolygonIntersectionResult { points:vec![], contact:false, intersect:false, inverse_intersect:true, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(1.0,1.0, 9.0,9.0),                     LinePolygonIntersectionResult { points:vec![], contact:false, intersect:true, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(1.0,1.0, 99.0,99.0),                   LinePolygonIntersectionResult { points:vec![Point::new(25.0,25.0), Point::new(40.0,40.0), Point::new(60.0,60.0), Point::new(75.0,75.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true } ),
            ( &blocky_eight_test_shape, Line::new_from_values(10.0,0.0, 100.0,0.0),                  LinePolygonIntersectionResult { points:vec![Point::new(100.0,0.0), Point::new(10.0,0.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(5.0,0.0, 15.0,0.0),                    LinePolygonIntersectionResult { points:vec![Point::new(5.0,0.0), Point::new(15.0,0.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(0.0,10.0, 0.0,0.0),                    LinePolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,10.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(100.0,0.0, 100.0,10.0),                LinePolygonIntersectionResult { points:vec![Point::new(100.0,0.0), Point::new(100.0,10.0)], contact:true, intersect:false, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(100.0,10.0, 0.0,10.0),                 LinePolygonIntersectionResult { points:vec![Point::new(100.0,10.0), Point::new(0.0,10.0)], contact:true, intersect:true, inverse_intersect:false, traverse:false } ),
            ( &blocky_eight_test_shape, Line::new_from_values(11.209595,17.8104, 60.24286,27.14508), LinePolygonIntersectionResult { points:vec![Point::new(48.975166,25.0)], contact:true, intersect:true, inverse_intersect:true, traverse:true } ),
            ( &blocky_eight_test_shape, Line::new_from_values(40.0,65.0, 60.0,70.0),                 LinePolygonIntersectionResult { points:vec![], contact:false, intersect:false, inverse_intersect:true, traverse:false } ),
        ];
        for (index, pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_line(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        } 
    }
    fn complexpolygon_on_simplepolygon() {
        console_log!("- complexpolygon_on_simplepolygon");

        let blocky_eight_test_shape = ComplexPolygon::new_from_simple_polygons(
            SimplePolygon::new_rectangle(0.0,0.0, 100.0,0.0, 100.0,100.0, 0.0,100.0),
            vec![
                SimplePolygon::new_from_point_vector(
                    vec![
                        Point::new(25.0,25.0),
                        Point::new(75.0,25.0),
                        Point::new(75.0,40.0),
                        Point::new(25.0,40.0),
                    ],
                ),
                SimplePolygon::new_from_point_vector(
                    vec![
                        Point::new(25.0,60.0),
                        Point::new(75.0,60.0),
                        Point::new(75.0,75.0),
                        Point::new(25.0,75.0),
                    ],
                )
            ],
        );

        let testing_pairs = [
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,100.0), Point::new(0.0,100.0)] ), 
                PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(100.0,0.0), Point::new(100.0,100.0), Point::new(0.0,100.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(10.0,10.0), Point::new(20.0,10.0), Point::new(20.0,20.0), Point::new(10.0,20.0)] ), 
                PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(15.0,15.0), Point::new(25.0,15.0), Point::new(25.0,25.0), Point::new(15.0,25.0)] ), 
                PolygonIntersectionResult { points:vec![Point::new(25.0,25.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(5.0,5.0), Point::new(15.0,5.0), Point::new(15.0,15.0), Point::new(5.0,15.0)] ),
                PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,10.0), Point::new(10.0,0.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(30.0,65.0), Point::new(70.0,65.0), Point::new(70.0,70.0), Point::new(30.0,70.0)] ),
                PolygonIntersectionResult { points:vec![], contact:false, intersect:false, traverse:false, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,60.0), Point::new(-10.0,60.0), Point::new(-10.0,70.0), Point::new(0.0,70.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(0.0,60.0), Point::new(0.0,70.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(40.0,60.0), Point::new(55.0,60.0), Point::new(55.0,70.0), Point::new(40.0,70.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(40.0,60.0), Point::new(55.0,60.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(25.0,60.0), Point::new(75.0,60.0), Point::new(75.0,75.0), Point::new(25.0,75.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(25.0,60.0), Point::new(75.0,60.0), Point::new(75.0,75.0), Point::new(25.0,75.0)], contact:true, intersect:false, traverse:false, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(1.0,1.0), Point::new(9.0,1.0), Point::new(9.0,9.0), Point::new(1.0,9.0)] ),
                PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(10.0,0.0), Point::new(10.0,10.0), Point::new(0.0,10.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,10.0), Point::new(10.0,0.0)], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0), Point::new(60.0,-50.0), Point::new(60.0,50.0), Point::new(50.0,50.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(60.0,0.0), Point::new(50.0,0.0), Point::new(60.0,25.0), Point::new(50.0,25.0), Point::new(60.0,40.0), Point::new(50.0,40.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0), Point::new(50.0,50.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(50.0,0.0), Point::new(50.0,25.0), Point::new(50.0,40.0)],  contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(50.0,-50.0), Point::new(50.0,30.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(50.0,0.0), Point::new(50.0,25.0)],  contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(50.0,50.0), Point::new(105.0,50.0), Point::new(105.0,105.0), Point::new(50.0,105.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(100.0,50.0), Point::new(50.0,100.0), Point::new(50.0,60.0), Point::new(50.0,75.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
            ),
            
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(50.0,0.0), Point::new(50.0,45.0), Point::new(0.0,45.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,45.0), Point::new(50.0,0.0), Point::new(50.0,25.000002), Point::new(50.0,40.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(0.0,0.0), Point::new(0.0,100.0), Point::new(50.0,100.0), Point::new(50.0,0.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,100.0), Point::new(50.0,0.0), Point::new(50.0,100.0), Point::new(50.0,25.0), Point::new(50.0,39.999996), Point::new(50.0,60.0), Point::new(50.0,75.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_from_point_vector( vec![Point::new(-50.0,0.0), Point::new(50.0,0.0), Point::new(50.0,100.0), Point::new(-50.0,100.0)] ),
                PolygonIntersectionResult { points:vec![Point::new(0.0,0.0), Point::new(0.0,100.0), Point::new(50.0,0.0), Point::new(50.0,100.0), Point::new(50.0,25.0), Point::new(50.0,39.999996), Point::new(50.0,60.0), Point::new(50.0,75.0)], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
            ),
            (
                &blocky_eight_test_shape,
                SimplePolygon::new_rectangle(5.0,5.0, 95.0,5.0, 95.0,95.0, 5.0,95.0),
                PolygonIntersectionResult { points:vec![], contact:false, intersect:true, traverse:true, first_contains_second_without_contact:None },
            ),
        ];

        for (index,pair) in testing_pairs.iter().enumerate() {
            let result = pair.0.intersect_with_simple_polygon(&pair.1);
            console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
        }
    }
    // fn complexpolygon_on_complexpolygon() {
    //     console_log!("- complexpolygon_on_complexpolygon");

    //     let blocky_eight_test_shape = ComplexPolygon::new_from_simple_polygons(
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
    //     let blocky_eight_test_shape_offset_x_by_10 = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(10.0,0.0, 110.0,0.0, 110.0,100.0, 10.0,100.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(35.0,25.0),
    //                     Point::new(85.0,25.0),
    //                     Point::new(85.0,40.0),
    //                     Point::new(35.0,40.0),
    //                 ],
    //             ),
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(35.0,60.0),
    //                     Point::new(85.0,60.0),
    //                     Point::new(85.0,75.0),
    //                     Point::new(35.0,75.0),
    //                 ],
    //             )
    //         ],
    //     );
    //     let blocky_eight_test_shape_offset_y_by_10 = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(0.0,10.0, 100.0,10.0, 100.0,110.0, 0.0,110.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(25.0,35.0),
    //                     Point::new(75.0,35.0),
    //                     Point::new(75.0,50.0),
    //                     Point::new(25.0,50.0),
    //                 ],
    //             ),
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(25.0,70.0),
    //                     Point::new(75.0,70.0),
    //                     Point::new(75.0,85.0),
    //                     Point::new(25.0,85.0),
    //                 ],
    //             )
    //         ],
    //     );
    //     let blocky_eight_test_shape_offset_xy_by_10 = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(10.0,10.0, 110.0,10.0, 110.0,110.0, 10.0,110.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(35.0,35.0),
    //                     Point::new(85.0,35.0),
    //                     Point::new(85.0,50.0),
    //                     Point::new(35.0,50.0),
    //                 ],
    //             ),
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(35.0,70.0),
    //                     Point::new(85.0,70.0),
    //                     Point::new(85.0,85.0),
    //                     Point::new(35.0,85.0),
    //                 ],
    //             )
    //         ],
    //     );
    //     let big_ol_o = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(0.0,0.0, 100.0,0.0, 100.0,100.0, 0.0,100.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(10.0,10.0),
    //                     Point::new(90.0,10.0),
    //                     Point::new(90.0,90.0),
    //                     Point::new(10.0,90.0),
    //                 ],
    //             ),
    //         ],
    //     );
    //     let even_bigger_ol_o = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(-20.0,-20.0, 120.0,-20.0, 120.0,120.0, -20.0,120.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(-10.0,-10.0),
    //                     Point::new(110.0,-10.0),
    //                     Point::new(110.0,110.0),
    //                     Point::new(-10.0,110.0),
    //                 ],
    //             ),
    //         ],
    //     );
    //     let blocky_eight_test_shape_with_the_holes_to_the_side = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(0.0,0.0, 100.0,0.0, 100.0,100.0, 0.0,100.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(10.0,10.0),
    //                     Point::new(20.0,10.0),
    //                     Point::new(20.0,20.0),
    //                     Point::new(10.0,20.0),
    //                 ],
    //             ),
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(10.0,80.0),
    //                     Point::new(20.0,80.0),
    //                     Point::new(20.0,90.0),
    //                     Point::new(10.0,90.0),
    //                 ],
    //             )
    //         ],
    //     );
    //     let blocky_eight_test_shape_with_the_holes_to_the_side_and_smaller_rim = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(5.0,5.0, 95.0,5.0, 95.0,95.0, 5.0,95.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(10.0,10.0),
    //                     Point::new(20.0,10.0),
    //                     Point::new(20.0,20.0),
    //                     Point::new(10.0,20.0),
    //                 ],
    //             ),
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(10.0,80.0),
    //                     Point::new(20.0,80.0),
    //                     Point::new(20.0,90.0),
    //                     Point::new(10.0,90.0),
    //                 ],
    //             )
    //         ],
    //     );
    //     let blocky_eight_test_shape_with_big_holes_and_smaller_rim = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(5.0,5.0, 95.0,5.0, 95.0,95.0, 5.0,95.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(20.0,20.0),
    //                     Point::new(80.0,20.0),
    //                     Point::new(80.0,45.0),
    //                     Point::new(20.0,45.0),
    //                 ],
    //             ),
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(20.0,55.0),
    //                     Point::new(80.0,55.0),
    //                     Point::new(80.0,80.0),
    //                     Point::new(20.0,80.0),
    //                 ],
    //             )
    //         ],
    //     );
    //     let blocky_eight_test_shape_with_big_holes_except_one_is_wrong_and_smaller_rim = ComplexPolygon::new_from_simple_polygons(
    //         SimplePolygon::new_rectangle(5.0,5.0, 95.0,5.0, 95.0,95.0, 5.0,95.0),
    //         vec![
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(20.0,20.0),
    //                     Point::new(80.0,20.0),
    //                     Point::new(80.0,45.0),
    //                     Point::new(20.0,45.0),
    //                 ],
    //             ),
    //             SimplePolygon::new_from_point_vector(
    //                 vec![
    //                     Point::new(20.0,65.0),
    //                     Point::new(80.0,65.0),
    //                     Point::new(80.0,80.0),
    //                     Point::new(20.0,80.0),
    //                 ],
    //             )
    //         ],
    //     );

    //     let testing_pairs = [
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &blocky_eight_test_shape,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(0.0,0.0),
    //         //         Point::new(100.0,0.0),
    //         //         Point::new(100.0,100.0),
    //         //         Point::new(0.0,100.0),
    //         //         Point::new(25.0,25.0),
    //         //         Point::new(75.0,25.0),
    //         //         Point::new(75.0,40.0),
    //         //         Point::new(25.0,40.0),
    //         //         Point::new(25.0,60.0),
    //         //         Point::new(75.0,60.0),
    //         //         Point::new(75.0,75.0),
    //         //         Point::new(25.0,75.0),
    //         //     ], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &blocky_eight_test_shape_offset_x_by_10,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(10.0,0.0),
    //         //         Point::new(10.0,100.0),
    //         //         Point::new(100.0,0.0),
    //         //         Point::new(100.0,100.0),
    //         //         Point::new(35.0,25.0),
    //         //         Point::new(35.0,40.0),
    //         //         Point::new(75.0,25.0),
    //         //         Point::new(75.0,40.0),
    //         //         Point::new(35.0,60.0),
    //         //         Point::new(35.0,75.0),
    //         //         Point::new(75.0,60.0),
    //         //         Point::new(75.0,75.0)
    //         //     ], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &blocky_eight_test_shape_offset_y_by_10,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(0.0,100.0),
    //         //         Point::new(0.0,10.0),
    //         //         Point::new(100.0,10.0),
    //         //         Point::new(100.0,100.0),
    //         //         Point::new(25.0,40.0),
    //         //         Point::new(25.0,35.0),
    //         //         Point::new(75.0,35.0),
    //         //         Point::new(75.0,40.0),
    //         //         Point::new(25.0,75.0),
    //         //         Point::new(25.0,70.0),
    //         //         Point::new(75.0,70.0),
    //         //         Point::new(75.0,75.0)
    //         //     ], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &blocky_eight_test_shape_offset_xy_by_10,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(10.0,100.0),
    //         //         Point::new(100.0,10.0),
    //         //         Point::new(35.0,40.0),
    //         //         Point::new(75.0,35.0),
    //         //         Point::new(35.0,75.0),
    //         //         Point::new(75.0,70.0)
    //         //     ], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &big_ol_o,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(0.0,0.0),
    //         //         Point::new(100.0,0.0),
    //         //         Point::new(100.0,100.0),
    //         //         Point::new(0.0,100.0)
    //         //     ], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &even_bigger_ol_o,
    //         //     PolygonIntersectionResult { points:vec![
    //         //     ], contact:false, intersect:false, traverse:false, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &even_bigger_ol_o,
    //         //     &blocky_eight_test_shape,
    //         //     PolygonIntersectionResult { points:vec![
    //         //     ], contact:false, intersect:false, traverse:false, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &blocky_eight_test_shape_with_the_holes_to_the_side,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(0.0,0.0),
    //         //         Point::new(100.0,0.0),
    //         //         Point::new(100.0,100.0),
    //         //         Point::new(0.0,100.0),
    //         //     ], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape_with_the_holes_to_the_side,
    //         //     &blocky_eight_test_shape,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(0.0,0.0),
    //         //         Point::new(100.0,0.0),
    //         //         Point::new(100.0,100.0),
    //         //         Point::new(0.0,100.0),
    //         //     ], contact:true, intersect:true, traverse:false, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &blocky_eight_test_shape_with_big_holes_and_smaller_rim,
    //         //     PolygonIntersectionResult { points:vec![
    //         //     ], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(false) },
    //         // ),
    //         (
    //             &blocky_eight_test_shape_with_big_holes_and_smaller_rim,
    //             &blocky_eight_test_shape,
    //             PolygonIntersectionResult { points:vec![
    //             ], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:Some(true) },
    //         ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &blocky_eight_test_shape_with_big_holes_except_one_is_wrong_and_smaller_rim,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(75.0,65.0),
    //         //         Point::new(25.0,65.0)
    //         //     ], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape_with_big_holes_except_one_is_wrong_and_smaller_rim,
    //         //     &blocky_eight_test_shape,
    //         //     PolygonIntersectionResult { points:vec![
    //         //         Point::new(25.0,65.0),
    //         //         Point::new(75.0,65.0),
    //         //     ], contact:true, intersect:true, traverse:true, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape,
    //         //     &blocky_eight_test_shape_with_the_holes_to_the_side_and_smaller_rim,
    //         //     PolygonIntersectionResult { points:vec![
    //         //     ], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:None },
    //         // ),
    //         // (
    //         //     &blocky_eight_test_shape_with_the_holes_to_the_side_and_smaller_rim,
    //         //     &blocky_eight_test_shape,
    //         //     PolygonIntersectionResult { points:vec![
    //         //     ], contact:false, intersect:true, traverse:false, first_contains_second_without_contact:None },
    //         // ),
    //     ];
    
    //     for (index,pair) in testing_pairs.iter().enumerate() {
    //         let result = pair.0.intersect_with_complex_polygon(&pair.1);
    //         console_log!("{} | {}", index, if pair.2 == result { "pass".to_string() } else { format!("fail | should be \"{}\" is \"{}\"", pair.2, result) });
    //     }
    // }