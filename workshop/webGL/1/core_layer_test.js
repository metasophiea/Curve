core.test = function(){
    var testNumber = 0;

    if(testNumber == 0){
        var tmp = core.shape.create('rectangle');
        tmp.x = 100; tmp.y = 100;
        tmp.width = 30;
        tmp.height = 30;
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('rectangle');
        tmp.x = 150; tmp.y = 100;
        tmp.width = 30;
        tmp.height = 30;
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('polygon');
        tmp.points = [
            150,    150,
            150+30, 150,
            150+30, 150+30,
            150,    150+30,
        ];
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('rectangle');
        tmp.x = 100; tmp.y = 150;
        tmp.width = 30;
        tmp.height = 30;
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        this.render.active(true);
    }else if(testNumber == 1){
        var x = 200 + core.render.getCanvasDimensions().width/2;
        var y = -175 + core.render.getCanvasDimensions().height/2;
        var rectangleGroup_1 = [];
        for(var a = 0; a < 16; a++){
            var tmp = core.shape.create('rectangle');

            tmp.x = x - a*30;
            tmp.y = y;
            tmp.width = 30;
            tmp.height = 30;
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            this.arrangement.append(tmp);

            rectangleGroup_1.push(tmp);
        }
        var tick_1 = 0;
        var tickStep_1 = 0.02*rectangleGroup_1.length;
        var waveLength_1 = 3;
        setInterval(function(){
            for(var a = 0; a < rectangleGroup_1.length; a++){
                rectangleGroup_1[a].width = 30 + 25*Math.sin( Math.PI*( (tick_1+a*waveLength_1)/rectangleGroup_1.length ) );
                rectangleGroup_1[a].height = 30 + 25*Math.cos( Math.PI*( (tick_1+a*waveLength_1)/rectangleGroup_1.length ) );
            }
            tick_1+=tickStep_1;
        },1000/40);

        var x = 200 + core.render.getCanvasDimensions().width/2;
        var y = -100 + core.render.getCanvasDimensions().height/2;
        var rectangleGroup_2 = [];
        for(var a = 0; a < 16; a++){
            var tmp = core.shape.create('rectangle')

            tmp.x = x - a*30;
            tmp.y = y;
            tmp.width = 30;
            tmp.height = 30;
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            this.arrangement.append(tmp);

            rectangleGroup_2.push(tmp);
        }
        var tick_2 = 0;
        var tickStep_2 = 0.02*rectangleGroup_2.length;
        var waveLength_2 = 2;
        setInterval(function(){
            for(var a = 0; a < rectangleGroup_2.length; a++){
                rectangleGroup_2[a].y = -75 + 30 + 25*Math.sin( Math.PI*( (tick_2+a*waveLength_2)/rectangleGroup_2.length ) ) + core.render.getCanvasDimensions().height/2;
                rectangleGroup_2[a].height = 30 + 25*Math.cos( Math.PI*( (tick_2+a*waveLength_2)/rectangleGroup_2.length ) ) 
            }
            tick_2+=tickStep_2;
        },1000/40);

        var x = 200 + core.render.getCanvasDimensions().width/2;
        var y = 75 + core.render.getCanvasDimensions().height/2;
        var rectangleGroup_3 = [];
        for(var a = 0; a < 16; a++){
            var tmp = core.shape.create('rectangle')

            tmp.x = x - a*30;
            tmp.y = y;
            tmp.width = 30;
            tmp.height = 30;
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            this.arrangement.append(tmp);

            rectangleGroup_3.push(tmp);
        }
        var tick_3 = 0;
        var tickStep_3 = 0.02*rectangleGroup_3.length;
        var waveLength_3 = 1;
        setInterval(function(){
            for(var a = 0; a < rectangleGroup_3.length; a++){
                rectangleGroup_3[a].width = 30 + 25*Math.sin( Math.PI*( (tick_3+a*waveLength_3)/rectangleGroup_3.length ) );
                rectangleGroup_3[a].y = y + 30 + 25*Math.cos( Math.PI*( (tick_3+a*waveLength_3)/rectangleGroup_3.length ) );
            }
            tick_3+=tickStep_3;
        },1000/40);

        this.render.active(true);
        this.arrangement.get().scale = 1;
        // this.stats.active(true);
        // setInterval(function(){console.log(core.stats.getReport());},1000);
    }else if(testNumber == 2){
        //Desktop Mac: 6000/~50fps

        for(var a = 0; a < 10000; a++){
            var tmp = core.shape.create('rectangle');
            tmp.x += a/10 - 300;
            tmp.y = core.render.getCanvasDimensions().height/2;
            tmp.width = 30;
            tmp.height = 30;
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            this.arrangement.append(tmp);
        }

        this.render.active(true);
        this.stats.active(true);
        setInterval(function(){console.log(core.stats.getReport());},1000);
    }else if(testNumber == 3){
        var group_1 = core.shape.create('group');
        group_1.x = core.render.getCanvasDimensions().width/2;
        group_1.y = core.render.getCanvasDimensions().height/2;
        this.arrangement.append(group_1);

        var tmp = core.shape.create('polygon');
        var pointCount = 5;
        for(var a = 0; a < pointCount; a++){
            var x = Math.sin( 2*Math.PI * (a/pointCount) );
            var y = Math.cos( 2*Math.PI * (a/pointCount) );
            tmp.points.push(x*100,y*100);
        }
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        group_1.append(tmp);

        this.render.active(true);
        this.arrangement.get().scale = 1;

        setInterval(function(){ group_1.angle += 0.025; },1000/40);
    }else if(testNumber == 4){

        var group_1 = core.shape.create('group');
            group_1.x = 100;
            group_1.y = 100;
            this.arrangement.append(group_1);
        var rectangle_1 = core.shape.create('rectangle');
            rectangle_1.width = 30;
            rectangle_1.height = 30;
            rectangle_1.colour = {r:1,g:0,b:0,a:1};
            group_1.append(rectangle_1);
        var group_2 = core.shape.create('group');
            group_2.x = 50;
            group_1.append(group_2);
            var rectangle_2 = core.shape.create('rectangle');
                rectangle_2.width = 30;
                rectangle_2.height = 30;
                rectangle_2.colour = {r:0,g:1,b:0,a:1};
                group_2.append(rectangle_2);
            var rectangle_3 = core.shape.create('rectangle');
                rectangle_3.x = 50;
                rectangle_3.width = 30;
                rectangle_3.height = 30;
                rectangle_3.colour = {r:0,g:0,b:1,a:1};
                group_2.append(rectangle_3);

        var tick = 0;
        setInterval(function(){
            group_2.angle += 0.01;
            group_1.scale = 1 + 0.5*Math.sin( 2*Math.PI*tick );
            group_2.scale = 1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/4 );
            rectangle_3.scale = 1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/2 );
            tick += 0.01;
        },1000/40);

        this.render.active(true);
    }
    
};