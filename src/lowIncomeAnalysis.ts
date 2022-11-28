import * as d3 from "d3"

export function incomeScatterChart(){
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


    svg.append("text")
    .attr("font-size", 12)
    .attr("fill","white")
    .attr("font-weight",500)
    .attr("fill-opacity",1)
    .attr("text-anchor", "front")
    .attr("id","displayXlabel")
    .attr('x',width/2-100)
    .attr('y',height-margin.bottom/2)
    .text("Percentage of population that is low income")

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

    function update(region:string){
        var regionCode = 0
        if(region == "West") regionCode = 1
        else if(region == "Midwest") regionCode = 2
        else if(region == "Northeast") regionCode = 3
        else if(region == "South") regionCode = 4

        function displayInfo(d:any){
            let format = d3.format(".2f")
            d3.selectAll('#IncomeDisplayInfoText').remove()
            svg.append("text")
                .attr("font-size", 12)
                .attr("fill","white")
                .attr("font-weight",400)
                .attr("fill-opacity",1)
                .attr("text-anchor", "front")
                .attr("id","IncomeDisplayInfoText")
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
                .text(d.target.__data__.county.includes("Oglala")?"No Data":d.target.__data__.county.includes("Kusilvak")?"No Data":"Proportion of individuals that are low income: "+ format(d.target.__data__.pLOWI))
        }
            d3.selectAll('#incomeCircles').remove();
            d3.csv('./src/insecurityAndProportions.csv').then((d) =>{
                dots.selectAll("circle")
                       .data(d)
                       .enter()
                       .append("circle")
                       .attr("id","incomeCircles")
                       .attr("cx", (x) =>{
                            if(regionCode == 0){
                                return xScale(parseFloat(x.pLOWI === undefined?"":x.pLOWI))
                            }
                            else{
                                if(parseInt(x.region===undefined?"":x.region) == regionCode){
                                    return xScale(parseFloat(x.pLOWI === undefined?"":x.pLOWI))
                                }
                                else{
                                    return -500;
                                }
                            }
                       })
                       .attr("cy", x=> yScale(parseFloat(x.insecurityRate===undefined?"":x.insecurityRate.slice(0,-1))))
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
                .attr('cx', (x:any) => {
                    var value = -500;
                    if(regionCode == 0) value = xAxisScaled(parseFloat(x.pLOWI))
                    else if(parseInt(x.region===undefined?"":x.region) == regionCode) value = xAxisScaled(parseFloat(x.pLOWI))
                    else value = -500;
    
                    if(value < margin.left){
                        return -500
                    }
                    else{
                        return value
                    }
                    })
                .attr('cy', (y:any) => {
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