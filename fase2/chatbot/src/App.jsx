import React, { useState } from "react";
import BienvenidaChat from './components/Presentacion';  // Asegúrate de importar el componente de bienvenida
import Chatbot from './components/Chatbot';  // Asegúrate de que el componente de Chatbot esté importado
import { Container } from "react-bootstrap";
import './styles/general.css'

function App() {
  const [mostrarChat, setMostrarChat] = useState(false);  // Estado para mostrar el chatbot

  // Función para manejar el inicio del chat
  const iniciarChat = () => {
    setMostrarChat(true);  // Cambiar el estado para mostrar el chatbot
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        maxWidth: '500px', // Ancho máximo
        maxHeight: '40vh', // Alto máximo (80% de la altura de la ventana)
        padding: '20px',
        marginTop: '50px', // Opcional: añade un poco de margen superior
      }}
    >
      {!mostrarChat ? (
        <BienvenidaChat iniciarChat={iniciarChat} />  // Si no se está mostrando el chat, renderiza la bienvenida
      ) : (
        <Chatbot />  // Si el chat está activo, renderiza el chatbot
      )}
    </Container>
  );
}

export default App;