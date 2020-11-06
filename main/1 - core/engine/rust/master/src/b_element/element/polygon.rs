//rust
    use std::rc::Weak;
    use std::cell::RefCell;

//wasm
    use web_sys::WebGl2RenderingContext;

//core
    use crate::a_library::{
        data_type::{
            SimplePolygon,
            Colour,
            Offset,
            Viewbox,
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
            get_value_from_object__colour,
            get_value_from_object__vector_of_f32,
        },
    };
    use super::super::element::ElementTrait;
    use crate::f_stats::Stats;








static VAO_NAMES: [&'static str; 1] = [
    "point"
];
// static VAO_POINTS: [f32; ?] = [
//     - generated -
// ];
static VAO_GROUPING_SIZE: [i32; 1] = [
    2,
];
static VERTEX_SHADER_SOURCE: &'static str = "#version 300 es
    #define PI 3.141592653589793

    vec2 cartesianAngleAdjust(vec2 xy, float angle){
        if(angle == 0.0 || mod(angle,PI*2.0) == 0.0){ return xy; }
        return vec2( xy.x*cos(angle) - xy.y*sin(angle), xy.y*cos(angle) + xy.x*sin(angle) ); 
    }

    //variables
        struct location{
            vec2 xy;
            float scale;
            float angle;
        };
        uniform location adjust;

        in vec2 point;
        uniform vec2 resolution;

    void main(){    
        //adjust point by adjust
            vec2 P = cartesianAngleAdjust(point*adjust.scale, -adjust.angle) + adjust.xy;

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
static UNIFORMS_TO_FIND: [&'static str; 5] = [
    "adjust.xy",
    "adjust.scale",
    "adjust.angle",
    "resolution",
    "colour",
];

pub struct Polygon {
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
            points: SimplePolygon,
        //other
            ignored: bool,
            colour: Colour,

    //switches
        dot_frame: bool,

    //computed values
        extremities: SimplePolygon,
        cached_offset: Offset,
        cached_heed_camera: bool,
        vao_id: Option<usize>,
        vao_points: Vec<f32>,
        points_changed: bool,

    //render
        is_visible: bool,
        previous_is_visible: bool,
}
impl Polygon {
    pub fn new(id:usize, name:String) -> Polygon {
        Polygon {
            element_type: ElementType::Polygon,
            id: id,
            name: name,
            self_reference: None,
            parent: None,

            x: 0.0,
            y: 0.0,
            angle: 0.0,
            scale: 1.0,
            points: SimplePolygon::new_default(),

            ignored: false,
            colour: Colour::new(1.0,0.0,0.0,1.0),

            dot_frame: false,
            
            extremities: SimplePolygon::new_default(),
            cached_offset: Offset::new_default(),
            cached_heed_camera: false,
            vao_id: None,
            vao_points: vec![],
            points_changed: false,

            is_visible: false,
            previous_is_visible: false,
        }
    }

    //attributes
        //pertinent to extremity calculation
            //points
                pub fn get_points(&self) -> &SimplePolygon { &self.points }
                pub fn set_points(&mut self, new:SimplePolygon, viewbox:&Viewbox) { 
                    self.points = new; 
                    self.calculate_points(); 
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
                points: Option<SimplePolygon>,
                colour: Option<Colour>,
                viewbox:&Viewbox,
            ) {
                if let Some(x) = x { self.x = x; }
                if let Some(y) = y { self.y = y; }
                if let Some(angle) = angle { self.angle = angle; }
                if let Some(scale) = scale { self.scale = scale; }
                if let Some(points) = points { self.points = points; self.calculate_points(); }
                if let Some(colour) = colour { self.colour = colour; }
                self.compute_extremities(true, None, None);
                self.determine_if_visible(self.get_parent_clipping_polygon().as_ref(), viewbox, true);
                self.request_render();
            }

    //webGL rendering functions
        fn compute_points(polygon:&SimplePolygon) -> Vec<f32> {
            let mut vao_points:Vec<f32> = vec![];

            for triangle in polygon.to_sub_triangles_triangles() {
                for points in triangle.get_points() {
                    vao_points.extend_from_slice(
                        &[
                            points.get_x(), 
                            points.get_y(),
                        ]
                    );
                }
            }

            vao_points
        }
        fn calculate_points(&mut self) {
            self.vao_points = Polygon::compute_points(&self.points);
            self.points_changed = true;
        }
}
impl ElementTrait for Polygon {
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
            fn get_extremities(&self) -> &SimplePolygon { &self.extremities }
            fn __set_extremities(&mut self, new:SimplePolygon) { self.extremities = new; }

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
            fn as_polygon(&self) -> Option<&Polygon> { Some(self) }
            fn as_polygon_mut(&mut self) -> Option<&mut Polygon> { Some(self) }

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
                    match get_value_from_object__vector_of_f32("points", &unified_attribute, true){
                        None => None, 
                        Some(a) => Some(SimplePolygon::new_from_flat_array(a))
                    },
                    get_value_from_object__colour("colour", &unified_attribute, true),
                    viewbox,
                );
            }

        //extremities
            fn get_length_of_points_for_extremity_calculation(&self) -> usize {
                self.points.get_points_length()
            }
            fn get_point_for_extremity_calculation(&self, index:usize) -> Option<(f32,f32)> {
                if index >= self.points.get_points_length() {
                    return None;
                }

                Some(
                    self.points.get_point_as_tuple(index)
                )
            }

        //render
            fn activate_webGL_render(
                &mut self, 
                offset: Option<&Offset>,
                context: &WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                _image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
                stats: &mut Stats,
            ) -> bool {
                //vao
                    if self.vao_id.is_none() {
                        self.vao_id = Some( web_gl2_program_conglomerate_manager.generate_new_VAO_id(&self.element_type) );
                    }

                    if self.points_changed {
                        if web_gl2_program_conglomerate_manager.program_is_loaded(self.element_type) {
                            web_gl2_program_conglomerate_manager.update_VAO(
                                &context,
                                self.element_type,
                                self.vao_id.unwrap(),
                                &VAO_NAMES,
                                &[&self.vao_points],
                                &VAO_GROUPING_SIZE,
                            );
                        }
                        self.points_changed = false;
                    }

                //load program
                    web_gl2_program_conglomerate_manager.load_program(
                        &context,
                        Some(self.element_type),
                        &VERTEX_SHADER_SOURCE,
                        &FRAGMENT_SHADER_SOURCE,
                        self.vao_id.unwrap(),
                        &VAO_NAMES,
                        &[&self.vao_points],
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
                    context.uniform4f(Some(&uniforms[4]), self.colour.premultiplied_r(), self.colour.premultiplied_g(), self.colour.premultiplied_b(), self.colour.a());

                //activate draw
                    context.draw_arrays(WebGl2RenderingContext::TRIANGLES, 0, (self.vao_points.len()/2) as i32);

                if stats.get_active() { stats.element_render_decision_register_info(self.get_id(), self.get_element_type(), RenderDecision::Rendered); }
                false
            }

        //info/dump
            fn _specific_info(&self) -> String {
                format!(
                    "points:{}, colour:{}",
                    self.points,
                    self.colour,
                )
            }
}