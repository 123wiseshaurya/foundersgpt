import React, { useState } from 'react';
import { Brain, Sparkles, Users, Target, TrendingUp } from 'lucide-react';

export const IdeaAnalyzer: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult({
      elevatorPitch: `${idea} is a revolutionary platform that addresses the critical need for streamlined solutions in the modern market. By leveraging cutting-edge technology and user-centric design, we're positioned to capture significant market share and drive meaningful impact for our target audience.`,
      targetAudience: {
        primary: "Tech-savvy professionals aged 25-40 who value efficiency and innovation",
        secondary: "Small to medium business owners looking to optimize their operations",
        tertiary: "Early adopters and technology enthusiasts"
      },
      problemStatement: `Current solutions in the market are fragmented, expensive, and don't address the core pain points that ${idea} solves. Users struggle with inefficient workflows, high costs, and lack of integration between tools.`,
      marketOpportunity: "The addressable market is estimated at $2.5B and growing at 15% annually, with significant untapped potential in emerging segments.",
      riskFactors: [
        "Competitive landscape with established players",
        "Potential technical challenges in scaling",
        "Customer acquisition costs may be higher than projected"
      ],
      successFactors: [
        "Strong product-market fit validation",
        "Experienced team with domain expertise",
        "Clear differentiation from existing solutions"
      ]
    });
    
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">AI Idea Analyzer</h2>
            <p className="text-purple-200">Get comprehensive insights about your startup idea</p>
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
          disabled={!idea.trim() || isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Brain className="h-5 w-5" />
              <span>Analyze Idea</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Elevator Pitch */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-6 w-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Elevator Pitch</h3>
            </div>
            <p className="text-purple-100 leading-relaxed">{result.elevatorPitch}</p>
          </div>

          {/* Target Audience */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Target Audience</h3>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-purple-200">Primary:</h4>
                <p className="text-purple-100">{result.targetAudience.primary}</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-200">Secondary:</h4>
                <p className="text-purple-100">{result.targetAudience.secondary}</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-200">Tertiary:</h4>
                <p className="text-purple-100">{result.targetAudience.tertiary}</p>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-red-400" />
              <h3 className="text-xl font-semibold text-white">Problem Statement</h3>
            </div>
            <p className="text-purple-100 leading-relaxed">{result.problemStatement}</p>
          </div>

          {/* Market Opportunity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Market Opportunity</h3>
            </div>
            <p className="text-purple-100 leading-relaxed">{result.marketOpportunity}</p>
          </div>

          {/* Risk & Success Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
              <h3 className="text-xl font-semibold text-red-300 mb-4">Risk Factors</h3>
              <ul className="space-y-2">
                {result.riskFactors.map((risk: string, index: number) => (
                  <li key={index} className="text-purple-100 flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
              <h3 className="text-xl font-semibold text-green-300 mb-4">Success Factors</h3>
              <ul className="space-y-2">
                {result.successFactors.map((factor: string, index: number) => (
                  <li key={index} className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{factor}</span>
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