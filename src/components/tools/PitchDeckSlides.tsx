import React, { useState } from 'react';
import { Presentation, Sparkles, ChevronRight } from 'lucide-react';
import { generateStructuredResponse } from '../../lib/openai';
import { SYSTEM_PROMPTS, JSON_SCHEMAS } from '../../lib/prompts';
import { ErrorMessage } from '../ui/ErrorMessage';

export const PitchDeckSlides: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [traction, setTraction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = `Create a comprehensive pitch deck for this startup: "${idea}"
      
      ${traction ? `Current traction: ${traction}` : 'Early stage startup'}
      
      Generate 12 slides with:
      - Problem, Solution, Market Opportunity
      - Product Demo, Business Model, Traction
      - Competition, Financial Projections, Team
      - Funding Ask, Use of Funds, Thank You
      
      Each slide should have a headline, 3-4 bullet points, and visual suggestions.
      Make it investor-ready and compelling.`;

      const response = await generateStructuredResponse(
        prompt,
        SYSTEM_PROMPTS.pitchDeck,
        JSON_SCHEMAS.pitchDeckSlides
      );

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate pitch deck. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <Presentation className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Pitch Deck Generator</h2>
            <p className="text-purple-200">Create compelling pitch deck content for investors</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="idea" className="block text-sm font-medium text-purple-200 mb-2">
              Describe your startup idea*
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

          <div>
            <label htmlFor="traction" className="block text-sm font-medium text-purple-200 mb-2">
              Current traction (optional)
            </label>
            <textarea
              id="traction"
              value={traction}
              onChange={(e) => setTraction(e.target.value)}
              placeholder="e.g., 1,000 beta users, $10K MRR, partnerships with 3 major companies..."
              className="w-full h-20 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!idea.trim() || isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>Generating Pitch Deck with AI...</span>
            </>
          ) : (
            <>
              <Presentation className="h-5 w-5" />
              <span>Generate Pitch Deck</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-8">
          <ErrorMessage message={error} onRetry={handleGenerate} />
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Slides Overview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Pitch Deck Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {result.slides.map((slide: any, index: number) => (
                <div key={index} className="bg-purple-600/20 rounded p-2 text-center">
                  <div className="text-xs text-purple-200">{index + 1}</div>
                  <div className="text-sm font-medium text-white">{slide.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Content */}
          <div className="space-y-6">
            {result.slides.map((slide: any, index: number) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-500/20 overflow-hidden">
                <div className="bg-purple-600/20 px-6 py-4 border-b border-purple-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h4 className="text-xl font-semibold text-white">{slide.title}</h4>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-purple-200 mb-3">Content</h5>
                      <h6 className="text-lg font-medium text-white mb-3">{slide.content.headline}</h6>
                      <ul className="space-y-2">
                        {slide.content.bullets.map((bullet: string, bulletIndex: number) => (
                          <li key={bulletIndex} className="text-purple-100 flex items-start space-x-2">
                            <ChevronRight className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-purple-200 mb-3">Visual Suggestion</h5>
                      <div className="bg-purple-600/10 rounded-lg p-4 border border-purple-500/20">
                        <p className="text-purple-100 italic">{slide.content.visualSuggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Deck Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Pitch Deck Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-300 mb-3">Do's</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Keep slides simple and visual</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Tell a compelling story</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Use data to support claims</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Practice your delivery</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-red-300 mb-3">Don'ts</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Overcrowd slides with text</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Use unrealistic projections</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Ignore the competition</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Forget to ask for what you need</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};