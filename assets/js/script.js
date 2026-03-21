'use strict';

// Utility: Throttle function to limit execution rate
const throttle = function (func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Cache DOM elements at initialization
const cacheElements = function () {
  return {
    loadingElement: document.querySelector("[data-loading]"),
    header: document.querySelector("[data-header]"),
    navbar: document.querySelector("[data-navbar]"),
    overlay: document.querySelector("[data-overlay]"),
    navTogglers: document.querySelectorAll("[data-nav-toggler]"),
    navLinks: document.querySelectorAll("[data-nav-link]"),
    letterBoxes: document.querySelectorAll("[data-letter-effect]"),
    backTopBtn: document.querySelector("[data-back-top-btn]"),
    revealElements: document.querySelectorAll("[data-reveal]"),
    cursor: document.querySelector("[data-cursor]"),
    anchorElements: document.querySelectorAll("a"),
    buttons: document.querySelectorAll("button")
  };
};

let elements;

// Initialize cached elements
elements = cacheElements();

// add Event on multiple elment
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



// PRELOADING

window.addEventListener("load", function () {
  elements.loadingElement.classList.add("loaded");
  document.body.classList.remove("active");
});



// MOBILE NAV TOGGLE

const toggleNav = function () {
  elements.navbar.classList.toggle("active");
  elements.overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElements(elements.navTogglers, "click", toggleNav);

const closeNav = function () {
  elements.navbar.classList.remove("active");
  elements.overlay.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElements(elements.navLinks, "click", closeNav);



// HEADER

const activeElementOnScroll = function () {
  if (window.scrollY > 50) {
    elements.header.classList.add("active");
  } else {
    elements.header.classList.remove("active");
  }
}

window.addEventListener("scroll", throttle(activeElementOnScroll, 100));



/**
 * TEXT ANIMATION EFFECT FOR HERO SECTION
 */

let activeLetterBoxIndex = 0;
let lastActiveLetterBoxIndex = 0;
let totalLetterBoxDelay = 0;

const setLetterEffect = function () {

  // loop through all letter boxes
  for (let i = 0; i < elements.letterBoxes.length; i++) {
    // set initial animation delay
    let letterAnimationDelay = 0;

    // get all character from the current letter box
    const letters = elements.letterBoxes[i].textContent.trim();
    // remove all character from the current letter box
    elements.letterBoxes[i].textContent = "";

    // loop through all letters
    for (let j = 0; j < letters.length; j++) {

      // create a span
      const span = document.createElement("span");

      // set animation delay on span
      span.style.animationDelay = `${letterAnimationDelay}s`;

      // set the "in" class on the span, if current letter box is active
      // otherwise class is "out"
      if (i === activeLetterBoxIndex) {
        span.classList.add("in");
      } else {
        span.classList.add("out");
      }

      // pass current letter into span
      span.textContent = letters[j];

      // add space class on span, when current letter contain space
      if (letters[j] === " ") span.classList.add("space");

      // pass the span on current letter box
      elements.letterBoxes[i].appendChild(span);

      // skip letterAnimationDelay when loop is in the last index
      if (j >= letters.length - 1) break;
      // otherwise update
      letterAnimationDelay += 0.05;

    }

    // get total delay of active letter box
    if (i === activeLetterBoxIndex) {
      totalLetterBoxDelay = Number(letterAnimationDelay.toFixed(2));
    }

    // add active class on last active letter box
    if (i === lastActiveLetterBoxIndex) {
      elements.letterBoxes[i].classList.add("active");
    } else {
      elements.letterBoxes[i].classList.remove("active");
    }

  }

  setTimeout(function () {
    lastActiveLetterBoxIndex = activeLetterBoxIndex;

    // update activeLetterBoxIndex based on total letter boxes
    activeLetterBoxIndex >= elements.letterBoxes.length - 1 ? activeLetterBoxIndex = 0 : activeLetterBoxIndex++;

    setLetterEffect();
  }, (totalLetterBoxDelay * 1000) + 3000);

}

// call the letter effect function after window loaded
window.addEventListener("load", setLetterEffect);



/**
 * BACK TO TOP BUTTON
 */

window.addEventListener("scroll", throttle(function () {
  const bodyHeight = document.body.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollEndPos = bodyHeight - windowHeight;
  const totalScrollPercent = (window.scrollY / scrollEndPos) * 100;

  elements.backTopBtn.textContent = `${totalScrollPercent.toFixed(0)}%`;

  // visible back top btn when scrolled 5% of the page
  if (totalScrollPercent > 5) {
    elements.backTopBtn.classList.add("show");
  } else {
    elements.backTopBtn.classList.remove("show");
  }
}, 100));



/**
 * SCROLL REVEAL
 */

const scrollReveal = function () {
  for (let i = 0; i < elements.revealElements.length; i++) {
    const elementIsInScreen = elements.revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15;

    if (elementIsInScreen) {
      elements.revealElements[i].classList.add("revealed");
    } else {
      elements.revealElements[i].classList.remove("revealed");
    }
  }
}

window.addEventListener("scroll", throttle(scrollReveal, 100));

scrollReveal();



/**
 * CUSTOM CURSOR
 */

// change cursorElement position based on cursor move
document.body.addEventListener("mousemove", throttle(function (event) {
  setTimeout(function () {
    elements.cursor.style.top = `${event.clientY}px`;
    elements.cursor.style.left = `${event.clientX}px`;
  }, 100);
}, 50));

// add cursor hoverd class
const hoverActive = function () { elements.cursor.classList.add("hovered"); }

// remove cursor hovered class
const hoverDeactive = function () { elements.cursor.classList.remove("hovered"); }

// add hover effect on cursor, when hover on any button or hyperlink
addEventOnElements(elements.anchorElements, "mouseover", hoverActive);
addEventOnElements(elements.anchorElements, "mouseout", hoverDeactive);
addEventOnElements(elements.buttons, "mouseover", hoverActive);
addEventOnElements(elements.buttons, "mouseout", hoverDeactive);

// add disabled class on cursorElement, when mouse out of body
document.body.addEventListener("mouseout", function () {
  elements.cursor.classList.add("disabled");
});

// remove diabled class on cursorElement, when mouse in the body
document.body.addEventListener("mouseover", function () {
  elements.cursor.classList.remove("disabled");
});