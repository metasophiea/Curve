#![allow(non_snake_case)]

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

//self
    use crate::engine::Engine;
    use crate::a_library::data_type::{
        Point,
        Polygon,
        Viewbox,
    };
    use crate::a_library::math::cartesian_angle_adjust;
    use crate::b_element::ElementManager;
    use crate::c_arrangement::Arrangement;

    pub mod test;








pub struct Viewport {
    position: Point,
    scale: f32,
    angle: f32,
    anchor: Point,
    stop_scroll_active: bool,

    viewbox: Viewbox,
}
impl Viewport {
    pub fn new() -> Viewport {
        Viewport {
            position: Point::new(0.0,0.0),
            scale: 1.0,
            angle: 0.0,
            anchor: Point::new(0.0,0.0),
            stop_scroll_active: false,
            viewbox: Viewbox::new_default(),
        }
    }

    //adapter
        pub fn window_point_2_workspace_point(&self, point:&Point) -> Point {
            let p = cartesian_angle_adjust( point.get_x(), point.get_y(), -self.angle );
            Point::new(
                p.get_x()/self.scale + self.position.get_x(),
                p.get_y()/self.scale + self.position.get_y(),
            )
        }

    //camera position
        pub fn position(&mut self, point:Point, canvas_size:(u32,u32)) { 
            self.position = point; 
            self.calculate_viewbox(canvas_size);
        }
        pub fn scale(&mut self, s:f32, canvas_size:(u32,u32)) { 
            self.scale = s; 
            self.calculate_viewbox(canvas_size);
        }
        pub fn angle(&mut self, a:f32, canvas_size:(u32,u32)) { 
            self.angle = a; 
            self.calculate_viewbox(canvas_size);
        }
        pub fn anchor(&mut self, point:Point, canvas_size:(u32,u32)) {
            self.anchor = point; 
            self.calculate_viewbox(canvas_size);
        }

    //mouse interaction
        pub fn get_elements_under_point(&self, element_manager:&ElementManager, arrangement:&Arrangement, point:Point) -> Vec<usize> {
            arrangement.get_elements_under_point(
                element_manager,
                &point,
                self.window_point_2_workspace_point( &point )
            )
        }
        pub fn get_elements_under_area(&self, element_manager:&ElementManager, arrangement:&Arrangement, polygon:Polygon) -> Vec<usize> {
            arrangement.get_elements_under_area(
                element_manager, 
                &polygon,
                Polygon::new_from_point_vector(
                    polygon.get_points().iter().map(|point| self.window_point_2_workspace_point( point ) ).collect()
                )
            )
        }
        pub fn get_stop_mouse_scroll(&self) -> bool {
            self.stop_scroll_active
        }
        pub fn set_stop_mouse_scroll(&mut self, active:bool) {
            self.stop_scroll_active = active;
        }

    //misc
        fn calculate_viewbox(&mut self, canvas_size:(u32,u32)) {
            self.viewbox = Viewbox::new(
                self.position.get_x(),
                self.position.get_y(),
                self.scale,
                self.angle,
                self.anchor.get_x(),
                self.anchor.get_y(),
                canvas_size.0,
                canvas_size.1,
            );
        }
        pub fn get_viewbox(&self) -> &Viewbox {
            &self.viewbox
        }
        pub fn refresh(&mut self, canvas_size:(u32,u32)) {
            self.calculate_viewbox(canvas_size);
        }
        pub fn _dump(&self) {
            console_log!("┌─Viewport Dump─");
            console_log!("│ position: {}", self.position);
            console_log!("│ scale: {} angle: {}", self.scale, self.angle);
            console_log!("│ anchor: {}", self.anchor);
            console_log!("│ viewbox: {}", self.viewbox);
            console_log!("└──────────────────────");
        }
}








//viewport
    #[wasm_bindgen]
    impl Engine {
        //camera position
            pub fn viewport__position(&mut self, x:f32, y:f32) {
                self.viewport.position(
                    Point::new(x,y), 
                    self.render.get_canvas_size()
                );
            }
            pub fn viewport__scale(&mut self, s:f32) {
                self.viewport.scale(
                    s, 
                    self.render.get_canvas_size()
                );
            }
            pub fn viewport__angle(&mut self, a:f32) {
                self.viewport.angle(
                    a, 
                    self.render.get_canvas_size()
                );
            }
            pub fn viewport__anchor(&mut self, x:f32, y:f32) {
                self.viewport.anchor(
                    Point::new(x,y), 
                    self.render.get_canvas_size()
                );
            }
        //mouse interaction
            pub fn viewport__get_elements_under_point(&self, x:f32, y:f32) -> Vec<usize> {
                self.viewport.get_elements_under_point(
                    &self.element_manager,
                    &self.arrangement,
                    Point::new(x,y),
                )
            }
            pub fn viewport__get_elements_under_area(&self, points:Vec<f32>) -> Vec<usize> {
                self.viewport.get_elements_under_area(
                    &self.element_manager,
                    &self.arrangement,
                    Polygon::new_from_flat_array( points )
                )
            }
            pub fn viewport__set_stop_mouse_scroll(&mut self, active:bool) {
                self.viewport.set_stop_mouse_scroll(active);
            }
        //misc
            pub fn viewport__refresh(&mut self) {
                self.viewport.refresh( self.render.get_canvas_size() );
            }
            //setMousePosition(x,y)
            pub fn viewport__dump(&self) {
                self.viewport._dump();
            }
    }