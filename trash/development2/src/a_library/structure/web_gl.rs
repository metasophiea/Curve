#![allow(non_snake_case)]
#![allow(dead_code)]

//rust
    use std::collections::HashMap;

//wasm
    use wasm_bindgen::prelude::*;
    use web_sys::{
        WebGlProgram,
        WebGlVertexArrayObject,
        WebGlUniformLocation,
        WebGl2RenderingContext, 
        WebGlShader,
        WebGlTexture,
        WebGlFramebuffer,
        WebGlRenderbuffer,
        ImageBitmap,
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
    use crate::a_library::data_type::ElementType;







struct WebGl2programConglomerate {
    program: WebGlProgram,
    uniforms: Vec<WebGlUniformLocation>,
    VAO_store: Vec<WebGlVertexArrayObject>,
    texture_registry: HashMap<String,usize>,
    texture_store: Vec<WebGlTexture>,
}
impl WebGl2programConglomerate {
    pub fn new(
        program:WebGlProgram,
        uniforms:Vec<WebGlUniformLocation>,
    ) -> WebGl2programConglomerate {
        WebGl2programConglomerate {
            program,
            uniforms,
            VAO_store: vec![],
            texture_registry: HashMap::new(),
            texture_store: vec![],
        }
    }

    pub fn get_program(&self) -> &WebGlProgram {
        &self.program
    }
    pub fn get_uniforms(&self) -> &Vec<WebGlUniformLocation> {
        &self.uniforms
    }

    pub fn generate_new_VAO_id(&mut self) -> usize {
        self.VAO_store.len()
    }
    pub fn add_VAO(&mut self, context:&WebGl2RenderingContext, id:usize, new:WebGlVertexArrayObject) {
        match self.VAO_store.get(id) {
            Some(VAO) => {
                context.delete_vertex_array( Some(VAO) );
                self.VAO_store[id] = new;
            },
            None => {
                if id == self.VAO_store.len() {
                    self.VAO_store.push(new);
                } else {
                    console_error!("WebGl2programConglomerate.add_VAO - selected id ({}), is a position beyond the size of the stored VAO array ({})", id, self.VAO_store.len());
                }
            },
        }
    }
    pub fn bind_VAO(&self, context:&WebGl2RenderingContext, id:usize) {
        match self.VAO_store.get(id) {
            Some(VAO) => context.bind_vertex_array( Some(&VAO) ),
            None => console_error!("WebGl2programConglomerate.bind_VAO - no VAO found with id {}", id),
        }
    }

    pub fn has_texture(&self, id:&String) -> bool {
        self.texture_registry.contains_key(id)
    }
    pub fn get_texture_index(&self, id:&String) -> Option<&usize> {
        self.texture_registry.get(id)
    }
    pub fn add_texture(&mut self, context:&WebGl2RenderingContext, id:&String, new:WebGlTexture) -> usize {
        match self.texture_registry.get(id) {
            Some(texture_index) => {
                context.delete_texture( Some(&self.texture_store[*texture_index]) );
                self.texture_store[*texture_index] = new;
                *texture_index
            },
            None => {
                self.texture_registry.insert(id.to_string(), self.texture_store.len());
                self.texture_store.push( new );
                self.texture_store.len() - 1
            },
        }
    }
    pub fn bind_texture(&self, context:&WebGl2RenderingContext, index:usize) {
        context.bind_texture( WebGl2RenderingContext::TEXTURE_2D, Some(&self.texture_store[index]) )
    }

    pub fn _dump(&self, prefix:Option<&str>) {
        let prefix = prefix.unwrap_or("");

        console_log!("{}│ program: {:?}", prefix, self.program);
        console_log!("{}│ uniforms ({})", prefix, self.uniforms.len());
        for (index, item) in self.uniforms.iter().enumerate() {
            console_log!("{}│   {} > {:?}", prefix, index, item);
        }
        console_log!("{}│ VAO_store ({})", prefix, self.VAO_store.len());
        for (index, item) in self.VAO_store.iter().enumerate() {
            console_log!("{}│   {} > {:?}", prefix, index, item);
        }
        console_log!("{}│ texture_registry: ({})", prefix, self.texture_store.len());
        for (key, value) in self.texture_registry.iter() {
            console_log!("{}│   {} > {:?}", prefix, key, value);
        }
        console_log!("{}│ texture_store: ({})", prefix, self.texture_store.len());
        for (index, item) in self.texture_store.iter().enumerate() {
            console_log!("{}│   {} > {:?}", prefix, index, item);
        }
    }
}




pub struct WebGl2programConglomerateManager {
    program_store: HashMap<ElementType, WebGl2programConglomerate>,
    currently_active_program: ElementType,
}
impl WebGl2programConglomerateManager {
    fn compile_program(
        context:&WebGl2RenderingContext, 
        vertex_shader_source:&str, 
        fragment_shader_source:&str
    ) -> Option<WebGlProgram> {
        fn create_shader(
            context:&WebGl2RenderingContext, 
            shader_type:u32, 
            source:&str
        ) -> Option<WebGlShader> {
            let shader = match context.create_shader(shader_type) {
                Some(a) => a,
                None => {
                    console_error!("WebGl2programConglomerateManager::compile_program::create_shader({:?},{},{})", context, shader_type, source);
                    console_error!("create_shader error");
                    return None;
                },
            };
            context.shader_source(&shader, &source);
            context.compile_shader(&shader);
            let successful_compile = context.get_shader_parameter(&shader, WebGl2RenderingContext::COMPILE_STATUS).as_bool().unwrap_or(false);

            if successful_compile {
                return Some(shader);
            }

            console_error!("major error in core\'s {} shader creation", shader_type);
            console_error!("{}", context.get_shader_info_log(&shader).unwrap() );
            context.delete_shader(Some(&shader));

            None
        }

        let vertex_shader = match create_shader( &context, WebGl2RenderingContext::VERTEX_SHADER, &vertex_shader_source ) {
            Some(a) => a,
            None => {
                console_error!("WebGl2programConglomerateManager::compile_program({:?},{},{})", context, vertex_shader_source, fragment_shader_source);
                console_error!("error creating vertex shader");
                return None;
            },
        };
        let fragment_shader = match create_shader( &context, WebGl2RenderingContext::FRAGMENT_SHADER, &fragment_shader_source ) {
            Some(a) => a,
            None => {
                console_error!("WebGl2programConglomerateManager::compile_program({:?},{},{})", context, vertex_shader_source, fragment_shader_source);
                console_error!("error creating fragment shader");
                return None;
            },
        };

        let program = match context.create_program() {
            Some(a) => a,
            None => {
                console_error!("WebGl2programConglomerateManager::compile_program({:?},{},{})", context, vertex_shader_source, fragment_shader_source);
                console_error!("error creating program");
                return None;
            },
        };
        context.attach_shader(&program, &vertex_shader);
        context.attach_shader(&program, &fragment_shader);
        context.link_program(&program);
        let successful_compile = context.get_program_parameter(&program, WebGl2RenderingContext::LINK_STATUS).as_bool().unwrap();
        if !successful_compile {
            console_error!("WebGl2programConglomerateManager::compile_program({:?},{},{})", context, vertex_shader_source, fragment_shader_source);
            console_error!("error linking program");
            console_error!("{}", context.get_program_info_log(&program).unwrap() );
            None
        } else {
            Some(program)
        }
    }

    fn generate_VAO(
        context:&WebGl2RenderingContext, 
        program:&WebGlProgram, 

        VAO_names: &'static[&'static str],
        VAO_points: &[&[f32]],
        VAO_grouping_size: &[i32],
    ) -> WebGlVertexArrayObject {
        let VAO = context.create_vertex_array().unwrap();
        context.bind_vertex_array( Some(&VAO) );

        for ((name, points), grouping_size) in VAO_names.iter().zip(VAO_points).zip(VAO_grouping_size) {
            let attribute_location = context.get_attrib_location(&program, name) as u32;
            let buffer = context.create_buffer().unwrap();

            context.enable_vertex_attrib_array(attribute_location);
            context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&buffer));
            context.vertex_attrib_pointer_with_f64( attribute_location, *grouping_size, WebGl2RenderingContext::FLOAT, false, 0, 0.0 );
            unsafe {
                let vert_array = js_sys::Float32Array::view(points);
                context.buffer_data_with_array_buffer_view( WebGl2RenderingContext::ARRAY_BUFFER, &vert_array, WebGl2RenderingContext::STATIC_DRAW );
            }
        }
        
        VAO
    }

    fn collect_uniform_locations(
        context:&WebGl2RenderingContext, 
        program:&WebGlProgram, 
        uniforms_to_find:&[&'static str]
    ) -> Vec<WebGlUniformLocation> {
        let mut uniforms:Vec<WebGlUniformLocation> = vec![];
        for uniform_name in uniforms_to_find {
            match context.get_uniform_location(&program, uniform_name) {
                Some(location) => {
                    uniforms.push( location );
                },
                None => {
                    console_warn!("major error! location \"{}\" not found!", uniform_name);
                }
            }
        }

        uniforms
    }

    fn convert_bitmap_to_texture(
        context:&WebGl2RenderingContext, 
        image_bitmap:&ImageBitmap
    ) -> Option<WebGlTexture> {
        let texture = context.create_texture();

        if texture.is_none() {
            console_error!("WebGl2programConglomerateManager::convert_bitmap_to_texture - could not create texture");
            return None;
        }

        context.bind_texture(WebGl2RenderingContext::TEXTURE_2D, texture.as_ref());
        context.tex_parameteri(WebGl2RenderingContext::TEXTURE_2D, WebGl2RenderingContext::TEXTURE_WRAP_S, WebGl2RenderingContext::CLAMP_TO_EDGE as i32 );
        context.tex_parameteri(WebGl2RenderingContext::TEXTURE_2D, WebGl2RenderingContext::TEXTURE_WRAP_T, WebGl2RenderingContext::CLAMP_TO_EDGE as i32 );
        context.tex_parameteri( WebGl2RenderingContext::TEXTURE_2D, WebGl2RenderingContext::TEXTURE_MIN_FILTER, WebGl2RenderingContext::NEAREST_MIPMAP_LINEAR as i32 );
        context.tex_parameteri(WebGl2RenderingContext::TEXTURE_2D, WebGl2RenderingContext::TEXTURE_MAG_FILTER, WebGl2RenderingContext::NEAREST as i32 );

        match context.tex_image_2d_with_u32_and_u32_and_image_bitmap(
            WebGl2RenderingContext::TEXTURE_2D, 
            0, 
            WebGl2RenderingContext::RGBA as i32, 
            WebGl2RenderingContext::RGBA, 
            WebGl2RenderingContext::UNSIGNED_BYTE, 
            &image_bitmap,
        ) {
            Ok(_) => {},
            Err(msg) => {
                console_error!("WebGl2programConglomerateManager::convert_bitmap_to_texture - could not pass texture to storage");
                console_error!("{:?}", msg);
            },
        }

        context.generate_mipmap( WebGl2RenderingContext::TEXTURE_2D );

        texture
    }
}
impl WebGl2programConglomerateManager {
    pub fn new() -> WebGl2programConglomerateManager {
        WebGl2programConglomerateManager {
            program_store: HashMap::new(),
            currently_active_program: ElementType::Group, //(Group doesn't have a rendering program)
        }
    }

