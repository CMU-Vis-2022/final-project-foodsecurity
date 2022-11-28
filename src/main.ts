import "./style.css";
import * as d3 from "d3";

import { barChart } from "./bar-chart";
import { mapChart } from "./map";
import { cholesterolChart } from "./cholesterol";
import { distChart } from "./distribution";
import { pictChart } from "./pictogram";
import { scatterChart } from "./deeperAnalysis";
import { incomeScatterChart } from "./lowIncomeAnalysis";

import { Int32, Table, Utf8 } from "apache-arrow";
import { db } from "./duckdb";
import parquet from "./weather.parquet?url";



const map = document.querySelector("#mapVis")!;
const chart = mapChart();
const selection = d3.select(map).append("select");
map.appendChild(chart.element);

chart.update('./src/foodData.geojson','rate');

selection.append('option').text("Insecurity Rate")
selection.append('option').text('Percentage of individuals that reside ≥10 miles from a grocery store')
selection.attr('id',"mapSelection")
selection.on('change',(d) =>{
  const choice = selection.property("value");
  if(choice === "Insecurity Rate"){
    chart.update('./src/foodData.geojson',"rate");
  }
  else{
    chart.update('./src/foodAccessData.json',"lalowi10share");
  }
})


const cholesterol = document.querySelector("#whyVis")!;
const cholChart = cholesterolChart();
cholesterol.appendChild(cholChart.element); 


const distr = document.querySelector("#distVis");
const edu = document.querySelector('#eduVis');
const marital = document.querySelector('#maritalVis');
const income = document.querySelector('#incomeVis');
const sector = document.querySelector("#sectorVis");
const picto = document.querySelector("#pictoVis");
const picto2 = document.querySelector("#pictoVis2");
const picto3 = document.querySelector("#pictoVis3");
const picto4 = document.querySelector("#pictoVis4");
const picto5 = document.querySelector("#pictoVis5");
const picto6 = document.querySelector("#pictoVis6");
const picto7 = document.querySelector("#pictoVis7");
const races = document.querySelector("#racialScatter");
const incomeScatter = document.querySelector("#incomeScatter");

const input = document.querySelector("#prompt");
const button = d3.select(input).append("button").attr('id','submitButton');
d3.select(input).append("br")
button.text('Submit')

