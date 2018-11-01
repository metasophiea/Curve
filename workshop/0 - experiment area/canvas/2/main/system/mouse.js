canvas.system.core.callback.onmousedown = function(x,y,event){ 
    // console.log( canvas.system.core.element.getElementUnderPoint(x,y) );

    canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmousedown)(event);
};
canvas.system.core.callback.onwheel = function(x,y,event){
    canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onwheel)(event);
};



this.tmp = {};
this.functionList = {};


this.functionList.onmousedown = [
    {
        'specialKeys':[],
        'function':function(event){
            //save the old listener functions of the canvas
                canvas.system.mouse.tmp.onmousemove_old = canvas.onmousemove;
                canvas.system.mouse.tmp.onmouseleave_old = canvas.onmouseleave;
                canvas.system.mouse.tmp.onmouseup_old = canvas.onmouseup;

            //save the viewport position and click position
                canvas.system.mouse.tmp.oldPosition = canvas.system.core.viewport.position;
                canvas.system.mouse.tmp.clickPosition = {x:event.x, y:event.y};

            //replace the canvas's listeners 
                canvas.onmousemove = function(event){
                    //update the viewport position
                        canvas.system.core.viewport.position = {
                            x: canvas.system.mouse.tmp.oldPosition.x - ((canvas.system.mouse.tmp.clickPosition.x-event.x) / canvas.system.core.viewport.scale),
                            y: canvas.system.mouse.tmp.oldPosition.y - ((canvas.system.mouse.tmp.clickPosition.y-event.y) / canvas.system.core.viewport.scale),
                        };
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
        'function':function(event){
            var zoomLimits = {'max':10, 'min':0.1};

            //get the viewport position and zoom
                var position = canvas.system.core.viewport.position;
                var zoom = canvas.system.core.viewport.scale;

            //perform zoom and associated pan
                //discover point under mouse
                    var originalPoint = canvas.system.core.adapter.windowPoint2workspacePoint(event.x,event.y);
                //perform actual scaling
                    zoom -= zoom*(event.deltaY/100);
                    if( zoom > zoomLimits.max ){zoom = zoomLimits.max;}
                    if( zoom < zoomLimits.min ){zoom = zoomLimits.min;}
                    canvas.system.core.viewport.scale = zoom;
                //discover point under mouse
                    var newPoint = canvas.system.core.adapter.windowPoint2workspacePoint(event.x,event.y);
                //pan so we're back at the old point (accounting for angle)
                    var pan = canvas.system.utility.cartesianAngleAdjust(
                        (newPoint.x - originalPoint.x),
                        (newPoint.y - originalPoint.y),
                        canvas.system.core.viewport.angle
                    );
                    canvas.system.core.viewport.position.x += pan.x;
                    canvas.system.core.viewport.position.y += pan.y;

            //request that the function list stop here
                return true;
        }
    }
];