import React, { useState } from 'react';
import { FileText, Sparkles, Download } from 'lucide-react';
import { generateStructuredResponse } from '../../lib/openai';
import { SYSTEM_PROMPTS, JSON_SCHEMAS } from '../../lib/prompts';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ApiKeyPrompt } from '../ui/ApiKeyPrompt';

export const OnePager: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [founderInfo, setFounderInfo] = useState('');
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
      const prompt = `Create a comprehensive one-page business summary for: "${idea}"
      
      Company name: ${companyName || 'Not specified'}
      Founder info: ${founderInfo || 'Not specified'}
      
      Generate:
      - Company name and tagline
      - Problem and solution statements
      - Key features and target market
      - Business model and traction
      - Team information and funding details
      - Financial projections and contact info
      
      Make it investor-ready and professional.`;

      const response = await generateStructuredResponse(
        prompt,
        SYSTEM_PROMPTS.onePager,
        JSON_SCHEMAS.onePager
      );

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate one-pager. Please try again.');
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
          <FileText className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">One-Pager Generator</h2>
            <p className="text-purple-200">Create a comprehensive one-page business summary</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-purple-200 mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., FounderGPT"
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                placeholder="e.g., Ex-Google PM with 2 successful exits..."
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
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
              <span>Generating One-Pager with AI...</span>
            </>
          ) : (
            <>
              <FileText className="h-5 w-5" />
              <span>Generate One-Pager</span>
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
          {/* Export Button */}
          <div className="flex justify-end space-x-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* One-Pager Preview */}
          <div className="bg-white text-black rounded-lg p-8 border border-purple-500/20 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8 border-b border-gray-200 pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{result.companyName}</h1>
              <p className="text-xl text-gray-600 mb-4">{result.tagline}</p>
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <span>{result.contact.email}</span>
                <span>{result.contact.website}</span>
                <span>{result.contact.phone}</span>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Problem */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem</h3>
                  <p className="text-gray-700 text-sm">{result.problem}</p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Solution</h3>
                  <p className="text-gray-700 text-sm">{result.solution}</p>
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3>
                  <ul className="space-y-1 text-sm">
                    {result.keyFeatures.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Market */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Target Market</h3>
                  <p className="text-gray-700 text-sm">{result.target}</p>
                </div>

                {/* Business Model */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Model</h3>
                  <p className="text-gray-700 text-sm">{result.businessModel}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Traction */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Traction</h3>
                  <ul className="space-y-1 text-sm">
                    {result.traction.map((item: string, index: number) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Team */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Team</h3>
                  <p className="text-gray-700 text-sm">{result.team}</p>
                </div>

                {/* Financial Projections */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Projections</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Year 1</div>
                      <div className="text-gray-600">{result.projections.year1}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Year 2</div>
                      <div className="text-gray-600">{result.projections.year2}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Year 3</div>
                      <div className="text-gray-600">{result.projections.year3}</div>
                    </div>
                  </div>
                </div>

                {/* Funding */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Funding</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seeking:</span>
                      <span className="font-semibold text-gray-900">{result.funding.seeking}</span>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Use of funds:</span> {result.funding.use}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Timeline:</span> {result.funding.timeline}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                For more information, please contact us at {result.contact.email} or visit {result.contact.website}
              </p>
            </div>
          </div>

          {/* One-Pager Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">One-Pager Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-300 mb-3">Essential Elements</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Clear problem and solution statement</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Compelling traction and metrics</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Professional design and layout</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Contact information and next steps</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-300 mb-3">Use Cases</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Initial investor outreach</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Partnership discussions</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Accelerator applications</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Internal team alignment</span>
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