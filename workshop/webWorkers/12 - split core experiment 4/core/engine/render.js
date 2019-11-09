const render = new function(){
    const pageData = {
        defaultCanvasSize:{width:800, height:600},
        currentCanvasSize:{width:800, height:600},
        devicePixelRatio:1,
    };
    const canvas = new OffscreenCanvas(pageData.defaultCanvasSize.width, pageData.defaultCanvasSize.height);
    const context = canvas.getContext("webgl2", {alpha:false, preserveDrawingBuffer:true, stencil:true});
    let animationRequestId = undefined;
    let clearColour = {r:1,g:1,b:1,a:1};

    //webGL setup
        context.enable(context.BLEND);
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);

    //webGL program production
        let storedPrograms = {};
        this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource){
            dev.log('render','.produceProgram("'+name+'",'+vertexShaderSource+','+fragmentShaderSource+')');
            function compileProgram(vertexShaderSource, fragmentShaderSource){
                function createShader(type, source){
                    let shader = context.createShader(type);
                    context.shaderSource(shader, source);
                    context.compileShader(shader);
                    let success = context.getShaderParameter(shader, context.COMPILE_STATUS);
                    if(success){ return shader; }
            
                    console.error('major error in core\'s "'+ type +'" shader creation');
                    console.error(context.getShaderInfoLog(shader));
                    context.deleteShader(shader);
                }

                let program = context.createProgram();
                context.attachShader(program, createShader(context.VERTEX_SHADER,vertexShaderSource) );
                context.attachShader(program, createShader(context.FRAGMENT_SHADER,fragmentShaderSource) );
                context.linkProgram(program);
                let success = context.getProgramParameter(program, context.LINK_STATUS);
                if(success){ return program; }
            
                console.error('major error in core\'s program creation');
                console.error(context.getProgramInfoLog(program));
                context.deleteProgram(program);
            };

            if( !(name in storedPrograms) ){
                storedPrograms[name] = compileProgram(vertexShaderSource, fragmentShaderSource);
                context.useProgram(storedPrograms[name]);
            }

            return storedPrograms[name];
        };

    //canvas and webGL context adjustment
        this.clearColour = function(colour){
            dev.log('render','.clearColour('+JSON.stringify(colour)+')');
            if(colour == undefined){ return clearColour; }
            clearColour = colour;
            context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            dev.log('render','.adjustCanvasSize('+newWidth+','+newHeight+')');
            let changesMade = false;

            //request canvas data from the console, if none is provided in arguments
            // -> argument data > requested data > default data
            //(request portion currently missing)
            function func(direction,newValue){
                if(newValue != undefined){
                    if(pageData.currentCanvasSize[direction] != newValue){
                        pageData.currentCanvasSize[direction] = newValue;
                        canvas[direction] = pageData.currentCanvasSize[direction];
                        return true;
                    }
                }else{
                    if(pageData.currentCanvasSize[direction] != pageData.defaultCanvasSize[direction]){
                        pageData.currentCanvasSize[direction] = pageData.defaultCanvasSize[direction];
                        canvas[direction] = pageData.currentCanvasSize[direction];
                        return true;
                    }
                }
                return false;
            }
            changesMade = func('width',newWidth) || func('height',newHeight);

            return changesMade;
        };
        this.refreshCoordinates = function(){
            dev.log('render','.refreshCoordinates()');
            let w = context.canvas.width;
            let h = context.canvas.height;

            let x, y, width, height = 0;
            if(pageData.devicePixelRatio == 1){
                x = 0;
                y = 0;
                width = w;
                height = h;
            }else{
                x = 0;
                y = -h;
                width = w*2;
                height = h*2;
            }

            context.viewport(x, y, width, height);
        };
        this.refresh = function(){
            dev.log('render','.refresh()');
            this.clearColour(clearColour);
            this.adjustCanvasSize();
            this.refreshCoordinates();
            this.frameRateLimit(this.frameRateLimit());
        };

    //frame rate control
        const frameRateControl = {active:false, previousRenderTime:Date.now(), limit:30, interval:0};
        this.activeLimitToFrameRate = function(a){
            dev.log('render','.activeLimitToFrameRate('+a+')');
            if(a==undefined){return frameRateControl.active;}
            frameRateControl.active=a
        };
        this.frameRateLimit = function(a){
            dev.log('render','.frameRateLimit('+a+')');
            if(a==undefined){ return frameRateControl.limit; }
            frameRateControl.limit=a;
            frameRateControl.interval=1000/frameRateControl.limit;
        };

    //actual render
        function renderFrame(){
            dev.log('render','::renderFrame()');
            context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
            arrangement.getScene().render(context,{x:0,y:0,scale:1,angle:0});
            const transferableImage = canvas.transferToImageBitmap();
            communicationModule.run('printToScreen',[transferableImage],undefined,[transferableImage]);
        }
        function animate(timestamp){
            dev.log('render','::animate('+timestamp+')');
            animationRequestId = requestAnimationFrame(animate);

            //limit frame rate
                if(frameRateControl.active){
                    let currentRenderTime = Date.now();
                    let delta = currentRenderTime - frameRateControl.previousRenderTime;
                    if(delta < frameRateControl.interval){ return; }
                    frameRateControl.previousRenderTime = currentRenderTime - delta%frameRateControl.interval;
                }

            //attempt to render frame, if there is a failure; stop animation loop and report the error
                try{
                    renderFrame();
                }catch(error){
                    core.render.active(false);
                    console.error('major animation error');
                    console.error(error);
                }

            //perform stats collection
                core.stats.collect(timestamp);
        }
        this.frame = function(noClear=false){dev.log('render','.frame('+noClear+')');renderFrame(noClear);};
        this.active = function(bool){
            dev.log('render','.active('+bool+')');
            if(bool == undefined){return animationRequestId!=undefined;}

            if(bool){
                if(animationRequestId != undefined){return;}
                animate();
            }else{
                if(animationRequestId == undefined){return;}
                cancelAnimationFrame(animationRequestId);
                animationRequestId = undefined;
            }
        };

    //misc
        this.getCanvasDimensions = function(){ return {width:pageData.currentCanvasSize.width, height:pageData.currentCanvasSize.height}; };
        this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
            // let dot = core.shape.create('circle');
            // dot.name = 'core-drawDot-dot';
            // dot.stopAttributeStartedExtremityUpdate = true;
            // dot.dotFrame = false;
            // dot.x(x); dot.y(y);
            // dot.radius(r);
            // dot.computeExtremities();
            // dot.colour = colour;
            // dot.render(context);
        };
        this._dump = function(){
            dev.log('render','._dump()');
            dev.log('render','._dump -> pageData:'+JSON.stringify(pageData));
            dev.log('render','._dump -> storedPrograms:'+JSON.stringify(storedPrograms));
            dev.log('render','._dump -> frameRateControl:'+JSON.stringify(frameRateControl));
            dev.log('render','._dump -> clearColour:'+JSON.stringify(clearColour));
        };

    //mapping
        [
            {functionName:'clearColour',argumentList:['colour']},
            {functionName:'adjustCanvasSize',argumentList:['height','width']},
            {functionName:'refreshCoordinates',argumentList:[]},
            {functionName:'refresh',argumentList:[]},
            {functionName:'activeLimitToFrameRate',argumentList:['active']},
            {functionName:'frameRateLimit',argumentList:['limit']},
            {functionName:'frame',argumentList:[]},
            {functionName:'active',argumentList:['active']},
            {functionName:'getCanvasDimensions',argumentList:[]},
            {functionName:'drawDot',argumentList:['x','y','r','colour']},
            {functionName:'_dump',argumentList:[]},
        ].forEach( method => {
            communicationModule.function['render.'+method.functionName] = new Function( ...(method.argumentList.concat('return render.'+method.functionName+'('+method.argumentList.join(',')+');')) );
        });
};
render.refresh();