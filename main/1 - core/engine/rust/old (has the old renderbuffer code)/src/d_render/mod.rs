#![allow(non_snake_case)]

//rust

//wasm
    use wasm_bindgen::prelude::*;
    use wasm_bindgen::JsCast;
    use web_sys::{
        WebGl2RenderingContext,
        OffscreenCanvas,
    };

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a:&str);
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }

//core
    use crate::engine::Engine;
    use crate::interface;
    use crate::a_library::data_type::{
        Colour,
        Viewbox,
    };
    use crate::a_library::structure::{
        WebGl2programConglomerateManager,
        WebGl2framebufferManager,
        ImageRequester,
    };
    use crate::b_element::ElementManager;
    use crate::c_arrangement::Arrangement;
    use crate::f_stats::Stats;
    







pub struct Render {
    web_gl2_program_conglomerate_manager: WebGl2programConglomerateManager,
    web_gl2_framebuffer_manager: WebGl2framebufferManager,
    image_requester: ImageRequester,

    canvas: OffscreenCanvas,
    context: WebGl2RenderingContext,

    clear_colour: Colour,

    devicePixelRatio: f32,
    defaultCanvasSize_width: u32, 
    defaultCanvasSize_height: u32,
    currentCanvasSize_width: u32, 
    currentCanvasSize_height: u32,
}
impl Render {
    pub fn new() -> Render {
        let canvas = web_sys::OffscreenCanvas::new(800,600).unwrap();
        let context = canvas.get_context_with_context_options(
            "webgl2",
            &js_sys::JSON::parse("{
                \"alpha\":false, 
                \"preserveDrawingBuffer\":false, 
                \"stencil\":false,
                \"antialias\":false
            }").unwrap()
        ).unwrap().unwrap().dyn_into::<WebGl2RenderingContext>().unwrap();

        context.enable(WebGl2RenderingContext::BLEND);
        context.blend_func(WebGl2RenderingContext::ONE, WebGl2RenderingContext::ONE_MINUS_SRC_ALPHA);

        let mut web_gl2_program_conglomerate_manager = WebGl2programConglomerateManager::new();
        let web_gl2_framebuffer_manager = WebGl2framebufferManager::new(800,600,8,&context,&mut web_gl2_program_conglomerate_manager);

        Render {
            web_gl2_program_conglomerate_manager: web_gl2_program_conglomerate_manager,
            web_gl2_framebuffer_manager: web_gl2_framebuffer_manager,
            image_requester: ImageRequester::new(),

            canvas: canvas,
            context: context,

            clear_colour: Colour::new(1.0,1.0,1.0,1.0),

            devicePixelRatio: 1.0,
            defaultCanvasSize_width: 800, 
            defaultCanvasSize_height: 600,
            currentCanvasSize_width: 800, 
            currentCanvasSize_height: 600,
        }
    }

    //canvas and webGL context
        pub fn get_clear_colour(&self) -> &Colour {
            &self.clear_colour
        }
        pub fn set_clear_colour(&mut self, colour:Colour){ 
            self.clear_colour = colour;
        }
        pub fn adjust_canvas_size(&mut self, worker:&web_sys::Worker, arg_width:Option<u32>, arg_height:Option<u32>, arg_devicePixelRatio:Option<f32>) {
            self.currentCanvasSize_width = arg_width.unwrap_or( self.defaultCanvasSize_width );
            self.currentCanvasSize_height = arg_height.unwrap_or( self.currentCanvasSize_height );
            self.devicePixelRatio = arg_devicePixelRatio.unwrap_or( self.devicePixelRatio );
            
            self.currentCanvasSize_width = ( self.currentCanvasSize_width as f32 * self.devicePixelRatio ) as u32;
            self.currentCanvasSize_height = ( self.currentCanvasSize_height as f32 * self.devicePixelRatio ) as u32;

            self.canvas.set_width( self.currentCanvasSize_width );
            self.canvas.set_height( self.currentCanvasSize_height );
            self.web_gl2_framebuffer_manager.update_dimensions(self.currentCanvasSize_width, self.currentCanvasSize_height);

            self.refresh_coordinates(worker);
        }
        pub fn adjust_canvas_sample_count(&mut self, sample_count:u32) {
            self.web_gl2_framebuffer_manager.update_samples(sample_count);
        }
        pub fn get_canvas_size(&self) -> (u32,u32) {
            (
                (self.currentCanvasSize_width as f32 / self.devicePixelRatio) as u32, 
                (self.currentCanvasSize_height as f32 / self.devicePixelRatio) as u32
            )
        }
        pub fn refresh_coordinates(&mut self, worker:&web_sys::Worker) {
            let w = self.canvas.width() as f32;
            let h = self.canvas.height() as f32;

            let x = 0;
            let y = -(((self.devicePixelRatio - 1.0) * h) as i32);
            let width = (w * self.devicePixelRatio) as i32;
            let height = (h * self.devicePixelRatio) as i32;

            self.context.viewport(x, y, width, height);

            //update the main canvas
                interface::send_message(
                    worker, "setCanvasSize",
                    &js_sys::Array::of2(
                        &JsValue::from_f64( (w / self.devicePixelRatio) as f64 ),
                        &JsValue::from_f64( (h / self.devicePixelRatio) as f64 ),
                    )
                );
        }
        pub fn refresh(&mut self, worker:&web_sys::Worker, arg_width:Option<u32>, arg_height:Option<u32>, devicePixelRatio:Option<f32>) {
            self.set_clear_colour(*self.get_clear_colour());
            self.adjust_canvas_size(worker, arg_width, arg_height, devicePixelRatio);
        }

