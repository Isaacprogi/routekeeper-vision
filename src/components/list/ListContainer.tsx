import { FaGlobe, FaLock, FaBolt} from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import type { VisualRouteNode, RouteConfig } from "../../../utils/type";
import { buildRouteGraph } from "../buildGraphRoute";
import { List } from "./List";
import { FaExpandAlt, FaCompressAlt, FaRedo, FaTree } from "react-icons/fa";
import { LuRedo2 } from "react-icons/lu";


type Props = {
  routes: RouteConfig[];
  selectedNode: VisualRouteNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<VisualRouteNode | null>>;
};

const EXPANDED_NODES_KEY = "routekeeper_expanded_nodes";

export const ListContainer: React.FC<Props> = ({
  routes,
  selectedNode,
  setSelectedNode,
}) => {
  const [graph, setGraph] = useState<VisualRouteNode[]>(() =>
    buildRouteGraph(routes)
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(EXPANDED_NODES_KEY);
    if (saved) {
      try {
        const nodes = JSON.parse(saved);
        return new Set(nodes);
      } catch (e) {
         if (import.meta.env.MODE === "development") {
           console.warn("Failed to parse expanded nodes from localStorage:", e);
        }   
      }
    }
    return new Set();
  });

  useEffect(() => {
    setGraph(buildRouteGraph(routes));
  }, [routes]);

  useEffect(() => {
    try {
      localStorage.setItem(
        EXPANDED_NODES_KEY,
        JSON.stringify(Array.from(expandedNodes))
      );
    } catch (e) {
      console.warn("Failed to save expanded nodes to localStorage:", e);
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
      <div className="rk-flex rk-flex-col rk-items-center rk-justify-center rk-p-8 rk-text-center rk-border rk-border-[#2a2a2a] rk-rounded-lg rk-bg-[#1a1a1f]">
        <FaTree className="rk-w-12 rk-h-12 rk-text-[#888] rk-mb-3" />
        <p className="rk-text-sm rk-text-[#888] rk-mb-1">No routes to display</p>
        <p className="rk-text-xs rk-text-[#666]">
          Add routes to see the visualization
        </p>
      </div>
    );
  }

  return (
    <div className="rk-bg-[#1a1a1f] rk-min-h-screen">
      <div className="rk-max-w-[95%] rk-mx-auto rk-py-4">

<div className="rk-grid rk-grid-cols-2 sm:rk-grid-cols-4 rk-gap-3 rk-mb-4">
  {[
    {
      icon: FaGlobe,
      label: "Public",
      count: graph.filter((n) => n.type === "public").length,
      color: "#4caf50",
      bg: "rk-bg-[#4caf50]/10",
      border: "rk-border-[#4caf50]/30"
    },
    {
      icon: FaLock,
      label: "Private",
      count: graph.filter((n) => n.type === "private").length,
      color: "#ef5350",
      bg: "rk-bg-[#ef5350]/10",
      border: "rk-border-[#ef5350]/30"
    },
    {
      icon: FaBolt,
      label: "Lazy",
      count: graph.filter((n) => n.lazy).length,
      color: "#ffc107",
      bg: "rk-bg-[#ffc107]/10",
      border: "rk-border-[#ffc107]/30"
    },
    {
      icon: LuRedo2,
      label: "Redirect",
      count: graph.filter((n) => n.redirectTo).length,
      color: "#9c27b0",
      bg: "rk-bg-[#9c27b0]/10",
      border: "rk-border-[#9c27b0]/30"
    }
  ].map((stat) => (
    <div 
      key={stat.label} 
      className={`rk-border rk-rounded-lg rk-p-3 ${stat.bg} rk-border rk-border-[#2a2a2a]`}
    >
      <div className="rk-flex rk-items-center rk-gap-3">
        <div className={`rk-p-2 rk-rounded ${stat.bg.replace('/10', '/20')} rk-border rk-border-[#2a2a2a]`}>
          <stat.icon className="rk-w-4 rk-h-4" style={{ color: stat.color }} />
        </div>
        <div className="rk-flex rk-items-center rk-gap-2">
          <div className="rk-text-xl rk-font-bold rk-text-[#e0e0e0]">{stat.count}</div>
          <div className="rk-text-xs rk-text-[#a0a0a0] rk-mt-0.5">{stat.label}</div>
        </div>
      </div>
    </div>
  ))}
</div>
          {/* Tree Stats */}
         

        {/* Controls */}
        <div className="rk-flex rk-flex-wrap rk-gap-3 rk-items-center rk-justify-between rk-mb-4 rk-p-3 rk-border rk-border-[#2a2a2a] rk-rounded-lg rk-bg-[#202025]">
          <div className="rk-flex rk-items-center rk-gap-2">
            <button
              className={`
                rk-flex rk-items-center rk-gap-2 rk-px-3 rk-py-2 rk-text-sm rk-font-medium rk-rounded rk-transition-all rk-duration-200
                ${
                  expandedNodes.size > 0
                    ? "rk-bg-[#2a2a35] rk-text-[#e0e0e0] rk-border rk-border-[#3a3a45] hover:rk-bg-[#3a3a45]"
                    : "rk-bg-gradient-to-r rk-from-[#1976d2] rk-to-[#64b5f6] rk-text-white hover:rk-from-[#1565c0] hover:rk-to-[#42a5f5]"
                }
              `}
              onClick={toggleExpandAllNodes}
            >
              {expandedNodes.size > 0 ? (
                <>
                  <FaCompressAlt className="rk-w-3.5 rk-h-3.5" />
                  <span>Collapse All</span>
                </>
              ) : (
                <>
                  <FaExpandAlt className="rk-w-3.5 rk-h-3.5" />
                  <span>Expand All</span>
                </>
              )}
            </button>

            <button
              className="rk-flex rk-items-center rk-gap-2 rk-px-3 rk-py-2 rk-text-sm rk-font-medium rk-bg-[#2a2a35] rk-border rk-border-[#3a3a45] rk-text-[#e0e0e0] rk-rounded hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] rk-transition-colors"
              onClick={resetTree}
            >
              <FaRedo className="rk-w-3.5 rk-h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="rk-text-xs rk-text-[#888] rk-px-2 rk-py-1 rk-bg-[#2a2a35] rk-rounded">
            {expandedNodes.size > 0
              ? `${expandedNodes.size} nodes expanded`
              : "All collapsed"}
          </div>
        </div>

        {/* Tree Content */}
        <div className="rk-border rk-border-[#2a2a2a] rk-rounded-lg rk-overflow-hidden rk-bg-[#1a1a1f]">
          {/* Tree Header */}
          <div className="rk-px-4 rk-py-3 rk-border-b rk-border-[#2a2a2a] rk-bg-[#202025]">
            <div className="rk-flex rk-items-center rk-justify-between rk-text-xs rk-font-medium rk-text-[#a0a0a0] rk-uppercase rk-tracking-wider">
              <div className="rk-flex rk-items-center rk-gap-3">
                <span className="rk-px-2 rk-py-1 rk-text-xs rk-font-medium rk-bg-[#2a2a35] rk-text-[#888] rk-rounded">
                  {totalNodes} nodes
                </span>
              </div>

              <div className="rk-flex rk-items-center rk-gap-2">
                <span className="rk-text-xs rk-text-[#888] rk-px-2 rk-py-1 rk-bg-[#2a2a35] rk-rounded">
                  {routes.length} root routes
                </span>
              </div>
            </div>
          </div>

          {/* Tree Nodes */}
          <div className="rk-p-4">
            {graph.length === 0 ? (
              <div className="rk-text-center rk-py-8 rk-text-[#888]">
                No routes available
              </div>
            ) : (
              <div className="rk-space-y-2">
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
        <div className="rk-mt-3 rk-text-xs rk-text-[#666] rk-flex rk-items-center rk-justify-between">
          <div className="rk-flex rk-items-center rk-gap-3">
            <span>• Click nodes to select</span>
            <span>• Click arrow to expand/collapse</span>
          </div>
          <span className="rk-text-[#888]">
            {selectedNode
              ? `Selected: ${selectedNode.path}`
              : "No node selected"}
          </span>
        </div>
      </div>
    </div>
  );
};