import openai
import os

# Set up OpenAI API credentials
openai.api_key = os.environ["OPENAI_API_KEY"]

from gtts import gTTS
import os

def text_to_speech(text, filename):
    if len(text)>400:
       return
    tts = gTTS(text=text, lang='en')
    tts.save(filename)
    os.system(f'afplay {filename}')  # On macOS, plays the speech using the default audio player
filename = "speech.mp3"

# Define the chat function
def chat(prompt):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=250,
        n=1,
        stop=None,
        temperature=0.5,
        timeout=10
    )
    message = response.choices[0].text.strip()
    return message

def atot(audio_file):
  f = open(audio_file, 'rb')
  response = openai.Audio.transcribe("whisper-1", f)
  if "text" in response:
     return response["text"]
  else:
     print("Error: ", response)
     exit()

import pyaudio
import wave

def record():
  # Set the audio settings
  FORMAT = pyaudio.paInt16
  CHANNELS = 1
  RATE = 44100
  CHUNK = 1024
  RECORD_SECONDS = 5
  WAVE_OUTPUT_FILENAME = "output.wav"

  # Initialize PyAudio
  audio = pyaudio.PyAudio()

  # Start recording
  stream = audio.open(format=FORMAT, channels=CHANNELS,
                      rate=RATE, input=True,
                      frames_per_buffer=CHUNK)
  frames = []

  print("start talking")
  for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
      data = stream.read(CHUNK)
      frames.append(data) 

  # Stop recording
  stream.stop_stream()
  stream.close()
  audio.terminate()

  # Save the audio to a file
  wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
  wf.setnchannels(CHANNELS)
  wf.setsampwidth(audio.get_sample_size(FORMAT))
  wf.setframerate(RATE)
  wf.writeframes(b''.join(frames))
  wf.close()
  return WAVE_OUTPUT_FILENAME

# Start the chat loop
print("Chatbot: Hi, how can I assist you today?")

chats = []

while True:
    user_audio = record()
    user_message = atot(user_audio)
    print("You: ", user_message)
    if user_message.strip().lower()[:3] == "bye":
        print("Chatbot: Goodbye!")
        text_to_speech("Goodbye!",filename)
        break
    else:
        chats.append(user_message)
        if len(chats) > 15:
            del chats[0]
        bot_response = chat("\n".join(chats))
        print("Chatbot:", bot_response)
        chats.append(bot_response)
        if bot_response:
          text_to_speech(bot_response,filename)