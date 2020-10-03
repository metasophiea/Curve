this.PolygonWithOutline = function(_name){
    genericElement.call(this,'PolygonWithOutline',_name);

    Object.entries({
        colour: {r:1,g:0,b:0,a:1},
        lineColour: {r:1,g:0,b:0,a:1},
        points: [],
        thickness: 0,
        jointDetail: 25,
        jointType: 'sharp',
        sharpLimit: 4,
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );

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