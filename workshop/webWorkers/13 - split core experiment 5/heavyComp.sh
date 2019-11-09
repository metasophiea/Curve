dir=$(cd "$(dirname "$0")" && pwd)

#assemble master JS files
    "$dir"/../../../compilation/gravity "$dir"/core/main.js "$dir"/docs/core.js
    "$dir"/../../../compilation/gravity "$dir"/core/engine/main.js "$dir"/docs/core_engine.js
#clean out development logging
    awk '!/\/\/#development/' "$dir"/docs/core.js > "$dir"/docs/core.tmp.js
    awk '!/\/\/#development/' "$dir"/docs/core_engine.js > "$dir"/docs/core_engine.tmp.js
    mv "$dir"/docs/core.tmp.js "$dir"/docs/core.js
    mv "$dir"/docs/core_engine.tmp.js "$dir"/docs/core_engine.js

