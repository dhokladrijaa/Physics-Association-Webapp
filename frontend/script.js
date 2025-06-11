console.log("Script loaded");
/* Fetch helper */
async function loadJSON(endpoint){
  const r = await fetch(`/api/${endpoint}`);
  if(!r.ok) throw new Error("Fetch failed"); 
  return await r.json();
}

/* 1. Announcements */
loadJSON("announcements").then(data => {
  const slide = document.querySelector(".slide");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let index = 0;

  function showSlide(i) {
    const ann = data[i];
    slide.style.animation = "none"; // reset animation
    slide.offsetHeight;             // trigger reflow
    slide.style.animation = null;   // restart animation
    slide.textContent = `${ann.title} — ${new Date(ann.date).toLocaleDateString()}`;
  }

  function nextSlide() {
    index = (index + 1) % data.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + data.length) % data.length;
    showSlide(index);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  showSlide(index);                  // show first
  setInterval(nextSlide, 3000);      // auto-slide every s
});




/* 2. Faculty */
loadJSON("faculty").then(faculty => {
  const grid = document.getElementById("faculty-grid");
  const search = document.getElementById("faculty-search");
  // Horizontal scroll functionality for faculty
const facultyGrid = document.getElementById("faculty-grid");
const scrollLeftBtn = document.querySelector(".scroll-left");
const scrollRightBtn = document.querySelector(".scroll-right");
const scrollProgress = document.querySelector(".scroll-progress");

scrollLeftBtn.addEventListener("click", () => {
  facultyGrid.scrollBy({ left: -300, behavior: "smooth" });
});

scrollRightBtn.addEventListener("click", () => {
  facultyGrid.scrollBy({ left: 300, behavior: "smooth" });
});

facultyGrid.addEventListener("scroll", () => {
  const scrollWidth = facultyGrid.scrollWidth - facultyGrid.clientWidth;
  const scrollLeft = facultyGrid.scrollLeft;
  const progress = (scrollLeft / scrollWidth) * 100;
  scrollProgress.style.width = `${progress}%`;
});

  // Render function
  function render(filtered) {
    grid.innerHTML = '';
    filtered.forEach(person => grid.appendChild(makeFacCard(person)));
  }

  // Initial render
  render(faculty);

  // Search logic
  search.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = faculty.filter(f =>
      `${f.name} ${f.position} ${f.area}`.toLowerCase().includes(q)
    );
    render(filtered);
  });
});

function makeFacCard({ name, position, area, image }) {
  const div = document.createElement("div");
  div.className = "fac-card";
  div.innerHTML = `
    <img src="${image}" alt="${name}">
    <h4>${name}</h4>
    <p><em>${position}</em></p>
    <p>${area}</p>
  `;
  return div;
}



/* 3. Research areas */
loadJSON("research").then(arr=>{
  const wrap = document.getElementById("research-list");
  arr.forEach(r=>{
    const d=document.createElement("div");
    d.className="research-card";
    d.innerHTML = `<h4>${r.title}</h4><p>${r.description}</p>`;
    wrap.appendChild(d);
  });
});


/* 5. Contact form (front-end validation only) */
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault(); // prevent page reload
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const msg = form.msg.value.trim();

  // Very basic validation
  if (!name || !email || !msg || !email.includes("@")) {
    document.getElementById("form-status").textContent = "Please fill out all fields correctly.";
    return;
  }

  // Optional: show a success message
  document.getElementById("form-status").textContent = "Thanks! We'll get back to you soon.";
  form.reset();
});

