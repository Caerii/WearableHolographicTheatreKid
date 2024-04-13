import React, { useState, useEffect } from 'react';
import { convertSpeechToText, generateLyrics, fetchMusic } from './apiHelpers';
import CharacterCircle from './CharacterCircle';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [image, setImage] = useState('/steve.jpg'); // Assuming you have an image
  // Add differnet images later, animated stuff as well


  useEffect(() => {
    if (mediaRecorder) {
      if (isRecording) {
        mediaRecorder.start();
      } else {
        mediaRecorder.stop();
      }

      const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      const handleStop = async () => {
        const blob = new Blob(audioChunks, { 'type': 'audio/webm; codecs=opus' });
        const text = await convertSpeechToText(blob);
        setTranscript(text);
        const lyrics = await generateLyrics(text);
        const songUrl = await fetchMusic(lyrics);
        playMusic(songUrl);
        setAudioChunks([]);
      };

      mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.addEventListener('stop', handleStop);

      return () => {
        mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.removeEventListener('stop', handleStop);
      };
    }
  }, [isRecording, mediaRecorder, audioChunks]);

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing the microphone:', error);
      }
    } else {
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const playMusic = (url) => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="container">
      <h1>Theatre Kid Music App</h1>
      <button onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <p className="status-message">{isRecording ? 'Recording... Speak now!' : 'Click to start recording.'}</p>
      {transcript && <p className="transcript">Transcript: {transcript}</p>}
      <CharacterCircle image={image} />
    </div>
  );
}

export default App;
