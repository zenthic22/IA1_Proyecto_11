import React, { useState } from "react";
import BienvenidaChat from './components/Presentacion';  // Componente de bienvenida
import Chatbot from './components/Chatbot';  // Componente del chatbot
import InformacionApp from './components/Datos';  // Componente de información de la app
import { Container, Button, Offcanvas } from "react-bootstrap";  // Importamos Offcanvas
import './styles/general.css';  // Estilos generales
import './styles/theme.css';    // Estilos de tema
import menuIcon from './assets/cuadricula.png';  // Icono del menú
import chatIcon from './assets/chat.png';  // Icono del chat
import themeIcon from './assets/theme.png';  // Icono del cambio de tema
import infoIcon from './assets/info.png';  // Icono para información
import backIcon from './assets/flecha.png';  // Icono del botón de regreso

function App() {
  const [mostrarComponente, setMostrarComponente] = useState("bienvenida");  // Estado para manejar qué componente mostrar
  const [theme, setTheme] = useState("light");  // Estado para manejar el tema
  const [show, setShow] = useState(false);  // Estado para manejar la visibilidad del menú lateral (Offcanvas)

  // Función para cambiar el tema entre claro y oscuro
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(newTheme);  // Cambiar la clase del body para aplicar el nuevo tema
  };

  // Función para manejar la visibilidad del menú lateral
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Función para mostrar el componente del chatbot
  const iniciarChat = () => {
    setMostrarComponente("chatbot");
    setShow(false); // Cerrar el menú lateral después de seleccionar "Ir al Chat"
  };

  // Función para mostrar el componente de información
  const mostrarInformacion = () => {
    setMostrarComponente("informacion");
    setShow(false); // Cerrar el menú lateral después de seleccionar "Información"
  };

  // Función para regresar al componente de bienvenida
  const regresar = () => {
    setMostrarComponente("bienvenida");
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        maxWidth: '500px', // Ancho máximo
        maxHeight: '90vh', // Alto máximo
        padding: '20px',
        marginTop: '50px', // Margen superior opcional
      }}
    >
      {/* Botón para mostrar el menú lateral (Offcanvas) */}
      <Button 
        variant="link" 
        onClick={handleShow} 
        style={{
          position: 'absolute',  // Posiciona el botón en la esquina superior izquierda
          top: '10px',           
          left: '10px',          
          padding: 0,            
          border: 'none',        
        }}
      >
        <img src={menuIcon} alt="Menú" style={{ width: '40px', height: '40px' }} />
      </Button>

      {/* Botón de regreso */}
      {mostrarComponente !== "bienvenida" && (
        <Button 
          variant="link" 
          onClick={regresar} 
          style={{
            position: 'absolute',  // Posiciona el botón en la esquina superior derecha
            top: '10px',           
            right: '10px',          
            padding: 0,            
            border: 'none',        
          }}
        >
          <img src={backIcon} alt="Regresar" style={{ width: '40px', height: '40px' }} />
        </Button>
      )}

      {/* Menú Offcanvas */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú Principal</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Contenedor vertical con botones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Botón para iniciar el Chatbot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={chatIcon} alt="Ir al Chat" style={{ width: '30px', height: '30px' }} />
              <Button 
                variant="link" 
                onClick={iniciarChat} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Ir al Chat
              </Button>
            </div>

            {/* Botón para cambiar tema */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={themeIcon} alt="Cambiar Tema" style={{ width: '30px', height: '30px' }} />
              <Button 
                variant="link" 
                onClick={toggleTheme} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Cambiar a {theme === "light" ? "Oscuro" : "Claro"}
              </Button>
            </div>

            {/* Botón de Información */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={infoIcon} alt="Información" style={{ width: '30px', height: '30px' }} />
              <Button 
                variant="link" 
                onClick={mostrarInformacion} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Información
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Renderizar componentes según el estado */}
      {mostrarComponente === "bienvenida" && <BienvenidaChat />}
      {mostrarComponente === "chatbot" && <Chatbot />}
      {mostrarComponente === "informacion" && <InformacionApp />}
    </Container>
  );
}

export default App;