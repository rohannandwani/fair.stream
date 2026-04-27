import { motion } from 'framer-motion';
import { Clock, ChevronRight, Shield, ExternalLink, RefreshCw } from 'lucide-react';
import { useFairStreamStore } from '../../store/fairstream';

export function FeedDisplay() {
  const { feedItems, serendipity, isLoadingNews, fetchLiveNews } = useFairStreamStore();

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'right': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Calculate how many items from each bias would show based on serendipity settings
  const opposingRatio = serendipity.opposingViewpointRatio / 100;
  const sameViewRatio = (100 - serendipity.opposingViewpointRatio) / 200;
  const neutralRatio = 1 - opposingRatio - sameViewRatio;

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Your Balanced Feed</h3>
            <p className="text-slate-400 text-sm">Curated content with diverse perspectives</p>
          </div>
        </div>
        <motion.button
          onClick={fetchLiveNews}
          disabled={isLoadingNews}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-xl text-sm font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingNews ? 'animate-spin' : ''}`} />
          {isLoadingNews ? 'Loading...' : 'Refresh Feed'}
        </motion.button>
      </div>

      {/* Feed Mix Indicator */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl">
        <div className="text-xs text-slate-400 mb-2">Current Feed Mix</div>
        <div className="flex h-3 rounded-full overflow-hidden">
          <div 
            className="bg-red-400/80" 
            style={{ width: `${sameViewRatio * 100}%` }}
          />
          <div 
            className="bg-blue-400/80" 
            style={{ width: `${opposingRatio * 100}%` }}
          />
          <div 
            className="bg-green-400/80" 
            style={{ width: `${neutralRatio * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span className="text-red-400">Same View ({Math.round(sameViewRatio * 100)}%)</span>
          <span className="text-blue-400">Opposing ({Math.round(opposingRatio * 100)}%)</span>
          <span className="text-green-400">Neutral ({Math.round(neutralRatio * 100)}%)</span>
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-slate-800/30 hover:bg-slate-800/60 rounded-2xl p-5 border border-slate-700/30 hover:border-slate-600/50 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Bias Indicator */}
              <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${getBiasColor(item.bias)}`}>
                {item.bias.charAt(0).toUpperCase() + item.bias.slice(1)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm line-clamp-2 mb-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{item.source}</span>
                  <span className="w-1 h-1 bg-slate-600 rounded-full" />
                  <span className="capitalize">{item.category}</span>
                  <span className="w-1 h-1 bg-slate-600 rounded-full" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Neutrality Score */}
              <div className="flex flex-col items-center gap-1">
                <div className={`text-2xl font-bold ${getScoreColor(item.neutralityScore)}`}>
                  {item.neutralityScore}
                </div>
                <div className="text-xs text-slate-500">Neutrality</div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.button
        className="w-full mt-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <ExternalLink className="w-4 h-4" />
        Load More Content
      </motion.button>
    </div>
  );
}
