dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

"$dir"/../../compilation/gravity "$dir"/canvas/main main.js "$dir"/canvas/workspace.js
"$dir"/../../compilation/gravity "$dir"/canvas/main testMain.js "$dir"/canvas/workspaceTest.js
"$dir"/../../compilation/gravity "$dir"/canvas/main core.js "$dir"/canvas/core.js