#default values
    removeDev=false
    nameArray=('test' 'core' 'core_engine')

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
    for name in ${nameArray[@]}; do 
        "$dir"/../../../../compilation/gravity "$dir"/../main/$name.js "$dir"/../docs/js/$name.js
    done

#clean out development logging (if requested)
    if $removeDev; then
        echo "stripping development lines"
        for name in ${nameArray[@]}; do 
            awk '!/\/\/#development/' "$dir"/../docs/js/$name.js > "$dir"/../docs/js/$name.tmp.js
            mv "$dir"/../docs/js/$name.tmp.js "$dir"/../docs/js/$name.js
        done
    fi