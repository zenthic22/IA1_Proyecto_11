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

// Variables para almacenar los diferentes JSON
let conversaciones = [];
let chistes = [];
let deportesData = [];
let entretenimientoData = [];
let correccionesVocabulario = [];

// Cargar los diferentes JSON
fetch('data/conversaciones.json')
  .then(response => response.json())
  .then(data => {
    conversaciones = data;
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON de conversaciones:', error);
  });

fetch('data/chistes.json')
  .then(response => response.json())
  .then(data => {
    chistes = data;
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON de conversaciones:', error);
});

fetch('data/deportes.json')
  .then(response => response.json())
  .then(data => {
    deportesData = data;
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON de conversaciones:', error);
});

fetch('data/entretenimiento.json')
  .then(response => response.json())
  .then(data => {
    entretenimientoData = data;
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON de conversaciones:', error);
  });

// Cargar el archivo JSON de correcciones de vocabulario
fetch('data/vocabulario.json')
  .then(response => response.json())
  .then(data => {
    correccionesVocabulario = data.correcciones_vocabulario;
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON de correcciones de vocabulario:', error);
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

// Función para normalizar el texto (convertir a minúsculas y eliminar espacios extra)
function normalizarTexto(texto) {
  return texto.toLowerCase().trim();
}

// Función para corregir errores ortográficos y añadir tildes
function corregirVocabulario(texto) {
  // Corregir errores ortográficos
  const palabras = texto.split(' ');
  const palabrasCorregidas = palabras.map(palabra => {
    let palabraCorregida = correccionesVocabulario.errores_ortograficos[palabra.toLowerCase()] || palabra;
    palabraCorregida = correccionesVocabulario.faltan_tildes[palabraCorregida.toLowerCase()] || palabraCorregida;
    return palabraCorregida;
  }).join(' ');

  // Añadir signos de puntuación para preguntas
  const textoConSignos = correccionesVocabulario.faltan_signos_puntuacion[palabrasCorregidas.toLowerCase()] || palabrasCorregidas;

  return textoConSignos;
}

// Función para obtener la respuesta de los diferentes JSON según el tipo de entrada
function obtenerRespuesta(input) {
  const mensajeCorregido = corregirVocabulario(input);
  const mensajeNormalizado = normalizarTexto(mensajeCorregido).trim();

  for (const conversacion of conversaciones) {
    if (normalizarTexto(conversacion.entrada).toLowerCase() === mensajeNormalizado) {
      return conversacion.respuesta;
    }
  }

  // Buscar en los chistes
  for (const chiste of chistes) {
    if (chiste.entrada.toLowerCase() === mensajeNormalizado) {
      return chiste.respuesta;
    }
  }

  // Buscar en los deportes
  for (const deporte of deportesData) {
    if (deporte.entrada.toLowerCase() === mensajeNormalizado) {
      return deporte.respuesta;
    }
  }

  // Buscar en el entretenimiento
  for (const entr of entretenimientoData) {
    if (entr.entrada.toLowerCase() === mensajeNormalizado) {
      return entr.respuesta;
    }
  }

  // Si no se encuentra ninguna respuesta
  return "Lo siento, no entendí eso.";
}

// Manejar ícono de enviar mensaje
sendIcon.addEventListener("click", () => {
  const mensaje = userInput.value.trim();
  if (mensaje) {
    agregarMensaje(mensaje, "usuario");
    userInput.value = ""; // Limpiar el campo de texto
    setTimeout(() => {
      const respuesta = obtenerRespuesta(mensaje); // Usar la función para obtener la respuesta
      agregarMensaje(respuesta, "ia");
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