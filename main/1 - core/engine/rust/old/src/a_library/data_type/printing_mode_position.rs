use std::fmt;

#[derive(PartialEq, Eq, Hash, Clone, Copy)]
pub enum PrintingModePositionHorizontal {
    Left, 
    Middle, 
    Right, 
}
impl PrintingModePositionHorizontal {
    pub fn from_str(type_string:&str) -> Option<PrintingModePositionHorizontal> {
        match type_string {
            "Left" | "left" => Some(PrintingModePositionHorizontal::Left),
            "Middle" | "middle" => Some(PrintingModePositionHorizontal::Middle),
            "Right" | "right" => Some(PrintingModePositionHorizontal::Right),
            _ => None,
        }
    }

    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match *self {
            PrintingModePositionHorizontal::Left => write!(f, "Left"),
            PrintingModePositionHorizontal::Middle => write!(f, "Middle"),
            PrintingModePositionHorizontal::Right => write!(f, "Right"),
        }
    }
}
impl fmt::Display for PrintingModePositionHorizontal {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for PrintingModePositionHorizontal {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}

#[derive(PartialEq, Eq, Hash, Clone, Copy)]
pub enum PrintingModePositionVertical {
    Top, 
    Middle, 
    VeryMiddle,
    Bottom
}
impl PrintingModePositionVertical {
    pub fn from_str(type_string:&str) -> Option<PrintingModePositionVertical> {
        match type_string {
            "Top" | "top" => Some(PrintingModePositionVertical::Top),
            "Middle" | "middle" => Some(PrintingModePositionVertical::Middle),
            "VeryMiddle" | "veryMiddle" => Some(PrintingModePositionVertical::VeryMiddle),
            "Bottom" | "bottom" => Some(PrintingModePositionVertical::Bottom),
            _ => None,
        }
    }

    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match *self {
            PrintingModePositionVertical::Top => write!(f, "Top"),
            PrintingModePositionVertical::Middle => write!(f, "Middle"),
            PrintingModePositionVertical::VeryMiddle => write!(f, "VeryMiddle"),
            PrintingModePositionVertical::Bottom => write!(f, "Bottom"),
        }
    }
}
impl fmt::Display for PrintingModePositionVertical {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for PrintingModePositionVertical {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}

#[derive(PartialEq, Eq, Hash, Clone, Copy)]
pub enum PrintingModeWidthCalculation {
    Filling,
    Absolute,
}
impl PrintingModeWidthCalculation {
    pub fn from_str(type_string:&str) -> Option<PrintingModeWidthCalculation> {
        match type_string {
            "Filling" | "filling" => Some(PrintingModeWidthCalculation::Filling),
            "Absolute" | "absolute" => Some(PrintingModeWidthCalculation::Absolute),
            _ => None,
        }
    }

    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match *self {
            PrintingModeWidthCalculation::Filling => write!(f, "Filling"),
            PrintingModeWidthCalculation::Absolute => write!(f, "Absolute"),
        }
    }
}
impl fmt::Display for PrintingModeWidthCalculation {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for PrintingModeWidthCalculation {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}