// apiHelpers.js

// Fetch music based on lyrics provided
export const fetchMusic = async (lyrics) => {
    try {
      const response = await fetch('https://suno-m8w3kpig0-caeriis-projects.vercel.app/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: lyrics,
          make_instrumental: false,
          wait_audio: true  // Wait for the audio to be generated synchronously
        })
      });
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0].audio_url;  // Assuming the first item in the array has the audio URL
      }
      throw new Error('No audio data returned from Suno API');
    } catch (error) {
      console.error('Error fetching music:', error);
      throw error;
    }
};

// Convert speech to text using the browser's SpeechRecognition API
export const convertSpeechToText = () => {
    return new Promise((resolve, reject) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.onresult = function(event) {
            if (event.results.length > 0) {
                resolve(event.results[0][0].transcript);  // Returns the most confident result
            } else {
                reject('No speech was detected');
            }
        };

        recognition.onerror = function(event) {
            reject(event.error);
        };

        recognition.start();  // Starts listening to the microphone
    });
};


// Generate lyrics based on a prompt using the Suno API
export const generateLyrics = async (prompt) => {
    try {
      const response = await fetch('https://suno-m8w3kpig0-caeriis-projects.vercel.app/api/generate_lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data && data.text) {
        return data.text;  // Return the generated lyrics text
      }
      throw new Error('No lyrics were generated or returned from the Suno API');
    } catch (error) {
      console.error('Error generating lyrics:', error);
      throw error;
    }
};

// Retrieve specific music details by ID
export const getMusicDetails = async (musicId) => {
    try {
      const response = await fetch(`https://suno-m8w3kpig0-caeriis-projects.vercel.app/api/get?ids=${musicId}`, {
        method: 'GET'
      });
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0];  // Assuming the data returned is an array and you need the first item
      }
      throw new Error('No music data found for the given ID');
    } catch (error) {
      console.error('Error retrieving music details:', error);
      throw error;
    }
};
