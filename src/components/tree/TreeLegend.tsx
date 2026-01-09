import React from 'react';

export const TreeLegend: React.FC = () => {
  return (
    <div className="rk-py-4 rk-border-t rk-border-[#2a2a2a] rk-bg-[#1a1a1f]">
      <div className="rk-flex rk-w-full rk-max-w-[95%] rk-mx-auto rk-flex-wrap rk-gap-3 rk-items-center rk-shrink-0">
        <div className="rk-flex rk-items-center rk-gap-2 rk-text-sm rk-text-[#a0a0a0] rk-px-3 rk-py-2 rk-bg-[#2a2a35] rk-rounded-lg rk-border rk-border-[#3a3a45] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] rk-transition-colors">
          <div className="rk-w-4 rk-h-4 rk-rounded rk-bg-[#4caf50] rk-border rk-border-white/10"></div>
          <span>Public Route</span>
        </div>
        
        <div className="rk-flex rk-items-center rk-gap-2 rk-text-sm rk-text-[#a0a0a0] rk-px-3 rk-py-2 rk-bg-[#2a2a35] rk-rounded-lg rk-border rk-border-[#3a3a45] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] rk-transition-colors">
          <div className="rk-w-4 rk-h-4 rk-rounded rk-bg-[#ef5350] rk-border rk-border-white/10"></div>
          <span>Private Route</span>
        </div>
        
        <div className="rk-flex rk-items-center rk-gap-2 rk-text-sm rk-text-[#a0a0a0] rk-px-3 rk-py-2 rk-bg-[#2a2a35] rk-rounded-lg rk-border rk-border-[#3a3a45] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] rk-transition-colors">
          <div className="rk-w-4 rk-h-4 rk-rounded rk-bg-[#9e9e9e] rk-border rk-border-white/10"></div>
          <span>Neutral Route</span>
        </div>
        
        <div className="rk-flex rk-items-center rk-gap-2 rk-text-sm rk-text-[#a0a0a0] rk-px-3 rk-py-2 rk-bg-[#2a2a35] rk-rounded-lg rk-border rk-border-[#3a3a45] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] rk-transition-colors">
          <div className="rk-w-6 rk-h-6 rk-bg-[#3a3a45] rk-flex rk-items-center rk-justify-center rk-text-xs rk-rounded-md rk-border rk-border-white/10 rk-text-[#ffc107]">
            ⚡
          </div>
          <span>Lazy Loaded</span>
        </div>
        
        <div className="rk-flex rk-items-center rk-gap-2 rk-text-sm rk-text-[#a0a0a0] rk-px-3 rk-py-2 rk-bg-[#2a2a35] rk-rounded-lg rk-border rk-border-[#3a3a45] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] rk-transition-colors">
          <div className="rk-w-6 rk-h-6 rk-bg-[#3a3a45] rk-flex rk-items-center rk-justify-center rk-text-xs rk-rounded-md rk-border rk-border-white/10 rk-text-[#9c27b0]">
            ↪
          </div>
          <span>Redirect</span>
        </div>
        
        <div className="rk-flex rk-items-center rk-gap-2 rk-text-sm rk-text-[#a0a0a0] rk-px-3 rk-py-2 rk-bg-[#2a2a35] rk-rounded-lg rk-border rk-border-[#3a3a45] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] rk-transition-colors">
          <div className="rk-w-6 rk-h-6 rk-bg-[#64b5f6] rk-rounded-full rk-flex rk-items-center rk-justify-center rk-text-xs rk-text-white rk-font-semibold rk-border rk-border-[#64b5f6]/30">
            #
          </div>
          <span>Children Count</span>
        </div>
        
        <div className="rk-flex rk-items-center rk-gap-2 rk-text-sm rk-text-[#a0a0a0] rk-px-3 rk-py-2 rk-bg-[#2a2a35] rk-rounded-lg rk-border rk-border-[#3a3a45] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] rk-transition-colors">
          <div className="rk-w-6 rk-h-6 rk-bg-[#3a3a45] rk-flex rk-items-center rk-justify-center rk-text-lg rk-font-bold rk-rounded-md rk-border rk-border-white/10 rk-text-white">
            +
          </div>
          <span>Expand/Collapse</span>
        </div>
      </div>
    </div>
  );
};