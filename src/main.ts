import "./style.css";
import * as d3 from "d3";

import { mapChart } from "./map";
import { cholesterolChart } from "./cholesterol";
import { distChart } from "./distribution";
import { pictChart } from "./pictogram";
import { scatterChart } from "./deeperAnalysis";
import { incomeScatterChart } from "./lowIncomeAnalysis";
import { miniMapChart } from "./miniMap";

import raceNumPropJoined from "./raceNumPropJoined.csv?url";
import incomeAndFoodInsecurity from "./incomeAndFoodInsecurity.csv?url";
import educationAndInsecurity from "./educationAndInsecurity.csv?url";
import sectorAndInsecurity from "./sectorAndInsecurity.csv?url";

window.scrollTo(0, 0);


const map = document.querySelector("#mapVis")!;
const chart = mapChart();
const selection = d3.select(map).append("select");
map.appendChild(chart.element);

chart.update("/src/mapFoodData.geojson", "rate");

selection.append("option").text("Insecurity Rate");
selection.append("option").text("Population Density");
selection
  .append("option")
  .text("Percentage of individuals that reside ≥10 miles from a grocery store");
selection.attr("id", "mapSelection");
selection.on("change", () => {
  const choice = selection.property("value");
  if (choice === "Insecurity Rate") {
    chart.update("/src/mapFoodData.geojson", "rate");
  } else if (choice === "Population Density") {
    chart.update("/src/mapFoodData.geojson", "density");
  } else {
    chart.update("/src/mapFoodData.geojson", "lalowi10share");
  }
});

const miniMap1 = document.querySelector("#miniMap1");
const mini1 = miniMapChart();
miniMap1?.appendChild(mini1.element);
mini1.update("/src/mapFoodData.geojson", "density");

const miniMap2 = document.querySelector("#miniMap2");
const mini2 = miniMapChart();
miniMap2?.appendChild(mini2.element);
mini2.update("/src/mapFoodData.geojson", "lalowi10share");

const cholesterol = document.querySelector("#whyVis")!;
const cholChart = cholesterolChart();
cholesterol.appendChild(cholChart.element);

const distr = document.querySelector("#distVis");
const edu = document.querySelector("#eduVis");
const income = document.querySelector("#incomeVis");
const sector = document.querySelector("#sectorVis");
const picto2 = document.querySelector("#pictoVis2");
const picto3 = document.querySelector("#pictoVis3");
const picto4 = document.querySelector("#pictoVis4");
const picto5 = document.querySelector("#pictoVis5");
const picto6 = document.querySelector("#pictoVis6");
const picto7 = document.querySelector("#pictoVis7");
const races = document.querySelector("#racialScatter");
const incomeScatter = document.querySelector("#incomeScatter");

const input = document.querySelector("#prompt");
const button = d3.select(input).append("button").attr("id", "submitButton");
d3.select(input).append("br");
button.text("Submit");

