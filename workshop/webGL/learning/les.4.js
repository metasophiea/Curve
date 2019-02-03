//https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
//textures
//(using a local server, serving the home directory on 0.0.0.0)

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

            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;

            void main(){
                gl_Position = a_position;
                v_texCoord = a_texCoord;
            }
        `
    );
    var fragmentShader = createShader(
        contextGL, 
        contextGL.FRAGMENT_SHADER, 
        `  
            precision mediump float;        

            uniform sampler2D u_image; //the texture
            uniform vec2 u_textureSize;
            varying vec2 v_texCoord;   //texture coordinates
                                                                        
            void main(){
                // //straight transfer
                //     gl_FragColor = texture2D(u_image, v_texCoord);

                // //rearrange the colour values
                //     gl_FragColor = texture2D(u_image, v_texCoord).brga; 

                //blur image (by averaging this pixel with the ones either side of it (x only))
                    // compute 1 pixel in texture coordinates.
                        vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

                    // average the left, middle, and right pixels.
                        gl_FragColor = (
                            texture2D(u_image, v_texCoord) +
                            texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) +
                            texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))
                        ) / 3.0;
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
                -0.9, -0.8, 
                -0.9,  0.8, 
                 0.9, -0.8, 
                 0.9,  0.8
            ]; 
            contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(positions), contextGL.STATIC_DRAW);

    //textureBuffer
        var texCoordLocation = contextGL.getAttribLocation(program, "a_texCoord");
        contextGL.enableVertexAttribArray(texCoordLocation);

        var image = new Image();
        image.src = "http://0.0.0.0:8000/Downloads/avenue.jpg";
        image.onload = function(){

            //texture buffer
                //create buffer and bind
                    var texCoordBuffer = contextGL.createBuffer();
                    contextGL.bindBuffer(contextGL.ARRAY_BUFFER, texCoordBuffer);

                //describe the buffer's internal data layout, and how it should be dealt with
                    contextGL.vertexAttribPointer(
                        texCoordLocation, 
                        2,               // size      // pull out 2 values per iteration
                        contextGL.FLOAT, // type      // the data is 32bit floats
                        false,           // normalize // don't normalize the data
                        0,               // stride    // how many bytes to get from one set of values to the next; 0 = use type and 'size' above (size * sizeof(type))
                        0,               // offset    // how many bytes inside the buffer to start from
                    );

                //populate buffer
                    var positions = [
                        0, 1,
                        0, 0,
                        1, 1,
                        1, 0,
                        // -0.25, 1.25, //texture is a bit smaller than the shape
                        // -0.25, -0.25,
                        // 1.25, 1.25,
                        // 1.25, -0.25,
                    ];
                    contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(positions), contextGL.STATIC_DRAW);

                //create a texture
                    var texture = contextGL.createTexture();
                    contextGL.bindTexture(contextGL.TEXTURE_2D, texture);
                    
                // Set the parameters so we can render any size image
                    //determine what to do when the texture doesn't cover the shape //CLAMP_TO_EDGE, REPEAT, MIRRORED_REPEAT
                    //(REPEAT and MIRRORED_REPEAT seem to require that the texture's dimentions are powers of 2)
                        contextGL.texParameteri( contextGL.TEXTURE_2D, contextGL.TEXTURE_WRAP_S, contextGL.CLAMP_TO_EDGE );
                        contextGL.texParameteri( contextGL.TEXTURE_2D, contextGL.TEXTURE_WRAP_T, contextGL.CLAMP_TO_EDGE );
                    //determine what to do when the texture's resolution doesn't match the screen
                        //pixel being textured maps to an area greater than one texture element
                        //NEAREST, LINEAR, NEAREST_MIPMAP_NEAREST, LINEAR_MIPMAP_NEAREST, NEAREST_MIPMAP_LINEAR, LINEAR_MIPMAP_LINEAR
                            contextGL.texParameteri( contextGL.TEXTURE_2D, contextGL.TEXTURE_MIN_FILTER, contextGL.NEAREST );
                        //pixel being textured maps to an area less than or equal to one texture element
                        //NEAREST, LINEAR
                            contextGL.texParameteri( contextGL.TEXTURE_2D, contextGL.TEXTURE_MAG_FILTER, contextGL.NEAREST );
                        
                //load the image into the texture.
                    contextGL.texImage2D(
                        contextGL.TEXTURE_2D, 
                        0, 
                        contextGL.RGBA, 
                        contextGL.RGBA, 
                        contextGL.UNSIGNED_BYTE, 
                        image
                    );

            //textureSizeLocation
                var textureSizeLocation = contextGL.getUniformLocation(program, "u_textureSize");
                contextGL.uniform2f(textureSizeLocation, image.width, image.height);




                
            draw();
        }

    //perform draw
        function draw(){
            var primitiveType = contextGL.TRIANGLE_STRIP; // POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
            var offset = 0;
            var count = 4;
            contextGL.drawArrays(primitiveType, offset, count);
        }