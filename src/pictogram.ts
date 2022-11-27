import * as d3 from "d3";

export function pictChart(col:string){
    const width = 800;
    const height = col == 'HESSH3'?250: col == 'HESS5'?300 : 400;
    const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height);
    d3.csv("./src/howItFeelsActual.csv").then(d => {
        var rows= 0;
        var cols = 10;
        var data = [0];
        var numShade = 0;
        var numAffected = 0;
        var numTotal = 0;
        d.forEach(d =>{
            if (d.col == col){
                if(d.numDisplay !== undefined && parseInt(d.numDisplay) % 10 > 0){
                    rows = Math.floor(parseInt(d.numDisplay)/10)+1
                }
                else{
                    rows = d.numDisplay?parseInt(d.numDisplay)/10:0
                }
                data = d.numDisplay?d3.range(parseInt(d.numDisplay)):[]
                numShade = d.NumShade?parseInt(d.NumShade):0;
                numAffected = d.numAffected?parseInt(d.numAffected):0;
                numTotal = d.total?parseInt(d.total):0;
            }
        })
        const yDomain = d3.range(rows).map(d => d.toString());
        var heightA = 700;
        if(rows == 4){
            heightA = 400
        }
        else if(rows == 3){
            heightA = 300
        }
        const yScale = d3.scaleBand().range([0,heightA]).domain(yDomain);
        const xScale = d3.scaleBand().range([0,450]).domain(["0","1","2","3","4","5","6","7","8","9"])
        const elem = svg.append('g').attr("transform", "translate(10,10)");

        elem.selectAll('image')
        .data(data)
        .enter()
        .append('svg:image')
        .attr('xlink:href',"./src/person.png") /* image source = https://www.freeiconspng.com/img/1676 */
        .attr('transform', 'scale(0.5)')
        .attr('x',d =>{
            return xScale((d%cols).toString())
        } )
        .attr('y',d =>{
            return yScale(Math.floor(d/cols).toString())
        })
        .attr('class', d =>{
            if(d<numShade){
                return "affectedPerson"
            }
            else{
                return "notAffected"
            }
        })

        elem
        .append('svg:image')
        .attr('id','scaleImage')
        .attr('xlink:href',"./src/person.png")
        .attr('transform','scale(0.5)')
        .attr('x', 600)
        .attr('y',()=>{
            if(rows == 4){
                return 200;
            }
            else if(rows ==3){
                return 160;
            }
            else{
                return 250;
            }
        })

        elem
        .append('svg:image')
        .attr('id','scaleImage')
        .attr('xlink:href',"./src/person.png")
        .attr('transform','scale(0.5)')
        .attr('class','affectedPerson')
        .attr('x', 600)
        .attr('y',()=>{
            if(rows == 4){
                return 100;
            }
            else if(rows == 3){
                return 60
            }
            else{
                return 150;
            }
        })

        svg.append('text')
        .attr("font-size", 14)
        .attr("fill","white")
        .attr("font-weight",550)
        .attr("text-anchor", "front")
        .attr("id","scaleImageLabel")
        .attr("x",330)
        .attr("y",() => {
            if(rows == 4){
                return 135;
            }
            else if(rows == 3){
                return 115;
            }
            else{
                return 160;
            }
        })
        .text("= 100 individuals statement is not applicable to");

        svg.append('text')
        .attr("font-size", 14)
        .attr("fill","white")
        .attr("font-weight",550)
        .attr("text-anchor", "front")
        .attr("id","scaleImageLabel")
        .attr("x",330)
        .attr("y",() => {
            if(rows == 4){
                return 85;
            }
            else if(rows == 3){
                return 65;
            }
            else{
                return 110;
            }
        })
        .text("= 100 individuals statement applies to");

        svg.append('text')
        .attr("font-size", 24)
        .attr("fill","red")
        .attr("font-weight",700)
        .attr("text-anchor", "front")
        .attr('x',()=>{
            if(rows == 3){
                return 120;
            }
            else{
                return 100;
            }
        })
        .attr('y',()=> {
            if(rows == 4){
                return 275;
            }
            else if(rows == 3){
                return 215;
            }
            else{
                return 390;
            }
        })
        .text(numAffected) /* "applied to them out of " + numTotal + " asked"*/
        .append('tspan')
        .attr("font-size", 14)
        .attr("fill","white")
        .attr("font-weight",550)
        .attr("text-anchor", "front")
        .attr('x',165)
        .attr('y',()=> {
            if(rows == 4){
                return 275;
            }
            else if(rows == 3){
                return 215;
            }
            else{
                return 390;
            }
        })
        .text( " individuals said ")
        .append('tspan')
        .attr("font-size", 14)
        .attr("fill","red")
        .attr("font-weight",550)
        .attr("text-anchor", "front")
        .attr('x',280)
        .attr('y',()=> {
            if(rows == 4){
                return 275;
            }
            else if(rows == 3){
                return 215;
            }
            else{
                return 390;
            }
        })
        .text( "this statement applied to them")
        .append('tspan')
        .attr("font-size", 14)
        .attr("fill","white")
        .attr("font-weight",550)
        .attr("text-anchor", "front")
        .attr('x',493)
        .attr('y',()=> {
            if(rows == 4){
                return 275;
            }
            else if(rows == 3){
                return 215;
            }
            else{
                return 390;
            }
        })
        .text("out of " + numTotal + " asked")

    })
    return {
        element: svg.node!()
    };
}