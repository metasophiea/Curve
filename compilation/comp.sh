#!/bin/sh

#arguments
    compileLibraryAudioWasmList=()
    productionCompileLibraryAudioWasmList=false

    compileCoreWasm=false
    productionCoreWasm=false
    coreWasmEditionName=master

    compileJs=false
    productionJs=false

    report=false
    nameArray=('core_engine' 'test' 'core' 'system' 'interface' 'control' 'curve')

#input argument gathering
    for ((a = 1; a <= $#; a+=2)); do
        b=$(($a + 1))
        case ${!a} in
            -listLibraryAudioNames)
                echo "production >"
                production_array=($(ls main/0\ -\ library/modules/audio/audioWorklet/production\ -\ wasm | grep -v "manifest.js"));
                for name in ${production_array[@]}; do
                    printf " - $name\n";
                done

                echo "workshop >"
                workshop_array=($(ls main/0\ -\ library/modules/audio/audioWorklet/workshop\ -\ wasm | grep -v "manifest.js"));
                for name in ${workshop_array[@]}; do
                    printf " - $name\n";
                done

                exit;
            ;;
            -compileLibraryAudioWasmList) compileLibraryAudioWasmList=${!b}; ;;
            -compileAllLibraryAudioWasm)
                compileLibraryAudioWasmList=($(ls main/0\ -\ library/modules/audio/audioWorklet/production\ -\ wasm | grep -v "manifest.js"));
                compileLibraryAudioWasmList+=($(ls main/0\ -\ library/modules/audio/audioWorklet/workshop\ -\ wasm | grep -v "manifest.js"));
                 ((a--));
            ;;
            -productionCompileLibraryAudioWasmList) productionCompileLibraryAudioWasmList=true; ((a--)); ;;

            -compileCoreWasm) compileCoreWasm=true; ((a--)); ;;
            -productionCoreWasm) productionCoreWasm=true; ((a--)); ;;
            -listCoreWasmEditionNames) 
                ls main/1\ -\ core/engine/rust | grep -v "main.js"
                exit;
            ;;
            -coreWasmEditionName) coreWasmEditionName=${!b}; ;;

            -nameArray) 
                for i in ${nameArray[@]}; do
                    echo $i; 
                done
                exit;
            ;;
            -compileJs) compileJs=true; ((a--)); ;;
            -productionJs) productionJs=true; ((a--)); ;;

            -testOnly) nameArray=('test'); ((a--)); ;;
            -testAndCoreEngineOnly) nameArray=('core_engine' 'test'); ((a--)); ;;

            -heavy) 
                compileLibraryAudioWasmList=($(ls main/0\ -\ library/modules/audio/audioWorklet/production\ -\ wasm | grep -v "manifest"));
                compileLibraryAudioWasmList+=($(ls main/0\ -\ library/modules/audio/audioWorklet/workshop\ -\ wasm | grep -v "manifest"));
                productionCompileLibraryAudioWasmList=true;

                compileCoreWasm=true;
                productionCoreWasm=true;

                compileJs=true;
                productionJs=true;

                report=true;
                ((a--));
            ;;
            -report) report=true; ((a--)); ;;
            --help) 
                echo "-listLibraryAudioNames : print out all audio processing nodes that are available to be compiled"
                echo "-compileLibraryAudioWasmList : select which audio processing nodes should be compiled"
                echo "-compileAllLibraryAudioWasm : select all audio processing nodes to be compiled"
                echo "-productionCompileLibraryAudioWasmList : compile audio processing nodes in production mode (or \"release\" mode)"
                echo ""
                echo "-compileCoreWasm : compile the wasm code in the core layer"
                echo "-productionCoreWasm : compile the wasm code in the core layer in release mode"
                echo "-listCoreWasmEditionNames : print available wasm edition names from the core layer"
                echo "-coreWasmEditionName : select specific wasm version in the core layer"
                echo ""
                echo "-nameArray : print js list"
                echo "-compileJs : compile the full list of Js files"
                echo "-productionJs : produce production version of Js code"
                echo ""
                echo "-testOnly : only compile the js for test.js"
                echo "-testAndCoreEngineOnly : only compile the js for test.js and core-engine.js"
                echo ""
                echo "-heavy : produce production version of all code"
                echo "-report : print out report"
                exit;
            ;;
        esac
    done

