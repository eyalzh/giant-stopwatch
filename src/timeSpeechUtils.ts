const RATE = 1.5;
const ENABLE_SPEECH = true;

export function speakMinutes(minutes: number) {
  if (!ENABLE_SPEECH) {
    return;
  }

  const unit = minutes === 1 ? "minute" : "minutes";
  let utterance = new SpeechSynthesisUtterance(`${minutes} ${unit}!`);
  utterance.rate = RATE;
  speechSynthesis.speak(utterance);
}
