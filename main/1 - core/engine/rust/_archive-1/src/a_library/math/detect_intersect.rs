//rust
    use std::fmt;

//wasm
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    extern "C" {
        // #[wasm_bindgen(js_namespace = console)]
        // fn log(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a: &str);
    }
    // macro_rules! console_log {
    //     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    // }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::data_type::{
        Point,
        Line,
        BoundingBox,
        Polygon,
    };







    
#[derive(PartialEq)]
pub enum PolySide {
    Outside,
    OnPoint,
    OnEdge,
    Inside,
}
impl fmt::Display for PolySide {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            PolySide::Outside => write!(f,"Outside"),
            PolySide::OnPoint => write!(f,"OnPoint"),
            PolySide::OnEdge => write!(f,"OnEdge"),
            PolySide::Inside => write!(f,"Inside"),
        }
    }
}

pub struct LineIntersectionResult {
    pub point: Option<Point>,
    pub range: Option<Line>,
    pub intersect: bool,
    pub contact: bool,
}
impl fmt::Display for LineIntersectionResult {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let point = match self.point {
            Some(p) => p.to_string(),
            None => "-none-".to_string(),
        };
        let range = match self.range {
            Some(r) => r.to_string(),
            None => "-none-".to_string(),
        };

        write!(f,"{{point:{}, range:{}, intersect:{}, contact:{}}}", point, range, self.intersect, self.contact)
    }
}
impl PartialEq for LineIntersectionResult {
    fn eq(&self, other: &Self) -> bool {
        let point = match self.point {
            Some(self_point) => {
                match other.point {
                    Some(other_point) => self_point == other_point,
                    None => false, 
                }
            },
            None => {
                other.point.is_none()
            },
        };
        let range = match self.range {
            Some(self_range) => {
                match other.range {
                    Some(other_range) => self_range == other_range,
                    None => false, 
                }
            },
            None => {
                other.range.is_none()
            },
        };


        point && range && self.intersect == other.intersect && self.contact == other.contact
    }
}

pub struct PolygonIntersectionResult {
    pub points: Vec<Point>,
    pub intersect: bool,
    pub contact: bool,
}
impl fmt::Display for PolygonIntersectionResult {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut points: String = String::new();
        for point in &self.points {
            if points.len() == 0 {
                points = format!("{}", point);
            } else {
                points = format!("{},{}", points, point);
            }
        }
        write!(f,"{{points:[{}], intersect:{}, contact:{}}}", points, self.intersect, self.contact)
    }
}
impl PartialEq for PolygonIntersectionResult {
    fn eq(&self, other: &Self) -> bool {
        if self.points.len() != other.points.len() || self.intersect != other.intersect || self.contact != other.contact { 
            return false; 
        }

        let mut points = true;
        for index in 0..self.points.len() {
            points = points && (self.points[index] == other.points[index]);
        }
        points
    }
}




pub fn bounding_boxes(box_a:&BoundingBox, box_b:&BoundingBox) -> bool {
    box_a.get_bottom_right().get_y() >= box_b.get_top_left().get_y() && 
    box_a.get_bottom_right().get_x() >= box_b.get_top_left().get_x() && 
    box_a.get_top_left().get_y() <= box_b.get_bottom_right().get_y() && 
    box_a.get_top_left().get_x() <= box_b.get_bottom_right().get_x()
}

