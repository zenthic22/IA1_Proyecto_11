class ChatbotIA {
    constructor() {
        // Base de conocimientos y patrones de respuesta
        this.conocimientos = [
            {
                patrones: ['hola', 'buenos dias', 'saludos', 'hi', 'hey'],
                respuestas: [
                    '¡Hola! ¿Cómo estás?', 
                    'Saludos, ¿en qué puedo ayudarte?',
                    'Buen día, ¿en qué puedo ayudarte hoy?'
                ]
            },
            {
                patrones: ['adios', 'nos vemos', 'hasta luego', 'bye'],
                respuestas: [
                    'Hasta luego', 
                    'Que tengas un buen día', 
                    'Fue un gusto ayudarte'
                ]
            },
            {
                patrones: ['como estas', 'que tal', 'how are you'],
                respuestas: [
                    'Estoy bien, gracias por preguntar', 
                    'Funcionando correctamente, ¿y tú?',
                    'Todo bien, lista para ayudarte'
                ]
            },
            {
                patrones: ['ayuda', 'help', 'ayudame'],
                respuestas: [
                    'Estoy aquí para ayudarte, ¿qué necesitas?',
                    'Claro, dime en qué puedo asistirte',
                    'Estoy listo para ayudarte, ¿cuál es tu consulta?'
                ]
            }
        ];
    }

    // Método para encontrar la mejor coincidencia
    encontrarRespuesta(mensaje) {
        // Convertir mensaje a minúsculas
        mensaje = mensaje.toLowerCase().trim();

        // Buscar coincidencias en los patrones
        for (let conocimiento of this.conocimientos) {
            for (let patron of conocimiento.patrones) {
                if (mensaje.includes(patron)) {
                    // Devolver respuesta aleatoria
                    return conocimiento.respuestas[
                        Math.floor(Math.random() * conocimiento.respuestas.length)
                    ];
                }
            }
        }

        // Respuesta por defecto si no se encuentra coincidencia
        const respuestasPorDefecto = [
            'Lo siento, no entiendo completamente', 
            '¿Podrías explicar eso de otra manera?',
            'No estoy seguro de cómo responder a eso'
        ];

        return respuestasPorDefecto[
            Math.floor(Math.random() * respuestasPorDefecto.length)
        ];
    }

    // Método para analizar la intención del mensaje (versión simple)
    analizarIntencion(mensaje) {
        mensaje = mensaje.toLowerCase().trim();

        // Detección simple de tipos de mensajes
        if (mensaje.endsWith('?')) {
            return 'pregunta';
        }

        if (mensaje.startsWith('hola') || mensaje.startsWith('hey')) {
            return 'saludo';
        }

        if (mensaje.startsWith('adios') || mensaje.startsWith('bye')) {
            return 'despedida';
        }

        return 'declaracion';
    }
}

// Inicialización del chatbot al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del chatbot
    const chatbot = new ChatbotIA();

    // Elementos del DOM
    const inputElement = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('chat-container');

    // Función para enviar mensaje
    function enviarMensaje() {
        const mensaje = inputElement.value;

        if (mensaje.trim() === '') return;

        // Mostrar mensaje del usuario
        chatContainer.innerHTML += `<p><strong>Tú:</strong> ${mensaje}</p>`;

        // Analizar intención
        const intencion = chatbot.analizarIntencion(mensaje);
        
        // Generar respuesta del chatbot
        const respuesta = chatbot.encontrarRespuesta(mensaje);
        
        // Mostrar respuesta
        chatContainer.innerHTML += `<p><strong>Chatbot:</strong> ${respuesta}</p>`;

        // Opcional: mostrar intención detectada (para depuración)
        chatContainer.innerHTML += `<p><em>Intención detectada: ${intencion}</em></p>`;

        // Limpiar input y scroll al final
        inputElement.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Evento de clic en botón
    sendButton.addEventListener('click', enviarMensaje);

    // Evento de presión de tecla Enter
    inputElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            enviarMensaje();
        }
    });
});