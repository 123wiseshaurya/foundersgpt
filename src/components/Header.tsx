import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-400" />
              <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FounderGPT</h1>
              <p className="text-purple-300 text-sm">AI-Powered Startup Strategy Assistant</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-400 text-sm font-medium">✅ GPT-4 Powered</p>
            <p className="text-purple-300 text-xs">Production Ready</p>
          </div>
        </div>
      </div>
    </header>
  );
};