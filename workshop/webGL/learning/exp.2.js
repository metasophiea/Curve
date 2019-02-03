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

scene.push(
    {
        type:'rectangle',
        x:0,
        y:0,
        // width:10,
        // height:10,

        vertexShaderSource:
        `          
            uniform vec2 u_resolution;
            uniform vec2 a_translation;
            attribute vec2 a_position;

            void main(){
                gl_Position = vec4( ((a_position+a_translation) / u_resolution) * vec2(2, -2), 0, 1 );
            }
        `,
        fragmentShaderSource:
        `  
            precision mediump float;
                                                                        
            void main(){
                gl_FragColor = vec4(1, 0, 0.5, 1);
            }                                                            
        `,
        renderProgram:undefined,
        setupCode:function(contextGL){
            //populate u_resolution
                var resolutionUniformLocation = contextGL.getUniformLocation(this.program, "u_resolution");
                contextGL.uniform2f(resolutionUniformLocation, contextGL.canvas.width, contextGL.canvas.height);

            //populate a_position buffer
                var positionAttributeLocation = contextGL.getAttribLocation(this.program, "a_position");
                var positionBuffer = contextGL.createBuffer();
                contextGL.enableVertexAttribArray(positionAttributeLocation);
                contextGL.bindBuffer(contextGL.ARRAY_BUFFER, positionBuffer);
                var positions = [
                    0,  0, 
                    0,  10, 
                    10, 10, 
                    10, 0, 
                ]; 
                contextGL.vertexAttribPointer( positionAttributeLocation, 2, contextGL.FLOAT,false, 0, 0 );
                contextGL.bufferData(contextGL.ARRAY_BUFFER, new Float32Array(positions), contextGL.STATIC_DRAW);
        },
        renderCode:function(contextGL){
            //populate a_translation
                var translation = contextGL.getUniformLocation(this.program, "a_translation");
                contextGL.uniform2f(translation, this.x, this.y);

            //perform draw
                var primitiveType = contextGL.TRIANGLE_FAN;
                contextGL.drawArrays(primitiveType, 0, 4);
        },
    }
);






minicore.contextGL.viewport(0, 0, minicore.contextGL.canvas.width, minicore.contextGL.canvas.height);
minicore.contextGL.clearColor(20/255, 20/255, 20/255, 1);
function render(){
    for(var a = 0; a < scene.length; a++){
        var item = scene[a];
        if(item.program == undefined){ 
            item.program = minicore.produceProgram(item.vertexShaderSource, item.fragmentShaderSource);
            minicore.contextGL.useProgram(item.program);
            item.setupCode(minicore.contextGL);
        }else{
            minicore.contextGL.useProgram(item.program);
        }
        item.renderCode(minicore.contextGL);
    }
}
render();