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
    <div> {/* This creates gap between routes */}
      <div
        className={`
          rk-cursor-pointer rk-transition-all rk-duration-200
          rk-bg-[#25252d] rk-border rk-border-transparent
          ${isSelected 
            ? 'rk-bg-[#2d2d35] rk-border-[#4a4a55] rk-shadow-[0_0_0_1px_#4a4a55]' 
            : 'hover:rk-bg-[#2d2d35] hover:rk-border-[#3a3a45]'
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
        <div className="rk-flex rk-items-center rk-gap-2">
          <div 
            className="
              rk-w-5 rk-h-5 rk-flex rk-items-center rk-justify-center 
              rk-cursor-pointer rk-text-[#888] rk-select-none
            "
            onClick={handleToggleExpand}
          >
            {hasChildren ? (
              <span className="rk-text-[10px] rk-transition-transform rk-duration-200">
                {isExpanded ? '▼' : '▶'}
              </span>
            ) : (
              <span className="rk-text-xs rk-text-[#555]">•</span>
            )}
          </div>
          
          <div className="rk-flex-1">
            <div className="rk-flex rk-justify-between rk-items-center rk-mb-1">
              <span className="rk-font-semibold rk-text-white">
                {node.index ? (
                  <span className="rk-text-[#64b5f6] rk-italic">Index Route</span>
                ) : (
                  <span className="rk-text-white">{node.path || '/'}</span>
                )}
              </span>
              
              <div className="rk-flex rk-gap-[6px] rk-items-center">
                <span className={`
                  rk-px-2 rk-py-0.5 rk-rounded-full rk-text-[11px] rk-font-semibold rk-uppercase rk-tracking-[0.5px]
                  rk-border
                  ${node.type === 'private' 
                    ? 'rk-bg-[rgba(239,83,80,0.15)] rk-text-[#ef5350] rk-border-[rgba(239,83,80,0.3)]' 
                    : node.type === 'public'
                    ? 'rk-bg-[rgba(76,175,80,0.15)] rk-text-[#4caf50] rk-border-[rgba(76,175,80,0.3)]'
                    : 'rk-bg-[rgba(158,158,158,0.15)] rk-text-[#9e9e9e] rk-border-[rgba(158,158,158,0.3)]'
                  }
                `}>
                  {node.type}
                </span>
                
                {node.lazy && (
                  <span 
                    className="
                      rk-px-[6px] rk-py-0.5 rk-rounded-[10px] rk-text-[11px] 
                      rk-bg-[rgba(255,193,7,0.15)] rk-text-[#ffc107]
                    "
                    title="Lazy loaded"
                  >
                    ⚡
                  </span>
                )}
                
                {node.redirectTo && (
                  <span 
                    className="
                      rk-px-[6px] rk-py-0.5 rk-rounded-[10px] rk-text-[11px]
                      rk-bg-[rgba(156,39,176,0.15)] rk-text-[#9c27b0]
                    "
                    title={`Redirects to: ${node.redirectTo}`}
                  >
                    ↪
                  </span>
                )}
                
                {hasChildren && (
                  <span className="
                    rk-px-[6px] rk-py-0.5 rk-rounded-[10px] rk-text-[11px]
                    rk-bg-[rgba(33,150,243,0.15)] rk-text-[#2196f3]
                  ">
                    {node.children.length} child{node.children.length !== 1 ? 'ren' : ''}
                  </span>
                )}
              </div>
            </div>
            
            <div className="rk-flex rk-items-center rk-gap-3 rk-text-xs rk-text-[#888]">
              <span 
                className="rk-font-['Monaco','Menlo',monospace] rk-text-[#a0a0a0]"
                title="Full path"
              >
                {node.fullPath}
              </span>
              {node.inheritedRoles.length > 0 && (
                <span 
                  className="rk-text-[#64b5f6]"
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
            rk-mt-2
            rk-border-l rk-border-dashed rk-border-[#3a3a45]
            rk-flex rk-gap-2
            
          "
          style={{ marginLeft: `${depth * 20 + 20}px` }}>
          <div className="rk-h-full rk-w-2">
            
          </div>

          <div className="rk-flex-1 rk-flex rk-flex-col rk-gap-2" 
          
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