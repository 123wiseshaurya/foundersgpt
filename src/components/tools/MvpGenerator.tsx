import React, { useState } from 'react';
import { Target, Sparkles, Star, ArrowRight } from 'lucide-react';
import { generateStructuredResponse } from '../../lib/openai';
import { SYSTEM_PROMPTS, JSON_SCHEMAS } from '../../lib/prompts';
import { ErrorMessage } from '../ui/ErrorMessage';

export const MvpGenerator: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = `Create a comprehensive MVP plan for this startup idea: "${idea}"
      
      Provide:
      - Core features prioritized by importance (High/Medium/Low priority)
      - Development effort estimates (High/Medium/Low effort)
      - Time estimates for each feature
      - Overall development timeline
      - Estimated development cost range
      - Recommended tech stack
      - Post-MVP features for future releases
      
      Focus on what's essential for initial market validation and user feedback.`;

      const response = await generateStructuredResponse(
        prompt,
        SYSTEM_PROMPTS.mvpGenerator,
        JSON_SCHEMAS.mvpFeatures
      );

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate MVP plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/20';
      default: return 'text-purple-400 bg-purple-400/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">MVP Generator</h2>
            <p className="text-purple-200">Get prioritized features for your minimum viable product</p>
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
          onClick={handleGenerate}
          disabled={!idea.trim() || isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>Generating MVP with AI...</span>
            </>
          ) : (
            <>
              <Target className="h-5 w-5" />
              <span>Generate MVP Features</span>
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
          {/* Core Features */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-6 w-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Core MVP Features</h3>
            </div>
            <div className="space-y-4">
              {result.coreFeatures.map((feature: any, index: number) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-purple-500/10">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{feature.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(feature.priority)}`}>
                        {feature.priority}
                      </span>
                      <span className="text-purple-300 text-sm">{feature.timeEstimate}</span>
                    </div>
                  </div>
                  <p className="text-purple-100 text-sm mb-2">{feature.description}</p>
                  <div className="text-xs text-purple-300">
                    Effort: {feature.effort}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Development Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Estimated Duration:</span>
                  <span className="text-white font-medium">{result.developmentTimeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Estimated Cost:</span>
                  <span className="text-white font-medium">{result.estimatedCost}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Recommended Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {result.techStack.map((tech: string, index: number) => (
                  <span key={index} className="bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Post-MVP Features */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <ArrowRight className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Post-MVP Features</h3>
            </div>
            <p className="text-purple-200 mb-4">Features to consider for future releases:</p>
            <ul className="space-y-2">
              {result.postMvpFeatures.map((feature: string, index: number) => (
                <li key={index} className="text-purple-100 flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};