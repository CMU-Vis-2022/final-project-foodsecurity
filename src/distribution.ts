import * as d3 from "d3";


export function distChart(){
    const width = 800;
    const height = 600;
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

    function update(path){
        d3.csv(path).then((d) =>{
            var heightA = height;
            if(d.length == 2){
                svg.attr("height",250);
                yScale = d3.scaleBand().range([250-margin.bottom,margin.top]).padding(0.1);
                yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
                heightA = 250;
            }
            
            let firstCol = []
            let amts = []
            d.forEach(d => {
                firstCol.push(d.firstCol) 
                amts.push(parseFloat(d.proportion))
            })
            
            yScale.domain(firstCol)
            xScale.domain([0,30])
    
            svg
            .append("g")
            .attr("class", "xaxis")
            .attr("transform", `translate(0, ${heightA-margin.bottom})`);
    
            // Add the y axis
            svg
            .append("g")
            .attr("class", "yaxis")
            .attr("transform", `translate(${margin.left},0)`);
            
            var bars = svg.selectAll('rect')
                          .data(d)
                          .enter()
                          .append('g')
    
            bars
            .append('rect')
            .attr('id',"prop")
            .attr('x',x => xScale(0))
            .attr('y',y => yScale(y.firstCol))
            .attr('height',70)
            .attr('width', (x) =>{ 
                return(xScale(parseFloat(x.proportion)) - xScale(0))
            })
            .style('fill', (x) => colors[2])
            /*
            bars
            .append('rect')
            .attr('id','prop2')
            .attr('x',x => xScale(parseFloat(x.proportion)))
            .attr('y',y => yScale(y.firstCol))
            .attr('height',70)
            .attr('width',(x) => xScale(100) - xScale(parseFloat(x.proportion)))
            .style('fill', colors[1])*/
    
            svg.select<SVGSVGElement>(".xaxis").call(xAxis)
            svg.select<SVGSVGElement>(".yaxis").call(yAxis);
        })
    }
    return{
        element: svg.node()!,
        update,
    };
}

