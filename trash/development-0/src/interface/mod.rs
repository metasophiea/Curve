//rust

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = console)]
        fn error(a: &str);
    }
    macro_rules! console_error {
        ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
    }

//core








fn formulate_cargo(
    function_name: &str,
    arguments: &js_sys::Array,
) -> js_sys::Object {
    let cargo = js_sys::Object::new();

    match js_sys::Reflect::set( &cargo, &JsValue::from_str("function"), &JsValue::from_str(function_name) ) {
        Ok(_) => {},
        Err(msg) => { 
            console_error!("interface::formulate_cargo - error setting function name {}", function_name);
            console_error!("interface::formulate_cargo - errosystem r ser {:?}", msg);
        },
    }
    match js_sys::Reflect::set( &cargo, &JsValue::from_str("arguments"), &arguments) {
        Ok(_) => {},
        Err(msg) => { 
            console_error!("interface::formulate_cargo - error setting arguments {:?}", arguments);
            console_error!("interface::formulate_cargo - system error {:?}", msg);
        },
    }

    cargo
}

pub fn send_message(
    worker:&web_sys::Worker,
    function_name: &str,
    arguments: &js_sys::Array,
) {
    let outgoing_message = js_sys::Object::new();
    match js_sys::Reflect::set( &outgoing_message, &JsValue::from_str("cargo"), &formulate_cargo( function_name, arguments ) ) {
        Ok(_) => {},
        Err(msg) => { 
            console_error!("interface::send_message error loading cargo");
            console_error!("interface::send_message system error - {:?}", msg);
        },
    }
    match worker.post_message( &outgoing_message ) {
        Ok(_) => {},
        Err(msg) => {
            console_error!("interface::send_message post_message error: {:?}", msg);
        },
    }
}
pub fn send_message_with_transfer(
    worker:&web_sys::Worker,
    function_name: &str,
    arguments: &js_sys::Array,
    transfer_arguments: &js_sys::Array,
) {
    let outgoing_message = js_sys::Object::new();
    match js_sys::Reflect::set( &outgoing_message, &JsValue::from_str("cargo"), &formulate_cargo( function_name, arguments ) ) {
        Ok(_) => {},
        Err(msg) => { 
            console_error!("interface::send_message_with_transfer error loading cargo");
            console_error!("interface::send_message_with_transfer system error - {:?}", msg);
        },
    }
    match worker.post_message_with_transfer( &outgoing_message, &transfer_arguments ) {
        Ok(_) => {},
        Err(msg) => {
            console_error!("interface::send_message_with_transfer post_message_with_transfer error: {:?}", msg);
        },
    }
}