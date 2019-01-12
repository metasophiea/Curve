dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

echo "running Gravity"
"$dir"/compilation/comp.sh

echo "running Closure"
#core compilation
    #create temp core.js file with the following changes:
    #   static => _static
    #   interface => _interface
        cp "$dir"/docs/core.js "$dir"/docs/core-tmp.js
        sed -i '' "s/static/_static/g" "$dir"/docs/core-tmp.js
        sed -i '' "s/interface/_interface/g" "$dir"/docs/core-tmp.js
    #push temp file through closure then delete
        java -jar "$dir"/compilation/closure-compiler* --js_output_file="$dir"/docs/core.min.js "$dir"/docs/core-tmp.js
        rm -f "$dir"/docs/core-tmp.js
        if [ $? -ne 0 ]; then
            echo "";
            echo "Closure has encountered an error; bailing";
            exit 1;
        fi
#workspace compilation
    #create temp workspace.js file with the following changes:
    #   static => _static
    #   interface => _interface
        cp "$dir"/docs/workspace.js "$dir"/docs/workspace-tmp.js
        sed -i '' "s/static/_static/g" "$dir"/docs/workspace-tmp.js
        sed -i '' "s/interface/_interface/g" "$dir"/docs/workspace-tmp.js
    #push temp file through closure then delete
        java -jar "$dir"/compilation/closure-compiler* --js_output_file="$dir"/docs/workspace.min.js "$dir"/docs/workspace-tmp.js
        rm -f "$dir"/docs/workspace-tmp.js
        if [ $? -ne 0 ]; then
            echo "";
            echo "Closure has encountered an error; bailing";
            exit 1;
        fi



#details on how things went
fileSize=$(ls -l docs/core.js | awk '{ print $5}')
closureFileSize=$(ls -l docs/core.min.js | awk '{ print $5}')
echo -e "-> core"
echo -e "\tcore.js" $(( fileSize / 1000 ))"kb";
echo -e "\tcore.min.js" $(( closureFileSize / 1000 ))"kb";
echo -e "\treduced to" $(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"% of original size"

fileSize=$(ls -l docs/workspace.js | awk '{ print $5}')
closureFileSize=$(ls -l docs/workspace.min.js | awk '{ print $5}')
echo -e "-> worspace"
echo -e "\tworkspace.js" $(( fileSize / 1000 ))"kb";
echo -e "\tworkspace.min.js" $(( closureFileSize / 1000 ))"kb";
echo -e "\treduced to" $(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"% of original size"