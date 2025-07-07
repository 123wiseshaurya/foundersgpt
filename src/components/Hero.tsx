import React from 'react';
import { ArrowRight, Target, Lightbulb, Mail, TrendingUp } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-white mb-6">
          Turn Your Startup Idea Into
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Strategic Assets</span>
        </h2>
        <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
          Get AI-powered insights, strategic documents, and investor-ready materials 
          to validate and launch your startup idea with confidence.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <Target className="h-8 w-8 text-purple-400 mb-3 mx-auto" />
            <h3 className="font-semibold text-white mb-2">MVP Strategy</h3>
            <p className="text-purple-200 text-sm">Get prioritized features for your minimum viable product</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <Lightbulb className="h-8 w-8 text-yellow-400 mb-3 mx-auto" />
            <h3 className="font-semibold text-white mb-2">Idea Validation</h3>
            <p className="text-purple-200 text-sm">Analyze your idea with AI-powered insights</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <Mail className="h-8 w-8 text-green-400 mb-3 mx-auto" />
            <h3 className="font-semibold text-white mb-2">Investor Outreach</h3>
            <p className="text-purple-200 text-sm">Generate compelling cold emails to VCs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <TrendingUp className="h-8 w-8 text-blue-400 mb-3 mx-auto" />
            <h3 className="font-semibold text-white mb-2">Competitor Analysis</h3>
            <p className="text-purple-200 text-sm">Understand your market and differentiation</p>
          </div>
        </div>
        
        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
        >
          <span>Start Building Your Strategy</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};