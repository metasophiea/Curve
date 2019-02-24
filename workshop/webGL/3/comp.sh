dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

"$dir"/../../compilation/gravity "$dir"/3/main main.js "$dir"/3/docs/workspace.js
"$dir"/../../compilation/gravity "$dir"/3/main test.js "$dir"/3/docs/workspaceTest.js