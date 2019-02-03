var minicore = new function(){
    this.contextGL = document.getElementById("canvas").getContext("webgl");

    function compileProgram(that, vertexShaderSource, fragmentShaderSource){
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

        var program = that.contextGL.createProgram();
        that.contextGL.attachShader(program, createShader(that, that.contextGL.VERTEX_SHADER,vertexShaderSource) );
        that.contextGL.attachShader(program, createShader(that, that.contextGL.FRAGMENT_SHADER,fragmentShaderSource) );
        that.contextGL.linkProgram(program);
        var success = that.contextGL.getProgramParameter(program, that.contextGL.LINK_STATUS);
        if(success){ return program; }
    
        console.error('major error in minicore\'s program creation');
        console.error(that.contextGL.getProgramInfoLog(program));
        that.contextGL.deleteProgram(program);
    };

    var storedPrograms = {};
    this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource, setup){
        if( !(name in storedPrograms) ){ 
            storedPrograms[name] = compileProgram(this, vertexShaderSource, fragmentShaderSource);
            this.contextGL.useProgram(storedPrograms[name]);
            setup(this.contextGL, storedPrograms[name]);
        }
        return storedPrograms[name];
    };
};

var shapes = {
    rectangle: function(){    
        var self = this;

        //unchanging attributes
            var points = [
                0,0,
                1,0,
                1,1,
                0,1,
            ];
            var vertexShaderSource =
                `          
                    //constants
                        uniform vec2 u_resolution; //drawing pane resolution
                        attribute vec2 a_position; //unit points
    
                    //variables
                        uniform vec2 u_translation;
                        uniform vec2 u_dimensions;
                        uniform float u_angle;
                        uniform vec2 u_anchor;
                        uniform vec4 u_colour; varying vec4 v_colour;
    
                    void main(){
                        //pass colour through
                            v_colour = u_colour;
                        
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
                    varying vec4 v_colour;
                                                                                
                    void main(){
                        gl_FragColor = v_colour; //vec4(1, 0, 0.5, 1);
                    }
                `;
            var setup = function(contextGL, program){
                //set u_resolution
                    contextGL.uniform2f(contextGL.getUniformLocation(program, "u_resolution"), contextGL.canvas.width, contextGL.canvas.height);
        
                //populate a_position buffer
                    var positionAttributeLocation = contextGL.getAttribLocation(program, "a_position");
                    var positionBuffer = contextGL.createBuffer();
                    contextGL.enableVertexAttribArray(positionAttributeLocation);
                    contextGL.bindBuffer(contextGL.ARRAY_BUFFER, positionBuffer); 
                    contextGL.vertexAttribPointer( positionAttributeLocation, 2, contextGL.FLOAT,false, 0, 0 );
                    contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(points), contextGL.STATIC_DRAW);
            };
            var program = minicore.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource, setup);
    
        //changeable attributes
            this.x = 0;       this.y = 0;
            this.width = 100; this.height = 100;
            this.angle = 0;   this.anchor = {x:0,y:0};
            this.colour = {r:1, g:0, b:0, a:1};
            function update(contextGL){
                contextGL.uniform2f(contextGL.getUniformLocation(program, "u_translation"), self.x, self.y);
                contextGL.uniform2f(contextGL.getUniformLocation(program, "u_dimensions"), self.width, self.height);
                contextGL.uniform1f(contextGL.getUniformLocation(program, "u_angle"), self.angle);
                contextGL.uniform2f(contextGL.getUniformLocation(program, "u_anchor"), self.anchor.x, self.anchor.y);
                contextGL.uniform4f(contextGL.getUniformLocation(program, "u_colour"), self.colour.r, self.colour.g, self.colour.b, self.colour.a);
            }
    
        this.render = function(contextGL){
            contextGL.useProgram(program);
            update(contextGL);
            contextGL.drawArrays(contextGL.TRIANGLE_FAN, 0, 4);
        };
    }
};

















var scene = [
    new shapes.rectangle,
    new shapes.rectangle,
    new shapes.rectangle,
    new shapes.rectangle,
];
scene[0].anchor = {x:1, y:1}; scene[0].colour = { r:1, g:0, b:0, a:1 };
scene[1].anchor = {x:0, y:1}; scene[1].colour = { r:0, g:1, b:0, a:1 };
scene[2].anchor = {x:1, y:0}; scene[2].colour = { r:0, g:0, b:1, a:1 };
scene[3].anchor = {x:0, y:0}; scene[3].colour = { r:1, g:1, b:0, a:1 };


minicore.contextGL.viewport(0, 0, minicore.contextGL.canvas.width, minicore.contextGL.canvas.height);
minicore.contextGL.clearColor(20/255, 20/255, 20/255, 1);

function render(){
    scene.forEach(a => a.render(minicore.contextGL));
}




setInterval(function(){
    scene[0].angle += 0.025;
    scene[1].angle += 0.025;
    scene[2].angle += 0.025;
    scene[3].angle += 0.025;
    render();
},1000/60);