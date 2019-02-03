var minicore = {
    contextGL: document.getElementById("canvas").getContext("webgl"),
    produceProgram: function(vertexShaderSource, fragmentShaderSource){
        function createShader(that, type, source){
            var shader = that.contextGL.createShader(type);
            that.contextGL.shaderSource(shader, source);
            that.contextGL.compileShader(shader);
            var success = that.contextGL.getShaderParameter(shader, that.contextGL.COMPILE_STATUS);
            if(success){ return shader; }
    
            console.error('major error in minicore\'s "'+ type +'" shader creation');
            console.error(that.contextGL.getShaderInfoLog(shader));
            that.contextGL.deleteShader(shader);
        }

        var program = this.contextGL.createProgram();
        this.contextGL.attachShader(program, createShader(this, this.contextGL.VERTEX_SHADER,vertexShaderSource) );
        this.contextGL.attachShader(program, createShader(this, this.contextGL.FRAGMENT_SHADER,fragmentShaderSource) );
        this.contextGL.linkProgram(program);
        var success = this.contextGL.getProgramParameter(program, this.contextGL.LINK_STATUS);
        if(success){ return program; }
    
        console.error('major error in minicore\'s program creation');
        console.error(this.contextGL.getProgramInfoLog(program));
        this.contextGL.deleteProgram(program);
    },
};


var scene = [];

scene.push({
    type:'rectangle',
    x:50,
    y:0,
    width:100,
    height:100,
    angle:1,
    anchor:{x:0.5,y:0.5},
    points:[
        0,0,
        1,0,
        1,1,
        0,1,
    ],

    vertexShaderSource:
        `          
            //drawing pane resolution
                uniform vec2 u_resolution;

            //unit points
                uniform vec2 u_dimensions;

            //attributes
                uniform vec2 u_translation;
                uniform float u_angle;
                uniform vec2 u_anchor;
                attribute vec2 a_position;

            void main(){
                //adjust unit points based on attributes
                    vec2 tmp_position = a_position * u_dimensions;

                //perform anchored rotation
                    tmp_position = vec2(
                        tmp_position.x - u_dimensions.x*u_anchor.x,
                        tmp_position.y - u_dimensions.y*u_anchor.y
                    );

                    tmp_position = vec2( 
                        tmp_position.x*cos(u_angle) + tmp_position.y*sin(u_angle), 
                        tmp_position.y*cos(u_angle) - tmp_position.x*sin(u_angle)
                    );

                    tmp_position = vec2(
                        tmp_position.x + u_dimensions.x*u_anchor.x,
                        tmp_position.y + u_dimensions.y*u_anchor.y
                    );

                //convert from unit space to clipspace
                    gl_Position = vec4( ((tmp_position+u_translation) / u_resolution) * vec2(2, -2), 0, 1 );
            }
        `,
    fragmentShaderSource:
        `  
            precision mediump float;
                                                                        
            void main(){
                gl_FragColor = vec4(1, 0, 0.5, 1);
            }                                                            
        `,

    update:function(contextGL){
        //populate u_resolution
            var resolutionUniformLocation = contextGL.getUniformLocation(this.renderProgram, "u_resolution");
            contextGL.uniform2f(resolutionUniformLocation, contextGL.canvas.width, contextGL.canvas.height);

        //populate a_position buffer
            var positionAttributeLocation = contextGL.getAttribLocation(this.renderProgram, "a_position");
            var positionBuffer = contextGL.createBuffer();
            contextGL.enableVertexAttribArray(positionAttributeLocation);
            contextGL.bindBuffer(contextGL.ARRAY_BUFFER, positionBuffer); 
            contextGL.vertexAttribPointer( positionAttributeLocation, 2, contextGL.FLOAT,false, 0, 0 );
            contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(this.points), contextGL.STATIC_DRAW);
    },

    renderProgram:undefined,
    render:function(contextGL){
        //populate u_translation
            var translation = contextGL.getUniformLocation(this.renderProgram, "u_translation");
            contextGL.uniform2f(translation, this.x, this.y);

        //populate u_dimensions
            var dimensions = contextGL.getUniformLocation(this.renderProgram, "u_dimensions");
            contextGL.uniform2f(dimensions, this.width, this.height);

        //populate u_angle
            var angle = contextGL.getUniformLocation(this.renderProgram, "u_angle");
            contextGL.uniform1f(angle, this.angle);

        //populate u_anchor
            var anchor = contextGL.getUniformLocation(this.renderProgram, "u_anchor");
            contextGL.uniform2f(anchor, this.anchor.x, this.anchor.y);

        //perform draw
            var primitiveType = contextGL.TRIANGLE_FAN;
            contextGL.drawArrays(primitiveType, 0, 4);
    },

});









minicore.contextGL.viewport(0, 0, minicore.contextGL.canvas.width, minicore.contextGL.canvas.height);
minicore.contextGL.clearColor(20/255, 20/255, 20/255, 1);

function render(){
    for(var a = 0; a < scene.length; a++){
        var item = scene[a];
        if(item.renderProgram == undefined){ 
            item.renderProgram = minicore.produceProgram(item.vertexShaderSource, item.fragmentShaderSource);
            minicore.contextGL.useProgram(item.renderProgram);
            item.update(minicore.contextGL);
        }else{
            minicore.contextGL.useProgram(item.renderProgram);
        }
        item.render(minicore.contextGL);
    }
}




setInterval(function(){
    scene[0].angle += 0.04;
    render();
},1000/40)