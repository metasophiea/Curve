//rust

//wasm
    use wasm_bindgen::prelude::*;
    
    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = ["library", "math"])]
        fn pathExtrapolation(
            path:&[f32],
            thickness:f32,
            capType:String,
            joinType:String,
            loopPath:bool,
            detail:u32,
            sharpLimit:f32,
            returnTriangles:bool
        ) -> js_sys::Array;
    }

    // #[wasm_bindgen]
    // extern "C" {
    //     #[wasm_bindgen(js_namespace = console)]
    //     fn log(a: &str);
    //     #[wasm_bindgen(js_namespace = console)]
    //     fn warn(a: &str);
    // }
    // macro_rules! console_log {
    //     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    // }
    // macro_rules! console_warn {
    //     ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    // }

//core
    use crate::a_library::data_type::{
        Point,
        Polygon,
        PathCapType,
        PathJointType,
    };
    use crate::a_library::wasm::from_js_sys::{
        js_sys_array_to_vector_of_f32,
    };







pub fn path_extrapolation_get_triangles(
    path:&Vec<Point>,
    thickness:f32,
    cap_type:PathCapType,
    join_type:PathJointType,
    loop_path:bool,
    joint_detail:u32,
    sharp_limit:f32,
) -> Option<Vec<Polygon>> {
    let mut flat_path:Vec<f32> = vec![];
    for point in path {
        flat_path.extend_from_slice(&[
            point.get_x(), point.get_y()
        ])
    }

    let triangles:Vec<f32> = match js_sys_array_to_vector_of_f32(
        &pathExtrapolation(
            &flat_path,
            thickness,
            cap_type.to_string(),
            join_type.to_string(),
            loop_path,
            joint_detail,
            sharp_limit,
            true,
        )
    ) {
        None => { return None; },
        Some(a) => a,
    };

    let mut output:Vec<Polygon> = vec![];
    for index in 0..(triangles.len()/6) {
        output.push(
            Polygon::new_triangle_from_flat(
                triangles[6*index+0], triangles[6*index+1],
                triangles[6*index+2], triangles[6*index+3],
                triangles[6*index+4], triangles[6*index+5],
            )
        );
    }

    Some(output)
}
pub fn path_extrapolation(
    path:&Vec<Point>,
    thickness:f32,
    cap_type:PathCapType,
    join_type:PathJointType,
    loop_path:bool,
    joint_detail:u32,
    sharp_limit:f32,
) -> Polygon {
    let mut flat_path:Vec<f32> = vec![];
    for point in path {
        flat_path.extend_from_slice(&[
            point.get_x(), point.get_y()
        ])
    }

    let polygon = pathExtrapolation(
        &flat_path,
        thickness,
        cap_type.to_string(),
        join_type.to_string(),
        loop_path,
        joint_detail,
        sharp_limit,
        false,
    );

    let point_data:Vec<f32> =  js_sys_array_to_vector_of_f32(
        &js_sys::Array::from(&js_sys::Array::from(&polygon).get(0))
    ).unwrap();
    Polygon::new_from_flat_array(point_data)
}