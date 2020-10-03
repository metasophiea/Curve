//rust
    use std::rc::Weak;
    use std::cell::RefCell;

//wasm
    use web_sys::WebGl2RenderingContext;

//core
    use crate::a_library::{
        data_type,
        data_type::{
            Colour,
            Offset,
            ElementType,
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
static FRAGMENT_SHADER_SOURCE:&'static str = "#version 300 es
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
            points: data_type::Polygon,
        //other
            ignored: bool,
            colour: Colour,

    //switches
        dot_frame: bool,
        allow_compute_extremities: bool,

    //computed values
        extremities: data_type::Polygon,
        vao_id: Option<usize>,
        vao_points: Vec<f32>,
        points_changed: bool,
}
impl Polygon {
    pub fn new(id:usize, name: String) -> Polygon {
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
            points: data_type::Polygon::new_empty(),

            ignored: false,
            colour: Colour::new(1.0,0.0,0.0,1.0),

            dot_frame: false,
            allow_compute_extremities: true,
            
            extremities: data_type::Polygon::new_empty(),
            vao_id: None,
            vao_points: vec![],
            points_changed: false,
        }
    }

    //attributes
        //pertinent to extremity calculation
            //points
                pub fn get_points(&self) -> &data_type::Polygon { &self.points }
                pub fn set_points(&mut self, new:data_type::Polygon) { self.points = new; self.calculate_points(); self.compute_extremities(true, None); }
        //other
            pub fn get_colour(&self) -> &Colour { &self.colour }
            pub fn set_colour(&mut self, new:Colour) { self.colour = new; }
        //unified attribute
            pub fn set_unified_attribute(
                &mut self,
                x: Option<f32>,
                y: Option<f32>,
                angle: Option<f32>,
                scale: Option<f32>,
                points: Option<data_type::Polygon>,
                colour: Option<Colour>,
            ) {
                if let Some(x) = x { self.x = x; }
                if let Some(y) = y { self.y = y; }
                if let Some(angle) = angle { self.angle = angle; }
                if let Some(scale) = scale { self.scale = scale; }
                if let Some(points) = points { self.points = points; self.calculate_points(); }
                if let Some(colour) = colour { self.colour = colour; }
                self.compute_extremities(true, None);
            }

    //webGL rendering functions
        fn compute_points(polygon:&data_type::Polygon) -> Vec<f32> {
            let mut vao_points:Vec<f32> = vec![];

            for triangle in polygon.to_sub_triangles() {
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
                fn get_x(&self) -> f32 { self.x }
                fn set_x(&mut self, new:f32){ self.x = new; }
            //y
                fn get_y(&self) -> f32 { self.y }
                fn set_y(&mut self, new:f32){ self.y = new; }
            //angle
                fn get_angle(&self) -> f32 { self.angle }
                fn set_angle(&mut self, new:f32) { self.angle = new; }
            //scale
                fn get_scale(&self) -> f32 { self.scale }
                fn set_scale(&mut self, new:f32) { self.scale = new; }

        //other
            fn get_ignored(&self) -> bool { self.ignored }
            fn set_ignored(&mut self, new:bool) { self.ignored = new; }

        //extremities
            fn get_allow_compute_extremities(&self) -> bool { self.allow_compute_extremities }
            fn set_allow_compute_extremities(&mut self, new:bool) { self.allow_compute_extremities = new; }
            fn get_extremities(&self) -> &data_type::Polygon { &self.extremities }
            fn __set_extremities(&mut self, new:data_type::Polygon) { self.extremities = new; }

        //render
            fn get_dot_frame(&self) -> bool { self.dot_frame }
            fn set_dot_frame(&mut self, new:bool) { self.dot_frame = new; }

    //element specific
        //casting
            fn as_polygon(&self) -> Option<&Polygon> { Some(self) }
            fn as_polygon_mut(&mut self) -> Option<&mut Polygon> { Some(self) }

        //universal attribute
            fn set_unified_attribute_from_js_sys_object(&mut self, unified_attribute:js_sys::Object, _font_requester:&RefCell<FontRequester>, _worker:&web_sys::Worker) {
                self.set_unified_attribute(
                    get_value_from_object__f32("x", &unified_attribute, true),
                    get_value_from_object__f32("y", &unified_attribute, true),
                    get_value_from_object__f32("angle", &unified_attribute, true),
                    get_value_from_object__f32("scale", &unified_attribute, true),
                    match get_value_from_object__vector_of_f32("points", &unified_attribute, true){
                        None => None, 
                        Some(a) => Some(data_type::Polygon::new_from_flat_array(a))
                    },
                    get_value_from_object__colour("colour", &unified_attribute, true),
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
                offset: &Offset,
                context:&WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager:&mut WebGl2programConglomerateManager,
                _image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
            ) {
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

                web_gl2_program_conglomerate_manager.load_program(
                    &context,
                    self.element_type,
                    &VERTEX_SHADER_SOURCE,
                    &FRAGMENT_SHADER_SOURCE,
                    self.vao_id.unwrap(),
                    &VAO_NAMES,
                    &[&self.vao_points],
                    &VAO_GROUPING_SIZE,
                    &UNIFORMS_TO_FIND,
                    None,
                );

                let uniforms = web_gl2_program_conglomerate_manager.get_uniform_locations(self.element_type).unwrap();
                context.uniform2f(Some(&uniforms[0]), offset.get_x(), offset.get_y());
                context.uniform1f(Some(&uniforms[1]), offset.get_scale());
                context.uniform1f(Some(&uniforms[2]), offset.get_angle());
                context.uniform2f(Some(&uniforms[3]), resolution.0 as f32, resolution.1 as f32);
                context.uniform4f(Some(&uniforms[4]), self.colour.premultiplied_r(), self.colour.premultiplied_g(), self.colour.premultiplied_b(), self.colour.a());

                context.draw_arrays(WebGl2RenderingContext::TRIANGLES, 0, (self.vao_points.len()/2) as i32);
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