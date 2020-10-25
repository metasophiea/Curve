#![allow(non_snake_case)]
#![allow(dead_code)]
#![allow(non_camel_case_types)]

//rust

//wasm
    use wasm_bindgen::prelude::*;
    use web_sys::{
        WebGl2RenderingContext, 
        WebGlTexture,
        WebGlFramebuffer,
        WebGlRenderbuffer,
    };

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
        // #[wasm_bindgen(js_namespace = console)]
        // fn warn(a:&str);
        #[wasm_bindgen(js_namespace = console)]
        fn error(a:&str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }
    // macro_rules! console_warn {
    //     ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    // }
    macro_rules! console_error {
        ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::{
        structure::{
            WebGl2programConglomerate,
            WebGl2programConglomerateManager,
        }
    };








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

    //vertex/fragment shader transfer variables
        out vec2 textureCoordinates;

    void main(){
        //transfer point to fragment shader
            textureCoordinates = vec2(point.x, 1.0-point.y);

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

    uniform sampler2D textureImage;
    in vec2 textureCoordinates;
                                                                
    void main(){
        outputColour = texture(textureImage, textureCoordinates);
    }
";
static UNIFORMS_TO_FIND: [&'static str; 6] = [
    "adjust.xy",
    "adjust.scale",
    "adjust.angle",
    "resolution",
    "dimensions",
    "anchor",
];
struct WebGl2framebuffer {
    id: usize,
    render_buffer_based: bool,
    dimensions_or_samples_changed: bool,
    width: u32,
    height: u32,

    samples: u32,
    renderbuffer_colour: Option<WebGlRenderbuffer>,
    renderbuffer_stencil: Option<WebGlRenderbuffer>,

    texture: Option<WebGlTexture>,

    framebuffer: WebGlFramebuffer,
    is_bound: bool,
}
impl WebGl2framebuffer {
    fn produce_and_bind_texture(context:&WebGl2RenderingContext, width:u32, height:u32) -> WebGlTexture {
        let texture = context.create_texture();
        
        context.bind_texture(WebGl2RenderingContext::TEXTURE_2D, texture.as_ref());

        context.tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_array_buffer_view(
            WebGl2RenderingContext::TEXTURE_2D, 
            0, 
            WebGl2RenderingContext::RGBA as i32, 
            width as i32,
            height as i32,
            0,
            WebGl2RenderingContext::RGBA,
            WebGl2RenderingContext::UNSIGNED_BYTE, 
            None,
        ).unwrap();

        context.tex_parameteri(WebGl2RenderingContext::TEXTURE_2D, WebGl2RenderingContext::TEXTURE_MIN_FILTER, WebGl2RenderingContext::LINEAR as i32);
        context.tex_parameteri(WebGl2RenderingContext::TEXTURE_2D, WebGl2RenderingContext::TEXTURE_WRAP_S, WebGl2RenderingContext::CLAMP_TO_EDGE as i32);
        context.tex_parameteri(WebGl2RenderingContext::TEXTURE_2D, WebGl2RenderingContext::TEXTURE_WRAP_T, WebGl2RenderingContext::CLAMP_TO_EDGE as i32);

        context.framebuffer_texture_2d(
            WebGl2RenderingContext::FRAMEBUFFER,
            WebGl2RenderingContext::COLOR_ATTACHMENT0,
            WebGl2RenderingContext::TEXTURE_2D,
            texture.as_ref(),
            0,
        );

        // console_log!("{}", context.check_framebuffer_status(WebGl2RenderingContext::FRAMEBUFFER) );
        // console_log!("FRAMEBUFFER_COMPLETE: {}", WebGl2RenderingContext::FRAMEBUFFER_COMPLETE);
        // console_log!("FRAMEBUFFER_INCOMPLETE_ATTACHMENT: {}", WebGl2RenderingContext::FRAMEBUFFER_INCOMPLETE_ATTACHMENT);

        texture.unwrap()
    }
    fn produce_and_bind_renderbuffers(context:&WebGl2RenderingContext, width:u32, hight:u32, samples:u32) -> (WebGlRenderbuffer, WebGlRenderbuffer) {
        let renderbuffer_colour = context.create_renderbuffer().unwrap();
        context.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, Some(&renderbuffer_colour));
        context.renderbuffer_storage_multisample(
            WebGl2RenderingContext::RENDERBUFFER,
            samples as i32,
            WebGl2RenderingContext::RGB8,
            width as i32,
            hight as i32,
        );
        context.framebuffer_renderbuffer(
            WebGl2RenderingContext::DRAW_FRAMEBUFFER,
            WebGl2RenderingContext::COLOR_ATTACHMENT0,
            WebGl2RenderingContext::RENDERBUFFER,
            Some(&renderbuffer_colour),
        );

        let renderbuffer_stencil = context.create_renderbuffer().unwrap();
        context.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, Some(&renderbuffer_stencil));
        context.renderbuffer_storage_multisample(
            WebGl2RenderingContext::RENDERBUFFER,
            samples as i32,
            WebGl2RenderingContext::STENCIL_INDEX8,
            width as i32,
            hight as i32,
        );
        context.framebuffer_renderbuffer(
            WebGl2RenderingContext::DRAW_FRAMEBUFFER,
            WebGl2RenderingContext::STENCIL_ATTACHMENT,
            WebGl2RenderingContext::RENDERBUFFER,
            Some(&renderbuffer_stencil),
        );

        (renderbuffer_colour, renderbuffer_stencil)
    }
    pub fn new(context:&WebGl2RenderingContext, id:usize, width:u32, height:u32, samples:u32, render_buffer_based:bool) -> WebGl2framebuffer {
        let framebuffer = context.create_framebuffer().unwrap();
        context.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, Some(&framebuffer));

        let (renderbuffer_colour, renderbuffer_stencil, texture) = if render_buffer_based {
            let (renderbuffer_colour, renderbuffer_stencil) = WebGl2framebuffer::produce_and_bind_renderbuffers(context, width, height, samples);
            (Some(renderbuffer_colour), Some(renderbuffer_stencil), None)
        } else {
            (None, None, Some(WebGl2framebuffer::produce_and_bind_texture(context, width, height)))
        };

        WebGl2framebuffer {
            id: id,
            render_buffer_based: render_buffer_based,
            dimensions_or_samples_changed: false,
            width: width,
            height: height,

            samples: samples,
            renderbuffer_colour: renderbuffer_colour,
            renderbuffer_stencil: renderbuffer_stencil,
            
            texture: texture,

            framebuffer: framebuffer,
            is_bound: true,
        }
    }
}
impl WebGl2framebuffer {
    fn get_framebuffer(&self) -> &WebGlFramebuffer {
        &self.framebuffer
    }
    fn update_dimensions(&mut self, width:u32, height:u32) {
        self.width = width;
        self.height = height;
        self.dimensions_or_samples_changed = true;
    }
    fn update_samples(&mut self, samples:u32) {
        self.samples = samples;
        self.dimensions_or_samples_changed = true;
    }
    fn bind(&mut self, context:&WebGl2RenderingContext) {
        if self.is_bound {
            console_error!("{} WebGl2framebuffer.bind - framebuffer already bound!", self.id);
            return;
        }
        context.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, Some(&self.framebuffer));
        self.is_bound = true;

