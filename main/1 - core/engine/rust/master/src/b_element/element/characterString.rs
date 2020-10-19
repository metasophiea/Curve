//rust
    use std::rc::{Rc, Weak};
    use std::cell::RefCell;

//wasm
    use wasm_bindgen::prelude::*;
    use web_sys::WebGl2RenderingContext;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core
    use crate::interface;
    use crate::a_library::{
        data_type::{
            Colour,
            Offset,
            Polygon,
            Viewbox,
            ElementType,
            PrintingModePositionHorizontal,
            PrintingModePositionVertical,
            PrintingModeWidthCalculation,
        },
        structure::{
            WebGl2programConglomerateManager,
            WebGl2framebufferManager,
            ImageRequester,
            FontRequester,
        },
        wasm::from_js_sys::{
            get_js_sys_object_from_js_sys_object,
            get_value_from_object__f32,
            get_value_from_object__string,
            get_value_from_object__colour,
        },
    };
    use super::super::element::ElementTrait;

    use super::Group;
    use super::Character;








pub struct CharacterString {
    //hierarchy and identity
        element_type: ElementType, 
        id: usize,
        name: String, 
        self_reference: Option<Weak<RefCell<dyn ElementTrait>>>,
        parent: Option<Weak<RefCell<dyn ElementTrait>>>,

    //innerGroup
        inner_group: Group,
        children: Vec<Rc<RefCell<dyn ElementTrait>>>,

    //attributes
        //pertinent to extremity calculation
            width: f32,
            height: f32,
            font_name: String,
            string: String,
            spacing: f32,
            inter_character_spacing: f32,
            printing_mode_horizontal: PrintingModePositionHorizontal,
            printing_mode_vertical: PrintingModePositionVertical,
            printing_mode_width_calculation: PrintingModeWidthCalculation,
        //other
            colour: Colour,

    //switches
        dot_frame: bool,
}
impl CharacterString {
    pub fn new(id:usize, name:String) -> CharacterString {
        CharacterString {
            element_type: ElementType::CharacterString,
            id: id,
            name: name,
            self_reference: None,
            parent: None,

            inner_group: Group::new(id, String::from("inner_group")),
            children: vec![],

            width: 10.0,
            height: 10.0,
            font_name: String::from("defaultThin"),
            string: String::new(),
            spacing: 0.5,
            inter_character_spacing: 0.0,
            printing_mode_horizontal: PrintingModePositionHorizontal::Left,
            printing_mode_vertical: PrintingModePositionVertical::Bottom,
            printing_mode_width_calculation: PrintingModeWidthCalculation::Absolute,

            colour: Colour::new(1.0,0.0,0.0,1.0),

            dot_frame: false,
        }
    }

    //unified attribute
        pub fn set_unified_attribute(
            &mut self,
            worker: &web_sys::Worker,
            x: Option<f32>,
            y: Option<f32>,
            angle: Option<f32>,
            scale: Option<f32>,
            width: Option<f32>,
            height: Option<f32>,
            font_name: Option<String>,
            string: Option<String>,
            spacing: Option<f32>,
            inter_character_spacing: Option<f32>,
            printing_mode_horizontal: Option<PrintingModePositionHorizontal>,
            printing_mode_vertical: Option<PrintingModePositionVertical>,
            printing_mode_width_calculation: Option<PrintingModeWidthCalculation>,
            colour: Option<Colour>,
            font_requester: &RefCell<FontRequester>,
            viewbox: &Viewbox,
        ) {
            let mut calculate_points = false;

            if let Some(x) = x { self.inner_group.set_x(x, viewbox); }
            if let Some(y) = y { self.inner_group.set_y(y, viewbox); }
            if let Some(angle) = angle { self.inner_group.set_angle(angle, viewbox); }
            if let Some(scale) = scale { self.inner_group.set_scale(scale, viewbox); }
            if let Some(width) = width { self.width = width; calculate_points = true; }
            if let Some(height) = height { self.height = height; calculate_points = true; }
            if let Some(font_name) = font_name { self.font_name = font_name; calculate_points = true; }
            if let Some(string) = string { self.string = string; calculate_points = true; }
            if let Some(spacing) = spacing { self.spacing = spacing; calculate_points = true; }
            if let Some(inter_character_spacing) = inter_character_spacing { self.inter_character_spacing = inter_character_spacing; calculate_points = true; }
            if let Some(printing_mode_horizontal) = printing_mode_horizontal { self.printing_mode_horizontal = printing_mode_horizontal; calculate_points = true; }
            if let Some(printing_mode_vertical) = printing_mode_vertical { self.printing_mode_vertical = printing_mode_vertical; calculate_points = true; }
            if let Some(printing_mode_width_calculation) = printing_mode_width_calculation { self.printing_mode_width_calculation = printing_mode_width_calculation; calculate_points = true; }
            if let Some(colour) = colour { 
                self.colour = colour;
                for child in &self.children {
                    child.borrow_mut().as_character_mut().unwrap().set_colour( self.colour, viewbox );
                }
            }

            if calculate_points {
                self.calculate_points(font_requester, worker, viewbox);
            } else {
                self.compute_extremities(true, Some(&self.get_parent_offset()), None);
            }
            self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
            self.request_render();
        }

