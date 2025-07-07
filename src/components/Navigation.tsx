import React from 'react';
import { 
  Home, 
  Brain, 
  Target, 
  Globe, 
  Mail, 
  TrendingUp, 
  Grid3X3, 
  Presentation, 
  User, 
  FileText 
} from 'lucide-react';
import { Tool } from '../App';

interface NavigationProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
}

const tools = [
  { id: 'home' as Tool, name: 'Home', icon: Home },
  { id: 'idea-analyzer' as Tool, name: 'Idea Analyzer', icon: Brain },
  { id: 'mvp-generator' as Tool, name: 'MVP Generator', icon: Target },
  { id: 'landing-page' as Tool, name: 'Landing Page', icon: Globe },
  { id: 'email-generator' as Tool, name: 'Email Generator', icon: Mail },
  { id: 'competitor-analysis' as Tool, name: 'Competitor Analysis', icon: TrendingUp },
  { id: 'lean-canvas' as Tool, name: 'Lean Canvas', icon: Grid3X3 },
  { id: 'pitch-deck' as Tool, name: 'Pitch Deck', icon: Presentation },
  { id: 'founder-bio' as Tool, name: 'Founder Bio', icon: User },
  { id: 'one-pager' as Tool, name: 'One-Pager', icon: FileText },
];

export const Navigation: React.FC<NavigationProps> = ({ currentTool, onToolChange }) => {
  return (
    <nav className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto py-4 scrollbar-hide">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = currentTool === tool.id;
            
            return (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-purple-600/20'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};