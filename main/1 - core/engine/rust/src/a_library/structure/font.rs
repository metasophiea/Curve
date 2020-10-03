//rust
    use std::collections::HashMap;
    use std::fmt;

//wasm
    use wasm_bindgen::prelude::*;
    
    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn log(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a: &str);

        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn getLoadableFonts() -> Vec<JsValue>;
        #[wasm_bindgen(js_namespace = ["operator", "library", "font"])]
        fn loadFont(font_name:&str, force:bool);
        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn isValidCharacter(font_name:&str, character:char) -> bool;

        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn getVector(fontName:&str, character:char) -> Option<Vec<f32>>;
        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn getDefaultVector(fontName:&str) -> Vec<f32>;
        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn getRatio(fontName:&str, character:char) -> Option<js_sys::Object>;
        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn getOffset(fontName:&str, character:char) -> Option<js_sys::Object>;
        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn getEncroach(fontName:&str, character:char, otherCharacter:char) -> Option<f32>;
        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn getMiscDefaultData(fontName:&str) -> Option<js_sys::Object>;
        #[wasm_bindgen(js_namespace = ["library", "font"])]
        fn getMiscData(fontName:&str, character:char) -> Option<js_sys::Object>;
    }
    macro_rules! console_log {
        ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::Point;
    use crate::a_library::wasm::from_js_sys::get_value_from_object__f32;








static DEFAULT_FONT_NAMES: [&'static str; 2] = [
    "defaultThick",
    "defaultThin",
];
static SELECTED_DEFAULT_FONT_NAME_INDEX: usize = 1;








//FontMiscData
    pub struct FontMiscData {
        ascender: f32,
        descender: f32,
        left_side_bearing: f32,
        advance_width: f32,
        x_max: f32,
        y_max: f32,
        x_min: f32,
        y_min: f32,
        top: f32,
        left: f32,
        bottom: f32,
        right: f32,
    }
    impl FontMiscData {
        pub fn new(
            ascender: f32,
            descender: f32,
            left_side_bearing: f32,
            advance_width: f32,
            x_max: f32,
            y_max: f32,
            x_min: f32,
            y_min: f32,
            top: f32,
            left: f32,
            bottom: f32,
            right: f32,
        ) -> FontMiscData {
            FontMiscData {
                ascender,
                descender,
                left_side_bearing,
                advance_width,
                x_max,
                y_max,
                x_min,
                y_min,
                top,
                left,
                bottom,
                right,
            }
        }
        pub fn new_default() -> FontMiscData {
            FontMiscData::new(
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                f32::MAX,
                f32::MAX,
                0.0,
                0.0,
            )
        }
        pub fn new_optional(
            ascender: Option<f32>,
            descender: Option<f32>,
            left_side_bearing: Option<f32>,
            advance_width: Option<f32>,
            x_max: Option<f32>,
            y_max: Option<f32>,
            x_min: Option<f32>,
            y_min: Option<f32>,
            top: Option<f32>,
            left: Option<f32>,
            bottom: Option<f32>,
            right: Option<f32>,
        ) -> FontMiscData {
            FontMiscData::new(
                ascender.unwrap_or(0.0),
                descender.unwrap_or(0.0),
                left_side_bearing.unwrap_or(0.0),
                advance_width.unwrap_or(0.0),
                x_max.unwrap_or(0.0),
                y_max.unwrap_or(0.0),
                x_min.unwrap_or(0.0),
                y_min.unwrap_or(0.0),
                top.unwrap_or(f32::MAX),
                left.unwrap_or(f32::MAX),
                bottom.unwrap_or(1.0),
                right.unwrap_or(1.0),
            )
        }

        pub fn from_js_sys_object(object:js_sys::Object) -> FontMiscData {
            FontMiscData::new_optional(
                get_value_from_object__f32("ascender", &object, true), 
                get_value_from_object__f32("descender", &object, true), 
                get_value_from_object__f32("leftSideBearing", &object, true), 
                get_value_from_object__f32("advanceWidth", &object, true), 
                get_value_from_object__f32("xMax", &object, true), 
                get_value_from_object__f32("yMax", &object, true), 
                get_value_from_object__f32("xMin", &object, true), 
                get_value_from_object__f32("yMin", &object, true), 
                get_value_from_object__f32("top", &object, true), 
                get_value_from_object__f32("left", &object, true), 
                get_value_from_object__f32("bottom", &object, true), 
                get_value_from_object__f32("right", &object, true), 
            )
        }
    }
    impl FontMiscData {
        pub fn get_ascender(&self) -> f32 { self.ascender }
        pub fn get_descender(&self) -> f32 { self.descender }
        pub fn get_left_side_bearing(&self) -> f32 { self.left_side_bearing }
        pub fn get_advance_width(&self) -> f32 { self.advance_width }
        pub fn get_x_max(&self) -> f32 { self.x_max }
        pub fn get_y_max(&self) -> f32 { self.y_max }
        pub fn get_x_min(&self) -> f32 { self.x_min }
        pub fn get_y_min(&self) -> f32 { self.y_min }
        pub fn get_top(&self) -> f32 { self.top }
        pub fn get_left(&self) -> f32 { self.left }
        pub fn get_bottom(&self) -> f32 { self.bottom }
        pub fn get_right(&self) -> f32 { self.right }
    }
    impl FontMiscData {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            write!(
                f, 
                "{{ascender:{}, descender:{}, left_side_bearing:{}, advance_width:{}, x_max:{}, y_max:{}, x_min:{}, y_min:{}, top:{}, left:{}, bottom:{}, right:{}}}",
                self.ascender,
                self.descender,
                self.left_side_bearing,
                self.advance_width,
                self.x_max,
                self.y_max,
                self.x_min,
                self.y_min,
                self.top,
                self.left,
                self.bottom,
                self.right,
            )
        }
    }
    impl fmt::Display for FontMiscData {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }
    impl fmt::Debug for FontMiscData {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }






