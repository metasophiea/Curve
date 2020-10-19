#![allow(non_snake_case)]

//rust
    use std::collections::HashMap;

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn error(a: &str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }
    macro_rules! console_error {
        ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
    }

//core

//self
    use crate::engine::Engine;
    use crate::interface;
    use crate::a_library::data_type::{
        CallbackActivationMode,
        CallbackType,
        KeyboardEvent,
        WheelEvent,
        MouseEvent,
        Point,
    };
    use crate::a_library::math::array_math::{
        array_intersect,
        array_difference,
    };
    use crate::a_library::wasm::to_js_sys::{
        vector_to_array__usize,
        vector_to_array__string,
    };
    use crate::b_element::ElementManager;
    use crate::c_arrangement::Arrangement;
    use crate::e_viewport::Viewport;








static CALLBACK_TYPES: [CallbackType; 15] = [
    CallbackType::onmouseenter,
    CallbackType::onmouseleave,
    CallbackType::onmousemove,
    CallbackType::onmouseenterelement,
    CallbackType::onmouseleaveelement,
    CallbackType::onmousedown, 
    CallbackType::onmouseup,
    CallbackType::onclick,
    CallbackType::ondblclick,

    CallbackType::onwheel,

    CallbackType::onkeydown, 
    CallbackType::onkeyup,

    CallbackType::onadd, 
    CallbackType::onremove,
    CallbackType::onshift,
];
static ACTIVATION_MODE_DEFAULT: CallbackActivationMode = CallbackActivationMode::FirstMatch;

pub struct Callback {
    activation_mode: CallbackActivationMode,
    registry: HashMap<CallbackType,Vec<usize>>,
    mouse_position: Point,
    element_mouseover_list: Vec<usize>,
    currently_entered_element: Option<usize>,
    element_mouse_click_list: Vec<usize>,
    recently_clicked_double_clickable_element_list: Vec<usize>,
    stop_mouse_scroll_active_and_message_sent: bool,
}
impl Callback {
    pub fn list_callback_types() -> Vec<CallbackType> {
        CALLBACK_TYPES.to_vec()
    }
    pub fn list_activation_modes() -> Vec<CallbackActivationMode> {
        vec![
            CallbackActivationMode::TopMostOnly,
            CallbackActivationMode::FirstMatch,
            CallbackActivationMode::AllMatches,
        ]
    }
}
impl Callback {
    pub fn new() -> Callback {
        let mut registry:HashMap<CallbackType,Vec<usize>> = HashMap::new();
        for t in &CALLBACK_TYPES {
            registry.insert(*t, vec![]);
        }

        Callback {
            activation_mode: ACTIVATION_MODE_DEFAULT,
            registry: registry,
            mouse_position: Point::new(0.0,0.0),
            element_mouseover_list: vec![],
            currently_entered_element: None,
            element_mouse_click_list: vec![],
            recently_clicked_double_clickable_element_list: vec![],
            stop_mouse_scroll_active_and_message_sent: false,
        }
    }

