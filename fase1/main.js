// Cargar el modelo de QnA de TensorFlow.js
import * as qna from '@tensorflow-models/qna';
import * as tf from '@tensorflow/tfjs';

let modelo;

// Cargar el modelo QnA
async function cargarModelo() {
  try {
    modelo = await qna.load();
    console.log('Modelo QnA cargado correctamente');
  } catch (error) {
    console.error('Error al cargar el modelo QnA:', error);
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

// Función para obtener la respuesta usando el modelo QnA
async function obtenerRespuesta(input) {
  if (!modelo) {
    console.error('Modelo no cargado');
    return "Lo siento, modelo no disponible.";
  }

  const mensajeNormalizado = normalizarTexto(input);

  // Definir un contexto (puede ser un documento o un conjunto de datos)
  const contexto = `
    El sol es una estrella en el centro del sistema solar. Proporciona luz y calor a la Tierra, 
    y sin él, no existiría vida en el planeta. El sol es principalmente una esfera de gas compuesto 
    de hidrógeno y helio.
  `;

  // Realizar la predicción utilizando el contexto y la pregunta (mensaje)
  const respuestas = await modelo.answer(contexto, mensajeNormalizado);

  // Obtener la mejor respuesta del modelo
  if (respuestas && respuestas.length > 0) {
    return respuestas[0].text; // Devuelve la respuesta más probable
  } else {
    return "Lo siento, no tengo suficiente información para responder a tu pregunta.";
  }
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
