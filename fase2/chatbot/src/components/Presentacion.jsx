import React from "react";
import { Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/bienvenida.css";

function BienvenidaChat() {
  return (
    <Container
      className="bienvenida-container d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        maxWidth: '500px',  // Aumentado un poco el tamaño máximo
        padding: '30px',
        marginTop: '50px',
        height: '50vh',  // Asegura un tamaño constante para el contenedor
      }}
    >
      <div>
        <h1 className="mb-3">¡Bienvenido a ChatAmigo</h1>
        <p className="mb-3">
          Este chatbot puede ayudarte con preguntas tanto en ingles como en español, haz clic en el menu para dirigirte con el
          <br/>TE ESTA ESPERANDO!!
        </p>
      </div>
    </Container>
  );
}

export default BienvenidaChat;