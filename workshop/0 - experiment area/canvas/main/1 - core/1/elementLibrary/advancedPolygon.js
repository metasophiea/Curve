this.advancedPolygon = {

    create:function(){
        var obj = new function(){
            this.type = 'advancedPolygon';

            this.name = '';
            this.ignored = false;
            this.static = false;
            this.parent = undefined;

            this.points = [];

            this.style = {
                fill:'rgba(100,255,255,1)',
                stroke:'rgba(0,0,0,0)',
                lineWidth:1,
                lineJoin:'round',
                miterLimit:2,
                shadowColour:'rgba(0,0,0,0)',
                shadowBlur:20,
                shadowOffset:{x:20, y:20},
            };
        };

        return obj;
    },

    computeExtremities:function(element,offset){},

    render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){  },

};