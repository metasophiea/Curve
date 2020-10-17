//rust
    use std::rc::Weak;
    use std::cell::RefCell;
    use std::f32::consts::PI;

//wasm
    use web_sys::WebGl2RenderingContext;

//core
    use crate::a_library::{
        data_type::{
            Colour,
            Offset,
            Polygon,
            ElementType,
        },
        structure::{
            WebGl2programConglomerateManager,
            ImageRequester,
            FontRequester,
        },
        wasm::from_js_sys::{
            get_value_from_object__u32,
            get_value_from_object__f32,
            get_value_from_object__colour,
        },
    };
    use super::super::element::ElementTrait;








static VAO_NAMES: [&'static str; 2] = [
    "index",
    "point",
];
// static VAO_INDEX: [f32; ?] = [
//     - generated -
// ];
// static VAO_POINTS: [f32; ?] = [
//     - generated -
// ];
static VAO_GROUPING_SIZE: [i32; 2] = [
    1,
    2,
];
static VERTEX_SHADER_SOURCE: &'static str = "#version 300 es
    #define PI 3.141592653589793

    vec2 cartesianAngleAdjust(vec2 xy, float angle){
        if(angle == 0.0 || mod(angle,PI*2.0) == 0.0){ return xy; }
        return vec2( xy.x*cos(angle) - xy.y*sin(angle), xy.y*cos(angle) + xy.x*sin(angle) ); 
    }

    //index
        in lowp float index;

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
        uniform float radius;
        uniform float thickness;
        uniform vec4 colour;
        uniform vec4 line_colour;
        uniform lowp float indexParting;

    //varyings
        out vec4 activeColour;

    void main(){    
        //adjust points by radius and xy adjust
            float tmpRadius = radius + (thickness/2.0) * (index < indexParting ? 1.0 : -1.0);
            vec2 P = cartesianAngleAdjust(point*tmpRadius*adjust.scale, -adjust.angle) + adjust.xy;

        //select colour
            activeColour = index >= indexParting ? colour : line_colour;

        //convert from unit space to clipspace
            gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
    }
";
static FRAGMENT_SHADER_SOURCE: &'static str = "#version 300 es
    precision mediump float;
    out vec4 outputColour;
    in vec4 activeColour;
                                                                
    void main(){
        outputColour = activeColour;
    }
";
static UNIFORMS_TO_FIND: [&'static str; 9] = [
    "adjust.xy",
    "adjust.scale",
    "adjust.angle",
    "resolution",
    "radius",
    "thickness",
    "colour",
    "line_colour",
    "indexParting",
];

pub struct CircleWithOutline {
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
            radius: f32,
            detail: u32,
            thickness: f32,
        //other
            ignored: bool,
            colour: Colour,
            line_colour: Colour,

    //switches
        dot_frame: bool,
        allow_compute_extremities: bool,

    //computed values
        extremities: Polygon,
        cached_offset: Offset,
        vao_id: Option<usize>,
        vao_index: Vec<f32>,
        vao_points: Vec<f32>,
        points_changed: bool,
}
impl CircleWithOutline {
    pub fn new(id:usize, name:String) -> CircleWithOutline {
        CircleWithOutline {
            element_type: ElementType::CircleWithOutline,
            id: id,
            name: name,
            self_reference: None,
            parent: None,

            x: 0.0,
            y: 0.0,
            angle: 0.0,
            scale: 1.0,
            radius: 10.0,
            detail: 25,
            thickness: 0.0,

            ignored: false,
            colour: Colour::new(1.0,0.0,0.0,1.0),
            line_colour: Colour::new(1.0,0.0,0.0,1.0),

            dot_frame: false,
            allow_compute_extremities: true,
            
            extremities: Polygon::new_empty(),
            cached_offset: Offset::new_default(),
            vao_id: None,
            vao_index: (0..25*2*6).map(|a| a as f32).collect(),
            vao_points: CircleWithOutline::compute_points(25),
            points_changed: false,
        }
    }

