import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';

// Lazy load components to prevent initial loading issues
const IdeaAnalyzer = React.lazy(() => import('./components/tools/IdeaAnalyzer').then(m => ({ default: m.IdeaAnalyzer })));
const MvpGenerator = React.lazy(() => import('./components/tools/MvpGenerator').then(m => ({ default: m.MvpGenerator })));
const LandingPageWriter = React.lazy(() => import('./components/tools/LandingPageWriter').then(m => ({ default: m.LandingPageWriter })));
const EmailGenerator = React.lazy(() => import('./components/tools/EmailGenerator').then(m => ({ default: m.EmailGenerator })));
const CompetitorAnalysis = React.lazy(() => import('./components/tools/CompetitorAnalysis').then(m => ({ default: m.CompetitorAnalysis })));
const LeanCanvas = React.lazy(() => import('./components/tools/LeanCanvas').then(m => ({ default: m.LeanCanvas })));
const PitchDeckSlides = React.lazy(() => import('./components/tools/PitchDeckSlides').then(m => ({ default: m.PitchDeckSlides })));
const FounderBio = React.lazy(() => import('./components/tools/FounderBio').then(m => ({ default: m.FounderBio })));
const OnePager = React.lazy(() => import('./components/tools/OnePager').then(m => ({ default: m.OnePager })));

export type Tool = 
  | 'home'
  | 'idea-analyzer'
  | 'mvp-generator'
  | 'landing-page'
  | 'email-generator'
  | 'competitor-analysis'
  | 'lean-canvas'
  | 'pitch-deck'
  | 'founder-bio'
  | 'one-pager';

function App() {
  const [currentTool, setCurrentTool] = useState<Tool>('home');

  const renderTool = () => {
    switch (currentTool) {
      case 'home':
        return <Hero onGetStarted={() => setCurrentTool('idea-analyzer')} />;
      case 'idea-analyzer':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <IdeaAnalyzer />
          </React.Suspense>
        );
      case 'mvp-generator':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <MvpGenerator />
          </React.Suspense>
        );
      case 'landing-page':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <LandingPageWriter />
          </React.Suspense>
        );
      case 'email-generator':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <EmailGenerator />
          </React.Suspense>
        );
      case 'competitor-analysis':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <CompetitorAnalysis />
          </React.Suspense>
        );
      case 'lean-canvas':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <LeanCanvas />
          </React.Suspense>
        );
      case 'pitch-deck':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <PitchDeckSlides />
          </React.Suspense>
        );
      case 'founder-bio':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <FounderBio />
          </React.Suspense>
        );
      case 'one-pager':
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center py-16"><div className="text-white">Loading...</div></div>}>
            <OnePager />
          </React.Suspense>
        );
      default:
        return <Hero onGetStarted={() => setCurrentTool('idea-analyzer')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <Navigation currentTool={currentTool} onToolChange={setCurrentTool} />
      <main className="container mx-auto px-4 py-8">
        {renderTool()}
      </main>
    </div>
  );
}

export default App;