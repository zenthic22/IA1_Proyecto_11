import * as tf from '@tensorflow/tfjs';
import intents from '../dataset/intents.json'; // Ruta al archivo intents.json

// Preprocesar datos
const tokenizer = (text) => {
  const normalizedText = text
    .toLowerCase()  // Poner todo en minúsculas
    .normalize("NFD")  // Normalizar los caracteres con tildes
    .replace(/[\u0300-\u036f]/g, "")  // Eliminar tildes
    .replace(/[^\w\s]/gi, "")  // Eliminar signos de puntuación
    .split(" ");  // Dividir en palabras

  return normalizedText;
};

// Función para preparar los datos
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

  // Eliminar palabras duplicadas y construir el vocabulario
  const uniqueWords = [...new Set(words)];
  const vocab = uniqueWords.reduce((acc, word, index) => ({ ...acc, [word]: index + 1 }), {});

  // Convertir las entradas (patrones) a números
  const inputs = data.map((item) =>
    item.input.map((word) => vocab[word] || 0).concat(new Array(10).fill(0)).slice(0, 10)
  );

  // Convertir las salidas a formato one-hot
  const outputs = data.map((item) => {
    const labelIndex = labels.indexOf(item.output);
    const oneHot = Array(labels.length).fill(0);
    oneHot[labelIndex] = 1;
    return oneHot;
  });

  return { inputs, outputs, vocab, labels };
};

// Preparar los datos antes de entrenar el modelo
const { inputs, outputs, vocab, labels } = prepareData(intents);

// Crear el modelo de red neuronal
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [10], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }));
model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

let isTraining = false;

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
      epochs: 500, // Puedes ajustar este número
      batchSize: 5,
    });

    console.log("Modelo entrenado");
  } catch (error) {
    console.error("Error durante el entrenamiento:", error);
  } finally {
    isTraining = false;
  }
};

// Función para obtener la respuesta basada en el tag
export const getResponse = (tag) => {
  const intent = intents.intents.find(i => i.tag === tag);
  if (intent) {
    const response = intent.responses[0];  // Seleccionamos siempre la primera respuesta del array de respuestas
    return response;
  }
  return "No estoy seguro, ¿puedes hacer otra pregunta?";
};

// Función de predicción
export const predict = (text) => {
  const tokenizedText = tokenizer(text);
  const input = tokenizedText
    .map((word) => vocab[word] || 0)
    .concat(new Array(10).fill(0))
    .slice(0, 10);

  const prediction = model.predict(tf.tensor2d([input]));
  const predictedIndex = prediction.argMax(-1).dataSync()[0];

  // Obtener el tag predicho
  const label = labels[predictedIndex];
  const intent = intents.intents.find(intent => intent.tag === label);

  // Devolver siempre la respuesta basada en la intención
  if (intent) {
    const response = intent.responses[0];  // Usamos la primera respuesta del array
    return response;
  }

  // Si no se encuentra un intent, devolver una respuesta genérica
  return "No estoy seguro, ¿puedes hacer otra pregunta?";
};