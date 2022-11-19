import * as d3 from "d3";



export function mapChart(){
    const width = 1200
    const height = 700;

    const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");


    var data = d3.json("./src/foodAccessData.json").then(d => {
        var projection = d3.geoIdentity().reflectY(true).fitSize([width,height],d).translate([width/2,height/3]);
        //var projection = d3.geoAlbersUsa().fitSize([width,height],d)
        var path = d3.geoPath().projection(projection)
        svg.selectAll("path")
            .data(d.features)
            .enter()
            .append("path")
            .attr('d',path)
            .attr('fill','#FFFFFF')
            .attr('transform','scale(2)')
            .attr("class", "countries");
            }
        );

    return {
        element: svg.node()!,
      };
}