this.level = function(
    name='level',
    x, y, angle=0,
    width=20, height=60,
    backingStyle={r:0.04,g:0.04,b:0.04,a:1},
    levelStyles=[{r:0.98,g:0.98,b:0.98,a:1},{r:0.78,g:0.78,b:0.78,a:1}]
){
    var values = [];

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //backing
            var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, colour:backingStyle });
                object.append(rect);
        //levels
            var levels = interfacePart.builder('group','levels');
                object.append(levels);

            var level = [];
            for(var a = 0; a < levelStyles.length; a++){
                values.push(0);
                level.push( interfacePart.builder('rectangle','movingRect_'+a,{
                    y:height,
                    width:width, height:0,
                    colour:levelStyles[a],
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

                level[layer].height( height*value );
                level[layer].y( height - height*value );
            };

    return object;
};