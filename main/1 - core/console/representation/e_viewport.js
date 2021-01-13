this.viewport = new function(){
    const cachedValues = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
        anchor:{x:0,y:0},
        stopMouseScroll:false,
    };
    //adapter
        this.adapter = new function(){
            this.windowPoint2workspacePoint = function(x,y){
                dev.log.interface('.viewport.adapter.windowPoint2workspacePoint(',x,y); //#development
                const position = cachedValues.position;
                const scale = cachedValues.scale;
                const angle = cachedValues.angle;

                let tmp = {x:x, y:y};
                tmp = _canvas_.library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);
                tmp.x = tmp.x/scale + position.x;
                tmp.y = tmp.y/scale + position.y;

                return tmp;
            };
        };
        
    //camera position
        this.position = function(x,y){
            dev.log.viewport('.position(',x,y); //#development
            if(x == undefined || y == undefined){ return cachedValues.position; }
            cachedValues.position = {x:x,y:y};
            interface.operator.viewport.position(x,y);
        };
        this.scale = function(s){
            dev.log.viewport('.scale(',s); //#development
            if(s == undefined){ return cachedValues.scale; }
            if(s == 0){ console.error('cannot set scale to zero'); }
            cachedValues.scale = s;
            interface.operator.viewport.scale(s);
        };
        this.angle = function(a){
            dev.log.viewport('.angle(',a); //#development
            if(a == undefined){ return cachedValues.angle; }
            cachedValues.angle = a;
            interface.operator.viewport.angle(a);
        };
        this.anchor = function(x,y){
            dev.log.viewport('.anchor(',x,y); //#development
            if(x == undefined || y == undefined){ return cachedValues.anchor; }
            cachedValues.anchor = {x:x,y:y};
            interface.operator.viewport.anchor(x,y);
        };
        this.scaleAroundWindowPoint = function(s,x,y){
            dev.log.viewport('.scaleAroundWindowPoint(',s); //#development
            if(s == undefined || x == undefined || y == undefined){ return; }
            if(s == 0){ console.error('cannot set scale to zero'); }
            cachedValues.scale = s;
            interface.operator.viewport.scaleAroundWindowPoint(s,x,y).then(data => {
                cachedValues.position = {x:data[0],y:data[1]};
            });
        };
    
    //mouse interaction
        this.getElementsUnderPoint = function(x,y){
            dev.log.viewport('.getElementsUnderPoint(',x,y); //#development
            return new Promise((resolve, reject) => {
                interface.operator.viewport.getElementsUnderPoint(x,y).then(ids => {
                    resolve(ids.map(id => self.element.getElementById(id)));
                });
            });
        };
        this.getElementsUnderArea = function(points){
            dev.log.viewport('.getElementsUnderArea(',points); //#development
            return new Promise((resolve, reject) => {
                interface.operator.viewport.getElementsUnderArea(points).then(ids => {
                    resolve(ids.map(id => self.element.getElementById(id)));
                });
            });
        };
        // this.mousePosition = function(x,y){
        //     dev.log.viewport('.mousePosition(',x,y); //#development
        //     if(x == undefined || y == undefined){ return mouseData; }
        //     mouseData.x = x;
        //     mouseData.y = y;
        //     interface.operator.viewport.mousePosition(x,y);
        // };
        this.stopMouseScroll = function(bool){
            dev.log.viewport('.stopMouseScroll(',bool); //#development
            if(bool == undefined){ return cachedValues.stopMouseScroll; }
            cachedValues.stopMouseScroll = bool;
            interface.operator.viewport.stopMouseScroll(bool);
        };
    
    //misc
        this.refresh = function(){
            dev.log.viewport('.refresh()'); //#development
            interface.operator.viewport.refresh();
        };
        this.cursor = function(type){
            //cursor types: https://www.w3schools.com/csSref/tryit.asp?filename=trycss_cursor
            if(type == undefined){return document.body.style.cursor;}
            document.body.style.cursor = type;
        };
        this._dump = function(){
            dev.log.viewport('._dump()'); //#development
            interface.operator.viewport._dump();
        };
};