    pub fn program_is_loaded(&self, element_type: ElementType) -> bool {
        self.program_store.contains_key(&element_type)
    }

    pub fn load_program(
        &mut self, 
        context: &WebGl2RenderingContext, 
        element_type: ElementType, 

        vertex_shader_source: &str, 
        fragment_shader_source: &str,

        VAO_id: usize,
        VAO_names: &'static[&'static str],
        VAO_points: &[&[f32]],
        VAO_grouping_sizes: &[i32],

        uniforms_to_find: &[&'static str],

        texture_index: Option<usize>,
    ) {
        //generate program conglomerate if one hasn't been created already
            match self.program_store.get(&element_type) {
                Some(program) => { //one is already made
                    //load program
                        context.use_program(Some(&program.program));
                        self.currently_active_program = element_type;
                    //bind VAO
                        program.bind_VAO(context, VAO_id);
                    //bind texture
                        match texture_index {
                            None => {},
                            Some(index) => program.bind_texture(context, index),
                        }
                },
                None => { //creating new program conglomerate
                    //compile programs
                        let program = match WebGl2programConglomerateManager::compile_program(context, vertex_shader_source, fragment_shader_source) {
                            Some(a) => a,
                            None => {
                                console_error!(
                                    "WebGl2programConglomerateManager.load_program({:?},{},{},{},{:?},{:?},{:?},{:?})", 
                                    context, element_type, vertex_shader_source, fragment_shader_source,
                                    VAO_names, VAO_points, VAO_grouping_sizes, uniforms_to_find,
                                );
                                console_error!("error compiling program");
                                return;
                            },
                        };
                        context.use_program(Some(&program));
                        self.currently_active_program = element_type;
                    //collect uniform locations
                        let uniforms = WebGl2programConglomerateManager::collect_uniform_locations( context, &program, &uniforms_to_find );
                    //generate VAO
                        let VAO = WebGl2programConglomerateManager::generate_VAO(
                            context, &program, VAO_names, VAO_points, VAO_grouping_sizes
                        );
                    //generate program conglomerate
                        let mut program_conglomerate = WebGl2programConglomerate::new( program, uniforms );
                    //add the VAO to the program conglomerate
                        program_conglomerate.add_VAO(context, VAO_id, VAO);
                    //store program conglomerate
                        self.program_store.insert( element_type, program_conglomerate );
                }
            }
    }

