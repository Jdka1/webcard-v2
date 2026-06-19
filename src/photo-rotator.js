const photos = [
  "4V7A5833-Enhanced-NR-Edit.jpg",
  "4V7A3683.jpg",
  "4V7A0096.jpg",
  "4V7A0138-Edit.jpg",
  "4V7A0770.jpg",
  "4V7A1319.jpg",
  "4V7A2066.jpg",
  "4V7A3643.jpg",
  "4V7A3686.jpg",
  "4V7A5823-Edit-Edit.jpg",
  "4V7A6203.jpg",
  "4V7A6236.jpg",
  "4V7A6479-Edit.jpg",
];

const heroPhoto = document.querySelector(".hero-photo");
const photoToggle = document.querySelector(".photo-toggle");
let currentIndex = 0;

const photoPath = (fileName) => `/public/photography/${fileName}`;

const setPhoto = (index) => {
  currentIndex = index % photos.length;
  heroPhoto.classList.add("is-changing");

  window.setTimeout(() => {
    heroPhoto.src = photoPath(photos[currentIndex]);
    photoToggle.textContent = `Photo ${currentIndex + 1} / ${photos.length}`;
  }, 120);
};

if (heroPhoto && photoToggle) {
  heroPhoto.addEventListener("load", () => {
    heroPhoto.classList.remove("is-changing");
  });

  photoToggle.addEventListener("click", () => {
    setPhoto(currentIndex + 1);
  });
}