    //attributes
        //pertinent to extremity calculation
            //radius
                pub fn get_radius(&self) -> &f32 { &self.radius }
                pub fn set_radius(&mut self, new:f32) { self.radius = new; self.compute_extremities(true, None, None); }
            //detail
                pub fn get_detail(&self) -> &u32 { &self.detail }
                pub fn set_detail(&mut self, new:u32) { self.detail = new; self.calculate_circle_points(); self.compute_extremities(true, None, None); }
            //thickness
                pub fn get_thickness(&self) -> &f32 { &self.thickness }
                pub fn set_thickness(&mut self, new:f32) { self.thickness = new; self.compute_extremities(true, None, None); }
        //other
            pub fn get_colour(&self) -> &Colour { &self.colour }
            pub fn set_colour(&mut self, new:Colour) { self.colour = new; }
            pub fn get_line_colour(&self) -> &Colour { &self.line_colour }
            pub fn set_line_colour(&mut self, new:Colour) { self.line_colour = new; }
        //unified attribute
            pub fn set_unified_attribute(
                &mut self,
                x: Option<f32>,
                y: Option<f32>,
                angle: Option<f32>,
                scale: Option<f32>,
                radius: Option<f32>,
                detail: Option<u32>,
                thickness: Option<f32>,
                colour: Option<Colour>,
                line_colour: Option<Colour>,
            ) {
                if let Some(x) = x { self.x = x; }
                if let Some(y) = y { self.y = y; }
                if let Some(angle) = angle { self.angle = angle; }
                if let Some(scale) = scale { self.scale = scale; }
                if let Some(radius) = radius { self.radius = radius; }
                if let Some(detail) = detail { self.detail = detail; self.calculate_circle_points(); }
                if let Some(thickness) = thickness { self.thickness = thickness; }
                if let Some(colour) = colour { self.colour = colour; }
                if let Some(line_colour) = line_colour { self.line_colour = line_colour; }
                self.compute_extremities(true, None, None);
            }

    //webGL rendering functions
        fn compute_points(detail:u32) -> Vec<f32> {
            let mut vao_points:Vec<f32> = vec![];
            let d = detail as f32;

            //outline
                for index in 0..detail {
                    let i = index as f32;
                    vao_points.extend_from_slice( &[0.0,0.0] );
                    vao_points.extend_from_slice( &[ ( 2.0*PI * (i/d) ).sin(), ( 2.0*PI * (i/d) ).cos() ] );
                    vao_points.extend_from_slice( &[ ( 2.0*PI * ((i+1.0)/d) ).sin(), ( 2.0*PI * ((i+1.0)/d) ).cos() ] );
                }

            //main circle
                for index in 0..detail {
                    let i = index as f32;
                    vao_points.extend_from_slice( &[0.0,0.0] );
                    vao_points.extend_from_slice( &[ ( 2.0*PI * (i/d) ).sin(), ( 2.0*PI * (i/d) ).cos() ] );
                    vao_points.extend_from_slice( &[ ( 2.0*PI * ((i+1.0)/d) ).sin(), ( 2.0*PI * ((i+1.0)/d) ).cos() ] );
                }

            vao_points
        }
        fn calculate_circle_points(&mut self) {
            self.vao_points = CircleWithOutline::compute_points(self.detail);
            self.vao_index = (0..self.vao_points.len()).map(|a| a as f32).collect();
            self.points_changed = true;
        }
}
impl ElementTrait for CircleWithOutline {
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
                fn set_x(&mut self, new:f32){ self.x = new; self.compute_extremities(true, None, None); }
            //y
                fn get_y(&self) -> f32 { self.y }
                fn set_y(&mut self, new:f32){ self.y = new; self.compute_extremities(true, None, None); }
            //angle
                fn get_angle(&self) -> f32 { self.angle }
                fn set_angle(&mut self, new:f32) { self.angle = new; self.compute_extremities(true, None, None); }
            //scale
                fn get_scale(&self) -> f32 { self.scale }
                fn set_scale(&mut self, new:f32) { self.scale = new; self.compute_extremities(true, None, None); }

        //other
            fn get_ignored(&self) -> bool { self.ignored }
            fn set_ignored(&mut self, new:bool) { self.ignored = new; }

        //offset
            fn get_cached_offset(&self) -> &Offset { &self.cached_offset }
            fn get_cached_offset_mut(&mut self) -> &mut Offset { &mut self.cached_offset }
            fn set_cached_offset(&mut self, new:Offset) { self.cached_offset = new; }

