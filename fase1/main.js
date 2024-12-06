// Capturar elementos del DOM
const themeToggleMenu = document.getElementById("theme-toggle-menu");
const themeMenu = document.getElementById("theme-menu");
const iaThemeOption = document.getElementById("ia-theme-option");
const lightThemeOption = document.getElementById("light-theme-option");
const attachIcon = document.getElementById("attach-icon");
const sendIcon = document.getElementById("send-icon");
const audioIcon = document.getElementById("audio-icon");
const userInput = document.getElementById("user-input");
const messagesDiv = document.getElementById("messages");

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

// Función para agregar mensajes al chat con íconos y burbujas
function agregarMensaje(mensaje, tipo) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", tipo);

  const icon = document.createElement("img");
  icon.classList.add("message-icon");
  icon.src = tipo === "usuario" ? "img/usuario.png" : "img/bot.png";

  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");
  bubble.textContent = mensaje;

  if (tipo === "usuario") {
    // Alinear ícono a la derecha
    messageContainer.appendChild(bubble);
    messageContainer.appendChild(icon);
  } else {
    // Alinear ícono a la izquierda
    messageContainer.appendChild(icon);
    messageContainer.appendChild(bubble);
  }

  messagesDiv.appendChild(messageContainer);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Desplazar hacia abajo
}

// Manejar ícono de enviar mensaje
sendIcon.addEventListener("click", () => {
  const mensaje = userInput.value.trim();
  if (mensaje) {
    agregarMensaje(mensaje, "usuario");
    userInput.value = ""; // Limpiar el campo de texto
    setTimeout(() => {
      agregarMensaje("Procesando tu mensaje...", "ia");
    }, 1000);
  }
});

// Manejar ícono de adjuntar archivo
attachIcon.addEventListener("click", () => {
  alert("Función de adjuntar archivo no implementada aún.");
});

// Manejar ícono de grabar audio
audioIcon.addEventListener("click", () => {
  alert("Función de grabar audio no implementada aún.");
});

// Enviar mensaje al presionar Enter
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendIcon.click();
  }
});