// Load achievements from achievements.json
loadJSON("achievements").then(data => {
  const container = document.getElementById("achievement-grid");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "achievement-card";
    div.innerHTML = `
      <div class="achievement-icon">${item.icon}</div>
      <div class="achievement-text">
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
    `;
    container.appendChild(div);
  });
});


  // 1. Department Highlights Carousel
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".highlight-slide");
  const prevBtn = document.querySelector(".highlight-btn.prev");
  const nextBtn = document.querySelector(".highlight-btn.next");

  let index = 0;

  function showSlide(i) {
    slides.forEach((slide, j) => {
      slide.classList.toggle("active", j === i);
    });
  }

  prevBtn?.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  });

  nextBtn?.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  });

  showSlide(index); // Initial slide
  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 4000); // Auto-slide every 4s
});
loadJSON("faculty").then(data => {
  const grid = document.getElementById("faculty-grid");
  const searchInput = document.getElementById("faculty-search");
  const chipContainer = document.getElementById("department-filters");

  // Populate unique departments as chips
  const departments = [...new Set(data.map(f => f.department))];
  departments.forEach(dep => {
    const chip = document.createElement("div");
    chip.className = "chip";
   chip.textContent = dep;
    chip.onclick = (e) => {
  e.stopPropagation();
  const isClose = e.target.classList.contains("chip-close");

  if (isClose) {
    chip.classList.remove("active");
    chip.querySelector(".chip-close")?.remove(); // remove the ×
    renderFiltered(data, null, searchInput.value);
  } else {
    document.querySelectorAll(".chip").forEach(c => {
      c.classList.remove("active");
      c.querySelector(".chip-close")?.remove(); // clean all ×
    });
    chip.classList.add("active");

    const close = document.createElement("span");
    close.className = "chip-close";
    close.textContent = "×";
    chip.appendChild(close);

    const depName = chip.textContent.replace("×", "").trim();
renderFiltered(data, depName, searchInput.value);

  }
};

    chipContainer.appendChild(chip);
  });

  // Search functionality
  searchInput.addEventListener("input", () => {
    const activeChip = document.querySelector(".chip.active");
    renderFiltered(data, activeChip?.textContent || null, searchInput.value);
  });

  function renderFiltered(data, department, query) {
    grid.innerHTML = "";
    const filtered = data.filter(fac =>
      (!department || fac.department === department) &&
      (fac.name.toLowerCase().includes(query.toLowerCase()))
    );
    filtered.forEach(f => grid.appendChild(makeFacCard(f)));
  }

  renderFiltered(data, null, "");
});

document.getElementById("back-to-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
function openCurriculumModal(title, pdfUrl) {
  const modal = document.getElementById("curriculum-modal");
  const iframe = document.getElementById("curriculum-pdf");
  iframe.src = pdfUrl;
  modal.style.display = "flex";
}

function closeCurriculumModal() {
  const modal = document.getElementById("curriculum-modal");
  const iframe = document.getElementById("curriculum-pdf");
  modal.style.display = "none";
  iframe.src = "";
}

loadJSON("research").then(data => {
  const wrap = document.getElementById("research-list");
  const filterWrap = document.getElementById("research-filters");

  const departments = [...new Set(data.map(item => item.department))];
  departments.forEach(dep => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = dep;

    chip.onclick = (e) => {
      const isClose = e.target.classList.contains("chip-close");

      if (isClose) {
        chip.classList.remove("active");
        chip.querySelector(".chip-close")?.remove();
        render(null);
      } else {
        document.querySelectorAll("#research-filters .chip").forEach(c => {
          c.classList.remove("active");
          c.querySelector(".chip-close")?.remove();
        });
        chip.classList.add("active");

        const close = document.createElement("span");
        close.className = "chip-close";
        close.textContent = "×";
        chip.appendChild(close);

        const depName = chip.textContent.replace("×", "").trim();
        render(depName);
      }
    };

    filterWrap.appendChild(chip);
  });

  function render(filter = null) {
    wrap.innerHTML = "";
    data
      .filter(r => !filter || r.department === filter)
      .forEach(r => {
        const d = document.createElement("div");
        d.className = "research-card";
        d.innerHTML = `<h4>${r.title}</h4><p>${r.description}</p>`;
        wrap.appendChild(d);
      });
  }

  render();
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
