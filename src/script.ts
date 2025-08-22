// ---------- tiny helpers ----------
const $ = <T extends HTMLElement>(
  sel: string,
  root: Document | HTMLElement = document
) => root.querySelector<T>(sel);
const $$ = <T extends HTMLElement>(
  sel: string,
  root: Document | HTMLElement = document
) => Array.from(root.querySelectorAll<T>(sel));

// ---------- core DOM references ----------
const themeBtn = $("#theme") as HTMLImageElement | null;
const nav = $("#Nav-wrapper") as HTMLElement | null;
const footer = $("footer") as HTMLElement | null;
const navbar = $("#navbar") as HTMLElement | null;
const toggler = $("#toggleIcon") as HTMLButtonElement | null;

// all section headers inside <main> (covers About/Skills/Projects/Service/Contact)
const sectionHeaders = $$<HTMLElement>("main header");

// ---------- theme toggle ----------
themeBtn?.addEventListener("click", () => {
  const lightOn = document.body.classList.toggle("light");

  // keep your CSS hooks intact
  nav?.classList.toggle("dark-grey");
  footer?.classList.toggle("footer-bgColor");

  // apply your .header-bg-light to every section header
  sectionHeaders.forEach((h) => h.classList.toggle("header-bg-light", lightOn));

  // swap icon
  if (lightOn) {
    themeBtn.src = "./assets/Icons/moon.png";
  } else {
    themeBtn.src = "./assets/Icons/sun.png";
  }

  // smoothen background & text color transition
  document.body.style.transition = "background 0.2s linear, color 0.2s linear";
});

// ---------- sticky nav on scroll ----------
window.addEventListener(
  "scroll",
  () => {
    if (!nav) return;
    nav.classList.toggle("sticky", window.scrollY > 20);
  },
  { passive: true }
);

// ---------- mobile menu toggle ----------
toggler?.setAttribute("aria-controls", "navbar");
toggler?.setAttribute("aria-expanded", "false");
toggler?.setAttribute("aria-label", "Toggle navigation menu");

toggler?.addEventListener("click", () => {
  const showing = navbar?.classList.toggle("show") ?? false;
  toggler.classList.toggle("show", showing);
  toggler.setAttribute("aria-expanded", showing ? "true" : "false");
});

// close the mobile menu when a navbar link is clicked
$$<HTMLAnchorElement>("#navbar a").forEach((a) =>
  a.addEventListener("click", () => {
    navbar?.classList.remove("show");
    toggler?.classList.remove("show");
    toggler?.setAttribute("aria-expanded", "false");
  })
);

// ---------- reveal animations ----------
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add("show");
        // reveal once, then stop observing to avoid reflow churn
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

$$<HTMLElement>(".hidden").forEach((el) => revealObserver.observe(el));

// ---------- project video preview ----------
// This handles the video preview on hover for project cards
function initProjectVideoPreview() {
  const videos = document.querySelectorAll<HTMLVideoElement>(".preview-video");

  videos.forEach((video) => {
    video.addEventListener("mouseenter", () => video.play());
    video.addEventListener("mouseleave", () => video.pause());
  });
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", initProjectVideoPreview);

// services animation
const servicesObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      (entry.target as HTMLElement).classList.toggle(
        "showAnimate",
        entry.isIntersecting
      );
    });
  },
  { threshold: 0.12 }
);

$$<HTMLElement>(".animate-service").forEach((el) =>
  servicesObserver.observe(el)
);

function updateYear() {
  const yearText = document.getElementById("year-text");
  if (yearText) {
    const year = new Date().getFullYear();
    yearText.textContent = `© ${year}. All rights reserved.`;
  }
}
// Run once on load
updateYear();
// Re-check every hour (handles New Year rollover without reload)
setInterval(updateYear, 1000 * 60 * 60);

// ---------- modal (contact) ----------
const modal = document.getElementById("modal-popup") as HTMLDivElement | null;
const overlay = modal?.querySelector(".overlay") as HTMLDivElement | null;
const closeBtn = document.getElementById(
  "closeBtn"
) as HTMLButtonElement | null;
const okBtn = document.getElementById("okayBtn") as HTMLButtonElement | null;
const modalMessage = modal?.querySelector(
  ".modal-message"
) as HTMLParagraphElement | null;

let autoCloseTimer: number | undefined;

// open modal with custom message and color
const openModal = (
  message: string,
  color: string,
  autoClose: boolean = false
) => {
  if (modal && modalMessage) {
    modalMessage.innerText = message;
    modalMessage.style.color = color;
    modal.classList.add("action");

    // clear any previous timer
    if (autoCloseTimer) clearTimeout(autoCloseTimer);

    // auto-close only if requested
    if (autoClose) {
      autoCloseTimer = window.setTimeout(() => {
        closeModal();
      }, 3000); // 3 seconds
    }
  }
};

// close modal
const closeModal = () => {
  if (modal) modal.classList.remove("action");
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
};

// event listeners for closing the modal
closeBtn?.addEventListener("click", closeModal);
okBtn?.addEventListener("click", closeModal);
overlay?.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---------- (contact: third party - form spree) ----------
const contactForm = document.getElementById(
  "contactForm"
) as HTMLFormElement | null;

// handle form submission
if (contactForm) {
  contactForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    // Show modal with "sending" state
    openModal("Sending...", "#444");

    const data = new FormData(contactForm);

    // Use Fetch API to submit the form data
    try {
      const response: Response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        openModal("✅ Message sent successfully!", "green");
        contactForm.reset();
      } else {
        openModal("❌ Oops! Something went wrong.", "red");
      }
    } catch (error) {
      console.error(error);
      openModal("❌ Network error. Please try again.", "red");
    }
  });
}
