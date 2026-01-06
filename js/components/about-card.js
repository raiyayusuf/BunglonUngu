export function createAboutCard(cardData, type = "value") {
  const card = document.createElement("div");
  card.className = `about-card ${type}-card`;

  if (type === "value") {
    card.innerHTML = `
      <div class="card-icon">${cardData.icon}</div>
      <h3 class="card-title">${cardData.title}</h3>
      <p class="card-description">${cardData.description}</p>
    `;
  } else if (type === "milestone") {
    card.innerHTML = `
      <div class="milestone-year">${cardData.year}</div>
      <div class="milestone-content">
        <h3>${cardData.event}</h3>
      </div>
    `;
  }

  return card;
}
