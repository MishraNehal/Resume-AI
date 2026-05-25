import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Brain } from 'lucide-react'
import { chatWithResume } from '../services/api'

const suggestedQuestions = [
  'Am I fit for a Software Engineer role?',
  'What skills should I add?',
  'Rate my resume out of 10',
  'Write a summary for my LinkedIn',
  'What roles match my profile?',
]

export default function ResumeChat({ resumeData, isOpen, onClose, toast }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I've analyzed your resume. Ask me anything — like 'Am I fit for a Data Engineer role?' or 'What are my strongest skills?'",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await chatWithResume(text, resumeData, history)

      if (response.success) {
        const aiMessage = {
          role: 'assistant',
          content: response.reply,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (err) {
      toast('error', 'Failed to get response. Try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question) => {
    setInputText(question)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col max-sm:rounded-l-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-blue-600" />
            <div>
              <h3 className="font-bold text-gray-900">Chat with Resume</h3>
              <p className="text-xs text-gray-500">Ask anything about your resume</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs ${
                  msg.role === 'user'
                    ? 'bg-black text-white rounded-tl-2xl rounded-tr-0 rounded-br-2xl rounded-bl-2xl'
                    : 'bg-gray-100 text-gray-900 rounded-tr-2xl rounded-tl-0 rounded-bl-2xl rounded-br-2xl'
                } px-4 py-2.5 text-sm leading-relaxed`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-tr-2xl rounded-tl-0 rounded-bl-2xl rounded-br-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions (show only on initial state) */}
        {messages.length === 1 && !isLoading && (
          <div className="px-6 py-4 border-t border-gray-200 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Try asking:</p>
            <div className="space-y-2">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-700 border border-gray-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your resume..."
              disabled={isLoading}
              rows={1}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-sm disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">{inputText.length}/500</p>
        </div>
      </div>
    </>
  )
}
