dir=$(dirname "$(cd "$(dirname "$0")" && pwd)")

"$dir"/../../compilation/gravity "$dir"/canvas/main main.js "$dir"/canvas/workspace.js