    pub fn generate_new_VAO_id(
        &mut self,
        element_type: &ElementType, 
    ) -> usize {
        match self.program_store.get_mut(element_type) {
            Some(program) => program.generate_new_VAO_id(),
            None => 0,
        }
    }

    pub fn update_VAO(
        &mut self,
        context: &WebGl2RenderingContext, 
        element_type: ElementType, 
        id: usize,
        VAO_names: &'static[&'static str],
        VAO_points: &[&[f32]],
        VAO_grouping_sizes: &[i32],
    ){
        let program = match self.program_store.get(&element_type) {
            Some(a) => a,
            None => {
                console_error!("WebGl2programConglomerateManager.update_VAO - no program for this element type: {}", element_type);
                return;
            }
        };

        let new_VAO = WebGl2programConglomerateManager::generate_VAO(
            context,
            program.get_program(),
            VAO_names,
            VAO_points,
            VAO_grouping_sizes,
        );
        self.program_store.get_mut(&element_type).unwrap().add_VAO(context, id, new_VAO);
    }
    pub fn update_texture(
        &mut self,
        context: &WebGl2RenderingContext, 
        element_type: ElementType, 
        id: &String,
        image_bitmap: &ImageBitmap,
        force: bool,
    ) -> Option<usize> {
        let program = match self.program_store.get_mut(&element_type) {
            Some(a) => a,
            None => {
                console_error!("WebGl2programConglomerateManager.update_texture - no program for this element type: {}", element_type);
                return None;
            }
        };

        if !force {
            match program.get_texture_index(id) {
                Some(index) => { 
                    program.bind_texture(context,*index);
                    return Some(*index);
                },
                None => {},
            }
        }

        match WebGl2programConglomerateManager::convert_bitmap_to_texture( context, image_bitmap ) {
            None => None,
            Some(texture) => {
                Some( program.add_texture( context, id, texture ) )
            }
        }
    }

    pub fn get_uniform_locations(&self, element_type: ElementType) -> Option<&Vec<WebGlUniformLocation>> {
        match self.program_store.get(&element_type) {
            Some(a) => Some(&a.get_uniforms()),
            None => None,
        }
    }
}
impl WebGl2programConglomerateManager {
    pub fn _dump(&self, prefix:Option<&str>) {
        let prefix = prefix.unwrap_or("");

        console_log!("{}┌─WebGl2programConglomerateManager Dump─", prefix);
        console_log!("{}│ currently_active_program: {}", prefix, self.currently_active_program);
        console_log!("{}│ program_store (count:{})", prefix, self.program_store.len());
        for (key, item) in &self.program_store {
            console_log!("{}│ ┌ {}", prefix, key);
            item._dump( Some(&format!("{}│ ", prefix)) );
        }
        console_log!("{}└───────────────────────────────────────", prefix);
    }
}
















