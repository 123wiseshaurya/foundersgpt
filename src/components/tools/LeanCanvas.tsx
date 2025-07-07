import React, { useState } from 'react';
import { Grid3X3, Sparkles, Download, FileImage, FileText } from 'lucide-react';
import { generateStructuredResponse } from '../../lib/openai';
import { SYSTEM_PROMPTS, JSON_SCHEMAS } from '../../lib/prompts';
import { ErrorMessage } from '../ui/ErrorMessage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const LeanCanvas: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = `Create a comprehensive Lean Canvas for this startup: "${idea}"
      
      Generate all 9 sections:
      - Problem (3-4 key problems)
      - Solution (3-4 key solutions)
      - Key Metrics (4-5 metrics to track)
      - Unique Value Proposition (single clear statement)
      - Unfair Advantage (3-4 advantages)
      - Channels (3-4 distribution channels)
      - Customer Segments (3-4 target segments)
      - Cost Structure (3-4 main costs)
      - Revenue Streams (3-4 revenue sources)
      
      Be specific and actionable for each section.`;

      const response = await generateStructuredResponse(
        prompt,
        SYSTEM_PROMPTS.leanCanvas,
        JSON_SCHEMAS.leanCanvas
      );

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate lean canvas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportCanvasAsPNG = async () => {
    setIsExporting(true);
    try {
      const canvasElement = document.getElementById('lean-canvas-grid');
      if (!canvasElement) {
        alert('Canvas not found. Please generate a canvas first.');
        return;
      }

      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#1e1b4b',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = 'lean-canvas.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting canvas:', error);
      alert('Error exporting canvas. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportCanvasAsPDF = async () => {
    setIsExporting(true);
    try {
      const canvasElement = document.getElementById('lean-canvas-grid');
      if (!canvasElement) {
        alert('Canvas not found. Please generate a canvas first.');
        return;
      }

      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#1e1b4b',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const imgWidth = 297; // A4 landscape width in mm
      const pageHeight = 210; // A4 landscape height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('lean-canvas.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const canvasItems = [
    { key: 'problem', gridArea: 'problem', color: 'border-red-500/30 bg-red-500/10' },
    { key: 'solution', gridArea: 'solution', color: 'border-green-500/30 bg-green-500/10' },
    { key: 'keyMetrics', gridArea: 'metrics', color: 'border-blue-500/30 bg-blue-500/10' },
    { key: 'uniqueValueProposition', gridArea: 'uvp', color: 'border-purple-500/30 bg-purple-500/10' },
    { key: 'unfairAdvantage', gridArea: 'advantage', color: 'border-yellow-500/30 bg-yellow-500/10' },
    { key: 'channels', gridArea: 'channels', color: 'border-cyan-500/30 bg-cyan-500/10' },
    { key: 'customerSegments', gridArea: 'segments', color: 'border-pink-500/30 bg-pink-500/10' },
    { key: 'costStructure', gridArea: 'costs', color: 'border-orange-500/30 bg-orange-500/10' },
    { key: 'revenueStreams', gridArea: 'revenue', color: 'border-emerald-500/30 bg-emerald-500/10' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <Grid3X3 className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Lean Canvas Generator</h2>
            <p className="text-purple-200">Create a comprehensive business model canvas for your startup</p>
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
              <span>Generating Canvas with AI...</span>
            </>
          ) : (
            <>
              <Grid3X3 className="h-5 w-5" />
              <span>Generate Lean Canvas</span>
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
          <div className="flex justify-end space-x-3">
            <button 
              onClick={exportCanvasAsPNG}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {isExporting ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <FileImage className="h-4 w-4" />
              )}
              <span>Export PNG</span>
            </button>
            <button 
              onClick={exportCanvasAsPDF}
              disabled={isExporting}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {isExporting ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>Export PDF</span>
            </button>
          </div>

          {/* Lean Canvas Grid */}
          <div id="lean-canvas-grid" className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Lean Canvas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4" style={{
              gridTemplateAreas: `
                "problem uvp advantage segments segments"
                "solution uvp channels segments segments"
                "metrics revenue revenue costs costs"
              `
            }}>
              {canvasItems.map((item) => {
                const data = result[item.key];
                return (
                  <div 
                    key={item.key} 
                    className={`rounded-lg p-4 border-2 ${item.color} min-h-[200px]`}
                    style={{ gridArea: item.gridArea }}
                  >
                    <h4 className="font-semibold text-white mb-3 text-center">{data.title}</h4>
                    <div className="text-sm text-purple-100">
                      {item.key === 'uniqueValueProposition' ? (
                        <p className="text-center font-medium">{data.content}</p>
                      ) : (
                        <ul className="space-y-2">
                          {data.content.map((item: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Insights */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Canvas Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-purple-200 mb-3">Key Assumptions to Test</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">🔍</span>
                    <span>Customers actually experience the problems you've identified</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">🔍</span>
                    <span>Your solution effectively addresses these problems</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">🔍</span>
                    <span>Customers are willing to pay for your solution</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">🔍</span>
                    <span>You can reach customers through your chosen channels</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-200 mb-3">Next Steps</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Validate your problem-solution fit through customer interviews</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Create an MVP to test your core value proposition</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Test your marketing channels with small experiments</span>
                  </li>
                  <li className="text-purple-100 flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Iterate on your business model based on learnings</span>
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