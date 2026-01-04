"use strict";
// =======================================
// TODO: TYPESCRIPT
// =======================================
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
// ---------- tiny helpers ----------
/**
 * Tiny helpers for DOM selection and event handling.
 * - `$`: Selects a single element matching the selector.
 * - `$$`: Selects all elements matching the selector as an array.
 * - `on`: Strongly typed event listener for HTMLElement, Document, and Window.
 */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
function on(el, type, handler, options) {
  el === null || el === void 0
    ? void 0
    : el.addEventListener(type, handler, options);
}
// =======================================
// TODO: JAVASCRIPT CORE
// =======================================
// ---------- core DOM references ----------
const themeBtn = $("#theme");
const nav = $("#Nav-wrapper");
const footer = $("footer");
const navbar = $("#navbar");
const toggler = $("#toggleIcon");
const hello = $("#hello");
const introDetails = $(".intro-details");
const DownloadCV = $(".Download-CV");
const sectionHeaders = $$("main header");
// =======================================
// THEME TOGGLE
// =======================================
/**
 * Theme toggle with localStorage + system preference.
 */
const THEME_KEY = "site-theme";
function applyTheme(isLight) {
  document.body.classList.toggle("light", isLight);
  nav === null || nav === void 0
    ? void 0
    : nav.classList.toggle("dark-grey", isLight);
  hello === null || hello === void 0
    ? void 0
    : hello.classList.toggle("text-color-light", isLight);
  introDetails === null || introDetails === void 0
    ? void 0
    : introDetails.classList.toggle("text-color-light", isLight);
  DownloadCV === null || DownloadCV === void 0
    ? void 0
    : DownloadCV.classList.toggle("text-color-light", isLight);
  footer === null || footer === void 0
    ? void 0
    : footer.classList.toggle("footer-bgColor", isLight);
  sectionHeaders.forEach((h) => h.classList.toggle("header-bg-light", isLight));
  if (themeBtn) {
    themeBtn.src = isLight
      ? "./assets/Icons/Others/moon.png"
      : "./assets/Icons/Others/sun.png";
  }
  document.body.style.transition = "background 0.2s linear, color 0.2s linear";
}
function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light") return true;
  if (savedTheme === "dark") return false;
  // Fallback to system preference
  return !window.matchMedia("(prefers-color-scheme: dark)").matches;
}
// Init theme
let isLight = getInitialTheme();
applyTheme(isLight);
on(themeBtn, "click", () => {
  isLight = !isLight;
  applyTheme(isLight);
  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
});
// =======================================
// STICKY NAV
// =======================================
on(
  window,
  "scroll",
  () =>
    nav === null || nav === void 0
      ? void 0
      : nav.classList.toggle("sticky", window.scrollY > 20),
  { passive: true }
);
// =======================================
// MOBILE MENU
// =======================================
if (toggler && navbar) {
  toggler.setAttribute("aria-controls", "navbar");
  toggler.setAttribute("aria-expanded", "false");
  toggler.setAttribute("aria-label", "Toggle navigation menu");
  on(toggler, "click", () => {
    const showing = navbar.classList.toggle("show");
    toggler.classList.toggle("show", showing);
    toggler.setAttribute("aria-expanded", showing.toString());
  });
  $$("#navbar a").forEach((a) =>
    on(a, "click", () => {
      navbar.classList.remove("show");
      toggler.classList.remove("show");
      toggler.setAttribute("aria-expanded", "false");
    })
  );
}
// =======================================
// REVEAL ANIMATIONS
// =======================================
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
$$(".hidden").forEach((el) => revealObserver.observe(el));
// =======================================
// PROJECT VIDEO PREVIEW
// =======================================
function initProjectVideoPreview() {
  $$(".preview-video").forEach((video) => {
    on(video, "mouseenter", () => video.play());
    on(video, "mouseleave", () => video.pause());
  });
}
on(document, "DOMContentLoaded", initProjectVideoPreview);
// =======================================
// SERVICES ANIMATION
// =======================================
const servicesObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) =>
      entry.target.classList.toggle("showAnimate", entry.isIntersecting)
    );
  },
  { threshold: 0.12 }
);
$$(".animate-service").forEach((el) => servicesObserver.observe(el));
// =======================================
// DYNAMIC YEAR UPDATE
// =======================================
function updateYear() {
  const yearText = $("#year-text");
  if (yearText)
    yearText.textContent = `© ${new Date().getFullYear()}. All rights reserved.`;
}
updateYear();
setInterval(updateYear, 1000 * 60 * 60);
// =======================================
// MODAL (CONTACT)
// =======================================
const modal = $("#modal-popup");
const overlay = $(".overlay", modal || undefined);
const closeBtn = $("#closeBtn");
const okBtn = $("#okayBtn");
const modalMessage = $(".modal-message", modal || undefined);
let autoCloseTimer;
function openModal(message, color, autoClose = false) {
  if (!modal || !modalMessage) return;
  modalMessage.innerText = message;
  modalMessage.style.color = color;
  modal.classList.add("action");
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
  if (autoClose) autoCloseTimer = window.setTimeout(closeModal, 3000);
}
function closeModal() {
  modal === null || modal === void 0
    ? void 0
    : modal.classList.remove("action");
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
}
on(closeBtn, "click", closeModal);
on(okBtn, "click", closeModal);
on(overlay, "click", closeModal);
on(document, "keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
// =======================================
// CONTACT FORM (FORMSPREE)
// =======================================
const contactForm = $("#contactForm");
on(contactForm, "submit", (e) =>
  __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    if (!contactForm) return;
    openModal("Sending...", "#444");
    try {
      const response = yield fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        openModal("✅ Message sent successfully!", "green");
        contactForm.reset();
      } else {
        openModal("❌ Oops! Something went wrong.", "red");
      }
    } catch (err) {
      console.error(err);
      openModal("❌ Network error. Please try again.", "red");
    }
  })
);
// =======================================
// SERVICE CARD 3D TILT
// =======================================
const serviceCards = document.querySelectorAll(".service-box");
serviceCards.forEach((card) => {
  on(card, "mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    const centerX = rect.left + halfWidth;
    const centerY = rect.top + halfHeight;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const maxDistance = Math.max(halfWidth, halfHeight);
    const degree = (distance * 10) / maxDistance;
    const rx = deltaY / halfHeight;
    const ry = deltaX / halfWidth;
    card.style.transform = `perspective(400px) rotate3d(${-rx}, ${ry}, 0, ${degree}deg)`;
  });
  on(card, "mouseleave", () => {
    card.style.transform = "";
  });
});

// Collected D.O.M (Document Object Modal)
const typingElement = document.getElementById("typing");

// the typing sentences
const sentences = [
  "Bakare, .A. Olayemi",
  "a Web Developer",
  "also a Freelancer",
];

let sentenceIndex = 0;
let charIndex = 0;

// adding functionality to the dynamic text
function type() {
  if (sentenceIndex < sentences.length) {
    if (charIndex < sentences[sentenceIndex].length) {
      typingElement.textContent += sentences[sentenceIndex].charAt(charIndex);

      charIndex++;
      setTimeout(type, 100);
    } else {
      // pause before clearing and moving to next sentence
      setTimeout(() => {
        typingElement.textContent = "";
        charIndex = 0;
        sentenceIndex = (sentenceIndex + 1) % sentences.length; // loop
        type();
      }, 1000);
    }
  }
}

type();
