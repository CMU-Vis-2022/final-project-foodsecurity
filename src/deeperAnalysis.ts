import * as d3 from "d3";
import insecurityAndProportions from "./insecurityAndProportions.csv?url";

export function scatterChart() {
  const margin = { top: 0, right: 100, bottom: 50, left: 150 };

  const width = 800;
  const height = 500;

  const xRange = [margin.left, width - margin.right];
  const yRange = [margin.top, height - margin.bottom];

  const xScale = d3.scaleLinear().range(xRange).domain([0, 105]);
  const yScale = d3.scaleLinear().range(yRange).domain([36, 0]);

  const xAxis = d3.axisBottom(xScale).ticks(9);
  const yAxis = d3.axisLeft(yScale).ticks(9);

  const svg = d3.create("svg").attr("width", width).attr("height", height);

  svg
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", `translate(0,${height - margin.bottom})`);

  svg
    .append("g")
    .attr("class", "yaxis")
    .attr("transform", `translate(${margin.left},0)`);

  const dots = svg.append("g");

  function update(race: string, region: string) {
    d3.selectAll("#displayInfoText").remove();
    d3.selectAll("#displayXlabel").remove();

    svg
      .append("text")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 500)
      .attr("fill-opacity", 1)
      .attr("text-anchor", "front")
      .attr("id", "displayXlabel")
      .attr("x", width / 2 - 100)
      .attr("y", height - margin.bottom / 3)
      .text("Percentage of population that is " + race);

    svg
      .append("text")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("fill-opacity", 1)
      .attr("text-anchor", "front")
      .attr("id", "displayYlabel")
      .attr("x", 0)
      .attr("y", height / 2)
      .attr("transform", `translate(${-margin.left},${height / 2}) rotate(-90)`)
      .text("Food Insecurity Rate");

    svg
      .append("text")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 550)
      .attr("fill-opacity", 1)
      .attr("text-anchor", "front")
      .attr("id", "raceScatterTitle")
      .attr("x", 200)
      .attr("y", 10)
      .text("Food Insecurity Rates vs Percentage of County Population of a given race");

    function displayInfo(d: any) {
      let displayNum = 0;
      console.log(d);
      if (race == "White") displayNum = d.target.__data__.numWhite;
      else if (race == "Black") displayNum = d.target.__data__.numBlack;
      else if (race == "Asian") displayNum = d.target.__data__.numAsian;
      else displayNum = d.target.__data__.numHispanic;
      console.log(race);
      console.log(d);
      d3.selectAll("#displayInfoText").remove();
      svg
        .append("text")
        .attr("font-size", 12)
        .attr("fill", "white")
        .attr("font-weight", 400)
        .attr("fill-opacity", 1)
        .attr("text-anchor", "front")
        .attr("id", "displayInfoText")
        .attr("x", d.offsetX - 130)
        .attr("y", d.offsetY - 90)
        .text(d.target.__data__.county)
        .append("tspan")
        .attr("font-size", 12)
        .attr("x", d.offsetX - 130)
        .attr("y", d.offsetY - 70)
        .text("Insecurity Rate " + d.target.__data__.insecurityRate)
        .append("tspan")
        .attr("font-size", 11)
        .attr("x", d.offsetX - 130)
        .attr("y", d.offsetY - 50)
        .text(
          d.target.__data__.county.includes("Oglala")
            ? "No Data"
            : d.target.__data__.county.includes("Kusilvak")
            ? "No Data"
            : "Number of Food Insecure Individuals " +
              d.target.__data__.numInsecure
        )
        .append("tspan")
        .attr("font-size", 11)
        .attr("x", d.offsetX - 130)
        .attr("y", d.offsetY - 30)
        .text(
          d.target.__data__.county.includes("Oglala")
            ? "No Data"
            : d.target.__data__.county.includes("Kusilvak")
            ? "No Data"
            : "Number of individuals who race is " + race + ": " + displayNum
        );
    }
    let regionCode = 0;
    if (region == "West") regionCode = 1;
    else if (region == "Midwest") regionCode = 2;
    else if (region == "Northeast") regionCode = 3;
    else if (region == "South") regionCode = 4;

    d3.selectAll("#raceCircles").remove();
    d3.csv(insecurityAndProportions).then((d) => {
      dots
        .selectAll("circle")
        .data(d)
        .enter()
        .append("circle")
        .attr("id", "raceCircles")
        .attr("cx", (x) => {
          if (regionCode == 0) {
            if (race == "White")
              return xScale(x.pWhite === undefined ? 0 : parseFloat(x.pWhite));
            else if (race == "Black")
              return xScale(x.pBlack === undefined ? 0 : parseFloat(x.pBlack));
            else if (race == "Hispanic")
              return xScale(
                x.pHispanic === undefined ? 0 : parseFloat(x.pHispanic)
              );
            else
              return xScale(x.pAsian === undefined ? 0 : parseFloat(x.pAsian));
          } else {
            if (
              race == "White" &&
              parseInt(x.region === undefined ? "" : x.region) == regionCode
            ) {
              return xScale(x.pWhite === undefined ? 0 : parseFloat(x.pWhite));
            } else if (
              race == "Black" &&
              parseInt(x.region === undefined ? "" : x.region) == regionCode
            ) {
              return xScale(x.pBlack === undefined ? 0 : parseFloat(x.pBlack));
            } else if (
              race == "Hispanic" &&
              parseInt(x.region === undefined ? "" : x.region) == regionCode
            ) {
              return xScale(
                x.pHispanic === undefined ? 0 : parseFloat(x.pHispanic)
              );
            } else if (
              race == "Asian" &&
              parseInt(x.region === undefined ? "" : x.region) == regionCode
            ) {
              return xScale(x.pAsian === undefined ? 0 : parseFloat(x.pAsian));
            } else {
              return -500;
            }
          }
        })
        .attr("cy", (x) =>
          yScale(
            parseFloat(
              x.insecurityRate === undefined
                ? ""
                : x.insecurityRate.slice(0, -1)
            )
          )
        )
        .attr("r", 1.5)
        .style("fill", "#FF0000")
        .on("mouseover", displayInfo);

      svg.select<SVGSVGElement>(".xaxis").call(xAxis);
      svg.select<SVGSVGElement>(".yaxis").call(yAxis);
    });

    /* referenced https://www.freecodecamp.org/news/get-ready-to-zoom-and-pan-like-a-pro-after-reading-this-in-depth-tutorial-5d963b0a153e/ to understand zoom */
    const onZoom = d3
      .zoom<SVGSVGElement, undefined>()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([1, 8])
      .translateExtent([[50,50],[width,height]])
      .on("zoom", zoomed);

    function zoomed({ transform }: any) {
      const xAxisScaled = transform.rescaleX(xScale);
      console.log(xAxisScaled)
      const yAxisScaled = transform.rescaleY(yScale);
      xAxis.scale(xAxisScaled);
      yAxis.scale(yAxisScaled);
      svg.select<SVGSVGElement>(".xaxis").call(xAxis);
      svg.select<SVGSVGElement>(".yaxis").call(yAxis);

      dots
        .selectAll("circle")
        .attr("cx", (x: any) => {
          let value;
          if (regionCode == 0) {
            if (race == "White") value = xAxisScaled(x.pWhite);
            else if (race == "Black") value = xAxisScaled(x.pBlack);
            else if (race == "Asian") value = xAxisScaled(x.pAsian);
            else value = xAxisScaled(x.pHispanic);
          } else {
            if (
              race == "White" &&
              parseInt(x.region === undefined ? "" : x.region) == regionCode
            ) {
              value = xAxisScaled(
                x.pWhite === undefined ? 0 : parseFloat(x.pWhite)
              );
            } else if (
              race == "Black" &&
              parseInt(x.region === undefined ? "" : x.region) == regionCode
            ) {
              value = xAxisScaled(
                x.pBlack === undefined ? 0 : parseFloat(x.pBlack)
              );
            } else if (
              race == "Hispanic" &&
              parseInt(x.region === undefined ? "" : x.region) == regionCode
            ) {
              value = xAxisScaled(
                x.pHispanic === undefined ? 0 : parseFloat(x.pHispanic)
              );
            } else if (
              race == "Asian" &&
              parseInt(x.region === undefined ? "" : x.region) == regionCode
            ) {
              value = xAxisScaled(
                x.pAsian === undefined ? 0 : parseFloat(x.pAsian)
              );
            } else {
              value = -500;
            }
          }

          if (value < margin.left) {
            return -500;
          } else {
            return value;
          }
        })
        .attr("cy", (y: any) => {
          const value = yAxisScaled(parseFloat(y.insecurityRate.slice(0, -1)));
          if (value > height - margin.bottom) {
            return 8000;
          } else {
            return value;
          }
        });
    }
    svg.call(onZoom);
  }
  return {
    element: svg.node()!,
    update,
  };
}
