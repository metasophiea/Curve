#![allow(non_snake_case)]

//rust
    use std::rc::Weak;
    use std::cell::RefCell;

//wasm
    use wasm_bindgen::prelude::*;
    use web_sys::{
        WebGl2RenderingContext, 
    };

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a:&str);
        #[wasm_bindgen(js_namespace = console)]
        fn error(a:&str);
    }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }
    macro_rules! console_error {
        ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::{
        data_type,
        data_type::{
            Point,
            Offset,
            Viewbox,
            ElementType,
            Colour,
            RenderDecision,
        },
        math::{
            detect_intersect,
        },
        structure::{
            WebGl2programConglomerateManager,
            WebGl2framebufferManager,
            ImageRequester,
            FontRequester,
        },
    };
    use crate::b_element::ElementManager;
    use crate::f_stats::Stats;
    use crate::engine::Engine;
    
//self
    //group
        mod group;
        pub use group::Group;
    //rectangle
        mod rectangle;
        pub use rectangle::Rectangle;
        mod rectangleWithOutline;
        pub use rectangleWithOutline::RectangleWithOutline;
    //circle
        mod circle;
        pub use circle::Circle;
        mod circleWithOutline;
        pub use circleWithOutline::CircleWithOutline;
    //polygon
        mod polygon;
        pub use polygon::Polygon;
        mod polygonWithOutline;
        pub use polygonWithOutline::PolygonWithOutline;
    //path
        mod path;
        pub use path::Path;
    //image
        mod image;
        pub use image::Image;
    // //canvas -> the Image element is used instead
    //     // mod canvas;
    //     // pub use canvas::Canvas;
    //character
        mod character;
        pub use character::Character;
    //characterString
        mod characterString;
        pub use characterString::CharacterString;








pub trait ElementTrait {
    //casting
        fn as_group(&self) -> Option<&Group> { None }
        fn as_group_mut(&mut self) -> Option<&mut Group> { None }
        fn as_rectangle(&self) -> Option<&Rectangle> { None }
        fn as_rectangle_mut(&mut self) -> Option<&mut Rectangle> { None }
        fn as_rectangleWithOutline(&self) -> Option<&RectangleWithOutline> { None }
        fn as_rectangleWithOutline_mut(&mut self) -> Option<&mut RectangleWithOutline> { None }
        fn as_circle(&self) -> Option<&Circle> { None }
        fn as_circle_mut(&mut self) -> Option<&mut Circle> { None }
        fn as_circleWithOutline(&self) -> Option<&CircleWithOutline> { None }
        fn as_circleWithOutline_mut(&mut self) -> Option<&mut CircleWithOutline> { None }
        fn as_polygon(&self) -> Option<&Polygon> { None }
        fn as_polygon_mut(&mut self) -> Option<&mut Polygon> { None }
        fn as_polygonWithOutline(&self) -> Option<&PolygonWithOutline> { None }
        fn as_polygonWithOutline_mut(&mut self) -> Option<&mut PolygonWithOutline> { None }
        fn as_path(&self) -> Option<&Path> { None }
        fn as_path_mut(&mut self) -> Option<&mut Path> { None }
        fn as_image(&self) -> Option<&Image> { None }
        fn as_image_mut(&mut self) -> Option<&mut Image> { None }
        fn as_character(&self) -> Option<&Character> { None }
        fn as_character_mut(&mut self) -> Option<&mut Character> { None }
        fn as_character_string(&self) -> Option<&CharacterString> { None }
        fn as_character_string_mut(&mut self) -> Option<&mut CharacterString> { None }
        
    //hierarchy and identity
        fn get_element_type(&self) -> &ElementType;
        fn get_id(&self) -> usize;
        fn get_name(&self) -> &String;
        fn set_name(&mut self, new:String);
        fn set_self_reference(&mut self, new:Weak<RefCell<dyn ElementTrait>>);
        fn get_parent(&self) -> &Option<Weak<RefCell<dyn ElementTrait>>>;
        fn set_parent(&mut self, new:Weak<RefCell<dyn ElementTrait>>);
        fn get_parent_id(&self) -> Option<usize> {
            match &self.get_parent() {
                None => None,
                Some(parent) => Some(parent.upgrade().unwrap().borrow().get_id())
            }
        }
        fn get_parent_name(&self) -> Option<String> {
            match &self.get_parent() {
                None => None,
                Some(parent) => Some(parent.upgrade().unwrap().borrow().get_name().to_string())
            }
        }
        fn clear_parent(&mut self);

    //position
        //x
            fn get_x(&self) -> f32;
            fn set_x(&mut self, new:f32, viewbox:&Viewbox);
        //y
            fn get_y(&self) -> f32;
            fn set_y(&mut self, new:f32, viewbox:&Viewbox);
        //angle
            fn get_angle(&self) -> f32;
            fn set_angle(&mut self, new:f32, viewbox:&Viewbox);
        //scale
            fn get_scale(&self) -> f32;
            fn set_scale(&mut self, new:f32, viewbox:&Viewbox);
    
    //other
        fn get_ignored(&self) -> bool;
        fn set_ignored(&mut self, new:bool);

    //universal attribute
        fn set_unified_attribute_from_js_sys_object(
            &mut self, 
            unified_attribute: js_sys::Object, 
            font_requester: &RefCell<FontRequester>, 
            worker: &web_sys::Worker, 
            viewbox: &Viewbox
        );

    //addressing
        fn get_address(&self) -> String {
            format!(
                "{}/{}", 
                match &self.get_parent() {
                    Some(parent) => parent.upgrade().unwrap().borrow().get_address(),
                    None => String::new(),
                }, 
                self.get_name()
            )
        }

    //offset
        fn get_cached_offset(&self) -> &Offset;
        fn get_cached_offset_mut(&mut self) -> &mut Offset;
        fn set_cached_offset(&mut self, new:Offset);
        fn get_offset(&self) -> Offset {
            Offset::combine(
                &Offset::new(self.get_x(), self.get_y(), self.get_scale(), self.get_angle()),
                &self.get_parent_offset(),
            )
        }
        fn get_parent_offset(&self) -> Offset {
            match &self.get_parent() {
                None => Offset::new_default(),
                Some(parent) => parent.upgrade().unwrap().borrow().get_offset(),
            }
        }

    //heed camera
        fn get_cached_heed_camera(&self) -> bool;
        fn set_cached_heed_camera(&mut self, new:bool);

    //point calculation
        fn calculate_points(&mut self, _font_requester:&RefCell<FontRequester>, _worker:&web_sys::Worker, _viewbox:&Viewbox) {}

    //extremities
        fn get_extremities(&self) -> &data_type::Polygon;
        fn __set_extremities(&mut self, new:data_type::Polygon);
        fn get_length_of_points_for_extremity_calculation(&self) -> usize { 0 }
        fn get_point_for_extremity_calculation(&self, _index:usize) -> Option<(f32,f32)> { None }
        fn get_parent_clipping_polygon(&self) -> Option<data_type::Polygon> {
            match &self.get_parent() {
                None => None,
                Some(parent) => {
                    let parent = parent.upgrade().unwrap();
                    let borrowed_parent = parent.borrow();
                    let group = borrowed_parent.as_group().unwrap();
                    if group.get_clip_active() {
                        Some(group.get_extremities().clone())
                    } else {
                        None
                    }
                },
            }
        }
        fn compute_extremities(&mut self, inform_parent:bool, offset:Option<&Offset>, heed_camera:Option<bool>) {
            //determine heed_camera
                self.set_cached_heed_camera( 
                    match heed_camera {
                        Some(a) => a,
                        None => {
                            match &self.get_parent() {
                                None => false,
                                Some(group) => group.upgrade().unwrap().borrow().as_group().unwrap().get_cached_heed_camera(),
                            }
                        },
                    }
                );

            //get offset from parent, if one isn't provided
                let _default_offset;
                let offset = if offset.is_none() {
                    _default_offset = self.get_parent_offset();
                    &_default_offset
                } else {
                    offset.unwrap()
                };

            //combine offset with group's position, angle and scale to produce new offset
                let x = self.get_x();
                let y = self.get_y();
                let scale = self.get_scale();
                let angle = self.get_angle();
                self.get_cached_offset_mut().combine_update(x, y, scale, angle, offset);
                self.get_cached_offset_mut().invert_angle();

            //calculate points based on the adjusted offset
                let mut calculated_points:Vec<Point> = vec![];
                for index in 0..self.get_length_of_points_for_extremity_calculation() {
                    let (P_x, P_y) = match self.get_point_for_extremity_calculation(index) {
                        None => { 
                            console_error!("ElementTrait.compute_extremities - index {} doesn't return point data", index);
                            continue;
                        },
                        Some(a) => a,
                    };

                    let P_x = self.get_cached_offset().get_scale() * P_x;
                    let P_y = self.get_cached_offset().get_scale() * P_y;

                    calculated_points.push(
                        Point::new(
                            (P_x * self.get_cached_offset().get_angle().cos()) + (P_y * self.get_cached_offset().get_angle().sin()) + self.get_cached_offset().get_x(),
                            (P_y * self.get_cached_offset().get_angle().cos()) - (P_x * self.get_cached_offset().get_angle().sin()) + self.get_cached_offset().get_y(),
                        )
                    );
                }
                self.__set_extremities( data_type::Polygon::new_from_point_vector(calculated_points) );
                
            //if told to do so - and if there is one - inform parent that extremities have changed
                if inform_parent { 
                    match &self.get_parent() {
                        None => {},
                        Some(parent) => {
                            parent.upgrade().unwrap().borrow_mut().as_group_mut().unwrap().update_extremities(true, Some( &self.get_extremities() ), None);
                        },
                    }
                }
        }

    //render
        //visibility
            fn is_visible(&self) -> bool;
            fn previous_is_visible(&self) -> bool;
            fn set_is_visible(&mut self, new:bool);
            fn bubble_visibility(&mut self, viewbox:&Viewbox) {
                match &self.get_parent() {
                    None => {},
                    Some(parent) => {
                        let new_visibility = if self.is_visible() { //positive visibility is easy to bubble
                            true
                        } else { //loss of visibility requires the parent to look over their children for other visible children
                            parent.upgrade().unwrap().borrow().check_is_visible( 
                                parent.upgrade().unwrap().borrow().get_parent_clipping_polygon().as_ref(), //clipping polygon of parent's parent
                                viewbox
                            )
                        };

                        parent.upgrade().unwrap().borrow_mut().set_is_visible(new_visibility);
                        parent.upgrade().unwrap().borrow_mut().bubble_visibility(viewbox);
                    },
                }
            }
            fn check_is_visible(&self, parent_clipping_polygon:Option<&data_type::Polygon>, viewbox:&Viewbox) -> bool {
                //compares bounding box to the viewbox extremities (element render culling)
                //or to the parent's bounding box if clipping is active there

                //elements which don't have extremities can not be rendered
                    if self.get_extremities().get_points_length() == 0 {
                        return false;
                    }

                match parent_clipping_polygon {
                    Some(data) => detect_intersect::poly_on_poly( &data, &self.get_extremities() ),
                    None => {
                        detect_intersect::poly_on_poly(
                            if self.get_cached_heed_camera() { &viewbox.get_polygon() } else { &viewbox.get_static_polygon() },
                            &self.get_extremities()
                        )
                    },
                }.intersect
            }
            fn determine_if_visible(&mut self, parent_clipping_polygon:Option<&data_type::Polygon>, viewbox:&Viewbox, bubble_up:bool) {
                self.set_is_visible( self.check_is_visible(parent_clipping_polygon, viewbox) );
                
                //inform parent, if requested to do so
                    if bubble_up {
                        self.bubble_visibility(viewbox);
                    }
            }
        
        //render request
            fn request_render(&mut self) {
                if self.get_element_type() == &ElementType::Group {
                    self.as_group_mut().unwrap().set_render_required(true);
                }

                match self.get_parent() {
                    None => {},
                    Some(parent) => {
                        if self.is_visible() || self.previous_is_visible() {
                            parent.upgrade().unwrap().borrow_mut().as_group_mut().unwrap().set_render_required(true);
                            parent.upgrade().unwrap().borrow_mut().as_group_mut().unwrap().request_render();
                        }
                    },
                }
            }

        //actual render
            fn render(
                &mut self,
                parent_clipping_polygon: Option<&data_type::Polygon>,
                heed_camera: bool,
                viewbox: &Viewbox,
                context: &WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                web_gl2_framebuffer_manager: &mut WebGl2framebufferManager,
                image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
                force: bool,
                stats: &mut Stats,
            ) -> bool { //true/false - I need to / do not need to be rendered again
                //judge whether this element should be allowed to render
                    if !force && !self.is_visible() {
                        if stats.get_active() { stats.element_render_register_info(self.get_id(), self.get_element_type(), RenderDecision::NotVisible); }
                        return false;
                    }

                //calculate offset for this element
                    let working_offset = if heed_camera {
                        Some( 
                            Offset::combine_invert_b_angle(
                                self.get_cached_offset(),
                                viewbox.get_offset(),
                            )
                        )
                    } else {
                        None
                    };

                //activate shape render code
                    let re_render = self.activate_webGL_render(
                        working_offset.as_ref(),
                        context, 
                        web_gl2_program_conglomerate_manager,
                        image_requester,
                        resolution,
                        stats,
                    );

                //if requested; draw dot frame
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
                            stats,
                        );
                    }

                re_render
            }
            fn activate_webGL_render(
                &mut self, 
                _offset: Option<&Offset>,
                _context: &WebGl2RenderingContext, 
                _web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                _image_requester: &mut ImageRequester,
                _resolution: &(u32, u32),
                _stats: &mut Stats,
            ) -> bool { //true/false - I need to / do not need to be rendered again
                false
            }

        //dot frame
            fn get_dot_frame(&self) -> bool;
            fn set_dot_frame(&mut self, new:bool);
            fn draw_dot_frame(
                &self,
                parent_clipping_polygon: Option<&data_type::Polygon>,
                heed_camera: bool,
                viewbox: &Viewbox,
                context: &WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                web_gl2_framebuffer_manager: &mut WebGl2framebufferManager,
                image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
                stats: &mut Stats,
            ) {
                let mux:f32 = 1.0; //0.05;

                //draw shape extremity points
                    for point in self.get_extremities().get_points() {
                        ElementManager::draw_dot(
                            &point, 4.0 * mux, &Colour::new(1.0,0.0,1.0,0.5), 
                            parent_clipping_polygon, heed_camera, viewbox, context, web_gl2_program_conglomerate_manager, web_gl2_framebuffer_manager, image_requester, resolution, stats
                        );
                    }
                //draw bounding box top left and bottom right points
                    ElementManager::draw_dot(
                        &self.get_extremities().get_bounding_box().get_top_left(), 6.0 * mux, &Colour::new(0.0,1.0,1.0,0.5), 
                        parent_clipping_polygon, heed_camera,viewbox, context, web_gl2_program_conglomerate_manager, web_gl2_framebuffer_manager, image_requester, resolution, stats
                    );
                    ElementManager::draw_dot(
                        &self.get_extremities().get_bounding_box().get_bottom_right(), 6.0 * mux, &Colour::new(0.0,1.0,1.0,0.5), 
                        parent_clipping_polygon, heed_camera, viewbox, context, web_gl2_program_conglomerate_manager, web_gl2_framebuffer_manager, image_requester, resolution, stats
                    );
            }

    //info/dump
        fn _specific_info(&self) -> String { String::new() }
        fn _info(&self) -> String {
            format!(
                "{{element_type:{}, id:{}, name:\"{}\", parent_id:{}, parent_name:\"{}\", x:{}, y:{}, angle:{}, scale:{}, ignored:{}, cached_offset:{}, cached_heed_camera:{}, {}, is_visible:{}, (previous:{}), dot_frame:{}, extremities:{}}}",
                self.get_element_type(), 
                self.get_id(), 
                self.get_name(), 
                match self.get_parent_id() { Some(a) => a.to_string(), None => "-none-".to_string() },
                self.get_parent_name().unwrap_or("-none-".to_string()),

                self.get_x(), 
                self.get_y(), 
                self.get_angle(), 
                self.get_scale(), 

                self.get_ignored(),

                self.get_cached_offset(),
                self.get_cached_heed_camera(),

                self._specific_info(),

                self.is_visible(),
                self.previous_is_visible(),
                self.get_dot_frame(), 
                self.get_extremities(),
            )
        }
        fn _dump(&self) { console_log!("{}",self._info()); }
}

