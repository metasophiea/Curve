//https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html
//setting colour in JS

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
            //variables that are not used in 'main', will be removed for efficiency, which 
            //can cause problems in JS code referring to those variables
            attribute vec4 a_position; //("attribute" values are only supported in vertex shaders)

            //attributes can't be read by the fragment shader, thus they need to be passed on by way of a 'varying' variable
            attribute vec4 a_color;
            varying vec4 v_color;

            void main(){
                gl_Position = a_position;
                v_color = a_color;
            }
        `
    );
    var fragmentShader = createShader(
        contextGL, 
        contextGL.FRAGMENT_SHADER, 
        `  
            precision mediump float;                
            varying vec4 v_color;
                                                                        
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

    //load program
        contextGL.useProgram(program);

    //positionBuffer
        var positionAttributeLocation = contextGL.getAttribLocation(program, "a_position");
        contextGL.enableVertexAttribArray(positionAttributeLocation);

        //create buffer and bind
            var positionBuffer = contextGL.createBuffer();
            contextGL.bindBuffer(contextGL.ARRAY_BUFFER, positionBuffer);

        //describe the buffer's internal data layout, and how it should be dealt with
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

                -1, 1, 
                1, -1, 
                1, 1
            ]; 
            contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(positions), contextGL.STATIC_DRAW);

    //colorBuffer
        var colourAttributeLocation = contextGL.getAttribLocation(program, "a_color");
        contextGL.enableVertexAttribArray(colourAttributeLocation);
        
        //create buffer and bind
            var colorLocation = contextGL.createBuffer();
            contextGL.bindBuffer(contextGL.ARRAY_BUFFER, colorLocation);

        //you can use any data type you wnt really, but here we use an UNSIGNED_BYTE for fun
        //as such, we also normalize the data, as colour data must be between 0 and 1 (if we didn't,
        //the value would truncate to 1, and but pure white (unless the random value was 0 of course))
        //  In addition, 0-255 matches what is usually the colour numbers in canvas, and we reduce the
        //size of the stored colour data down from 16 bytes to 4 bytes.

        //describe the buffer's internal data layout, and how it should be dealt with
            contextGL.vertexAttribPointer(
                colourAttributeLocation,
                4,                          // size      // 4 components per iteration
                contextGL.UNSIGNED_BYTE,    // type      // the data is 8bit unsigned bytes (0 to 255)
                true,                       // normalize // normalize the data
                0,                          // stride    // 0 = move forward size * sizeof(type) each iteration to get the next position
                0,                          // offset    // start at the beginning of the buffer
            );

        //populate buffer
            var colours = [
                { r:Math.random()*256, g:Math.random()*256, b:Math.random()*256 },
                { r:Math.random()*256, g:Math.random()*256, b:Math.random()*256 },
            ];

            var colours = [ 
                colours[0].r, colours[0].g, colours[0].b, 255,
                colours[0].r, colours[0].g, colours[0].b, 255,
                colours[0].r, colours[0].g, colours[0].b, 255,
                colours[1].r, colours[1].g, colours[1].b, 255,
                colours[1].r, colours[1].g, colours[1].b, 255,
                colours[1].r, colours[1].g, colours[1].b, 255,
            ];
            
            contextGL.bufferData( contextGL.ARRAY_BUFFER, new Uint8Array(colours), contextGL.STATIC_DRAW );

    //perform draw
        var primitiveType = contextGL.TRIANGLES; // POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
        var offset = 0;
        var count = 6;
        contextGL.drawArrays(primitiveType, offset, count);