import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Shield,
  Clock,
  Hash,
  Globe
} from 'lucide-react';
import { useFairStreamStore } from '../../store/fairstream';

export function BlockchainCitation() {
  const { citations, feedItems } = useFairStreamStore();
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 bg-green-500/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Review';
  };

  // Merge citations with feed items
  const enrichedCitations = feedItems.map(item => {
    const citation = citations.find(c => c.contentId === item.id);
    return { item, citation };
  });

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl">
          <Link2 className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Blockchain-Backed Citations</h3>
          <p className="text-slate-400 text-sm">Source Neutrality scores verified on-chain</p>
        </div>
      </div>

      <div className="space-y-4">
        {enrichedCitations.map(({ item, citation }, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden"
          >
            {/* Main Content */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedCitation(expandedCitation === item.id ? null : item.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1 line-clamp-2">{item.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>{item.source}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span className="capitalize">{item.category}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1.5 rounded-xl font-bold text-sm ${getScoreColor(item.neutralityScore)}`}>
                    {item.neutralityScore}
                  </div>
                  <span className="text-xs text-slate-500">{getScoreLabel(item.neutralityScore)}</span>
                </div>
              </div>

              {/* Citation Status */}
              {citation && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Verified on {citation.network}</span>
                  <span className="text-slate-500">• Block #{citation.blockNumber.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedCitation === item.id && citation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-700/50 bg-slate-800/30"
                >
                  <div className="p-4 space-y-4">
                    {/* Blockchain Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <Globe className="w-3 h-3" />
                          Network
                        </div>
                        <div className="text-white text-sm font-medium">{citation.network}</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <Hash className="w-3 h-3" />
                          Block Number
                        </div>
                        <div className="text-white text-sm font-medium">#{citation.blockNumber.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Verification Hash */}
                    <div className="bg-slate-900/50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Shield className="w-3 h-3" />
                          Verification Hash
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(citation.verificationHash);
                          }}
                          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          {copiedHash === citation.verificationHash ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <code className="text-xs text-slate-300 font-mono break-all">
                        {citation.verificationHash}
                      </code>
                    </div>

                    {/* Source URL */}
                    <div className="flex items-center justify-between">
                      <a
                        href={citation.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Source
                      </a>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        Verified {new Date(citation.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* No Citation Warning */}
            {!citation && (
              <div className="border-t border-slate-700/50 px-4 py-3 bg-yellow-500/5">
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Pending blockchain verification</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {citations.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {feedItems.length - citations.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {Math.round(feedItems.reduce((acc, item) => acc + item.neutralityScore, 0) / feedItems.length)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
