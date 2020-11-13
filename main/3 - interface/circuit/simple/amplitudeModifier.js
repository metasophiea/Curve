this.amplitudeModifier = function(
    context
){
    //flow
        //flow chain
            const flow = {
                amplitudeModifierNode:{}
            };

        //amplitudeModifierNode
            flow.amplitudeModifierNode = {
                invert: false,
                offset: 0,
                divisor: 1,
                ceiling: 10,
                floor: -10,
                node: new _canvas_.library.audio.audioWorklet.production.wasm.amplitudeModifier(context),
            };

    //input/output node
        this.in = function(){return flow.amplitudeModifierNode.node;}
        this.out = function(a){return flow.amplitudeModifierNode.node;}

    //controls
        this.invert = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.invert; }
            flow.amplitudeModifierNode.invert = value;
            flow.amplitudeModifierNode.node.invert = value;
        };
        this.offset = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.offset; }
            flow.amplitudeModifierNode.offset = value;
            _canvas_.library.audio.changeAudioParam(context, flow.amplitudeModifierNode.node.offset, value, 0.01, 'instant', true);
        };
        this.divisor = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.divisor; }
            flow.amplitudeModifierNode.divisor = value;
            _canvas_.library.audio.changeAudioParam(context, flow.amplitudeModifierNode.node.divisor, value, 0.01, 'instant', true);
        };
        this.ceiling = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.ceiling; }
            flow.amplitudeModifierNode.ceiling = value;
            _canvas_.library.audio.changeAudioParam(context, flow.amplitudeModifierNode.node.ceiling, value, 0.01, 'instant', true);
        };
        this.floor = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.floor; }
            flow.amplitudeModifierNode.floor = value;
            _canvas_.library.audio.changeAudioParam(context, flow.amplitudeModifierNode.node.floor, value, 0.01, 'instant', true);
        };
};