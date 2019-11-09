this.element = function(_id){
    const type = 'element';
    this.getType = function(){return type};
    const id = _id;
    this.getId = function(){return id};

    let data = Math.random();
    this.getData = function(){return data;};
    this.setData = function(a){data = a;};
};
this.element.proxyableMethods = [
    {function:'getData',arguments:[]},
    {function:'setData',arguments:['a']}
];