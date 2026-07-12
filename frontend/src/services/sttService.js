const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class STTService {
  isSupported() {
    return !!SpeechRecognition;
  }

  recognizeSpeech({ lang = 'en-US', maxDurationMs = 15000 } = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('STT not supported in this browser'));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      let settled = false;
      const timeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          recognition.stop();
          reject(new Error('STT timeout'));
        }
      }, maxDurationMs);

      recognition.onresult = (event) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        const result = event.results[0];
        resolve({
          transcript: result[0].transcript.trim(),
          confidence: result[0].confidence ?? 0.8,
        });
      };

      recognition.onerror = (event) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(new Error(event.error || 'STT error'));
      };

      recognition.onend = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          reject(new Error('No speech detected'));
        }
      };

      try {
        recognition.start();
      } catch (err) {
        settled = true;
        clearTimeout(timeout);
        reject(err);
      }
    });
  }
}

const sttService = new STTService();
export default sttService;
