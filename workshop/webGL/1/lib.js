var workspace = {library:{math:{}}};
workspace.library.math.cartesianAngleAdjust = function(x,y,angle){
    function cartesian2polar(x,y){
        var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;
    
        if(x === 0){
            if(y === 0){ang = 0;}
            else if(y > 0){ang = 0.5*Math.PI;}
            else{ang = 1.5*Math.PI;}
        }
        else if(y === 0){
            if(x >= 0){ang = 0;}else{ang = Math.PI;}
        }
        else if(x >= 0){ ang = Math.atan(y/x); }
        else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }
    
        return {'dis':dis,'ang':ang};
    };
    function polar2cartesian(angle,distance){
        return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
    };

    if(angle == 0 || angle%Math.PI*2 == 0){ return {x:x,y:y}; }
    var polar = cartesian2polar( x, y );
    polar.ang += angle;
    return polar2cartesian( polar.ang, polar.dis );
};
workspace.library.math.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
var GSLS_utilityFunctions = `
    #define PI 3.14159265358979323846

    vec2 cartesian2polar(vec2 xy){
        float dis = pow(pow(xy.x,2.0)+pow(xy.y,2.0),0.5);
        float ang = 0.0;

        if(xy.x == 0.0){
            if(xy.y == 0.0){ang = 0.0;}
            else if(xy.y > 0.0){ang = 0.5*PI;}
            else{ang = 1.5*PI;}
        }
        else if(xy.y == 0.0){
            if(xy.x >= 0.0){ang = 0.0;}else{ang = PI;}
        }
        else if(xy.x >= 0.0){ ang = atan(xy.y/xy.x); }
        else{ /*if(xy.x < 0.0)*/ ang = atan(xy.y/xy.x) + PI; }

        return vec2(ang,dis);
    }
    vec2 polar2cartesian(vec2 ad){
        return vec2( (ad.y*cos(ad.x)), (ad.y*sin(ad.x)) );
    }
    vec2 cartesianAngleAdjust(vec2 xy, float angle){
        if(angle == 0.0 || mod(angle,PI*2.0) == 0.0){ return xy; }

        vec2 polar = cartesian2polar( xy );
        polar.x += angle; //'x' in this case is 'ang'
        return polar2cartesian( polar.xy );
    }
`;