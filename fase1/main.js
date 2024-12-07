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

// Variable global para almacenar el modelo cargado
let modeloIA = null;

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

// Manejar ícono de adjuntar archivo para cargar el modelo
attachIcon.addEventListener("click", async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".keras,.json"; // Aceptar archivos .keras o .json (formato TensorFlow.js)

  input.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        agregarMensaje("Cargando modelo, por favor espera...", "ia");

        // Cargar el modelo con TensorFlow.js
        modeloIA = await tf.loadLayersModel(tf.io.browserFiles([file]));

        agregarMensaje("Modelo cargado exitosamente. ¡Listo para procesar mensajes!", "ia");
      } catch (error) {
        agregarMensaje("Error al cargar el modelo. Asegúrate de que sea un archivo válido.", "ia");
        console.error(error);
      }
    }
  });

  input.click(); // Simula el clic en el input para abrir el selector de archivos
});

// Manejar ícono de enviar mensaje
sendIcon.addEventListener("click", async () => {
  const mensaje = userInput.value.trim();
  if (mensaje) {
    agregarMensaje(mensaje, "usuario");
    userInput.value = ""; // Limpiar el campo de texto

    if (modeloIA) {
      agregarMensaje("Procesando tu mensaje...", "ia");

      try {
        // Preprocesar el mensaje: convertir el texto a un tensor (aquí es un ejemplo simplificado)
        const inputTensor = tf.tensor([[...mensaje].map(c => c.charCodeAt(0) / 255)]); // Normalizar caracteres
        const outputTensor = modeloIA.predict(inputTensor); // Predicción con el modelo
        const respuestaArray = await outputTensor.array(); // Convertir la salida a un array
        const respuesta = respuestaArray[0].join(" "); // Combinar la salida en una cadena

        agregarMensaje("Respuesta de la IA: " + respuesta, "ia");
      } catch (error) {
        agregarMensaje("Error procesando el mensaje con la IA.", "ia");
        console.error(error);
      }
    } else {
      agregarMensaje("Por favor, carga un modelo antes de enviar mensajes.", "ia");
    }
  }
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
