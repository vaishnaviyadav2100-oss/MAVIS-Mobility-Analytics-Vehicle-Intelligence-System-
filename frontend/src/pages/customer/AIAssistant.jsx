import React, { useState } from 'react';
import aiService from '../../services/aiService';
import {
  Bot,
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  CalendarCheck,
  ShieldAlert,
  ArrowRight,
  Info,
  Car,
} from 'lucide-react';

export const AIAssistant = ({ setCurrentView, setPreFilledBooking }) => {
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const samplePrompts = [
    'My vehicle makes a harsh grinding noise whenever I apply brakes at slow speeds.',
    'Engine temperature needle is in the red and white smoke is coming from under the hood.',
    'Steering wheel vibrates noticeably above 80 km/h on the highway.',
    'Engine cranks sluggishly in the morning and battery warning light blinks.',
  ];

  const handleAnalyze = async (textToAnalyze) => {
    const text = textToAnalyze || complaint;
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);
    const analysis = await aiService.analyzeComplaint(text);
    setResult(analysis);
    setLoading(false);
  };

  const handleBookWithAI = () => {
    if (!result) return;
    if (setPreFilledBooking) {
      setPreFilledBooking({
        serviceType: result.suggestedService,
        description: `[AI Preliminary Guidance - Category: ${result.category} | Priority: ${result.priority}]: ${result.summary} Customer Complaint: ${complaint}`,
      });
    }
    setCurrentView('customer-book-service');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 border border-purple-800/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-xl shadow-purple-600/20 shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MAVIS Intelligent Diagnostics & Triage</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Vehicle Complaint AI Assistant
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Describe unusual noises, sensations, dashboard indicators, or fluid leaks in plain words.
              Our automotive LLM model evaluates severity, points out critical inspection zones, and
              provides preliminary service guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Describe the Vehicle Issue or Symptom
        </label>
        <div className="relative">
          <textarea
            rows="3"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="e.g. There is a metallic grinding noise when I depress the brake pedal at low speeds..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          ></textarea>
        </div>

        {/* Quick Sample Suggestions */}
        <div className="mt-3">
          <span className="text-[11px] text-slate-400 font-medium">Or try an example complaint:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setComplaint(prompt);
                  handleAnalyze(prompt);
                }}
                className="text-[11px] text-slate-300 bg-slate-800/80 hover:bg-purple-900/30 hover:text-purple-300 hover:border-purple-500/40 border border-slate-700/60 rounded-xl px-3 py-1.5 transition-all text-left"
              >
                "{prompt.slice(0, 48)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !complaint.trim()}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-purple-600/20 transition-all disabled:opacity-40"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Analyzing Automotive Telemetry...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Preliminary AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Analysis Result */}
      {result && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                AUTOMOTIVE INTELLIGENCE REPORT
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{result.category}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Urgency Level</span>
                <div
                  className={`text-sm font-extrabold uppercase ${
                    result.priority === 'Critical'
                      ? 'text-red-400'
                      : result.priority === 'High'
                      ? 'text-amber-400'
                      : 'text-cyan-400'
                  }`}
                >
                  {result.priority} ({result.urgencyScore}/10)
                </div>
              </div>
            </div>
          </div>

          {/* Preliminary Guidance Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Preliminary Guidance (Not a final diagnosis)</span>
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">{result.preliminaryGuidance}</p>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
              {result.safetyNotice}
            </div>
          </div>

          {/* Inspection Areas Checklist */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Recommended Inspection Areas for Mechanic:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.inspectionAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA to book service */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400">Suggested Action:</span>
              <div className="text-sm font-bold text-white">{result.suggestedService}</div>
              <span className="text-[11px] text-slate-500">Estimated Duration: {result.estimatedTime}</span>
            </div>

            <button
              onClick={handleBookWithAI}
              className="py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Service with this AI Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
