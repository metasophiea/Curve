//creates a shader of the given type, uploads the source and compiles it.
function loadShader(contextGL, type, source) {
    const shader = contextGL.createShader(type);

    // Send the source to the shader object
    contextGL.shaderSource(shader, source);

    // Compile the shader program
    contextGL.compileShader(shader);

    // See if it compiled successfully
    if(!contextGL.getShaderParameter(shader, contextGL.COMPILE_STATUS)){
        alert('An error occurred compiling the shaders: ' + contextGL.getShaderInfoLog(shader));
        contextGL.deleteShader(shader);
        return null;
    }

    return shader;
}

//Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(contextGL, vsSource, fsSource) {
    const vertexShader = loadShader(contextGL, contextGL.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(contextGL, contextGL.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = contextGL.createProgram();
    contextGL.attachShader(shaderProgram, vertexShader);
    contextGL.attachShader(shaderProgram, fragmentShader);
    contextGL.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if(!contextGL.getProgramParameter(shaderProgram, contextGL.LINK_STATUS)){
        alert('Unable to initialize the shader program: ' + contextGL.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}
function initBuffers(contextGL) {
    // Create a buffer for the square's positions.
    const positionBuffer = contextGL.createBuffer();
  
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    contextGL.bindBuffer(contextGL.ARRAY_BUFFER, positionBuffer);
  
    // Now create an array of positions for the square.
    const positions = [
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ];
  
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(positions), contextGL.STATIC_DRAW);
  
    return { position: positionBuffer };
}
function drawScene(contextGL, programInfo, buffers) {
    contextGL.clearColor(0, 0, 0, 1);        // Clear to black, fully opaque
    contextGL.clearDepth(1);                 // Clear everything
    contextGL.enable(contextGL.DEPTH_TEST);  // Enable depth testing
    contextGL.depthFunc(contextGL.LEQUAL);   // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
        contextGL.clear(contextGL.COLOR_BUFFER_BIT | contextGL.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = contextGL.canvas.clientWidth / contextGL.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument as the destination to receive the result.
        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar
        );
  
    // Set the drawing position to the "identity" point, which is the center of the scene.
        const modelViewMatrix = mat4.create();
  
    // Now move the drawing position a bit to where we want to start drawing the square.
        mat4.translate(
            modelViewMatrix,  // destination matrix
            modelViewMatrix,  // matrix to translate
            [-0, 0, -6]       // amount to translate
        );
  
    // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
        {
            const numComponents = 2;         // pull out 2 values per iteration
            const type = contextGL.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;         // don't normalize
            const stride = 0;                // how many bytes to get from one set of values to the next 0 = use type and numComponents above
            const offset = 0;                // how many bytes inside the buffer to start from
            contextGL.bindBuffer(contextGL.ARRAY_BUFFER, buffers.position);
            contextGL.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            contextGL.enableVertexAttribArray( programInfo.attribLocations.vertexPosition );
        }
  
    // Tell WebGL to use our program when drawing
        contextGL.useProgram(programInfo.program);
  
    // Set the shader uniforms
        contextGL.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        contextGL.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );
    
        {
            const offset = 0;
            const vertexCount = 4;
            contextGL.drawArrays(contextGL.TRIANGLE_STRIP, offset, vertexCount);
        }
}










var contextGL = document.getElementById("canvas").getContext("webgl");


const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;
const fsSource = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;





const shaderProgram = initShaderProgram(contextGL, vsSource, fsSource);




const programInfo = {
    program: shaderProgram,
    attribLocations:{
        vertexPosition: contextGL.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations:{
        projectionMatrix: contextGL.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: contextGL.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
};

const buffers = initBuffers(contextGL);



drawScene(contextGL,programInfo,buffers);