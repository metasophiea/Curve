function cartesianAngleAdjust(x,y,angle){
    function cartesian2polar(x,y){
        var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;
    
        if(x === 0){
            if(y === 0){ang = 0;}
            else if(y > 0){ang = 0.5*Math.PI;}
            else{ang = 1.5*Math.PI;}
        }
        else if(y === 0){
            if(x >= 0){ang = 0;}else{ang = Math.PI;}
        }
        else if(x >= 0){ ang = Math.atan(y/x); }
        else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }
    
        return {'dis':dis,'ang':ang};
    };
    function polar2cartesian(angle,distance){
        return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
    };

    if(angle == 0 || angle%Math.PI*2 == 0){ return {x:x,y:y}; }
    var polar = cartesian2polar( x, y );
    polar.ang += angle;
    return polar2cartesian( polar.ang, polar.dis );
};



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














var shape = new function(){
    this.group = function(){
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        var children = [];

        this.append = function(shape){ children.push(shape); };
        this.prepend = function(shape){ children.unshift(shape); };
        this.remove = function(shape){ children.splice(children.indexOf(shape), 1); };
        this.clear = function(){ children = []; };

        this.render = function(context,offset={x:0,y:0,angle:0}){
            var point = cartesianAngleAdjust(this.x,this.y,offset.angle);
            var result = { 
                x: point.x + offset.x, 
                y: point.y + offset.y, 
                angle: offset.angle + this.angle,
            };

            children.forEach(a => a.render(context,result));
        };
    };
    this.rectangle = function(){
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.angle = 0;
        this.anchor = {x:0,y:0};
        this.colour = {r:1,g:0,b:0,a:1};

        //rendering circuitry 
            var self = this;
            var points = [
                0,0,
                1,0,
                1,1,
                0,1,
            ];
            var vertexShaderSource = `
                //constants
                    attribute vec2 point;

                //variables
                    struct location{
                        vec2 xy;
                        float angle;
                    };
                    uniform location adjust;

                    uniform vec2 resolution;
                    uniform vec2 dimensions;
                    uniform vec2 anchor;
                    uniform vec4 colour; varying vec4 FRAGMENTcolour;

                void main(){
                    //pass colour through
                        FRAGMENTcolour = colour;

                    //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                        vec2 P = point * dimensions;
                        P = vec2( P.x - dimensions.x*anchor.x, P.y - dimensions.y*anchor.y );
                        P = vec2( 
                            P.x*cos(adjust.angle) + P.y*sin(adjust.angle), 
                            P.y*cos(adjust.angle) - P.x*sin(adjust.angle)
                        );
                        P += adjust.xy;

                    //convert from unit space to clipspace
                        gl_Position = vec4( ((point+P) / resolution) * vec2(2, -2), 0, 1 );
                }

            `;
            var fragmentShaderSource = `  
                precision mediump float;
                varying vec4 FRAGMENTcolour;
                                                                            
                void main(){
                    gl_FragColor = FRAGMENTcolour;
                }
            `;
            function setup(context, program){
                //populate point buffer
                    var pointAttributeLocation = context.getAttribLocation(program, "point");
                    var pointBuffer = context.createBuffer();
                    context.enableVertexAttribArray(pointAttributeLocation);
                    context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                    context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                    context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
            };
            var program = minicore.produceProgram('rectangle', vertexShaderSource, fragmentShaderSource, setup);
    
            function update(context,adjust){
                context.uniform2f(context.getUniformLocation(program, "adjust.xy"), adjust.x, adjust.y);
                context.uniform1f(context.getUniformLocation(program, "adjust.angle"), adjust.angle);
                context.uniform2f(context.getUniformLocation(program, "resolution"), context.canvas.width, context.canvas.height);
                context.uniform2f(context.getUniformLocation(program, "dimensions"), self.width, self.height);
                context.uniform2f(context.getUniformLocation(program, "anchor"), self.anchor.x, self.anchor.y);
                context.uniform4f(context.getUniformLocation(program, "colour"), self.colour.r, self.colour.g, self.colour.b, self.colour.a);
            }

            this.render = function(context,offset={x:0,y:0,angle:0}){
                var point = cartesianAngleAdjust(this.x,this.y,offset.angle);
                var result = { 
                    x: point.x + offset.x, 
                    y: point.y + offset.y, 
                    angle: -(offset.angle + this.angle),
                };

                context.useProgram(program);
                update(context,result);
                context.drawArrays(context.TRIANGLE_FAN, 0, 4);
            };
    };
};















var group_1 = new shape.group();
    group_1.x = -200;
    var rectangle_1 = new shape.rectangle();
        rectangle_1.width = 30;
        rectangle_1.height = 30;
        rectangle_1.colour = {r:1,g:0,b:0,a:1};
        group_1.append(rectangle_1);
    var group_2 = new shape.group();
        group_2.x = 50;
        group_1.append(group_2);
        var rectangle_2 = new shape.rectangle();
            rectangle_2.width = 30;
            rectangle_2.height = 30;
            rectangle_2.colour = {r:0,g:1,b:0,a:1};
            group_2.append(rectangle_2);
        var rectangle_3 = new shape.rectangle();
            rectangle_3.x = 50;
            rectangle_3.width = 30;
            rectangle_3.height = 30;
            rectangle_3.colour = {r:0,g:0,b:1,a:1};
            group_2.append(rectangle_3);












var lastTimestamp = 0;
var animationRequestId;
var interval = 10;
var lastInterval = 0;
function animate(timestamp){
    animationRequestId = requestAnimationFrame(animate);

    var t = Math.floor(timestamp/interval);
    if(t != lastInterval){
        lastInterval = t;

        group_1.angle += 0.025;
        group_2.angle += 0.025;
        rectangle_3.angle += 0.025;

        // recordTimestamp(timestamp);
    }

    //attempt to render frame, if there is a failure; stop animation loop and report the error
        try{
            group_1.render(minicore.context);
        }catch(error){
            console.error('major animation error');
            console.error(error);
            cancelAnimationFrame(animationRequestId);
        }

    lastTimestamp = timestamp;
}
animate(0);

function recordTimestamp(timestamp){
    console.log( 1000/(timestamp-lastTimestamp) );
}