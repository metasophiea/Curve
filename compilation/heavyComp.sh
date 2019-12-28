#default values
    removeDev=true
    nameArray=('core_engine' 'core' 'system' 'interface' 'control' 'curve')

#input argument gathering
    for ((a = 1; a <= $#; a+=2)); do
        b=$(($a + 1))
        case ${!a} in
            -sayHello) echo "hello"; ((a--)); ;;
            -getValue) value=${!b}; ;;
            -removeDev) removeDev=true; ((a--)); ;;
        esac
    done
















#get location of script
    dir=$(cd "$(dirname "$0")" && pwd)

#assemble master JS files
    echo "running Gravity"
    for name in ${nameArray[@]}; do 
        echo "-> "$name".js"
        "$dir"/gravity "$dir"/../main/$name.js "$dir"/../docs/js/$name.min.js
    done

#clean out development logging (if requested)
    if $removeDev; then
        echo "stripping development lines"
        for name in ${nameArray[@]}; do 
            awk '!/\/\/#development/' "$dir"/../docs/js/$name.min.js > "$dir"/../docs/js/$name.min.tmp.js
            mv "$dir"/../docs/js/$name.min.tmp.js "$dir"/../docs/js/$name.min.js
        done
    fi

#produce non-minified versions
    for name in ${nameArray[@]}; do 
        cp "$dir"/../docs/js/$name.min.js "$dir"/../docs/js/$name.js
    done

echo "telling core to use core_engine.min.js instead of core_engine.js"
    for name in ${nameArray[@]}; do 
        awk '{gsub("core_engine.js", "core_engine.min.js", $0); print}' "$dir"/../docs/js/$name.min.js > "$dir"/../docs/js/$name.min.tmp.js
        mv "$dir"/../docs/js/$name.min.tmp.js "$dir"/../docs/js/$name.min.js
    done
    

echo "running Closure"
    for name in ${nameArray[@]}; do 

        echo "-> "$name".js"
        #make the following changes:
        #   static => _static
        #   interface => _interface
            cat "$dir"/../docs/js/$name.min.js | sed -e "s/static/_static/g" -e "s/interface/_interface/g" > "$dir"/../docs/js/$name.min.tmp.js
            mv "$dir"/../docs/js/$name.min.tmp.js "$dir"/../docs/js/$name.min.js

        #push temp file through closure then delete
            java -jar "$dir"/closure-compiler* --js_output_file="$dir"/../docs/js/$name.min.tmp.js "$dir"/../docs/js/$name.min.js
            mv "$dir"/../docs/js/$name.min.tmp.js "$dir"/../docs/js/$name.min.js
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
        echo -e "\t$name.js" $(( fileSize / 1000 ))"kb";
        echo -e "\t$name.min.js" $(( closureFileSize / 1000 ))"kb";
        echo -e "\treduced to" $(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"% of original size"
    done