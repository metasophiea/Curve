_canvas_.core.go.add( function(){ 
    let rectangleCount = 16;
    let canvasSize = {width:0,height:0};

    //element generation
        let upper_band = {
            elements:[],
            tick:0,
            tickStep:0.02*rectangleCount,
            wavelength:3,
            colour:{
                current:{r:0.9,g:0,b:0,a:1},
                origin:{r:1,g:0,b:0,a:1},
                destination:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
                journeyPercentageStepSize:1/40,
                journeyPercentage:0,
                history:(new Array(rectangleCount)).fill().map(() => {return {r:1,g:1,b:1,a:1}}),
                changeCounter:0,
                changeStepSize:1/2,
            },
        };

        let middle_band = {
            elements:[],
            tick:0,
            tickStep:0.02*rectangleCount,
            wavelength:2,
            colour:{
                current:{r:0,g:0.9,b:0,a:1},
                origin:{r:1,g:1,b:0,a:1},
                destination:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
                journeyPercentageStepSize:1/40,
                journeyPercentage:0,
                history:(new Array(rectangleCount)).fill().map(() => {return {r:1,g:1,b:1,a:1}}),
                changeCounter:0,
                changeStepSize:1/3,
            },
        };

        let lower_band = {
            elements:[],
            tick:0,
            tickStep:0.02*rectangleCount,
            wavelength:1,
            colour:{
                current:{r:0,g:0,b:0.9,a:1},
                origin:{r:1,g:1,b:0,a:1},
                destination:{r:Math.random(),g:Math.random(),b:Math.random(),a:1},
                journeyPercentageStepSize:1/30,
                journeyPercentage:0,
                history:(new Array(rectangleCount)).fill().map(() => {return {r:1,g:1,b:1,a:1}}),
                changeCounter:0,
                changeStepSize:1/4,
            },
        };

        function produceRectangle(a,x,y,namePrefix,grouping){
            let rectangle = _canvas_.core.element.create('rectangle',namePrefix+a);
            rectangle.unifiedAttribute({ x:(x - a*30), y:y, width:30, height:30 });
            _canvas_.core.arrangement.append(rectangle);
            grouping.push(rectangle);
        };
        _canvas_.core.render.getCanvasSize().then(newCanvasSize => {
            canvasSize = newCanvasSize; 
            for(let a = 0; a < rectangleCount; a++){
                produceRectangle( a, (200 + canvasSize.width/2), (-175 + canvasSize.height/2), 'upperBand_rectangle_', upper_band.elements );
                produceRectangle( a, (200 + 20/2 + canvasSize.width/2), (-100 + canvasSize.height/2), 'middleBand_rectangle_', middle_band.elements );
                produceRectangle( a, (200 + canvasSize.width/2), (75 + canvasSize.height/2), 'lowerBand_rectangle_', lower_band.elements );
            }  
        });

    //animation
        function blendColours(A,B,p){ return { r:(1-p)*A.r + p*B.r, g:(1-p)*A.g + p*B.g, b:(1-p)*A.b + p*B.b, a:(1-p)*A.a + p*B.a }; }
        function updateColour(band){
            if(band.colour.changeCounter >= 1){
                band.colour.changeCounter = 0;

                if(band.colour.journeyPercentage >= 1){
                    band.colour.journeyPercentage = 0;
                    band.colour.origin = band.colour.destination;
                    band.colour.current = band.colour.destination;
                    band.colour.destination = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                }else{
                    band.colour.current = blendColours(band.colour.current,band.colour.destination,band.colour.journeyPercentage);
                }

                band.colour.history.push(band.colour.current);
                if(band.colour.history.length > rectangleCount){ band.colour.history.shift(); }
                band.colour.journeyPercentage += band.colour.journeyPercentageStepSize;
            }
            band.colour.changeCounter += band.colour.changeStepSize;
        }

        setInterval(function(){
            updateColour(upper_band);
            updateColour(middle_band);
            updateColour(lower_band);

            //upper band
                upper_band.elements.forEach((element,index) => {
                    let t = Math.PI*( (upper_band.tick+index*upper_band.wavelength)/upper_band.elements.length );
                    element.unifiedAttribute({ 
                            width:30 + 25*Math.sin(t), 
                            height:30 + 25*Math.cos(t), 
                            colour:upper_band.colour.history[index]
                        }
                    );
                });

            //middle band
                middle_band.elements.forEach((element,index) => {
                    let t = Math.PI*( (middle_band.tick+index*middle_band.wavelength)/middle_band.elements.length );
                    element.unifiedAttribute({ 
                            y:-75 + 30 + 25*Math.sin(t) + canvasSize.height/2,
                            height:30 + 25*Math.cos(t),
                            colour:middle_band.colour.history[index]
                        }
                    );
                });

            //lower band
                lower_band.elements.forEach((element,index) => {
                    let t = Math.PI*( (lower_band.tick+index*lower_band.wavelength)/lower_band.elements.length );
                    element.unifiedAttribute({ 
                            width:30 + 25*Math.sin(t),
                            y:75 + canvasSize.height/2 + 30 + 25*Math.cos(t),
                            colour:lower_band.colour.history[index]
                        }
                    );
                });

            upper_band.tick+=upper_band.tickStep;
            middle_band.tick+=middle_band.tickStep;
            lower_band.tick+=lower_band.tickStep;
        },1000/40);

    //rendering controls
        _canvas_.core.render.active(true);
        // _canvas_.core.render.activeLimitToFrameRate(true);
        _canvas_.core.render.frameRateLimit(40);

        // _canvas_.core.stats.active(true);
        // let averages = [];
        // let rollingAverage = 0;
        // let rollingAverageIndex = 1;
        // setInterval(function(){
        //     let tmp = _canvas_.core.stats.getReport(); 
        //     tmp.then(data => {
        //         averages.push(data.framesPerSecond);
        //         console.log( 'rollingAverage:', averages.reduce( ( p, c ) => p + c, 0 ) / averages.length, data.framesPerSecond );
        //     });
        // },1000);

} );