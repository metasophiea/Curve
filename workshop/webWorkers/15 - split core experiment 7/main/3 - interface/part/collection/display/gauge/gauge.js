this.gauge = function(
    name='gauge',
    x, y, angle=0,
    width=50, height=30,
    needleAngleBounds=[{start:-Math.PI/6,end:Math.PI/6}],
    needleArticulationPoints=[{x:1/2, y:1.2}],
    backingStyle={r:0.04,g:0.04,b:0.04,a:1},
    needleColours=[{r:0.98,g:0.98,b:0.98,a:1}],
){
    dev.log.partDisplay('.gauge('  //#development
        +name+','+x+','+y+','+angle+','+width+','+height+','  //#development
        +JSON.stringify(needleAngleBounds)+','+JSON.stringify(needleArticulationPoints)  //#development
        +JSON.stringify(backingStyle)+','+JSON.stringify(needleColours)  //#development
    +')'); //#development
    
    const values = [];
    const defaultBoundingAngles = {
        start:-Math.PI/6,
        end:Math.PI/6,
    };
    const defaultNeedleArticulationPoint = {
        x:1/2, y:1.2
    };

    //elements
        const object = interfacePart.builder('basic', 'group', name, {x:x, y:y, angle:angle});
        const backing = interfacePart.builder('basic', 'rectangle', 'backing', {width:width, height:height, colour:backingStyle});
        const needleWindow = interfacePart.builder('basic', 'group', 'needleWindow', {});
        object.append(backing);
        object.append(needleWindow);

        const needles = needleColours.map((needleColour,index) => {
            values.push(0);

            const NAP = needleArticulationPoints[index] == undefined ? defaultNeedleArticulationPoint : needleArticulationPoints[index];
            const needleSize = { width: width/100, height: height*NAP.y };

            return interfacePart.builder('basic','rectangle','needleBody_'+index,{
                x:width*NAP.x - needleSize.width/2, 
                y:height*1.1 + (needleSize.height-height), 
                width:needleSize.width, height:-needleSize.height, 
                colour:needleColour
            });
        });
        needles.forEach(element => needleWindow.prepend(element));
        
        const stencil = interfacePart.builder('basic','rectangle','stencil',{width:width, height:height});
        needleWindow.stencil(stencil);
        needleWindow.clipActive(true);

    //methods
        object.needle = function(value,layer=0){
            if(value==undefined){return values[layer];}
            dev.log.partDisplay('.gauge.needle('+value+','+layer+')');  //#development

            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);

            values[layer] = value;

            const boundingAngles = needleAngleBounds[layer] == undefined ? defaultBoundingAngles : needleAngleBounds[layer];
            needles[layer].angle( boundingAngles.start + (boundingAngles.end-boundingAngles.start)*value );
        }

    //setup
        for(var a = 0; a < needleColours.length; a++){
            object.needle(0,a);
        }

    return(object);
};

interfacePart.partLibrary.display.gauge = function(name,data){ 
    return interfacePart.collection.display.gauge(
        name, data.x, data.y, data.angle, data.width, data.height, 
        data.needleAngleBounds, data.needleArticulationPoint,
        data.style.backing, data.style.needles
    ); 
};