this.group = {

    create:function(){
        var obj = new function(){
            this.type = 'group';

            this.name = '';
            this.ignored = false;
            this.static = false;
            this.parent = undefined;
            this.dotFrame = false;

            this.x = 0;
            this.y = 0;
            this.angle = 0;
            this.children = [];

            this.prepend = function(element){
                //check that the element is valid
                    var temp = core.arrangement.checkElementIsValid(element, this.children);
                    if(temp != undefined){console.error('element invalid:',temp); return;}

                this.children.unshift(element);

                element.parent = this;
                
                elementLibrary[element.type].computeExtremities(element);
            };
            this.append = function(element){            
                //check that the element is valid
                    var temp = core.arrangement.checkElementIsValid(element, this.children);
                    if(temp != undefined){console.error('element invalid:',temp); return;}

                this.children.push(element);

                element.parent = this;
                
                elementLibrary[element.type].computeExtremities(element);

            };
            this.remove = function(element){
                if(element == undefined){return;}

                var index = this.children.indexOf(element);
                if(index < 0){return;}
                this.children.splice(index, 1);

                element.parent = undefined;
            };
            this.getChildByName = function(name){
                for(var a = 0; a < this.children.length; a++){
                    if( this.children[a].name == name ){return this.children[a];}
                }
            };
        };

        return obj;
    },

    computeExtremities:function(element,offset){
        //if this shape is to be ignored anyway, don't bother with any of this
            if(element.ignored){return;}

        //actual computation of extremities
            computeExtremities(
                offset == undefined,
                element,
                offset,
                function(element,offset){

                    element.extremities = {};
                    element.extremities.points = [{x:element.x+offset.x, y:element.y+offset.y}];
                    element.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( element.extremities.points );
                    for(var a = 0; a < element.children.length; a++){
                        var child = element.children[a];
                        elementLibrary[child.type].computeExtremities(child,offset);
                    }

                },
            );

        //perform dot frame render
            makeDotFrame(element);
    },

    render:function(context,element,offset={x:0,y:0,a:0,parentAngle:0},static=false){
        //adjust offset for parent's angle
            var point = canvas.library.math.cartesianAngleAdjust(element.x,element.y,offset.parentAngle);
            offset.x += point.x-element.x;
            offset.y += point.y-element.y;

        //cycle through all children
            for(var a = 0; a < element.children.length; a++){
                var item = element.children[a];

                elementLibrary[item.type].render(
                    context,
                    item,
                    {
                        a: offset.a + element.angle,
                        x: offset.x + element.x,
                        y: offset.y + element.y,
                        parentAngle: element.angle,
                    },
                    (static||item.static)
                );
            }

    },

};