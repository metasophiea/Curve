#!/bin/sh

#arguments
    compileWasm=false
    productionWasm=false
    wasmEditionName=master
    compileJs=false
    productionJs=false
    report=false
    nameArray=('core_engine' 'test' 'core' 'system' 'interface' 'control' 'curve')

#input argument gathering
    for ((a = 1; a <= $#; a+=2)); do
        b=$(($a + 1))
        case ${!a} in
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

            -wasmEditionNames) 
                ls main/1\ -\ core/engine/rust | grep -v "main.js"
                exit;
            ;;
            -wasmEditionName) wasmEditionName=${!b}; ;;
            -compileWasm) compileWasm=true; ((a--)); ;;
            -productionWasm) productionWasm=true; ((a--)); ;;

            -report) report=true; ((a--)); ;;
            -heavy) 
                compileWasm=true;
                productionWasm=true;
                compileJs=true;
                productionJs=true;
                report=true;
            ;;
            --help) 
                echo "-nameArray : print js list"
                echo "-compileJs : compile the full list of Js files"
                echo "-productionJs : produce production version of Js code"
                echo ""
                echo "-testOnly : only compile the js for test.js"
                echo "-testAndCoreEngineOnly : only compile the js for test.js and core-engine.js"
                echo ""
                echo "-wasmEditionNames : print available wasm edition names"
                echo "-wasmEditionName : select specific wasm version"
                echo "-compileWasm : compile the wasm code"
                echo "-productionWasm : compile the wasm code in release mode"
                echo ""
                echo "-report : print out report"
                echo "-heavy : produce production version of all code"
                exit;
            ;;
        esac
    done

#get location of script
    dir=$(cd "$(dirname "$0")" && pwd)
    cd "$dir"




#check that select wasmEditionName exists
    if [ ! -d "../main/1 - core/engine/rust/$wasmEditionName" ]; then
        echo "! could not find wasmEditionName:\"$wasmEditionName\" (\"main/1\ -\ core/engine/rust/$wasmEditionName\" doesn't exist)"
        exit;
    fi








#rust code
    if $compileWasm; then
        echo ": compiling WASM"

        cd "$dir"/../main/1\ -\ core/engine/rust/$wasmEditionName
        if $productionWasm; then
            echo ":: compiling optimised version"
            wasm-pack build --no-typescript --target no-modules
            cp pkg/core_engine_bg.wasm "$dir"/../docs/wasm/core_engine_production.wasm
        else
            echo ":: compiling regular version"
            wasm-pack build --dev --no-typescript --target no-modules
            cp pkg/core_engine_bg.wasm "$dir"/../docs/wasm/core_engine_development.wasm
        fi
        cd "$dir"

        if $compileJs || $report; then
            echo;
        fi
    fi








#js code
    if $compileJs; then
        echo ": compiling JS"

        #select correct wasmEditionName
            echo ":: select JS wasmEditionName file ($wasmEditionName)"
            echo "{{include:$wasmEditionName/pkg/core_engine.js}}" > ../main/1\ -\ core/engine/rust/main.js

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
            #tell core engine to use core_engine_production.wasm instead of core_engine_development.wasm (if its on the list)
                if [[ " ${nameArray[@]} " =~ "core_engine" ]]; then
                    echo ":: telling core_engine.min.js to use core_engine_production.wasm instead of core_engine_development.wasm"
                    echo "  -> core_engine.min.js"
                    awk '{gsub("core_engine_development.wasm", "core_engine_production.wasm", $0); print}' "$dir"/../docs/js/core_engine.min.js > "$dir"/../docs/js/core_engine.min.tmp.js
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
        for name in ${nameArray[@]}; do 
            fileSize=$(ls -l "$dir"/../docs/js/$name.js | awk '{ print $5}')
            closureFileSize=$(ls -l "$dir"/../docs/js/$name.min.js | awk '{ print $5}')

            echo "  -> $name"
            printf "\t$name.js %skb\n" "$(( fileSize / 1000 ))";
            printf "\t$name.min.js %skb\n" "$(( closureFileSize / 1000 ))";
            printf "\treduced to %s%% of original size\n" "$(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"
        done
    fi