/* eslint-disable */
type SpeechRecognition = any;

declare global {
    interface Window {
        webkitSpeechRecognition: SpeechRecognition;
        webkitSpeechGrammarList: any;
    }
  }

const grammar = '#JSGF V1.0; grammar commands; public <command> = go | stop ;'
let recognition: SpeechRecognition | null = null;

export function startSpeechRcognition(onCommand: (command: string) => void) {

    if (!('webkitSpeechRecognition' in window)) {
        console.info("No speech recognition support");
        return;
    }
    
    recognition = new window.webkitSpeechRecognition();
    const speechRecognitionList = new window.webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        onCommand(command);
    }

}

export function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
}
