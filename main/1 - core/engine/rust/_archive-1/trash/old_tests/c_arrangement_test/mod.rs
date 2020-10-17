#![allow(non_camel_case_types)]
#![allow(unused_variables)]
#![allow(unused_mut)]

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
    use crate::a_library;
    use crate::b_element;
    use crate::c_arrangement;



pub fn all() {
    console_log!("Arrangement Test");

    a();
}


pub fn a() {
    let mut em = b_element::ElementManager::new();
    let mut a = c_arrangement::Arrangement::new(&mut em);

    let group_1 = em.create(a_library::data_type::ElementType::Group, String::from("group_1"));
    let group_2 = em.create(a_library::data_type::ElementType::Group, String::from("group_2"));
    let group_3 = em.create(a_library::data_type::ElementType::Group, String::from("group_3"));
    let group_4 = em.create(a_library::data_type::ElementType::Group, String::from("group_4"));
    let group_5 = em.create(a_library::data_type::ElementType::Group, String::from("group_5"));
    a.append(&mut em, group_1);
    a.append(&mut em, group_2);
    a.append(&mut em, group_3);
    a.append(&mut em, group_4);
    a.append(&mut em, group_5);

    let group_6 = em.create(a_library::data_type::ElementType::Group, String::from("group_6"));
    let group_7 = em.create(a_library::data_type::ElementType::Group, String::from("group_7"));
    let group_8 = em.create(a_library::data_type::ElementType::Group, String::from("group_8"));
    let group_9 = em.create(a_library::data_type::ElementType::Group, String::from("group_9"));
    let group_10 = em.create(a_library::data_type::ElementType::Group, String::from("group_10"));
    em.get_element_by_id_mut(group_2).unwrap().as_group_mut().unwrap().append(&em, group_6);
    em.get_element_by_id_mut(group_2).unwrap().as_group_mut().unwrap().append(&em, group_7);
    em.get_element_by_id_mut(group_2).unwrap().as_group_mut().unwrap().append(&em, group_8);
    em.get_element_by_id_mut(group_2).unwrap().as_group_mut().unwrap().append(&em, group_9);
    em.get_element_by_id_mut(group_2).unwrap().as_group_mut().unwrap().append(&em, group_10);

    a._dump(&em);

    console_log!("{:?}", a.get_element_by_address(&em, String::from("/root/group_2/group_10")) );
    console_log!("{:?}", a.get_element_by_address(&em, String::from("/root/grofup_2/group_10")) );
}