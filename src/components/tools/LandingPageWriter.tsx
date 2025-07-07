import React, { useState } from 'react';
import { Globe, Sparkles, Eye, MousePointer } from 'lucide-react';
import { generateStructuredResponse } from '../../lib/openai';
import { SYSTEM_PROMPTS, JSON_SCHEMAS } from '../../lib/prompts';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ApiKeyPrompt } from '../ui/ApiKeyPrompt';

export const LandingPageWriter: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerate = async () => {
    if (!idea.trim() || !apiKey) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = `Create compelling landing page copy for this startup: "${idea}"
      
      Tone: ${tone}
      
      Generate:
      - Hero section with headline, subheadline, and CTA
      - 4 key features with titles and descriptions
      - Social proof including testimonials and stats
      - Pricing section with 3 tiers
      - Final CTA section
      
      Make it conversion-focused and persuasive.`;

      const response = await generateStructuredResponse(
        prompt,
        SYSTEM_PROMPTS.landingPageWriter,
        JSON_SCHEMAS.landingPageContent
      );

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate landing page copy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!apiKey) {
    return <ApiKeyPrompt onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Landing Page Writer</h2>
            <p className="text-purple-200">Generate compelling landing page copy that converts</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
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

          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-purple-200 mb-2">
              Tone & Style
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="professional">Professional & Authoritative</option>
              <option value="friendly">Friendly & Approachable</option>
              <option value="technical">Technical & Detailed</option>
              <option value="casual">Casual & Conversational</option>
              <option value="luxury">Premium & Exclusive</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!idea.trim() || isGenerating || !apiKey}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>Generating Copy with AI...</span>
            </>
          ) : (
            <>
              <Globe className="h-5 w-5" />
              <span>Generate Landing Page</span>
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
        <div className="space-y-8">
          {/* Hero Section Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-6">
              <Eye className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Hero Section Preview</h3>
            </div>
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-8 border border-purple-500/30">
              <h1 className="text-4xl font-bold text-white mb-4">{result.heroSection.headline}</h1>
              <p className="text-xl text-purple-100 mb-6">{result.heroSection.subheadline}</p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg">
                {result.heroSection.cta}
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-6">Features Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.features.map((feature: any, index: number) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-purple-500/10">
                  <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-purple-100 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-6">Social Proof</h3>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {result.socialProof.stats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{stat.value}</div>
                  <div className="text-purple-200">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              {result.socialProof.testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-purple-500/10">
                  <p className="text-purple-100 mb-3">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-purple-200">- {testimonial.name}, {testimonial.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-6">Pricing Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.pricing.plans.map((plan: any, index: number) => (
                <div key={index} className="bg-white/5 rounded-lg p-6 border border-purple-500/10">
                  <h4 className="text-xl font-semibold text-white mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-purple-400 mb-4">{plan.price}</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="text-purple-100 text-sm flex items-start space-x-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-6">
              <MousePointer className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Call-to-Action Section</h3>
            </div>
            <div className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-8 border border-purple-500/30">
              <h2 className="text-3xl font-bold text-white mb-4">{result.cta.headline}</h2>
              <p className="text-xl text-purple-100 mb-6">{result.cta.subheadline}</p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg text-lg">
                {result.cta.button}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};