    //string
        fn generate_string_characters(&mut self, font_requester:&RefCell<FontRequester>, worker:&web_sys::Worker, viewbox:&Viewbox) {
            self.inner_group.clear(viewbox);
            self.children.clear();

            let mut character_width = self.width;
            let mut cumulative_width = 0.0;
            let mut vertical_offset = 0.0;
            let mut highest_point = 0.0;

            //printing_mode
                //printing_mode_width_calculation
                    if self.printing_mode_width_calculation == PrintingModeWidthCalculation::Filling {
                        let mut internal_width = 0.0;
                        for character in self.string.chars() {
                            internal_width += if font_requester.borrow_mut().request_font(&self.font_name, self.id).is_character_valid(character) {
                                font_requester.borrow_mut().request_font(&self.font_name, self.id).get_misc_data(character).get_right()
                            } else {
                                self.spacing
                            };
                        }
                        character_width = character_width/internal_width;
                    }
                //printing_mode_vertical
                    if self.printing_mode_vertical == PrintingModePositionVertical::Top {
                        for character in self.string.chars() {
                            let tmp = if font_requester.borrow_mut().request_font(&self.font_name, self.id).is_character_valid(character) {
                                font_requester.borrow_mut().request_font(&self.font_name, self.id).get_misc_data(character).get_top()
                            } else {
                                0.0
                            };
                            highest_point = if highest_point > tmp { tmp } else { highest_point };
                        }
                        vertical_offset = self.height * -highest_point;
                    }
                    if self.printing_mode_vertical == PrintingModePositionVertical::VeryMiddle {
                        for character in self.string.chars() {
                            let tmp = if font_requester.borrow_mut().request_font(&self.font_name, self.id).is_character_valid(character) {
                                font_requester.borrow_mut().request_font(&self.font_name, self.id).get_misc_data(character).get_top()
                            } else {
                                0.0
                            };
                            highest_point = if highest_point > tmp { tmp } else { highest_point };
                        }
                        vertical_offset = -(self.height/2.0)*highest_point;
                    }
                    if self.printing_mode_vertical == PrintingModePositionVertical::Middle {
                        highest_point = font_requester.borrow_mut().request_font(&self.font_name, self.id).get_misc_data('o').get_top();
                        vertical_offset = -(self.height/2.0)*highest_point;
                    }

            //create character and add it to the group
                for character in self.string.chars() {
                    if character == ' ' { 
                        cumulative_width += character_width * self.spacing;
                        continue;
                    }

                    let mut tmp = Character::new(self.id, character.to_string());
                    tmp.set_unified_attribute(
                        worker,
                        Some(cumulative_width),
                        Some(vertical_offset),
                        None,
                        None,
                        Some(character_width),
                        Some(self.height),
                        None,
                        Some(self.font_name.clone()),
                        Some(character),
                        None,
                        None,
                        Some(self.colour),
                        font_requester,
                        viewbox,
                    );
                    cumulative_width += (self.inter_character_spacing + tmp.right(font_requester)) * character_width;

                    let strong_ref = Rc::new( RefCell::new( tmp ) ) as Rc<RefCell<dyn ElementTrait>>;
                    let weak_ref = Rc::downgrade( &strong_ref );
                    self.children.push(strong_ref);

                    self.inner_group.__direct_append(weak_ref, viewbox);
                }

            //printing_mode_horizontal
                if self.printing_mode_horizontal == PrintingModePositionHorizontal::Middle { 
                    for child in &self.children {
                        let x = child.borrow().get_x();
                        child.borrow_mut().set_x( x - cumulative_width/2.0, viewbox );
                    }
                } else if self.printing_mode_horizontal == PrintingModePositionHorizontal::Right {
                    for child in &self.children {
                        let x = child.borrow().get_x();
                        child.borrow_mut().set_x( x - cumulative_width, viewbox );
                    }
                }

            self.compute_extremities(true, Some(&self.get_parent_offset()), None);
            self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
            self.send_element_update_resulting_width(worker, cumulative_width);
            self.send_on_font_update_callback(worker);
        }
        pub fn send_element_update_resulting_width(&self, worker:&web_sys::Worker, cumulative_width:f32) {
            let data = js_sys::Object::new();
            js_sys::Reflect::set(
                &data, 
                &JsValue::from_str("resultingWidth"), &JsValue::from_f64(cumulative_width as f64)
            ).unwrap();
            interface::send_message(
                worker, "updateElement",
                &js_sys::Array::of2(
                    &JsValue::from_f64( self.id as f64 ), 
                    &data
                )
            );
        }
        pub fn send_on_font_update_callback(&self, worker:&web_sys::Worker) {
            let data = js_sys::Object::new();
            js_sys::Reflect::set(
                &data, 
                &JsValue::from_str("onFontUpdateCallback"), &JsValue::from_str(&self.font_name)
            ).unwrap();
            interface::send_message(
                worker, "runElementCallback",
                &js_sys::Array::of2(
                    &JsValue::from_f64( self.id as f64 ), 
                    &data
                )
            );
        }
}
impl ElementTrait for CharacterString {
    //trait requirements
        //hierarchy and identity
            fn get_element_type(&self) -> ElementType { self.element_type }
            fn get_id(&self) -> usize { self.id }
            fn get_name(&self) -> &String{ &self.name }
            fn set_name(&mut self, new:String) { self.name = new; }
            fn set_self_reference(&mut self, new:Weak<RefCell<dyn ElementTrait>>) { self.self_reference = Some(new); }
            fn get_parent(&self) -> &Option<Weak<RefCell<dyn ElementTrait>>> { &self.parent }
            fn set_parent(&mut self, new:Weak<RefCell<dyn ElementTrait>>) { self.parent = Some(new); }
            fn clear_parent(&mut self) { self.parent = None; }

