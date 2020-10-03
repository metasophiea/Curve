target="release"

for ((a = 1; a <= $#; a+=2)); do
    b=$(($a + 1))
    case ${!a} in
        -target) target=${!b}; ;;
    esac
done

echo "Getting -> https://github.com/metasophiea/Gravity/raw/main/target/$target/gravity"
echo;
wget https://github.com/metasophiea/Gravity/raw/main/target/$target/gravity -O compilation/gravity
chmod u+x compilation/gravity