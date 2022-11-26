import * as d3 from "d3";


export function distChart(){
    const width = 800;
    const height = 350;
    const margin = { top: 30, right: 50, bottom: 60, left: 200 };

    const xRange = [margin.left,width-margin.right];
    const yRange = [height-margin.bottom,margin.top];

    const xScale = d3.scaleLinear().range(xRange)
    var yScale = d3.scaleBand().range(yRange).padding(0.1);

    const xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    const colors = ['#648FFF','#785EF0','#DC267F','#FE6100','#FFB000']
    
    const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)

    function update(path:string,year:string,chart:string){
        d3.csv(path).then((d) =>{
            let firstCol:string[] = []
            let amts = []
            let filteredData :{firstCol:string, numInsecure:number, total:number, proportion: string, year:number}[] = []
            d.forEach(d => {
                if(d.year == year){
                    firstCol.push(d.firstCol?d.firstCol:"") 
                    amts.push(parseFloat(d.proportion?d.proportion:""))
                    filteredData.push(d)
                }
            })

            var heightA = height;
            if(filteredData.length == 2){
                svg.attr("height",200);
                yScale = d3.scaleBand().range([200-margin.bottom,margin.top]).padding(0.1);
                yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
                heightA = 200;
            }
            else if (filteredData.length == 12){
                svg.attr("height",600);
                yScale = d3.scaleBand().range([600-margin.bottom,margin.top]).padding(0.1);
                yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
                heightA = 600;

            }
            yScale.domain(firstCol)
            xScale.domain([0,30])
            
            d3.selectAll('#'+chart).remove();
            svg
            .append("g")
            .attr("class", "xaxis")
            .attr("id",chart)
            .attr("transform", `translate(0, ${heightA-margin.bottom})`);
    
            // Add the y axis
            svg
            .append("g")
            .attr("class", "yaxis")
            .attr('id',chart)
            .attr("transform", `translate(${margin.left},0)`);

            const bars = svg.selectAll('rect')
                          .data(filteredData)
                          .enter()
                          .append('g')
            const texts = svg
                          .append("g")
                          .attr("fill", "white")
                          .attr("text-anchor", "end")
                          .attr("font-family", "sans-serif")
                          .attr("font-size", 10);
            bars
            .append('rect')
            .attr('id',chart)
            .attr('x',x => xScale(0))
            .attr('y', (y) => {
                if(y.firstCol !== undefined){
                    return yScale(y.firstCol)
                }
            })
            .attr('height',40)
            .attr('width', (x) =>{ 
                return(xScale(parseFloat(x.proportion)) - xScale(0))
            })
            .style('fill', (x) => colors[2])

            texts.selectAll('texts')
            .data(filteredData)
            .join('text')
            .attr('id', chart)
            .attr('x',(x) => xScale(parseFloat(x.proportion))-5)
            .attr('y',(y) => yScale(y.firstCol) +20)
            .text((x) => parseFloat(x.proportion).toFixed(2) + "%")

            
    
            svg.select<SVGSVGElement>(".xaxis").call(xAxis)
            svg.select<SVGSVGElement>(".yaxis").call(yAxis);
        })
    }
    return{
        element: svg.node()!,
        update,
    };
}

