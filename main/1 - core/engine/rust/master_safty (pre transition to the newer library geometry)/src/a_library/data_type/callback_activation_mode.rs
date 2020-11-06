use std::fmt;
    
#[derive(PartialEq, Eq, Hash, Clone, Copy)]
pub enum CallbackActivationMode {
    TopMostOnly,
    FirstMatch,
    AllMatches,
}
impl CallbackActivationMode {
    pub fn from_str(type_string:&str) -> Option<CallbackActivationMode> {
        match type_string {
            "TopMostOnly" => Some(CallbackActivationMode::TopMostOnly,),
            "FirstMatch" => Some(CallbackActivationMode::FirstMatch,),
            "AllMatches" => Some(CallbackActivationMode::AllMatches),
            _ => None,
        }
    }

    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match *self {
            CallbackActivationMode::TopMostOnly => write!(f, "TopMostOnly"),
            CallbackActivationMode::FirstMatch => write!(f, "FirstMatch"),
            CallbackActivationMode::AllMatches => write!(f, "AllMatches"),
        }
    }
}
impl fmt::Display for CallbackActivationMode {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for CallbackActivationMode {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}