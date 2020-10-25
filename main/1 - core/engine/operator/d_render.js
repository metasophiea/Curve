this.render = new function(){
    const pageData = {
        defaultCanvasSize:{width:800, height:600},
        currentCanvasSize:{width:800, height:600},
        selectedCanvasSize:{width:800, height:600},
        devicePixelRatio:1,
    };

    //canvas and webGL context
        function getCanvasDimensionFromMain(){
            dev.log.render('::getCanvasDimensionFromMain()'); //#development

            function getDimensionOfCanvas(direction){
                dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas(',direction); //#development
                const capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);

                return new Promise((resolve, reject) => {
                    interface.getCanvasAttributes([capitalizedDirection],[true]).then(sizes => {
                        pageData.selectedCanvasSize[direction] = sizes[0];
                        dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> '+capitalizedDirection+':',pageData.selectedCanvasSize[direction]); //#development
                        const attribute = pageData.selectedCanvasSize[direction];

                        function unparseableErrorMessage(direction,attribute){
                            report.error( 'Canvas element '+direction+' is of an unparseable format: '+attribute );
                            dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> unparseable format: '+attribute+', will use default instead'); //#development
                            resolve();
                        }

                        if( attribute.indexOf('%') == (attribute.length-1) ){ //percentage
                            dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> its a percentage'); //#development
                            interface.getCanvasParentAttributes(['offset'+capitalizedDirection]).then(sizes => {
                                dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> parent'+capitalizedDirection+':',sizes[0]); //#development
                                const parentSize = sizes[0];
                                const percent = parseFloat(attribute.slice(0,-1)) / 100;
                                dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> parsed percent:',percent*100); //#development
                                if( isNaN(percent) ){ unparseableErrorMessage(direction,attribute); return; }
                                dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> calculated size:',parentSize*percent); //#development
                                resolve({direction:direction,value:parentSize*percent});
                            });
                        }else if( attribute.indexOf('px') != -1 ){ //px value
                            dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> its a pixel number'); //#development
                            const val = parseFloat(attribute.slice(0,-2));
                            if( isNaN(val) ){ unparseableErrorMessage(direction,attribute); return; }
                            dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> calculated size:',val); //#development
                            resolve({direction:direction,value:val});
                        }else{ //flat value
                            dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> its a flat number'); //#development
                            const val = parseFloat(attribute);
                            if( isNaN(val) ){ unparseableErrorMessage(direction,attribute); return; }
                            dev.log.render('::getCanvasDimensionFromMain::getDimensionOfCanvas -> calculated size:',val); //#development
                            resolve({direction:direction,value:val});
                        }
                    });
                });
            }
            function getDevicePixelRatio(){
                dev.log.render('::getCanvasDimensionFromMain::getDevicePixelRatio()'); //#development
                return new Promise((resolve, reject) => {
                    interface.getWindowAttributes(['devicePixelRatio']).then(values => {
                        dev.log.render('::getCanvasDimensionFromMain::getDevicePixelRatio -> devicePixelRatio:',values[0]); //#development
                        pageData.devicePixelRatio = values[0];
                        resolve(values[0]);
                    });
                });
            }

            return new Promise((resolve, reject) => {
                Promise.all([getDimensionOfCanvas('width'),getDimensionOfCanvas('height'),getDevicePixelRatio()]).then(values => {
                    pageData.currentCanvasSize.width = values[0].value*values[2];
                    pageData.currentCanvasSize.height = values[1].value*values[2];
                    resolve({width:values[0].value, height:values[1].value, devicePixelRatio:values[2]})
                });
            });
        }

        this.clearColour = function(colour){
            if(colour == undefined){
                return ENGINE.render__get_clear_colour();
            }else{
                ENGINE.render__set_clear_colour(colour);
            }
        };
        this.getCanvasSize = function(){
            return ENGINE.render__get_canvas_size();
        };

        this.adjustCanvasSize = function(newWidth, newHeight, devicePixelRatio){
            dev.log.render('.adjustCanvasSize(',newWidth,newHeight,devicePixelRatio); //#development
            ENGINE.render__adjust_canvas_size(newWidth, newHeight, devicePixelRatio);
        };
        this.adjustCanvasSampleCount = function(newSampleCount){
            dev.log.render('.adjustCanvasSampleCount(',newSampleCount); //#development
            ENGINE.render__adjust_canvas_sample_count(newSampleCount);
        }
        this.refreshCoordinates = function(){
            ENGINE.render__refresh_coordinates();
        };
        this.refresh = function(){
            return new Promise((resolve, reject) => {
                getCanvasDimensionFromMain().then(data => {
                    ENGINE.render__refresh(data.width,data.height,data.devicePixelRatio);
                    resolve();
                });
            });
        };

    //frame rate control
        const frameRateControl = {active:false, previousRenderTime:Date.now(), limit:30, interval:1000/30};
        this.activeLimitToFrameRate = function(a){
            dev.log.render('.activeLimitToFrameRate(',a); //#development
            if(a == undefined){ return frameRateControl.active; }
            frameRateControl.active = a
        };
        this.frameRateLimit = function(a){
            dev.log.render('.frameRateLimit(',a); //#development
            if(a==undefined){ return frameRateControl.limit; }
            frameRateControl.limit = a;
            frameRateControl.interval = 1000/frameRateControl.limit;
        };

    //actual render
        let animationRequestId = undefined;
        this.frame = function(noClear=false){
            ENGINE.render__frame(noClear);
        };
        function animate(timestamp){
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
                    if( operator.stats.active() ){
                        const startTime = performance.now();
                        ENGINE.render__frame(false);
                        const endTime = performance.now();
                        operator.stats.collectFrameTime(endTime - startTime);
                    }else{
                        ENGINE.render__frame(false);
                    }
                }catch(error){
                    self.operator.render.active(false);
                    console.error('major animation error');
                    console.error(error);
                }

            //perform stats collection
                operator.stats.collectFrameTimestamp(timestamp);
        }
        this.active = function(bool){
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
        this.drawDot = function(x,y,r=2,colour={r:1,g:0,b:0,a:1}){};
        this._dump = function(){
            console.log("┌─Operator Render Dump─");
            console.log("│ animationRequestId:", animationRequestId);
            console.log("│ pageData.defaultCanvasSize:", pageData.defaultCanvasSize);
            console.log("│ pageData.currentCanvasSize:", pageData.currentCanvasSize);
            console.log("│ pageData.selectedCanvasSize:", pageData.selectedCanvasSize);
            console.log("│ pageData.devicePixelRatio:", pageData.devicePixelRatio);
            console.log("│");
            console.log("│ frameRateControl.active:", frameRateControl.active);
            console.log("│ frameRateControl.previousRenderTime:", frameRateControl.previousRenderTime);
            console.log("│ frameRateControl.limit:", frameRateControl.limit);
            console.log("│ frameRateControl.interval:", frameRateControl.interval);
            console.log("└──────────────────────");
            ENGINE.render__dump();
        };
};