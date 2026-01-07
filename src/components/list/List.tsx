import React from "react";
import type { VisualRouteNode } from "../../../utils/type";

type Props = {
  node: VisualRouteNode;
  depth: number;
  selectedNodeId?: string | null;
  expandedNodes: Set<string>;
  onSelect: (node: VisualRouteNode) => void;
  onToggleExpand: (nodeId: string) => void;
};

export const List: React.FC<Props> = ({
  node,
  depth,
  selectedNodeId,
  expandedNodes,
  onSelect,
  onToggleExpand,
}) => {
  const isSelected = selectedNodeId === node.id;
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  };

  return (
    <div > {/* This creates gap between routes */}
      <div
        className={`
          cursor-pointer transition-all duration-200
          bg-[#25252d] border border-transparent
          ${isSelected 
            ? 'bg-[#2d2d35] border-[#4a4a55] shadow-[0_0_0_1px_#4a4a55]' 
            : 'hover:bg-[#2d2d35] hover:border-[#3a3a45]'
          }
        `}
        style={{
          paddingLeft: `${depth * 20 + 12}px`,
          paddingRight: '12px',
          paddingTop: '10px',
          paddingBottom: '10px',
          borderRadius: '6px'
        }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          <div 
            className="
              w-5 h-5 flex items-center justify-center 
              cursor-pointer text-[#888] select-none
            "
            onClick={handleToggleExpand}
          >
            {hasChildren ? (
              <span className="text-[10px] transition-transform duration-200">
                {isExpanded ? '▼' : '▶'}
              </span>
            ) : (
              <span className="text-xs text-[#555]">•</span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-white">
                {node.index ? (
                  <span className="text-[#64b5f6] italic">Index Route</span>
                ) : (
                  <span className="text-white">{node.path || '/'}</span>
                )}
              </span>
              
              <div className="flex gap-[6px] items-center">
                <span className={`
                  px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.5px]
                  border
                  ${node.type === 'private' 
                    ? 'bg-[rgba(239,83,80,0.15)] text-[#ef5350] border-[rgba(239,83,80,0.3)]' 
                    : node.type === 'public'
                    ? 'bg-[rgba(76,175,80,0.15)] text-[#4caf50] border-[rgba(76,175,80,0.3)]'
                    : 'bg-[rgba(158,158,158,0.15)] text-[#9e9e9e] border-[rgba(158,158,158,0.3)]'
                  }
                `}>
                  {node.type}
                </span>
                
                {node.lazy && (
                  <span 
                    className="
                      px-[6px] py-0.5 rounded-[10px] text-[11px] 
                      bg-[rgba(255,193,7,0.15)] text-[#ffc107]
                    "
                    title="Lazy loaded"
                  >
                    ⚡
                  </span>
                )}
                
                {node.redirectTo && (
                  <span 
                    className="
                      px-[6px] py-0.5 rounded-[10px] text-[11px]
                      bg-[rgba(156,39,176,0.15)] text-[#9c27b0]
                    "
                    title={`Redirects to: ${node.redirectTo}`}
                  >
                    ↪
                  </span>
                )}
                
                {hasChildren && (
                  <span className="
                    px-[6px] py-0.5 rounded-[10px] text-[11px]
                    bg-[rgba(33,150,243,0.15)] text-[#2196f3]
                  ">
                    {node.children.length} child{node.children.length !== 1 ? 'ren' : ''}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-[#888]">
              <span 
                className="font-['Monaco','Menlo',monospace] text-[#a0a0a0]"
                title="Full path"
              >
                {node.fullPath}
              </span>
              {node.inheritedRoles.length > 0 && (
                <span 
                  className="text-[#64b5f6]"
                  title="Allowed roles"
                >
                  👥 {node.inheritedRoles.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children container - EXACTLY like original CSS */}
      {isExpanded && hasChildren && (
        <div className="
            mt-2
            border-l border-dashed border-[#3a3a45]
            flex gap-2
            
          "
          style={{ marginLeft: `${depth * 20 + 20}px` }}>
          <div className="h-full w-2">
            
          </div>

          <div className="flex-1 flex flex-col gap-2" 
          
        >
          {node.children.map((child:any) => (
            <List
              key={child.id}
              node={child}
              depth={0} // Reset depth for children since they're already indented
              selectedNodeId={selectedNodeId}
              expandedNodes={expandedNodes}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
          
        </div>
      )}
    </div>
  );
};