struct WebGl2framebuffer {
    id: usize,
    dimensions_changed: bool,
    width: u32,
    height: u32,
    renderbuffer_colour: WebGlRenderbuffer,
    renderbuffer_stencil: WebGlRenderbuffer,
    framebuffer: WebGlFramebuffer,
    is_bound: bool,
}
impl WebGl2framebuffer {
    fn produce_and_bind_renderbuffers(context:&WebGl2RenderingContext, width:u32, hight:u32) -> (WebGlRenderbuffer, WebGlRenderbuffer) {
        let renderbuffer_colour = context.create_renderbuffer().unwrap();
        context.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, Some(&renderbuffer_colour));
        context.renderbuffer_storage(
            WebGl2RenderingContext::RENDERBUFFER,
            WebGl2RenderingContext::RGBA8,
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
        context.renderbuffer_storage(
            WebGl2RenderingContext::RENDERBUFFER,
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
    pub fn new(context:&WebGl2RenderingContext, id:usize, width:u32, height:u32) -> WebGl2framebuffer {
        let framebuffer = context.create_framebuffer().unwrap();
        context.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, Some(&framebuffer));
        let (renderbuffer_colour, renderbuffer_stencil) = WebGl2framebuffer::produce_and_bind_renderbuffers(context, width, height);

        WebGl2framebuffer {
            id: id,
            dimensions_changed: false,
            width: width,
            height: height,
            renderbuffer_colour: renderbuffer_colour,
            renderbuffer_stencil: renderbuffer_stencil,
            framebuffer: framebuffer,
            is_bound: true,
        }
    }
}
impl WebGl2framebuffer {
    pub fn update_dimensions(&mut self, width:u32, height:u32) {
        self.width = width;
        self.height = height;
        self.dimensions_changed = true;
    }
    pub fn bind(&mut self, context:&WebGl2RenderingContext) {
        if self.is_bound {
            console_error!("{} WebGl2framebuffer.bind - framebuffer already bound!", self.id);
            return;
        }
        context.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, Some(&self.framebuffer));
        self.is_bound = true;

