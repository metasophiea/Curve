_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('image','image_1',{x:160,y:0,width:250,height:250,url:'http://0.0.0.0:8000/testImages/mikeandbrian.jpg'}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('image','image_2',{x:-50,y:100,width:160,height:215,angle:-0.5,url:'http://0.0.0.0:8000/testImages/Dore-munchausen-illustration.jpg'}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('rectangle','rectangle_1',{x:0,y:0,width:30,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('rectangle','rectangle_2',{x:50,y:0,width:30,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('polygon','polygon_1',{points:[ 50,50, 80,50, 80,80, 50,80 ],colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('rectangle','rectangle_3',{x:0,y:50,width:30,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('rectangle','rectangle_4',{x:(_canvas_.core.render.getCanvasDimensions().width/2 - 15),y:(_canvas_.core.render.getCanvasDimensions().height/2 - 15),width:30,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('rectangle','rectangle_5',{x:0,y:400,width:500,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('circle','circle_1',{x:200,y:200,radius:50,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
_canvas_.system.pane.mm.append( _canvas_.interface.part.builder('path','path_1',{path:[ 110,150, 100,120, 200,100, 250,100, 300,100, 275,200, 400,100, 500,100, 500,200, 400,250 ],thickness:10,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );




var group_1 = _canvas_.interface.part.builder('group','group_1',{x:100,y:200});
_canvas_.system.pane.mm.append( group_1 );
group_1.append( _canvas_.interface.part.builder('rectangle','rectangle_6',{x:30,y:30,width:30,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
group_1.append( _canvas_.interface.part.builder('polygon','polygon_2',{points:[ 0,0, 30,0, 30,30, 15,40, 0,30 ],colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );




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








var canvas = _canvas_.interface.part.builder('canvas','canvas_1',{x:100,y:200,width:200,height:200,resolution:5});
_canvas_.core.arrangement.append( canvas );
    canvas._.fillStyle = 'rgb(0,0,0)';
    canvas._.fillRect(canvas.$(20),canvas.$(20),canvas.$(160),canvas.$(160));

    canvas._.fillStyle = 'rgba(255,0,255,0.75)';
    canvas._.fillRect(canvas.$(5),canvas.$(5),canvas.$(20),canvas.$(20));
    canvas._.fillRect(canvas.$(175),canvas.$(5),canvas.$(20),canvas.$(20));
    canvas._.fillRect(canvas.$(175),canvas.$(175),canvas.$(20),canvas.$(20));
    canvas._.fillRect(canvas.$(5),canvas.$(175),canvas.$(20),canvas.$(20));

    var points = [ {x:30,y:30}, {x:170,y:30}, {x:30,y:170}, {x:170,y:170} ];
    canvas._.strokeStyle = 'rgb(255,255,255)';
    canvas._.lineWidth = canvas.$(1);
    canvas._.beginPath(); 
    canvas._.moveTo(canvas.$(points[0].x),canvas.$(points[0].y));
    for(var a = 1; a < points.length; a++){
        canvas._.lineTo(canvas.$(points[a].x),canvas.$(points[a].y));
    }
    canvas._.stroke();




var group_2 = _canvas_.interface.part.builder('group','group_2',{x:300,y:50});
_canvas_.system.pane.mm.append( group_2 );
group_2.clipActive(true);
    group_2.stencil( _canvas_.interface.part.builder('rectangle','stencil',{x:30,y:15,width:30,height:30,angle:0.5,anchor:{x:0.5,y:0.5}}) );
    group_2.append( _canvas_.interface.part.builder('rectangle','rectangle_7',{x:0,y:0,width:30,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
    group_2.append( _canvas_.interface.part.builder('rectangle','rectangle_8',{x:30,y:0,width:30,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );
    group_2.append( _canvas_.interface.part.builder('rectangle','rectangle_9',{x:-30,y:0,width:30,height:30,colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}}) );



    
_canvas_.core.render.active(true);