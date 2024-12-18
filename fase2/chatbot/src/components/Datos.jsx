import React from 'react';
import { Button, Container, Row, Col, Table } from 'react-bootstrap';
import '../styles/informacion.css';  // Asegúrate de tener el CSS correspondiente

// Asegúrate de tener las rutas correctas para los archivos descargables
import manualUsuario from '../assets/IA - Clase 8 2S.pdf';
import manualTecnico from '../assets/IA - Clase 9 2S.pdf';

// Imágenes de los botones
import repoIcon from '../assets/social.png';  // Cambia la ruta si es necesario
import manualUsuarioIcon from '../assets/manual-usuario.png';  // Cambia la ruta si es necesario
import manualTecnicoIcon from '../assets/manual-tecnico.png';  // Cambia la ruta si es necesario

function InformacionApp() {
  return (
    <Container className="info-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={8}>
          {/* Información de la tabla */}
          <div className="info-box">
            <h2>Integrantes del Grupo - 11</h2>
          </div>

          {/* Tabla con la información de los estudiantes */}
          <Table striped bordered hover className="info-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Carnet</th>
              </tr>
            </thead>
            <tbody>
              {/* Persona 1 */}
              <tr>
                <td>Erick Abdul Chacon Barillas</td>
                <td>201807169</td>
              </tr>

              {/* Persona 2 */}
              <tr>
                <td>Nataly Saraí Guzmán Duarte</td>
                <td>202001570</td>
              </tr>

              {/* Persona 3 */}
              <tr>
                <td>Ana Belén Contreras Orozco</td>
                <td>201901604</td>
              </tr>
            </tbody>
          </Table>

          {/* Botones debajo de la tabla */}
          <div className="button-container">
            <Button 
              variant="link" 
              href="https://github.com/zenthic22/IA1_Proyecto_11" 
              target="_blank" 
              className="info-button left"
            >
              <img src={repoIcon} alt="Repositorio" className="button-img" />
            </Button>

            <Button 
              variant="link" 
              href={manualUsuario} 
              download 
              className="info-button center"
            >
              <img src={manualUsuarioIcon} alt="Manual Usuario" className="button-img" />
            </Button>

            <Button 
              variant="link" 
              href={manualTecnico} 
              download 
              className="info-button right"
            >
              <img src={manualTecnicoIcon} alt="Manual Técnico" className="button-img" />
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default InformacionApp;