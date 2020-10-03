this.Canvas = function(_name){
    genericElement.call(this,'Canvas',_name);

    Object.entries({
        x: 0,
        y: 0,
        angle: 0,
        anchor: {x:0,y:0},
        width: 10,
        height: 10,
    }).forEach(([name,defaultValue]) => this.__setupSimpleAttribute(name,defaultValue) );

    //subCanvas
        const subCanvas = { object:document.createElement('canvas'), context:undefined, resolution:1 };
        subCanvas.context = subCanvas.object.getContext('2d');

        function updateDimensions(self){
            subCanvas.object.setAttribute('width',self.width()*subCanvas.resolution);
            subCanvas.object.setAttribute('height',self.height()*subCanvas.resolution);
        }
        updateDimensions(this);

        this._ = subCanvas.context;
        this.$ = function(a){return a*subCanvas.resolution;};
        this.resolution = function(a){
            if(a == undefined){return subCanvas.resolution;}
            subCanvas.resolution = a;
            updateDimensions(this);
        };
        this.requestUpdate = function(){
            if(this.getId() != undefined){
                createImageBitmap(subCanvas.object).then(bitmap => {
                    interface.operator.element.executeMethod.unifiedAttribute(this.getId(),{bitmap:bitmap},[bitmap]);
                });
            }
        };
        this.requestUpdate();
        this.__repush = function(){ this.requestUpdate(); };

    const __unifiedAttribute = this.unifiedAttribute;
    this.unifiedAttribute = function(attributes){
        if(attributes == undefined){ return __unifiedAttribute(); }
        if(attributes.resolution != undefined){
            this.resolution(attributes.resolution);
            delete attributes.resolution;
        }
        __unifiedAttribute(attributes);
        updateDimensions(this);
    };
};