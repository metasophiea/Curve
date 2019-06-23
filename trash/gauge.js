this.gauge = function(
    name='gauge',
    x, y, angle=0,
    width=40, height=30,
    backingStyle={r:0.95,g:0.95,b:0.95,a:1},
    needleStyles=[
        {r:0.08,g:0.08,b:0.08,a:1},
        {r:0.18,g:0.18,b:0.18,a:1},

        {r:0.08,g:0.08,b:0.08,a:1},
        {r:0.08,g:0.08,b:0.08,a:1},
        {r:0.08,g:0.08,b:0.08,a:1},
        {r:0.08,g:0.08,b:0.08,a:1},
        {r:0.08,g:0.08,b:0.08,a:1},
        {r:0.08,g:0.08,b:0.08,a:1},
        {r:0.08,g:0.08,b:0.08,a:1},
        {r:0.08,g:0.08,b:0.08,a:1},
    ],
){
    var values = [];

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
                object.stopAttributeStartedExtremityUpdate = true;
                object.clipActive(true);

                var tmp = interfacePart.builder('rectangle','stencil',{ width:width, height:height });
                object.stencil(tmp);

        //backing
            var rect = interfacePart.builder('rectangle','backing',{ width:width, height:height, colour:backingStyle });
                object.append(rect);
        // //markings
        //     var points = [];
        //     var detail = 30;
        //     for(var a = 0; a < detail; a++){
        //         var progress = a/(detail-1);
        //         points.push(
        //             {
        //                 x:progress*width,
        //                 y:height - height*Math.sin( Math.PI*progress )*0.1 - height*0.5,
        //             }
        //         );
        //     }
        //     var mainLine = interfacePart.builder('path','mainLine',{ thickness:0.5, pointsAsXYArray:points });
        //         object.append(mainLine);

            
        //needles
            var needles = [];
            var needleGroup = interfacePart.builder('group','needles');
                object.append(needleGroup);

            for(var a = 0; a < needleStyles.length; a++){
                values.push(0);

                var tmp = _canvas_.library.math.polar2cartesian(Math.PI*0.05*(5+a),height);
                var points = [
                    {x:width/2, y:height*1.2},
                    {x:width/2 - tmp.x, y:height*1.2 - tmp.y},
                ];
                var needle =  interfacePart.builder('path','needle_'+a,{ thickness:0.5, pointsAsXYArray:points, colour:needleStyles[a] });
                needle.stopAttributeStartedExtremityUpdate = true;

                needles.push(needle);
                needleGroup.prepend(needles[a]);
            }

        //methods
            object.needle = function(value,needle=0){
            };

    return object;
};