#!/bin/sh

#arguments
    production=false

#input argument gathering
    for ((a = 1; a <= $#; a+=2)); do
        b=$(($a + 1))
        case ${!a} in
            -production) production=true; ((a--)); ;;
        esac
    done

#get location of script
    original_dir=$(pwd)
    dir=$(cd "$(dirname "$0")" && pwd)
    cd "$dir"

    if $production; then
        cargo build --target wasm32-unknown-unknown --release
        "$original_dir"/binaryen/bin/wasm-opt -Oz --strip-debug "$dir"/target/wasm32-unknown-unknown/release/bitcrusher.wasm -o "$dir"/../bitcrusher_production.wasm
    else
        cargo build --target wasm32-unknown-unknown
        cp "$dir"/target/wasm32-unknown-unknown/debug/bitcrusher.wasm "$dir"/../bitcrusher_development.wasm
    fi

#reset location
    cd "$original_dir"