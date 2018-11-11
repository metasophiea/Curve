canvas.system.core.callback.onmousedown = function(x,y,event){
    // console.log( canvas.system.core.arrangement.getElementUnderPoint(x,y) );
    // canvas.system.core.arrangement.remove( canvas.system.core.arrangement.getElementUnderPoint(x,y) );
    canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmousedown)(event,{x:x,y:y});
};
canvas.system.core.callback.onmousemove = function(x,y,event){ 
    canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmousemove)(event,{x:x,y:y});
};
canvas.system.core.callback.onmouseup = function(x,y,event){ 
    canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmouseup)(event,{x:x,y:y});
};
canvas.system.core.callback.onmouseleave = function(x,y,event){ 
    canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmouseleave)(event,{x:x,y:y});
};
canvas.system.core.callback.onmouseenter = function(x,y,event){ 
    canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmouseenter)(event,{x:x,y:y});
};
canvas.system.core.callback.onwheel = function(x,y,event){
    canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onwheel)(event,{x:x,y:y});
};



this.tmp = {};
this.functionList = {};

this.functionList.onmousedown = [
    {
        'specialKeys':[],
        'function':function(event,data){
            //save the old listener functions of the canvas
                canvas.system.mouse.tmp.onmousemove_old = canvas.onmousemove;
                canvas.system.mouse.tmp.onmouseleave_old = canvas.onmouseleave;
                canvas.system.mouse.tmp.onmouseup_old = canvas.onmouseup;

            //save the viewport position and click position
                canvas.system.mouse.tmp.oldPosition = canvas.system.core.viewport.position();
                canvas.system.mouse.tmp.clickPosition = {x:event.x, y:event.y};

            //replace the canvas's listeners 
                canvas.onmousemove = function(event){
                    //update the viewport position
                        canvas.system.core.viewport.position(
                            canvas.system.mouse.tmp.oldPosition.x - ((canvas.system.mouse.tmp.clickPosition.x-event.x) / canvas.system.core.viewport.scale()),
                            canvas.system.mouse.tmp.oldPosition.y - ((canvas.system.mouse.tmp.clickPosition.y-event.y) / canvas.system.core.viewport.scale()),
                        );
                };

                canvas.onmouseup = function(){
                    //put back the old listeners 
                        this.onmousemove = canvas.system.mouse.tmp.onmousemove_old;
                        this.onmouseleave = canvas.system.mouse.tmp.onmouseleave_old;
                        this.onmouseup = canvas.system.mouse.tmp.onmouseup_old;

                    //delete all the tmp data
                        canvas.system.mouse.tmp = {};
                };

                canvas.onmouseleave = canvas.onmouseup;

            //request that the function list stop here
                return true;
        }
    }
];
this.functionList.onmousemove = [];
this.functionList.onmouseup = [];
this.functionList.onmouseleave = [];
this.functionList.onmouseenter = [];
this.functionList.onwheel = [
    {
        'specialKeys':[],
        'function':function(event,data){
            var scaleLimits = {'max':10, 'min':0.1};

            //perform scale and associated pan
                //discover point under mouse
                    var originalPoint = canvas.system.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                //perform actual scaling
                    var scale = canvas.system.core.viewport.scale();
                    scale -= scale*(event.deltaY/100);
                    if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                    if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                    canvas.system.core.viewport.scale(scale);
                //discover point under mouse
                    var newPoint = canvas.system.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                //pan so we're back at the old point (accounting for angle)
                    var pan = canvas.system.utility.cartesianAngleAdjust(
                        (newPoint.x - originalPoint.x),
                        (newPoint.y - originalPoint.y),
                        canvas.system.core.viewport.angle()
                    );
                    var temp = canvas.system.core.viewport.position();
                    canvas.system.core.viewport.position(temp.x+pan.x,temp.y+pan.y)

            //request that the function list stop here
                return true;
        }
    }
];