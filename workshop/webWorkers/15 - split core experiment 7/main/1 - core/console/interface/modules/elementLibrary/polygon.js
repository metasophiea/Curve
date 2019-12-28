this.polygon = function(_name){
    genericElementProxy.call(this,'polygon',_name);

    Object.entries({
        colour: {r:1,g:0,b:0,a:1},
        points: [], 
    }).forEach(([name,defaultValue]) => this.setupSimpleAttribute(name,defaultValue) );

    function XYArrayToPoints(XYArrray){
        return XYArrray.flatMap(i => [i.x,i.y]);
    }
    function pointsToXYArray(points){ 
        const output = [];
        for(let a = 0; a < points.length; a+=2){ output.push({x:points[a], y:points[a+1]}); }
        return output;
    }

    this.pointsAsXYArray = function(XYArrray){
        if(XYArrray == undefined){ return pointsToXYArray(this.points()); }
        this.points(XYArrayToPoints(XYArrray));
    };

    const __unifiedAttribute = this.unifiedAttribute;
    this.unifiedAttribute = function(attributes){
        __unifiedAttribute(attributes);
        if(attributes.points != undefined){
            attributes.pointsAsXYArray = pointsToXYArray(attributes.points);
            return attributes;
        }
        if(attributes.pointsAsXYArray != undefined){
            attributes.points = XYArrayToPoints(attributes.pointsAsXYArray);
            return attributes;
        }
    };
};