const render = new function(){
    const self = this; 

    let isBusy = true;
    this.isBusy = function(){ return isBusy };

    const pageData = {
        defaultCanvasSize:{width:800, height:600},
        currentCanvasSize:{width:800, height:600},
        selectedCanvasSize:{width:800, height:600},
        devicePixelRatio:1,
    };
    const canvas = new OffscreenCanvas(pageData.defaultCanvasSize.width, pageData.defaultCanvasSize.height);
    const context = canvas.getContext("webgl2", {alpha:false, preserveDrawingBuffer:true, stencil:true});
    let animationRequestId = undefined;
    let clearColour = {r:1,g:1,b:1,a:1};

    //webGL setup
        context.enable(context.BLEND);
        context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);

    //webGL program production
        const storedPrograms = {};
        this.produceProgram = function(name, vertexShaderSource, fragmentShaderSource){
            dev.log.render('.produceProgram(',name,vertexShaderSource,fragmentShaderSource); //#development
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
                dev.log.render('.produceProgram -> program not found; will be compiled and stored as "'+name+'"'); //#development
                storedPrograms[name] = compileProgram(vertexShaderSource, fragmentShaderSource);
                context.useProgram(storedPrograms[name]);
            }else{
                dev.log.render('.produceProgram -> program found; using stored program'); //#development
            }

            return storedPrograms[name];
        };

    //canvas and webGL context adjustment
        this.clearColour = function(colour){
            dev.log.render('.clearColour(',colour); //#development
            if(colour == undefined){ return clearColour; }
            clearColour = colour;
            context.clearColor(clearColour.r, clearColour.g, clearColour.b, 1);
        };
        this.adjustCanvasSize = function(newWidth, newHeight){
            dev.log.render('.adjustCanvasSize(',newWidth,newHeight); //#development
            let adjustCanvasSize_isBusy = {width:false,height:false};
            isBusy = true;

            function updateInternalCanvasSize(direction,newValue){
                dev.log.render('.adjustCanvasSize::updateInternalCanvasSize(',direction,newValue); //#development
                newValue *= pageData.devicePixelRatio;
                if(newValue != undefined){
                    if(pageData.currentCanvasSize[direction] != newValue){
                        pageData.currentCanvasSize[direction] = newValue;
                        canvas[direction] = pageData.currentCanvasSize[direction];
                    }
                }else{
                    if(pageData.currentCanvasSize[direction] != pageData.defaultCanvasSize[direction]){
                        pageData.currentCanvasSize[direction] = pageData.defaultCanvasSize[direction];
                        canvas[direction] = pageData.currentCanvasSize[direction];
                    }
                }

                self.refreshCoordinates();
                adjustCanvasSize_isBusy[direction] = false;
                isBusy = adjustCanvasSize_isBusy['width'] || adjustCanvasSize_isBusy['height'];
            }
            
            //request canvas data from the console, if none is provided in arguments
            // -> argument data > requested data > default data
            function updateSize_arguments(){
                dev.log.render('.adjustCanvasSize::updateSize_arguments()'); //#development
                adjustCanvasSize_isBusy = {width:true,height:true};

                if(newWidth != undefined){
                    updateInternalCanvasSize('width',newWidth*pageData.devicePixelRatio);
                }else{
                    dev.log.render('.adjustCanvasSize -> argument "newWidth" undefined; trying request...'); //#development
                    updateSize_dataRequest('width');
                }
                if(newHeight != undefined){
                    updateInternalCanvasSize('height',newHeight*pageData.devicePixelRatio);
                }else{
                    dev.log.render('.adjustCanvasSize -> argument "newHeight" undefined; trying request...'); //#development
                    updateSize_dataRequest('height');
                }
            }
            function updateSize_dataRequest(direction){
                dev.log.render('.adjustCanvasSize::updateSize_dataRequest(',direction); //#development
                const capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);

                interface.getCanvasAttributes([capitalizedDirection],[true]).then(sizes => {
                    pageData.selectedCanvasSize[direction] = sizes[0];
                    dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> '+capitalizedDirection+':'+pageData.selectedCanvasSize[direction]); //#development
                    const attribute = pageData.selectedCanvasSize[direction];

                    function unparseableErrorMessage(direction,attribute){
                        report.error( 'Canvas element '+direction+' is of an unparseable format: '+attribute );
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> unparseable format: '+attribute+', will use default instead'); //#development
                        updateSize_usingDefault(direction);
                    }

                    if( attribute.indexOf('%') == (attribute.length-1) ){ //percentage
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> its a percentage'); //#development
                        interface.getCanvasParentAttributes(['offset'+capitalizedDirection]).then(sizes => {
                            dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> parent'+capitalizedDirection+':'+sizes[0]); //#development
                            const parentSize = sizes[0];
                            const percent = parseFloat(attribute.slice(0,-1)) / 100;
                            dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> parsed percent: '+percent*100); //#development
                            if( isNaN(percent) ){ unparseableErrorMessage(direction,attribute); return; }
                            dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> calculated size: '+parentSize*percent); //#development
                            updateInternalCanvasSize(direction,parentSize*percent);
                        });
                    }else if( attribute.indexOf('px') != -1 ){ //px value
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> its a pixel number'); //#development
                        const val = parseFloat(attribute.slice(0,-2));
                        if( isNaN(val) ){ unparseableErrorMessage(direction,attribute); return; }
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> calculated size: '+val); //#development
                        updateInternalCanvasSize(direction,val);
                    }else{ //flat value
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> its a flat number'); //#development
                        const val = parseFloat(attribute);
                        if( isNaN(val) ){ unparseableErrorMessage(direction,attribute); return; }
                        dev.log.render('.adjustCanvasSize::updateSize_dataRequest -> calculated size: '+val); //#development
                        updateInternalCanvasSize(direction,val);
                    }
                });
            }
            function updateSize_usingDefault(direction){
                dev.log.render('.adjustCanvasSize::updateSize_usingDefault('+direction+')'); //#development
                updateInternalCanvasSize(direction,pageData.defaultCanvasSize[direction]);
            }

            interface.getWindowAttributes(['devicePixelRatio']).then(values => {
                pageData.devicePixelRatio = values[0];
                updateSize_arguments();
            });
        };
        this.refreshCoordinates = function(){
            dev.log.render('.refreshCoordinates()'); //#development
            dev.log.render('.refreshCoordinates: -> pageData.devicePixelRatio: '+pageData.devicePixelRatio); //#development
            let w = context.canvas.width;
            let h = context.canvas.height;
            dev.log.render('.refreshCoordinates: -> w:'+w+' h:'+h); //#development

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

            dev.log.render('.refreshCoordinates: -> context.viewport('+x+', '+y+', '+width+', '+height+')'); //#development
            context.viewport(x, y, width, height);

            interface.setCanvasAttributes([{name:'width',value:w/pageData.devicePixelRatio},{name:'height',value:h/pageData.devicePixelRatio}]);
        };
        this.refresh = function(allDoneCallback){
            dev.log.render('.refresh()'); //#development
            this.clearColour(clearColour);
            this.frameRateLimit(this.frameRateLimit());
            this.adjustCanvasSize();

            const refresh_interval = setInterval(function(){
                if(!render.isBusy()){
                    clearInterval(refresh_interval);
                    if(allDoneCallback){allDoneCallback()};
                }
            },1);
        };

    //frame rate control
        const frameRateControl = {active:false, previousRenderTime:Date.now(), limit:30, interval:0};
        this.activeLimitToFrameRate = function(a){
            dev.log.render('.activeLimitToFrameRate(',a); //#development
            if(a==undefined){return frameRateControl.active;}
            frameRateControl.active=a
        };
        this.frameRateLimit = function(a){
            dev.log.render('.frameRateLimit(',a); //#development
            if(a==undefined){ return frameRateControl.limit; }
            frameRateControl.limit=a;
            frameRateControl.interval=1000/frameRateControl.limit;
        };

    //actual render
        function renderFrame(noClear=false){
            dev.log.render('::renderFrame(',noClear); //#development

            function func(){
                if(!noClear){context.clear(context.COLOR_BUFFER_BIT | context.STENCIL_BUFFER_BIT);}
                arrangement.get().render(context,{x:0,y:0,scale:1,angle:0});
                const transferableImage = canvas.transferToImageBitmap();
                interface.printToScreen(transferableImage);
            }

            if( stats._active() ){
                const startTime = (new Date()).getTime();
                func();
                const endTime = (new Date()).getTime();
                stats.collectFrameTime( endTime - startTime );
            }else{
                func();
            }
        }
        function animate(timestamp){
            dev.log.render('::animate(',timestamp); //#development
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
                    render.active(false);
                    console.error('major animation error');
                    console.error(error);
                }

            //perform stats collection
                stats.collectFrameTimestamp(timestamp);
        }
        this.frame = function(noClear=false){
            dev.log.render('.frame(',noClear); //#development
            renderFrame(noClear);
        };
        this.active = function(bool){
            dev.log.render('.active(',bool); //#development
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
        this.getCanvasSize = function(){ return {width:pageData.currentCanvasSize.width/pageData.devicePixelRatio, height:pageData.currentCanvasSize.height/pageData.devicePixelRatio}; };
        this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){
            const dot = element.create_skipDatabase('circle','core-drawDot-dot');
            dot.dotFrame = false;
            dot.unifiedAttribute({x:x, y:y, radius:r, colour:colour});
            dot.render(context);
        };
        this._dump = function(){
            report.info('render._dump()');
            report.info('render._dump -> pageData: '+JSON.stringify(pageData));
            report.info('render._dump -> storedPrograms: '+JSON.stringify(storedPrograms));
            report.info('render._dump -> frameRateControl: '+JSON.stringify(frameRateControl));
            report.info('render._dump -> clearColour: '+JSON.stringify(clearColour));
        };
};