import * as d3 from "d3";



export function mapChart(){
    const width = 1200;
    const height = 600;


    const colorScale = d3.scaleSequential().interpolator(d3.interpolateReds).domain([0,60])
    const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])


    function mouseOver(d){
        //let a = d.fromElement.__data__?.properties
        if(d.target.__data__.properties.County == undefined){
            console.log(d)
        }
    }
    function mouseOut(d){
        d3.select(this)
          .attr("fill","white")
    }
    d3.json("./src/foodAccessData.json").then(d => {
        var projection = d3.geoIdentity().reflectY(true).fitSize([width,height],d);
        var path = d3.geoPath().projection(projection)
        svg.selectAll("path")
            .data(d.features)
            .enter()
            .append("path")
            .attr('d',path)
            .attr('fill',function (d){
                if(d.properties.PovertyRate == undefined){
                    return "#FFFFFF"
                }
                else{
                    return colorScale(d.properties.PovertyRate)
                }
            })
            .attr("class", "counties")
            .on("mouseover",mouseOver)
            .on("mouseout",mouseOut)
            }
        );

    return {
        element: svg.node()!,
      };
}