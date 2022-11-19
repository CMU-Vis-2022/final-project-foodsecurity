import * as d3 from "d3";



export function mapChart(){
    const width = 1200;
    const height = 600;

    const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])


    var data = d3.json("./src/foodAccesData.json").then(d => {
        var projection = d3.geoIdentity().reflectY(true).fitSize([width,height],d);
        var path = d3.geoPath().projection(projection)
        svg.selectAll("path")
            .data(d.features)
            .enter()
            .append("path")
            .attr('d',path)
            .attr('fill','#FFFFFF')
            .attr("class", "counties");
            }
        );

    return {
        element: svg.node()!,
      };
}