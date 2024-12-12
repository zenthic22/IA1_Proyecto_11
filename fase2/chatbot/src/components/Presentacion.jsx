import React from "react";
import { Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/bienvenida.css";

function BienvenidaChat({ iniciarChat }) {
  return (
    <Container
      className="bienvenida-container d-flex justify-content-center align-items-center"
      style={{
        maxWidth: '500px',  // Aumentado un poco el tamaño máximo
        padding: '30px',
        marginTop: '50px',
      }}
    >
      <div className="text-center">
        <h1 className="mb-3">¡Bienvenido al Chatbot Traductor!</h1>
        <p className="mb-3">
          Este chatbot puede ayudarte a traducir mensajes de español a inglés y responderá en ambos idiomas.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={iniciarChat}
        >
          Empezar a chatear
        </Button>
      </div>
    </Container>
  );
}

export default BienvenidaChat;