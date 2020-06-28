this.averageArray = function(array){
    dev.log.math('.averageArray(',array); //#development
    dev.count('.math.averageArray'); //#development

    // return array.reduce( ( p, c ) => p + c, 0 ) / array.length

    //this seems to be a little faster
    let sum = array[0];
    for(let a = 1; a < array.length; a++){ sum += array[a]; }
    return sum/array.length;
};
this.averagePoint = function(points){
    dev.log.math('.averagePoint(',points); //#development
    dev.count('.math.averagePoint'); //#development

    const sum = points.reduce((a,b) => {return {x:(a.x+b.x),y:(a.y+b.y)};} );
    return {x:sum.x/points.length,y:sum.y/points.length};
};
this.boundingBoxFromPoints = function(points){
    dev.log.math('.boundingBoxFromPoints(',points); //#development
    dev.count('.math.boundingBoxFromPoints'); //#development

    if(points.length == 0){
        return { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
    }

    if(points.length == 1){
        return { topLeft:{x:points[0].x,y:points[0].y}, bottomRight:{x:points[0].x,y:points[0].y} };
    }

    if(points.length == 2){
        if(points[0].x < points[1].x){
            if(points[0].y < points[1].y){
                return {
                    topLeft:{x:points[0].x,y:points[0].y},
                    bottomRight:{x:points[1].x,y:points[1].y},
                };
            }else{
                return {
                    topLeft:{x:points[0].x,y:points[1].y},
                    bottomRight:{x:points[1].x,y:points[0].y},
                };
            }
        }else{
            if(points[0].y < points[1].y){
                return {
                    topLeft:{x:points[1].x,y:points[0].y},
                    bottomRight:{x:points[0].x,y:points[1].y},
                };
            }else{
                return {
                    topLeft:{x:points[1].x,y:points[1].y},
                    bottomRight:{x:points[0].x,y:points[0].y},
                };
            }
        }
    }

    let left = points[0].x; let right = points[0].x;
    let top = points[0].y;  let bottom = points[0].y;

    for(let a = 1; a < points.length; a++){
        if( points[a].x < left ){ left = points[a].x; }
        else if(points[a].x > right){ right = points[a].x; }

        if( points[a].y < top ){ top = points[a].y; }
        else if(points[a].y > bottom){ bottom = points[a].y; }
    }

    return {
        topLeft:{x:left,y:top},
        bottomRight:{x:right,y:bottom}
    };
};
this.cartesianAngleAdjust = function(x,y,angle){
    dev.log.math('.cartesianAngleAdjust(',x,y,angle); //#development
    dev.count('.math.cartesianAngleAdjust'); //#development

    // //v1    
    //     if(angle == 0){ return {x:x,y:y}; }
    //     if(angle == Math.PI){ return {x:-x,y:-y}; }
    //     if(angle == Math.PI*0.5){ return {x:-y,y:x}; }
    //     if(angle == Math.PI*1.5){ return {x:y,y:-x}; }

    //     const polar = library.math.cartesian2polar( x, y );
    //     polar.ang += angle;
    //     return library.math.polar2cartesian( polar.ang, polar.dis );
    
    //v2    
        if(angle == 0){ return {x:x,y:y}; }
        return { x:x*Math.cos(angle) - y*Math.sin(angle), y:y*Math.cos(angle) + x*Math.sin(angle) };
};
this.convertColour = new function(){
    this.obj2rgba = function(obj){
        dev.log.math('.convertColour.obj2rgbacartesianAngleAdjust(',obj); //#development
        dev.count('.math.convertColour.obj2rgba'); //#development

        return 'rgba('+obj.r*255+','+obj.g*255+','+obj.b*255+','+obj.a+')';
    };
    this.rgba2obj = function(rgba){
        dev.log.math('.convertColour.rgba2obj(',rgba); //#development
        dev.count('.convertColour.rgba2obj'); //#development

        rgba = rgba.split(',');
        rgba[0] = rgba[0].replace('rgba(', '');
        rgba[3] = rgba[3].replace(')', '');
        rgba = rgba.map(function(a){return parseFloat(a);})
        return {r:rgba[0]/255,g:rgba[1]/255,b:rgba[2]/255,a:rgba[3]};
    };
};
this.curveGenerator = new function(){
    this.linear = function(stepCount=2, start=0, end=1){
        dev.log.math('.curveGenerator.linear(',stepCount,start,end); //#development
        dev.count('.math.curveGenerator.linear'); //#development

        stepCount = Math.abs(stepCount)-1;
        const outputArray = [0];
        for(let a = 1; a < stepCount; a++){ 
            outputArray.push(a/stepCount);
        }
        outputArray.push(1); 

        const mux = end-start;
        for(let a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;
    };
    this.sin = function(stepCount=2, start=0, end=1){
        dev.log.math('.curveGenerator.sin(',stepCount,start,end); //#development
        dev.count('.math.curveGenerator.sin'); //#development

        stepCount = Math.abs(stepCount) -1;
        let outputArray = [0];
        for(let a = 1; a < stepCount; a++){ 
            outputArray.push(
                Math.sin( Math.PI/2*(a/stepCount) )
            );
        }
        outputArray.push(1); 

        const mux = end-start;
        for(let a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;		
    };
    this.cos = function(stepCount=2, start=0, end=1){
        dev.log.math('.curveGenerator.cos(',stepCount,start,end); //#development
        dev.count('.math.curveGenerator.cos'); //#development

        stepCount = Math.abs(stepCount) -1;
        let outputArray = [0];
        for(let a = 1; a < stepCount; a++){ 
            outputArray.push(
                1 - Math.cos( Math.PI/2*(a/stepCount) )
            );
        }
        outputArray.push(1); 

        const mux = end-start;
        for(let a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;	
    };
    this.s = function(stepCount=2, start=0, end=1, sharpness=8){
        dev.log.math('.curveGenerator.s(',stepCount,start,end,sharpness); //#development
        dev.count('.math.curveGenerator.s'); //#development

        if(sharpness == 0){sharpness = 1/1000000;}

        let curve = [];
        for(let a = 0; a < stepCount; a++){
            curve.push(
                1/( 1 + Math.exp(-sharpness*((a/stepCount)-0.5)) )
            );
        }

        const outputArray = library.math.normalizeStretchArray(curve);

        const mux = end-start;
        for(let a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;
    };
    this.sigmoid = function(stepCount=2, start=0, end=1, sharpness=0.5){
        dev.log.math('.curveGenerator.sigmoid(',stepCount,start,end,sharpness); //#development
        dev.count('.math.curveGenerator.sigmoid'); //#development
        if(sharpness < 0){sharpness = 0;}
        if(sharpness > 1){sharpness = 1;}

        stepCount--;

        let curve = [];
        for(let a = 0; a <= stepCount; a++){
            const x = a/stepCount;
            curve.push(
                0.5 + ( ((2*x) - 1) / ( 1 - sharpness + sharpness*Math.abs((2*x) - 1) ) )/2
            );
        }

        const mux = end-start;
        for(let a = 0 ; a < curve.length; a++){
            curve[a] = curve[a]*mux + start;
        }

        return curve;
    };
    this.halfSigmoid_up = function(stepCount=2, start=0, end=1, sharpness=0.5){
        dev.log.math('.curveGenerator.halfSigmoid_up(',stepCount,start,end,sharpness); //#development
        dev.count('.math.curveGenerator.halfSigmoid_up'); //#development
        if(sharpness < 0){sharpness = 0;}
        if(sharpness > 1){sharpness = 1;}

        let curve = [];

        stepCount--;
        for(let a = 0; a <= stepCount; a++){
            const x = a/stepCount;
            curve.push( library.math.curvePoint.halfSigmoid_up(x,start,end,sharpness) );
        }

        return curve;
    };
    this.halfSigmoid_down = function(stepCount=2, start=0, end=1, sharpness=0.5){
        dev.log.math('.curveGenerator.halfSigmoid_down(',stepCount,start,end,sharpness); //#development
        dev.count('.math.curveGenerator.halfSigmoid_down'); //#development
        if(sharpness < 0){sharpness = 0;}
        if(sharpness > 1){sharpness = 1;}

        let curve = [];

        stepCount--;
        for(let a = 0; a <= stepCount; a++){
            const x = a/stepCount;
            curve.push( library.math.curvePoint.halfSigmoid_down(x,start,end,sharpness) );
        }

        return curve;
    };
    this.exponential = function(stepCount=2, start=0, end=1, sharpness=2){
        dev.log.math('.curveGenerator.exponential(',stepCount,start,end,sharpness); //#development
        dev.count('.math.curveGenerator.exponential'); //#development

        stepCount = stepCount-1;
        let outputArray = [];
        
        for(let a = 0; a <= stepCount; a++){
            outputArray.push( (Math.exp(sharpness*(a/stepCount))-1)/(Math.E-1) ); // Math.E == Math.exp(1)
        }

        outputArray = library.math.normalizeStretchArray(outputArray);

        const mux = end-start;
        for(let a = 0 ; a < outputArray.length; a++){
            outputArray[a] = outputArray[a]*mux + start;
        }

        return outputArray;
    };
};
this.curvePoint = new function(){
    this.linear = function(x=0.5, start=0, end=1){
        dev.log.math('.curvePoint.linear(',x,start,end); //#development
        dev.count('.math.curvePoint.linear'); //#development

        return x *(end-start)+start;
    };
    this.sin = function(x=0.5, start=0, end=1){
        dev.log.math('.curvePoint.sin(',x,start,end); //#development
        dev.count('.math.curvePoint.sin'); //#development

        return Math.sin(Math.PI/2*x) *(end-start)+start;
    };
    this.cos = function(x=0.5, start=0, end=1){
        dev.log.math('.curvePoint.cos(',x,start,end); //#development
        dev.count('.math.curvePoint.cos'); //#development

        return (1-Math.cos(Math.PI/2*x)) *(end-start)+start;
    };
    this.s = function(x=0.5, start=0, end=1, sharpness=8){
        dev.log.math('.curvePoint.s(',x,start,end,sharpness); //#development
        dev.count('.math.curvePoint.s'); //#development

        const temp = library.math.normalizeStretchArray([
            1/( 1 + Math.exp(-sharpness*(0-0.5)) ),
            1/( 1 + Math.exp(-sharpness*(x-0.5)) ),
            1/( 1 + Math.exp(-sharpness*(1-0.5)) ),
        ]);
        return temp[1] *(end-start)+start;
    };
    this.sigmoid = function(x=0.5, start=0, end=1, sharpness=0.5){
        dev.log.math('.curvePoint.sigmoid(',x,start,end,sharpness); //#development
        dev.count('.math.curvePoint.sigmoid'); //#development

        return ( 0.5 + ( ((2*x) - 1) / ( 1 - sharpness + sharpness*Math.abs((2*x) - 1) ) )/2 ) *(end-start)+start;
    };
    this.halfSigmoid_up = function(x=0.5, start=0, end=1, sharpness=0.5){
        dev.log.math('.curvePoint.halfSigmoid_up(',x,start,end,sharpness); //#development
        dev.count('.math.curvePoint.halfSigmoid_up'); //#development

        return (x / ( 1 - sharpness + sharpness*Math.abs(x))) *(end-start)+start;
    };
    this.halfSigmoid_down = function(x=0.5, start=0, end=1, sharpness=0.5){
        dev.log.math('.curvePoint.halfSigmoid_down(',x,start,end,sharpness); //#development
        dev.count('.math.curvePoint.halfSigmoid_down'); //#development

        return library.math.curvePoint.halfSigmoid_up(1-x,end,start,sharpness);
    };
    this.exponential = function(x=0.5, start=0, end=1, sharpness=2){
        dev.log.math('.curvePoint.exponential(',x,start,end,sharpness); //#development
        dev.count('.math.curvePoint.exponential'); //#development

        const temp = library.math.normalizeStretchArray([
            (Math.exp(sharpness*0)-1)/(Math.E-1),
            (Math.exp(sharpness*x)-1)/(Math.E-1),
            (Math.exp(sharpness*1)-1)/(Math.E-1),
        ]);
        return temp[1] *(end-start)+start;
    };
};
this.getAngleOfTwoPoints = function(point_1,point_2){
    dev.log.math('.getAngleOfTwoPoints(',point_1,point_2); //#development
    dev.count('.math.getAngleOfTwoPoints'); //#development

    if(point_1.x == point_2.x && point_1.y == point_2.y){return 0;}

    const xDelta = point_2.x - point_1.x;
    const yDelta = point_2.y - point_1.y;
    let angle = Math.atan( yDelta/xDelta );

    if(xDelta < 0){ angle = Math.PI + angle; }
    else if(yDelta < 0){ angle = Math.PI*2 + angle; }

    return angle;
};
this.getIndexOfSequence = function(array,sequence){ 
    dev.log.math('.getIndexOfSequence(',array,sequence); //#development
    dev.count('.math.getIndexOfSequence'); //#development

    function comp(thing_A,thing_B){
        const keys = Object.keys(thing_A);
        if(keys.length == 0){ return thing_A == thing_B; }

        for(let a = 0; a < keys.length; a++){
            if( !thing_B.hasOwnProperty(keys[a]) ){ return false; }
            if( thing_A[keys[a]] != thing_B[keys[a]] ){ return false; }
        }
        return true;
    }

    if(array.length == 0 || sequence.length == 0){return undefined;}

    let index = 0;
    for(index = 0; index < array.length - sequence.length + 1; index++){
        if( comp(array[index], sequence[0]) ){
            let match = true;
            for(let a = 1; a < sequence.length; a++){
                if( !comp(array[index+a],sequence[a]) ){
                    match = false;
                    break;
                }
            }
            if(match){return index;}
        }
    }

    return undefined;
};
this.largestValueFound = function(array){
    dev.log.math('.largestValueFound(',array); //#development
    dev.count('.math.largestValueFound'); //#development

    if(array.length == 0){return undefined;}
    return array.reduce(function(max,current){
        return Math.abs(max) > Math.abs(current) ? max : current;
    });
};
this.normalizeStretchArray = function(array){
    dev.log.math('.normalizeStretchArray(',array); //#development
    dev.count('.math.normalizeStretchArray'); //#development

    //discover the largest number
        const biggestIndex = array.reduce( function(oldIndex, currentValue, index, array){ return currentValue > array[oldIndex] ? index : oldIndex; }, 0);

    //divide everything by this largest number, making everything a ratio of this value 
        const dux = Math.abs(array[biggestIndex]);
        array = array.map(x => x / dux);

    //stretch the other side of the array to meet 0 or 1
        if(array[0] == 0 && array[array.length-1] == 1){return array;}
        const pertinentValue = array[0] != 0 ? array[0] : array[array.length-1];
        array = array.map(x => (x-pertinentValue)/(1-pertinentValue) );

    return array;
};
this.relativeDistance = function(realLength, start,end, d, allowOverflow=false){
    dev.log.math('.relativeDistance(',realLength,start,end,d,allowOverflow); //#development
    dev.count('.math.relativeDistance'); //#development

    const mux = (d - start)/(end - start);
    if(!allowOverflow){ if(mux > 1){return realLength;}else if(mux < 0){return 0;} }
    return mux*realLength;
};
this.seconds2time = function(seconds){
    dev.log.math('.seconds2time(',seconds); //#development
    dev.count('.math.seconds2time'); //#development

    const result = {h:0, m:0, s:0, ms:0, µs:0, ns:0, ps:0, fs:0};
    
    result.h = Math.floor(seconds/3600);
    seconds = seconds - result.h*3600;
    if(seconds <= 0){return result;}

    result.m = Math.floor(seconds/60);
    seconds = seconds - result.m*60;
    if(seconds <= 0){return result;}

    result.s = Math.floor(seconds);
    seconds = seconds - result.s;
    if(seconds <= 0){return result;}

    result.ms = Math.floor(seconds*1000);
    seconds = seconds*1000 - result.ms;
    if(seconds <= 0){return result;}

    result.µs = Math.floor(seconds*1000);
    seconds = seconds*1000 - result.µs;
    if(seconds <= 0){return result;}

    result.ns = Math.floor(seconds*1000);
    seconds = seconds*1000 - result.ns;
    if(seconds <= 0){return result;}

    result.ps = Math.floor(seconds*1000);
    seconds = seconds*1000 - result.ps;
    if(seconds <= 0){return result;}

    result.fs = seconds*1000;
    
    return result;
};

this.distanceBetweenTwoPoints = function(point_a,point_b){
    dev.log.math('.distanceBetweenTwoPoints(',point_a,point_b); //#development
    dev.count('.math.distanceBetweenTwoPoints'); //#development
    return Math.hypot(point_b.x-point_a.x, point_b.y-point_a.y);
};
this.cartesian2polar = function(x,y){
    dev.log.math('.cartesian2polar(',x,y); //#development
    dev.count('.math.cartesian2polar'); //#development

    const dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5);
    let ang = 0;

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
this.polar2cartesian = function(angle,distance){
    dev.log.math('.polar2cartesian(',angle,distance); //#development
    dev.count('.math.polar2cartesian'); //#development

    return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
};

this.blendColours = function(rgba_1,rgba_2,ratio){
    dev.log.math('.blendColours(',rgba_1,rgba_2,ratio); //#development
    dev.count('.math.blendColours'); //#development

    return {
        r: (1-ratio)*rgba_1.r + ratio*rgba_2.r,
        g: (1-ratio)*rgba_1.g + ratio*rgba_2.g,
        b: (1-ratio)*rgba_1.b + ratio*rgba_2.b,
        a: (1-ratio)*rgba_1.a + ratio*rgba_2.a,
    };           
};
this.multiBlendColours = function(rgbaList,ratio){
    dev.log.math('.multiBlendColours(',rgbaList,ratio); //#development
    dev.count('.math.multiBlendColours'); //#development

    //special cases
        if(ratio == 0){return rgbaList[0];}
        if(ratio == 1){return rgbaList[rgbaList.length-1];}
    //calculate the start colour and ratio(represented by as "colourIndex.ratio"), then blend
        const p = ratio*(rgbaList.length-1);
        return library.math.blendColours(rgbaList[~~p],rgbaList[~~p+1], p%1);
};



this.polygonToSubTriangles = function(regions,inputFormat='XYArray'){
    dev.log.math('.polygonToSubTriangles(',regions,inputFormat); //#development
    dev.count('.math.polygonToSubTriangles'); //#development

    if(inputFormat == 'flatArray'){
        const tmp = [];
        for(let a = 0; a < regions.length; a+=2){ tmp.push( {x:regions[a+0], y:regions[a+1]} ); }
        regions = [tmp];
    }

    const holes = regions.reverse().map(region => region.length);
    holes.forEach((item,index) => { if(index > 0){ holes[index] = item + holes[index-1]; } });
    holes.pop();

    return _thirdparty.earcut2(regions.flat().map(item => [item.x,item.y]).flat(),holes);
};
this.unionPolygons = function(polygon1,polygon2){
    dev.log.math('.unionPolygons(',polygon1,polygon2); //#development
    dev.count('.math.unionPolygons'); //#development

    //PolyBool
    return _thirdparty.PolyBool.union(
        {regions:polygon1.map(region => region.map(item => [item.x,item.y]))}, 
        {regions:polygon2.map(region => region.map(item => [item.x,item.y]))}
    ).regions.map(region => region.map(item => ({x:item[0],y:item[1]})));
}






this.aVeryDifficultCalculation = function(a, b, c, d, e, f){

    a = Math.sqrt( Math.atan(b) * Math.tan(c) / Math.cos(d) * Math.sqrt(e) / Math.sin(f) );
    b = Math.sqrt( Math.atan(c) * Math.tan(d) / Math.cos(e) * Math.sqrt(f) / Math.sin(a) );
    c = Math.sqrt( Math.atan(d) * Math.tan(e) / Math.cos(f) * Math.sqrt(a) / Math.sin(b) );
    d = Math.sqrt( Math.atan(e) * Math.tan(f) / Math.cos(a) * Math.sqrt(b) / Math.sin(c) );
    e = Math.sqrt( Math.atan(f) * Math.tan(a) / Math.cos(b) * Math.sqrt(c) / Math.sin(d) );
    f = Math.sqrt( Math.atan(a) * Math.tan(b) / Math.cos(c) * Math.sqrt(d) / Math.sin(e) );

    return { a:a, b:b, c:c, d:d, e:e, f:f };
};
this.anotherVeryDifficultCalculation = function(a, b, c, d, e, f){

    a = Math.sqrt( Math.atan(b) * Math.tan(c) / Math.cos(d) * Math.sqrt(e) / Math.sin(f) );
    b = Math.sqrt( Math.atan(c) * Math.tan(d) / Math.cos(e) * Math.sqrt(f) / Math.sin(a) );
    c = Math.sqrt( Math.atan(d) * Math.tan(e) / Math.cos(f) * Math.sqrt(a) / Math.sin(b) );
    d = Math.sqrt( Math.atan(e) * Math.tan(f) / Math.cos(a) * Math.sqrt(b) / Math.sin(c) );
    e = Math.sqrt( Math.atan(f) * Math.tan(a) / Math.cos(b) * Math.sqrt(c) / Math.sin(d) );
    f = Math.sqrt( Math.atan(a) * Math.tan(b) / Math.cos(c) * Math.sqrt(d) / Math.sin(e) );

    return f;
};