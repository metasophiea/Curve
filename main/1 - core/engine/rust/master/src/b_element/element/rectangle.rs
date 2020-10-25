//rust
    use std::rc::Weak;
    use std::cell::RefCell;

//wasm
    use web_sys::WebGl2RenderingContext;

    // use wasm_bindgen::prelude::*;
    // #[wasm_bindgen]
    // extern "C" {
    //     #[wasm_bindgen(js_namespace = console)]
    //     fn log(a:&str);
    // }
    // macro_rules! console_log {
    //     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    // }

//core
    use crate::a_library::{
        data_type::{
            Colour,
            Offset,
            Viewbox,
            Point,
            Polygon,
            ElementType,
            RenderDecision,
        },
        structure::{
            WebGl2programConglomerateManager,
            ImageRequester,
            FontRequester,
        },
        wasm::from_js_sys::{
            get_value_from_object__f32,
            get_value_from_object__point,
            get_value_from_object__colour,
        },
    };
    use super::super::element::ElementTrait;
    use crate::f_stats::Stats;









static VAO_NAMES: [&'static str; 1] = [
    "point"
];
static VAO_POINTS: [f32; 8] = [
    0.0,0.0,
    1.0,0.0,
    1.0,1.0,
    0.0,1.0,
];
static VAO_GROUPING_SIZE: [i32; 1] = [
    2,
];
static VERTEX_SHADER_SOURCE: &'static str = "#version 300 es
    //constants
        in vec2 point;

    //variables
        struct location{
            vec2 xy;
            float scale;
            float angle;
        };
        uniform location adjust;
        uniform vec2 resolution;
        uniform vec2 dimensions;
        uniform vec2 anchor;

    void main(){
        //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
            vec2 P = dimensions * adjust.scale * (point - anchor);
            P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;
        //convert from unit space to clipspace
            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
    }
";
static FRAGMENT_SHADER_SOURCE: &'static str = "#version 300 es
    precision mediump float;
    out vec4 outputColour;
    uniform vec4 colour;
                                                                
    void main(){
        outputColour = colour;
    }
";
static UNIFORMS_TO_FIND: [&'static str; 7] = [
    "adjust.xy",
    "adjust.scale",
    "adjust.angle",
    "resolution",
    "dimensions",
    "anchor",
    "colour",
];

pub struct Rectangle {
    //hierarchy and identity
        element_type: ElementType, 
        id: usize,
        name: String, 
        self_reference: Option<Weak<RefCell<dyn ElementTrait>>>,
        parent: Option<Weak<RefCell<dyn ElementTrait>>>,

    //attributes
        //pertinent to extremity calculation
            x: f32,
            y: f32,
            angle: f32,
            scale: f32,
            width: f32,
            height: f32,
            anchor: Point,
        //other
            ignored: bool,
            colour: Colour,

    //switches
        dot_frame: bool,

    //computed values
        extremities: Polygon,
        cached_offset: Offset,
        cached_heed_camera: bool,

    //render
        is_visible: bool,
        previous_is_visible: bool,
}
impl Rectangle {
    pub fn new(id:usize, name:String) -> Rectangle {
        Rectangle {
            element_type: ElementType::Rectangle,
            id: id,
            name: name,
            self_reference: None,
            parent: None,

            x: 0.0,
            y: 0.0,
            angle: 0.0,
            scale: 1.0,
            width: 10.0,
            height: 10.0,
            anchor: Point::new(0.0,0.0),

            ignored: false,
            colour: Colour::new(1.0,0.0,0.0,1.0),

            dot_frame: false,
            
            extremities: Polygon::new_empty(),
            cached_offset: Offset::new_default(),
            cached_heed_camera: false,

            is_visible: false,
            previous_is_visible: false,
        }
    }

