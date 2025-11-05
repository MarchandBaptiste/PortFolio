document.addEventListener('DOMContentLoaded', () => {
  const projectsUrl = "./assets/json/projects.json";
  const container = document.getElementById("projects-container");
  const filterButtons = document.querySelectorAll('.filter-btn');
  let projectsData = [];

  function renderProjects(list) {
    container.innerHTML = '';
    if (!list || list.length === 0) {
      const p = document.createElement('p');
      p.textContent = "Aucun projet à afficher.";
      p.style.textAlign = 'center';
      container.appendChild(p);
      return;
    }

    list.forEach(project => {
      const card = document.createElement('div');
      card.classList.add('project-card');
      card.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <h3>${project.title}</h3>
      `;

      card.addEventListener('click', () => {
        const titleEl = document.getElementById('modal-title');
        const imgEl = document.getElementById('modal-img');
        const descEl = document.getElementById('modal-desc');
        const linkEl = document.getElementById('modal-link');
        const modal = document.getElementById('project-modal');

        if (titleEl) titleEl.textContent = project.title;
        if (imgEl) imgEl.src = project.image;
        if (descEl) descEl.textContent = project.description;
        if (linkEl) linkEl.href = project.link;
        if (modal) modal.style.display = 'block';
      });

      container.appendChild(card);
    });
  }

  function setActive(type) {
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
  }

  function applyFilter(type) {
    if (type === 'all') renderProjects(projectsData);
    else renderProjects(projectsData.filter(p => p.type === type));
  }

  // Charger les projets
  fetch(projectsUrl)
    .then(response => response.json())
    .then(data => {
      projectsData = data;
      renderProjects(projectsData);
    })
    .catch(err => {
      console.error('Erreur chargement projets:', err);
      container.innerHTML = '<p style="text-align:center">Impossible de charger les projets.</p>';
    });

  // Attacher les filtres
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      setActive(type);
      applyFilter(type);
    });
  });

  // Modal fermeture
  const closeBtn = document.getElementById('close-modal');
  const modal = document.getElementById('project-modal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  }
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.style.display = 'none'; });
  }
});