pub fn point_within_bounding_box(point:&Point, b:&BoundingBox) -> bool {
    !(
        point.get_x() < b.get_top_left().get_x()     ||  point.get_y() < b.get_top_left().get_y()     ||
        point.get_x() > b.get_bottom_right().get_x() ||  point.get_y() > b.get_bottom_right().get_y()
    )
}
pub fn point_on_line(point:&Point, line:&Line) -> bool {
    if
        point.get_x() < line.get_point_a().get_x() && point.get_x() < line.get_point_b().get_x() ||
        point.get_y() < line.get_point_a().get_y() && point.get_y() < line.get_point_b().get_y() ||
        point.get_x() > line.get_point_a().get_x() && point.get_x() > line.get_point_b().get_x() ||
        point.get_y() > line.get_point_a().get_y() && point.get_y() > line.get_point_b().get_y()
    { return false; }

    if 
        ( point.get_x() == line.get_point_a().get_x() && point.get_y() == line.get_point_a().get_y() ) || 
        ( point.get_x() == line.get_point_b().get_x() && point.get_y() == line.get_point_b().get_y() )
    { return true; }

    if line.get_point_a().get_x() == line.get_point_b().get_x() && point.get_x() == line.get_point_a().get_x() {
        return (line.get_point_a().get_y() > point.get_y() && point.get_y() > line.get_point_b().get_y()) || (line.get_point_b().get_y() > point.get_y() && point.get_y() > line.get_point_a().get_y());
    }
    if line.get_point_a().get_y() == line.get_point_b().get_y() && point.get_y() == line.get_point_a().get_y() {
        return (line.get_point_a().get_x() > point.get_x() && point.get_x() > line.get_point_b().get_x()) || (line.get_point_b().get_x() > point.get_x() && point.get_x() > line.get_point_a().get_x());
    }

    return ((line.get_point_b().get_y() - line.get_point_a().get_y()) / (line.get_point_b().get_x() - line.get_point_a().get_x()))*(point.get_x() - line.get_point_a().get_x()) + line.get_point_a().get_y() - point.get_y() == 0.0;
}
pub fn point_within_poly(point:&Point, poly:&Polygon) -> PolySide {
    if !bounding_boxes( &BoundingBox::new_from_points(&[*point]), poly.get_bounding_box() ) { 
        return PolySide::Outside; 
    }

    let point_x = point.get_x();
    let point_y = point.get_y();

    //check if the point is on a point of the poly; bail and return 'onPoint'
    for poly_point in poly.get_points() {
        if point_x == poly_point.get_x() && point_y == poly_point.get_y() {
            return PolySide::OnPoint;
        }
    }
    
    fn point_level_with_poly_point_checker(poly:&Polygon,point:&Point,index_a:usize,index_b:usize) -> bool {
        //only flip, if the point is not perfectly level with point a of the line 
        //or if you can prove that the a's two adjacent points are higher and lower than the matching point's level
        //(the system will come round to having this same point be point b)
        if poly.get_point(index_a).get_y() != point.get_y() && poly.get_point(index_b).get_y() != point.get_y() {
            return true;
        } else if poly.get_point(index_a).get_y() == point.get_y() {
            //point is perfectly level with a point on the poly (line point a)
            let point_in_front = if (index_a as isize) + 1 >= (poly.get_points_length() as isize) { 0 } else { index_a + 1 };
            let point_behind = if (index_a as isize) - 1 <= 0 { poly.get_points_length()-1 } else { index_a - 1 };
            if
                poly.get_point(point_behind).get_y() <= poly.get_point(index_a).get_y() && poly.get_point(point_in_front).get_y() <= poly.get_point(index_a).get_y() ||
                poly.get_point(point_behind).get_y() >= poly.get_point(index_a).get_y() && poly.get_point(point_in_front).get_y() >= poly.get_point(index_a).get_y()
            {
                //all above or all below; no need for a flip
            }else{
                //crossing frond; time for a flip
                return true;
            }
        }
        return false;
    }

    //Ray casting algorithm
    let mut inside:bool = false;
    let mut index_b = poly.get_points_length() - 1;
    for (index_a,_) in poly.get_points().iter().enumerate() {
        let poly_a_x = poly.get_point(index_a).get_x();
        let poly_a_y = poly.get_point(index_a).get_y();
        let poly_b_x = poly.get_point(index_b).get_x();
        let poly_b_y = poly.get_point(index_b).get_y();

        //point must be on the same level of the line
        if 
            ( poly_b_y >= point_y && poly_a_y <= point_y ) ||
            ( poly_a_y >= point_y && poly_b_y <= point_y ) 
        {
            //discover if the point is on the far right of the line
            if poly_a_x < point_x && poly_b_x < point_x {
                //point is on far right of line
                //only flip if the line is not perfectly level (which would make the ray skirt the line)
                if poly_a_y != poly_b_y {
                    if point_level_with_poly_point_checker(&poly,&point,index_a,index_b) {
                        inside = !inside;
                    }
                }

            //discover if the point is on the far left of the line, skip it if so
            } else if poly_a_x > point_x && poly_b_x > point_x {
                index_b = index_a;
                continue;
            }else{
                //calculate what side of the line this point is
                    let area_location:Option<f32> = if poly_b_y > poly_a_y && poly_b_x > poly_a_x {
                        Some( (point_x-poly_a_x)/(poly_b_x-poly_a_x) - (point_y-poly_a_y)/(poly_b_y-poly_a_y) + 1.0 )
                    } else if poly_b_y <= poly_a_y && poly_b_x <= poly_a_x {
                        Some( (point_x-poly_b_x)/(poly_a_x-poly_b_x) - (point_y-poly_b_y)/(poly_a_y-poly_b_y) + 1.0 )
                    } else if poly_b_y > poly_a_y && poly_b_x < poly_a_x {
                        Some( (point_x-poly_b_x)/(poly_a_x-poly_b_x) + (point_y-poly_a_y)/(poly_b_y-poly_a_y) )
                    } else if poly_b_y <= poly_a_y && poly_b_x >= poly_a_x {
                        Some( (point_x-poly_a_x)/(poly_b_x-poly_a_x) + (point_y-poly_b_y)/(poly_a_y-poly_b_y) )
                    } else {
                        None
                    };

                //if its on the line, return 'onEdge' immediately, if it's above 1 do a flip
                    if area_location.is_none() || area_location.unwrap().is_nan() || area_location.unwrap() == 1.0 {
                        return PolySide::OnEdge;
                    }else if area_location.unwrap() > 1.0 {
                        if point_level_with_poly_point_checker(&poly,&point,index_a,index_b) {
                            inside = !inside;
                        }
                    }
            }
        } else {
            //point is not on the same level as the line
        }
        index_b = index_a;
    }

    if inside { 
        PolySide::Inside 
    } else { 
        PolySide::Outside 
    }
}

