const grapher = new function(){
    let canvas;
    let context;
    this.newCanvas = function(){
        canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        context = canvas.getContext('2d');
        document.body.append(canvas);
    };

    this.clear = function(){
        context.fillStyle = 'rgba(255,255,255,1)';
        context.fillRect(0,0,canvas.width,canvas.height);
    }
    this.drawLine = function(point_a,point_b,style,strokeWidth=1){
        context.strokeStyle = style;
        context.lineWidth = strokeWidth;
        context.beginPath();
        context.moveTo(point_a.x,point_a.y);
        context.lineTo(point_b.x,point_b.y);
        context.stroke();
        context.fill();
    }
    this.drawCircle = function(x,y,r,style,strokeStyle,strokeWidth=1){
        context.fillStyle = style;
        context.strokeStyle = strokeStyle;
        context.lineWidth = strokeWidth;
        context.beginPath();
        context.arc(x, y, r, 0, 2*Math.PI);
        context.fill();
        if(strokeStyle != undefined){context.stroke();}
    };
    this.drawPoly = function(poly,style,strokeStyle,strokeWidth=1){
        context.fillStyle = style;
        context.strokeStyle = strokeStyle;
        context.lineWidth = strokeWidth;
        context.beginPath();

        context.moveTo(poly[0].x,poly[0].y);
        for(let a = 1; a < poly.length; a++){
            context.lineTo(poly[a].x,poly[a].y);
        }

        context.closePath();
        context.fill();
        if(strokeStyle != undefined){context.stroke();}
    }
};