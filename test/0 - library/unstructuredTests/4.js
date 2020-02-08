grapher._width = 5000;
grapher._height = 5000;
grapher.newCanvas();

grapher.clear();
grapher.drawLine({x:0,y:2500},{x:5000,y:2500},'rgba(200,200,200,1)');
grapher.drawLine({x:2500,y:0},{x:2500,y:5000},'rgba(200,200,200,1)');
grapher.drawCircle(2500,2500,2000,'rgba(200,200,200,0)','rgba(200,200,200,1)',1);


const radius = 2000;
// const angles = [
//     -0.25, -0.5, -0.75, -1, -1.25, -1.5, -1.75
// ];
const angles = _canvas_.library.math.curveGenerator.linear(11,-0.25,-1.75);
angles.forEach(angle => {
    grapher.drawLine({x:2500,y:2500},
        {
            x:2500 + Math.sin(Math.PI*angle)*(radius+500),
            y:2500 + Math.cos(Math.PI*angle)*(radius+500),
        }
        ,'rgba(200,200,200,1)');

    grapher.drawCircle( 
        2500 + Math.sin(Math.PI*angle)*radius,
        2500 + Math.cos(Math.PI*angle)*radius,
        1,'rgba(0,0,0,1)'
    );
});