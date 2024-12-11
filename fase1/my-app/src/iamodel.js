import * as tf from '@tensorflow/tfjs';
import intents from './intent.json';

// Preprocesar datos
const tokenizer = (text) => text.toLowerCase().replace(/[^\w\s]/gi, '').split(' ');

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

  const uniqueWords = [...new Set(words)];
  const vocab = uniqueWords.reduce((acc, word, index) => ({ ...acc, [word]: index + 1 }), {});

  const inputs = data.map((item) =>
    item.input.map((word) => vocab[word] || 0).concat(new Array(10).fill(0)).slice(0, 10)
  );

  const outputs = data.map((item) => {
    const labelIndex = labels.indexOf(item.output);
    const oneHot = Array(labels.length).fill(0);
    oneHot[labelIndex] = 1;
    return oneHot;
  });

  return { inputs, outputs, vocab, labels };
};

const { inputs, outputs, vocab, labels } = prepareData(intents);

// Crear el modelo secuencial
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [10], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }));
model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

// Variable para evitar múltiples entrenamientos simultáneos
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
      epochs: 200,
      batchSize: 8,
    });

    console.log("Modelo entrenado");
  } catch (error) {
    console.error("Error durante el entrenamiento:", error);
  } finally {
    isTraining = false; // Restablece el estado de entrenamiento
  }
};

export const predict = (text) => {
  const tokenizedText = tokenizer(text);
  const input = tokenizedText
    .map((word) => vocab[word] || 0)
    .concat(new Array(10).fill(0))
    .slice(0, 10);

  const prediction = model.predict(tf.tensor2d([input]));
  const predictedIndex = prediction.argMax(-1).dataSync()[0];
  return labels[predictedIndex];
};