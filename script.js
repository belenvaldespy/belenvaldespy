const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const year = document.getElementById("year");
const sections = document.querySelectorAll("main section[id], header[id]");
const menuLinks = document.querySelectorAll(".menu a");
const backTop = document.getElementById("backTop");
const scrollProgress = document.getElementById("scrollProgress");
const counters = document.querySelectorAll("[data-counter]");
const revealElements = document.querySelectorAll(".reveal");

const setMenuState = (isOpen) => {
  menu.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
};

menuToggle.addEventListener("click", () => {
  setMenuState(!menu.classList.contains("open"));
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const targetId = entry.target.getAttribute("id");
      menuLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${targetId}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  { rootMargin: "-40% 0px -45% 0px", threshold: 0.01 }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const animateCounter = (element) => {
  const target = Number(element.dataset.counter || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  const step = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);

    element.textContent = `${value.toLocaleString("es-PY")}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener(
  "scroll",
  () => {
    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;
    backTop.classList.toggle("show", scrollTop > 420);
  },
  { passive: true }
);

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent =
    "¡Gracias por su consulta! El equipo de PAGE Publicidad se pondrá en contacto a la brevedad.";
  form.reset();
});

year.textContent = new Date().getFullYear();
