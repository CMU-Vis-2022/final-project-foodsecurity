import * as d3 from "d3";

export function distChart() {
  const width = 800;
  const height = 400;
  const margin = { top: 80, right: 50, bottom: 60, left: 200 };

  const xRange = [margin.left, width - margin.right];
  const yRange = [height - margin.bottom, margin.top];

  const xScale = d3.scaleLinear().range(xRange);
  let yScale = d3.scaleBand().range(yRange).padding(0.1);

  const xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

  const colors = ["#EB736B"];

  const svg = d3.create("svg").attr("width", width).attr("height", height);

  function update(path: string, year: string, chart: string) {
    d3.csv(path).then((d) => {
      const firstCol: string[] = [];
      const amts = [];
      const filteredData: any = [];
      d.forEach((d): any => {
        if (d.year == year) {
          firstCol.push(d.firstCol ? d.firstCol : "");
          amts.push(parseFloat(d.proportion ? d.proportion : ""));
          filteredData.push(d);
        }
      });

      let heightA = height;
      if (filteredData.length == 2) {
        svg.attr("height", 250);
        yScale = d3
          .scaleBand()
          .range([250 - margin.bottom, margin.top])
          .padding(0.1);
        yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
        heightA = 250;
      } else if (filteredData.length == 12) {
        svg.attr("height", 650);
        yScale = d3
          .scaleBand()
          .range([650 - margin.bottom, margin.top])
          .padding(0.1);
        yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
        heightA = 650;
      }
      yScale.domain(firstCol);
      xScale.domain([0, 30]);

      d3.selectAll("#" + chart).remove();
      svg
        .append("g")
        .attr("class", "xaxis")
        .attr("id", chart)
        .attr("transform", `translate(0, ${heightA - margin.bottom})`);

      // Add the y axis
      svg
        .append("g")
        .attr("class", "yaxis")
        .attr("id", chart)
        .attr("transform", `translate(${margin.left},0)`);

      const bars = svg.selectAll("rect").data(filteredData).enter().append("g");
      const texts = svg
        .append("g")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);
      bars
        .append("rect")
        .attr("id", chart)
        .attr("x", xScale(0))
        .attr("y", (y: any): any => {
          if (y.firstCol !== undefined) {
            return yScale(y.firstCol);
          }
        })
        .attr("height", 40)
        .attr("width", (x: any) => {
          return xScale(parseFloat(x.proportion)) - xScale(0);
        })
        .style("fill", colors[0]);

      texts
        .selectAll("texts")
        .data(filteredData)
        .join("text")
        .attr("id", chart)
        .attr("x", (x: any) => xScale(parseFloat(x.proportion)) - 5)
        .attr("y", (y: any) => yScale(y.firstCol)! + 20)
        .text((x: any) => parseFloat(x.proportion).toFixed(2) + "%");

      svg
        .append("text")
        .attr("font-size", 14)
        .attr("fill", "white")
        .attr("font-weight", 400)
        .attr("text-anchor", "front")
        .attr("x", 100)
        .attr("y", 60)
        .text(
          "Percentage of individuals in current population survey that are food insecure by their " +
            (chart == "marital"
              ? chart + " status"
              : chart == "sector"
              ? "industry"
              : chart)
        );

      svg
        .append("text")
        .attr("font-size", 14)
        .attr("fill", "white")
        .attr("font-weight", 400)
        .attr("text-anchor", "front")
        .attr("id", chart)
        .attr("x", 700)
        .attr("y", 85)
        .text("Year: " + year);

      svg
        .append("text")
        .attr("font-size", 14)
        .attr("fill", "white")
        .attr("font-weight", 400)
        .attr("text-anchor", "front")
        .attr("x", 10)
        .attr("y", 10)
        .text("2019");

      svg
        .append("text")
        .attr("font-size", 14)
        .attr("fill", "white")
        .attr("font-weight", 400)
        .attr("text-anchor", "front")
        .attr("x", 180)
        .attr("y", 10)
        .text("2021");

      svg
        .append("text")
        .attr("font-size", 12)
        .attr("fill", "white")
        .attr("font-weight", 400)
        .attr("text-anchor", "front")
        .attr("x", 300)
        .attr("y", () => {
          if (filteredData.length == 12) {
            return 635;
          } else if (filteredData.length == 2) {
            return 225;
          } else {
            return 375;
          }
        })
        .text("Percentage of Individuals that experience food insecurity");

      svg.select<SVGSVGElement>(".xaxis").call(xAxis);
      svg.select<SVGSVGElement>(".yaxis").call(yAxis);
    });
  }
  return {
    element: svg.node()!,
    update,
  };
}
