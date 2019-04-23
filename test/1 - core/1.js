//upper band
    var x = 200 + _canvas_.core.render.getCanvasDimensions().width/2;
    var y = -175 + _canvas_.core.render.getCanvasDimensions().height/2;
    var rectangleGroup_1 = [];
    for(var a = 0; a < 16; a++){
        var tmp = _canvas_.core.shape.create('rectangle');
        tmp.name = 'upperBand_rectangle_'+a;

        tmp.x(x - a*30);
        tmp.y(y);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        _canvas_.core.arrangement.append(tmp);

        rectangleGroup_1.push(tmp);
    }
    var tick_1 = 0;
    var tickStep_1 = 0.02*rectangleGroup_1.length;
    var waveLength_1 = 3;
    setInterval(function(){
        for(var a = 0; a < rectangleGroup_1.length; a++){
            rectangleGroup_1[a].width(30 + 25*Math.sin( Math.PI*( (tick_1+a*waveLength_1)/rectangleGroup_1.length ) ) );
            rectangleGroup_1[a].height(30 + 25*Math.cos( Math.PI*( (tick_1+a*waveLength_1)/rectangleGroup_1.length ) ) );
        }
        tick_1+=tickStep_1;
    },1000/40);

//middle band
    var x = 200 + _canvas_.core.render.getCanvasDimensions().width/2 + 20/2;
    var y = -100 + _canvas_.core.render.getCanvasDimensions().height/2;
    var rectangleGroup_2 = [];
    for(var a = 0; a < 16; a++){
        var tmp = _canvas_.core.shape.create('rectangle')
        tmp.name = 'middleBand_rectangle_'+a;

        tmp.x(x - a*30);
        tmp.y(y);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        _canvas_.core.arrangement.append(tmp);

        rectangleGroup_2.push(tmp);
    }
    var tick_2 = 0;
    var tickStep_2 = 0.02*rectangleGroup_2.length;
    var waveLength_2 = 2;
    setInterval(function(){
        for(var a = 0; a < rectangleGroup_2.length; a++){
            rectangleGroup_2[a].y( -75 + 30 + 25*Math.sin( Math.PI*( (tick_2+a*waveLength_2)/rectangleGroup_2.length ) ) + _canvas_.core.render.getCanvasDimensions().height/2 );
            rectangleGroup_2[a].height( 30 + 25*Math.cos( Math.PI*( (tick_2+a*waveLength_2)/rectangleGroup_2.length ) ) );
        }
        tick_2+=tickStep_2;
    },1000/40);

//lower band
    var x = 200 + _canvas_.core.render.getCanvasDimensions().width/2;
    var y = 75 + _canvas_.core.render.getCanvasDimensions().height/2;
    var rectangleGroup_3 = [];
    for(var a = 0; a < 16; a++){
        var tmp = _canvas_.core.shape.create('rectangle')
        tmp.name = 'lowerBand_rectangle_'+a;

        tmp.x(x - a*30);
        tmp.y(y);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        _canvas_.core.arrangement.append(tmp);

        rectangleGroup_3.push(tmp);
    }
    var tick_3 = 0;
    var tickStep_3 = 0.02*rectangleGroup_3.length;
    var waveLength_3 = 1;
    setInterval(function(){
        for(var a = 0; a < rectangleGroup_3.length; a++){
            rectangleGroup_3[a].width( 30 + 25*Math.sin( Math.PI*( (tick_3+a*waveLength_3)/rectangleGroup_3.length ) ) );
            rectangleGroup_3[a].y( y + 30 + 25*Math.cos( Math.PI*( (tick_3+a*waveLength_3)/rectangleGroup_3.length ) ) );
        }
        tick_3+=tickStep_3;
    },1000/40);

//rendering controls
    _canvas_.core.render.active(true);
    // _canvas_.core.stats.active(true);
    // setInterval(function(){console.log(_canvas_.core.stats.getReport());},1000);