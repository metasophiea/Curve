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
            attribute vec4 a_position;

            void main(){
                gl_Position = a_position;
            }
        `
    );
    var fragmentShader = createShader(
        contextGL, 
        contextGL.FRAGMENT_SHADER, 
        `  
            precision mediump float;                                      
                                                                        
            void main(){
                gl_FragColor = vec4(1, 0, 0.5, 1);
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

    //Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        contextGL.vertexAttribPointer(
            positionAttributeLocation, 
            2,               // size      // pull out 2 values per iteration
            contextGL.FLOAT, // type      // the data is 32bit floats
            false,           // normalize // don't normalize the data
            0,               // stride    // how many bytes to get from one set of values to the next; 0 = use type and 'size' above (size * sizeof(type))
            0,               // offset    // how many bytes inside the buffer to start from
        );

    //populate buffer
        var shift = {x:0.5, y:0.5};
        var positions = [ //triangle-strip rectangle
            0-shift.x, 0-shift.y, 
            0-shift.x, 1-shift.y, 
            1-shift.x, 0-shift.y, 
            1-shift.x, 1-shift.y
        ]; 
        contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(positions), contextGL.STATIC_DRAW);

    //perform draw
        var primitiveType = contextGL.TRIANGLE_STRIP; // POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
        var offset = 0;
        var count = positions.length/2;
        contextGL.drawArrays(primitiveType, offset, count);