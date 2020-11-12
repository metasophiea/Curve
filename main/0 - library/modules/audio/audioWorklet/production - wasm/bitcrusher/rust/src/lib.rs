#![allow(non_snake_case)]

#[no_mangle]
pub extern "C" fn alloc_128_f32_wasm_memory() -> *mut f32 {
    let mut buf = Vec::<f32>::with_capacity(128);
    let ptr = buf.as_mut_ptr();
    std::mem::forget(buf);
    ptr as *mut f32
}

#[no_mangle]
pub extern "C" fn process(
    amplitudeResolution: f32,
    sampleFrequency: usize,
    input_pointer: *mut f32,
    output_pointer: *mut f32
) {
    let input_buffer: &mut [f32] = unsafe { std::slice::from_raw_parts_mut(input_pointer, 128) };
    let output_buffer: &mut [f32] = unsafe { std::slice::from_raw_parts_mut(output_pointer, 128) };

    for index in 0..128 {
        output_buffer[index] = if (index%sampleFrequency) == 0 { 
            (input_buffer[index] * amplitudeResolution).round() / amplitudeResolution
        } else { 
            output_buffer[index-1]
        };
    }
}