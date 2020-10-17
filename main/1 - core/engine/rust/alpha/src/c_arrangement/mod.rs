#![allow(non_snake_case)]

//rust

//wasm
    use wasm_bindgen::prelude::*;
    use std::cell::Ref;
    use std::collections::HashMap;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core

//self
    use crate::engine::Engine;
    use crate::a_library::data_type::{
        Point,
        Polygon,
        Viewbox,
        ElementType,
    };
    use crate::b_element::{
        ElementManager,
        ElementTrait,
    };








pub struct Arrangement {
    root_element_id: usize,
}
impl Arrangement {
    pub fn new(element_manager:&mut ElementManager) -> Arrangement {
        Arrangement {
            root_element_id: element_manager.create(ElementType::Group,"root".to_string()),
        }
    }

    //root
        pub fn get_root_element_id(&self) -> usize {
            self.root_element_id
        }
        pub fn prepend(&self, element_manager:&mut ElementManager, new_element_id:usize, viewbox:&Viewbox) {
            element_manager.get_element_by_id_mut(self.root_element_id).unwrap().as_group_mut().unwrap().prepend(&element_manager, new_element_id, viewbox);
        }
        pub fn append(&self, element_manager:&mut ElementManager, new_element_id:usize, viewbox:&Viewbox) {
            element_manager.get_element_by_id_mut(self.root_element_id).unwrap().as_group_mut().unwrap().append(&element_manager, new_element_id, viewbox);
        }
        pub fn remove(&self, element_manager:&mut ElementManager, departing_element:usize, viewbox:&Viewbox) {
            element_manager.get_element_by_id_mut(self.root_element_id).unwrap().as_group_mut().unwrap().remove(&element_manager, departing_element, viewbox);
        }
        pub fn clear(&self, element_manager:&mut ElementManager, viewbox:&Viewbox) {
            element_manager.get_element_by_id_mut(self.root_element_id).unwrap().as_group_mut().unwrap().clear(viewbox);
        }
        pub fn calculate_visibility(&self, element_manager:&mut ElementManager, viewbox:&Viewbox) {
            element_manager.get_element_by_id_mut(self.root_element_id).unwrap().as_group_mut().unwrap().determine_if_visible(None, viewbox, false);
        }

    //discovery
        pub fn get_element_by_address(&self, element_manager:&ElementManager, address:String) -> Option<usize> {
            let route = address.split("/");

            if element_manager.get_element_by_id(self.root_element_id).unwrap().get_name() != route.skip(1).next().unwrap() {
                return None;
            }

            let mut current_element_id = self.root_element_id;
            for name in address.split("/").skip(2) {
                current_element_id = match element_manager.get_element_by_id(current_element_id).unwrap().as_group() {
                    None => { return None; },
                    Some(group) => {
                        match group.get_child_by_name(&name.to_string()) {
                            None => { return None; },
                            Some(id) => id,
                        }
                    },
                };
            }
            Some(current_element_id)
        }
        pub fn get_elements_under_point(&self, element_manager:&ElementManager, window_point:&Point, point:Point) -> Vec<usize> {
            element_manager.get_element_by_id(self.root_element_id).unwrap().as_group().unwrap().get_elements_under_point(window_point, &point)
        }
        pub fn get_elements_under_area(&self, element_manager:&ElementManager, window_polygon:&Polygon, polygon:Polygon) -> Vec<usize> {
            element_manager.get_element_by_id(self.root_element_id).unwrap().as_group().unwrap().get_elements_under_area(window_polygon, &polygon)
        }

