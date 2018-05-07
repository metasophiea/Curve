__globals.objects.make_warbler = function(x,y){
    //set numbers
        var type = 'warbler';
        var shape = {};
            shape.base = [{x:0,y:0},{x:100,y:0},{x:100,y:55},{x:0,y:55}];
            shape.connector = { width: 20, height: 20 };
            shape.connections = {};
                shape.connections.data = [];
                    shape.connections.data.push(
                        {
                            name: 'io.data.out:%',
                            x:-shape.connector.width/2, 
                            y:shape.base[2].y-shape.connector.height*1.25, 
                            width:shape.connector.width, 
                            height:shape.connector.height
                        }
                    );
        
        var style = {
            background: 'fill:rgba(200,200,200,1)',
            text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;'
        };

    //main
    var _mainObject = parts.basic.g(type, x, y);
        _mainObject._type = type;

    //circuitry
        var index = 0;
        var values = [0.1, 0.9];
        var time = 1000;
        setInterval(function(){
            _mainObject.io['io.data.out:%'].send('%t',{target:values[index],time:(time)/1000,curve:'s'});
            index = index+1 < values.length ? index+1 : 0;
        },time);
        
    //elements
        //backing
            var backing = parts.basic.path(null, shape.base, 'L', style.background);
            _mainObject.append(backing);
            __globals.mouseInteraction.declareObjectGrapple(backing, _mainObject, arguments.callee);
   
        //generate selection area
            __globals.utility.object.generateSelectionArea(shape.base, _mainObject);

     
    //connection nodes
        _mainObject.io = {};

        //data
            shape.connections.data.forEach(function(data){
                _mainObject.io[data.name] = parts.dynamic.connectionNode_data(data.name, data.x, data.y, data.width, data.height);
                _mainObject.prepend(_mainObject.io[data.name]);
            });

    return _mainObject;
};