use std::fmt;
use std::slice::Iter;
    
#[derive(PartialEq, Eq, Hash, Clone, Copy)]
pub enum ElementType {
    Group,
    Rectangle,
    RectangleWithOutline,
    Circle,
    CircleWithOutline,
    Polygon,
    PolygonWithOutline,
    Path,
    Image,
    Character,
    CharacterString,
}
impl ElementType {
    pub fn iterator() -> Iter<'static, ElementType> {
        [
            ElementType::Group,
            ElementType::Rectangle,
            ElementType::RectangleWithOutline,
            ElementType::Circle,
            ElementType::CircleWithOutline,
            ElementType::Polygon,
            ElementType::PolygonWithOutline,
            ElementType::Path,
            ElementType::Image,
            ElementType::Character,
            ElementType::CharacterString,
        ].iter()
    }
}
impl ElementType {
    pub fn from_str(type_string:&str) -> Option<ElementType> {
        match type_string {
            "Group" => Some(ElementType::Group),
            "Rectangle" => Some(ElementType::Rectangle),
            "RectangleWithOutline" => Some(ElementType::RectangleWithOutline),
            "Circle" => Some(ElementType::Circle),
            "CircleWithOutline" => Some(ElementType::CircleWithOutline),
            "Polygon" => Some(ElementType::Polygon),
            "PolygonWithOutline" => Some(ElementType::PolygonWithOutline),
            "Path" => Some(ElementType::Path),
            "Image" => Some(ElementType::Image),
            "Character" => Some(ElementType::Character),
            "CharacterString" => Some(ElementType::CharacterString),
            _ => None,
        }
    }

    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match self {
            ElementType::Group => write!(f, "Group"),
            ElementType::Rectangle => write!(f, "Rectangle"),
            ElementType::RectangleWithOutline => write!(f, "RectangleWithOutline"),
            ElementType::Circle => write!(f, "Circle"),
            ElementType::CircleWithOutline => write!(f, "CircleWithOutline"),
            ElementType::Polygon => write!(f, "Polygon"),
            ElementType::PolygonWithOutline => write!(f, "PolygonWithOutline"),
            ElementType::Path => write!(f, "Path"),
            ElementType::Image => write!(f, "Image"),
            ElementType::Character => write!(f, "Character"),
            ElementType::CharacterString => write!(f, "CharacterString"),
        }
    }
}
impl fmt::Display for ElementType {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for ElementType {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}