//FontStatus
    #[derive(PartialEq, Eq, Hash, Clone, Copy)]
    pub enum FontStatus {
        NotRequested,
        Requested,
        FailedToLoad,
        SuccessfullyLoaded,
    }
    impl FontStatus {
        pub fn from_str(type_string:&str) -> Option<FontStatus> {
            match type_string {
                "NotRequested" => Some(FontStatus::NotRequested),
                "Requested" => Some(FontStatus::Requested),
                "FailedToLoad" => Some(FontStatus::FailedToLoad),
                "SuccessfullyLoaded" => Some(FontStatus::SuccessfullyLoaded),
                _ => None,
            }
        }

        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            match *self {
                FontStatus::NotRequested => write!(f, "NotRequested"),
                FontStatus::Requested => write!(f, "Requested"),
                FontStatus::FailedToLoad => write!(f, "FailedToLoad"),
                FontStatus::SuccessfullyLoaded => write!(f, "SuccessfullyLoaded"),
            }
        }
    }
    impl fmt::Display for FontStatus {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }
    impl fmt::Debug for FontStatus {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
    }








//Font
    pub struct Font {
        name: String,
        status: FontStatus,
        default_vector: Vec<f32>,
        default_misc_data: FontMiscData,

        ids_to_call_back: Vec<usize>,

        stored_vectors: HashMap<char,Vec<f32>>,
        stored_ratios: HashMap<char,(f32,f32)>,
        stored_offsets: HashMap<char,(f32,f32)>,
        stored_encroachs: HashMap<(char,char),f32>,
        stored_misc_data: HashMap<char,FontMiscData>,
    }
    impl Font {
        pub fn new(name:&str) -> Font {
            let (status, default_vector, default_misc_data) = if DEFAULT_FONT_NAMES.contains(&name) {
                (
                    FontStatus::SuccessfullyLoaded, 
                    getDefaultVector(name),
                    FontMiscData::from_js_sys_object( getMiscDefaultData( name ).unwrap() )
                )
            } else {
                (
                    FontStatus::NotRequested, 
                    vec![0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0],
                    FontMiscData::new_default(),
                )
            };

            Font {
                name: name.to_string(),
                status: status,
                default_vector: default_vector,
                default_misc_data: default_misc_data,

                ids_to_call_back: vec![],

                stored_vectors: HashMap::new(),
                stored_ratios: HashMap::new(),
                stored_offsets: HashMap::new(),
                stored_encroachs: HashMap::new(),
                stored_misc_data: HashMap::new(),
            }
        }
    }
    impl Font {
        pub fn get_status(&self) -> &FontStatus { &self.status }

        pub fn request(&mut self, id:usize) {
            if self.status == FontStatus::NotRequested {
                self.status = FontStatus::Requested;
                loadFont(&self.name, false);
            }

            if !self.ids_to_call_back.contains(&id) {
                self.ids_to_call_back.push(id);
            }
        }
        pub fn alert_loaded(&mut self, load_was_success:bool) -> &mut Vec<usize> {
            if self.status == FontStatus::NotRequested {
                console_warn!("Font.alert_loaded - curious.. received alert for font that wasn't requested");
            }

            if load_was_success {
                self.status = FontStatus::SuccessfullyLoaded;
                self.default_vector = getDefaultVector(&self.name);
                self.default_misc_data = FontMiscData::from_js_sys_object( getMiscDefaultData( &self.name ).unwrap() );
            } else {
                self.status = FontStatus::FailedToLoad;
                self.default_vector = vec![0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0];
                self.default_misc_data = FontMiscData::new_default();
            };

            &mut self.ids_to_call_back
        }
    }
    impl Font {
        pub fn is_character_valid(&mut self, character:char) -> bool {
            if self.stored_vectors.contains_key(&character) {
                return true;
            }

            isValidCharacter(&self.name, character)
        }
        pub fn get_vector(&mut self, character:char) -> &Vec<f32> {
            if self.stored_vectors.contains_key(&character) {
                return self.stored_vectors.get(&character).unwrap()
            }

            if !isValidCharacter(&self.name, character) { return &self.default_vector; }

            let vector = getVector( &self.name, character ).unwrap();
            self.stored_vectors.insert( character, vector );
            self.stored_vectors.get(&character).unwrap()
        }
        pub fn get_ratio(&mut self, character:char) -> &(f32,f32) {
            if self.stored_ratios.contains_key(&character) {
                return self.stored_ratios.get(&character).unwrap()
            }

            if !isValidCharacter(&self.name, character) { return &(0.0,0.0); }

            match getRatio( &self.name, character ){
                None => self.stored_ratios.insert( character, (0.0,0.0) ),
                Some(ratio) => self.stored_ratios.insert( character, Point::from_js_sys_object( &ratio ).to_tuple() ),
            };
            self.stored_ratios.get(&character).unwrap()
        }
        pub fn get_offset(&mut self, character:char) -> &(f32,f32) {
            if self.stored_offsets.contains_key(&character) {
                return self.stored_offsets.get(&character).unwrap()
            }

            if !isValidCharacter(&self.name, character) { return &(0.0,0.0); }

            match getOffset( &self.name, character ){
                None => self.stored_offsets.insert( character, (0.0,0.0) ),
                Some(offset) => self.stored_offsets.insert( character, Point::from_js_sys_object( &offset ).to_tuple() ),
            };
            self.stored_offsets.get(&character).unwrap()
        }
        pub fn get_encroach(&mut self, character:char, other_character:char) -> &f32 {
            let key = (character,other_character);

            if self.stored_encroachs.contains_key(&key) {
                return self.stored_encroachs.get(&key).unwrap()
            }

            if !isValidCharacter(&self.name, character) { return &0.0; }

            match getEncroach( &self.name, character, other_character ){
                None => self.stored_encroachs.insert( key, 0.0 ),
                Some(encroach) => self.stored_encroachs.insert( key, encroach ),
            };
            self.stored_encroachs.get(&key).unwrap()
        }
        pub fn get_misc_data(&mut self, character:char) -> &FontMiscData {
            if self.stored_misc_data.contains_key(&character) {
                return self.stored_misc_data.get(&character).unwrap()
            }

            if !isValidCharacter(&self.name, character) { return &self.default_misc_data; }

            let data = FontMiscData::from_js_sys_object( getMiscData( &self.name, character ).unwrap() );
            self.stored_misc_data.insert( character, data );
            self.stored_misc_data.get(&character).unwrap()
        }
    }
    impl Font {
        pub fn _dump(&self, prefix:Option<&str>) {
            let prefix = prefix.unwrap_or("");

            if self.status == FontStatus::SuccessfullyLoaded {
                console_log!("{}┌─Font {} Dump─", prefix, self.name);
                console_log!("{}│ status: {}", prefix, self.status);
                console_log!("{}│ default_vector: {:?}", prefix, self.default_vector);
                console_log!("{}│ default_misc_data: {}", prefix, self.default_misc_data);
                console_log!("{}│ stored_vectors (count:{})", prefix, self.stored_vectors.len());
                for (key, item) in &self.stored_vectors {
                    console_log!("{}│ - {} > {:?}", prefix, key, item);
                }
                console_log!("{}│ stored_ratios (count:{})", prefix, self.stored_ratios.len());
                for (key, item) in &self.stored_ratios {
                    console_log!("{}│ - {} > {:?}", prefix, key, item);
                }
                console_log!("{}│ stored_offsets (count:{})", prefix, self.stored_offsets.len());
                for (key, item) in &self.stored_offsets {
                    console_log!("{}│ - {} > {:?}", prefix, key, item);
                }
                console_log!("{}│ stored_encroachs (count:{})", prefix, self.stored_encroachs.len());
                for (key, item) in &self.stored_encroachs {
                    console_log!("{}│ - {:?} > {:?}", prefix, key, item);
                }
                console_log!("{}│ stored_misc_data (count:{})", prefix, self.stored_misc_data.len());
                for (key, item) in &self.stored_misc_data {
                    console_log!("{}│ - {:?} > {:?}", prefix, key, item);
                }
                console_log!("{}└──────────────", prefix);
            } else {
                console_log!("{}╶─Font {} - {}", prefix, self.name, self.status);
            }
        }
    }








