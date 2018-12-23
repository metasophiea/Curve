this.level = function(
    name='level',
    x, y, angle=0,
    width=20, height=60,
    backingStyle='rgb(10,10,10)',
    levelStyles=['rgb(250,250,250)','rgb(200,200,200)']
){
    var values = [];

    //elements 
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        //backing
            var rect = canvas.part.builder('rectangle','backing',{ width:width, height:height, style:{fill:backingStyle} });
                object.append(rect);
        //levels
            var levels = canvas.part.builder('group','levels');
                object.append(levels);

            var level = [];
            for(var a = 0; a < levelStyles.length; a++){
                values.push(0);
                level.push( canvas.part.builder('rectangle','movingRect_'+a,{
                    y:height,
                    width:width, height:0,
                    style:{fill:levelStyles[a]},
                }) );
                levels.prepend(level[a]);
            }


        

        //methods
            object.layer = function(value,layer=0){
                if(layer == undefined){return values;}
                if(value==null){return values[layer];}

                value = (value>1 ? 1 : value);
                value = (value<0 ? 0 : value);

                values[layer] = value;

                level[layer].parameter.height( height*value );
                level[layer].parameter.y( height - height*value );
            };

    return object;
};