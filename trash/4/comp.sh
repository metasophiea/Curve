dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

"$dir"/../../compilation/gravity "$dir"/4/main main.js "$dir"/4/docs/workspace.js
"$dir"/../../compilation/gravity "$dir"/4/main test.js "$dir"/4/docs/workspaceTest.js