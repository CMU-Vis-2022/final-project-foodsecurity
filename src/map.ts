import * as d3 from "d3";



export function mapChart(){
    const width = 1400;
    const height = 600;


    const colorScale = d3.scaleSequential().interpolator(d3.interpolateReds).domain([0,50])
    const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])


    function mouseOver(d){
        let format = d3.format(".2f")
        d3.select(this).attr("fill-opacity",1)
        console.log(d)
        if(d.target.__data__.properties.rate == undefined){
            d3.select("#labelText").remove();
            d3.select("#textBG").remove();
            let length = Math.max((d.target.__data__.properties.name + " County").length,("No Data").length)
            svg.append("rect")
               .attr("id","textBG")
               .attr("fill","#C0C0C0")
               .attr("stroke","#565656")
               .attr("stroke-width","1")
               .attr("x",d.layerX-40)
               .attr("y",d.offsetY-20)
               .attr("width",length * 11)
               .attr("height",50)
            
            svg.append("text")
                    .attr("font-size", 14)
                    .attr("fill","white")
                    .attr("font-weight",550)
                    .attr("fill-opacity",1)
                    .attr("text-anchor", "front")
                    .attr("id","labelText")
                    .attr("x",d.layerX-30)
                    .attr("y",d.offsetY)
                    .text(d.target.__data__.properties.name + " County")
                    .append("tspan")
                    .attr("font-size",11)
                    .attr("x",d.layerX-30)
                    .attr("y",d.offsetY + 20)
                    .text("No Data")
        }
        else{
            let length = Math.max((d.target.__data__.properties.name + " County").length,("percentage" + d.target.__data__.properties.rate).length)

            d3.select("#labelText").remove();
            d3.select("#textBG").remove();
            svg.append("rect")
               .attr("id","textBG")
               .attr("fill","#C0C0C0")
               .attr("stroke","#565656")
               .attr("stroke-width","1")
               .attr("x",d.layerX-40)
               .attr("y",d.offsetY-20)
               .attr("width",length * 10)
               .attr("height",50)

            svg.append("text")
                    .attr("font-size", 14)
                    .attr("fill","white")
                    .attr("font-weight",550)
                    .attr("fill-opacity",1)
                    .attr("text-anchor", "front")
                    .attr("id","labelText")
                    .attr("x",d.layerX-30)
                    .attr("y",d.offsetY)
                    .text(d.target.__data__.properties.name + " County")
                    .append("tspan")
                    .attr("font-size",11)
                    .attr("x",d.layerX-30)
                    .attr("y",d.offsetY + 20)
                    .text("percentage "+ d.target.__data__.properties.rate)
            //console.log(d)
        }
    }
    function mouseOut(d){
        d3.select(this).attr("fill-opacity",0.8)
    }
    d3.json("./src/foodData.geojson").then(d => {
        console.log(d.features)
        var projection = d3.geoIdentity().reflectY(true).fitSize([(width-200),height],d);
        var path = d3.geoPath().projection(projection)
        svg.selectAll("path")
            .data(d.features)
            .enter()
            .append("path")
            .attr('d',path)
            .attr('fill',function (d){
                if(d.properties.rate == undefined){
                    return "#FFFFFF"
                }
                else{
                    let length = d.properties.rate.length
                    let value = d.properties.rate.substring(0,length-1).toString()
                    return colorScale(value)
                }
            })
            .attr("fill-opacity",0.8)
            .attr("class", "counties")
            .on("mouseover",mouseOver)
            .on("mouseout",mouseOut)
            }
        );
    return {
        element: svg.node()!,
      };
}