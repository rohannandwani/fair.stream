import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap, ArrowRight, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useFairStreamStore } from '../../store/fairstream';

export function SerendipitySlider() {
  const { serendipity, setSerendipity } = useFairStreamStore();
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleSliderChange = (key: keyof typeof serendipity, value: number) => {
    setIsAdjusting(true);
    setSerendipity({ [key]: value });
    setTimeout(() => setIsAdjusting(false), 300);
  };

  const getEchoChamberLabel = (value: number) => {
    if (value < 25) return 'Open';
    if (value < 50) return 'Balanced';
    if (value < 75) return 'Narrowing';
    return 'Deep Rabbit Hole';
  };

  const getDiversityLabel = (value: number) => {
    if (value < 25) return 'Homogeneous';
    if (value < 50) return 'Limited';
    if (value < 75) return 'Diverse';
    return 'Maximum Diversity';
  };

  // Calculate serendipity score and status
  const { status, statusLabel, score, isOptimal } = useMemo(() => {
    const echo = serendipity.echoChamberStrength;
    const diversity = serendipity.diversityTarget;
    const opposing = serendipity.opposingViewpointRatio;
    
    // Lower echo chamber + higher diversity + balanced opposing = better score
    const calculatedScore = Math.round(
      ((100 - echo) * 0.4 + diversity * 0.35 + opposing * 0.25)
    );
    
    let newStatus: 'green' | 'yellow' | 'red' = 'green';
    let newStatusLabel = 'Optimal Balance';
    let newIsOptimal = false;
    
    if (echo > 75 || diversity < 25) {
      newStatus = 'red';
      newStatusLabel = 'High Filter Bubble Risk';
    } else if (echo > 50 || diversity < 50) {
      newStatus = 'yellow';
      newStatusLabel = 'Moderate Risk';
    } else {
      newStatus = 'green';
      newStatusLabel = 'Optimal Balance';
      newIsOptimal = true;
    }
    
    return { status: newStatus, statusLabel: newStatusLabel, score: calculatedScore, isOptimal: newIsOptimal };
  }, [serendipity]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Serendipity Slider</h3>
          <p className="text-slate-400 text-sm">Control your feed's echo chamber</p>
        </div>
      </div>

      {/* Echo Chamber Strength */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <label className="text-slate-300 font-medium flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Echo Chamber Strength
          </label>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            serendipity.echoChamberStrength < 50 
              ? 'bg-green-500/20 text-green-400' 
              : serendipity.echoChamberStrength < 75 
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
          }`}>
            {getEchoChamberLabel(serendipity.echoChamberStrength)}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={serendipity.echoChamberStrength}
            onChange={(e) => handleSliderChange('echoChamberStrength', Number(e.target.value))}
            className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
            }}
          />
          <div 
            className="absolute top-0 h-3 bg-transparent rounded-full pointer-events-none"
            style={{
              width: `${serendipity.echoChamberStrength}%`,
              background: `linear-gradient(to right, #10b981, #f59e0b, #ef4444)`,
              opacity: 0.3,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Open</span>
          <span>Balanced</span>
          <span>Isolated</span>
        </div>
      </div>

      {/* Diversity Target */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <label className="text-slate-300 font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            Diversity Target
          </label>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            serendipity.diversityTarget > 50 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {getDiversityLabel(serendipity.diversityTarget)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={serendipity.diversityTarget}
          onChange={(e) => handleSliderChange('diversityTarget', Number(e.target.value))}
          className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Narrow</span>
          <span>Moderate</span>
          <span>Broad</span>
        </div>
      </div>

      {/* Opposing Viewpoint Ratio */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-slate-300 font-medium flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-rose-400" />
            Opposing Viewpoint Ratio
          </label>
          <span className="text-cyan-400 font-mono">
            {serendipity.opposingViewpointRatio}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={serendipity.opposingViewpointRatio}
          onChange={(e) => handleSliderChange('opposingViewpointRatio', Number(e.target.value))}
          className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>None</span>
          <span>Some</span>
          <span>High</span>
        </div>
      </div>

      {/* Live Preview */}
      <motion.div 
        className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50"
        animate={{ scale: isAdjusting ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <h4 className="text-sm font-medium text-slate-400 mb-2">Current Feed Mix</h4>
        <div className="flex gap-2">
          <div 
            className="h-8 rounded-lg flex-1 flex items-center justify-center text-xs font-medium"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
              border: '1px solid rgba(239, 68, 68, 0.5)'
            }}
          >
            <span className="text-red-300">{Math.max(0, 50 - serendipity.opposingViewpointRatio / 2)}%</span>
          </div>
          <div 
            className="h-8 rounded-lg flex-1 flex items-center justify-center text-xs font-medium"
            style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.3)',
              border: '1px solid rgba(59, 130, 246, 0.5)'
            }}
          >
            <span className="text-blue-300">{serendipity.opposingViewpointRatio}%</span>
          </div>
          <div 
            className="h-8 rounded-lg flex-1 flex items-center justify-center text-xs font-medium"
            style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.3)',
              border: '1px solid rgba(34, 197, 94, 0.5)'
            }}
          >
            <span className="text-green-300">{Math.min(50, 50 - serendipity.opposingViewpointRatio / 2)}%</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span className="text-red-400">Same View</span>
          <span className="text-blue-400">Opposing</span>
          <span className="text-green-400">Neutral</span>
        </div>
      </motion.div>

      {/* Status Indicator */}
      <motion.div 
        className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-between"
        animate={{ scale: isAdjusting ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${
              status === 'green' ? 'bg-green-400' : status === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            {isOptimal && (
              <div className={`absolute inset-0 w-3 h-3 rounded-full ${
                status === 'green' ? 'bg-green-400' : 'bg-transparent'
              } animate-ping`} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                status === 'green' ? 'text-green-400' : status === 'yellow' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {statusLabel}
              </span>
              {status === 'green' && <CheckCircle className="w-4 h-4 text-green-400" />}
              {status === 'yellow' && <Activity className="w-4 h-4 text-yellow-400" />}
              {status === 'red' && <AlertTriangle className="w-4 h-4 text-red-400" />}
            </div>
            <p className="text-xs text-slate-500">Filter bubble status</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {score}
          </div>
          <div className="text-xs text-slate-500">Serendipity Score</div>
        </div>
      </motion.div>
    </div>
  );
}
