const tf = require('@tensorflow/tfjs-node');


// Datos de entrada
const datos = [
    ["hola", "saludo", "¡Hola! ¿Cómo te puedo ayudar?"],
    ["¿cómo estás?", "saludo", "¡Hola! ¿Cómo te va?"],
    ["gracias", "agradecimiento", "De nada, estoy aquí para ayudarte."],
    // Más datos aquí...
];

// Separar frases, categorías y respuestas
const frases = datos.map(d => d[0]);
const categorias = datos.map(d => d[1]);
const respuestas = datos.map(d => d[2]);

// Tokenización
const vocabulario = {};
let index = 1; // Inicia en 1 porque 0 se usa para padding
frases.forEach(frase => {
    frase.split(/\s+/).forEach(palabra => {
        if (!vocabulario[palabra]) vocabulario[palabra] = index++;
    });
});

// Convertir frases a secuencias de números
const sequences = frases.map(frase => 
    frase.split(/\s+/).map(palabra => vocabulario[palabra] || 0)
);

// Rellenar secuencias a la misma longitud
const maxLength = Math.max(...sequences.map(seq => seq.length));
const padSequences = (sequences, maxLength) =>
    sequences.map(seq => Array(maxLength).fill(0).map((_, i) => seq[i] || 0));

const X = tf.tensor2d(padSequences(sequences, maxLength));

// Codificar las categorías
const categoriasUnicas = [...new Set(categorias)];
const y = tf.tensor1d(categorias.map(cat => categoriasUnicas.indexOf(cat)), 'float32');

const model = tf.sequential();

// Capa de Embedding
model.add(tf.layers.embedding({
    inputDim: Object.keys(vocabulario).length + 1, // +1 para incluir el token OOV
    outputDim: 16,
    inputLength: maxLength
}));

// Capa LSTM
model.add(tf.layers.lstm({units: 32, returnSequences: false}));

// Capas Densas
model.add(tf.layers.dense({units: 16, activation: 'relu'}));
model.add(tf.layers.dense({units: categoriasUnicas.length, activation: 'softmax'}));

// Compilar el modelo
model.compile({
    optimizer: tf.train.adam(),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
});

(async () => {
    await model.fit(X, y, {
        epochs: 100,
        batchSize: 2,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
            }
        }
    });

    // Probar el chatbot
    const probarChatbot = (frase) => {
        const secuencia = frase.split(/\s+/).map(palabra => vocabulario[palabra] || 0);
        const secuenciaPad = padSequences([secuencia], maxLength);
        const tensorEntrada = tf.tensor2d(secuenciaPad);

        const prediccion = model.predict(tensorEntrada);
        const categoriaPredichaIndex = prediccion.argMax(1).dataSync()[0];
        const categoriaPredicha = categoriasUnicas[categoriaPredichaIndex];

        const respuestasFiltradas = datos.filter(d => d[1] === categoriaPredicha).map(d => d[2]);
        return respuestasFiltradas.length 
            ? respuestasFiltradas[Math.floor(Math.random() * respuestasFiltradas.length)]
            : "Lo siento, no entiendo eso.";
    };

    console.log(probarChatbot("hola"));
})();
