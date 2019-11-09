let rectangleCount = 16;

//element generation
    let upper_band = {
        elementIds:[],
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
        elementIds:[],
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
        elementIds:[],
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
        core.element.create('rectangle',namePrefix+a).then( rectangleId => {
            core.element.executeMethod(rectangleId,'unifiedAttribute',[{ x:(x - a*30), y:y, width:30, height:30 }]);
            core.arrangement.append(rectangleId);
            grouping.push(rectangleId);
        } );
    };
    core.render.getCanvasDimensions().then(canvasDimensions => {
        for(let a = 0; a < rectangleCount; a++){
            produceRectangle( a, (200 + canvasDimensions.width/2), (-175 + canvasDimensions.height/2), 'upperBand_rectangle_', upper_band.elementIds );
            produceRectangle( a, (200 + 20/2 + canvasDimensions.width/2), (-100 + canvasDimensions.height/2), 'middleBand_rectangle_', middle_band.elementIds );
            produceRectangle( a, (200 + canvasDimensions.width/2), (75 + canvasDimensions.height/2), 'lowerBand_rectangle_', lower_band.elementIds );
        }  
    });

//animation
    let canvasDimensions = {width:0,height:0};
    core.render.getCanvasDimensions().then(newCanvasDimensions => { canvasDimensions = newCanvasDimensions; });
    function blendColours(A,B,p){ return { r: (1-p)*A.r + p*B.r, g: (1-p)*A.g + p*B.g, b: (1-p)*A.b + p*B.b, a: (1-p)*A.a + p*B.a }; }
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
            upper_band.elementIds.forEach((elementID,index) => {
                let t = Math.PI*( (upper_band.tick+index*upper_band.wavelength)/upper_band.elementIds.length );
                core.element.boatload_executeMethod.load({
                    id:elementID,
                    method:'unifiedAttribute',
                    argumentList:[{ 
                        width:30 + 25*Math.sin(t), 
                        height:30 + 25*Math.cos(t), 
                        colour:upper_band.colour.history[index]
                    }],
                });
            });

        //middle band
            middle_band.elementIds.forEach((elementID,index) => {
                let t = Math.PI*( (middle_band.tick+index*middle_band.wavelength)/middle_band.elementIds.length );
                core.element.boatload_executeMethod.load({
                    id:elementID,
                    method:'unifiedAttribute',
                    argumentList:[{ 
                        y:-75 + 30 + 25*Math.sin(t) + canvasDimensions.height/2,
                        height:30 + 25*Math.cos(t),
                        colour:middle_band.colour.history[index]
                    }],
                });
            });

        //lower band
            lower_band.elementIds.forEach((elementID,index) => {
                let t = Math.PI*( (lower_band.tick+index*lower_band.wavelength)/lower_band.elementIds.length );
                core.element.boatload_executeMethod.load({
                    id:elementID,
                    method:'unifiedAttribute',
                    argumentList:[{ 
                        width:30 + 25*Math.sin(t),
                        y:75 + canvasDimensions.height/2 + 30 + 25*Math.cos(t),
                        colour:lower_band.colour.history[index]
                    }],
                });
            });

        upper_band.tick+=upper_band.tickStep;
        middle_band.tick+=middle_band.tickStep;
        lower_band.tick+=lower_band.tickStep;
        core.element.boatload_executeMethod.ship();
    },1000/40);
























//rendering controls
    core.render.active(true);
    // core.render.activeLimitToFrameRate(true);
    core.render.frameRateLimit(40);

    // core.stats.active(true);
    // let averages = [];
    // let rollingAverage = 0;
    // let rollingAverageIndex = 1;
    // setInterval(function(){
    //     let tmp = core.stats.getReport(); 
    //     tmp.then(data => {
    //         averages.push(data.framesPerSecond);
    //         console.log( 'rollingAverage:', averages.reduce( ( p, c ) => p + c, 0 ) / averages.length, data.framesPerSecond );
    //     });
    // },1000);