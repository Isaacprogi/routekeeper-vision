// RouteTreeContainer.tsx - Styled version
import React, { useState, useEffect } from "react";
import type { VisualRouteNode, RouteConfig } from "../../../utils/type";
import { buildRouteGraph } from "../buildGraphRoute";
import { List } from "./List";
import { FaExpandAlt, FaCompressAlt, FaRedo, FaTree } from "react-icons/fa";

type Props = {
  routes: RouteConfig[];
  selectedNode: VisualRouteNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<VisualRouteNode | null>>;
};


const EXPANDED_NODES_KEY = 'routekeeper_expanded_nodes';

export const ListContainer: React.FC<Props> = ({ routes, selectedNode, setSelectedNode }) => {
  const [graph, setGraph] = useState<VisualRouteNode[]>(() => buildRouteGraph(routes));
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(EXPANDED_NODES_KEY);
    if (saved) {
      try {
        const nodes = JSON.parse(saved);
        return new Set(nodes);
      } catch (e) {
        console.warn('Failed to parse expanded nodes from localStorage:', e);
      }
    }
    return new Set();
  });

  useEffect(() => {
    setGraph(buildRouteGraph(routes));
  }, [routes]);


  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_NODES_KEY, JSON.stringify(Array.from(expandedNodes)));
    } catch (e) {
      console.warn('Failed to save expanded nodes to localStorage:', e);
    }
  }, [expandedNodes]);


  const handleNodeSelect = (node: VisualRouteNode) => {
    setSelectedNode(node);
  };

  const handleToggleExpand = (nodeId: string) => {
    const next = new Set(expandedNodes);
    next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
    setExpandedNodes(next);
  };

  const toggleExpandAllNodes = () => {
    if (expandedNodes.size > 0) {
      setExpandedNodes(new Set());
    } else {
      const allNodeIds = new Set<string>();

      const collectAllNodeIds = (nodes: VisualRouteNode[]) => {
        nodes.forEach((node) => {
          allNodeIds.add(node.id);
          if (node.children.length > 0) {
            collectAllNodeIds(node.children);
          }
        });
      };

      collectAllNodeIds(graph);
      setExpandedNodes(allNodeIds);
    }
  };

  const resetTree = () => {
    setExpandedNodes(new Set());
    setSelectedNode(null);
    localStorage.removeItem(EXPANDED_NODES_KEY);
  };

  const totalNodes = graph.reduce((count, node) => {
    const countNodes = (n: VisualRouteNode): number => {
      return 1 + n.children.reduce((sum, child) => sum + countNodes(child), 0);
    };
    return count + countNodes(node);
  }, 0);

  if (graph.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-[#2a2a2a] rounded-lg bg-[#1a1a1f]">
        <FaTree className="w-12 h-12 text-[#888] mb-3" />
        <p className="text-sm text-[#888] mb-1">No routes to display</p>
        <p className="text-xs text-[#666]">Add routes to see the visualization</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1f] min-h-screen">
      <div className="max-w-[95%] mx-auto py-4">
        <div className="bg-[#1a1a1f] border border-[#2a2a2a] rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <FaTree className="w-5 h-5 text-[#64b5f6]" />
              <span className="px-2 py-1 text-xs font-medium bg-[#2a2a35] text-[#888] rounded">
                {totalNodes} nodes
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888] px-2 py-1 bg-[#2a2a35] rounded">
                {routes.length} root routes
              </span>
            </div>
          </div>
          
          {/* Tree Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Public', count: graph.filter(n => n.type === 'public').length, color: '#4caf50', bg: 'bg-[#4caf50]/10' },
              { label: 'Private', count: graph.filter(n => n.type === 'private').length, color: '#ef5350', bg: 'bg-[#ef5350]/10' },
              { label: 'Lazy', count: graph.filter(n => n.lazy).length, color: '#ffc107', bg: 'bg-[#ffc107]/10' },
              { label: 'Redirect', count: graph.filter(n => n.redirectTo).length, color: '#9c27b0', bg: 'bg-[#9c27b0]/10' }
            ].map((stat) => (
              <div key={stat.label} className={`px-3 py-2 rounded ${stat.bg} border border-[#2a2a2a]`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#a0a0a0]">{stat.label}</span>
                  <span className="text-sm font-semibold" style={{ color: stat.color }}>{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4 p-3 border border-[#2a2a2a] rounded-lg bg-[#202025]">
          <div className="flex items-center gap-2">
            <button
              className={`
                flex items-center gap-2 px-3 py-2 text-sm font-medium rounded transition-all duration-200
                ${expandedNodes.size > 0
                  ? 'bg-[#2a2a35] text-[#e0e0e0] border border-[#3a3a45] hover:bg-[#3a3a45]'
                  : 'bg-gradient-to-r from-[#1976d2] to-[#64b5f6] text-white hover:from-[#1565c0] hover:to-[#42a5f5]'
                }
              `}
              onClick={toggleExpandAllNodes}
            >
              {expandedNodes.size > 0 ? (
                <>
                  <FaCompressAlt className="w-3.5 h-3.5" />
                  <span>Collapse All</span>
                </>
              ) : (
                <>
                  <FaExpandAlt className="w-3.5 h-3.5" />
                  <span>Expand All</span>
                </>
              )}
            </button>
            
            <button
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#2a2a35] border border-[#3a3a45] text-[#e0e0e0] rounded hover:bg-[#3a3a45] hover:border-[#4a4a55] transition-colors"
              onClick={resetTree}
            >
              <FaRedo className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          
          <div className="text-xs text-[#888] px-2 py-1 bg-[#2a2a35] rounded">
            {expandedNodes.size > 0 ? `${expandedNodes.size} nodes expanded` : 'All collapsed'}
          </div>
        </div>

        {/* Tree Content */}
        <div className="border border-[#2a2a2a] rounded-lg overflow-hidden bg-[#1a1a1f]">
          {/* Tree Header */}
          <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#202025]">
            <div className="grid grid-cols-12 text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">
              <div className="col-span-4 flex items-center gap-2">
                <span>Route Path</span>
              </div>
              <div className="col-span-2 text-center">Type</div>
              <div className="col-span-3 text-center">Full Path</div>
              <div className="col-span-2 text-center">Roles</div>
              <div className="col-span-1 text-center">Status</div>
            </div>
          </div>
          
          {/* Tree Nodes */}
          <div className="p-4">
            {graph.length === 0 ? (
              <div className="text-center py-8 text-[#888]">
                No routes available
              </div>
            ) : (
              <div className="space-y-2">
                {graph.map((node) => (
                  <List
                    key={node.id}
                    node={node}
                    depth={0}
                    selectedNodeId={selectedNode?.id}
                    expandedNodes={expandedNodes}
                    onSelect={handleNodeSelect}
                    onToggleExpand={handleToggleExpand}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-3 text-xs text-[#666] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>• Click nodes to select</span>
            <span>• Click arrow to expand/collapse</span>
            <span>• Double-click for details</span>
          </div>
          <span className="text-[#888]">{selectedNode ? `Selected: ${selectedNode.path}` : 'No node selected'}</span>
        </div>
      </div>
    </div>
  );
};