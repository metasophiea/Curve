dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

"$dir"/compilation/gravity "$dir"/main main.js "$dir"/docs/workspace.js
"$dir"/compilation/gravity "$dir"/main testMain.js "$dir"/docs/workspaceTest.js
"$dir"/compilation/gravity "$dir"/main core.js "$dir"/docs/core.js