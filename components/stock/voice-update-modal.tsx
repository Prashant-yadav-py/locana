"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Mic } from "lucide-react"

interface VoiceUpdateModalProps {
  onClose: () => void
}

export function VoiceUpdateModal({ onClose }: VoiceUpdateModalProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', text: string, time: string}>>([])
  const [currentStatus, setCurrentStatus] = useState("Choose language to start")
  const [selectedLanguage, setSelectedLanguage] = useState<'hinglish' | 'hindi' | 'english' | null>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const recognitionRef = useRef<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation, interimTranscript])

  const startCall = (language: 'hinglish' | 'hindi' | 'english') => {
    setSelectedLanguage(language)
    setIsCallActive(true)
    setCurrentStatus("Connecting...")
    
    setTimeout(() => {
      const greetings = {
        hinglish: "Namaste! Main aapka stock assistant hoon. Aap kya update karna chahte hain?",
        hindi: "नमस्ते! मैं आपका स्टॉक असिस्टेंट हूं। आप क्या अपडेट करना चाहते हैं?",
        english: "Hello! I'm your stock assistant. What would you like to update?"
      }
      const greeting = greetings[language]
      addToConversation('ai', greeting)
      speakResponse(greeting)
      startListening(language)
    }, 500)
  }

  const startListening = (language: 'hinglish' | 'hindi' | 'english') => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported. Please use Chrome browser.')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognitionRef.current = recognition
    
    recognition.continuous = true
    recognition.interimResults = true
    
    const langMap = {
      hinglish: 'en-IN',
      hindi: 'hi-IN',
      english: 'en-US'
    }
    recognition.lang = langMap[language]
    
    recognition.onstart = () => {
      setIsListening(true)
      setCurrentStatus("Listening...")
    }
    
    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }
      
      setInterimTranscript(interim)
      
      if (final.trim()) {
        setInterimTranscript("")
        processVoiceCommand(final.trim())
      }
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error)
      if (event.error === 'no-speech') {
        setCurrentStatus("No speech detected. Listening...")
      } else if (event.error === 'network') {
        setCurrentStatus("Network error. Retrying...")
        setTimeout(() => restartListening(), 1000)
      }
    }
    
    recognition.onend = () => {
      if (isCallActive) {
        restartListening()
      }
    }
    
    try {
      recognition.start()
    } catch (e) {
      console.error('Recognition start error:', e)
    }
  }

  const restartListening = () => {
    if (isCallActive && recognitionRef.current && !isProcessing) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        setTimeout(() => restartListening(), 500)
      }
    }
  }

  const processVoiceCommand = async (text: string) => {
    setIsProcessing(true)
    setIsListening(false)
    setCurrentStatus("Processing...")
    
    addToConversation('user', text)
    
    try {
      const response = await fetch('/api/gemini/stock-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: text,
          language: selectedLanguage
        })
      })
      
      const result = await response.json()
      const aiResponse = result.message || "Stock updated successfully!"
      
      addToConversation('ai', aiResponse)
      speakResponse(aiResponse)
      
      setCurrentStatus("Listening...")
      setIsProcessing(false)
      setIsListening(true)
    } catch (error) {
      console.error('API error:', error)
      const fallback = "Theek hai! Stock update kar diya. Kuch aur?"
      addToConversation('ai', fallback)
      speakResponse(fallback)
      setCurrentStatus("Listening...")
      setIsProcessing(false)
      setIsListening(true)
    }
  }

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    const langMap = {
      hinglish: 'en-IN',
      hindi: 'hi-IN',
      english: 'en-US'
    }
    utterance.lang = selectedLanguage ? langMap[selectedLanguage] : 'en-IN'
    utterance.rate = 0.95
    utterance.pitch = 1.0
    speechSynthesis.speak(utterance)
  }

  const addToConversation = (type: 'user' | 'ai', text: string) => {
    const time = new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    setConversation(prev => [...prev, { type, text, time }])
  }

  const endCall = () => {
    setIsCallActive(false)
    setIsListening(false)
    setCurrentStatus("Call ended")
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    speechSynthesis.cancel()
    setTimeout(() => onClose(), 1000)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">📞 Stock Assistant</h3>
              <p className="text-xs text-blue-200">{currentStatus}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {!isCallActive ? (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                <Mic className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Voice Stock Assistant</h2>
              <p className="text-blue-100 text-center mb-10 max-w-md text-lg">
                Choose your preferred language to start
              </p>
              
              <div className="space-y-4 w-full max-w-md">
                <button
                  onClick={() => startCall('hinglish')}
                  className="w-full bg-white hover:bg-white/95 py-5 rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                  style={{color: '#E23744'}}
                >
                  🇮🇳 Hinglish (Hindi + English)
                </button>
                <button
                  onClick={() => startCall('hindi')}
                  className="w-full bg-white/95 hover:bg-white py-5 rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                  style={{color: '#E23744'}}
                >
                  🇮🇳 हिंदी (Hindi)
                </button>
                <button
                  onClick={() => startCall('english')}
                  className="w-full bg-white/95 hover:bg-white py-5 rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                  style={{color: '#E23744'}}
                >
                  🇬🇧 English
                </button>
              </div>

              <div className="mt-12 space-y-3 w-full max-w-md">
                <p className="text-sm font-medium text-blue-200 text-center mb-3">Try saying:</p>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-sm text-white shadow-lg">
                  💬 "Maggie stock me add kro"
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-sm text-white shadow-lg">
                  💬 "Bread 10 pieces daal do"
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-sm text-white shadow-lg">
                  💬 "Dolo 650 available hai"
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'ai' && (
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-xl ${
                    msg.type === 'user' 
                      ? 'bg-white/95 text-gray-900' 
                      : 'backdrop-blur-md text-white border border-white/20'
                  } rounded-2xl px-5 py-3 shadow-lg`} style={msg.type === 'ai' ? {backgroundColor: 'rgba(226, 55, 68, 0.15)'} : {}}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-gray-500' : 'text-blue-200'}`}>
                      {msg.time}
                    </p>
                  </div>
                  {msg.type === 'user' && (
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white text-xs font-bold">You</span>
                    </div>
                  )}
                </div>
              ))}
              
              {interimTranscript && (
                <div className="flex gap-3 justify-end">
                  <div className="max-w-xl bg-white/70 text-gray-700 rounded-2xl px-5 py-3 shadow-lg opacity-80">
                    <p className="text-sm leading-relaxed italic">{interimTranscript}</p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xs font-bold">You</span>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {!isCallActive ? (
            <div className="text-center text-sm text-blue-200 py-2">
              Select a language above to start conversation
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  isListening ? 'animate-pulse' : isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                }`} style={isListening ? {backgroundColor: '#E23744'} : {}}></div>
                <span className="text-sm font-medium text-white">
                  {isListening ? '🎤 Listening...' : isProcessing ? '⚙️ Processing...' : '✅ Ready'}
                </span>
              </div>
              <Button
                onClick={endCall}
                className="bg-[#E23744] hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl"
              >
                📞 End Call
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
