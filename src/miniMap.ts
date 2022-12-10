import * as d3 from "d3";

export function miniMapChart() {
  const width = 600;
  const height = 400;

  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateReds)
    .domain([0, 35]);
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);


    const colorSize = 30;
    // Add legend
    const colorRange = ["#FFF5F0", "#FED9C9", "#FCAF94", "#FB8161", "#F34F39", "#D52422", "#A81016", "#67000D"];
    for(let i = 0; i < colorRange.length; i++){
        svg
        .append("rect")
        .attr("class", "legend")
        .attr("transform", `translate(${width - width/2.5 + colorSize*i}, 12)`)
        .attr("fill", colorRange[i])
        .attr("opacity", 0.7)
        .attr("width", colorSize)
        .attr("height", height/25);
    }
    svg.append("text").text("0%-5%").attr("transform", `translate(${width - width/2.5}, 45)`).attr("font-size", 6).attr('fill','white');
    svg.append("text").text("5%-10%").attr("transform", `translate(${width - width/2.5 + colorSize*1 }, 45)`).attr("font-size", 6).attr('fill','white');
    svg.append("text").text("10%-15%").attr("transform", `translate(${width - width/2.5 + colorSize*2 }, 45)`).attr("font-size", 6).attr('fill','white');
    svg.append("text").text("15%-20%").attr("transform", `translate(${width - width/2.5 + colorSize*3 }, 45)`).attr("font-size", 6).attr('fill','white');
    svg.append("text").text("20%-25%").attr("transform", `translate(${width - width/2.5 + colorSize*4 }, 45)`).attr("font-size", 6).attr('fill','white');
    svg.append("text").text("25%-30%").attr("transform", `translate(${width - width/2.5 + colorSize*5 }, 45)`).attr("font-size", 6).attr('fill','white');
    svg.append("text").text("30%-35%").attr("transform", `translate(${width - width/2.5 + colorSize*6 }, 45)`).attr("font-size", 6).attr('fill','white');
    svg.append("text").text("35%+").attr("transform", `translate(${width - width/2.5 + colorSize*7 }, 45)`).attr("font-size", 6).attr('fill','white');


  function update(filePath: string, name: string) {
    d3.select("#mapTitle" + name).remove();
    if (name == "density") {
      svg
        .append("text")
        .attr("font-size", 14)
        .attr("fill", "white")
        .attr("font-weight", 550)
        .attr("text-anchor", "front")
        .attr("id", "mapTitle" + name)
        .attr("x", 100)
        .attr("y", 40)
        .text("Population Density by County");
    } else {
      svg
        .append("text")
        .attr("font-size", 11)
        .attr("fill", "white")
        .attr("font-weight", 550)
        .attr("text-anchor", "front")
        .attr("id", "mapTitle" + name)
        .attr("x", 50)
        .attr("y", 25)
        .text("Proportion of population that lives farther")
        .append("tspan")
        .attr("x", 50)
        .attr("y", 40)
        .text("than 10 miles from a grocery store by County, 2019");
    }

    d3.json(filePath).then((d: any) => {
      const projection = d3
        .geoIdentity()
        .reflectY(true)
        .fitSize([width, height], d);
      const path = d3.geoPath().projection(projection);
      if (name == "density") {
        d3.selectAll("#lalowi10share" + name).remove();
        d3.selectAll("#labelText" + name).remove();
        d3.select("#textBG" + name).remove();
      } else {
        d3.selectAll("#density" + name).remove();
        d3.selectAll("#labelText" + name).remove();
        d3.select("#textBG" + name).remove();
      }
      if (name == "density") {
        svg
          .selectAll("path")
          .data(d.features)
          .enter()
          .append("path")
          .attr("d", (d: any) => path(d))
          .attr("id", name+ name)
          .attr("fill", function (d: any) {
            if (d.properties.rate == undefined) {
              return "#00FF00"; /* for seeing undefined data purposes */
            } else {
              return colorScale(
                parseInt(d.properties.Pop2010) / d.properties.census_area / 10
              ); /* div 10 so it fits in the colorScale */
            }
          })
          .attr("fill-opacity", 0.8)
          .attr("class", "counties")
          .attr("stroke-opacity", 0.3);
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
          .attr("stroke-opacity", 0.3);
      }
    });
  }
  return {
    element: svg.node()!,
    update,
  };
}
