'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

interface SearchSuggestion {
  id: string
  title: string
  category: string
  instructor: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Debounce para autocompletado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        searchSuggestions(query)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const searchSuggestions = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      // Llamada a tu API de ElasticSearch
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(finalQuery)}`
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    setShowSuggestions(false)
    handleSearch(suggestion.title)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar cursos, instructores, categorías..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-12 pr-20 py-4 text-lg"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('')
                setSuggestions([])
                setShowSuggestions(false)
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={() => handleSearch()} size="sm">
            Buscar
          </Button>
        </div>
      </div>

      {/* Sugerencias de autocompletado */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Buscando...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium text-gray-900">
                      {suggestion.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.category} • {suggestion.instructor}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No se encontraron sugerencias
            </div>
          )}
        </div>
      )}
    </div>
  )
}