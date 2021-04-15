const body = document.body;
const toggleBtn = document.querySelector(".theme-btn");
toggleBtn.addEventListener("click", () => {
  body.classList.toggle("darkmode");
});
