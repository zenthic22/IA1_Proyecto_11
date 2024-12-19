import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';

const modelJsonPath = 'C:\\Users\\Natal\\OneDrive\\Documentos\\Inteligencia Artificial\\Laboratorio\\IA1_Proyecto_11\\fase2\\chatbot\\public\\modelo\\model.json';
const tokenizerJsonPath = 'C:\\Users\\Natal\\OneDrive\\Documentos\\Inteligencia Artificial\\Laboratorio\\IA1_Proyecto_11\\fase2\\chatbot\\public\\modelo\\tokenizer.json';
const intentsJsonPath = 'C:\\Users\\Natal\\OneDrive\\Documentos\\Inteligencia Artificial\\Laboratorio\\IA1_Proyecto_11\\fase2\\chatbot\\public\\dataset\\intents.json'; // Corregido

const modelJson = JSON.parse(fs.readFileSync(modelJsonPath));
const tokenizerJson = JSON.parse(fs.readFileSync(tokenizerJsonPath));
const intents = JSON.parse(fs.readFileSync(intentsJsonPath));

// Cargar el modelo
const model = await tf.loadLayersModel(tf.io.fromMemory(modelJson));
console.log(model.summary());

const wordIndex = JSON.parse(tokenizerJson['config']['word_index']);

function textsToSequences(texts) {
  return texts.map(text => {
    const words = text.toLowerCase().trim().split(" ");
    return words.map(word => wordIndex[word] || 0);
  });
}

function padSequences(sequences, maxLength, paddingType = 'pre', truncatingType = 'pre', paddingValue = 0) {
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
}

const getChatbotResponse = async (user_input) => {
  // Convertir el mensaje del usuario en secuencias
  let sequences = textsToSequences([user_input]);
  sequences = padSequences(sequences, 9, 'pre', 'pre', 0); 

  // Predecir la respuesta usando el modelo
  const predictions = model.predict(tf.tensor2d(sequences, [1, 9]));
  const responseIndex = predictions.argMax(1).dataSync()[0]; 

  // Encontrar el intent correspondiente
  for (const intent of intents.intents) {
    if (intent.patterns.map(pattern => pattern.toLowerCase()).includes(user_input.toLowerCase())) {
      return intent.responses[responseIndex % intent.responses.length]; 
    }
  }

  return "Lo siento, no entiendo tu mensaje.";
};

const main = async () => {
  const user_input = "Hi"; // Mensaje del usuario
  const response = await getChatbotResponse(user_input);
  console.log(response); // Imprimir la respuesta del chatbot
};

main();
