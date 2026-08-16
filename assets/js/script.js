document.addEventListener("DOMContentLoaded", () => {
  const projectsUrl = "./assets/json/projects.json";
  const container = document.getElementById("projects-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("close-modal");
  let projectsData = [];
  initSheetDrag();

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

  // Rendu des tags de technos (cartes et modal)
  function renderTechBadges(techBadges) {
    return techBadges
      ? techBadges.map((t) => `<span class="tech-badge">${t}</span>`).join("")
      : "";
  }

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

      const techBadgesHTML = renderTechBadges(project.techBadges);

      card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
      </div>
      <div class="project-description">
        ${techBadgesHTML ? `<div class="project-techs">${techBadgesHTML}</div>` : ""}
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
    const isTeam = (project.role || "").toLowerCase() === "equipe";

    document.getElementById("modal-tag").textContent = isTeam
      ? `Projet d'équipe`
      : "Projet solo";
    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-img").src = project.image;
    document.getElementById("modal-img").alt = project.title;
    document.getElementById("modal-desc").textContent = project.description || "";
    document.getElementById("modal-techs").innerHTML = renderTechBadges(project.techBadges);

    const codeBtn = document.getElementById("modal-code");
    const demoBtn = document.getElementById("modal-demo");

    if (project.codeLink) {
      codeBtn.href = project.codeLink;
      codeBtn.style.display = "inline-flex";
    } else {
      codeBtn.style.display = "none";
    }

    if (project.demoLink) {
      demoBtn.href = project.demoLink;
      demoBtn.textContent = project.type === "design" ? "Voir sur Figma" : "Voir en ligne";
      demoBtn.style.display = "inline-flex";
    } else {
      demoBtn.style.display = "none";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

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

  // Swipe pour fermer (mobile)
  function initSheetDrag() {
    const sheet = document.querySelector(".modal-content");
    if (!sheet) return;
    let startY = 0;
    let currentY = 0;
    let dragging = false;

    sheet.addEventListener("touchstart", (e) => {
      if (window.innerWidth >= 700 || sheet.scrollTop > 0) return;
      startY = e.touches[0].clientY;
      dragging = true;
    });

    sheet.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      currentY = e.touches[0].clientY;
      const delta = currentY - startY;
      if (delta > 0) sheet.style.transform = `translateY(${delta}px)`;
    });

    sheet.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;
      const delta = currentY - startY;
      sheet.style.transition = "transform 0.25s ease";
      if (delta > 100) {
        sheet.style.transform = "translateY(100%)";
        setTimeout(() => {
          closeModal();
          sheet.style.transition = "";
          sheet.style.transform = "";
        }, 200);
      } else {
        sheet.style.transform = "";
        setTimeout(() => {
          sheet.style.transition = "";
        }, 250);
      }
      startY = 0;
      currentY = 0;
    });
  }

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