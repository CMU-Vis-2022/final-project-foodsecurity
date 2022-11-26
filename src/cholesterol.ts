import * as d3 from "d3";

export function cholesterolChart(){
    const width = 400;
    const height = 600;
    const margin = { top: 100, right: 0, bottom: 100, left: 50 };

    const xRange = [margin.left, width];
    const yRange = [height-margin.bottom,margin.top];


    const xScale = d3.scaleBand().range(xRange).padding(0.1);
    const yScale = d3.scaleLinear().range(yRange);

    const xAxis = d3.axisBottom(xScale).ticks(width/10);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])

    const bars = svg.append("g").attr("fill", "#EB736B");

    d3.csv("./src/cholestBinned.csv").then(d => {
        let bins = []
        let amts = []
        d.forEach(x =>{
            bins.push(x.bin)
            amts.push(parseInt(x.numHighTrig));
        })
        xScale.domain(bins);
        yScale.domain([0,d3.max(amts)]);
        let I = d3.range(bins.length);

        svg
        .append("g")
        .attr("class", "xaxis")
        .attr("transform", `translate(0, ${height-margin.bottom})`);

        svg
        .append("g")
        .attr("class", "yaxis")
        .attr("transform", `translate(${margin.left},0)`);

        bars
        .selectAll("rect")
        .data(I)
        .join("rect")
        .attr("x", (i) => {
            return xScale(bins[i])!
        })
        .attr("y", (i) => {
            return yScale(parseInt(amts[i]))
        })
        .attr("width",xScale.bandwidth())
        .attr("height", (i) => {
                return (height-margin.bottom) - yScale(parseInt(amts[i]));
        })
        //.on("mouseover",(d) => { console.log(d.target.__data__)});

        svg.select<SVGSVGElement>(".xaxis").call(xAxis)
        svg.select<SVGSVGElement>(".yaxis").call(yAxis);
        
    })

    svg.append("text")
       .attr("font-size", 14)
       .attr("fill","white")
       .attr("font-weight",550)
       .attr("fill-opacity",1)
       .attr("text-anchor", "front")
       .attr("id","axisLabel")
       .attr("x",width/4)
       .attr("y",height - 50)
       .text("Ratio of income to poverty guideline");
    
    svg.append("text")
       .attr("font-size", 14)
       .attr("fill","white")
       .attr("font-weight",550)
       .attr("fill-opacity",1)
       .attr("text-anchor", "front")
       .attr("id","axisLabel")
       .attr("x",0)
       .attr("y",height/2)
       .attr("transform",`translate(${-width/2 - margin.left - 35},${height/2}) rotate(-90)`)
       .text("Count");

       svg.append("text")
       .attr("font-size",14)
       .attr("fill","white")
       .attr("fill-opacity",1)
       .attr("text-anchor", "front")
       .attr("id","cholesterolTitle")
       .attr("x",width/8)
       .attr("y",30)
       .text("Count of Individuals in 2017-2020 NHANES Survey")
       .append("tspan")
       .attr("x",width/4)
       .attr("y",50)
       .text("With High Triglyceride Levels")
       .append("tspan")
       .attr("x",width/5)
       .attr("y",70)
       .text('By Income to Poverty Guideline Ratio');

    return{
        element: svg.node()!
    };
}
