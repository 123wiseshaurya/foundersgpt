import React, { useState } from 'react';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import { generateStructuredResponse } from '../../lib/openai';
import { SYSTEM_PROMPTS, JSON_SCHEMAS } from '../../lib/prompts';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ApiKeyPrompt } from '../ui/ApiKeyPrompt';

export const FounderBio: React.FC = () => {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [achievements, setAchievements] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('openai_api_key')
  );

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    (window as any).VITE_OPENAI_API_KEY = key;
  };

  const handleGenerate = async () => {
    if (!role.trim() || !apiKey) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = `Create professional founder bios for: "${role}"
      
      Experience: ${experience || 'Not specified'}
      Achievements: ${achievements || 'Not specified'}
      Tone: ${tone}
      
      Generate 6 different bio formats:
      - Short bio (1-2 sentences)
      - Medium bio (1 paragraph)
      - Long bio (3-4 paragraphs)
      - LinkedIn headline
      - Twitter bio
      - Speaker bio
      
      Make them compelling and professional.`;

      const response = await generateStructuredResponse(
        prompt,
        SYSTEM_PROMPTS.founderBio,
        JSON_SCHEMAS.founderBios
      );

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate bios. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!apiKey) {
    return <ApiKeyPrompt onApiKeySet={handleApiKeySet} />;
  }

  const bioTypes = [
    { key: 'short', title: 'Short Bio (1-2 sentences)', description: 'Perfect for team pages, quick introductions' },
    { key: 'medium', title: 'Medium Bio (1 paragraph)', description: 'Great for speaker profiles, about pages' },
    { key: 'long', title: 'Long Bio (3-4 paragraphs)', description: 'Detailed bio for press releases, executive profiles' },
    { key: 'linkedIn', title: 'LinkedIn Headline', description: 'Professional headline for LinkedIn profile' },
    { key: 'twitter', title: 'Twitter Bio', description: 'Concise bio for social media profiles' },
    { key: 'speakerBio', title: 'Speaker Bio', description: 'For conferences, events, and speaking engagements' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Founder Bio Generator</h2>
            <p className="text-purple-200">Create professional bios for different contexts</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-purple-200 mb-2">
              Your role/title*
            </label>
            <input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., CEO & Co-founder, Product Manager, Serial Entrepreneur..."
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-purple-200 mb-2">
              Experience & Background
            </label>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., 8 years at Google, former startup founder, ex-McKinsey consultant..."
              className="w-full h-20 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div>
            <label htmlFor="achievements" className="block text-sm font-medium text-purple-200 mb-2">
              Key Achievements
            </label>
            <textarea
              id="achievements"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="e.g., Built product used by 1M+ users, raised $5M Series A, featured in TechCrunch..."
              className="w-full h-20 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
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
              <option value="approachable">Approachable & Friendly</option>
              <option value="innovative">Innovative & Forward-thinking</option>
              <option value="humble">Humble & Achievement-focused</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!role.trim() || isGenerating || !apiKey}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin" />
              <span>Generating Bios with AI...</span>
            </>
          ) : (
            <>
              <User className="h-5 w-5" />
              <span>Generate Bios</span>
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
          {bioTypes.map((bioType) => (
            <div key={bioType.key} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{bioType.title}</h3>
                  <p className="text-purple-300 text-sm">{bioType.description}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(result[bioType.key], bioType.key)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {copied === bioType.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied === bioType.key ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 border border-purple-500/10">
                <p className="text-purple-100 whitespace-pre-wrap leading-relaxed">{result[bioType.key]}</p>
              </div>
            </div>
          ))}

          {/* Bio Writing Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Bio Writing Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-300 mb-3">Best Practices</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Start with your current role and company</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Include quantifiable achievements</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Mention relevant education or credentials</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Keep it relevant to your current goals</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-300 mb-3">Different Lengths</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Short:</strong> Team pages, quick introductions</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Medium:</strong> Speaker profiles, about pages</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Long:</strong> Press releases, executive profiles</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span><strong>Social:</strong> LinkedIn, Twitter profiles</span>
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