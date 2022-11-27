import * as d3 from "d3";



export function mapChart(){
    const width = 1300;
    const height = 600;


    const colorScale = d3.scaleSequential().interpolator(d3.interpolateReds).domain([0,50])
    const svg = d3
                .create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])

    function update(filePath:string,name:string){
        d3.select("#mapTitle").remove()
        svg.append('text')
        .attr("font-size", 14)
        .attr("fill","white")
        .attr("font-weight",550)
        .attr("text-anchor", "front")
        .attr("id","mapTitle")
        .attr('x',(name === 'rate')? 200 : 150)
        .attr('y',30)
        .text((name === 'rate')?"Food Insecurity Rate by County, 2019":"Proportion of population that lives farther than 10 miles from a grocery store by County, 2019")

        function mouseOver(d:any){
            let format = d3.format(".2f")
            d3.select(this).attr("fill-opacity",1)

            d3.select("#labelText").remove();
            d3.select("#textBG").remove();
            if(name == 'rate'){
                let length = Math.max((d.target.__data__.properties.name + " County").length,("percentage" + d.target.__data__.properties.rate).length)
                svg.append("rect")
                   .attr("id","textBG")
                   .attr("fill","#C0C0C0")
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
                        .attr("id","labelText")
                        .attr("x",d.layerX-45)
                        .attr("y",d.offsetY)
                        .text(d.target.__data__.properties.name + " County")
                        .append("tspan")
                        .attr("font-size",11)
                        .attr("x",d.layerX-45)
                        .attr("y",d.offsetY + 20)
                        .text("percentage "+ d.target.__data__.properties.rate)
            }
            else{
                let length = Math.max((d.target.__data__.properties.County).length,("percentage" + d.target.__data__.properties.lalowi10share).length)
                svg.append("rect")
                   .attr("id","textBG")
                   .attr("fill","#C0C0C0")
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
                        .attr("id","labelText")
                        .attr("x",d.layerX-45)
                        .attr("y",d.offsetY)
                        .text(d.target.__data__.properties.County)
                        .append("tspan")
                        .attr("font-size",11)
                        .attr("x",d.layerX-45)
                        .attr("y",d.offsetY + 20)
                        .text("percentage "+ format(d.target.__data__.properties.lalowi10share))
            }
        }
        function mouseOut(d){
            d3.select(this).attr("fill-opacity",0.8)
        }


        d3.json(filePath).then(d => {
            var projection = d3.geoIdentity().reflectY(true).fitSize([(width-250),height],d);
            var path = d3.geoPath().projection(projection)
            if(name == 'rate'){
                d3.selectAll('#lalowi10share').remove();
                d3.selectAll('#labelText').remove();
                d3.select("#textBG").remove();
            }
            else{
                d3.selectAll('#rate').remove();
                d3.selectAll('#labelText').remove();
                d3.select("#textBG").remove();
            }
            if(name == "rate"){
                svg.selectAll("path")
                .data(d.features)
                .enter()
                .append("path")
                .attr('d',path)
                .attr('id',name)
                .attr('fill',function (d){
                    if(d.properties.rate == undefined){
                        return "#00FF00"/* for seeing undefined data purposes */
                    }
                    else{
                        let length = d.properties.rate.length
                        let value = d.properties.rate.substring(0,length-1).toString()
                        return colorScale(value)
                    }
                })
                .attr("fill-opacity",0.8)
                .attr("class", "counties")
                .on("mouseover",mouseOver)
                .on("mouseout",mouseOut)
            }
            else{
                svg.selectAll("path")
                .data(d.features)
                .enter()
                .append("path")
                .attr('d',path)
                .attr('id',name)
                .attr('fill',function (d){
                    if(d.properties.lalowi10share == undefined){
                        return "#00FF00" /* for seeing undefined data purposes */
                    }
                    else{
                        let length = d.properties.lalowi10share.length
                        let value = d.properties.lalowi10share.substring(0,length-1).toString()
                        return colorScale(value)
                    }
                })
                .attr("fill-opacity",0.8)
                .attr("class", "counties")
                .on("mouseover",mouseOver)
                .on("mouseout",mouseOut)
            }
            }
            );
    }
    return {
        element: svg.node()!,
        update
      };
}