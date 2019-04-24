dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

"$dir"/compilation/gravity "$dir"/main core.js "$dir"/docs/js/core.js
"$dir"/compilation/gravity "$dir"/main workspace.js "$dir"/docs/js/workspace.js
"$dir"/compilation/gravity "$dir"/main curve.js "$dir"/docs/js/curve.js
"$dir"/compilation/gravity "$dir"/main test.js "$dir"/docs/js/test.js

