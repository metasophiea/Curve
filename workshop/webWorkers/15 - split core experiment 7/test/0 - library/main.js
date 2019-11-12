{{include:../../main/0 - library/main.js}}

_canvas_.library._control.logflow.active(true);

{{include:structuredTests/math.js}}
{{include:structuredTests/math.pathExtrapolation.js}}
// {{include:structuredTests/math.fitPolyIn.js}}
{{include:structuredTests/structure.js}}
{{include:structuredTests/misc.js}}

console.log( _canvas_.library._control.logflow.printResults() );








// {{include:loadTests/1.js}} //heavy test
// {{include:loadTests/2.js}} //speed test