        //extremities
            fn get_allow_compute_extremities(&self) -> bool { self.allow_compute_extremities }
            fn set_allow_compute_extremities(&mut self, new:bool) { self.allow_compute_extremities = new; }
            fn get_extremities(&self) -> &Polygon { &self.extremities }
            fn __set_extremities(&mut self, new:Polygon) { self.extremities = new; }

        //render
            fn get_dot_frame(&self) -> bool { self.dot_frame }
            fn set_dot_frame(&mut self, new:bool) { self.dot_frame = new; }

    //element specific
        //casting
            fn as_circleWithOutline(&self) -> Option<&CircleWithOutline> { Some(self) }
            fn as_circleWithOutline_mut(&mut self) -> Option<&mut CircleWithOutline> { Some(self) }

        //universal attribute
            fn set_unified_attribute_from_js_sys_object(&mut self, unified_attribute:js_sys::Object, _font_requester:&RefCell<FontRequester>, _worker:&web_sys::Worker) {
                self.set_unified_attribute(
                    get_value_from_object__f32("x", &unified_attribute, true),
                    get_value_from_object__f32("y", &unified_attribute, true),
                    get_value_from_object__f32("angle", &unified_attribute, true),
                    get_value_from_object__f32("scale", &unified_attribute, true),
                    get_value_from_object__f32("radius", &unified_attribute, true),
                    get_value_from_object__u32("detail", &unified_attribute, true),
                    get_value_from_object__f32("thickness", &unified_attribute, true),
                    get_value_from_object__colour("colour", &unified_attribute, true),
                    get_value_from_object__colour("lineColour", &unified_attribute, true),
                );
            }

        //extremities
            fn get_length_of_points_for_extremity_calculation(&self) -> usize {
                self.vao_points.len()/2
            }
            fn get_point_for_extremity_calculation(&self, index:usize) -> Option<(f32,f32)> {
                if index >= self.vao_points.len()/2 {
                    return None;
                }

                Some( (
                    self.radius * self.vao_points[index],
                    self.radius * self.vao_points[index+1],
                ) )
            }

        //render
            fn activate_webGL_render(
                &mut self, 
                offset: Option<&Offset>,
                context: &WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                _image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
            ) {
                //vao
                    if self.vao_id.is_none() {
                        self.vao_id = Some( web_gl2_program_conglomerate_manager.generate_new_VAO_id(&self.element_type) );
                    }

                    if !web_gl2_program_conglomerate_manager.program_is_loaded(self.element_type) {
                        self.points_changed = false;
                    } else if self.points_changed {
                        web_gl2_program_conglomerate_manager.update_VAO(
                            &context,
                            self.element_type,
                            self.vao_id.unwrap(),
                            &VAO_NAMES,
                            &[&self.vao_index, &self.vao_points],
                            &VAO_GROUPING_SIZE,
                        );
                        self.points_changed = false;
                    }

                //load program
                    web_gl2_program_conglomerate_manager.load_program(
                        &context,
                        self.element_type,
                        &VERTEX_SHADER_SOURCE,
                        &FRAGMENT_SHADER_SOURCE,
                        self.vao_id.unwrap(),
                        &VAO_NAMES,
                        &[&self.vao_index, &self.vao_points],
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
                    context.uniform1f(Some(&uniforms[4]), self.radius);
                    context.uniform1f(Some(&uniforms[5]), self.thickness);
                    context.uniform4f(Some(&uniforms[6]), self.colour.premultiplied_r(), self.colour.premultiplied_g(), self.colour.premultiplied_b(), self.colour.a());
                    context.uniform4f(Some(&uniforms[7]), self.line_colour.premultiplied_r(), self.line_colour.premultiplied_g(), self.line_colour.premultiplied_b(), self.line_colour.a());
                    context.uniform1f(Some(&uniforms[8]), (self.vao_index.len()/4) as f32);

                //activate draw
                    context.draw_arrays(WebGl2RenderingContext::TRIANGLES, 0, (self.vao_points.len()/2) as i32);
            }

        //info/dump
            fn _specific_info(&self) -> String {
                format!(
                    "radius:{}, detail:{}, thickness:{}, colour:{}, line_colour:{}",
                    self.radius,
                    self.detail,
                    self.thickness,
                    self.colour, 
                    self.line_colour,
                )
            }
}