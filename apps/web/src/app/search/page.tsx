'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2, AlertTriangle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';


interface SearchResult {
    id: number;
    title: string;
    description: string;
    // Add more fields as needed
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setSearchResults([]);
    try {
      // Simulate API call
       await new Promise(resolve => setTimeout(resolve, 1000))
      const response: { data: SearchResult[] } = {
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i+1,
          title: `Result ${i + 1} for "${searchTerm}"`,
          description: `This is a mock result for "${searchTerm}".`,
        })),
      };

      if(searchTerm.length === 0) {
        setSearchResults([])
      } else {
        setSearchResults(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching search results:', err);
      setError('Failed to load search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    const clearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
    }

  return (
    <div className="min-h-screen py-6">
         <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Search</h1>
      <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter your search term..."
              value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
                disabled={loading}
            />
              {searchTerm && (
                  <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                     <X size={20} />
                  </button>
              )}
        </div>
        <Button
            onClick={handleSearch}
            className="ml-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 animate-spin" /> : <Search size={18}/>}
            Search
          </Button>
      </div>

          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin text-gray-500 mr-2" />
              <p className="text-gray-500">Searching...</p>
            </div>
          )}

          {error && (
              <div className="flex items-center justify-center py-4 text-red-500">
                <AlertTriangle className="mr-2" />
                {error}
              </div>
            )}
          {!loading && !error && searchResults.length === 0 && searchTerm && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Search  className="h-12 w-12 text-gray-400" />
                <p className="text-gray-500 text-center">
                    No results found. Please try a different search term.
                </p>
              </div>
          )}

      <div className="space-y-4">
        {searchResults.map((result) => (
          <div
            key={result.id}
            className="bg-white border rounded-md border-gray-200 shadow-sm p-4"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              {result.title}
            </h2>
            <p className="text-gray-700">{result.description}</p>
          </div>
        ))}
      </div>
         </div>
    </div>
  );
};

export default SearchPage;