    //actual render
        pub fn frame(
            &mut self, 
            worker: &web_sys::Worker,
            noClear: bool,
            element_manager: &ElementManager,
            arrangement: &Arrangement,
            viewbox: &Viewbox,
            stats: &mut Stats,
        ) {
            //check if frame needs to be rendered at all
                if !element_manager.get_element_by_id_mut(arrangement.get_root_element_id()).unwrap().as_group().unwrap().get_render_required() {
                    if stats.get_active() { stats.render_frame_register_skip(true); }
                    return
                }
                stats.render_frame_register_skip(false);

            //clear frame
                if !noClear {
                    self.context.clear_color(self.clear_colour.r(), self.clear_colour.g(), self.clear_colour.b(), self.clear_colour.a());
                    self.context.clear(
                        WebGl2RenderingContext::COLOR_BUFFER_BIT | 
                        WebGl2RenderingContext::STENCIL_BUFFER_BIT
                    );
                }
                
            //activate render
                element_manager.get_element_by_id_mut(arrangement.get_root_element_id()).unwrap().render(
                    None,
                    false,
                    viewbox,
                    &self.context,
                    &mut self.web_gl2_program_conglomerate_manager,
                    &mut self.web_gl2_framebuffer_manager,
                    &mut self.image_requester,
                    &(self.currentCanvasSize_width, self.currentCanvasSize_height),
                    false,
                    stats,
                );

            // //optional draw of viewbox dot frame
            //     if !false {
            //         for point in viewbox.get_polygon().get_points() {
            //             ElementManager::draw_dot(
            //                 &point, 10.0, &Colour::new(1.0,0.0,0.0,1.0), 
            //                 None, None, &viewbox.get_offset(),
            //                 viewbox, &self.context, &mut self.web_gl2_program_conglomerate_manager, 
            //                 &mut self.image_requester,
            //                 &(self.currentCanvasSize_width, self.currentCanvasSize_height),
            //             );
            //         }
            //     }

            //transfer rendering out
                let transferable_canvas = self.canvas.transfer_to_image_bitmap().unwrap().into();
                let transferable_canvas_array = &js_sys::Array::of1(&transferable_canvas);
                interface::send_message_with_transfer(
                    worker, "frame",
                    transferable_canvas_array,
                    transferable_canvas_array,
                );
        }

    pub fn _dump(&self) {
        console_log!("┌─Engine Render Dump─");
        console_log!("│ canvas: {:?}", self.canvas);
        console_log!("│ context: {:?}", self.context);
        console_log!("│ clear_colour: {}", self.clear_colour);
        console_log!("│");
        console_log!("│ devicePixelRatio: {}", self.devicePixelRatio);
        console_log!("│ defaultCanvasSize_width: {}", self.defaultCanvasSize_width);
        console_log!("│ defaultCanvasSize_height: {}", self.defaultCanvasSize_height);
        let (w,h) = self.get_canvas_size();
        console_log!("│ currentCanvasSize_width: {} (apparent: {})", self.currentCanvasSize_width, w);
        console_log!("│ currentCanvasSize_height: {} (apparent: {})", self.currentCanvasSize_height, h);
        console_log!("│");
        self.web_gl2_program_conglomerate_manager._dump( Some("│ ") );
        console_log!("│");
        self.web_gl2_framebuffer_manager._dump( Some("│ ") );
        console_log!("└────────────────────");
    }
}








//render
    #[wasm_bindgen]
    impl Engine {
        //canvas and webGL context adjustment
            pub fn render__get_clear_colour(&self) -> js_sys::Object {
                Colour::to_js_sys_object(&self.render.get_clear_colour())
            }
            pub fn render__set_clear_colour(&mut self, new_colour:js_sys::Object) {
                self.render.set_clear_colour(
                    Colour::from_js_sys_object(&new_colour)
                );
            }
            pub fn render__adjust_canvas_size(&mut self, width:u32, height:u32, devicePixelRatio:f32) {
                self.render.adjust_canvas_size( &self.worker, Some(width),Some(height),Some(devicePixelRatio) );
            }
            pub fn render__adjust_canvas_sample_count(&mut self, sample_count:u32) {
                self.render.adjust_canvas_sample_count(sample_count);
            }
            pub fn render__get_canvas_size(&self) -> js_sys::Object {
                let tmp = self.render.get_canvas_size();

                let output = js_sys::Object::new();
                js_sys::Reflect::set( &output, &JsValue::from_str("width"), &JsValue::from_f64(tmp.0 as f64) ).unwrap();
                js_sys::Reflect::set( &output, &JsValue::from_str("height"), &JsValue::from_f64(tmp.1 as f64) ).unwrap();
                output
            }
            pub fn render__refresh_coordinates(&mut self) {
                self.render.refresh_coordinates( &self.worker );
            }
            pub fn render__refresh(&mut self, arg_width:Option<u32>, arg_height:Option<u32>, devicePixelRatio:Option<f32>) {
                self.render.refresh( &self.worker, arg_width, arg_height, devicePixelRatio );
            }
        //actual render
            pub fn render__frame(&mut self, no_clear:bool) {
                self.render.frame(
                    &self.worker,
                    no_clear,
                    &self.element_manager,
                    &self.arrangement,
                    &self.viewport.get_viewbox(),
                    &mut self.stats,
                );
            }
        //misc
            pub fn render__dump(&self) {
                self.render._dump();
            }
    }
