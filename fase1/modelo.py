import re
import numpy as np
from keras.preprocessing.sequence import pad_sequences
from keras.utils import to_categorical
from keras.layers import Dense, Embedding, LSTM, Input
from keras.models import Model

# Carga de datos
lines = open('C:/Users/Natal/OneDrive/Documentos/Inteligencia Artificial/Laboratorio/IA1_Proyecto_11/fase1/movie_lines_es.txt', encoding='UTF-8', errors='ignore').read().split('\n')
convers = open('C:/Users/Natal/OneDrive/Documentos/Inteligencia Artificial/Laboratorio/IA1_Proyecto_11/fase1/movie_conversations_es.txt', encoding='UTF-8', errors='ignore').read().split('\n')

# Preprocesamiento
exchn = [conver.split(' +++$+++ ')[-1][1:-1].replace("'", "").replace(",", "").split() for conver in convers]
diag = {line.split(' +++$+++ ')[0]: line.split(' +++$+++ ')[-1] for line in lines}

questions = []
answers = []
for conver in exchn:
    for i in range(len(conver) - 1):
        questions.append(diag.get(conver[i], ""))
        answers.append(diag.get(conver[i + 1], ""))

sorted_ques, sorted_ans = zip(*[(q, a) for q, a in zip(questions, answers) if len(q.split()) < 13 and len(a.split()) < 13])

# Función para limpiar texto en español
def clean_text(txt):
    txt = txt.lower()
    txt = re.sub(r"¿", "", txt)
    txt = re.sub(r"¡", "", txt)
    txt = re.sub(r"á", "a", txt)
    txt = re.sub(r"é", "e", txt)
    txt = re.sub(r"í", "i", txt)
    txt = re.sub(r"ó", "o", txt)
    txt = re.sub(r"ú", "u", txt)
    txt = re.sub(r"ü", "u", txt)
    txt = re.sub(r"ñ", "n", txt)
    txt = re.sub(r"\'", "", txt)
    txt = re.sub(r"[^\w\s]", "", txt)
    return txt

clean_ques = [clean_text(q) for q in sorted_ques]
clean_ans = ['<SOS> ' + ' '.join(clean_text(a).split()[:11]) + ' <EOS>' for a in sorted_ans]

# Creación del vocabulario
word2count = {}
for line in clean_ques + clean_ans:
    for word in line.split():
        word2count[word] = word2count.get(word, 0) + 1

vocab = {word: idx for idx, (word, count) in enumerate(word2count.items()) if count >= 5}
tokens = ['<PAD>', '<EOS>', '<OUT>', '<SOS>']
for token in tokens:
    vocab[token] = len(vocab)

inv_vocab = {idx: word for word, idx in vocab.items()}

# Conversión a índices
encoder_inp = [[vocab.get(word, vocab['<OUT>']) for word in line.split()] for line in clean_ques]
decoder_inp = [[vocab.get(word, vocab['<OUT>']) for word in line.split()] for line in clean_ans]

# Padding de secuencias
encoder_inp = pad_sequences(encoder_inp, 13, padding='post', truncating='post')
decoder_inp = pad_sequences(decoder_inp, 13, padding='post', truncating='post')

decoder_final_output = [seq[1:] for seq in decoder_inp]
decoder_final_output = pad_sequences(decoder_final_output, 13, padding='post', truncating='post')
decoder_final_output = to_categorical(decoder_final_output, len(vocab))

# Definición del modelo
enc_inp = Input(shape=(13,))
dec_inp = Input(shape=(13,))
VOCAB_SIZE = len(vocab)

embed = Embedding(VOCAB_SIZE, output_dim=50, input_length=13, trainable=True)
enc_embed = embed(enc_inp)
enc_lstm = LSTM(400, return_sequences=True, return_state=True)
enc_op, h, c = enc_lstm(enc_embed)
enc_states = [h, c]

dec_embed = embed(dec_inp)
dec_lstm = LSTM(400, return_sequences=True, return_state=True)
dec_op, _, _ = dec_lstm(dec_embed, initial_state=enc_states)

dense = Dense(VOCAB_SIZE, activation='softmax')
dense_op = dense(dec_op)

model = Model([enc_inp, dec_inp], dense_op)
model.compile(loss='categorical_crossentropy', metrics=['accuracy'], optimizer='adam')

# Entrenamiento
model.fit([encoder_inp, decoder_inp], decoder_final_output, epochs=10, batch_size=64)

# Guardar el modelo
model.save('seq2seq_chatbot_es.keras')
