_canvas_.layers.registerFunctionForLayer("system", function(){

    _canvas_.system.mouse.functionList.onmousemove.push(
        {
            requiredKeys:[],
            function:function(data){
                console.log('onmousemove!',data.x,data.y,data.event);
            }
        }
    );

} );