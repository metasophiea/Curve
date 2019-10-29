this.geometry = `
    #define PI 3.141592653589793

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
        return vec2( ad[1]*cos(ad[0]), ad[1]*sin(ad[0]) );
    }
    vec2 cartesianAngleAdjust(vec2 xy, float angle){
        // //v1
        // if(angle == 0.0 || mod(angle,PI*2.0) == 0.0){ return xy; }
        //
        // vec2 polar = cartesian2polar( xy );
        // polar[0] += angle;
        // return polar2cartesian( polar );

        //v2
        if(angle == 0.0 || mod(angle,PI*2.0) == 0.0){ return xy; }
        return vec2( xy.x*cos(angle) - xy.y*sin(angle), xy.y*cos(angle) + xy.x*sin(angle) ); 
    }
`;