var minicore = new function(){
    this.context = document.getElementById("canvas").getContext("webgl");

    function compileProgram(that, vertexShaderSource, fragmentShaderSource){
        function createShader(that, type, source){
            var shader = that.context.createShader(type);
            that.context.shaderSource(shader, source);
            that.context.compileShader(shader);
            var success = that.context.getShaderParameter(shader, that.context.COMPILE_STATUS);
            if(success){ return shader; }
    
            console.error('major error in minicore\'s "'+ type +'" shader creation');
            console.error(that.context.getShaderInfoLog(shader));
            that.context.deleteShader(shader);
        }

        var program = that.context.createProgram();
        that.context.attachShader(program, createShader(that, that.context.VERTEX_SHADER,vertexShaderSource) );
        that.context.attachShader(program, createShader(that, that.context.FRAGMENT_SHADER,fragmentShaderSource) );
        that.context.linkProgram(program);
        var success = that.context.getProgramParameter(program, that.context.LINK_STATUS);
        if(success){ return program; }
    
        console.error('major error in minicore\'s program creation');
        console.error(that.context.getProgramInfoLog(program));
        that.context.deleteProgram(program);
    };

    var storedPrograms = {};
    this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource, setup){
        if( !(name in storedPrograms) ){ 
            storedPrograms[name] = compileProgram(this, vertexShaderSource, fragmentShaderSource);
            this.context.useProgram(storedPrograms[name]);
            setup(this.context, storedPrograms[name]);
        }
        return storedPrograms[name];
    };
};


