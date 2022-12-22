import * as d3 from "d3";
import howItFeelsActual from "./howItFeelsActual.csv?url";
import person from "./person.png?url"; /* image source = shorturl.at/vxFST*/

export function pictChart(col: string) {
  const width = 800;
  const height = 500;

  const svg = d3.create("svg").attr("width", width).attr("height", height);

  d3.csv(howItFeelsActual).then((d) => {
    const rows = 10;
    const cols = 10;
    let data = [0];
    let numShade = 0;
    let numAffected = 0;
    let numTotal = 0;
    d.forEach((d) => {
      if (d.col == col) {
        data = d.numDisplay ? d3.range(parseInt(d.numDisplay)) : [];
        numShade = d.NumShade ? parseInt(d.NumShade) : 0;
        numAffected = d.numAffected ? parseInt(d.numAffected) : 0;
        numTotal = d.total ? parseInt(d.total) : 0;
      }
    });
    const yDomain = d3.range(rows).map((d) => d.toString());
    const heightA = 900;

    const yScale = d3.scaleBand().range([100, heightA]).domain(yDomain);
    const xScale = d3
      .scaleBand()
      .range([0, 800])
      .domain(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    const elem = svg.append("g").attr("transform", "translate(10,10)");

    //creating the main graph
    elem
      .selectAll("image")
      .data(data)
      .enter()
      .append("svg:image")
      .attr(
        "xlink:href",
        person
      ) 
      .attr("transform", "scale(0.4)")
      .attr("x", (d): any => {
        return xScale((d % cols).toString());
      })
      .attr("y", (d): any => {
        return yScale(Math.floor(d / cols).toString());
      })
      .attr("class", (d) => {
        if (d < numShade) {
          return "affectedPerson";
        } else {
          return "notAffected";
        }
      });
    
    //legend Not
    elem
      .append("svg:image")
      .attr("id", "scaleImage")
      .attr("xlink:href", person)
      .attr("transform", "scale(0.3)")
      .attr("x", 10)
      .attr("y", () => {
          return 1420;
      })
      .attr('class',"notAffected");
    //legend affected
    elem
      .append("svg:image")
      .attr("id", "scaleImage")
      .attr("xlink:href", person)
      .attr("transform", "scale(0.3)")
      .attr("class", "affectedPerson")
      .attr("x", 10)
      .attr("y", () => {
          return 1300;
      });
    
    //label text
    svg
      .append("text")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 550)
      .attr("text-anchor", "front")
      .attr("id", "scaleImageLabel")
      .attr("x", 50)
      .attr("y", () => {
          return 460;
      })
      .text("= 1% of surveyed individuals statement is not applicable to");

    svg
      .append("text")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 550)
      .attr("text-anchor", "front")
      .attr("id", "scaleImageLabel")
      .attr("x", 50)
      .attr("y", () => {
          return 420;
      })
      .text("= 1% of surveyed individuals statement applies to");

    svg
      .append("text")
      .attr("font-size", 24)
      .attr("fill", "red")
      .attr("font-weight", 700)
      .attr("text-anchor", "front")
      .attr("x", () => {
          return 10;
      })
      .attr("y", () => {
          return 30;
      })
      .text(numAffected) /* "applied to them out of " + numTotal + " asked"*/
      .append("tspan")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 550)
      .attr("text-anchor", "front")
      .attr("x", 75)
      .attr("y", () => {
          return 30;
        
      })
      .text(" individuals said ")
      .append("tspan")
      .attr("font-size", 14)
      .attr("fill", "red")
      .attr("font-weight", 550)
      .attr("text-anchor", "front")
      .attr("x", 195)
      .attr("y", () => {
          return 30;
      })
      .text("this statement applied to them")
      .append("tspan")
      .attr("font-size", 14)
      .attr("fill", "white")
      .attr("font-weight", 550)
      .attr("text-anchor", "front")
      .attr("x", 415)
      .attr("y", () => {
          return 30;
      })
      .text("out of " + numTotal + " asked");
  });
  return {
    element: svg.node()!,
  };
}