impl ElementManager {
    fn err(method:&str, id:usize) {
        console_warn!("element:execute_method__{} : element with id \"{}\" not found", method, id);
    }

    //hierarchy and identity
        pub fn execute_method__get_element_type(&self, id:usize) -> Option<String> {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("get_element_type",id); None },
                Some(element) => Some(element.get_element_type().to_string()),
            }
        }
        pub fn execute_method__get_name(&self, id:usize) -> Option<String> {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("get_name",id); None },
                Some(element) => Some(element.get_name().clone()),
            }
        }
        pub fn execute_method__set_name(&mut self, id:usize, new:String) {
            match self.get_element_by_id_mut(id) {
                None => ElementManager::err("set_name",id),
                Some(mut element) => element.set_name(new),
            }
        }
        pub fn execute_method__get_parent_id(&self, id:usize) -> Option<usize> {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("get_parent_id",id); None },
                Some(element) => element.get_parent_id(),
            }
        }

    //position
        pub fn execute_method__set_x(&mut self, id:usize, x:f32, viewbox:&Viewbox) {
            match self.get_element_by_id_mut(id) {
                None => ElementManager::err("set_x", id),
                Some(mut element) => element.set_x(x, viewbox),
            }
        }
        pub fn execute_method__set_y(&mut self, id:usize, y:f32, viewbox:&Viewbox) {
            match self.get_element_by_id_mut(id) {
                None => ElementManager::err("set_y", id),
                Some(mut element) => element.set_y(y, viewbox),
            }
        }
        pub fn execute_method__set_angle(&mut self, id:usize, angle:f32, viewbox:&Viewbox) {
            match self.get_element_by_id_mut(id) {
                None => ElementManager::err("set_angle", id),
                Some(mut element) => element.set_angle(angle, viewbox),
            }
        }
        pub fn execute_method__set_scale(&mut self, id:usize, scale:f32, viewbox:&Viewbox) {
            match self.get_element_by_id_mut(id) {
                None => ElementManager::err("set_scale", id),
                Some(mut element) => element.set_scale(scale, viewbox),
            }
        }

    //other
        pub fn execute_method__get_ignored(&self, id:usize) -> Option<bool> {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("get_ignored", id); None },
                Some(element) => Some(element.get_ignored().clone()),
            }
        }
        pub fn execute_method__set_ignored(&mut self, id:usize, new:bool) {
            match self.get_element_by_id_mut(id) {
                None => ElementManager::err("set_ignored", id),
                Some(mut element) => element.set_ignored(new),
            }
        }

    //universal attribute
        pub fn execute_method__set_unified_attribute_from_js_sys_object(
            &mut self, id:usize, universal_attribute:js_sys::Object, worker:&web_sys::Worker, viewbox:&Viewbox
        ) {
            match self.get_element_by_id_mut(id) {
                None => ElementManager::err("set_unified_attribute_from_js_sys_object", id),
                Some(mut element) => element.set_unified_attribute_from_js_sys_object(universal_attribute, &self.font_requester, worker, viewbox),
            }
        }

    //addressing
        pub fn execute_method__get_address(&self, id:usize) -> Option<String> {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("get_address", id); None },
                Some(element) => Some(element.get_address().clone()),
            }
        }

    //offset
        pub fn execute_method__get_offset(&self, id:usize) -> Option<Offset> {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("get_offset", id); None },
                Some(element) => Some(element.get_offset()),
            }
        }
        pub fn execute_method__get_parent_offset(&self, id:usize) -> Option<Offset> {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("get_parent_offset", id); None },
                Some(element) => Some(element.get_parent_offset()),
            }
        }

    //render
        pub fn execute_method__get_dot_frame(&self, id:usize) -> Option<bool> {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("get_dot_frame", id); None },
                Some(element) => Some(element.get_dot_frame()),
            }
        }
        pub fn execute_method__set_dot_frame(&mut self, id:usize, new:bool) {
            match self.get_element_by_id_mut(id) {
                None => ElementManager::err("set_dot_frame", id),
                Some(mut element) => element.set_dot_frame(new),
            }
        }

    //info/dump
        pub fn execute_method__info(&self, id:usize) -> String {
            match self.get_element_by_id(id) {
                None => { ElementManager::err("_info", id); String::new() },
                Some(element) => element._info(),
            }
        }
        pub fn execute_method__dump(&self, id:usize) {
            match self.get_element_by_id(id) {
                None => ElementManager::err("_dump", id),
                Some(element) => element._dump(),
            }
        }
}

