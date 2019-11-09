dir=$(cd "$(dirname "$0")" && pwd)

echo "running Gravity"
"$dir"/comp.sh

echo "running Closure"
    nameArray=('core' 'coreSystem' 'workspace' 'curve')

    #actual compilation
        for name in ${nameArray[@]}; do 

                echo "-> "$name".js"
                #create temp .js file with the following changes:
                #   static => _static
                #   interface => _interface
                    cp "$dir"/../docs/js/$name.js "$dir"/../docs/js/$name-pre.js
                    cat "$dir"/../docs/js/$name-pre.js | sed -e "s/static/_static/g" -e "s/interface/_interface/g" > "$dir"/../docs/js/$name-tmp.js
                    rm -f "$dir"/../docs/js/$name-pre.js
                #push temp file through closure then delete
                    java -jar "$dir"/closure-compiler* --js_output_file="$dir"/../docs/js/$name.min.js "$dir"/../docs/js/$name-tmp.js
                    rm -f "$dir"/../docs/js/$name-tmp.js
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
            fileSize=$(ls -l "$dir"/../docs/js/$name.js | awk '{ print $5}')
            closureFileSize=$(ls -l "$dir"/../docs/js/$name.min.js | awk '{ print $5}')
            echo "-> $name"
            echo "\t$name.js" $(( fileSize / 1000 ))"kb";
            echo "\t$name.min.js" $(( closureFileSize / 1000 ))"kb";
            echo "\treduced to" $(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"% of original size"
        done