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

//core
    use crate::a_library::data_type::{
        Point,
        SimplePolygon,
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
) -> Option<Vec<SimplePolygon>> {
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

    let mut output:Vec<SimplePolygon> = vec![];
    for index in 0..(triangles.len()/6) {
        output.push(
            SimplePolygon::new_triangle(
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
// ) -> (Polygon, Vec<Polygon>) {
) -> SimplePolygon {
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
    // console_log!("{:?}", polygon);
    // console_log!("{:?}", js_sys::Array::from(&polygon).length());


    // let body:Polygon = Polygon::new_from_flat_array(
    //         js_sys_array_to_vector_of_f32(
    //         &js_sys::Array::from(&js_sys::Array::from(&polygon).get(0))
    //     ).unwrap()
    // );

    // let mut holes:Vec<Polygon> = vec![];
    // for index in 1..js_sys::Array::from(&polygon).length() {
    //     holes.push(
    //         Polygon::new_from_flat_array(
    //             js_sys_array_to_vector_of_f32(
    //                 &js_sys::Array::from(&js_sys::Array::from(&polygon).get(index))
    //             ).unwrap()
    //         )
    //     );
    // }
    // // console_log!("{:?} {:?}", body, holes);


    // (body, holes)

    let point_data:Vec<f32> = js_sys_array_to_vector_of_f32(
        &js_sys::Array::from(&js_sys::Array::from(&polygon).get(0))
    ).unwrap();

    SimplePolygon::new_from_flat_array(point_data)

}