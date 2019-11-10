const viewport = new function(){
    const self = this;
    const state = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
    };
    const viewbox = {
        points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
        boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
    };
    const mouseData = { 
        x:undefined, 
        y:undefined, 
        stopScrollActive:false,
        clickVisibility:false,
    };

    //adapter
        this.adapter = new function(){
            this.windowPoint2workspacePoint = function(x,y){
                dev.log.viewport('.adapter.windowPoint2workspacePoint('+x+','+y+')'); //#development
                const position = viewport.position();
                const scale = viewport.scale();
                const angle = viewport.angle();

                let tmp = {x:x, y:y};
                tmp.x = (tmp.x - position.x)/scale;
                tmp.y = (tmp.y - position.y)/scale;
                tmp = library.math.cartesianAngleAdjust(tmp.x,tmp.y,-angle);

                return tmp;
            };
            // this.workspacePoint2windowPoint = function(x,y){
            //     let position = viewport.position();
            //     let scale = viewport.scale();
            //     let angle = viewport.angle();

            //     let point = library.math.cartesianAngleAdjust(x,y,angle);

            //     return {
            //         x: (point.x+position.x) * scale,
            //         y: (point.y+position.y) * scale
            //     };
            // };
        };

    //camera position
        this.position = function(x,y){
            dev.log.viewport('.position('+x+','+y+')'); //#development
            if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
            state.position.x = x;
            state.position.y = y;

            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){
                    dev.log.viewport('.position -> adjusting: '+JSON.stringify(item)); //#development
                    item.unifiedAttribute({x:state.position.x,y:state.position.y});
                }
            });

            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };
        this.scale = function(s){
            dev.log.viewport('.scale('+s+')'); //#development
            if(s == undefined){return state.scale;}
            state.scale = s <= 0 ? 1 : s;
            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    dev.log.viewport('.scale -> adjusting: '+JSON.stringify(item)); //#development
                    item.scale(state.scale);
                }
            });
            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };
        this.angle = function(a){
            dev.log.viewport('.angle('+a+')'); //#development
            if(a == undefined){return state.angle;}
            state.angle = a;
            arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ 
                    dev.log.viewport('.angle -> adjusting: '+JSON.stringify(item)); //#development
                    item.angle(state.angle);
                }
            });
            calculateViewportExtremities();

            self.onCameraAdjust( Object.assign({},state) );
        };

    //mouse interaction
        this.getElementUnderCanvasPoint = function(x,y){
            dev.log.viewport('.getElementUnderCanvasPoint('+x+','+y+')'); //#development
            let xy = this.adapter.windowPoint2canvasPoint(x,y);
            return arrangement.getElementUnderPoint(xy.x,xy.y);
        };
        this.getElementsUnderCanvasArea = function(points){
            dev.log.viewport('.getElementsUnderCanvasArea('+JSON.stringify(points)+')'); //#development
            return arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2canvasPoint(a.x,a.y)));
        };
 
    //misc
        function calculateViewportExtremities(){
            dev.log.viewport('::calculateViewportExtremities()'); //#development
            const canvasDimensions = render.getCanvasDimensions();

            //for each corner of the viewport; find out where they lie on the canvas
                viewbox.points.tl = {x:0, y:0};
                viewbox.points.tr = {x:canvasDimensions.width, y:0};
                viewbox.points.bl = {x:0, y:canvasDimensions.height};
                viewbox.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
            //calculate a bounding box for the viewport from these points
                viewbox.boundingBox = library.math.boundingBoxFromPoints([viewbox.points.tl, viewbox.points.tr, viewbox.points.br, viewbox.points.bl]);
                dev.log.viewport('::calculateViewportExtremities -> viewbox.boundingBox: '+JSON.stringify(viewbox.boundingBox)); //#development
        }
        this.calculateViewportExtremities = calculateViewportExtremities;
        this.refresh = function(){
            dev.log.viewport('.refresh()'); //#development
            calculateViewportExtremities();
        };
        this.getBoundingBox = function(){ 
            dev.log.viewport('.getBoundingBox()'); //#development
            return viewbox.boundingBox;
        };
        this.mousePosition = function(x,y){
            dev.log.viewport('.mousePosition('+x+','+y+')'); //#development
            if(x == undefined || y == undefined){return {x:mouseData.x, y:mouseData.y};}
            mouseData.x = x;
            mouseData.y = y;
        };
        this.stopMouseScroll = function(bool){
            dev.log.viewport('.stopMouseScroll('+bool+')'); //#development
            if(bool == undefined){return mouseData.stopScrollActive;}
            mouseData.stopScrollActive = bool;
    
            //just incase; make sure that scrolling is allowed again when 'stopMouseScroll' is turned off
            if(!bool){ interface['document.body.style.overflow'](''); }
        };
        this.clickVisibility = function(a){ 
            dev.log.viewport('.clickVisibility('+a+')'); //#development
            if(a==undefined){return mouseData.clickVisibility;} 
            mouseData.clickVisibility=a; 
        };
        this.getHeight = function(){ 
            dev.log.viewport('.getHeight()'); //#development
            return viewbox.points.br.y - viewbox.points.tl.y; 
        };
        this.getWidth= function(){ 
            dev.log.viewport('.getWidth()'); //#development
            return viewbox.points.br.x - viewbox.points.tl.x; 
        };
        this._dump = function(){
            report.info('viewport._dump()');
            report.info('viewport._dump -> state: '+JSON.stringify(state));
            report.info('viewport._dump -> viewbox: '+JSON.stringify(viewbox));
            report.info('viewport._dump -> mouseData: '+JSON.stringify(mouseData));
        };

    //callback
        this.onCameraAdjust = function(state){};
};