    pub fn attach_callback(&mut self, element_id:usize, callback_type:CallbackType) {
        self.registry.get_mut(&callback_type).unwrap().push(element_id);
    }
    pub fn remove_callback(&mut self, element_id:usize, callback_type:CallbackType) {
        let index = match self.registry.get_mut(&callback_type).unwrap().iter().position(|&r| r == element_id) {
            Some(a) => a,
            None => {
                console_error!("Callback.remove_callback - attempting to remove callback \"{}\" for id \"{}\", where there is no callback for this id", callback_type, element_id);
                return;
            },
        };
        self.registry.get_mut(&callback_type).unwrap().remove(index);
    }
    pub fn callback_activation_mode(&mut self, worker:&web_sys::Worker, mode:CallbackActivationMode) {
        self.activation_mode = mode;

        match self.currently_entered_element {
            None => {},
            Some(currently_entered_element) => {
                self.coupling_out(
                    worker, CallbackType::onmouseleaveelement,
                    Point::new(0.0,0.0), None, None, None, 
                    &vec![currently_entered_element], &vec![currently_entered_element],
                );
                self.currently_entered_element = None;
            },
        }
    }
}
impl Callback {
    fn coupling_out(
        &self,
        worker:&web_sys::Worker,
        callback_name:CallbackType,
        point:Point,
        keyboard_event:Option<&KeyboardEvent>,
        wheel_event:Option<&WheelEvent>,
        mouse_event:Option<&MouseEvent>,
        all_element_ids:&Vec<usize>, 
        relevant_element_ids:&Vec<usize>,
    ) {
        let event_object = match callback_name {
            CallbackType::onkeydown | 
            CallbackType::onkeyup => {
                keyboard_event.unwrap().to_js_sys_object()
            },
            CallbackType::onwheel => {
                wheel_event.unwrap().to_js_sys_object()
            },
            CallbackType::onmouseenter |
            CallbackType::onmouseleave |
            CallbackType::onmousemove |
            CallbackType::onmouseenterelement |
            CallbackType::onmouseleaveelement |
            CallbackType::onmousedown |
            CallbackType::onmouseup |
            CallbackType::onclick |
            CallbackType::ondblclick => {  
                mouse_event.unwrap().to_js_sys_object()
            },
            _ => { 
                return
            },
        };

        interface::send_message(
            worker, &format!("callback__{}",callback_name),
            &js_sys::Array::of4(
                &Point::to_js_sys_object(&point),
                &event_object,
                &vector_to_array__usize(&all_element_ids),
                &vector_to_array__usize(&relevant_element_ids),
            ) 
        );
    }
    fn gather_details(point:Point, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport) -> (Point, Vec<usize>) {
        (
            viewport.window_point_2_workspace_point( &point ), 
            viewport.get_elements_under_point(element_manager, arrangement, point)
        )
    }
    fn activate_element_callback(
        &mut self,
        worker:&web_sys::Worker,
        callback_name:CallbackType,
        point:Point,
        keyboard_event:Option<&KeyboardEvent>,
        wheel_event:Option<&WheelEvent>,
        mouse_event:Option<&MouseEvent>,
        all_element_ids:&Vec<usize>, 
        relevant_element_ids:&Vec<usize>,
    ) {
        match self.activation_mode {
            CallbackActivationMode::TopMostOnly => {
                if callback_name == CallbackType::onmouseenterelement && all_element_ids.len() > 0 && relevant_element_ids.len() > 0 && all_element_ids[0] == relevant_element_ids[0] {
                    self.coupling_out(
                        worker, CallbackType::onmouseleaveelement,
                        point, keyboard_event, wheel_event, mouse_event, 
                        all_element_ids, &match self.currently_entered_element {Some(a) => vec![a], None => vec![] },
                    );
                    self.currently_entered_element = if relevant_element_ids.len() == 0 { None } else { Some(relevant_element_ids[0]) };
                    self.coupling_out(
                        worker, callback_name,
                        point, keyboard_event, wheel_event, mouse_event, 
                        all_element_ids, &if relevant_element_ids.len() == 0 { vec![] } else { vec![relevant_element_ids[0]] }
                    );
                } else if callback_name == CallbackType::onmouseenterelement {
                    //ignored
                } else if callback_name == CallbackType::onmouseleaveelement && all_element_ids.len() > 0 && relevant_element_ids.len() > 0 && all_element_ids[0] != relevant_element_ids[0] {
                    if self.currently_entered_element.is_none() || all_element_ids.len() == 0 || self.currently_entered_element.unwrap() != all_element_ids[0] {
                        self.coupling_out(
                            worker, callback_name,
                            point, keyboard_event, wheel_event, mouse_event, 
                            all_element_ids, &match self.currently_entered_element {Some(a) => vec![a], None => vec![] },
                        );
                        self.currently_entered_element = Some(all_element_ids[0]);
                        self.coupling_out(
                            worker, CallbackType::onmouseenterelement,
                            point, keyboard_event, wheel_event, mouse_event, 
                            all_element_ids, &if all_element_ids.len() == 0 { vec![] } else { vec![all_element_ids[0]] }
                        );
                    }
                } else if callback_name == CallbackType::onmouseleaveelement {
                    self.coupling_out(
                        worker, callback_name,
                        point, keyboard_event, wheel_event, mouse_event, 
                        all_element_ids, &match self.currently_entered_element {Some(a) => vec![a], None => vec![] },
                    );
                    self.currently_entered_element = None;
                } else if all_element_ids.len() > 0 && relevant_element_ids.len() > 0 && all_element_ids[0] == relevant_element_ids[0] {
                    self.coupling_out(
                        worker, callback_name,
                        point, keyboard_event, wheel_event, mouse_event, 
                        all_element_ids, &if relevant_element_ids.len() == 0 { vec![] } else { vec![relevant_element_ids[0]] }
                    );
                }
            },
            CallbackActivationMode::FirstMatch => {
                match callback_name {
                    CallbackType::onmouseenterelement => {
                        let tmp = &array_intersect(&all_element_ids, self.registry.get(&callback_name).unwrap());
                        if tmp.len() > 0 {
                            if relevant_element_ids.contains(&tmp[0]) {
                                match self.currently_entered_element {
                                    None => {},
                                    Some(currently_entered_element) => {
                                        self.coupling_out(
                                            worker, CallbackType::onmouseleaveelement,
                                            point, keyboard_event, wheel_event, mouse_event, 
                                            all_element_ids, &vec![currently_entered_element]
                                        );
                                    }
                                }
                                self.currently_entered_element = Some(relevant_element_ids[0]);
                                self.coupling_out(
                                    worker, callback_name,
                                    point, keyboard_event, wheel_event, mouse_event, 
                                    all_element_ids, &vec![relevant_element_ids[0]]
                                );
                            }
                        }
                    },
                    CallbackType::onmouseleaveelement => {
                        let tmp = array_intersect(&all_element_ids, self.registry.get(&CallbackType::onmouseenterelement).unwrap());
                        if self.currently_entered_element.is_none() || tmp.len() == 0 || self.currently_entered_element.unwrap() != tmp[0] {
                            self.coupling_out(
                                worker, callback_name,
                                point, keyboard_event, wheel_event, mouse_event, 
                                all_element_ids, &match self.currently_entered_element {Some(a) => vec![a], None => vec![] },
                            );
                            self.currently_entered_element = if tmp.len() > 0 {
                                self.coupling_out(
                                    worker, CallbackType::onmouseenterelement,
                                    point, keyboard_event, wheel_event, mouse_event, 
                                    all_element_ids, &vec![tmp[0]]
                                );
                                Some(tmp[0])
                            } else {
                                None
                            }
                        }
                    },
                    _ => {
                        self.coupling_out(
                            worker, callback_name,
                            point, keyboard_event, wheel_event, mouse_event, 
                            all_element_ids, &if relevant_element_ids.len() == 0 { vec![] } else { vec![relevant_element_ids[0]] }
                        );
                    },
                }
            },
            CallbackActivationMode::AllMatches => {
                self.coupling_out(
                    worker, callback_name,
                    point, keyboard_event, wheel_event, mouse_event, 
                    all_element_ids, &relevant_element_ids
                );
            },
        }
    }
}
impl Callback {
    pub fn coupling_in__onmouseenter(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:MouseEvent) {
        self.mouse_position.set(event.get_x(), event.get_y());
        let (workspace_point, elements_under_point) = Callback::gather_details( event.get_xy_point(), element_manager, arrangement, viewport );

        if viewport.get_stop_mouse_scroll() {
            self.stop_mouse_scroll_active_and_message_sent = true;
            interface::send_message(
                worker, "setDocumentAttributes",
                &js_sys::Array::of2(
                    &vector_to_array__string(&vec![String::from("body.style.overflow")]),
                    &vector_to_array__string(&vec![String::from("hidden")]),
                ) 
            );
        }

        self.activate_element_callback(
            worker, CallbackType::onmouseenter,
            workspace_point, None, None, Some(&event),
            &elements_under_point, &array_intersect(&elements_under_point, self.registry.get(&CallbackType::onmouseenter).unwrap())
        );
    }
    pub fn coupling_in__onmouseleave(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:MouseEvent) {
        self.mouse_position.set(event.get_x(), event.get_y());
        let (workspace_point, elements_under_point) = Callback::gather_details( event.get_xy_point(), element_manager, arrangement, viewport );

        if viewport.get_stop_mouse_scroll() {
            self.stop_mouse_scroll_active_and_message_sent = false;
            interface::send_message(
                worker, "setDocumentAttributes",
                &js_sys::Array::of2(
                    &vector_to_array__string(&vec![String::from("body.style.overflow")]),
                    &vector_to_array__string(&vec![String::from("")]),
                ) 
            );
        }

        self.activate_element_callback(
            worker, CallbackType::onmouseleave,
            workspace_point, None, None, Some(&event),
            &elements_under_point, &array_intersect(&elements_under_point, self.registry.get(&CallbackType::onmouseleave).unwrap())
        );
    }
    pub fn coupling_in__onmousemove(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:MouseEvent) {
        self.mouse_position.set(event.get_x(), event.get_y());
        let (workspace_point, elements_under_point) = Callback::gather_details( event.get_xy_point(), element_manager, arrangement, viewport );

        //check for onmouseenter / onmouseleave
            //go through the elementsUnderPoint list, comparing to the element transition list
                let (a,b) = array_difference(&self.element_mouseover_list, &elements_under_point);
                //run both onmouseenterelement and onmouseenterelement, only if there's
                //  elements to report, providing only the relevant set of elements
                //elements only on elements list; add to elementMouseoverList
                //elements only on elementMouseoverList; remove from elementMouseoverList
                if b.len() > 0 { 
                    self.activate_element_callback(
                        worker, CallbackType::onmouseenterelement,
                        workspace_point, None, None, Some(&event),
                        &elements_under_point, 
                        &array_intersect(&b, self.registry.get(&CallbackType::onmouseenterelement).unwrap())
                    );
                }
                if a.len() > 0 { 
                    self.activate_element_callback(
                        worker, CallbackType::onmouseleaveelement,
                        workspace_point, None, None, Some(&event),
                        &elements_under_point, 
                        &array_intersect(&a, self.registry.get(&CallbackType::onmouseleaveelement).unwrap())
                    );
                }
                for item in b {
                    self.element_mouseover_list.push(item);
                }
                for item in a {
                    self.element_mouseover_list.retain(|&a| a != item);
                }

        self.activate_element_callback(
            worker, CallbackType::onmousemove,
            workspace_point, None, None, Some(&event),
            &elements_under_point, &array_intersect(&elements_under_point, self.registry.get(&CallbackType::onmousemove).unwrap())
        );
    }
    pub fn coupling_in__onmousedown(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:MouseEvent) {
        let (workspace_point, elements_under_point) = Callback::gather_details( event.get_xy_point(), element_manager, arrangement, viewport );
        
        self.element_mouse_click_list = elements_under_point.clone();
        
        self.activate_element_callback(
            worker, CallbackType::onmousedown,
            workspace_point, None, None, Some(&event),
            &elements_under_point, &array_intersect(&elements_under_point, self.registry.get(&CallbackType::onmousedown).unwrap())
        );
    }
    pub fn coupling_in__onmouseup(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:MouseEvent) {
        let (workspace_point, elements_under_point) = Callback::gather_details( event.get_xy_point(), element_manager, arrangement, viewport );
        self.activate_element_callback(
            worker, CallbackType::onmouseup,
            workspace_point, None, None, Some(&event),
            &elements_under_point, &array_intersect(&elements_under_point, self.registry.get(&CallbackType::onmouseup).unwrap())
        );
    }
    pub fn coupling_in__onclick(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:MouseEvent) {
        let (workspace_point, elements_under_point) = Callback::gather_details( event.get_xy_point(), element_manager, arrangement, viewport );
        let tmp = array_intersect( &elements_under_point, &self.element_mouse_click_list );
        self.recently_clicked_double_clickable_element_list = array_intersect( &tmp, self.registry.get(&CallbackType::ondblclick).unwrap() );
        self.activate_element_callback(
            worker, CallbackType::onclick,
            workspace_point, None, None, Some(&event),
            &elements_under_point, &array_intersect( &tmp, self.registry.get(&CallbackType::onclick).unwrap() )
        );
    }
    pub fn coupling_in__ondblclick(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:MouseEvent) {
        let (workspace_point, elements_under_point) = Callback::gather_details( event.get_xy_point(), element_manager, arrangement, viewport );
        self.activate_element_callback(
            worker, CallbackType::ondblclick,
            workspace_point, None, None, Some(&event),
            &elements_under_point, &array_intersect( &elements_under_point, &self.recently_clicked_double_clickable_element_list ),
        );
    }

