for ((a = 1; a <= $#; a+=2)); do
    b=$(($a + 1))
    case ${!a} in
        -target) target=${!b}; ;;
        --help) 
            echo "Gravity Updater"
            echo "-target : select target version"
            echo "-list : list available target versions"
            exit;
        ;;
        -list) 
            curl https://raw.githubusercontent.com/metasophiea/Gravity/main/availableVersions
            exit;
        ;;
    esac
done


if [ -z "$target" ]; then
    echo "must specify target"
    exit;
fi


echo "Getting -> https://github.com/metasophiea/Gravity/raw/main/target/$target/release/gravity"
echo;
wget https://github.com/metasophiea/Gravity/raw/main/target/$target/release/gravity -O compilation/gravity
chmod u+x compilation/gravity