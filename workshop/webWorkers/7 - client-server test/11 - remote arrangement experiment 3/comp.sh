dir=$(cd "$(dirname "$0")" && pwd)

"$dir"/../../../compilation/gravity "$dir"/main/console/main.js "$dir"/docs/core_console.js
"$dir"/../../../compilation/gravity "$dir"/main/engine/main.js "$dir"/docs/core_engine.js