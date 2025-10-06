import { createRacerCard } from "./racercard.js";

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

  let containerDiv = document.createElement("div");
  containerDiv.classList.add("container");

  // Add any overall insights if needed...
  let html = `<div class="racer-grid">`;

  racers.forEach((racer) => {
    html += createRacerCard(racer);
  });

  html += `</div></div>`;
  containerDiv.innerHTML = html;
  return containerDiv;
}

export function filterRacers(condition, racers) {
  if (condition === "today") {
    //let today = new Date().toISOString().split("T")[0];
    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 2);

    let formattedYesterday = yesterday.toISOString().split("T")[0];
    console.log(formattedYesterday); // ej. "2025-10-04"

    racers = racers.filter((r) => r.date === formattedYesterday);
  } else if (condition === "this-week") {
    return [];
  } else if (condition === "this-month") {
    return [];
  }

  return racers;
}
