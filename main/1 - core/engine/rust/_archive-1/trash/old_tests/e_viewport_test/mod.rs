#![allow(non_camel_case_types)]
#![allow(unused_variables)]
#![allow(unused_mut)]
#![allow(unused_imports)]

//rust

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a: &str);
        #[wasm_bindgen(js_namespace = self)]
        fn __getWorker() -> web_sys::Worker;
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{
        Point,
        Colour,
        ElementType,
    };
    use crate::b_element;
    use crate::c_arrangement;
    use crate::d_render;
    use crate::e_viewport;



pub fn all() {
    console_log!("Viewport Test");

    // a();
    b();
    // c();
}


pub fn a() {
    let mut v = e_viewport::Viewport::new();

    v.position(Point::new(0.0,0.0),(800,600));

    v._dump();
}
pub fn b() {
    let worker = __getWorker();
    let mut em = b_element::ElementManager::new();
    let mut a = c_arrangement::Arrangement::new(&mut em);
    let mut r = d_render::Render::new();
    let mut v = e_viewport::Viewport::new();

    //lots of squares
        let count = 30_000; //dev version
        // let count = 320_000; //production version
        for index in 0..count {
            let x_mux = js_sys::Math::random() as f32;
            let y_mux = js_sys::Math::random() as f32;

            let tmp = em.create(ElementType::Rectangle, format!("rect_{}",index));
            em.get_element_by_id_mut(tmp).unwrap().as_rectangle_mut().unwrap().set_unified_attribute(
                Some( (800.0 * x_mux) as f32 ), 
                Some( (600.0 * y_mux) as f32 ), 
                Some( 3.14 * js_sys::Math::random() as f32 ), 
                Some( 1.0 ),
                Some( 30.0 ),  
                Some( 30.0 ),
                Some(Point::new( 0.5, 0.5 )),
                Some( Colour::new(
                    x_mux,
                    y_mux,
                    js_sys::Math::random() as f32,
                    1.0,
                ) ),
            );
            a.append(&mut em, tmp);
        }

    // v.position(
    //     Point::new(-100.0,-100.0),
    //     r.get_canvas_size(),
    // );
    // v.angle(
    //     0.1,
    //     r.get_canvas_size(),
    // );

    r.frame(
        &worker,
        false,
        &em,
        &a,
        &v.get_viewbox(),
    );

    // v._dump();
}
pub fn c() {
    let worker = __getWorker();
    let mut em = b_element::ElementManager::new();
    let mut a = c_arrangement::Arrangement::new(&mut em);
    let mut r = d_render::Render::new();
    let mut v = e_viewport::Viewport::new();

    //measure
        for index_y in 0..15 {
            for index_x in 0..20 {
                let tmp = em.create(ElementType::Rectangle, format!("rect_{}/{}",index_y,index_x));

                em.get_element_by_id_mut(tmp).unwrap().as_rectangle_mut().unwrap().set_unified_attribute(
                    Some( index_x as f32 * 40.0 ), 
                    Some( index_y as f32 * 40.0 ), 
                    None,
                    None,
                    Some( 39.0 ), 
                    Some( 39.0 ),
                    None,
                    Some( Colour::new(
                        if index_y%5 == 0 { 1.0 } else { 0.0 },
                        if index_x%5 == 0 { 1.0 } else { 0.0 },
                        0.75,
                        1.0,
                    ) ),
                );
                a.append(&mut em, tmp);
            }
        }

        let tmp = em.create(ElementType::Rectangle, format!("bonus_rect_1"));
        em.get_element_by_id_mut(tmp).unwrap().as_rectangle_mut().unwrap().set_unified_attribute(
            Some( -40.0 ), 
            Some( 200.0 ), 
            None,
            None,
            Some( 39.0 ), 
            Some( 39.0 ),
            None,
            Some( Colour::new(
                0.5,
                0.5,
                0.75,
                1.0,
            ) ),
        );
        a.append(&mut em, tmp);

    v.position(
        Point::new(40.0,40.0),
        r.get_canvas_size(),
    );
    v.scale(
        2.0,
        r.get_canvas_size(),
    );
    // v.angle(
    //     1.0,
    //     r.get_canvas_size(),
    // );

    r.frame(
        &worker,
        false,
        &em,
        &a,
        &v.get_viewbox(),
    );

    // r._dump();
}