    pub fn coupling_in__onwheel(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:WheelEvent) {
        let (workspace_point, elements_under_point) = Callback::gather_details( event.get_xy_point(), element_manager, arrangement, viewport );

        if viewport.get_stop_mouse_scroll() && !self.stop_mouse_scroll_active_and_message_sent {
            self.stop_mouse_scroll_active_and_message_sent = true;
            interface::send_message(
                worker, "setDocumentAttributes",
                &js_sys::Array::of2(
                    &vector_to_array__string(&vec![String::from("body.style.overflow")]),
                    &vector_to_array__string(&vec![String::from("hidden")]),
                ) 
            );
        }

        self.activate_element_callback(
            worker, CallbackType::onwheel,
            workspace_point, None, Some(&event), None, 
            &elements_under_point, &array_intersect(&elements_under_point, self.registry.get(&CallbackType::onwheel).unwrap())
        );
    }

    pub fn coupling_in__onkeydown(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:KeyboardEvent) {
        let (workspace_point, elements_under_point) = Callback::gather_details( self.mouse_position, element_manager, arrangement, viewport );
        self.activate_element_callback(
            worker, CallbackType::onkeydown,
            workspace_point, Some(&event), None, None,
            &elements_under_point, &array_intersect(&elements_under_point, self.registry.get(&CallbackType::onkeydown).unwrap())
        );
    }
    pub fn coupling_in__onkeyup(&mut self, worker:&web_sys::Worker, element_manager:&ElementManager, arrangement:&Arrangement, viewport:&Viewport, event:KeyboardEvent) {
        let (workspace_point, elements_under_point) = Callback::gather_details( self.mouse_position, element_manager, arrangement, viewport );
        self.activate_element_callback(
            worker, CallbackType::onkeyup,
            workspace_point, Some(&event), None, None,
            &elements_under_point, &array_intersect(&elements_under_point, self.registry.get(&CallbackType::onkeyup).unwrap())
        );
    }
}
impl Callback {
    pub fn _dump(&self) {
        console_log!("┌─Callback Dump─");
        console_log!("│ activation_mode: {}", self.activation_mode);
        console_log!("│ registry:");
        for key in self.registry.keys() {
            console_log!("│    {} : {:?}", key, self.registry.get(&key).unwrap());
        }
        console_log!("│ mouse_position: {}", self.mouse_position);
        console_log!("│ element_mouseover_list: {:?}", self.element_mouseover_list);
        console_log!("│ currently_entered_element: {:?}", self.currently_entered_element);
        console_log!("│ element_mouse_click_list: {:?}", self.element_mouse_click_list);
        console_log!("│ recently_clicked_double_clickable_element_list: {:?}", self.recently_clicked_double_clickable_element_list);
        console_log!("└───────────────");
    }
}







