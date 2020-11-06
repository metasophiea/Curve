//rust
    use std::fmt;

//wasm

//core
    use crate::a_library::data_type::{
        Point,
        Line,
    };





#[derive(PartialEq)]
pub enum Direction {
    Left,
    Right,
}
impl Direction {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match *self {
            Direction::Left => write!(f,"Left"),
            Direction::Right => write!(f,"Right"),
        }
    }
}
impl fmt::Display for Direction {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for Direction {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}

#[derive(PartialEq)]
pub enum LineSide {
    Upon,
    AlignedButOff,
    Left,
    Right,
}
impl LineSide {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match *self {
            LineSide::Upon => write!(f,"Upon"),
            LineSide::AlignedButOff => write!(f,"AlignedButOff"),
            LineSide::Left => write!(f,"Left"),
            LineSide::Right => write!(f,"Right"),
        }
    }
}
impl fmt::Display for LineSide {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for LineSide {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}

#[derive(PartialEq)]
pub enum PolySide {
    Outside,
    OnPoint,
    OnEdge,
    Inside,
}
impl fmt::Display for PolySide {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
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
    pub contact: bool, //the two lines touch in some way
    pub intersect: bool, //the lines cross each other
    pub direction: Option<Direction>, //the side of the first line, that the second line is heading towards
}
impl LineIntersectionResult {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        let point = match self.point {
            Some(p) => p.to_string(),
            None => "-none-".to_string(),
        };
        let range = match self.range {
            Some(r) => r.to_string(),
            None => "-none-".to_string(),
        };

        write!(f,"{{point:{}, range:{}, contact:{}, intersect:{}, direction:{:?}}}", point, range, self.contact, self.intersect, self.direction)
    }
}
impl fmt::Display for LineIntersectionResult {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for LineIntersectionResult {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl PartialEq for LineIntersectionResult {
    fn eq(&self, other:&Self) -> bool {
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


        point && range && self.intersect == other.intersect && self.contact == other.contact && self.direction == other.direction
    }
}

pub struct LinePolygonIntersectionResult {
    pub points: Vec<Point>,
    pub contact: bool, //the line touches the polygon in some way
    pub intersect: bool, //some part of the body's of the line is over some part of the body of the polygon
    pub inverse_intersect: bool, //some part of the body's of the line is over some part of area around the polygon (not including the perimeter)
    pub traverse: bool, //the line crosses the polygon's perimeter
}
impl LinePolygonIntersectionResult {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        write!(f,"{{points:{:?}, contact:{}, intersect:{}, inverse_intersect:{}, traverse:{:?}}}", self.points, self.contact, self.intersect, self.inverse_intersect, self.traverse)
    }
}
impl fmt::Display for LinePolygonIntersectionResult {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for LinePolygonIntersectionResult {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl PartialEq for LinePolygonIntersectionResult {
    fn eq(&self, other:&Self) -> bool {
        if 
            self.points.len() != other.points.len() || 
            self.contact != other.contact ||
            self.intersect != other.intersect || 
            self.inverse_intersect != other.inverse_intersect || 
            self.traverse != other.traverse
        { 
            return false; 
        }

        let mut points = true;
        for index in 0..self.points.len() {
            points = points && (self.points[index] == other.points[index]);
        }
        points
    }
}

pub struct PolygonIntersectionResult {
    pub points: Vec<Point>,
    pub contact: bool, //the lines touch in some way
    pub intersect: bool, //the body's of both items cover at least some the same area (excluding being perfectly on the rim)
    pub traverse: bool, //the lines cross each other
    pub first_contains_second_without_contact: Option<bool>, // Some(false) / None / Some(true) // second contains first / neither / first contains second
}
impl PolygonIntersectionResult {
    pub fn new(points:Vec<Point>, contact:bool, intersect:bool, traverse:bool, first_contains_second_without_contact:Option<bool>) -> PolygonIntersectionResult {
        PolygonIntersectionResult {
            points: points,
            contact: contact,
            intersect: intersect,
            traverse: traverse,
            first_contains_second_without_contact: first_contains_second_without_contact,
        }
    }
}
impl fmt::Display for PolygonIntersectionResult {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        let mut points:String = String::new();
        for point in &self.points {
            if points.len() == 0 {
                points = format!("{}", point);
            } else {
                points = format!("{},{}", points, point);
            }
        }
        write!(f,"{{points:[{}], contact:{}, intersect:{}, traverse:{}, first_contains_second_without_contact:{:?}}}", points, self.contact, self.intersect, self.traverse, self.first_contains_second_without_contact)
    }
}
impl PartialEq for PolygonIntersectionResult {
    fn eq(&self, other:&Self) -> bool {
        if 
            self.points.len() != other.points.len() || 
            self.contact != other.contact ||
            self.intersect != other.intersect || 
            self.traverse != other.traverse
        { 
            return false; 
        }

        if self.first_contains_second_without_contact.is_none() ^ other.first_contains_second_without_contact.is_none() {
            return false;
        }

        if self.first_contains_second_without_contact.is_some() {
            if self.first_contains_second_without_contact.unwrap() ^ other.first_contains_second_without_contact.unwrap() {
                return true;
            }
        }

        let mut points = true;
        for index in 0..self.points.len() {
            points = points && (self.points[index] == other.points[index]);
        }
        points
    }
}