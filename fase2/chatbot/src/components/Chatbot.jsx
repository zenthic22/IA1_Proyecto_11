import React, { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/chatbot.css";  // Asegúrate de que el CSS esté en este archivo.
import userImg from "../assets/jugador.png";
import botImg from "../assets/inteligencia-artificial.png";
import sendImg from "../assets/enviar.png";
import micImg from "../assets/microfono.png";
import translateImg from "../assets/traducir.png";

function Chatbot() {
  const [mensajeEspanol, setMensajeEspanol] = useState("");
  const [mensajeIngles, setMensajeIngles] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const mensaje = mensajeEspanol || mensajeIngles;

    if (mensaje) {
      setMensajes([...mensajes, { texto: mensaje, usuario: true }]);
      setMensajeEspanol("");
      setMensajeIngles("");
    }
  };

  const translateMessage = () => {
    setMensajeIngles(mensajeEspanol); // Simulación de traducción
    setMensajeEspanol("");
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
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex justify-content-between">
            <Button variant="link" onClick={handleSubmit}>
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
}

export default Chatbot;