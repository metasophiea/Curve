parts.modifier.bestowMovement = function(grapple, target){
    grapple.movementTarget = target ? target : grapple;
    grapple.movementTarget.style.transform = grapple.movementTarget.style.transform ? grapple.movementTarget.style.transform : 'translate(0px,0px) scale(1) rotate(0rad)';

    grapple.onmousedown = function(event){
        __globals.svgElement.tempRef = this.movementTarget;
        __globals.svgElement.tempRef.setAttribute('oldPosition','['+__globals.utility.getTransform(__globals.svgElement.tempRef)+']');
        __globals.svgElement.tempRef.setAttribute('clickPosition','['+event.x +','+ event.y+']');

        __globals.svgElement.onmousemove = function(event){
            var position = JSON.parse(__globals.svgElement.tempRef.getAttribute('oldPosition'));
            var clickPosition = JSON.parse(__globals.svgElement.tempRef.getAttribute('clickPosition'));
            var globalScale = __globals.utility.getTransform(__globals.panes.global)[2];
            position[0] = (position[0]-(clickPosition[0]-event.x)/globalScale);
            position[1] = position[1]-(clickPosition[1]-event.y)/globalScale;
            __globals.utility.setTransform(__globals.svgElement.tempRef, position);

            if( __globals.svgElement.tempRef.movementRedraw ){ __globals.svgElement.tempRef.movementRedraw(); }
        };
    
        __globals.svgElement.onmouseup = function(){
            __globals.svgElement.tempRef.removeAttribute('oldPosition');
            __globals.svgElement.tempRef.removeAttribute('clickPosition');
            this.onmousemove = null;
            this.onmouseleave = null;
            this.tempRef = null;
            this.onmouseup = null;
        };
    
        __globals.svgElement.onmouseleave = __globals.svgElement.onmouseup;
    
        __globals.svgElement.onmousemove(event);
    };
};