        if self.dimensions_or_samples_changed {
            if self.render_buffer_based {
                context.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, self.renderbuffer_colour.as_ref());
                context.renderbuffer_storage_multisample(
                    WebGl2RenderingContext::RENDERBUFFER,
                    self.samples as i32,
                    WebGl2RenderingContext::RGB8,
                    self.width as i32, 
                    self.height as i32,
                );
                context.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, self.renderbuffer_stencil.as_ref());
                context.renderbuffer_storage_multisample(
                    WebGl2RenderingContext::RENDERBUFFER,
                    self.samples as i32,
                    WebGl2RenderingContext::STENCIL_INDEX8,
                    self.width as i32, 
                    self.height as i32,
                );
            } else {
                context.bind_texture(WebGl2RenderingContext::TEXTURE_2D, self.texture.as_ref());
                context.tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_array_buffer_view(
                    WebGl2RenderingContext::TEXTURE_2D, 
                    0, 
                    WebGl2RenderingContext::RGBA as i32, 
                    self.width as i32,
                    self.height as i32,
                    0,
                    WebGl2RenderingContext::RGBA,
                    WebGl2RenderingContext::UNSIGNED_BYTE, 
                    None,
                ).unwrap();
            }
        }
    }
    fn unbind(&mut self) {
        if !self.is_bound {
            console_error!("{} WebGl2framebuffer.unbind - framebuffer already unbound!", self.id);
            return;
        }
        self.is_bound = false;
    }
    fn copy_to(&self, context:&WebGl2RenderingContext, texture_rendering_program:Option<&WebGl2programConglomerate>, other:Option<&WebGl2framebuffer>, web_gl2_program_conglomerate_manager:&mut WebGl2programConglomerateManager) {
        if self.render_buffer_based {
            context.bind_framebuffer(WebGl2RenderingContext::READ_FRAMEBUFFER, Some(&self.framebuffer));
            context.read_buffer(WebGl2RenderingContext::COLOR_ATTACHMENT0);

            match other {
                None => {
                    context.bind_framebuffer( WebGl2RenderingContext::DRAW_FRAMEBUFFER, None );
                    context.draw_buffers(
                        &js_sys::Array::of1(
                            &JsValue::from_f64(WebGl2RenderingContext::BACK as f64),
                        )
                    );
                },
                Some(framebuffer) => {
                    context.bind_framebuffer( WebGl2RenderingContext::DRAW_FRAMEBUFFER, Some(framebuffer.get_framebuffer()) );
                    context.draw_buffers(
                        &js_sys::Array::of1(
                            &JsValue::from_f64(WebGl2RenderingContext::COLOR_ATTACHMENT0 as f64),
                        )
                    );
                },
            }

            context.blit_framebuffer(
                0, 0, self.width as i32, self.height as i32,
                0, 0, self.width as i32, self.height as i32,
                WebGl2RenderingContext::COLOR_BUFFER_BIT,
                WebGl2RenderingContext::NEAREST,
            );
        } else {
            match other {
                None => {
                    context.bind_framebuffer(WebGl2RenderingContext::DRAW_FRAMEBUFFER, None);
                    context.draw_buffers(
                        &js_sys::Array::of1(
                            &JsValue::from_f64(WebGl2RenderingContext::BACK as f64),
                        )
                    );
                },
                Some(framebuffer) => {
                    context.bind_framebuffer(WebGl2RenderingContext::DRAW_FRAMEBUFFER, Some(&framebuffer.get_framebuffer()));
                    context.draw_buffers(
                        &js_sys::Array::of1(
                            &JsValue::from_f64(WebGl2RenderingContext::COLOR_ATTACHMENT0 as f64),
                        )
                    );
                },
            }
    
            web_gl2_program_conglomerate_manager.__manually_load_program(context, None, texture_rendering_program.unwrap(), 0);
    
            context.bind_texture(WebGl2RenderingContext::TEXTURE_2D, self.texture.as_ref());
    
            let uniforms = texture_rendering_program.unwrap().get_uniforms();
            context.uniform2f(Some(&uniforms[0]), 0.0, 0.0);
            context.uniform1f(Some(&uniforms[1]), 1.0);
            context.uniform1f(Some(&uniforms[2]), 0.0);
            context.uniform2f(Some(&uniforms[3]), self.width as f32, self.height as f32);
            context.uniform2f(Some(&uniforms[4]), (self.width/2) as f32, (self.height/2) as f32);
            context.uniform2f(Some(&uniforms[5]), 0.0, 0.0);
    
            context.draw_arrays(WebGl2RenderingContext::TRIANGLE_FAN, 0, 4);
        }
    }
}
impl WebGl2framebuffer {
    fn _dump(&self, prefix:Option<&str>) {
        let prefix = prefix.unwrap_or("");

        console_log!("{}│ id: {}", prefix, self.id);
        console_log!("{}│ render_buffer_based: {}", prefix, self.render_buffer_based);
        console_log!("{}│ dimensions_or_samples_changed: {}", prefix, self.dimensions_or_samples_changed);
        console_log!("{}│ width: {}", prefix, self.width);
        console_log!("{}│ height: {}", prefix, self.height);
        console_log!("{}│", prefix);
        console_log!("{}│ samples: {}", prefix, self.samples);
        console_log!("{}│ renderbuffer_colour: {:?}", prefix, self.renderbuffer_colour);
        console_log!("{}│ renderbuffer_stencil: {:?}", prefix, self.renderbuffer_stencil);
        console_log!("{}│", prefix);
        console_log!("{}│ texture: {:?}", prefix, self.texture);
        console_log!("{}│", prefix);
        console_log!("{}│ framebuffer: {:?}", prefix, self.framebuffer);
        console_log!("{}│ is_bound: {}", prefix, self.is_bound);
    }
}








