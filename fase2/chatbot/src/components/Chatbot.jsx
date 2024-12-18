import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/chatbot.css";  // Asegúrate de que el CSS esté en este archivo.
import userImg from "../assets/jugador.png";
import botImg from "../assets/inteligencia-artificial.png";
import sendImg from "../assets/enviar.png";
import micImg from "../assets/microfono.png";
import translateImg from "../assets/traducir.png";
import * as tf from '@tensorflow/tfjs';

const modelJsonUrl = 'fase2\chatbot\src\assets\model.json';  // Cambia esta URL a donde estén tus archivos JSON
const tokenizerJsonUrl = 'fase2\chatbot\src\assets\tokenizer.json';  // Cambia esta URL a donde estén tus archivos JSON

const Chatbot = () => {
  const [mensajeEspanol, setMensajeEspanol] = useState("");
  const [mensajeIngles, setMensajeIngles] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [model, setModel] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { texto: "Audio enviado", usuario: true, audioUrl },
      ]);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mensaje = mensajeEspanol || mensajeIngles;

    if (mensaje) {
      setMensajes([...mensajes, { texto: mensaje, usuario: true }]);
      setMensajeEspanol("");
      setMensajeIngles("");
    }
  };

  const translateMessage = () => {
    // Simulación de traducción (puedes implementar una API de traducción real si lo deseas)
    setMensajeIngles(mensajeEspanol);
    setMensajeEspanol("");
  };

  const textsToSequences = (texts) => {
    return texts.map(text => {
      const words = text.toLowerCase().trim().split(" ");
      return words.map(word => wordIndex[word] || 0);
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

  const loadModel = async () => {
    try {
      const response = await fetch(modelJsonUrl);
      const modelJson = await response.json();
      const loadedModel = await tf.loadLayersModel(tf.io.fromMemory(modelJson));
      setModel(loadedModel);
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  const analyzeInput = async () => {
    if (model) {
      let user_input = mensajeEspanol.toLowerCase();
      let sequences = textsToSequences([user_input]);
      sequences = padSequences(sequences, 5, 'pre', 'pre', 0);

      // Predicción del modelo
      const prediction = model.predict(tf.tensor2d(sequences, [1, 5]));
      const predictedIndex = prediction.argMax(1).dataSync()[0];
      // Aquí puedes manejar el resultado de la predicción según tus necesidades
      console.log(predictedIndex); // Esto es solo un ejemplo
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

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
                      {msg.audioUrl && (
                        <audio controls src={msg.audioUrl}>
                          Tu navegador no soporta el elemento de audio.
                        </audio>
                      )}
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
              placeholder="Escribe en Español..."
              value={mensajeEspanol}
              onChange={(e) => setMensajeEspanol(e.target.value)}
            />
            <Button variant="link" onClick={translateMessage}>
              <img src={translateImg} alt="Traducir" className="icon-button" />
            </Button>
            <Form.Control
              type="text"
              placeholder="Traducido al Inglés..."
              value={mensajeIngles}
              readOnly
            />
            <Button variant="link" onClick={analyzeInput}>
              <img src={sendImg} alt="Enviar" className="send-icon" />
            </Button>
            <Button
              variant="link"
              onClick={isRecording ? stopRecording : startRecording}
            >
              <img src={micImg} alt="Micrófono" className="mic-icon" />
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Chatbot;
