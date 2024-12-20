import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/chatbot.css";  // Asegúrate de que el CSS esté en este archivo.
import userImg from "../assets/jugador.png";
import botImg from "../assets/inteligencia-artificial.png";
import sendImg from "../assets/enviar.png";

// Importa la función `initialize` y `predict` desde tu archivo JS donde cargas el modelo y otros datos
import { initialize, predict } from "../utils/modelTrain";

function Chatbot() {
  const [mensaje, setMensaje] = useState(""); // Usamos un solo estado para el mensaje
  const [mensajes, setMensajes] = useState([]); // Estado para los mensajes del chatbot
  const [loading, setLoading] = useState(true); // Estado para indicar que los datos están cargando

  // Cargar los datos necesarios al inicio del componente
  useEffect(() => {
    const loadData = async () => {
      await initialize();  // Inicializa el modelo, tokenizer y labelEncoder
      setLoading(false);  // Cambia el estado a "no cargando" cuando todos los datos estén listos
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mensaje) {
      // Añadir el mensaje del usuario al chat
      setMensajes([...mensajes, { texto: mensaje, usuario: true }]);
      
      // Limpiar el campo de entrada después de enviar
      setMensaje(""); 

      // Si los datos ya están cargados, hacer la predicción
      if (!loading) {
        const botResponse = await predict(mensaje);  // Obtén la respuesta del bot usando el modelo
        setMensajes((prevMensajes) => [
          ...prevMensajes,
          { texto: botResponse, usuario: false } // Agregar la respuesta del bot al chat
        ]);
      }
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
                      className="chat-avatar animated-avatar"
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
              disabled={loading} // Deshabilita el campo mientras los datos se están cargando
            />
            <Button
              variant="link"
              onClick={handleSubmit}
              style={{ marginLeft: "10px" }} // Botón de enviar al lado derecho
              disabled={loading} // Deshabilita el botón mientras los datos se están cargando
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