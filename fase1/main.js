// Cargar el modelo de TensorFlow.js
let modelo;
async function cargarModelo() {
  try {
    // Cargar el modelo desde la carpeta donde está almacenado
    modelo = await tf.loadLayersModel('modelo/model.json');
    console.log('Modelo cargado correctamente');
    modelo.summary();  // Esto imprimirá la estructura del modelo, incluyendo la capa de entrada
  } catch (error) {
    console.error('Error al cargar el modelo:', error);
  }
}

// Capturar elementos del DOM
const sendIcon = document.getElementById("send-icon");
const userInput = document.getElementById("user-input");
const messagesDiv = document.getElementById("messages");

// Función para agregar mensajes al chat
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
    messageContainer.appendChild(bubble);
    messageContainer.appendChild(icon);
  } else {
    messageContainer.appendChild(icon);
    messageContainer.appendChild(bubble);
  }

  messagesDiv.appendChild(messageContainer);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Desplazar hacia abajo
}

// Función para preprocesar y normalizar el texto
function normalizarTexto(texto) {
  return texto.toLowerCase().trim();
}

// Función para predecir la respuesta utilizando el modelo cargado
async function obtenerRespuesta(input) {
  if (!modelo) {
    console.error('Modelo no cargado');
    return "Lo siento, modelo no disponible.";
  }

  const mensajeNormalizado = normalizarTexto(input);

  // Preprocesar el mensaje de entrada (convertir a formato adecuado para el modelo)
  const inputArray = mensajeNormalizado.split(' '); // Esto es solo un ejemplo; ajusta según tu modelo
  const tensorInput = tf.tensor2d([inputArray.map(word => word.charCodeAt(0))]); // Este es un ejemplo básico

  // Realizar la predicción
  const prediccion = modelo.predict(tensorInput);

  // Suponiendo que el modelo devuelve probabilidades para categorías (ajusta según tu modelo)
  const categoriaIndex = prediccion.argMax(-1).dataSync()[0];
  const categorias = ['Categoria1', 'Categoria2', 'Categoria3']; // Ajusta según tus categorías
  return `Respuesta para ${categorias[categoriaIndex]}`;
}

// Manejar el envío de un mensaje
sendIcon.addEventListener("click", async () => {
  const mensaje = userInput.value.trim();
  if (mensaje) {
    agregarMensaje(mensaje, "usuario");
    userInput.value = ""; // Limpiar el campo de texto
    setTimeout(async () => {
      const respuesta = await obtenerRespuesta(mensaje); // Usar la función para obtener la respuesta
      agregarMensaje(respuesta, "ia");
    }, 1000);
  }
});

// Cargar el modelo cuando se inicie la página
window.onload = () => {
  cargarModelo();
};