//rust

//wasm
    use wasm_bindgen::prelude::*;
    
    #[wasm_bindgen]
    extern "C" {
        #[wasm_bindgen(js_namespace = ["library", "_thirdparty"])]
        fn earcut(points:&[f32], holeIndices:&[u32]) -> Vec<f32>;
    }

//core
    use crate::a_library::data_type::Polygon;








pub fn polygon_to_sub_triangles(
    base:&Polygon,
    holes:Vec<&Polygon>,
) -> Vec<Polygon> {
    let mut flat_array:Vec<f32> = base.get_points_as_flat_array();
    let mut hole_indexes:Vec<u32> = vec![];
    for hole in holes {
        hole_indexes.push( (flat_array.len()/2) as u32 );
        flat_array.extend_from_slice( &hole.get_points_as_flat_array() );
    }

    let mut output:Vec<Polygon> = vec![];
    let triangles = earcut( &flat_array, &hole_indexes );
    for index in 0..(triangles.len()/6) {
        output.push(
            Polygon::new_triangle_from_flat(
                triangles[6*index+0], triangles[6*index+1],
                triangles[6*index+2], triangles[6*index+3],
                triangles[6*index+4], triangles[6*index+5],
            )
        );
    }

    output
}