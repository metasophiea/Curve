use std::fmt;

#[derive(PartialEq, Eq, Hash, Copy, Clone)]
pub enum RenderDecision {
    NoChildren,
    NotVisible,
    ImageDataNotLoaded,
    RenderedFromBuffer,
    Rendered,
}
impl RenderDecision {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result {
        match self {
            RenderDecision::NoChildren => write!(f, "No Children"),
            RenderDecision::NotVisible => write!(f, "Not Visible"),
            RenderDecision::ImageDataNotLoaded => write!(f, "Image Data Not Loaded"),
            RenderDecision::RenderedFromBuffer => write!(f, "Rendered From Buffer"),
            RenderDecision::Rendered => write!(f, "Rendered"),
        }
    }
}
impl fmt::Display for RenderDecision {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}
impl fmt::Debug for RenderDecision {
    fn fmt(&self, f:&mut fmt::Formatter) -> fmt::Result { self.fmt(f) }
}