pub fn line_on_line(segment1:&Line, segment2:&Line) -> LineIntersectionResult {
    if !bounding_boxes( &segment1.get_bounding_box(), &segment2.get_bounding_box() ) {
        return LineIntersectionResult { point:None, range:None, intersect:false, contact:false };
    }

    let segment1_a_x = segment1.get_point_a().get_x();
    let segment1_a_y = segment1.get_point_a().get_y();
    let segment1_b_x = segment1.get_point_b().get_x();
    let segment1_b_y = segment1.get_point_b().get_y();
    let segment2_a_x = segment2.get_point_a().get_x();
    let segment2_a_y = segment2.get_point_a().get_y();
    let segment2_b_x = segment2.get_point_b().get_x();
    let segment2_b_y = segment2.get_point_b().get_y();

    //identical segments
    if 
        (
            ( segment1_a_x == segment2_a_x && segment1_a_y == segment2_a_y ) && ( segment1_b_x == segment2_b_x && segment1_b_y == segment2_b_y )
        ) || (
            ( segment1_a_x == segment2_b_x && segment1_a_y == segment2_b_y ) && (  segment1_b_x == segment2_a_x && segment1_b_y == segment2_a_y )
        )
    {
        return LineIntersectionResult { point:None, range:None, intersect:false, contact:true };
    }

    //point on point
    if ( segment1_a_x == segment2_a_x &&  segment1_a_y == segment2_a_y ) || ( segment1_a_x == segment2_b_x && segment1_a_y == segment2_b_y ) {
        return LineIntersectionResult {
            point:Some( Point::new( segment1_a_x, segment1_a_y ) ),
            range:None,
            intersect:false,
            contact:true
        };
    }
    if ( segment1_b_x == segment2_a_x && segment1_b_y == segment2_a_y ) || ( segment1_b_x == segment2_b_x && segment1_b_y == segment2_b_y ) {
        return LineIntersectionResult {
            point:Some( Point::new( segment1_b_x, segment1_b_y ) ),
            range:None, 
            intersect:false,
            contact:true
        };
    }

    //line overlap
    let denominator = ( ( segment2_b_y-segment2_a_y ) * ( segment1_b_x-segment1_a_x ) ) - ( ( segment2_b_x-segment2_a_x ) * ( segment1_b_y-segment1_a_y ) );
    if denominator == 0.0 {
        let mut x1:Option<f32> = None;
        let mut y1:Option<f32> = None;

        if point_on_line(&segment1.get_point_a(),&segment2) {
            x1 = Some(segment1_a_x);
            y1 = Some(segment1_a_y);
        }

        if point_on_line(&segment1.get_point_b(),&segment2) {
            if x1.is_none() {
                x1 = Some(segment1_b_x);
                y1 = Some(segment1_b_y);
            } else {
                let x2 = Some(segment1_b_x);
                let y2 = Some(segment1_b_y);
                return LineIntersectionResult {
                    point:None,
                    range: Some(Line::new_from_values(x1.unwrap(),y1.unwrap(),x2.unwrap(),y2.unwrap())),
                    intersect:false,
                    contact:true
                };
            }
        }
        
        if point_on_line(&segment2.get_point_a(),&segment1) {
            if x1.is_none() {
                x1 = Some(segment2_a_x);
                y1 = Some(segment2_a_y);
            } else {
                let x2 = Some(segment2_a_x);
                let y2 = Some(segment2_a_y);
                return LineIntersectionResult {
                    point:None,
                    range: Some(Line::new_from_values(x1.unwrap(),y1.unwrap(),x2.unwrap(),y2.unwrap())),
                    intersect:false,
                    contact:true
                };
            }
        }
        if point_on_line(&segment2.get_point_b(),&segment1) {
            if x1.is_none() {
                // x1 = Some(segment2_b_x);
                // y1 = Some(segment2_b_y); //why assign, if the values aren't used anyway
            } else {
                let x2 = Some(segment2_b_x);
                let y2 = Some(segment2_b_y);
                return LineIntersectionResult {
                    point:None,
                    range: Some(Line::new_from_values(x1.unwrap(),y1.unwrap(),x2.unwrap(),y2.unwrap())),
                    intersect:false,
                    contact:true
                };
            }
        }

        return LineIntersectionResult {point:None, range:None, intersect:false, contact:true};
    }
        
    //point on line
    if point_on_line(&segment1.get_point_a(),&segment2) { 
        return LineIntersectionResult {point:Some(*segment1.get_point_a()), range:None, intersect:false, contact:true};
    }
    if point_on_line(&segment1.get_point_b(),&segment2) { 
        return LineIntersectionResult {point:Some(*segment1.get_point_b()), range:None, intersect:false, contact:true};
    }
    if point_on_line(&segment2.get_point_a(),&segment1) { 
        return LineIntersectionResult {point:Some(*segment2.get_point_a()), range:None, intersect:false, contact:true};
    }
    if point_on_line(&segment2.get_point_b(),&segment1) { 
        return LineIntersectionResult {point:Some(*segment2.get_point_b()), range:None, intersect:false, contact:true};
    }

    //overwise...
    let u1 = ( ( (segment2_b_x-segment2_a_x) * (segment1_a_y-segment2_a_y) ) - ( (segment2_b_y-segment2_a_y) * (segment1_a_x-segment2_a_x) ) )/denominator;
    let u2 = ( ( (segment1_b_x-segment1_a_x) * (segment1_a_y-segment2_a_y) ) - ( (segment1_b_y-segment1_a_y) * (segment1_a_x-segment2_a_x) ) )/denominator;
    let intersect = (u1 >= 0.0 && u1 <= 1.0) && (u2 >= 0.0 && u2 <= 1.0);
    LineIntersectionResult {
        point:Some(Point::new(
            segment1_a_x + u1*(segment1_b_x-segment1_a_x),
            segment1_a_y + u1*(segment1_b_y-segment1_a_y),
        )), 
        range:None, 
        intersect:intersect, 
        contact:intersect
    }
}
pub fn line_on_poly(line:&Line, poly:&Polygon) -> PolygonIntersectionResult {
    if !bounding_boxes( &line.get_bounding_box(), &poly.get_bounding_box() ) {
        return PolygonIntersectionResult { points:vec![], intersect:false, contact:false };
    }

    fn one_while_the_other_is(val_1:&PolySide,val_2:&PolySide,a:&PolySide,b:&PolySide) -> u8 {
        if val_1 == a && val_2 == b { return 1; }
        if val_2 == a && val_1 == b { return 2; }
        return 0;
    }
    fn hunt_for_intersection(line:&Line,poly:&Polygon) -> PolygonIntersectionResult {
        let mut output = PolygonIntersectionResult { points:vec![], contact:false, intersect:false };

        let poly_points = poly.get_points();
        let mut index_b = poly_points.len()-1;
        for (index_a,_) in poly_points.iter().enumerate() {
            let result = line_on_line(&line,&Line::new_from_points(poly_points[index_a],poly_points[index_b]));

            if result.contact {
                output.contact = true;
                if result.intersect { output.intersect = true; }

                if result.point.is_some() {
                    if result.point.unwrap().get_x() != line.get_point_a().get_x() && result.point.unwrap().get_x() != line.get_point_b().get_x() {
                        output.intersect = true;
                    }
                }

                //if the result is a range of values, add the ends of this range
                    if let Some(range) = result.range {
                        let mut add_a = true;
                        let mut add_b = true;
                        for point in output.points.iter() {
                            if add_a && ( range.get_point_a().get_x() == point.get_x() && range.get_point_a().get_y() == point.get_y() ) {
                                add_a = false;
                            }
                            if add_b && ( range.get_point_b().get_x() == point.get_x() && range.get_point_b().get_y() == point.get_y() ) {
                                add_b = false;
                            }
                            if !add_a && !add_b {
                                break;
                            }
                        }
                        if add_a { output.points.push(*range.get_point_a()); }
                        if add_b { output.points.push(*range.get_point_b()); }
                        break;
                    }

                //if the result is a point, add the point
                    if let Some(r_point) = result.point {
                        let mut add = true;
                        for point in output.points.iter() {
                            if r_point.get_x() == point.get_x() && r_point.get_y() == point.get_y() {
                                add = false;
                                break;
                            }
                        }
                        if add { output.points.push(r_point); }
                    }
            }

            index_b = index_a;
        }

        //situation where the line passes perfectly through a point on the poly
        if output.points.len() == 0 {
            for point in poly.get_points().iter() {
                if 
                    point.get_x() != line.get_point_a().get_x() && 
                    point.get_y() != line.get_point_a().get_y() && 
                    point.get_x() != line.get_point_b().get_x() && 
                    point.get_y() != line.get_point_b().get_y()
                {
                    if point_on_line(point, line) {
                        output.points.push( *point );
                        output.intersect = true;
                    }
                }
            }
        }

        output
    }

    let point_a = point_within_poly(&line.get_point_a(),&poly);
    let point_b = point_within_poly(&line.get_point_b(),&poly);

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::Outside,&PolySide::Outside);
    if dir != 0 {
        return hunt_for_intersection(&line,&poly);
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::Outside,&PolySide::OnPoint);
    if dir != 0 {
        let mut output = hunt_for_intersection(&line,&poly);
        output.contact = true;
        return output;
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::Outside,&PolySide::OnEdge);
    if dir != 0 {
        let mut output = hunt_for_intersection(&line,&poly);
        output.contact = true;
        return output;
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::Outside,&PolySide::Inside);
    if dir != 0 {
        let mut output = hunt_for_intersection(&line,&poly);
        output.intersect = true;
        output.contact = true;
        return output;
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::OnPoint,&PolySide::OnPoint);
    if dir != 0 {
        return PolygonIntersectionResult {
            points: vec![ *line.get_point_a(), *line.get_point_b() ], 
            contact: true, 
            intersect: point_within_poly(
                &Point::new(
                    (line.get_point_a().get_x()+line.get_point_b().get_x())/2.0,
                    (line.get_point_a().get_y()+line.get_point_b().get_y())/2.0
                ),
                &poly
            ) == PolySide::Inside, 
        };
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::OnPoint,&PolySide::OnEdge);
    if dir != 0 {
        return PolygonIntersectionResult {
            points: vec![ *line.get_point_a(), *line.get_point_b() ], 
            intersect: true, 
            contact: point_within_poly(
                &Point::new(
                    (line.get_point_a().get_x()+line.get_point_b().get_x())/2.0,
                    (line.get_point_a().get_y()+line.get_point_b().get_y())/2.0
                ),
                &poly
            ) == PolySide::Inside, 
        };
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::OnPoint,&PolySide::Inside);
    if dir != 0 {
        let mut output = PolygonIntersectionResult { points:vec![], intersect:false, contact:false };
        if dir == 1 {
            output.points.push(*line.get_point_b());
        } else {
            output.points.push(*line.get_point_a());
        }
        output.contact = true;
        output.intersect = true;
        return output;
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::OnEdge,&PolySide::OnEdge);
    if dir != 0 {
        return PolygonIntersectionResult {
            points: vec![ *line.get_point_a(), *line.get_point_b() ], 
            intersect: true, 
            contact: point_within_poly(
                &Point::new(
                    (line.get_point_a().get_x()+line.get_point_b().get_x())/2.0,
                    (line.get_point_a().get_y()+line.get_point_b().get_y())/2.0
                ),
                &poly
            ) == PolySide::Inside, 
        };
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::OnEdge,&PolySide::Inside);
    if dir != 0 {
        let mut output = PolygonIntersectionResult { points:vec![], intersect:false, contact:false };
        if dir == 1 {
            output.points.push(*line.get_point_b());
        } else {
            output.points.push(*line.get_point_a());
        }
        output.contact = true;
        output.intersect = true;
        return output;
    }

    let dir = one_while_the_other_is(&point_a,&point_b,&PolySide::Inside,&PolySide::Inside);
    if dir != 0 {
        return PolygonIntersectionResult { points:vec![], intersect:true, contact:false };
    }


    console_warn!("unreachable code, reached? detect_intersect::line_on_poly");
    PolygonIntersectionResult { points:vec![], intersect:false, contact:false } //should be unreachable
}

