import React, { useState } from 'react';
import { Mail, Sparkles, Copy, Check } from 'lucide-react';
import { generateStructuredResponse } from '../../lib/openai';
import { SYSTEM_PROMPTS, JSON_SCHEMAS } from '../../lib/prompts';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ApiKeyPrompt } from '../ui/ApiKeyPrompt';

export const EmailGenerator: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [founderInfo, setFounderInfo] = useState('');
  const [traction, setTraction] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
      const prompt = `Create compelling cold emails for investor outreach for this startup: "${idea}"
      
      Founder info: ${founderInfo || 'Not provided'}
      Traction: ${traction || 'Early stage'}
      Tone: ${tone}
      
      Generate:
      - Subject line
      - Main cold email (professional, concise, compelling)
      - Follow-up email
      - List of best practices and tips
      
      Make it personalized and results-oriented.`;

      const response = await generateStructuredResponse(
        prompt,
        SYSTEM_PROMPTS.emailGenerator,
        JSON_SCHEMAS.emailTemplates
      );

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate emails. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!apiKey) {
    return <ApiKeyPrompt onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Email Generator</h2>
            <p className="text-purple-200">Generate compelling cold emails to investors</p>
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
              className="w-full h-24 px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="founderInfo" className="block text-sm font-medium text-purple-200 mb-2">
              Founder Information
            </label>
            <input
              id="founderInfo"
              value={founderInfo}
              onChange={(e) => setFounderInfo(e.target.value)}
              placeholder="e.g., John Smith, former software engineer at Google with 8 years experience..."
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="traction" className="block text-sm font-medium text-purple-200 mb-2">
              Traction & Achievements
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

          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-purple-200 mb-2">
              Email Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="professional">Professional & Direct</option>
              <option value="friendly">Friendly & Conversational</option>
              <option value="confident">Confident & Assertive</option>
              <option value="humble">Humble & Appreciative</option>
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
              <span>Generating Emails with AI...</span>
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              <span>Generate Email</span>
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
          {/* Main Email */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Cold Email Template</h3>
              <button
                onClick={() => copyToClipboard(result.email)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4 border border-purple-500/10">
              <div className="mb-4">
                <div className="text-sm text-purple-300 mb-2">Subject:</div>
                <div className="text-white font-medium">{result.subject}</div>
              </div>
              <div className="text-sm text-purple-300 mb-2">Email:</div>
              <div className="text-purple-100 whitespace-pre-wrap leading-relaxed">{result.email}</div>
            </div>
          </div>

          {/* Follow-up Email */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Follow-up Email</h3>
              <button
                onClick={() => copyToClipboard(result.followUp)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Follow-up</span>
              </button>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4 border border-purple-500/10">
              <div className="text-purple-100 whitespace-pre-wrap leading-relaxed">{result.followUp}</div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Email Best Practices</h3>
            <ul className="space-y-2">
              {result.tips.map((tip: string, index: number) => (
                <li key={index} className="text-purple-100 flex items-start space-x-2">
                  <span className="text-green-400 mt-1">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};