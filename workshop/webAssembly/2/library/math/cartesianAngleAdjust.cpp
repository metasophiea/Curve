#include <cmath>

extern "C"{
    double* cartesianAngleAdjust(double x,double y, double angle);
}

void cartesian2polar(double x, double y, double* result){
    double dis = pow(x*x+y*y,0.5);
    double ang = 0;

    if(x == 0){
        if(y == 0){ang = 0;}
        else if(y > 0){ang = 0.5*M_PI;}
        else{ang = 1.5*M_PI;}
    }else if(y == 0){
        if(x >= 0){ang = 0;}else{ang = M_PI;}
    }
    else if(x >= 0){ ang = atan(y/x); }
    else{ /*if(x < 0)*/ ang = atan(y/x) + M_PI; }

    result[0] = dis;
    result[1] = ang;
}
void polar2cartesian(double distance, double angle, double* result){
    result[0] = distance*cos(angle);
    result[1] = distance*sin(angle);    
}


double* cartesianAngleAdjust(double x, double y, double angle){
    static double result[2] = { x, y };
    
    if(angle == 0 || fmod(angle,(M_PI*2)) == 0){ return result; }
    cartesian2polar( x, y, result );
    result[1] += angle;
    polar2cartesian( result[0], result[1], result );

    return result;
}
