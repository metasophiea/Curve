#![allow(non_snake_case)]
#![allow(dead_code)]

//rust

//wasm
    use wasm_bindgen::prelude::*;
    use web_sys::{
        WebGl2RenderingContext, 
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