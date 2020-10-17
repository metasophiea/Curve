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
        Offset,
        BoundingBox,
        Polygon,
        Colour,
        Viewbox,
        ElementType,
    };
    use crate::b_element;
    use crate::c_arrangement;
    use crate::d_render;


pub fn all() {
    console_log!("Render Test");

    // a();
    // b();
    // c();
    // d();
    // e();
    f();
}


pub fn a() {
    let mut r = d_render::Render::new();

    r._dump();
}
pub fn b() {
    let worker = __getWorker();
    let mut em = b_element::ElementManager::new();
    let mut a = c_arrangement::Arrangement::new(&mut em);
    let mut r = d_render::Render::new();

    let rect_1 = em.create(ElementType::Rectangle, String::from("rect_1"));
    a.append(&mut em, rect_1);

    r.frame( 
        &worker,
        false,
        &em,
        &a,
        &Viewbox::new_default(),
    );

    a._dump(&em);
    r._dump();
}
pub fn c() {
    let worker = __getWorker();
    let mut em = b_element::ElementManager::new();
    let mut a = c_arrangement::Arrangement::new(&mut em);
    let mut r = d_render::Render::new();

    //lots of squares
        let count = 36_000; //dev version
        // let count = 300_000; //production version

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

    r.frame( 
        &worker,
        false,
        &em,
        &a,
        &Viewbox::new(
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            800,
            600
        ),
    );

    r._dump();
}
pub fn d() {
    let worker = __getWorker();
    let mut em = b_element::ElementManager::new();
    let mut a = c_arrangement::Arrangement::new(&mut em);
    let mut r = d_render::Render::new();

    //measure
        for index_y in 0..15 {
            for index_x in 0..20 {
                let tmp = em.create(ElementType::Rectangle, format!("rect_{}/{}",index_y,index_x));

                let r = if index_y%5 == 0 { 1.0 } else { 0.0 };
                let g = if index_x%5 == 0 { 1.0 } else { 0.0 };

                em.get_element_by_id_mut(tmp).unwrap().as_rectangle_mut().unwrap().set_unified_attribute(
                    Some( index_x as f32 * 40.0 ), 
                    Some( index_y as f32 * 40.0 ), 
                    None,
                    None,
                    Some( 39.0 ),  
                    Some( 39.0 ),
                    None,
                    Some( Colour::new(
                        r,
                        g,
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

    r.frame( 
        &worker,
        false,
        &em,
        &a,
        &Viewbox::new(
            40.0,
            40.0,
            1.5,
            0.0,
            0.0,
            0.0,
            400,
            300
        ),
    );

    r._dump();
}
pub fn e() {
    let worker = __getWorker();
    let mut em = b_element::ElementManager::new();
    let mut a = c_arrangement::Arrangement::new(&mut em);
    let mut r = d_render::Render::new();

    //the stencil
        let stencil = em.create(ElementType::Rectangle, "the_stencil".to_string());
        em.get_element_by_id_mut(stencil).unwrap().as_rectangle_mut().unwrap().set_unified_attribute(
            Some( 80.0 ), 
            Some( 60.0 ), 
            None, 
            Some( 1.0 ),
            Some( 800.0 - 80.0*2.0 ),  
            Some( 600.0 - 60.0*2.0 ),  
            None,
            None,
        );
        em.get_element_by_id_mut(0).unwrap().as_group_mut().unwrap().stencil( &em, stencil );
        em.get_element_by_id_mut(0).unwrap().as_group_mut().unwrap().set_clip_active( true );

    //all the squares
        let count = 1_000;
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

    r.frame( &worker, false, &em, &a, &Viewbox::new_default() );

    r._dump();
}
pub fn f() {
    let worker = __getWorker();
    let mut em = b_element::ElementManager::new();
    let mut a = c_arrangement::Arrangement::new(&mut em);
    let mut r = d_render::Render::new();

    let img_1 = em.create(ElementType::Image, String::from("img_1"));
    a.append(&mut em, img_1);

    r.frame( 
        &worker,
        false,
        &em,
        &a,
        &Viewbox::new_default(),
    );

    // em._dump();
    // r._dump();
}