var shapes = new function(){
    this.rectangle = function(){
        var self = this;

        this.type = 'rectangle';
        this.x = 0;       this.y = 0;
        this.width = 100; this.height = 100;
        this.angle = 0;   this.anchor = {x:0,y:0};
        this.colour = {r:1, g:0, b:0, a:1};

        var points = [
            0,0,
            1,0,
            1,1,
            0,1,
        ];
        var vertexShaderSource =
            `          
                //constants
                    uniform vec2 resolution; //drawing pane resolution
                    attribute vec2 position; //unit points

                //variables
                    uniform vec2 translation;
                    uniform vec2 dimensions;
                    uniform float angle;
                    uniform vec2 anchor;
                    uniform vec4 colour; varying vec4 FRAGMENTcolour;

                void main(){
                    //pass colour through
                        FRAGMENTcolour = colour;
                    
                    //adjust unit points based on attributes
                        vec2 tmp_position = position * dimensions;

                    //perform anchored rotation, and leave shape with it's anchor over the chosen point
                        tmp_position = vec2(
                            tmp_position.x - dimensions.x*anchor.x,
                            tmp_position.y - dimensions.y*anchor.y
                        );
                        tmp_position = vec2( 
                            tmp_position.x*cos(angle) + tmp_position.y*sin(angle), 
                            tmp_position.y*cos(angle) - tmp_position.x*sin(angle)
                        );

                    //convert from unit space to clipspace
                        gl_Position = vec4( ((tmp_position+translation) / resolution) * vec2(2, -2), 0, 1 );
                }
            `;
        var fragmentShaderSource =
            `  
                precision mediump float;
                varying vec4 FRAGMENTcolour;
                                                                            
                void main(){
                    gl_FragColor = FRAGMENTcolour;
                }
            `;
        function setup(context, program){
            //set resolution
                context.uniform2f(context.getUniformLocation(program, "resolution"), context.canvas.width, context.canvas.height);
    
            //populate position buffer
                var positionAttributeLocation = context.getAttribLocation(program, "position");
                var positionBuffer = context.createBuffer();
                context.enableVertexAttribArray(positionAttributeLocation);
                context.bindBuffer(context.ARRAY_BUFFER, positionBuffer); 
                context.vertexAttribPointer( positionAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
        };
        var program = minicore.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource, setup);

        function update(context){
            context.uniform2f(context.getUniformLocation(program, "translation"), self.x, self.y);
            context.uniform2f(context.getUniformLocation(program, "dimensions"), self.width, self.height);
            context.uniform1f(context.getUniformLocation(program, "angle"), self.angle);
            context.uniform2f(context.getUniformLocation(program, "anchor"), self.anchor.x, self.anchor.y);
            context.uniform4f(context.getUniformLocation(program, "colour"), self.colour.r, self.colour.g, self.colour.b, self.colour.a);
        }
    
        this.render = function(context){
            context.useProgram(program);
            update(context);
            context.drawArrays(context.TRIANGLE_FAN, 0, 4);
        };
    };
    this.doubleRectangle_1 = function(){
        var self = this;

        this.type = 'doubleRectangle_1';
        this.x = 0;       this.y = 0;
        this.width = 100; this.height = 100;
        this.angle = 0;   this.anchor = {x:0,y:0};
        this.colours = [
            {r:1, g:0, b:0, a:1},
            {r:0, g:1, b:0, a:1},
        ];

        var points = [
            //outter rectangle
                0, 0, 
                1, 0,
                1, 1,

                0, 0,
                0, 1,
                1, 1,
            //inner reactangle
                0.25, 0.25, 
                0.75, 0.25,
                0.75, 0.75,

                0.25, 0.25,
                0.25, 0.75,
                0.75, 0.75,
        ];
        var vertexShaderSource =
            `          
                //constants
                    uniform vec2 resolution; //drawing pane resolution
                    attribute vec2 position; //unit points
                    attribute float index; //index

                //variables
                    uniform vec2 translation;
                    uniform vec2 dimensions;
                    uniform float angle;
                    uniform vec2 anchor;

                    uniform vec4 colour_1;
                    uniform vec4 colour_2;
                    varying vec4 FRAGMENTcolour;

                void main(){
                    //pass colour through
                        if( index == 0.0 ){
                            FRAGMENTcolour = colour_1;
                        }else{
                            FRAGMENTcolour = colour_2;
                        }
                    
                    //adjust unit points based on attributes
                        vec2 tmp_position = position * dimensions;

                    //perform anchored rotation, and leave shape with it's anchor over the chosen point
                        tmp_position = vec2(
                            tmp_position.x - dimensions.x*anchor.x,
                            tmp_position.y - dimensions.y*anchor.y
                        );
                        tmp_position = vec2( 
                            tmp_position.x*cos(angle) + tmp_position.y*sin(angle), 
                            tmp_position.y*cos(angle) - tmp_position.x*sin(angle)
                        );

                    //convert from unit space to clipspace
                        gl_Position = vec4( ((tmp_position+translation) / resolution) * vec2(2, -2), 0, 1 );
                }
            `;
        var fragmentShaderSource =
            `  
                precision mediump float;
                varying vec4 FRAGMENTcolour;
                                                                            
                void main(){
                    gl_FragColor = FRAGMENTcolour;
                }
            `;
        function setup(context, program){
            //set resolution
                context.uniform2f(context.getUniformLocation(program, "resolution"), context.canvas.width, context.canvas.height);
    
            //populate position buffer
                var positionAttributeLocation = context.getAttribLocation(program, "position");
                var positionBuffer = context.createBuffer();
                context.enableVertexAttribArray(positionAttributeLocation);
                context.bindBuffer(context.ARRAY_BUFFER, positionBuffer); 
                context.vertexAttribPointer( positionAttributeLocation, 2, context.FLOAT, false, 0, 0 );
                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);

            //populate an index buffer
                var indexAttributeLocation = context.getAttribLocation(program, "index");
                var indexBuffer = context.createBuffer();
                context.enableVertexAttribArray(indexAttributeLocation);
                context.bindBuffer(context.ARRAY_BUFFER, indexBuffer); 
                context.vertexAttribPointer( indexAttributeLocation, 1, context.FLOAT, false, 0, 0 );
                context.bufferData(context.ARRAY_BUFFER, new Float32Array([0,0,0,0,0,0,1,1,1,1,1,1]), context.STATIC_DRAW);
        };
        var program = minicore.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource, setup);

        function update(context){
            context.uniform2f(context.getUniformLocation(program, "translation"), self.x, self.y);
            context.uniform2f(context.getUniformLocation(program, "dimensions"), self.width, self.height);
            context.uniform1f(context.getUniformLocation(program, "angle"), self.angle);
            context.uniform2f(context.getUniformLocation(program, "anchor"), self.anchor.x, self.anchor.y);
            context.uniform4f(context.getUniformLocation(program, "colour_1"), self.colours[0].r, self.colours[0].g, self.colours[0].b, self.colours[0].a);
            context.uniform4f(context.getUniformLocation(program, "colour_2"), self.colours[1].r, self.colours[1].g, self.colours[1].b, self.colours[1].a);
        }
    
        this.render = function(context){
            context.useProgram(program);
            update(context);
            context.drawArrays(context.TRIANGLES, 0, 12);
        };
    };
    this.doubleRectangle_2 = function(){
        var self = this;

        //shape attributes
            this.type = 'doubleRectangle_1';
            this.x = 0;       this.y = 0;
            this.width = 100; this.height = 100;
            this.angle = 0;   this.anchor = {x:0,y:0};
            this.flang = 0;
            this.colours = [
                {r:1, g:0, b:0, a:1},
                {r:0, g:1, b:0, a:1},
                {r:0, g:0, b:1, a:1},
            ];

        //shape description
            var points = [
                //outter rectangle
                    0, 0, 
                    1, 0,
                    1, 1,
        
                    0, 0,
                    0, 1,
                    1, 1,
                //middle reactangle
                    0.1, 0.1, 
                    0.9, 0.1,
                    0.9, 0.9,
        
                    0.1, 0.1,
                    0.1, 0.9,
                    0.9, 0.9,
                //inner reactangle
                    0.2, 0.2, 
                    0.8, 0.2,
                    0.8, 0.8,
        
                    0.2, 0.2,
                    0.2, 0.8,
                    0.8, 0.8,
            ];
            var vertexShaderSource =
            `          
                //index
                    attribute lowp float index;

                //constants
                    uniform vec2 resolution;  //drawing pane resolution
                    attribute vec2 position;  //unit points

                //variables
                    uniform vec2 translation;
                    uniform vec2 dimensions;
                    uniform float angle;
                    uniform vec2 anchor;
                    uniform float flang;
                    uniform vec4 colours[3]; varying vec4 FRAGMENTcolour;

                void main(){

                    //set FRAGMENTcolour
                        if(index < 6.0){
                            FRAGMENTcolour = colours[0];
                        }else if(index >= 6.0 && index < 12.0){
                            FRAGMENTcolour = colours[1];
                        }else{
                            FRAGMENTcolour = colours[2];
                        }

                    //copy position into editible variable
                        vec2 tmp_position = position;

                    //flang
                        if(index == 6.0 || index == 7.0){
                            tmp_position.y = tmp_position.y - flang;
                        }

                    //adjust unit points based on attributes
                        tmp_position = tmp_position * dimensions;

                    //perform anchored rotation, and leave shape with it's anchor over the chosen point
                        tmp_position = vec2(
                            tmp_position.x - dimensions.x*anchor.x,
                            tmp_position.y - dimensions.y*anchor.y
                        );
                        tmp_position = vec2( 
                            tmp_position.x*cos(angle) + tmp_position.y*sin(angle), 
                            tmp_position.y*cos(angle) - tmp_position.x*sin(angle)
                        );

                    //convert from unit space to clipspace
                        gl_Position = vec4( ((tmp_position+translation) / resolution) * vec2(2, -2), 0, 1 );
                }
            `;
        var fragmentShaderSource =
            `  
                precision mediump float;
                varying vec4 FRAGMENTcolour;
                                                                            
                void main(){ gl_FragColor = FRAGMENTcolour; }
            `;
        function setup(context, program){
            //set resolution
                context.uniform2f(context.getUniformLocation(program, "resolution"), context.canvas.width, context.canvas.height);
    
            //populate position buffer
                var positionAttributeLocation = context.getAttribLocation(program, "position");
                var positionBuffer = context.createBuffer();
                context.enableVertexAttribArray(positionAttributeLocation);
                context.bindBuffer(context.ARRAY_BUFFER, positionBuffer); 
                context.vertexAttribPointer( positionAttributeLocation, 2, context.FLOAT, false, 0, 0 );
                context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);

            //populate index
                var indexAttributeLocation = context.getAttribLocation(program, "index");
                var indexBuffer = context.createBuffer();
                context.enableVertexAttribArray(indexAttributeLocation);
                context.bindBuffer(context.ARRAY_BUFFER, indexBuffer); 
                context.vertexAttribPointer( indexAttributeLocation, 1, context.FLOAT, false, 0, 0 );
                context.bufferData(context.ARRAY_BUFFER, new Float32Array(Array.apply(null, {length:points.length/2}).map(Number.call, Number)), context.STATIC_DRAW);
        };
        function update(context){
            context.uniform2f(context.getUniformLocation(program, "translation"), self.x, self.y);
            context.uniform2f(context.getUniformLocation(program, "dimensions"), self.width, self.height);
            context.uniform1f(context.getUniformLocation(program, "angle"), self.angle);
            context.uniform2f(context.getUniformLocation(program, "anchor"), self.anchor.x, self.anchor.y);
            context.uniform4fv(context.getUniformLocation(program, "colours"), self.colours.map(a => [a.r,a.g,a.b,a.a]).reduce((a,b) => {return a.concat(b)}));
            context.uniform1f(context.getUniformLocation(program, "flang"), self.flang);
        }
        var program = minicore.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource, setup);
        
        this.render = function(context){
            context.useProgram(program);
            update(context);
            context.drawArrays(context.TRIANGLES, 0, points.length/2);
        };
    };
};










var scene = [
    new shapes.doubleRectangle_2,
];
scene[0].anchor = {x:0.5, y:0.5}; 


minicore.context.viewport(0, 0, minicore.context.canvas.width, minicore.context.canvas.height);
minicore.context.clearColor(20/255, 20/255, 20/255, 1);

function render(){
    scene.forEach(a => a.render(minicore.context));
}
render();

setInterval(function(){
    scene[0].angle += 0.025;
    render();
},1000/60);



var dir = 1;
scene[0].flang = 0.5;
setInterval(function(){
    scene[0].flang += 0.1*dir;
    if(scene[0].flang <= 0.1 || scene[0].flang >= 0.9){
        dir = -dir;
    }
},1000/10);
