// src/utils/loadModel.js
import * as tf from '@tensorflow/tfjs';

export const loadModelAndTokenizer = async () => {
  try {
    // Cargar el modelo
    const model = await tf.loadLayersModel('/modelo/model.json');

    // Cargar el tokenizer
    const tokenizerResponse = await fetch('/modelo/tokenizer.json');
    const tokenizerData = await tokenizerResponse.json();
    const wordIndex = JSON.parse(tokenizerData.config.word_index);

    // Cargar el label encoder
    const labelEncoderResponse = await fetch('/modelo/label_encoder.json');
    const labelEncoderData = await labelEncoderResponse.json();

    return {
      model,
      wordIndex,
      labelEncoder: labelEncoderData.classes
    };
  } catch (error) {
    console.error("Error al cargar el modelo o los recursos:", error);
    return null;
  }
};