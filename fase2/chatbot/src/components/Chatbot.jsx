import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/chatbot.css";
import userImg from "../assets/jugador.png";
import botImg from "../assets/inteligencia-artificial.png";
import sendImg from "../assets/enviar.png";

function Chatbot() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [model, setModel] = useState(null);
  const [tokenizer, setTokenizer] = useState(null);
  const [labelEncoder, setLabelEncoder] = useState(null);

  // Cargar el modelo y los archivos necesarios al montar el componente
  useEffect(() => {
    const cargarModelo = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/modelo/model.json");
        setModel(loadedModel);

        const tokenizerResponse = await fetch("/modelo/tokenizer.json");
        const tokenizerData = await tokenizerResponse.json();
        setTokenizer(tokenizerData);

        const labelEncoderResponse = await fetch("/modelo/label_encoder.json");
        const labelEncoderData = await labelEncoderResponse.json();
        setLabelEncoder(labelEncoderData.classes);
      } catch (error) {
        console.error("Error al cargar el modelo o los archivos:", error);
      }
    };

    cargarModelo();
  }, []);

  const procesarMensaje = async (mensajeUsuario) => {
    if (!model || !tokenizer || !labelEncoder) return "Cargando modelo...";

    // Preprocesar el mensaje del usuario
    const mensajePreprocesado = mensajeUsuario.toLowerCase().replace(/[^\w\s]/gi, "");

    // Tokenizar el texto
    const tokens = mensajePreprocesado
      .split(" ")
      .map((palabra) => tokenizer.word_index[palabra] || 0);
    const input = tf.tensor2d([tokens], [1, tokens.length]);

    // Predecir con el modelo
    const paddedInput = tf.pad(input, [[0, 0], [0, model.input.shape[1] - tokens.length]]);
    const prediction = model.predict(paddedInput);
    const predictedIndex = prediction.argMax(1).dataSync()[0];

    // Decodificar la etiqueta predicha
    const tagPredicho = labelEncoder[predictedIndex];

    // Obtener la respuesta correspondiente
    const respuesta = data.intents.find((intent) => intent.tag === tagPredicho)?.responses[0];
    return respuesta || "Lo siento, no entiendo tu mensaje.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mensaje) {
      setMensajes([...mensajes, { texto: mensaje, usuario: true }]);
      const respuesta = await procesarMensaje(mensaje);
      setMensajes((prev) => [...prev, { texto: respuesta, usuario: false }]);
      setMensaje("");
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
              style={{ flex: 1 }}
            />
            <Button
              variant="link"
              onClick={handleSubmit}
              style={{ marginLeft: "10px" }}
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