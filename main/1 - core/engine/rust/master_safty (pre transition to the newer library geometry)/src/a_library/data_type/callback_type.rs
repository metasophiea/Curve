#![allow(non_camel_case_types)]

use std::fmt;
    
#[derive(PartialEq, Eq, Hash, Clone, Copy)]
pub enum CallbackType {
    onmousedown, 
    onmouseup,
    onmousemove,
    onmouseenter,
    onmouseleave,
    onwheel,
    onclick,
    ondblclick,

    onmouseenterelement, 
    onmouseleaveelement,

    onkeydown, 
    onkeyup,

    onadd,
    onremove,
    onshift,
}
impl CallbackType {
    pub fn from_str(type_string:&str) -> Option<CallbackType> {
        match type_string {
            "onmousedown" => Some(CallbackType::onmousedown), 
            "onmouseup" => Some(CallbackType::onmouseup),
            "onmousemove" => Some(CallbackType::onmousemove),
            "onmouseenter" => Some(CallbackType::onmouseenter),
            "onmouseleave" => Some(CallbackType::onmouseleave),
            "onwheel" => Some(CallbackType::onwheel),
            "onclick" => Some(CallbackType::onclick),
            "ondblclick" => Some(CallbackType::ondblclick),
        
            "onmouseenterelement" => Some(CallbackType::onmouseenterelement), 
            "onmouseleaveelement" => Some(CallbackType::onmouseleaveelement),
        
            "onkeydown" => Some(CallbackType::onkeydown), 
            "onkeyup" => Some(CallbackType::onkeyup),
        
            "onadd" => Some(CallbackType::onadd), 
            "onremove" => Some(CallbackType::onremove),
            "onshift" => Some(CallbackType::onshift),

            _ => None,
        }
    }

    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match *self {
            CallbackType::onmousedown => write!(f, "onmousedown"),
            CallbackType::onmouseup => write!(f, "onmouseup"),
            CallbackType::onmousemove => write!(f, "onmousemove"),
            CallbackType::onmouseenter => write!(f, "onmouseenter"),
            CallbackType::onmouseleave => write!(f, "onmouseleave"),
            CallbackType::onwheel => write!(f, "onwheel"),
            CallbackType::onclick => write!(f, "onclick"),
            CallbackType::ondblclick => write!(f, "ondblclick"),

            CallbackType::onmouseenterelement => write!(f, "onmouseenterelement"),
            CallbackType::onmouseleaveelement => write!(f, "onmouseleaveelement"),

            CallbackType::onkeydown => write!(f, "onkeydown"),
            CallbackType::onkeyup => write!(f, "onkeyup"),

            CallbackType::onadd => write!(f, "onadd"),
            CallbackType::onremove => write!(f, "onremove"),
            CallbackType::onshift => write!(f, "onshift"),
        }
    }
}
impl fmt::Display for CallbackType {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for CallbackType {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}