var staticBackground = canvas.system.core.element.add( {type:'group', ignoreMe:true, static:true}, 'staticBackground' );
    var test = canvas.system.core.element.add( {type:'rect', data:{x:15, y:0, width:30, height:30, fillStyle:'rgba(255,0,0,0.3)'}}, 'test 1', staticBackground );

var main = canvas.system.core.element.add( {type:'group'}, 'main' );
    var background = canvas.system.core.element.add( {type:'group', ignoreMe:true}, 'background', main );
        var test = canvas.system.core.element.add( {type:'rect', data:{x:30, y:30, width:30, height:30, fillStyle:'rgba(255,0,0,0.3)'}}, 'test 1', background );
    var middleground = canvas.system.core.element.add( {type:'group'}, 'middleground', main );
        var test = canvas.system.core.element.add( {type:'rect', data:{x:90, y:30, width:30, height:30}}, 'test 1', middleground );
        canvas.system.core.element.add( {type:'image', data:{x:100, y:30, width:200, height:200, angle:0.3, url:'https://images-na.ssl-images-amazon.com/images/I/61Nx%2BIpgqQL._SY355_.jpg'}}, 'image 1', middleground );
    var foreground = canvas.system.core.element.add( {type:'group', ignoreMe:true}, 'foreground', main );
        var test = canvas.system.core.element.add( {type:'rect', data:{x:150, y:30, width:30, height:30, fillStyle:'rgba(255,0,0,0.3)'}}, 'test 1', foreground );
        
var control = canvas.system.core.element.add( {type:'group', static:true}, 'control' );
    var test = canvas.system.core.element.add( {type:'rect', data:{x:45, y:60, width:30, height:30}}, 'test 1', control );

console.log(canvas.system.core.element.getArrangement());
