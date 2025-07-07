import React, { useState } from 'react';
import { TrendingUp, Sparkles, Search, Users, DollarSign, Shield } from 'lucide-react';
import { generateStructuredResponse } from '../../lib/openai';
import { SYSTEM_PROMPTS, JSON_SCHEMAS } from '../../lib/prompts';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ApiKeyPrompt } from '../ui/ApiKeyPrompt';

export const CompetitorAnalysis: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('openai_api_key')
  );

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    (window as any).VITE_OPENAI_API_KEY = key;
  };

  const handleAnalyze = async () => {
    if (!idea.trim() || !apiKey) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const prompt = `Conduct a comprehensive competitive analysis for this startup: "${idea}"
      
      Analyze:
      - Direct, indirect, and adjacent competitors
      - Market size and growth trends
      - Competitive advantages and differentiators
      - Potential threats and opportunities
      - Strategic recommendations
      
      Provide realistic competitor examples with pricing, user base estimates, and funding information.`;

      const response = await generateStructuredResponse(
        prompt,
        SYSTEM_PROMPTS.competitorAnalysis,
        JSON_SCHEMAS.competitorAnalysis
      );

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze competitors. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Direct Competitor': return 'bg-red-500/20 text-red-300';
      case 'Indirect Competitor': return 'bg-yellow-500/20 text-yellow-300';
      case 'Adjacent Competitor': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  if (!apiKey) {
    return <ApiKeyPrompt onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Competitor Analysis</h2>
            <p className="text-purple-200">Analyze your competitive landscape and find your edge</p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="idea" className="block text-sm font-medium text-purple-200 mb-2">
            Describe your startup idea
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., A platform that connects freelance developers with startups for equity-based partnerships..."
            className="w-full h-32 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!idea.trim() || isAnalyzing || !apiKey}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>Analyzing Competitors with AI...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Analyze Competition</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-8">
          <ErrorMessage message={error} onRetry={handleAnalyze} />
        </div>
      )}

      {result && (
        <div className="space-y-8">
          {/* Competitor Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {result.competitors.map((competitor: any, index: number) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{competitor.name}</h3>
                    <p className="text-purple-300 text-sm mb-2">{competitor.url}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(competitor.category)}`}>
                      {competitor.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-purple-100 text-sm mb-4">{competitor.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-purple-200">{competitor.pricing}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-purple-200">{competitor.users}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-purple-200">{competitor.funding}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-300 mb-2">Strengths</h4>
                    <ul className="text-xs text-purple-100 space-y-1">
                      {competitor.strengths.map((strength: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1">
                          <span className="text-green-400 mt-0.5">+</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-red-300 mb-2">Weaknesses</h4>
                    <ul className="text-xs text-purple-100 space-y-1">
                      {competitor.weaknesses.map((weakness: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1">
                          <span className="text-red-400 mt-0.5">-</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-300 mb-2">How We're Different</h4>
                    <ul className="text-xs text-purple-100 space-y-1">
                      {competitor.differentiators.map((diff: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1">
                          <span className="text-blue-400 mt-0.5">→</span>
                          <span>{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Market Analysis */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-6">Market Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-purple-200 mb-3">Market Overview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Market Size:</span>
                    <span className="text-white font-medium">{result.marketAnalysis.marketSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Growth Rate:</span>
                    <span className="text-white font-medium">{result.marketAnalysis.growthRate}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-200 mb-3">Key Trends</h4>
                <ul className="space-y-1 text-sm">
                  {result.marketAnalysis.keyTrends.map((trend: string, index: number) => (
                    <li key={index} className="text-purple-100 flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Competitive Advantages */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Your Competitive Advantages</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.competitiveAdvantages.map((advantage: string, index: number) => (
                <div key={index} className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <div className="text-green-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{advantage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threats & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-red-300 mb-4">Potential Threats</h3>
              <ul className="space-y-2">
                {result.threats.map((threat: string, index: number) => (
                  <li key={index} className="text-purple-100 flex items-start space-x-2">
                    <span className="text-red-400 mt-1">⚠</span>
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">Strategic Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">💡</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};