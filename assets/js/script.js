document.addEventListener('DOMContentLoaded', () => {
  // Charger et injecter les projets
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
          const titleEl = document.getElementById("modal-title");
          const imgEl = document.getElementById("modal-img");
          const descEl = document.getElementById("modal-desc");
          const linkEl = document.getElementById("modal-link");
          const modal = document.getElementById("project-modal");

          if (titleEl) titleEl.textContent = project.title;
          if (imgEl) imgEl.src = project.image;
          if (descEl) descEl.textContent = project.description;
          if (linkEl) linkEl.href = project.link;
          if (modal) modal.style.display = "block";
        });

        container.appendChild(card);
      });
    })

  // Fermer modal
  const closeBtn = document.getElementById("close-modal");
  const modal = document.getElementById("project-modal");
  // Fermer en cliquant sur la croix
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Fermer en cliquant en dehor de l'overlay
  if (modal) {
    modal.addEventListener('click', (e) => {
      // si on clique en dehors de .modal-content
      if (e.target === modal) modal.style.display = 'none';
    });

    // Fermer avec Echap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.style.display = 'none';
    });
  }
});
