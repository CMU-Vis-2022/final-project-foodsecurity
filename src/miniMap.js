import * as d3 from "d3";

export function miniMapChart() {
  const width = 1300;
  const height = 600;

  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateReds)
    .domain([0, 40]);
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  function update(filePath, name) {
    d3.select("#miniMapTitle"+name).remove();
    svg
      .append("text")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 550)
      .attr("text-anchor", "front")
      .attr("id", "miniMapTitle"+name)
      .attr("x", name === "rate" ? 200 : 150)
      .attr("y", 30)
      .text(
        name === "rate"
          ? "Food Insecurity Rate by County, 2019"
          : name === "density"
          ? "Population density by County"
          : "Proportion of population that lives farther than 10 miles from a grocery store by County, 2019"
      );

    function mouseOver(this, d) {
      const format = d3.format(".2f");
      d3.select(this).attr("fill-opacity", 1);

            d3.select("#labelText" + name).remove();
            d3.select("#textBG" + name).remove();
            if(name == 'rate'){
                let length = Math.max((d.target.__data__.properties.name + " County").length,("percentage" + d.target.__data__.properties.rate).length)
                svg.append("rect")
                   .attr("id","textBG" + name)
                   .attr("fill","#b89a98")
                   .attr("stroke","#565656")
                   .attr("stroke-width","1")
                   .attr("x",d.layerX-55)
                   .attr("y",d.offsetY-20)
                   .attr("width",length * 10)
                   .attr("height",50)
    
                svg.append("text")
                        .attr("font-size", 14)
                        .attr("fill","white")
                        .attr("font-weight",550)
                        .attr("fill-opacity",1)
                        .attr("text-anchor", "front")
                        .attr("id","labelText" + name)
                        .attr("x",d.layerX-45)
                        .attr("y",d.offsetY)
                        .text(d.target.__data__.properties.name + " County")
                        .append("tspan")
                        .attr("font-size",11)
                        .attr("x",d.layerX-45)
                        .attr("y",d.offsetY + 20)
                        .text("Insecurity Rate: ")
                        .append("tspan")
                        .attr("fill", "#7d312c")
                        .text(d.target.__data__.properties.rate)
            }
            else{
                let length = Math.max((d.target.__data__.properties.County).length,("percentage" + d.target.__data__.properties.lalowi10share).length)
                svg.append("rect")
                   .attr("id","textBG"+name)
                   .attr("fill","#b89a98")
                   .attr("stroke","#7d312c")
                   .attr("stroke-width","1")
                   .attr("x",d.layerX-55)
                   .attr("y",d.offsetY-20)
                   .attr("width",length * 10.5)
                   .attr("height",65)
    
                svg.append("text")
                        .attr("font-size", 14)
                        .attr("fill","white")
                        .attr("font-weight",550)
                        .attr("fill-opacity",1)
                        .attr("text-anchor", "front")
                        .attr("id","labelText" + name)
                        .attr("x",d.layerX-45)
                        .attr("y",d.offsetY)
                        .text(d.target.__data__.properties.County)
                        .append("tspan")
                        .attr("font-size",11)
                        .attr("x",d.layerX-45)
                        .attr("y",d.offsetY + 20)
                        .text("Low income individuals that live")
                        .append("tspan")
                        .attr("x",d.offsetX > 800?d.offsetX - 7*length:d.offsetX+35)
                        .attr("y",d.offsetY + 32)
                        .text("≥ 10 miles from a grocery store: ")
                        .append("tspan")
                        .attr("fill", "#7d312c")
                        .text(format(d.target.__data__.properties.lalowi10share))
            }
        }
        function mouseOut(this){
            d3.select(this).attr("fill-opacity",0.8)
        }

    d3.json(filePath).then((d) => {
      const projection = d3
        .geoIdentity()
        .reflectY(true)
        .fitSize([width - 250, height], d);
      const path = d3.geoPath().projection(projection);
      if (name == "rate") {
        d3.selectAll("#lalowi10share" + name ).remove();
        d3.selectAll("#labelText" + name ).remove();
        d3.select("#textBG" + name).remove();
        d3.selectAll("#density" + name).remove();
      } else {
        d3.selectAll("#density" + name ).remove();
        d3.selectAll("#rate" + name).remove();
        d3.selectAll("#labelText" + name).remove();
        d3.select("#textBG" + name).remove();
      }
      if (name == "rate") {
        console.log();
        svg
          .selectAll("path")
          .data(d.features)
          .enter()
          .append("path")
          .attr("d", (d) => path(d))
          .attr("id", name)
          .attr("fill", function (d) {
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
          .on("mouseover", mouseOver)
          .on("mouseout", mouseOut);
      }else {
        svg
          .selectAll("path")
          .data(d.features)
          .enter()
          .append("path")
          .attr("d", (d) => path(d))
          .attr("id", name)
          .attr("fill", function (d) {
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
          .on("mouseover", mouseOver)
          .on("mouseout", mouseOut);
      }
    });
  }
  return {
    element: svg.node(),
    update,
  };
}
