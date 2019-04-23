dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

"$dir"/compilation/gravity "$dir"/main core.js "$dir"/docs/js/core.js
    cat "$dir"/docs/js/core.js | sed -e "s/workspace/coreGraphics/g" > "$dir"/docs/js/core.js.tmp          
    rm -f "$dir"/docs/js/core.js
    mv "$dir"/docs/js/core.js.tmp "$dir"/docs/js/core.js

"$dir"/compilation/gravity "$dir"/main workspace.js "$dir"/docs/js/workspace.js
"$dir"/compilation/gravity "$dir"/main curve.js "$dir"/docs/js/curve.js
"$dir"/compilation/gravity "$dir"/main test.js "$dir"/docs/js/test.js

