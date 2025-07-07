import React, { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface ApiKeyPromptProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
      <div className="flex items-center space-x-3 mb-6">
        <Key className="h-8 w-8 text-purple-400" />
        <div>
          <h3 className="text-xl font-semibold text-white">OpenAI API Key Required</h3>
          <p className="text-purple-200">Enter your OpenAI API key to use AI-powered features</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-purple-200 mb-2">
            OpenAI API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!apiKey.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <Key className="h-5 w-5" />
          <span>Set API Key</span>
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <h4 className="font-medium text-blue-300 mb-2">How to get your OpenAI API Key:</h4>
        <ol className="space-y-1 text-sm text-blue-200">
          <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center">platform.openai.com/api-keys <ExternalLink className="h-3 w-3 ml-1" /></a></li>
          <li>2. Sign in to your OpenAI account</li>
          <li>3. Click "Create new secret key"</li>
          <li>4. Copy the key and paste it above</li>
        </ol>
        <p className="text-xs text-blue-300 mt-2">
          Note: Your API key is stored locally and never sent to our servers.
        </p>
      </div>
    </div>
  );
};