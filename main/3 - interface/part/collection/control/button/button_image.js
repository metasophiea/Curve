this.button_image = function(
    name='button_image',
    x, y, width=30, height=20, angle=0, interactable=true,
    
    active=true, hoverable=true, selectable=false, pressable=true,

    backingImageUrl__off='http://space.alglobus.net/Basics/whyImages/earthFromSpace.gif',
    backingImageUrl__up='https://i.ytimg.com/vi/JS7NYKqhrFo/hqdefault.jpg',
    backingImageUrl__press='http://coolinterestingstuff.com/wp-content/uploads/2012/09/space-4.jpg',
    backingImageUrl__select='https://pbs.twimg.com/profile_images/927920625347383297/-ksNZr-Z_400x400.jpg',
    backingImageUrl__select_press='https://blueblots.com/wp-content/uploads/2009/07/space1.jpg',
    backingImageUrl__glow='https://i.ytimg.com/vi/kpFryXQbVEA/hqdefault.jpg',
    backingImageUrl__glow_press='https://fabiusmaximus.files.wordpress.com/2016/01/north-america-at-night-from-space.jpg',
    backingImageUrl__glow_select='https://s3.amazonaws.com/spoonflower/public/design_thumbnails/0263/6418/rspoonflower_space_picmonkey_blue_v2_shop_preview.png',
    backingImageUrl__glow_select_press='https://www.onlytoptens.com/wp-content/uploads/2011/03/top-10-space-facts-moon-moving-away-from-earth.jpeg',
    backingImageUrl__hover='https://cbsnews2.cbsistatic.com/hub/i/r/2015/04/14/5b5bc07b-95cf-4d06-9b98-a4738d904981/resize/620x465/9146eac2f7e3d92908bd5dfe4450a31d/hubble-telescope-anniversary12.jpg#',
    backingImageUrl__hover_press='http://1.bp.blogspot.com/-gCkpyF_ib9M/TWBP5ftaeII/AAAAAAAAAY0/r1yI-UNbSSY/s1600/tychePlanet.jpg',
    backingImageUrl__hover_select='http://vignette3.wikia.nocookie.net/freerealmswarriorcats/images/6/61/4293522-567779-space-background-star-heart-in-night-sky.jpg/revision/latest?cb=20140103064430',
    backingImageUrl__hover_select_press='https://spaceplace.nasa.gov/templates/featured/space/galaxies300.png',
    backingImageUrl__hover_glow='https://s3.amazonaws.com/spoonflower/public/design_thumbnails/0157/0136/SPACE_PRINT-ALIEN_2_shop_preview.png',
    backingImageUrl__hover_glow_press='http://1.bp.blogspot.com/-rbBG3L514tQ/UD9eJuVrH1I/AAAAAAAAIo0/RKOGYNs0WwM/s400/Outer+Space+Wallpapers+6.jpg',
    backingImageUrl__hover_glow_select='http://previewcf.turbosquid.com/Preview/2014/05/25__12_10_05/gamma%20wormhole%202.jpg0671fb75-c6d0-49ee-9555-9ca9bf1ba482Larger.jpg',
    backingImageUrl__hover_glow_select_press='http://imgc.allpostersimages.com/images/P-473-488-90/61/6172/E2RG100Z/posters/earth-from-space.jpg',

    onenter = function(event){},
    onleave = function(event){},
    onpress = function(event){},
    ondblpress = function(event){},
    onrelease = function(event){},
    onselect = function(event){},
    ondeselect = function(event){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('group',name+'subGroup',{});
        //backing
            var backing = interfacePart.builder('image','backing',{width:width, height:height, url:backingImageUrl__off});
            subject.append(backing);
        //cover
            subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
            subject.append(subject.cover);

    //generic button part
        var object = interfacePart.builder(
            'button_', name, {
                x:x, y:y, angle:angle, interactable:interactable,
                active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                onenter:onenter,
                onleave:onleave,
                onpress:onpress,
                ondblpress:ondblpress,
                onrelease:onrelease,
                onselect:onselect,
                ondeselect:ondeselect,

                subject:subject,
            }
        );

    //graphical state adjust
        object.activateGraphicalState = function(state){
            if(!active){ 
                backing.style.fill = backing__off__fill;
                backing.style.stroke = backing__off__stroke;
                backing.style.lineWidth = backing__off__lineWidth;
                return;
            }

            if(!hoverable && state.hovering ){ state.hovering = false; }
            if(!selectable && state.selected ){ state.selected = false; }

            backing.url = [
                backingImageUrl__up,                     
                backingImageUrl__press,                  
                backingImageUrl__select,                 
                backingImageUrl__select_press,           
                backingImageUrl__glow,                   
                backingImageUrl__glow_press,             
                backingImageUrl__glow_select,            
                backingImageUrl__glow_select_press,      
                backingImageUrl__hover,                  
                backingImageUrl__hover_press,            
                backingImageUrl__hover_select,           
                backingImageUrl__hover_select_press,     
                backingImageUrl__hover_glow,             
                backingImageUrl__hover_glow_press,       
                backingImageUrl__hover_glow_select,      
                backingImageUrl__hover_glow_select_press,
            ][ state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1 ];
        };
        object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });

    return object;
};