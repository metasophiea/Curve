core.viewport = new function(){
    var state = {
        position:{x:0,y:0},
        scale:1,
        angle:0,
    };
    var viewbox = {
        canvas:{
            points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
            boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
        },
        camera:{
            points:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
            boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} },
        },
    };

    //adapter
        this.adapter = new function(){
            this.windowPoint2workspacePoint = function(x,y){
                var position = core.viewport.position();
                var scale = core.viewport.scale() / window.devicePixelRatio;
                var angle = core.viewport.angle();
        
                x = (x/scale) - position.x;
                y = (y/scale) - position.y;
        
                return workspace.library.math.cartesianAngleAdjust(x,y,-angle);
            };
            this.workspacePoint2windowPoint = function(x,y){
                var position = core.viewport.position();
                var scale = core.viewport.scale();
                var angle = core.viewport.angle();
    
                var point = workspace.library.math.cartesianAngleAdjust(x,y,angle);
    
                return {
                    x: (point.x+position.x) * scale,
                    y: (point.y+position.y) * scale
                };
            };
        };

    //camera position
        this.position = function(x,y){
            if(x == undefined || y == undefined){return {x:state.position.x,y:state.position.y};}
            state.position.x = x;
            state.position.y = y;

            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.x(state.position.x); item.y(state.position.y); }
            });

            calculateViewportExtremities();
        };
        this.scale = function(s){
            if(s == undefined){return state.scale;}
            state.scale = s <= 0 ? 1 : s;
            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.scale(state.scale); }
            });
            calculateViewportExtremities();
        };
        this.angle = function(a){
            if(a == undefined){return state.angle;}
            state.angle = a;
            core.arrangement.get().children().forEach(function(item){
                if(item.heedCamera){ item.angle(state.angle); }
            });
            calculateViewportExtremities();
        };

    //mouse interaction
        this.getElementUnderCanvasPoint = function(x,y){
            var xy = this.adapter.windowPoint2workspacePoint(x,y);
            return core.arrangement.getElementUnderPoint(xy.x,xy.y);
        };
        this.getElementsUnderCanvasArea = function(points){
            return core.arrangement.getElementsUnderArea(points.map(a => this.adapter.windowPoint2workspacePoint(a.x,a.y)));
        };

    //misc
        function calculateViewportExtremities(){
            var canvasDimensions = core.render.getCanvasDimensions();

            //canvas
                //for each corner of the viewport; find out where they lie on the workspace
                    viewbox.canvas.points.tl = {x:0, y:0};
                    viewbox.canvas.points.tr = {x:canvasDimensions.width, y:0};
                    viewbox.canvas.points.bl = {x:0, y:canvasDimensions.height};
                    viewbox.canvas.points.br = {x:canvasDimensions.width, y:canvasDimensions.height};
                //calculate a bounding box for the viewport from these points
                    viewbox.canvas.boundingBox = workspace.library.math.boundingBoxFromPoints([viewbox.canvas.points.tl, viewbox.canvas.points.tr, viewbox.canvas.points.br, viewbox.canvas.points.bl]);

            //camera
                //for each corner of the viewport; find out where they lie on the workspace
                viewbox.camera.points.tl = core.viewport.adapter.windowPoint2workspacePoint(0,0);
                viewbox.camera.points.tr = core.viewport.adapter.windowPoint2workspacePoint(canvasDimensions.width,0);
                viewbox.camera.points.bl = core.viewport.adapter.windowPoint2workspacePoint(0,canvasDimensions.height);
                viewbox.camera.points.br = core.viewport.adapter.windowPoint2workspacePoint(canvasDimensions.width,canvasDimensions.height);
        
            //calculate a bounding box for the viewport from these points
                viewbox.camera.boundingBox = workspace.library.math.boundingBoxFromPoints([viewbox.camera.points.tl, viewbox.camera.points.tr, viewbox.camera.points.br, viewbox.camera.points.bl]);
        }
        this.calculateViewportExtremities = calculateViewportExtremities;
        this.refresh = function(){
            this.calculateViewportExtremities();
        };
        this.getCanvasBoundingBox = function(){ return viewbox.canvas.boundingBox; };
        // this.getCameraBoundingBox = function(){ return viewbox.camera.boundingBox; };
};

core.viewport.refresh();