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
    sampleRate: usize,
    currentFrame: usize,
    frequency_useFirstOnly: bool,
    frequency_pointer: *mut f32,
    dutyCycle_useFirstOnly: bool,
    dutyCycle_pointer: *mut f32,
    output_pointer: *mut f32
) {
    let frequency_buffer: &mut [f32] = unsafe { std::slice::from_raw_parts_mut(frequency_pointer, if frequency_useFirstOnly{1}else{128} ) };
    let dutyCycle_buffer: &mut [f32] = unsafe { std::slice::from_raw_parts_mut(dutyCycle_pointer, if dutyCycle_useFirstOnly{1}else{128}) };
    let output_buffer: &mut [f32] = unsafe { std::slice::from_raw_parts_mut(output_pointer, 128) };

    for index in 0..128 {
        let frequency = if frequency_useFirstOnly { frequency_buffer[0] } else { frequency_buffer[index] };
        let dutyCycle = if dutyCycle_useFirstOnly { dutyCycle_buffer[0] } else { dutyCycle_buffer[index] };

        let overallWaveProgressPercentage = (frequency/(sampleRate as f32)) * ((currentFrame + index) as f32);
        let waveProgress = overallWaveProgressPercentage - overallWaveProgressPercentage.trunc();
        output_buffer[index] = if waveProgress < dutyCycle { 1.0 } else { -1.0 };
    }
}