import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Globe,
  X,
  RefreshCw
} from 'lucide-react';
import { useFairStreamStore } from '../../store/fairstream';
import type { DriftAlert } from '../../types/fairstream';

export function SemanticDriftDetector() {
  const { driftData, setDriftData, addAlert, clearAlerts } = useFairStreamStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate AI analysis
  const analyzeDrift = () => {
    setIsAnalyzing(true);
    
    // Generate random drift data
    const newPoliticalLean = Math.max(-100, Math.min(100, driftData.politicalLean + (Math.random() - 0.5) * 30));
    const newTopicDiversity = Math.max(0, Math.min(100, driftData.topicDiversity + (Math.random() - 0.5) * 20));
    const newDemographicBias = Math.max(0, Math.min(100, driftData.demographicBias + (Math.random() - 0.5) * 25));
    const newIdeologicalSpread = Math.max(0, Math.min(100, driftData.ideologicalSpread + (Math.random() - 0.5) * 20));

    setDriftData({
      politicalLean: newPoliticalLean,
      topicDiversity: newTopicDiversity,
      demographicBias: newDemographicBias,
      ideologicalSpread: newIdeologicalSpread,
    });

    // Generate alerts if drift is significant
    if (Math.abs(newPoliticalLean) > 60) {
      const alert: DriftAlert = {
        id: `alert-${Date.now()}`,
        type: 'political',
        severity: Math.abs(newPoliticalLean) > 80 ? 'critical' : 'high',
        message: `Your feed shows a ${newPoliticalLean > 0 ? 'right-leaning' : 'left-leaning'} bias of ${Math.abs(Math.round(newPoliticalLean))}%. Consider diversifying your sources.`,
        timestamp: new Date(),
        recommendation: 'Try adjusting the Serendipity Slider to include more opposing viewpoints.',
      };
      addAlert(alert);
    }

    if (newTopicDiversity < 40) {
      const alert: DriftAlert = {
        id: `alert-${Date.now()}`,
        type: 'topic',
        severity: newTopicDiversity < 20 ? 'high' : 'medium',
        message: `Your topic diversity has dropped to ${Math.round(newTopicDiversity)}%. You're consuming content from a narrow range of topics.`,
        timestamp: new Date(),
        recommendation: 'Explore content from different categories to broaden your perspective.',
      };
      addAlert(alert);
    }

    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  const getBiasColor = (value: number) => {
    if (value < -30) return 'text-blue-400';
    if (value > 30) return 'text-red-400';
    return 'text-green-400';
  };

  const getBiasLabel = (value: number) => {
    if (value < -30) return 'Left-Leaning';
    if (value > 30) return 'Right-Leaning';
    return 'Balanced';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Analyze Button */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl">
              <Brain className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Semantic Drift Detection</h3>
              <p className="text-slate-400 text-sm">AI-powered consumption analysis</p>
            </div>
          </div>
          <motion.button
            onClick={analyzeDrift}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white rounded-xl font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Feed'}
          </motion.button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Political Lean */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              {driftData.politicalLean > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-400" />
              ) : driftData.politicalLean < 0 ? (
                <TrendingDown className="w-4 h-4 text-blue-400" />
              ) : (
                <div className="w-4 h-4" />
              )}
              <span className="text-slate-400 text-sm">Political Lean</span>
            </div>
            <div className={`text-2xl font-bold ${getBiasColor(driftData.politicalLean)}`}>
              {driftData.politicalLean > 0 ? '+' : ''}{Math.round(driftData.politicalLean)}
            </div>
            <div className={`text-xs mt-1 ${getBiasColor(driftData.politicalLean)}`}>
              {getBiasLabel(driftData.politicalLean)}
            </div>
          </div>

          {/* Topic Diversity */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 text-sm">Topic Diversity</span>
            </div>
            <div className={`text-2xl font-bold ${
              driftData.topicDiversity > 60 ? 'text-green-400' : 
              driftData.topicDiversity > 30 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {Math.round(driftData.topicDiversity)}%
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${driftData.topicDiversity}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Demographic Bias */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-sm">Demographic Bias</span>
            </div>
            <div className={`text-2xl font-bold ${
              driftData.demographicBias < 40 ? 'text-green-400' : 
              driftData.demographicBias < 70 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {Math.round(driftData.demographicBias)}%
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${driftData.demographicBias}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Ideological Spread */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 text-sm">Ideological Spread</span>
            </div>
            <div className={`text-2xl font-bold ${
              driftData.ideologicalSpread > 60 ? 'text-green-400' : 
              driftData.ideologicalSpread > 30 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {Math.round(driftData.ideologicalSpread)}%
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${driftData.ideologicalSpread}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h4 className="text-lg font-semibold text-white">Drift Alerts</h4>
            {driftData.alerts.length > 0 && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                {driftData.alerts.length}
              </span>
            )}
          </div>
          {driftData.alerts.length > 0 && (
            <button 
              onClick={clearAlerts}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <AnimatePresence>
          {driftData.alerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-slate-500"
            >
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No drift alerts detected</p>
              <p className="text-sm">Your feed consumption looks balanced!</p>
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {driftData.alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-2xl border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase font-bold tracking-wider opacity-75">
                          {alert.type}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-2">
                        💡 {alert.recommendation}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        const newAlerts = driftData.alerts.filter(a => a.id !== alert.id);
                        setDriftData({ alerts: newAlerts });
                      }}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
