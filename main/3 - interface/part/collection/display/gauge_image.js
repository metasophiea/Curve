this.gauge_image = function(
    name='gauge_image',
    x, y, angle=0,
    width=50, height=30,
    needleAngleBounds=[{start:-Math.PI/6,end:Math.PI/6}],
    needleArticulationPoints=[{x:1/2, y:1.2}],
    backingURL='',
    needleColours=[{r:0.98,g:0.98,b:0.98,a:1}],
    frontingURL,
){
    var values = [];
    var defaultBoundingAngles = {
        start:-Math.PI/6,
        end:Math.PI/6,
    };
    var defaultNeedleArticulationPoint = {
        x:1/2, y:1.2
    };

    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //backing
            var backing = interfacePart.builder('basic','image','backing',{ width:width, height:height, url:backingURL });
            object.append(backing);
        //needle
            var needles = interfacePart.builder('basic','group','needles');
            object.append(needles);
            var needle = [];
            for(var a = 0; a < needleColours.length; a++){
                values.push(0);

                var NAP = needleArticulationPoints[a] == undefined ? defaultNeedleArticulationPoint : needleArticulationPoints[a];
                var needleSize = { width: width/100, height: height*NAP.y };

                var needleBody = interfacePart.builder('basic','rectangle','needleBody_'+a,{
                    x:width*NAP.x - needleSize.width/2, 
                    y:height*1.1 + (needleSize.height-height), 
                    width:needleSize.width, height:-needleSize.height, 
                    colour:needleColours[a]
                });
                
                needle.push(needleBody);
                needles.prepend(needle[a]);
            }
        //stencil
            var stencil = interfacePart.builder('basic','rectangle','stencil',{width:width, height:height});
            needles.stencil(stencil);
            needles.clipActive(true);
        //fronting
            if(frontingURL != this.undefined){
                var fronting = interfacePart.builder('basic','image','fronting',{ width:width, height:height, url:frontingURL });
                object.append(fronting);
            }
        
    //methods
        object.needle = function(value,layer=0){
            if(value==undefined || isNaN(value)){return values[layer];}

            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);

            values[layer] = value;

            var boundingAngles = needleAngleBounds[layer] == undefined ? defaultBoundingAngles : needleAngleBounds[layer];
            needle[layer].angle( boundingAngles.start + (boundingAngles.end-boundingAngles.start)*value );
        }

    //setup
        for(var a = 0; a < needleColours.length; a++){ object.needle(0,a); }

    return object;
};

interfacePart.partLibrary.display.gauge_image = function(name,data){ 
    return interfacePart.collection.display.gauge_image(
        name, data.x, data.y, data.angle, data.width, data.height,
        data.needleAngleBounds, data.needleArticulationPoint,
        data.backingURL, data.style.needles, data.frontingURL
    ); 
};