//callback
    #[wasm_bindgen]
    impl Engine {
        pub fn callback__list_callback_types(&self) -> Vec<JsValue> {
            Callback::list_callback_types().iter().map(|item| JsValue::from_str(&item.to_string())).collect()
        }
        pub fn callback__list_activation_modes(&self) -> Vec<JsValue> {
            Callback::list_activation_modes().iter().map(|item| JsValue::from_str(&item.to_string())).collect()
        }
        pub fn callback__attach_callback(&mut self, element_id:usize, callback_type:JsValue) {
            let callback_type = match callback_type.as_string() {
                None => { 
                    console_error!("Provided callback_type argument: \"{:?}\" is not a string", callback_type);
                    return;
                },
                Some(callback_type) => {
                    match CallbackType::from_str( &callback_type ) {
                        Some(callback_type) => callback_type,
                        None => { 
                            console_error!("Provided callback_type argument: \"{}\" is not a recognised callback type", callback_type);
                            return;
                        }
                    }
                },
            };

            &self.callback.attach_callback( element_id, callback_type );
        }
        pub fn callback__remove_callback(&mut self, element_id:usize, callback_type:JsValue) {
            let callback_type = match callback_type.as_string() {
                None => { 
                    console_error!("Provided callback_type argument: \"{:?}\" is not a string", callback_type);
                    return;
                },
                Some(callback_type) => {
                    match CallbackType::from_str( &callback_type ) {
                        Some(callback_type) => callback_type,
                        None => { 
                            console_error!("Provided callback_type argument: \"{}\" is not a recognised callback type", callback_type);
                            return;
                        }
                    }
                },
            };

            &self.callback.remove_callback( element_id, callback_type );
        }
        pub fn callback__callback_activation_mode(&mut self, mode:JsValue) {
            let mode = match mode.as_string() {
                None => { 
                    console_error!("Provided mode argument: \"{:?}\" is not a string", mode);
                    return;
                },
                Some(mode) => {
                    match CallbackActivationMode::from_str( &mode ) {
                        Some(mode) => mode,
                        None => { 
                            console_error!("Provided mode argument: \"{}\" is not a recognised callback activation mode", mode);
                            return;
                        }
                    }
                },
            };

            &self.callback.callback_activation_mode( &self.worker, mode );
        }
        pub fn callback__dump(&self) {
            self.callback._dump();
        }

        //couplings
            pub fn callback__coupling_in__onmouseenter(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onmouseenter(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match MouseEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__onmouseenter - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }
            pub fn callback__coupling_in__onmouseleave(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onmouseleave(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match MouseEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__onmouseleave - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }
            pub fn callback__coupling_in__onmousemove(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onmousemove(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match MouseEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__onmousemove - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }
            pub fn callback__coupling_in__onmousedown(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onmousedown(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match MouseEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::callback__coupling_in__onmousedown - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }
            pub fn callback__coupling_in__onmouseup(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onmouseup(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match MouseEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__onmouseup - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }
            pub fn callback__coupling_in__onclick(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onclick(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match MouseEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__onclick - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }
            pub fn callback__coupling_in__ondblclick(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__ondblclick(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match MouseEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__ondblclick - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }

            pub fn callback__coupling_in__onwheel(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onwheel(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match WheelEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__onwheel - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }

            pub fn callback__coupling_in__onkeydown(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onkeydown(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match KeyboardEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__onkeydown - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }
            pub fn callback__coupling_in__onkeyup(&mut self, event:js_sys::Object) {
                self.callback.coupling_in__onkeyup(
                    &self.worker,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport,
                    match KeyboardEvent::from_js_sys_object(&event) {
                        Some(a) => a,
                        None => { 
                            console_error!("Engine::callback::coupling_in__onkeyup - could not decode object {:?}", event);
                            return;
                        },
                    }
                );
            }
    }