        if self.dimensions_changed {
            context.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, Some(&self.renderbuffer_colour));
            context.renderbuffer_storage(
                WebGl2RenderingContext::RENDERBUFFER,
                WebGl2RenderingContext::RGBA8,
                self.width as i32, 
                self.height as i32,
            );
            context.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, Some(&self.renderbuffer_stencil));
            context.renderbuffer_storage(
                WebGl2RenderingContext::RENDERBUFFER,
                WebGl2RenderingContext::STENCIL_INDEX8,
                self.width as i32, 
                self.height as i32,
            );
        }
    }
    pub fn unbind(&mut self) {
        if !self.is_bound {
            console_error!("{} WebGl2framebuffer.bind - framebuffer already unbound!", self.id);
            return;
        }
        self.is_bound = false;
    }
    pub fn copy_to(&self, context:&WebGl2RenderingContext, other:Option<&WebGl2framebuffer>) {
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
                context.bind_framebuffer( WebGl2RenderingContext::DRAW_FRAMEBUFFER, Some(&framebuffer.framebuffer) );
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
    }
}
impl WebGl2framebuffer {
    pub fn _dump(&self, prefix:Option<&str>) {
        let prefix = prefix.unwrap_or("");

        console_log!("{}│ id: {}", prefix, self.id);
        console_log!("{}│ dimensions_changed: {}", prefix, self.dimensions_changed);
        console_log!("{}│ width: {}", prefix, self.width);
        console_log!("{}│ height: {}", prefix, self.height);
        console_log!("{}│ renderbuffer_colour: {:?}", prefix, self.renderbuffer_colour);
        console_log!("{}│ renderbuffer_stencil: {:?}", prefix, self.renderbuffer_stencil);
        console_log!("{}│ framebuffer: {:?}", prefix, self.framebuffer);
        console_log!("{}│ is_bound: {}", prefix, self.is_bound);
    }
}




