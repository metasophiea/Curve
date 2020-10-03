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
        ImageBitmap,
    };

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn error(a: &str);
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