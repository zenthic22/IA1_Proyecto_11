import React, { useState, useEffect } from "react";
import * as tf from '@tensorflow/tfjs';
import { loadModelAndTokenizer } from "../utils/loadModel";  // Importar la función
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/chatbot.css";
import userImg from "../assets/jugador.png";
import botImg from "../assets/inteligencia-artificial.png";
import sendImg from "../assets/enviar.png";

function Chatbot() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [model, setModel] = useState(null);
  const [wordIndex, setWordIndex] = useState(null);
  const [labelEncoder, setLabelEncoder] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const cargarRecursos = async () => {
      const resources = await loadModelAndTokenizer();
      if (resources) {
        setModel(resources.model);
        setWordIndex(resources.wordIndex);
        setLabelEncoder(resources.labelEncoder);
      }
    };

    cargarRecursos();
  }, []);

  const textsToSequences = (texts) => {
    if (!wordIndex) return [];
    return texts.map((text) => {
      const words = text.toLowerCase().trim().split(" ");
      return words.map((word) => wordIndex[word] || 0);
    });
  };

  const padSequences = (sequences, maxLength, paddingType = 'pre', truncatingType = 'pre', paddingValue = 0) => {
    return sequences.map(seq => {
      if (seq.length > maxLength) {
        if (truncatingType === 'pre') {
          seq = seq.slice(seq.length - maxLength);
        } else {
          seq = seq.slice(0, maxLength);
        }
      }

      if (seq.length < maxLength) {
        const paddingLength = maxLength - seq.length;
        const paddingArray = new Array(paddingLength).fill(paddingValue);

        if (paddingType === 'pre') {
          seq = [...paddingArray, ...seq];
        } else {
          seq = [...seq, ...paddingArray];
        }
      }

      return seq;
    });
  };

  const procesarMensaje = async (mensajeUsuario) => {
    if (!model || !wordIndex || !labelEncoder) {
      return "Cargando modelo...";
    }

    // Preprocesar el mensaje del usuario
    const sequences = textsToSequences([mensajeUsuario]);
    const maxLength = model.input.shape[1];  // Longitud máxima de entrada esperada por el modelo
    const paddedSequences = padSequences(sequences, maxLength);

    // Crear tensor de entrada para el modelo
    const inputTensor = tf.tensor2d(paddedSequences);

    // Predecir con el modelo
    const prediction = model.predict(inputTensor);
    const predictedIndex = prediction.argMax(1).dataSync()[0];

    // Decodificar la etiqueta predicha
    const tagPredicho = labelEncoder[predictedIndex];

    // Obtener una respuesta correspondiente (deberías tener estas respuestas de alguna fuente)
    const respuestas = responses[tagPredicho];
    if (respuestas) {
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    } else {
      return "Lo siento, no entiendo tu mensaje.";
    }
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
                    className={`d-flex ${
                      msg.usuario ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <img
                      src={msg.usuario ? userImg : botImg}
                      alt="Avatar"
                      className={`chat-avatar animated-avatar`}
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