// var unit = _canvas_.interface.unit.collection.beta.basic_synthesizer(0,0,0);
// _canvas_.interface.unit.validator(unit);
Object.keys(_canvas_.interface.unit.collection.beta).forEach(model => {
    if(model[0] == '_'){return;}

    console.log(model);
    _canvas_.interface.unit.validator( _canvas_.interface.unit.collection.beta[model](0,0,0) );
});