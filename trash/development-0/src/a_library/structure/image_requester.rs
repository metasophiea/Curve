//rust
    use std::collections::HashMap;

//wasm
    use wasm_bindgen::prelude::*;
    
    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = ["operator", "library", "imageRequester"])]
        fn isImageLoaded(url:&str) -> bool;
        #[wasm_bindgen(js_namespace = ["operator", "library", "imageRequester"])]
        fn loadImage(url:&str, force_reload:bool);
        #[wasm_bindgen(js_namespace = ["operator", "library", "imageRequester"])]
        fn getImageData(url:&str) -> Option<web_sys::ImageBitmap>;
    }

//core









#[derive(PartialEq, Copy, Clone)]
enum ImageStatus {
    Requested,
    Loaded,
}



struct Image {
    status: ImageStatus,
    bitmap: Option<web_sys::ImageBitmap>,
}
impl Image {
    pub fn new(
        status: ImageStatus,
        bitmap: Option<web_sys::ImageBitmap>,
    ) -> Image {
        Image {
            status,
            bitmap,
        }
    }
    pub fn get_status(&self) -> ImageStatus {
        self.status
    }
    pub fn get_bitmap(&self) -> Option<&web_sys::ImageBitmap> {
        match &self.bitmap {
            Some(a) => Some(&a),
            None => None,
        }
    }
    pub fn update_bitmap(&mut self, new:web_sys::ImageBitmap) {
        self.bitmap = Some(new);
    }
}



pub struct ImageRequester {
    stored_images: HashMap<String,Image>,
}
impl ImageRequester {
    pub fn new() -> ImageRequester {
        ImageRequester {
            stored_images: HashMap::new(),
        }
    }
    pub fn is_image_loaded(&self, url:&str) -> bool {
        match self.stored_images.get(url) {
            None => {},
            Some(data) => {
                if data.get_status() == ImageStatus::Loaded {
                    return true;
                }
            },
        }

        isImageLoaded(url)
    }
    pub fn request_image(&mut self, url:&str, force_load:bool) {
        if !force_load && self.stored_images.contains_key(url) {
            return;
        }

        loadImage(url, force_load);

        self.stored_images.insert(
            url.to_string(),
            Image::new( ImageStatus::Requested, None )
        );
    }
    pub fn get_image_data(&mut self, url:&str) -> Option<&web_sys::ImageBitmap> {
        if self.stored_images.contains_key(url) {
            if self.stored_images.get(url).unwrap().get_status() == ImageStatus::Loaded {
                return self.stored_images.get(url).unwrap().get_bitmap();
            }
        } else {
            return None;
        } 

        self.stored_images.get_mut(url).unwrap().update_bitmap(
            match getImageData(url){
                Some(a) => a,
                None => { return None; },
            }
        );
        self.stored_images.get(url).unwrap().get_bitmap()
    }
}