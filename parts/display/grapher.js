this.grapher = function(
    id='grapher',
    x, y, width, height,
    middlegroundStyle='stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;',
    backgroundStyle='stroke:rgba(0,100,0,1); stroke-width:0.25;',
    backgroundTextStyle='fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
    backingStyle = 'fill:rgba(50,50,50,1)',
){
    //elements
    var object = parts.basic.g(id, x, y);
        object._data = {};
        object._data.width = width,
        object._data.height = height,
        object._data.viewbox = {'l':-1,'h':1};
        object._data.horizontalMarkings = [0.75,0.5,0.25,0,-0.25,-0.5,-0.75];
        object._data.verticalMarkings = [0.75,0.5,0.25,0,-0.25,-0.5,-0.75];
        object._data.styles = {
            'middleground':middlegroundStyle, 
            'background':backgroundStyle, 
            'backgroundText':backgroundTextStyle,
            'backing':backingStyle
        };

    var rect = parts.basic.rect(null, 0, 0, width, height, 0, backingStyle);
        object.appendChild(rect);
    var background = parts.basic.g('background', 0, 0);
        object.appendChild(background);
    var middleground = parts.basic.g('middleground', 0, 0);
        object.appendChild(middleground);


    //internal methods
    object._pointConverter = function(realHeight, viewbox, y){
        var viewboxDistance = Math.abs( viewbox.h - viewbox.l );
        var y_graphingDistance = realHeight * (-(viewbox.l + y )/viewboxDistance)
        return y_graphingDistance;
    };
    object._lineCorrecter = function(points, maxheight){
        if( points.y1 < 0 && points.y2 < 0 ){ return; }
        if( points.y1 > maxheight && points.y2 > maxheight ){ return; }

        var slope = (points.y2 - points.y1)/(points.x2 - points.x1);

        if( points.y1 < 0 ){ points.x1 = (0 - points.y1 + slope*points.x1)/slope; points.y1 = 0; }
        else if( points.y2 < 0 ){ points.x2 = (0 - points.y2 + slope*points.x2)/slope; points.y2 = 0; }
        if( points.y1 > maxheight ){ points.x1 = (maxheight - points.y1 + slope*points.x1)/slope; points.y1 = maxheight; }
        else if( points.y2 > maxheight ){ points.x2 = (maxheight - points.y2 + slope*points.x2)/slope; points.y2 = maxheight; }

        return points;
    };
    object._test = function(){
        this.horizontalMarkings([0.75,0.5,0.25,0,-0.25,-0.5,-0.75,1,1.25,1.5,1.75,-1.75]);
        this.verticalMarkings([0,1,2,3,4,5,6,7,8,9,10]);
        this.viewbox({'l':-2,'h':2});
        this.drawBackground();
        this.draw([-2,1,-1,2]);
    };
    

    //methods
    object.viewbox = function(a){
        if(a==null){return object._data.viewbox;}
        object._data.viewbox = a;
    };
    object.horizontalMarkings = function(a){
        if(a==null){return object._data.horizontalMarkings;}
        object._data.horizontalMarkings = a;
    };
    object.verticalMarkings = function(a){
        if(a==null){return object._data.verticalMarkings;}
        object._data.verticalMarkings = a;
    };
    object.drawBackground = function(){
        this.children['background'].innerHTML = '';

        //horizontal lines
        for(var a = 0; a < this._data.horizontalMarkings.length; a++){
            this.children['background'].append(
                parts.basic.line(
                    null,
                    0,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a] ),
                    this._data.width,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a] ),
                    this._data.styles.background
                )
            );
            this.children['background'].append(
                parts.basic.text(
                    null,
                    0.5,
                    this._pointConverter(this._data.height, this._data.viewbox, this._data.horizontalMarkings[a]-0.075 ),
                    this._data.horizontalMarkings[a],
                    0,
                    this._data.styles.backgroundText,
                    0.1
                )
            );
        }

        //vertical lines
        for(var a = 0; a < this._data.verticalMarkings.length; a++){
            this.children['background'].append(
                parts.basic.line(
                    null,
                    a*(this._data.width/this._data.verticalMarkings.length),
                    0,
                    a*(this._data.width/this._data.verticalMarkings.length),
                    this._data.height,
                    this._data.styles.background
                )
            );
            this.children['background'].append(
                parts.basic.text(
                    null,
                    a*(this._data.width/this._data.verticalMarkings.length) + 0.5,
                    this._pointConverter(this._data.height, this._data.viewbox, -0.075),
                    this._data.verticalMarkings[a],
                    0,
                    this._data.styles.backgroundText,
                    0.1
                )
            );
        }

        //(the vertical line on the right)
        this.children['background'].append( parts.basic.line( null, this._data.width, 0, this._data.width, this._data.height, this._data.styles.background ) );
    };
    object.draw = function(Y, X=null){
        this.children['middleground'].innerHTML = '';

        for(var a = 0; a < Y.length-1; a++){
            var points = this._lineCorrecter({
                'x1': (a+0)*(this._data.width/(Y.length-1)),
                'x2': (a+1)*(this._data.width/(Y.length-1)),
                'y1': this._pointConverter(this._data.height, this._data.viewbox, Y[a+0]),
                'y2': this._pointConverter(this._data.height, this._data.viewbox, Y[a+1])
            }, this._data.height);

            if(points){
                this.children['middleground'].append(
                    parts.basic.line(
                        null,
                        points.x1, points.y1,
                        points.x2, points.y2,
                        this._data.styles.middleground
                    )
                );
            }
        }
    };


    return object;
};