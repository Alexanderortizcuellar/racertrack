import { createRacerCard } from "./racercard.js";
let solvedChartInstance;
export function generateRacersDashboard(racers) {
  // Compute global aggregates (if you still need them)
  const allPuzzles = racers.flatMap((r) => r.puzzles);
  const globalTotal = allPuzzles.length;
  const globalSolved = allPuzzles.filter((p) => p.solved).length;
  const globalUnsolved = globalTotal - globalSolved;
  const avgTime = (
    allPuzzles.reduce((sum, p) => sum + p.time, 0) / globalTotal
  ).toFixed(2);
  const avgRating = (
    allPuzzles.reduce((sum, p) => sum + p.rating, 0) / globalTotal
  ).toFixed(2);
  const avgScore = (
    racers.reduce((sum, r) => sum + r.score, 0) / racers.length
  ).toFixed(2);

  let statsUl = document.getElementById("kpi-grid");
  if (statsUl) {
    statsUl.innerHTML = "";
    for (const [key, value] of Object.entries({
      "Total Racers": racers.length,
      "Total Puzzles": globalTotal,
      Solved: globalSolved,
      Unsolved: globalUnsolved,
      "Avg Time": avgTime,
      "Avg Rating": avgRating,
      "Avg Score": avgScore,
    })) {
      let li = document.createElement("div");
      //li.classList.add("col-6", "col-md-4");
      li.classList.add("kpi-card");
      li.innerHTML = `<strong>${key}:</strong> ${value}`;
      statsUl.appendChild(li);
    }
  }
  createdoughnutChart(globalSolved, globalUnsolved);
  let containerDiv = document.createElement("div");
  //containerDiv.classList.add("container");
  containerDiv.id = "containerDynamic";

  // Add any overall insights if needed...
  let html = `<div class="racer-grid">`;

  racers.forEach((racer) => {
    html += createRacerCard(racer);
  });

  html += `</div></div>`;
  containerDiv.innerHTML = html;
  return containerDiv;
}

export function filterRacers(date, racers) {
  //let today = new Date().toISOString().split("T")[0];
  date = new Date(date);
  let formattedDate = date.toISOString().split("T")[0];
  racers = racers.filter((r) => r.date === formattedDate);

  return racers;
}

export function getRacers(date) {
  fetch("./data/racers.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      let container = document.getElementById("containerDynamic");
      if (container) {
        container.remove();
      }
      data = filterRacers(date, data);
      const containerDiv = generateRacersDashboard(data);
      document.getElementById("dashboardContainer").appendChild(containerDiv);
    })
    .catch((error) => console.error("Error loading JSON:", error));
}

export function createdoughnutChart(globalSolved, globalUnsolved) {
  const rootStyle = getComputedStyle(document.documentElement);
  const accentStart = rootStyle.getPropertyValue("--accent-start").trim();
  const accentEnd = rootStyle.getPropertyValue("--accent-end").trim();
  const scatterColor = rootStyle.getPropertyValue("--chart-scatter").trim();
  const ctx = document.getElementById("solvedChart").getContext("2d");
  if (solvedChartInstance) {
    solvedChartInstance.destroy();
  }
  // gradient for “Solved” slice
  const grad = ctx.createLinearGradient(0, 0, 0, 300);
  grad.addColorStop(0, accentStart);
  grad.addColorStop(1, accentEnd);
  solvedChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Solved", "Unsolved"],
      datasets: [
        {
          data: [globalSolved, globalUnsolved],
          backgroundColor: [grad, scatterColor],
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Puzzles Solved vs Unsolved",
        },
      },
    },
  });
}
