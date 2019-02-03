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

var shapes = {
    rectangle: function(){    
        //unchanging attributes
            var points = [
                0,0,
                1,0,
                1,1,
                0,1,
            ];
            var vertexShaderSource =
                `          
                    //drawing pane resolution
                        uniform vec2 u_resolution;
    
                    //unit points
                        attribute vec2 a_position;
    
                    //attributes
                        uniform vec2 u_translation;
                        uniform vec2 u_dimensions;
                        uniform float u_angle;
                        uniform vec2 u_anchor;
    
                    void main(){
                        //adjust unit points based on attributes
                            vec2 tmp_position = a_position * u_dimensions;
    
                        //perform anchored rotation, and leave shape with it's anchor over the chosen point
                            tmp_position = vec2(
                                tmp_position.x - u_dimensions.x*u_anchor.x,
                                tmp_position.y - u_dimensions.y*u_anchor.y
                            );
                            tmp_position = vec2( 
                                tmp_position.x*cos(u_angle) + tmp_position.y*sin(u_angle), 
                                tmp_position.y*cos(u_angle) - tmp_position.x*sin(u_angle)
                            );
    
                        //convert from unit space to clipspace
                            gl_Position = vec4( ((tmp_position+u_translation) / u_resolution) * vec2(2, -2), 0, 1 );
                    }
                `;
            var fragmentShaderSource =
                `  
                    precision mediump float;
                                                                                
                    void main(){
                        gl_FragColor = vec4(1, 0, 0.5, 1);
                    }
                `;
            var program = minicore.produceProgram(vertexShaderSource, fragmentShaderSource);
    
        //changeable attributes
            var firstRun = true;
            var x = 0;
            var y = 0;
            var width = 100;
            var height = 100;
            var angle = 1;
            var anchor = {x:0.5,y:0.5};
            var changedAttributes = {
                x: true,
                y: true,
                width: true,
                height: true,
                angle: true,
                anchor: true,
            };
            function setup(contextGL){
                //populate u_resolution
                    contextGL.uniform2f(contextGL.getUniformLocation(program, "u_resolution"), contextGL.canvas.width, contextGL.canvas.height);
        
                //populate a_position buffer
                    var positionAttributeLocation = contextGL.getAttribLocation(program, "a_position");
                    var positionBuffer = contextGL.createBuffer();
                    contextGL.enableVertexAttribArray(positionAttributeLocation);
                    contextGL.bindBuffer(contextGL.ARRAY_BUFFER, positionBuffer); 
                    contextGL.vertexAttribPointer( positionAttributeLocation, 2, contextGL.FLOAT,false, 0, 0 );
                    contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(points), contextGL.STATIC_DRAW);
            }
            function update(contextGL){
                if( changedAttributes.x || changedAttributes.y ){
                    contextGL.uniform2f(contextGL.getUniformLocation(program, "u_translation"), x, y);
                    changedAttributes.x = false;
                    changedAttributes.y = false;
                }
    
                if( changedAttributes.width || changedAttributes.height ){
                    contextGL.uniform2f(contextGL.getUniformLocation(program, "u_dimensions"), width, height);
                    changedAttributes.width = false;
                    changedAttributes.height = false;
                }
    
                if( changedAttributes.angle ){
                    contextGL.uniform1f(contextGL.getUniformLocation(program, "u_angle"), angle);
                    changedAttributes.angle = false;
                }
    
                if( changedAttributes.anchor ){
                    contextGL.uniform2f(contextGL.getUniformLocation(program, "u_anchor"), anchor.x, anchor.y);
                    changedAttributes.anchor = false;
                }
            }
    
        this.x = function(newX){ if(newX == undefined){return x;} x = newX; changedAttributes.x = true; };
        this.y = function(newY){ if(newY == undefined){return y;} y = newY; changedAttributes.y = true; };
        this.width = function(newWidth){ if(newWidth == undefined){return width;} width = newWidth; changedAttributes.width = true; };
        this.height = function(newHeight){ if(newHeight == undefined){return height;} height = newHeight; changedAttributes.height = true; };
        this.angle = function(newAngle){ if(newAngle == undefined){return angle;} angle = newAngle; changedAttributes.angle = true; };
        this.anchor = function(newAnchor){ if(newAnchor == undefined){return anchor;} anchor = newAnchor; changedAttributes.anchor = true; };
    
        this.render = function(contextGL){
            contextGL.useProgram(program);
            if( firstRun ){ firstRun = false; setup(contextGL); }
            update(contextGL);
            contextGL.drawArrays(contextGL.TRIANGLE_FAN, 0, 4);
        };
    }
};

var scene = [
    new shapes.rectangle
];


























minicore.contextGL.viewport(0, 0, minicore.contextGL.canvas.width, minicore.contextGL.canvas.height);
minicore.contextGL.clearColor(20/255, 20/255, 20/255, 1);

function render(){
    scene.forEach(a => a.render(minicore.contextGL));
}




setInterval(function(){
    scene[0].angle( scene[0].angle()+0.025 );
    render();
},1000/60);