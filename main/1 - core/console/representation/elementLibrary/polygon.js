this.Polygon = function(_name){
    genericElement.call(this,'Polygon',_name);

    Object.entries({
        colour: {r:1,g:0,b:0,a:1},
        points: [], 
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );

    function XYArrayToPoints(XYArray){
        return XYArray.flatMap(i => [i.x,i.y]);
    }
    function pointsToXYArray(points){ 
        const output = [];
        for(let a = 0; a < points.length; a+=2){ output.push({x:points[a], y:points[a+1]}); }
        return output;
    }

    this.pointsAsXYArray = function(XYArray){
        if(XYArray == undefined){ return pointsToXYArray(this.points()); }
        this.points(XYArrayToPoints(XYArray));
    };

    const __unifiedAttribute = this.unifiedAttribute;
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return __unifiedAttribute(); }
        if(attributes.points != undefined){
            attributes.pointsAsXYArray = pointsToXYArray(attributes.points);
        }
        if(attributes.pointsAsXYArray != undefined){
            attributes.points = XYArrayToPoints(attributes.pointsAsXYArray);
        }
        __unifiedAttribute(attributes);
    };
};