#!/bin/sh

#arguments
    compileWasm=false
    productionWasm=false
    wasmEditionName=master
    compileJS=false
    productionJS=false
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
            -compileJS) compileJS=true; ((a--)); ;;
            -productionJS) productionJS=true; ((a--)); ;;

            -testOnly) nameArray=('test'); ((a--)); ;;
            -testAndCoreOnly) nameArray=('core_engine' 'test'); ((a--)); ;;

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
                compileJS=true;
                productionJS=true;
                report=true;
            ;;
            --help) 
                echo "-nameArray : print js list"
                echo "-compileJS : compile the full list of Js files"
                echo "-productionJS : produce production version of Js code"
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
        else
            echo ":: compiling regular version"
            wasm-pack build --dev --no-typescript --target no-modules
        fi
        cp pkg/core_engine_bg.wasm "$dir"/../docs/wasm/
        cd "$dir"

        if $compileJS || $report; then
            echo;
        fi
    fi








#js code
    if $compileJS; then
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

        if $productionJS; then
            #clean out development logging (if requested)
                echo ":: stripping development lines"
                for name in ${nameArray[@]}; do 
                    echo "  -> "$name".js"
                    awk '!/\/\/#development/' "$dir"/../docs/js/$name.js > "$dir"/../docs/js/$name.min.js
                done
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
            echo -e "\t$name.js" $(( fileSize / 1000 ))"kb";
            echo -e "\t$name.min.js" $(( closureFileSize / 1000 ))"kb";
            echo -e "\treduced to" $(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"% of original size"
        done
    fi