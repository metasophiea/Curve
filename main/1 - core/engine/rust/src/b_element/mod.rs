#![allow(non_snake_case)]

//rust
    use std::rc::{Rc, Weak};
    use std::cell::{RefCell, Ref, RefMut};

//wasm
    use wasm_bindgen::prelude::*;
    use web_sys::WebGl2RenderingContext;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn error(a: &str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }
    macro_rules! console_error {
        ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
    }

//core

//self
    use crate::engine::Engine;
    use crate::a_library::data_type::{
        ElementType,
        Point,
        Colour,
        Polygon,
        Offset,
        Viewbox,
    };
    use crate::a_library::structure::{
        WebGl2programConglomerateManager,
        ImageRequester,
        FontRequester,
    };

    pub mod element;
    pub use element::ElementTrait;

    pub mod test;




pub struct ElementManager {
    created_elements: Vec<Option<Rc<RefCell<dyn ElementTrait>>>>,
    font_requester: RefCell<FontRequester>,
}
impl ElementManager {
    pub fn new() -> ElementManager {
        ElementManager {
            created_elements: vec![],
            font_requester: RefCell::new( FontRequester::new() ),
        }
    }
    
    fn clone_weak_reference(element:&Weak<RefCell<dyn ElementTrait>>) -> Weak<RefCell<dyn ElementTrait>> {
        Rc::downgrade( &element.upgrade().unwrap() )
    }
}