#[wasm_bindgen]
impl Engine {
    //hierarchy and identity
        pub fn element__execute_method__get_element_type(&self, id:usize) -> Option<String> {
            self.element_manager.execute_method__get_element_type(id)
        }
        pub fn element__execute_method__get_name(&self, id:usize) -> Option<String> {
            self.element_manager.execute_method__get_name(id)
        }
        pub fn element__execute_method__set_name(&mut self, id:usize, new_string:String) {
            self.element_manager.execute_method__set_name(id, new_string)
        }
        pub fn element__execute_method__get_parent_id(&self, id:usize) -> Option<usize> {
            self.element_manager.execute_method__get_parent_id(id)
        }

    //position
        pub fn element__execute_method__set_x(&mut self, id:usize, x:f32) {
            self.element_manager.execute_method__set_x(id, x, self.viewport.get_viewbox());
        }
        pub fn element__execute_method__set_y(&mut self, id:usize, y:f32) {
            self.element_manager.execute_method__set_y(id, y, self.viewport.get_viewbox());
        }
        pub fn element__execute_method__set_angle(&mut self, id:usize, angle:f32) {
            self.element_manager.execute_method__set_angle(id, angle, self.viewport.get_viewbox());
        }
        pub fn element__execute_method__set_scale(&mut self, id:usize, scale:f32) {
            self.element_manager.execute_method__set_scale(id, scale, self.viewport.get_viewbox());
        }

