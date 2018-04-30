this.cable = function(
    id=null, 
    x1=0, y1=0, x2=0, y2=0,
    style='fill:none; stroke:rgb(255,0,0); stroke-width:4;',
    activeStyle='fill:none; stroke:rgb(255,100,100); stroke-width:4;'
){
    //elements
    var object = parts.basic.g(id, x1, y1)
        object.points = [{x:x1,y:y1},{x:x2,y:y2}];
        object.styles = {
            'normal':style,
            'active':activeStyle
        };
    var line = parts.basic.path(null, path=object.points, 'L', style);
        object.appendChild(line);


    //methods
    object.activate = function(){ line.style = this.styles.active; };
    object.disactivate = function(){ line.style = this.styles.normal; };
    object.draw = function(x1, y1, x2, y2){
        this.points = [{x:x1,y:y1},{x:x2,y:y2}];
        line.path(this.points);
    };
    object.redraw = function(x1=null,y1=null,x2=null,y2=null){
        x1 = (x1!=null ? x1 : this.x1); y1 = (y1 ? y1 : this.y1);
        x2 = (x2!=null ? x2 : this.x2); y2 = (y2 ? y2 : this.y2);
        this.draw(x1, y1, x2, y2);
    };


    return object;
};