//FontRequester
    pub struct FontRequester {
        default_font: Font,
        stored_fonts: HashMap<String,Font>,
    }
    impl FontRequester {
        pub fn new() -> FontRequester {
            let mut stored_fonts = HashMap::new();
            let default_font_name = DEFAULT_FONT_NAMES[SELECTED_DEFAULT_FONT_NAME_INDEX];

            for name in getLoadableFonts() {
                if name == default_font_name {
                    continue;
                }
                
                let name = match name.as_string() {
                    None => {
                        console_warn!("FontRequester.new : unknown font name: {:?}", name);
                        continue;
                    },
                    Some(a) => a,
                };
                let font = Font::new(&name);
                stored_fonts.insert(name, font);
            }

            FontRequester {
                default_font: Font::new(default_font_name),
                stored_fonts: stored_fonts,
            }
        }
        pub fn alert_font_loaded(&mut self, font_name:&str, load_was_success:bool) -> Option<&mut Vec<usize>> {
            match self.stored_fonts.get_mut(font_name) {
                None => {
                    console_warn!("FontRequester.alert_font_loaded : got font load alert for font that isn't in the database: {}", font_name);
                    None
                },
                Some(font) => Some(font.alert_loaded(load_was_success)),
            }
        }
    }
    impl FontRequester {
        pub fn request_font(&mut self, font_name:&str, requesting_element_id:usize) -> &mut Font {
            match self.stored_fonts.get_mut(font_name) {
                None => {
                    &mut self.default_font
                },
                Some(font) => {
                    match font.get_status() {
                        FontStatus::NotRequested | FontStatus::Requested => {
                            font.request(requesting_element_id);
                            &mut self.default_font
                        },
                        FontStatus::FailedToLoad => {
                            &mut self.default_font
                        },
                        FontStatus::SuccessfullyLoaded => {
                            font
                        },
                    }
                },
            }
        }
    }
    impl FontRequester {
        pub fn _dump(&self, prefix:Option<&str>) {
            let prefix = prefix.unwrap_or("");

            console_log!("{}┌─FontRequester Dump─", prefix);
            console_log!("{}│ default_font:", prefix);
            self.default_font._dump( Some(&format!("{}│ ",prefix)) );
            console_log!("{}│ stored_fonts (count:{})", prefix, self.stored_fonts.len());
            for (_, item) in &self.stored_fonts {
                item._dump( Some(&format!("{}│ ",prefix)) );
            }
            console_log!("{}└────────────────────", prefix);
        }
    }