button.on("click", async () => {
  button.attr("disabled", "disabled");

  const entered1 = (<HTMLInputElement>document.getElementById("factors1"))
    ?.value;
  const entered2 = (<HTMLInputElement>document.getElementById("factors2"))
    ?.value;
  const entered3 = (<HTMLInputElement>document.getElementById("factors3"))
    ?.value;
  const entered4 = (<HTMLInputElement>document.getElementById("factors4"))
    ?.value;
  const values = [entered1, entered2, entered3, entered4];

  let displayText = "You said: ";
  for (let i = 0; i < 4; i++) {
    if (values[i] !== "") {
      displayText += values[i] + ", ";
    }
  }

  const guessed = document.getElementById("chosen");
  if (guessed !== null) {
    guessed.innerHTML = displayText.substring(0,9) + `<span style = 'color: #F7413e;'>` + displayText.substring(9, displayText.length - 2) + '</span>';
  }
  const years = [2019, 2020, 2021];

  /* race bar chart*/

  const distributionChart = distChart();
  const slide1 = d3
    .select(distr)
    .append("input")
    .attr("type", "range")
    .attr("id", "raceVisSlide")
    .attr("style", "width:200px")
    .attr("min", 0)
    .attr("max", 100)
    .attr("step", 50)
    .attr("value", 0);
  d3.select(distr).append("br");
  slide1.on("change", (event) => {
    distributionChart.update(
      raceNumPropJoined,
      years[event.target.value / 50].toString(),
      "race"
    );
  });
  distributionChart.update(raceNumPropJoined, "2019", "race");
  distr?.appendChild(distributionChart.element);

  const narrative = document.getElementById("narrative");
  if (narrative !== null)
    narrative.innerHTML = `</br> There are many systematic factors that correlates with why some groups experience food insecurity while others do not.<br><br></br>
       <span style = 'font-size: 1.5em; font-weight: bold;'> Let's explore these systematic factors.</span><br><br><br><br><br><br>
       <span style = 'font-size: 1.5em; font-weight: bold; color: #F7413e;'> Race</span><br><br>
       In a study published by the NIH, 
       <span style="font-weight: bold"> people of color </span> tend to face higher levels of food insecurity than white peers, 
       with <span style="font-weight: bold"> Hispanics </span>and 
       <span style="font-weight: bold">African Americans </span>
      facing the greatest amount of food insecurity. 
    
      `;
  const distExplain = document.getElementById("distExplain");
  if (distExplain !== null) {
    distExplain.innerHTML = `
    From 2019 to 2021, we can see higher proportions of African Americans along with Native Americans, 
    and Hawaiian/Pacific Islander Americans facing food insecurity than Whites and Asian Americans. 
    There are large fluctuations to the food insecurity rates over time across all races except White Americans. <br><br>

    Additionally, food insecurity rates are seen as positively correlated to the proportion of African Americans in a county's population. <br><br>

    Let’s further analyze this. 
    `;
  }

  /* race scatter chart*/

  const racialProportions = scatterChart();
  const raceSelection = d3.select(races).append("select");
  const locationSelection = d3.select(races).append("select");
  d3.select(races).append("br");

  racialProportions.update("White", "All Regions");
  raceSelection.append("option").text("White");
  raceSelection.append("option").text("Black");
  raceSelection.append("option").text("Asian");
  raceSelection.append("option").text("Hispanic");

  locationSelection.append("option").text("All Regions");
  locationSelection.append("option").text("West");
  locationSelection.append("option").text("Midwest");
  locationSelection.append("option").text("South");
  locationSelection.append("option").text("Northeast");
  locationSelection.attr("id", "locSelection");

  raceSelection.attr("id", "raceSelection");
  raceSelection.on("change", () => {
    const choice = raceSelection.property("value");
    const region = locationSelection.property("value");
    racialProportions.update(choice, region);
  });

  const raceExplain = document.getElementById("raceExplain");
  if (raceExplain !== null) {
    raceExplain.innerHTML = `We see that when considering all regions at once, as white individuals make up a larger proportion of a county's population, 
    the food insecurity rate tends to decrease typically. However, when we consider other races, we see that as African Americans make up a larger
    proportion of a county's population, food insecurity rates of that county tend to go up. The same trend applies for Hispanics. Interestingly, the same
    trend does not seem to appear to hold when considering the proportion of Asians Individuals in a county. <br><br> 
    
    There are variations in this trend when considering each individual geographic region. <br><br> 
    
    In the West, as White, Asian and Black individuals make up a greater proportion of the county's population, generally food insecurity rates remain 
    constant. However, as Hispanic individuals make up a greater proportion of a county's population, food insecurity rates tend to increase. <br><br> 
    
    When considering the Midwest, we see that as the proportion of White indivudals in a county increases, food insecurity rate tends to decrease. 
    However, as Black, Asian and Hispanics make up a greater proporiton of a county's population, food insecurity rates tend to maintain about the same.<br><br> 
    
    In the South, as the proportion of White and Asian indivudals in a county increase, food insecurity rates remain stable. As the proportion of Black 
    individuals increase we can see a clear upward increase in food insecurity rates. For the proportion of Hispanics, typically, it remains 
    constant however we see slightly higher insecurity rates for counties with a higher proportion of Hispanics. <br><br> 
    
    For the Northeast, food insecurity rates tend to remain constant for all races. <br><br><br> 
    
    Beyond race, another factor that correlates with food insecurity is an individual's income. <br><br><br><br><br><br>
    <span style = 'font-size: 1.5em; font-weight: bold; color: #F7413e;'> Income</span><br>`;
  }

  locationSelection.on("change", () => {
    const choice = raceSelection.property("value");
    const region = locationSelection.property("value");
    racialProportions.update(choice, region);
  });

  races?.append(racialProportions.element);

  /* income bar chart*/
  const slide4 = d3
    .select(income)
    .append("input")
    .attr("type", "range")
    .attr("id", "incomeVisSlide")
    .attr("style", "width:200px")
    .attr("min", 0)
    .attr("max", 100)
    .attr("step", 50)
    .attr("value", 0);
  d3.select(income).append("br");
  const incomeVis = distChart();
  slide4.on("change", (event) => {
    incomeVis.update(
      incomeAndFoodInsecurity,
      years[event.target.value / 50].toString(),
      "income"
    );
  });
  incomeVis.update(incomeAndFoodInsecurity, "2019", "income");
  income?.appendChild(incomeVis.element);

  const incomeExplain = document.getElementById("incomeExplain");
  if (incomeExplain !== null) {
    incomeExplain.innerHTML = `We see that over the years, a greater proportion of individuals that earn less than 185% of the poverty income guidelines 
    for their family size experience food insecurity than individuals that earn more than 185% of the poverty income guideline for their family size and 
    that this trend remains constant throughout the years.`;
  }

  const incomeScatterVis = incomeScatterChart();
  incomeScatterVis.update("All Regions");
  const incomeLocationSelection = d3.select(incomeScatter).append("select");
  incomeLocationSelection.append("option").text("All Regions");
  incomeLocationSelection.append("option").text("West");
  incomeLocationSelection.append("option").text("Midwest");
  incomeLocationSelection.append("option").text("South");
  incomeLocationSelection.append("option").text("Northeast");
  incomeLocationSelection.attr("id", "locSelection");

  incomeLocationSelection.on("change", () => {
    const region = incomeLocationSelection.property("value");
    incomeScatterVis.update(region);
  });

  const incomeScatterExplain = document.getElementById("incomeScatterExplain");
  if (incomeScatterExplain !== null) {
    incomeScatterExplain.innerHTML = `We see that many of the counties that face high food insecurity rates also have higher proportions
    of low income individuals. This pattern is replicated across all the regions in the United States. However, interestingly, the Northeast
    tends to have lower proportion of low income individuals than the other regions and thus have counties with a lower food insecurity rate. 
    This could be due to the Northeast be composed of less counties than the other regions. <br><br>

    Aside from race and income there's other factors that are less commonly thought of as factors that also correlate with food insecurity. 
    We'll explore some of these now. <br><br><br><br><br><br> <span style = 'font-size: 1.5em; font-weight: bold; color: #F7413e;'>Education</span>
    `;
  }

  d3.select(incomeScatter).append("br");
  incomeScatter?.appendChild(incomeScatterVis.element);

  const slide2 = d3
    .select(edu)
    .append("input")
    .attr("type", "range")
    .attr("id", "eduVisSlide")
    .attr("style", "width:200px")
    .attr("min", 0)
    .attr("max", 100)
    .attr("step", 50)
    .attr("value", 0);
  d3.select(edu).append("br");
  const eduVis = distChart();
  slide2.on("change", (event) => {
    eduVis.update(
      educationAndInsecurity,
      years[event.target.value / 50].toString(),
      "education"
    );
  });
  eduVis.update(educationAndInsecurity, "2019", "education");
  edu?.appendChild(eduVis.element);

  const eduExplain = document.getElementById("eduExplain");
  if (eduExplain !== null) {
    eduExplain.innerHTML = `
      We see that there's differences in the percentage of people that are food insecure by their education level. As the level of education increases, 
      the graph demonstrates that as the percentage of individuals experiencing food insecurity decreases. Earning a bachelor's degree, 
      the next level of schooling higher than high school, sees a significant
      drop in food insecurity rate. Going higher than bachelor's does not lead to a significant drop. 
      <br><br>
      There's also discrepencies between occupation sectors in the proportion of individuals that are food insecure. 
      <br><br><br><br><br><br> <span style = 'font-size: 1.5em; font-weight: bold; color: #F7413e;'>Occupation Sectors</span>
    `;
  }

  const slide5 = d3
    .select(sector)
    .append("input")
    .attr("type", "range")
    .attr("id", "sectorVisSlide")
    .attr("style", "width:200px")
    .attr("min", 0)
    .attr("max", 100)
    .attr("step", 50)
    .attr("value", 0);
  d3.select(sector).append("br");
  const sectorVis = distChart();
  slide5.on("change", (event) => {
    sectorVis.update(
      sectorAndInsecurity,
      years[event.target.value / 50].toString(),
      "sector"
    );
  });
  sectorVis.update(sectorAndInsecurity, "2019", "sector");
  sector?.appendChild(sectorVis.element);

  const sectorExp = document.getElementById("sectorExplain");
  if (sectorExp !== null) {
    sectorExp.innerHTML = `
      We see that between 2019 and 2020, all sectors aside from healthcare in hospital setting see an increase in the proportion of individuals 
      that are food insecure. This can probably be attributed to the effects of Covid 19. Interestingly, we see that in the healthcare sector, there's 
      a discrepency in the proportion of individuals that are food insecure with regards to if they work in a hospital setting or non hospital setting.
      <br><br> Also, we also see that across the years, sectors remain relatively stable: no sector went from a low proportion of its individuals
      being food insecure to a high proportion and vice versa.     `;
  }
});

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