    //attributes
        //pertinent to extremity calculation
            //width
                pub fn get_width(&self) -> &f32 { &self.width }
                pub fn set_width(&mut self, new:f32, viewbox:&Viewbox) { 
                    self.width = new;
                    self.compute_extremities(true, None, None);
                    self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                    self.request_render();
                }
            //height
                pub fn get_height(&self) -> &f32 { &self.height }
                pub fn set_height(&mut self, new:f32, viewbox:&Viewbox) { 
                    self.height = new;
                    self.compute_extremities(true, None, None);
                    self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                    self.request_render();
                }
            //anchor
                pub fn get_anchor(&self) -> &Point { &self.anchor }
                pub fn set_anchor(&mut self, new:Point, viewbox:&Viewbox) { 
                    self.anchor = new;
                    self.compute_extremities(true, None, None);
                    self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                    self.request_render();
                }
        //other
            pub fn get_colour(&self) -> &Colour { &self.colour }
            pub fn set_colour(&mut self, new:Colour, _viewbox:&Viewbox) { 
                self.colour = new;
                self.request_render();
            }
        //unified attribute
            pub fn set_unified_attribute(
                &mut self,
                x: Option<f32>,
                y: Option<f32>,
                angle: Option<f32>,
                scale: Option<f32>,
                width: Option<f32>,
                height: Option<f32>,
                anchor: Option<Point>,
                colour: Option<Colour>,
                viewbox: &Viewbox,
            ) {
                if let Some(x) = x { self.x = x; }
                if let Some(y) = y { self.y = y; }
                if let Some(angle) = angle { self.angle = angle; }
                if let Some(scale) = scale { self.scale = scale; }
                if let Some(width) = width { self.width = width; }
                if let Some(height) = height { self.height = height; }
                if let Some(anchor) = anchor { self.anchor = anchor; }
                if let Some(colour) = colour { self.colour = colour; }
                self.compute_extremities(true, None, None);
                self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                self.request_render();
            }
}
impl ElementTrait for Rectangle {
    //trait requirements
        //hierarchy and identity
            fn get_element_type(&self) -> &ElementType { &self.element_type }
            fn get_id(&self) -> usize { self.id }
            fn get_name(&self) -> &String{ &self.name }
            fn set_name(&mut self, new:String) { self.name = new; }
            fn set_self_reference(&mut self, new:Weak<RefCell<dyn ElementTrait>>) { self.self_reference = Some(new); }
            fn get_parent(&self) -> &Option<Weak<RefCell<dyn ElementTrait>>> { &self.parent }
            fn set_parent(&mut self, new:Weak<RefCell<dyn ElementTrait>>) { self.parent = Some(new); }
            fn clear_parent(&mut self) { self.parent = None; }

        //position
            //x
                fn get_x(&self) -> f32 { self.x }
                fn set_x(&mut self, new:f32, viewbox:&Viewbox){ 
                    self.x = new;
                    self.compute_extremities(true, None, None);
                    self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                    self.request_render();
                }
            //y
                fn get_y(&self) -> f32 { self.y }
                fn set_y(&mut self, new:f32, viewbox:&Viewbox){ 
                    self.y = new;
                    self.compute_extremities(true, None, None);
                    self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                    self.request_render();
                }
            //angle
                fn get_angle(&self) -> f32 { self.angle }
                fn set_angle(&mut self, new:f32, viewbox:&Viewbox) { 
                    self.angle = new;
                    self.compute_extremities(true, None, None);
                    self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                    self.request_render();
                }
            //scale
                fn get_scale(&self) -> f32 { self.scale }
                fn set_scale(&mut self, new:f32, viewbox:&Viewbox) { 
                    self.scale = new;
                    self.compute_extremities(true, None, None);
                    self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                    self.request_render();
                }

        //other
            fn get_ignored(&self) -> bool { self.ignored }
            fn set_ignored(&mut self, new:bool) { self.ignored = new; }

        //offset
            fn get_cached_offset(&self) -> &Offset { &self.cached_offset }
            fn get_cached_offset_mut(&mut self) -> &mut Offset { &mut self.cached_offset }
            fn set_cached_offset(&mut self, new:Offset) { self.cached_offset = new; }

        //heed camera
            fn get_cached_heed_camera(&self) -> bool { self.cached_heed_camera }
            fn set_cached_heed_camera(&mut self, new:bool) { self.cached_heed_camera = new; }

        //extremities
            fn get_extremities(&self) -> &Polygon { &self.extremities }
            fn __set_extremities(&mut self, new:Polygon) { self.extremities = new; }

        //render
            //visibility
                fn is_visible(&self) -> bool { self.is_visible }
                fn set_is_visible(&mut self, new:bool) { 
                    self.previous_is_visible = self.is_visible;
                    self.is_visible = new;
                }
                fn previous_is_visible(&self) -> bool { self.previous_is_visible }
            //dot frame
                fn get_dot_frame(&self) -> bool { self.dot_frame }
                fn set_dot_frame(&mut self, new:bool) { self.dot_frame = new; }

