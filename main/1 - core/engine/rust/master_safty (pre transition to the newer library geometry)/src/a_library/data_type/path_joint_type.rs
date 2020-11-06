#![allow(non_camel_case_types)]

use std::fmt;
    
#[derive(PartialEq, Eq, Hash, Clone, Copy)]
pub enum PathJointType {
    none,
    flat,
    round,
    sharp,
}
impl PathJointType {
    pub fn from_str(type_string:&str) -> Option<PathJointType> {
        match type_string {
            "none" => Some(PathJointType::none), 
            "flat" => Some(PathJointType::flat),
            "round" => Some(PathJointType::round),
            "sharp" => Some(PathJointType::sharp),
            _ => None,
        }
    }
    pub fn from_optional_str(type_string:Option<&str>) -> Option<PathJointType> {
        match type_string {
            None => None,
            Some(type_string) => PathJointType::from_str(type_string)
        }
    }
    pub fn from_optional_string(type_string:Option<String>) -> Option<PathJointType> {
        match type_string {
            None => None,
            Some(type_string) => PathJointType::from_str(type_string.as_str())
        }
    }


    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match *self {
            PathJointType::none => write!(f, "none"),
            PathJointType::flat => write!(f, "flat"),
            PathJointType::round => write!(f, "round"),
            PathJointType::sharp => write!(f, "sharp"),
        }
    }
}
impl fmt::Display for PathJointType {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for PathJointType {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}