//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
//pixels

var canvas = document.getElementById("canvas");
var WebGLRenderingContext = canvas.getContext("webgl");

function createShader(WebGLRenderingContext, type, source) {
    var shader = WebGLRenderingContext.createShader(type);
    WebGLRenderingContext.shaderSource(shader, source);
    WebGLRenderingContext.compileShader(shader);
    var success = WebGLRenderingContext.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS);
    if(success){ return shader; }

    console.log(WebGLRenderingContext.getShaderInfoLog(shader));
    WebGLRenderingContext.deleteShader(shader);
}


var vertexShaderSource = `
    // an attribute will receive data from a buffer
    attribute vec2 a_position;
    uniform vec2 u_resolution;

    // all shaders have a main function
    void main() {
        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;
var fragmentShaderSource = `
    // fragment shaders do not have a default precision so we need
    // to pick one. mediump is a good default
    precision mediump float;

    void main() {
        // gl_FragColor is a special variable a fragment shader
        // is responsible for setting
        gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
    }
`;
 
var vertexShader = createShader(WebGLRenderingContext, WebGLRenderingContext.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(WebGLRenderingContext, WebGLRenderingContext.FRAGMENT_SHADER, fragmentShaderSource);




function createProgram(WebGLRenderingContext, vertexShader, fragmentShader) {
    var program = WebGLRenderingContext.createProgram();
    WebGLRenderingContext.attachShader(program, vertexShader);
    WebGLRenderingContext.attachShader(program, fragmentShader);
    WebGLRenderingContext.linkProgram(program);
    var success = WebGLRenderingContext.getProgramParameter(program, WebGLRenderingContext.LINK_STATUS);
    if(success){ return program; }
   
    console.log(WebGLRenderingContext.getProgramInfoLog(program));
    WebGLRenderingContext.deleteProgram(program);
  }

var program = createProgram(WebGLRenderingContext, vertexShader, fragmentShader);


var positionAttributeLocation = WebGLRenderingContext.getAttribLocation(program, "a_position");
var resolutionUniformLocation = WebGLRenderingContext.getUniformLocation(program, "u_resolution");
var positionBuffer = WebGLRenderingContext.createBuffer();
WebGLRenderingContext.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, positionBuffer);

// three 2d points
var positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30,
];
WebGLRenderingContext.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array(positions), WebGLRenderingContext.STATIC_DRAW);








WebGLRenderingContext.viewport(0, 0, WebGLRenderingContext.canvas.width, WebGLRenderingContext.canvas.height);


// Clear the canvas
WebGLRenderingContext.clearColor(0, 0, 0, 0);
WebGLRenderingContext.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);


// Tell it to use our program (pair of shaders)
WebGLRenderingContext.useProgram(program);
WebGLRenderingContext.enableVertexAttribArray(positionAttributeLocation);

// set the resolution
WebGLRenderingContext.uniform2f(resolutionUniformLocation, WebGLRenderingContext.canvas.width, WebGLRenderingContext.canvas.height);


// Bind the position buffer
WebGLRenderingContext.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, positionBuffer);
 
// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;                           // 2 components per iteration
var type = WebGLRenderingContext.FLOAT; // the data is 32bit floats
var normalize = false;                  // don't normalize the data
var stride = 0;                         // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;                         // start at the beginning of the buffer
WebGLRenderingContext.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)


var primitiveType = WebGLRenderingContext.TRIANGLES;
var offset = 0;
var count = 6;
WebGLRenderingContext.drawArrays(primitiveType, offset, count);