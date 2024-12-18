import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/chatbot.css";  // Asegúrate de que el CSS esté en este archivo.
import userImg from "../assets/jugador.png";
import botImg from "../assets/inteligencia-artificial.png";
import sendImg from "../assets/enviar.png";

function Chatbot() {
  const [mensaje, setMensaje] = useState(""); // Usamos un solo estado para el mensaje
  const [mensajes, setMensajes] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mensaje) {
      setMensajes([...mensajes, { texto: mensaje, usuario: true }]);
      setMensaje(""); // Limpiar el campo de entrada después de enviar
    }
  };

  return (
    <Container className="chat-container">
      <Row className="flex-grow-1">
        <Col>
          <Card>
            <Card.Body className="card-body">
              <div>
                {mensajes.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${msg.usuario ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <img
                      src={msg.usuario ? userImg : botImg}
                      alt="Avatar"
                      className={`chat-avatar animated-avatar`}
                    />
                    <div
                      className={`message-bubble ${msg.usuario ? "bg-primary" : "bg-light"} animated-message`}
                    >
                      {msg.texto}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Escribe un mensaje..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              style={{ flex: 1 }} // Hace que el input ocupe el espacio disponible
            />
            <Button
              variant="link"
              onClick={handleSubmit}
              style={{ marginLeft: "10px" }} // Botón de enviar al lado derecho
            >
              <img src={sendImg} alt="Enviar" className="send-icon" />
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Chatbot;