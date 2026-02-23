document.addEventListener("DOMContentLoaded", () => {
  const projectsUrl = "./assets/json/projects.json";
  const container = document.getElementById("projects-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let projectsData = [];

  // Scroll reveal
  function checkVisibility() {
    document.querySelectorAll(".projects").forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.85) {
        el.classList.add("visible");
      }
    });
  }
  window.addEventListener("scroll", checkVisibility);
  window.addEventListener("load", checkVisibility);

  // Render cards
  function renderProjects(list) {
    container.innerHTML = "";

    if (!list || list.length === 0) {
      container.innerHTML = `<p style="color:rgba(255,255,255,0.4);text-align:center;padding:40px 0;">Aucun projet à afficher.</p>`;
      return;
    }

    list.forEach((project) => {
      const card = document.createElement("div");
      card.classList.add("project-card");

      const techBadges = project.techs
        ? project.techs
            .map((t) => `<span class="tech-badge">${t}</span>`)
            .join("")
        : "";

      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
        </div>
        <div class="project-description">
          ${project.techBadges ? `<div class="project-techs">${project.techBadges}</div>` : ""}
          <h3>${project.title}</h3>
          ${project.description ? `<p>${project.description.slice(0, 100)}${project.description.length > 100 ? "..." : ""}</p>` : ""}
          <span class="project-cta">Voir le projet →</span>
        </div>
      `;

      card.addEventListener("click", () => openModal(project));
      container.appendChild(card);
    });
  }

  // Modal
  function openModal(project) {
    const modal = document.getElementById("project-modal");
    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-img").src = project.image;
    document.getElementById("modal-img").alt = project.title;
    document.getElementById("modal-desc").textContent =
      project.description || "";
    document.getElementById("modal-link").href = project.link || "#";
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    document.getElementById("project-modal").style.display = "none";
    document.body.style.overflow = "";
  }

  const closeBtn = document.getElementById("close-modal");
  const modal = document.getElementById("project-modal");

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Filtres
  function setActive(type) {
    filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.type === type);
    });
  }

  function applyFilter(type) {
    const list =
      type === "all"
        ? projectsData
        : projectsData.filter((p) => p.type === type);
    renderProjects(list);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActive(btn.dataset.type);
      applyFilter(btn.dataset.type);
    });
  });

  // Chargement JSON
  fetch(projectsUrl)
    .then((res) => res.json())
    .then((data) => {
      projectsData = data;
      renderProjects(projectsData);
    })
    .catch((err) => {
      console.error("Erreur chargement projets:", err);
      container.innerHTML = `<p style="color:rgba(255,255,255,0.4);text-align:center;padding:40px 0;">Impossible de charger les projets.</p>`;
    });
});