#get location of script
    dir=$(cd "$(dirname "$0")" && pwd)
    cd "$dir"




#check that select coreWasmEditionName exists
    if [ ! -d "../main/1 - core/engine/rust/$coreWasmEditionName" ]; then
        echo "! could not find coreWasmEditionName:\"$coreWasmEditionName\" (\"main/1\ -\ core/engine/rust/$coreWasmEditionName\" doesn't exist)"
        exit;
    fi








#rust code
    #library > audio
        if [ ${#compileLibraryAudioWasmList[@]} -ne 0 ]; then
            if $productionCompileLibraryAudioWasmList; then
                echo ": compiling Library Audio WASM in production mode"
            else
                echo ": compiling Library Audio WASM"
            fi
        fi
        for name in ${compileLibraryAudioWasmList[@]}; do
            echo ":: compiling > $name"

            directoryToUse=production;
            if [ ! -d "$dir"/../main/0\ -\ library/modules/audio/audioWorklet/$directoryToUse\ -\ wasm/$name ]; then
                directoryToUse=workshop;
            fi

            if $productionCompileLibraryAudioWasmList; then
                cd "$dir"/../main/0\ -\ library/modules/audio/audioWorklet/$directoryToUse\ -\ wasm/$name/rust/
                cargo build --target wasm32-unknown-unknown --release
                cd "$dir"
                binaryen/bin/wasm-opt -Oz --strip-debug "$dir"/../main/0\ -\ library/modules/audio/audioWorklet/$directoryToUse\ -\ wasm/$name/rust/target/wasm32-unknown-unknown/release/$name.wasm -o "$dir"/../docs/wasm/audio_processing/$name.production.wasm
            else
                cd "$dir"/../main/0\ -\ library/modules/audio/audioWorklet/$directoryToUse\ -\ wasm/$name/rust/
                cargo build --target wasm32-unknown-unknown
                cd "$dir"
                cp "$dir"/../main/0\ -\ library/modules/audio/audioWorklet/$directoryToUse\ -\ wasm/$name/rust/target/wasm32-unknown-unknown/debug/$name.wasm "$dir"/../docs/wasm/audio_processing/$name.development.wasm
            fi
        done
        if [ ${#compileLibraryAudioWasmList[@]} -ne 0 ]; then
            echo;
        fi
    #core
        if $compileCoreWasm; then
            echo ": compiling Core WASM"

            cd "$dir"/../main/1\ -\ core/engine/rust/$coreWasmEditionName
            if $productionCoreWasm; then
                echo ":: compiling optimised version"
                wasm-pack build --no-typescript --target no-modules
                cp pkg/core_engine_bg.wasm "$dir"/../docs/wasm/core/core_engine.production.wasm
            else
                echo ":: compiling regular version"
                wasm-pack build --dev --no-typescript --target no-modules
                cp pkg/core_engine_bg.wasm "$dir"/../docs/wasm/core/core_engine.development.wasm
            fi
            cd "$dir"

            if $compileJs || $report; then
                echo;
            fi
        fi








#js code
    if $compileJs; then
        echo ": compiling JS"

        #select correct coreWasmEditionName
            echo ":: select JS coreWasmEditionName file ($coreWasmEditionName)"
            echo "{{include:$coreWasmEditionName/pkg/core_engine.js}}" > ../main/1\ -\ core/engine/rust/main.js

        #assemble master JS files
            echo ":: assembling master JS files"
            for name in ${nameArray[@]}; do 
                echo "  -> "$name".js"
                "$dir"/gravity -r "$dir"/../main/$name.js -o "$dir"/../docs/js/$name.js
            done

        if $productionJs; then
            #clean out development logging (if requested)
                echo ":: stripping development lines"
                for name in ${nameArray[@]}; do 
                    echo "  -> "$name".js"
                    awk '!/\/\/#development/' "$dir"/../docs/js/$name.js > "$dir"/../docs/js/$name.min.js
                done
            #tell core engine to use core_engine.production.wasm instead of core_engine.development.wasm (if its on the list)
                if [[ " ${nameArray[@]} " =~ "core_engine" ]]; then
                    echo ":: telling core_engine.min.js to use core_engine.production.wasm instead of core_engine.development.wasm"
                    echo "  -> core_engine.min.js"
                    awk '{gsub("core_engine.development.wasm", "core_engine.production.wasm", $0); print}' "$dir"/../docs/js/core_engine.min.js > "$dir"/../docs/js/core_engine.min.tmp.js
                    mv "$dir"/../docs/js/core_engine.min.tmp.js "$dir"/../docs/js/core_engine.min.js
                fi
            #tell core to use core_engine.min.js instead of core_engine.js
                echo ":: telling core to use core_engine.min.js instead of core_engine.js"
                for name in ${nameArray[@]/"core_engine"}; do 
                    echo "  -> "$name".js"
                    awk '{gsub("core_engine.js", "core_engine.min.js", $0); print}' "$dir"/../docs/js/$name.min.js > "$dir"/../docs/js/$name.min.tmp.js
                    mv "$dir"/../docs/js/$name.min.tmp.js "$dir"/../docs/js/$name.min.js
                done
            #run Terser
                echo ":: running Terser"
                for name in ${nameArray[@]}; do 
                    echo "  -> "$name".js"

                    #push temp file through closure then delete
                        terser "$dir"/../docs/js/$name.min.js > "$dir"/../docs/js/$name.min.tmp.js --compress --mangle
                        if [ $? -ne 0 ]; then
                            echo "";
                            echo "Terser has encountered an error; re-compressing with far simpler method...";
                            cat "$dir"/../docs/js/$name.min.js | awk 'NF' > "$dir"/../docs/js/$name.min.tmp.js
                            
                        fi
                        mv "$dir"/../docs/js/$name.min.tmp.js "$dir"/../docs/js/$name.min.js
                done
        fi

        if $report; then
            echo;
        fi
    fi
    







#report on how things went
    if $report; then
        echo ": results";
        echo ":: WebAssembly";

        echo "::: Library Audio Processors"
        for wasm_name in $(ls "$dir"/../docs/wasm/audio_processing); do
            echo " -> $wasm_name - $(ls -lh "$dir"/../docs/wasm/audio_processing/$wasm_name | awk '{ print $5}') - ($(date -r "$dir"/../docs/wasm/audio_processing/$wasm_name))"
            twiggy top "$dir"/../docs/wasm/audio_processing/$wasm_name > __tmp
            head -n15 __tmp
            rm __tmp
            echo "";
        done

        echo "::: Core"
        for wasm_name in $(ls "$dir"/../docs/wasm/core); do
            echo " -> $wasm_name - $(ls -lh "$dir"/../docs/wasm/core/$wasm_name | awk '{ print $5}') - ($(date -r "$dir"/../docs/wasm/core/$wasm_name))"
            twiggy top "$dir"/../docs/wasm/core/$wasm_name > __tmp
            head -n15 __tmp
            rm __tmp
            echo "";
        done
        

        echo ":: JavaScript";
        for name in ${nameArray[@]}; do 
            fileSize=$(ls -l "$dir"/../docs/js/$name.js | awk '{ print $5}')
            closureFileSize=$(ls -l "$dir"/../docs/js/$name.min.js | awk '{ print $5}')

            echo "-> $name"
            printf "\t$name.js %skb\n" "$(( fileSize / 1000 ))";
            printf "\t$name.min.js %skb\n" "$(( closureFileSize / 1000 ))";
            printf "\treduced to %s%% of original size\n" "$(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"
        done
    fi