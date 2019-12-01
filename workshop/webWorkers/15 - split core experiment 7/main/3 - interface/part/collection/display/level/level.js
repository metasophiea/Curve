this.level = function(
    name='level',
    x, y, angle=0,
    width=20, height=60,
    backingStyle={r:0.04,g:0.04,b:0.04,a:1},
    levelStyles=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.78,g:0.78,b:0.78,a:1}]
){
    dev.log.partDisplay('.level('+name+','+x+','+y+','+angle+','+width+','+height+','+JSON.stringify(backingStyle)+','+JSON.stringify(levelStyles)+')'); //#development
    
    const values = [];

    //elements
        const object = _canvas_.interface.part.builder('basic', 'group', name, {x:x, y:y, angle:angle});
        const rectangle = _canvas_.interface.part.builder('basic', 'rectangle', 'backing', {width:width, height:height, colour:backingStyle});
            object.append(rectangle);
        
        const levels =  levelStyles.map( (levelStyle,index) => {
            return _canvas_.interface.part.builder('basic', 'rectangle', 'movingRect_'+index, {y:height, width:width, height:0, colour:levelStyle});
        } );
        levels.forEach(element => object.append(element));

    //methods
        object.layer = function(value,layer){
            dev.log.partDisplay('.level.layer('+value+','+layer+')'); //#development
            if(layer == undefined){return values;}
            if(value == null){return values[layer];}

            value = (value>1 ? 1 : value);
            value = (value<0 ? 0 : value);

            values[layer] = value;

            levels[layer].height( height*value );
            levels[layer].y( height - height*value );
        };

    return(object);
};

interfacePart.partLibrary.display.level = function(name,data){ 
    return interfacePart.collection.display.level(
        name, data.x, data.y, data.angle, data.width, data.height, 
        data.style.backing, data.style.levels
    ); 
};