    //misc
        pub fn print_tree(&self, element_manager:&ElementManager, mode:Option<u8>) { //modes: 0:spaced / 1:tabular / 2:address
            let mode = match mode {
                Some(m) => m,
                None => 2,
            };

            fn get_the_facts(element:&Ref<dyn ElementTrait>) -> String {
                format!(
                    "{} (id:{}, type:{}, x:{}, y:{}, angle:{}, scale:{}, heed_camera:{}, is_visible:{})",
                    element.get_name(),
                    element.get_id(),
                    element.get_element_type(),
                    element.get_x(),
                    element.get_y(),
                    element.get_angle(),
                    element.get_scale(),

                    if element.get_parent_id() != Some(0) || element.get_element_type() != ElementType::Group { 
                        "-n/a-"
                    } else { 
                        match element.as_group().unwrap().get_heed_camera() {
                            None => { "None" },
                            Some(a) => { if a { "true" } else { "false" }},
                        }
                    },

                    element.is_visible(),
                )
            }

            fn recursive_print(mode:&u8, element:&Ref<dyn ElementTrait>, prefix:&String) {
                let prefix = match mode {
                    0 => {
                        console_log!( "{}{}", prefix, get_the_facts(&element) );
                        format!("{}- ", prefix)
                    },
                    1 => { 
                        console_log!( "{}{}", prefix, get_the_facts(&element) );
                        format!("{}-\t", prefix)
                    },
                    2 => { 
                        console_log!( "{}/{}", prefix, get_the_facts(&element) );
                        format!("{}/{}", prefix, element.get_name())
                    },
                    _ => String::new(),
                };

                if let Some(element) = element.as_group() {
                    for child in element.children() {
                        recursive_print( &mode, &child.upgrade().unwrap().borrow(), &prefix );
                    }
                }
            }

            recursive_print( &mode, &element_manager.get_element_by_id(self.root_element_id).unwrap(), &String::from("") );
        }
        pub fn print_survey(&self, element_manager:&ElementManager) {
            let mut results:HashMap<ElementType,u32> = HashMap::new();

            fn recursive_survey(element:&Ref<dyn ElementTrait>, results:&mut HashMap<ElementType,u32>) {
                match results.get_mut(&element.get_element_type()) {
                    Some(value) => { *value += 1; },
                    None => { results.insert(element.get_element_type(), 1); },
                }

                if let Some(element) = element.as_group() {
                    for child in element.children() {
                        recursive_survey( &child.upgrade().unwrap().borrow(), results );
                    }
                }
            }

            recursive_survey( &element_manager.get_element_by_id(self.root_element_id).unwrap(), &mut results );

            for (key, value) in results.iter() {
                console_log!("{}:{}", key, value);
            }
        }
        pub fn _dump(&self, element_manager:&ElementManager) {
            console_log!("┌─Arrangement Dump─");
            console_log!("│ root_element_id: {}", self.root_element_id);
            console_log!("│ - Arrangement Tree -");
            self.print_tree(element_manager, Some(2));
            console_log!("│ - Element Survey -");
            self.print_survey(element_manager);
            console_log!("└──────────────────────");
        }
}








//engine
    #[wasm_bindgen]
    impl Engine {
        //root
            pub fn arrangement__prepend(&mut self, element_id:usize) {
                self.arrangement.prepend(&mut self.element_manager, element_id, self.viewport.get_viewbox());
            }
            pub fn arrangement__append(&mut self, element_id:usize) {
                self.arrangement.append(&mut self.element_manager, element_id, self.viewport.get_viewbox());
            }
            pub fn arrangement__remove(&mut self, element_id:usize) {
                self.arrangement.remove(&mut self.element_manager, element_id, self.viewport.get_viewbox());
            }
            pub fn arrangement__clear(&mut self) {
                self.arrangement.clear(&mut self.element_manager, self.viewport.get_viewbox());
            }

        //discovery
            pub fn arrangement__get_element_by_address(&self, address:String) -> Option<usize> {
                self.arrangement.get_element_by_address(&self.element_manager, address)
            }
            pub fn arrangement__get_elements_under_point(&self, x:f32, y:f32) -> Vec<usize> {
                self.arrangement.get_elements_under_point(&self.element_manager, &Point::new(x,y), Point::new(x,y))
            }
            pub fn arrangement__get_elements_under_area(&self, polygon:Vec<f32>) -> Vec<usize> {
                self.arrangement.get_elements_under_area(&self.element_manager, &Polygon::new_from_flat_array_reference(&polygon), Polygon::new_from_flat_array(polygon))
            }

        //misc
            pub fn arrangement__print_tree(&self, mode:Option<u8>) {
                self.arrangement.print_tree(&self.element_manager, mode);
            }
            pub fn arrangement__print_survey(&self) {
                self.arrangement.print_survey(&self.element_manager);
            }
            pub fn arrangement__dump(&self) {
                self.arrangement._dump(&self.element_manager);
            }
    }