pub struct WebGl2framebufferManager {
    width: u32,
    height: u32,
    samples: u32,
    framebuffer_id_stack: Vec<usize>,
    framebuffer_store: Vec<WebGl2framebuffer>,
    texture_rendering_program: Option<WebGl2programConglomerate>,
}
impl WebGl2framebufferManager {
    pub fn new(width:u32, height:u32, samples:u32, context:&WebGl2RenderingContext, web_gl2_program_conglomerate_manager:&mut WebGl2programConglomerateManager) -> WebGl2framebufferManager {
        WebGl2framebufferManager {
            width: width,
            height: height,
            samples: samples,
            framebuffer_store: vec![],
            framebuffer_id_stack: vec![],
            texture_rendering_program: web_gl2_program_conglomerate_manager.load_program(
                &context,
                None,
                &VERTEX_SHADER_SOURCE,
                &FRAGMENT_SHADER_SOURCE,
                0,
                &VAO_NAMES,
                &[&VAO_POINTS],
                &VAO_GROUPING_SIZE,
                &UNIFORMS_TO_FIND,
                None,
            ),
        }
    }

    pub fn update_dimensions(&mut self, width:u32, height:u32) {
        self.width = width;
        self.height = height;
        for framebuffer in &mut self.framebuffer_store {
            framebuffer.update_dimensions(width, height);
        }
    }
    pub fn update_samples(&mut self, samples:u32) {
        self.samples = samples;
        for framebuffer in &mut self.framebuffer_store {
            framebuffer.update_samples(samples);
        }
    }