    //element specific
        //casting
            fn as_rectangle(&self) -> Option<&Rectangle> { Some(self) }
            fn as_rectangle_mut(&mut self) -> Option<&mut Rectangle> { Some(self) }

        //universal attribute
            fn set_unified_attribute_from_js_sys_object(
                &mut self, 
                unified_attribute: js_sys::Object, 
                _font_requester: &RefCell<FontRequester>, 
                _worker: &web_sys::Worker, 
                viewbox: &Viewbox
            ) {
                self.set_unified_attribute(
                    get_value_from_object__f32("x", &unified_attribute, true),
                    get_value_from_object__f32("y", &unified_attribute, true),
                    get_value_from_object__f32("angle", &unified_attribute, true),
                    get_value_from_object__f32("scale", &unified_attribute, true),
                    get_value_from_object__f32("width", &unified_attribute, true),
                    get_value_from_object__f32("height", &unified_attribute, true),
                    get_value_from_object__point("anchor", &unified_attribute, true),
                    get_value_from_object__colour("colour", &unified_attribute, true),
                    viewbox,
                );
            }

        //extremities
            fn get_length_of_points_for_extremity_calculation(&self) -> usize {
                VAO_POINTS.len()/2
            }
            fn get_point_for_extremity_calculation(&self, index:usize) -> Option<(f32,f32)> {
                if index >= VAO_POINTS.len()/2 {
                    return None;
                }

                Some( (
                    self.width * (VAO_POINTS[index*2] - self.anchor.get_x()),
                    self.height * (VAO_POINTS[index*2 +1] - self.anchor.get_y()),
                ) )
            }

        //render
            //actual render
                fn activate_webGL_render(
                    &mut self, 
                    offset: Option<&Offset>,
                    context: &WebGl2RenderingContext, 
                    web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                    _image_requester: &mut ImageRequester,
                    resolution: &(u32, u32),
                    stats: &mut Stats,
                ) -> bool {
                    // //if element is not visible, then don't bother
                    //     if self.colour.a() == 0.0 {
                    //         return false;
                    //     }

                    //load program
                        web_gl2_program_conglomerate_manager.load_program(
                            &context,
                            Some(self.element_type),
                            &VERTEX_SHADER_SOURCE,
                            &FRAGMENT_SHADER_SOURCE,
                            0,
                            &VAO_NAMES,
                            &[&VAO_POINTS],
                            &VAO_GROUPING_SIZE,
                            &UNIFORMS_TO_FIND,
                            None,
                        );

                    //determine which offset to use
                        let working_offset = match offset {
                            None => self.get_cached_offset(),
                            Some(offset) => { offset },
                        };
                        
                    //load uniforms
                        let uniforms = web_gl2_program_conglomerate_manager.get_uniform_locations(self.element_type).unwrap();
                        context.uniform2f(Some(&uniforms[0]), working_offset.get_x(), working_offset.get_y());
                        context.uniform1f(Some(&uniforms[1]), working_offset.get_scale());
                        context.uniform1f(Some(&uniforms[2]), working_offset.get_angle());
                        context.uniform2f(Some(&uniforms[3]), resolution.0 as f32, resolution.1 as f32);
                        context.uniform2f(Some(&uniforms[4]), self.width, self.height);
                        context.uniform2f(Some(&uniforms[5]), self.anchor.get_x(), self.anchor.get_y());
                        context.uniform4f(Some(&uniforms[6]), self.colour.premultiplied_r(), self.colour.premultiplied_g(), self.colour.premultiplied_b(), self.colour.a());

                    //activate draw
                        context.draw_arrays(WebGl2RenderingContext::TRIANGLE_FAN, 0, 4);

                    if stats.get_active() { stats.element_render_register_info(self.get_id(), self.get_element_type(), RenderDecision::Rendered); }
                    false
                }

        //info/dump
            fn _specific_info(&self) -> String {
                format!(
                    "width:{}, height:{}, anchor:{}, colour:{}",
                    self.width,
                    self.height,
                    self.anchor,
                    self.colour,
                )
            }
}