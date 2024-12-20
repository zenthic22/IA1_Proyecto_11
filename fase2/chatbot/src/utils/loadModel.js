import * as tf from '@tensorflow/tfjs';
import intents from '../dataset/intents.json'; // Ruta al archivo intents.json

// Función para tokenizar el texto
const tokenizer = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .split(" ");
};

// Preparar los datos del dataset
const prepareData = (intents) => {
  const words = [];
  const labels = [];
  const data = [];

  intents.intents.forEach((intent) => {
    intent.patterns.forEach((pattern) => {
      const tokenizedPattern = tokenizer(pattern);
      words.push(...tokenizedPattern);
      data.push({ input: tokenizedPattern, output: intent.tag });
    });

    if (!labels.includes(intent.tag)) labels.push(intent.tag);
  });

  // Construir vocabulario único
  const uniqueWords = [...new Set(words)];
  const vocab = uniqueWords.reduce((acc, word, index) => ({ ...acc, [word]: index + 1 }), {});

  // Configurar longitud máxima de entrada
  const maxInputLength = 20; // Incrementar longitud máxima para manejar frases más largas
  const inputs = data.map((item) =>
    item.input.map((word) => vocab[word] || 0).concat(new Array(maxInputLength).fill(0)).slice(0, maxInputLength)
  );

  const outputs = data.map((item) => {
    const labelIndex = labels.indexOf(item.output);
    const oneHot = Array(labels.length).fill(0);
    oneHot[labelIndex] = 1;
    return oneHot;
  });

  return { inputs, outputs, vocab, labels, maxInputLength };
};

// Preparar datos globales
const { inputs, outputs, vocab, labels, maxInputLength } = prepareData(intents);

// Crear y compilar el modelo
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [maxInputLength], units: 16, activation: 'relu' }));
model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }));
model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

let isTraining = false;

// Función para entrenar el modelo
export const trainModel = async () => {
  if (isTraining) {
    console.warn("El modelo ya está en proceso de entrenamiento.");
    return;
  }

  isTraining = true;

  try {
    const xs = tf.tensor2d(inputs);
    const ys = tf.tensor2d(outputs);

    console.log("Entrenando el modelo...");
    await model.fit(xs, ys, {
      epochs: 1000,
      batchSize: 8,
    });

    console.log("Modelo entrenado");
  } catch (error) {
    console.error("Error durante el entrenamiento:", error);
  } finally {
    isTraining = false;
  }
};

// Función para predecir y obtener la respuesta
export const predict = async (text) => {
  const tokenizedText = tokenizer(text);
  const input = tokenizedText
    .map((word) => vocab[word] || 0)
    .concat(new Array(maxInputLength).fill(0))
    .slice(0, maxInputLength);

  const tensorInput = tf.tensor2d([input]);
  const prediction = model.predict(tensorInput);
  const probabilities = await prediction.data();
  const predictedIndex = prediction.argMax(-1).dataSync()[0];
  const maxProbability = Math.max(...probabilities);

  console.log('Probabilidades:', probabilities);

  if (maxProbability < 0.5) {
    return "Lo siento, no estoy seguro de entenderte. ¿Puedes reformular tu pregunta?";
  }

  const label = labels[predictedIndex];
  const intent = intents.intents.find((i) => i.tag === label);

  if (intent) {
    // Elegir una respuesta aleatoria
    const randomResponseIndex = Math.floor(Math.random() * intent.responses.length);
    return intent.responses[randomResponseIndex];
  }

  return "No estoy seguro, ¿puedes hacer otra pregunta?";
};

// Función para cargar y entrenar el modelo
export const loadModel = async () => {
  await trainModel(); // Entrenar el modelo antes de usarlo
  console.log("Modelo cargado y listo para usar.");
};
