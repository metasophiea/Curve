dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

echo "running Gravity"
"$dir"/compilation/comp.sh

echo "running Closure"
    nameArray=('core' 'workspace' 'curve')

    #actual compilation
        for name in ${nameArray[@]}; do 

                echo -e "-> "$name".js"
                #create temp .js file with the following changes:
                #   static => _static
                #   interface => _interface
                    cp "$dir"/docs/js/$name.js "$dir"/docs/js/$name-pre.js
                    cat "$dir"/docs/js/$name-pre.js | sed -e "s/static/_static/g" -e "s/interface/_interface/g" > "$dir"/docs/js/$name-tmp.js
                    rm -f "$dir"/docs/js/$name-pre.js
                #push temp file through closure then delete
                    java -jar "$dir"/compilation/closure-compiler* --js_output_file="$dir"/docs/js/$name.min.js "$dir"/docs/js/$name-tmp.js
                    rm -f "$dir"/docs/js/$name-tmp.js
                    if [ $? -ne 0 ]; then
                        echo "";
                        echo "Closure has encountered an error; bailing";
                        exit 1;
                    fi

        done

    #report on how things went
        for name in ${nameArray[@]}; do 
            fileSize=$(ls -l docs/js/$name.js | awk '{ print $5}')
            closureFileSize=$(ls -l docs/js/$name.min.js | awk '{ print $5}')
            echo -e "-> $name"
            echo -e "\t$name.js" $(( fileSize / 1000 ))"kb";
            echo -e "\t$name.min.js" $(( closureFileSize / 1000 ))"kb";
            echo -e "\treduced to" $(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"% of original size"
        done