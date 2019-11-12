dir=$(cd "$(dirname "$0")" && pwd)

"$dir"/../../../compilation/gravity "$dir"/main.js "$dir"/docs/core.js
"$dir"/../../../compilation/gravity "$dir"/1\ -\ core/engine/main.js "$dir"/docs/core_engine.js