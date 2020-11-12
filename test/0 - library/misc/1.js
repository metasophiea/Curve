const mux = 5;
grapher._width = 500*mux;
grapher._height = 500*mux;
grapher.newCanvas();

grapher.clear();
grapher.drawLine({x:0,y:250*mux},{x:500*mux,y:250*mux},'rgba(200,200,200,1)');
grapher.drawLine({x:250*mux,y:0},{x:250*mux,y:500*mux},'rgba(200,200,200,1)');
grapher.drawCircle(250*mux,250*mux,200*mux,'rgba(200,200,200,0)','rgba(200,200,200,1)',1);


const radius = 200*mux;
// const angles = [
//     -0.25, -0.5, -0.75, -1, -1.25, -1.5, -1.75
// ];
const angles = _canvas_.library.math.curveGenerator.linear(21,-0.25,-1.75);
// const angles = _canvas_.library.math.curveGenerator.halfSigmoid_up(10,-0.25,-1,0.75);

angles.forEach(angle => {
    grapher.drawLine({x:250*mux,y:250*mux},
        {
            x:250*mux + Math.sin(Math.PI*angle)*(radius+50*mux),
            y:250*mux + Math.cos(Math.PI*angle)*(radius+50*mux),
        }
        ,'rgba(200,200,200,1)');

    grapher.drawCircle( 
        250*mux + Math.sin(Math.PI*angle)*radius,
        250*mux + Math.cos(Math.PI*angle)*radius,
        1,'rgba(0,0,0,1)'
    );
});