pub fn poly_on_poly(poly_a:&Polygon,poly_b:&Polygon) -> PolygonIntersectionResult {
    //clearly different polygons
    if !bounding_boxes( poly_a.get_bounding_box(), poly_b.get_bounding_box() ) {
        return PolygonIntersectionResult { points:vec![], intersect:false, contact:false };
    }

    //identical polygons
    if poly_a == poly_b {
        return PolygonIntersectionResult {
            points: poly_a.get_points().to_vec(),
            contact: true,
            intersect: true,
        };
    }

    let mut results = PolygonIntersectionResult {
        points:vec![],
        contact:false,
        intersect:false,
    };

    //find all side intersection points
        let mut a_a = poly_a.get_points_length() - 1;
        for a_b in 0..poly_a.get_points_length() {
            let tmp = line_on_poly( &Line::new_from_points(*poly_a.get_point(a_a),*poly_a.get_point(a_b)), &poly_b );

            for point in tmp.points {
                match results.points.iter().find( |&&x| x == point ) {
                    Some(_) => {},
                    None => results.points.push(point),
                }
            }

            results.contact = results.contact || tmp.contact;
            results.intersect = results.intersect || tmp.intersect;

            a_a = a_b;
        }


    //check if poly_a is totally inside poly_b (if necessary)
        for point in poly_b.get_points() {
            if results.intersect {break;}
            if point_within_poly(&point,&poly_a) != PolySide::Outside {   
                results.intersect = true;
            }
        }

    results
}