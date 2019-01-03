# dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

# echo "running Gravity"
# "$dir"/compilation/comp.sh

# echo "running Closure"
# java -jar "$dir"/compilation/closure-compiler* --js_output_file=docs/workspace.min.js docs/workspace.js
# if [ $? -ne 0 ]; then
#     echo "";
#     echo "Closure has encountered an error; bailing";
#     exit 1;
# fi

# # fileSize=$(ls -l docs/workspace.js | awk '{ print $5}')
# # closureFileSize=$(ls -l docs/workspace.min.js | awk '{ print $5}')
# # echo -e "\tworkspace.js" $(( fileSize / 1000 ))"kb";
# # echo -e "\tworkspace.min.js" $(( closureFileSize / 1000 ))"kb";
# # echo -e "\treduced to" $(echo "print(\"{0:.2f}\".format(100*("$closureFileSize"/"$fileSize")))" | python3)"% of original size"