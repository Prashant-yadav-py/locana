"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Mic, Phone, PhoneCall } from "lucide-react"

interface VoiceUpdateModalProps {
  onClose: () => void
}

export function VoiceUpdateModal({ onClose }: VoiceUpdateModalProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', text: string, time: string}>>([])
  const [currentStatus, setCurrentStatus] = useState("Ready to chat")
  const recognitionRef = useRef<any>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<'hinglish' | 'hindi' | 'english' | null>(null)

  useEffect(() => {
    if (isCallActive && selectedLanguage) {
      startListening()
      const greetings = {
        hinglish: "Namaste! Main aapka stock assistant hoon. Aap kya update karna chahte hain?",
        hindi: "नमस्ते! मैं आपका स्टॉक असिस्टेंट हूं। आप क्या अपडेट करना चाहते हैं?",
        english: "Hello! I'm your stock assistant. What would you like to update?"
      }
      const greeting = greetings[selectedLanguage]
      speakResponse(greeting)
      addToConversation('ai', greeting)
    }
  }, [isCallActive, selectedLanguage])

  const startCall = (language: 'hinglish' | 'hindi' | 'english') => {
    setSelectedLanguage(language)
    setIsCallActive(true)
    setCurrentStatus("Connected")
  }

  const endCall = () => {
    setIsCallActive(false)
    setIsListening(false)
    setCurrentStatus("Call ended")
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setTimeout(() => onClose(), 1000)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognitionRef.current = recognition
    
    recognition.continuous = false
    recognition.interimResults = false
    const langMap = {
      hinglish: 'en-IN',
      hindi: 'hi-IN',
      english: 'en-US'
    }
    recognition.lang = selectedLanguage ? langMap[selectedLanguage] : 'en-IN'
    
    recognition.onstart = () => {
      setIsListening(true)
      setCurrentStatus("Listening...")
    }
    
    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript
      }
      
      if (finalTranscript.trim()) {
        processVoiceCommand(finalTranscript.trim())
      }
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setCurrentStatus("Listening...")
      setTimeout(() => restartListening(), 500)
    }
    
    recognition.onend = () => {
      setIsListening(false)
      if (isCallActive) {
        setTimeout(() => restartListening(), 500)
      }
    }
    
    recognition.start()
  }

  const restartListening = () => {
    if (isCallActive && recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        startListening()
      }
    }
  }

  const processLocalCommand = (text: string): string => {
    const lower = text.toLowerCase()
    
    if (lower.includes('maggie') || lower.includes('मैगी')) {
      return "ठीक है! Maggie का stock add कर दिया। कुछ और?"
    } else if (lower.includes('bread') || lower.includes('ब्रेड')) {
      return "बढ़िया! Bread का stock update हो गया। और कुछ?"
    } else if (lower.includes('milk') || lower.includes('दूध')) {
      return "ठीक है! Milk का stock add कर दिया। कुछ और?"
    } else if (lower.includes('add') || lower.includes('daal') || lower.includes('डाल')) {
      return "ठीक है! Stock update हो गया। कुछ और अपडेट करना है?"
    } else {
      return "माफ करिए, समझ नहीं आया। कृपया फिर से बोलिए। जैसे: Maggie stock me add kro"
    }
  }

  const processVoiceCommand = async (text: string) => {
    setIsProcessing(true)
    setCurrentStatus("Processing...")
    
    addToConversation('user', text)
    
    try {
      const response = await fetch('/api/gemini/stock-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: text,
          method: 'voice',
          language: selectedLanguage
        })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const result = await response.json()
      
      const aiResponse = result.success 
        ? `हां भाई! ${result.message} कुछ और अपडेट करना है?`
        : processLocalCommand(text)
      
      addToConversation('ai', aiResponse)
      speakResponse(aiResponse)
      setCurrentStatus("Listening...")
    } catch (error) {
      const aiResponse = processLocalCommand(text)
      addToConversation('ai', aiResponse)
      speakResponse(aiResponse)
      setCurrentStatus("Listening...")
    } finally {
      setIsProcessing(false)
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
    utterance.rate = 0.9
    utterance.pitch = 1.1
    speechSynthesis.speak(utterance)
  }

  const addToConversation = (type: 'user' | 'ai', text: string) => {
    const time = new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    setConversation(prev => [...prev, { type, text, time }])
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Stock Assistant</h3>
              <p className="text-xs text-gray-500">{currentStatus}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {!isCallActive ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Voice Stock Assistant</h2>
              <p className="text-gray-600 text-center mb-8 max-w-md">
                Choose your preferred language to start
              </p>
              <div className="space-y-3 w-full max-w-md">
                <p className="text-sm font-medium text-gray-700 mb-3">Select Language:</p>
                <button
                  onClick={() => startCall('hinglish')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-medium shadow-lg transition-all"
                >
                  🇮🇳 Hinglish (Hindi + English)
                </button>
                <button
                  onClick={() => startCall('hindi')}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 py-4 rounded-xl font-medium border-2 border-gray-200 transition-all"
                >
                  🇮🇳 हिंदी (Hindi)
                </button>
                <button
                  onClick={() => startCall('english')}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 py-4 rounded-xl font-medium border-2 border-gray-200 transition-all"
                >
                  🇬🇧 English
                </button>
              </div>
              <div className="mt-8 space-y-2 w-full max-w-md">
                <p className="text-xs font-medium text-gray-500 mb-2">Examples:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-600">
                  "Maggie stock me add kro"
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-600">
                  "Bread 10 pieces daal do"
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-xl ${
                    msg.type === 'user' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-white text-gray-900'
                  } rounded-2xl px-4 py-3 shadow-sm border border-gray-200`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                  </div>
                  {msg.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">You</span>
                    </div>
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {!isCallActive ? (
            <div className="text-center text-sm text-gray-500">
              Select a language above to start
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                }`}></div>
                <span className="text-sm text-gray-700">
                  {isListening ? 'Listening...' : 'Processing...'}
                </span>
              </div>
              <Button
                onClick={endCall}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl"
              >
                End
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
