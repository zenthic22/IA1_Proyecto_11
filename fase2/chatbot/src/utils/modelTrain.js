import * as tf from '@tensorflow/tfjs';

// Declaramos las variables para el modelo y otros archivos
let model, tokenizer, labelEncoder;

// Cargar el modelo
export const loadModel = async () => {
  model = await tf.loadLayersModel('/modelo/model.json'); // Asegúrate de poner la ruta correcta
  console.log("Modelo cargado correctamente");
};

// Cargar el tokenizer
const loadTokenizer = async () => {
  const response = await fetch('/modelo/tokenizer.json');  // Asegúrate de poner la ruta correcta
  const tokenizerJson = await response.json();

  // Verifica que el contenido se haya cargado correctamente
  console.log("Tokenizer cargado correctamente", tokenizerJson);

  // Parsear el word_index si es una cadena de texto
  if (typeof tokenizerJson.word_index === 'string') {
    tokenizerJson.word_index = JSON.parse(tokenizerJson.word_index);
  }

  tokenizer = tokenizerJson;
};

// Cargar el labelEncoder
export const loadLabelEncoder = async () => {
  const response = await fetch('/modelo/label_encoder.json');  // Asegúrate de poner la ruta correcta
  const labelEncoderJson = await response.json();
  labelEncoder = labelEncoderJson.classes;  // Asumimos que contiene las clases en un array
  console.log("LabelEncoder cargado correctamente");
};

// Función para cargar todos los datos necesarios
export const loadAllData = async () => {
  await loadModel();  // Cargar el modelo
  await loadTokenizer();  // Cargar el tokenizer
  await loadLabelEncoder();  // Cargar el labelEncoder
  console.log("Todos los datos cargados correctamente");
};

// Implementación de texts_to_sequences
const textsToSequences = (texts) => {
  return texts.map((text) => {
    return text.split(' ').map((word) => {
      // Verificar si la palabra existe en word_index, de lo contrario, devolver 0
      if (tokenizer.word_index && tokenizer.word_index[word]) {
        return tokenizer.word_index[word];
      } else {
        console.warn(`Palabra desconocida: ${word}`);
        return 0;  // Puedes elegir otro valor por defecto si lo deseas
      }
    });
  });
};

// Preprocesar el texto antes de la predicción
const preprocessText = (text) => {
    text = text.replace(/[^\w\s]/gi, ''); // Eliminar puntuación, incluyendo ¡ y ¿
    text = text.toLowerCase(); // Convertir a minúsculas
    return text;
};  

// Función para hacer padding a las secuencias
const padSequences = (sequences, maxlen = 9) => {
    return sequences.map(seq => {
      const paddingLength = maxlen - seq.length;
      const padding = Array(paddingLength > 0 ? paddingLength : 0).fill(0); // Padding con ceros
      return [...padding, ...seq]; // Agregar el padding al principio de la secuencia
    });
};  

// Función para realizar predicción
export const predict = async (inputText) => {
  if (!model || !tokenizer || !labelEncoder) {
    console.log("Faltan datos para realizar la predicción");
    return;
  }

  // Preprocesamos el texto
  const preprocessedText = preprocessText(inputText);

  // Convertimos el texto a secuencia usando el tokenizer
  const inputSeq = textsToSequences([preprocessedText]);

  // Realizar padding a la secuencia
  const paddedSeq = padSequences(inputSeq, 20);  // Asegúrate de que la longitud máxima coincida con el modelo

  // Convertir la secuencia a un tensor
  const tensorInput = tf.tensor2d(paddedSeq);

  // Realizar la predicción
  const prediction = await model.predict(tensorInput);

  // Obtenemos la clase predicha
  const predictedClassIndex = prediction.argMax(-1).dataSync()[0];  // Obtener el índice de la clase predicha
  const predictedClass = labelEncoder[predictedClassIndex]; // Mapear el índice al nombre de la clase

  console.log("Predicción:", predictedClass);

  // Aquí se podría generar una respuesta basada en la clase predicha.
  return `El chatbot predice la clase: ${predictedClass}`;  // Devuelve el nombre de la clase predicha
};

// Asegúrate de cargar todos los datos antes de predecir
export const initialize = async () => {
  await loadAllData();  // Cargar modelo, tokenizer y labelEncoder
};