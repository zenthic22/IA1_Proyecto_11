import React, { useState, useEffect } from 'react';
import * as qna from '@tensorflow-models/qna';
import * as tf from '@tensorflow/tfjs';
import './App.css';

function App() {
  const [modelo, setModelo] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState('light'); // Estado para el tema

  // Cargar el modelo de QnA cuando la app se monta
  useEffect(() => {
    const cargarModelo = async () => {
      try {
        const model = await qna.load();
        console.log('Modelo QnA cargado correctamente');
        setModelo(model);
      } catch (error) {
        console.error('Error al cargar el modelo QnA:', error);
      }
    };
    cargarModelo();
  }, []);

  // Función para agregar mensajes al chat
  const agregarMensaje = (mensaje, tipo) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { mensaje, tipo }
    ]);
  };

  // Función para normalizar el texto de entrada
  const normalizarTexto = (texto) => {
    return texto.toLowerCase().trim();
  };

  // Función para obtener la respuesta usando el modelo QnA
  const obtenerRespuesta = async (input) => {
    if (!modelo) {
      console.error('Modelo no cargado');
      return "Lo siento, modelo no disponible.";
    }

    const mensajeNormalizado = normalizarTexto(input);

    // Definir un contexto (puede ser un documento o un conjunto de datos)
    const contexto = `El sol es una estrella en el centro del sistema solar. Proporciona luz y calor a la Tierra, 
      y sin él, no existiría vida en el planeta. El sol es principalmente una esfera de gas compuesto 
      de hidrógeno y helio.`;

    const respuestas = await modelo.answer(contexto, mensajeNormalizado);
    if (respuestas && respuestas.length > 0) {
      return respuestas[0].text; // Devuelve la respuesta más probable
    } else {
      return "Lo siento, no tengo suficiente información para responder a tu pregunta.";
    }
  };

  // Función para manejar el envío de mensajes
  const enviarMensaje = async () => {
    if (userInput.trim()) {
      agregarMensaje(userInput, 'usuario');
      setUserInput(''); // Limpiar el campo de texto
      setTimeout(async () => {
        const respuesta = await obtenerRespuesta(userInput); // Usar la función para obtener la respuesta
        agregarMensaje(respuesta, 'ia');
      }, 1000);
    }
  };

  // Función para cambiar el tema
  const cambiarTema = (nuevoTema) => {
    setTheme(nuevoTema);
  };

  return (
    <div className={`App ${theme}-theme`}>
      <div id="chat-container">
        <h1>ChatAmigo</h1>
        <div id="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-container ${msg.tipo}`}>
              <img
                className="message-icon"
                src={msg.tipo === 'usuario' ? 'img/usuario.png' : 'img/bot.png'}
                alt={msg.tipo}
              />
              <div className="chat-bubble">{msg.mensaje}</div>
            </div>
          ))}
        </div>
        <div id="input-container">
          <img
            src="img/adjuntar.png"
            alt="Adjuntar archivo"
            id="attach-icon"
            className="input-icon"
          />
          <input
            id="user-input"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <img
            src="img/enviar.png"
            alt="Enviar mensaje"
            id="send-icon"
            className="input-icon"
            onClick={enviarMensaje}
          />
          <img
            src="img/registro.png"
            alt="Grabar audio"
            id="audio-icon"
            className="input-icon"
          />
        </div>
      </div>

      <div id="theme-toggle-menu">
        <img src="img/menu.png" alt="Menú" id="menu-icon" />
        <div id="theme-menu">
          <div className="theme-option" onClick={() => cambiarTema('dark')}>
            <img src="img/modo-oscuro.png" alt="Oscuro" />
            <span>Oscuro</span>
          </div>
          <div className="theme-option" onClick={() => cambiarTema('light')}>
            <img src="img/modo-claro.png" alt="Claro" />
            <span>Claro</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
