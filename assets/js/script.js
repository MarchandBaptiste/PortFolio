fetch("./assets/json/projects.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("projects-container");

    data.forEach(project => {
      const card = document.createElement("div");
      card.classList.add("project-card");
      card.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <h3>${project.title}</h3>
      `;

      // Clic sur la card
      card.addEventListener("click", () => {
        document.getElementById("modal-title").textContent = project.title;
        document.getElementById("modal-img").src = project.image;
        document.getElementById("modal-desc").textContent = project.description;
        document.getElementById("modal-link").href = project.link;

        document.getElementById("project-modal").style.display = "block";
      });

      container.appendChild(card);
    });
  });

// Fermer modal
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("project-modal").style.display = "none";
});
