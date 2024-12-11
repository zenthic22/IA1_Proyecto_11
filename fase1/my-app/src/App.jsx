import React, { useState, useEffect } from 'react';
import { trainModel, predict } from './iamodel';
import intents from './intent.json'; // Carga el archivo de intents
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  const agregarMensaje = (mensaje, tipo) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { mensaje, tipo }
    ]);
  };

  useEffect(() => {
    const entrenarModelo = async () => {
      try {
        await trainModel(); // Entrena el modelo una vez
      } catch (error) {
        console.error("Error durante el entrenamiento del modelo:", error);
      }
    };

    entrenarModelo();
  }, []); // Solo ejecuta al montar

  const enviarMensaje = () => {
    if (userInput.trim()) {
      agregarMensaje(userInput, 'usuario');
      setUserInput('');

      setTimeout(() => {
        const intent = predict(userInput);
        const responses = intents.intents.find((i) => i.tag === intent).responses;
        const response = responses[Math.floor(Math.random() * responses.length)];
        agregarMensaje(response, 'ia');
      }, 1000);
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
    </div>
  );
}

export default App;