//basic management
impl ElementManager {
    pub fn create(&mut self, element_type:ElementType, name:String) -> usize {
        //find a space for the new element in the array
            let index = self.created_elements.len();

        //generate element
            let tmp = match element_type {
                ElementType::Group => Rc::new( RefCell::new( element::Group::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::Rectangle => Rc::new( RefCell::new( element::Rectangle::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::RectangleWithOutline => Rc::new( RefCell::new( element::RectangleWithOutline::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::Circle => Rc::new( RefCell::new( element::Circle::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::CircleWithOutline => Rc::new( RefCell::new( element::CircleWithOutline::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::Polygon => Rc::new( RefCell::new( element::Polygon::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::PolygonWithOutline => Rc::new( RefCell::new( element::PolygonWithOutline::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::Path => Rc::new( RefCell::new( element::Path::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::Image => Rc::new( RefCell::new( element::Image::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::Character => Rc::new( RefCell::new( element::Character::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
                ElementType::CharacterString => Rc::new( RefCell::new( element::CharacterString::new(index, name) ) ) as Rc<RefCell<dyn ElementTrait>>,
            };
            
        //issue self_reference
            let self_reference = Rc::downgrade( &tmp );
            tmp.borrow_mut().set_self_reference( self_reference );

        //place element in array
            if index != self.created_elements.len() {
                self.created_elements[index] = Some(tmp);
            } else {
                self.created_elements.push( Some(tmp) );
            }
            
        //return the element's id
            index
    }
    pub fn delete(&mut self, id:usize) -> Result<(),String> {
        if id >= self.created_elements.len() {
            return Err("Out of bounds".to_string());
        }
        if self.created_elements[id].is_none() {
            return Err("Deleting nothing".to_string());
        }

        let parent_id = self.get_element_by_id(id).unwrap().get_parent_id();
        match parent_id {
            None => {},
            Some(parent_id) => self.get_element_by_id_mut(parent_id).unwrap().as_group_mut().unwrap().remove(self, id),
        }

        self.created_elements[id] = None;
        Ok(())
    }
    pub fn delete_all(&mut self) {
        self.created_elements.clear();
    }
}

//get element
impl ElementManager {
    pub fn get_element_type_by_id(&self, id:usize) -> Option<ElementType> {
        if id >= self.created_elements.len() {
            return None;
        }

        match self.get_element_by_id(id) {
            Some(ele) => Some(ele.get_element_type()),
            None => None
        }
    }

    fn get_element_weak(&self, id:usize) -> Option<Weak<RefCell<dyn ElementTrait>>> {
        if id >= self.created_elements.len() {
            return None;
        }

        Some( Rc::downgrade( &self.created_elements[id].as_ref().unwrap() ) )
    }
    pub fn get_element_by_id(&self, id:usize) -> Option<Ref<dyn element::ElementTrait>> {
        if id >= self.created_elements.len() {
            return None;
        }

        match self.created_elements[id].as_ref() {
            Some(a) => Some(a.borrow()),
            None => None,
        }
    }
    pub fn get_element_by_id_mut(&self, id:usize) -> Option<RefMut<dyn element::ElementTrait>> {
        if id >= self.created_elements.len() {
            return None;
        }

        match self.created_elements[id].as_ref() {
            Some(a) => Some(a.borrow_mut()),
            None => None,
        }
    }
}

//misc
impl ElementManager {
    pub fn create_set_append(
        &mut self, 
        type_string:String, name:String, 
        universal_attribute:js_sys::Object,
        group_id:usize,
        worker:&web_sys::Worker,
    ) -> Option<usize> {
        //create
            let e_type = match ElementType::from_str(&type_string) {
                Some(e) => e,
                None => {
                    console_error!("engine:meta__create_set_append : Unknown element type: \"{}\"", type_string); 
                    return None;
                },
            };
            let id = self.create(e_type, name);

        //set
            self.get_element_by_id_mut(id).unwrap().set_unified_attribute_from_js_sys_object(universal_attribute, &self.font_requester, worker);

        //append
            self.execute_method__Group__append(group_id, id);

        //return the id
            Some(id)
    }
    pub fn draw_dot(
        xy:&Point, size:f32, colour:&Colour,
        parent_clipping_polygon: Option<&Polygon>,
        heed_camera: Option<bool>,
        offset: &Offset,
        viewbox: &Viewbox,
        context: &WebGl2RenderingContext, 
        web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
        image_requester: &mut ImageRequester,
        resolution: &(u32, u32),
    ) {
        let mut rect = element::Rectangle::new(0, "dot".to_string());
        rect.set_dot_frame(false);
        rect.set_unified_attribute( Some(xy.get_x()), Some(xy.get_y()), None, None, Some(size), Some(size), Some(Point::new(0.5,0.5)), Some(*colour) );

        if heed_camera == Some(false) {
            rect.render( None, parent_clipping_polygon, heed_camera, &Offset::new_default(), viewbox, context, web_gl2_program_conglomerate_manager, image_requester, resolution, true );
        } else {
            rect.render( None, parent_clipping_polygon, heed_camera, offset, viewbox, context, web_gl2_program_conglomerate_manager, image_requester, resolution, true );
        }
    }
    pub fn alert_font_loaded(
        &mut self, 
        font_name: &str, 
        load_was_success: bool,
        worker: &web_sys::Worker
    ) {
        let ids = match self.font_requester.borrow_mut().alert_font_loaded(font_name, load_was_success) {
            None => return,
            Some(a) => a.clone(),
        };

        for id in ids.iter() {
            match self.get_element_by_id_mut(*id) {
                Some(mut element) => element.calculate_points(&self.font_requester, worker),
                None => console_warn!("ElementManager.alert_font_loaded - the id {} doesn't exist anymore, ", id),
            }
        }
    }
    pub fn _dump(&self) {
        console_log!("┌─Engine Element Dump─");
        self.font_requester.borrow()._dump(Some("│ "));
        console_log!("│ created_elements - item count: {}", self.created_elements.len());
        for (index,item) in self.created_elements.iter().enumerate() {
            console_log!(
                "│ {} | {}",
                index,
                match item.as_ref() {
                    Some(a) => a.borrow()._info(),
                    None => "-none-".into(),
                }
            );
        }
        console_log!("└─────────────────────");
    }
}








//engine // basic management
    #[wasm_bindgen]
    impl Engine {
        pub fn element__create(&mut self, type_string:String, name:String) -> Option<usize> {
            let element_type = match type_string.as_str() {
                "Group" => ElementType::Group,
                "Rectangle" => ElementType::Rectangle,
                "RectangleWithOutline" => ElementType::RectangleWithOutline,
                "Circle" => ElementType::Circle,
                "CircleWithOutline" => ElementType::CircleWithOutline,
                "Polygon" => ElementType::Polygon,
                "PolygonWithOutline" => ElementType::PolygonWithOutline,
                "Path" => ElementType::Path,
                "Image" => ElementType::Image,
                "Canvas" => ElementType::Image,
                "Character" => ElementType::Character,
                "CharacterString" => ElementType::CharacterString,
                _ => {console_error!("Engine.element__create : Unknown element type: \"{}\"", type_string); return None},
            };

            Some(self.element_manager.create(element_type, name))
        }
        pub fn element__delete(&mut self, id:usize) -> bool {
            match self.element_manager.delete(id) {
                Ok(_) => true,
                Err(error_msg) => {console_error!("{}",error_msg); false},
            }
        }
        pub fn element__delete_all(&mut self) {
            self.element_manager.delete_all();
        }
    }

//engine // get element
    #[wasm_bindgen]
    impl Engine {
        pub fn element__get_type_by_id(&self, id:usize) -> Option<String> {
            match self.element_manager.get_element_type_by_id(id) {
                None => None,
                Some(element_type) => Some(element_type.to_string()),
            }
        }
        //get_element_by_id // not to be made available as this would return a Rust structure
        //get_element_by_id_mut // not to be made available (same reason)
    }

//engine // misc
    #[wasm_bindgen]
    impl Engine {
        pub fn element__create_set_append(
            &mut self, 
            type_string:String, name:String, 
            universal_attribute:js_sys::Object,
            group_id:usize,
        ) -> Option<usize> {
            self.element_manager.create_set_append( type_string, name, universal_attribute, group_id, &self.worker )
        }
        pub fn element__alert_font_loaded(
            &mut self, 
            font_name: String, 
            load_was_success: bool
        ) {
            self.element_manager.alert_font_loaded( &font_name, load_was_success, &self.worker );
        }
        pub fn element__dump(&self) {
            self.element_manager._dump();
        }
    }