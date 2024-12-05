// Capturar elementos del DOM
const themeToggleMenu = document.getElementById("theme-toggle-menu");
const themeMenu = document.getElementById("theme-menu");
const iaThemeOption = document.getElementById("ia-theme-option");
const lightThemeOption = document.getElementById("light-theme-option");

// Manejar el clic en el ícono de menú para desplegar el menú
themeToggleMenu.addEventListener("click", () => {
  themeMenu.style.display = themeMenu.style.display === "block" ? "none" : "block";
});

// Cambiar a tema IA
iaThemeOption.addEventListener("click", () => {
  document.body.classList.remove("light-theme");
  document.body.classList.add("ia-theme");
  themeMenu.style.display = "none"; // Ocultar el menú después de elegir
});

// Cambiar a tema Claro
lightThemeOption.addEventListener("click", () => {
  document.body.classList.remove("ia-theme");
  document.body.classList.add("light-theme");
  themeMenu.style.display = "none"; // Ocultar el menú después de elegir
});