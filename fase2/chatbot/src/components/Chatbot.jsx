import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/chatbot.css"; // Asegúrate de que el CSS esté en este archivo.
import userImg from "../assets/jugador.png";
import botImg from "../assets/inteligencia-artificial.png";
import sendImg from "../assets/enviar.png";
import { predict, trainModel } from '../utils/loadModel'; // Asegúrate de importar correctamente

function Chatbot() {
  const [mensaje, setMensaje] = useState(""); // Estado para el mensaje del usuario
  const [mensajes, setMensajes] = useState([]); // Estado para almacenar los mensajes del chat
  const [modeloEntrenado, setModeloEntrenado] = useState(false); // Estado para saber si el modelo está entrenado
  const [entrenando, setEntrenando] = useState(false); // Estado para mostrar que el modelo está entrenando

  // Función que maneja el envío de mensajes
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    if (mensaje) {
      // Añadir el mensaje del usuario al estado de mensajes
      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { texto: mensaje, usuario: true },
      ]);

      try {
        // Obtener la respuesta del bot usando la función 'predict'
        const respuestaBot = await predict(mensaje); // Asegúrate de esperar a la Promesa
        // Añadir la respuesta del bot al estado de mensajes
        setMensajes((prevMensajes) => [
          ...prevMensajes,
          { texto: respuestaBot, usuario: false },
        ]);
      } catch (error) {
        console.error("Error al obtener la respuesta del bot:", error);
        setMensajes((prevMensajes) => [
          ...prevMensajes,
          { texto: "Ocurrió un error al procesar tu mensaje.", usuario: false },
        ]);
      }

      setMensaje(""); // Limpiar el campo de entrada
    }
  };

  // Llamar a la función de entrenamiento del modelo al cargar el componente
  useEffect(() => {
    const entrenarModelo = async () => {
      setEntrenando(true);
      try {
        await trainModel();
        setModeloEntrenado(true); // Una vez entrenado el modelo, cambiar el estado
      } catch (error) {
        console.error("Error al entrenar el modelo:", error);
      }
      setEntrenando(false);
    };

    entrenarModelo(); // Iniciar el proceso de entrenamiento
  }, []);

  return (
    <Container className="chat-container">
      <Row className="flex-grow-1">
        <Col>
          <Card>
            <Card.Body className="card-body">
              <div>
                {/* Mostrar mensaje sobre el estado del modelo */}
                {modeloEntrenado && (
                  <div className="alert alert-success" role="alert">
                    El modelo está entrenado y listo para usarse.
                  </div>
                )}
                {entrenando && (
                  <div className="alert alert-info" role="alert">
                    El modelo se está entrenando, por favor espera...
                  </div>
                )}

                {/* Mostrar los mensajes del chat */}
                {mensajes.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${
                      msg.usuario ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <img
                      src={msg.usuario ? userImg : botImg}
                      alt="Avatar"
                      className="chat-avatar animated-avatar"
                    />
                    <div
                      className={`message-bubble ${
                        msg.usuario ? "bg-primary" : "bg-light"
                      } animated-message`}
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
              style={{ flex: 1 }}
            />
            <Button
              variant="link"
              onClick={handleSubmit}
              style={{ marginLeft: "10px" }}
              disabled={!modeloEntrenado} // Desactivar el botón hasta que el modelo esté entrenado
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
