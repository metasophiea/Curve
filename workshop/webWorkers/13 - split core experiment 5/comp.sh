dir=$(cd "$(dirname "$0")" && pwd)

"$dir"/../../../compilation/gravity "$dir"/core/main.js "$dir"/docs/core.js
"$dir"/../../../compilation/gravity "$dir"/core/engine/main.js "$dir"/docs/core_engine.js