"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ---------- tiny helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
// ---------- core DOM references ----------
const themeBtn = $("#theme");
const nav = $("#Nav-wrapper");
const footer = $("footer");
const navbar = $("#navbar");
const toggler = $("#toggleIcon");
// all section headers inside <main> (covers About/Skills/Projects/Service/Contact)
const sectionHeaders = $$("main header");
// ---------- theme toggle ----------
themeBtn === null || themeBtn === void 0 ? void 0 : themeBtn.addEventListener("click", () => {
    const lightOn = document.body.classList.toggle("light");
    // keep your CSS hooks intact
    nav === null || nav === void 0 ? void 0 : nav.classList.toggle("dark-grey");
    footer === null || footer === void 0 ? void 0 : footer.classList.toggle("footer-bgColor");
    // apply your .header-bg-light to every section header
    sectionHeaders.forEach((h) => h.classList.toggle("header-bg-light", lightOn));
    // swap icon
    if (lightOn) {
        themeBtn.src = "./assets/Icons/moon.png";
    }
    else {
        themeBtn.src = "./assets/Icons/sun.png";
    }
    // smoothen background & text color transition
    document.body.style.transition = "background 0.2s linear, color 0.2s linear";
});
// ---------- sticky nav on scroll ----------
window.addEventListener("scroll", () => {
    if (!nav)
        return;
    nav.classList.toggle("sticky", window.scrollY > 20);
}, { passive: true });
// ---------- mobile menu toggle ----------
toggler === null || toggler === void 0 ? void 0 : toggler.setAttribute("aria-controls", "navbar");
toggler === null || toggler === void 0 ? void 0 : toggler.setAttribute("aria-expanded", "false");
toggler === null || toggler === void 0 ? void 0 : toggler.setAttribute("aria-label", "Toggle navigation menu");
toggler === null || toggler === void 0 ? void 0 : toggler.addEventListener("click", () => {
    var _a;
    const showing = (_a = navbar === null || navbar === void 0 ? void 0 : navbar.classList.toggle("show")) !== null && _a !== void 0 ? _a : false;
    toggler.classList.toggle("show", showing);
    toggler.setAttribute("aria-expanded", showing ? "true" : "false");
});
// close the mobile menu when a navbar link is clicked
$$("#navbar a").forEach((a) => a.addEventListener("click", () => {
    navbar === null || navbar === void 0 ? void 0 : navbar.classList.remove("show");
    toggler === null || toggler === void 0 ? void 0 : toggler.classList.remove("show");
    toggler === null || toggler === void 0 ? void 0 : toggler.setAttribute("aria-expanded", "false");
}));
// ---------- reveal animations ----------
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // reveal once, then stop observing to avoid reflow churn
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
$$(".hidden").forEach((el) => revealObserver.observe(el));
// ---------- project video preview ----------
// This handles the video preview on hover for project cards
function initProjectVideoPreview() {
    const videos = document.querySelectorAll(".preview-video");
    videos.forEach((video) => {
        video.addEventListener("mouseenter", () => video.play());
        video.addEventListener("mouseleave", () => video.pause());
    });
}
// Run when DOM is ready
document.addEventListener("DOMContentLoaded", initProjectVideoPreview);
// services animation
const servicesObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        entry.target.classList.toggle("showAnimate", entry.isIntersecting);
    });
}, { threshold: 0.12 });
$$(".animate-service").forEach((el) => servicesObserver.observe(el));
// ---------- modal (contact) ----------
const form = $(".client-form");
const modal = $("#modal-popup");
const overlay = modal === null || modal === void 0 ? void 0 : modal.querySelector(".overlay");
const closeBtn = $("#closeBtn");
const okBtn = $("#okayBtn");
const openModal = () => modal === null || modal === void 0 ? void 0 : modal.classList.add("action");
const closeModal = () => modal === null || modal === void 0 ? void 0 : modal.classList.remove("action");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => {
    e.preventDefault(); // show your modal instead of navigating away
    openModal();
});
closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", closeModal);
okBtn === null || okBtn === void 0 ? void 0 : okBtn.addEventListener("click", closeModal);
overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
        closeModal();
});
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
// Grab form and status elements with explicit typing
const contactForm = document.getElementById("contactForm");
const statusE = document.getElementById("formStatus");
if (contactForm && statusE) {
    contactForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        statusE.innerText = "Sending...";
        statusE.style.color = "#444";
        const data = new FormData(contactForm);
        try {
            const response = yield fetch(contactForm.action, {
                method: contactForm.method,
                body: data,
                headers: { Accept: "application/json" },
            });
            if (response.ok) {
                statusE.innerText = "✅ Message sent successfully!";
                statusE.style.color = "green";
                contactForm.reset();
            }
            else {
                statusE.innerText = "❌ Oops! Something went wrong.";
                statusE.style.color = "red";
            }
        }
        catch (error) {
            console.error(error);
            statusE.innerText = "❌ Network error. Please try again.";
            statusE.style.color = "red";
        }
    }));
}
