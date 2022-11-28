import * as d3 from "d3"

export function scatterChart(){
    const margin = { top: 0, right: 100, bottom: 80, left: 150 };

    const width = 800;
    const height = 500;

    const xRange = [margin.left, width - margin.right];
    const yRange = [margin.top, height - margin.bottom];

    const xScale = d3.scaleLinear().range(xRange).domain([0,105]);
    const yScale = d3.scaleLinear().range(yRange).domain([36,0]);


    const xAxis = d3.axisBottom(xScale).ticks(9);
    const yAxis = d3.axisLeft(yScale).ticks(9);

    const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)

    svg
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", `translate(0,${height - margin.bottom})`);

    svg
    .append("g")
    .attr("class", "yaxis")
    .attr("transform", `translate(${margin.left},0)`);

    const dots = svg.append("g");

    
    function update(race:string){
        d3.selectAll('#displayInfoText').remove()

        svg.append("text")
        .attr("font-size", 12)
        .attr("fill","white")
        .attr("font-weight",500)
        .attr("fill-opacity",1)
        .attr("text-anchor", "front")
        .attr("id","displayXlabel")
        .attr('x',width/2-100)
        .attr('y',height-margin.bottom/2)
        .text("Percentage of population that is " + race)

        svg.append("text")
        .attr("font-size", 14)
        .attr("fill","white")
        .attr("font-weight",550)
        .attr("fill-opacity",1)
        .attr("text-anchor", "front")
        .attr("id","displayYlabel")
        .attr("x",0)
        .attr("y",height/2)
        .attr("transform",`translate(${-margin.left},${height/2}) rotate(-90)`)
        .text("Food Insecurity Rate");

        function displayInfo(d:any){
            var displayNum = 0
            console.log(d)
            if(race == "White") displayNum = d.target.__data__.numWhite
            else if(race == "Black") displayNum = d.target.__data__.numBlack
            else if(race == "Asian") displayNum = d.target.__data__.numAsian
            else displayNum = d.target.__data__.numHispanic 
            console.log(race)
            console.log(d)
            d3.selectAll('#displayInfoText').remove()
            svg.append("text")
                .attr("font-size", 12)
                .attr("fill","white")
                .attr("font-weight",400)
                .attr("fill-opacity",1)
                .attr("text-anchor", "front")
                .attr("id","displayInfoText")
                .attr("x",d.offsetX-130)
                .attr("y",d.offsetY-90)
                .text(d.target.__data__.county)
                .append("tspan")
                .attr("font-size",12)
                .attr("x",d.offsetX-130)
                .attr("y",d.offsetY - 70)
                .text("Insecurity Rate "+ d.target.__data__.insecurityRate)
                .append("tspan")
                .attr("font-size",11)
                .attr("x",d.offsetX-130)
                .attr("y",d.offsetY - 50)
                .text(d.target.__data__.county.includes("Oglala")?"No Data":d.target.__data__.county.includes("Kusilvak")?"No Data":"Number of Food Insecure Individuals "+ d.target.__data__.numInsecure)
                .append("tspan")
                .attr("font-size",11)
                .attr("x",d.offsetX-130)
                .attr("y",d.offsetY - 30)
                .text(d.target.__data__.county.includes("Oglala")?"No Data":d.target.__data__.county.includes("Kusilvak")?"No Data":"Number of individuals who race is " + race + ": " + displayNum)
        }

        d3.selectAll('#raceCircles').remove();
        d3.csv('./src/insecurityAndProportions.csv').then((d) =>{
            dots.selectAll("circle")
                   .data(d)
                   .enter()
                   .append("circle")
                   .attr("id","raceCircles")
                   .attr("cx", x=>{
                    if(race == "White") return xScale(x.pWhite)
                    else if(race == "Black") return xScale(x.pBlack)
                    else if(race == "Hispanic") return xScale(x.pHispanic)
                    else return xScale(x.pAsian)
                   })
                   .attr("cy", x=> yScale(parseFloat(x.insecurityRate.slice(0,-1))))
                   .attr("r", 1.5)
                   .style("fill", "#FF0000")
                   .on("mouseover", displayInfo)

    
            svg.select<SVGSVGElement>(".xaxis").call(xAxis);   
            svg.select<SVGSVGElement>(".yaxis").call(yAxis)
        })
    
        /* referenced https://www.freecodecamp.org/news/get-ready-to-zoom-and-pan-like-a-pro-after-reading-this-in-depth-tutorial-5d963b0a153e/ to understand zoom */
        const onZoom = d3.zoom<SVGSVGElement,undefined>()
                         .extent([[0,0],[width,height]])
                         .scaleExtent([1,8])
                         .on("zoom",zoomed)
    
        function zoomed({transform}:any){
            var xAxisScaled = transform.rescaleX(xScale)
            var yAxisScaled = transform.rescaleY(yScale)
            xAxis.scale(xAxisScaled)
            yAxis.scale(yAxisScaled)
            svg.select<SVGSVGElement>(".xaxis").call(xAxis);   
            svg.select<SVGSVGElement>(".yaxis").call(yAxis);
    
            dots.selectAll("circle")
            .attr('cx', (x) => {
                var value;
                if(race == "White") value = xAxisScaled(x.pWhite);
                else if(race == "Black") value = xAxisScaled(x.pBlack)
                else if(race == "Asian") value = xAxisScaled(x.pAsian)
                else value = xAxisScaled(x.pHispanic)

                if(value < margin.left){
                    return -500
                }
                else{
                    return value
                }
                })
            .attr('cy', y => {
                let value = yAxisScaled(parseFloat(y.insecurityRate.slice(0,-1)))
                if(value > height - margin.bottom){
                    return 8000
                }
                else{
                    return value
                }
                })
        }
        svg.call(onZoom)
    }
    return {
        element: svg.node()!,
        update
      };
}