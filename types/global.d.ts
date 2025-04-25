// Add Web Speech API types for TypeScript
interface Window {
  SpeechRecognition: any
  webkitSpeechRecognition: any
  speechSynthesis: SpeechSynthesis
  SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance
}
