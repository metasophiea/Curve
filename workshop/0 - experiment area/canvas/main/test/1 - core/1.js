var staticBackground = canvas.core.arrangement.add( undefined, (function(){var temp = canvas.core.element.create('group'); temp.name = 'staticBackground'; return temp;})() );
    staticBackground.ignored = true;
    staticBackground.static = true;
    canvas.core.arrangement.refresh(staticBackground);
    var test = canvas.core.arrangement.add( staticBackground, (function(){var temp = canvas.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
        test.x = 15; test.y = 0;
        test.width = 30; test.height = 30;
        test.fillStyle = 'rgba(255,0,0,0.3)';
        canvas.core.arrangement.refresh(test);

var main = canvas.core.arrangement.add( undefined, (function(){var temp = canvas.core.element.create('group'); temp.name = 'main'; return temp;})() );
    var background = canvas.core.arrangement.add( main, (function(){var temp = canvas.core.element.create('group'); temp.name = 'background'; return temp;})() );
        var test = canvas.core.arrangement.add( background, (function(){var temp = canvas.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
        test.x = 30; test.y = 30;
        test.width = 30; test.height = 30;
        test.fillStyle = 'rgba(255,0,0,0.3)';
        canvas.core.arrangement.refresh(test);
        
    var middleground = canvas.core.arrangement.add( main, (function(){var temp = canvas.core.element.create('group'); temp.name = 'middleground'; return temp;})() );
        var test = canvas.core.arrangement.add( middleground, (function(){var temp = canvas.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
            test.x = 90; test.y = 30;
            test.width = 30; test.height = 30;
            test.fillStyle = 'rgba(255,0,0,1)';
            canvas.core.arrangement.refresh(test);
        var test = canvas.core.arrangement.add( middleground, (function(){var temp = canvas.core.element.create('image'); temp.name = 'testImage'; return temp;})() );
            test.x = 100; test.y = 30;
            test.width = 200; test.height = 200;
            test.angle = 0.3;
            test.url = 'https://images-na.ssl-images-amazon.com/images/I/61Nx%2BIpgqQL._SY355_.jpg';
            canvas.core.arrangement.refresh(test);
        var test = canvas.core.arrangement.add( middleground, (function(){var temp = canvas.core.element.create('polygon'); temp.name = 'testPoly'; return temp;})() );
            test.points = [{x:0,y:0}, {x:10,y:0}, {x:10,y:10}, {x:5,y:20}, {x:0,y:10}];
            canvas.core.arrangement.refresh(test);
        // var test = canvas.core.arrangement.add( middleground, (function(){var temp = canvas.core.element.create('dot'); temp.name = 'testDot'; return temp;})() );
        //     test.x = 200; test.y = 100;
        //     canvas.core.arrangement.refresh(test);

    var foreground = canvas.core.arrangement.add( main, (function(){var temp = canvas.core.element.create('group'); temp.name = 'foreground'; return temp;})() );
        var test = canvas.core.arrangement.add( foreground, (function(){var temp = canvas.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
            test.x = 150; test.y = 30;
            test.width = 30; test.height = 30;
            test.fillStyle = 'rgba(255,0,0,0.3)';
            canvas.core.arrangement.refresh(test);

var control = canvas.core.arrangement.add( undefined, (function(){var temp = canvas.core.element.create('group'); temp.name = 'control'; return temp;})() );
    control.static = true;
    canvas.core.arrangement.refresh(control);
    var test = canvas.core.arrangement.add( control, (function(){var temp = canvas.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
        test.x = 45; test.y = 60;
        test.width = 30; test.height = 30;
        test.fillStyle = 'rgba(255,0,0,0.3)';
        canvas.core.arrangement.refresh(test);

canvas.core.render.active(true);