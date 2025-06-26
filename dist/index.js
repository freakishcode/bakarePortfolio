"use strict";
// Collected D.O.M (Document Object Modal)
const theme = document.getElementById("theme");
const nav = document.getElementById("Nav-wrapper");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
//Applying Functionality to the button using EventListener
theme.addEventListener("click", () => {
  document.body.classList.toggle("light");
  //changing the nav backgroundColor
  nav.classList.toggle("dark-grey");
  header.classList.toggle("header-bg-light");
  footer.classList.toggle("footer-bgColor");
  //changing the  theme icon button
  if (document.body.classList.contains("light")) {
    theme.src = "./assets/Icons/moon.png";
  } else {
    theme.src = "./assets/Icons/sun.png";
  }
  document.body.style.transition = " background 0.2s linear";
});
// adding functionality to Navbar when user scroll down
window.onscroll = function () {
  this.scrollY > 20
    ? nav.classList.add("sticky")
    : nav.classList.remove("sticky");
};
// Collecting DOM for the Mobile friendly interface
const TogglerBtn = document.getElementById("toggleIcon");
const Navbar = document.getElementById("navbar");
// console.log(TogglerBtn);
// console.log(Navbar);
//FOR The Toggle Button when clicked on
TogglerBtn.addEventListener("click", () => {
  Navbar.classList.toggle("show");
  TogglerBtn.classList.toggle("show");
  TogglerBtn.style.right = "3%";
});
//when a link is clicked, Toggle menu will disappear
document.querySelectorAll("li").forEach((n) =>
  n.addEventListener("click", () => {
    Navbar.classList.remove("show");
    TogglerBtn.classList.remove("show");
  })
);
//Applied Animation each Page section when user opens page
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});
const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));
//Applied js to animate services offered part when page load or scrolled
const observerBoxes = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("showAnimate");
    } else {
      entry.target.classList.remove("showAnimate");
    }
  });
});
const AnimateBoxes = document.querySelectorAll(".animate-service");
AnimateBoxes.forEach((el) => observerBoxes.observe(el));
// Collected D.O.M for ModalPopUp (contact Me)
const form = document.querySelector("form");
const OpenModal = document.getElementById("modal-popup");
const CloseModal = document.getElementById("closeBtn");
const okayModal = document.getElementById("okayBtn");
form.addEventListener("submit", emailMe);
function emailMe(event) {
  event.preventDefault();
  // To open modal
  OpenModal.classList.add("action");
}
// button to close modal
CloseModal.addEventListener("click", () => {
  // To remove the open modal class
  OpenModal.classList.remove("action");
});
// button to okay modal
okayModal.addEventListener("click", () => {
  // To remove the open modal class
  OpenModal.classList.remove("action");
});
