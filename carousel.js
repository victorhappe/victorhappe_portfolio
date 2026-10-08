const carousel = document.querySelector("#projectCarousel");
const prevBtn = document.querySelector(".carousel-prev");
const nextBtn = document.querySelector(".carousel-next");
const progressBar = document.querySelector(".carousel-progress-bar");
const counter = document.querySelector(".carousel-counter");

if (carousel && prevBtn && nextBtn) {
  const cards = [...carousel.querySelectorAll(".project-card")];

  function getStep() {
    if (cards.length < 2) return carousel.clientWidth;

    return cards[1].offsetLeft - cards[0].offsetLeft;
  }

  function getCurrentIndex() {
    const step = getStep();

    return Math.min(cards.length - 1, Math.max(0, Math.round(carousel.scrollLeft / step)));
  }

  function updateCarousel() {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const currentIndex = getCurrentIndex();

    prevBtn.disabled = carousel.scrollLeft <= 2;
    nextBtn.disabled = carousel.scrollLeft >= maxScroll - 2;

    const visibleCount = Math.max(1, Math.round(carousel.clientWidth / getStep()));

    const endIndex = Math.min(cards.length, currentIndex + visibleCount);

    const progress = maxScroll <= 0 ? 100 : (carousel.scrollLeft / maxScroll) * 100;

    progressBar.style.width = `${progress}%`;

    counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ` + `${String(cards.length).padStart(2, "0")}`;
  }

  function scrollCards(direction) {
    carousel.scrollBy({
      left: direction * getStep(),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  prevBtn.addEventListener("click", () => {
    scrollCards(-1);
  });

  nextBtn.addEventListener("click", () => {
    scrollCards(1);
  });

  carousel.addEventListener("scroll", updateCarousel, {
    passive: true,
  });

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
}

// Make entire project cards clickable

document.querySelectorAll(".project-card").forEach((card) => {
  const link = card.querySelector(".case-link");

  if (!link) return;

  card.setAttribute("role", "link");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `Open ${card.querySelector("h3")?.textContent || "project"}`);

  card.addEventListener("click", (event) => {
    // Avoid opening a project when selecting text
    if (window.getSelection()?.toString()) return;

    window.location.href = link.href;
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      window.location.href = link.href;
    }
  });
});