    pub fn generate_framebuffer(
        &mut self, 
        context:&WebGl2RenderingContext, 
        render_buffer_based: bool,
    ) -> usize {
        //unbind last framebuffer
            self.__unbind_last_framebuffer(context);

        //generation
            let id = self.framebuffer_store.len();
            let framebuffer = WebGl2framebuffer::new(context, id, self.width, self.height, self.samples, render_buffer_based);
            self.framebuffer_store.push(framebuffer);
            self.framebuffer_id_stack.push(id);
            id
    }

    fn __unbind_last_framebuffer(&mut self, _context:&WebGl2RenderingContext) {
        match self.framebuffer_id_stack.last() {
            None => {},
            Some(framebuffer_id) => {
                match self.framebuffer_store.get_mut(*framebuffer_id) {
                    None => console_error!("WebGl2framebufferManager.__unbind_last_framebuffer - unknown framebuffer with id framebuffer_id: {} while unbinding last framebuffer", framebuffer_id),
                    Some(framebuffer) => framebuffer.unbind(),
                }
            },
        }
    }

    pub fn bind_framebuffer(&mut self, context:&WebGl2RenderingContext, framebuffer_id:Option<usize>) {
        //unbind last framebuffer
            self.__unbind_last_framebuffer(context);

        //bind next framebuffer
            match framebuffer_id {
                None => {
                    for framebuffer_id in self.framebuffer_id_stack.iter().rev() {
                        match self.framebuffer_store.get_mut(*framebuffer_id) {
                            None => console_error!("WebGl2framebufferManager.bind_framebuffer - unknown framebuffer with id framebuffer_id: {} while unbinding all framebuffers", framebuffer_id),
                            Some(framebuffer) => framebuffer.unbind(),
                        }
                    }
                    context.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, None);
                    self.framebuffer_id_stack.clear();
                },
                Some(framebuffer_id) => {
                    if self.framebuffer_id_stack.len() != 0 {
                        if framebuffer_id == *self.framebuffer_id_stack.last().unwrap() {
                            console_error!("WebGl2framebufferManager.bind_framebuffer - double bind attempted for framebuffer with id framebuffer_id: {}", framebuffer_id);
                            return;
                        }
                    }

                    match self.framebuffer_store.get_mut(framebuffer_id) {
                        None => console_error!("WebGl2framebufferManager.bind_framebuffer - unknown framebuffer with id framebuffer_id: {}", framebuffer_id),
                        Some(framebuffer) => {
                            framebuffer.bind(context);
                            self.framebuffer_id_stack.push(framebuffer_id);
                        },
                    }
                },
            }
    }
    pub fn unbind_last_framebuffer(&mut self, context:&WebGl2RenderingContext) {
        match self.framebuffer_id_stack.pop() {
            None => {},
            Some(framebuffer_id) => self.framebuffer_store.get_mut(framebuffer_id).unwrap().unbind(),
        }

        match self.framebuffer_id_stack.last() {
            None => context.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, None),
            Some(last_framebuffer_id) => {
                match self.framebuffer_store.get_mut(*last_framebuffer_id) {
                    None => console_error!("WebGl2framebufferManager.unbind_last_framebuffer - unknown framebuffer with id last_framebuffer_id: {}", last_framebuffer_id),
                    Some(framebuffer) => framebuffer.bind(context),
                }
            },
        }
    }

    pub fn copy_framebuffer_to_framebuffer(&self, context:&WebGl2RenderingContext, framebuffer_id_a:usize, framebuffer_id_b:Option<usize>, web_gl2_program_conglomerate_manager:&mut WebGl2programConglomerateManager) {
        match self.framebuffer_store.get(framebuffer_id_a) {
            None => console_error!("WebGl2framebufferManager.copy_framebuffer_to_framebuffer - unknown framebuffer with id framebuffer_id_a: {}", framebuffer_id_a),
            Some(framebuffer_a) => {
                match framebuffer_id_b {
                    None => framebuffer_a.copy_to(context, self.texture_rendering_program.as_ref(), None, web_gl2_program_conglomerate_manager),
                    Some(framebuffer_id_b) => {
                        match self.framebuffer_store.get(framebuffer_id_b) {
                            None => console_error!("WebGl2framebufferManager.copy_framebuffer_to_framebuffer - unknown framebuffer with id framebuffer_id_b: {}", framebuffer_id_b),
                            Some(framebuffer_b) => framebuffer_a.copy_to(context, self.texture_rendering_program.as_ref(), Some(framebuffer_b), web_gl2_program_conglomerate_manager),
                        }
                    },
                }
            },
        }
    }
    pub fn copy_current_framebuffer_to_upper_framebuffer(&self, context:&WebGl2RenderingContext, web_gl2_program_conglomerate_manager:&mut WebGl2programConglomerateManager) {
        let upper_framebuffer_id = if self.framebuffer_id_stack.len() == 1 {
            None
        } else {
            Some(*self.framebuffer_id_stack.get(self.framebuffer_id_stack.len()-2).unwrap())
        };

        self.copy_framebuffer_to_framebuffer(
            context,
            *self.framebuffer_id_stack.last().unwrap(),
            upper_framebuffer_id,
            web_gl2_program_conglomerate_manager,
        );
    }
}
impl WebGl2framebufferManager {
    pub fn _dump(&self, prefix:Option<&str>) {
        let prefix = prefix.unwrap_or("");

        console_log!("{}┌─WebGl2framebufferManager Dump─", prefix);
        console_log!("{}│ width: {}", prefix, self.width);
        console_log!("{}│ height: {}", prefix, self.height);
        console_log!("{}│ samples: {}", prefix, self.samples);
        console_log!("{}│ framebuffer_id_stack: {:?}", prefix, self.framebuffer_id_stack);        
        console_log!("{}│ framebuffer_store (count:{})", prefix, self.framebuffer_store.len());
        for (key, item) in self.framebuffer_store.iter().enumerate() {
            console_log!("{}│ ┌ {}", prefix, key);
            item._dump( Some(&format!("{}│ ", prefix)) );
        }
        if self.framebuffer_store.len() > 0 { 
            console_log!("{}│ └", prefix);
        }

        console_log!("{}│ texture_rendering_program:", prefix);
        self.texture_rendering_program.as_ref().unwrap()._dump(Some(&format!("{}│ ", prefix)));
        console_log!("{}└───────────────────────────────", prefix);
    }
}