import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np

# Datos de ejemplo (entrenamiento)
preguntas = [
    "Hola", "¿Cómo estás?", "¿Cuál es tu nombre?", 
    "Adiós", "Gracias", "¿Qué puedes hacer?"
]
respuestas = [
    "Hola, ¿cómo te puedo ayudar?", "Estoy bien, gracias. ¿Y tú?",
    "Soy tu asistente virtual.", "¡Adiós! Cuídate.", 
    "De nada, ¡para eso estoy aquí!", "Puedo ayudarte con tus preguntas."
]

# Preprocesamiento
tokenizer = Tokenizer()
tokenizer.fit_on_texts(preguntas + respuestas)

# Crear diccionario de vocabulario
word_index = tokenizer.word_index
vocab_size = len(word_index) + 1

# Convertir texto a secuencias
input_sequences = tokenizer.texts_to_sequences(preguntas)
output_sequences = tokenizer.texts_to_sequences(respuestas)

# Rellenar las secuencias
max_len = max(max(len(seq) for seq in input_sequences), max(len(seq) for seq in output_sequences))
input_sequences = pad_sequences(input_sequences, maxlen=max_len, padding='post')
output_sequences = pad_sequences(output_sequences, maxlen=max_len, padding='post')

# Convertir las salidas a una representación categórica
output_sequences = tf.keras.utils.to_categorical(output_sequences, num_classes=vocab_size)

# Crear modelo
model = Sequential([
    Embedding(input_dim=vocab_size, output_dim=64, input_length=max_len),
    LSTM(128, return_sequences=True),
    Dense(vocab_size, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Entrenamiento
model.fit(input_sequences, output_sequences, epochs=100, verbose=1)

# Guardar el modelo en formato TensorFlow
model.save("chatbot_model")
print("Modelo guardado en formato TensorFlow en el directorio 'chatbot_model'")
