function makeSimpleDial(x,y){
    var _mainObject = parts.basic.g('simpleDial', x, y);

    var backing = parts.basic.rect(null, 0, 0, 60, 30, 0, 'fill:rgba(200,200,200,0.75)');
        _mainObject.append(backing);
        backing = parts.modifier.bestowMovement(backing, backing.parentElement);

    var connectionNode_data_1 = parts.dynamic.connectionNode_data('connectionNode_data_1', -10, 7.5, 15, 15);
        _mainObject.append(connectionNode_data_1);
        _mainObject.movementRedraw = function(){ connectionNode_data_1.redraw(); };

    var connectionNode_data_2 = parts.dynamic.connectionNode_data('connectionNode_data_2', 60-5, 7.5, 15, 15);
        _mainObject.append(connectionNode_data_2);
        _mainObject.movementRedraw = function(){ connectionNode_data_2.redraw(); };

    var Cdial = parts.control.dial_continuous('Cdial', 30/2, 30/2, 12);
        _mainObject.append(Cdial);
        Cdial.onChange = function(data){
            this.parentElement.children['connectionNode_data_1'].send( '%', data );
        }

    var Ddial = parts.control.dial_discrete('Ddial', 30 + 30/2, 30/2, 12, 7);
        _mainObject.append(Ddial);
        Ddial.onChange = function(data){
            this.parentElement.children['connectionNode_data_2'].send( 'discrete', data );
        }



    connectionNode_data_1.onConnect = function(){
        this.send( '%', Cdial.get() );
    };
    connectionNode_data_2.onConnect = function(){
        this.send( 'discrete', Ddial.select() );
    };

    return _mainObject;
}