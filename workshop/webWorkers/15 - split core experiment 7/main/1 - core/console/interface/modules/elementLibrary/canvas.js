this.canvas = function(_name){
    genericElementProxy.call(this,'canvas',_name);

    Object.entries({
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
    }).forEach(([name,defaultValue]) => this.setupSimpleAttribute(name,defaultValue) );

    //subCanvas
        const subCanvas = { object:document.createElement('canvas'), context:undefined, resolution:1 };
        subCanvas.context = subCanvas.object.getContext('2d');

        function updateDimentions(self){
            subCanvas.object.setAttribute('width',self.width()*subCanvas.resolution);
            subCanvas.object.setAttribute('height',self.height()*subCanvas.resolution);
        }
        updateDimentions(this);

        this._ = subCanvas.context;
        this.$ = function(a){return a*subCanvas.resolution;};
        this.resolution = function(a){
            if(a == undefined){return subCanvas.resolution;}
            subCanvas.resolution = a;
            updateDimentions(this);
        };
        this.requestUpdate = function(){
            createImageBitmap(subCanvas.object).then(bitmap => {
                if(this.getId() != -1){ _canvas_.core.element.__executeMethod(this.getId(),'imageBitmap',[bitmap],undefined,[bitmap]); }
            });
        };
        this.requestUpdate();
        this.__repush = function(){ this.requestUpdate(); };


    const __unifiedAttribute = this.unifiedAttribute;
    this.unifiedAttribute = function(attributes){
        if(attributes.resolution != undefined){
            this.resolution(attributes.resolution);
            delete attributes.resolution;
        }
        __unifiedAttribute(attributes);
        updateDimentions(this);
    };
};