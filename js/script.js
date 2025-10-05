document.addEventListener("DOMContentLoaded", () => {
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
});

function generateRacersDashboard(racers, date) {
  // --- Compute global aggregates ---
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

  // --- Build the HTML ---
  let html = `
  <div class="container">
    <!-- ADDITIONAL INSIGHTS -->


    <!-- RACERS GRID -->
    <div class="racer-grid">
  `;

  // --- Racers section ---
  racers.forEach((racer) => {
    const totalR = racer.puzzles.length;
    const solvedR = racer.puzzles.filter((p) => p.solved).length;
    const avgTimeR = (
      racer.puzzles.reduce((s, p) => s + p.time, 0) / totalR
    ).toFixed(2);
    const avgRatingR = (
      racer.puzzles.reduce((s, p) => s + p.rating, 0) / totalR
    ).toFixed(2);
    const progress = Math.round((solvedR / totalR) * 100);

    html += `
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-0">Racer #${racer.id}</h5>
            <small class="text-muted">Rank ${racer.rank} • Score ${
      racer.score
    }</small>
          </div>
          <button class="btn btn-sm btn-outline-secondary" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#details-${racer.id}" 
                  aria-expanded="false">
            Details
          </button>
        </div>

        <div class="card-body">
          <div class="mb-3">
            <div class="d-flex justify-content-between">
              <small>Progress</small>
              <small>${progress}%</small>
            </div>
            <div class="progress" style="height:8px">
              <div class="progress-bar progress-gradient" role="progressbar" 
                   style="width:${progress}%;" 
                   aria-valuenow="${progress}" 
                   aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>

          <div class="collapse" id="details-${racer.id}">
            <ul class="list-unstyled stats-list row gx-3 mb-3">
              <li class="col-6"><strong>Players:</strong> ${racer.players}</li>
              <li class="col-6"><strong>Puzzles Done:</strong> ${
                racer.puzzles_done
              }</li>
              <li class="col-6"><strong>Solved:</strong> ${solvedR}</li>
              <li class="col-6"><strong>Unsolved:</strong> ${
                totalR - solvedR
              }</li>
              <li class="col-6"><strong>Avg Time:</strong> ${avgTimeR}s</li>
              <li class="col-6"><strong>Avg Rating:</strong> ${avgRatingR}</li>
            </ul>

            <div style="max-height:220px;overflow-y:auto">
              <table class="table table-sm mb-0">
                <thead class="table-light">
                  <tr><th>Puzzle</th><th>Rating</th><th>Status</th><th>Time</th></tr>
                </thead>
                <tbody>
    `;

    racer.puzzles.forEach((p) => {
      html += `
        <tr>
          <td><a href="https://lichess.org/training/${
            p.lichess_id
          }" target="_blank">${p.lichess_id}</a></td>
          <td>${p.rating}</td>
          <td><span class="badge ${
            p.solved ? "badge-solved" : "badge-unsolved"
          }">${p.solved ? "✔" : "✘"}</span></td>
          <td>${p.time}s</td>
        </tr>
      `;
    });

    html += `
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  html += `
    </div>
  </div>`;

  return html;
}
