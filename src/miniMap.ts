import * as d3 from "d3";

export function miniMapChart() {
  const width = 600;
  const height = 400;

  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateReds)
    .domain([0, 40]);
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  function update(filePath: string, name: string) {
    d3.select("#mapTitle"+name).remove();
    if(name == 'rate'){
      svg
      .append("text")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 550)
      .attr("text-anchor", "front")
      .attr("id", "mapTitle"+name)
      .attr("x", 100)
      .attr("y", 40)
      .text("Food Insecurity Rate by County, 2019");
    }
    else{
      svg
      .append("text")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 550)
      .attr("text-anchor", "front")
      .attr("id", "mapTitle"+name)
      .attr("x", 50)
      .attr("y", 25)
      .text("Proportion of population that lives farther")
      .append('tspan')
      .attr('x',50)
      .attr('y',40)
      .text("than 10 miles from a grocery store by County, 2019");
    }

    d3.json(filePath).then((d: any) => {
      const projection = d3
        .geoIdentity()
        .reflectY(true)
        .fitSize([width , height], d);
      const path = d3.geoPath().projection(projection);
      if (name == "rate") {
        d3.selectAll("#lalowi10share"+name).remove();
        d3.selectAll("#labelText"+name).remove();
        d3.select("#textBG"+name).remove();
      } else {
        d3.selectAll("#rate"+name).remove();
        d3.selectAll("#labelText"+name).remove();
        d3.select("#textBG"+name).remove();
      }
      if (name == "rate") {
        console.log();
        svg
          .selectAll("path")
          .data(d.features)
          .enter()
          .append("path")
          .attr("d", (d: any) => path(d))
          .attr("id", name+name)
          .attr("fill", function (d: any) {
            if (d.properties.rate == undefined) {
              return "#00FF00"; /* for seeing undefined data purposes */
            } else {
              const length = d.properties.rate.length;
              const value = d.properties.rate.substring(0, length - 1).toString();
              return colorScale(value);
            }
          })
          .attr("fill-opacity", 0.8)
          .attr("class", "counties")
          .attr('stroke-opacity',0.3)
      } else {
        svg
          .selectAll("path")
          .data(d.features)
          .enter()
          .append("path")
          .attr("d", (d: any) => path(d))
          .attr("id", name + name)
          .attr("fill", function (d: any) {
            if (d.properties.lalowi10share == undefined) {
              return "#00FF00"; /* for seeing undefined data purposes */
            } else {
              const length = d.properties.lalowi10share.length;
              const value = d.properties.lalowi10share
                .substring(0, length - 1)
                .toString();
              return colorScale(value);
            }
          })
          .attr("fill-opacity", 0.8)
          .attr("class", "counties")
          .attr('stroke-opacity',0.3)
      }
    });
  }
  return {
    element: svg.node()!,
    update,
  };
}
