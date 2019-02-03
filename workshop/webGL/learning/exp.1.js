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








var program = minicore.produceProgram(
    `          
        attribute vec4 a_position;

        void main(){
            gl_Position = a_position;
        }
    `, 
    `  
        precision mediump float;                
        varying vec4 v_color;
                                                                    
        void main(){
            gl_FragColor = vec4(1, 0, 0.5, 1);
        }                                                            
    `,
);








minicore.contextGL.viewport(0, 0, minicore.contextGL.canvas.width, minicore.contextGL.canvas.height);
minicore.contextGL.clearColor(20/255, 20/255, 20/255, 1);
function render(){
    minicore.contextGL.clear(minicore.contextGL.COLOR_BUFFER_BIT);

    //load "program" program
        minicore.contextGL.useProgram(program);

    //populate a_position buffer
        var positionAttributeLocation = minicore.contextGL.getAttribLocation(program, "a_position");
        var positionBuffer = minicore.contextGL.createBuffer();
        minicore.contextGL.enableVertexAttribArray(positionAttributeLocation);
        minicore.contextGL.bindBuffer(minicore.contextGL.ARRAY_BUFFER, positionBuffer);
        var positions = [
            -1, -1, 
            -1,  1, 
            1, -1, 

            -1,  1, 
            1, -1, 
            1,  1
        ]; 
        minicore.contextGL.vertexAttribPointer( positionAttributeLocation, 2, minicore.contextGL.FLOAT,false, 0, 0 );
        minicore.contextGL.bufferData(minicore.contextGL.ARRAY_BUFFER, new Float32Array(positions), minicore.contextGL.STATIC_DRAW);
    
    //perform draw
        var primitiveType = minicore.contextGL.TRIANGLES;
        var offset = 0;
        var count = 6;
        minicore.contextGL.drawArrays(primitiveType, offset, count);
}








render();