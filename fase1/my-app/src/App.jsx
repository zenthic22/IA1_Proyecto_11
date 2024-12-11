import React, { useState, useEffect } from 'react';
import { trainModel, predict } from './iamodel';
import intents from './intent.json'; // Carga el archivo de intents
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para indicar si el modelo está entrenando

  const agregarMensaje = (mensaje, tipo) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { mensaje, tipo }
    ]);
  };

  // Entrena el modelo una vez al montar el componente
  useEffect(() => {
    const entrenarModelo = async () => {
      try {
        console.log("Entrenando el modelo...");
        await trainModel();
        console.log("Modelo entrenado con éxito.");
      } catch (error) {
        console.error("Error durante el entrenamiento del modelo:", error);
      } finally {
        setLoading(false); // Marca como listo después del entrenamiento
      }
    };

    entrenarModelo();
  }, []); // Solo ejecuta una vez al montar

  const enviarMensaje = () => {
    if (loading) {
      agregarMensaje("Por favor, espera. El modelo aún está cargando...", "ia");
      return;
    }

    if (userInput.trim()) {
      agregarMensaje(userInput, 'usuario');
      setUserInput('');

      setTimeout(() => {
        try {
          const intent = predict(userInput); // Realiza la predicción
          const responses = intents.intents.find((i) => i.tag === intent).responses;
          const response = responses[Math.floor(Math.random() * responses.length)];
          agregarMensaje(response, 'ia');
        } catch (error) {
          console.error("Error durante la predicción:", error);
          agregarMensaje("Lo siento, no entendí tu mensaje. ¿Puedes reformularlo?", "ia");
        }
      }, 1000); // Simula un pequeño retraso para la respuesta
    }
  };

  return (
    <div className="App ia-theme">
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
            placeholder={loading ? "Cargando modelo..." : "Escribe tu mensaje..."}
            disabled={loading} // Deshabilitar el input mientras el modelo se entrena
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
    </div>
  );
}

export default App;