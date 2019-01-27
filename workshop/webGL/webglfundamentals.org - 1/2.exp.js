//https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html
//adding more interesting colour

var contextGL = document.getElementById("canvas").getContext("webgl");

//utility
    function createShader(contextGL, type, source) {
        var shader = contextGL.createShader(type);
        contextGL.shaderSource(shader, source);
        contextGL.compileShader(shader);
        var success = contextGL.getShaderParameter(shader, contextGL.COMPILE_STATUS);
        if(success){ return shader; }

        console.log(contextGL.getShaderInfoLog(shader));
        contextGL.deleteShader(shader);
    }
    function createProgram(contextGL, vertexShader, fragmentShader) {
        var program = contextGL.createProgram();
        contextGL.attachShader(program, vertexShader);
        contextGL.attachShader(program, fragmentShader);
        contextGL.linkProgram(program);
        var success = contextGL.getProgramParameter(program, contextGL.LINK_STATUS);
        if(success){ return program; }
    
        console.log(contextGL.getProgramInfoLog(program));
        contextGL.deleteProgram(program);
    }




//GL program
    var vertexShader = createShader(
        contextGL, 
        contextGL.VERTEX_SHADER, 
        `          
            attribute vec4 a_position; //("attribute" values are only supported in vertex shaders)
            varying vec4 v_color; //(not accessible from JS. Is set per vertex, and read in an interpolated form in the fragment shader)

            void main(){
                gl_Position = a_position;

                // Convert from clipspace to colorspace. (Clipspace goes -1.0 to +1.0; Colorspace goes from 0.0 to 1.0)
                v_color = (gl_Position * 0.5) + 0.5; 
                //colour is a three value data piece, so 'B' will not receive a value from gl_Position. The default is 0, thus B will be 0.5
            }
        `
    );
    var fragmentShader = createShader(
        contextGL, 
        contextGL.FRAGMENT_SHADER, 
        `  
            precision mediump float;                
            varying vec4 v_color; //interpolated from this pixel's distance to the vertices which defined their own 'v_color' value
                                                                        
            void main(){
                gl_FragColor = v_color;
            }                                                            
        `
    );

    var program = createProgram(contextGL, vertexShader, fragmentShader);




//rendering
    //viewport positioning and clearing
        contextGL.viewport(0, 0, contextGL.canvas.width, contextGL.canvas.height);
        contextGL.clearColor(0, 0, 0, 0);
        contextGL.clear(contextGL.COLOR_BUFFER_BIT);

    //load program, and enable ties
        contextGL.useProgram(program);
        var positionAttributeLocation = contextGL.getAttribLocation(program, "a_position");
        contextGL.enableVertexAttribArray(positionAttributeLocation);

    //create buffer and bind
        var positionBuffer = contextGL.createBuffer();
        contextGL.bindBuffer(contextGL.ARRAY_BUFFER, positionBuffer);

    //describe the attribute's internal data layout, and how it should be dealt with
        contextGL.vertexAttribPointer(
            positionAttributeLocation, 
            2,               // size      // pull out 2 values per iteration
            contextGL.FLOAT, // type      // the data is 32bit floats
            false,           // normalize // don't normalize the data
            0,               // stride    // how many bytes to get from one set of values to the next; 0 = use type and 'size' above (size * sizeof(type))
            0,               // offset    // how many bytes inside the buffer to start from
        );

    //populate buffer
        var positions = [ //triangle-strip rectangle
            -1, -1, 
            -1, 1, 
            1, -1, 
            1, 1
        ]; 
        contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(positions), contextGL.STATIC_DRAW);

    //perform draw
        var primitiveType = contextGL.TRIANGLE_STRIP; // POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
        var offset = 0;
        var count = positions.length/2;
        contextGL.drawArrays(primitiveType, offset, count);