button.on("click",async () => {
  button.attr('disabled','disabled')

  const entered1 = (<HTMLInputElement>document.getElementById('factors1'))?.value;
  const entered2 = (<HTMLInputElement>document.getElementById('factors2'))?.value;
  const entered3 = (<HTMLInputElement>document.getElementById('factors3'))?.value;
  const entered4 = (<HTMLInputElement>document.getElementById('factors4'))?.value;
  const values = [entered1,entered2, entered3,entered4]
  var displayText = "You said: "
  for(let i =0; i<4; i++){
    if(values[i] !== ""){
      displayText += values[i] + ", "
    }
  }

  const test = document.getElementById('chosen')
  if(test !== null){
    test.innerHTML = displayText.substring(0,displayText.length -2);
  }
  const years = [2019,2020,2021];
  

  const distributionChart = distChart();
  const slide1 = d3.select(distr)
                .append("input")
                .attr("type","range")
                .attr("id","raceVisSlide")
                .attr("style","width:200px")
                .attr("min",0)
                .attr("max",100)
                .attr("step",50)
                .attr('value',0);
  d3.select(distr).append("br")
  slide1.on('change',(event)=>{
    distributionChart.update('./src/raceNumPropJoined.csv',(years[event.target.value/50]).toString(),'race');
  })
  distributionChart.update('./src/raceNumPropJoined.csv',"2019",'race');
  distr?.appendChild(distributionChart.element); 

  const racialProportions = scatterChart();
  const raceSelection = d3.select(races).append("select");
  const locationSelection = d3.select(races).append('select');
  d3.select(races).append("br")

  racialProportions.update("White","All Regions")
  raceSelection.append('option').text("White")
  raceSelection.append('option').text("Black")
  raceSelection.append('option').text("Asian")
  raceSelection.append('option').text("Hispanic")


  locationSelection.append('option').text("All Regions")
  locationSelection.append('option').text("West")
  locationSelection.append('option').text("Midwest")
  locationSelection.append('option').text("South")
  locationSelection.append('option').text("Northeast")
  locationSelection.attr("id","locSelection")

  raceSelection.attr("id","raceSelection")
  raceSelection.on('change',(d) =>{
    const choice = raceSelection.property("value");
    const region = locationSelection.property('value');
    racialProportions.update(choice,region)
  })

  locationSelection.on('change',(d) =>{
    const choice = raceSelection.property("value");
    const region = locationSelection.property('value');
    racialProportions.update(choice,region)
  })

  races?.append(racialProportions.element)

  const slide2 = d3.select(edu)
                .append("input")
                .attr("type","range")
                .attr("id","eduVisSlide")
                .attr("style","width:200px")
                .attr("min",0)
                .attr("max",100)
                .attr("step",50)
                .attr('value',0);
  d3.select(edu).append("br")
  const eduVis = distChart();
  slide2.on('change',(event) => {
    eduVis.update('./src/educationAndInsecurity.csv',(years[event.target.value/50]).toString(),'education');
  })
  eduVis.update('./src/educationAndInsecurity.csv',"2019",'education');
  edu?.appendChild(eduVis.element);

  const slide3 = d3.select(marital)
                  .append("input")
                  .attr("type","range")
                  .attr("id","maritalVisSlide")
                  .attr("style","width:200px")
                  .attr("min",0)
                  .attr("max",100)
                  .attr("step",50)
                  .attr('value',0);
  d3.select(marital).append("br")
  const maritalVis = distChart();
  slide3.on('change',(event)=>{
    maritalVis.update('./src/maritalAndSecurity.csv',years[event.target.value/50].toString(),"marital");
  })
  maritalVis.update('./src/maritalAndSecurity.csv',"2019","marital");
  marital?.appendChild(maritalVis.element);

  const slide4 = d3.select(income)
                .append("input")
                .attr("type","range")
                .attr("id","incomeVisSlide")
                .attr("style","width:200px")
                .attr("min",0)
                .attr("max",100)
                .attr("step",50)
                .attr('value',0);
  d3.select(income).append("br")
  const incomeVis = distChart();
  slide4.on('change',(event)=>{
    incomeVis.update('./src/incomeAndFoodInsecurity.csv',years[event.target.value/50].toString(),"income");
  })
  incomeVis.update('./src/incomeAndFoodInsecurity.csv',"2019","income");
  income?.appendChild(incomeVis.element);

  const incomeScatterVis = incomeScatterChart();
  incomeScatterVis.update("All Regions")
  const incomeLocationSelection = d3.select(incomeScatter).append('select');
  incomeLocationSelection.append('option').text("All Regions")
  incomeLocationSelection.append('option').text("West")
  incomeLocationSelection.append('option').text("Midwest")
  incomeLocationSelection.append('option').text("South")
  incomeLocationSelection.append('option').text("Northeast")
  incomeLocationSelection.attr("id","locSelection")

  incomeLocationSelection.on('change',(d) =>{
    const region = incomeLocationSelection.property('value');
    incomeScatterVis.update(region);
  })

  d3.select(incomeScatter).append('br');
  incomeScatter?.appendChild(incomeScatterVis.element);

  const slide5 = d3.select(sector)
                .append("input")
                .attr("type","range")
                .attr("id","sectorVisSlide")
                .attr("style","width:200px")
                .attr("min",0)
                .attr("max",100)
                .attr("step",50)
                .attr('value',0);
  d3.select(sector).append("br")
  const sectorVis = distChart();
  slide5.on('change',(event)=>{
    sectorVis.update("./src/sectorAndInsecurity.csv",years[event.target.value/50].toString(),'sector');
  })
  sectorVis.update("./src/sectorAndInsecurity.csv","2019",'sector');
  sector?.appendChild(sectorVis.element);
})

const pictoChart = pictChart("Hess1");
picto?.appendChild(pictoChart.element);

const picto2Chart = pictChart("HESC3");
picto2?.appendChild(picto2Chart.element);

const picto3Chart = pictChart("HESS2");
picto3?.appendChild(picto3Chart.element);

const picto4Chart = pictChart("HESH4");
picto4?.appendChild(picto4Chart.element);

const picto5Chart = pictChart("HESH2");
picto5?.appendChild(picto5Chart.element);

const picto6Chart = pictChart("HESS5");
picto6?.appendChild(picto6Chart.element);


const picto7Chart = pictChart("HESSH3");
picto7?.appendChild(picto7Chart.element);

/*
// Create the chart. The specific code here makes some assumptions that may not hold for you.
const chart = barChart();

async function update(location: string) {
  // Query DuckDB for the data we want to visualize.
  const data: Table<{ weather: Utf8; cnt: Int32 }> = await conn.query(`
  SELECT weather, count(*)::INT as cnt
  FROM weather.parquet
  WHERE location = '${location}'
  GROUP BY weather
  ORDER BY cnt DESC`);

  // Get the X and Y columns for the chart. Instead of using Parquet, DuckDB, and Arrow, we could also load data from CSV or JSON directly.
  const X = data.getChild("cnt")!.toArray();
  const Y = data
    .getChild("weather")!
    .toJSON()
    .map((d) => `${d}`);

  chart.update(X, Y);
}

// Load a Parquet file and register it with DuckDB. We could request the data from a URL instead.
const res = await fetch(parquet);
await db.registerFileBuffer(
  "weather.parquet",
  new Uint8Array(await res.arrayBuffer())
);

// Query DuckDB for the locations.
const conn = await db.connect();

const locations: Table<{ location: Utf8 }> = await conn.query(`
SELECT DISTINCT location
FROM weather.parquet`);

// Create a select element for the locations.
const select = d3.select(app).append("select");
for (const location of locations) {
  select.append("option").text(location.location);
}

select.on("change", () => {
  const location = select.property("value");
  update(location);
});

// Update the chart with the first location.
update("Seattle");
*/
// Add the chart to the DOM.