    //other
        pub fn element__execute_method__get_ignored(&self, id:usize) -> Option<bool> {
            self.element_manager.execute_method__get_ignored(id)
        }
        pub fn element__execute_method__set_ignored(&mut self, id:usize, new_string:bool) {
            self.element_manager.execute_method__set_ignored(id, new_string);
        }

    //universal attribute
        pub fn element__execute_method__set_unified_attribute( &mut self, id:usize, universal_attribute:js_sys::Object ) {
            self.element_manager.execute_method__set_unified_attribute_from_js_sys_object( id, universal_attribute, &self.worker, self.viewport.get_viewbox());
        }

    //addressing
        pub fn element__execute_method__get_address(&self, id:usize) -> Option<String> {
            self.element_manager.execute_method__get_address(id)
        }

    //render
        pub fn element__execute_method__get_dot_frame(&self, id:usize) -> Option<bool> {
            self.element_manager.execute_method__get_dot_frame(id)
        }
        pub fn element__execute_method__set_dot_frame(&mut self, id:usize, new_bool:bool) {
            self.element_manager.execute_method__set_dot_frame(id, new_bool);
        }

    //info/dump
        pub fn element__execute_method__info(&self, id:usize) -> String {
            self.element_manager.execute_method__info(id)
        }
        pub fn element__execute_method__dump(&self, id:usize) {
            self.element_manager.execute_method__dump(id);
        }
}