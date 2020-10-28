#![allow(non_camel_case_types)]
#![allow(unused_must_use)]

//rust

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a: &str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{
        Point,
    };
    use crate::b_element;



pub fn all() {
    console_log!("Element Test");

    // a();
    // b();
    // c();
    // d();
    // e();
    f();
}


pub fn a() {
    let mut em = b_element::ElementManager::new();
    let root_element = em.create(b_element::ElementType::Group, String::from("root"));
    console_log!("{}|{:?}", root_element, em.get_element_type_by_id(root_element) );

    em.get_element_by_id_mut(root_element).unwrap().set_name("hello".to_string());
    console_log!( "{}", em.get_element_by_id(root_element).unwrap().get_name() );

    em.get_element_by_id_mut(root_element).unwrap().set_x(3.0);
    console_log!( "{}", em.get_element_by_id(root_element).unwrap().get_x() );

    em.get_element_by_id_mut(root_element).unwrap().set_x(4.0);
    console_log!( "{}", em.get_element_by_id(root_element).unwrap().get_x() );

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().set_heed_camera(true);
    console_log!( "{}", em.get_element_by_id(root_element).unwrap().as_group().unwrap().get_heed_camera() );

    em._dump();
}
pub fn b() {
    let mut em = b_element::ElementManager::new();
    let root_element = em.create(b_element::ElementType::Group, String::from("root"));
    let group_1 = em.create(b_element::ElementType::Group, String::from("group_1"));
    let group_2 = em.create(b_element::ElementType::Group, String::from("group_2"));

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, group_1);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, group_2);
    // em.get_element_by_id_mut(group_1).unwrap().as_group_mut().unwrap().append(&em, group_2);

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().remove(&em, group_2);
    
    em._dump();
}
pub fn c() {
    let mut em = b_element::ElementManager::new();
    let root_element = em.create(b_element::ElementType::Group, String::from("root"));
    let group_1 = em.create(b_element::ElementType::Group, String::from("group_1"));
    let group_2 = em.create(b_element::ElementType::Group, String::from("group_2"));
    let group_3 = em.create(b_element::ElementType::Group, String::from("group_3"));
    let group_4 = em.create(b_element::ElementType::Group, String::from("group_4"));
    let group_5 = em.create(b_element::ElementType::Group, String::from("group_5"));

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, group_1);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, group_2);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, group_3);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, group_4);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, group_5);

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().shift(3,0);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().shift(2,0);

    em.get_element_by_id_mut(group_1).unwrap().set_x(1.0);

    em._dump();
}
pub fn d() {
    let mut em = b_element::ElementManager::new();
    let root_element = em.create(b_element::ElementType::Group, String::from("root"));
    let rect_1 = em.create(b_element::ElementType::Rectangle, String::from("rect_1"));
    let rect_2 = em.create(b_element::ElementType::Rectangle, String::from("rect_2"));
    let rect_3 = em.create(b_element::ElementType::Rectangle, String::from("rect_3"));

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, rect_1);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, rect_2);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, rect_3);

    em.get_element_by_id_mut(rect_2).unwrap().set_angle(1.0);
    em.get_element_by_id_mut(rect_2).unwrap().set_x(5.0);
    em.get_element_by_id_mut(rect_2).unwrap().set_y(5.0);
    em.get_element_by_id_mut(rect_2).unwrap().as_rectangle_mut().unwrap().set_anchor(Point::new(0.5,0.5));

    em._dump();
}
pub fn e() {
    let mut em = b_element::ElementManager::new();
    let root_element = em.create(b_element::ElementType::Group, String::from("root"));
    let rect_1 = em.create(b_element::ElementType::Rectangle, String::from("rect_1"));
    let rect_2 = em.create(b_element::ElementType::Rectangle, String::from("rect_2"));
    let rect_3 = em.create(b_element::ElementType::Rectangle, String::from("rect_3"));

    em.get_element_by_id_mut(rect_1).unwrap().set_x(0.0);
    em.get_element_by_id_mut(rect_1).unwrap().set_y(0.0);
    em.get_element_by_id_mut(rect_2).unwrap().set_x(20.0);
    em.get_element_by_id_mut(rect_2).unwrap().set_y(0.0);
    em.get_element_by_id_mut(rect_3).unwrap().set_x(0.0);
    em.get_element_by_id_mut(rect_3).unwrap().set_y(20.0);

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, rect_1);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, rect_2);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, rect_3);

    em._dump();

    // em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().remove(&em, rect_1);
    em.delete(rect_1);

    em._dump();
}
pub fn f() {
    let mut em = b_element::ElementManager::new();
    let root_element = em.create(b_element::ElementType::Group, String::from("root"));
    let rect_1 = em.create(b_element::ElementType::Rectangle, String::from("rect_1"));
    let rect_2 = em.create(b_element::ElementType::Rectangle, String::from("rect_2"));
    let rect_3 = em.create(b_element::ElementType::Rectangle, String::from("rect_3"));

    em.get_element_by_id_mut(rect_1).unwrap().set_x(0.0);
    em.get_element_by_id_mut(rect_1).unwrap().set_y(0.0);
    em.get_element_by_id_mut(rect_2).unwrap().set_x(20.0);
    em.get_element_by_id_mut(rect_2).unwrap().set_y(0.0);
    em.get_element_by_id_mut(rect_3).unwrap().set_x(0.0);
    em.get_element_by_id_mut(rect_3).unwrap().set_y(20.0);

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, rect_1);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().append(&em, rect_2);

    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().stencil(&em, rect_3);
    em.get_element_by_id_mut(root_element).unwrap().as_group_mut().unwrap().set_clip_active(true);

    em._dump();

    em.delete(rect_3);

    em._dump();

    // console_log!("{:?}", em.execute_method__Rectangle__get_colour(1) );
}