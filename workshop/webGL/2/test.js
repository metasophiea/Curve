core.test = function(){
    var testNumber = 1;

    if(testNumber == 0){
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:10,y:0}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:10,y:5}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:10,y:10}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:10,y:15}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:0,y:10}) );

        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:-10,y:10}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:-10,y:1}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:-10,y:0}) );

        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:-10,y:-1}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:-10,y:-10}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:-1,y:-10}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:0,y:-10}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:10,y:-10}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:10,y:-1}) );
        console.log( workspace.library.math.getAngleOfTwoPoints({x:0,y:0},{x:10,y:-0.000001}) );
    }else if(testNumber == 1){

        var tmp = core.shape.create('image');
        tmp.name = 'image_1';
        tmp.x(160); tmp.y(0);
        tmp.width(250);
        tmp.height(250);
        tmp.imageURL('http://0.0.0.0:8000/mikeandbrian.jpg');
        this.arrangement.append(tmp);
        var tmp = core.shape.create('image');
        tmp.name = 'image_2';
        tmp.x(-50); tmp.y(100);
        tmp.width(160);
        tmp.height(215);
        tmp.angle(-0.5);
        tmp.imageURL('http://0.0.0.0:8000/Dore-munchausen-illustration.jpg');
        this.arrangement.append(tmp);

        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_1';
        tmp.x(0); tmp.y(0);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_2';
        tmp.x(50); tmp.y(0);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('polygon');
        tmp.name = 'polygon_1';
        tmp.points([
            50,    50,
            50+30, 50,
            50+30, 50+30,
            50,    50+30,
        ]);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_3';
        tmp.x(0); tmp.y(50);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_4';
        tmp.x = core.render.getCanvasDimensions().width/2 - 15;
        tmp.y = core.render.getCanvasDimensions().height/2 - 15;
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_5';
        tmp.x(0); tmp.y(400);
        tmp.width(500);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('circle');
        tmp.name = 'circle_1';
        tmp.x(200); tmp.y(200);
        tmp.radius(50)
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);

        var tmp = core.shape.create('path');
        tmp.name = 'path_1';
        tmp.path([
            110, 150,
            100, 120,
            200, 100,
            250, 100,
            300, 100,
            275, 200,
            400, 100,
            500, 100,
            500, 200,
            400, 250,
        ]);
        tmp.thickness(10);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        this.arrangement.append(tmp);





        var group_1 = core.shape.create('group');
        group_1.name = 'group_1';
        group_1.x(100);
        group_1.y(200);
        group_1.angle(0);
        this.arrangement.append(group_1);

        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_6';
        tmp.x(30); tmp.y(30);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        group_1.append(tmp);

        var tmp = core.shape.create('polygon');
        tmp.name = 'polygon_2';
        tmp.points([
            0,    0,
            0+30, 0,
            0+30, 0+30,
            0+15, 0+40,
            0,    0+30,
        ]);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        group_1.append(tmp);

        var tick = 0;
        var tickStep = 0.02;
        setInterval(function(){
            var s_1 = ( 1 + Math.sin( Math.PI*tick ) );
            var s_2 = ( 1 + Math.sin( Math.PI*0.5 + Math.PI*tick ) );

            group_1.scale( 0.5 + (s_1+0.001)/2 );

            tick+=tickStep;
        },1000/40);

        setInterval(function(){
            group_1.angle( group_1.angle() + 0.05 );
        },1000/40);







        var tmp = core.shape.create('canvas');
        tmp.name = 'canvas_1';
        tmp.x(100); tmp.y(200);
        tmp.width(200);
        tmp.height(200);
        this.arrangement.append(tmp);
            tmp.resolution(5);
            tmp._.fillStyle = 'rgb(0,0,0)';
            tmp._.fillRect(tmp.$(20),tmp.$(20),tmp.$(160),tmp.$(160));

            tmp._.fillStyle = 'rgba(255,0,255,0.75)';
            tmp._.fillRect(tmp.$(5),tmp.$(5),tmp.$(20),tmp.$(20));
            tmp._.fillRect(tmp.$(175),tmp.$(5),tmp.$(20),tmp.$(20));
            tmp._.fillRect(tmp.$(175),tmp.$(175),tmp.$(20),tmp.$(20));
            tmp._.fillRect(tmp.$(5),tmp.$(175),tmp.$(20),tmp.$(20));
            var points = [
                {x:30,y:30},
                {x:170, y:30},
                {x:30, y:170},
                {x:170, y:170},
            ];

            tmp._.strokeStyle = 'rgb(255,255,255)';
            tmp._.lineWidth = tmp.$(1);
            tmp._.beginPath(); 
            tmp._.moveTo(tmp.$(points[0].x),tmp.$(points[0].y));
            for(var a = 1; a < points.length; a++){
                tmp._.lineTo(tmp.$(points[a].x),tmp.$(points[a].y));
            }
            tmp._.stroke();



        var group_2 = core.shape.create('group');
        group_2.name = 'group_2';
        group_2.x(300);
        group_2.y(50);
        group_2.angle(0);
        group_2.clipActive(true);
        this.arrangement.append(group_2);
        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_2';
        tmp.x(30); tmp.y(15);
        tmp.anchor({x:0.5,y:0.5});
        tmp.angle(0.5);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        group_2.stencil(tmp);
        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_1';
        tmp.x(0); tmp.y(0);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        group_2.append(tmp);
        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_2';
        tmp.x(30); tmp.y(0);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        group_2.append(tmp);
        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_3';
        tmp.x(-30); tmp.y(0);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        group_2.append(tmp);






        // this.render.frame(); 
        //setTimeout(function(){core.render.frame();},1);
        // core.render.drawDot(100,100);

        this.render.active(true);
        // this.stats.active(true);
        // setInterval(function(){console.log(core.stats.getReport());},1000);
    }else if(testNumber == 2){
        //upper band
            var x = 200 + core.render.getCanvasDimensions().width/2;
            var y = -175 + core.render.getCanvasDimensions().height/2;
            var rectangleGroup_1 = [];
            for(var a = 0; a < 16; a++){
                var tmp = core.shape.create('rectangle');
                tmp.name = 'upperBand_rectangle_'+a;

                tmp.x(x - a*30);
                tmp.y(y);
                tmp.width(30);
                tmp.height(30);
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                this.arrangement.append(tmp);

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
            var x = 200 + core.render.getCanvasDimensions().width/2 + 20/2;
            var y = -100 + core.render.getCanvasDimensions().height/2;
            var rectangleGroup_2 = [];
            for(var a = 0; a < 16; a++){
                var tmp = core.shape.create('rectangle')
                tmp.name = 'middleBand_rectangle_'+a;

                tmp.x(x - a*30);
                tmp.y(y);
                tmp.width(30);
                tmp.height(30);
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                this.arrangement.append(tmp);

                rectangleGroup_2.push(tmp);
            }
            var tick_2 = 0;
            var tickStep_2 = 0.02*rectangleGroup_2.length;
            var waveLength_2 = 2;
            setInterval(function(){
                for(var a = 0; a < rectangleGroup_2.length; a++){
                    rectangleGroup_2[a].y( -75 + 30 + 25*Math.sin( Math.PI*( (tick_2+a*waveLength_2)/rectangleGroup_2.length ) ) + core.render.getCanvasDimensions().height/2 );
                    rectangleGroup_2[a].height( 30 + 25*Math.cos( Math.PI*( (tick_2+a*waveLength_2)/rectangleGroup_2.length ) ) );
                }
                tick_2+=tickStep_2;
            },1000/40);

        //lower band
            var x = 200 + core.render.getCanvasDimensions().width/2;
            var y = 75 + core.render.getCanvasDimensions().height/2;
            var rectangleGroup_3 = [];
            for(var a = 0; a < 16; a++){
                var tmp = core.shape.create('rectangle')
                tmp.name = 'lowerBand_rectangle_'+a;

                tmp.x(x - a*30);
                tmp.y(y);
                tmp.width(30);
                tmp.height(30);
                tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
                this.arrangement.append(tmp);

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

        this.render.active(true);
        // this.stats.active(true);
        // setInterval(function(){console.log(core.stats.getReport());},1000);
    }else if(testNumber == 3){
        //Desktop Mac: 6000/~50fps
        //Work Laptop (dell/linux): 1500/~42fps

        //improved render
        //Work Laptop (dell/linux): 10000/~52fps

        for(var a = 0; a < 10; a++){
            var tmp = core.shape.create('rectangle');
            tmp.name = ''+a;
            tmp.x( tmp.x() + a/10 );
            tmp.y( 0 );
            tmp.width(30);
            tmp.height(30);
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            this.arrangement.append(tmp);
        }

        this.arrangement.remove(tmp);

        // this.render.frame();

        this.render.active(true);
        this.stats.active(true);
        var rollingAverage = 0;
        var rollingAverageIndex = 1;
        setInterval(function(){
            var tmp = core.stats.getReport();
            rollingAverage = rollingAverage*(1 - 1/rollingAverageIndex) + tmp.framesPerSecond*(1/rollingAverageIndex);
            console.log('rollingAverage:',rollingAverage,tmp);
            rollingAverageIndex++;
        },1000);
    }else if(testNumber == 4){
        var group_1 = core.shape.create('group');
        group_1.name = 'group_1';
        group_1.x( core.render.getCanvasDimensions().width/2 );
        group_1.y( core.render.getCanvasDimensions().height/2 );
        this.arrangement.append(group_1);

        var tmp = core.shape.create('polygon');
        tmp.name = 'polygon_1';
        var pointCount = 5;
        var points = []
        for(var a = 0; a < pointCount; a++){
            var x = Math.sin( 2*Math.PI * (a/pointCount) );
            var y = Math.cos( 2*Math.PI * (a/pointCount) );
            points.push(x*100,y*100);
        }
        tmp.points(points);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        group_1.append(tmp);



        this.render.active(true);
        // this.arrangement.get().scale = 1;

        setInterval(function(){ group_1.angle( group_1.angle() + 0.025 ); },1000/40);
    }else if(testNumber == 5){

        var group_1 = core.shape.create('group');
        group_1.name = 'group_1';
            group_1.x(100);
            group_1.y(100);
            this.arrangement.append(group_1);
        var rectangle_1 = core.shape.create('rectangle');
            rectangle_1.name = 'rectangle_1';
            rectangle_1.width(30);
            rectangle_1.height(30);
            rectangle_1.colour = {r:1,g:0,b:0,a:1};
            group_1.append(rectangle_1);
        var group_2 = core.shape.create('group');
            group_2.name = 'group_2';
            group_2.x(50);
            group_1.append(group_2);
            var rectangle_2 = core.shape.create('rectangle');
                rectangle_2.name = 'rectangle_2';
                rectangle_2.width(30);
                rectangle_2.height(30);
                rectangle_2.colour = {r:0,g:1,b:0,a:1};
                group_2.append(rectangle_2);
            var rectangle_3 = core.shape.create('rectangle');
                rectangle_3.name = 'rectangle_3';
                rectangle_3.x(50);
                rectangle_3.width(30);
                rectangle_3.height(30);
                rectangle_3.colour = {r:0,g:0,b:1,a:1};
                group_2.append(rectangle_3);

        var tick = 0;
        setInterval(function(){
            group_2.angle( group_2.angle() + 0.01 );
            group_1.scale( 1 + 0.5*Math.sin( 2*Math.PI*tick ) );
            group_2.scale( 1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/4 ) );
            rectangle_3.scale( 1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/2 ) );
            tick += 0.01;
        },1000/40);

        this.render.active(true);
    }else if(testNumber == 6){
        var dynamicGroup = core.shape.create('group');
        dynamicGroup.name = 'dynamicGroup';
        dynamicGroup.heedCamera = true;
        this.arrangement.append(dynamicGroup);

        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_1';
        tmp.width(200);
        tmp.height(20);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        dynamicGroup.append(tmp);

        var tmp = core.shape.create('polygon');
        tmp.name = 'ploygon_1';
        var pointCount = 5;
        var points = [];
        for(var a = 0; a < pointCount; a++){
            var x = Math.sin( 2*Math.PI * (a/pointCount) );
            var y = Math.cos( 2*Math.PI * (a/pointCount) );
            points.push(x*100 + 100,y*100 + 100);
        }
        tmp.points(points);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        dynamicGroup.append(tmp);


        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_2';
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        dynamicGroup.append(tmp);
        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_3';
        tmp.x(30); tmp.y(30);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        dynamicGroup.append(tmp);
        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_4';
        tmp.x(60); tmp.y(60);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        dynamicGroup.append(tmp);
        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_5';
        tmp.x(90); tmp.y(90);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        dynamicGroup.append(tmp);
        var tmp = core.shape.create('rectangle');
        tmp.name = 'rectangle_6';
        tmp.x(120); tmp.y(120);
        tmp.width(30);
        tmp.height(30);
        tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
        dynamicGroup.append(tmp);





        core.viewport.position(15,15);

        var tick = 0;
        var tickStep = 0.02;

        setInterval(function(){
            var s_1 = ( 1 + Math.sin( Math.PI*tick ) );
            var s_2 = ( 1 + Math.sin( Math.PI*0.5 + Math.PI*tick ) );

            core.viewport.scale( 1 + (s_1-0.5) );
            core.viewport.position(s_1*50,s_1*250);
            core.viewport.angle(-s_1);

            tick+=tickStep;
        },1000/40);
        core.viewport.angle(-Math.PI/4);

        this.render.active(true);
    
    }else if(testNumber == 7){
        var dynamicGroup = core.shape.create('group');
        dynamicGroup.name = 'dynamicGroup';
        dynamicGroup.heedCamera = true;
        this.arrangement.append(dynamicGroup);

            var tmp = core.shape.create('rectangle');
            tmp.name = 'topLeft';
            tmp.x(0); tmp.y(0); tmp.width(30); tmp.height(30);
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            tmp.onmousemove = function(x,y,event,shapes){console.log('rectangle::topLeft::onmousemove');};
            dynamicGroup.append(tmp);

            var tmp = core.shape.create('rectangle');
            tmp.name = 'topRight';
            tmp.x(470); tmp.y(0); tmp.width(30); tmp.height(30);
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            dynamicGroup.append(tmp);

            var tmp = core.shape.create('rectangle');
            tmp.name = 'bottomRight';
            tmp.x(470); tmp.y(470); tmp.width(30); tmp.height(30);
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            dynamicGroup.append(tmp);

            var tmp = core.shape.create('rectangle');
            tmp.name = 'bottomLeft';
            tmp.x(0); tmp.y(470); tmp.width(30); tmp.height(30);
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            dynamicGroup.append(tmp);
            
            var tmp = core.shape.create('rectangle');
            tmp.name = 'centre';
            tmp.x(30); tmp.y(30); tmp.width(440); tmp.height(440);
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:1};
            tmp.onmousedown = function(x,y,event,shapes){console.log('rectangle::centre::onmousedown');};
            tmp.onmouseup = function(x,y,event,shapes){console.log('rectangle::centre::onmouseup');};
            tmp.onmousemove = function(x,y,event,shapes){console.log('rectangle::centre::onmousemove');};
            tmp.onmouseenter = function(x,y,event,shapes){console.log('rectangle::centre::onmouseenter');};
            tmp.onmouseleave = function(x,y,event,shapes){console.log('rectangle::centre::onmouseleave');};
            tmp.onwheel = function(x,y,event,shapes){console.log('rectangle::centre::onwheel');};
            tmp.onclick = function(x,y,event,shapes){console.log('rectangle::centre::onclick');};
            tmp.ondblclick = function(x,y,event,shapes){console.log('rectangle::centre::ondblclick');};
            tmp.onkeydown = function(x,y,event,shapes){console.log('rectangle::centre::onkeydown');};
            tmp.onkeyup = function(x,y,event,shapes){console.log('rectangle::centre::onkeyup');};
            dynamicGroup.append(tmp);

        var staticGroup = core.shape.create('group');
        staticGroup.name = 'staticGroup';
        staticGroup.x(100);
        staticGroup.y(200);
        staticGroup.angle(0);
        this.arrangement.append(staticGroup);

            var tmp = core.shape.create('circle');
            tmp.name = 'circle_1';
            tmp.x(150); tmp.y(150);
            tmp.radius(50)
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
            staticGroup.append(tmp);

            var tmp = core.shape.create('polygon');
            tmp.name = 'polygon_1';
            var points = [
                5,  -15,
                55, -15,
                80,  30,
                55,  75,
                5,   75,
                -20, 30,
            ].map(a => a+60);
            tmp.points(points);
            tmp.colour = {r:Math.random(),g:Math.random(),b:Math.random(),a:0.5};
            tmp.onmousedown = function(x,y,event,shapes){console.log('polygon::polygon_1::onmousedown');};
            staticGroup.append(tmp);




        // console.log( tmp.getAddress() );

        // core.viewport.position(100,100);
        // core.viewport.angle( Math.PI/3 );
        // core.viewport.scale(1/2);


        // console.log( core.arrangement.getElementUnderPoint(70,70) );
        // console.log( core.arrangement.getElementsUnderArea([{x:0,y:0},{x:60,y:0},{x:0,y:60}]) );
        // console.log( core.viewport.getElementUnderCanvasPoint(70,70) );
        // console.log( core.viewport.getElementsUnderCanvasArea([{x:0,y:0},{x:60,y:0},{x:0,y:60}]) );



        // document.getElementById("canvas").onmousedown = function(event){
        //     console.log( core.arrangement.getElementUnderPoint(event.x,event.y) );
        // }

        core.callback.onmousedown   = function(x,y,event,shapes){ shapes.forEach(a => a.onmousedown(x,y,event,shapes)); }
        core.callback.onmouseup     = function(x,y,event,shapes){ shapes.forEach(a => a.onmouseup(x,y,event,shapes)); }
        core.callback.onmousemove   = function(x,y,event,shapes){ shapes.forEach(a => a.onmousemove(x,y,event,shapes)); }
        core.callback.onmouseenter  = function(x,y,event,shapes){ shapes.forEach(a => a.onmouseenter(x,y,event,shapes)); }
        core.callback.onmouseleave  = function(x,y,event,shapes){ shapes.forEach(a => a.onmouseleave(x,y,event,shapes)); }
        core.callback.onwheel       = function(x,y,event,shapes){ shapes.forEach(a => a.onwheel(x,y,event,shapes)); }
        core.callback.onclick       = function(x,y,event,shapes){ shapes.forEach(a => a.onclick(x,y,event,shapes)); }
        core.callback.ondblclick    = function(x,y,event,shapes){ shapes.forEach(a => a.ondblclick(x,y,event,shapes)); }
        core.callback.onkeydown     = function(x,y,event,shapes){ shapes.forEach(a => a.onkeydown(x,y,event,shapes)); }
        core.callback.onkeyup       = function(x,y,event,shapes){ shapes.forEach(a => a.onkeyup(x,y,event,shapes)); }


        this.render.frame();
        // this.render.active(true);
    }
    
};