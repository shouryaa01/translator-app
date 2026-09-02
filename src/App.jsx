import { useState } from 'react'
import axios from 'axios'
import './App.css'

const languages = {
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'pl': 'Polish',
  'tr': 'Turkish',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'id': 'Indonesian',
  'tl': 'Filipino',
  'uk': 'Ukrainian',
}

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const translateText = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      // Using LibreTranslate API (Free, Open Source)
      const response = await axios.post('https://api.mymemory.translated.net/get', null, {
        params: {
          q: inputText,
          langpair: `en|${targetLanguage}`,
        },
      })

      if (response.data.responseStatus === 200 && response.data.responseData.translatedText) {
        const translated = response.data.responseData.translatedText
        // Check if translation is valid (not the same as input)
        if (translated && translated.length > 0 && translated !== inputText) {
          setOutputText(translated)
          setSuccessMessage(`Successfully translated to ${languages[targetLanguage]}!`)
        } else {
          throw new Error('Invalid translation received')
        }
      } else {
        throw new Error('Translation service error')
      }
    } catch (err) {
      console.error('Translation error:', err)
      setError(
        'Translation service is temporarily unavailable. Please try again in a moment.'
      )
      setOutputText('')
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
    setError('')
    setSuccessMessage('')
  }

  const copyToClipboard = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText)
      setSuccessMessage('Translated text copied to clipboard!')
      setTimeout(() => setSuccessMessage(''), 2000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      translateText()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Text Translator</h1>
          <p className="text-gray-600">Translate English text to your favorite language instantly</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold">Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Input and Output Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Input Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                English Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter the English text you want to translate..."
                className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">{inputText.length} characters</p>
            </div>

            {/* Output Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Translated Text
              </label>
              <textarea
                value={outputText}
                readOnly
                placeholder="Your translated text will appear here..."
                className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg bg-gray-50 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">{outputText.length} characters</p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full md:w-64 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={translateText}
              disabled={loading || !inputText.trim()}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>

            {outputText && (
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Copy Translation
              </button>
            )}

            <button
              onClick={clearAll}
              className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Shortcut Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Press <code className="bg-blue-100 px-2 py-1 rounded">Ctrl + Enter</code> to translate quickly
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Powered by <strong>Google Translate API</strong> via RapidAPI
          </p>
          <p className="text-xs mt-2">© 2024 Text Translator App. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default App
