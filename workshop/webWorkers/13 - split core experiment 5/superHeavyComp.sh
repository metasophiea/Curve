dir=$(cd "$(dirname "$0")" && pwd)

echo "running Gravity"
    #assemble master JS files
        "$dir"/../../../compilation/gravity "$dir"/core/main.js "$dir"/docs/core.min.js
        "$dir"/../../../compilation/gravity "$dir"/core/engine/main.js "$dir"/docs/core_engine.min.js

echo "stripping development lines"
    #clean out development logging
        awk '!/\/\/#development/' "$dir"/docs/core.min.js > "$dir"/docs/core.tmp.js
        awk '!/\/\/#development/' "$dir"/docs/core_engine.min.js > "$dir"/docs/core_engine.tmp.js
        mv "$dir"/docs/core.tmp.js "$dir"/docs/core.min.js
        mv "$dir"/docs/core_engine.tmp.js "$dir"/docs/core_engine.min.js

echo "telling core to use core.min.js instead of core.js"
    awk '{gsub("core_engine.js", "core_engine.min.js", $0); print}' "$dir"/docs/core.min.js > "$dir"/docs/core.tmp.js
    mv "$dir"/docs/core.tmp.js "$dir"/docs/core.min.js

echo "running Closure"
    nameArray=('core' 'core_engine')

    #actual compilation
        for name in ${nameArray[@]}; do 

                echo "-> "$name".js"
                #create temp .js file with the following changes:
                #   static => _static
                #   interface => _interface
                    cp "$dir"/docs/$name.min.js "$dir"/docs/$name-pre.min.js
                    cat "$dir"/docs/$name-pre.min.js | sed -e "s/static/_static/g" -e "s/interface/_interface/g" > "$dir"/docs/$name-tmp.min.js
                    rm -f "$dir"/docs/$name-pre.min.js
                #push temp file through closure then delete
                    java -jar "$dir"/../../../compilation/closure-compiler* --js_output_file="$dir"/docs/$name.min.js "$dir"/docs/$name-tmp.min.js
                    rm -f "$dir"/docs/$name-tmp.min.js
                    if [ $? -ne 0 ]; then
                        echo "";
                        echo "Closure has encountered an error; bailing";
                        exit 1;
                    fi

        done

    #report on how things went
        echo; echo;
        echo "- results -";
        for name in ${nameArray[@]}; do 
            fileSize=$(ls -l "$dir"/docs/$name.js | awk '{ print $5}')
            closureFileSize=$(ls -l "$dir"/docs/$name.min.js | awk '{ print $5}')
            echo "-> $name"
            echo "\t$name.js" $(( fileSize / 1000 ))"kb";
            echo "\t$name.min.js" $(( closureFileSize / 1000 ))"kb";
            echo "\treduced to" $(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"% of original size"
        done