import * as d3 from "d3";

export function mapChart(){
    const width = document.body.clientWidth;
    const height = 300;

    const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    var projection = d3.geoMercator();
    var path = d3.geoPath().projection(projection)
    var data = d3.json("foodAccess.geojson", (d)=> {
        console.log(d)
    });
    
    return {
        element: svg.node()!,
      };
}