pub struct WebGl2framebufferManager {
    width: u32,
    height: u32,
    framebuffer_store: Vec<WebGl2framebuffer>,
    framebuffer_id_stack: Vec<usize>,
}
impl WebGl2framebufferManager {
    pub fn new(width:u32, height:u32) -> WebGl2framebufferManager {
        WebGl2framebufferManager {
            width: width,
            height: height,
            framebuffer_store: vec![],
            framebuffer_id_stack: vec![],
        }
    }

    pub fn update_dimensions(&mut self, width:u32, height:u32) {
        self.width = width;
        self.height = height;
        for framebuffer in &mut self.framebuffer_store {
            framebuffer.update_dimensions(width, height);
        }
    }

    pub fn generate_framebuffer(&mut self, context:&WebGl2RenderingContext) -> usize {
        //unbind last framebuffer
            self.__unbind_last_framebuffer(context);

        //generation
            let id = self.framebuffer_store.len();
            let framebuffer = WebGl2framebuffer::new(context, id, self.width, self.height);
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

    pub fn copy_framebuffer_to_framebuffer(&self, context:&WebGl2RenderingContext, framebuffer_id_a:usize, framebuffer_id_b:Option<usize>) {
        match self.framebuffer_store.get(framebuffer_id_a) {
            None => console_error!("WebGl2framebufferManager.copy_framebuffer_to_framebuffer - unknown framebuffer with id framebuffer_id_a: {}", framebuffer_id_a),
            Some(framebuffer_a) => {
                match framebuffer_id_b {
                    None => framebuffer_a.copy_to(context, None),
                    Some(framebuffer_id_b) => {
                        match self.framebuffer_store.get(framebuffer_id_b) {
                            None => console_error!("WebGl2framebufferManager.copy_framebuffer_to_framebuffer - unknown framebuffer with id framebuffer_id_b: {}", framebuffer_id_b),
                            Some(framebuffer_b) => framebuffer_a.copy_to(context, Some(framebuffer_b)),
                        }
                    },
                }
            },
        }
    }
    pub fn copy_current_framebuffer_to_upper_framebuffer(&self, context:&WebGl2RenderingContext) {
        if self.framebuffer_id_stack.len() == 0 {
            console_error!("WebGl2framebufferManager.copy_current_framebuffer_to_upper_framebuffer - framebuffer_id_stack is empty?");
            return;
        }

        let upper_framebuffer_id = if self.framebuffer_id_stack.len() == 1 {
            None
        } else {
            Some(*self.framebuffer_id_stack.get(self.framebuffer_id_stack.len()-2).unwrap())
        };

        self.copy_framebuffer_to_framebuffer(
            context,
            *self.framebuffer_id_stack.last().unwrap(),
            upper_framebuffer_id,
        );
    }
}
impl WebGl2framebufferManager {
    pub fn _dump(&self, prefix:Option<&str>) {
        let prefix = prefix.unwrap_or("");

        console_log!("{}┌─WebGl2framebufferManager Dump─", prefix);
        console_log!("{}│ width: {}", prefix, self.width);
        console_log!("{}│ height: {}", prefix, self.height);
        console_log!("{}│ framebuffer_id_stack: {:?}", prefix, self.framebuffer_id_stack);        
        console_log!("{}│ framebuffer_store (count:{})", prefix, self.framebuffer_store.len());
        for (key, item) in self.framebuffer_store.iter().enumerate() {
            console_log!("{}│ ┌ {}", prefix, key);
            item._dump( Some(&format!("{}│ ", prefix)) );
        }
        console_log!("{}└───────────────────────────────", prefix);
    }
}