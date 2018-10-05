var infSeq = function(
    id='infSeq',
    x, y, width, height, angle,
    xCount=64, yCount=10,

    verticalStripStyle_pattern=[0],
    verticalStripStyle_styles=[
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(30,30,30,0.5);',
    ],
){
    var widthCount = 128;

    //elements 
        //main
            var obj = part.builder('g',id,{x:x, y:y, r:angle});
        //background
            var backing = part.builder('rect','backing',{width:width, height:height, style:''});
            obj.append(backing);
        //x axis rageslide
            var x_slide = part.builder('slide','x_slide',{y:height+height/20, width:height/20, height:width, handleHeight:0.05, angle:-Math.PI/2});
            obj.append(x_slide);
        //viewport
            var port = part.builder('g','backingDrawArea',{});
            port.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
            obj.appendChild(port);

        //vertical strips
            var backingDrawArea = part.builder('g','backingDrawArea',{});
            port.appendChild(backingDrawArea);
            for(var a = 0; a < widthCount; a++){
                backingDrawArea.appendChild(
                    part.builder('rect','strip_vertical_'+a,{
                        x:a*(width/xCount), y:0,
                        width:width/xCount, height:height,
                        style:verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]],
                    })
                );
            }

        x_slide.onchange = function(value){
            system.utility.element.setTransform_XYonly(backingDrawArea,-value*width,0);
        };


    return obj;
};