        //position
            //x
                fn get_x(&self) -> f32 { self.inner_group.get_x() }
                fn set_x(&mut self, new:f32, viewbox:&Viewbox){ self.inner_group.set_x(new, viewbox); }
            //y
                fn get_y(&self) -> f32 { self.inner_group.get_y() }
                fn set_y(&mut self, new:f32, viewbox:&Viewbox){ self.inner_group.set_y(new, viewbox); }
            //angle
                fn get_angle(&self) -> f32 { self.inner_group.get_angle() }
                fn set_angle(&mut self, new:f32, viewbox:&Viewbox) { self.inner_group.set_angle(new, viewbox); }
            //scale
                fn get_scale(&self) -> f32 { self.inner_group.get_scale() }
                fn set_scale(&mut self, new:f32, viewbox:&Viewbox) { self.inner_group.set_scale(new, viewbox); }

        //other
            fn get_ignored(&self) -> bool { self.inner_group.get_ignored() }
            fn set_ignored(&mut self, new:bool) { self.inner_group.set_ignored(new); }

        //offset
            fn get_cached_offset(&self) -> &Offset { self.inner_group.get_cached_offset() }
            fn get_cached_offset_mut(&mut self) -> &mut Offset { self.inner_group.get_cached_offset_mut() }
            fn set_cached_offset(&mut self, new:Offset) { self.inner_group.set_cached_offset(new); }

        //heed camera
            fn get_cached_heed_camera(&self) -> bool { self.inner_group.get_cached_heed_camera() }
            fn set_cached_heed_camera(&mut self, new:bool) { self.inner_group.set_cached_heed_camera(new); }

        //extremities
            fn get_extremities(&self) -> &Polygon { self.inner_group.get_extremities() }
            fn __set_extremities(&mut self, new:Polygon) { self.inner_group.__set_extremities(new); }

        //render
            //visibility
                fn is_visible(&self) -> bool { self.inner_group.is_visible() }
                fn set_is_visible(&mut self, new:bool) { self.inner_group.set_is_visible(new); }
                fn previous_is_visible(&self) -> bool { self.inner_group.get_dot_frame() }
            //dot frame
                fn get_dot_frame(&self) -> bool { self.dot_frame }
                fn set_dot_frame(&mut self, new:bool) { self.dot_frame = new; }

    //element specific
        //casting
            fn as_character_string(&self) -> Option<&CharacterString> { Some(self) }
            fn as_character_string_mut(&mut self) -> Option<&mut CharacterString> { Some(self) }

