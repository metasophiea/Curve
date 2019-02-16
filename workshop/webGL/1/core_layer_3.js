core.callback = new function(){
    var callbacks = [
        'onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onclick', 'ondblclick',
        'onkeydown', 'onkeyup',
    ];
    var mouseposition = {x:undefined,y:undefined};

    //default
        for(var a = 0; a < callbacks.length; a++){
            core.canvas[callbacks[a]] = function(callback){
                return function(event){
                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}
            
                    //convert the point
                        var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);
            
                    //get the shapes under this point that have this callback, in order of front to back
                        var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
            
                    //activate core's callback, providing the converted point, original event, and shapes
                        core.callback[callback]( p.x, p.y, event, shapes );
                }
            }(callbacks[a]);
        }

    //special cases
        //onmousemove / onmouseenter / onmouseleave
            var shapeMouseoverList = [];
            core.canvas.onmousemove = function(event){
                //convert the point
                    var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);

                //update the stored mouse position
                    mouseposition = {x:p.x,y:p.y};

                //check for onmouseenter / onmouseleave
                    //get all shapes under point that have onmouseenter or onmouseleave callbacks
                        var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a.onmouseenter!=undefined || a.onmouseleave!=undefined);
                    //go through this list, comparing to the shape transition list
                        //shapes only on shapes list; run onmouseenter and add to shapeMouseoverList
                        //shapes only on shapeMouseoverList; run onmouseleave and remove from shapeMouseoverList
                        var diff = workspace.library.math.getDifferenceOfArrays(shapeMouseoverList,shapes);
                        diff.b.forEach(function(a){
                            if(a.onmouseenter){a.onmouseenter( p.x, p.y, event, shapes );}
                            shapeMouseoverList.push(a);
                        });
                        diff.a.forEach(function(a){
                            if(a.onmouseleave){a.onmouseleave( p.x, p.y, event, shapes );}
                            shapeMouseoverList.splice(shapeMouseoverList.indexOf(a),1);
                        });

                //perform regular onmousemove actions
                    var callback = 'onmousemove';

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}
            
                    //get the shapes under this point that have this callback, in order of front to back
                        var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
            
                    //activate core's callback, providing the converted point, original event, and shapes
                        core.callback[callback]( p.x, p.y, event, shapes );
            };

        //onkeydown / onkeyup
            var tmp = ['onkeydown', 'onkeyup'];
            for(var a = 0; a < tmp.length; a++){
                core.canvas[tmp[a]] = function(callback){
                    return function(event){
                        //if core doesn't have this callback set up, just bail
                            if( !core.callback[callback] ){return;}
            
                        //gather the last (converted) mouse point
                            var p = mouseposition;
                    
                        //get the shapes under this point that have this callback, in order of front to back
                            var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
            
                        //activate core's callback, providing the converted point, original event, and shapes
                            core.callback[callback]( p.x, p.y, event, shapes );
                    }
                }(tmp[a]);
            }

        //onmousedown / onmouseup / onclick
            var shapeMouseclickList = [];
            core.canvas.onclick = function(){};
            core.canvas.onmousedown = function(event){
                //convert the point
                    var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);

                //save current shapes for use in the onmouseup callback
                    shapeMouseclickList = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a.onclick!=undefined);

                //perform regular onmousedown actions
                    var callback = 'onmousedown';

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}
            
                    //get the shapes under this point that have this callback, in order of front to back
                        var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
            
                    //activate core's callback, providing the converted point, original event, and shapes
                        core.callback[callback]( p.x, p.y, event, shapes );
            };
            core.canvas.onmouseup = function(event){
                //convert the point
                    var p = core.viewport.adapter.windowPoint2workspacePoint(event.x,event.y);

                //for the shapes under the mouse that are also on the shapeMouseclickList, activate their "onclick" callback
                    var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a.onclick!=undefined);
                    shapes.forEach(function(a){ if( shapeMouseclickList.includes(a) ){ a.onclick(p.x, p.y, event, shapes); } });

                //perform regular onmouseup actions
                    var callback = 'onmouseup';

                    //if core doesn't have this callback set up, just bail
                        if( !core.callback[callback] ){return;}
            
                    //get the shapes under this point that have this callback, in order of front to back
                        var shapes = core.arrangement.getElementsUnderPoint(p.x,p.y).filter(a => a[callback]!=undefined);
            
                    //activate core's callback, providing the converted point, original event, and shapes
                        core.callback[callback]( p.x, p.y, event, shapes );
            };
};