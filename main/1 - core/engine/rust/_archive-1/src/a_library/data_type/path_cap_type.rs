#![allow(non_camel_case_types)]

use std::fmt;
    
#[derive(PartialEq, Eq, Hash, Clone, Copy)]
pub enum PathCapType {
    none,
    round,
}
impl PathCapType {
    pub fn from_str(type_string:&str) -> Option<PathCapType> {
        match type_string {
            "none" => Some(PathCapType::none), 
            "round" => Some(PathCapType::round),
            _ => None,
        }
    }
    pub fn from_optional_str(type_string:Option<&str>) -> Option<PathCapType> {
        match type_string {
            None => None,
            Some(type_string) => PathCapType::from_str(type_string)
        }
    }
    pub fn from_optional_string(type_string:Option<String>) -> Option<PathCapType> {
        match type_string {
            None => None,
            Some(type_string) => PathCapType::from_str(type_string.as_str())
        }
    }

    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            PathCapType::none => write!(f, "none"),
            PathCapType::round => write!(f, "round"),
        }
    }
}
impl fmt::Display for PathCapType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for PathCapType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}