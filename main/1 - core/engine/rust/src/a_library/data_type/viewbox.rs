//rust
    use std::fmt;

//wasm

//core
    use crate::a_library::data_type::{
        Offset,
        BoundingBox,
        Polygon,
    };
    use crate::a_library::math::cartesian_angle_adjust;








pub struct Viewbox {
    x: f32,
    y: f32,
    scale: f32,
    angle: f32,
    anchor_x: f32,
    anchor_y: f32,
    width: u32,
    height: u32,

    polygon: Polygon,
    static_polygon: Polygon,
}
impl Viewbox {
    pub fn new(x:f32, y:f32, scale:f32, angle:f32, anchor_x:f32, anchor_y:f32, width:u32, height:u32) -> Viewbox {
        Viewbox { 
            x, 
            y, 
            scale, 
            angle, 
            anchor_x,
            anchor_y,
            width, 
            height,
            polygon: Viewbox::generate_viewbox(
                x, 
                y, 
                scale, 
                angle, 
                anchor_x,
                anchor_y,
                width, 
                height,
            ),
            static_polygon: Viewbox::generate_viewbox(
                0.0, 
                0.0, 
                1.0, 
                0.0, 
                0.0,
                0.0,
                width, 
                height,
            )
        }
    }
    pub fn new_default() -> Viewbox {
        Viewbox::new(
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            800,
            600,
        )
    }

    fn generate_viewbox(x:f32, y:f32, scale:f32, angle:f32, anchor_x:f32, anchor_y:f32, width:u32, height:u32) -> Polygon {
        let frame = 0.0/scale;

        let width = (width as f32)/scale;
        let height = (height as f32)/scale;

        let angle = -angle;

        let top_left_point = cartesian_angle_adjust(
            -width*anchor_x + frame,     
            -height*anchor_y + frame,
            angle
        );
        let top_right_point = cartesian_angle_adjust(
            width*(1.0-anchor_x) - frame,
            -height*anchor_y + frame,
            angle
        );
        let bottom_right_point = cartesian_angle_adjust(
            width*(1.0-anchor_x) - frame,
            height*(1.0-anchor_y) - frame, 
            angle
        );
        let bottom_left_point = cartesian_angle_adjust(
            -width*anchor_x + frame,     
            height*(1.0-anchor_y) - frame, 
            angle
        );

        Polygon::new_from_flat_array(vec![
            x + top_left_point.get_x(),     y + top_left_point.get_y(),
            x + top_right_point.get_x(),    y + top_right_point.get_y(),
            x + bottom_right_point.get_x(), y + bottom_right_point.get_y(),
            x + bottom_left_point.get_x(),  y + bottom_left_point.get_y(),
        ])
    }
    fn update(&mut self) {
        self.polygon = Viewbox::generate_viewbox(
            self.x, 
            self.y, 
            self.scale, 
            self.angle, 
            self.anchor_x,
            self.anchor_y,
            self.width, 
            self.height
        );
        self.static_polygon = Viewbox::generate_viewbox(
            0.0, 
            0.0, 
            1.0, 
            0.0, 
            0.0,
            0.0,
            self.width, 
            self.height
        );
    }

    pub fn get_x(&self) -> f32 { self.x }
    pub fn set_x(&mut self, new:f32) { self.x = new; self.update(); }
    pub fn get_y(&self) -> f32 { self.y }
    pub fn set_y(&mut self, new:f32) { self.y = new; self.update(); }
    pub fn get_scale(&self) -> f32 { self.scale }
    pub fn set_scale(&mut self, new:f32) { self.scale = new; self.update(); }
    pub fn get_angle(&self) -> f32 { self.angle }
    pub fn set_angle(&mut self, new:f32) { self.angle = new; self.update(); }
    pub fn get_anchor_x(&self) -> f32 { self.anchor_x }
    pub fn set_anchor_x(&mut self, new:f32) { self.anchor_x = new; self.update(); }
    pub fn get_anchor_y(&self) -> f32 { self.anchor_y }
    pub fn set_anchor_y(&mut self, new:f32) { self.anchor_y = new; self.update(); }
    pub fn get_width(&self) -> u32 { self.width }
    pub fn set_width(&mut self, new:u32) { self.width = new; self.update(); }
    pub fn get_height(&self) -> u32 { self.height }
    pub fn set_height(&mut self, new:u32) { self.height = new; self.update(); }

    pub fn get_offset(&self) -> Offset {
        let p = cartesian_angle_adjust(-self.x*self.scale, -self.y*self.scale, self.angle);

        Offset::new(
            p.get_x() + (self.width as f32) * self.anchor_x,
            p.get_y() + (self.height as f32) * self.anchor_y,
            self.scale, self.angle
        )
    }
    pub fn get_bounding_box(&self) -> &BoundingBox {
        &self.polygon.get_bounding_box()
    }
    pub fn get_polygon(&self) -> &Polygon {
        &self.polygon
    }
    pub fn get_static_polygon(&self) -> &Polygon {
        &self.static_polygon
    }
}
impl fmt::Display for Viewbox {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f, "{{x:{}, y:{}, scale:{}, angle:{}, width:{}, height:{}, bounding_box:{}}}",
            self.x,
            self.y,
            self.scale,
            self.angle,
            self.width,
            self.height,
            self.polygon,
        )
    }
}