        //universal attribute
            fn set_unified_attribute_from_js_sys_object(
                &mut self, 
                unified_attribute: js_sys::Object, 
                font_requester: &RefCell<FontRequester>, 
                worker: &web_sys::Worker,
                viewbox: &Viewbox,
            ) {
                let printing_mode_object = match get_js_sys_object_from_js_sys_object("printingMode", &unified_attribute, true) {
                    Some(a) => a,
                    None => js_sys::Object::new(),
                };

                self.set_unified_attribute(
                    worker,
                    get_value_from_object__f32("x", &unified_attribute, true),
                    get_value_from_object__f32("y", &unified_attribute, true),
                    get_value_from_object__f32("angle", &unified_attribute, true),
                    get_value_from_object__f32("scale", &unified_attribute, true),
                    get_value_from_object__f32("width", &unified_attribute, true),
                    get_value_from_object__f32("height", &unified_attribute, true),
                    get_value_from_object__string("font", &unified_attribute, true),
                    get_value_from_object__string("string", &unified_attribute, true),
                    get_value_from_object__f32("spacing", &unified_attribute, true),
                    get_value_from_object__f32("interCharacterSpacing", &unified_attribute, true),
                    match get_value_from_object__string("horizontal", &printing_mode_object, true){
                        None => None, 
                        Some(a) => PrintingModePositionHorizontal::from_str(&a),
                    },
                    match get_value_from_object__string("vertical", &printing_mode_object, true){
                        None => None, 
                        Some(a) => PrintingModePositionVertical::from_str(&a),
                    },
                    match get_value_from_object__string("widthCalculation", &printing_mode_object, true){
                        None => None, 
                        Some(a) => PrintingModeWidthCalculation::from_str(&a),
                    },
                    get_value_from_object__colour("colour", &unified_attribute, true),
                    font_requester,
                    viewbox,
                );
            }
        
        //point calculation
            fn calculate_points(&mut self, font_requester:&RefCell<FontRequester>, worker:&web_sys::Worker, viewbox:&Viewbox) {
                self.generate_string_characters(font_requester, worker, viewbox);
                self.request_render();
            }

        //extremities
            fn compute_extremities(&mut self, inform_parent:bool, offset:Option<&Offset>, heed_camera:Option<bool>) {
                self.inner_group.compute_extremities(false, offset, heed_camera);

                //if told to do so - and if there is one - inform parent that extremities have changed
                    if inform_parent { 
                        match &self.parent {
                            None => {},
                            Some(parent) => {
                                parent.upgrade().unwrap().borrow_mut().as_group_mut().unwrap().update_extremities(true, Some( self.get_extremities()), None);
                            },
                        }
                    }
            }

        //render
            fn determine_if_visible(&mut self, parent_clipping_polygon:Option<&Polygon>, viewbox:&Viewbox, bubble_up:bool) {
                self.inner_group.determine_if_visible(parent_clipping_polygon, viewbox, bubble_up);

                //inform parent, if requested to do so
                    if bubble_up {
                        self.bubble_visibility(viewbox);
                    }
            }
            fn render(
                &mut self,
                parent_clipping_polygon: Option<&Polygon>,
                heed_camera: bool,
                viewbox: &Viewbox,
                context: &WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                web_gl2_framebuffer_manager: &mut WebGl2framebufferManager,
                image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
                force: bool,
            ) -> bool {
                let re_render = self.inner_group.render(
                    parent_clipping_polygon,
                    heed_camera,
                    viewbox,
                    context,
                    web_gl2_program_conglomerate_manager,
                    web_gl2_framebuffer_manager,
                    image_requester,
                    resolution,
                    force,
                );

                if self.get_dot_frame() { 
                    self.draw_dot_frame(
                        parent_clipping_polygon,
                        heed_camera,
                        viewbox,
                        context,
                        web_gl2_program_conglomerate_manager,
                        web_gl2_framebuffer_manager,
                        image_requester,
                        resolution,
                    );
                }

                re_render
            }
            fn draw_dot_frame(
                &self,
                parent_clipping_polygon: Option<&Polygon>,
                heed_camera: bool,
                viewbox: &Viewbox,
                context: &WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                web_gl2_framebuffer_manager: &mut WebGl2framebufferManager,
                image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
            ) {
                self.inner_group.draw_dot_frame(
                    parent_clipping_polygon,
                    heed_camera,
                    viewbox,
                    context,
                    web_gl2_program_conglomerate_manager,
                    web_gl2_framebuffer_manager,
                    image_requester,
                    resolution,
                );
            }

        //info/dump
            fn _specific_info(&self) -> String {
                format!(
                    "width:{}, height:{}, font_name:{}, string:\"{}\", spacing:{}, inter_character_spacing:{}, printing_mode_horizontal:{}, printing_mode_vertical:{}, printing_mode_width_calculation:{}, colour:{}, inner_group:{}}}",
                    self.width,
                    self.height,
                    self.font_name,
                    self.string,
                    self.spacing,
                    self.inter_character_spacing,
                    self.printing_mode_horizontal,
                    self.printing_mode_vertical,
                    self.printing_mode_width_calculation,
                    self.colour,

                    self.inner_group._info(),
                )
            }
            fn _dump(&self) {
                console_log!("{}", self._info());
                self.inner_group._dump();
                for child in &self.children {
                    child.borrow()._dump();
                }
            }
}