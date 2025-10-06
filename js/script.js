import { createRacerCard } from "./racercard.js";

const collapseEls = document.querySelectorAll(".collapse");
const toggleBtn = document.getElementById("toggleAllBtn");
//const rootStyle = getComputedStyle(document.documentElement);

// Toggle all details
toggleBtn.addEventListener("click", () => {
  const anyOpen = Array.from(collapseEls).some((el) =>
    el.classList.contains("show")
  );
  collapseEls.forEach((el) => {
    const instance = bootstrap.Collapse.getOrCreateInstance(el);
    anyOpen ? instance.hide() : instance.show();
  });
  toggleBtn.textContent = anyOpen ? "Expand All" : "Collapse All";
});

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
